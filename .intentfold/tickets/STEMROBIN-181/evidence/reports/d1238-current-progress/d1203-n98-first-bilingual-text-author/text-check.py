import copy
import json
import re
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
repo = Path.cwd()
assert str(repo) == "/Users/yong/.codex/worktrees/00b1/lemmadeck"
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition
import mathcheck

owned = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author"
freeze = edition.load(owned / "FIRST-candidate-freeze.json")
inventory = edition.load(owned / "source-inventory.json")
card = "phy10-c2-s4-n98"
book = owned / "root/10p"
raw_path = book / "lessons" / card
raw_lesson = edition.load(raw_path / "lesson.json")
raw_exercises = edition.load(raw_path / "exercises.json")
requirements = edition.load(Path(inventory["approvedSourceRequirements"]["path"]))
profile = edition.load(tools.parent / "profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
errors = []
for binding in freeze["inputs"]:
    if edition.sha256(Path(binding["path"])) != binding["sha256"]:
        errors.append(f"Frozen input changed: {binding['path']}")
for candidate in freeze["candidates"]:
    for version in ("current", "FIRST"):
        binding = candidate[version]
        if edition.sha256(Path(binding["path"])) != binding["sha256"]:
            errors.append(f"Frozen candidate changed: {binding['path']}")
    if candidate["current"]["sha256"] != candidate["FIRST"]["sha256"]:
        errors.append(f"FIRST/current mismatch: {candidate['locale']}/{candidate['kind']}")
if freeze["semanticSourceInventory"]["sha256"] != edition.sha256(owned / "source-inventory.json"):
    errors.append("Pre-seed source inventory binding changed")
if inventory["stage"] != "FROZEN-BEFORE-ANY-SEEDS":
    errors.append("Source inventory was not frozen before seeds")
required_refs = [block["ref"] for block in requirements["blocks"] if block["kind"] not in ("h3", "exhead")]
raw_refs = [ref for block in raw_lesson["prose"] for ref in block["source_refs"]]
question_refs = [ref for exercise in raw_exercises["exercises"] for ref in exercise["pages"]]
if len(raw_refs + question_refs) != len(required_refs) or sorted(raw_refs + question_refs) != sorted(required_refs):
    errors.append("Complete source requirements not covered exactly once by raw prose and all questions")
if requirements["boundary"] != {"first": "p0262#2", "last": "p0264#4", "nextHeading": "p0264#5",
                                "n99NextHeadingIndependentConfirmationPending": False}:
    errors.append("Approved n98 source boundary changed")
if "p0264#5" in raw_refs + question_refs:
    errors.append("Excluded n99 heading entered n98")
if raw_lesson["exercise_count"] != 8 or raw_exercises["count"] != 8 or len(raw_exercises["exercises"]) != 8:
    errors.append("All eight original review questions are required")
if raw_exercises["exercises"][4]["pages"] != ["p0263#11", "p0264#1"]:
    errors.append("Question 5 missing its approved p0264#1 closure")
if [item["id"] for item in raw_lesson["figures"]] != ["fig-226"]:
    errors.append("Figure 226 identity changed")

# Compare literal approved blocks against copied, hash-bound source pages without rerunning assembly.
for block in requirements["blocks"]:
    page, ordinal = block["ref"].split("#")
    document = edition.load(book / "pages" / page[1:] / "page.json")
    actual = document["blocks"][int(ordinal) - 1]
    for key in ("kind", "label", "lines", "cont", "open", "samerow"):
        if actual.get(key) != block.get(key):
            errors.append(f"Approved source block drift: {block['ref']}.{key}")
    if block.get("id") is not None and actual.get("id") != block["id"]:
        errors.append(f"Approved source figure identity drift: {block['ref']}")

results = []
math_items = []
nested_commands = []
prohibited_keys = {"answer", "answers", "answerKey", "correct_index", "accept", "choices", "choiceSet", "interaction", "solution"}

def unexpected_answer_fields(value, location):
    found = []
    if isinstance(value, dict):
        for key, item in value.items():
            if key in prohibited_keys:
                found.append(f"{location}.{key}: invented answer/choice/interaction field")
            found.extend(unexpected_answer_fields(item, f"{location}.{key}"))
    elif isinstance(value, list):
        for index, item in enumerate(value):
            found.extend(unexpected_answer_fields(item, f"{location}[{index}]"))
    return found

for locale in ("zh", "en"):
    local_errors = []
    lesson = edition.load(owned / locale / "lesson.template.json")
    exercises = edition.load(owned / locale / "exercises.template.json")
    local_errors += edition.validate_source(book, lesson["source"], raw_path / "lesson.json", "lesson")
    local_errors += edition.validate_source(book, exercises["source"], raw_path / "exercises.json", "exercises")
    local_errors += edition.validate_lesson_identity(raw_lesson, lesson)
    corrections, errata_errors = edition.validate_errata(book, raw_lesson, raw_exercises, lesson, exercises)
    local_errors += errata_errors
    if lesson["schema"] != edition.LESSON_SCHEMA or exercises["schema"] != edition.EXERCISES_SCHEMA:
        local_errors.append("Native lesson/exercise schema mismatch")
    if lesson["edition"] != "modern-us-neutral" or exercises["edition"] != "modern-us-neutral":
        local_errors.append("Edition mismatch")
    if lesson["locale"] != locale or exercises["locale"] != locale:
        local_errors.append("Locale mismatch")
    if lesson["figures"] != raw_lesson["figures"]:
        local_errors.append("Source figure list changed")
    if len(lesson["prose"]) != len(raw_lesson["prose"]):
        local_errors.append("Original prose count changed")
    if exercises["lesson"] != card or exercises["count"] != 8 or len(exercises["exercises"]) != 8:
        local_errors.append("Eight-question exercise template changed")
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        local_errors.append("Candidate not already in deterministic native prose layout")
    normalized_exercises = copy.deepcopy(exercises)
    edition.normalize_exercise_layout(normalized_exercises)
    if normalized_exercises != exercises:
        local_errors.append("Candidate not already in deterministic native exercise layout")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    local_errors += flow_errors
    nested_commands.append({
        "cwd": str(repo), "argv": ["node", str(tools / "prose_flow.mjs"), "--stdin"],
        "input": f"{locale} candidate prose and section_breaks, hash-bound by FIRST freeze",
    })
    if len(lesson["section_breaks"]) != 4 or len(flow.get("boundaries", [])) != 4:
        local_errors.append("Four source-semantic subsection boundaries must resolve")
    for paragraph in flow.get("paragraphs", []):
        words = edition.MATH.sub("", paragraph["text"])
        if not re.search(r"[A-Za-z\u4e00-\u9fff]", words):
            local_errors.append(f"{locale}: formula-only paragraph {paragraph['index']}")
    signatures = []
    for kind, sources, candidates, identities, units in (
        ("lesson.prose", raw_lesson["prose"], lesson["prose"],
         ("kind", "id", "label", "printed_page", "source_refs"), inventory["proseUnitsInAssembledOrder"]),
        ("exercises", raw_exercises["exercises"], exercises["exercises"],
         ("number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"),
         inventory["questionsInOriginalOrder"]),
    ):
        for index, (source, modern, unit) in enumerate(zip(sources, candidates, units)):
            label = f"{locale}.{kind}[{index}]"
            local_errors += edition.validate_identity_fields(source, modern, identities, label)
            if modern["source_text"] != source["text"] or modern["source_text"] != unit["source_text"]:
                local_errors.append(f"{label}.source_text changed")
            local_errors += edition.validate_text(
                source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
                label, forbidden, modern["historical_entities"], corrections.get(f"{kind}[{index}]"),
                modern.get("notation_changes"),
            )
            source_tokens = [match.group(0) for match in edition.MATH.finditer(source["text"])]
            modern_tokens = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
            if source_tokens != modern_tokens or modern_tokens != unit["exactMathTokensInOrder"]:
                local_errors.append(f"{label}: exact math tokens/order changed or a sentence token is missing")
            for error in mathcheck.check_delimiters(modern["text"]):
                local_errors.append(f"{label}: {error}")
            for tex, display in mathcheck.find_math_spans(modern["text"]):
                math_items.append({"id": label, "field": "text", "tex": tex, "display": display})
            if kind == "exercises":
                local_errors += [f"{label}: {error}" for error in edition.validate_numbered_subpart_layout(modern["text"])]
                if modern["lines"] != modern["text"].splitlines():
                    local_errors.append(f"{label}: stale lines/text")
                if not modern["text"].startswith(f"{source['number']}. "):
                    local_errors.append(f"{label}: source question prefix changed")
            if locale == "en" and re.search(r"[\u4e00-\u9fff]", modern["text"]):
                local_errors.append(f"{label}: untranslated Chinese learner text")
            signatures.append({
                "stableTarget": f"{kind}[{index}]",
                "sourceRefs": source.get("source_refs", source.get("pages")),
                "mathTokens": modern_tokens,
                "numbersAndReferences": edition.prose_number_signature(modern["text"]),
            })
    local_errors += unexpected_answer_fields(lesson, f"{locale}.lesson")
    local_errors += unexpected_answer_fields(exercises, f"{locale}.exercises")
    results.append({
        "locale": locale, "status": "pass" if not local_errors else "fail",
        "proseBlocks": len(lesson["prose"]), "textBlocks": sum(block["kind"] == "p" for block in lesson["prose"]),
        "exercises": len(exercises["exercises"]), "figures": [item["id"] for item in lesson["figures"]],
        "mathTokenCount": sum(len(item["mathTokens"]) for item in signatures),
        "question5SourceRefs": exercises["exercises"][4]["pages"],
        "question6To8SourceRefs": [item["pages"] for item in exercises["exercises"][5:]],
        "flow": flow, "signatures": signatures, "errors": local_errors,
    })
    errors += local_errors

argv = ["node", str(tools / "katex_check.js")]
result = subprocess.run(argv, input=json.dumps(math_items), capture_output=True, text=True, cwd=repo)
nested_commands.append({"cwd": str(repo), "argv": argv, "mathItems": len(math_items), "exitCode": result.returncode})
if result.returncode:
    errors.append(f"Native KaTeX command failed: {result.stderr}")
    katex_results = []
else:
    katex_results = json.loads(result.stdout)
    for item in katex_results:
        if item.get("fatal") or not item.get("ok"):
            errors.append(f"Native KaTeX failed: {item}")

def serializable(value):
    if isinstance(value, set):
        return sorted(value)
    raise TypeError(type(value).__name__)

report = {
    "schema": "stemrobin/scoped-native-text-check@1",
    "ticket": "STEMROBIN-181", "batch": "D037", "card": card,
    "status": "pass" if not errors else "fail",
    "scope": "FIRST/current bilingual templates: complete pre-seed inventory, approved source blocks, source snapshots, identities, refs, all eight questions, exact math, native proseFlow and KaTeX",
    "adaptedFrom": str(repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1090-n94-first-bilingual-text-author/text-check.py"),
    "nativeAPIs": [
        "edition.validate_source", "edition.validate_lesson_identity", "edition.validate_identity_fields",
        "edition.validate_errata", "edition.validate_text", "edition.validate_numbered_subpart_layout",
        "edition.normalize_lesson_layout (in-memory stability only)",
        "edition.normalize_exercise_layout (in-memory stability only)",
        "edition.prose_flow_contract", "mathcheck.check_delimiters", "mathcheck.find_math_spans", "katex_check.js",
    ],
    "freezeSHA256": edition.sha256(owned / "FIRST-candidate-freeze.json"),
    "sourceInventorySHA256": edition.sha256(owned / "source-inventory.json"),
    "sourceCounts": freeze["sourceCounts"], "locales": results,
    "nestedCommands": nested_commands, "katex": katex_results,
    "katexWarnings": [warning for item in katex_results for warning in item.get("warnings", [])],
    "errors": errors, "semanticReview": "pending", "completeCard": False,
    "notChecked": ["figure pixels/spec/render/review", "full native lesson finalization",
                   "independent semantic approval", "product/browser/publication"],
}
print(json.dumps(report, ensure_ascii=False, indent=2, default=serializable))
sys.exit(0 if not errors else 1)
