"""One changes-only correction, inheriting the single full author check."""

import copy
import json
from pathlib import Path
import sys

ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n74"
HISTORY = TMP / "9p-n74-before-author-correction"
TARGET = TMP / "9p-n74-prose-freeze.json"
AFFECTED = (5, 8, 13, 17)


def bind(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


initial = edition.load(HISTORY / "9p-n74-prose-freeze.json")
assert edition.sha256(TARGET) == edition.sha256(HISTORY / "9p-n74-prose-freeze.json")
assert initial["status"] == "author-structural-blocked"
assert initial["nativeAuthorCheck"]["errors"] == [
    f"lesson.prose[{index}] 未改写但 changes 非空" for index in AFFECTED
]
old = edition.load(HISTORY / "lesson.template.json")
assert edition.sha256(HISTORY / "lesson.template.json") == initial["bindings"]["lessonTemplate"]["sha256"]
current = edition.load(WORK / "lesson.template.json")
expected = copy.deepcopy(old)
for index in AFFECTED:
    assert old["prose"][index]["changes"] == ["layout"]
    assert old["prose"][index]["text"] == old["prose"][index]["source_text"]
    expected["prose"][index]["changes"] = []
assert current == expected, "Only the four declared changes arrays may differ"
for name, item in initial["bindings"].items():
    if name != "lessonTemplate":
        assert edition.sha256(ROOT / item["path"]) == item["sha256"], name
for item in initial["sourcePages"]:
    assert edition.sha256(ROOT / item["path"]) == item["sha256"]

profile = edition.load(ROOT / initial["bindings"]["profile"]["path"])
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
errors = []
for index in AFFECTED:
    block = current["prose"][index]
    errors += edition.validate_text(
        block["source_text"], block["text"], block["changes"], block["numeric_changes"],
        f"lesson.prose[{index}]", forbidden, block["historical_entities"],
    )
assert not errors, errors

final = copy.deepcopy(initial)
final["status"] = "author-frozen-awaiting-independent-science"
final["bindings"]["lessonTemplate"] = bind(WORK / "lesson.template.json")
final["bindings"]["affectedCorrectionHelper"] = bind(Path(__file__).resolve())
final["preservedInitialFailure"] = {
    "report": bind(HISTORY / "9p-n74-prose-freeze.json"),
    "template": bind(HISTORY / "lesson.template.json"),
}
final["nativeAuthorCheck"] = {
    "invocations": 1,
    "status": "pass-after-one-affected-author-correction",
    "initialStatus": "fail",
    "initialErrors": initial["nativeAuthorCheck"]["errors"],
    "errors": [],
    "scope": "Initial full author structure inherited; only four unchanged-text changes arrays rechecked.",
    "normalizedLayoutStable": True,
    "zeroTaskAndZeroFigureTemplatesUnwritten": True,
}
final["affectedCorrectionsUsed"] = 1
final["affectedAuthorCorrection"] = {
    "invocations": 1,
    "status": "pass",
    "pointers": [f"/prose/{index}/changes" for index in AFFECTED],
    "before": ["layout"],
    "after": [],
    "allOtherTemplateFieldsExact": True,
    "textMathSourceRefsIdentityAndAnchorsUnchanged": True,
    "allOtherFrozenBindingsUnchanged": True,
    "fullAuthorCheckRepeated": False,
    "independentScienceReviewPerformed": False,
}
edition.dump(TARGET, final)
print(json.dumps({
    "freeze": bind(TARGET),
    "template": final["bindings"]["lessonTemplate"],
    "status": final["status"],
    "sourceBlocks": final["sourceBlocks"],
    "modernParagraphs": final["modernParagraphs"],
    "sectionBreaks": len(final["sectionBreaks"]),
    "affectedCorrectionsUsed": 1,
    "preservedInitialFailure": final["preservedInitialFailure"],
    "inFlightProcesses": [],
}, ensure_ascii=False, indent=2))
