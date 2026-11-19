import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d945-n87-first-display-coverage10"
CAPTURE = T / "tmp/d910-n87-first-dom-capture"
BATCH = "full-coverage-10"
IDS = [f"en-answers-390-coverage-{i}" for i in range(2, 7)]
EXPECTED = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def exclusive_json(path, value):
    assert path.parent == OUT
    with path.open("x", encoding="ascii") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd() == R
assert Path(__file__).resolve() == OUT / "materialize.py"
assert not (OUT / "freeze.json").exists()
assert not list(OUT.glob("*.png"))
documents = {}
inputs = []
for name, expected in EXPECTED.items():
    path = CAPTURE / name
    payload = path.read_bytes()
    actual = hashlib.sha256(payload).hexdigest()
    assert actual == expected, (name, actual)
    documents[name] = json.loads(payload)
    inputs.append({"path": str(path), "sha256": actual, "verified": True})

plan = documents["visual-review-plan.json"]
batch = next(item for item in plan["batches"] if item["id"] == BATCH)
assert batch["recipeIds"] == IDS and batch["assignedImages"] == 5
assert batch["maximumImages"] == 8
recipes = documents["crop-recipes.json"]["recipes"]
assigned = [next(item for item in recipes if item["id"] == rid) for rid in IDS]
assert len({item["id"] for item in assigned}) == 5
source = assigned[0]["source"]
assert all(item["source"] == source for item in assigned)
source_path = Path(source["path"])
assert source_path == CAPTURE / "screenshots/en-answers-390.png"
assert sha(source_path) == source["sha256"]
offline = documents["offline-report.json"]
capture = next(
    item for item in offline["screenshots"]
    if item["locale"] == "en" and item["surface"] == "answers"
    and item["viewport"]["width"] == 390
)
assert capture["path"] == str(source_path)
assert capture["sha256"] == source["sha256"]

native = T / "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87"
context = []
for name in ("lesson.json", "exercises.json", "answer-keys.json"):
    path = native / name
    actual = sha(path)
    snapshot = next(item for item in offline["inputSnapshotsUnmodified"] if item["path"] == str(path))
    assert actual == snapshot["sha256"], name
    context.append({"path": str(path), "sha256": actual, "purpose": "native English display context only"})

targets = []
with Image.open(source_path) as original:
    assert original.size == (375, 4734)
    for item in assigned:
        crop = item["crop"]
        x, y, w, h = (crop[key] for key in ("left", "top", "width", "height"))
        assert all(isinstance(value, int) for value in (x, y, w, h))
        assert x == 0 and w == 375 and 0 <= y < y + h <= original.height
        output = OUT / f"{item['id']}.png"
        assert not output.exists()
        pixels = original.crop((x, y, x + w, y + h))
        assert pixels.size == (w, h)
        pixels.save(output, format="PNG")
        targets.append({
            "recipeId": item["id"], "source": source, "crop": crop,
            "path": str(output), "sha256": sha(output),
            "dimensions": {"width": w, "height": h},
            "locale": item["locale"], "surface": item["surface"],
            "viewport": item["viewport"], "nativeScale": True,
            "resized": False, "imageLoadsBeforeInspection": 0,
        })

freeze = {
    "schema": "d945-n87-first-display-coverage10-freeze@1",
    "ticket": "STEMROBIN-181", "successor": "successor181-3",
    "assignment": "d945 FIRST n87 DISPLAY full-coverage-10 ONLY",
    "batchId": BATCH, "frozenAt": datetime.now(timezone.utc).isoformat(),
    "frozenBeforeInspection": True, "inputs": inputs, "context": context,
    "source": {**source, "dimensions": {"width": 375, "height": 4734}, "verified": True},
    "materializer": {"path": str(OUT / "materialize.py"), "sha256": sha(OUT / "materialize.py")},
    "engine": {"name": "Pillow", "version": Image.__version__},
    "coordinateSystem": "PNG CSS pixels, origin upper left; right/bottom bounds exclusive",
    "targets": targets, "assignedImages": 5, "materializedImages": 5,
    "maximumImagesPerBatch": 8, "maximumImagesPerContext": 24,
    "originalPngModelLoads": 0, "extraCrops": 0, "renderInvocations": 0,
    "fullDISPLAY": False, "completeCard": False,
}
exclusive_json(OUT / "freeze.json", freeze)
print(json.dumps({"freezeSha256": sha(OUT / "freeze.json"), "targets": targets}, indent=2))
