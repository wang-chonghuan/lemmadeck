"""Prepare native-pixel montages of supplied n33 screenshots only."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


DIRECTORY = Path(__file__).resolve().parent
LESSON = "alg6-c4-s1-n33"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    reports = [DIRECTORY / "n33-report.json"]
    formula_report = DIRECTORY / f"{LESSON}-formula-ends.json"
    if formula_report.exists():
        reports.append(formula_report)
    screenshots = []
    montages = []
    for surface in ("text", "exercises", "choices"):
        for width in (1440, 390):
            paths = [
                DIRECTORY / f"{LESSON}-{surface}-{width}-{endpoint}.png"
                for endpoint in ("first", "last")
            ]
            images = []
            for path in paths:
                with Image.open(path) as source:
                    source.load()
                    images.append(source.convert("RGB"))
            image_width = max(image.width for image in images)
            image_height = max(image.height for image in images)
            columns = 1 if width == 1440 else 2
            rows = 2 if width == 1440 else 1
            pad, caption = 8, 24
            canvas = Image.new(
                "RGB",
                (columns * (image_width + pad) + pad,
                 rows * (image_height + caption + pad) + pad),
                "white",
            )
            draw = ImageDraw.Draw(canvas)
            members = []
            for index, (path, image) in enumerate(zip(paths, images)):
                x = pad + index % columns * (image_width + pad)
                y = pad + index // columns * (image_height + caption + pad)
                draw.text((x, y + 4), path.name, fill="black")
                canvas.paste(image, (x, y + caption))
                member = {
                    "filename": path.name,
                    "sha256": sha(path),
                    "size": list(image.size),
                    "surface": surface,
                    "viewport_width": width,
                    "endpoint": ("first", "last")[index],
                    "montage_rect": [x, y + caption, image.width, image.height],
                    "resized": False,
                }
                members.append(member)
                screenshots.append(member)
            output = DIRECTORY / f"n33-actual-display-{surface}-{width}-montage.png"
            canvas.save(output)
            montages.append({
                "filename": output.name,
                "sha256": sha(output),
                "size": list(canvas.size),
                "members": members,
            })
    formula_screenshots = []
    if formula_report.exists():
        report = json.loads(formula_report.read_text())
        for observation in report["observations"]:
            path = Path.cwd() / observation["screenshot"]
            if path.parent != DIRECTORY:
                raise RuntimeError(f"Unexpected formula evidence directory: {path}")
            with Image.open(path) as image:
                image.load()
                formula_screenshots.append({
                    "filename": path.name,
                    "sha256": sha(path),
                    "size": list(image.size),
                    "surface": observation["surface"],
                    "viewport_width": observation["viewport"]["width"],
                    "endpoint": "formula-end",
                    "report_observation": observation,
                })
    payload = {
        "lesson": LESSON,
        "status": "pending actual image inspection",
        "method": "Supplied PNGs decoded and copied without resizing into labeled montages. No browser, renderer, source figure, semantic choice authoring or durable output changes.",
        "reports": [
            {"filename": path.name, "sha256": sha(path)}
            for path in reports
        ],
        "screenshots": screenshots,
        "montages": montages,
        "formula_screenshots": formula_screenshots,
        "unique_surface_viewport_combinations": 6,
    }
    output = DIRECTORY / "n33-actual-display-montage-manifest.json"
    output.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Prepared {len(screenshots)} endpoints in {len(montages)} native-pixel montages.")
    print(f"Additional supplied formula-end captures: {len(formula_screenshots)}.")


if __name__ == "__main__":
    main()
