import hashlib
import json
import os
import struct
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image
import PIL


R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d944-n87-first-display-coverage09"
CAPTURE = T / "tmp/d910-n87-first-dom-capture"
BATCH = "full-coverage-9"
EXPECTED_IDS = [
    "en-choices-390-coverage-4",
    "en-choices-390-coverage-5",
    "en-choices-390-coverage-6",
    "en-choices-390-coverage-7",
    "en-answers-1440-coverage-1",
    "en-answers-1440-coverage-2",
    "en-answers-1440-coverage-3",
    "en-answers-390-coverage-1",
]
EXPECTED_MANIFESTS = {
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
}


def sha256(path):
    with path.open("rb") as handle:
        return hashlib.file_digest(handle, "sha256").hexdigest()


def bind(path):
    return {"path": str(path), "sha256": sha256(path)}


def exclusive_json(path, value):
    with path.open("x", encoding="ascii") as handle:
        json.dump(value, handle, indent=2, ensure_ascii=True)
        handle.write("\n")


assert Path.cwd() == R
assert Path(__file__).resolve() == OUT / "materialize.py"
assert sorted(p.name for p in OUT.iterdir()) == ["materialize.py"]
documents = {}
manifest_bindings = {}
for name, expected in EXPECTED_MANIFESTS.items():
    path = CAPTURE / name
    assert sha256(path) == expected, f"Manifest hash mismatch: {name}"
    documents[name] = json.loads(path.read_text(encoding="utf-8"))
    manifest_bindings[name] = bind(path)

plan = documents["visual-review-plan.json"]
matches = [batch for batch in plan["batches"] if batch["id"] == BATCH]
assert len(matches) == 1
batch = matches[0]
assert batch["recipeIds"] == EXPECTED_IDS
assert batch["assignedImages"] == batch["maximumImages"] == 8
selected = []
for recipe_id in EXPECTED_IDS:
    matches = [
        recipe for recipe in documents["crop-recipes.json"]["recipes"]
        if recipe["id"] == recipe_id
    ]
    assert len(matches) == 1, f"Recipe does not resolve exactly once: {recipe_id}"
    selected.append(matches[0])
assert len(selected) == len({recipe["id"] for recipe in selected}) == 8

sources = {}
for recipe in selected:
    source = Path(recipe["source"]["path"])
    assert source.parent == CAPTURE / "screenshots"
    assert recipe["locale"] == "en"
    assert recipe["surface"] in ("choices", "answers")
    assert source.is_file() and not source.is_symlink()
    if str(source) not in sources:
        assert sha256(source) == recipe["source"]["sha256"]
        records = [
            record for record in documents["offline-report.json"]["screenshots"]
            if record["path"] == str(source)
        ]
        assert len(records) == 1
        record = records[0]
        assert record["sha256"] == recipe["source"]["sha256"]
        with Image.open(source) as image:
            width, height = image.size
            assert record["dimensions"] == {"width": width, "height": height}
        sources[str(source)] = {
            **recipe["source"],
            "dimensions": {"width": width, "height": height},
            "excludedScrollbarWidth": record["excludedScrollbarWidth"],
        }
    crop = recipe["crop"]
    assert set(crop) == {"left", "top", "width", "height"}
    assert all(type(value) is int for value in crop.values())
    assert crop["left"] >= 0 and crop["top"] >= 0
    assert crop["width"] > 0 and crop["height"] > 0
    dimensions = sources[str(source)]["dimensions"]
    assert crop["left"] + crop["width"] <= dimensions["width"]
    assert crop["top"] + crop["height"] <= dimensions["height"]

targets = {}
for source_name, source_binding in sources.items():
    with Image.open(source_name) as image:
        image.load()
        for recipe in selected:
            if recipe["source"]["path"] != source_name:
                continue
            crop = recipe["crop"]
            box = (
                crop["left"],
                crop["top"],
                crop["left"] + crop["width"],
                crop["top"] + crop["height"],
            )
            cropped = image.crop(box)
            assert cropped.size == (crop["width"], crop["height"])
            path = OUT / (recipe["id"] + ".png")
            assert not path.exists()
            with path.open("xb") as handle:
                cropped.save(handle, format="PNG")
            with path.open("rb") as handle:
                header = handle.read(24)
            assert header[:8] == b"\x89PNG\r\n\x1a\n"
            assert struct.unpack(">II", header[16:24]) == cropped.size
            targets[recipe["id"]] = {
                "recipeId": recipe["id"],
                **bind(path),
                "source": source_binding,
                "crop": crop,
                "sourceBoxExclusive": list(box),
                "dimensions": {"width": cropped.width, "height": cropped.height},
                "viewport": recipe["viewport"],
                "locale": recipe["locale"],
                "surface": recipe["surface"],
                "scale": 1,
                "resizeOperations": 0,
                "pixelMode": cropped.mode,
                "pixelSha256": hashlib.sha256(cropped.tobytes()).hexdigest(),
                "expectedImageLoads": 1,
            }
            os.chmod(path, 0o444)

native = T / (
    "tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/"
    "modern-us-neutral/lessons/phy10-c2-s3-n87"
)
context = [
    bind(native / name)
    for name in ("lesson.json", "exercises.json", "answer-keys.json")
]
context.append(bind(T / "tmp/d909-n87-native-choice-binding/en/client-views.json"))
assert all(sha256(Path(item["path"])) == item["sha256"] for item in sources.values())
assert all(
    sha256(CAPTURE / name) == expected
    for name, expected in EXPECTED_MANIFESTS.items()
)
freeze = {
    "schema": "d944-n87-display-crop-freeze-v1",
    "ticket": "STEMROBIN-181",
    "successor": "successor181-3",
    "assignment": "d944 FIRST n87 DISPLAY full-coverage-9 ONLY",
    "batchId": BATCH,
    "repository": str(R),
    "writeRoot": str(OUT),
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "frozenBeforeInspection": True,
    "modelImageLoadsAtFreeze": 0,
    "nativeScale": True,
    "exactRecipeCount": 8,
    "materializedCropCount": 8,
    "sourcePngModelLoads": 0,
    "materializer": {**bind(Path(__file__)), "pillowVersion": PIL.__version__},
    "manifests": manifest_bindings,
    "contextBindings": context,
    "targets": [targets[recipe_id] for recipe_id in EXPECTED_IDS],
    "limits": {"imagesPerBatch": 8, "imagesPerContext": 24, "reopens": 0},
    "scope": "Pixels only; no SCI, figure semantics, prior batch replay or continuations outside assigned crops.",
    "domPassIsNotVisualPass": True,
    "fullDISPLAY": False,
    "completeCard": False,
}
exclusive_json(OUT / "freeze.json", freeze)
os.chmod(OUT / "freeze.json", 0o444)
os.chmod(OUT / "materialize.py", 0o444)
with (OUT / "SHA256SUMS").open("x", encoding="ascii") as handle:
    for path in sorted(OUT.iterdir()):
        if path.name != "SHA256SUMS":
            handle.write(f"{sha256(path)}  {path.name}\n")
print(json.dumps({
    "status": "FROZEN-BEFORE-INSPECTION",
    "recipeCount": 8,
    "modelImageLoads": 0,
    "freeze": bind(OUT / "freeze.json"),
    "targets": [targets[recipe_id] for recipe_id in EXPECTED_IDS],
}, indent=2))
