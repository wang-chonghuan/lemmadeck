import hashlib
import json
import os
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

from PIL import Image, __version__ as pillow_version


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d941-n87-first-display-coverage07"
CAPTURE = T / "tmp/d910-n87-first-dom-capture"
NATIVE = (
    T / "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/"
    "modern-us-neutral/lessons/phy10-c2-s3-n87"
)
EXPECTED = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}
RECIPE_IDS = [
    "en-text-390-coverage-9",
    "en-text-390-coverage-10",
    "en-text-390-coverage-11",
    "en-text-390-coverage-12",
    "en-text-390-coverage-13",
    "en-text-390-coverage-14",
    "en-exercises-1440-coverage-1",
    "en-exercises-390-coverage-1",
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write_json(path, value):
    with path.open("x", encoding="ascii") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd() == R
assert OUT.resolve() == OUT
assert not (OUT / "freeze.json").exists(), "No rematerialization permitted"
documents = {}
input_bindings = []
for name, expected in EXPECTED.items():
    path = CAPTURE / name
    data = path.read_bytes()
    assert sha(data) == expected, name
    documents[name] = json.loads(data)
    input_bindings.append({"path": str(path), "sha256": expected, "verified": True})

batch = [
    item for item in documents["visual-review-plan.json"]["batches"]
    if item["id"] == "full-coverage-7"
]
assert len(batch) == 1
assert batch[0]["recipeIds"] == RECIPE_IDS
assert batch[0]["assignedImages"] == batch[0]["maximumImages"] == 8
all_recipes = documents["crop-recipes.json"]["recipes"]
recipes = []
for recipe_id in RECIPE_IDS:
    matches = [item for item in all_recipes if item["id"] == recipe_id]
    assert len(matches) == 1
    assert matches[0]["locale"] == "en"
    recipes.append(matches[0])

offline = documents["offline-report.json"]
native_bindings = []
for name, field in [("lesson.json", "lesson"), ("exercises.json", "exercises")]:
    path = NATIVE / name
    bindings = [
        check["sources"][field] for check in offline["checks"]
        if check["locale"] == "en"
        and (
            (check["surface"] == "text" and check["viewport"]["width"] == 390)
            or check["surface"] == "exercises"
        )
    ]
    assert len(bindings) == 3
    assert all(item == bindings[0] for item in bindings)
    assert bindings[0]["path"] == str(path)
    actual = sha(path.read_bytes())
    assert actual == bindings[0]["sha256"]
    native_bindings.append({"path": str(path), "sha256": actual, "verified": True})

# Validate every source and rectangle before creating any crop.
source_data = {}
source_metadata = {}
for recipe in recipes:
    source = recipe["source"]
    path = Path(source["path"])
    assert path.parent == CAPTURE / "screenshots"
    if str(path) not in source_data:
        data = path.read_bytes()
        assert sha(data) == source["sha256"]
        receipts = [item for item in offline["screenshots"] if item["path"] == str(path)]
        assert len(receipts) == 1 and receipts[0]["sha256"] == sha(data)
        with Image.open(BytesIO(data)) as image:
            assert image.format == "PNG"
            dimensions = {"width": image.width, "height": image.height}
            assert dimensions == receipts[0]["dimensions"]
            source_metadata[str(path)] = {
                **source,
                "dimensions": dimensions,
                "mode": image.mode,
                "verified": True,
                "openedIntoModel": False,
            }
        source_data[str(path)] = data
    assert sha(source_data[str(path)]) == source["sha256"]
    rect = recipe["crop"]
    assert set(rect) == {"left", "top", "width", "height"}
    assert all(type(value) is int for value in rect.values())
    dims = source_metadata[str(path)]["dimensions"]
    assert rect["left"] >= 0 and rect["top"] >= 0
    assert rect["width"] > 0 and rect["height"] > 0
    assert rect["left"] + rect["width"] <= dims["width"]
    assert rect["top"] + rect["height"] <= dims["height"]

frozen_recipes = []
for recipe in recipes:
    rect = recipe["crop"]
    crop_path = OUT / (recipe["id"] + ".png")
    assert not crop_path.exists()
    box = (
        rect["left"], rect["top"],
        rect["left"] + rect["width"], rect["top"] + rect["height"],
    )
    with Image.open(BytesIO(source_data[recipe["source"]["path"]])) as image:
        crop = image.crop(box)
        assert crop.size == (rect["width"], rect["height"])
        with crop_path.open("xb") as stream:
            crop.save(stream, format="PNG")
    os.chmod(crop_path, 0o444)
    frozen_recipes.append({
        "recipeId": recipe["id"],
        "locale": recipe["locale"],
        "surface": recipe["surface"],
        "viewport": recipe["viewport"],
        "source": source_metadata[recipe["source"]["path"]],
        "rectangle": rect,
        "pillowBoxExclusive": list(box),
        "crop": {
            "path": str(crop_path),
            "sha256": sha(crop_path.read_bytes()),
            "dimensions": {"width": rect["width"], "height": rect["height"]},
            "mode": source_metadata[recipe["source"]["path"]]["mode"],
        },
        "scale": 1,
        "resized": False,
    })

freeze = {
    "schema": "stemrobin181/offline-bounded-display-freeze@1",
    "ticket": "STEMROBIN-181",
    "assignment": "successor181-3/d941-FIRST-n87-DISPLAY-full-coverage-7",
    "batchId": "full-coverage-7",
    "repository": str(R),
    "scratch": str(OUT),
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "freezeBeforeImageInspection": True,
    "imagesLoadedAtFreeze": 0,
    "inputBindings": input_bindings,
    "nativeContextBindings": native_bindings,
    "coordinateSystem": documents["crop-recipes.json"]["coordinateSystem"],
    "materializer": {"library": "Pillow", "version": pillow_version},
    "recipes": frozen_recipes,
    "materializedCrops": 8,
    "maximumBatchImageLoads": 8,
    "maximumContextImageLoads": 24,
    "originalScreenshotModelLoads": 0,
    "fullDISPLAY": False,
    "completeCard": False,
}
write_json(OUT / "freeze.json", freeze)
os.chmod(OUT / "freeze.json", 0o444)
paths = sorted(path for path in OUT.iterdir() if path.is_file())
with (OUT / "SHA256SUMS").open("x", encoding="ascii") as stream:
    for path in paths:
        stream.write(f"{sha(path.read_bytes())}  {path.name}\n")
print(json.dumps({
    "freeze": {"path": str(OUT / "freeze.json"), "sha256": sha((OUT / "freeze.json").read_bytes())},
    "crops": [{"recipeId": item["recipeId"], **item["crop"]} for item in frozen_recipes],
    "imagesLoadedAtFreeze": 0,
}, indent=2))
