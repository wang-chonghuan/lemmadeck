from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
HERE = ROOT / ".tmp/stemrobin-184-resume/n13-source56-count-diagnosis"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
sys.dont_write_bytecode = True

import blocks
import layout
import numpy as np
from PIL import Image
from scipy import ndimage


def read_json(relative: str):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def bbox(mask: np.ndarray, y_offset: int = 0):
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return None
    return [
        int(xs.min()),
        int(ys.min()) + y_offset,
        int(xs.max() - xs.min() + 1),
        int(ys.max() - ys.min() + 1),
    ]


def inside_pixels(mask: np.ndarray, box: list[int]):
    x, y, w, h = box
    return int(np.count_nonzero(mask[y:y + h, x:x + w]))


inputs = json.loads((HERE / "inputs.json").read_text(encoding="utf-8"))
for entry in inputs["inputs"]:
    assert layout.sha256_file(ROOT / entry["path"]) == entry["sha256"], entry["path"]

audit = read_json(".tmp/stemrobin-184-resume/n13-source56-finalize-first/native-outputs/audit.json")
page = read_json(".tmp/stemrobin-184-resume/n13-source56-finalize-first/native-outputs/page.json")
inventory = read_json(".tmp/stemrobin-184-resume/n13-source56-independent/source-inventory.json")
prepared = read_json(".tmp/ld-s10y-lesson/9c/pages/0056/layout.json")
source = ROOT / ".tmp/ld-s10y-lesson/9c/pages/0056/page.png"

# Reproduce only the official counting stage, never its finalizer or crop stage.
with Image.open(source) as image:
    ink = layout.ink_mask(image)
masked = ink.copy()
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[max(0, y):y + h, max(0, x):x + w] = False
assert audit["count_exclusions"] == []
masked = layout.counting_ink(masked, audit["count_exclusions"])
columns = np.flatnonzero(ink.any(axis=0))
content_width = int(columns[-1] - columns[0] + 1) if len(columns) else ink.shape[1]
bands = layout.line_bands(masked, content_width)
logical = blocks.printed_lines(page["blocks"])
assert len(bands) == audit["lines_printed"] == 21
assert logical == audit["lines_md"] == 20

# This probe mirrors the API's existing edge clearing; it is not a new count mask.
edge = max(1, int(ink.shape[1] * 0.01))
probe = masked.copy()
probe[:, :edge] = False
probe[:, -edge:] = False
rows = inventory["printed_lines"]
assert len(rows) == 20
mapping, unmatched, used = [], [], set()
for sequence, (a, b) in enumerate(bands, 1):
    band_mask = np.zeros_like(probe)
    band_mask[a:b + 1] = probe[a:b + 1]
    candidates = []
    for row in rows:
        pixels = inside_pixels(band_mask, row["box"])
        if pixels:
            candidates.append({
                "source_line_id": row["id"],
                "frozen_owner": row["owner"],
                "frozen_box": row["box"],
                "ink_pixels_in_frozen_box": pixels,
            })
    candidates.sort(key=lambda candidate: candidate["ink_pixels_in_frozen_box"], reverse=True)
    winner = candidates[0] if candidates else None
    row_counts = probe[a:b + 1].sum(axis=1)
    entry = {
        "native_band_id": f"N{sequence:02d}",
        "y_inclusive": [int(a), int(b)],
        "height": int(b - a + 1),
        "probe_ink_bbox": bbox(band_mask),
        "probe_ink_pixels": int(band_mask.sum()),
        "max_probe_row_ink_pixels": int(row_counts.max()),
        "frozen_row_candidates": candidates,
        "assigned_source_line": winner["source_line_id"] if winner else None,
        "ownership_basis": "Measured band pixels inside frozen coarse text/folio boxes, not arithmetic, glyph guessing, or new image review.",
    }
    mapping.append(entry)
    if winner:
        assert winner["source_line_id"] not in used, "No forced duplicate row assignment"
        used.add(winner["source_line_id"])
        continue

    labels, component_count = ndimage.label(band_mask)
    component_bounds = ndimage.find_objects(labels)
    components = []
    for component_id, bounds in enumerate(component_bounds, 1):
        if bounds is None:
            continue
        ys, xs = bounds
        pixels = int(np.count_nonzero(labels[bounds] == component_id))
        components.append({
            "id": component_id,
            "box": [int(xs.start), int(ys.start), int(xs.stop - xs.start), int(ys.stop - ys.start)],
            "pixels": pixels,
        })
    components.sort(key=lambda component: component["pixels"], reverse=True)
    known_ink = []
    for observation in inventory["non_body_ink"]:
        covered = inside_pixels(band_mask, observation["box"])
        if covered:
            known_ink.append({
                "frozen_id": observation["id"],
                "frozen_box": observation["box"],
                "frozen_appearance": observation["appearance"],
                "frozen_classification": observation["classification"],
                "covered_probe_ink_pixels": covered,
                "covers_all_probe_band_ink": covered == entry["probe_ink_pixels"],
                "new_origin_claim": False,
            })
    unmatched.append({
        **entry,
        "probe_components": components,
        "probe_component_count": component_count,
        "frozen_non_body_ink_overlaps": known_ink,
        "original_untrimmed_mask_ink_bbox": bbox(masked[a:b + 1], a),
        "original_untrimmed_mask_ink_pixels": int(masked[a:b + 1].sum()),
    })

report = {
    "schema": "stemrobin-184/source56-native-count-diagnostic@1",
    "recorded_utc": datetime.now(timezone.utc).isoformat(),
    "diagnostic_only": True,
    "official_finalize_invocations": 0,
    "api_calls": ["layout.ink_mask", "layout.counting_ink(existing [])", "layout.line_bands", "blocks.printed_lines"],
    "source_sha256": layout.sha256_file(source),
    "content_width": content_width,
    "prepared_content_width": prepared["content_width"],
    "native_figure_mask": audit["figures"],
    "native_count_reproduced": len(bands),
    "native_logical_count": logical,
    "bands": mapping,
    "unmatched_bands": unmatched,
    "unique_mapped_logical_rows": len(used),
    "unmapped_frozen_rows": [row["id"] for row in rows if row["id"] not in used],
    "probe_limits": {
        "native_edge_clear_width_px_each_side": edge,
        "probe_is_not_exact_private_postfilter_ink": True,
        "description": "Band intervals come from the unmodified official API. Spatial ownership metrics use its input counting mask with only the existing edge clearing mirrored; deeper private filtering is not instrumented.",
        "counter_changed": False,
        "new_count_exclusions": False,
        "new_crop_or_image_file": False,
    },
    "visual_images": {"new_context_opens": 0, "cumulative_context_usage": "1/4"},
    "source_origin_or_math_verdict": "NOT_PERFORMED",
    "stop": True,
}
print(json.dumps(report, ensure_ascii=False, indent=2))
