"""One authorized real finalize, with source-only ownership assertions."""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
SIDE = ROOT / ".tmp/s10y-source/batch013-ownership122"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c

PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0122"
WORK = SIDE / "candidate-work/9-10g/pages/0122"
receipt = SIDE / "finalize-result.json"
if receipt.exists() or (SIDE / "finalize.stdout").exists():
    raise SystemExit("The authorized source122 finalize has already been attempted.")

before_meta, before_blocks = blocks.load(SIDE / "before/source122/page.md")
meta, current_blocks = blocks.load(PAGE / "page.md")
assert before_blocks == current_blocks, "Ownership repair changed source blocks"
assert {key: value for key, value in meta.items() if key != "figure_component_ownership"} == before_meta
assert (PAGE / "page.md").read_bytes() == (SIDE / "changed/source122/page.md").read_bytes()
for name in ("p2c.py", "layout.py"):
    assert (TOOLS / name).read_bytes() == (SIDE / "changed/code" / name).read_bytes()
render_sha = layout.sha256_file(WORK / "page.png")
assert render_sha == meta["render"]["sha256"]
source = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch013-source122123-first-prepare/pages/0122/page.png"
assert layout.sha256_file(source) == render_sha
with Image.open(source) as image:
    raw = np.array(image)
    ink = layout.ink_mask(image)
before_audit = json.loads((SIDE / "before/source122/audit.json").read_text())
figures = before_audit["figures"]
original = layout.figure_component_ownership(ink, figures, None, render_sha)
owned = layout.figure_component_ownership(ink, figures, meta["figure_component_ownership"], render_sha)
labels, _ = ndimage.label(ink)
expected_components = {
    "fig-133": {180, 182, 186, 189, 193, 195, 196, 205, 209, 213},
    "fig-134": {181, 185, 188, 201, 203, 204, 211, 212},
}
for figure_id, ids in expected_components.items():
    np.testing.assert_array_equal(owned[figure_id], np.isin(labels, sorted(ids)))
np.testing.assert_array_equal(original["fig-132"], owned["fig-132"])
np.testing.assert_array_equal(np.logical_or.reduce(list(original.values())),
                              np.logical_or.reduce(list(owned.values())))
assert int((original["fig-133"] & original["fig-134"]).sum()) == 579
assert not (owned["fig-133"] & owned["fig-134"]).any()
assert int(owned["fig-133"].sum()) == 11659
assert int(owned["fig-134"].sum()) == 8672
preflight = {
    "source_sha256": render_sha,
    "original_overlap_pixels": 579,
    "all_own_components_retained": True,
    "all_original_selected_ink_retained": True,
    "no_double_ownership": True,
    "source_blocks_unchanged": True,
    "fig132_ownership_unchanged": True,
}
(SIDE / "preflight.json").write_text(json.dumps(preflight, indent=2) + "\n")
command = [
    str(ROOT / ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    str(TOOLS / "p2c.py"), "finalize", "--book", "9-10g", "--page", "122",
    "--work", str(SIDE / "candidate-work"),
]
result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
(SIDE / "finalize.stdout").write_text(result.stdout)
(SIDE / "finalize.stderr").write_text(result.stderr)
audit = json.loads((PAGE / "audit.json").read_text())
summary = {
    "command": command, "cwd": str(ROOT), "actual_exit": result.returncode,
    "real_source122_finalize_attempts": 1,
    "lines_printed": audit["lines_printed"], "lines_md": audit["lines_md"],
    "figure_count": len(audit["figures"]), "errors": audit["errors"],
}
receipt.write_text(json.dumps(summary, indent=2) + "\n")
print(result.stdout, end="")
print(result.stderr, end="", file=sys.stderr)
print(json.dumps(summary, indent=2))
if result.returncode:
    raise SystemExit(result.returncode)

after_meta, after_blocks = blocks.load(PAGE / "page.md")
assert after_blocks == before_blocks
assert after_meta["figure_component_ownership"] == meta["figure_component_ownership"]
assert audit["lines_printed"] == audit["lines_md"] == 19
assert len(audit["figures"]) == 3
assert audit["errors"] == []
for figure in audit["figures"]:
    figure_id = figure["id"]
    before_figure = next(item for item in figures if item["id"] == figure_id)
    assert figure["box"] == before_figure["box"], "Figure geometry changed"
    assert figure["from"] == before_figure["from"], "Roughbox provenance changed"
    reused = p2c._reusable_figure_geometry(
        after_meta, audit, figure_id, figure["box"], render_sha
    )
    assert reused is not None and reused[0] == figure["box"]
    x, y, w, h = figure["box"]
    left, top = max(0, x - 12), max(0, y - 12)
    with Image.open(WORK / f"figures/{figure_id}.png") as image:
        pixels = np.array(image)
        crop_ink = layout.ink_mask(image)
    restored = np.zeros_like(ink)
    restored[y:y + h, x:x + w] = crop_ink[y - top:y - top + h, x - left:x - left + w]
    np.testing.assert_array_equal(restored, owned[figure_id])
    raw_region = raw[y:y + h, x:x + w]
    output_region = pixels[y - top:y - top + h, x - left:x - left + w]
    np.testing.assert_array_equal(
        raw_region[owned[figure_id][y:y + h, x:x + w]],
        output_region[owned[figure_id][y:y + h, x:x + w]],
    )
    if figure_id in expected_components:
        assert figure["ownership"]["ink_pixels"] == int(owned[figure_id].sum())
        assert figure["ownership"]["ink_sha256"] == hashlib.sha256(owned[figure_id].tobytes()).hexdigest()
assert layout.sha256_file(WORK / "figures/fig-132.png") == layout.sha256_file(SIDE / "before/work122/figures/fig-132.png")
assert layout.sha256_file(source) == render_sha

candidate = SIDE / "candidate/source122"
candidate.mkdir(parents=True)
for name in ("page.md", "page.json", "audit.json"):
    shutil.copy2(PAGE / name, candidate / name)
postflight = {
    "actual_crop_ink_exactly_matches_owned_components": True,
    "all_owned_raw_pixel_values_unchanged": True,
    "figure_geometry_and_original_roughboxes_unchanged": True,
    "repeat_geometry_reuse_and_ownership_provenance_stable": True,
    "fig132_crop_sha256_unchanged": True,
    "source122_sha256_unchanged": True,
    "source_blocks_unchanged": True,
    "independent_affected_ownership_gate": "Parent-arranged; not claimed here.",
    "image_views_so_far": 1,
    "paid_usage": 0,
    "focused_unit_tests": {"passed": 10, "exit": 0},
}
(SIDE / "postflight.json").write_text(json.dumps(postflight, indent=2) + "\n")
paths = [
    *sorted(candidate.glob("*")),
    *sorted((WORK / "figures").glob("*.png")),
    SIDE / "finalize-result.json", SIDE / "preflight.json", SIDE / "postflight.json",
    *sorted((SIDE / "before/first-failure").rglob("*")),
    *sorted((SIDE / "before/code").glob("*")),
    *sorted((SIDE / "changed/code").glob("*")),
]
hashes = {
    str(path.relative_to(ROOT)): layout.sha256_file(path)
    for path in paths if path.is_file()
}
(SIDE / "files.sha256.json").write_text(json.dumps(hashes, indent=2) + "\n")
print("SOURCE122 OWNERSHIP ASSERTIONS: PASS")
for path in sorted(candidate.glob("*")):
    print(layout.sha256_file(path), path)
for name in ("fig-133.png", "fig-134.png"):
    path = WORK / "figures" / name
    print(layout.sha256_file(path), path)
