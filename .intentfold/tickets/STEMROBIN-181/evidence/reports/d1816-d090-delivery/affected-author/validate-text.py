import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

OUT = REPO / ".tmp/STEMROBIN-181/d1816-d092"
EVIDENCE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d092-n128-affected-author"
RAW_ROOT = REPO / ".tmp/STEMROBIN-181/d1816-d079/root/9p"
RAW_PATH = RAW_ROOT / "lessons/phy9-c2-s6-n128/lesson.json"
RAW = edition.load(RAW_PATH)
CHANGED = [8, 9, 10, 12]
PROFILE = edition.load(REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
FORBIDDEN = PROFILE["forbidden_terms"] + PROFILE["forbidden_person_names"]
errors = []
locales = []


def binding(file):
    data = file.read_bytes()
    return {"path": str(file), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


for name, locale in [("modern-us-neutral", "zh"), ("modern-us-neutral-en", "en")]:
    before_path = OUT / f"before/{name}/lesson.template.json"
    after_path = OUT / f"work/adapt/9p/{name}/lessons/phy9-c2-s6-n128/lesson.template.json"
    old = edition.load(before_path)
    new = edition.load(after_path)
    assert new["source"] == old["source"]
    assert new["source"]["data"] == RAW
    assert new["section_breaks"] == old["section_breaks"]
    assert new["errata"] == old["errata"] == []
    assert len(new["prose"]) == len(old["prose"]) == len(RAW["prose"]) == 22
    source_errors = edition.validate_source(RAW_ROOT, new["source"], RAW_PATH, "lesson")
    baseline_identity_errors = edition.validate_lesson_identity(RAW, old)
    current_identity_errors = edition.validate_lesson_identity(RAW, new)
    assert baseline_identity_errors == current_identity_errors
    errors += source_errors
    checks = []
    math_tokens = 0
    for index, (raw, before, after) in enumerate(zip(RAW["prose"], old["prose"], new["prose"])):
        assert after["source_text"] == before["source_text"] == raw["text"]
        assert after["source_refs"] == before["source_refs"] == raw["source_refs"]
        assert {key: value for key, value in before.items() if key != "text"} == {
            key: value for key, value in after.items() if key != "text"}
        assert edition.math_signature(after["text"]) == edition.math_signature(before["text"])
        assert edition.math_signature(after["text"]) == edition.math_signature(raw["text"])
        exact_tokens = [match.group(0) for match in edition.MATH.finditer(before["text"])]
        assert exact_tokens == [match.group(0) for match in edition.MATH.finditer(after["text"])]
        assert edition.prose_number_signature(before["text"]) == edition.prose_number_signature(after["text"])
        math_tokens += len(exact_tokens)
        block_errors = []
        if index in CHANGED:
            assert before["text"] != after["text"]
            block_errors += edition.validate_text(
                raw["text"], after["text"], after["changes"], after["numeric_changes"],
                f"{locale}.prose[{index}]", FORBIDDEN, after["historical_entities"],
                notation_changes=after.get("notation_changes"))
            block_errors += mathcheck.check_delimiters(after["text"])
            errors += block_errors
        else:
            assert before == after
        checks.append({"index": index, "sourceRefs": after["source_refs"],
                       "changed": index in CHANGED, "mathTokens": len(exact_tokens),
                       "exactSourceAndMathTokens": True, "nativeTextErrors": block_errors})

    flow_path = EVIDENCE / f"native/prose-flow-{locale}/stdout.txt"
    flow = edition.load(flow_path)
    review_path = REPO / (
        ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review/report.json")
    reviewed_locale = next(row for row in edition.load(review_path)[
        "independentChecks"]["localeChecks"] if row["edition"] == name)
    assert reviewed_locale["lesson"]["sha256"] == edition.sha256(before_path)
    assert len(flow["paragraphs"]) == 29
    assert flow["resolvedBreaks"] == [4, 16, 27]
    assert reviewed_locale["paragraphs"] == 28
    assert [row["index"] for row in reviewed_locale["sectionBreaks"]] == [4, 15, 26]
    assert [{key: value for key, value in row.items() if key != "index"}
            for row in flow["boundaries"]] == [
                {key: value for key, value in row.items() if key != "index"}
                for row in reviewed_locale["sectionBreaks"]]
    formula_paragraphs = [row for row in flow["paragraphs"] if row["text"].startswith("$")]
    assert len(formula_paragraphs) == 8
    assert next(row["text"] for row in formula_paragraphs if row["blockIndex"] == 9) == old["prose"][9]["text"]
    if locale == "en":
        assert not edition.NON_ENGLISH_FIGURE_SCRIPT.search(" ".join(
            new["prose"][index]["text"] for index in CHANGED))
    locales.append({
        "edition": name, "locale": locale, "template": binding(after_path),
        "nativeSourceErrors": source_errors, "changedBlocksNativeChecked": CHANGED,
        "unchangedOutOfScopeIdentityDiagnostics": current_identity_errors,
        "identityDiagnosticDisposition": "Present identically in D079; no title repair or whole-lesson identity approval.",
        "blockChecks": checks, "sourceProseBlocks": 22,
        "mathTokens": math_tokens, "exactTokenOrderPreserved": True,
        "proseFlowReceipt": binding(flow_path), "finalParagraphs": 29,
        "unchangedBaselineReusedFromHashBoundReview": binding(review_path),
        "affectedParagraphs": [row for row in flow["paragraphs"] if row["blockIndex"] in CHANGED],
        "separateFormulaParagraphs": 8, "sectionBreaks": 3,
        "oldSectionBreakIndices": [4, 15, 26], "sectionBreakIndices": [4, 16, 27],
        "sectionBreakAnchorsChanged": 0, "unaffectedParagraphContentUnchanged": True,
    })

context_checks = []
for figure_id in ["fig-290", "fig-291"]:
    before = edition.load(OUT / f"before/modern/{figure_id}.spec.json")
    spec_path = OUT / f"modern/{figure_id}.spec.json"
    spec = edition.load(spec_path)
    old_source = dict(before["source"])
    new_source = dict(spec["source"])
    old_source.pop("authoritativeText")
    new_source.pop("authoritativeText")
    assert old_source == new_source
    assert {key: value for key, value in before.items() if key != "source"} == {
        key: value for key, value in spec.items() if key != "source"}
    for item in spec["source"]["authoritativeText"]:
        target = OUT / f"work/adapt/9p/{item['edition']}/lessons/phy9-c2-s6-n128/lesson.template.json"
        lesson = edition.load(target)
        assert item["lesson"] == lesson["id"]
        assert item["text"] == "\n\n".join(block["text"] for block in lesson["prose"] if block["text"])
    render = edition.load(OUT / f"modern/{figure_id}.render.json")
    old_render = edition.load(OUT / f"before/modern/{figure_id}.render.json")
    assert {key: value for key, value in render.items() if key != "spec"} == {
        key: value for key, value in old_render.items() if key != "spec"}
    assert render["spec"]["sha256"] == edition.sha256(spec_path)
    assert render["output"]["svg"]["sha256"] == edition.sha256(REPO / render["output"]["svg"]["path"])
    context_checks.append({"figure": figure_id, "spec": binding(spec_path),
                           "authoritativeBilingualContextExact": True,
                           "geometryLabelsRelationshipsUnchanged": True,
                           "nativeReportReboundOnly": True, "newRender": False,
                           "newApproval": False, "unchangedSVG": render["output"]["svg"]})

result = {
    "schema": "STEMROBIN-181/affected-native-author-text-validation@1",
    "batch": "D092", "role": "AFFECTED_AUTHOR_ONLY",
    "status": "pass" if not errors else "fail", "errors": errors,
    "verdictScope": "Changed text, native source snapshot and exact math/reference tokens only. Not adapt-finalize or whole-lesson acceptance.",
    "nativeFunctions": ["edition.validate_source", "edition.validate_lesson_identity",
                        "edition.validate_text", "edition.math_signature",
                        "edition.prose_number_signature", "mathcheck.check_delimiters",
                        "prose_flow.mjs"],
    "sourceLesson": binding(RAW_PATH), "locales": locales,
    "changedTextBlocksNativeChecked": 8, "sourceMathIntegrityBlocks": 44,
    "figureContextChecks": context_checks, "independentAffectedReviewPending": True,
    "scientificOrVisualApprovalByAuthor": False, "adaptFinalizeCalls": 0,
    "nativeRecordReviewCalls": 0, "geometryReviewCalls": 0, "imageOpens": 0,
}
target = EVIDENCE / "native-text-validation-affected-only.json"
assert not target.exists()
edition.dump(target, result)
print(json.dumps({"status": result["status"], "errors": errors,
                  "changedTextBlocks": 8, "sourceMathIntegrityBlocks": 44,
                  "locales": [{"locale": row["locale"], "mathTokens": row["mathTokens"],
                               "paragraphs": row["finalParagraphs"],
                               "formulaParagraphs": row["separateFormulaParagraphs"],
                               "sectionBreakIndices": row["sectionBreakIndices"]}
                              for row in locales],
                  "imageOpens": 0, "independentAffectedReviewPending": True}))
sys.exit(0 if not errors else 2)
