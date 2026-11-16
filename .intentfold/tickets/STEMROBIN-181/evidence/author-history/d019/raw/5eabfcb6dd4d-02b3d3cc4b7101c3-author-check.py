"""Scoped source-author observations; no durable writes or independent gate."""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import mathcheck
import normalize
import p2c

EXPECTED_ROWS = {168: 25, 169: 24, 170: 20, 171: 20}
EXPECTED_BLOCK_ROWS = {
    168: [2, 4, 1, 3, 3, 7, 3, 1, 1],
    169: [6, 1, 2, 1, 1, 3, 2, 3, 1, 1, 1, 1, 1],
    170: [2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3, 1, 1],
    171: [4, 1, 5, 0, 1, 0, 1, 3, 5, 1],
}


def binding(path):
    path = Path(path)
    return {"path": str(path), "sha256": layout.sha256_file(path)}


def check_bindings(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            assert binding(value["path"])["sha256"] == value["sha256"], value["path"]
        for child in value.values():
            check_bindings(child)
    elif isinstance(value, list):
        for child in value:
            check_bindings(child)


def freeze():
    destination = OUT / "author-freeze.json"
    assert not destination.exists(), "Do not overwrite frozen author evidence"
    check_path = OUT / "author-check.json"
    notes_path = OUT / "author-notes.json"
    observations = json.loads(check_path.read_text())
    notes = json.loads(notes_path.read_text())
    check_bindings(observations)
    check_bindings(notes)
    assert notes["role"] == "source-author-only"
    assert notes["author_asserts_no_in_flight_writes"]
    for page in observations["pages"]:
        expected = EXPECTED_ROWS[page["pdf_page"]]
        assert page["author_observed_rows_including_footer"] == expected
        assert page["draft_printed_rows"] == expected
        assert not page["normalizations_needed"]
        assert not page["charset_findings"]
        assert not page["math_errors"]
        assert page["source_pixels_unchanged"]
    result = {
        "ticket": "STEMROBIN-181",
        "role": "source-author-only",
        "status": "frozen-pending-unique-independent-source-gate",
        "scope": {"book": "9p", "pdf_pages": list(EXPECTED_ROWS), "printed_pages": [159, 160, 161, 162]},
        "author_asserts_no_in_flight_writes": True,
        "native_prepare": {"pages": list(EXPECTED_ROWS), "dpi": 300, "once_each_previously_absent": True},
        "pdf": observations["pdf"],
        "incoming_context": observations["incoming_context"],
        "prior_unresolved_report": observations["prior_unresolved_report"],
        "pages": observations["pages"],
        "author_notes": binding(notes_path),
        "author_check": binding(check_path),
        "helper": binding(Path(__file__).resolve()),
        "counts": {
            "actual_rows_including_footer": list(EXPECTED_ROWS.values()),
            "total_actual_rows_including_footer": sum(EXPECTED_ROWS.values()),
            "blocks": sum(page["blocks"] for page in observations["pages"]),
            "original_written_tasks": 0,
            "source_figures": [
                figure["id"]
                for page in observations["pages"]
                for figure in page["source_figures"]
            ],
            "footnote_rows": 0,
            "footer_rows": 4,
        },
        "native_tools": observations["native_tools"],
        "source_boundaries": notes["source_boundaries"],
        "unresolved": notes["unresolved"],
        "source_gate_or_science_approval": "not-performed",
        "no_finalize_vectorize_assemble_or_durable_edits": True,
        "page167_not_bypassed": True,
    }
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"author_freeze": binding(destination), "counts": result["counts"]}, ensure_ascii=False, indent=2))


def observe():
    assert not (OUT / "author-freeze.json").exists(), "Preserve frozen author package"
    output = OUT / "author-check.json"
    assert not output.exists(), "Do not repeat recorded author measurements"
    profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_path)
    record = {
        "ticket": "STEMROBIN-181",
        "role": "source-author-only",
        "status": "native-author-observations-not-independent-gate",
        "pdf": binding(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "incoming_context": {
            **binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0164-0167/0167.page.md"),
            "scope": "Terminal body text only; no whole-page or prior source gate repeated",
            "terminal_body_text": "这些性质不同于周围世界其他",
            "continuation": "p0168#1",
        },
        "prior_unresolved_report": binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d018-p0167-separator-detail.json"),
        "native_tools": {
            name: binding(TOOLS / name)
            for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
        },
        "profile": binding(profile_path),
        "helper": binding(Path(__file__).resolve()),
        "pages": [],
    }
    for page, expected in EXPECTED_ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        draft = OUT / f"{page:04d}.page.md"
        source = work / "page.png"
        source_binding = binding(source)
        meta, parsed = blocks.load(draft)
        assert meta["render"]["sha256"] == source_binding["sha256"]
        block_rows = [len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"]) for item in parsed]
        assert block_rows == EXPECTED_BLOCK_ROWS[page], (page, block_rows)
        with Image.open(source) as image:
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
                padding = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                margin = OUT / "evidence" / f"{fid}-prospective-margin36.png"
                layout.crop(source, box, candidate, pad=padding)
                layout.crop(source, box, margin, pad=36)
                x, y, width, height = box
                masked[y:y + height, x:x + width] = False
                left, top = max(0, x - padding), max(0, y - padding)
                right, bottom = min(image.width, x + width + padding), min(image.height, y + height + padding)
                figures.append({
                    "id": fid,
                    "block": f"p{page:04d}#{index}",
                    "label": item["label"],
                    "rough_box": item["box"],
                    "snapped_box": box,
                    "native_snap": info,
                    "padding_px": padding,
                    "exact_source_extraction_box_xywh": [left, top, right - left, bottom - top],
                    "candidate": binding(candidate),
                    "prospective_margin36": binding(margin),
                })
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            default = layout.line_bands(masked, content_width)
            configured = p2c._counting_line_bands(meta, masked, content_width)
            masked_path = OUT / "evidence" / f"{page:04d}-figure-masked-counting-copy.png"
            masked_path.parent.mkdir(parents=True, exist_ok=True)
            Image.fromarray((~masked).astype("uint8") * 255).save(masked_path)
            dimensions = list(image.size)
        normalization_deltas, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, changes = normalize.normalize_text(line, profile)
                if line != normalized:
                    normalization_deltas.append({"block": index, "row": row, "changes": changes})
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry} for entry in normalize.check_charset(text, profile))
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        math_errors, math_warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
        record["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": binding(draft),
            "source": source_binding,
            "grid": binding(work / "page.grid.png"),
            "prepare_layout": binding(work / "layout.json"),
            "prepare_template": binding(work / "page.template.md"),
            "dimensions_px": dimensions,
            "blocks": len(parsed),
            "author_observed_rows_including_footer": expected,
            "author_observed_block_rows": EXPECTED_BLOCK_ROWS[page],
            "draft_printed_rows": blocks.printed_lines(parsed),
            "default_native_count": len(default),
            "default_native_bands": default,
            "configured_native_count": len(configured),
            "configured_native_bands": configured,
            "native_count_matches_author_expectation": len(configured) == expected,
            "counting": meta.get("counting"),
            "figure_masked_counting_copy": binding(masked_path),
            "source_figures": figures,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}",
                    "kind": item["kind"],
                    "label": item["label"],
                    "open": item["open"],
                    "cont": item["cont"],
                    "samerow": item["samerow"],
                    "physical_rows_before_samerow_adjustment": rows,
                }
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": normalization_deltas,
            "charset_findings": charset,
            "math_errors": math_errors,
            "math_warnings": math_warnings,
            "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
            "source_pixels_unchanged": binding(source) == source_binding,
        })
    output.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "author_check": binding(output),
        "pages": [
            {key: page[key] for key in (
                "pdf_page", "blocks", "author_observed_rows_including_footer",
                "draft_printed_rows", "default_native_count", "configured_native_count",
                "normalizations_needed", "charset_findings", "math_errors", "math_warnings",
            )}
            for page in record["pages"]
        ],
        "figures": [figure for page in record["pages"] for figure in page["source_figures"]],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--freeze", action="store_true")
    args = parser.parse_args()
    freeze() if args.freeze else observe()
