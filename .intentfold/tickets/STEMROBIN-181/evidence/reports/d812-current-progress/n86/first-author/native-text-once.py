import hashlib
import json
import os
import sys
from pathlib import Path

sys.dont_write_bytecode = True
R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == R
own = Path(__file__).resolve().parent
tools = R / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition

locale = sys.argv[1]
assert locale in ("zh", "en") and len(sys.argv) == 2
receipt = own / f"native/{locale}.json"
assert not receipt.exists(), "Native locale pass already has a receipt; do not repeat it."
prepared = R / ".intentfold/tickets/STEMROBIN-181/tmp/d793-reviews-consume-source230/work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s3-n86"
source = json.loads((prepared / "lesson.template.json").read_text())
file = own / f"candidate/{locale}/lesson.template.json"
document = json.loads(file.read_text())
profile = json.loads((tools.parent / "profiles/modern-us-neutral.json").read_text())
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
rows = []
errors = []
before_hash = hashlib.sha256(file.read_bytes()).hexdigest()
for field in edition.IDENTITY_FIELDS:
    if document.get(field) != source.get(field):
        errors.append(f"{locale}.{field}: immutable identity changed")
if document["source"] != source["source"]:
    errors.append(f"{locale}: immutable source snapshot changed")
if document["figures"] != source["figures"]:
    errors.append(f"{locale}: source figure manifest changed")
if len(document["prose"]) != len(source["prose"]):
    errors.append(f"{locale}: source object count changed")

for original, modern in zip(source["prose"], document["prose"]):
    block_errors = []
    for field in ("kind", "id", "label", "printed_page", "source_refs", "source_text"):
        if original[field] != modern[field]:
            block_errors.append(f"{locale}.{modern['source_refs']}.{field}: immutable binding changed")
    before = modern["text"]
    normalized = False
    if modern["kind"] == "p":
        modern["text"] = edition.normalize_prose_layout(before)
        normalized = True
    label = f"{locale}:{','.join(modern['source_refs'])}"
    block_errors += edition.validate_text(
        original["source_text"], modern["text"], modern["changes"],
        modern["numeric_changes"], label, forbidden, modern["historical_entities"],
    )
    source_tokens = [match.group(0) for match in edition.MATH.finditer(original["source_text"])]
    candidate_tokens = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
    if source_tokens != candidate_tokens:
        block_errors.append(f"{label}: exact math token sequence changed")
    source_numbers = edition.number_signature(original["source_text"])
    candidate_numbers = edition.number_signature(modern["text"])
    if source_numbers != candidate_numbers:
        block_errors.append(f"{label}: exact non-math number sequence changed")
    if modern["numeric_changes"] or modern["historical_entities"]:
        block_errors.append(f"{label}: unrequested numeric or historical declaration")
    errors.extend(block_errors)
    sn, sr = edition.prose_number_signature(original["source_text"])
    mn, mr = edition.prose_number_signature(modern["text"])
    rows.append({
        "source_refs": modern["source_refs"], "kind": modern["kind"],
        "normalize_prose_layout_calls": int(normalized),
        "normalizationChanged": before != modern["text"],
        "exactSourceMathTokens": source_tokens, "exactCandidateMathTokens": candidate_tokens,
        "nativeSourceMathSignature": edition.math_signature(original["source_text"]),
        "nativeCandidateMathSignature": edition.math_signature(modern["text"]),
        "sourceNonMathNumberSequence": source_numbers,
        "candidateNonMathNumberSequence": candidate_numbers,
        "nativeSourceNumericSignature": sn, "nativeCandidateNumericSignature": mn,
        "nativeSourceReferences": {key: sorted(value) for key, value in sr.items()},
        "nativeCandidateReferences": {key: sorted(value) for key, value in mr.items()},
        "errors": block_errors,
    })

exercises = json.loads((own / f"candidate/{locale}/exercises.template.json").read_text())
source_exercises = json.loads((prepared / "exercises.template.json").read_text())
if exercises != source_exercises or exercises["count"] != 0 or exercises["exercises"] != []:
    errors.append(f"{locale}: zero-question exercises changed")
file.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
receipt.parent.mkdir(parents=True, exist_ok=True)
report = {
    "schema": "STEMROBIN-181/d798-native-text@1", "locale": locale,
    "scope": "Native source/text conservation only; not SCI/ZHEN, images, or full checks",
    "command": [sys.executable, "-B", str(Path(__file__).resolve()), locale],
    "cwd": str(R), "runtime": sys.version, "pythonExecutable": sys.executable,
    "beforeSha256": before_hash, "afterSha256": hashlib.sha256(file.read_bytes()).hexdigest(),
    "normalizer": "edition.normalize_prose_layout",
    "normalizeCalls": sum(row["normalize_prose_layout_calls"] for row in rows),
    "validateTextCalls": len(rows), "rows": rows, "sourceQuestions": 0,
    "status": "PASS-TEXT-CONSERVATION-ONLY" if not errors else "FAIL-FIRST-PRESERVED",
    "errors": errors, "images": 0, "paid": 0,
}
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"receipt": str(receipt), "status": report["status"], "errors": errors}, ensure_ascii=False))
sys.exit(1 if errors else 0)
