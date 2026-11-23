"""Estimate ordinary drawn ray directions; emit numeric evidence only."""

import hashlib
import json
import math
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
SOURCE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-222.png"
OUTPUT = ROOT / ".tmp/stemrobin-187/n58/figures/source-ray-fit.json"


def fit_centers(image, bounds):
    x0, y0, x1, y1 = bounds
    centers = []
    for x in range(x0, x1 + 1):
        ys = [y for y in range(y0, y1 + 1) if image.getpixel((x, y)) < 100]
        if ys:
            centers.append((x, sum(ys) / len(ys)))
    assert len(centers) >= 40
    mean_x = sum(x for x, _ in centers) / len(centers)
    mean_y = sum(y for _, y in centers) / len(centers)
    slope = sum((x - mean_x) * (y - mean_y) for x, y in centers) / sum(
        (x - mean_x) ** 2 for x, _ in centers
    )
    intercept = mean_y - slope * mean_x
    rms = math.sqrt(sum((y - slope * x - intercept) ** 2 for x, y in centers) / len(centers))
    return {
        "pixelWindowXYInclusive": bounds,
        "occupiedColumns": len(centers),
        "slopeScreenYOverX": slope,
        "interceptScreenY": intercept,
        "columnCenterRmsPx": rms,
        "directionScreenDegrees": math.degrees(math.atan(slope)),
    }


assert Path.cwd() == ROOT
assert not OUTPUT.exists(), "Preserve the first numerical evidence."
with Image.open(SOURCE) as source_image:
    image = source_image.convert("L")
    k = fit_centers(image, [150, 250, 335, 315])
    p = fit_centers(image, [85, 315, 145, 440])

vertex_x = (p["interceptScreenY"] - k["interceptScreenY"]) / (
    k["slopeScreenYOverX"] - p["slopeScreenYOverX"]
)
vertex_y = k["slopeScreenYOverX"] * vertex_x + k["interceptScreenY"]
angle = p["directionScreenDegrees"] - k["directionScreenDegrees"]
directions = {
    "K": -k["directionScreenDegrees"],
    "P": -p["directionScreenDegrees"],
    "O": -k["directionScreenDegrees"] + angle,
    "M": -k["directionScreenDegrees"] + angle / 2,
}
lengths = {"O": 430, "M": 465, "K": 420, "P": 350}
vertex = [90, 375]
points = {
    name: [
        vertex[0] + lengths[name] * math.cos(math.radians(direction)),
        vertex[1] + lengths[name] * math.sin(math.radians(direction)),
    ]
    for name, direction in directions.items()
}
arc = {
    name: [
        vertex[0] + 92 * math.cos(math.radians(directions[name])),
        vertex[1] + 92 * math.sin(math.radians(directions[name])),
    ]
    for name in ("P", "K")
}
evidence = {
    "source": {
        "path": str(SOURCE.relative_to(ROOT)),
        "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    },
    "method": "Least-squares line through each occupied pixel-column's dark-stroke center; isolated AK/AP windows exclude labels, vertex and arc. Ordinary drawn-angle estimate, not paper calibration.",
    "threshold": 100,
    "AK": k,
    "AP": p,
    "lineIntersectionScreenPx": [vertex_x, vertex_y],
    "approximateSourceKAPDegrees": angle,
    "regularization": "Keep fitted K/P directions. Derive O by reflecting P about K and M halfway from O to K, strictly from current exercise 967 text. Clean O is text-driven, not a Q-glyph pixel claim.",
    "candidateVertex": vertex,
    "candidateDirectionsDegrees": directions,
    "candidateLengths": lengths,
    "candidatePoints": points,
    "candidateArcRadius": 92,
    "candidateArcEndpoints": arc,
    "imageOutputCount": 0,
}
OUTPUT.write_text(json.dumps(evidence, indent=2) + "\n", encoding="ascii")
print(json.dumps(evidence, indent=2))
