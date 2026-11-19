"""Make an unscaled full-native-width review crop after the initial is frozen."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent
WORKTREE = ROOT.parents[4]
parser = argparse.ArgumentParser()
parser.add_argument("page", type=int, choices=range(330, 334))
parser.add_argument("top", type=int)
parser.add_argument("bottom", type=int)
parser.add_argument("reason")
args = parser.parse_args()
initial = ROOT / f"initial-{args.page:04d}.json"
assert initial.is_file(), "Freeze initial observation before cropping"
source = WORKTREE / f".tmp/ld-s10y-lesson/10p/pages/{args.page:04d}/page.png"
output = ROOT / f"evidence0444-p{args.page:04d}-crop.png"
metadata = output.with_suffix(".json")
assert not output.exists() and not metadata.exists(), "Evidence is immutable"
with Image.open(source) as image:
    assert image.size == (1536, 2337)
    assert 0 <= args.top < args.bottom <= image.height
    box = [0, args.top, image.width, args.bottom]
    image.crop(box).save(output)
record = {
    "schema": "d1817-source-crop-evidence@1",
    "immutable": True,
    "source_path": str(source),
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "initial_snapshot_path": str(initial),
    "initial_snapshot_sha256": hashlib.sha256(initial.read_bytes()).hexdigest(),
    "crop_path": str(output),
    "crop_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    "native_crop_box_xywh": [0, args.top, 1536, args.bottom - args.top],
    "rescaled": False,
    "reason": args.reason,
}
metadata.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(record, ensure_ascii=False))
