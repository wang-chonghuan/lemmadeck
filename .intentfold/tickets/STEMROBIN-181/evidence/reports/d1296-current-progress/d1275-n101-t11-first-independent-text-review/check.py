import hashlib
import json
import subprocess
import sys
from pathlib import Path


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
PREP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1263-n101-t11-first-preparation"
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1266-n101-t11-first-bilingual-text-author"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def binding(path):
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def write_receipt(name, value):
    path = OUT / name
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"receipt": str(path), "status": value["status"]}))


mode = sys.argv[1]
require(mode in ("initial", "affected"), "Only initial or affected text checks are supported")
require(Path.cwd() == REPO, "Wrong checkout")
frozen = load(OUT / "independent-source-requirements.json")
author_report = load(AUTHOR / "report.json")
profile = load(REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
receipt = {
    "status": "RUNNING",
    "mode": mode,
    "scope": "Read-only text, identities, source snapshots, signatures and prose_flow only",
    "independentSourceFreeze": binding(OUT / "independent-source-requirements.json"),
    "authorReport": binding(AUTHOR / "report.json"),
    "sourceBindings": [],
    "candidates": [],
    "textCalls": 0,
    "proseFlowCalls": 0,
    "errors": [],
    "semanticApproval": False,
    "imageOpens": 0,
    "sourceReplay": False,
}
initial = load(OUT / "initial-checks.json") if mode == "affected" else None
changed = {
    ("phy10-c2-s4-n101", "lesson.template.json"): [1, 7, 9, 10, 12, 14],
    ("phy10-c2-s4-t11", "exercises.template.json"): [0],
}

for card in frozen["cards"]:
    card_id = card["card"]
    for key in ("sourceRequirements", "rawLesson", "rawExercises"):
        current = binding(Path(card[key]["path"]))
        require(current == card[key], f"Source binding changed: {key}/{card_id}")
        receipt["sourceBindings"].append(current)
    source_lesson = load(Path(card["rawLesson"]["path"]))
    source_exercises = load(Path(card["rawExercises"]["path"]))
    expected_report = next(item for item in author_report["cards"] if item["card"] == card_id)
    for locale in ("zh", "en"):
        selected = {}
        originals = {}
        for filename in ("lesson.template.json", "exercises.template.json", "figures.template.json"):
            original = AUTHOR / "candidates" / locale / card_id / filename
            original_binding = binding(original)
            require(
                original_binding["sha256"] == expected_report["candidateHashes"][locale][filename],
                f"Author report hash differs from actual original: {original}",
            )
            originals[filename] = load(original)
            is_changed = (card_id, filename) in changed
            target = OUT / "candidates" / locale / card_id / filename if mode == "affected" and is_changed else original
            selected[filename] = load(target)
            record = {"card": card_id, "locale": locale, "filename": filename, **binding(target)}
            record["original"] = original_binding
            record["corrected"] = mode == "affected" and is_changed
            receipt["candidates"].append(record)
            if mode == "affected" and not is_changed:
                old = next(
                    item for item in initial["candidates"]
                    if (item["card"], item["locale"], item["filename"]) == (card_id, locale, filename)
                )
                require(old["sha256"] == record["sha256"], f"Unaffected candidate changed: {target}")

        lesson = selected["lesson.template.json"]
        exercises = selected["exercises.template.json"]
        figures = selected["figures.template.json"]
        require(lesson["locale"] == locale, "Locale identity mismatch")
        receipt["errors"] += edition.validate_lesson_identity(source_lesson, lesson)
        require(lesson["source"]["data"] == source_lesson, "Raw lesson snapshot changed")
        require(exercises["source"]["data"] == source_exercises, "Raw exercises snapshot changed")
        require(lesson["source"]["sha256"] == card["rawLesson"]["sha256"], "Lesson source hash mismatch")
        require(exercises["source"]["sha256"] == card["rawExercises"]["sha256"], "Exercise source hash mismatch")
        require(len(lesson["prose"]) == card["counts"]["prose"], "Prose count mismatch")
        require(exercises["count"] == len(exercises["exercises"]) == card["counts"]["exercises"], "Exercise count mismatch")
        require(figures["lesson"] == card_id and figures["figures"] == [], "Unexpected figure manifest")
        require(lesson["figures"] == [] and lesson["errata"] == [], "Unexpected figures or errata")

        for filename, field, raw_document in (
            ("lesson.template.json", "prose", source_lesson),
            ("exercises.template.json", "exercises", source_exercises),
        ):
            modern_document = selected[filename]
            raw_items = raw_document[field]
            for index, (raw, item) in enumerate(zip(raw_items, modern_document[field])):
                require(item["source_text"] == raw["text"], "Source text changed")
                identity = ("kind", "id", "label", "printed_page", "source_refs") if field == "prose" else (
                    "number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"
                )
                receipt["errors"] += edition.validate_identity_fields(raw, item, identity, f"{card_id}/{locale}/{field}[{index}]")
                if field == "exercises":
                    require(item["lines"] == item["text"].splitlines(), "Exercise text/lines mismatch")
                require(item.get("figures", []) == [] and item.get("figure_refs", []) == [], "Unexpected item figures")
                require(item["numeric_changes"] == [], "Unexpected numerical amendment")
                require("math-correction" not in item["changes"], "Unregistered formula correction")
                if locale == "en":
                    require("translation" in item["changes"], "English text lacks translation declaration")
                    require(not edition.NON_ENGLISH_FIGURE_SCRIPT.search(item["text"]), "Untranslated English learner text")
                require(edition.math_signature(raw["text"]) == edition.math_signature(item["text"]), "Formula signature changed")
                require(edition.prose_number_signature(raw["text"]) == edition.prose_number_signature(item["text"]), "Number/reference signature changed")
                affected = mode == "initial" or index in changed.get((card_id, filename), [])
                if affected:
                    receipt["errors"] += edition.validate_text(
                        raw["text"], item["text"], item["changes"], item["numeric_changes"],
                        f"{card_id}/{locale}/{field}[{index}]", forbidden, item["historical_entities"],
                    )
                    receipt["textCalls"] += 1
                if mode == "affected":
                    before = originals[filename][field][index]
                    if index not in changed.get((card_id, filename), []):
                        require(item == before, f"Unrelated item changed: {card_id}/{locale}/{field}[{index}]")
                    else:
                        require(item["text"] != before["text"], f"Expected correction absent: {card_id}/{locale}/{field}[{index}]")
                        expected = dict(before)
                        expected["text"] = item["text"]
                        if field == "exercises":
                            expected["lines"] = item["lines"]
                            expected["changes"] = item["changes"]
                        require(item == expected, "Correction changed source or unrelated fields")

        if mode == "initial" or (card_id, "lesson.template.json") in changed:
            lesson_path = next(
                item["path"] for item in receipt["candidates"]
                if (item["card"], item["locale"], item["filename"]) == (card_id, locale, "lesson.template.json")
            )
            result = subprocess.run(
                ["node", str(TOOLS / "prose_flow.mjs"), "--json", lesson_path],
                cwd=REPO, capture_output=True, text=True, check=False,
            )
            flow = {"exitCode": result.returncode, "stderr": result.stderr}
            require(result.returncode == 0, f"prose_flow failed: {result.stderr}")
            flow["report"] = json.loads(result.stdout)
            receipt["proseFlowCalls"] += 1
            receipt.setdefault("proseFlow", []).append({"card": card_id, "locale": locale, **flow})
            if card_id.endswith("t11"):
                require(flow["report"]["paragraphs"] == [] and lesson["section_breaks"] == [], "t11 acquired prose")
        if mode == "affected":
            before = originals["lesson.template.json"]
            expected = dict(before)
            expected["prose"] = lesson["prose"]
            expected["section_breaks"] = lesson["section_breaks"]
            require(lesson == expected, "Unrelated lesson fields changed")
            before = originals["exercises.template.json"]
            expected = dict(before)
            expected["exercises"] = exercises["exercises"]
            require(exercises == expected, "Unrelated exercise fields changed")

receipt["status"] = "PASS" if not receipt["errors"] else "FAIL"
write_receipt(f"{mode}-checks.json", receipt)
if receipt["errors"]:
    print(json.dumps(receipt["errors"], ensure_ascii=False))
    sys.exit(1)
