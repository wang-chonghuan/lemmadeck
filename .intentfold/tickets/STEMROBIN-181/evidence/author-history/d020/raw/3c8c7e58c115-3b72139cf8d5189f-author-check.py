"""One scratch-only native audit, then a hash-bound author freeze."""

import hashlib
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import mathcheck
import normalize
import p2c

ROWS = {200: 24, 201: 21, 202: 25, 203: 24}
BLOCK_ROWS = {
    200: [5, 1, 4, 1, 2, 3, 5, 1, 1, 1],
    201: [3, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 4, 1],
    202: [7, 0, 1, 2, 5, 3, 1, 4, 2, 0, 1, 1],
    203: [2, 1, 1, 1, 4, 0, 1, 1, 2, 1, 1, 5, 2, 0, 1, 1, 1, 1],
}
NATIVE_TOOLS = (
    "p2c.py", "layout.py", "blocks.py", "normalize.py",
    "mathcheck.py", "katex_check.js",
)


def bind(path):
    path = Path(path)
    return {"path": str(path.relative_to(ROOT)), "sha256": layout.sha256_file(path)}


def write_new(path, value):
    with Path(path).open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def text_freeze(pages):
    manifest = "".join(
        f"{item['pdf_page']:04d}:{item['draft']['sha256']}\n" for item in pages
    )
    return {
        "algorithm": "sha256 of ordered UTF-8 NNNN:draft-sha256 newline records",
        "manifest": manifest,
        "sha256": hashlib.sha256(manifest.encode("utf-8")).hexdigest(),
    }


def observe():
    assert not (OUT / "author-check.json").exists(), "Native audit is write-once"
    assert not (OUT / "author-freeze.json").exists()
    (OUT / "candidate-figures").mkdir(exist_ok=True)
    (OUT / "evidence").mkdir(exist_ok=True)
    incoming = OUT.parent / "9p-next-source-0196-0199/0199.page.md"
    incoming_binding = bind(incoming)
    snapshot = OUT / "evidence/incoming-0199-snapshot.page.md"
    assert not snapshot.exists()
    shutil.copyfile(incoming, snapshot)
    assert bind(snapshot)["sha256"] == incoming_binding["sha256"]
    _, incoming_blocks = blocks.load(snapshot)
    last_index, last = next(
        (i, item) for i, item in reversed(list(enumerate(incoming_blocks, 1)))
        if item["kind"] == "p" and item.get("label") != "footnote"
    )
    assert not last["open"] and blocks.text_of(last).endswith("两层极板之间.")
    profile_path = TOOLS.parent / "profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_path)
    result = {
        "schema": "STEMROBIN-181/source-author-native-observations@1",
        "ticket": "STEMROBIN-181",
        "batch": "9p-next-source-0200-0203",
        "role": "source-author-only",
        "status": "native-author-measurements-not-source-or-science-approval",
        "pdf": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "manifest": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"),
        "toc": bind(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
        "profile": bind(profile_path),
        "tools": {name: bind(TOOLS / name) for name in NATIVE_TOOLS},
        "helper": bind(Path(__file__).resolve()),
        "preparation_helper": bind(OUT / "prepare-once.mjs"),
        "lesson_skill": bind(TOOLS.parent / "SKILL.md"),
        "image_rules": bind(ROOT / ".agents/skills/ld-s10y-image/SKILL.md"),
        "live_ticket_read": {
            "backend": "plane", "sequence_id": 181,
            "id": "7ebae0e0-c024-481d-8360-5b3d3bfdda79",
            "helper": "/Users/yong/.agents/skills/n-plane/scripts/plane.sh",
            "date": "2026-11-16",
            "operations": "verify and read-only paginated collection",
            "description_read": True,
            "scope": "Current human request authorizes this preparation-only continuation.",
        },
        "incoming_context": {
            "source_draft_at_read": incoming_binding,
            "snapshot": bind(snapshot),
            "terminal_ref": f"p0199#{last_index}",
            "terminal_text": blocks.text_of(last),
            "open": last["open"],
            "next_ref": "p0200#1",
            "scope": "Text snapshot only; no inherited source, SCI or approval evidence.",
        },
        "prepare_provenance": [],
        "pages": [],
    }
    for page, expected in ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        source = work / "page.png"
        source_binding = bind(source)
        meta, parsed = blocks.load(OUT / f"{page:04d}.page.md")
        report = OUT / f"prepare-{page}.json"
        preparation = json.loads(report.read_text())
        assert preparation["exitCode"] == 0 and preparation["processesFinished"]
        assert preparation["helper"] == result["preparation_helper"]
        assert preparation["nativeTool"] == result["tools"]["p2c.py"]
        for entry in preparation["outputs"]:
            assert bind(ROOT / entry["path"]) == entry, "Prepared bytes changed"
        result["prepare_provenance"].append(bind(report))
        assert meta["page"] == page and meta["printed_page"] == page - 9
        assert meta["render"]["sha256"] == source_binding["sha256"]
        assert meta["source"]["pdf_sha256"] == result["pdf"]["sha256"]
        assert meta["profile"]["sha256"] == result["profile"]["sha256"]
        assert "counting" not in meta and "figure_crops" not in meta
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in parsed
        ]
        assert block_rows == BLOCK_ROWS[page], (page, block_rows)
        assert blocks.printed_lines(parsed) == expected
        assert all(item["lines"] for item in parsed if item["kind"] in blocks.KINDS_TEXT)
        figures = []
        with Image.open(source) as image:
            assert list(image.size) == [meta["render"]["w"], meta["render"]["h"]]
            ink = layout.ink_mask(image)
            masked = ink.copy()
            for index, item in enumerate(parsed, 1):
                if item["kind"] != "fig":
                    continue
                fid = blocks.fig_id(item["label"], page, len(figures) + 1)
                exact, native = layout.snap(ink, item["box"])
                assert native["components"] > 0
                padding = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                assert not candidate.exists(), "Never re-snap an existing candidate"
                layout.crop(source, exact, candidate, pad=padding)
                x, y, width, height = exact
                masked[max(0, y):y + height, max(0, x):x + width] = False
                left, top = max(0, x - padding), max(0, y - padding)
                right = min(image.width, x + width + padding)
                bottom = min(image.height, y + height + padding)
                figures.append({
                    "id": fid,
                    "block": f"p{page:04d}#{index}",
                    "label": item["label"],
                    "rough_box": item["box"],
                    "box": exact,
                    "snapped_box": exact,
                    "native_snap": native,
                    "padding_px": padding,
                    "exact_source_extraction_box_xywh":
                        [left, top, right - left, bottom - top],
                    "candidate": bind(candidate),
                })
            geometry_errors = [
                error for i, first in enumerate(figures) for second in figures[i + 1:]
                if (error := p2c._figure_overlap_error(ink, first, second))
            ]
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            bands = p2c._counting_line_bands(meta, masked, content_width)
            extents = []
            for top, bottom in bands:
                xs = masked[top:bottom + 1].any(axis=0).nonzero()[0]
                extents.append({
                    "y": [int(top), int(bottom)],
                    "x": [int(xs[0]), int(xs[-1])] if xs.size else None,
                })
            masked_file = OUT / "evidence" / f"{page:04d}-figure-masked-counting-copy.png"
            assert not masked_file.exists()
            Image.fromarray((~masked).astype("uint8") * 255).save(masked_file)
        changes, charset, enums, texts = [], [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, entries = normalize.normalize_text(line, profile)
                if normalized != line:
                    changes.append({"block": index, "row": row, "changes": entries})
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry}
                           for entry in normalize.check_charset(text, profile))
            for key in p2c.ENUM_LINE.findall(blocks.text_of(item, join="\n")):
                if normalize.enum_key_script(key) not in ("cyrillic", "numeric"):
                    enums.append({"block": index, "marker": key})
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(
            texts, lambda item: [("text", item["text"])]
        )
        result["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": bind(OUT / f"{page:04d}.page.md"),
            "source": source_binding,
            "grid": bind(work / "page.grid.png"),
            "layout": bind(work / "layout.json"),
            "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": [meta["render"]["w"], meta["render"]["h"]],
            "blocks": len(parsed),
            "author_visible_rows_including_footer": expected,
            "author_block_rows": block_rows,
            "draft_printed_rows": blocks.printed_lines(parsed),
            "native_count": len(bands),
            "native_count_matches_author": len(bands) == expected,
            "native_bands": bands,
            "native_band_extents": extents,
            "counting": None,
            "figure_masked_counting_copy": bind(masked_file),
            "figures": figures,
            "geometry_errors": geometry_errors,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}", "kind": item["kind"],
                    "label": item["label"], "open": item["open"],
                    "cont": item["cont"], "samerow": item["samerow"],
                    "physical_rows_before_samerow": count,
                }
                for index, (item, count) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": changes,
            "charset_findings": charset,
            "enum_findings": enums,
            "math_errors": errors,
            "math_warnings": warnings,
            "errata_errors": p2c._validate_page_errata(meta, parsed, page),
            "source_pixels_unchanged": bind(source) == source_binding,
        })
    result["text_freeze"] = text_freeze(result["pages"])
    write_new(OUT / "author-check.json", result)
    print(json.dumps({
        "author_check": bind(OUT / "author-check.json"),
        "text_freeze": result["text_freeze"],
        "pages": [{key: page[key] for key in (
            "pdf_page", "blocks", "draft_printed_rows", "native_count",
            "native_band_extents", "normalizations_needed", "charset_findings",
            "enum_findings", "geometry_errors", "math_errors", "math_warnings",
        )} for page in result["pages"]],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    check = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    bindings = list(check["tools"].values()) + [
        check[key] for key in (
            "pdf", "manifest", "toc", "profile", "helper", "preparation_helper",
            "lesson_skill", "image_rules",
        )
    ]
    bindings += check["prepare_provenance"] + [check["incoming_context"]["snapshot"]]
    blockers = []
    for page in check["pages"]:
        bindings += [page[key] for key in (
            "draft", "source", "grid", "layout", "prepare_template",
            "figure_masked_counting_copy",
        )]
        bindings += [figure["candidate"] for figure in page["figures"]]
        if not page["native_count_matches_author"]:
            blockers.append({
                "pdf_page": page["pdf_page"],
                "reason": "Native masked count differs from source physical-row count",
                "actual": page["draft_printed_rows"], "native": page["native_count"],
            })
        for key in (
            "normalizations_needed", "charset_findings", "enum_findings",
            "geometry_errors", "math_errors", "errata_errors",
        ):
            if page[key]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": key,
                                 "details": page[key]})
    ledger = [
        {"load": index, "kind": entry["kind"], "file": bind(ROOT / entry["path"]),
         "detail": "original"}
        for index, entry in enumerate(notes["image_ledger"], 1)
    ]
    assert len(ledger) == 8
    assert [entry["kind"] for entry in ledger] == ["source-original"] * 4 + ["candidate"] * 4
    assert all(entry["actuallyOpenedOriginal"] for entry in notes["source_image_observations"])
    assert all(entry["actuallyOpenedOriginal"] for entry in notes["candidate_crop_observations"])
    bindings += [entry["file"] for entry in ledger]
    for entry in bindings:
        assert bind(ROOT / entry["path"]) == entry, f"Input changed: {entry['path']}"
    blockers += notes.get("crop_or_fidelity_blockers", [])
    output = {
        **check,
        "schema": "STEMROBIN-181/source-author-freeze@1",
        "status": "frozen-author-evidence-with-blockers" if blockers
            else "frozen-pending-independent-source-gate",
        "scope": {"book": "9p", "pdf_pages": list(ROWS),
                  "printed_pages": [page - 9 for page in ROWS]},
        "author_check": bind(OUT / "author-check.json"),
        "author_notes": bind(OUT / "author-notes.json"),
        "source_image_observations": notes["source_image_observations"],
        "candidate_crop_observations": notes["candidate_crop_observations"],
        "source_boundaries": notes["source_boundaries"],
        "figure_inventory": notes["figure_inventory"],
        "uncertainties": notes["uncertainties"],
        "count_observations": notes["count_observations"],
        "image_ledger": ledger,
        "images_loaded_total": len(ledger),
        "grid_images_loaded": 0,
        "image_batch_limit": 8,
        "blockers": blockers,
        "counts": {
            "visible_rows_including_footer": list(ROWS.values()),
            "native_rows": [page["native_count"] for page in check["pages"]],
            "total_visible_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in check["pages"]),
            "source_tasks": 0,
            "worked_examples": 0,
            "printed_proof_requests_in_footnotes": 1,
            "explanatory_footnote_rows": 1,
            "footer_rows": 4,
            "source_figures": [figure["id"] for page in check["pages"]
                               for figure in page["figures"]],
        },
        "source_or_science_self_approval": False,
        "native_author_audit_runs": 1,
        "native_prepare_runs_per_page": 1,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "browser_models_db_git_used": False,
        "ticket_backend_read_only": True,
        "persistent_content_and_unowned_files_written": False,
        "in_flight_processes": [],
    }
    write_new(OUT / "author-freeze.json", output)
    print(json.dumps({
        "freeze": bind(OUT / "author-freeze.json"),
        "text_freeze_sha256": output["text_freeze"]["sha256"],
        "status": output["status"], "counts": output["counts"],
        "blockers": blockers, "images_loaded_total": len(ledger),
    }, ensure_ascii=False, indent=2))


if sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected observe or freeze")
