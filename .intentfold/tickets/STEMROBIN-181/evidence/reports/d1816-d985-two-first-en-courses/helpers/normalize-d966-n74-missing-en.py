import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd().resolve() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

out = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d966-n74-missing-en"
inputs = edition.load(out / "inputs.json")
lesson = edition.load(Path(inputs["englishBeforeNative"]["path"]))
raw = edition.load(Path(inputs["source"]["path"]))
zh = edition.load(Path(inputs["approvedZh"]["path"]))
profile = edition.load(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
assert len(lesson["prose"]) == len(raw["prose"]) == 25
edition.normalize_lesson_layout(lesson)
flow, errors = edition.prose_flow_contract(lesson["prose"], [])
boundaries = []
for heading in ("**Electric potential**", "**Potential difference**", "**The unit of potential difference**"):
    indices = [index for index, paragraph in enumerate(flow["paragraphs"])
               if paragraph["text"].startswith(heading)]
    assert len(indices) == 1 and indices[0] > 0, (heading, indices)
    index = indices[0]
    boundaries.append({"before": flow["paragraphs"][index - 1]["text"], "after": flow["paragraphs"][index]["text"]})
lesson["section_breaks"] = boundaries
resolved, flow_errors = edition.prose_flow_contract(lesson["prose"], boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw, lesson))
for index, (source, modern, approved) in enumerate(zip(raw["prose"], lesson["prose"], zh["prose"])):
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(
        source, modern, ["kind", "id", "label", "printed_page", "source_refs"], f"en.prose[{index}]",
    ))
    errors.extend(edition.validate_text(
        source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
        f"en.prose[{index}]", profile["forbidden_terms"] + profile["forbidden_person_names"],
        modern.get("historical_entities"),
    ))


def bind(file):
    return {"path": str(file.resolve()), "bytes": file.stat().st_size,
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(file, data):
    with file.open("x") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


candidate = out / "en.lesson.draft.json"
flow_file = out / "en.prose-flow.json"
save(candidate, lesson)
save(flow_file, resolved)
report = out / "authored.json"
save(report, {
    **inputs, "status": "FIRST_MISSING_EN_NATIVE_PASS" if not errors else "FIRST_MISSING_EN_NATIVE_FAIL",
    "englishDraft": bind(candidate), "englishFlow": bind(flow_file), "errors": errors,
    "derivedConceptBoundaries": len(boundaries), "englishIndependentSCI_ZHEN": "pending",
    "historicalZhScienceAndSourceReplayed": False,
    "englishWholeCourseApproved": False, "newCompleteCourses": 0, "newSourcePages": 0,
})
print(json.dumps({"report": bind(report), "status": "PASS" if not errors else "FAIL", "errors": errors}))
sys.exit(1 if errors else 0)
