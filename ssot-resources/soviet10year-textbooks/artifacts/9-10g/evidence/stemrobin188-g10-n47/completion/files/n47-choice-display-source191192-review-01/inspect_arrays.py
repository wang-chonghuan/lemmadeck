import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

CWD = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
if Path.cwd() != CWD:
    raise RuntimeError("Wrong cwd")
ROOT = CWD / ".intentfold/tickets/STEMROBIN-188/tmp/n47-choice-display-source191192-review-01"
TMP = CWD / ".intentfold/tickets/STEMROBIN-188/tmp"


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def write(name, value):
    with (ROOT / name).open("x") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


if sys.argv[1] == "focused185":
    source = TMP / "source185186-author/work/9-10g/pages/0185/page.png"
    expected = "1f74d4e884d4c930ef6d6ded929e27a40d1cac67655ecd7002d883266000ea5e"
    if sha(source) != expected:
        raise RuntimeError("Source185 hash changed")
    box = [260, 1818, 1340, 1930]
    crop = ROOT / "source185-ex85-opening-original-crop.png"
    if crop.exists():
        raise RuntimeError("Refusing overwrite")
    with Image.open(source) as image:
        image.crop(tuple(box)).save(crop)
    result = {"source": {"path": str(source), "sha256": expected},
              "crop": {"path": str(crop), "sha256": sha(crop)},
              "bboxXYXY": box, "purpose": "Exercise85 opening lexical pixels only; no geometric inference"}
    write("source185-ex85-opening-original-crop.json", result)
    print(json.dumps(result, indent=2))
elif sys.argv[1] == "crops":
    manifest_path = TMP / "source191192-185186-affected-review-inputs-01/manifest.json"
    manifest = json.loads(manifest_path.read_text())
    page = next(item for item in manifest["pages"] if item["page"] == 192)
    figure = page["figures"][0]
    source = Path(page["original"]["path"])
    native = Path(figure["crop"]["path"])
    x, y, width, height = figure["exactBox"]
    pad = 12
    with Image.open(source) as image:
        original = np.array(image.crop((x, y, x + width, y + height)))
    with Image.open(native) as image:
        actual = np.array(image)
        mode = image.mode
    expected = np.full((height + 2 * pad, width + 2 * pad, 3), 255, dtype=np.uint8)
    expected[pad:pad + height, pad:pad + width] = original
    shape_equal = actual.shape == expected.shape
    mismatches = int(np.count_nonzero(actual != expected)) if shape_equal else None
    inner = actual[pad:pad + height, pad:pad + width]
    inner_equal = bool(np.array_equal(inner, original))
    exact = TMP / "source191192-author/evidence/crops/0192-fig-g10-48-exact.png"
    with Image.open(exact) as image:
        exact_array = np.array(image)
    formula_meta = json.loads((TMP / "source191192-author/evidence/crops/0191-area-formula.json").read_text())
    formula_source = Path(formula_meta["source"]["path"])
    formula_crop = Path(formula_meta["output"]["path"])
    fx, fy, fw, fh = formula_meta["box_xywh"]
    with Image.open(formula_source) as image:
        formula_original = np.array(image.crop((fx, fy, fx + fw, fy + fh)))
    with Image.open(formula_crop) as image:
        formula_actual = np.array(image)
    focused_meta = json.loads((ROOT / "source185-ex85-opening-original-crop.json").read_text())
    focused_source = Path(focused_meta["source"]["path"])
    focused_crop = Path(focused_meta["crop"]["path"])
    with Image.open(focused_source) as image:
        focused_original = np.array(image.crop(tuple(focused_meta["bboxXYXY"])))
    with Image.open(focused_crop) as image:
        focused_actual = np.array(image)
    result = {
        "method": "PIL exact source bbox and numpy array comparison, text/hash output only",
        "newImagePayloads": 0,
        "nativeFinalizerRerun": False,
        "figure48": {
            "source": {"path": str(source), "sha256": sha(source)},
            "crop": {"path": str(native), "sha256": sha(native)},
            "exactBoxXYWH": figure["exactBox"], "paddingPx": pad, "padding": "white",
            "mode": mode, "actualSize": [actual.shape[1], actual.shape[0]],
            "expectedSize": [width + 2 * pad, height + 2 * pad],
            "shapeEqual": shape_equal, "mismatchedChannelValuesIncludingPadding": mismatches,
            "innerPixelEquality": inner_equal,
            "sourceBoxPixelSha256": hashlib.sha256(original.tobytes()).hexdigest(),
            "nativeInnerPixelSha256": hashlib.sha256(inner.tobytes()).hexdigest(),
            "nativePaddedPixelSha256": hashlib.sha256(actual.tobytes()).hexdigest(),
            "exactUnpaddedCrop": {"path": str(exact), "sha256": sha(exact)},
            "exactUnpaddedArrayEqual": bool(np.array_equal(exact_array, original)),
            "status": "pass" if shape_equal and mismatches == 0 and inner_equal else "blocked",
            "allInkApproval": False
        },
        "source191FormulaDetail": {
            "source": {"path": str(formula_source), "sha256": sha(formula_source)},
            "crop": {"path": str(formula_crop), "sha256": sha(formula_crop)},
            "boxXYWH": formula_meta["box_xywh"],
            "exactPixelEquality": bool(np.array_equal(formula_actual, formula_original)),
            "localGlyphApproval": False
        },
        "source185FocusedDetail": {
            **focused_meta, "exactPixelEquality": bool(np.array_equal(focused_actual, focused_original)),
            "allInkApproval": False
        }
    }
    write("crop-array-evidence.json", result)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if result["figure48"]["status"] != "pass" or not result["source191FormulaDetail"]["exactPixelEquality"] or not result["source185FocusedDetail"]["exactPixelEquality"]:
        raise RuntimeError("Crop array comparison failed")
else:
    raise RuntimeError("Unknown mode")
