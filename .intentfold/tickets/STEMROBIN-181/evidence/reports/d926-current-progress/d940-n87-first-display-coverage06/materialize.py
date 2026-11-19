import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, __version__ as pillow_version


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d940-n87-first-display-coverage06"
CAPTURE = T / "tmp/d910-n87-first-dom-capture"
BATCH_ID = "full-coverage-6"
IDS = [f"en-text-390-coverage-{n}" for n in range(1, 9)]
EXPECTED = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def bound_read(path, expected):
    path = Path(path)
    assert path.resolve().is_relative_to(R)
    data = path.read_bytes()
    actual = sha256(data)
    assert actual == expected, f"Hash mismatch: {path}"
    return data, {"path": str(path), "sha256": actual, "verified": True}


assert Path.cwd() == R
assert OUT.resolve().is_relative_to(R)
assert not (OUT / "freeze.json").exists(), "Do not rematerialize a frozen batch"
assert sorted(p.name for p in OUT.iterdir()) == ["materialize.py"]

documents = {}
inputs = []
for name, expected in EXPECTED.items():
    data, binding = bound_read(CAPTURE / name, expected)
    documents[name] = json.loads(data)
    inputs.append(binding)

plan = documents["visual-review-plan.json"]
recipes_doc = documents["crop-recipes.json"]
offline = documents["offline-report.json"]
batches = [b for b in plan["batches"] if b["id"] == BATCH_ID]
assert len(batches) == 1
batch = batches[0]
assert batch["recipeIds"] == IDS
assert batch["assignedImages"] == batch["maximumImages"] == 8
assert recipes_doc["coordinateSystem"] == "PNG CSS pixels, origin upper left"
assert offline["capture"] == "PASS" and offline["visualReview"] == "HOLD"
assert offline["visualReviewPlan"]["sha256"] == EXPECTED["visual-review-plan.json"]
assert plan["cropRecipes"]["sha256"] == EXPECTED["crop-recipes.json"]

native = (
    T / "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions"
    "/modern-us-neutral/lessons/phy10-c2-s3-n87"
)
context = []
for name in ("lesson.json", "exercises.json"):
    path = native / name
    bindings = [
        item
        for item in offline["inputSnapshotsUnmodified"]
        if item["path"] == str(path)
    ]
    assert len(bindings) == 1
    data, binding = bound_read(path, bindings[0]["sha256"])
    doc = json.loads(data)
    assert doc["locale"] == "en"
    context.append(binding)

resolved = []
for n, recipe_id in enumerate(IDS):
    matches = [r for r in recipes_doc["recipes"] if r["id"] == recipe_id]
    assert len(matches) == 1
    recipe = matches[0]
    assert recipe["locale"] == "en" and recipe["surface"] == "text"
    assert recipe["viewport"] == {"width": 390, "height": 844}
    assert recipe["crop"] == {
        "left": 0, "top": n * 844, "width": 375, "height": 844
    }
    resolved.append(recipe)

source = resolved[0]["source"]
assert all(r["source"] == source for r in resolved)
source_data, source_binding = bound_read(source["path"], source["sha256"])
for document in (plan, offline):
    key = "originalScreenshots" if document is plan else "screenshots"
    matches = [s for s in document[key] if s["path"] == source["path"]]
    assert len(matches) == 1
    assert matches[0]["sha256"] == source_binding["sha256"]
    assert matches[0]["dimensions"] == {"width": 375, "height": 11363}

crops = []
with Image.open(io.BytesIO(source_data)) as image:
    assert image.format == "PNG"
    assert image.size == (375, 11363)
    image.load()
    for recipe in resolved:
        rect = recipe["crop"]
        box = (
            rect["left"], rect["top"],
            rect["left"] + rect["width"], rect["top"] + rect["height"],
        )
        assert box[2] <= image.width and box[3] <= image.height
        output = OUT / f'{recipe["id"]}.png'
        assert not output.exists()
        crop = image.crop(box)
        assert crop.size == (375, 844)
        crop.save(output, format="PNG")
        crops.append({
            "recipeId": recipe["id"],
            "source": source_binding,
            "rectangle": rect,
            "crop": {
                "path": str(output),
                "sha256": sha256(output.read_bytes()),
                "dimensions": {"width": crop.width, "height": crop.height},
            },
            "nativeScale": 1,
            "resized": False,
            "paddingAdded": False,
        })
        output.chmod(0o444)

freeze = {
    "schema": "d940-n87-first-display-coverage06-freeze-v1",
    "ticket": "STEMROBIN-181",
    "successor": "successor181-3",
    "assignment": "d940 FIRST n87 DISPLAY full-coverage-6 ONLY",
    "batchId": BATCH_ID,
    "repository": str(R),
    "writeRoot": str(OUT),
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "frozenBeforeImageInspection": True,
    "modelImageLoadsAtFreeze": 0,
    "maximumBatchImageLoads": 8,
    "maximumContextImageLoads": 24,
    "inputs": inputs,
    "nativeContext": context,
    "source": {
        **source_binding,
        "dimensions": {"width": 375, "height": 11363},
        "modelImageLoads": 0,
    },
    "coordinateSystem": recipes_doc["coordinateSystem"],
    "cropCount": len(crops),
    "crops": crops,
    "materializer": {
        "path": str(OUT / "materialize.py"),
        "sha256": sha256((OUT / "materialize.py").read_bytes()),
        "library": "Pillow",
        "version": pillow_version,
        "operation": "Lossless integer-rectangle crop; no resize, render or capture",
    },
    "coveredSourceRectangle": {
        "left": 0, "top": 0, "width": 375, "height": 6752
    },
    "unobservedContinuation": {
        "left": 0, "top": 6752, "width": 375, "height": 4611
    },
    "fullDISPLAY": False,
    "completeCard": False,
}
freeze_path = OUT / "freeze.json"
freeze_path.write_text(json.dumps(freeze, indent=2) + "\n", encoding="ascii")
freeze_path.chmod(0o444)

files = sorted(p for p in OUT.iterdir() if p.is_file())
sums = "".join(f"{sha256(p.read_bytes())}  {p.name}\n" for p in files)
(OUT / "SHA256SUMS").write_text(sums, encoding="ascii")
print(json.dumps({
    "freeze": {"path": str(freeze_path), "sha256": sha256(freeze_path.read_bytes())},
    "cropCount": len(crops),
    "crops": crops,
}, indent=2))
