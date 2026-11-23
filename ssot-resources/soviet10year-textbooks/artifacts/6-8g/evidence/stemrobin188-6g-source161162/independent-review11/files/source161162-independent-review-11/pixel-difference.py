"""Measure the actual mismatch; leave both failed diagnostic premises intact."""

import hashlib
import json
from collections import Counter
from pathlib import Path

from PIL import Image, ImageChops


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "source161162-independent-review-11"
SOURCE = TMP / "source6g161162-author-first-10/work/6-8g/pages/0162/page.png"
CROP = SOURCE.parent / "figures/fig-216.png"
CORE = (163, 1409, 1219, 1874)
PAD = (151, 1397, 1231, 1886)
with Image.open(SOURCE) as image:
    source = image.convert("RGB")
with Image.open(CROP) as image:
    native = image.convert("RGB")
raw = source.crop(PAD)
diff = ImageChops.difference(raw, native)
bounds = diff.getbbox()
changed = []
for y in range(native.height):
    for x in range(native.width):
        if raw.getpixel((x, y)) != native.getpixel((x, y)):
            changed.append((
                x + PAD[0], y + PAD[1],
                raw.getpixel((x, y)), native.getpixel((x, y)),
            ))
region_counts = Counter(
    "top-padding" if y < CORE[1] else
    "bottom-padding" if y >= CORE[3] else
    "left-padding" if x < CORE[0] else
    "right-padding" if x >= CORE[2] else "core"
    for x, y, _, _ in changed
)
core_diff = ImageChops.difference(native.crop((12, 12, 1068, 477)), source.crop(CORE))
result = {
    "schema": "source-independent/actual-pixel-difference@1",
    "source_path": str(SOURCE),
    "source_sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "crop_path": str(CROP),
    "crop_sha256": hashlib.sha256(CROP.read_bytes()).hexdigest(),
    "core_ltrb": list(CORE),
    "padding_ltrb": list(PAD),
    "changed_pixels": len(changed),
    "global_difference_bounds_ltrb": [
        bounds[0] + PAD[0], bounds[1] + PAD[1],
        bounds[2] + PAD[0], bounds[3] + PAD[1],
    ],
    "differences_by_region": dict(region_counts),
    "differences_by_global_row": dict(Counter(y for _, y, _, _ in changed)),
    "core_exactly_matches_original": core_diff.getbbox() is None,
    "all_differences_original_ink_to_native_white": all(
        old != (255, 255, 255) and new == (255, 255, 255)
        for _, _, old, new in changed
    ),
    "ownership_semantics": "Measured coordinates only; source visual record decides text versus figure",
    "old_failure_scripts_and_verification_retained": True,
    "no_image_payloads_or_producer_invocations": True,
}
with (OWN / "pixel-difference.json").open("x") as handle:
    json.dump(result, handle, indent=2)
    handle.write("\n")
print(json.dumps(result, indent=2))
