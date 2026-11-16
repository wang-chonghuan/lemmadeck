import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p47-p49-targeted-repair-evidence"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout

assert (OUT / "before.manifest.json").exists()


def binding(file):
    raw = file.read_bytes()
    return {"path": str(file.relative_to(ROOT)), "bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest()}


for page in [48, 49]:
    p = f"{page:04d}"
    target = OUT / p / "diagnostic.json"
    assert not target.exists(), "Preserve first diagnostic"
    source = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{p}/page.png"
    image = Image.open(source)
    original_ink = layout.ink_mask(image)
    meta, parsed = blocks.parse((OUT / p / "before/page.md").read_text())
    assert not meta.get("count_exclusions") and not meta["figures"]
    assert not any(block["kind"] == "fig" for block in parsed)
    masked = layout.counting_ink(original_ink, [])
    cols = np.flatnonzero(original_ink.any(axis=0))
    width = int(cols[-1] - cols[0] + 1) if cols.size else image.width
    state = {}

    def trace(frame, event, value):
        if frame.f_code is layout.line_bands.__code__ and event == "return":
            state["processed_ink"] = frame.f_locals["ink"].copy()
            for key in ["line_h", "glyph_h", "typical_h", "typical_gap", "pitch"]:
                state[key] = float(frame.f_locals[key]) if key in frame.f_locals else None
        return trace

    sys.settrace(trace)
    try:
        bands = layout.line_bands(masked, width)
    finally:
        sys.settrace(None)
    assert np.array_equal(original_ink, masked)
    stored = json.loads((source.parent / "layout.json").read_text())
    assert [[int(a), int(b)] for a, b in bands] == stored["line_bands"]
    processed = state.pop("processed_ink")
    details = []
    for index, (a, b) in enumerate(bands, 1):
        local = processed[a:b + 1]
        xs = np.flatnonzero(local.any(axis=0))
        details.append({
            "band": index, "y_inclusive": [int(a), int(b)],
            "x_inclusive": [int(xs[0]), int(xs[-1])],
            "height": int(b - a + 1), "ink_pixels": int(local.sum()),
            "row_ink_max": int(local.sum(axis=1).max()),
        })
    labels, _ = ndimage.label(processed)
    components = []
    for component, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if rows.stop <= 2240:
            continue
        local = labels[bounds] == component
        components.append({
            "box": [columns.start, rows.start, columns.stop - columns.start, rows.stop - rows.start],
            "ink_pixels": int(local.sum()),
        })
    report = {
        "role": "count-only diagnostic; no independent source gate",
        "inputs": [binding(source), binding(source.parent / "layout.json"),
                   binding(OUT / p / "before/page.md"), binding(TOOLS / "layout.py")],
        "official_functions": ["layout.ink_mask", "layout.counting_ink", "layout.line_bands", "blocks.printed_lines"],
        "content_width_from_original": width, "machine_count": len(bands),
        "md_count": blocks.printed_lines(parsed), "bands": details,
        "counting_copy_trace": state, "bottom_components": components,
        "matches_existing_layout": True, "input_ink_unchanged": True,
        "exclusions": [], "finalize_invocations": 0,
        "native_strips": [],
    }
    target.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"page": page, "diagnostic": binding(target), "bands": details, "bottom_components": components}))
