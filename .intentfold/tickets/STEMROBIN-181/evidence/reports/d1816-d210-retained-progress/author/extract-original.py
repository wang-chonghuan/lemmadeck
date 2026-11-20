import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import subprocess

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d210-fig31-source-gap-author"
OUTPUT = ROOT / ".tmp/STEMROBIN-181/d1816-d210/physical57-embedded-original"
EXPECTED_FREEZE = "21745061b8ea019754aaad65fb531189dd444dc102a6750f33540e2db6ca08ab"


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def save_new(path, value):
    with path.open("x", encoding="ascii") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def run_receipted(name, argv):
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=ROOT, capture_output=True)
    streams = {}
    for label, data in (("stdout", result.stdout), ("stderr", result.stderr)):
        path = AUTHOR / f"{name}.{label}.txt"
        with path.open("xb") as stream:
            stream.write(data)
        streams[label] = binding(path)
    receipt = {
        "cwd": str(ROOT),
        "argv": argv,
        "startedAt": started,
        "finishedAt": datetime.now(timezone.utc).isoformat(),
        "exitCode": result.returncode,
        **streams,
    }
    save_new(AUTHOR / f"{name}.command.json", receipt)
    if result.returncode:
        raise RuntimeError(f"{name} failed: {result.returncode}")
    return result


assert Path.cwd() == ROOT
freeze_path = AUTHOR / "input-freeze.json"
assert binding(freeze_path)["sha256"] == EXPECTED_FREEZE
freeze = json.loads(freeze_path.read_text())
inputs = [binding(freeze_path), binding(AUTHOR / "dispatch-record.json")]
for field in (
    "sourcePageFacts",
    "originalRenderedSourceFigure",
    "sourceGapEvidence",
    "originalIndependentInventory",
    "firstIndependentReview",
):
    current = binding(Path(freeze[field]["path"]))
    assert current["sha256"] == freeze[field]["sha256"], (field, current)
    inputs.append(current)
pdf = ROOT / freeze["originalPdfPath"]
page = json.loads(Path(freeze["sourcePageFacts"]["path"]).read_text())
pdf_binding = binding(pdf)
assert pdf_binding["sha256"] == page["meta"]["source"]["pdf_sha256"]
inputs.append(pdf_binding)
save_new(AUTHOR / "current-input-bindings.json", {"files": inputs})
OUTPUT.mkdir(exist_ok=False)
run_receipted("pdfimages-version", ["/opt/homebrew/bin/pdfimages", "-v"])
listing = run_receipted(
    "pdfimages-physical57-list",
    ["/opt/homebrew/bin/pdfimages", "-f", "57", "-l", "57", "-list", str(pdf)],
)
rows = listing.stdout.decode().splitlines()[2:]
rows = [row.split() for row in rows if row.strip()]
assert len(rows) == 1, rows
assert rows[0][:9] == ["57", "0", "stencil", "1472", "2240", "-", "1", "1", "ccitt"], rows
assert rows[0][10:14] == ["113", "0", "288", "288"], rows
run_receipted(
    "pdfimages-physical57-extract",
    [
        "/opt/homebrew/bin/pdfimages",
        "-f", "57", "-l", "57", "-png",
        str(pdf), str(OUTPUT / "physical57"),
    ],
)
files = list(OUTPUT.iterdir())
assert len(files) == 1 and files[0].suffix == ".png", files
with Image.open(files[0]) as image:
    assert image.size == (1472, 2240) and image.mode == "1", (image.size, image.mode)
    metadata = {
        **binding(files[0]),
        "width": image.width,
        "height": image.height,
        "mode": image.mode,
        "bitDepth": 1,
        "pixelValues": sorted(set(image.getdata())),
        "physicalPage": 57,
        "printedPage": 47,
        "pdfObject": [113, 0],
        "sourceEncoding": "CCITT",
        "sourceDpi": [288, 288],
        "resampling": False,
        "scaling": False,
        "displayOpensSoFar": 0,
        "note": "Image.open here decodes metadata/pixels without displaying an image in model context.",
    }
save_new(AUTHOR / "extracted-original.json", metadata)
print(json.dumps(metadata, indent=2))
