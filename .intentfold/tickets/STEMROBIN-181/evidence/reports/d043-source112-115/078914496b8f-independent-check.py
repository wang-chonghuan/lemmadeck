import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
AUTHOR = TMP / "d042-10p-source112-115-author"
PREPARED = TMP / "d042-source112-115-preparation"
EVIDENCE = TMP / "d042-10p-source112-115-review-evidence"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))

import blocks
import layout
import numpy as np
from PIL import Image

freeze = json.loads((AUTHOR / "complete-freeze.json").read_text())
results = []
for frozen_page in freeze["pages"]:
    page = frozen_page["physicalPage"]
    native = AUTHOR / f"source/10p/pages/{page:04d}"
    meta, parsed = blocks.load(native / "page.md")
    structured = json.loads((native / "page.json").read_text())
    audit = json.loads((native / "audit.json").read_text())
    image = Image.open(PREPARED / f"pages/{page:04d}/page.png")
    ink = layout.ink_mask(image)
    masked = ink.copy()
    for figure in meta["figures"]:
        x, y, width, height = figure["box"]
        masked[y:y + height, x:x + width] = False
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
    counting = meta.get("counting", {})
    bands = layout.line_bands(
        masked,
        content_width,
        edge_margin_px=counting.get("edge_margin_px"),
        top_margin_px=counting.get("top_margin_px"),
    )
    contributions = []
    for index, block in enumerate(parsed, 1):
        contribution = blocks.printed_lines([block])
        contributions.append({
            "block": f"p{page:04d}#{index}",
            "kind": block["kind"],
            "bodyLines": len(block["lines"]),
            "samerow": block["samerow"],
            "printedLineContribution": contribution,
        })
    comparable = [{key: block[key] for key in parsed[index]} for index, block in enumerate(structured["blocks"])]
    crops = []
    for crop in frozen_page["crops"]:
        x, y, width, height = crop["exactPixelRect"]
        expected = np.asarray(image.crop((x, y, x + width, y + height)).convert("RGB"))
        actual = np.asarray(Image.open(crop["path"]).convert("RGB"))
        equal_shape = expected.shape == actual.shape
        crops.append({
            "figureId": crop["id"],
            "path": crop["path"],
            "source": str(PREPARED / f"pages/{page:04d}/page.png"),
            "exactPixelRect": crop["exactPixelRect"],
            "dimensions": [actual.shape[1], actual.shape[0]],
            "sameShape": equal_shape,
            "mismatchedPixelCount": int(np.any(expected != actual, axis=2).sum()) if equal_shape else None,
            "exactSourcePixels": equal_shape and bool(np.array_equal(expected, actual)),
        })
    results.append({
        "physicalPage": page,
        "printedPage": meta["printed_page"],
        "independentlyRecomputedLinesPrinted": len(bands),
        "independentlyParsedLinesMd": blocks.printed_lines(parsed),
        "matchesFrozenCounts": len(bands) == frozen_page["linesPrinted"] == blocks.printed_lines(parsed) == frozen_page["linesMd"],
        "matchesNativeAudit": len(bands) == audit["lines_printed"] == blocks.printed_lines(parsed) == audit["lines_md"],
        "mdJsonMetaEqual": meta == structured["meta"],
        "mdJsonBlocksEqual": parsed == comparable,
        "nativeAuditErrors": audit["errors"],
        "countingOverrides": counting,
        "bands": bands,
        "blockContributions": contributions,
        "crops": crops,
        "countsAreNotSourceApproval": True,
    })
result = {
    "schema": "source-raw-review/independent-native-check@1",
    "command": [sys.executable, "-B", str(Path(__file__).resolve())],
    "method": "Read-only parser and native line-band recomputation on preparation-authority source pixels; frozen exact figure boxes are masked on a counting-only copy. No finalize, resnap, crop output, repair, or promotion.",
    "imagePayloadsEmitted": 0,
    "pages": results,
    "linesPrinted": sum(page["independentlyRecomputedLinesPrinted"] for page in results),
    "linesMd": sum(page["independentlyParsedLinesMd"] for page in results),
    "allChecksPass": all(
        page["matchesFrozenCounts"] and page["matchesNativeAudit"]
        and page["mdJsonMetaEqual"] and page["mdJsonBlocksEqual"]
        and not page["nativeAuditErrors"]
        and all(crop["exactSourcePixels"] for crop in page["crops"])
        for page in results
    ),
}
with (EVIDENCE / "independent-native-check.json").open("x") as output:
    json.dump(result, output, indent=2)
    output.write("\n")
print(json.dumps({
    "allChecksPass": result["allChecksPass"],
    "pages": [{key: page[key] for key in ("physicalPage", "independentlyRecomputedLinesPrinted", "independentlyParsedLinesMd")} for page in results],
    "exactCrops": sum(len(page["crops"]) for page in results),
}))
if not result["allChecksPass"]:
    raise SystemExit(1)
