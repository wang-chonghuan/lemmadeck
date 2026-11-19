import json
import inspect
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import layout
import numpy as np
from PIL import Image

results = []
source, first_line = inspect.getsourcelines(layout.line_bands)
boundary_line = first_line + next(
    index for index, line in enumerate(source)
    if line.strip() == "not separate_full_row"
)
for page, content_width, target in [
    (261, 1457, (1542, 1590)),
    (264, 1486, (238, 293)),
]:
    image_path = Path(f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png")
    ink = layout.ink_mask(Image.open(image_path))
    observed = []

    def trace(frame, event, arg):
        if (
            frame.f_code.co_name == "line_bands"
            and event == "line"
            and frame.f_lineno == boundary_line
        ):
            values = frame.f_locals
            if (values.get("prev_a"), values.get("a")) == target:
                a, split, b = values["prev_a"], values["a"], values["b"]
                glyph_h = values["glyph_h"]
                mask = values["ink"]
                removed_y = np.flatnonzero((ink & ~mask)[a:b + 1].any(axis=1)) + a
                observed.append({
                    "bands": [[a, values["prev_b"]], [split, b]],
                    "glyphHeight": glyph_h,
                    "lineHeight": values["line_h"],
                    "gap": split - values["prev_b"],
                    "widths": [int(value) for value in values["widths"]],
                    "fractionSpill": bool(values["fraction_spill"]),
                    "radicalOverbarSpill": bool(values["radical_overbar_spill"]),
                    "separateFullRow": bool(values["separate_full_row"]),
                    "supportedFractionAcrossSplit": bool(
                        layout._fraction_across_split(mask, a, split, b, glyph_h)
                    ),
                    "singleFractionRow": bool(
                        layout._single_fraction_row(mask, a, b, glyph_h)
                    ),
                    "removedInkRowsInsideTarget": [
                        [int(top), int(bottom)] for top, bottom in
                        layout._merge_close([(int(y), int(y)) for y in removed_y], 1)
                    ],
                    "rawTargetRows": [
                        [int(top), int(bottom)] for top, bottom in values["raw"]
                        if top <= b and bottom >= a
                    ],
                    "supportingTargetRows": [
                        [int(top), int(bottom)] for top, bottom in values["supporting_rows"]
                        if top <= b and bottom >= a
                    ],
                })
        return trace

    sys.settrace(trace)
    try:
        bands = layout.line_bands(ink, content_width)
    finally:
        sys.settrace(None)
    results.append({
        "page": page,
        "source": {"path": str(image_path), "sha256": layout.sha256_file(image_path)},
        "layoutSha256": layout.sha256_file(Path(layout.__file__)),
        "detectedRows": len(bands),
        "boundaryLineObserved": boundary_line,
        "targetPairObserved": bool(observed),
        "observations": observed,
        "imagePayloadsOpened": 0,
        "sourceReviewOrCounterEdit": False,
    })
print(json.dumps(results, indent=2))
