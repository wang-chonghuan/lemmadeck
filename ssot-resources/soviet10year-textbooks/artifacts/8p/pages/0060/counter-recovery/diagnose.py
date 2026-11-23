"""Read-only measurements of the original separator classifier."""
import importlib.util
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OWN = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location(
    "layout", ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
)
layout = importlib.util.module_from_spec(spec)
sys.modules["layout"] = layout
spec.loader.exec_module(layout)

with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png") as image:
    original = layout.ink_mask(image)
ink = original.copy()
edge = max(1, int(ink.shape[1] * 0.01))
ink[:, :edge] = False
ink[:, -edge:] = False
raw = layout._row_fragments(ink, 1640)
line_h = int(np.median([b - a + 1 for a, b in raw]))
components, _ = layout.ndimage.label(ink)
bounds_list = layout.ndimage.find_objects(components)
heights = [
    r.stop - r.start
    for bounds in bounds_list if bounds is not None
    for r, c in [bounds]
    if 0.25 * line_h <= r.stop - r.start <= 1.3 * line_h
    and 0.2 * line_h <= c.stop - c.start <= 1.3 * line_h
]
glyph_h = float(np.percentile(heights, 75))
a, b = (1960, 1966)
index = raw.index((a, b))
ids = np.unique(components[a:b + 1])
ids = [int(i) for i in ids if i]
measurements = {
    "live_sha256": layout.sha256_file(Path(spec.origin)),
    "image_sha256": layout.sha256_file(
        ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png"
    ),
    "raw": raw,
    "actual_bands": layout.line_bands(original, 1640),
    "line_h": line_h,
    "glyph_h": glyph_h,
    "rule": [a, b],
    "rule_ids": ids,
    "rule_components": [
        {"id": cid, "rows": [r.start, r.stop], "columns": [c.start, c.stop],
         "ink": int((components[r, c] == cid).sum())}
        for cid in ids for r, c in [bounds_list[cid - 1]]
    ],
}
if len(ids) == 1:
    r, c = bounds_list[ids[0] - 1]
    prev_a, prev_b = raw[index - 1]
    next_a, next_b = raw[index + 1]
    neighbors = []
    for top, bottom in ((prev_a, prev_b), (next_a, next_b)):
        glyphs = [
            (r1, c1) for bounds in bounds_list if bounds is not None
            for r1, c1 in [bounds]
            if top <= r1.start and r1.stop <= bottom + 1
            and 0.5 * glyph_h <= r1.stop - r1.start <= 1.35 * glyph_h
            and 0.4 * glyph_h <= c1.stop - c1.start <= 1.3 * glyph_h
        ]
        neighbors.append(glyphs)
    body, small = neighbors
    body_h = float(np.median([r1.stop - r1.start for r1, _ in body])) if body else glyph_h
    small_h = float(np.median([r1.stop - r1.start for r1, _ in small])) if small else None
    columns = [
        c1 for bounds in bounds_list if bounds is not None
        for r1, c1 in [bounds]
        if a - 12 * body_h <= r1.start and r1.stop <= a
        and 0.75 * body_h <= r1.stop - r1.start <= 1.35 * body_h
        and 0.2 * body_h <= c1.stop - c1.start <= 1.3 * body_h
        and 0.05 * ink.shape[1] <= c1.start
        and c1.stop <= 0.95 * ink.shape[1]
    ]
    measurements.update({
        "previous_raw": [prev_a, prev_b],
        "next_raw": [next_a, next_b],
        "body_glyphs": len(body),
        "small_glyphs": len(small),
        "body_h": body_h,
        "small_h": small_h,
        "body_edges": [min(col.start for col in columns), max(col.stop for col in columns)] if columns else [],
        "predicates": {
            "thin": b - a + 1 <= 0.2 * glyph_h,
            "wide": c.stop - c.start >= 8 * glyph_h,
            "exact_component_rows": a == r.start and r.stop == b + 1,
            "gap_above": 0.6 * glyph_h <= a - prev_b - 1 <= 4 * glyph_h,
            "gap_below": 0.3 * glyph_h <= next_a - b - 1 <= 4 * glyph_h,
            "five_neighbor_glyphs": min(len(body), len(small)) >= 5,
            "body_type": 0.75 * glyph_h <= body_h <= 1.35 * glyph_h,
            "smaller_type": small_h is not None and 0.55 * body_h <= small_h <= 0.82 * body_h,
            "left_alignment": bool(columns) and abs(c.start - min(col.start for col in columns)) <= 0.25 * body_h,
            "right_alignment": bool(columns) and abs(c.stop - max(col.stop for col in columns)) <= 0.25 * body_h,
            "small_span": max(c1.stop for _, c1 in small) - min(c1.start for _, c1 in small)
            >= 2 * (c.stop - c.start),
        },
    })
text = json.dumps(measurements, indent=2)
(OWN / "diagnosis.json").write_text(text + "\n")
print(text)
