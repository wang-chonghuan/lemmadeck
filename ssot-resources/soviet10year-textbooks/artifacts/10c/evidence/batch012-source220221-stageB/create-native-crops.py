"""Create only the two authorized, unscaled Stage B glyph evidence crops."""

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
SOURCE_ROOT = ROOT.parent.parent / "production-source10c220-221/10c/pages"
REQUESTS = (
    {
        "id": "B1",
        "page": "0220",
        "source_sha256": "71f147a2fb3bfc311d2055b56a9d9bc5ffdd10588f69b74d464ee9c1382ce060",
        "roi_xyxy": [250, 870, 1445, 955],
        "output": "0220-row08-native.png",
        "purpose": "220-U1 after 和 and the StageA 饼渣 / author 饼糟 discrepancy on the same row",
    },
    {
        "id": "B2",
        "page": "0221",
        "source_sha256": "a79759b0e7604817cba38821dcef150473b335c335eb88e45a955011cc7408b8",
        "roi_xyxy": [1040, 1285, 1495, 1375],
        "output": "0221-raised-R-native.png",
        "purpose": "221-U1 raised glyph beside capital R",
    },
)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    provenance_path = ROOT / "crop-provenance.json"
    destinations = [ROOT / request["output"] for request in REQUESTS]
    if provenance_path.exists() or any(path.exists() for path in destinations):
        raise FileExistsError("Refusing to overwrite existing Stage B evidence")

    records = []
    for request in REQUESTS:
        source = SOURCE_ROOT / request["page"] / "page.png"
        actual_hash = sha256(source)
        if actual_hash != request["source_sha256"]:
            raise ValueError(f"Source binding mismatch: {source}")
        with Image.open(source) as image:
            if image.size != (1695, 2580):
                raise ValueError(f"Unexpected native source dimensions: {source}")
            left, top, right, bottom = request["roi_xyxy"]
            if not (0 <= left < right <= image.width and 0 <= top < bottom <= image.height):
                raise ValueError("ROI outside source pixels")
            crop = image.crop((left, top, right, bottom))
            destination = ROOT / request["output"]
            crop.save(destination, format="PNG")
            with Image.open(destination) as saved:
                if saved.size != (right - left, bottom - top):
                    raise ValueError("Crop dimensions changed")
                if saved.mode != crop.mode or saved.tobytes() != crop.tobytes():
                    raise ValueError("Crop pixels changed during encoding")
        records.append(
            {
                "id": request["id"],
                "source_path": str(source),
                "source_sha256": actual_hash,
                "source_size": [1695, 2580],
                "roi_xyxy": request["roi_xyxy"],
                "roi_convention": "zero-based top-left; right and bottom exclusive",
                "output_path": str(destination),
                "output_sha256": sha256(destination),
                "output_size": [right - left, bottom - top],
                "scale": [1, 1],
                "pixel_equality_to_source_roi": True,
                "purpose": request["purpose"],
                "visual_load_performed_by_script": False,
            }
        )
    provenance = {
        "ticket": "STEMROBIN-184",
        "stage": "B",
        "authorization": "sole post-consumption Stage B user disclosure",
        "operation": "Pillow crop and lossless PNG encode only; no resize",
        "records": records,
    }
    encoded = json.dumps(provenance, ensure_ascii=False, indent=2) + "\n"
    with provenance_path.open("x", encoding="utf-8") as output:
        output.write(encoded)
    print(encoded, end="")


if __name__ == "__main__":
    main()
