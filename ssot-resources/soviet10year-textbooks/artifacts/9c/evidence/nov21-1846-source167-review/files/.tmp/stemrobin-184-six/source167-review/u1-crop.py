import hashlib
import io
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
SOURCE = ROOT / ".tmp/ld-s10y-lesson/9c/pages/0167/page.png"
OUTPUT = ROOT / ".tmp/stemrobin-184-six/source167-review/u1-roi.png"
EXPECTED_SHA256 = "b38bfbb3d75ae23022f2c714b57c1e9bf52993156bf9dbfd7587f818fffa4c22"
BOUNDS = (568, 1194, 848, 1258)


def report(event, **fields):
    print(json.dumps({"event": event, **fields}, sort_keys=True), flush=True)


assert Path.cwd() == ROOT
assert not OUTPUT.exists(), "Refuse to overwrite an existing ROI"
encoded = SOURCE.read_bytes()
source_sha256 = hashlib.sha256(encoded).hexdigest()
assert source_sha256 == EXPECTED_SHA256, "Encoded source binding changed"
assert len(encoded) == 59046
report(
    "encoded_source_bound",
    source=str(SOURCE),
    bytes=len(encoded),
    sha256=source_sha256,
    bounds=list(BOUNDS),
    bounds_convention="left,top,right,bottom; right and bottom exclusive",
    author_read=False,
)

# Open the encoded container once; load its pixels once before cropping.
with Image.open(io.BytesIO(encoded)) as source:
    report("source_decode_started", explicit_source_decode_calls=1)
    source.load()
    report("source_decode_completed", size=list(source.size), mode=source.mode)
    assert source.size == (1695, 2381)
    roi = source.crop(BOUNDS)
    assert roi.size == (280, 64)
    with OUTPUT.open("xb") as output:
        roi.save(output, format="PNG")
    report(
        "roi_written",
        output=str(OUTPUT),
        size=list(roi.size),
        native_scale=True,
        transforms=["crop_only"],
        additional_source_decodes=0,
        alternate_decoder=False,
        ocr=False,
    )

roi_encoded = OUTPUT.read_bytes()
report(
    "complete",
    roi=str(OUTPUT),
    roi_bytes=len(roi_encoded),
    roi_sha256=hashlib.sha256(roi_encoded).hexdigest(),
    bounds=list(BOUNDS),
    source_decode_calls=1,
    roi_views_by_script=0,
    full_reopens=0,
    encoded_hash_checks_are_semantic_proof=False,
)
