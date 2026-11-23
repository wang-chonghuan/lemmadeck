"""Extract readable visual samples from the one complete display run."""
import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path("ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n60/evidence/display")
report = json.loads((root / "report.json").read_text())
assert report["status"] == "pass" and len(report["records"]) == 8
output = root / "inspection"
output.mkdir(exist_ok=False)
samples = []
for record in report["records"]:
    source = root / record["screenshot"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == record["screenshotSha256"]
    image = Image.open(source)
    height = 844 if record["width"] == 390 else 960
    if record["figures"]:
        focus = record["figures"][0]["top"] - 120
    else:
        blocks = record["geometry"]["blocks"]
        focus = blocks[min(3, len(blocks) - 1)]["top"] - 60
    top = max(0, min(round(focus), max(0, image.height - height)))
    box = (0, top, image.width, min(image.height, top + height))
    name = f'{record["view"]}-{record["width"]}.png'
    target = output / name
    image.crop(box).save(target)
    samples.append({
        "view": record["view"], "width": record["width"],
        "source": str(source), "sourceSha256": record["screenshotSha256"],
        "box": list(box), "sample": str(target),
        "sampleSha256": hashlib.sha256(target.read_bytes()).hexdigest(),
    })
(output / "samples.json").write_text(json.dumps({
    "status": "prepared", "samplingOnly": True,
    "fullDisplayEvidence": str(root / "report.json"), "samples": samples,
}, indent=2) + "\n")
print(json.dumps({"samples": len(samples), "imagesOpenedByParent": 0}))
