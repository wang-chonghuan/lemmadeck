import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1817-source322325-review"
plan_path = OUT / "crop-plan.json"
plan = json.loads(plan_path.read_text())
records = []
for item in plan["crops"]:
    source = ROOT / f".tmp/ld-s10y-lesson/10p/pages/{item['physical_page']:04d}/page.png"
    target = OUT / item["file"]
    if target.exists():
        raise FileExistsError(target)
    x, y, w, h = item["native_crop_box_xywh"]
    with Image.open(source) as image:
        width, height = image.size
        assert 0 <= x < x + w <= width and 0 <= y < y + h <= height
        image.crop((x, y, x + w, y + h)).save(target, format="PNG")
    records.append({
        **item,
        "source": {
            "path": str(source),
            "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "width_px": width,
            "height_px": height,
        },
        "path": str(target),
        "sha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "output_size_wh": [w, h],
        "resampled": False,
    })
manifest = OUT / "crop-evidence.freeze.json"
if manifest.exists():
    raise FileExistsError(manifest)
manifest.write_text(json.dumps({
    "schema": "stemrobin181/source-crop-evidence@1",
    "plan": {
        "path": str(plan_path),
        "sha256": hashlib.sha256(plan_path.read_bytes()).hexdigest(),
    },
    "crops": records,
    "pixel_preparation_is_not_visual_observation": True,
}, ensure_ascii=False, separators=(",", ":")) + "\n")
for path in [plan_path, manifest, *(OUT / item["file"] for item in plan["crops"])]:
    path.chmod(0o444)
print(manifest.read_text())
