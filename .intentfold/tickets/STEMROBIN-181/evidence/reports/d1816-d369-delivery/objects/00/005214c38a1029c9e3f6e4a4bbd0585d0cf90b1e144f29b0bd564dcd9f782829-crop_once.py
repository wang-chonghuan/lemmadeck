"""Make only specified native-pixel crops; never OCR or alter source PNGs."""
import hashlib
import json
from pathlib import Path

from PIL import Image


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
EVIDENCE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d360-source395-397-first-author"
WORK = REPO / ".tmp/STEMROBIN-181/d1816-d360/source-work"
CROPS = [
    (396, "0396-row10-punctuation", (180, 790, 900, 930)),
    (396, "0396-rows13-22-emphasis-footnote", (180, 1050, 1380, 2000)),
    (397, "0397-ex10-12-notation", (155, 1520, 1350, 1905)),
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    if Path.cwd().resolve() != REPO:
        raise RuntimeError("cwd must be the authorized checkout")
    target = WORK / "crops"
    target.mkdir(parents=True, exist_ok=True)
    receipt = EVIDENCE / "crop-receipt.json"
    if receipt.exists():
        raise RuntimeError("crop call already recorded; do not repeat")
    entries = []
    for page, name, box in CROPS:
        source = WORK / "10p/pages" / f"{page:04d}" / "page.png"
        output = target / f"{name}.png"
        if output.exists():
            raise RuntimeError(f"crop already exists: {output}")
        with Image.open(source) as image:
            image.crop(box).save(output)
        entries.append({
            "source_page": page, "source": str(source),
            "source_sha256": sha(source), "box_xyxy": box,
            "output": str(output), "output_sha256": sha(output),
            "operation": "native-pixel crop only; no rescale, threshold, OCR or synthesis",
        })
    with receipt.open("x", encoding="utf-8") as stream:
        json.dump({"schema": "STEMROBIN-181/crop-receipt@1", "entries": entries}, stream, indent=2)
        stream.write("\n")
    print(json.dumps(entries, indent=2))


if __name__ == "__main__":
    main()
