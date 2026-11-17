import difflib
import hashlib
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
P76 = {
    "page.json": ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0076/page.json",
    "page.png": ROOT / ".tmp/ld-s10y-lesson/9-10g/pages/0076/page.png",
}


def file_identity(path):
    value = path.read_bytes()
    return {"path": str(path), "bytes": len(value), "sha256": hashlib.sha256(value).hexdigest()}


def save_json(path, value):
    with path.open("x") as stream:
        json.dump(value, stream, indent=2)
        stream.write("\n")


p76_directory = HERE / "inputs/0076"
p76_directory.mkdir(parents=True, exist_ok=False)
protected = []
for name, source in P76.items():
    destination = p76_directory / name
    with destination.open("xb") as stream:
        stream.write(source.read_bytes())
    protected.append({**file_identity(source), "retained": file_identity(destination)})
save_json(HERE / "p76-before.json", {"scope": "newly authorized comparison input only", "files": protected})

modules = {}
for version in ("baseline", "v3", "candidate"):
    path = HERE / version / "layout.py"
    spec = importlib.util.spec_from_file_location(f"compare_{version}", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    modules[version] = module


def changes(before, after):
    return [
        {"type": tag, "before_indices": [i + 1, j], "after_indices": [k + 1, l],
         "before_bands": before[i:j], "after_bands": after[k:l]}
        for tag, i, j, k, l in difflib.SequenceMatcher(a=before, b=after, autojunk=False).get_opcodes()
        if tag != "equal"
    ]


pages = []
for page in range(68, 77):
    directory = p76_directory if page == 76 else HERE.parent / "inputs" / f"{page:04d}"
    meta = json.loads((directory / "page.json").read_bytes())["meta"]
    with Image.open(directory / "page.png") as source:
        ink = modules["baseline"].ink_mask(source)
    ink_before = ink.tobytes()
    xs = np.flatnonzero(ink.any(axis=0))
    content_w = int(xs[-1] - xs[0] + 1)
    masked = ink.copy()
    for figure in meta.get("figures", []):
        x, y, width, height = figure["box"]
        masked[max(0, y):y + height, max(0, x):x + width] = False
    masked = modules["baseline"].counting_ink(masked, meta.get("count_exclusions", []))
    masked_before = masked.tobytes()
    bands = {version: module.line_bands(masked, content_w)
             for version, module in modules.items()}
    pages.append({
        "page": page, "mode": "read-only shared-counter compatibility; not source gate/finalize",
        "input_identities": [file_identity(directory / name) for name in ("page.json", "page.png")],
        "content_width": content_w, "figure_masks": meta.get("figures", []),
        "existing_count_exclusions_unchanged": meta.get("count_exclusions", []),
        "counting_array_sha256": hashlib.sha256(masked.tobytes()).hexdigest(),
        "source_and_masked_arrays_unchanged": ink.tobytes() == ink_before and masked.tobytes() == masked_before,
        "counts": {version: len(value) for version, value in bands.items()},
        "bands": bands,
        "baseline_to_followup_changes": changes(bands["baseline"], bands["candidate"]),
        "v3_to_followup_changes": changes(bands["v3"], bands["candidate"]),
        "v3_to_followup_exact_bands_equal": bands["v3"] == bands["candidate"],
        "baseline_to_followup_exact_bands_equal": bands["baseline"] == bands["candidate"],
        "p73_outside_original_1556_1642_equal": (
            [row for row in bands["baseline"] if row[1] < 1556 or row[0] > 1642]
            == [row for row in bands["candidate"] if row[1] < 1556 or row[0] > 1642]
        ) if page == 73 else None,
    })
after = [{**file_identity(source), "unchanged": file_identity(source)["sha256"] == item["sha256"]}
         for (name, source), item in zip(P76.items(), protected)]
save_json(HERE / "p76-after.json", {"files": after, "all_unchanged": all(item["unchanged"] for item in after)})
result = {
    "mode": "one final read-only68-76 exact-band comparison; no finalize/source review",
    "code": {name: file_identity(HERE / name / "layout.py") for name in modules},
    "p76_preserved_before_comparison": True, "p76_inputs_unchanged": all(item["unchanged"] for item in after),
    "pages": pages,
}
save_json(HERE / "comparison-v5.json", result)
print(json.dumps({**result, "pages": [
    {key: value for key, value in item.items() if key not in (
        "bands", "figure_masks", "existing_count_exclusions_unchanged", "input_identities"
    )} for item in pages
]}, indent=2))
assert all(item["v3_to_followup_exact_bands_equal"] and item["source_and_masked_arrays_unchanged"]
           for item in pages)
assert all(item["baseline_to_followup_exact_bands_equal"] for item in pages if item["page"] != 73)
p73 = next(item for item in pages if item["page"] == 73)
assert p73["baseline_to_followup_changes"] == [{
    "type": "replace", "before_indices": [19, 20], "after_indices": [19, 19],
    "before_bands": [(1556, 1599), (1600, 1642)], "after_bands": [(1556, 1642)],
}]
assert p73["p73_outside_original_1556_1642_equal"]
p76 = next(item for item in pages if item["page"] == 76)
assert all(value == 20 for value in p76["counts"].values())
assert len(p76["figure_masks"]) == 1
assert p76["figure_masks"][0]["box"] == [450, 1199, 550, 227]
assert result["p76_inputs_unchanged"]
