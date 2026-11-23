"""Mechanically serialize explicitly authored question/option records."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path.cwd()
BASE = ROOT / ".tmp/stemrobin-184-six/c6-resume"
AUTHOR = BASE / "author"
frozen = json.loads((AUTHOR / "source-solving.json").read_text())
freeze = json.loads((AUTHOR / "source-freeze.json").read_text())
for name, digest in freeze["file_sha256"].items():
    assert hashlib.sha256((AUTHOR / name).read_bytes()).hexdigest() == digest
solutions = {r["source_number"]: r["independent_solution"]
             for r in frozen["source_records"]}
questions = []


def question(number, suffix, mode, stem, task, unit_reason, options, losses=()):
    """Package literal records; no solving, option generation or semantic checking."""
    qid = f"c6-{number}{suffix}"
    assert len(options) >= 2
    questions.append({
        "id": qid,
        "source_numbers": [str(number)],
        "view": {
            "mode": mode,
            "stem": stem,
            "figure_ids": [],
            "options": [{"id": oid, "text": text, "figure_ids": []}
                        for oid, text, truth, derivation, mistake in options],
        },
        "intent": {
            "task": task,
            "source_solution": solutions[str(number)],
            "unit_reason": unit_reason,
            "concept_blocks": [],
            "limitations": list(losses),
            "figure_observations": [],
        },
        "key": {
            "correct": [oid for oid, text, truth, derivation, mistake in options
                        if truth],
            "rationales": [{
                "option_id": oid,
                "truth": "correct" if truth else "incorrect",
                "derivation": derivation,
                "misconception": mistake,
            } for oid, text, truth, derivation, mistake in options],
        },
    })


exec(compile((AUTHOR / "records-335-356.py").read_text(),
             str(AUTHOR / "records-335-356.py"), "exec"))
exec(compile((AUTHOR / "records-357-377.py").read_text(),
             str(AUTHOR / "records-357-377.py"), "exec"))
exec(compile((AUTHOR / "records-378-391.py").read_text(),
             str(AUTHOR / "records-378-391.py"), "exec"))

seed_digest = subprocess.run(
    ["python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest",
     str(BASE / "seed.json")],
    check=True, capture_output=True, text=True,
).stdout.strip()
assert seed_digest == frozen["seed_sha256"]
coverage = []
for source in frozen["source_records"]:
    number = source["source_number"]
    items = [q for q in questions if number in q["source_numbers"]]
    losses = list(dict.fromkeys(loss for q in items
                                for loss in q["intent"]["limitations"]))
    coverage.append({
        "source_number": number,
        "question_ids": [q["id"] for q in items],
        "omitted_tasks": losses,
        "reason": ("All substantive source tasks are represented by mathematical "
                   "recognition; named production/scaffolding losses are not "
                   "claimed as independently demonstrated abilities."
                   if losses else
                   "The complete mathematical result and its required conditions "
                   "are assessed as a coherent response unit."),
    })
draft = {
    "schema": "s10y-choice-draft-v1",
    "seed_sha256": seed_digest,
    "new_figures": [],
    "questions": questions,
    "coverage": coverage,
}
output = BASE / "draft.json"
assert not output.exists(), "Do not overwrite another worker's draft."
output.write_text(json.dumps(draft, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "questions": len(questions),
    "single": sum(q["view"]["mode"] == "single" for q in questions),
    "multiple": sum(q["view"]["mode"] == "multiple" for q in questions),
    "source_count": len(coverage),
    "held_sources": [c["source_number"] for c in coverage if not c["question_ids"]],
    "options": sum(len(q["view"]["options"]) for q in questions),
}))
