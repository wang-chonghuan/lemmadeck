import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1306-source276-two-emphasis-context-review"
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1271-source274277-first-preparation/work/10p/pages/0276/page.png"
EXPECTED_SIZE = (1536, 2337)
REQUESTS = (
    ("U276-4", "row14-context.png", (100, 1110, 1270, 220)),
    ("U276-5", "row25-context.png", (100, 1880, 1270, 190)),
)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    if Path.cwd().resolve() != ROOT:
        raise RuntimeError("Wrong working directory")
    output_dir = OWNED / "crops"
    if Path(__file__).resolve() != output_dir / "prepare_crops.py":
        raise RuntimeError("Script is outside its owned location")
    manifest_path = output_dir / "manifest.json"
    outputs = [output_dir / name for _, name, _ in REQUESTS]
    if any(path.exists() for path in [manifest_path, *outputs]):
        raise RuntimeError("Refusing to overwrite existing crop evidence")

    source_hash = sha256(SOURCE)
    crops = []
    with Image.open(SOURCE) as source:
        if source.format != "PNG" or source.size != EXPECTED_SIZE:
            raise RuntimeError(f"Unexpected source format/size: {source.format} {source.size}")
        if getattr(source, "n_frames", 1) != 1:
            raise RuntimeError("Source is not a single native page")
        width, height = source.size
        boxes = []
        for site, name, xywh in REQUESTS:
            x, y, w, h = xywh
            if not all(isinstance(value, int) for value in xywh):
                raise RuntimeError("Crop coordinates must be integers")
            if not (x >= 0 and y >= 0 and w > 0 and h > 0):
                raise RuntimeError("Invalid crop layout")
            if x + w > width or y + h > height:
                raise RuntimeError("Crop exceeds native source bounds")
            boxes.append((site, name, xywh, (x, y, x + w, y + h)))

        source.load()
        for site, name, xywh, box in boxes:
            crop = source.crop(box)
            if crop.size != xywh[2:] or crop.mode != source.mode:
                raise RuntimeError("Crop changed native dimensions or color mode")
            destination = output_dir / name
            crop.save(destination, format="PNG")
            crops.append({
                "site": site,
                "path": str(destination),
                "sha256": sha256(destination),
                "xywh": list(xywh),
                "pil_box": list(box),
                "dimensions": list(crop.size),
                "mode": crop.mode,
                "native_bounds_valid": True,
            })
        source_mode = source.mode

    if sha256(SOURCE) != source_hash:
        raise RuntimeError("Source changed during preparation")
    manifest = {
        "source": {
            "path": str(SOURCE),
            "sha256": source_hash,
            "dimensions": list(EXPECTED_SIZE),
            "mode": source_mode,
            "format": "PNG",
            "single_frame": True,
        },
        "script": {"path": str(Path(__file__).resolve()), "sha256": sha256(Path(__file__))},
        "checks_before_cropping": {
            "source_dimensions": True,
            "xywh_layout": True,
            "both_native_bounds": True,
        },
        "crops": crops,
        "image_outputs": 2,
        "operations": ["native crop", "lossless PNG save"],
        "resize": False,
        "contrast_alteration": False,
        "filtering": False,
        "visual_image_opens_during_preparation": 0,
        "source_bytes_unchanged": True,
    }
    with manifest_path.open("x", encoding="ascii") as handle:
        json.dump(manifest, handle, ensure_ascii=True, indent=2)
        handle.write("\n")
    print(json.dumps(manifest, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
