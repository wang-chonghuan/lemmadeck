"""One scratch-only source author audit, then hash freeze; no page finalization."""

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

ROWS = {188: 23, 189: 24, 190: 8, 191: 25}
BLOCK_ROWS = {
    188: [1, 1, 6, 1, 4, 0, 1, 1, 1, 1, 1, 1, 1, 3, 1],
    189: [1, 2, 3, 4, 2, 1, 2, 7, 1, 1],
    190: [0, 1, 0, 1, 0, 1, 3, 2, 1],
    191: [4, 1, 7, 0, 1, 1, 10, 1, 1],
}


def bind(file):
    file = Path(file)
    return {"path": str(file.relative_to(ROOT)), "sha256": layout.sha256_file(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve recorded evidence: {file}"
    file.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def observe():
    target = OUT / "author-check.json"
    assert not target.exists(), "No repeat author count or structural audit"
    assert not (OUT / "author-freeze.json").exists(), "Frozen package is immutable"
    profile_file = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_file)
    incoming = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0184-0187/0187.page.md"
    incoming_snapshot = OUT / "evidence" / "incoming-0187-snapshot.page.md"
    assert not incoming_snapshot.exists()
    shutil.copyfile(incoming, incoming_snapshot)
    _, incoming_blocks = blocks.load(incoming_snapshot)
    last_index, last_body = next(
        (index, item)
        for index, item in reversed(list(enumerate(incoming_blocks, 1)))
        if item["kind"] == "p"
    )
    assert last_body["open"] and blocks.text_of(last_body).endswith("在静电单")
    result = {
        "ticket": "STEMROBIN-181",
        "batch": "D019",
        "role": "source-author-only",
        "status": "native-author-measurements-not-independent-source-or-science-gate",
        "pdf": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "incoming_context": {
            "source_draft_at_read": bind(incoming),
            "snapshot": bind(incoming_snapshot),
            "terminal_ref": f"p0187#{last_index}",
            "terminal_text": blocks.text_of(last_body),
            "open": last_body["open"],
            "next_ref": "p0188#1",
            "next_text": "位制中的能量为",
            "scope": "187 terminal text only; no prior pixel, source, counting or science reinspection. Snapshot preserves actual input bytes, not approval.",
        },
        "tools": {
            name: bind(TOOLS / name)
            for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py", "katex_check.js")
        },
        "profile": bind(profile_file),
        "helper": bind(Path(__file__).resolve()),
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
                    "id": fid, "block": f"p{page:04d}#{index}", "label": item["label"],
                    "rough_box": item["box"], "snapped_box": box, "native_snap": info,
                    "padding_px": pad,
                    "exact_source_extraction_box_xywh": [left, top, right - left, bottom - top],
                    "candidate": bind(candidate),
                })
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            counted = p2c._counting_line_bands(meta, masked, content_width)
            extents = []
            for top, bottom in counted:
                xs = masked[top:bottom + 1].any(axis=0).nonzero()[0]
                extents.append({"y": [int(top), int(bottom)], "x": [int(xs[0]), int(xs[-1])] if xs.size else None})
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
            charset.extend({"block": index, **entry} for entry in normalize.check_charset(text, profile))
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
        result["pages"].append({
            "pdf_page": page, "printed_page": meta["printed_page"],
            "draft": bind(draft), "source": source_binding, "grid": bind(work / "page.grid.png"),
            "layout": bind(work / "layout.json"), "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": [meta["render"]["w"], meta["render"]["h"]],
            "blocks": len(parsed), "author_visible_rows_including_footer": expected,
            "author_block_rows": block_rows, "draft_printed_rows": blocks.printed_lines(parsed),
            "native_count": len(counted), "native_bands": counted, "native_band_extents": extents,
            "counting": meta.get("counting"), "native_count_matches_author": len(counted) == expected,
            "figure_masked_counting_copy": bind(masked_file), "figures": figures,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}", "kind": item["kind"], "label": item["label"],
                    "open": item["open"], "cont": item["cont"], "samerow": item["samerow"],
                    "physical_rows_before_samerow": rows,
                }
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
            "pdf_page", "blocks", "author_visible_rows_including_footer", "draft_printed_rows",
            "native_count", "native_band_extents", "normalizations_needed", "charset_findings",
            "math_errors", "math_warnings",
        )} for page in result["pages"]],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    check = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    blockers = []
    snapshot = check["incoming_context"]["snapshot"]
    assert bind(ROOT / snapshot["path"])["sha256"] == snapshot["sha256"]
    for page in check["pages"]:
        for field in ("draft", "source", "grid", "layout", "prepare_template"):
            item = page[field]
            assert bind(ROOT / item["path"])["sha256"] == item["sha256"]
        for figure in page["figures"]:
            item = figure["candidate"]
            assert bind(ROOT / item["path"])["sha256"] == item["sha256"]
        if not page["native_count_matches_author"]:
            blockers.append({
                "pdf_page": page["pdf_page"],
                "reason": "Native masked count differs from author actual printed-row count",
                "actual": page["author_visible_rows_including_footer"], "native": page["native_count"],
            })
        for field in ("normalizations_needed", "charset_findings", "math_errors"):
            if page[field]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": field, "details": page[field]})
    assert all(item["actuallyOpenedOriginal"] and item["actuallyOpenedGridOriginal"] for item in notes["source_image_observations"])
    assert all(item["actuallyOpenedOriginal"] for item in notes["candidate_crop_observations"])
    blockers.extend(notes.get("crop_or_fidelity_blockers", []))
    output = {
        **check,
        "status": "frozen-author-evidence-with-blockers" if blockers else "frozen-pending-unique-independent-source-gate",
        "scope": {"book": "9p", "pdf_pages": list(ROWS), "printed_pages": [page - 9 for page in ROWS]},
        "prepare_provenance": notes["prepare_provenance"],
        "author_check": bind(OUT / "author-check.json"), "author_notes": bind(OUT / "author-notes.json"),
        "source_image_observations": notes["source_image_observations"],
        "candidate_crop_observations": notes["candidate_crop_observations"],
        "source_boundaries": notes["source_boundaries"],
        "figure_inventory": notes["figure_inventory"], "uncertainties": notes["uncertainties"],
        "count_observations": notes["count_observations"], "blockers": blockers,
        "counts": {
            "visible_rows_including_footer": list(ROWS.values()), "total_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in check["pages"]),
            "source_tasks": 0, "explanatory_footnote_rows": 0, "footer_rows": 4,
            "source_figures": [figure["id"] for page in check["pages"] for figure in page["figures"]],
        },
        "source_or_science_self_approval": False, "native_author_audit_runs": 1,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "browser_network_models_db_git_used": False, "in_flight_processes": [],
    }
    new_json(OUT / "author-freeze.json", output)
    print(json.dumps({
        "freeze": bind(OUT / "author-freeze.json"), "status": output["status"],
        "counts": output["counts"], "blockers": blockers,
    }, ensure_ascii=False, indent=2))


if sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected observe or freeze only")
