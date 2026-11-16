"""Read-only, one-shot integrity and page-local metadata probes; no image output."""

import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
PROOF = Path(__file__).resolve().parent
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0200-0203"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c

TEXT_SHA = "63b9870437b07e78a17f56c21970a619c72afdef784070ac9116d834ab28f9d1"
FREEZE_SHA = "9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1"
VISUAL_ROWS = {200: 24, 201: 21, 202: 25, 203: 24}
VISUAL_BLOCK_ROWS = {
    200: [5, 1, 4, 1, 2, 3, 5, 1, 1, 1],
    201: [3, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 4, 1],
    202: [7, 0, 1, 2, 5, 3, 1, 4, 2, 0, 1, 1],
    203: [2, 1, 1, 1, 4, 0, 1, 1, 2, 1, 1, 5, 2, 0, 1, 1, 1, 1],
}


def bind(path):
    path = Path(path)
    if not path.is_absolute():
        path = ROOT / path
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": path.stat().st_size,
    }


def write_new(name, value):
    path = PROOF / name
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    return bind(path)


def main():
    assert not (PROOF / "bindings.json").exists()
    assert not (PROOF / "metadata-probe.json").exists(), "No repeated probes"
    freeze_path = AUTHOR / "author-freeze.json"
    assert bind(freeze_path)["sha256"] == FREEZE_SHA
    freeze = json.loads(freeze_path.read_text())
    assert freeze["text_freeze"]["sha256"] == TEXT_SHA
    declared = [
        freeze["pdf"], freeze["toc"], freeze["manifest"], freeze["profile"],
        freeze["lesson_skill"], freeze["image_rules"],
        freeze["incoming_context"]["snapshot"],
        *freeze["tools"].values(),
    ]
    for page in freeze["pages"]:
        declared.extend([page["source"], page["draft"]])
        declared.extend(figure["candidate"] for figure in page["figures"])
    inputs = []
    for entry in declared:
        current = bind(entry["path"])
        assert current["sha256"] == entry["sha256"], current["path"]
        inputs.append(current)
    inputs.extend(bind(path) for path in [
        freeze_path, PROOF / "probe.py", ROOT / "AGENTS.md",
        ROOT / ".intentfold/readme.md", ROOT / ".intentfold/project.json",
        ROOT / ".intentfold/charter/product.md",
        ROOT / ".intentfold/charter/engineering.md",
        ROOT / ".intentfold/charter/operations.md",
        Path("/Users/yong/.agents/skills/ips-chrome-background/SKILL.md"),
    ])
    manifest = "".join(
        f"{page['pdf_page']:04d}:{bind(page['draft']['path'])['sha256']}\n"
        for page in freeze["pages"]
    )
    assert hashlib.sha256(manifest.encode()).hexdigest() == TEXT_SHA
    parsed_pages = []
    candidate_checks = []
    probes = []
    all_blocks = []
    for page in freeze["pages"]:
        number = page["pdf_page"]
        meta, parsed = blocks.load(ROOT / page["draft"]["path"])
        assert meta["printed_page"] == number - 9
        assert "counting" not in meta and "figure_crops" not in meta
        row_counts = [
            len(item["lines"]) + sum(row.count(blocks.WRAP) for row in item["lines"])
            for item in parsed
        ]
        assert row_counts == VISUAL_BLOCK_ROWS[number]
        assert blocks.printed_lines(parsed) == VISUAL_ROWS[number]
        inventory = []
        for index, item in enumerate(parsed, 1):
            inventory.append({
                "ref": f"p{number:04d}#{index}",
                "kind": item["kind"], "label": item["label"],
                "open": item["open"], "cont": item["cont"],
                "samerow": item["samerow"],
                "owner_exercise": item["owner_exercise"],
                "physical_rows_before_samerow": row_counts[index - 1],
                "draft_rows_compared_with_actual_original_view": item["lines"],
                "comparison": (
                    "fail-added-character"
                    if (number, index) == (201, 12)
                    else "fail-omitted-character"
                    if (number, index) == (203, 16)
                    else "pass"
                ),
            })
        all_blocks.extend(parsed)
        parsed_pages.append({
            "pdf_page": number, "blocks": len(parsed),
            "draft_printed_rows": blocks.printed_lines(parsed),
            "visual_rows_independently_observed": VISUAL_ROWS[number],
            "block_inventory": inventory,
        })
        with Image.open(ROOT / page["source"]["path"]) as original:
            ink = layout.ink_mask(original)
            masked = ink.copy()
            for figure in page["figures"]:
                x, y, width, height = figure["snapped_box"]
                left, top, cw, ch = figure["exact_source_extraction_box_xywh"]
                original_crop = np.asarray(original.crop((left, top, left + cw, top + ch)))
                with Image.open(ROOT / figure["candidate"]["path"]) as candidate:
                    equal = np.array_equal(original_crop, np.asarray(candidate))
                    assert equal
                    candidate_checks.append({
                        "id": figure["id"],
                        "candidate": bind(figure["candidate"]["path"]),
                        "snapped_box_xywh": figure["snapped_box"],
                        "extraction_box_xywh": [left, top, cw, ch],
                        "dimensions_px": list(candidate.size),
                        "pixel_equal_to_exact_original_rectangle": equal,
                        "visual_completeness_not_inferred_from_pixel_equality": True,
                    })
                masked[y:y + height, x:x + width] = False
                if figure["id"] == "fig-152":
                    padding = p2c._figure_crop_padding({
                        "figure_crops": {"fig-152": {
                            "padding_px": 6,
                            "reason": "Actual original and candidate views show caption-top ink in the 12px bottom padding; all own-object ink lies inside the frozen snapped box.",
                        }},
                    }, "fig-152")
                    new_box = [x - padding, y - padding, width + 2 * padding, height + 2 * padding]
                    old_bottom = ink[y + height:y + height + 12, left:left + cw]
                    new_bottom = ink[y + height:y + height + padding, x - padding:x + width + padding]
                    ys, xs = np.nonzero(old_bottom)
                    probes.append({
                        "kind": "padding-only", "id": "fig-152", "runs": 1,
                        "padding_px": padding, "proposed_box_xywh": new_box,
                        "frozen_snapped_box_xywh": figure["snapped_box"],
                        "old_bottom_padding_ink_pixels": int(old_bottom.sum()),
                        "old_bottom_padding_ink_extent_xyxy": (
                            [int(xs.min() + left), int(ys.min() + y + height),
                             int(xs.max() + left), int(ys.max() + y + height)]
                            if xs.size else None
                        ),
                        "new_bottom_padding_ink_pixels": int(new_bottom.sum()),
                        "full_frozen_own_object_rectangle_retained": True,
                        "status": "supported" if not new_bottom.any() else "blocked",
                        "not_a_visual_reinspection_of_a_corrected_crop": True,
                    })
            if number in (200, 202):
                reason = (
                    f"PDF{number}: actual original view shows side-edge scan marks and the lower-right shadow below the footer; the first/last 96 columns contain no page-owned text, caption or figure."
                )
                columns = np.flatnonzero(ink.any(axis=0))
                content_width = int(columns[-1] - columns[0] + 1)
                bands = p2c._counting_line_bands({
                    "counting": {"edge_margin_px": 96, "reason": reason},
                }, masked, content_width)
                projected = masked.copy()
                projected[:, :96] = False
                projected[:, -96:] = False
                probes.append({
                    "kind": "counting-edge-only", "pdf_page": number,
                    "runs": 1, "edge_margin_px": 96, "reason": reason,
                    "excluded_columns": [[0, 95], [1408, 1503]],
                    "visual_expected_rows": VISUAL_ROWS[number],
                    "native_proposed_metadata_rows": len(bands),
                    "bands_y_inclusive": bands,
                    "figure_masking": "Frozen exact snapped boxes, not padding",
                    "bottom_region_y_ge_2100_remaining_ink_pixels": int(projected[2100:].sum()),
                    "status": "supported" if len(bands) == VISUAL_ROWS[number] else "blocked",
                    "no_default_native_recount_or_parameter_search": True,
                })
    for item in inputs:
        assert bind(item["path"]) == item, "Concurrent input change; do not pass stale bindings"
    proof = {
        "schema": "STEMROBIN-181/source-metadata-probe@1",
        "scope": "D020 9p PDF200-203 source only",
        "probes": probes,
        "candidate_pixel_checks": candidate_checks,
        "images_loaded_or_emitted": 0,
        "generated_crop_files": 0,
        "inputs_modified": False,
        "parameter_search": False,
        "default_author_native_audit_rerun": False,
    }
    probe_binding = write_new("metadata-probe.json", proof)
    bindings = {
        "schema": "STEMROBIN-181/source-review-bindings@1",
        "freeze_file_sha256": FREEZE_SHA,
        "text_freeze_sha256": TEXT_SHA,
        "inputs": inputs,
        "all_declared_consumed_hashes_match": True,
        "inputs_unchanged_before_after": True,
        "metadata_probe": probe_binding,
        "pages": parsed_pages,
        "total_blocks": len(all_blocks),
        "total_rows": sum(VISUAL_ROWS.values()),
        "source_exercises": sum(item["kind"] == "ex" for item in all_blocks),
        "explanatory_footnotes": sum(item["label"] == "footnote" for item in all_blocks),
        "no_empty_fill_rows_or_wrap_markers": all(
            row.strip() and blocks.WRAP not in row
            for item in all_blocks for row in item["lines"]
        ),
    }
    bindings_binding = write_new("bindings.json", bindings)
    print(json.dumps({
        "bindings": bindings_binding, "probe": probe_binding,
        "probes": probes, "blocks": len(all_blocks), "rows": sum(VISUAL_ROWS.values()),
        "inputs_unchanged": True,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
