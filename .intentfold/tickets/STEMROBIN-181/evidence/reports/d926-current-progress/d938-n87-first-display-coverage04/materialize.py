import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path

import PIL
from PIL import Image


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d938-n87-first-display-coverage04"
CAPTURE = T / "tmp/d910-n87-first-dom-capture"
BATCH = "full-coverage-4"
IDS = [
    "zh-choices-390-coverage-5",
    "zh-answers-1440-coverage-1",
    "zh-answers-1440-coverage-2",
    "zh-answers-1440-coverage-3",
    "zh-answers-390-coverage-1",
    "zh-answers-390-coverage-2",
    "zh-answers-390-coverage-3",
    "zh-answers-390-coverage-4",
]
EXPECTED = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def exclusive_json(path, data):
    with path.open("x", encoding="ascii") as handle:
        json.dump(data, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


if Path.cwd() != R or OUT.resolve() != OUT:
    raise RuntimeError("Repository or output boundary mismatch")
if (OUT / "freeze.json").exists() or list(OUT.glob("*.png")):
    raise RuntimeError("Refusing to replace existing frozen crops")

inputs = []
documents = {}
for name, expected in EXPECTED.items():
    source = CAPTURE / name
    raw = source.read_bytes()
    actual = sha(raw)
    if actual != expected:
        raise RuntimeError(f"Input hash mismatch: {name}")
    inputs.append({"path": str(source), "sha256": actual, "verified": True})
    documents[name] = json.loads(raw)

plan = documents["visual-review-plan.json"]
batches = [batch for batch in plan["batches"] if batch["id"] == BATCH]
if len(batches) != 1 or batches[0]["recipeIds"] != IDS:
    raise RuntimeError("Assigned batch mismatch")
if batches[0]["assignedImages"] != 8 or batches[0]["maximumImages"] != 8:
    raise RuntimeError("Assigned image bound mismatch")

recipes = documents["crop-recipes.json"]["recipes"]
selected = []
for recipe_id in IDS:
    matches = [recipe for recipe in recipes if recipe["id"] == recipe_id]
    if len(matches) != 1:
        raise RuntimeError(f"Recipe is not unique: {recipe_id}")
    selected.append(matches[0])

# Validate all three source files before producing any of the eight crops.
sources = {}
for recipe in selected:
    path = Path(recipe["source"]["path"])
    if path.parent != CAPTURE / "screenshots":
        raise RuntimeError("Unexpected source location")
    if path not in sources:
        raw = path.read_bytes()
        actual = sha(raw)
        if actual != recipe["source"]["sha256"]:
            raise RuntimeError(f"Source hash mismatch: {path}")
        matches = [
            item
            for item in documents["offline-report.json"]["screenshots"]
            if item["path"] == str(path)
        ]
        if len(matches) != 1 or matches[0]["sha256"] != actual:
            raise RuntimeError("Offline screenshot binding mismatch")
        image = Image.open(io.BytesIO(raw))
        image.load()
        expected_size = (
            matches[0]["dimensions"]["width"],
            matches[0]["dimensions"]["height"],
        )
        if image.format != "PNG" or image.size != expected_size:
            raise RuntimeError("Source PNG dimensions mismatch")
        sources[path] = {
            "image": image,
            "path": str(path),
            "sha256": actual,
            "dimensions": {"width": image.width, "height": image.height},
            "sourceHashVerified": True,
            "offlineReportBindingVerified": True,
        }
    elif sources[path]["sha256"] != recipe["source"]["sha256"]:
        raise RuntimeError("Inconsistent shared-source hash")
    rect = recipe["crop"]
    left, top, width, height = (
        rect["left"], rect["top"], rect["width"], rect["height"]
    )
    image = sources[path]["image"]
    if not all(type(value) is int for value in (left, top, width, height)):
        raise RuntimeError("Noninteger rectangle")
    if min(left, top) < 0 or min(width, height) <= 0:
        raise RuntimeError("Invalid rectangle")
    if left + width > image.width or top + height > image.height:
        raise RuntimeError("Rectangle exceeds source PNG")

records = []
for recipe in selected:
    source = sources[Path(recipe["source"]["path"])]
    rect = recipe["crop"]
    box = (
        rect["left"],
        rect["top"],
        rect["left"] + rect["width"],
        rect["top"] + rect["height"],
    )
    crop = source["image"].crop(box)
    destination = OUT / f"{recipe['id']}.png"
    with destination.open("xb") as handle:
        crop.save(handle, format="PNG")
    crop_sha = sha(destination.read_bytes())
    destination.chmod(0o444)
    records.append({
        "recipeId": recipe["id"],
        "locale": recipe["locale"],
        "surface": recipe["surface"],
        "viewport": recipe["viewport"],
        "source": {key: value for key, value in source.items() if key != "image"},
        "rectangle": rect,
        "crop": {
            "path": str(destination),
            "sha256": crop_sha,
            "dimensions": {"width": crop.width, "height": crop.height},
        },
        "nativeScale": 1,
        "resized": False,
        "cropDimensionsVerified": crop.size == (rect["width"], rect["height"]),
    })
    if not records[-1]["cropDimensionsVerified"]:
        raise RuntimeError("Crop dimensions differ from recipe rectangle")

context_paths = [
    T / "production-meter.json",
    R / ".intentfold/readme.md",
    R / ".intentfold/project.json",
    *[R / f".intentfold/charter/{name}.md"
      for name in ("product", "engineering", "ui", "operations")],
    T / "tmp/d900-n87-first-bilingual-native/zh/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87/lesson.json",
    T / "tmp/d900-n87-first-bilingual-native/zh/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87/exercises.json",
    T / "tmp/d909-n87-native-choice-binding/zh/client-views.json",
]
freeze = {
    "schema": "stemrobin181/bounded-display-preinspection-freeze@1",
    "ticket": "STEMROBIN-181",
    "assignment": "successor181-3",
    "reviewer": "d938",
    "reviewPhase": "FIRST",
    "batchId": BATCH,
    "repository": str(R),
    "writeRoot": str(OUT),
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "state": "FROZEN-BEFORE-FIRST-IMAGE-INSPECTION",
    "imageLoadsAtFreeze": 0,
    "originalScreenshotModelLoads": 0,
    "materializedCropCount": len(records),
    "maximumBatchImageLoads": 8,
    "maximumContextImageLoads": 24,
    "coordinateSystem": "PNG CSS pixels; upper-left origin; rectangle is left/top/width/height",
    "materializer": {
        "path": str(Path(__file__)),
        "sha256": sha(Path(__file__).read_bytes()),
        "library": "Pillow",
        "version": PIL.__version__,
        "resizeOrResample": False,
    },
    "inputs": inputs,
    "contextReadOnlySnapshots": [
        {"path": str(path), "sha256": sha(path.read_bytes())}
        for path in context_paths
    ],
    "contextScope": "Current native zh lesson/exercises and only client-views item 5; no substantive SCI/figure or prior-batch review replay",
    "meterSnapshotIsNotAWriteOrPromotion": True,
    "recipes": records,
    "fullDISPLAY": False,
    "completeCard": False,
}
exclusive_json(OUT / "freeze.json", freeze)
(OUT / "freeze.json").chmod(0o444)
manifest_files = [Path(__file__), OUT / "freeze.json"] + [
    Path(record["crop"]["path"]) for record in records
]
with (OUT / "SHA256SUMS").open("x", encoding="ascii") as handle:
    for path in sorted(manifest_files):
        handle.write(f"{sha(path.read_bytes())}  {path.name}\n")
for source in sources.values():
    source["image"].close()
print(json.dumps({
    "freezePath": str(OUT / "freeze.json"),
    "freezeSha256": sha((OUT / "freeze.json").read_bytes()),
    "cropCount": len(records),
    "imageLoads": 0,
    "recipes": [
        {"recipeId": item["recipeId"], "cropSha256": item["crop"]["sha256"]}
        for item in records
    ],
}, indent=2))
