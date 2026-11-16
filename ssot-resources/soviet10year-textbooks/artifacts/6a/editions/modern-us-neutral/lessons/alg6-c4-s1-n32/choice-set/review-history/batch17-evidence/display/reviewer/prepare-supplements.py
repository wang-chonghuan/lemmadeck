"""Prepare new pixels while retaining exact blocked review history."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def record(path):
    return {"path": str(path.relative_to(ROOT)), "sha256": sha(path)}


def main():
    report_path = EVIDENCE / "6a/n33-option-end-captures.json"
    report = json.loads(report_path.read_text())
    if not report["html_unchanged"] or len(report["observations"]) != 14:
        raise RuntimeError("Unexpected n33 supplementary scope")
    entries, images = [], []
    for observation in report["observations"]:
        path = Path(observation["screenshot"])
        if sha(path) != observation["sha256"]:
            raise RuntimeError(f"Stale supplementary pixels: {path}")
        with Image.open(path) as source:
            source.load()
            images.append(source.convert("RGB"))
            entries.append({
                **record(path),
                "filename": path.name,
                "size": list(source.size),
                "question": observation["question"],
                "option": observation["option"],
                "reported_scroll_end": {
                    key: observation[key]
                    for key in ("left", "max", "mathRight", "viewportRight")
                },
            })
    width = max(image.width for image in images)
    height = max(image.height for image in images)
    pad, caption, columns = 8, 24, 2
    canvas = Image.new("RGB", (2 * (width + pad) + pad,
                              7 * (height + caption + pad) + pad), "white")
    draw = ImageDraw.Draw(canvas)
    for index, (entry, image) in enumerate(zip(entries, images)):
        x = pad + index % columns * (width + pad)
        y = pad + index // columns * (height + caption + pad)
        draw.text((x, y + 4),
                  f"n33 Q{entry['question']} {entry['option']} horizontal end",
                  fill="black")
        canvas.paste(image, (x, y + caption))
        entry["rect"] = [x, y + caption, image.width, image.height]
        entry["resized"] = False
    montage_path = OUT / "n33-option-ends.png"
    canvas.save(montage_path)
    fresh_report_path = EVIDENCE / "5m/n42-mobile-fresh-capture.json"
    fresh = json.loads(fresh_report_path.read_text())
    fresh_path = Path(fresh["screenshot"])
    if not fresh["html_unchanged"] or sha(fresh_path) != fresh["sha256"]:
        raise RuntimeError("Stale fresh n42 pixels")
    with Image.open(fresh_path) as image:
        image.load()
        fresh_size = list(image.size)
    histories = []
    for book, number in (("6a", "33"), ("5m", "42")):
        final_path = EVIDENCE / book / f"n{number}-actual-display-observations.json"
        before_path = EVIDENCE / book / f"n{number}-actual-display-observations-before-supplement.json"
        if sha(before_path) != sha(final_path):
            raise RuntimeError(f"Initial final/history unexpectedly differ: {number}")
        histories.append({"current": record(final_path), "before_supplement": record(before_path)})
    result = {
        "status": "pending actual supplementary pixel opening",
        "n33_report": record(report_path),
        "n33_option_pixels": entries,
        "n33_montage": {**record(montage_path), "size": list(canvas.size)},
        "n42_report": record(fresh_report_path),
        "n42_fresh_pixels": {**record(fresh_path), "filename": fresh_path.name, "size": fresh_size},
        "preserved_history": histories,
        "additional_unique_surface_viewport_combinations": 0,
    }
    (OUT / "supplement-manifest.json").write_text(json.dumps(result, indent=2) + "\n")
    print("Prepared all14 native n33 option strips; verified fresh n42 screenshot and exact blocked-history copies.")


if __name__ == "__main__":
    main()
