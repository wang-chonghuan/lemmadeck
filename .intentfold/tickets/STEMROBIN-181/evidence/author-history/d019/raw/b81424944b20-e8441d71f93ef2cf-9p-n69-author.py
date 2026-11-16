"""Snapshot and freeze n69 prose with one native author structural check."""

import copy
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path.cwd()
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

CARD = "phy9-c2-s2-n69"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
SOURCE = BOOK / "lessons" / CARD
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons" / CARD
BEFORE = TMP / "9p-n69-before"
FREEZE = TMP / "9p-n69-prose-freeze.json"
TEMPLATES = ("lesson.template.json", "exercises.template.json", "figures.template.json")
STARTS = ("**导体内部的电场**", "**静电屏蔽**", "**导体上的电荷**")


def bind(path):
    return {"path": path.relative_to(ROOT).as_posix(), "sha256": edition.sha256(path)}


def new_json(path, value):
    assert not path.exists(), f"Preserve existing evidence: {path}"
    edition.dump(path, value)


def snapshot():
    assert not BEFORE.exists() and not FREEZE.exists()
    BEFORE.mkdir()
    record = {"lesson": CARD, "templates": {}, "source": {}}
    for name in TEMPLATES:
        shutil.copyfile(WORK / name, BEFORE / name)
        assert edition.sha256(WORK / name) == edition.sha256(BEFORE / name)
        record["templates"][name] = {
            **bind(BEFORE / name), "originalPath": (WORK / name).relative_to(ROOT).as_posix(),
        }
    for name in ("lesson.json", "lesson.md", "exercises.json"):
        record["source"][name] = bind(SOURCE / name)
    new_json(BEFORE / "bindings.json", record)
    print(json.dumps(record, ensure_ascii=False, indent=2))


def freeze():
    assert not FREEZE.exists(), "Do not repeat the author structural check"
    record = edition.load(BEFORE / "bindings.json")
    for name, item in record["templates"].items():
        assert edition.sha256(BEFORE / name) == item["sha256"]
    for item in record["source"].values():
        assert edition.sha256(ROOT / item["path"]) == item["sha256"]
    before = edition.load(BEFORE / TEMPLATES[0])
    raw = edition.load(SOURCE / "lesson.json")
    raw_exercises = edition.load(SOURCE / "exercises.json")
    lesson = edition.load(WORK / TEMPLATES[0])
    exercises = edition.load(WORK / TEMPLATES[1])
    assert lesson["section_breaks"] == []

    # Normalize first, then select literal adjacent anchors from the native outline.
    edition.normalize_lesson_layout(lesson)
    outline_run = subprocess.run(
        ["node", str(TOOLS / "prose_flow.mjs"), "--stdin"],
        input=json.dumps(lesson, ensure_ascii=False), text=True, capture_output=True, check=True,
    )
    outline = json.loads(outline_run.stdout)["paragraphs"]
    boundaries = []
    for start in STARTS:
        matches = [index for index, item in enumerate(outline) if item["text"].startswith(start)]
        assert len(matches) == 1 and matches[0] > 0, f"Ambiguous boundary: {start}"
        index = matches[0]
        boundaries.append({"before": outline[index - 1]["text"], "after": outline[index]["text"]})
    lesson["section_breaks"] = boundaries
    edition.dump(WORK / TEMPLATES[0], lesson)
    flow_evidence = TMP / "9p-n69-native-prose-flow.json"
    new_json(flow_evidence, {"paragraphs": outline, "section_breaks": boundaries})

    profile_path = TOOLS.parent / "profiles/modern-us-neutral.json"
    profile = edition.load(profile_path)
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    errors = edition.validate_source(BOOK, lesson["source"], SOURCE / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], SOURCE / "exercises.json", "exercises")
    errors += edition.validate_identity_fields(raw, lesson, edition.IDENTITY_FIELDS, "lesson")
    _, errata_errors = edition.validate_errata(BOOK, raw, raw_exercises, lesson, exercises)
    errors += errata_errors
    assert lesson["source"] == before["source"] and lesson["source"]["data"] == raw
    assert len(lesson["prose"]) == len(raw["prose"]) == 18
    assert lesson["figures"] == raw["figures"] == before["figures"] and len(raw["figures"]) == 4
    assert lesson["errata"] == before["errata"] == []
    assert raw["exercise_count"] == raw_exercises["count"] == exercises["count"] == 0
    assert raw_exercises["exercises"] == exercises["exercises"] == []
    assert exercises == edition.load(BEFORE / TEMPLATES[1])
    coverage = []
    for index, (original, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        label = f"lesson.prose[{index}]"
        assert modern["source_text"] == original["text"]
        errors += edition.validate_identity_fields(
            original, modern, ("kind", "id", "label", "printed_page", "source_refs"), label,
        )
        errors += edition.validate_text(
            original["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            label, forbidden, modern["historical_entities"],
        )
        old_math = [item.group(0) for item in edition.MATH.finditer(original["text"])]
        new_math = [item.group(0) for item in edition.MATH.finditer(modern["text"])]
        digits = lambda text: re.findall(r"\d+", edition.MATH.sub("", text))
        old_digits, new_digits = digits(original["text"]), digits(modern["text"])
        if old_math != new_math:
            errors.append(f"{label}: exact source formula drift")
        if old_digits != new_digits:
            errors.append(f"{label}: literal numeric drift")
        if original["kind"] in ("fig", "cap"):
            assert modern == before["prose"][index], f"Placeholder changed: {label}"
        coverage.append({
            "target": label, "kind": original["kind"], "source_refs": original["source_refs"],
            "sourceSnapshotUnchanged": True, "exactMathUnchanged": old_math == new_math,
            "sourceMath": old_math, "modernMath": new_math,
            "sourceLiteralDigits": old_digits, "modernLiteralDigits": new_digits,
            "changes": modern["changes"],
        })
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    if normalized != lesson:
        errors.append("Native normalization is not stable")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow_errors
    assert [{"before": item["before"], "after": item["after"]} for item in flow["boundaries"]] == boundaries
    for name in TEMPLATES[1:]:
        assert edition.sha256(WORK / name) == record["templates"][name]["sha256"]
    paths = {
        "sourceLesson": SOURCE / "lesson.json", "sourceMarkdown": SOURCE / "lesson.md",
        "sourceExercises": SOURCE / "exercises.json", "lessonTemplate": WORK / TEMPLATES[0],
        "exercisesTemplate": WORK / TEMPLATES[1], "figuresTemplate": WORK / TEMPLATES[2],
        "beforeBindings": BEFORE / "bindings.json", "helper": Path(__file__).resolve(),
        "nativeProseFlowEvidence": flow_evidence, "nativeEdition": TOOLS / "edition.py",
        "nativeProseFlow": TOOLS / "prose_flow.mjs", "nativeHtmlFragment": TOOLS / "htmlfrag.js",
        "lessonSkill": TOOLS.parent / "SKILL.md",
        "textContract": TOOLS.parent / "references/edition-text-contract.md", "profile": profile_path,
    }
    source_pages = sorted({int(ref.split("#")[0][1:]) for item in raw["prose"] for ref in item["source_refs"]})
    report = {
        "ticket": "STEMROBIN-181", "batch": "D019", "lesson": CARD,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science" if not errors else "author-structural-blocked",
        "bindings": {key: bind(path) for key, path in paths.items()},
        "before": record["templates"],
        "sourcePages": [bind(BOOK / "pages" / f"{page:04d}" / "page.json") for page in source_pages],
        "prepare": {"performedByMain": True, "repeatedByThisAuthor": False},
        "sourceBlocks": len(raw["prose"]), "modernParagraphs": len(flow["paragraphs"]),
        "sourceFigures": raw["figures"], "originalTasks": 0, "modernTasks": 0,
        "coverage": coverage, "sectionBreaks": boundaries, "nativeProseFlow": flow,
        "footnote": {"source_refs": ["p0173#8"], "labelRetained": "footnote", "markerRetained": "①"},
        "authorConditions": [
            "自由电子与电子气保留为金属的简化模型，不将电子运动等同于经典理想气体或无阻力运动。",
            "导体材料内部无宏观合电场限定于静电平衡；保留微观电场脚注，不宣称每个瞬时微观场为零。",
            "感应过程与能量耗散区别于外部持续供能的电流；图123只作初始或分解场的示意。",
            "区分导体材料与空腔；无腔内电荷的闭合静电屏蔽条件明确，网孔屏蔽不宣称绝对或适用所有频率。",
            "表面电荷指净余电荷，不是电子和离子不存在；带电空腔内壁可有感应电荷。",
            "图124保留原书轻薄片与装置描述及锡箔/金箔措辞差异；偏转只在接触、平衡和屏蔽条件下解释。",
        ],
        "nativeAuthorCheck": {
            "invocations": 1, "status": "pass" if not errors else "fail", "errors": errors,
            "sourceSnapshotsAndBlockOrderUnchanged": True,
            "exactMathAndLiteralNumbersUnchanged": not errors,
            "figureCaptionBlocksAndOtherTemplatesUnchanged": True,
            "normalizationStable": normalized == lesson,
            "scope": "Current native source/identity/errata/text/flow structure only; not independent science approval.",
        },
        "blockers": errors,
        "remaining": ["Main independent science gate"],
        "noSourcePixelOrFigureReview": True,
        "noIndependentApprovalOrFinalizeRenderBrowserDbIndexGit": True,
        "inFlightProcesses": [],
    }
    new_json(FREEZE, report)
    print(json.dumps({
        "status": report["status"], "nativeAuthorCheck": report["nativeAuthorCheck"],
        "sourceBlocks": 18, "modernParagraphs": len(flow["paragraphs"]), "sectionBreaks": len(boundaries),
        "template": bind(WORK / TEMPLATES[0]), "freeze": bind(FREEZE),
    }, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)


if sys.argv[1:] == ["snapshot"]:
    snapshot()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected snapshot or freeze")
