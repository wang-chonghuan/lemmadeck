from pathlib import Path
import hashlib
import json
import time

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-6g-p72-p73-author-evidence"
started = time.time()
records = []
for page in ("0072", "0073"):
    work = ROOT / ".tmp/ld-s10y-lesson/6-8g/pages" / page
    audit_path = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages" / page / "audit.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    with Image.open(work / "page.png") as image:
        source = np.asarray(image).copy()
        source_mode = image.mode
        width, height = image.size
    for figure in audit["figures"]:
        crop_path = work / "figures" / (figure["id"] + ".png")
        with Image.open(crop_path) as image:
            crop = np.asarray(image).copy()
            crop_mode = image.mode
            crop_size = list(image.size)
        x, y, w, h = figure["box"]
        left, top = max(0, x - 12), max(0, y - 12)
        right, bottom = min(width, x + w + 12), min(height, y + h + 12)
        dx, dy = x - left, y - top
        expected = source[y:y + h, x:x + w]
        interior = crop[dy:dy + h, dx:dx + w]
        same_shape = interior.shape == expected.shape
        changed = None
        max_difference = None
        if same_shape:
            different = interior != expected
            if different.ndim == 3:
                different = np.any(different, axis=2)
            changed = int(np.count_nonzero(different))
            max_difference = int(np.max(np.abs(interior.astype(np.int16) - expected.astype(np.int16))))
        border = np.ones(crop.shape[:2], dtype=bool)
        border[dy:dy + h, dx:dx + w] = False
        records.append({
            "page": int(page), "figure_id": figure["id"], "audit_figure": figure,
            "source": str(work / "page.png"), "crop": str(crop_path),
            "crop_sha256": hashlib.sha256(crop_path.read_bytes()).hexdigest(),
            "source_mode": source_mode, "crop_mode": crop_mode,
            "actual_size_wh": crop_size, "expected_size_wh": [right - left, bottom - top],
            "pad_requested_px": 12, "actual_padding_ltrb": [dx, dy, right - x - w, bottom - y - h],
            "aligned_interior_offset_xy": [dx, dy],
            "same_interior_shape": same_shape, "interior_changed_pixels": changed,
            "interior_pixels": w * h, "interior_max_channel_difference": max_difference,
            "border_pixels": int(np.count_nonzero(border)),
            "nonwhite_border_channel_values": int(np.count_nonzero(crop[border] != 255)),
            "declared_ownership": figure.get("ownership"),
            "comparison": "Actual 12px padded crop interior aligned to source box; white border tested separately.",
            "not_proven": "Pixel equality is not an independent semantic review or proof that the author's rough box included every source object.",
        })
output = EVIDENCE / "crop-pixel-facts.json"
with output.open("x", encoding="utf-8") as file:
    json.dump({"started_epoch": started, "ended_epoch": time.time(), "figures": records},
              file, ensure_ascii=False, indent=2)
    file.write("\n")
print(json.dumps(records, ensure_ascii=False, indent=2))
