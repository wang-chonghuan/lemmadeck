"""Create only explicitly bounded, hash-bound original-PNG crops."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
SCRATCH = Path(__file__).resolve().parent
PLAN = [
    ("H1", 76, [400, 1600, 900, 135], "ex199(2) operator before OA6"),
    ("H2", 76, [200, 480, 1120, 140], "first +yb to Chinese he punctuation"),
    ("H3", 77, [180, 515, 1200, 300], "ex203 three printed rows"),
    ("H4", 79, [200, 1510, 670, 160], "lower OC=c punctuation"),
    ("H5", 78, [733, 263, 493, 286], "figure86 C1/C/B head attribution"),
    ("H6", 79, [863, 1180, 345, 435], "figure87 S junction DS/OS"),
    ("H7", 78, [200, 900, 1000, 110], "first median-ratio RHS CC1 arrow"),
]


def sha256_file(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def create_crops():
    destination = SCRATCH / "crops"
    destination.mkdir(exist_ok=True)
    entries = []
    for identifier, page, rect, purpose in PLAN:
        source = ROOT / f".tmp/ld-s10y-lesson/9-10g/pages/{page:04d}/page.png"
        with Image.open(source) as image:
            x, y, width, height = rect
            box = [x, y, x + width, y + height]
            assert 0 <= x < box[2] <= image.width
            assert 0 <= y < box[3] <= image.height
            native = image.crop(box)
            native_path = destination / f"{identifier}-p{page:04d}-native.png"
            display_path = destination / f"{identifier}-p{page:04d}-nearest2.png"
            native.save(native_path)
            display = native.resize(
                (width * 2, height * 2), resample=Image.Resampling.NEAREST
            )
            display.save(display_path)
            entries.append(
                {
                    "id": identifier,
                    "purpose": purpose,
                    "source_path": str(source),
                    "source_sha256": sha256_file(source),
                    "source_size_px": list(image.size),
                    "source_mode": image.mode,
                    "crop_xywh": rect,
                    "crop_xyxy_half_open": box,
                    "native_path": str(native_path),
                    "native_sha256": sha256_file(native_path),
                    "native_pixel_sha256": hashlib.sha256(native.tobytes()).hexdigest(),
                    "display_path": str(display_path),
                    "display_sha256": sha256_file(display_path),
                    "display_size_px": list(display.size),
                    "transform": {
                        "scale": [2, 2],
                        "resampling": "nearest-neighbor",
                        "color_conversion": None,
                        "contrast_adjustment": None,
                        "rotation": None,
                        "source_to_display": "u=2*(x-crop_x); v=2*(y-crop_y)",
                    },
                }
            )
    manifest = {
        "schema": "targeted-original-png-crop-provenance@1",
        "coordinate_convention": "integer source pixels; zero-based; half-open bounds",
        "image_open_limit": 8,
        "planned_image_displays": 7,
        "source_writes": False,
        "source_counting_or_gate_runs": False,
        "crops": entries,
    }
    manifest_path = SCRATCH / "crop-provenance.json"
    assert not manifest_path.exists(), "Do not overwrite an existing run."
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"manifest_path": str(manifest_path), "crops": entries}, indent=2))


def verify_crops():
    manifest_path = SCRATCH / "crop-provenance.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    for entry in manifest["crops"]:
        for prefix in ("source", "native", "display"):
            assert sha256_file(Path(entry[f"{prefix}_path"])) == entry[f"{prefix}_sha256"]
        with Image.open(entry["source_path"]) as source:
            actual = source.crop(entry["crop_xyxy_half_open"])
            assert hashlib.sha256(actual.tobytes()).hexdigest() == entry["native_pixel_sha256"]
        with Image.open(entry["native_path"]) as native:
            with Image.open(entry["display_path"]) as display:
                expected = native.resize(display.size, resample=Image.Resampling.NEAREST)
                assert expected.tobytes() == display.tobytes()
    print(
        json.dumps(
            {
                "status": "pass",
                "manifest_sha256": sha256_file(manifest_path),
                "source_and_crop_hashes_unchanged": True,
                "native_pixels_equal_bounded_source_regions": True,
                "display_pixels_equal_exact_nearest_neighbor_2x": True,
                "visual_image_displays_added": 0,
            },
            indent=2,
        )
    )


def create_reserved_crop():
    manifest_path = SCRATCH / "crop-provenance.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert len(manifest["crops"]) == 7, "The one reserved crop is already used."
    source = ROOT / ".tmp/ld-s10y-lesson/9-10g/pages/0079/page.png"
    rect = [100, 1600, 260, 70]
    box = [100, 1600, 360, 1670]
    with Image.open(source) as image:
        native = image.crop(box)
        native_path = SCRATCH / "crops/H4-reserved-p0079-native.png"
        display_path = SCRATCH / "crops/H4-reserved-p0079-nearest2.png"
        native.save(native_path)
        display = native.resize((520, 140), resample=Image.Resampling.NEAREST)
        display.save(display_path)
        entry = {
            "id": "H4-reserved",
            "purpose": "Only reserved display: initial H4 clipped left-hand =c and punctuation",
            "source_path": str(source),
            "source_sha256": sha256_file(source),
            "source_size_px": list(image.size),
            "source_mode": image.mode,
            "crop_xywh": rect,
            "crop_xyxy_half_open": box,
            "native_path": str(native_path),
            "native_sha256": sha256_file(native_path),
            "native_pixel_sha256": hashlib.sha256(native.tobytes()).hexdigest(),
            "display_path": str(display_path),
            "display_sha256": sha256_file(display_path),
            "display_size_px": list(display.size),
            "transform": {
                "scale": [2, 2],
                "resampling": "nearest-neighbor",
                "color_conversion": None,
                "contrast_adjustment": None,
                "rotation": None,
                "source_to_display": "u=2*(x-100); v=2*(y-1600)",
            },
        }
    manifest["crops"].append(entry)
    manifest["planned_image_displays"] = 8
    manifest["reserved_crop_reason"] = entry["purpose"]
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(entry, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("create", "reserved", "verify"))
    args = parser.parse_args()
    if args.action == "create":
        create_crops()
    elif args.action == "reserved":
        create_reserved_crop()
    else:
        verify_crops()
