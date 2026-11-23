"""Sample retained screenshots without browser capture or pixel rescaling."""

from pathlib import Path

from PIL import Image, ImageDraw


HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent
LABEL_HEIGHT = 24
BANDS = {
    "text-1440.png": [(0, 960)],
    "text-390.png": [(0, 957)],
    "exercises-1440.png": [(0, 951), (4210, 4636), (4828, 5235)],
    "exercises-390.png": [(0, 550), (703, 1062), (5245, 5705), (5925, 6317)],
    "choices-1440.png": [(0, 300), (5898, 6620), (11855, 12280), (13136, 13492)],
    "choices-390.png": [(0, 379), (7190, 7945), (13950, 14265), (15345, 15685)],
    "answers-1440.png": [(0, 910), (1930, 2200), (3290, 3936)],
    "answers-390.png": [(0, 800), (2500, 2865), (4470, 5072)],
}


for name, bands in BANDS.items():
    target = HERE / f"{Path(name).stem}-inspection.png"
    if target.exists():
        raise FileExistsError(target)
    with Image.open(SOURCE / name) as original:
        width, height = original.size
        total = sum(end - start + LABEL_HEIGHT for start, end in bands)
        if total > 1900:
            raise ValueError(f"{name}: composite height {total} exceeds 1900")
        composite = Image.new("RGB", (width, total), "white")
        draw = ImageDraw.Draw(composite)
        offset = 0
        for start, end in bands:
            if not 0 <= start < end <= height:
                raise ValueError(f"{name}: invalid band {(start, end)}")
            draw.rectangle(
                (0, offset, width - 1, offset + LABEL_HEIGHT - 1),
                fill="#dbe3e8",
            )
            draw.text(
                (8, offset + 5),
                f"{name} | original y=[{start},{end})",
                fill="#172127",
            )
            offset += LABEL_HEIGHT
            composite.paste(original.crop((0, start, width, end)), (0, offset))
            offset += end - start
        composite.save(target)
        print(f"{target.name}: {width}x{total}; bands={bands}")
