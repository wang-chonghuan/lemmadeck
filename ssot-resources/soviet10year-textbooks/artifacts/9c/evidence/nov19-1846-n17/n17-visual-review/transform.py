#!/usr/bin/env python3
"""Create reversible native-pixel sheets from the six existing offline PNGs."""

import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, __version__ as pillow_version


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
OUT = ROOT / ".tmp/stemrobin-184-six/n17-visual-review"
SOURCE = ROOT / ".tmp/stemrobin-184-six/n17-offline"
NAMES = [
    "text-1440",
    "exercises-1440",
    "choices-1440",
    "text-390",
    "exercises-390",
    "choices-390",
]
MAX_HEIGHT = 2400
GAP = 16
BACKGROUND = (240, 240, 240)


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    with path.open("x", encoding="ascii") as handle:
        json.dump(value, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


def main():
    receipt_path = OUT / "transform-receipt.json"
    if receipt_path.exists():
        raise FileExistsError("Preserve existing transform receipt; do not overwrite.")
    results_path = SOURCE / "results.json"
    results_hash = sha256_file(results_path)
    with results_path.open(encoding="utf-8") as handle:
        results = json.load(handle)
    assert results["headless"] is True
    assert results["closed"] is True
    assert len(results["views"]) == 6
    assert all(view["status"] == "pass" for view in results["views"])
    records = []

    for name in NAMES:
        original_path = SOURCE / f"{name}.png"
        sheet_path = OUT / f"{name}-sheet.png"
        if sheet_path.exists():
            raise FileExistsError(f"Preserve existing sheet: {sheet_path}")
        source_hash = sha256_file(original_path)
        with Image.open(original_path) as opened:
            opened.load()
            assert opened.mode == "RGB", "Do not silently convert source pixels."
            original = opened.copy()
        width, height = original.size
        columns = math.ceil(height / MAX_HEIGHT)
        tile_height = math.ceil(height / columns)
        sheet_width = columns * width + (columns - 1) * GAP
        sheet = Image.new("RGB", (sheet_width, tile_height), BACKGROUND)
        tiles = []
        for index in range(columns):
            top = index * tile_height
            bottom = min(height, top + tile_height)
            source_rect = (0, top, width, bottom)
            left = index * (width + GAP)
            target_rect = (left, 0, left + width, bottom - top)
            tile = original.crop(source_rect)
            sheet.paste(tile, (left, 0))
            tiles.append({
                "order": index + 1,
                "sourceRect": list(source_rect),
                "sheetRect": list(target_rect),
                "pixelCount": width * (bottom - top),
                "tileRawRgbSha256": hashlib.sha256(tile.tobytes()).hexdigest(),
            })
        with sheet_path.open("xb") as handle:
            sheet.save(handle, format="PNG")

        # Verify the saved PNG, not merely the in-memory composition.
        with Image.open(sheet_path) as opened:
            opened.load()
            assert opened.mode == original.mode
            assert opened.size == sheet.size
            decoded_sheet = opened.copy()
        reconstructed = Image.new("RGB", original.size)
        checks = []
        for tile in tiles:
            saved_tile = decoded_sheet.crop(tuple(tile["sheetRect"]))
            source_tile = original.crop(tuple(tile["sourceRect"]))
            equal = saved_tile.tobytes() == source_tile.tobytes()
            assert equal, f"Tile pixels differ: {name} tile {tile['order']}"
            reconstructed.paste(
                saved_tile, (tile["sourceRect"][0], tile["sourceRect"][1])
            )
            checks.append({"order": tile["order"], "exactRgbBytesEqual": equal})
        assert sum(tile["pixelCount"] for tile in tiles) == width * height
        assert tiles[0]["sourceRect"][1] == 0
        assert tiles[-1]["sourceRect"][3] == height
        assert all(
            tiles[index]["sourceRect"][3] == tiles[index + 1]["sourceRect"][1]
            for index in range(len(tiles) - 1)
        )
        raw_original = original.tobytes()
        raw_reconstructed = reconstructed.tobytes()
        assert raw_original == raw_reconstructed
        assert sha256_file(original_path) == source_hash
        records.append({
            "name": name,
            "original": {
                "path": str(original_path),
                "sha256": source_hash,
                "width": width,
                "height": height,
                "mode": original.mode,
                "rawRgbSha256": hashlib.sha256(raw_original).hexdigest(),
            },
            "sheet": {
                "path": str(sheet_path),
                "sha256": sha256_file(sheet_path),
                "width": sheet_width,
                "height": tile_height,
                "mode": decoded_sheet.mode,
            },
            "tiles": tiles,
            "verification": {
                "status": "pass",
                "verifiedAfterSavingAndDecoding": True,
                "tileChecks": checks,
                "everyOriginalPixelIncludedExactlyOnce": True,
                "originalPixelCount": width * height,
                "includedPixelCount": sum(tile["pixelCount"] for tile in tiles),
                "reconstructedRgbBytesEqualOriginal": True,
                "reconstructedRawRgbSha256": hashlib.sha256(
                    raw_reconstructed
                ).hexdigest(),
                "sourceFileUnchanged": True,
            },
        })
    assert sha256_file(results_path) == results_hash
    receipt = {
        "schema": "n17-native-pixel-transform@1",
        "createdUtc": datetime.now(timezone.utc).isoformat(),
        "scope": "Mechanical transformation only; no browser or image observation.",
        "tool": {"name": "Pillow", "version": pillow_version},
        "transformCode": {
            "path": str(Path(__file__).resolve()),
            "sha256": sha256_file(Path(__file__)),
        },
        "sourceResults": {
            "path": str(results_path),
            "sha256": results_hash,
            "status": results["status"],
            "headless": results["headless"],
            "closed": results["closed"],
            "sixNativeViewsPass": True,
        },
        "layout": {
            "maximumTileHeightPx": MAX_HEIGHT,
            "columnGapPx": GAP,
            "gapAndUnusedPaddingRgb": list(BACKGROUND),
            "rectangles": "Zero-based [left, top, right, bottom], right/bottom exclusive.",
            "order": "Read each column top-to-bottom, then columns left-to-right.",
            "columnCount": "ceil(original height / maximum tile height)",
            "tileHeight": "ceil(original height / column count)",
            "outerMarginsPx": 0,
            "scale": 1,
            "resampling": False,
            "contentAlteration": False,
            "labelsOverContent": False,
            "omittedOriginalPixels": 0,
            "duplicatedOriginalPixels": 0,
            "padding": "Only the 16px gaps and a shorter final column's unused bottom.",
        },
        "images": records,
        "status": "pass",
    }
    write_json(receipt_path, receipt)
    for record in records:
        print(json.dumps({
            "name": record["name"],
            "originalDimensions": [
                record["original"]["width"], record["original"]["height"]
            ],
            "sheetDimensions": [
                record["sheet"]["width"], record["sheet"]["height"]
            ],
            "columns": len(record["tiles"]),
            "sourceSha256": record["original"]["sha256"],
            "sheetSha256": record["sheet"]["sha256"],
            "verification": record["verification"]["status"],
        }))
    print(f"Transform receipt: {receipt_path}")


if __name__ == "__main__":
    main()
