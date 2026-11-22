from pathlib import Path
import json

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
SOURCE = ROOT / ".tmp/stemrobin-184-six/source10c5255-work/10c/pages/0068/page.png"
OUTPUT = ROOT / ".tmp/stemrobin-184-six/source10c68-operator-review/phaseA/roi-01.png"
BOX = (600, 305, 1170, 385)

with Image.open(SOURCE) as source:
    source.load()
    if source.size != (1695, 2580):
        raise ValueError(f"Unexpected source dimensions: {source.size}")
    source_mode = source.mode
    with source.crop(BOX) as roi:
        with OUTPUT.open("xb") as stream:
            roi.save(stream, format="PNG")
        print(json.dumps({
            "source": str(SOURCE),
            "sourceDimensions": list(source.size),
            "sourceMode": source_mode,
            "output": str(OUTPUT),
            "boxXYXYHalfOpen": list(BOX),
            "roiDimensions": list(roi.size),
            "roiMode": roi.mode,
            "pixelOperation": "native crop only",
            "sourceOpens": 1,
            "sourceLoads": 1,
            "roiSaveCalls": 1
        }))
