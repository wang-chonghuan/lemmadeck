"""Deterministic pixel proofs only; never displays an image or makes an approval."""
import hashlib
import json
from pathlib import Path
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
AFFECTED = "phy9-c2-s2-n82"
RESULT = OUT / "result-effective.json"
MANIFEST = OUT / "tiles-effective.json"
ASSIGNED = OUT / "assigned-new82-changed-tiles.json"


def local(value):
    path = Path(value)
    path = path if path.is_absolute() else ROOT / path
    path.resolve().relative_to(ROOT)
    return path


def relative(value):
    return str(local(value).relative_to(ROOT))


def sha(path):
    return hashlib.sha256(local(path).read_bytes()).hexdigest()


def bind(path):
    return {"path": relative(path), "sha256": sha(path)}


def verify(item):
    assert sha(item["path"]) == item["sha256"], f"Changed bytes: {item['path']}"
    return local(item["path"])


def load(item):
    return json.loads(verify(item).read_text())


def surface_key(item):
    viewport = item["viewport"]
    width = viewport["width"] if isinstance(viewport, dict) else viewport
    return (item.get("card", item.get("id")), item["surface"], width)


def tile_key(item):
    return (relative(item["path"]), item["sha256"])


def pixel_info(image):
    image.load()
    return {
        "rawPixelSha256": hashlib.sha256(image.tobytes()).hexdigest(),
        "dimensions": [image.width, image.height],
        "mode": image.mode,
    }


def crop_info(source, crop):
    with Image.open(local(source)) as image:
        assert 0 <= crop[0] < crop[2] <= image.width
        assert 0 <= crop[1] < crop[3] <= image.height
        return pixel_info(image.crop(tuple(crop)))


def write_new(path, value):
    assert path.parent == OUT
    with path.open("x") as stream:
        stream.write(json.dumps(value, indent=2) + "\n")


assert len(sys.argv) == 1, "Usage: python3 crop-affected.py"
assert not MANIFEST.exists() and not ASSIGNED.exists(), "Never overwrite pixel receipts"
result = json.loads(RESULT.read_text())
assert result["status"] == "pass"
assert result["newSurfaceCount"] == 2 and result["reusedSurfaceCount"] == 10
assert len(result["results"]) == 12
raw = load(result["rawResult"])
assert raw["status"] == "pass" and raw["openedSurfaces"] == 2
assert len(raw["results"]) == 2
old_result = load(result["rawHistory"]["result"])
old_manifest = load(result["rawHistory"]["tiles"])
assert len(old_manifest["tiles"]) == 20
assert len(old_manifest["emptySourceDefinedSurfaces"]) == 4
assert old_manifest["exactPixelReuse"] == []
for name in ["nativeRender", "nativeHelper", "renderer", "mainReadiness", "oldRendererAlias"]:
    verify(result[name])
for item in result["helpers"] + result["unchangedBindings"] + result["oldHtmlAliases"]:
    verify(item)
old_reviews = [load(item) for item in result["rawHistory"]["initialReviews"]]
assert [review["status"] for review in old_reviews] == ["fail", "pass", "pass"]
observations = {}
for reference, review in zip(result["rawHistory"]["initialReviews"], old_reviews):
    assert review["batchResult"] == result["rawHistory"]["result"]
    assert review["imagesLoaded"] == len(review["tiles"]) <= 8
    for tile in review["tiles"]:
        assert tile_key(tile) not in observations
        assert tile["actuallyOpened"] is True and tile["openCount"] == 1
        assert tile["observations"].strip()
        observations[tile_key(tile)] = (tile, reference, review["reviewer"])
assert len(observations) == 20
assert sum(tile["status"] == "fail" for tile, _, _ in observations.values()) == 2

# Validate old crops against their bound screenshots, including dimensions and raw bytes.
old_pixels = {}
for tile in old_manifest["tiles"]:
    verify(tile)
    verify({"path": tile["source"], "sha256": tile["sourceSha256"]})
    with Image.open(local(tile["path"])) as image:
        info = pixel_info(image)
    assert crop_info(tile["source"], tile["crop"]) == info, "Old crop does not match source pixels"
    old_pixels[tile_key(tile)] = info

rows = {surface_key(row): row for row in result["results"]}
assert len(rows) == 12
old_rows = {surface_key(row): row for row in old_result["results"]}
new_rows = {}
for key, row in rows.items():
    verify(row["sourceHtml"])
    verify({"path": row["screenshot"], "sha256": row["screenshotSha256"]})
    if row["metrics"].get("scrollEndScreenshot"):
        verify({"path": row["metrics"]["scrollEndScreenshot"],
                "sha256": row["metrics"]["scrollEndScreenshotSha256"]})
    if key[0] == AFFECTED and key[1] == "text":
        assert row in raw["results"]
        new_rows[key] = row
    else:
        assert row == old_rows[key], "Reused machine row changed"
assert set(new_rows) == {(AFFECTED, "text", 1440), (AFFECTED, "text", 390)}

replacement = {}
new_tiles = []
aliases = []
reuse = []
comparisons = []
new_geometry = set()
for key, row in new_rows.items():
    width = key[2]
    states = [("start", row["screenshot"], row["screenshotSha256"])]
    if row["metrics"].get("scrollEndScreenshot"):
        states.append(("end", row["metrics"]["scrollEndScreenshot"],
                       row["metrics"]["scrollEndScreenshotSha256"]))
    seen = {}
    current = []
    for position, source, source_sha in states:
        with Image.open(local(source)) as image:
            image.load()
            assert image.width == width, "Screenshot must be unscaled viewport pixels"
            left, right = (300, 1140) if width == 1440 else (0, 390)
            for index, top in enumerate(range(0, image.height, 1800), 1):
                crop = [left, top, right, min(top + 1800, image.height)]
                pixels = image.crop(tuple(crop))
                info = pixel_info(pixels)
                geometry = (key, tuple(crop))
                new_geometry.add(geometry)
                candidates = [
                    tile for tile in old_manifest["tiles"]
                    if surface_key(tile) == key and tile["crop"] == crop
                ]
                matches = [
                    tile for tile in candidates
                    if old_pixels[tile_key(tile)] == info
                    and observations[tile_key(tile)][0]["status"] == "pass"
                ]
                compare = {
                    "card": AFFECTED, "surface": "text", "viewport": width,
                    "source": relative(source), "sourceSha256": source_sha,
                    "scrollPosition": position, "crop": crop, **info,
                    "oldCandidates": [{
                        **bind(tile["path"]), "source": tile["source"],
                        "sourceSha256": tile["sourceSha256"], "crop": tile["crop"],
                        **old_pixels[tile_key(tile)],
                        "oldReviewStatus": observations[tile_key(tile)][0]["status"],
                        "initialReview": observations[tile_key(tile)][1],
                        "rawPixelsIdentical": old_pixels[tile_key(tile)] == info,
                    } for tile in candidates],
                }
                comparisons.append(compare)
                pixel_key = (tuple(crop), info["mode"], tuple(info["dimensions"]), info["rawPixelSha256"])
                if pixel_key in seen:
                    same = seen[pixel_key]
                    reuse.append({
                        "kind": "same-new-crop-scroll-state", **compare,
                        "samePixelsAs": {"path": same["path"], "sha256": same["sha256"]},
                        "newPixelInspectionRequired": False,
                        "approval": "Requires the canonical tile's actual review; no approval invented",
                    })
                    continue
                if matches:
                    old = matches[0]
                    _, reference, reviewer = observations[tile_key(old)]
                    tile = {
                        **old, **info, "reviewRequired": False,
                        "observationProvenance": {
                            "kind": "exact-old-PASS", "report": reference, "reviewer": reviewer,
                            "observedImage": {"path": old["path"], "sha256": old["sha256"]},
                            "newImageOpened": False,
                        },
                    }
                    alias = {
                        "kind": "exact-old-PASS", **compare,
                        "samePixelsAs": {"path": old["path"], "sha256": old["sha256"]},
                        "initialReview": reference, "oldReviewStatus": "pass",
                        "oldSource": {"path": relative(old["source"]), "sha256": old["sourceSha256"]},
                        "oldCrop": old["crop"], "oldPixelProof": old_pixels[tile_key(old)],
                        "newPixelProof": info, "newPixelInspectionRequired": False,
                        "policy": "Old path remains the actually observed old pixels; alias binds new screenshot crop",
                    }
                    tile["aliases"] = [alias]
                    aliases.append(alias)
                    reuse.append(alias)
                else:
                    target = OUT / f"{AFFECTED}-text-{width}-{position}-tile-{index}.png"
                    assert not target.exists(), f"Never overwrite tile: {target}"
                    # Exclusive creation preserves evidence from other agents.
                    with target.open("xb") as stream:
                        pixels.save(stream, format="PNG")
                    tile = {
                        "card": AFFECTED, "surface": "text", "viewport": width,
                        "scrollPosition": position, **bind(target),
                        "source": str(local(source)), "sourceSha256": source_sha, "crop": crop, **info,
                        "reviewRequired": True, "aliases": [],
                        "reason": "No exact raw-pixel/crop/dimension match to an actual old PASS",
                        "oldCandidates": compare["oldCandidates"],
                    }
                    new_tiles.append(tile)
                seen[pixel_key] = tile
                current.append(tile)
    replacement[key] = current

tiles = []
inserted = set()
for old in old_manifest["tiles"]:
    key = surface_key(old)
    if key in replacement:
        if key not in inserted:
            tiles.extend(replacement[key])
            inserted.add(key)
    else:
        observation, reference, reviewer = observations[tile_key(old)]
        assert observation["status"] == "pass", "Only unchanged old PASS evidence may be reused"
        tiles.append({
            **old, **old_pixels[tile_key(old)], "reviewRequired": False, "aliases": [],
            "observationProvenance": {
                "kind": "unchanged-old-PASS", "report": reference, "reviewer": reviewer,
                "observedImage": {"path": old["path"], "sha256": old["sha256"]},
                "newImageOpened": False,
            },
        })
assert len({tile_key(tile) for tile in tiles}) == len(tiles), "Duplicate effective tile"
assert 0 < len(new_tiles) <= 8, "Fresh changed-only review must be one bounded batch of at most8"
empty = []
for item in old_manifest["emptySourceDefinedSurfaces"]:
    row = rows[surface_key(item)]
    exercises = json.loads((ROOT / (
        "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/"
        f"{item['card']}/exercises.json")).read_text())
    assert exercises["count"] == 0
    assert row == old_rows[surface_key(item)]
    empty.append({
        **item, "sourceDefinedCount": 0, "sourceHtml": row["sourceHtml"],
        "screenshot": {"path": relative(row["screenshot"]), "sha256": row["screenshotSha256"]},
        "oldMachineResult": result["rawHistory"]["result"],
        "policy": "Defined empty surface, reused exact machine evidence; no pixel approval claimed",
    })
nonempty_keys = {surface_key(tile) for tile in tiles}
empty_keys = {surface_key(item) for item in empty}
assert nonempty_keys.isdisjoint(empty_keys)
assert nonempty_keys | empty_keys == set(rows), "Original12-surface coverage"
assert len(empty) == 4
superseded = [{
    **old, "initialReview": observations[tile_key(old)][1],
    "initialStatus": observations[tile_key(old)][0]["status"],
    "reason": "Superseded82 geometry/pixels or failed approval; not effective SCREEN evidence",
} for old in old_manifest["tiles"] if surface_key(old) in replacement
    and tile_key(old) not in {tile_key(tile) for tile in tiles}]
helpers = {item["path"]: item["sha256"] for item in result["helpers"]}
assert helpers[relative(__file__)] == sha(__file__), "Crop helper changed after machine check"
manifest = {
    "ticket": "STEMROBIN-181", "batch": "D021",
    "role": "Affected82 unscaled crops plus exact old PASS reuse; SCREEN approval still pending",
    "status": "pending-fresh-affected-pixel-review",
    "result": bind(RESULT), "rawResult": result["rawResult"],
    "tiles": tiles, "emptySourceDefinedSurfaces": empty,
    "exactPixelReuse": reuse, "aliases": aliases, "pixelComparisons": comparisons,
    "supersededOld82Tiles": superseded,
    "initialReviewBindings": result["rawHistory"]["initialReviews"],
    "rawHistory": result["rawHistory"], "oldHtmlAliases": result["oldHtmlAliases"],
    "oldRendererAlias": result["oldRendererAlias"],
    "nativeRender": result["nativeRender"], "nativeHelper": result["nativeHelper"],
    "helpers": result["helpers"], "imagesOpenedByModel": 0,
    "coverage": {
        "actualSurfaces": 12, "oldMachineSurfaces": 10, "newMachineSurfaces": 2,
        "effectiveTiles": len(tiles), "unchanged83And84Tiles": 13,
        "exactOld82PassTileReuses": len(aliases), "fresh82Tiles": len(new_tiles),
        "definedEmptySurfaces": 4,
    },
}
for item in result["helpers"] + result["unchangedBindings"]:
    verify(item)
write_new(MANIFEST, manifest)
write_new(ASSIGNED, {
    "ticket": "STEMROBIN-181", "batch": "D021", "status": "assigned-not-reviewed",
    "batchResult": bind(RESULT), "tileManifest": bind(MANIFEST),
    "tiles": new_tiles, "imagesAssigned": len(new_tiles),
    "assignment": {
        "freshContext": True, "fork_context": False, "maxImagesPerBatch": 8,
        "eachActualOpenCount": 1, "reopens": 0, "sourceImages": 0, "unchangedImages": 0,
        "scope": "Only these existing changed82 tiles; no new crops, browser, renders, gates or old PASS reopens",
    },
    "requiredReviewFields": [
        "status", "reviewer", "freshContext", "imagesLoaded", "batchResult", "tileManifest",
        "assignmentManifest", "tiles[].actuallyOpened", "tiles[].openCount",
        "tiles[].status", "tiles[].observations",
    ],
    "initialReviewBindings": result["rawHistory"]["initialReviews"],
})
print(json.dumps({
    "manifest": bind(MANIFEST), "assignment": bind(ASSIGNED),
    "coverage": manifest["coverage"],
    "freshTiles": [bind(tile["path"]) for tile in new_tiles],
}))
