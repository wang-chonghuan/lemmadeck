#!/usr/bin/env python3
"""Prepare and validate production answer keys for selected lessons."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

LESSON_TOOLS = (
    Path(__file__).resolve().parents[2]
    / "ld-s10y-lesson"
    / "tools"
)
sys.path.insert(0, str(LESSON_TOOLS))

import assemble

SCHEMA = "ld-s10y-answer/lesson-answers@1"
JUDGES = {"exact", "numeric", "expression"}
MODERN_US_PROFILE = (
    Path(__file__).resolve().parents[2]
    / "ld-s10y-lesson"
    / "profiles"
    / "modern-us-neutral.json"
)
GRADING = {"auto", "ungraded"}
SOURCES = {"book", "derived", "reviewed"}
DEFAULT_ROOT = "ssot-resources/soviet10year-textbooks/artifacts"
DEFAULT_WORK = ".tmp/ld-s10y-answer"
TEXTBOOK_ROOT = (
    Path(__file__).resolve().parents[4]
    / "ssot-resources"
    / "soviet10year-textbooks"
)
REPO = Path(__file__).resolve().parents[4]
MATHLIVE_CHECK = Path(__file__).resolve().parent / "check_mathlive_exact.mjs"
OPTIONAL_IDENTITY_FIELDS = ("source_number", "group_id")
PRESERVED_IDENTITY_FIELDS = ("number", "group", "figure_refs", "figures")


def load(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"ERROR: 缺少 {path}")
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: {path} 不是有效 JSON: {error}")


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def selected_lessons(args: argparse.Namespace) -> list[str]:
    if not args.lesson:
        raise SystemExit("ERROR: 至少指定一个 --lesson")
    if len(args.lesson) != len(set(args.lesson)):
        raise SystemExit("ERROR: --lesson 有重复")
    return args.lesson


def book_dir(args: argparse.Namespace) -> Path:
    return Path(args.root) / args.book


def lessons_dir(args: argparse.Namespace) -> Path:
    root = book_dir(args)
    return root / "editions" / args.edition / "lessons"


def captured_answers(root: Path) -> list[dict]:
    path = root / "answers.json"
    if not path.exists():
        return []
    document = load(path)
    return [
        answer
        for answer in document.get("answers", [])
        if isinstance(answer, dict)
    ]


def exercise_numbering(root: Path) -> str:
    path = root / "book.json"
    if not path.exists():
        return "book"
    value = load(path).get("exercise_numbering", "book")
    if value not in {"book", "lesson", "lesson-group"}:
        raise SystemExit(f"ERROR: {path} exercise_numbering 非法: {value!r}")
    return value


def source_number(exercise: dict) -> object:
    return (
        exercise["source_number"]
        if "source_number" in exercise
        else exercise.get("number")
    )


def same_source_number(left: object, right: object) -> bool:
    if left is None or right is None:
        return left is right
    return str(left) == str(right)


def rebuilt_exercises(
    root: Path,
    book: str,
    lesson_ids: set[str],
) -> dict[str, dict]:
    stream = assemble.load_stream(root)
    if not stream:
        raise SystemExit(f"ERROR: {root}/pages 下没有 page.json，无法解析旧题栏目身份")
    merged, _ = assemble.merge_across_pages(stream)
    lessons = assemble.cut_lessons(merged)
    for lesson in lessons:
        lesson["prose"], lesson["exercises"] = assemble.split_lesson(
            lesson,
            "lesson-group",
        )
    figure_errors, _ = assemble.claim_figures(lessons, merged)
    if figure_errors:
        raise SystemExit(
            "ERROR: 无法从页级事实解析旧题栏目身份: " + "; ".join(figure_errors)
        )
    toc = TEXTBOOK_ROOT / "toc" / book / "zh.json"
    if not toc.is_file():
        raise SystemExit(f"ERROR: 缺少 {toc}，无法确定旧 lesson 身份")
    assemble.check_toc(
        lessons,
        toc,
        book,
        {block["printed_page"] for block in stream if block.get("printed_page") is not None},
    )
    by_id = {
        lesson["card_id"]: {
            "lesson": lesson["card_id"],
            "count": len(lesson["exercises"]),
            "exercises": lesson["exercises"],
        }
        for lesson in lessons
        if lesson.get("card_id") in lesson_ids
    }
    missing = sorted(lesson_ids - set(by_id))
    if missing:
        raise SystemExit(
            f"ERROR: 无法从页级事实和 TOC 确定旧 lesson: {', '.join(missing)}"
        )
    return by_id


def resolve_legacy_identities(
    lesson: str,
    source_doc: dict,
    exercise_doc: dict,
    rebuilt_doc: dict,
) -> list[dict]:
    if not assemble.can_reuse_exercises(source_doc, rebuilt_doc):
        raise SystemExit(
            f"ERROR: {lesson} 的旧 exercises.json 与页级事实不一致，"
            "无法确定 groupId"
        )
    source_items = source_doc.get("exercises", [])
    edition_items = exercise_doc.get("exercises", [])
    rebuilt_items = rebuilt_doc.get("exercises", [])
    if len(source_items) != len(edition_items):
        raise SystemExit(f"ERROR: {lesson} 的 edition 题目数量与原书不一致")

    resolved = []
    for index, (source, edition_item, rebuilt) in enumerate(
        zip(source_items, edition_items, rebuilt_items)
    ):
        label = f"{lesson}/exercises[{index}]"
        mismatches = [
            field
            for field in PRESERVED_IDENTITY_FIELDS
            if edition_item.get(field) != source.get(field)
        ]
        for field in OPTIONAL_IDENTITY_FIELDS:
            if field in source and edition_item.get(field) != source[field]:
                mismatches.append(field)
            elif field in edition_item and edition_item[field] != rebuilt.get(field):
                mismatches.append(field)
        if mismatches:
            raise SystemExit(
                f"ERROR: {label} 的 edition 身份与原书或页级事实不一致: "
                + ", ".join(dict.fromkeys(mismatches))
            )
        group_id = rebuilt.get("group_id")
        if not isinstance(group_id, str) or not group_id:
            raise SystemExit(f"ERROR: {label} 无法从页级事实确定 groupId")
        item = dict(edition_item)
        for field in OPTIONAL_IDENTITY_FIELDS:
            item[field] = rebuilt.get(field)
        resolved.append(item)
    return resolved


def captured_answer(
    answers: list[dict],
    lesson: str,
    exercise: dict,
    numbering: str,
) -> dict | None:
    printed_number = source_number(exercise)
    if numbering == "lesson-group":
        exercise_id = str(exercise.get("number"))
        matches = [
            answer
            for answer in answers
            if answer.get("lesson") == lesson
            and str(answer.get("exerciseId")) == exercise_id
        ]
        if len(matches) == 1:
            answer = matches[0]
            evidence = (
                ("groupId", exercise.get("group_id")),
                ("group", exercise.get("group")),
                ("sourceNumber", printed_number),
            )
            mismatches = [
                field
                for field, expected in evidence
                if field not in answer
                or (
                    not same_source_number(answer.get(field), expected)
                    if field == "sourceNumber"
                    else answer.get(field) != expected
                )
            ]
            if mismatches:
                raise SystemExit(
                    f"ERROR: {lesson}/{exercise_id} 的书后答案证据不一致: "
                    + ", ".join(mismatches)
                )
    elif printed_number is None:
        matches = []
    else:
        matches = [
            answer
            for answer in answers
            if str(answer.get("exercise")) == str(printed_number)
            and (numbering == "book" or answer.get("lesson") == lesson)
        ]
    if len(matches) > 1:
        raise SystemExit(
            f"ERROR: {lesson}/{exercise.get('number')} 匹配到多条书后答案"
        )
    return matches[0] if matches else None


def cmd_prepare(args: argparse.Namespace) -> int:
    root = book_dir(args)
    captured = captured_answers(root)
    numbering = exercise_numbering(root)
    lesson_ids = selected_lessons(args)
    exercise_docs = {
        lesson: load(lessons_dir(args) / lesson / "exercises.json")
        for lesson in lesson_ids
    }
    source_docs = {}
    if numbering == "lesson-group":
        for lesson in lesson_ids:
            path = root / "lessons" / lesson / "exercises.json"
            if path.is_file():
                source_docs[lesson] = load(path)
    legacy_lessons = {
        lesson
        for lesson, document in exercise_docs.items()
        if numbering == "lesson-group"
        and any(
            field not in exercise
            for exercise in (
                source_docs.get(lesson, {}).get("exercises", [])
                + document.get("exercises", [])
            )
            for field in OPTIONAL_IDENTITY_FIELDS
        )
    }
    missing_sources = sorted(legacy_lessons - set(source_docs))
    if missing_sources:
        raise SystemExit(
            "ERROR: 缺少旧原书 exercises.json，无法解析栏目身份: "
            + ", ".join(missing_sources)
        )
    rebuilt_by_lesson = (
        rebuilt_exercises(root, args.book, legacy_lessons)
        if legacy_lessons
        else {}
    )
    for lesson in lesson_ids:
        lesson_dir = lessons_dir(args) / lesson
        exercise_doc = exercise_docs[lesson]
        exercises = (
            resolve_legacy_identities(
                lesson,
                source_docs[lesson],
                exercise_doc,
                rebuilt_by_lesson[lesson],
            )
            if lesson in legacy_lessons
            else exercise_doc.get("exercises", [])
        )
        figure_doc = load(lesson_dir / "figures.json")
        figures = {
            figure["id"]: figure
            for figure in figure_doc.get("figures", [])
        }
        answers = []
        for exercise in exercises:
            number = str(exercise["number"])
            book_answer = captured_answer(
                captured,
                lesson,
                exercise,
                numbering,
            )
            evidence = []
            for figure_id in exercise.get("figure_refs", []):
                figure = figures.get(figure_id, {})
                edition_asset = figure.get("png") or figure.get("svg")
                evidence.append({
                    "id": figure_id,
                    "originalPng": (
                        root / "figures" / f"{figure_id}.png"
                    ).as_posix(),
                    "editionAsset": (
                        root / "editions" / args.edition / edition_asset
                    ).as_posix() if edition_asset else None,
                    "figureSpec": (
                        root / "editions" / args.edition / figure["spec"]
                    ).as_posix() if figure.get("spec") else None,
                })
            item = {
                "exercise": number,
                "prompt": exercise["text"],
                "figureEvidence": evidence,
                "grading": None,
                "source": "book" if book_answer else "derived",
                "displayAnswer": "",
                "parts": [],
                "historical_entities": [],
            }
            if book_answer:
                item["bookRaw"] = book_answer["raw"]
            answers.append(item)
        template = {
            "schema": SCHEMA,
            "book": args.book,
            "lesson": lesson,
            "edition": args.edition,
            "status": "draft",
            "answers": answers,
        }
        target = (
            Path(args.work)
            / args.book
            / args.edition
            / "lessons"
            / lesson
            / "answer-keys.template.json"
        )
        dump(target, template)
        print(f"[prepare] {lesson}: {len(answers)} exercises -> {target}")
        print(f"  完成后写入 {lesson_dir / 'answer-keys.json'}")
    return 0


def validate_lesson(
    path: Path,
    exercise_path: Path,
    book: str,
    lesson: str,
    edition: str | None,
    forbidden_terms: list[str] | None = None,
) -> tuple[dict, list[str]]:
    document = load(path)
    exercise_doc = load(exercise_path)
    errors: list[str] = []
    forbidden_terms = forbidden_terms or []
    expected_numbers = [str(item["number"]) for item in exercise_doc.get("exercises", [])]

    if document.get("schema") != SCHEMA:
        errors.append(f"schema 必须是 {SCHEMA!r}")
    if document.get("book") != book:
        errors.append(f"book 必须是 {book!r}")
    if document.get("lesson") != lesson:
        errors.append(f"lesson 必须是 {lesson!r}")
    if document.get("edition") != edition:
        errors.append(f"edition 必须是 {edition!r}")
    answers = document.get("answers")
    if not isinstance(answers, list):
        errors.append("answers 必须是数组")
        answers = []
    numbers = [str(answer.get("exercise")) for answer in answers if isinstance(answer, dict)]
    if numbers != expected_numbers:
        errors.append(
            "answer exercise 顺序或集合与 exercises.json 不一致: "
            f"want={expected_numbers}, got={numbers}"
        )

    exercise_by_number = {
        str(item.get("number")): item
        for item in exercise_doc.get("exercises", [])
        if isinstance(item, dict)
    }
    for index, answer in enumerate(answers):
        label = f"answers[{index}]"
        if not isinstance(answer, dict):
            errors.append(f"{label} 必须是对象")
            continue
        grading = answer.get("grading")
        source = answer.get("source")
        display = answer.get("displayAnswer")
        parts = answer.get("parts")
        if grading not in GRADING:
            errors.append(f"{label}.grading 必须是 auto 或 ungraded")
        if source not in SOURCES:
            errors.append(f"{label}.source 非法")
        if not isinstance(display, str) or not display.strip():
            errors.append(f"{label}.displayAnswer 不能为空")
        elif any(
            phrase in display
            for phrase in ("题面未附图", "题面未提供图", "无法可靠确定")
        ):
            errors.append(f"{label}.displayAnswer 不得声称题图缺失")
        historical_entities = answer.get("historical_entities")
        allowed_historical = set()
        if historical_entities is not None:
            if not isinstance(historical_entities, list):
                errors.append(f"{label}.historical_entities 必须是数组")
            else:
                prompt = exercise_by_number.get(str(answer.get("exercise")), {}).get("text", "")
                for entity_index, declaration in enumerate(historical_entities):
                    entity_label = f"{label}.historical_entities[{entity_index}]"
                    if not isinstance(declaration, dict):
                        errors.append(f"{entity_label} 必须是对象")
                        continue
                    term = declaration.get("term")
                    reason = declaration.get("reason")
                    if not isinstance(term, str) or not term.strip():
                        errors.append(f"{entity_label}.term 不能为空")
                        continue
                    if not isinstance(reason, str) or not reason.strip():
                        errors.append(f"{entity_label}.reason 不能为空")
                    if term not in prompt:
                        errors.append(f"{entity_label}.term={term!r} 不在对应题面中")
                    if isinstance(display, str) and term not in display:
                        errors.append(f"{entity_label}.term={term!r} 不在标准答案中")
                    allowed_historical.add(term)
        if (
            isinstance(display, str)
            and (hits := [
                term
                for term in forbidden_terms
                if term in display and term not in allowed_historical
            ])
        ):
            errors.append(
                f"{label}.displayAnswer 仍含旧文化词或俄文人名: {', '.join(hits)}"
            )
        if not isinstance(parts, list):
            errors.append(f"{label}.parts 必须是数组")
            parts = []
        if grading == "ungraded" and parts:
            errors.append(f"{label} ungraded 的 parts 必须为空")
        if grading == "auto" and not parts:
            errors.append(f"{label} auto 至少需要一个 part")
        for part_index, part in enumerate(parts):
            part_label = f"{label}.parts[{part_index}]"
            if not isinstance(part, dict):
                errors.append(f"{part_label} 必须是对象")
                continue
            if part.get("judge") not in JUDGES:
                errors.append(f"{part_label}.judge 非法")
            expected = part.get("expected")
            if (
                not isinstance(expected, list)
                or not expected
                or any(not isinstance(value, str) or not value.strip() for value in expected)
            ):
                errors.append(f"{part_label}.expected 必须是非空字符串数组")
            for optional in ("label", "unit"):
                if optional in part and not isinstance(part[optional], str):
                    errors.append(f"{part_label}.{optional} 必须是字符串")
            tolerance = part.get("tolerance")
            if tolerance is not None and (
                not isinstance(tolerance, (int, float)) or tolerance < 0
            ):
                errors.append(f"{part_label}.tolerance 必须是非负数")
    return document, errors


def cmd_finalize(args: argparse.Namespace) -> int:
    root = book_dir(args)
    failed = False
    ready: list[tuple[str, Path, dict]] = []
    forbidden_terms: list[str] = []
    if args.edition == "modern-us-neutral":
        profile = load(MODERN_US_PROFILE)
        forbidden_terms = [
            *profile.get("forbidden_terms", []),
            *profile.get("forbidden_person_names", []),
        ]
    for lesson in selected_lessons(args):
        lesson_dir = lessons_dir(args) / lesson
        path = lesson_dir / "answer-keys.json"
        document, errors = validate_lesson(
            path,
            lesson_dir / "exercises.json",
            args.book,
            lesson,
            args.edition,
            forbidden_terms,
        )
        if errors:
            failed = True
            for error in errors:
                print(f"ERROR {lesson}: {error}")
            continue
        ready.append((lesson, path, document))

    if ready:
        command = ["node", str(MATHLIVE_CHECK)]
        for _, path, _ in ready:
            command.extend(["--answer-key", str(path)])
        result = subprocess.run(command, cwd=REPO, text=True, capture_output=True)
        if result.returncode:
            failed = True
            print("ERROR: MathLive exact 输入合同校验失败", file=sys.stderr)
            if result.stdout.strip():
                print(result.stdout.strip(), file=sys.stderr)
            if result.stderr.strip():
                print(result.stderr.strip(), file=sys.stderr)

    if failed:
        return 2

    for lesson, path, document in ready:
        lesson_dir = lessons_dir(args) / lesson
        document["status"] = "ready"
        document["count"] = len(document["answers"])
        dump(path, document)
        auto = sum(answer["grading"] == "auto" for answer in document["answers"])
        ungraded = len(document["answers"]) - auto
        audit = {
            "schema": "ld-s10y-answer/lesson-audit@1",
            "book": args.book,
            "lesson": lesson,
            "edition": args.edition,
            "status": "pass",
            "answerCount": len(document["answers"]),
            "auto": auto,
            "ungraded": ungraded,
        }
        dump(lesson_dir / "answer-keys.audit.json", audit)
        print(f"[finalize] {lesson}: PASS auto={auto} ungraded={ungraded}")
    return 0


def add_common(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--book", required=True)
    parser.add_argument("--lesson", action="append")
    parser.add_argument("--edition", required=True)
    parser.add_argument("--root", default=DEFAULT_ROOT)
    parser.add_argument("--work", default=DEFAULT_WORK)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="lesson_answers.py",
        description="为指定 Soviet 10 Years lesson 生产答案键",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    prepare = subparsers.add_parser("prepare")
    add_common(prepare)
    prepare.set_defaults(handler=cmd_prepare)
    finalize = subparsers.add_parser("finalize")
    add_common(finalize)
    finalize.set_defaults(handler=cmd_finalize)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    return args.handler(args)


if __name__ == "__main__":
    raise SystemExit(main())
