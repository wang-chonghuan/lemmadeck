"""Repair only the omitted second source R token and refresh affected text bindings."""
import json
import sys
from pathlib import Path

W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition

T = W / ".tmp/STEMROBIN-181/d1816-d057/n22-work/adapt/10p"
F = W / ".tmp/STEMROBIN-181/d1816-d057/n22-figure-author"
A = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-author"
ID = "phy10-c1-s3-n22"
names = ("modern-us-neutral", "modern-us-neutral-en")

def read(p):
    return json.loads(p.read_text())

lessons = []
reports = []
for name in names:
    p = T / name / "lessons" / ID / "lesson.template.json"
    lesson = read(p)
    if name.endswith("-en"):
        old, new = "only resistance matters.", "only resistance $R$ matters."
    else:
        old, new = "只有电阻起作用", "只有电阻 $R$ 起作用"
    assert lesson["prose"][1]["text"].count(old) == 1
    lesson["prose"][1]["text"] = edition.normalize_prose_layout(
        lesson["prose"][1]["text"].replace(old, new))
    block = lesson["prose"][1]
    errors = edition.validate_text(block["source_text"], block["text"],
        block["changes"], block["numeric_changes"], "lesson.prose[1]", [],
        block["historical_entities"])
    assert not errors, errors
    assert edition.math_signature(block["source_text"]) == edition.math_signature(block["text"])
    p.write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + "\n")
    lessons.append(lesson)
    reports.append({"edition": name, "target": "lesson.prose[1]", "errors": errors,
        "sourceMath": edition.math_signature(block["source_text"]),
        "modernMath": edition.math_signature(block["text"]),
        "heldBareCyrillicBlocksRevalidated": False})
authority = [{
    "lesson": ID, "text": f"[{'EN' if name.endswith('-en') else 'ZH'}] {lesson['title']}\n" +
        "\n\n".join(b["text"] for b in lesson["prose"] if b["text"])
} for name, lesson in zip(names, lessons)]
for name in names:
    folder = F / name / "lessons" / ID / "figures"
    for number in (34, 35):
        p = folder / f"fig-{number}.spec.json"
        spec = read(p)
        oldpath = A / "first-context" / name / f"fig-{number}.spec.json"
        oldpath.parent.mkdir(parents=True, exist_ok=True)
        oldpath.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n")
        spec["source"]["authoritativeText"] = authority
        p.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "firstFailure": "receipts/text-validate-readonly.json",
    "repair": "Restore the second $R$ in source order in prose[1] only.",
    "reports": reports,
    "textRevisionCount": 2,
    "affectedFigureBindingRefresh": "Complete bilingual authoritative text changed; geometry, labels, display and assertions remain unchanged.",
}, ensure_ascii=False, indent=2))
