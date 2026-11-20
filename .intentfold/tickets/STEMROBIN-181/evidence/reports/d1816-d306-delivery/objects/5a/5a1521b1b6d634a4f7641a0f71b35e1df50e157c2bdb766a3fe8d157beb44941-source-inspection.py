from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d268-source48-51-author"
SOURCE = ROOT / ".tmp/STEMROBIN-181/d1816-d268/source-work/10p/pages"
CROPS = {
    "p0049-figures-footnote.png": (49, (190, 790, 1385, 1900)),
    "p0050-formulas.png": (50, (270, 920, 1460, 2050)),
    "p0051-figures.png": (51, (220, 1280, 1375, 1940)),
    "p0050-spring.png": (50, (1090, 1720, 1260, 1980)),
}


if __name__ == "__main__":
    (OWNED / "inspection-crops").mkdir(parents=True, exist_ok=True)
    for name, (page, box) in CROPS.items():
        with Image.open(SOURCE / f"{page:04d}" / "page.png") as image:
            crop = image.crop(box)
            if name == "p0050-spring.png":
                crop = crop.resize((340, 520), Image.Resampling.NEAREST)
            crop.save(OWNED / "inspection-crops" / name)
