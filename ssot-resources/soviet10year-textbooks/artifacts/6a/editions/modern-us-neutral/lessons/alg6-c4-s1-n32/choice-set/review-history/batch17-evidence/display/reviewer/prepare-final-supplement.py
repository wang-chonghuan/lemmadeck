"""Preserve blocked evidence and pack supplied final-supplement native pixels."""

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_record(path):
    return {"path": str(path.relative_to(ROOT)), "sha256": sha(path)}


def screenshot(entry, directory):
    path = Path(entry["screenshot"]).resolve()
    if path.parent != directory or sha(path) != entry["sha256"]:
        raise RuntimeError(f"Unexpected or changed parent screenshot: {path}")
    with Image.open(path) as image:
        image.load()
        size = list(image.size)
    return {
        **file_record(path),
        "filename": path.name,
        "size": size,
        "parent_observation": entry,
    }


def montage(entries, name, labels):
    images = [Image.open(ROOT / entry["path"]).convert("RGB") for entry in entries]
    width = max(image.width for image in images)
    height = max(image.height for image in images)
    pad, caption, columns = 8, 28, 3
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new(
        "RGB",
        (columns * (width + pad) + pad, rows * (height + caption + pad) + pad),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    for index, (entry, image, label) in enumerate(zip(entries, images, labels)):
        x = pad + index % columns * (width + pad)
        y = pad + index // columns * (height + caption + pad)
        draw.text((x, y + 5), label, fill="black")
        canvas.paste(image, (x, y + caption))
        entry["montage_label"] = label
        entry["member_rect"] = [x, y + caption, image.width, image.height]
        entry["resized"] = False
    path = OUT / name
    if path.exists():
        raise RuntimeError(f"Preserve existing montage: {path}")
    canvas.save(path)
    return {**file_record(path), "size": list(canvas.size)}


def main():
    manifest = {"status": "awaiting actual opening", "preserved_blocked": []}
    for book, number, expected in (("6a", 32, 25), ("5m", 42, 21)):
        current = EVIDENCE / book / f"n{number}-actual-display-observations.json"
        payload = json.loads(current.read_text())
        if payload["status"] != "blocked" or len(payload["observations"]) != expected:
            raise RuntimeError(f"Unexpected current blocked record: {current}")
        backup = OUT / f"n{number}-blocked-before-final-supplement.json"
        if backup.exists() and sha(backup) != sha(current):
            raise RuntimeError(f"Existing history differs: {backup}")
        if not backup.exists():
            backup.write_bytes(current.read_bytes())
        manifest["preserved_blocked"].append({
            "number": number,
            "current": file_record(current),
            "backup": file_record(backup),
            "initial_count": expected,
        })
    n32_report = EVIDENCE / "6a/n32-fresh-captures.json"
    n42_report = EVIDENCE / "5m/n42-option-end-captures.json"
    n32 = json.loads(n32_report.read_text())
    n42 = json.loads(n42_report.read_text())
    if len(n32["observations"]) != 3 or len(n42["observations"]) != 15:
        raise RuntimeError("Expected three fresh n32 and fifteen n42 end captures")
    for report in (n32, n42):
        if not report["html_and_content_unchanged"]:
            raise RuntimeError("Parent did not report unchanged HTML/content")
        if report["additional_unique_surface_combinations"] != 0:
            raise RuntimeError("Supplement must add no display combinations")
    manifest["n32_report"] = file_record(n32_report)
    manifest["n42_report"] = file_record(n42_report)
    manifest["n32_pixels"] = [
        screenshot(entry, EVIDENCE / "6a") for entry in n32["observations"]
    ]
    manifest["n42_pixels"] = [
        screenshot(entry, EVIDENCE / "5m") for entry in n42["observations"]
    ]
    labels32 = [
        f"n32 {entry['surface']} {entry['endpoint']}"
        for entry in n32["observations"]
    ]
    labels42 = [
        f"n42 question {entry['question']} / {entry['option']} / end"
        for entry in n42["observations"]
    ]
    manifest["n32_montage"] = montage(
        manifest["n32_pixels"], "n32-final-fresh-native.png", labels32,
    )
    manifest["n42_montage"] = montage(
        manifest["n42_pixels"], "n42-final-option-ends-native.png", labels42,
    )
    target = OUT / "final-supplement-manifest.json"
    if target.exists():
        raise RuntimeError(f"Preserve existing manifest: {target}")
    target.write_text(json.dumps(manifest, indent=2) + "\n")
    print("Preserved current blocked n32/n42 records byte-for-byte.")
    for name in ("n32_montage", "n42_montage"):
        print(json.dumps(manifest[name]))


if __name__ == "__main__":
    main()
