from pathlib import Path
from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d565-source419-first-review"
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d561/work/10p/pages/0419/page.png"


def main():
    with Image.open(SOURCE) as source:
        crops = {
            "source-caption.png": (180, 1880, 1450, 2040),
            "source-letters-row4-mark.png": (130, 780, 1480, 1040),
        }
        for name, box in crops.items():
            destination = OWN / name
            if destination.exists():
                raise FileExistsError(destination)
            source.crop(box).save(destination)
            print(f"{destination} source_xyxy={box}")


if __name__ == "__main__":
    main()
