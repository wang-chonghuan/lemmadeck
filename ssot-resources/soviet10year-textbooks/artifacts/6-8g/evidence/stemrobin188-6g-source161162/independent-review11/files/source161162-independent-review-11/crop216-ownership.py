"""Localize the preserved raw-rectangle mismatch without changing any crop."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "source161162-independent-review-11"
SOURCE = TMP / "source6g161162-author-first-10/work/6-8g/pages/0162/page.png"
CROP = SOURCE.parent / "figures/fig-216.png"
BOX = (163, 1409, 1219, 1874)
PADDED = (151, 1397, 1231, 1886)

with Image.open(SOURCE) as image:
    source = image.convert("RGB")
with Image.open(CROP) as image:
    native = image.convert("RGB")
raw = source.crop(PADDED)
difference = ImageChops.difference(raw, native)
local_bounds = difference.getbbox()
global_bounds = [
    local_bounds[0] + PADDED[0], local_bounds[1] + PADDED[1],
    local_bounds[2] + PADDED[0], local_bounds[3] + PADDED[1],
]
core = native.crop((12, 12, 1068, 477))
core_exact = ImageChops.difference(core, source.crop(BOX)).getbbox() is None
changed = []
for y in range(native.height):
    for x in range(native.width):
        if raw.getpixel((x, y)) != native.getpixel((x, y)):
            changed.append({
                "x": x + PADDED[0], "y": y + PADDED[1],
                "source": raw.getpixel((x, y)),
                "native": native.getpixel((x, y)),
            })
all_below_core = all(pixel["y"] >= BOX[3] for pixel in changed)
all_whitened = all(
    pixel["source"] != (255, 255, 255) and pixel["native"] == (255, 255, 255)
    for pixel in changed
)
result = {
    "schema": "source-independent/affected-crop-ownership@1",
    "cwd": str(REPO),
    "source": {"path": str(SOURCE), "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest()},
    "native_crop": {"path": str(CROP), "sha256": hashlib.sha256(CROP.read_bytes()).hexdigest()},
    "preserved_initial_check": {
        "path": str(OWN / "verification.json"),
        "exit_code": 1,
        "result": "Raw padded rectangle differs; initial exact-rectangle assumption not valid for fig216",
    },
    "native_core_ltrb": list(BOX),
    "padded_rectangle_ltrb": list(PADDED),
    "changed_pixels": len(changed),
    "changed_pixel_bounds_global_ltrb": global_bounds,
    "native_core_exactly_matches_original_pixels": core_exact,
    "every_changed_pixel_is_below_native_core": all_below_core,
    "every_changed_pixel_is_source_ink_whitened_in_crop": all_whitened,
    "independent_visual_ownership": {
        "object": "top ink of separate caption 图216 inside bottom padding",
        "owner": "p0162#9 caption, not p0162#8 figure",
        "basis": "original full page viewed before candidates; caption row recorded in FIRST",
        "figure_inventory_loss": False,
        "labels_or_strokes_clipped": False,
        "caption_is_preserved_separately_in_candidate": True,
    },
    "conclusion": "806 neighboring caption pixels removed only from bottom padding; all figure core pixels match exactly",
    "initial_failure_preserved": True,
    "source_crop_or_producer_changes": 0,
    "image_payloads_emitted": 0,
    "new_image_views": 0,
    "exec_sessions_created_or_left_running": 0,
}
assert len(changed) == 806 and core_exact and all_below_core and all_whitened
with (OWN / "crop216-ownership.json").open("x") as handle:
    json.dump(result, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps(result, ensure_ascii=False, indent=2))
