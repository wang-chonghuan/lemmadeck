import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


HERE = Path(__file__).resolve().parent


def load(name):
    return json.loads((HERE / name).read_text(encoding="utf-8"))


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def assert_binding(record):
    assert sha256(record["path"]) == record["sha256"], record["path"]


render = load("render-evidence.json")
crops = load("crop-evidence.json")
opens = load("actual-opens.json")
inventory = load("independent-inventory.json")
for record in render["boundInputs"]:
    assert_binding(record)
for record in crops:
    assert_binding(record)
    assert sha256(record["sourcePath"]) == record["sourceSha256"]
for record in opens["opens"]:
    assert_binding(record)
    if "sourceSvgPath" in record:
        assert sha256(record["sourceSvgPath"]) == record["sourceSvgSha256"]
assert [record["ordinal"] for record in opens["opens"]] == list(range(1, 8))
assert opens["batchImagesOpened"] == opens["freshContextImagesOpened"] == 7
assert opens["finished"] is True
assert opens["compactionReset"] is False
assert inventory["lineInventory"]["totalPrintedTextRows"] == 18
assert inventory["boundaries"]["page167HistoricalHold"].startswith("unchanged")
source_path = render["boundInputs"][0]["path"]
audit_path = render["boundInputs"][3]["path"]
audit = json.loads(Path(audit_path).read_text(encoding="utf-8"))
measurements = []
with Image.open(source_path) as source:
    for figure in render["renders"]:
        assert_binding(figure["renderedPng"])
        box = next(item["box"] for item in audit["figures"] if item["id"] == figure["id"])
        x, y, width, height = box
        bounds = (x - 12, y - 12, x + width + 12, y + height + 12)
        with Image.open(figure["originalPng"]["path"]) as png, Image.open(figure["renderedPng"]["path"]) as svg:
            expected = source.crop(bounds).convert("RGB")
            original = png.convert("RGB")
            assert original.size == expected.size == svg.size
            assert ImageChops.difference(original, expected).getbbox() is None
            original_ink = original.convert("L").point(lambda p: 255 if p < 128 else 0)
            svg_ink = svg.convert("L").point(lambda p: 255 if p < 128 else 0)
            original_near = original_ink.filter(ImageFilter.MaxFilter(3))
            svg_near = svg_ink.filter(ImageFilter.MaxFilter(3))
            lost = ImageChops.subtract(original_ink, svg_near)
            added = ImageChops.subtract(svg_ink, original_near)
            missing_pixels = sum(lost.histogram()[1:])
            added_pixels = sum(added.histogram()[1:])
            area = original.width * original.height
            mismatch = (missing_pixels + added_pixels) / area
            assert mismatch <= 0.02, f"{figure['id']} exceeds 2% 1px-tolerant mismatch"
            measurements.append({
                "id": figure["id"],
                "sourceCropBoundsXYXY": bounds,
                "dimensions": list(original.size),
                "pngMatchesSourceCropExactly": True,
                "svgMissingInkBeyond1px": missing_pixels,
                "svgAddedInkBeyond1px": added_pixels,
                "svgMismatchRatioByCanvasArea": mismatch,
                "threshold": 0.02,
                "thresholdPixelLuminance": 128,
                "tolerance": "3x3 dilation, Chebyshev radius 1px",
                "visualApprovalNotInferredFromNumbers": True,
            })
result = {
    "status": "PASS-evidence-integrity-and-pixel-support",
    "currentInputHashesUnchanged": True,
    "actualImageOpenCount": 7,
    "measurements": measurements,
    "reviewDocumentsParsed": ["independent-inventory.json", "actual-opens.json"],
}
output = HERE / "verification-evidence.json"
assert not output.exists(), "Do not overwrite existing verification"
output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
