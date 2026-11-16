import copy
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
TICKET = Path(__file__).resolve().parent
LESSON_ID = "phy9-c1-s7-t4"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SKILL = ROOT / ".claude/skills/ld-s10y-lesson"
TARGET = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / LESSON_ID
BEFORE = TICKET / "9p-t4-before"
FREEZE = TICKET / "9p-t4-prose-freeze.json"
CHECK = TICKET / "9p-t4-author-check.json"
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
sys.path.insert(0, str(SKILL / "tools"))
import edition
import mathcheck


def binding(file):
    return {
        "path": str(file),
        "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
    }


def dump(file, document):
    file.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


assert not FREEZE.exists(), "Do not overwrite frozen author evidence."
current = [edition.load(TARGET / name) for name in NAMES]
baseline = [edition.load(BEFORE / name) for name in NAMES]
lesson, exercises, figures = current
raw_lesson_path = BOOK / "lessons" / LESSON_ID / "lesson.json"
raw_exercises_path = BOOK / "lessons" / LESSON_ID / "exercises.json"
raw_lesson = edition.load(raw_lesson_path)
raw_exercises = edition.load(raw_exercises_path)
assert current[0] == baseline[0]
assert current[2] == baseline[2]
assert lesson["prose"] == [] and lesson["section_breaks"] == []
assert lesson["errata"] == []
assert exercises["count"] == len(exercises["exercises"]) == 7
assert raw_lesson["printed_title"] == "练习 8"
assert [item["id"] for item in figures["figures"]] == ["fig-101", "fig-102"]
assert {key: value for key, value in exercises.items() if key != "exercises"} == {
    key: value for key, value in baseline[1].items() if key != "exercises"
}
normalized = copy.deepcopy(exercises)
edition.normalize_exercise_layout(normalized)
normalization_idempotent = normalized == exercises
assert normalization_idempotent, "Apply native normalization before freezing."
profile_path = SKILL / "profiles/modern-us-neutral.json"
profile = edition.load(profile_path)
forbidden = [*profile.get("forbidden_terms", []), *profile.get("forbidden_person_names", [])]
errors = edition.validate_source(BOOK, lesson["source"], raw_lesson_path, "lesson")
errors += edition.validate_source(BOOK, exercises["source"], raw_exercises_path, "exercises")
errors += edition.validate_identity_fields(
    raw_lesson, lesson, edition.IDENTITY_FIELDS, "lesson"
)
_, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
errors += flow_errors
errors += edition.validate_figure_references(
    lesson["prose"], exercises["exercises"], figures["figures"]
)
checks = []
editable = {"text", "lines", "changes", "numeric_changes", "historical_entities"}
for index, (raw, item, before) in enumerate(zip(
    raw_exercises["exercises"], exercises["exercises"], baseline[1]["exercises"]
)):
    assert {key: value for key, value in item.items() if key not in editable} == {
        key: value for key, value in before.items() if key not in editable
    }
    assert item["source_text"] == raw["text"]
    assert item["lines"] == item["text"].splitlines()
    assert item["changes"] == ["context", "layout"]
    assert item["numeric_changes"] == [] and item["historical_entities"] == []
    source_math = [match.group(0) for match in edition.MATH.finditer(raw["text"])]
    modern_math = [match.group(0) for match in edition.MATH.finditer(item["text"])]
    source_numbers = edition.number_signature(raw["text"])
    modern_numbers = edition.number_signature(item["text"])
    assert source_math == modern_math
    assert source_numbers == modern_numbers
    item_errors = edition.validate_identity_fields(
        raw, item, ("number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"),
        f"exercises[{index}]"
    )
    item_errors += edition.validate_text(
        raw["text"], item["text"], item["changes"], item["numeric_changes"],
        f"exercises[{index}]", forbidden, item["historical_entities"],
        notation_changes=item.get("notation_changes")
    )
    item_errors += edition.validate_numbered_subpart_layout(item["text"])
    errors += item_errors
    checks.append({
        "number": item["number"],
        "source_refs": item["pages"],
        "exact_math_tokens_unchanged": source_math == modern_math,
        "math_tokens": source_math,
        "non_math_numeric_signature_unchanged": source_numbers == modern_numbers,
        "source_numbers": source_numbers,
        "modern_numbers": modern_numbers,
        "identity_snapshot_and_figure_references_unchanged": True,
        "errors": item_errors,
    })
math_errors, math_warnings = mathcheck.collect_and_check(
    [{"id": item["number"], "text": item["text"]} for item in exercises["exercises"]],
    lambda item: [("text", item["text"])]
)
assert errors == [] and math_errors == [] and math_warnings == []
source_pages = {
    str(page): {
        suffix: binding(BOOK / "pages" / f"{page:04d}" / name)
        for suffix, name in (("page", "page.json"), ("draft", "page.md"), ("audit", "audit.json"))
    }
    for page in (143, 144)
}
check = {
    "ticket": "STEMROBIN-181",
    "lesson": LESSON_ID,
    "role": "author-mechanical-check-only",
    "status": "pass",
    "checks": checks,
    "native_errors": errors,
    "math_errors": math_errors,
    "math_warnings": math_warnings,
    "normalization_idempotent": normalization_idempotent,
    "empty_prose_flow_and_boundaries_valid": not flow_errors,
    "figure_references_only": ["fig-101", "fig-102"],
    "no_figure_spec_pixel_render_or_review_checks_run": True,
}
dump(CHECK, check)
targets = [
    ("1", "p0143#10", ["判断扇形缺口角度是否变化并解释"], "Uniform free isotropic expansion; no constraints or phase change."),
    ("2", "p0143#11", ["解释容器容量也增大而题给液面仍升高"], "Same container and equilibrated liquid/container, fixed liquid mass; given phenomenon is not universal."),
    ("3", "p0144#1", ["比较大小水银槽温度计的灵敏度并解释"], "Matched mercury/glass/range and uniform equal capillary diameter; equilibrium column sensitivity, not response time."),
    ("4", "p0144#2", ["求使铁箍内径刚好达到木轮直径的温升"], "Initial hoop inner diameter is reference D0, not wheel diameter; fixed wheel and free linear expansion."),
    ("5", "p0144#3", ["求汽油体胀系数"], "Fixed equal actual volume at both given temperatures; matched composition/pressure/gravity and initial-reference linear volume model."),
    ("6", "p0144#4", ["求题给目标温度的约束应力"], "Initially stress-free, fixed spacing/contact section, homogeneous temperature, linear elasticity, no buckling/plasticity."),
    ("7", "p0144#5", ["解释温控电路工作原理", "判断上下金属哪层线胀系数小", "提出温升接通信号器的概念性接点改变"], "Bonded elastic layers and original diagram arrangement; switching regulates temperature, not exact constancy."),
]
record = {
    "ticket": "STEMROBIN-181",
    "lesson": LESSON_ID,
    "printed_identity": "练习 8",
    "role": "author-only",
    "status": "frozen-pending-unique-independent-science-stem-review",
    "created_at": datetime.now(timezone.utc).isoformat(),
    "counts": {"original_written_tasks": 7, "modern_written_tasks": 7, "prose": 0, "figures": 2},
    "native_adapt_prepare": {"lesson": LESSON_ID, "run_count": 1},
    "templates": {name: binding(TARGET / name) for name in NAMES},
    "before_templates": {name: binding(BEFORE / name) for name in NAMES},
    "source": {"lesson": binding(raw_lesson_path), "exercises": binding(raw_exercises_path)},
    "source_pages": source_pages,
    "mapping": [
        {"number": number, "source_block": block, "response_targets": response_targets, "authored_model_conditions": model}
        for number, block, response_targets, model in targets
    ],
    "hoop_reference_binding": {
        "task": "4", "source_block": "p0144#2",
        "source_data_retained": "木轮直径1米；铁箍初始内径小5毫米",
        "reference": "D0 is the initial hoop inner diameter.",
        "derived_input_reference_m": 0.995,
        "not_inserted_as_new_numeric_data_or_answer": True,
        "required_temperature_not_solved": True,
    },
    "safety": {
        "historical_mercury_tasks": ["2", "3"],
        "gasoline_given_data_theory_only": ["5"],
        "heating_and_restrained_structure_conceptual_only": ["1", "4", "6"],
        "thermostat_switching_no_mains_wiring_or_apparatus_operation": ["7"],
        "no_original_hands_on_experiment_target_removed": True,
    },
    "preservation": {
        "lesson_and_figures_templates_byte_identical_to_prepare": all(
            binding(TARGET / name)["sha256"] == binding(BEFORE / name)["sha256"]
            for name in ("lesson.template.json", "figures.template.json")
        ),
        "all_original_task_ids_order_groups_pages_source_snapshots_and_refs_unchanged": True,
        "all_original_math_tokens_and_non_math_numeric_signatures_unchanged": True,
        "no_source_edits_or_errata": True,
        "no_new_task_answer_or_choice": True,
        "no_answers_choice_drafts_or_book_answers_consulted": True,
    },
    "unresolved_for_independent_science_gate": [
        "Author's ideal-model qualifications and all original response targets require the main independent gate; no self-science approval.",
        "Original fig101/102 references preserved only; actual source and modern figure pixels are outside this author scope.",
    ],
    "mechanical_validation": {"status": "pass", "report": binding(CHECK)},
    "native_inputs": {
        "edition": binding(SKILL / "tools/edition.py"),
        "mathcheck": binding(SKILL / "tools/mathcheck.py"),
        "profile": binding(profile_path),
    },
    "helper": binding(Path(__file__).resolve()),
    "independent_science_review": "pending",
    "no_finalize_promotion_durable_source_tool_app_db_git_browser_or_dependency_operations": True,
    "in_flight_processes": 0,
}
dump(FREEZE, record)
print(json.dumps({
    "freeze": binding(FREEZE), "templates": record["templates"],
    "counts": record["counts"], "mechanical_status": "pass",
    "independent_science_review": "pending", "in_flight_processes": 0,
}, ensure_ascii=False, indent=2))
