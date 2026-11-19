import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
OUT = TICKET / "tmp/d943-n87-first-display-coverage08"
EXPECTED_INPUTS = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}
EXPECTED_IDS = [
    "en-exercises-390-coverage-2",
    "en-choices-1440-coverage-1",
    "en-choices-1440-coverage-2",
    "en-choices-1440-coverage-3",
    "en-choices-1440-coverage-4",
    "en-choices-390-coverage-1",
    "en-choices-390-coverage-2",
    "en-choices-390-coverage-3",
]


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def exclusive_json(path, data):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(data, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd() == ROOT
assert OUT.is_dir() and not (OUT / "freeze.json").exists()
assert not list(OUT.glob("*.png"))
inputs = []
documents = {}
for name, expected in EXPECTED_INPUTS.items():
    path = CAPTURE / name
    actual = sha256(path)
    assert actual == expected, (name, actual)
    documents[name] = json.loads(path.read_text(encoding="utf-8"))
    inputs.append({"path": str(path), "sha256": actual, "matchesExpected": True})

plan = documents["visual-review-plan.json"]
batches = [batch for batch in plan["batches"] if batch["id"] == "full-coverage-8"]
assert len(batches) == 1
batch = batches[0]
assert batch["recipeIds"] == EXPECTED_IDS
assert batch["assignedImages"] == batch["maximumImages"] == 8
recipes = []
for recipe_id in EXPECTED_IDS:
    matches = [
        recipe for recipe in documents["crop-recipes.json"]["recipes"]
        if recipe["id"] == recipe_id
    ]
    assert len(matches) == 1
    recipes.append(matches[0])

sources = {}
for recipe in recipes:
    source = recipe["source"]
    source_path = Path(source["path"])
    assert source_path.parent == CAPTURE / "screenshots"
    assert sha256(source_path) == source["sha256"]
    if source["path"] in sources:
        assert sources[source["path"]]["sha256"] == source["sha256"]
        continue
    receipts = [
        item for item in documents["offline-report.json"]["screenshots"]
        if item["path"] == source["path"]
    ]
    assert len(receipts) == 1 and receipts[0]["sha256"] == source["sha256"]
    with Image.open(source_path) as image:
        dimensions = {"width": image.width, "height": image.height}
    assert dimensions == receipts[0]["dimensions"]
    sources[source["path"]] = {
        **source,
        "dimensions": dimensions,
        "sourceSha256MechanicallyVerified": True,
        "originalModelLoads": 0,
    }

targets = []
for recipe in recipes:
    crop = recipe["crop"]
    left, top, width, height = (
        crop[key] for key in ("left", "top", "width", "height")
    )
    dimensions = sources[recipe["source"]["path"]]["dimensions"]
    assert all(isinstance(value, int) for value in (left, top, width, height))
    assert left >= 0 and top >= 0 and width > 0 and height > 0
    assert left + width <= dimensions["width"]
    assert top + height <= dimensions["height"]
    target_path = OUT / (recipe["id"] + ".png")
    with Image.open(recipe["source"]["path"]) as image:
        cropped = image.crop((left, top, left + width, top + height))
        assert cropped.size == (width, height)
        cropped.save(target_path, format="PNG")
    target_path.chmod(0o444)
    targets.append({
        "recipeId": recipe["id"],
        "path": str(target_path),
        "sha256": sha256(target_path),
        "source": recipe["source"],
        "sourceDimensions": dimensions,
        "crop": crop,
        "dimensions": {"width": width, "height": height},
        "locale": recipe["locale"],
        "surface": recipe["surface"],
        "viewport": recipe["viewport"],
        "criterion": recipe["criterion"],
        "nativeScale": True,
        "resized": False,
        "imageLoadsAtFreeze": 0,
        "intendedImageLoads": 1,
        "intendedLoadDetail": "original",
        "recipeExact": recipe,
    })

context_paths = [
    TICKET / "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/"
    "modern-us-neutral/lessons/phy10-c2-s3-n87/lesson.json",
    TICKET / "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/"
    "modern-us-neutral/lessons/phy10-c2-s3-n87/exercises.json",
    TICKET / "tmp/d909-n87-native-choice-binding/en/client-views.json",
]
freeze = {
    "schema": "stemrobin181/offline-bounded-display-freeze@1",
    "ticket": "STEMROBIN-181",
    "successor": "successor181-3",
    "assignment": "d943 FIRST n87 DISPLAY full-coverage-8 ONLY",
    "batchId": "full-coverage-8",
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "frozenBeforeInspection": True,
    "inputs": inputs,
    "context": [{"path": str(path), "sha256": sha256(path)} for path in context_paths],
    "sources": list(sources.values()),
    "coordinateSystem": documents["crop-recipes.json"]["coordinateSystem"],
    "operation": "Pillow crop only; no resize, rendering or recapture",
    "pillowVersion": Image.__version__,
    "batch": batch,
    "targets": targets,
    "materializedCropCount": len(targets),
    "imageLoadsAtFreeze": 0,
    "limits": {"batch": 8, "context": 24, "originalModelLoads": 0, "reopens": 0},
    "fullDISPLAY": False,
    "completeCard": False,
    "excluded": [
        "SCI and figure semantics", "prior batch replay", "native production or render",
        "browser or capture", "backend", "tests or build", "paid generation",
        "DB or publisher or deploy", "git or index or meter or promotion",
        "supervisor or other chat or new worktree",
    ],
}
exclusive_json(OUT / "freeze.json", freeze)
(OUT / "freeze.json").chmod(0o444)
manifest_paths = [OUT / "materialize.py", OUT / "freeze.json"]
manifest_paths.extend(Path(target["path"]) for target in targets)
with (OUT / "SHA256SUMS").open("x", encoding="ascii") as stream:
    for path in sorted(manifest_paths):
        stream.write(f"{sha256(path)}  {path.name}\n")
print(json.dumps({
    "freeze": str(OUT / "freeze.json"),
    "freezeSha256": sha256(OUT / "freeze.json"),
    "materializedCropCount": len(targets),
    "imageLoads": 0,
    "targets": [
        {key: target[key] for key in ("recipeId", "path", "sha256", "dimensions")}
        for target in targets
    ],
}, indent=2))
