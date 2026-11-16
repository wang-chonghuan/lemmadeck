"""Read-only bindings, crop equality, and one fixed native probe per affected page."""

import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
FREEZE = BASE / "9p-next-source-0208-0211/author-freeze.json"
OUTPUT = BASE / "source-review-9p-0208-0211-proof.json"
EXPECTED_FREEZE = "242f28dd4e675c1a6abbfcbdc6c091bd46f58b2f7e38a59f7e29d80f3ce56f47"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import blocks
import layout
import p2c

AUTHORIZED_COUNTING = {
    208: {
        "edge_margin_px": 90,
        "reason": (
            "D021 independently viewed p0208 original once: x=0..89 and "
            "x=1414..1503 contain page-border ink, isolated scanning specks "
            "and the lower-right triangular shadow, not printed text or "
            "figures. The extra y=2145..2174 band lies below footer "
            "y=2018..2044. Exclude only these side strips in the counting "
            "copy; retain all source pixels, text rows and crop geometry."
        ),
    },
    210: {
        "edge_margin_px": 90,
        "reason": (
            "D021 independently viewed p0210 original once: x=0..89 and "
            "x=1414..1503 contain page-border ink, isolated scanning specks "
            "and the lower-right triangular shadow, not printed text or "
            "figures. Figure163 ends at x=1395 and its padded crop at "
            "x=1407, inside the retained region. The extra y=2150..2180 "
            "band lies below footer y=2007..2034. Exclude only these side "
            "strips in the counting copy; retain source pixels and crops."
        ),
    },
}
INDEPENDENT_ROWS = {208: 25, 209: 29, 210: 19, 211: 24}
INDEPENDENT_BLOCK_ROWS = {
    208: [3, 5, 5, 1, 1, 1, 2, 3, 3, 1],
    209: [4, 4, 1, 4, 0, 1, 3, 2, 1, 1, 1, 6, 1, 1],
    210: [1, 1, 5, 0, 0, 1, 1, 3, 4, 3, 1],
    211: [2, 1, 3, 6, 0, 1, 1, 1, 4, 1, 2, 1, 1, 1],
}


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def collect_bindings(value, found):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
            prior = found.setdefault(value["path"], value["sha256"])
            assert prior == value["sha256"], value["path"]
        for item in value.values():
            collect_bindings(item, found)
    elif isinstance(value, list):
        for item in value:
            collect_bindings(item, found)


def main():
    assert not OUTPUT.exists(), "Proof is write-once; never repeat the native probes"
    assert sha(FREEZE) == EXPECTED_FREEZE
    freeze = json.loads(FREEZE.read_text())
    bindings = {}
    collect_bindings(freeze, bindings)
    for path, expected in bindings.items():
        assert sha(ROOT / path) == expected, f"Changed binding: {path}"
    results, figures, counts = [], [], []
    for page in freeze["pages"]:
        number = page["pdf_page"]
        meta, parsed = blocks.load(ROOT / page["draft"]["path"])
        raw_rows = [
            len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"])
            for block in parsed
        ]
        assert raw_rows == INDEPENDENT_BLOCK_ROWS[number]
        assert blocks.printed_lines(parsed) == INDEPENDENT_ROWS[number]
        assert meta.get("counting") is None
        for index, block in enumerate(parsed, 1):
            frozen = page["block_inventory"][index - 1]
            for key in ("kind", "label", "open", "cont", "samerow", "owner_exercise"):
                assert block.get(key) == frozen.get(key)
            assert block["lines"] == frozen["source_lines"]
        results.append({
            "pdf_page": number,
            "draft": page["draft"],
            "printed_rows": blocks.printed_lines(parsed),
            "block_rows_before_samerow": raw_rows,
            "flags_and_source_lines_match_frozen_bindings": True,
        })
        if not page["figures"] and number not in AUTHORIZED_COUNTING:
            continue
        with Image.open(ROOT / page["source"]["path"]) as source:
            assert list(source.size) == page["dimensions_px"]
            pixels = np.asarray(source)
            for figure in page["figures"]:
                x, y, width, height = figure["exact_source_extraction_box_xywh"]
                with Image.open(ROOT / figure["candidate"]["path"]) as candidate:
                    candidate_pixels = np.asarray(candidate)
                    region = pixels[y:y + height, x:x + width]
                    assert list(candidate.size) == [width, height]
                    assert candidate.mode == source.mode
                    changed = int(np.count_nonzero(candidate_pixels != region))
                    assert changed == 0, figure["id"]
                figures.append({
                    "id": figure["id"],
                    "source": page["source"],
                    "candidate": figure["candidate"],
                    "source_ref": figure["block"],
                    "rough_box_xywh": figure["rough_box"],
                    "snapped_box_xywh": figure["snapped_box"],
                    "padding_px": figure["padding_px"],
                    "exact_source_extraction_box_xywh": [x, y, width, height],
                    "candidate_dimensions_px": [width, height],
                    "source_mode": source.mode,
                    "different_channel_values": changed,
                    "exact_source_pixel_equality": True,
                })
            if number in AUTHORIZED_COUNTING:
                ink = layout.ink_mask(source)
                masked = ink.copy()
                for figure in page["figures"]:
                    x, y, width, height = figure["snapped_box"]
                    masked[y:y + height, x:x + width] = False
                columns = np.flatnonzero(ink.any(axis=0))
                content_width = int(columns[-1] - columns[0] + 1)
                configured = dict(meta)
                configured["counting"] = AUTHORIZED_COUNTING[number]
                bands = p2c._counting_line_bands(configured, masked, content_width)
                counts.append({
                    "pdf_page": number,
                    "native_entrypoint": "p2c._counting_line_bands -> layout.line_bands",
                    "requested_symbol_count_printed_lines_exists": False,
                    "calls_this_review": 1,
                    "metadata_only": True,
                    "configured_counting": AUTHORIZED_COUNTING[number],
                    "retained_x_interval_half_open": [90, 1414],
                    "content_width_px": content_width,
                    "figure_masks_xywh": [f["snapped_box"] for f in page["figures"]],
                    "author_frozen_native_count": page["native_count"],
                    "independent_expected_rows": INDEPENDENT_ROWS[number],
                    "native_count": len(bands),
                    "native_bands": bands,
                    "matches_independent_rows": len(bands) == INDEPENDENT_ROWS[number],
                    "extra_below_footer_band_absent": not any(a >= 2100 for a, b in bands),
                    "text_and_source_metadata_written": False,
                })
    for path, expected in bindings.items():
        assert sha(ROOT / path) == expected, f"Binding changed during proof: {path}"
    assert sha(FREEZE) == EXPECTED_FREEZE
    result = {
        "schema": "STEMROBIN-181/source-review-proof@1",
        "ticket": "STEMROBIN-181",
        "reviewer": "D021",
        "freeze": {"path": str(FREEZE.relative_to(ROOT)), "sha256": EXPECTED_FREEZE},
        "helper": {"path": str(Path(__file__).relative_to(ROOT)), "sha256": sha(__file__)},
        "all_unique_frozen_bindings_verified_before_and_after": len(bindings),
        "binding_sha256": bindings,
        "pages": results,
        "figures": figures,
        "configured_counter_probes": counts,
        "native_counter_calls_per_page": {"208": 1, "209": 0, "210": 1, "211": 0},
        "visual_image_opens_in_helper": 0,
        "images_emitted_or_saved": 0,
        "image_crop_or_snap_calls": 0,
        "no_top_margin_or_sweep": True,
        "only_output_written": str(OUTPUT.relative_to(ROOT)),
        "probes_match": all(item["matches_independent_rows"] for item in counts),
    }
    with OUTPUT.open("x", encoding="utf-8") as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    print(json.dumps({
        "proof": str(OUTPUT),
        "sha256": sha(OUTPUT),
        "bindings_verified": len(bindings),
        "native_probes": [
            {"page": c["pdf_page"], "rows": c["native_count"],
             "expected": c["independent_expected_rows"], "matches": c["matches_independent_rows"]}
            for c in counts
        ],
        "exact_pixel_crops": [item["id"] for item in figures],
    }, indent=2))


if __name__ == "__main__":
    main()
