"""Scoped scratch source-author observations, not an independent source gate."""

import argparse
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

EXPECTED_ROWS = {60: 24, 61: 18, 62: 22, 63: 17}
EXPECTED_BLOCK_ROWS = {
    60: [1, 1, 3, 1, 1, 5, 1, 2, 1, 2, 3, 0, 1, 2, 1],
    61: [4, 4, 1, 0, 1, 2, 1, 1, 3, 1],
    62: [1, 6, 1, 1, 3, 1, 3, 2, 3, 1],
    63: [0, 1, 1, 1, 1, 1, 2, 1, 4, 2, 1, 1, 1],
}
PDF = ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf"
INCOMING = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0059/page.md"


def binding(path):
    path = Path(path)
    return {"path": str(path), "sha256": layout.sha256_file(path)}


def verify_bindings(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            assert binding(value["path"])["sha256"] == value["sha256"], value["path"]
        for child in value.values():
            verify_bindings(child)
    elif isinstance(value, list):
        for child in value:
            verify_bindings(child)


def observe():
    destination = OUT / "author-check.json"
    assert not destination.exists(), "Do not repeat frozen author measurements"
    assert not (OUT / "author-freeze.json").exists()
    profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_path)
    manifest = ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"
    catalog = next(item for item in json.loads(manifest.read_text())["catalogs"] if item["book"] == "10p")
    _, prior_blocks = blocks.load(INCOMING)
    incoming_index = next(index for index in range(len(prior_blocks), 0, -1) if prior_blocks[index - 1]["kind"] == "p" and prior_blocks[index - 1]["open"])
    record = {
        "ticket": "STEMROBIN-181",
        "role": "source-author-only",
        "status": "native-author-observations-not-independent-gate",
        "pdf": binding(PDF),
        "incoming_context": {
            **binding(INCOMING),
            "scope": "Terminal text only; no preceding-page source gate or pixels repeated",
            "terminal_body_text": "根据电磁感应定律，在导线框里的感生电动势等于磁通量变化率的负值，即磁通量对时间的导数的负值：",
            "outgoing_block": f"p0059#{incoming_index}",
            "continues_in": "p0060#1",
        },
        "established_book_config": {
            "manifest": binding(manifest),
            "catalog": catalog,
            "pdf_minus_printed_page": 10,
            "reused_no_setup_offset_or_book_audit": True,
        },
        "native_tools": {
            name: binding(TOOLS / name)
            for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
        },
        "profile": binding(profile_path),
        "helper": binding(Path(__file__).resolve()),
        "pages": [],
    }
    for page, expected in EXPECTED_ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/10p/pages/{page:04d}"
        draft = OUT / f"{page:04d}.page.md"
        source = work / "page.png"
        source_binding = binding(source)
        meta, parsed = blocks.load(draft)
        assert meta["render"]["sha256"] == source_binding["sha256"]
        assert meta["source"]["pdf_sha256"] == record["pdf"]["sha256"]
        assert meta["printed_page"] == page - 10
        block_rows = [len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"]) for item in parsed]
        assert block_rows == EXPECTED_BLOCK_ROWS[page], (page, block_rows)
        assert blocks.printed_lines(parsed) == expected
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
                box, snap_info = layout.snap(ink, item["box"])
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
                    "native_snap": snap_info,
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
            details = []
            if page == 63:
                for name, box in (
                    ("p0063-eq2-19-mean-bar", [624, 635, 304, 103]),
                    ("p0063-eq2-20-mean-bar", [706, 878, 176, 104]),
                    ("p0063-eq2-21-mean-bar", [603, 1152, 313, 108]),
                    ("p0063-eq2-22-mean-bar", [612, 1713, 322, 118]),
                ):
                    detail = OUT / "evidence" / f"{name}.png"
                    layout.crop(source, box, detail, pad=0)
                    details.append({"name": name, "source_box_xywh": box, "mechanical_crop_no_enhancement": True, "image": binding(detail)})
            dimensions = list(image.size)
        normalization_deltas, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, changes = normalize.normalize_text(line, profile)
                if line != normalized:
                    normalization_deltas.append({"block": index, "row": row, "before": line, "after": normalized, "changes": changes})
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
            "source_details": details,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}",
                    "kind": item["kind"],
                    "label": item["label"],
                    "owner_exercise": item["owner_exercise"],
                    "open": item["open"],
                    "cont": item["cont"],
                    "samerow": item["samerow"],
                    "physical_rows_before_samerow_adjustment": rows,
                    "raw_math": re.findall(r"\$[^$]*\$", blocks.text_of(item)),
                }
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": normalization_deltas,
            "charset_findings": charset,
            "math_errors": math_errors,
            "math_warnings": math_warnings,
            "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
            "original_written_tasks": sum(item["kind"] == "ex" for item in parsed),
            "footnote_rows": sum(len(item["lines"]) for item in parsed if item["kind"] == "p" and item["label"] == "footnote"),
            "source_pixels_unchanged": binding(source) == source_binding,
        })
    destination.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "author_check": binding(destination),
        "pages": [
            {key: item[key] for key in (
                "pdf_page", "blocks", "author_observed_rows_including_footer",
                "draft_printed_rows", "default_native_count", "configured_native_count",
                "normalizations_needed", "charset_findings", "math_errors", "math_warnings",
            )}
            for item in record["pages"]
        ],
        "figures": [figure for item in record["pages"] for figure in item["source_figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    destination = OUT / "author-freeze.json"
    assert not destination.exists(), "Preserve frozen author package"
    observations = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    verify_bindings(observations)
    verify_bindings(notes)
    assert notes["role"] == "source-author-only"
    assert notes["author_asserts_no_in_flight_writes"]
    for item in observations["pages"]:
        assert item["draft_printed_rows"] == EXPECTED_ROWS[item["pdf_page"]]
        assert not item["normalizations_needed"]
        assert not item["charset_findings"]
        assert not item["math_errors"]
        assert item["source_pixels_unchanged"]
    result = {
        "ticket": "STEMROBIN-181",
        "batch": "D019",
        "role": "source-author-only",
        "status": "frozen-pending-unique-independent-source-gate",
        "scope": {"book": "10p", "pdf_pages": list(EXPECTED_ROWS), "printed_pages": [50, 51, 52, 53]},
        "native_prepare": {"pages": list(EXPECTED_ROWS), "dpi": 300, "once_each_previously_absent": True},
        "pdf": observations["pdf"],
        "incoming_context": observations["incoming_context"],
        "established_book_config": observations["established_book_config"],
        "pages": observations["pages"],
        "author_notes": binding(OUT / "author-notes.json"),
        "author_check": binding(OUT / "author-check.json"),
        "helper": binding(Path(__file__).resolve()),
        "native_tools": observations["native_tools"],
        "counts": {
            "actual_rows_including_footer": list(EXPECTED_ROWS.values()),
            "total_actual_rows_including_footer": sum(EXPECTED_ROWS.values()),
            "blocks": sum(item["blocks"] for item in observations["pages"]),
            "original_written_tasks": sum(item["original_written_tasks"] for item in observations["pages"]),
            "source_figures": [figure["id"] for item in observations["pages"] for figure in item["source_figures"]],
            "footnote_rows": sum(item["footnote_rows"] for item in observations["pages"]),
            "footer_rows": 4,
        },
        "source_boundaries": notes["source_boundaries"],
        "author_image_openings": notes["author_image_openings"],
        "unresolved": notes["unresolved"],
        "author_asserts_no_in_flight_writes": True,
        "no_finalize_vectorize_assemble_or_durable_edits": True,
        "source_gate_or_science_approval": "not-performed",
        "unrelated_10p_gap_and_exhausted_blockers_untouched": True,
    }
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"author_freeze": binding(destination), "counts": result["counts"], "unresolved": result["unresolved"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--freeze", action="store_true")
    args = parser.parse_args()
    freeze() if args.freeze else observe()
