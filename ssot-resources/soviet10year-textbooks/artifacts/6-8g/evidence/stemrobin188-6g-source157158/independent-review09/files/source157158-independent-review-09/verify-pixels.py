import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
AUTHOR = TMP / "source6g157158-author-first-09"
OWNED = TMP / "source157158-independent-review-09"
ORIGINALS = {
    157: (
        AUTHOR / "work/6-8g/pages/0157/page.png",
        "dbcec5457fcf0012995b2688c3e3d4b830f9f5a302784a2e9d5f8d10f5e1155f",
    ),
    158: (
        AUTHOR / "work/6-8g/pages/0158/page.png",
        "a00616fae874c4bcab306205cc03e2f24e6678b0838ba5f0d5b52522fbf0a415",
    ),
}


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


pages = {}
for physical, (path, expected) in ORIGINALS.items():
    assert sha256(path) == expected, (physical, "original hash drift")
    with Image.open(path) as image:
        pages[physical] = image.convert("RGB")

crop_path = AUTHOR / "work/6-8g/pages/0157/figures/fig-212.png"
assert sha256(crop_path) == (
    "5558d6e716169fd2e505e60e42b1371dad0f43846413a86ed6c57f72b2f657ea"
)
with Image.open(crop_path) as image:
    figure = image.convert("RGB")
figure_box = (920, 1554, 1206, 1817)
expected_pixels = pages[157].crop(figure_box)
assert figure.size == (
    expected_pixels.width + 24,
    expected_pixels.height + 24,
)
inner_box = (12, 12, figure.width - 12, figure.height - 12)
inner = figure.crop(inner_box)
diff = ImageChops.difference(inner, expected_pixels)
assert diff.getbbox() is None, "figure pixels differ from original crop"
border = figure.copy()
border.paste((255, 255, 255), inner_box)
assert ImageChops.difference(
    border, Image.new("RGB", border.size, "white")
).getbbox() is None, "nonwhite pixels lie in the padding"

# This perimeter test verifies clipping/transport only, not figure semantics.
coarse_box = (920, 1545, 1215, 1830)
outside_ink = 0
source = pages[157].convert("L")
for y in range(coarse_box[1], coarse_box[3]):
    for x in range(coarse_box[0], coarse_box[2]):
        inside = (
            figure_box[0] <= x < figure_box[2]
            and figure_box[1] <= y < figure_box[3]
        )
        if not inside and source.getpixel((x, y)) < 128:
            outside_ink += 1
assert outside_ink == 0, "ink lies outside figure crop within coarse box"

details = [
    (157, "detail157-title.png", (150, 1015, 1280, 1160)),
    (158, "detail158-prose-punctuation.png", (160, 815, 1280, 910)),
    (158, "detail158-441.png", (260, 1635, 1285, 1775)),
]
outputs = []
for physical, name, box in details:
    path = OWNED / name
    assert not path.exists(), f"refusing to overwrite {path}"
    detail = pages[physical].crop(box)
    detail.save(path, format="PNG")
    with Image.open(path) as image:
        restored = image.convert("RGB")
    assert ImageChops.difference(detail, restored).getbbox() is None
    outputs.append(
        {
            "physical": physical,
            "path": str(path),
            "box_xyxy": list(box),
            "size": list(detail.size),
            "sha256": sha256(path),
            "pixel_difference_bbox": None,
            "resized": False,
            "viewed_by_this_check": False,
        }
    )

print(
    json.dumps(
        {
            "status": "PASS_TRANSPORT_ONLY",
            "semantic_approval": False,
            "original_sizes": {
                str(physical): list(image.size)
                for physical, image in pages.items()
            },
            "figure212": {
                "path": str(crop_path),
                "sha256": sha256(crop_path),
                "box_xyxy": list(figure_box),
                "size": list(figure.size),
                "inner_size": list(inner.size),
                "inner_box_xyxy": list(inner_box),
                "padding_px_per_side": 12,
                "padding_all_white": True,
                "pixel_difference_bbox": None,
                "different_pixels": 0,
                "coarse_box_xyxy": list(coarse_box),
                "outside_final_box_ink_pixels_lt128": outside_ink,
            },
            "derived_native_details": outputs,
            "image_payloads_emitted": 0,
        },
        indent=2,
    )
)
