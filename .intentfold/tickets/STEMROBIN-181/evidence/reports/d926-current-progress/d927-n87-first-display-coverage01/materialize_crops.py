import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
OUTPUT = TICKET / "tmp/d927-n87-first-display-coverage01"
IDS = [
    *[f"zh-text-1440-coverage-{index}" for index in range(1, 7)],
    "zh-text-390-coverage-1",
    "zh-text-390-coverage-2",
]
EXPECTED = {
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
}
NATIVE = (
    TICKET
    / "tmp/d900-n87-first-bilingual-native/zh/artifacts/10p/editions/"
    "modern-us-neutral/lessons/phy10-c2-s3-n87/lesson.json"
)


def sha256(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def write_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def main():
    if Path.cwd().resolve() != ROOT:
        raise RuntimeError("Run only from the explicitly assigned worktree")
    inputs = []
    for name, expected in EXPECTED.items():
        path = CAPTURE / name
        actual = sha256(path)
        if actual != expected:
            raise RuntimeError(f"Input hash mismatch: {name}")
        inputs.append({"path": str(path), "sha256": actual, "verified": True})

    plan = json.loads((CAPTURE / "visual-review-plan.json").read_text())
    batch = next(item for item in plan["batches"] if item["id"] == "full-coverage-1")
    if batch["recipeIds"] != IDS or batch["assignedImages"] != 8:
        raise RuntimeError("Assignment differs from exact eight-recipe batch")
    recipes = json.loads((CAPTURE / "crop-recipes.json").read_text())["recipes"]
    selected = []
    for recipe_id in IDS:
        matches = [recipe for recipe in recipes if recipe["id"] == recipe_id]
        if len(matches) != 1:
            raise RuntimeError(f"Recipe missing or ambiguous: {recipe_id}")
        selected.append(matches[0])

    sources = {}
    for recipe in selected:
        path = Path(recipe["source"]["path"])
        if path.parent != CAPTURE / "screenshots":
            raise RuntimeError("Source is outside assigned capture directory")
        if str(path) not in sources:
            actual = sha256(path)
            if actual != recipe["source"]["sha256"]:
                raise RuntimeError(f"Screenshot hash mismatch: {path.name}")
            capture_entries = [
                item for item in plan["originalScreenshots"] if item["path"] == str(path)
            ]
            if len(capture_entries) != 1 or capture_entries[0]["sha256"] != actual:
                raise RuntimeError("Screenshot is not bound to review plan")
            sources[str(path)] = capture_entries[0]
        if sources[str(path)]["sha256"] != recipe["source"]["sha256"]:
            raise RuntimeError("Inconsistent source binding")

    crop_dir = OUTPUT / "crops"
    crop_dir.mkdir(exist_ok=False)
    materialized = []
    # Decode sources only to extract exact recipe rectangles; never display sources.
    for source_path, source in sources.items():
        with Image.open(source_path) as image:
            dimensions = source["dimensions"]
            if image.size != (dimensions["width"], dimensions["height"]):
                raise RuntimeError("Source dimensions differ from frozen plan")
            for recipe in selected:
                if recipe["source"]["path"] != source_path:
                    continue
                crop = recipe["crop"]
                left, top = crop["left"], crop["top"]
                width, height = crop["width"], crop["height"]
                if not (
                    0 <= left < left + width <= image.width
                    and 0 <= top < top + height <= image.height
                ):
                    raise RuntimeError("Recipe exceeds screenshot bounds")
                target = crop_dir / f"{recipe['id']}.png"
                tile = image.crop((left, top, left + width, top + height))
                tile.save(target, format="PNG")
                materialized.append(
                    {
                        "recipeId": recipe["id"],
                        "source": recipe["source"],
                        "sourceDimensions": dimensions,
                        "crop": crop,
                        "viewport": recipe["viewport"],
                        "locale": recipe["locale"],
                        "surface": recipe["surface"],
                        "path": str(target),
                        "sha256": sha256(target),
                        "dimensions": {"width": width, "height": height},
                        "resized": False,
                        "reencodedWith": "Pillow",
                    }
                )

    if [item["recipeId"] for item in materialized] != IDS:
        raise RuntimeError("Materialization is not the exact assigned batch")
    manifest = {
        "schema": "d927-n87-exact-crop-materialization-v1",
        "batchId": "full-coverage-1",
        "repository": str(ROOT),
        "inputs": inputs,
        "nativeTextContext": {
            "path": str(NATIVE),
            "sha256": sha256(NATIVE),
            "loadedAsTextOnly": True,
        },
        "sourceScreenshotHashesVerifiedBeforeDecode": True,
        "sourceScreenshotsLoadedIntoModel": 0,
        "imagesMaterialized": len(materialized),
        "recipeIds": IDS,
        "crops": materialized,
    }
    write_json(OUTPUT / "materialization.json", manifest)
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
