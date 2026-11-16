import hashlib
import inspect
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-targeted-repair-evidence"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout

assert (OUT / "before.manifest.json").exists(), "Preserve before bytes first"
RESULT = OUT / "diagnostic.json"
assert not RESULT.exists(), "Do not overwrite the first diagnostic"


def serial(value):
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, set):
        return sorted(value)
    if isinstance(value, (list, tuple)):
        return [serial(item) for item in value]
    return value


def bind(path):
    raw = path.read_bytes()
    return {"path": str(path.relative_to(ROOT)), "bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest()}


pages = []
for page in (43, 46):
    png = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{page:04}/page.png"
    source = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04}"
    image = Image.open(png)
    original = layout.ink_mask(image)
    masked = original.copy()
    meta, parsed = blocks.parse((source / "page.md").read_text())
    assert not meta.get("count_exclusions")
    prior = json.loads((source / "audit.json").read_text())
    for figure in prior["figures"]:
        x, y, w, h = figure["box"]
        masked[y:y + h, x:x + w] = False
    columns = np.flatnonzero(original.any(axis=0))
    content_width = int(columns[-1] - columns[0] + 1)
    state = {}
    events = []
    fraction_calls = []
    processed = None
    source_lines, start = inspect.getsourcelines(layout.line_bands)
    checkpoints = {}
    for offset, text in enumerate(source_lines):
        if text.strip() in {
            "components, _ = ndimage.label(ink)",
            "# Dense, joined shallow blemishes are not glyphs or thin fraction rules.",
            "joined = []",
            "merged = expanded",
            "if not decoration:",
        }:
            checkpoints[start + offset] = text.strip()

    def trace(frame, event, value):
        global processed
        if frame.f_code is layout.line_bands.__code__:
            current = frame.f_locals
            if event == "line" and frame.f_lineno in checkpoints:
                fields = ("line_h", "glyph_h", "raw", "merged", "expanded", "a", "b",
                          "typical_h", "typical_gap", "pitch", "band_h", "band_w",
                          "thin", "edge_border", "short_text", "folio", "decoration")
                events.append({"line": frame.f_lineno, "checkpoint": checkpoints[frame.f_lineno],
                               **{key: serial(current[key]) for key in fields if key in current}})
            if event == "return":
                processed = current["ink"].copy()
                for key in ("line_h", "glyph_h", "typical_h", "typical_gap", "pitch",
                            "raw", "joined", "merged", "fraction_starts"):
                    if key in current:
                        state[key] = serial(current[key])
        elif frame.f_code is layout._single_fraction_row.__code__ and event == "return":
            current = frame.f_locals
            fraction_calls.append({
                "a": current["a"], "b": current["b"],
                "line_h": float(current["line_h"]), "result": bool(value),
                "rules": serial(current.get("rules", [])),
                "glyph_rows": serial(current.get("glyph_rows", [])),
            })
        return trace

    sys.settrace(trace)
    try:
        bands = layout.line_bands(masked, content_width)
    finally:
        sys.settrace(None)
    assert len(bands) == prior["lines_printed"], "Natural masked result differs from first FAIL"
    assert blocks.printed_lines(parsed) == prior["lines_md"]
    labels, _ = ndimage.label(processed)
    bounds_list = ndimage.find_objects(labels)
    components = []
    for number, bounds in enumerate(bounds_list, 1):
        if bounds is None:
            continue
        rows, cols = bounds
        area = int((labels[bounds] == number).sum())
        components.append({
            "box": [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start],
            "ink_pixels": area,
            "bands": [index for index, (a, b) in enumerate(bands, 1)
                      if rows.start <= b and a < rows.stop],
        })
    band_details = []
    for index, (a, b) in enumerate(bands, 1):
        local = processed[a:b + 1]
        xs = np.flatnonzero(local.any(axis=0))
        band_details.append({
            "band": index, "y_inclusive": [a, b],
            "x_inclusive": [int(xs[0]), int(xs[-1])],
            "ink_pixels": int(local.sum()),
            "components": [entry for entry in components if index in entry["bands"]],
        })
    entries = {
        "page": page, "inputs": [bind(png), bind(png.parent / "layout.json"),
                                bind(source / "page.md"), bind(source / "page.json"),
                                bind(source / "audit.json")],
        "function": "layout.line_bands(official ink_mask with prior snapped figure boxes masked, original content_width)",
        "content_width": content_width, "machine_count": len(bands),
        "md_count": blocks.printed_lines(parsed),
        "first_failure_reproduced_without_expected_override": True,
        "expected_count_override": False, "count_exclusions": [],
        "figure_boxes": [{key: figure[key] for key in ("id", "box", "from")}
                         for figure in prior["figures"]],
        "state": state, "events": events, "bands": band_details,
        "fraction_calls": fraction_calls,
        "original_mask_unmodified": np.array_equal(original, layout.ink_mask(image)),
    }
    pages.append(entries)
    print(json.dumps({key: entries[key] for key in (
        "page", "content_width", "machine_count", "md_count", "state")}, indent=2))
    print(json.dumps({"bands": [{key: band[key] for key in (
        "band", "y_inclusive", "x_inclusive", "ink_pixels")} for band in band_details]}, indent=2))

RESULT.write_text(json.dumps({
    "role": "Affected count-only natural algorithm trace, not source re-review or gate",
    "python": sys.executable, "pages": pages, "finalize_invocations": 0,
    "image_loads_into_model_context": 0,
    "tools": [bind(TOOLS / name) for name in ("layout.py", "blocks.py", "p2c.py")],
}, indent=2) + "\n")
print(json.dumps({"diagnostic": bind(RESULT)}))
