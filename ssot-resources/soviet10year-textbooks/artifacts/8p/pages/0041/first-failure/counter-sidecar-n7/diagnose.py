import hashlib
import importlib.util
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
SCRATCH = ROOT / ".tmp/180-7-n7-counter"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0041"
SOURCE = ROOT / ".tmp/ld-s10y-lesson/8p/pages/0041/page.png"


def load_layout(path):
    spec = importlib.util.spec_from_file_location("counter_layout", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def page_input():
    sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
    import p2c

    audit = json.loads((PAGE / "first-failure/audit.json").read_text())
    _, blocks = p2c.B.parse((PAGE / "first-failure/page.md").read_text())
    with Image.open(SOURCE) as image:
        ink = p2c.layout.ink_mask(image)
    masked, regions, errors = p2c._counting_mask(ink, audit["figures"], blocks)
    assert not errors, errors
    xs = np.flatnonzero(ink.any(axis=0))
    return masked, int(xs[-1] - xs[0] + 1), blocks, regions


def bindings():
    paths = [
        ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py",
        ROOT / ".claude/skills/ld-s10y-lesson/tests/test_layout.py",
        ROOT / ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        SOURCE,
        ROOT / ".tmp/ld-s10y-lesson/8p/pages/0041/page.grid.png",
        ROOT / ".tmp/180-7-n7-source-author/author.md",
        ROOT / ".tmp/180-7-n7-source-author/0041.diagnosis.json",
    ]
    paths.extend(p for p in PAGE.rglob("*") if p.is_file())
    return {
        str(path.relative_to(ROOT)): {
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "bytes": path.stat().st_size,
        }
        for path in sorted(paths)
    }


def main():
    if Path.cwd() != ROOT:
        raise SystemExit("Unexpected working directory")
    layout = load_layout(SCRATCH / "layout.baseline.py")
    ink, width, blocks, regions = page_input()
    edge = max(1, int(ink.shape[1] * 0.01))
    ink[:, :edge] = False
    ink[:, -edge:] = False
    raw = layout._row_fragments(ink, width)
    line_h = int(np.median([b - a + 1 for a, b in raw]))
    components, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(components)
    glyphs = [
        rows.stop - rows.start
        for item in bounds if item is not None
        for rows, cols in [item]
        if 0.25 * line_h <= rows.stop - rows.start <= 1.3 * line_h
        and 0.2 * line_h <= cols.stop - cols.start <= 1.3 * line_h
    ]
    glyph_h = float(np.percentile(glyphs, 75))
    clusters, _ = ndimage.label(ndimage.binary_closing(
        ink, structure=np.ones((3, 3), dtype=bool)
    ))
    margin = []
    for item in ndimage.find_objects(clusters):
        if item is None:
            continue
        rows, cols = item
        if cols.stop > 0.05 * ink.shape[1]:
            continue
        height, span = rows.stop - rows.start, cols.stop - cols.start
        area = int(np.count_nonzero(ink[item]))
        if area < 5:
            continue
        margin.append({
            "box": [cols.start, rows.start, span, height],
            "area": area,
            "density": area / (span * height),
            "holes": int(np.count_nonzero(
                ndimage.binary_fill_holes(clusters[item] > 0)
                & (clusters[item] == 0)
            )),
        })
    result = {
        "role": "technical counter diagnosis only; not source approval",
        "visual_observation": {
            "image_loads": 1,
            "page": 41,
            "missing_text_in_two_suspect_bands": False,
            "suspect_bands": [[768, 801], [1871, 1907]],
            "required_rows": 19,
            "composition": {
                "opening_prose": 6, "shared_captions": 1, "following_prose": 7,
                "exercise_heading": 1, "question_1": 1, "question_2": 2, "footer": 1,
            },
        },
        "content_width": width,
        "line_h": line_h,
        "glyph_h": glyph_h,
        "baseline_bands": layout.line_bands(ink, width),
        "caption_regions": regions,
        "margin_clusters": margin,
        "bindings": bindings(),
    }
    path = SCRATCH / "diagnosis.initial.json"
    with path.open("x") as stream:
        json.dump(result, stream, indent=2)
        stream.write("\n")
    print(json.dumps({k: v for k, v in result.items() if k != "bindings"}, indent=2))


if __name__ == "__main__":
    main()
