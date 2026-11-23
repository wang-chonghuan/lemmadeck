"""Bounded text authoring; all output stays beside this script."""

import copy
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n34-text-author7"
PREPARATION = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/"
    "stemrobin188-6g-n34/preparation7"
)
TEMPLATES = PREPARATION / (
    "work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n34"
)
RAW = PREPARATION / "artifacts/6-8g/lessons/geo68-c3-s2-n34"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
assert Path.cwd() == ROOT
assert Path(__file__).resolve().parent == OWNED
sys.dont_write_bytecode = True
sys.path.insert(0, str(TOOLS))

import edition


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, value):
    assert path.parent == OWNED
    edition.dump(path, value)


def candidate(name):
    return OWNED / f"{name}.template.json"


def map_label(text):
    return text.replace("合同", "全等")


def create():
    for name in ("lesson", "exercises", "figures"):
        target = candidate(name)
        assert not target.exists(), f"Preserve existing file: {target}"
    for name in ("lesson", "exercises"):
        native = read_json(TEMPLATES / f"{name}.template.json")
        assert native["source"]["data"] == read_json(RAW / f"{name}.json")
    for name in ("lesson", "exercises", "figures"):
        shutil.copyfile(TEMPLATES / f"{name}.template.json", candidate(name))

    lesson = read_json(candidate("lesson"))
    exercises = read_json(candidate("exercises"))
    for item in lesson["prose"] + exercises["exercises"]:
        text = item["text"]
        updated = map_label(text)
        if updated != text:
            item["text"] = updated
            if "historical-label" not in item["changes"]:
                item["changes"].append("historical-label")
    ex447 = next(item for item in exercises["exercises"] if item["number"] == "447")
    original_tail = "有一个公共点。回答以下的问题："
    assert ex447["text"].count(original_tail) == 1
    ex447["text"] = ex447["text"].replace(
        original_tail, "有一个公共点。\n\n回答以下的问题：", 1
    )
    if "layout" not in ex447["changes"]:
        ex447["changes"].append("layout")
    edition.normalize_lesson_layout(lesson)
    edition.normalize_exercise_layout(exercises)
    for item in exercises["exercises"]:
        item["lines"] = item["text"].splitlines()
    write_json(candidate("lesson"), lesson)
    write_json(candidate("exercises"), exercises)


def flow():
    result = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), str(candidate("lesson"))],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    )
    (OWNED / "prose-flow.txt").write_text(result.stdout, encoding="utf-8")
    print(result.stdout, end="")
    return result.stdout


def compact(text):
    return re.sub(r"\s+", "", text)


def formulas(text):
    return [match.group() for match in edition.MATH.finditer(text)]


def only_fields_changed(native, authored, allowed):
    assert native.keys() == authored.keys()
    for key in native:
        if key not in allowed:
            assert native[key] == authored[key], key


def record():
    lesson = read_json(candidate("lesson"))
    exercises = read_json(candidate("exercises"))
    native_lesson = read_json(TEMPLATES / "lesson.template.json")
    native_exercises = read_json(TEMPLATES / "exercises.template.json")
    assert lesson["source"] == native_lesson["source"]
    assert exercises["source"] == native_exercises["source"]
    only_fields_changed(native_lesson, lesson, {"prose", "section_breaks"})
    only_fields_changed(native_exercises, exercises, {"exercises"})
    assert len(lesson["prose"]) == len(native_lesson["prose"]) == 15
    assert sum(item["kind"] == "p" for item in lesson["prose"]) == 12
    assert len(lesson["figures"]) == 2
    assert len(exercises["exercises"]) == exercises["count"] == 4
    assert [item["number"] for item in exercises["exercises"]] == [
        "446", "447", "448", "449"
    ]
    assert candidate("figures").read_bytes() == (
        TEMPLATES / "figures.template.json"
    ).read_bytes()
    changes = []
    collections = [
        ("lesson.prose", native_lesson["prose"], lesson["prose"]),
        ("exercises.exercises", native_exercises["exercises"], exercises["exercises"]),
    ]
    for collection, originals, authored in collections:
        for index, (before, after) in enumerate(zip(originals, authored, strict=True)):
            allowed = {"text", "changes"}
            if collection == "exercises.exercises":
                allowed.add("lines")
            only_fields_changed(before, after, allowed)
            assert compact(after["text"]) == compact(map_label(before["text"]))
            assert formulas(after["text"]) == formulas(before["text"])
            assert formulas(after["text"]) == formulas(before["source_text"])
            assert edition.number_signature(after["text"]) == edition.number_signature(
                before["source_text"]
            )
            assert after["text"].count("▼") == before["text"].count("▼")
            for field in allowed:
                if before[field] != after[field]:
                    changes.append({
                        "target": f"{collection}[{index}].{field}",
                        "source_refs": after.get("source_refs", after.get("pages", [])),
                        "before": before[field],
                        "after": after[field],
                    })
    normalized_lesson = copy.deepcopy(lesson)
    normalized_exercises = copy.deepcopy(exercises)
    edition.normalize_lesson_layout(normalized_lesson)
    edition.normalize_exercise_layout(normalized_exercises)
    assert normalized_lesson == lesson
    assert normalized_exercises == exercises
    ex447 = exercises["exercises"][1]
    assert ex447["lines"] == [
        "已知关系：",
        "1）多边形$L$和$L_1$有同样的面积；",
        "2）线段$x$和$y$关于已知的中心$O$对称；",
        "3）直线$a$和$b$有一个公共点。",
        "",
        "回答以下的问题：上述关系具有自反性、对称性和传递性吗？它们是等价关系吗？",
    ]
    flow_text = flow()
    offered_boundaries = [
        json.loads(line.split("break: ", 1)[1])
        for line in flow_text.splitlines()
        if line.startswith("    break: ")
    ]
    assert len(lesson["section_breaks"]) == 2
    assert all(boundary in offered_boundaries for boundary in lesson["section_breaks"])
    if lesson["section_breaks"] != native_lesson["section_breaks"]:
        changes.append({
            "target": "lesson.section_breaks",
            "before": native_lesson["section_breaks"],
            "after": lesson["section_breaks"],
            "basis": "Exact adjacent-paragraph boundary objects from prose_flow.mjs output.",
        })
    hashes = {
        name: {
            "path": str(candidate(name)),
            "sha256": hashlib.sha256(candidate(name).read_bytes()).hexdigest(),
        }
        for name in ("lesson", "exercises", "figures")
    }
    report = {
        "role": "bounded N34 TEXT AUTHOR only; not independent review",
        "ticket": "STEMROBIN-188",
        "lesson": "geo68-c3-s2-n34",
        "status": "draft text candidates returned; N34 is not complete",
        "cwd": str(ROOT),
        "write_scope": str(OWNED),
        "inputs": [
            str(TEMPLATES / f"{name}.template.json")
            for name in ("lesson", "exercises", "figures")
        ] + [str(RAW / f"{name}.json") for name in ("lesson", "exercises")],
        "candidates": hashes,
        "summary": [
            "Historical mathematical label 合同 -> 全等 in lesson p0159#7, p0159#9, "
            "p0160#4 and exercise 446/p0161#3; relation and formulas unchanged.",
            "Exercise 447: newline boundary after 有一个公共点。 separates the shared "
            "questions from subpart 3; all three numbered subparts retain wording and order.",
            "Current native normalize_lesson_layout and normalize_exercise_layout run on "
            "owned copies; exercise lines synchronized with the candidate text.",
            "Two concept transitions only: relation notation -> relation properties; "
            "equivalence definition -> partitions/equivalence classes.",
            "Figures template is copied byte-for-byte for reference only; no image or "
            "FigureSpec creation, inspection, approval or completion is claimed.",
        ],
        "exact_changes": changes,
        "math_correction_proposals": [],
        "proposal_note": "No exact mathematical correction is established by these permitted "
        "text inputs. No correction applied; errata remains the native empty array.",
        "author_preservation_checks": {
            "native_source_and_all_non_owned_fields_unchanged": True,
            "source_entries": 15,
            "text_entries": 12,
            "original_figure_references": 2,
            "exercises": ["446", "447", "448", "449"],
            "exercise447_complete_ordered_subparts": 3,
            "exact_formula_spans_and_nonformula_values_preserved": True,
            "unknown_triangle_markers_preserved": 2,
            "native_layout_idempotent": True,
            "section_breaks_from_prose_flow_exact_adjacent_paragraphs": True,
        },
        "limits": [
            "Source160 unknown glyph/printing roles, including the triangle marker, "
            "remain unknown. No source PASS and no human-waiting gate is assigned.",
            "Historical infinity-over-equals notation remains exactly as supplied. "
            "No replacement notation, added definition or semantic resolution.",
            "The stated parallel-relation convention and exercise449's quoted definition "
            "are preserved; no self-coincidence premise is added or removed.",
            "p0161#1 continuation and the reference to section35 remain unchanged apart "
            "from native layout. No source161 repair or source-page edit.",
            "Prior failures were not inspected, overwritten, reclassified or superseded.",
            "Only the supplied native templates/raw lesson and exercises were used as "
            "content inputs. No images, answers, choices, old interaction configurations "
            "or other reviews were read.",
            "No render, finalize, canonical artifact/index write, publication, commit, "
            "git, network, database, environment access, installation, bootstrap, "
            "freshness gate, package hashing, subagent or message operation.",
            "Author preservation checks are not source approval, substantive independent "
            "review, visual acceptance or full lesson completion. Parent owns canonical "
            "artifacts and commits.",
        ],
    }
    write_json(OWNED / "author-record.json", report)
    print(json.dumps(hashes, indent=2))


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "create":
        create()
        flow()
    elif mode == "record":
        record()
    else:
        raise SystemExit("Use create or record.")
