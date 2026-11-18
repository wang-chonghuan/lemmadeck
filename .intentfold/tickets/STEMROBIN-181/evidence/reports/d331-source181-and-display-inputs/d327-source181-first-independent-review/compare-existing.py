"""Read-only input checks using the already-created resvg rasters; no tracing."""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label, find_objects

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = REPO / "tmp/d327-source181-first-independent-review"
ROOT = REPO / ".intentfold/tickets/STEMROBIN-181/evidence/reports/d285-bounded-progress/d279-source181-first-author"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def gray(path):
    return np.asarray(Image.open(path).convert("L"))


def dilate(mask):
    # The native contour contract uses all eight neighbours at one pixel.
    padded = np.pad(mask, 1)
    h, w = mask.shape
    result = np.zeros_like(mask)
    for dy in range(3):
        for dx in range(3):
            result |= padded[dy:dy + h, dx:dx + w]
    return result


def regions(mask):
    numbered, count = label(mask, structure=np.ones((3, 3), dtype=int))
    result = []
    for index, region in enumerate(find_objects(numbered), 1):
        if region is None:
            continue
        ys, xs = region
        pixels = int((numbered[region] == index).sum())
        result.append({"pixels": pixels, "box_xywh": [xs.start, ys.start, xs.stop - xs.start, ys.stop - ys.start]})
    return sorted(result, key=lambda r: r["pixels"], reverse=True)


page = gray(ROOT / "work/10p/pages/0181/page.png")
candidate = json.loads((ROOT / "source/10p/pages/0181/page.json").read_text())
records = []
for item in candidate["meta"]["figures"]:
    name = item["id"]
    raw_path = ROOT / f"work/10p/pages/0181/figures/{name}.png"
    raster_path = OUT / f"{name}.existing-svg.resvg.png"
    raw = gray(raw_path)
    raster = gray(raster_path)
    x, y, w, h = item["box"]
    crop_origin = [x - 12, y - 12]
    page_crop = page[y - 12:y + h + 12, x - 12:x + w + 12]
    if raw.shape != raster.shape or raw.shape != page_crop.shape:
        raise ValueError(f"Size mismatch for {name}")
    source_ink = raw < 128
    raster_ink = raster < 128
    missing = source_ink & ~dilate(raster_ink)
    extra = raster_ink & ~dilate(source_ink)
    ink_pixels = int(source_ink.sum())
    missing_pixels = int(missing.sum())
    extra_pixels = int(extra.sum())
    ratio = (missing_pixels + extra_pixels) / ink_pixels
    records.append({
        "id": name,
        "rawSHA256": sha(raw_path),
        "svgSHA256": sha(ROOT / f"work/10p/pages/0181/figures/{name}.svg"),
        "rasterSHA256": sha(raster_path),
        "size": [raw.shape[1], raw.shape[0]],
        "candidateBoxXYWH": item["box"],
        "pageCropOriginXY": crop_origin,
        "paddingPx": 12,
        "rawExactlyEqualsPageCrop": bool(np.array_equal(raw, page_crop)),
        "pageCropDifferentPixels": int((raw != page_crop).sum()),
        "inkThreshold": 128,
        "tolerancePx": 1,
        "limit": 0.02,
        "inkPixels": ink_pixels,
        "missingPixels": missing_pixels,
        "extraPixels": extra_pixels,
        "mismatchRatio": ratio,
        "contourContractPass": ratio <= 0.02,
        "missingRegions": regions(missing),
        "extraRegions": regions(extra),
        "semanticPassImplied": False,
        "nativeFinalizeInvocations": 0,
        "nativeVectorizeInvocations": 0,
        "newRastersCreatedByThisScript": 0,
    })
result = {
    "schema": "source181-existing-raw-pixel-comparison@1",
    "pageSHA256": sha(ROOT / "work/10p/pages/0181/page.png"),
    "candidatePageJSONSHA256": sha(ROOT / "source/10p/pages/0181/page.json"),
    "records": records,
}
with (OUT / "pixel-comparison.json").open("x") as handle:
    json.dump(result, handle, indent=2)
    handle.write("\n")
print(json.dumps(result, indent=2))
