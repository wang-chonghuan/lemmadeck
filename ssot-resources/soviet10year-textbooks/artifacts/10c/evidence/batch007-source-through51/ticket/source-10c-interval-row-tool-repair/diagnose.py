"""Read-only counter observations using the previously inspected source masks."""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p43-p46-targeted-repair-evidence"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout


def bind(path):
    data = path.read_bytes()
    return {"path": str(path.relative_to(ROOT)), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest()}


saved = json.loads((EVIDENCE / "diagnostic.json").read_text())
margin = json.loads((EVIDENCE / "margin-only-diagnostic.json").read_text())
results = []
for entry in saved["pages"]:
    page = entry["page"]
    png = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{page:04}/page.png"
    assert bind(png)["sha256"] == entry["inputs"][0]["sha256"]
    with Image.open(png) as image:
        original = layout.ink_mask(image)
    masked = original.copy()
    for figure in entry["figure_boxes"]:
        x, y, w, h = figure["box"]
        masked[y:y + h, x:x + w] = False
    variants = [("original-figure-mask", masked, [])]
    if page == 46:
        exclusions = margin["proposed_count_exclusions"]
        variants.append(("existing-margin-candidate",
                         layout.counting_ink(masked, exclusions), exclusions))
    for name, count_copy, exclusions in variants:
        before = count_copy.copy()
        state = {}

        def trace(frame, event, value):
            if frame.f_code is layout.line_bands.__code__ and event == "return":
                state.update({key: float(frame.f_locals[key]) for key in (
                    "line_h", "glyph_h", "typical_h", "typical_gap", "pitch")})
            return trace

        sys.settrace(trace)
        try:
            bands = layout.line_bands(count_copy, entry["content_width"])
        finally:
            sys.settrace(None)
        assert np.array_equal(before, count_copy)
        results.append({
            "page": page, "variant": name, "source": bind(png),
            "content_width": entry["content_width"],
            "figure_boxes": entry["figure_boxes"],
            "count_exclusions": exclusions,
            "natural_count": len(bands), "bands": bands, "state": state,
            "counting_input_sha256": hashlib.sha256(count_copy.tobytes()).hexdigest(),
            "input_mask_unchanged": True,
        })
inputs = [bind(EVIDENCE / name) for name in (
    "diagnostic.json", "margin-only-diagnostic.json", "native-strips.json")]
for entry in saved["pages"]:
    for item in entry["inputs"]:
        inputs.append(bind(ROOT / item["path"]))
print(json.dumps({
    "role": "Author counter observation only; no content acceptance or finalize",
    "stage": sys.argv[1], "python": sys.executable,
    "layout": bind(TOOLS / "layout.py"), "inputs": inputs,
    "expectation_basis": {
        "page43": "Source author recorded ten physical rows, including one final interval/fraction row.",
        "page46_margin_candidate": "Source author recorded thirteen physical rows; the inspected three interval prose rows are one each.",
        "source_author_sha256": "4df0a4d779be588b163175b36200584cf4bb5dc4131f62b9596124a0346ac804",
        "expected_count_override": False,
    },
    "results": results, "finalize_invocations": 0,
}, indent=2))
