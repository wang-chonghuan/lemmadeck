"""Crop existing pixels and mark saved bands; never calculate or replay counts."""

import sys
from pathlib import Path

sys.dont_write_bytecode = True

from PIL import Image, ImageDraw

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent

DIAGNOSTICS = [
    (216, "0216-bottom-saved-band.png", (1180, 1990, 1504, 2220), (2153, 2177)),
    (218, "0218-bottom-saved-band.png", (1180, 2000, 1504, 2220), (2141, 2170)),
    (219, "0219-biography-saved-bands.png", (130, 1385, 1310, 1985), None),
]

for page, name, box, band in DIAGNOSTICS:
    source = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}/page.png"
    with Image.open(source) as image:
        crop = image.convert("RGB").crop(box)
    if band:
        draw = ImageDraw.Draw(crop)
        for y in band:
            draw.line((0, y - box[1], crop.width - 1, y - box[1]), fill="red")
    crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST)
    crop.save(OUT / name)
    print(f"{name}: source={source}; xyxy={box}; saved_band={band}; scale=2")
