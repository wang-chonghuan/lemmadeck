"""Freeze offline author evidence; no native pipeline stages or approval."""
import hashlib
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path.cwd().resolve()
EVIDENCE = Path(__file__).resolve().parent
WORK = REPO / ".tmp/STEMROBIN-181/d1816-d331/source-work"
ROOT = REPO / ".tmp/STEMROBIN-181/d1816-d331/root"
PAGES = (389, 390, 391)
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks as B


def sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def record(path):
    return {"path": str(path), "sha256": sha(path), "bytes": path.stat().st_size}


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_new(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    path.chmod(0o444)
    return record(path)


def snapshot(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    assert not destination.exists(), destination
    shutil.copyfile(source, destination)
    destination.chmod(0o444)
    assert sha(source) == sha(destination)
    return {"working": record(source), "immutable": record(destination)}


def inventory_freeze():
    assert not (EVIDENCE / "inventory-freeze.json").exists()
    for page in PAGES:
        assert not (ROOT / "10p/pages" / f"{page:04d}" / "page.md").exists()
    inventory_records = []
    for page in PAGES:
        path = EVIDENCE / f"inventory-{page:04d}.json"
        data = read(path)
        assert data["physical_page"] == page
        assert [row["row"] for row in data["rows"]] == list(range(1, 27))
        assert data["observed_counts"]["total_printed_rows"] == 26
        assert not data["holds"]
        inventory_records.append(snapshot(path, EVIDENCE / "snapshots/inventories" / path.name))
        path.chmod(0o444)
    prepared = [record(path) for path in sorted(WORK.rglob("*")) if path.is_file()]
    for item in prepared:
        Path(item["path"]).chmod(0o444)
    pdf = REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf"
    sources = [
        record(pdf),
        record(REPO / "ssot-resources/soviet10year-textbooks/sources/manifest.json"),
        record(REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"),
        record(REPO / ".claude/skills/ld-s10y-lesson/tools/production.py"),
        record(REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
        record(REPO / ".claude/skills/ld-s10y-lesson/tools/layout.py"),
        record(REPO / ".claude/skills/ld-s10y-lesson/tools/blocks.py"),
        record(REPO / ".tmp/STEMROBIN-181/d1816-d319/root/10p/pages/0388/page.md"),
    ]
    receipt = read(EVIDENCE / "prepare-receipt.json")
    assert receipt["exitCode"] == 0 and receipt["invocations"] == 1
    usage = read(EVIDENCE / "image-usage.json")
    assert usage["actual_opens"] == 6 <= usage["limit"]
    data = {
        "schema": "stemrobin181/source-inventory-freeze@1",
        "author": "D331", "ticket": "STEMROBIN-181", "book": "10p",
        "physical_pages": list(PAGES), "frozen_utc": datetime.now(timezone.utc).isoformat(),
        "candidate_text_absent_at_freeze": True,
        "original_only_inventories": inventory_records,
        "original_and_prepared_inputs": prepared,
        "source_and_tool_references": sources,
        "prepare_receipt": record(EVIDENCE / "prepare-receipt.json"),
        "prepare_stdout": record(EVIDENCE / "prepare.stdout"),
        "prepare_stderr": record(EVIDENCE / "prepare.stderr"),
        "image_usage": record(EVIDENCE / "image-usage.json"),
        "source_approval": False,
    }
    result = save_new(EVIDENCE / "inventory-freeze.json", data)
    print(json.dumps(result))


def author_freeze():
    assert not (EVIDENCE / "author-freeze.json").exists()
    frozen = read(EVIDENCE / "inventory-freeze.json")
    bound = frozen["original_and_prepared_inputs"] + frozen["source_and_tool_references"]
    bound += [frozen[key] for key in ("prepare_receipt", "prepare_stdout", "prepare_stderr", "image_usage")]
    for item in bound:
        assert sha(Path(item["path"])) == item["sha256"], item["path"]
    pages = []
    for page in PAGES:
        inventory = EVIDENCE / "snapshots/inventories" / f"inventory-{page:04d}.json"
        initial = next(item for item in frozen["original_only_inventories"]
                       if Path(item["immutable"]["path"]) == inventory)
        assert sha(inventory) == initial["immutable"]["sha256"]
        observed = read(inventory)
        draft = ROOT / "10p/pages" / f"{page:04d}" / "page.md"
        meta, blocks = B.load(draft)
        prepared_dir = WORK / "10p/pages" / f"{page:04d}"
        template_meta, _ = B.load(prepared_dir / "page.template.md")
        assert meta["book"] == "10p" and meta["page"] == page
        for key in ("source", "render", "profile"):
            assert meta[key] == template_meta[key], (page, key)
        assert meta["printed_page"] == observed["printed_page_observed"]
        actual = B.printed_lines(blocks)
        expected = observed["observed_counts"]["total_printed_rows"]
        assert actual == expected == 26, (page, actual, expected)
        assert blocks[0]["kind"] == "p" and blocks[0]["cont"]
        assert blocks[-2]["kind"] == "p" and blocks[-2]["open"]
        assert blocks[-1]["kind"] == "foot"
        assert not any(block["kind"] in ("fig", "ex", "exhead", "h1", "h2", "h3") for block in blocks)
        assert not meta.get("provenance", {}).get("normalized", False)
        layout = read(prepared_dir / "layout.json")
        snapshots = snapshot(draft, EVIDENCE / "snapshots/drafts" / f"{page:04d}/page.md")
        pages.append({
            "physical_page": page, "printed_page": meta["printed_page"],
            "original": record(prepared_dir / "page.png"),
            "inventory": record(inventory), "draft": snapshots,
            "observed_rows": expected, "candidate_rows": actual,
            "prepared_raw_line_band_count": len(layout["line_bands"]),
            "block_rows": [len(block["lines"]) for block in blocks],
            "blocks": [{"kind": block["kind"], "cont": block["cont"], "open": block["open"],
                        "rows": len(block["lines"])} for block in blocks],
            "boundaries": observed["boundaries"], "glyph_holds": observed["holds"],
        })
    usage = read(EVIDENCE / "image-usage.json")
    report = {
        "schema": "stemrobin181/bounded-source-author-report@1",
        "author": "D331", "ticket": "STEMROBIN-181", "book": "10p",
        "status": "author-drafts-frozen-unreviewed-parent-native-lane-required",
        "finished_utc": datetime.now(timezone.utc).isoformat(),
        "prepare": read(EVIDENCE / "prepare-receipt.json"),
        "prepare_result": read(EVIDENCE / "prepare.stdout"),
        "inventory_freeze": record(EVIDENCE / "inventory-freeze.json"),
        "pages": pages,
        "checks": {
            "frozen_input_hashes_unchanged": True,
            "original_only_inventories_precede_candidates": True,
            "one_physical_row_per_candidate_line": True,
            "independent_observed_rows_match_candidate_rows": True,
            "cross_page_open_cont_markers_present": True,
            "standalone_headings": [], "actual_exercises": [], "tables": [], "figures": [],
            "unresolved_glyphs_or_punctuation": [],
            "native_finalize_run": False, "source_approval": False,
        },
        "open_object": {"lesson": "N151", "last_physical_page": 391,
                        "last_text": "微粒性与波", "next_physical_page": 392,
                        "next_page_read": False, "complete_lesson_claimed": False},
        "usage": {
            **usage, "prepare_range_invocations": 1, "page_prepare_commands": 3,
            "prepare_retries": 0, "candidate_author_rounds": 1,
            "content_revisions_after_candidate_freeze": 0,
            "finalize": 0, "vectorize": 0, "assemble": 0,
            "db_calls": 0, "publisher_calls": 0, "paid_model_calls": 0,
            "deploy_calls": 0, "merge_calls": 0, "closure_calls": 0,
            "backend_calls": 0, "freshness_calls": 0, "chat_calls": 0,
            "nested_agents": 0, "author_invoked_git_commands": 0,
            "source_increment": 0, "course_increment": 0, "source_approvals": 0,
        },
        "parent_followup": "Native finalize/vectorize/assemble and independent source review remain parent-owned. These candidates do not approve source or advance source/course counters.",
    }
    report_record = save_new(EVIDENCE / "report.json", report)
    freeze_record = save_new(EVIDENCE / "author-freeze.json", {
        "schema": "stemrobin181/bounded-source-author-freeze@1",
        "author": "D331", "ticket": "STEMROBIN-181", "book": "10p",
        "physical_pages": list(PAGES),
        "frozen_utc": datetime.now(timezone.utc).isoformat(),
        "status": "immutable-unreviewed-author-snapshots",
        "report": report_record,
        "inventory_freeze": record(EVIDENCE / "inventory-freeze.json"),
        "original_and_prepared_inputs": frozen["original_and_prepared_inputs"],
        "source_and_tool_references": frozen["source_and_tool_references"],
        "inventory_snapshots": [item["immutable"] for item in frozen["original_only_inventories"]],
        "draft_snapshots": [page["draft"] for page in pages],
        "working_drafts_remain_editable": True,
        "immutable_snapshots_read_only": True,
        "source_approval": False, "source_increment": 0, "course_increment": 0,
        "image_usage": record(EVIDENCE / "image-usage.json"),
    })
    print(json.dumps({"report": report_record, "author_freeze": freeze_record,
                      "drafts": [page["draft"]["working"] for page in pages],
                      "image_opens": usage["actual_opens"],
                      "row_counts": [page["candidate_rows"] for page in pages]}))


if sys.argv[1] == "freeze-inventories":
    inventory_freeze()
elif sys.argv[1] == "freeze-author":
    author_freeze()
else:
    raise SystemExit("Expected freeze-inventories or freeze-author")
