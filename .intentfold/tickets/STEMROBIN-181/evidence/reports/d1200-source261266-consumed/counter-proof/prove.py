import hashlib
import json
import subprocess
import sys
import types
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == REPO
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout

OWN = Path(__file__).resolve().parent
TMP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp"
assert not (OWN / "report.json").exists()
baseline = types.ModuleType("layout_baseline")
exec(subprocess.check_output(
    ["git", "show", "HEAD:.claude/skills/ld-s10y-lesson/tools/layout.py"],
    cwd=REPO, text=True,
), baseline.__dict__)


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


sources = []
masks = {}
for page, author, expected in [
    (261, "d1131-source261-first-author", 24),
    (262, "d1135-source262-first-author", 23),
    (263, "d1141-source263-first-author", 22),
    (264, "d1143-source264-first-author", 23),
    (265, "d1159-source265-first-author", 24),
    (266, "d1178-source266-period-repair", 24),
]:
    source = TMP / author / "work/10p/pages" / f"{page:04d}/page.png"
    if not source.exists():
        preparation = (
            "d1115-source261263-first-preparation" if page < 264
            else "d1124-source264266-first-preparation"
        )
        source = TMP / preparation / "work/10p/pages" / f"{page:04d}/page.png"
    audit_file = TMP / author / "root/10p/pages" / f"{page:04d}/audit.json"
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
    cols = np.flatnonzero(ink.any(axis=0))
    width = int(cols[-1] - cols[0] + 1)
    audit = json.loads(audit_file.read_text())
    for figure in audit["figures"]:
        x, y, w, h = figure["box"]
        ink[max(0, y):y + h, max(0, x):x + w] = False
    masks[page] = ink
    old_bands = baseline.line_bands(ink, width)
    new_bands = layout.line_bands(ink, width)
    assert len(new_bands) == expected, (page, expected, new_bands)
    if page not in (261, 265):
        assert new_bands == old_bands, page
    sources.append({
        "page": page, "source": bind(source), "audit": bind(audit_file),
        "independentExpectedRows": expected, "baselineRows": len(old_bands),
        "currentRows": len(new_bands), "baselineBands": old_bands,
        "currentBands": new_bands, "unchangedControl": page not in (261, 265),
    })

helpers = []
for page, a, b, height, expected in [
    (261, 589, 662, 32, True),
    (261, 759, 863, 32, True),
    (261, 969, 1089, 32, True),
    (265, 991, 1114, 41, True),
    (265, 1444, 1534, 41, False),
    (265, 1719, 1803, 40, True),
    (266, 969, 1092, 43, True),
]:
    actual = bool(layout._single_fraction_row(masks[page], a, b, height))
    assert actual is expected, (page, a, actual)
    helpers.append({"page": page, "band": [a, b], "glyphHeight": height,
                    "singleFractionExpected": expected, "actual": actual})

assert layout._short_fraction_fragments(masks[261], 273, 282, 296, 313, 35) == (244, 313)
synthetic = []
short = np.zeros((180, 400), dtype=bool)
short[40:66, 198:207] = True
short[75:79, 170:245] = True
short[92:110, 175:189] = True
short[92:110, 226:244] = True
for name, mask, expected in [
    ("aligned-short-fraction", short, (40, 109)),
    ("no-numerator", short.copy(), None),
    ("separate-lower-glyphs", short.copy(), None),
]:
    if name == "no-numerator":
        mask[40:66] = False
    if name == "separate-lower-glyphs":
        mask[92:110] = np.roll(mask[92:110], 100, axis=1)
    actual = layout._short_fraction_fragments(mask, 75, 78, 92, 109, 35)
    assert actual == expected, (name, actual)
    synthetic.append({"name": name, "expected": expected, "actual": actual})

for rows in (2, 3):
    mask = np.zeros((rows * 70 + 40, 500), dtype=bool)
    for row in range(rows):
        top = 10 + row * 70
        for left in (100, 170, 240, 310):
            mask[top:top + 32, left:left + 25] = True
        mask[top + 14:top + 17, 200:235] = True
    mask[10:10 + (rows - 1) * 70 + 32, 75:78] = True
    actual = layout.line_bands(mask, 260)
    assert len(actual) == rows, (rows, actual)
    assert not layout._single_fraction_row(mask, 10, 10 + (rows - 1) * 70 + 31, 32)
    synthetic.append({"name": f"brace-connected-{rows}-equation-rows",
                      "expected": rows, "actual": len(actual), "bands": actual})

report = {
    "ticket": "STEMROBIN-181", "batch": "D037", "status": "PASS",
    "layout": bind(TOOLS / "layout.py"), "sources": sources,
    "sourceDerivedHelperCases": helpers, "constructedPositiveNegativeCases": synthetic,
    "expectationsBasis": "Frozen independent SOURCE row inventories and explicit constructed geometry.",
    "nativeFinalizeCalls": 0, "passedNativeReplays": 0,
    "sourceConsumption": False, "sourcePixelEdits": 0,
    "parentImageOpens": 0, "paidCalls": 0,
}
(OWN / "report.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"report": bind(OWN / "report.json"), "status": "PASS",
                  "sources": [{"page": item["page"], "rows": item["currentRows"]}
                              for item in sources]}))
