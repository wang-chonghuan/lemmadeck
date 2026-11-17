import hashlib
import io
import json
import os
from pathlib import Path
import struct
import sys
import traceback

ROOT = Path(__file__).resolve().parent
WORKSPACE = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
CASES = {
    "168-r15": {
        "page": "0168",
        "source_sha256": "2a8a56c0c5d8e760ce475c8cc5ad7fa5f83fbd7fd4f591b881bfafde1fb6ed47",
        "roi_xywh": [110, 1495, 1310, 105],
        "purpose": "Resolve physical 168 r15 punctuation; no other new source question.",
        "record": "CB03-crop168",
    },
    "170-underbrace": {
        "page": "0170",
        "source_sha256": "68ffce71c08910ed4882f42608268333d84ecef250b35404795d23d96aeb343b",
        "roi_xywh": [230, 1180, 1050, 160],
        "purpose": "Resolve physical 170 r11/r12 two underbraces and their shared lower label row.",
        "record": "CB04-crop170",
    },
}

stdout = ""
stderr = ""
exit_code = 0
case = CASES[sys.argv[1]]

try:
    from PIL import Image

    source_path = WORKSPACE / f".intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171/10c/pages/{case['page']}/page.png"
    source_bytes = source_path.read_bytes()
    if hashlib.sha256(source_bytes).hexdigest() != case["source_sha256"]:
        raise ValueError("Source hash changed; no crop or repair authorized")
    source_dimensions = struct.unpack(">II", source_bytes[16:24])
    x, y, w, h = case["roi_xywh"]
    if x < 0 or y < 0 or x + w > source_dimensions[0] or y + h > source_dimensions[1]:
        raise ValueError("ROI outside native source dimensions")
    crop_path = ROOT / f"{sys.argv[1]}.native.png"
    metadata_path = ROOT / f"{sys.argv[1]}.native.metadata.json"
    if crop_path.exists() or metadata_path.exists():
        raise ValueError("Append-only crop already exists; refusing replacement")
    with Image.open(io.BytesIO(source_bytes)) as source:
        crop = source.crop((x, y, x + w, y + h))
        with crop_path.open("xb") as output:
            crop.save(output, format="PNG")
        pixel_sha256 = hashlib.sha256(crop.tobytes()).hexdigest()
        mode = crop.mode
    crop_bytes = crop_path.read_bytes()
    metadata = {
        "case": sys.argv[1],
        "source_path": str(source_path),
        "source_bytes": len(source_bytes),
        "source_sha256": case["source_sha256"],
        "source_dimensions": list(source_dimensions),
        "source_loaded_numerically_only_for_exact_roi": True,
        "roi_xywh": case["roi_xywh"],
        "purpose": case["purpose"],
        "crop_path": str(crop_path),
        "crop_bytes": len(crop_bytes),
        "crop_dimensions": list(struct.unpack(">II", crop_bytes[16:24])),
        "crop_sha256": hashlib.sha256(crop_bytes).hexdigest(),
        "native_pixel_sha256": pixel_sha256,
        "pixel_mode": mode,
        "enhancement": False,
        "resize": False,
        "whole_source_view": False,
        "child_processes": 0,
    }
    with metadata_path.open("x") as output:
        output.write(json.dumps(metadata, indent=2) + "\n")
    stdout = json.dumps(metadata, indent=2) + "\n"
    os.write(1, stdout.encode())
except Exception:
    stderr = traceback.format_exc()
    os.write(2, stderr.encode())
    exit_code = 1

with (ROOT / f"{case['record']}.stdout.txt").open("x") as output:
    output.write(stdout)
with (ROOT / f"{case['record']}.stderr.txt").open("x") as output:
    output.write(stderr)
with (ROOT / f"{case['record']}.command.json").open("x") as output:
    output.write(json.dumps({
        "argv": [sys.executable, *sys.argv],
        "cwd": os.getcwd(),
        "stdout_path": str(ROOT / f"{case['record']}.stdout.txt"),
        "stderr_path": str(ROOT / f"{case['record']}.stderr.txt"),
        "exit_code_passed_to_sys_exit": exit_code,
        "capture": "Exact direct stdout/stderr writes from this process; enclosing tool confirms returned exit.",
        "child_processes": 0,
    }, indent=2) + "\n")
sys.exit(exit_code)
