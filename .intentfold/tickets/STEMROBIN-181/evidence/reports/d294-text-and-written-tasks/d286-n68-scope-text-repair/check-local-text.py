import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition as E


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


binding = read(OUT / "source-binding.json")
profile = read(ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
rows = []
errors = []
for language in ("zh", "en"):
    original_path = next(
        item["original"]["path"]
        for item in binding["templates"]
        if item["language"] == language and item["name"] == "lesson"
    )
    original = read(original_path)
    candidate = read(OUT / "frozen/n68" / language / "lesson.template.json")
    for target in binding["targets"]:
        index = target["index"]
        before = original["prose"][index]
        after = candidate["prose"][index]
        label = f"{language}{target['pointer']}"
        checks = E.validate_text(
            before["source_text"], after["text"], after["changes"],
            after["numeric_changes"], label, forbidden,
            after["historical_entities"], [], after.get("notation_changes"),
        )
        formula_match = (
            E.math_signature(before["source_text"])
            == E.math_signature(before["text"])
            == E.math_signature(after["text"])
        )
        number_match = (
            E.prose_number_signature(before["source_text"])
            == E.prose_number_signature(before["text"])
            == E.prose_number_signature(after["text"])
        )
        if not formula_match:
            checks.append(f"{label}: source/before/after formula signature mismatch")
        if not number_match:
            checks.append(f"{label}: source/before/after number/reference signature mismatch")
        for key in before:
            if key != "text" and before[key] != after.get(key):
                checks.append(f"{label}: non-text field {key} changed")
        if set(before) != set(after):
            checks.append(f"{label}: object keys changed")
        if after["text"] == before["text"]:
            checks.append(f"{label}: authorized target not changed")
        rows.append({
            "finding": target["id"], "language": language, "pointer": target["pointer"],
            "formulaSignature": E.math_signature(after["text"]),
            "formulaSignatureUnchanged": formula_match,
            "numericAndReferenceSignatureUnchanged": number_match,
            "nonTextSourceFieldsUnchanged": not any("non-text field" in item for item in checks),
            "errors": checks,
        })
        errors.extend(checks)
print(json.dumps({
    "schema": "bounded-n68-scope-repair-four-unit-native-text-check@1",
    "scope": "Only four authorized language text units; no passed full-text semantic re-review.",
    "mechanicalStatus": "MATCH" if not errors else "FAIL",
    "targets": rows, "errors": errors,
    "nativeHelper": "edition.validate_text / math_signature / prose_number_signature",
    "newImages": 0, "cumulativeImages": 24,
    "SCI": "AFFECTED-INDEPENDENT-REVIEW-PENDING",
    "independentPASS": False, "wholeCardPASS": False,
}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
