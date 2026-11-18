import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation

WORKSPACE = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = WORKSPACE / ".intentfold/tickets/STEMROBIN-181/tmp"
OWN = TMP / "d624-source208-first-independent-review"
AUTHOR = TMP / "d612-source208-first-author"
sys.dont_write_bytecode = True
sys.path.insert(0, str(WORKSPACE / ".claude/skills/ld-s10y-lesson/tools"))
from blocks import load as load_blocks, printed_lines


def read_json(file):
    return json.loads(file.read_text(encoding="utf-8"))


def write_json(name, value):
    target = OWN / name
    assert target.parent == OWN
    with target.open("x", encoding="utf-8") as output:
        json.dump(value, output, ensure_ascii=False, indent=2)
        output.write("\n")


def sha256(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def canonical(text):
    return re.sub(r"\s+", "", text.replace("$", "").replace("。", ".").replace("•", ""))


inventory = read_json(OWN / "independent-inventory.json")
assert sha256(OWN / "independent-inventory.json") == "f22bd504c19aa4016b4f6acefa6af37c1b7556e71a1fda0b7de0a1dd25fe4335"
page_path = AUTHOR / "source/10p/pages/0208/page.json"
page = read_json(page_path)
audit = read_json(AUTHOR / "source/10p/pages/0208/audit.json")
md_meta, md_blocks = load_blocks(AUTHOR / "source/10p/pages/0208/page.md")
assert md_meta == page["meta"]
assert len(md_blocks) == len(page["blocks"]) == 7
for md_block, json_block in zip(md_blocks, page["blocks"]):
    assert md_block == {key: value for key, value in json_block.items() if key != "id"}

rows = []
blocks = []
for index, (independent, native) in enumerate(zip(inventory["source208"]["readingOrder"], page["blocks"])):
    assert independent["type"] == native["kind"]
    assert bool(independent.get("continuation", False)) == native["cont"]
    assert bool(independent.get("open", False)) == native["open"]
    assert not native["samerow"]
    expected_rows = independent.get("rows", [])
    assert len(expected_rows) == len(native["lines"])
    for line_index, (expected, actual) in enumerate(zip(expected_rows, native["lines"])):
        assert canonical(expected) == canonical(actual), (index, line_index, expected, actual)
        rows.append({
            "sourceRef": f"p0208#{index + 1}",
            "nativePointer": f"/blocks/{index}/lines/{line_index}",
            "independentPixelRow": expected,
            "nativeLiteral": actual,
            "status": "PASS",
        })
    blocks.append({
        "sourceRef": f"p0208#{index + 1}",
        "nativePointer": f"/blocks/{index}",
        "kind": native["kind"],
        "rows": len(native["lines"]),
        "cont": native["cont"],
        "open": native["open"],
        "samerow": native["samerow"],
        "status": "PASS",
    })

assert len(rows) == printed_lines(md_blocks) == audit["lines_printed"] == audit["lines_md"] == 13
assert not audit["normalizations"] and not audit["unknown_chars"] and not audit["katex_warnings"] and not audit["errors"]
assert page["meta"]["printed_page"] == 198
assert page["meta"]["render"]["sha256"] == inventory["basis"][0]["sha256"]
math = []
for block_index, block in enumerate(page["blocks"]):
    for line_index, line in enumerate(block["lines"]):
        for token in re.findall(r"\$([^$]+)\$", line):
            math.append({
                "tex": token, "sourceRef": f"p0208#{block_index + 1}",
                "nativePointer": f"/blocks/{block_index}/lines/{line_index}", "status": "PASS",
            })
assert [entry["tex"] for entry in math] == inventory["source208"]["math"]["order"] == ["O", "D", "K"]
assert page["blocks"][0]["id"] == "fig-182"
assert re.search(r"图\s+183", page["blocks"][3]["lines"][2])
assert [figure["id"] for figure in page["meta"]["figures"]] == ["fig-182"]

accepted_path = TMP / "d606-source207-first-independent-review/report.json"
assert sha256(accepted_path) == "ffb4dc35e735f8e828b11c48496508a7844de0eda23652632b8cae9def2c001e"
accepted = read_json(accepted_path)
assert accepted["gates"]["SOURCE207"]["status"] == "PASS"
tail = accepted["gates"]["OUTGOING207"]["exact_tail"]
assert tail == "减小光圈的孔，可以使到照相机不"
assert accepted["gates"]["OUTGOING207"]["native_open"]
continuation = page["blocks"][2]
assert continuation["kind"] == "p" and continuation["cont"] and not continuation["open"]
assert continuation["lines"] == ["同距离的点的像都变得足够清晰，即所谓景深增加."]
join = tail + continuation["lines"][0]
assert join == "减小光圈的孔，可以使到照相机不同距离的点的像都变得足够清晰，即所谓景深增加."
assert page["blocks"][3]["kind"] == "p" and not page["blocks"][3]["cont"]
assert page["blocks"][5]["open"]
assert page["blocks"][5]["lines"][-1].endswith("为了得到不透明物")

write_json("text-comparison.json", {
    "schema": "d624-source208-first-independent-review/text-comparison@1",
    "status": "PASS",
    "independentInventorySha256": sha256(OWN / "independent-inventory.json"),
    "nativeParser": ".claude/skills/ld-s10y-lesson/tools/blocks.py:load/printed_lines",
    "nativeParserReadOnly": True,
    "mdJsonLiteralAndMetadataMatch": True,
    "blocks": blocks, "textRows": rows,
    "bodyRows": 11, "captionRows": 1, "footerRows": 1, "totalTextRows": 13,
    "math": math, "displayFormulaRows": 0, "exerciseBlocks": 0, "standaloneHeadingBlocks": 0,
    "permittedRepresentationDifferences": [
        "Profile ASCII period represents printed terminal dots without a semantic punctuation change.",
        "Typesetting spaces and $...$ wrappers around O, D and K.",
        "Two decorative footer dots are source pixel decoration; native footer text is198."
    ],
    "noWordsMathLabelsConditionsOrLineBreaksChanged": True,
    "join207208": {
        "status": "PASS", "scope": "Only accepted207 outgoing text joined to independently read current208 continuation.",
        "accepted207Report": str(accepted_path), "accepted207ReportSha256": sha256(accepted_path),
        "accepted207SourceStatus": "PASS", "existing207OutgoingHoldUnchanged": True,
        "incomingRef": "p0207#7", "incomingPointer": "/blocks/6/lines/5", "incomingTail": tail,
        "incomingOpen": True,
        "continuationRef": "p0208#3", "continuationPointer": "/blocks/2/lines/0",
        "continuationLiteral": continuation["lines"][0], "continuationCont": True,
        "literalScopedJoin": join,
        "boundaryCharacterJoin": "不 + 同 = 不同",
        "transparentInterveningBlocks": ["p0208#1 fig-182", "p0208#2 cap 图182"],
        "nextParagraph": "p0208#4, new projector paragraph; cont=false",
        "figure182Ownership": "Accepted207 photography references and p0208#3 conclusion, not the following projector paragraph.",
        "accepted207CyrillicFigure182Suffixes": accepted["SOURCE207_substantive_review"]["figure182_references"],
        "source207PixelOpens": 0, "source207ReportsRewritten": 0, "assemblyRuns": 0,
        "historicalAuthorPendingNote": "Retained unchanged, superseded for this local join only by the pinned current d606 SOURCE207 PASS."
    },
    "outgoing208": {
        "status": "HOLD", "sourceRef": "p0208#6", "nativePointer": "/blocks/5/lines/1",
        "exactTail": "为了得到不透明物", "open": True,
        "reason": "Incomplete visible sentence; actual next source page is unread.",
        "fullN78": False, "completeCardsAdded": 0
    },
    "figure183": {
        "status": "HOLD", "sourceRef": "p0208#4", "nativePointer": "/blocks/3/lines/2",
        "referencePreserved": True, "presentOnSource208": False, "nextPagePending": True
    },
})

# Decode only the three rasters needed for crop provenance and frozen-SVG fidelity.
with Image.open(AUTHOR / "work/10p/pages/0208/page.png") as image:
    source = np.asarray(image.convert("L"))
with Image.open(AUTHOR / "work/10p/pages/0208/figures/fig-182.png") as image:
    raw = np.asarray(image.convert("L"))
with Image.open(OWN / "raw182-svg-preview.png") as image:
    preview = np.asarray(image.convert("L"))
box = page["blocks"][0]["box"]
x, y, width, height = box
padding = 12
crop = source[y - padding:y + height + padding, x - padding:x + width + padding]
assert source.shape == (2337, 1536)
assert crop.shape == raw.shape == preview.shape == (910, 1117)
exact_differences = int(np.count_nonzero(crop != raw))
assert exact_differences == 0
raw_ink = raw < 128
svg_ink = preview < 128
structure = np.ones((3, 3), dtype=bool)
missing = raw_ink & ~binary_dilation(svg_ink, structure=structure)
extra = svg_ink & ~binary_dilation(raw_ink, structure=structure)
ink_pixels = int(raw_ink.sum())
missing_pixels = int(missing.sum())
extra_pixels = int(extra.sum())
ratio = (missing_pixels + extra_pixels) / ink_pixels
assert ratio < 0.02
panel_results = []
for panel in inventory["raw182"]["panels"]:
    left, right = (0, 560) if panel["column"] == 1 else (560, 1117)
    top, bottom = [(0, 312), (312, 614), (614, 910)][panel["row"] - 1]
    region = np.s_[top:bottom, left:right]
    count = int(raw_ink[region].sum())
    lost = int(missing[region].sum())
    added = int(extra[region].sum())
    panel_ratio = (lost + added) / count
    assert panel_ratio < 0.02
    panel_results.append({
        "id": panel["id"], "boundsXYXY": [left, top, right, bottom],
        "sourceInkPixels": count, "missingBeyond1px": lost, "extraBeyond1px": added,
        "mismatchRatio": panel_ratio, "status": "PASS",
    })

svg_path = AUTHOR / "work/10p/pages/0208/figures/fig-182.svg"
root = ET.parse(svg_path).getroot()
elements = list(root.iter())
ns = "{http://www.w3.org/2000/svg}"
assert root.tag == ns + "svg"
assert root.attrib["viewBox"] == "0 0 1117 910"
assert root.attrib["width"] == "1117" and root.attrib["height"] == "910"
assert len(elements) == 2 and elements[1].tag == ns + "path"
traced_path = elements[1]
assert traced_path.attrib["fill"] == "currentColor"
assert traced_path.attrib["fill-rule"] == "evenodd"
assert not any(element.tag == ns + "image" for element in elements)
assert not any("href" in key for element in elements for key in element.attrib)
subpaths = traced_path.attrib["d"].count("M")
assert subpaths == 126
write_json("pixel-comparison.json", {
    "schema": "d624-source208-first-independent-review/pixel-comparison@1",
    "status": "PASS",
    "rawCrop": {
        "status": "PASS", "sourceDimensionsWH": [1536, 2337], "rawDimensionsWH": [1117, 910],
        "nativeBoxXYWH": box, "paddingPx": padding,
        "actualSourceCropXYXY": [x - padding, y - padding, x + width + padding, y + height + padding],
        "grayscalePixelDifferencesFromOriginal": exact_differences,
        "cropCreatedOrModified": False,
        "semanticBasis": "Original source and full raw visual inventory, sealed before author details."
    },
    "svgFidelity": {
        "status": "PASS", "sourceSvgSha256": sha256(svg_path),
        "isolatedPreview": str(OWN / "raw182-svg-preview.png"),
        "previewSha256": sha256(OWN / "raw182-svg-preview.png"),
        "dimensionsWH": [1117, 910], "threshold": 128, "tolerancePx": 1,
        "sourceInkPixels": ink_pixels, "missingBeyond1px": missing_pixels, "extraBeyond1px": extra_pixels,
        "mismatchRatio": ratio, "mismatchPercent": ratio * 100, "limitPercent": 2,
        "perPanel": panel_results,
        "svgLayout": {
            "viewBox": root.attrib["viewBox"], "width": 1117, "height": 910,
            "elements": 2, "paths": 1, "pathDLength": len(traced_path.attrib["d"]),
            "subpaths": subpaths, "fill": "currentColor", "fillRule": "evenodd",
            "rasterImageElements": 0, "externalReferences": 0
        },
        "samePreviewHashAsFrozenAuthorPreview": sha256(OWN / "raw182-svg-preview.png") == sha256(AUTHOR / "work/10p/pages/0208/figures/fig-182.svg.preview.png"),
        "equalPreviewBytesProveOnlyRenderingReproducibility": True,
        "semanticBasis": "Own complete SVG visual open3 compared with sealed original/raw inventory, not author pass claims."
    },
    "imageAccounting": {
        "visualOpens": 3, "additionalRasterDecoderReads": 3,
        "additionalNativeSvgRenderConservativelyCharged": 1,
        "conservativeBatchTotal": 7, "batchLimit": 8, "contextLimit": 24,
        "source207OrNextPageDecoderReads": 0, "imagesGeneratedByThisCheck": 0
    },
    "nativeFinalizeReruns": 0, "nativeVectorizeReruns": 0,
    "modernFigureReviewed": False, "productDisplayReviewed": False,
})
print(json.dumps({
    "status": "PASS", "blocks": 7, "textRows": 13, "mathSpans": 3,
    "localJoin": "PASS", "cropPixelDifferences": exact_differences,
    "svgMissingBeyond1px": missing_pixels, "svgExtraBeyond1px": extra_pixels,
    "svgMismatchPercent": ratio * 100, "panels": 6,
    "conservativeBatchOpens": 7,
}))
