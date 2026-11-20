"""One author-only parser/hash check and immutable snapshots; no native stages."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import sys
import time


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
EVIDENCE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d360-source395-397-first-author"
OWN = REPO / ".tmp/STEMROBIN-181/d1816-d360"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B


def sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ref(path):
    return {
        "path": str(path), "sha256": sha(path), "bytes": path.stat().st_size,
        "mode": f"{stat.S_IMODE(path.stat().st_mode):04o}",
    }


def save_once(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    path.chmod(0o444)
    return ref(path)


def own_only(path):
    resolved = path.resolve()
    if not (resolved.is_relative_to(OWN / "root")
            or resolved.is_relative_to(OWN / "source-work")
            or resolved.is_relative_to(EVIDENCE)):
        raise RuntimeError(f"write outside authorized ownership: {path}")


def frozen_ref(path):
    own_only(path)
    path.chmod(0o444)
    return ref(path)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def check():
    if Path.cwd().resolve() != REPO:
        raise RuntimeError("cwd must equal authorized checkout root")
    inventory_paths = [EVIDENCE / f"inventory-{page:04d}.json" for page in range(395, 398)]
    inventories = {page: load(path) for page, path in zip(range(395, 398), inventory_paths)}
    supplement = load(EVIDENCE / "inventory-supplement.json")
    ledger = load(EVIDENCE / "image-ledger.json")
    prepare = load(EVIDENCE / "prepare-call.json")
    preparation_result = load(EVIDENCE / "prepare-range.stdout")
    assert prepare["status"] == "succeeded" and prepare["returncode"] == 0
    assert prepare["attempt"] == 1
    assert preparation_result["ok"] is True
    assert [entry["page"] for entry in preparation_result["pages"]] == [395, 396, 397]
    assert all(entry["status"] == "prepared" for entry in preparation_result["pages"])
    assert sha(Path(prepare["stdout"])) == prepare["stdout_sha256"]
    assert sha(Path(prepare["stderr"])) == prepare["stderr_sha256"]
    assert sha(Path(prepare["command"][1])) == prepare["tool_sha256"]
    assert sha(EVIDENCE / "prepare_once.py") == prepare["wrapper_sha256"]
    assert ledger["closed"] is True and ledger["actual_image_opens"] == 8
    assert len(ledger["entries"]) == 8
    assert [entry["sequence"] for entry in ledger["entries"]] == list(range(1, 9))
    assert sum(entry["kind"] == "original" for entry in ledger["entries"]) == 3
    assert sum(entry["kind"] == "targeted crop" for entry in ledger["entries"]) == 5
    assert ledger["prior_context_image_opens"] + ledger["actual_image_opens"] <= ledger["context_cap"]
    assert ledger["actual_image_opens"] <= ledger["batch_cap"]
    assert ledger["further_image_opens_authorized_in_this_batch"] == 0
    for entry in ledger["entries"]:
        assert sha(Path(entry["path"])) == entry["sha256"]
        if "parent_sha256" in entry:
            parent = OWN / "source-work/10p/pages" / f"{entry['source_page']:04d}/page.png"
            assert sha(parent) == entry["parent_sha256"]
    for receipt_name in ("crop-receipt.json", "crop-remaining-receipt.json"):
        for crop in load(EVIDENCE / receipt_name)["entries"]:
            assert sha(Path(crop["source"])) == crop["source_sha256"]
            assert sha(Path(crop["output"])) == crop["output_sha256"]
            matching = [entry for entry in ledger["entries"] if entry["path"] == crop["output"]]
            assert len(matching) == 1 and matching[0]["box_xyxy"] == crop["box_xyxy"]
    for path in inventory_paths + [EVIDENCE / "inventory-supplement.json", EVIDENCE / "image-ledger.json"]:
        assert stat.S_IMODE(path.stat().st_mode) == 0o444

    manifest_path = REPO / "ssot-resources/soviet10year-textbooks/sources/manifest.json"
    manifest = load(manifest_path)
    pdf_entry = next(entry for entry in manifest["pdfs"] if entry["book"] == "10p")
    pdf = REPO / manifest["pdfRoot"] / pdf_entry["file"]
    pdf_sha = sha(pdf)
    assert pdf_sha == pdf_entry["sha256"] == "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40"
    profile = REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile_sha = sha(profile)
    assert profile_sha == "54c02ea7d234571bd2d87c14289640701d1aa7ada4c3aed67403cec26680cddc"

    result_pages = []
    for page in range(395, 398):
        inv = inventories[page]
        draft = OWN / "root/10p/pages" / f"{page:04d}/page.md"
        prepared = OWN / "source-work/10p/pages" / f"{page:04d}"
        meta, blocks = B.parse(draft.read_text(encoding="utf-8"))
        template, _ = B.parse((prepared / "page.template.md").read_text(encoding="utf-8"))
        layout = load(prepared / "layout.json")
        assert meta["schema"] == "ld-s10y-lesson/page@3"
        assert meta["book"] == "10p" and meta["page"] == page
        assert meta["printed_page"] == inv["printed_page_visible"] == page - 10
        assert meta["source"] == template["source"]
        assert meta["source"]["pdf_sha256"] == pdf_sha and meta["source"]["pdf_page"] == page
        assert meta["render"] == template["render"]
        assert sha(prepared / "page.png") == meta["render"]["sha256"] == inv["image_sha256"]
        assert (layout["w"], layout["h"]) == (meta["render"]["w"], meta["render"]["h"])
        assert meta["profile"] == template["profile"]
        assert meta["profile"]["sha256"] == profile_sha
        assert meta["errata"] == [] and meta["figures"] == []
        assert meta["provenance"]["source_approval"] is False
        assert meta["provenance"]["review_performed"] is False
        assert meta["provenance"]["normalized"] is False
        assert B.printed_lines(blocks) == meta["printed_lines"] == inv["visible_rows"]["total"]
        assert all(block["kind"] != "fig" for block in blocks)
        assert blocks[-1]["kind"] == "foot" and len(blocks[-1]["lines"]) == 1
        assert blocks[-1]["lines"][0] == f"• ${page - 10}$ •"
        expected = []
        if page < 397:
            for paragraph in inv["paragraphs"]:
                expected.append(("p", None, paragraph["rows"][1] - paragraph["rows"][0] + 1,
                                 paragraph["cont"], paragraph["open"]))
            if page == 396:
                expected.append(("p", "footnote", 3, False, False))
        else:
            expected.append(("exhead", None, 1, False, False))
            for exercise in inv["exercises"]:
                expected.append(("ex", str(exercise["printed_number"]),
                                 exercise["rows"][1] - exercise["rows"][0] + 1,
                                 False, exercise["open"]))
        expected.append(("foot", None, 1, False, False))
        actual = [(block["kind"], block["label"], len(block["lines"]),
                   block["cont"], block["open"]) for block in blocks]
        assert actual == expected, (page, actual, expected)
        assert all(not block["samerow"] for block in blocks)
        expected_holds = supplement[f"source{page}"].get("holds", [])
        assert [hold["id"] for hold in meta["holds"]] == [hold["id"] for hold in expected_holds]
        for hold in meta["holds"]:
            index = int(hold["block"].split("#")[1]) - 1
            block = blocks[index]
            assert hold["status"] == "HOLD"
            assert hold["evidence_sha256"] in {entry["sha256"] for entry in ledger["entries"]}
            if hold["placeholder"]:
                assert B.text_of(block).count(hold["placeholder"]) == 1
                assert hold["placeholder"] in block["lines"][hold["line"] - 1]
            else:
                assert all("[HOLD:" not in line for line in block["lines"])
        if page == 395:
            assert blocks[0]["lines"] == ["意义的."]
            assert blocks[-2]["open"] and blocks[-2]["lines"][-1].endswith("改变现")
        elif page == 396:
            assert blocks[0]["lines"] == ["代生产的工艺."]
            assert blocks[4]["lines"][-1].endswith("实现.")
            assert blocks[5]["label"] == "footnote"
            assert blocks[2]["lines"][1].count("①") == 1
            assert blocks[5]["lines"][0].startswith("① ")
        else:
            assert blocks[0]["lines"] == ["复 习 题"]
            assert "\n\n当两矢径" in draft.read_text(encoding="utf-8")
            assert blocks[-2]["kind"] == "ex" and blocks[-2]["label"] == "12"
            assert blocks[-2]["open"] and blocks[-2]["lines"][-1].endswith("电")
        assert stat.S_IMODE(draft.stat().st_mode) == 0o644
        result_pages.append({
            "source_page": page, "printed_page": meta["printed_page"],
            "printed_rows_from_frozen_inventory": inv["visible_rows"]["total"],
            "parser_printed_rows": B.printed_lines(blocks),
            "block_signature": actual,
            "holds": meta["holds"],
            "draft": ref(draft),
            "prepared_inputs": [ref(prepared / name) for name in
                                ("page.png", "page.grid.png", "layout.json", "page.template.md",
                                 "prepare.0001.stdout", "prepare.0001.stderr")],
        })
    prior = Path(supplement["prior_source394"]["path"])
    assert sha(prior) == supplement["prior_source394"]["sha256_at_text_read"]
    prior_meta, prior_blocks = B.parse(prior.read_text(encoding="utf-8"))
    assert any(hold["id"] == "p0394-r07-punctuation" and hold["status"] == "HOLD"
               for hold in prior_meta["holds"])
    assert prior_blocks[-2]["open"] and prior_blocks[-2]["lines"][-1].endswith("具有一定")
    inputs = {
        "original_pdf": ref(pdf), "source_manifest": ref(manifest_path), "source_profile": ref(profile),
        "continuity_text_only": ref(prior),
        "consumed_contracts": [
            ref(REPO / path) for path in (
                ".intentfold/readme.md", ".intentfold/charter/product.md",
                ".intentfold/charter/engineering.md", ".intentfold/charter/operations.md",
                ".claude/skills/ld-s10y-lesson/SKILL.md",
                ".claude/skills/ld-s10y-lesson/references/production-resume.md",
                ".agents/skills/ld-s10y-image/SKILL.md",
            )
        ],
        "tools": [ref(TOOLS / name) for name in ("production.py", "p2c.py", "blocks.py", "layout.py")],
        "runtime": {"executable": sys.executable, "resolved_executable": str(Path(sys.executable).resolve()),
                    "version": sys.version, "bytecode_writes_disabled": bool(os.environ.get("PYTHONDONTWRITEBYTECODE"))},
    }
    return result_pages, inputs


def main():
    started = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    guard = EVIDENCE / "structural-check.started.json"
    if guard.exists():
        raise RuntimeError("The one local structural check has already been invoked; no repeat.")
    save_once(guard, {
        "schema": "STEMROBIN-181/author-structural-check-start@1",
        "started_at": started, "cwd": str(REPO), "attempt": 1,
        "script": ref(Path(__file__)),
        "scope": "Local page parser, exact input hashes and row/block/continuation structure only.",
    })
    try:
        pages, inputs = check()
    except Exception as error:
        save_once(EVIDENCE / "structural-check.json", {
            "schema": "STEMROBIN-181/author-structural-check@1",
            "status": "failed", "error": repr(error), "attempt": 1,
            "source_approval": False, "review_performed": False,
        })
        raise

    snapshots = []
    for page in pages:
        draft = Path(page["draft"]["path"])
        snapshot = EVIDENCE / "snapshots/10p/pages" / f"{page['source_page']:04d}/page.md"
        own_only(snapshot)
        snapshot.parent.mkdir(parents=True, exist_ok=True)
        if snapshot.exists():
            raise RuntimeError(f"snapshot already exists: {snapshot}")
        shutil.copyfile(draft, snapshot)
        page["snapshot"] = frozen_ref(snapshot)
        assert page["snapshot"]["sha256"] == page["draft"]["sha256"]
        snapshots.append(page["snapshot"])
        page["prepared_inputs"] = [frozen_ref(Path(item["path"])) for item in page["prepared_inputs"]]
    for path in (OWN / "source-work/crops").glob("*.png"):
        frozen_ref(path)
    evidence_before_reports = [
        frozen_ref(path) for path in sorted(EVIDENCE.iterdir()) if path.is_file()
        and path.name not in ("report.json", "author-freeze.json", "structural-check.json")
    ]
    check_ref = save_once(EVIDENCE / "structural-check.json", {
        "schema": "STEMROBIN-181/author-structural-check@1",
        "status": "passed", "attempt": 1,
        "scope": "Author-local parser/hash structure only; not pixel re-review, source approval or a native gate.",
        "started_at": started,
        "checks": ["Preparation receipt and stream hashes", "8-entry actual image ledger and exact crop hashes",
                   "Original PDF/profile/PNG/template identity", "Frozen independent row inventories",
                   "Block kinds/labels/row counts and open-cont boundaries", "Explicit HOLD bindings",
                   "SOURCE394 continuity text and existing HOLD unchanged", "Snapshot bytes equal editable draft bytes"],
        "page_rows": [{"source_page": page["source_page"], "rows": page["parser_printed_rows"]} for page in pages],
        "source_approval": False, "review_performed": False, "native_stages_executed": [],
    })
    usage = {
        "prepare_range_invocations": 1, "prepare_page_calls": 3, "prepare_failures": 0,
        "author_passes": 1, "editable_drafts": 3, "immutable_draft_snapshots": 3,
        "actual_image_opens": 8, "original_opens": 3, "targeted_crop_opens": 5,
        "reopens": 0, "prior_context_image_opens": 0, "actual_context_image_opens": 8,
        "batch_image_cap": 8, "context_image_cap": 24,
        "local_parser_hash_structural_checks": 1, "review_passes": 0,
        "finalize_calls": 0, "vectorize_calls": 0, "assemble_calls": 0,
        "adapt_calls": 0, "render_calls": 0, "native_downstream_calls": 0,
        "tests_or_builds": 0, "database_calls": 0, "backend_calls": 0, "publish_calls": 0,
        "paid_calls": 0, "purchases": 0, "new_subagents": 0, "thread_or_peer_messages": 0,
        "git_commits": 0, "git_pushes": 0, "promotions": 0,
        "setup_reruns": 0,
        "sourcePagesAdded": 0, "completeCoursesAdded": 0,
        "usage_scope": "This fresh bounded first-author context only; prior invocation gates inherited, not rerun.",
    }
    report_ref = save_once(EVIDENCE / "report.json", {
        "schema": "STEMROBIN-181/first-author-report@1",
        "ticket": "STEMROBIN-181", "author": "D360", "book": "10p",
        "source_pages": [395, 396, 397], "printed_pages": [385, 386, 387],
        "status": "FIRST_AUTHOR_FROZEN_WITH_SCOPED_HOLDS_AWAITING_PARENT",
        "author_work_finished_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "ownership": [str(OWN / "root"), str(OWN / "source-work"), str(EVIDENCE)],
        "input_bindings": inputs, "evidence_files": evidence_before_reports,
        "structural_check": check_ref, "pages": pages, "usage": usage,
        "sourcePagesAdded": 0, "completeCoursesAdded": 0,
        "source_approval": False, "review_performed": False, "course_count_approval": False,
        "holds": [hold for page in pages for hold in page["holds"]],
        "continuity": {
            "SOURCE394": "Read text only; exact hash still matches; 巨流 punctuation HOLD untouched and out of scope.",
            "SOURCE395_incoming": "p cont begins 意义的. after SOURCE394 具有一定.",
            "SOURCE395_outgoing": "p open ends 改变现.",
            "SOURCE396_incoming": "p cont begins 代生产的工艺.; prose ends closed, then marked footnote.",
            "SOURCE397_incoming": "Actual pixels show new exhead 复 习 题.",
            "SOURCE397_outgoing": "ex 12 open ends 电; SOURCE398 not read or added.",
        },
        "notes": [
            "All source text derives only from the original PDF renders; no web, OCR, substitute or errata fabrication.",
            "Initial inventories remain immutable. Pre-draft targeted observations live in inventory-supplement.json.",
            "Glyph-specific rectangles in the initial inventory supplement are approximate locators, not verified glyph boxes. Exact evidence is identified by source row/block/line/context and hash-bound crop boxes in the ledger; draft subscript HOLD uses the exact crop box.",
            "Editable root page.md files stay 0644. Separate snapshot copies, inventories, prepared inputs and final evidence are 0444.",
            "Printed row correspondence is an author-local structural observation, not source/content approval.",
            "No parent-review or native-promotion decision is taken here; counters remain zero.",
        ],
    })
    freeze_ref = save_once(EVIDENCE / "author-freeze.json", {
        "schema": "STEMROBIN-181/first-author-freeze@1",
        "ticket": "STEMROBIN-181", "author": "D360", "book": "10p", "source_pages": [395, 396, 397],
        "status": "IMMUTABLE_FIRST_AUTHOR_EVIDENCE_NOT_REVIEWED",
        "report": report_ref, "input_bindings": inputs,
        "inventories_and_receipts": evidence_before_reports, "structural_check": check_ref,
        "editable_drafts": [page["draft"] for page in pages], "immutable_snapshots": snapshots,
        "prepared_inputs": [item for page in pages for item in page["prepared_inputs"]],
        "usage": usage, "holds": [hold["id"] for page in pages for hold in page["holds"]],
        "sourcePagesAdded": 0, "completeCoursesAdded": 0,
        "review_performed": False, "source_approval": False, "course_count_approval": False,
        "native_promotion_performed": False,
        "next_owner": "Parent source review/native promotion only; no action dispatched by this author.",
    })
    print(json.dumps({"report": report_ref, "author_freeze": freeze_ref,
                      "drafts": [page["draft"] for page in pages],
                      "snapshots": snapshots, "usage": usage}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
