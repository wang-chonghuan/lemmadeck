#!/usr/bin/env python3
"""Single affected-block structure check; no preparation, flow or SCI replay."""

import copy
import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
OWN = Path(__file__).resolve().parents[1]
REPO = OWN.parents[4]
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def load(file):
    return json.loads(file.read_text(encoding="utf-8"))


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def record(file):
    return {"path": str(file), "sha256": digest(file), "bytes": file.stat().st_size}


def write_new(file, value):
    assert file.resolve().is_relative_to(OWN)
    with file.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def pointer_diffs(before, after, pointer=""):
    if type(before) is not type(after):
        return [pointer]
    if isinstance(before, dict):
        if before.keys() != after.keys():
            return [pointer]
        result = []
        for key in before:
            token = key.replace("~", "~0").replace("/", "~1")
            result += pointer_diffs(before[key], after[key], f"{pointer}/{token}")
        return result
    if isinstance(before, list):
        if len(before) != len(after):
            return [pointer]
        return [
            found
            for index, (old, new) in enumerate(zip(before, after))
            for found in pointer_diffs(old, new, f"{pointer}/{index}")
        ]
    return [] if before == after else [pointer]


check_file = OWN / "work/affected-text-check.json"
assert not check_file.exists(), "Affected check once; preserve any failures."
write_new(OWN / "work/affected-text-check.started.json", {
    "status": "started", "invocations": 1,
    "scope": "Affected prose[0] only, plus exact unchanged-structure assertions.",
})
inputs = load(OWN / "work/input-bindings.json")
profile = load(REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
raw = load(OWN / "before/evidence/raw-lesson.json")
substitutions = {
    "zh": ("在所述电路的适用工作范围内，阳极与阴极间的电压增大时",
           "在所述电路的适用工作范围内，该三极管的阳极与阴极间的电压增大时"),
    "en": ("an increase in anode-to-cathode voltage generally increases the anode current",
           "an increase in the triode's anode-to-cathode voltage generally increases the anode current"),
}
errors, diffs, bindings, reports = [], [], {}, {}
try:
    for locale in ["zh", "en"]:
        before_file = OWN / f"before/{locale}/lesson.template.json"
        after_file = OWN / f"work/{locale}/lesson.template.json"
        before, after = load(before_file), load(after_file)
        assert digest(before_file) == inputs["templates"][locale]["lesson"]["before"]["sha256"]
        pointers = pointer_diffs(before, after)
        assert pointers == ["/prose/0/text"], pointers
        old, new = before["prose"][0], after["prose"][0]
        removed, restored = substitutions[locale]
        assert old["text"].count(removed) == 1
        assert new["text"] == old["text"].replace(removed, restored, 1)
        assert raw["prose"][0]["text"] == old["source_text"] == new["source_text"]
        assert "三极管" in new["source_text"]
        assert new["source_refs"] == ["p0154#2"]
        local = edition.validate_identity_fields(raw, after, edition.IDENTITY_FIELDS, f"{locale}.lesson")
        local += edition.validate_identity_fields(
            raw["prose"][0], new,
            ("kind", "id", "label", "printed_page", "source_refs"),
            f"{locale}.prose[0]",
        )
        local += edition.validate_text(
            new["source_text"], new["text"], new["changes"], new["numeric_changes"],
            f"{locale}.prose[0]", profile.get("forbidden_terms", []),
            new["historical_entities"],
        )
        assert before["source"] == after["source"]
        assert before["section_breaks"] == after["section_breaks"]
        assert before["prose"][1:] == after["prose"][1:]
        assert before["prose"][6] == after["prose"][6]
        bindings[locale] = {"lesson": record(after_file)}
        for kind in ["exercises", "figures"]:
            file = OWN / f"work/{locale}/{kind}.template.json"
            expected = inputs["templates"][locale][kind]["before"]["sha256"]
            assert digest(file) == expected
            bindings[locale][kind] = record(file)
        exercises = load(OWN / f"work/{locale}/exercises.template.json")
        assert exercises["count"] == 0 and exercises["exercises"] == []
        figure = load(OWN / f"work/{locale}/figures.template.json")
        assert figure["authoring_status"] == "HOLD-modernfigure-imagebudget24"
        assert figure["promotable"] is False
        diffs.append({
            "locale": locale, "finding": "N58-TEXT-01",
            "pointer": "/prose/0/text", "operation": "replace",
            "beforeTemplate": record(before_file), "afterTemplate": record(after_file),
            "before": old["text"], "after": new["text"],
            "beforeTextSha256": hashlib.sha256(old["text"].encode()).hexdigest(),
            "afterTextSha256": hashlib.sha256(new["text"].encode()).hexdigest(),
            "source_refs": new["source_refs"],
            "exactSubstitution": {"from": removed, "to": restored},
        })
        reports[locale] = {
            "changedPointers": pointers, "sourceSnapshotExact": True,
            "otherSixBlocksExact": True, "sectionBreaksExact": True,
            "physicalQualificationsUnchangedExceptRestoredDeviceIdentity": True,
            "zeroTasksUnchanged": True, "figureHOLDBytesUnchanged": True,
            "errors": local,
        }
        errors += local
    write_new(OWN / "work/json-pointer-diff.json", {
        "status": "exact-two-locale-single-pointer-author-diff",
        "finding": "N58-TEXT-01", "changes": diffs,
        "unchangedFields": "All JSON values other than /prose/0/text in each lesson template; exercise and figure template bytes remain exact.",
    })
    write_new(OWN / "work/change-register-amendment.json", {
        "status": "author-amendment-independent-review-pending",
        "finding": "N58-TEXT-01",
        "baseRegisterUnmodified": inputs["retainedSourceAndEvidence"]["change-register.complete.json"],
        "reason": "Restore the source's explicit vacuum-triode apparatus type in the voltage/anode-current sentence; no other scientific, numeric, formula, physical-scope or source-binding change.",
        "changes": diffs, "numericChanges": [], "formulaChanges": [],
        "originalIndependentSCI": "HOLD", "originalIndependentZHEN": "HOLD",
        "independentAffectedReview": "pending", "imagesOpened": 0, "cumulativeImageCount": 24,
    })
except Exception as error:
    errors.append(f"{type(error).__name__}: {error}")
write_new(check_file, {
    "status": "PASS-affected-text-structure-only" if not errors else "HOLD-affected-text-structure",
    "invocations": 1, "locales": reports, "afterBindings": bindings, "errors": errors,
    "nativeFunctions": ["validate_identity_fields", "validate_text"],
    "affectedTextChecksPerLocale": 1,
    "scope": "Affected prose[0] structure only. No normalize/proseFlow rerun, independent SCI/ZHEN, native prepare/finalize/render/display, or image reads.",
    "imagesOpened": 0, "cumulativeImageCount": 24,
})
print(json.dumps({"status": "pass" if not errors else "hold", "errors": errors}))
raise SystemExit(2 if errors else 0)
