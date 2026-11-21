import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
DEST = ROOT / ".tmp/stemrobin-184-six/source166-glyph-recovery"
SOURCE = ROOT / ".tmp/ld-s10y-lesson/9c/pages/0166/page.png"
assert Path.cwd() == ROOT
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == (
    "10ff982b468562940b9324ef546b3a6a93b6cacf6066de3e6942d0c2c902f4a4"
)
specs = [
    ("row09-theorem.png", (180, 1107, 1460, 1167), [1112, 1162]),
    ("row19-conclusion.png", (180, 1885, 1460, 1960), [1885, 1956]),
]
assert not (DEST / "roi-bindings.json").exists()
for name, _, _ in specs:
    assert not (DEST / name).exists()

bindings = []
# The only original-image open and decoder load; no ROI reopen or resize.
with Image.open(SOURCE) as original:
    assert original.size == (1695, 2381)
    original.load()
    for name, box, band in specs:
        crop = original.crop(box)
        target = DEST / name
        crop.save(target, format="PNG")
        encoded = target.read_bytes()
        bindings.append({
            "path": str(target),
            "original_size_roi_box_xyxy": list(box),
            "source_physical_row_band": band,
            "width": crop.width,
            "height": crop.height,
            "encoded_bytes": len(encoded),
            "encoded_sha256": hashlib.sha256(encoded).hexdigest(),
        })
        crop.close()

result = {
    "source": str(SOURCE),
    "original_image_open_calls": 1,
    "explicit_original_load_calls": 1,
    "crop_calls": 2,
    "png_saves": 2,
    "roi_reopens_in_this_script": 0,
    "resize_grid_extra_decode_calls": 0,
    "encoded_hashing_is_not_decoding": True,
    "rois": bindings,
}
with (DEST / "roi-bindings.json").open("x", encoding="utf-8") as stream:
    json.dump(result, stream, indent=2, ensure_ascii=True)
    stream.write("\n")
print(json.dumps(result, indent=2, ensure_ascii=True))
