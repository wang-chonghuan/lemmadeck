"""Read frozen inputs; write reviewer evidence only beside this script."""

import hashlib
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops
from scipy import ndimage

W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
AUTHOR = OUT.parent / "d044-10p-source116-119-author"
FREEZE = AUTHOR / "author-freeze.json"
EXPECTED = "206513d669026a7a730ba867403c93effe61dc3cd71b2b1551d2cc8f29d56c08"


def sha(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def bind(entry):
    actual = sha(entry["path"])
    return {**entry, "actualSha256": actual, "matches": actual == entry["sha256"]}


def xywh(bounds):
    rows, cols = bounds
    return [cols.start, rows.start, cols.stop - cols.start, rows.stop - rows.start]


def edges(rect):
    x, y, width, height = rect
    return (x, y, x + width, y + height)


def padded(box, padding, size):
    x, y, width, height = box
    return [
        max(0, x - padding),
        max(0, y - padding),
        min(size[0], x + width + padding) - max(0, x - padding),
        min(size[1], y + height + padding) - max(0, y - padding),
    ]


def compare(source, target, rect):
    expected = source.crop(edges(rect))
    same_size = expected.size == target.size
    diff = ImageChops.difference(expected.convert("RGB"), target.convert("RGB")) if same_size else None
    pixels = np.asarray(diff) if diff is not None else None
    return {
        "sourceRectXYWH": rect,
        "pillowBoxLTRBExclusive": list(edges(rect)),
        "dimensions": list(target.size),
        "sourceMode": source.mode,
        "cropMode": target.mode,
        "sizeMatches": same_size,
        "modeMatches": source.mode == target.mode,
        "decodedBytesEqual": same_size and source.mode == target.mode and expected.tobytes() == target.tobytes(),
        "differentPixelsRGB": int(np.any(pixels != 0, axis=2).sum()) if pixels is not None else None,
        "maxChannelDifference": int(pixels.max()) if pixels is not None else None,
        "differenceBBox": list(diff.getbbox()) if diff is not None and diff.getbbox() else None,
        "sourceDecodedPixelSha256": hashlib.sha256(expected.tobytes()).hexdigest(),
        "cropDecodedPixelSha256": hashlib.sha256(target.tobytes()).hexdigest(),
    }


def intersecting_components(labels, objects, sizes, rect):
    x, y, width, height = rect
    inside = np.bincount(labels[y:y + height, x:x + width].ravel(), minlength=len(sizes))
    records = []
    for component in np.flatnonzero(inside[1:]) + 1:
        bx, by, bw, bh = xywh(objects[component - 1])
        records.append({
            "sourceBoxXYWH": [bx, by, bw, bh],
            "sourceInkPixels": int(sizes[component]),
            "inkPixelsInsideRect": int(inside[component]),
            "fullyRetained": int(inside[component]) == int(sizes[component]),
        })
    return records


def nearby_nonfigure_bands(ink, all_crops, rect):
    x, y, width, height = rect
    masked = ink.copy()
    for crop in all_crops:
        bx, by, bw, bh = crop["box"]
        masked[by:by + bh, bx:bx + bw] = False
    counts = masked[:, x:x + width].sum(axis=1)
    live = counts > 8
    transitions = np.diff(np.concatenate(([False], live, [False])).astype(int))
    starts = np.flatnonzero(transitions == 1)
    stops = np.flatnonzero(transitions == -1)
    bands = []
    for start, stop in zip(starts, stops):
        if stop - start < 3 or stop <= y - 120 or start >= y + height + 120:
            continue
        xs = np.flatnonzero(masked[start:stop, x:x + width].any(axis=0))
        if xs.size and xs[-1] - xs[0] + 1 >= 14:
            bands.append({
                "sourceBoxXYWH": [x + int(xs[0]), int(start), int(xs[-1] - xs[0] + 1), int(stop - start)],
                "overlapsCropY": int(start) < y + height and int(stop) > y,
                "gapToCropTopPx": y - int(stop) if stop <= y else None,
                "gapFromCropBottomPx": int(start) - (y + height) if start >= y + height else None,
            })
    return {
        "method": "Non-OCR ink row runs within crop x span, after masking all figure boxes; >8 pixels/row, >=3 rows and >=14px width; only within 120px of crop.",
        "semanticTextReviewPerformed": False,
        "bands": bands,
    }


def snap_facts(labels, objects, sizes, coarse, page_size):
    x, y, width, height = coarse
    inside = np.bincount(labels[y:y + height, x:x + width].ravel(), minlength=len(sizes))
    selected = []
    for component in np.flatnonzero(inside[1:]) + 1:
        bx, by, bw, bh = xywh(objects[component - 1])
        if inside[component] >= 0.45 * sizes[component] and bw <= 0.9 * page_size[0] and bh <= 0.9 * page_size[1]:
            selected.append([bx, by, bw, bh])
    left = min(box[0] for box in selected)
    top = min(box[1] for box in selected)
    right = max(box[0] + box[2] for box in selected)
    bottom = max(box[1] + box[3] for box in selected)
    return {
        "originalCoarseBoxXYWH": coarse,
        "independentSelectedComponents": len(selected),
        "independentSnappedBoxXYWH": [left, top, right - left, bottom - top],
        "selectedSourceComponentBoxes": selected,
        "threshold": 128,
        "connectivity": 4,
        "overlapRule": "at least 45% of component ink inside original coarse rectangle",
        "limitation": "Component selection verifies bounds, not semantic completeness; independent final-PNG inspection supplies the inventory.",
    }


def dilate(mask, wrap=False):
    if wrap:
        return np.logical_or.reduce([np.roll(np.roll(mask, dy, axis=0), dx, axis=1) for dy in (-1, 0, 1) for dx in (-1, 0, 1)])
    return ndimage.binary_dilation(mask, structure=np.ones((3, 3), dtype=bool))


def vector_facts(crop, target, page):
    svg = ET.parse(target["path"]).getroot()
    path = OUT / f"p{page:04d}-{crop['id']}-svg-raster-check.png"
    cmd = ["node", str(W / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"), target["path"], str(path)]
    receipt = subprocess.run(cmd, cwd=W / ".claude/skills/ld-s10y-lesson", capture_output=True, text=True)
    assert receipt.returncode == 0, receipt.stderr or receipt.stdout
    render = json.loads(receipt.stdout)
    assert render["ok"]
    with Image.open(crop["path"]) as png, Image.open(path) as raster:
        src = np.asarray(png.convert("L")) < 128
        got = np.asarray(raster.convert("L")) < 128
        assert src.shape == got.shape
        counts = {}
        for name, wrap in (("nativeWrapTolerance", True), ("nonWrappingTolerance", False)):
            missing = int((src & ~dilate(got, wrap)).sum())
            extra = int((got & ~dilate(src, wrap)).sum())
            ratio = (missing + extra) / int(src.sum())
            counts[name] = {
                "missingPixels": missing,
                "extraPixels": extra,
                "sourceInkPixels": int(src.sum()),
                "mismatchRatio": ratio,
                "roundedNativePercent": f"{ratio * 100:.3f}",
                "passesNativeLimit": ratio <= 0.02,
            }
    report_path = AUTHOR / f"commands/vectorize-{page}-initial.json"
    report = load(report_path)
    line = next(line for line in report["stdout"].splitlines() if f"{page:04d}/{crop['id']} " in line)
    quoted_percent = re.search(r"([0-9]+\.[0-9]+)%", line).group(1)
    return {
        "svgBinding": bind(target),
        "svgDimensions": {key: svg.get(key) for key in ("viewBox", "width", "height")},
        "viewBoxMatchesPNG": svg.get("viewBox") == f"0 0 {src.shape[1]} {src.shape[0]}",
        "svgTextElements": len(svg.findall(".//{http://www.w3.org/2000/svg}text")),
        "nativeReport": {"path": str(report_path), "sha256": sha(report_path), "exitCode": report["exitCode"], "quotedLine": line},
        "nativeReportedPercent": quoted_percent,
        "independentRasterComparison": counts,
        "matchesNativeRoundedPercent": counts["nativeWrapTolerance"]["roundedNativePercent"] == quoted_percent,
        "rasterEvidence": {"path": str(path), "sha256": sha(path), "dimensions": [render["w"], render["h"]]},
        "rasterReceipt": {"command": cmd, "exitCode": receipt.returncode, "stdout": receipt.stdout, "stderr": receipt.stderr},
        "visuallyOpened": False,
        "usedAsVisualProof": False,
        "reportLimitation": "Frozen native reports contain command stdout and rounded percentages, not full per-figure JSON; counts above are independently recomputed from the frozen SVG.",
    }


def main():
    assert sha(FREEZE) == EXPECTED, "Author freeze changed"
    freeze = load(FREEZE)
    inventory = [bind(entry) for entry in freeze["inventory"]]
    tools = [bind(entry) for entry in freeze["toolBindings"]]
    assert all(item["matches"] for item in inventory + tools), "Frozen input binding mismatch"
    inventory_paths = {item["path"] for item in inventory}
    media = [item for item in inventory if Path(item["path"]).suffix.lower() in {".png", ".svg"}]
    actual_media = {str(path) for path in AUTHOR.rglob("*") if path.is_file() and path.suffix.lower() in {".png", ".svg"}}
    assert actual_media == {item["path"] for item in media}, "Unbound or missing PNG/SVG"
    evidence = {
        "schema": "independent-raw-rectangle-evidence@1",
        "freeze": {"path": str(FREEZE), "sha256": EXPECTED, "matches": True},
        "coordinateContract": "XYWH integer source pixels; Pillow comparisons use right/bottom-exclusive LTRB; no scaling, cleanup or annotation.",
        "inventoryBindings": inventory,
        "toolBindings": tools,
        "mediaFilesVerified": len(media),
        "unboundMedia": sorted(actual_media - inventory_paths),
        "sourcePdfBinding": bind(freeze["sourcePdf"]),
        "pages": [],
        "visualImageOpensInThisChecker": 0,
        "fullPagesDecodedNumericallyOnly": [116, 117, 118, 119],
    }
    for page in freeze["pages"]:
        number = page["physicalPage"]
        metadata_path = AUTHOR / f"source/10p/pages/{number:04d}/page.json"
        metadata = load(metadata_path)
        audit_path = AUTHOR / f"source/10p/pages/{number:04d}/audit.json"
        audit = load(audit_path)
        source_path = page["crops"][0]["source"]["path"]
        with Image.open(source_path) as source:
            ink = np.asarray(source.convert("L")) < 128
            labels, _ = ndimage.label(ink)
            objects = ndimage.find_objects(labels)
            sizes = np.bincount(labels.ravel())
            result = {
                "physicalPage": number,
                "printedPage": page["printedPage"],
                "pageDimensions": list(source.size),
                "sourceBinding": bind(page["crops"][0]["source"]),
                "metadataBinding": {"path": str(metadata_path), "sha256": sha(metadata_path)},
                "auditBinding": {"path": str(audit_path), "sha256": sha(audit_path)},
                "figureAndCaptionBlocks": [block for block in metadata["blocks"] if block["kind"] in {"fig", "cap"}],
                "cropOverrides": metadata["meta"].get("figure_crops", {}),
                "crops": [],
            }
            for crop in page["crops"]:
                box = crop["box"]
                rect = padded(box, crop["paddingPx"], source.size)
                facts = snap_facts(labels, objects, sizes, crop["from"], source.size)
                assert rect == crop["exactPixelRect"]
                assert facts["independentSnappedBoxXYWH"] == box
                assert facts["independentSelectedComponents"] == crop["components"]
                assert next(item for item in audit["figures"] if item["id"] == crop["id"])["box"] == box
                with Image.open(crop["path"]) as target:
                    comparison = compare(source, target, rect)
                    assert comparison["decodedBytesEqual"]
                    assert list(target.size) == crop["dimensions"]
                    target_ink = np.asarray(target.convert("L")) < 128
                inner = np.zeros_like(target_ink)
                x, y, width, height = box
                inner[y - rect[1]:y - rect[1] + height, x - rect[0]:x - rect[0] + width] = True
                components = intersecting_components(labels, objects, sizes, rect)
                padding_components = [component for component in components if not (
                    component["sourceBoxXYWH"][0] >= x and component["sourceBoxXYWH"][1] >= y
                    and sum(component["sourceBoxXYWH"][::2]) <= x + width
                    and sum(component["sourceBoxXYWH"][1::2]) <= y + height
                )]
                item = {
                    "figureId": crop["id"],
                    "pngBinding": bind({"path": crop["path"], "sha256": crop["sha256"]}),
                    "paddingPx": crop["paddingPx"],
                    "rectangleComparison": comparison,
                    "originalBounds": facts,
                    "paddingInkPixelsBelow128": int((target_ink & ~inner).sum()),
                    "sourceComponentsPartiallyRetained": [component for component in components if not component["fullyRetained"]],
                    "sourceComponentsBeyondSnappedBox": padding_components,
                    "nearbyNonfigureInkBands": nearby_nonfigure_bands(ink, page["crops"], rect),
                    "vectorization": vector_facts(crop, crop["svg"], number),
                }
                if crop["id"] == "fig-78":
                    initial_path = AUTHOR / "initial/0117/figures/fig-78.png"
                    initial_rect = padded(box, 12, source.size)
                    with Image.open(initial_path) as initial, Image.open(crop["path"]) as final:
                        initial_compare = compare(source, initial, initial_rect)
                        inset_compare = compare(initial, final, [12, 12, width, height])
                    initial_components = intersecting_components(labels, objects, sizes, initial_rect)
                    preceding = [component for component in initial_components if component["sourceBoxXYWH"][1] < box[1]]
                    initial_meta = load(AUTHOR / "initial/0117/page.json")
                    repaired_meta = load(AUTHOR / "repair/0117/page.json")
                    item["retainedInitialFailure"] = {
                        "status": "FAIL",
                        "path": str(initial_path),
                        "sha256": sha(initial_path),
                        "initialRectangleComparison": initial_compare,
                        "finalEqualsUnmodifiedInitialInset": inset_compare,
                        "precedingComponentsInterceptedByInitialPadding": preceding,
                        "precedingTextLeakageInkPixelsBelow128": sum(component["inkPixelsInsideRect"] for component in preceding),
                        "metadataAndGeometryRepairChecks": {
                            "allBlocksUnchanged": initial_meta["blocks"] == repaired_meta["blocks"],
                            "metadataUnchangedExceptNotesAndCropOverride": {
                                key: value for key, value in initial_meta["meta"].items() if key not in {"notes", "figure_crops"}
                            } == {
                                key: value for key, value in repaired_meta["meta"].items() if key not in {"notes", "figure_crops"}
                            },
                            "finalMetadataEqualsRetainedRepair": metadata == repaired_meta,
                            "initialCropOverrides": initial_meta["meta"].get("figure_crops", {}),
                            "repairCropOverrides": repaired_meta["meta"].get("figure_crops", {}),
                            "fig79InitialRepairFinalBytesEqual": (
                                sha(AUTHOR / "initial/0117/figures/fig-79.png")
                                == sha(AUTHOR / "repair/0117/figures/fig-79.png")
                                == sha(AUTHOR / "work/10p/pages/0117/figures/fig-79.png")
                            ),
                        },
                        "failureReceipt": bind(next(entry for entry in freeze["inventory"] if entry["path"].endswith("/commands/crop-117-initial-fail.json"))),
                        "repairCount": 1,
                        "secondRepairPerformed": False,
                    }
                result["crops"].append(item)
            evidence["pages"].append(result)
    assert sha(FREEZE) == EXPECTED
    assert all(bind(entry)["matches"] for entry in freeze["inventory"] + freeze["toolBindings"])
    evidence["postCheckAllFrozenBindingsMatch"] = True
    output = OUT / "rectangle-evidence.json"
    output.write_text(json.dumps(evidence, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(output),
        "sha256": sha(output),
        "inventoryFilesVerified": len(inventory),
        "toolBindingsVerified": len(tools),
        "pngSvgFilesVerified": len(media),
        "pages": [{
            "physicalPage": page["physicalPage"],
            "crops": [{
                "figureId": crop["figureId"],
                "equal": crop["rectangleComparison"]["decodedBytesEqual"],
                "dimensions": crop["rectangleComparison"]["dimensions"],
                "paddingInk": crop["paddingInkPixelsBelow128"],
                "partialComponents": crop["sourceComponentsPartiallyRetained"],
                "beyondSnappedBox": crop["sourceComponentsBeyondSnappedBox"],
                "nativePercentMatches": crop["vectorization"]["matchesNativeRoundedPercent"],
                "initialFailure": crop.get("retainedInitialFailure"),
            } for crop in page["crops"]],
        } for page in evidence["pages"]],
    }, indent=2))


if __name__ == "__main__":
    main()
