import hashlib
import json
from pathlib import Path

from PIL import Image


root = Path(__file__).resolve().parents[1]
repo = root.parents[4]
source = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-172.png"
image = Image.open(source).convert("RGB")


def ink(x, y):
    return max(image.getpixel((x, y))) < 150


def ranges(x, lower, upper):
    rows = [y for y in range(lower, upper + 1) if ink(x, y)]
    result = []
    for y in rows:
        if not result or y > result[-1][-1] + 1:
            result.append([y])
        else:
            result[-1].append(y)
    return [[part[0], part[-1]] for part in result]


trace = []
for x in range(208, 456):
    parts = ranges(x, 20, 270)
    if len(parts) != 1:
        raise ValueError((x, parts))
    low, high = parts[0]
    trace.append([x, (low + high) / 2])

payload = {
    "source": {
        "path": str(source),
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "size": list(image.size),
    },
    "method": {
        "threshold": "all RGB channels below 150",
        "domain": "integer columns 208 through 455 inclusive, rows 20 through 270",
        "measurement": "midpoint of the unique contiguous ink run in each column",
        "limits": "Raster centerline only; pixel quantization is not physical rho data. The shoulder and zero/transition are inventoried separately. No curve interpolation or extrapolation.",
    },
    "measuredUpperTrace": trace,
    "diagnostics": {
        "transitionColumns": {
            str(x): ranges(x, 195, 285) for x in range(197, 209)
        },
        "upperEndpointColumns": {
            str(x): ranges(x, 20, 65) for x in range(444, 458)
        },
        "tickColumns": {
            str(x): ranges(x, 280, 303)
            for x in [92, 93, 94, 127, 128, 129, 160, 161, 162,
                      194, 195, 196, 230, 231, 232]
        },
    },
}
target = root / "inventory/source-pixel-measurements.json"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(payload, indent=2) + "\n")
print(json.dumps({
    "path": str(target),
    "source": payload["source"],
    "points": len(trace),
    "first": trace[0],
    "last": trace[-1],
    "diagnostics": payload["diagnostics"],
}, indent=2))
