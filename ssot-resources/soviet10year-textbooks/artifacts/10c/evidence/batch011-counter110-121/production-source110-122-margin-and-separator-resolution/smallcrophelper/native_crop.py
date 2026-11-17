import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
INPUT_ROOT = ROOT.parent
SOURCES = {
    "110": INPUT_ROOT / "production-source10c110-113/10c/pages/0110/page.png",
    "114": INPUT_ROOT / "production-source10c114-117/10c/pages/0114/page.png",
    "117": INPUT_ROOT / "production-source10c114-117/10c/pages/0117/page.png",
    "121": INPUT_ROOT / "production-source10c118-121/10c/pages/0121/page.png",
    "122": INPUT_ROOT / "production-source10c122-125/10c/pages/0122/page.png",
}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def make_crop(page, name, box):
    if not name.replace("-", "").isalnum():
        raise ValueError("Crop name must contain only letters, digits, and hyphens")
    source_path = SOURCES[page]
    source_bytes = source_path.read_bytes()
    crop_path = ROOT / "nativecrops" / (name + ".png")
    metadata_path = ROOT / "metadata" / (name + ".json")
    if crop_path.exists() or metadata_path.exists():
        raise FileExistsError("New crops and metadata must not overwrite existing evidence")
    with Image.open(io.BytesIO(source_bytes)) as source:
        source.load()
        x, y, w, h = box
        if min(x, y) < 0 or min(w, h) <= 0:
            raise ValueError("Invalid native XYWH")
        if x + w > source.width or y + h > source.height:
            raise ValueError("Crop lies outside original pixels")
        rectangle = (x, y, x + w, y + h)
        crop = source.crop(rectangle)
        crop_path.parent.mkdir(parents=True, exist_ok=True)
        metadata_path.parent.mkdir(parents=True, exist_ok=True)
        with crop_path.open("xb") as output:
            crop.save(output, format="PNG")
        with Image.open(crop_path) as saved:
            saved.load()
            reference = source.crop(rectangle)
            equal = (
                saved.mode == reference.mode
                and saved.size == reference.size
                and saved.tobytes() == reference.tobytes()
            )
            if not equal:
                raise ValueError("Saved crop does not equal its original native rectangle")
            record = {
                "name": name,
                "source_path": str(source_path),
                "source_size": list(source.size),
                "source_mode": source.mode,
                "source_file_sha256": sha256(source_bytes),
                "crop_path": str(crop_path),
                "crop_size": list(saved.size),
                "crop_mode": saved.mode,
                "crop_file_sha256": sha256(crop_path.read_bytes()),
                "native_xywh": box,
                "coordinate_convention": "zero-based XYWH; exclusive x+w and y+h",
                "original_rectangle_pixel_sha256": sha256(reference.tobytes()),
                "saved_crop_pixel_sha256": sha256(saved.tobytes()),
                "pixel_equality": equal,
                "operations": ["decode original PNG", "native rectangle crop", "lossless PNG save"],
                "resized": False,
                "enhanced": False,
                "montage": False,
            }
    with metadata_path.open("x", encoding="ascii") as output:
        json.dump(record, output, indent=2, ensure_ascii=True)
        output.write("\n")
    print(json.dumps(record, indent=2, ensure_ascii=True))
    print("metadata_path=" + str(metadata_path))
    print("metadata_file_sha256=" + sha256(metadata_path.read_bytes()))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", choices=SOURCES, required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--box", nargs=4, type=int, required=True)
    args = parser.parse_args()
    make_crop(args.page, args.name, args.box)


if __name__ == "__main__":
    main()
