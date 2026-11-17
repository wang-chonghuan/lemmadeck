import difflib
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")


def identity(path):
    value = path.read_bytes()
    return {"path": str(path), "bytes": len(value), "sha256": hashlib.sha256(value).hexdigest()}


def save_json(path, value):
    with path.open("x") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")


p76 = {
    "page.json": ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0076/page.json",
    "page.png": ROOT / ".tmp/ld-s10y-lesson/9-10g/pages/0076/page.png",
}
p76_directory = HERE / "inputs/0076"
p76_directory.mkdir(parents=True, exist_ok=False)
before = []
for name, source in p76.items():
    target = p76_directory / name
    with target.open("xb") as stream:
        stream.write(source.read_bytes())
    before.append({**identity(source), "retained": identity(target)})
save_json(HERE / "p76-before.json", {"files": before})
modules = {}
for name in ("baseline", "v5", "candidate"):
    file = HERE / name / "layout.py"
    spec = importlib.util.spec_from_file_location(f"comparison_{name}", file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    modules[name] = module


def changes(first, second):
    return [{
        "type": tag, "before_indices": [i + 1, j], "after_indices": [k + 1, l],
        "before_bands": first[i:j], "after_bands": second[k:l],
    } for tag, i, j, k, l in difflib.SequenceMatcher(a=first, b=second, autojunk=False).get_opcodes()
        if tag != "equal"]


pages = []
for page in range(68, 77):
    directory = p76_directory if page == 76 else HERE.parent / "inputs" / f"{page:04d}"
    meta = json.loads((directory / "page.json").read_bytes())["meta"]
    with Image.open(directory / "page.png") as source:
        ink = modules["baseline"].ink_mask(source)
    before_ink = ink.tobytes()
    xs = np.flatnonzero(ink.any(axis=0))
    content_w = int(xs[-1] - xs[0] + 1)
    masked = ink.copy()
    for figure in meta.get("figures", []):
        x, y, width, height = figure["box"]
        masked[max(0, y):y + height, max(0, x):x + width] = False
    masked = modules["baseline"].counting_ink(masked, meta.get("count_exclusions", []))
    before_masked = masked.tobytes()
    bands = {name: module.line_bands(masked, content_w) for name, module in modules.items()}
    pages.append({
        "page": page, "content_width": content_w,
        "inputs": [identity(directory / name) for name in ("page.json", "page.png")],
        "figure_masks": meta.get("figures", []), "existing_exclusions": meta.get("count_exclusions", []),
        "counting_array_sha256": hashlib.sha256(masked.tobytes()).hexdigest(),
        "source_and_counting_arrays_unchanged": ink.tobytes() == before_ink and masked.tobytes() == before_masked,
        "bands": bands, "counts": {name: len(value) for name, value in bands.items()},
        "v5_to_candidate_changes": changes(bands["v5"], bands["candidate"]),
        "baseline_to_candidate_changes": changes(bands["baseline"], bands["candidate"]),
        "v5_to_candidate_exact_bands_equal": bands["v5"] == bands["candidate"],
        "baseline_to_candidate_exact_bands_equal": bands["baseline"] == bands["candidate"],
        "p73_outside_original_1556_1642_equal": (
            [row for row in bands["baseline"] if row[1] < 1556 or row[0] > 1642]
            == [row for row in bands["candidate"] if row[1] < 1556 or row[0] > 1642]
        ) if page == 73 else None,
    })
after = [{**identity(file), "unchanged": identity(file)["sha256"] == old["sha256"]}
         for file, old in zip(p76.values(), before)]
save_json(HERE / "p76-after.json", {"files": after})
result = {
    "mode": "one authorized read-only68-76 counter comparison; not source gate/finalize",
    "code": {name: identity(HERE / name / "layout.py") for name in modules},
    "p76_inputs_unchanged": all(item["unchanged"] for item in after), "pages": pages,
}
save_json(HERE / "comparison-v6.json", result)
print(json.dumps({**result, "pages": [{
    key: value for key, value in item.items() if key not in ("bands", "inputs", "figure_masks", "existing_exclusions")
} for item in pages]}, indent=2))
assert all(item["v5_to_candidate_exact_bands_equal"] and item["source_and_counting_arrays_unchanged"]
           for item in pages)
assert all(item["baseline_to_candidate_exact_bands_equal"] for item in pages if item["page"] != 73)
p73 = next(item for item in pages if item["page"] == 73)
assert p73["baseline_to_candidate_changes"] == [{
    "type": "replace", "before_indices": [19, 20], "after_indices": [19, 19],
    "before_bands": [(1556, 1599), (1600, 1642)], "after_bands": [(1556, 1642)],
}]
assert p73["p73_outside_original_1556_1642_equal"]
p76_result = next(item for item in pages if item["page"] == 76)
assert all(value == 20 for value in p76_result["counts"].values())
assert p76_result["figure_masks"][0]["box"] == [450, 1199, 550, 227]
assert result["p76_inputs_unchanged"]
