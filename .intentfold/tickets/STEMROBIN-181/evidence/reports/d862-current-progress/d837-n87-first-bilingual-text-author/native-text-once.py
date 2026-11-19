import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == R
O = Path(__file__).resolve().parent
tools = R / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition

locale = sys.argv[1]
assert locale in ("zh", "en") and len(sys.argv) == 2
receipt = O / "native" / f"{locale}.json"
assert not receipt.exists(), "Do not repeat FIRST native preflight."
lesson = json.loads((O / "first" / locale / "lesson.template.json").read_text())
exercises = json.loads((O / "first" / locale / "exercises.template.json").read_text())
raw_lesson = json.loads((O / "inputs/raw-lesson.json").read_text())
raw_exercises = json.loads((O / "inputs/raw-exercises.json").read_text())
template = json.loads((O / "inputs/lesson.template.json").read_text())
ex_template = json.loads((O / "inputs/exercises.template.json").read_text())
book = R / ".intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/root/10p"
profile = json.loads((tools.parent / "profiles/modern-us-neutral.json").read_text())
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
errors = []
rows = []
counts = {"normalizeProseLayoutCalls": 0, "normalizeNumberedSubpartCalls": 0, "validateTextCalls": 0}

if lesson["schema"] != edition.LESSON_SCHEMA or exercises["schema"] != edition.EXERCISES_SCHEMA:
    errors.append("Edition lesson/exercise schema mismatch.")
if lesson["edition"] != "modern-us-neutral" or exercises["edition"] != "modern-us-neutral":
    errors.append("Edition identity mismatch.")
if lesson["locale"] != locale or exercises["locale"] != locale:
    errors.append("Locale mismatch.")
errors += edition.validate_lesson_identity(raw_lesson, lesson)
for label, document, original, filename in [
    ("lesson", lesson, template, "lesson.json"),
    ("exercises", exercises, ex_template, "exercises.json"),
]:
    if document["source"] != original["source"]:
        errors.append(f"{label}: source snapshot changed.")
    errors += edition.validate_source(book, document["source"], book / "lessons" / lesson["id"] / filename, label)
if len(lesson["prose"]) != len(raw_lesson["prose"]):
    errors.append("Source prose count changed.")
if exercises["count"] != 6 or len(exercises["exercises"]) != 6:
    errors.append("Six-question source count changed.")
for original, modern in zip(raw_lesson["figures"], lesson["figures"]):
    if original["id"] != modern["id"] or original["page"] != modern["page"]:
        errors.append("Source figure manifest identity changed.")
    if not edition.same_figure_label(original["label"], modern["label"], locale):
        errors.append("Unsupported figure display label.")


def inspect_text(original, modern, label):
    counts["validateTextCalls"] += 1
    found = edition.validate_text(
        original["text"], modern["text"], modern["changes"],
        modern["numeric_changes"], label, forbidden, modern["historical_entities"],
    )
    source_tokens = [match.group(0) for match in edition.MATH.finditer(original["text"])]
    candidate_tokens = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
    if Counter(source_tokens) != Counter(candidate_tokens):
        found.append(f"{label}: strict complete-math-token multiset changed.")
    if source_tokens != candidate_tokens:
        found.append(f"{label}: exact complete-math-token order changed.")
    source_numbers = edition.number_signature(original["text"])
    candidate_numbers = edition.number_signature(modern["text"])
    if source_numbers != candidate_numbers:
        found.append(f"{label}: exact non-math numeric sequence changed.")
    if modern["numeric_changes"]:
        found.append(f"{label}: numeric replacement not authorized.")
    rows.append({
        "target": label, "source_refs": modern.get("source_refs", modern.get("pages")),
        "sourceMathTokens": source_tokens, "candidateMathTokens": candidate_tokens,
        "sourceNonMathNumbers": source_numbers, "candidateNonMathNumbers": candidate_numbers,
        "nativeSourceMathSignature": edition.math_signature(original["text"]),
        "nativeCandidateMathSignature": edition.math_signature(modern["text"]),
        "nativeSourceProseNumericAndReferences": [
            edition.prose_number_signature(original["text"])[0],
            {key: sorted(value) for key, value in edition.prose_number_signature(original["text"])[1].items()},
        ],
        "nativeCandidateProseNumericAndReferences": [
            edition.prose_number_signature(modern["text"])[0],
            {key: sorted(value) for key, value in edition.prose_number_signature(modern["text"])[1].items()},
        ],
        "errors": found,
    })
    errors.extend(found)


for index, (original, modern) in enumerate(zip(raw_lesson["prose"], lesson["prose"])):
    for field in ("kind", "id", "printed_page", "source_refs"):
        if modern.get(field) != original.get(field):
            errors.append(f"prose[{index}].{field}: immutable source identity changed.")
    if modern["source_text"] != original["text"]:
        errors.append(f"prose[{index}]: source text changed.")
    if not (
        original["kind"] in ("fig", "cap")
        and edition.same_figure_label(original["label"], modern["label"], locale)
    ) and original["label"] != modern["label"]:
        errors.append(f"prose[{index}]: marker label changed.")
    if modern["kind"] == "p":
        counts["normalizeProseLayoutCalls"] += 1
        before = modern["text"]
        modern["text"] = edition.normalize_prose_layout(before)
        if before != modern["text"] and "layout" not in modern["changes"]:
            modern["changes"].append("layout")
    for anchor in ("**表面加工质量的检验**", "**光学增透**"):
        if anchor in original["text"] and modern["text"].count(anchor) != original["text"].count(anchor):
            errors.append(f"prose[{index}]: bold source identity changed.")
    inspect_text(original, modern, f"{locale}:prose[{index}]")

for index, (original, modern) in enumerate(zip(raw_exercises["exercises"], exercises["exercises"])):
    errors += edition.validate_identity_fields(
        original, modern, ("number", "source_number", "group", "group_id", "figure_refs", "figures"),
        f"{locale}:exercises[{index}]",
    )
    if original["pages"] != modern["pages"] or original["text"] != modern["source_text"]:
        errors.append(f"exercises[{index}]: source binding changed.")
    counts["normalizeNumberedSubpartCalls"] += 1
    modern["text"] = edition.normalize_numbered_subparts(modern["text"])
    modern["lines"] = modern["text"].splitlines()
    errors += edition.validate_numbered_subpart_layout(modern["text"])
    inspect_text(original, modern, f"{locale}:exercises[{index}]")

footnote = next(block for block in lesson["prose"] if block["source_refs"] == ["p0232#10"])
literal = "实际上膜的厚度为波长的整数倍. 这样比较方便." if locale == "zh" else (
    "In practice, the thickness of the film is an integer multiple of the wavelength. This is more convenient."
)
if literal not in footnote["text"].replace("\n", " "):
    errors.append("Source integer-wavelength footnote literal missing.")
for block in lesson["prose"]:
    if block["source_refs"] != ["p0232#10"] and block["historical_entities"]:
        errors.append("Unrequested historical declaration outside the source footnote.")
if lesson.get("errata") != template.get("errata"):
    errors.append("Errata changed.")
if any(key in item for item in exercises["exercises"] for key in ("answer", "choices", "options", "solution", "accept", "correct_index")):
    errors.append("Forbidden answer/choice fields added.")

for name, document in [("lesson", lesson), ("exercises", exercises)]:
    target = O / "candidate" / locale / f"{name}.template.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("x") as handle:
        handle.write(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
receipt.parent.mkdir(parents=True, exist_ok=True)
report = {
    "schema": "STEMROBIN-181/d837-native-text-preflight@1",
    "locale": locale, "status": "PASS-TEXT-CONSERVATION-ONLY" if not errors else "FAIL-FIRST-PRESERVED",
    "scope": "Actual native source/text/identity validators and layout normalization; not SCI/ZHEN or full-edition/image/runtime acceptance.",
    "command": [sys.executable, "-B", str(Path(__file__).resolve()), locale],
    "cwd": str(R), "pythonExecutable": sys.executable, "runtime": sys.version,
    **counts, "validateLessonIdentityCalls": 1, "validateSourceCalls": 2,
    "validateExerciseIdentityCalls": 6, "validateSubpartLayoutCalls": 6,
    "sourceQuestions": 6, "rows": rows, "errors": errors,
    "candidateHashes": {
        name: hashlib.sha256((O / "candidate" / locale / f"{name}.template.json").read_bytes()).hexdigest()
        for name in ("lesson", "exercises")
    },
}
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"receipt": str(receipt), "status": report["status"], "errors": errors}, ensure_ascii=False))
sys.exit(1 if errors else 0)
