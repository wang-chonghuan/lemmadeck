import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
ticket = repo / ".intentfold/tickets/STEMROBIN-181"
source = repo / ".tmp/STEMROBIN-181/d1816-d399/source-work/10p/pages/0408/page.png"
layout_path = source.with_name("layout.json")
output = ticket / "tmp/d1816-d485-source408-local-evidence"
assert not (output / "input-freeze.json").exists()
assert hashlib.sha256(source.read_bytes()).hexdigest() == \
    "9637a6544a1ac2cdd44968f2468c1d03ad19c59334bc043367706296cdcd91aa"
layout = json.loads(layout_path.read_text())
image = Image.open(source)
assert image.size == (1536, 2337)
assert layout["line_bands"][:3] == [[141, 176], [214, 266], [291, 338]]
output.mkdir(parents=True, exist_ok=True)


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


crops = []
for name, box, purpose in [
    ("detected-first-band", (0, 125, 1536, 190),
     "Existing layout's first detected band141-176; source expectation places curricular row1 at214-266."),
    ("gas-order-row2", (0, 280, 1536, 352),
     "Existing layout's band291-338; D479 disputed gas-name order only."),
]:
    path = output / f"{name}.png"
    image.crop(box).save(path)
    crops.append({**bind(path), "sourceBoxXYXY": list(box),
                  "purpose": purpose, "rescaled": False})
pixels = np.asarray(image.convert("L"))
first_band = pixels[141:177, :]
ys, xs = np.where(first_band < 160)
assert len(xs)
ink_box = [int(xs.min()), int(ys.min()) + 141,
           int(xs.max()) + 1, int(ys.max()) + 142]
result = {
    "stage": "D485", "status": "local-source408-glyph-and-counter-evidence-prepared",
    "source": bind(source), "layout": bind(layout_path), "crops": crops,
    "existingDetectedFirstBand": [141, 176], "existingFirstCurricularBand": [214, 266],
    "diagnosticInkThreshold": 160, "diagnosticFirstBandInkBoxXYXY": ink_box,
    "diagnosticFirstBandDarkPixels": int(len(xs)),
    "independentCurricularRows": 24,
    "independentRowInventory": bind(ticket / "tmp/d1816-d479-source407409-first-review/expectations.json"),
    "firstReview": bind(ticket / "tmp/d1816-d479-source407409-first-review/report.json"),
    "counterChanged": False, "native408Pass": False, "gasOrderResolved": False,
    "nativeFailure24Of25Preserved": True, "parentImageOpens": 0,
    "maximumReviewerImages": 2, "sourcePagesAdded": 0, "completeCoursesAdded": 0,
    "paidCalls": 0, "databaseWrites": False,
}
path = output / "input-freeze.json"
path.write_text(json.dumps(result, indent=2) + "\n")
for file in [path, *(Path(row["path"]) for row in crops)]:
    file.chmod(0o444)
print(json.dumps({"input": bind(path), "firstBandInkBoxXYXY": ink_box,
                  "crops": 2, "parentImageOpens": 0}))
