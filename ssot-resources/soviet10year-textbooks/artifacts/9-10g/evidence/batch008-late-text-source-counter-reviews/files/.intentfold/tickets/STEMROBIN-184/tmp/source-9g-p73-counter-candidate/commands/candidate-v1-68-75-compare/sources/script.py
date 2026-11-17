import difflib
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
VERSION = sys.argv[1]


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


baseline = load("compare_baseline", HERE / "baseline/layout.py")
candidate = load("compare_candidate", HERE / "candidate/layout.py")
pages = []
for page in range(68, 76):
    here = HERE / "inputs" / f"{page:04d}"
    meta = json.loads((here / "page.json").read_text())["meta"]
    with Image.open(here / "page.png") as source:
        ink = baseline.ink_mask(source)
    before_bytes = ink.tobytes()
    xs = np.flatnonzero(ink.any(axis=0))
    content_w = int(xs[-1] - xs[0] + 1)
    masked = ink.copy()
    for figure in meta.get("figures", []):
        x, y, w, h = figure["box"]
        masked[max(0, y):y + h, max(0, x):x + w] = False
    masked = baseline.counting_ink(masked, meta.get("count_exclusions", []))
    old = baseline.line_bands(masked, content_w)
    new = candidate.line_bands(masked, content_w)
    changes = []
    for tag, i, j, k, l in difflib.SequenceMatcher(a=old, b=new, autojunk=False).get_opcodes():
        if tag != "equal":
            changes.append({"type": tag, "old_indices": [i + 1, j],
                            "new_indices": [k + 1, l],
                            "old_bands": old[i:j], "new_bands": new[k:l]})
    pages.append({
        "page": page, "content_width": content_w,
        "figure_masks": meta.get("figures", []),
        "existing_count_exclusions": meta.get("count_exclusions", []),
        "old_count": len(old), "candidate_count": len(new),
        "count_delta": len(new) - len(old),
        "exact_bands_equal": old == new, "changes": changes,
        "old_bands": old, "candidate_bands": new,
        "p73_outside_1556_1642_equal": (
            [row for row in old if row[1] < 1556 or row[0] > 1642]
            == [row for row in new if row[1] < 1556 or row[0] > 1642]
        ) if page == 73 else None,
        "source_array_unchanged": ink.tobytes() == before_bytes,
        "counting_array_sha256": hashlib.sha256(masked.tobytes()).hexdigest(),
    })
result = {
    "version": VERSION, "mode": "read-only counter compatibility; not finalize or source gate",
    "baseline_sha256": hashlib.sha256((HERE / "baseline/layout.py").read_bytes()).hexdigest(),
    "candidate_sha256": hashlib.sha256((HERE / "candidate/layout.py").read_bytes()).hexdigest(),
    "pages": pages,
}
with (HERE / f"comparison-{VERSION}.json").open("x") as stream:
    json.dump(result, stream, indent=2)
    stream.write("\n")
print(json.dumps({**result, "pages": [
    {key: value for key, value in page.items() if key not in (
        "old_bands", "candidate_bands", "figure_masks", "existing_count_exclusions"
    )} for page in pages
]}, indent=2))
