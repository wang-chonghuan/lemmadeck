import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == W
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

E = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d083-n126-affected-author"
O = W / ".tmp/STEMROBIN-181/d1816-d083"
B = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author"
base = edition.load(B / "author-freeze.json")
prepared = edition.load(E / "prepared-layout-repaired.json")
old = edition.load(Path(base["editions"][1]["templates"][0]["path"]))
new = edition.load(Path(prepared["newENTemplate"]["path"]))
assert new["source"] == old["source"]
assert new["section_breaks"] == old["section_breaks"]
assert len(new["prose"]) == len(old["prose"]) == 15
assert new["prose"][11]["source_text"] == old["prose"][11]["source_text"]
assert new["prose"][11]["source_refs"] == old["prose"][11]["source_refs"]
for index, (before, after) in enumerate(zip(old["prose"], new["prose"])):
    assert edition.math_signature(before["text"]) == edition.math_signature(after["text"])
    if index != 11:
        assert before == after
    else:
        assert {key: value for key, value in before.items() if key != "text"} == {
            key: value for key, value in after.items() if key != "text"}
profile = edition.load(W / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
raw = new["prose"][11]["source_text"]
block = new["prose"][11]
errors = edition.validate_text(
    raw, block["text"], block["changes"], block["numeric_changes"],
    "en.prose[11]", profile["forbidden_terms"] + profile["forbidden_person_names"],
    block["historical_entities"])
errors += mathcheck.check_delimiters(block["text"])
text_errors = list(errors)
assert "$\\vec{B}'$" in block["text"]
assert "$\\vec{B}\\u0027$" not in block["text"]
old_flow = edition.load(B / "en-prose-flow.json")
new_flow = edition.load(E / "native/en-prose-flow/stdout.txt")
assert old_flow["resolvedBreaks"] == new_flow["resolvedBreaks"] == [5, 11]
assert old_flow["boundaries"] == new_flow["boundaries"]
assert len(old_flow["paragraphs"]) == len(new_flow["paragraphs"]) == 15
changed_flow = []
for index, (before, after) in enumerate(zip(old_flow["paragraphs"], new_flow["paragraphs"])):
    if before != after:
        changed_flow.append(index)
        assert before["blockIndex"] == after["blockIndex"] == 11
        assert {key: value for key, value in before.items() if key != "text"} == {
            key: value for key, value in after.items() if key != "text"}
assert changed_flow == [12]
figure_reports = []
for candidate in prepared["specs"]:
    spec_path = Path(candidate["after"]["path"])
    folder = spec_path.parent
    spec, spec_errors = edition.validate_figure_spec(spec_path, "fig-286", require_review=False)
    errors += spec_errors
    report = edition.load(folder / "fig-286.render.json")
    assert report["status"] == "pass"
    assert report["spec"]["sha256"] == edition.sha256(spec_path)
    assert report["output"]["svg"]["sha256"] == edition.sha256(folder / "fig-286.svg")
    assert report["renderer"]["name"] == "JSXGraph"
    assert report["theme"]["output"] == "css-variables"
    assert report["collisions"] == []
    assert all(row["status"] == "pass" for row in report["displayChecks"])
    assert not (folder / "fig-286.review.json").exists()
    figure_reports.append({
        "edition": candidate["edition"], "spec": str(spec_path), "errors": spec_errors,
        "require_review": False, "renderStatus": report["status"],
        "objects": len(spec["objects"]), "assertions": len(spec["assertions"]),
        "inventoryGroups": len(spec["source"]["inventory"]),
        "labels": report["labels"], "displayChecks": report["displayChecks"],
        "independentApproval": False,
    })
result = {
    "schema": "STEMROBIN-181/affected-native-author-validation@1",
    "batch": "D083", "role": "AFFECTED_ONLY_FIRST_REPAIR_AUTHOR",
    "status": "pass" if not errors else "fail", "errors": errors,
    "textScope": "Only changed EN prose/11/text; unchanged KaTeX/math, ZH and other EN stages reused.",
    "nativeChangedENParagraphErrors": text_errors, "sourceTextSourceRefsExact": True,
    "allMathTokensExact": True, "mathTokensEach": 21,
    "changedFlowParagraphIndices": changed_flow,
    "sectionBreakAnchorsChanged": 0,
    "sectionBreaks": [5, 11], "figureReports": figure_reports,
    "semanticsSettledByValidation": False, "independentAffectedReviewPending": True,
    "adaptFinalizeCalls": 0, "nativeReviewCalls": 0,
}
output = E / "native-affected-validation.json"
assert not output.exists()
edition.dump(output, result)
print(json.dumps(result, ensure_ascii=True))
sys.exit(0 if result["status"] == "pass" else 2)
