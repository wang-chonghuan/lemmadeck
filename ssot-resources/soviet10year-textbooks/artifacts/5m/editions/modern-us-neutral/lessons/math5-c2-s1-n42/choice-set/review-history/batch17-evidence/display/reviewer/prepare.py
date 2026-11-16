"""Montage supplied n42 display captures without altering their pixels."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence/5m"
LESSON = "math5-c2-s1-n42"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def item(path, surface, width, endpoint):
    with Image.open(path) as image:
        image.load()
        size = list(image.size)
    return {
        "filename": path.name,
        "path": str(path.relative_to(ROOT)),
        "sha256": sha(path),
        "size": size,
        "surface": surface,
        "viewport_width": width,
        "endpoint": endpoint,
    }


def montage(items, name, columns):
    images = [Image.open(ROOT / entry["path"]).convert("RGB") for entry in items]
    cell_width = max(image.width for image in images)
    cell_height = max(image.height for image in images)
    rows = (len(items) + columns - 1) // columns
    pad, caption = 8, 24
    canvas = Image.new(
        "RGB",
        (columns * (cell_width + pad) + pad,
         rows * (cell_height + caption + pad) + pad),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    members = []
    for index, (entry, image) in enumerate(zip(items, images)):
        x = pad + index % columns * (cell_width + pad)
        y = pad + index // columns * (cell_height + caption + pad)
        draw.text((x, y + 4), entry["filename"], fill="black")
        canvas.paste(image, (x, y + caption))
        members.append({
            **entry,
            "rect": [x, y + caption, image.width, image.height],
            "resized": False,
        })
    path = OUT / name
    canvas.save(path)
    return {
        "filename": path.name,
        "path": str(path.relative_to(ROOT)),
        "sha256": sha(path),
        "size": list(canvas.size),
        "members": members,
    }


def main():
    report_path = SOURCE / "n42-report.json"
    formula_path = SOURCE / f"{LESSON}-formula-ends.json"
    reports = [
        {"filename": path.name, "path": str(path.relative_to(ROOT)), "sha256": sha(path)}
        for path in (report_path, formula_path)
    ]
    endpoints, montages = [], []
    for surface in ("text", "exercises", "choices"):
        for width in (1440, 390):
            entries = [
                item(SOURCE / f"{LESSON}-{surface}-{width}-{endpoint}.png",
                     surface, width, endpoint)
                for endpoint in ("first", "last")
            ]
            endpoints.extend(entries)
            montages.append(montage(
                entries, f"{surface}-{width}-endpoints.png",
                1 if width == 1440 else 2,
            ))
    formulas = []
    for observation in json.loads(formula_path.read_text())["observations"]:
        path = ROOT / observation["screenshot"]
        if path.parent != SOURCE:
            raise RuntimeError(f"Unexpected capture path: {path}")
        entry = item(path, observation["surface"], observation["viewport"]["width"],
                     f"formula-{observation['region']['i']}-end")
        entry["reported_scroll_end"] = observation["end"]
        formulas.append(entry)
    if len(formulas) != 5:
        raise RuntimeError("Expected the five supplied formula-end captures")
    montages.append(montage(formulas, "formula-ends.png", 1))
    figures = [
        item(SOURCE / f"{LESSON}-text-{width}-figure-1{ending}.png",
             "text", width, f"prose-image{ending or '-full'}")
        for width, ending in ((1440, ""), (390, ""), (390, "-end"))
    ]
    montages.append(montage(figures[:1], "prose-image-desktop.png", 1))
    montages.append(montage(figures[1:], "prose-image-mobile.png", 2))
    manifest = {
        "lesson": LESSON,
        "status": "pending actual pixel observation",
        "rejected_history_not_semantic_approval": True,
        "reports": reports,
        "endpoints": endpoints,
        "formula_ends": formulas,
        "prose_image_captures": figures,
        "montages": montages,
        "unique_surface_viewport_combinations": 6,
        "method": "Supplied PNG native pixels only. Original prose-image captures are inspected for display, not source fidelity or semantics. No browser, render or authoring.",
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Prepared 12 endpoints, 5 formula ends and 3 prose-image captures in 9 native-pixel montages.")


if __name__ == "__main__":
    main()
