#!/usr/bin/env python3
"""Materialize only the assigned crops, or freeze this scratch without images."""

import hashlib
import json
import sys
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = ROOT / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
OUT = TICKET / "tmp/d935-n87-first-display-coverage02"
CONTEXT = (
    TICKET
    / "tmp/d900-n87-first-bilingual-native/zh/artifacts/10p/editions"
    / "modern-us-neutral/lessons/phy10-c2-s3-n87"
)
IDS = [f"zh-text-390-coverage-{n}" for n in range(3, 10)] + [
    "zh-exercises-1440-coverage-1"
]
INPUT_HASHES = {
    "offline-report.json": "ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65",
    "crop-recipes.json": "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7",
    "visual-review-plan.json": "4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc",
}


def sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def write_json(name, value):
    with (OUT / name).open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def verify_inputs():
    inputs = []
    for name, expected in INPUT_HASHES.items():
        path = CAPTURE / name
        actual = sha(path)
        assert actual == expected, (path, expected, actual)
        inputs.append({"path": str(path), "sha256": actual})
    return inputs


def materialize():
    from PIL import Image

    assert Path.cwd() == ROOT
    assert Path(__file__).resolve().parent == OUT
    assert not (OUT / "materialization.json").exists(), "No crop replay allowed"
    inputs = verify_inputs()
    plan = json.loads((CAPTURE / "visual-review-plan.json").read_text())
    batch = next(b for b in plan["batches"] if b["id"] == "full-coverage-2")
    assert batch["recipeIds"] == IDS and batch["assignedImages"] == 8
    recipes = json.loads((CAPTURE / "crop-recipes.json").read_text())["recipes"]
    selected = [next(r for r in recipes if r["id"] == rid) for rid in IDS]
    report = json.loads((CAPTURE / "offline-report.json").read_text())
    screenshots = {s["path"]: s for s in report["screenshots"]}
    sources = {}
    for recipe in selected:
        source = recipe["source"]
        path = Path(source["path"])
        assert path.parent == CAPTURE / "screenshots"
        actual = sha(path)
        assert actual == source["sha256"] == screenshots[str(path)]["sha256"]
        sources[str(path)] = {
            "path": str(path),
            "sha256": actual,
            "expectedDimensions": screenshots[str(path)]["dimensions"],
            "verifiedBeforeDecode": True,
            "loadedIntoModel": False,
        }

    # All source hashes are verified before any PNG is decoded for cropping.
    entries = []
    for recipe in selected:
        source_path = recipe["source"]["path"]
        crop = recipe["crop"]
        assert set(crop) == {"left", "top", "width", "height"}
        assert all(isinstance(v, int) and v >= 0 for v in crop.values())
        assert crop["width"] > 0 and crop["height"] > 0
        target = OUT / f"{recipe['id']}.png"
        assert not target.exists(), "Do not replace existing crops"
        with Image.open(source_path) as source:
            expected = sources[source_path]["expectedDimensions"]
            assert source.size == (expected["width"], expected["height"])
            right = crop["left"] + crop["width"]
            bottom = crop["top"] + crop["height"]
            assert right <= source.width and bottom <= source.height
            tile = source.crop((crop["left"], crop["top"], right, bottom))
            tile.save(target, format="PNG")
        entries.append({
            "recipeId": recipe["id"],
            "source": recipe["source"],
            "crop": crop,
            "output": {
                "path": str(target),
                "sha256": sha(target),
                "dimensions": {"width": crop["width"], "height": crop["height"]},
            },
            "pixelOperation": "Exact rectangle extraction; no scaling or enhancement",
        })
    context = [
        {"path": str(CONTEXT / name), "sha256": sha(CONTEXT / name)}
        for name in ("lesson.json", "exercises.json")
    ]
    write_json("materialization.json", {
        "schema": "d935-mechanical-crops-v1",
        "batch": "full-coverage-2",
        "inputs": inputs,
        "sources": list(sources.values()),
        "context": context,
        "actualImages": len(entries),
        "modelImagesLoadedByThisScript": 0,
        "entries": entries,
    })
    print(json.dumps({"actualImages": len(entries), "entries": entries, "context": context}, indent=2))


def freeze():
    assert Path.cwd() == ROOT
    assert not (OUT / "freeze.json").exists(), "Freeze already exists"
    verify_inputs()
    materialization = json.loads((OUT / "materialization.json").read_text())
    for source in materialization["sources"]:
        assert sha(Path(source["path"])) == source["sha256"]
    for context in materialization["context"]:
        assert sha(Path(context["path"])) == context["sha256"]
    for entry in materialization["entries"]:
        assert sha(Path(entry["output"]["path"])) == entry["output"]["sha256"]
    assert sorted(p.name for p in OUT.glob("*.png")) == sorted(f"{rid}.png" for rid in IDS)
    assert (OUT / "report.json").is_file() and (OUT / "usage.json").is_file()
    report = json.loads((OUT / "report.json").read_text())
    usage = json.loads((OUT / "usage.json").read_text())
    verdicts = report["individualVerdicts"]
    assert [v["recipeId"] for v in verdicts] == IDS
    for verdict, entry in zip(verdicts, materialization["entries"], strict=True):
        assert verdict["image"] == entry["output"]["path"]
        assert verdict["sha256"] == entry["output"]["sha256"]
        assert verdict["crop"] == entry["crop"]
        assert verdict["modelLoadCount"] == 1
    assert report["fullDISPLAY"] is False and report["completeCard"] is False
    assert usage["actualImages"] == usage["loadedImages"] == 8
    assert usage["tokenCost"] is None and usage["tokenCostStatus"] == "unknown"
    assert [v["recipeId"] for v in usage["imageLoads"]] == IDS
    assert all(v["count"] == 1 for v in usage["imageLoads"])
    members = sorted(p for p in OUT.iterdir() if p.is_file())
    write_json("freeze.json", {
        "schema": "d935-scratch-freeze-v1",
        "batch": "full-coverage-2",
        "actualImages": 8,
        "completeCard": False,
        "fullDISPLAY": False,
        "imageDecodeDuringFreeze": False,
        "upstreamInputsStillHashMatch": True,
        "members": [
            {"path": str(path), "sha256": sha(path)} for path in members
        ],
        "manifest": str(OUT / "SHA256SUMS"),
        "manifestConvention": "Includes freeze.json and all members, excludes itself",
    })
    members.append(OUT / "freeze.json")
    with (OUT / "SHA256SUMS").open("x", encoding="ascii") as stream:
        for path in sorted(members):
            stream.write(f"{sha(path)}  {path.name}\n")
    for path in OUT.iterdir():
        if path.is_file():
            path.chmod(0o444)
    print(json.dumps({
        "actualImages": 8,
        "frozenFiles": len(members) + 1,
        "reportSHA256": sha(OUT / "report.json"),
        "manifestSHA256": sha(OUT / "SHA256SUMS"),
    }, indent=2))


if __name__ == "__main__":
    assert sys.argv[1:] in (["crop"], ["freeze"])
    {"crop": materialize, "freeze": freeze}[sys.argv[1]]()
