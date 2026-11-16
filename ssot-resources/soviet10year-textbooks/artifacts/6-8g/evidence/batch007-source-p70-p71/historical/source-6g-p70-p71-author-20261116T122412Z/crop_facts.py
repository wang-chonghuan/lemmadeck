import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops

root = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
out = Path(__file__).resolve().parent
work = root / ".tmp/ld-s10y-lesson/6-8g/pages"
durable = root / "ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages"
items = []
for record_path in sorted(out.glob("crop-*.json")):
    item = json.loads(record_path.read_text())
    item["kind"] = "author-original-pixel-crop"
    items.append(item)
for page in ["0070", "0071"]:
    audit_path = durable / page / "audit.json"
    if not audit_path.exists():
        continue
    audit = json.loads(audit_path.read_text())
    for figure in audit["figures"]:
        items.append({
            "kind": "official-finalize-crop",
            "source": str(work / page / "page.png"),
            "output": str(work / page / "figures" / f"{figure['id']}.png"),
            "box_xywh": figure["box"],
            "official_audit_figure": figure,
        })
for item in items:
    x, y, w, h = item["box_xywh"]
    with Image.open(item["source"]) as source, Image.open(item["output"]) as crop:
        original_region = source.crop((x, y, x + w, y + h)).convert("RGB")
        actual = crop.convert("RGB")
        pad = 12 if item["kind"] == "official-finalize-crop" else 0
        left, top = max(0, x - pad), max(0, y - pad)
        right, bottom = min(source.width, x + w + pad), min(source.height, y + h + pad)
        expected = Image.new("RGB", (right - left, bottom - top), (255, 255, 255))
        expected.paste(original_region, (x - left, y - top))
        content = actual.crop((x - left, y - top, x - left + w, y - top + h))
        item["size"] = list(actual.size)
        item["padding_px_ltrb"] = [x - left, y - top, right - x - w, bottom - y - h]
        item["source_extent_xywh_with_padding"] = [left, top, right - left, bottom - top]
        item["expected_size"] = list(expected.size)
        item["actual_size_matches_expected"] = actual.size == expected.size
        item["source_region_rgb_sha256"] = hashlib.sha256(original_region.tobytes()).hexdigest()
        item["actual_content_region_rgb_sha256"] = hashlib.sha256(content.tobytes()).hexdigest()
        item["expected_padded_rgb_sha256"] = hashlib.sha256(expected.tobytes()).hexdigest()
        item["actual_crop_rgb_sha256"] = hashlib.sha256(actual.tobytes()).hexdigest()
        difference = ImageChops.difference(expected, actual)
        item["comparison_alignment"] = "Original snapped content at actual crop offset, white padding accounted for; not a shifted unpadded comparison"
        item["source_pixel_difference_bbox_crop_local"] = difference.getbbox()
        item["different_rgb_pixels"] = sum(pixel != (0, 0, 0) for pixel in difference.getdata())
        item["png_bytes"] = Path(item["output"]).stat().st_size
        item["png_sha256"] = hashlib.sha256(Path(item["output"]).read_bytes()).hexdigest()
        item["source_sha256"] = hashlib.sha256(Path(item["source"]).read_bytes()).hexdigest()
print(json.dumps(items, indent=2))
