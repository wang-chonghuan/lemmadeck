import copy
import json
import subprocess
import sys
from pathlib import Path

repo = Path.cwd()
if str(repo) != "/Users/yong/.codex/worktrees/00b1/lemmadeck":
    raise SystemExit("Wrong sole cwd")
tools = repo / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import edition
import mathcheck

owned = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1202-n97-first-bilingual-text-author"
freeze = edition.load(owned / "FIRST-candidate-freeze.json")
card = "phy10-c2-s4-n97"
book = owned / "root/10p"
raw_path = book / "lessons" / card
work = owned / "work/adapt/10p/modern-us-neutral/lessons" / card
raw_lesson = edition.load(raw_path / "lesson.json")
raw_exercises = edition.load(raw_path / "exercises.json")
requirements = edition.load(owned / "source-freeze/source-requirements.json")
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

required_refs = [block["ref"] for block in requirements["blocks"] if block["kind"] != "h3"]
raw_refs = [ref for block in raw_lesson["prose"] for ref in block["source_refs"]]
if len(raw_refs) != len(required_refs) or set(raw_refs) != set(required_refs):
    errors.append("Closed source requirements do not match the complete raw prose reference set")
if requirements["boundary"]["nextHeading"] in raw_refs:
    errors.append("Excluded next heading entered n97")
if raw_lesson["exercise_count"] != 0 or raw_exercises != {"lesson": card, "count": 0, "exercises": []}:
    errors.append("Raw zero-exercise contract changed")
if [item["id"] for item in raw_lesson["figures"]] != requirements["sourceFigureIds"]:
    errors.append("Required figure identities changed")

results = []
math_items = []
nested_commands = []
for locale in ("zh", "en"):
    local_errors = []
    lesson = edition.load(work / locale / "lesson.template.json")
    exercises = edition.load(work / locale / "exercises.template.json")
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
        local_errors.append("Prose count changed")
    if exercises["lesson"] != card or exercises["count"] != 0 or exercises["exercises"] != []:
        local_errors.append("Empty exercise template changed")
    if {key: value for key, value in exercises.items() if key != "locale"} != edition.load(
        repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1201-n97n99-first-preparation/work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s4-n97/exercises.template.json"
    ):
        local_errors.append("Exercise template differs from preparation beyond locale")
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        local_errors.append("Candidate not already in deterministic native prose layout")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    local_errors += flow_errors
    nested_commands.append({
        "cwd": str(repo), "argv": ["node", str(tools / "prose_flow.mjs"), "--stdin"],
        "input": f"{locale} candidate prose and section_breaks, bound by FIRST freeze",
    })
    signatures = []
    for index, (source, modern) in enumerate(zip(raw_lesson["prose"], lesson["prose"])):
        label = f"{locale}.lesson.prose[{index}]"
        local_errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"), label
        )
        if modern["source_text"] != source["text"]:
            local_errors.append(f"{label}.source_text changed")
        local_errors += edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"], corrections.get(f"lesson.prose[{index}]"),
            modern.get("notation_changes"),
        )
        expected_text = source["text"]
        for correction in corrections.get(f"lesson.prose[{index}]", []):
            expected_text = expected_text.replace(correction["original"], correction["corrected"], 1)
        source_tokens = [match.group(0) for match in edition.MATH.finditer(expected_text)]
        modern_tokens = [match.group(0) for match in edition.MATH.finditer(modern["text"])]
        if source_tokens != modern_tokens:
            local_errors.append(f"{label}: exact math token/order changed beyond approved erratum")
        if "格列弗" in modern["text"] or "小人国" in modern["text"]:
            local_errors.append(f"{label}: source literary fiction remains in modern prose")
        if any(term in modern["text"].lower() for term in ("gulliver", "lilliput")):
            local_errors.append(f"{label}: source literary fiction remains in modern prose")
        if "<span" in modern["text"] or "<font" in modern["text"]:
            local_errors.append(f"{label}: manual body-math markup found")
        if any(char.isdecimal() and char not in "0123456789" for char in modern["text"]):
            local_errors.append(f"{label}: non-ASCII body digit found")
        for token in modern_tokens:
            if edition.MATH_BOUNDARY_PUNCTUATION.search(token):
                local_errors.append(f"{label}: Chinese punctuation inside math")
        for error in mathcheck.check_delimiters(modern["text"]):
            local_errors.append(f"{label}: {error}")
        for tex, display in mathcheck.find_math_spans(modern["text"]):
            math_items.append({"id": label, "field": "text", "tex": tex, "display": display})
        signatures.append({
            "source_refs": source["source_refs"],
            "mathTokens": modern_tokens,
            "numbersAndReferences": edition.prose_number_signature(modern["text"]),
            "historicalEntities": modern["historical_entities"],
        })
    if [record["id"] for record in lesson["errata"]] != ["p0261-math-1"]:
        local_errors.append("Sole approved erratum identity changed")
    if lesson["errata"][0]["corrected"] != "$l-v\\tau_2$":
        local_errors.append("Approved return-route correction not used")
    results.append({
        "locale": locale,
        "status": "pass" if not local_errors else "fail",
        "proseBlocks": len(lesson["prose"]),
        "textBlocks": sum(block["kind"] == "p" for block in lesson["prose"]),
        "footnotes": sum(block["label"] == "footnote" for block in lesson["prose"]),
        "exercises": len(exercises["exercises"]),
        "figures": [item["id"] for item in lesson["figures"]],
        "mathTokenCount": sum(len(item["mathTokens"]) for item in signatures),
        "flow": flow,
        "signatures": signatures,
        "errors": local_errors,
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
    "scope": "current FIRST bilingual templates: source snapshots, identities, refs, text, numeric and exact math preservation after sole approved p0261-math-1, registered errata, native proseFlow, KaTeX; text checks only",
    "nativeAPIs": [
        "edition.validate_source", "edition.validate_lesson_identity", "edition.validate_identity_fields",
        "edition.validate_errata", "edition.validate_text", "edition.normalize_lesson_layout (in-memory stability only)",
        "edition.prose_flow_contract", "mathcheck.check_delimiters", "mathcheck.find_math_spans", "katex_check.js",
    ],
    "freezeSHA256": edition.sha256(owned / "FIRST-candidate-freeze.json"),
    "sourceCounts": freeze["sourceCounts"],
    "locales": results, "nestedCommands": nested_commands, "katex": katex_results,
    "katexWarnings": [warning for item in katex_results for warning in item.get("warnings", [])],
    "errors": errors,
    "semanticReview": "pending", "completeCard": False,
    "notChecked": ["figure pixels/spec/render/review", "full native lesson finalization", "independent semantic review", "product/browser/publication"],
}
print(json.dumps(report, ensure_ascii=False, indent=2, default=serializable))
sys.exit(0 if not errors else 1)
