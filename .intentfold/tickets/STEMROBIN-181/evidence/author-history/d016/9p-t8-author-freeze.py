import copy
import hashlib
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import edition
import mathcheck


LESSON_ID = "phy9-c1-s6-t8"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
TARGET = ROOT / f".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/{LESSON_ID}"
REPORT = Path(__file__).with_name("9p-t8-prose-freeze.json")
BASELINE_HASHES = {
    "lessonTemplate": "50f1bbfa0244af9a01b83943f537394265f2357095590dffeb3912005fa5cce0",
    "exercisesTemplate": "86c5d27b4fb49c120969bdf18ccb5d0d75009c09f22bd71bf683b1d5719cf21d",
    "figuresTemplate": "e21f7864d769910cccb696eacc73d63a7b5498f04696399ab5eef26899070286",
    "sourceLesson": "fe6124d7de3148b3c65133fc6cfd7730e88f994a092c3602447820da483d8ffb",
    "sourceExercises": "a8517ca8a03ae7afc3c00a1c5bf24b1eacb2bc32960e9486a077b87e3fe83a1c",
}
RATIONALES = {
    "1": "保留各向异性是否足以判断晶体的开放解释；限定同种性质与测量条件，区分单晶、随机或择优取向多晶、定向或受力非晶材料，避免普遍的是非结论。",
    "2": "保留假设玻璃为晶体时吹制职业是否仍存在的原问；明确熔点以下软化模型与液态加工不同，未给出的黏度、结晶速度和保形条件不能由分类推出；仅作理论讨论。",
    "3": "保留食糖、琥珀、铝的全部分类对象；限定常见室温样品与普通颗粒状食糖，区分单晶、多晶分类和外部晶面。",
    "4": "保留图77、摩尔质量0.058千克/摩尔及密度2200千克/米^3；将原称分子量现代化为摩尔质量。图仅为外部立方外观，不显示离子或刻度。题设另明确三维交替简单立方离子位点及等价岩盐子晶格，目标为最近异种离子距离；单位体积总离子数2rhoNA/M以中文等价叙述，不新增或改动数学区。",
    "5": "保留应力、直径和轴向作用力原问；限定圆形截面、中心静载、均匀轴向应力，忽略自重与弯曲。",
    "6": "保留墙高、砖密度、地基应力及上下砖材强度比较两个原问；限定等截面均匀墙自重模型，区分实际承受应力与所需抗压强度，不提供建筑设计建议。",
    "7": "保留钢丝自重拉断的最短长度原问及强度、密度；明确上端固定、下端自由且无外挂载荷的均匀模型，仅作理论估算。",
    "8": "保留长度、截面积、力、伸长量及应力和杨氏模量两个求解目标；限定均匀轴向静载和线性弹性，忽略温度变化与自重。",
    "9": "保留子弹撞墙完全熔化原问和全部材料、温度数据；明确停止后的全部动能仅供自身升温熔化、恒定比热容及温差与绝对温标的区别；仅作理论计算，不新增实验。",
    "10": "保留水质量、初末温和冰初温及求冰质量原问；限定常压、绝热、忽略容器热容量和质量损失的热平衡模型，使用既有教材物性，不编造新物性数值。",
    "11": "保留水、冰、蒸汽的全部质量与温度及平衡温度原问；限定常压、蒸汽全部凝结并保留的绝热衡算，忽略容器热容量和宏观机械能变化，不预设所有冰已熔化。",
}


def binding(path):
    document = edition.load(path)
    canonical = json.dumps(
        document, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "sha256": edition.sha256(path),
        "canonicalSha256": hashlib.sha256(canonical).hexdigest(),
    }


def main():
    if REPORT.exists():
        raise SystemExit(f"Refusing to overwrite existing freeze: {REPORT}")
    paths = {
        "sourceLesson": BOOK / f"lessons/{LESSON_ID}/lesson.json",
        "sourceExercises": BOOK / f"lessons/{LESSON_ID}/exercises.json",
        "lessonTemplate": TARGET / "lesson.template.json",
        "exercisesTemplate": TARGET / "exercises.template.json",
        "figuresTemplate": TARGET / "figures.template.json",
    }
    bindings = {name: binding(path) for name, path in paths.items()}
    raw_lesson = edition.load(paths["sourceLesson"])
    raw_exercises = edition.load(paths["sourceExercises"])
    lesson = edition.load(paths["lessonTemplate"])
    exercises = edition.load(paths["exercisesTemplate"])
    profile = edition.load(TOOLS.parent / "profiles/modern-us-neutral.json")
    forbidden = (
        profile.get("forbidden_terms", [])
        + profile.get("forbidden_person_names", [])
    )
    errors = []
    for name in ("sourceLesson", "sourceExercises", "lessonTemplate", "figuresTemplate"):
        if bindings[name]["sha256"] != BASELINE_HASHES[name]:
            errors.append(f"{name}: bytes changed since targeted adapt-prepare")
    for name, document, source_name in (
        ("lesson", lesson, "sourceLesson"),
        ("exercises", exercises, "sourceExercises"),
    ):
        errors += edition.validate_source(
            BOOK, document.get("source"), paths[source_name], name
        )
    corrections, errata_errors = edition.validate_errata(
        BOOK, raw_lesson, raw_exercises, lesson, exercises
    )
    errors += errata_errors
    normalized = copy.deepcopy(exercises)
    edition.normalize_exercise_layout(normalized)
    if normalized != exercises:
        errors.append("Native exercise normalization would change the authored draft")
    wanted_numbers = [str(number) for number in range(1, 12)]
    if (
        exercises.get("count") != 11
        or raw_exercises.get("count") != 11
        or [item["number"] for item in exercises["exercises"]] != wanted_numbers
    ):
        errors.append("All 11 ordered written source tasks are required")
    if lesson.get("prose") or lesson.get("section_breaks"):
        errors.append("The source exercise card has no prose or concept boundaries")
    native_results = []
    fields = (
        "number", "source_number", "group", "group_id",
        "pages", "figure_refs", "figures",
    )
    for index, (source, item) in enumerate(
        zip(raw_exercises["exercises"], exercises["exercises"])
    ):
        label = f"exercises[{index}]"
        item_errors = edition.validate_identity_fields(source, item, fields, label)
        item_errors += edition.validate_text(
            source["text"],
            item.get("text"),
            item.get("changes"),
            item.get("numeric_changes"),
            label,
            forbidden,
            item.get("historical_entities"),
            corrections.get(label),
            item.get("notation_changes"),
        )
        item_errors += edition.validate_numbered_subpart_layout(item.get("text"))
        prepared = copy.deepcopy(source)
        prepared_text = edition.normalize_numbered_subparts(source["text"])
        prepared.update({
            "text": prepared_text,
            "lines": prepared_text.splitlines(),
            "source_text": source["text"],
            "changes": ["layout"] if prepared_text != source["text"] else [],
            "numeric_changes": [],
            "historical_entities": [],
        })
        delta = [
            key for key in sorted(set(item) | set(prepared))
            if item.get(key) != prepared.get(key)
            or (key in item) != (key in prepared)
        ]
        if not set(delta) <= {"text", "lines", "changes"}:
            item_errors.append(f"Unexpected changed fields: {delta}")
        if item.get("source_text") != source["text"]:
            item_errors.append("Source text snapshot drift")
        if item.get("lines") != item["text"].splitlines():
            item_errors.append("Authored text and lines disagree")
        if mathcheck.find_math_spans(source["text"]) != mathcheck.find_math_spans(item["text"]):
            item_errors.append("Raw source math tokens changed")
        errors += item_errors
        native_results.append({
            "number": item["number"],
            "status": "pass" if not item_errors else "fail",
            "changedFields": delta,
            "sourceRefs": source["pages"],
            "mathTokensExact": (
                mathcheck.find_math_spans(source["text"])
                == mathcheck.find_math_spans(item["text"])
            ),
            "numberSignature": edition.number_signature(item["text"]),
            "rationale": RATIONALES[item["number"]],
            "errors": item_errors,
        })
    math_errors, math_warnings = mathcheck.collect_and_check(
        [{"id": item["number"], "text": item["text"]} for item in exercises["exercises"]],
        lambda item: [("text", item["text"])],
    )
    errors += math_errors
    flow = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors += flow[1]
    snapshots_unchanged = (
        lesson["source"]["data"] == raw_lesson
        and exercises["source"]["data"] == raw_exercises
    )
    if not snapshots_unchanged:
        errors.append("Prepared complete source snapshots changed")
    source_root_fields = {
        key: value for key, value in exercises.items()
        if key not in {"exercises", "schema", "edition", "status", "source"}
    }
    if source_root_fields != {
        key: value for key, value in raw_exercises.items() if key != "exercises"
    }:
        errors.append("Unexpected exercise document identity change")
    report = {
        "ticket": "STEMROBIN-181",
        "lesson": LESSON_ID,
        "role": "written-exercise-author-only",
        "status": "frozen-pending-independent-science-review" if not errors else "blocked",
        "bindings": bindings,
        "preparedBaselineSha256": BASELINE_HASHES,
        "nativePrepare": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 9p --edition modern-us-neutral --lesson phy9-c1-s6-t8",
            "exitCode": 0,
            "output": "[adapt-prepare] phy9-c1-s6-t8: 正文 0 块, 题 11 道, 图 0 张",
        },
        "authored": {
            "path": bindings["exercisesTemplate"]["path"],
            "taskCount": exercises["count"],
            "allWrittenTasksRetained": True,
            "sourceSnapshotsUnchanged": snapshots_unchanged,
            "onlyFieldsChanged": ["exercises[*].text", "exercises[*].lines", "exercises[*].changes"],
            "lessonTemplateBytesUnchanged": bindings["lessonTemplate"]["sha256"] == BASELINE_HASHES["lessonTemplate"],
            "figuresTemplateBytesUnchanged": bindings["figuresTemplate"]["sha256"] == BASELINE_HASHES["figuresTemplate"],
            "numericChanges": [],
            "mathCorrections": [],
            "newTasks": [],
            "choicesOrAnswersAuthoredOrConsulted": False,
        },
        "sharedFigure": {
            "id": "fig-77",
            "sourceTask": "4",
            "figureRefs": exercises["exercises"][3]["figure_refs"],
            "figures": exercises["exercises"][3]["figures"],
            "localSourceLessonFigureCount": len(raw_lesson["figures"]),
            "meaning": "External cubic salt appearance only; no ion locations, scale or measured spacing.",
            "calculationModel": "Alternating three-dimensional simple-cubic ion sites, equivalent rock-salt sublattices; nearest unlike-ion centers. Total ion count per unit volume 2rhoNA/M is stated in equivalent Chinese prose, outside unchanged source math tokens.",
            "mediaWork": "Not authored, rendered, reviewed, removed or promoted here. Main owns reuse and current t8 context rebind of the existing independently approved asset.",
            "remainingGate": "Main shared-media context binding and promotion, separate from this written draft.",
        },
        "nativeValidation": {
            "command": ".claude/skills/ld-s10y-lesson/.venv/bin/python -B .intentfold/tickets/STEMROBIN-181/tmp/9p-t8-author-freeze.py",
            "status": "pass" if not errors else "fail",
            "sourceBinding": "native edition.validate_source + edition.validate_errata",
            "text": "native edition.validate_text for all 11 source questions",
            "identity": "number/source_number/group/group_id/pages/figure_refs/figures unchanged",
            "math": "raw tokens exact; native delimiter and KaTeX checks",
            "numbers": "native number signatures match source exactly; no numeric replacement",
            "layout": "native normalize_exercise_layout is an exact no-op",
            "katexWarnings": math_warnings,
            "perTask": native_results,
            "errors": errors,
        },
        "proseFlow": {
            "command": "node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json .tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c1-s6-t8/lesson.template.json",
            "exitCode": 0,
            "output": {"paragraphs": [], "resolvedBreaks": [], "boundaries": []},
            "reason": "No prose in this source card; no section boundaries invented.",
        },
        "independentReview": "pending; no author science or figure approval",
        "noPromotionFinalizeDbBrowserNetworkGitOrOtherChatActions": True,
        "inFlightProcesses": [],
    }
    edition.dump(REPORT, report)
    print(json.dumps({
        "status": report["status"],
        "report": binding(REPORT),
        "exerciseTemplate": bindings["exercisesTemplate"],
        "nativeValidation": report["nativeValidation"]["status"],
        "taskCount": exercises["count"],
        "errors": errors,
        "katexWarnings": math_warnings,
    }, ensure_ascii=False, indent=2))
    return int(bool(errors))


if __name__ == "__main__":
    raise SystemExit(main())
