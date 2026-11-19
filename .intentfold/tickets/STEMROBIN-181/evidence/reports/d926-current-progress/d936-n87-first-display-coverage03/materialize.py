import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
OUT = TICKET / "tmp/d936-n87-first-display-coverage03"
IDS = [
    "zh-exercises-390-coverage-1",
    "zh-choices-1440-coverage-1",
    "zh-choices-1440-coverage-2",
    "zh-choices-1440-coverage-3",
    "zh-choices-390-coverage-1",
    "zh-choices-390-coverage-2",
    "zh-choices-390-coverage-3",
    "zh-choices-390-coverage-4",
]
EXPECTED = {
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_new(path, data):
    with path.open("x", encoding="ascii") as stream:
        json.dump(data, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


assert Path.cwd().resolve() == ROOT
assert not (OUT / "materialization.json").exists(), "One-shot output already exists"
inputs = []
documents = {}
for name, expected in EXPECTED.items():
    path = CAPTURE / name
    actual = digest(path)
    assert actual == expected, f"Input hash mismatch: {name}"
    documents[name] = json.loads(path.read_text())
    inputs.append({"path": str(path), "sha256": actual})

plan = documents["visual-review-plan.json"]
batch = next(item for item in plan["batches"] if item["id"] == "full-coverage-3")
assert batch["recipeIds"] == IDS
assert batch["assignedImages"] == batch["maximumImages"] == 8
recipes = documents["crop-recipes.json"]["recipes"]
selected = [next(item for item in recipes if item["id"] == name) for name in IDS]
sources = {}
for recipe in selected:
    path = Path(recipe["source"]["path"])
    assert path.parent == CAPTURE / "screenshots"
    actual = digest(path)
    assert actual == recipe["source"]["sha256"], f"Source hash mismatch: {path.name}"
    receipt = next(item for item in documents["offline-report.json"]["screenshots"]
                   if item["path"] == str(path))
    assert receipt["sha256"] == actual
    sources[str(path)] = {
        "path": str(path),
        "sha256": actual,
        "dimensions": receipt["dimensions"],
        "hashVerifiedBeforePixelDecode": True,
        "loadedIntoModel": False,
    }
    assert not (OUT / (recipe["id"] + ".png")).exists()

native = TICKET / "tmp/d900-n87-first-bilingual-native/zh/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87"
for path in [
    native / "lesson.json",
    native / "exercises.json",
    TICKET / "tmp/d909-n87-native-choice-binding/zh/client-views.json",
]:
    inputs.append({"path": str(path), "sha256": digest(path), "purpose": "native-zh-display-text-only"})

outputs = []
# Decode only after all source hashes pass; never display source images.
for source, binding in sources.items():
    with Image.open(source) as original:
        assert original.size == (
            binding["dimensions"]["width"], binding["dimensions"]["height"]
        )
        for recipe in selected:
            if recipe["source"]["path"] != source:
                continue
            rect = recipe["crop"]
            left, top = rect["left"], rect["top"]
            width, height = rect["width"], rect["height"]
            assert left >= 0 and top >= 0
            assert left + width <= original.width and top + height <= original.height
            output = OUT / (recipe["id"] + ".png")
            with original.crop((left, top, left + width, top + height)) as tile:
                tile.save(output, format="PNG")
            outputs.append({
                "recipeId": recipe["id"],
                "path": str(output),
                "sha256": digest(output),
                "source": recipe["source"],
                "crop": rect,
                "locale": recipe["locale"],
                "surface": recipe["surface"],
                "viewport": recipe["viewport"],
                "resized": False,
                "materializations": 1,
            })

outputs.sort(key=lambda item: IDS.index(item["recipeId"]))
assert len(outputs) == 8
write_new(OUT / "materialization.json", {
    "schema": "d936-n87-display-materialization-v1",
    "assignment": "d936 FIRST n87 DISPLAY full-coverage-3 ONLY",
    "successor": "successor181-3",
    "batch": batch,
    "inputs": inputs,
    "sources": list(sources.values()),
    "crops": outputs,
    "imagesLoadedIntoModelAtMaterialization": 0,
    "sourceImagesLoadedIntoModel": 0,
    "nativeProducerRenderBrowserRecapture": False,
})
print(json.dumps({"status": "MATERIALIZED", "crops": outputs}, indent=2))
