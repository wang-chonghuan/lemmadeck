import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

root = Path(__file__).resolve().parent
author = root.parent / "d561-source203-first-author"
prepared = root.parent / "d567-source203-svg-and-source204-preparation"
audit = json.loads((author / "source/10p/pages/0203/audit.json").read_text())
results = []
with Image.open(author / "work/10p/pages/0203/page.png") as page:
    for figure in audit["figures"]:
        ident = figure["id"]
        x, y, w, h = figure["box"]
        box = (x - 12, y - 12, x + w + 12, y + h + 12)
        source = np.asarray(page.crop(box).convert("RGB"))
        with Image.open(author / f"work/10p/pages/0203/figures/{ident}.png") as raw:
            raw_pixels = np.asarray(raw.convert("RGB"))
        with Image.open(prepared / f"previews/{ident}.native.png") as preview:
            preview_pixels = np.asarray(preview.convert("RGB"))
        assert source.shape == raw_pixels.shape == preview_pixels.shape
        assert np.array_equal(source, raw_pixels), "RAW is not the exact source crop"
        raw_ink = np.mean(raw_pixels, axis=2) < 128
        preview_ink = np.mean(preview_pixels, axis=2) < 128
        raw_to_preview = distance_transform_edt(~preview_ink)[raw_ink]
        preview_to_raw = distance_transform_edt(~raw_ink)[preview_ink]
        results.append({
            "figure": ident,
            "source_crop_xyxy": list(box),
            "padding_px": 12,
            "size_wh": [int(source.shape[1]), int(source.shape[0])],
            "RAW_exact_source_pixels": True,
            "RAW_source_pixel_difference_count": 0,
            "threshold": 128,
            "RAW_ink_pixels": int(raw_ink.sum()),
            "preview_ink_pixels": int(preview_ink.sum()),
            "binary_ink_symmetric_difference_count": int(np.logical_xor(raw_ink, preview_ink).sum()),
            "maximum_RAW_ink_distance_to_preview_px": float(raw_to_preview.max()),
            "maximum_preview_ink_distance_to_RAW_px": float(preview_to_raw.max()),
            "RAW_ink_distance_to_preview_p99_px": float(np.quantile(raw_to_preview, 0.99)),
            "preview_ink_distance_to_RAW_p99_px": float(np.quantile(preview_to_raw, 0.99)),
            "evidence_role": "Numerical exact-crop binding and trace-support comparison supplement the first visual source/RAW/SVG review; these numbers do not replace that review.",
        })
print(json.dumps({
    "schema": "d569/source203-pixel-binding@1",
    "images_emitted_or_visually_reopened": 0,
    "new_rasterizations": 0,
    "results": results,
}))
