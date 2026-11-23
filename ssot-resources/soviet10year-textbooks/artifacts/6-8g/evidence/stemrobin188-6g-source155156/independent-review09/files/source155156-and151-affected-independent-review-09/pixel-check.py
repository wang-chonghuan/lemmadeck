import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
INPUT = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source155156-independent-inputs-09"
source = json.loads((INPUT / "source-only.json").read_text())
post = json.loads((INPUT / "post-FIRST.json").read_text())
originals = {item["physical"]: item["png"]["path"] for item in source["originals"]}
checks = []
for candidate in post["candidates"]:
    physical = candidate["physical"]
    with Image.open(originals[physical]) as opened:
        original = opened.convert("RGB")
    structured_path = next(item["path"] for item in candidate["files"] if item["path"].endswith("page.json"))
    structured = json.loads(Path(structured_path).read_text())
    for crop_entry in candidate["crops"]:
        figure_id = Path(crop_entry["path"]).stem
        figure = next(item for item in structured["meta"]["figures"] if item["id"] == figure_id)
        x, y, w, h = figure["box"]
        with Image.open(crop_entry["path"]) as opened:
            actual = opened.convert("RGB")
        expected = Image.new("RGB", (w + 24, h + 24), "white")
        expected.paste(original.crop((x, y, x + w, y + h)), (12, 12))
        assert actual.size == expected.size
        assert ImageChops.difference(actual, expected).getbbox() is None
        checks.append({
            "page": physical, "figure": figure_id, "box": figure["box"],
            "size": list(actual.size), "padding": 12, "exactRgbEquality": True,
            "cropSha256": hashlib.sha256(Path(crop_entry["path"]).read_bytes()).hexdigest(),
        })

with Image.open(originals[155]) as opened:
    page = opened.convert("L")

def ink_region(name, box, image=None):
    image = page if image is None else image
    x, y, w, h = box
    region = image.crop((x, y, x + w, y + h))
    ink = region.point(lambda p: 255 if p < 128 else 0)
    bounds = ink.getbbox()
    row_stats = []
    pixels = ink.load()
    for j in range(h):
        columns = [i for i in range(w) if pixels[i, j]]
        if columns:
            row_stats.append({"y": y + j, "pixels": len(columns), "xMin": x + min(columns), "xMax": x + max(columns)})
    return {
        "name": name, "inspectedBox": box,
        "inkBox": None if bounds is None else [x + bounds[0], y + bounds[1], bounds[2] - bounds[0], bounds[3] - bounds[1]],
        "rows": row_stats,
    }

regions = [
    ink_region("short-footnote-separator", [150, 1745, 460, 45]),
    ink_region("long-pre-heading-separator", [150, 1300, 1130, 35]),
    ink_region("new-heading33", [235, 1345, 580, 60]),
    ink_region("unknown-downward-mark-after33", [290, 1350, 40, 45]),
]
with Image.open(originals[156]) as opened:
    page156 = opened.convert("L")
shared_rows = [
    ink_region("last-prose-row156", [140, 1840, 570, 60], page156),
    ink_region("caption211-same-row", [900, 1850, 150, 50], page156),
    ink_region("caption209", [365, 870, 150, 60], page156),
    ink_region("caption210", [900, 870, 150, 60], page156),
]
for item in shared_rows:
    del item["rows"]
print(json.dumps({
    "status": "PASS_PIXEL_ONLY_NO_OCR_NO_IMAGE_PAYLOAD_NO_WRITES",
    "figureCropChecks": checks,
    "physical155Regions": regions,
    "physical156SharedRowPixelBounds": shared_rows,
}, indent=2))
