from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parents[4] / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-169.png"
BOX = (70, 170, 225, 335)

with Image.open(SOURCE) as image:
    image.crop(BOX).resize((620, 660), Image.Resampling.NEAREST).save(
        ROOT / "fig-169.source-center-detail.png"
    )
