"""Create only the four authorized native-pixel formula crops."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d212-source63-bar-diagnosis-author"
CROPS = ROOT / ".tmp/STEMROBIN-181/d1816-d212"
PAGE = CROPS / "page.png"
EXPECTED = "454569355a876cee9fd0eed41efb485598bef95294b561b51f173bde59d1d8f6"
BOXES = {
    "2.19": (600, 630, 1350, 745),
    "2.20": (695, 877, 1350, 987),
    "2.21": (590, 1147, 1350, 1260),
    "2.22": (590, 1720, 1350, 1826),
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert Path.cwd() == ROOT, "The authorized checkout must be the cwd."
assert digest(PAGE) == EXPECTED, "Original page hash changed."
manifest_path = AUTHOR / "pixel-crops.json"
outputs = [CROPS / f"eq-{equation.replace('.', '-')}-native.png" for equation in BOXES]
assert not manifest_path.exists(), "Never overwrite evidence."
assert all(not path.exists() for path in outputs), "Never overwrite crops."
records = []
with Image.open(PAGE) as page:
    assert page.size == (1536, 2337) and page.mode == "RGB"
    for (equation, box), output in zip(BOXES.items(), outputs):
        crop = page.crop(box)
        crop.save(output, format="PNG")
        with Image.open(output) as saved:
            assert saved.size == crop.size and saved.mode == page.mode
            assert ImageChops.difference(crop, saved).getbbox() is None
            pixel_hash = hashlib.sha256(saved.tobytes()).hexdigest()
        records.append({
            "equation": equation,
            "path": str(output),
            "coordinates_xyxy_half_open": list(box),
            "size": list(crop.size),
            "bytes": output.stat().st_size,
            "sha256": digest(output),
            "decoded_rgb_sha256": pixel_hash,
            "pixel_equality_to_original_region": True,
            "resizing_or_resampling": False,
            "annotations_or_pixel_edits": False,
        })
assert digest(PAGE) == EXPECTED, "Original must remain unchanged."
manifest = {
    "schema": "d212.pixel-crops.v1",
    "cwd": str(ROOT),
    "original": {
        "path": str(PAGE),
        "sha256": EXPECTED,
        "bytes": PAGE.stat().st_size,
        "size": [1536, 2337],
        "mode": "RGB",
        "unchanged_after_crop_generation": True,
    },
    "method": "Pillow crop only; lossless PNG; decoded pixel equality asserted.",
    "coordinate_convention": "Original-image pixels, origin top left; [left, top, right, bottom), right/bottom excluded.",
    "crops": records,
    "image_tool_opens": 0,
    "note": "Image decoding for cropping is not an agent visual open. Actual visual opens are recorded separately.",
}
with manifest_path.open("x", encoding="utf-8") as handle:
    json.dump(manifest, handle, ensure_ascii=True, indent=2)
    handle.write("\n")
print(json.dumps(manifest, indent=2))
