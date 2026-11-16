"""One scoped source-author check and freeze, without durable writes or a gate."""

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

EXPECTED_ROWS = {184: 24, 185: 25, 186: 22, 187: 25}
EXPECTED_BLOCK_ROWS = {
    184: [3, 1, 4, 3, 3, 3, 1, 1, 3, 1, 1],
    185: [1, 1, 3, 1, 2, 4, 1, 2, 2, 1, 1, 2, 3, 1],
    186: [1, 4, 2, 1, 2, 1, 2, 1, 1, 1, 1, 4, 1],
    187: [3, 2, 1, 2, 4, 4, 1, 1, 3, 2, 1, 1],
}
DETAILS = {
    184: [
        ("0184-split-energy-formula.png", [140, 885, 1330, 1170]),
        ("0184-footer-and-edge-shadow.png", [0, 2010, 1504, 2289]),
        ("0184-potential-definition.png", [140, 1240, 1330, 1518]),
    ],
    185: [
        ("0185-work-formula.png", [140, 690, 1290, 825]),
        ("0185-difference-emphasis.png", [140, 840, 1290, 1320]),
        ("0185-definition-emphasis.png", [140, 1640, 1290, 1785]),
    ],
    186: [
        ("0186-unit-definition-and-conversion.png", [200, 230, 1390, 990]),
        ("0186-equation8-28.png", [200, 1310, 1380, 1500]),
        ("0186-footer-and-edge-shadow.png", [0, 1995, 1504, 2289]),
    ],
    187: [
        ("0187-superposition-formula.png", [130, 1145, 1300, 1510]),
        ("0187-energy-subscript-and-outgoing.png", [125, 1790, 1300, 2000]),
    ],
}
HIGH_DPI_BOXES = {
    185: [420, 695, 900, 770],
    187: [455, 1840, 805, 1915],
}


def binding(path):
    path = Path(path).resolve()
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
    assert not destination.exists(), "The one source-author check is already recorded"
    assert not (OUT / "author-freeze.json").exists(), "Do not overwrite a frozen package"
    profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_path)
    incoming = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0180-0183/0183.page.md"
    _, prior = blocks.load(incoming)
    terminal = next(item for item in reversed(prior) if item["kind"] == "p")
    record = {
        "ticket": "STEMROBIN-181",
        "role": "source-author-only",
        "status": "native-author-observations-not-independent-gate",
        "native_author_check_invocations": 1,
        "pdf": binding(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "incoming_context": {
            "draft": binding(incoming),
            "scope": "Only terminal text, not previous-page pixels or an independent review",
            "terminal_body_text": blocks.text_of(terminal),
            "terminal_open": terminal["open"],
            "same_unit_continuation": "unit73",
            "same_paragraph_continuation": False,
        },
        "profile": binding(profile_path),
        "native_tools": {
            name: binding(TOOLS / name)
            for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
        },
        "helper": binding(Path(__file__)),
        "pages": [],
    }
    for page, expected in EXPECTED_ROWS.items():
        prepared = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        draft = OUT / f"{page:04d}.page.md"
        source = prepared / "page.png"
        source_before = binding(source)
        meta, parsed = blocks.load(draft)
        assert meta["source"]["pdf_sha256"] == record["pdf"]["sha256"]
        assert meta["render"]["sha256"] == source_before["sha256"]
        assert meta["printed_page"] == page - 9
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in parsed
        ]
        assert block_rows == EXPECTED_BLOCK_ROWS[page], (page, block_rows)
        assert not any(item["kind"] in ("fig", "cap", "ex", "exhead") for item in parsed)
        assert not any(item["label"] == "footnote" for item in parsed)
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            default = layout.line_bands(ink, content_width)
            configured = p2c._counting_line_bands(meta, ink, content_width)
            counting_path = OUT / "evidence" / f"{page:04d}-counting-copy.png"
            counting = ink.copy()
            edge = meta.get("counting", {}).get("edge_margin_px")
            if edge is not None:
                counting[:, :edge] = False
                counting[:, -edge:] = False
            counting_path.parent.mkdir(parents=True, exist_ok=True)
            Image.fromarray((~counting).astype("uint8") * 255).save(counting_path)
            dimensions = list(image.size)
        normalization_deltas, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, changes = normalize.normalize_text(line, profile)
                if normalized != line:
                    normalization_deltas.append({"block": index, "row": row, "changes": changes})
            text = blocks.text_of(item)
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
            charset.extend({"block": index, **entry} for entry in normalize.check_charset(text, profile))
        errors, warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
        details = []
        for name, box in DETAILS[page]:
            crop = OUT / "evidence" / name
            with Image.open(source) as image, Image.open(crop) as candidate:
                expected_crop = image.crop(tuple(box))
                assert candidate.size == expected_crop.size
                assert candidate.tobytes() == expected_crop.tobytes(), name
            details.append({
                **binding(crop),
                "original300dpi_box_xyxy": box,
                "actuallyOpened": True,
                "pixels_equal_exact_source_crop": True,
            })
        high_dpi = None
        if page in HIGH_DPI_BOXES:
            box = HIGH_DPI_BOXES[page]
            rendered = OUT / "evidence" / f"highdpi-{page:04d}" / "page600.png"
            crop = OUT / "evidence" / f"{page:04d}-formula-subscript600dpi.png"
            with Image.open(rendered) as image, Image.open(crop) as candidate:
                assert candidate.tobytes() == image.crop(tuple(2 * value for value in box)).tobytes()
                high_dimensions = list(image.size)
            high_dpi = {
                "pdf_page": page,
                "pdf": record["pdf"],
                "mechanical_render": binding(rendered),
                "dimensions_px": high_dimensions,
                "dpi": 600,
                "crop": binding(crop),
                "original300dpi_box_xyxy": box,
                "render600dpi_box_xyxy": [2 * value for value in box],
                "coordinate_scale": 2,
                "actuallyOpened": True,
                "no_beautification_or_glyph_invention": True,
            }
        record["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": binding(draft),
            "source": source_before,
            "grid": binding(prepared / "page.grid.png"),
            "prepare_layout": binding(prepared / "layout.json"),
            "prepare_template": binding(prepared / "page.template.md"),
            "dimensions_px": dimensions,
            "actual_grid_opened_individually_original_resolution": True,
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
            "counting_copy": binding(counting_path),
            "source_crop_inventory": [],
            "source_crop_audit": "No printed figures/tables/captions on this page; no crop candidates or exclusions invented",
            "source_detail_evidence": details,
            "high_dpi_detail": high_dpi,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}",
                    "kind": item["kind"],
                    "label": item["label"],
                    "open": item["open"],
                    "cont": item["cont"],
                    "samerow": item["samerow"],
                    "physical_printed_rows": rows,
                }
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": normalization_deltas,
            "charset_findings": charset,
            "math_errors": errors,
            "math_warnings": warnings,
            "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
            "source_pixels_unchanged": binding(source) == source_before,
            "author_notes": meta["notes"],
        })
    destination.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "author_check": binding(destination),
        "pages": [
            {key: page[key] for key in (
                "pdf_page", "blocks", "author_observed_rows_including_footer",
                "draft_printed_rows", "default_native_count", "configured_native_count",
                "normalizations_needed", "charset_findings", "math_errors", "math_warnings",
            )}
            for page in record["pages"]
        ],
    }, ensure_ascii=False, indent=2))


def freeze():
    destination = OUT / "author-freeze.json"
    assert not destination.exists(), "Do not overwrite the frozen author snapshot"
    check_path, notes_path = OUT / "author-check.json", OUT / "author-notes.json"
    observations = json.loads(check_path.read_text())
    notes = json.loads(notes_path.read_text())
    verify_bindings(observations)
    verify_bindings(notes)
    assert notes["role"] == "source-author-only"
    assert notes["author_asserts_no_in_flight_writes"]
    assert observations["native_author_check_invocations"] == 1
    for page in observations["pages"]:
        assert page["draft_printed_rows"] == EXPECTED_ROWS[page["pdf_page"]]
        assert not page["normalizations_needed"]
        assert not page["charset_findings"]
        assert not page["math_errors"]
        assert page["source_pixels_unchanged"]
    result = {
        "ticket": "STEMROBIN-181",
        "role": "source-author-only",
        "status": "frozen-pending-unique-independent-source-gate",
        "scope": {"book": "9p", "pdf_pages": list(EXPECTED_ROWS), "printed_pages": [175, 176, 177, 178]},
        "author_asserts_no_in_flight_writes": True,
        "native_prepare": {
            "prepared_once_by_main": True,
            "reused_existing_prepared_pages": list(EXPECTED_ROWS),
            "author_prepare_calls": 0,
        },
        "pdf": observations["pdf"],
        "incoming_context": observations["incoming_context"],
        "pages": observations["pages"],
        "author_notes": binding(notes_path),
        "author_check": binding(check_path),
        "helper": binding(Path(__file__)),
        "native_tools": observations["native_tools"],
        "counts": {
            "actual_rows_including_footer": list(EXPECTED_ROWS.values()),
            "total_actual_rows_including_footer": sum(EXPECTED_ROWS.values()),
            "blocks": sum(page["blocks"] for page in observations["pages"]),
            "original_written_tasks": 0,
            "source_figures": [],
            "captions": 0,
            "footnote_rows": 0,
            "footer_rows": 4,
            "math_fragments": sum(page["math_fragments"] for page in observations["pages"]),
        },
        "source_boundaries": notes["source_boundaries"],
        "unresolved": notes["unresolved"],
        "printed_math_observations_not_modern_errata": notes["printed_math_observations_not_modern_errata"],
        "counter_blockers": [
            {"pdf_page": page["pdf_page"], "actual": page["author_observed_rows_including_footer"],
             "native": page["configured_native_count"]}
            for page in observations["pages"] if not page["native_count_matches_author_expectation"]
        ],
        "source_gate_or_science_approval": "not-performed",
        "no_finalize_vectorize_assemble_or_durable_edits": True,
        "retention_or_rebind_helpers_executed": False,
    }
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"author_freeze": binding(destination), "counts": result["counts"],
                      "counter_blockers": result["counter_blockers"], "unresolved": result["unresolved"]},
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--freeze", action="store_true")
    args = parser.parse_args()
    freeze() if args.freeze else observe()
