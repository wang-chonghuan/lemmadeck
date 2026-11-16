"""Scratch-only native source measurements and immutable author freeze."""

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

ROWS = {196: 23, 197: 18, 198: 24, 199: 20}
BLOCK_ROWS = {
    196: [3, 5, 1, 1, 4, 2, 3, 2, 1, 1],
    197: [2, 1, 1, 4, 4, 0, 1, 3, 1, 1],
    198: [3, 6, 4, 1, 1, 2, 2, 1, 2, 1, 1],
    199: [3, 2, 1, 1, 1, 3, 2, 5, 0, 0, 1, 1, 1],
}
DETAILS = {
    "0196-paragraph-opening-glyph.png": (196, [295, 473, 245, 68]),
    "0196-footer-and-scan-shadow.png": (196, [0, 1980, 1504, 250]),
    "0198-footer-and-scan-shadow.png": (198, [0, 2000, 1504, 250]),
}
NATIVE_TOOLS = (
    "p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py",
    "katex_check.js",
)


def bind(file):
    file = Path(file)
    return {"path": str(file.relative_to(ROOT)), "sha256": layout.sha256_file(file)}


def new_json(file, value):
    with file.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def details():
    assert not (OUT / "author-freeze.json").exists()
    (OUT / "evidence").mkdir(exist_ok=True)
    for name, (page, xywh) in DETAILS.items():
        target = OUT / "evidence" / name
        assert not target.exists(), "Preserve existing source detail"
        source = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}/page.png"
        layout.crop(source, xywh, target, pad=0)
        print(json.dumps({"source": bind(source), "detail": bind(target),
                          "source_crop_xywh": xywh}))


def observe():
    target = OUT / "author-check.json"
    assert not target.exists(), "One native author audit only"
    assert not (OUT / "author-freeze.json").exists(), "Frozen package is immutable"
    (OUT / "evidence").mkdir(exist_ok=True)
    (OUT / "candidate-figures").mkdir(exist_ok=True)
    profile_file = TOOLS.parent / "profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_file)
    incoming = OUT.parent / "9p-next-source-0192-0195/0195.page.md"
    snapshot = OUT / "evidence/incoming-0195-snapshot.page.md"
    assert not snapshot.exists()
    shutil.copyfile(incoming, snapshot)
    _, incoming_blocks = blocks.load(snapshot)
    last_index, last_body = next(
        (index, item)
        for index, item in reversed(list(enumerate(incoming_blocks, 1)))
        if item["kind"] == "p"
    )
    assert last_body["open"] and blocks.text_of(last_body).endswith("小球的电量与它")
    result = {
        "ticket": "STEMROBIN-181",
        "batch": "D020-future-source",
        "role": "source-author-only",
        "status": "native-author-measurements-not-independent-source-or-science-gate",
        "pdf": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "incoming_context": {
            "source_draft_at_read": bind(incoming), "snapshot": bind(snapshot),
            "terminal_ref": f"p0195#{last_index}",
            "terminal_text": blocks.text_of(last_body), "open": last_body["open"],
            "next_ref": "p0196#1", "next_text": "的电势的比值",
            "scope": "Incoming195 text only. No prior source images, source review or science gate inherited.",
        },
        "tools": {name: bind(TOOLS / name) for name in NATIVE_TOOLS},
        "profile": bind(profile_file),
        "lesson_skill": bind(TOOLS.parent / "SKILL.md"),
        "toc": bind(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
        "helper": bind(Path(__file__).resolve()),
        "preparation_helper": bind(OUT / "prepare-once.mjs"),
        "prepare_provenance": [bind(OUT / f"prepare-{page}.json") for page in ROWS],
        "pages": [],
    }
    for page, expected in ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        source = work / "page.png"
        source_binding = bind(source)
        draft = OUT / f"{page:04d}.page.md"
        meta, parsed = blocks.load(draft)
        assert meta["render"]["sha256"] == source_binding["sha256"]
        assert meta["source"]["pdf_sha256"] == result["pdf"]["sha256"]
        assert meta["profile"]["sha256"] == result["profile"]["sha256"]
        assert meta["page"] == page and meta["printed_page"] == page - 9
        preparation = json.loads((OUT / f"prepare-{page}.json").read_text())
        assert preparation["exitCode"] == 0
        for item in preparation["outputs"]:
            assert bind(ROOT / item["path"]) == item, "Prepared bytes changed"
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in parsed
        ]
        assert block_rows == BLOCK_ROWS[page], (page, block_rows)
        assert blocks.printed_lines(parsed) == expected
        with Image.open(source) as image:
            assert list(image.size) == [meta["render"]["w"], meta["render"]["h"]]
            ink = layout.ink_mask(image)
            masked = ink.copy()
            figures = []
            sequence = 0
            for index, item in enumerate(parsed, 1):
                if item["kind"] != "fig":
                    continue
                sequence += 1
                fid = blocks.fig_id(item["label"], page, sequence)
                box, info = layout.snap(ink, item["box"])
                pad = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                assert not candidate.exists()
                layout.crop(source, box, candidate, pad=pad)
                x, y, width, height = box
                masked[y:y + height, x:x + width] = False
                left, top = max(0, x - pad), max(0, y - pad)
                right = min(image.width, x + width + pad)
                bottom = min(image.height, y + height + pad)
                figures.append({
                    "id": fid, "block": f"p{page:04d}#{index}",
                    "label": item["label"], "rough_box": item["box"],
                    "snapped_box": box, "native_snap": info, "padding_px": pad,
                    "exact_source_extraction_box_xywh":
                        [left, top, right - left, bottom - top],
                    "candidate": bind(candidate),
                })
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            counted = p2c._counting_line_bands(meta, masked, content_width)
            extents = []
            for top, bottom in counted:
                xs = masked[top:bottom + 1].any(axis=0).nonzero()[0]
                extents.append({
                    "y": [int(top), int(bottom)],
                    "x": [int(xs[0]), int(xs[-1])] if xs.size else None,
                })
            masked_file = OUT / "evidence" / f"{page:04d}-figure-masked-counting-copy.png"
            assert not masked_file.exists()
            Image.fromarray((~masked).astype("uint8") * 255).save(masked_file)
        changes, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, entries = normalize.normalize_text(line, profile)
                if normalized != line:
                    changes.append({"block": index, "row": row, "changes": entries})
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry}
                           for entry in normalize.check_charset(text, profile))
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(
            texts, lambda item: [("text", item["text"])]
        )
        result["pages"].append({
            "pdf_page": page, "printed_page": meta["printed_page"],
            "draft": bind(draft), "source": source_binding,
            "grid": bind(work / "page.grid.png"), "layout": bind(work / "layout.json"),
            "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": [meta["render"]["w"], meta["render"]["h"]],
            "blocks": len(parsed), "author_visible_rows_including_footer": expected,
            "author_block_rows": block_rows,
            "draft_printed_rows": blocks.printed_lines(parsed),
            "native_count": len(counted), "native_bands": counted,
            "native_band_extents": extents, "counting": meta.get("counting"),
            "native_count_matches_author": len(counted) == expected,
            "figure_masked_counting_copy": bind(masked_file), "figures": figures,
            "block_inventory": [
                {"ref": f"p{page:04d}#{index}", "kind": item["kind"],
                 "label": item["label"], "open": item["open"], "cont": item["cont"],
                 "samerow": item["samerow"], "physical_rows_before_samerow": rows}
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": changes, "charset_findings": charset,
            "math_errors": errors, "math_warnings": warnings,
            "source_pixels_unchanged": bind(source) == source_binding,
        })
    new_json(target, result)
    print(json.dumps({
        "author_check": bind(target),
        "pages": [{key: page[key] for key in (
            "pdf_page", "blocks", "draft_printed_rows", "native_count",
            "native_band_extents", "normalizations_needed", "charset_findings",
            "math_errors", "math_warnings",
        )} for page in result["pages"]],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    check = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    bindings = list(check["tools"].values())
    bindings += [check[key] for key in (
        "pdf", "profile", "lesson_skill", "toc", "helper", "preparation_helper",
    )]
    bindings += check["prepare_provenance"] + [check["incoming_context"]["snapshot"]]
    blockers = []
    for page in check["pages"]:
        bindings += [page[field] for field in (
            "draft", "source", "grid", "layout", "prepare_template",
            "figure_masked_counting_copy",
        )]
        bindings += [figure["candidate"] for figure in page["figures"]]
        if not page["native_count_matches_author"]:
            blockers.append({
                "pdf_page": page["pdf_page"],
                "reason": "Native masked count differs from visible printed-row count",
                "actual": page["author_visible_rows_including_footer"],
                "native": page["native_count"],
            })
        for field in ("normalizations_needed", "charset_findings", "math_errors"):
            if page[field]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": field,
                                 "details": page[field]})
    assert all(item["actuallyOpenedOriginal"]
               for item in notes["source_image_observations"])
    assert all(item["actuallyOpenedOriginal"]
               for item in notes["candidate_crop_observations"])
    ledger = notes["image_ledger"]
    assert len(ledger) == notes["images_loaded_total"] <= 8
    assert sum(entry["kind"] == "source-original" for entry in ledger) == 4
    bindings += [entry["file"] for entry in ledger]
    detail_bindings = [
        {"file": bind(OUT / "evidence" / name), "pdf_page": page,
         "source_crop_xywh": xywh,
         "actuallyOpenedOriginal":
             any(entry["file"]["path"].endswith("/" + name) for entry in ledger)}
        for name, (page, xywh) in DETAILS.items()
    ]
    bindings += [entry["file"] for entry in detail_bindings]
    for item in bindings:
        assert bind(ROOT / item["path"]) == item, f"Frozen input changed: {item['path']}"
    blockers.extend(notes.get("crop_or_fidelity_blockers", []))
    output = {
        **check,
        "status": "frozen-author-evidence-with-blockers" if blockers
            else "frozen-pending-unique-independent-source-gate",
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
        "detail_evidence": detail_bindings,
        "image_ledger": ledger, "images_loaded_total": len(ledger),
        "grid_images_loaded": 0, "image_batch_limit": 8,
        "blockers": blockers,
        "counts": {
            "visible_rows_including_footer": list(ROWS.values()),
            "native_rows_including_unresolved_bands":
                [page["native_count"] for page in check["pages"]],
            "total_visible_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in check["pages"]),
            "source_tasks": 0, "worked_examples": 0,
            "explanatory_footnote_rows": 0, "footer_rows": 4,
            "source_figures":
                [figure["id"] for page in check["pages"] for figure in page["figures"]],
        },
        "source_or_science_self_approval": False, "native_author_audit_runs": 1,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "browser_network_models_db_git_used": False,
        "all_helper_versions_fixed_before_observe_and_freeze": True,
        "in_flight_processes": [],
    }
    new_json(OUT / "author-freeze.json", output)
    print(json.dumps({"freeze": bind(OUT / "author-freeze.json"),
                      "status": output["status"], "counts": output["counts"],
                      "blockers": blockers, "images_loaded_total": len(ledger)},
                     ensure_ascii=False, indent=2))


if sys.argv[1:] == ["details"]:
    details()
elif sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected details, observe or freeze only")
