import hashlib
import json
from pathlib import Path

from PIL import Image, ImageFilter


OWNED = Path(__file__).resolve().parent
WORKSPACE = OWNED.parents[4]
SOURCE = WORKSPACE / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures"


def components(image, crop):
    # Erosion discards thin springs/threads while retaining the solid ball bodies.
    mask = image.point(lambda value: 255 if value < 100 else 0)
    mask = mask.filter(ImageFilter.MinFilter(5))
    pixels = mask.load()
    x0, y0, x1, y1 = crop
    seen = set()
    found = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            if pixels[x, y] == 0 or (x, y) in seen:
                continue
            stack = [(x, y)]
            seen.add((x, y))
            group = []
            while stack:
                px, py = stack.pop()
                group.append((px, py))
                for nx, ny in [(px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)]:
                    if (x0 <= nx < x1 and y0 <= ny < y1
                            and (nx, ny) not in seen and pixels[nx, ny]):
                        seen.add((nx, ny))
                        stack.append((nx, ny))
            if len(group) >= 18:
                found.append({
                    "erodedPixels": len(group),
                    "center": [round(sum(p[a] for p in group) / len(group), 3) for a in [0, 1]],
                    "erodedBounds": [
                        min(p[0] for p in group), min(p[1] for p in group),
                        max(p[0] for p in group), max(p[1] for p in group),
                    ],
                })
    return sorted(found, key=lambda item: item["center"][0])


def runs(image, row, start=0, stop=None):
    stop = stop or image.width
    pixels = image.load()
    result = []
    active = []
    for x in range(start, stop):
        if pixels[x, row] < 100:
            active.append(x)
        elif active:
            result.append([active[0], active[-1]])
            active = []
    if active:
        result.append([active[0], active[-1]])
    return result


def merge_fragments(items):
    groups = []
    for item in items:
        if groups and item["center"][0] - groups[-1][-1]["center"][0] < 25:
            groups[-1].append(item)
        else:
            groups.append([item])
    result = []
    for number, group in enumerate(groups, 1):
        bounds = [
            min(item["erodedBounds"][0] for item in group),
            min(item["erodedBounds"][1] for item in group),
            max(item["erodedBounds"][2] for item in group),
            max(item["erodedBounds"][3] for item in group),
        ]
        total = sum(item["erodedPixels"] for item in group)
        result.append({
            "number": number,
            "center": [round(sum(item["center"][a] * item["erodedPixels"] for item in group) / total, 3)
                       for a in [0, 1]],
            "erodedBounds": bounds,
            "fragmentCount": len(group),
        })
    return result


def number_regions(image, centers, top, bottom):
    result = []
    for index, center in enumerate(centers):
        left = 0 if index == 0 else (centers[index - 1]["center"][0] + center["center"][0]) / 2
        right = image.width if index == len(centers) - 1 else (center["center"][0] + centers[index + 1]["center"][0]) / 2
        pixels = [(x, y) for y in range(top, bottom) for x in range(int(left), int(right))
                  if image.getpixel((x, y)) < 100]
        result.append({
            "sourceNumber": index + 1,
            "pixelBounds": [min(x for x, y in pixels), min(y for x, y in pixels),
                            max(x for x, y in pixels), max(y for x, y in pixels)],
            "numberReading": "Direct original PNG inspection, not OCR inference.",
        })
    return result


def thread_tracks(image, row_a, row_b, count, rail_lines):
    first = runs(image, row_a)
    second = runs(image, row_b)
    assert len(first) == len(second) == count * 2
    result = []
    for index, (run_a, run_b) in enumerate(zip(first, second)):
        xa, xb = sum(run_a) / 2, sum(run_b) / 2
        slope = (xb - xa) / (row_b - row_a)
        intercept = xa - slope * row_a
        rail = rail_lines[index % 2]
        rail_slope, rail_intercept = rail
        y = (rail_slope * intercept + rail_intercept) / (1 - rail_slope * slope)
        x = slope * y + intercept
        result.append({
            "ball": index // 2 + 1, "thread": "left" if index % 2 == 0 else "right",
            "samplePixels": [[xa, row_a], [xb, row_b]],
            "railIntersectionPx": [round(x, 3), round(y, 3)],
            "method": "Two source-pixel scanline centers intersected with measured support edge; scan line roughness is not physical data.",
        })
    return result


def measure():
    data = {"method": "Pillow grayscale threshold <100, 5x5 erosion, connected components; no guessed PNG dimensions.",
            "ballCenterTolerancePx": 3, "sourcePixelsNotPhysicalCoordinates": True, "figures": {}}
    for number, crops, rows in [
        (69, {"balls": [0, 116, 1042, 163]}, [40, 50, 65, 170, 177]),
        (71, {"aBalls": [0, 207, 1099, 255], "bBalls": [0, 362, 1099, 395]},
         [60, 130, 160, 306, 321, 340, 365, 404, 411]),
    ]:
        file = SOURCE / f"fig-{number}.png"
        with Image.open(file) as original:
            image = original.convert("L")
            measured = {
                "source": {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()},
                "dimensions": {"width": original.width, "height": original.height},
                "ballGroups": {key: components(image, crop) for key, crop in crops.items()},
                "scanlineDarkRuns": {str(row): runs(image, row) for row in rows},
            }
            measured["balls"] = {key: merge_fragments(value)
                                 for key, value in measured["ballGroups"].items()}
            for group in measured["balls"].values():
                assert len(group) == 18
            main = measured["balls"]["balls" if number == 69 else "aBalls"]
            measured["numberRegions"] = number_regions(image, main, 164 if number == 69 else 257,
                                                       198 if number == 69 else 285)
            if number == 69:
                measured["threads"] = thread_tracks(image, 65, 80, 18, [(0, 30), (0, 30)])
                measured["supportPixelBounds"] = image.crop((0, 0, image.width, 39)).point(
                    lambda value: 255 if value < 100 else 0).getbbox()
            else:
                measured["threads"] = thread_tracks(image, 130, 160, 18,
                                                    [(-17 / 976, 34 + 55 * 17 / 976),
                                                     (-19 / 980, 111 + 104 * 19 / 980)])
                measured["supportCornersPx"] = [[55, 34], [1031, 17], [1084, 92], [104, 111]]
                measured["supportCornerMethod"] = "Direct original PNG edge/corner pixel coordinates, bounded by pixel scans."
                measured["referenceMarks"] = [
                    {"ball": index + 1, "top": [sum(run) / 2, 306], "bottom": [sum(lower) / 2, 340]}
                    for index, (run, lower) in enumerate(zip(runs(image, 306), runs(image, 340)))
                ]
                assert len(measured["referenceMarks"]) == 18
                measured["givenDimension"] = {
                    "sourceLabel": "lambda", "visibleEnglishSymbol": "\u03bb",
                    "leftBall": 4, "rightBall": 16,
                    "leftExtensionX": 252.5, "rightExtensionX": 944,
                    "leftArrowTipPx": [255, 412], "rightArrowTipPx": [941, 400],
                    "pixelMethod": "Original PNG direct observation; horizontal arrow pixels at rows 404/411 bound the slanted scan.",
                }
        data["figures"][str(number)] = measured
    output = OWNED / "png-measurements-v2.json"
    output.write_text(json.dumps(data, indent=2) + "\n")
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    measure()
