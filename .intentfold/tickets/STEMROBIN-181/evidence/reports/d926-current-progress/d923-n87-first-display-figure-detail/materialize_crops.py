import hashlib
import json
from pathlib import Path

from PIL import Image, __version__ as pillow_version


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
OUTPUT = TICKET / "tmp/d923-n87-first-display-figure-detail"
IDS = [
    "zh-text-1440-fig-201",
    "zh-text-1440-fig-202",
    "zh-text-390-fig-201",
    "zh-text-390-fig-202",
    "en-text-1440-fig-201",
    "en-text-1440-fig-202",
    "en-text-390-fig-201",
    "en-text-390-fig-202",
]
EXPECTED_INPUTS = {
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
}


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    assert Path.cwd() == ROOT
    assert Path(__file__).resolve().parent == OUTPUT
    inputs = {}
    documents = {}
    for name, expected in EXPECTED_INPUTS.items():
        path = CAPTURE / name
        actual = sha256(path)
        assert actual == expected, f"Input SHA mismatch: {name}"
        inputs[name] = {"path": str(path), "sha256": actual}
        documents[name] = json.loads(path.read_text())

    plan = documents["visual-review-plan.json"]
    batch = next(item for item in plan["batches"] if item["id"] == "figure-detail-1")
    assert batch["recipeIds"] == IDS
    assert batch["maximumImages"] == 8
    recipes = documents["crop-recipes.json"]["recipes"]
    assert len(recipes) == 85
    selected = [next(item for item in recipes if item["id"] == rid) for rid in IDS]
    paths = [OUTPUT / f"{rid}.png" for rid in IDS]
    manifest_path = OUTPUT / "materialization.json"
    assert not any(path.exists() for path in paths + [manifest_path])

    # Verify every source before any screenshot is decoded.
    sources = {}
    for recipe in selected:
        source = recipe["source"]
        path = Path(source["path"])
        assert path.resolve().parent == CAPTURE / "screenshots"
        if str(path) not in sources:
            actual = sha256(path)
            assert actual == source["sha256"], f"Screenshot SHA mismatch: {path}"
            sources[str(path)] = {"path": str(path), "sha256": actual}
        assert sources[str(path)]["sha256"] == source["sha256"]

    outputs = {}
    for source_path, source_record in sources.items():
        with Image.open(source_path) as screenshot:
            source_record["dimensions"] = {
                "width": screenshot.width,
                "height": screenshot.height,
            }
            planned = next(item for item in plan["originalScreenshots"] if item["path"] == source_path)
            assert source_record["dimensions"] == planned["dimensions"]
            for recipe in selected:
                if recipe["source"]["path"] != source_path:
                    continue
                rect = recipe["crop"]
                left, top = rect["left"], rect["top"]
                width, height = rect["width"], rect["height"]
                assert all(type(value) is int for value in [left, top, width, height])
                assert 0 <= left < left + width <= screenshot.width
                assert 0 <= top < top + height <= screenshot.height
                path = OUTPUT / f"{recipe['id']}.png"
                with screenshot.crop((left, top, left + width, top + height)) as crop:
                    assert crop.size == (width, height)
                    with path.open("xb") as stream:
                        crop.save(stream, format="PNG")
                outputs[recipe["id"]] = {
                    "id": recipe["id"],
                    "locale": recipe["locale"],
                    "surface": recipe["surface"],
                    "viewport": recipe["viewport"],
                    "source": recipe["source"],
                    "crop": rect,
                    "path": str(path),
                    "sha256": sha256(path),
                    "dimensions": {"width": width, "height": height},
                    "materializations": 1,
                    "resized": False,
                    "loadedIntoModelByScript": False,
                }

    native = []
    for locale in ["zh", "en"]:
        base = TICKET / f"tmp/d900-n87-first-bilingual-native/{locale}/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87"
        for name in ["lesson.json", "figures.json"]:
            path = base / name
            native.append({"locale": locale, "path": str(path), "sha256": sha256(path)})
    manifest = {
        "schema": "d923-figure-detail-materialization-v1",
        "batchId": "figure-detail-1",
        "status": "EXACT-RECORDED-CROPS-MATERIALIZED-NOT-VISUAL-APPROVAL",
        "inputs": inputs,
        "nativeTextContext": native,
        "sources": list(sources.values()),
        "sourcesHashVerifiedBeforeDecoding": True,
        "sourceScreenshotsDecodedMechanically": len(sources),
        "sourceScreenshotsLoadedIntoModel": 0,
        "cropsMaterialized": len(outputs),
        "cropsLoadedIntoModelByScript": 0,
        "cropScale": "1:1 recorded PNG CSS pixels; no resize",
        "pillowVersion": pillow_version,
        "script": {"path": str(Path(__file__).resolve()), "sha256": sha256(Path(__file__))},
        "crops": [outputs[rid] for rid in IDS],
    }
    with manifest_path.open("x") as stream:
        json.dump(manifest, stream, indent=2)
        stream.write("\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
