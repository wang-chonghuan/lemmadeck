import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
own = Path(__file__).resolve().parent
repo = own.parents[4]
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition

assert sys.argv[1:] == ["--execute"]
prepared = own / "work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s2-n78"
source = json.loads((prepared / "lesson.template.json").read_text())
profile = json.loads((tools.parent / "profiles/modern-us-neutral.json").read_text())
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
report = {
    "schema": "STEMROBIN-181/d638-normalized-text-contract@1",
    "scope": "Text/source identity only; not independent SCI/ZHEN or figure acceptance",
    "normalizer": "edition.normalize_lesson_layout",
    "normalizerInvocations": 1,
    "newKaTeXSpans": 0,
    "existingMathReused": True,
    "locales": [],
}
errors = []
for locale in ("zh", "en"):
    file = own / f"candidate/{locale}/lesson.template.json"
    document = json.loads(file.read_text())
    before = [item["text"] for item in document["prose"]]
    edition.normalize_lesson_layout(document)
    rows = []
    for field in edition.IDENTITY_FIELDS:
        if document.get(field) != source.get(field):
            errors.append(f"{locale}.{field}: native identity changed")
    if document["source"] != source["source"]:
        errors.append(f"{locale}: source snapshot changed")
    if len(document["prose"]) != len(source["prose"]):
        errors.append(f"{locale}: source prose count changed")
    for index, (original, modern) in enumerate(zip(source["prose"], document["prose"])):
        for field in ("kind", "id", "label", "printed_page", "source_refs", "source_text"):
            if original[field] != modern[field]:
                errors.append(f"{locale}.prose[{index}].{field}: source binding changed")
        field_errors = edition.validate_text(
            original["source_text"], modern["text"], modern["changes"],
            modern["numeric_changes"], f"{locale}.prose[{index}]", forbidden,
            modern["historical_entities"],
        )
        errors.extend(field_errors)
        source_math = edition.math_signature(original["source_text"])
        modern_math = edition.math_signature(modern["text"])
        source_numbers, source_refs = edition.prose_number_signature(original["source_text"])
        modern_numbers, modern_refs = edition.prose_number_signature(modern["text"])
        if modern["text"] == original["source_text"] and modern["changes"] != []:
            errors.append(f"{locale}.prose[{index}]: unchanged text has changes")
        rows.append({
            "index": index,
            "source_refs": modern["source_refs"],
            "sourceMathInOrder": source_math,
            "modernMathInOrder": modern_math,
            "sourceNumericSignature": source_numbers,
            "modernNumericSignature": modern_numbers,
            "sourceReferences": {key: sorted(value) for key, value in source_refs.items()},
            "modernReferences": {key: sorted(value) for key, value in modern_refs.items()},
            "normalizationChangedText": before[index] != modern["text"],
            "changes": modern["changes"],
            "errors": field_errors,
        })
    exercises = json.loads((own / f"candidate/{locale}/exercises.template.json").read_text())
    original_exercises = json.loads((prepared / "exercises.template.json").read_text())
    if exercises != original_exercises or exercises["count"] != 0 or exercises["exercises"] != []:
        errors.append(f"{locale}: zero-question exercise snapshot changed")
    file.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
    report["locales"].append({"locale": locale, "proseObjects": len(rows), "rows": rows})
report["errors"] = errors
report["status"] = "PASS-TEXT-STRUCTURE-ONLY" if not errors else "FAIL-PRESERVED-NO-LOOP"
receipt = own / "normalized-text-contract.json"
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"receipt": str(receipt), "status": report["status"], "errors": errors}, ensure_ascii=False))
sys.exit(1 if errors else 0)
