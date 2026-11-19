import ast
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == REPO
OWN = Path(__file__).resolve().parent
TMP = OWN.parent
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout


def read(file):
    return json.loads(file.read_text())


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(name, value):
    with (OWN / name).open("x") as output:
        json.dump(value, output, indent=2)
        output.write("\n")


def function_hashes(file):
    return {
        node.name: hashlib.sha256(ast.dump(node, include_attributes=False).encode()).hexdigest()
        for node in ast.parse(file.read_text()).body
        if isinstance(node, ast.FunctionDef)
    }


def masked_source(source, audit):
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
    xs = np.flatnonzero(ink.any(axis=0))
    width = int(xs[-1] - xs[0] + 1)
    for figure in read(audit)["figures"]:
        x, y, w, h = figure["box"]
        ink[max(0, y):y + h, max(0, x):x + w] = False
    return ink, width


start = read(OWN / "started.json")
source = Path(start["sourcePixels"]["path"])
audit = TMP / "d1189-source268-first-author/root/10p/pages/0268/audit.json"
ink, width = masked_source(source, audit)
bands = layout.line_bands(ink, width)
footnote_bands = [band for band in bands if 1830 <= band[0] <= 2040]
first = sys.argv[1:] == ["--first"]
if first:
    counts = ink.sum(axis=1)[1883:2016]
    strong = [
        (1883 + a, 1883 + b)
        for a, b in layout._runs(counts > 0.2 * counts.max())
    ]
    merged = layout._merge_close(strong, max(2, 0.25 * 46))
    retained = [band for band in merged if band[1] - band[0] + 1 >= 0.3 * 46]
    result = {
        "status": "FAIL",
        "source": bind(source),
        "layout": bind(TOOLS / "layout.py"),
        "expectedRows": 19,
        "actualRows": len(bands),
        "expectedFootnoteRows": 3,
        "actualFootnoteRows": len(footnote_bands),
        "bands": bands,
        "footnoteBands": footnote_bands,
        "mergedFootnoteProjection": [1883, 2015],
        "bodyBandHeight": 46,
        "glyphHeight": 39,
        "bodyPitchEstimate": 74,
        "strongRunsBeforeMerge": strong,
        "strongRunsAfterMerge": retained,
        "preservedFailure": "Independent 19-row source undercounted at the small-footnote expansion.",
        "nativeFinalizeCalls": 0,
        "imageOpens": 0,
    }
    save("FIRST-failure.json", result)
    print(json.dumps(result))
    assert len(bands) == 19, (len(bands), footnote_bands)
    raise AssertionError("FIRST was expected to reproduce the existing failed stage")

before = function_hashes(OWN / "layout-before.py")
after = function_hashes(TOOLS / "layout.py")
changed = [name for name in before if before[name] != after[name]]
assert changed == ["line_bands"], changed
assert set(after) - set(before) == {"_small_prose_row_bands"}
assert len(bands) == 19, bands
assert len(footnote_bands) == 3, footnote_bands
actual_prose = layout._small_prose_row_bands(ink, 1883, 2015, 39)
assert actual_prose == footnote_bands
assert actual_prose == [(1882, 1933), (1934, 1986), (1985, 2015)]
assert layout._small_prose_row_bands(ink, 1934, 2015, 39) == actual_prose[1:]
cases = [
    {"name": "source268-three-small-footnote-rows", "expected": 3,
     "actual": len(actual_prose), "bands": actual_prose},
    {"name": "source268-slanted-second-and-short-final-row", "expected": 2,
     "actual": 2, "bands": actual_prose[1:]},
]
proof_file = TMP / "d1192-counter-focused-proof/report.json"
proof = read(proof_file)
assert proof["status"] == "PASS"
masks = {}
for page in (261, 265):
    record = next(item for item in proof["sources"] if item["page"] == page)
    for key in ("source", "audit"):
        assert bind(Path(record[key]["path"])) == record[key]
    masks[page], _ = masked_source(Path(record["source"]["path"]), Path(record["audit"]["path"]))
    for case in proof["sourceDerivedHelperCases"]:
        if case["page"] != page:
            continue
        a, b = case["band"]
        height = case["glyphHeight"]
        actual = bool(layout._single_fraction_row(masks[page], a, b, height))
        assert actual == case["singleFractionExpected"], case
        prose = layout._small_prose_row_bands(masks[page], a, b, height)
        if case["singleFractionExpected"]:
            assert prose == [], (page, a, b, prose)
        cases.append({
            "name": f"source{page}-existing-band-{a}-{b}",
            "singleFractionExpected": case["singleFractionExpected"],
            "singleFractionActual": actual, "smallProseBands": prose,
        })
assert layout._short_fraction_fragments(masks[261], 273, 282, 296, 313, 35) == (244, 313)
cases.append({"name": "source261-parent-short-fraction-fix", "expected": [244, 313],
              "actual": [244, 313]})

for nested in (False, True):
    mask = np.zeros((240, 400), dtype=bool)
    mask[20:50, 190:215] = True
    mask[60:64, 110:310] = True
    for x in (120, 180, 240):
        mask[75:105, x:x + 25] = True
    bottom = 104
    if nested:
        mask[112:116, 175:210] = True
        mask[127:157, 180:205] = True
        bottom = 156
    assert layout._single_fraction_row(mask, 20, bottom, 30)
    prose = layout._small_prose_row_bands(mask, 20, bottom, 39)
    assert prose == [], (nested, prose)
    cases.append({
        "name": "true-nested-fraction" if nested else "true-simple-fraction",
        "singleFractionActual": True, "smallProseExpected": [], "smallProseActual": prose,
    })

for name, add_strokes, expected in [
    ("horizontal-strokes-within-prose-glyphs", True, [(75, 104), (127, 156)]),
    ("aligned-small-prose-without-rules", False, [(75, 104), (127, 156)]),
]:
    mask = np.zeros((200, 400), dtype=bool)
    for row in (75, 127):
        for x in (100, 170, 240):
            mask[row:row + 30, x:x + 25] = True
            if add_strokes:
                mask[row + 12:row + 16, x - 5:x + 30] = True
    prose = layout._small_prose_row_bands(mask, 75, 156, 39)
    assert prose == expected, (name, prose)
    cases.append({"name": name, "expected": expected, "actual": prose})

for numerator in (False, True):
    mask = np.zeros((130, 400), dtype=bool)
    mask[75:105, 100:125] = True
    mask[60:64, 95:130] = True
    if numerator:
        mask[20:50, 100:125] = True
    labels, _ = layout.ndimage.label(mask)
    bounds = layout.ndimage.find_objects(labels)
    actual = layout._fraction_denominator(mask, slice(75, 105), slice(100, 125), bounds, 30)
    assert actual is numerator, (numerator, actual)
    cases.append({"name": "covering-fraction-rule-with-numerator" if numerator
                  else "covering-rule-without-numerator", "expected": numerator, "actual": actual})

for item in start["retained"]:
    assert bind(Path(item["path"])) == item
report = {
    "status": "PASS",
    "layout": bind(TOOLS / "layout.py"),
    "source268": {"source": bind(source), "expectedRows": 19, "actualRows": len(bands),
                  "bands": bands, "expectedFootnoteRows": 3, "actualFootnoteRows": len(footnote_bands),
                  "footnoteBands": footnote_bands},
    "changedExistingFunctions": changed,
    "addedHelper": "_small_prose_row_bands",
    "preservedParentHelpers": {name: after[name] for name in (
        "_short_fraction_fragments", "_single_fraction_row", "_small_prose_continuation",
        "_fraction_denominator")},
    "focusedCases": cases,
    "retainedParentProof": bind(proof_file),
    "nativeFinalizeCalls": 0, "passedNativeReplays": 0,
    "source261265FullCounterCalls": 0, "imageOpens": 0, "sourcePixelEdits": 0,
}
save("focused-tests.json", report)
print(json.dumps({"status": "PASS", "report": bind(OWN / "focused-tests.json"),
                  "focusedCases": len(cases), "source268Rows": len(bands),
                  "footnoteBands": footnote_bands}))
