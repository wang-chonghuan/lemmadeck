#!/usr/bin/env python3
"""Capture printed answer pages from Soviet ten-year-school textbooks."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

DEFAULT_BOOKS = Path("ssot-resources/soviet10year-textbooks/sources")
DEFAULT_ROOT = Path("ssot-resources/soviet10year-textbooks/artifacts")
DEFAULT_WORK = Path(".tmp/ld-s10y-answer")
SCHEMA = "ld-s10y-answer/book@1"
NUMBERING_SCOPES = {"book", "lesson", "lesson-group"}
REPO = Path(__file__).resolve().parents[4]


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_pages(spec: str) -> list[int]:
    pages: set[int] = set()
    for token in spec.split(","):
        token = token.strip()
        if not token:
            continue
        if "-" in token:
            start_text, end_text = token.split("-", 1)
            start, end = int(start_text), int(end_text)
            if start > end:
                raise ValueError(f"页码范围倒置: {token}")
            pages.update(range(start, end + 1))
        else:
            pages.add(int(token))
    if not pages or min(pages) < 1:
        raise ValueError("必须提供正整数 PDF 页码")
    return sorted(pages)


def source_manifest(args: argparse.Namespace) -> tuple[Path, dict] | None:
    path = Path(args.books) / "manifest.json"
    if not path.is_file():
        return None
    try:
        return path, json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: source manifest 不是有效 JSON: {path}: {error}")


def manifest_path(manifest: Path, value: str) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    candidates = (REPO / path, manifest.parent / path)
    return next((candidate for candidate in candidates if candidate.exists()), candidates[-1])


def catalog_config(args: argparse.Namespace) -> dict:
    loaded = source_manifest(args)
    if loaded is None:
        return {}
    _, manifest = loaded
    return next(
        (
            catalog
            for catalog in manifest.get("catalogs", [])
            if catalog.get("book") == args.book
        ),
        {},
    )


def exercise_numbering(args: argparse.Namespace) -> str:
    value = catalog_config(args).get("exerciseNumbering", "book")
    if value not in NUMBERING_SCOPES:
        raise SystemExit(f"ERROR: {args.book!r} exerciseNumbering 非法: {value!r}")
    return value


def find_pdf(args: argparse.Namespace) -> Path:
    if args.pdf:
        path = Path(args.pdf)
        if not path.is_file():
            raise SystemExit(f"ERROR: PDF 不存在: {path}")
        return path

    loaded = source_manifest(args)
    if loaded is not None:
        manifest_file, manifest = loaded
        catalog = catalog_config(args)
        if catalog:
            source_id = catalog.get("sourcePdf")
            if not source_id:
                raise SystemExit(f"ERROR: {args.book!r} 没有可用的 sourcePdf")
            record = next(
                (
                    item
                    for item in manifest.get("pdfs", [])
                    if item.get("book") == source_id
                ),
                None,
            )
            if record is None:
                raise SystemExit(
                    f"ERROR: {args.book!r} 的 sourcePdf {source_id!r} 未在 manifest.pdfs 声明"
                )
            pdf = manifest_path(manifest_file, manifest.get("pdfRoot", "")) / record.get("file", "")
            if not pdf.is_file():
                raise SystemExit(f"ERROR: source manifest 指向的 PDF 不存在: {pdf}")
            return pdf

    books = Path(args.books)
    pattern = f"{args.series}/*.pdf" if args.series else "*/*.pdf"
    hits = sorted(
        path
        for path in books.glob(pattern)
        if path.stem == args.book or path.stem.startswith(args.book + " ")
    )
    if not hits:
        raise SystemExit(f"ERROR: {books}/{pattern} 中找不到 {args.book!r} 对应的 PDF")
    if len(hits) > 1:
        choices = ", ".join(f"{path.parent.name}/{path.name}" for path in hits)
        raise SystemExit(f"ERROR: {args.book!r} 匹配到多本，请用 --series: {choices}")
    return hits[0]


def render_page(pdf: Path, page: int, target: Path, dpi: int) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    prefix = target.with_suffix("")
    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-singlefile",
            "-r",
            str(dpi),
            "-f",
            str(page),
            "-l",
            str(page),
            str(pdf),
            str(prefix),
        ],
        check=True,
    )
    if not target.is_file():
        raise RuntimeError(f"pdftoppm 未生成 {target}")


def cmd_prepare(args: argparse.Namespace) -> int:
    pages = parse_pages(args.pages)
    pdf = find_pdf(args)
    numbering = exercise_numbering(args)
    work_dir = Path(args.work) / args.book
    page_dir = work_dir / "pages"

    for page in pages:
        target = page_dir / f"page-{page:04d}.png"
        render_page(pdf, page, target, args.dpi)
        print(f"[prepare] PDF p{page} -> {target}")

    template = {
        "schema": SCHEMA,
        "book": args.book,
        "exerciseNumbering": numbering,
        "source": {
            "pdf": pdf.name,
            "pdfSha256": sha256(pdf),
            "pdfPages": pages,
            "printedPages": [],
        },
        "status": "draft",
        "answers": [],
    }
    dump(work_dir / "answers.template.json", template)
    print(f"[prepare] template -> {work_dir / 'answers.template.json'}")
    print(f"[prepare] stable output -> {Path(args.root) / args.book / 'answers.json'}")
    return 0


def natural_key(value: object) -> tuple:
    return tuple(
        (0, int(part)) if part.isdigit() else (1, part.casefold())
        for part in re.split(r"(\d+)", str(value or ""))
        if part
    )


def answer_key(answer: dict, numbering: str) -> tuple:
    pdf_page = answer.get("pdfPage")
    if numbering == "book":
        exercise = answer.get("exercise")
        return (pdf_page, exercise if isinstance(exercise, int) else -1)
    if numbering == "lesson":
        exercise = answer.get("exercise")
        return (
            pdf_page,
            str(answer.get("lesson") or ""),
            exercise if isinstance(exercise, int) else -1,
        )
    source_number = answer.get("sourceNumber")
    source_key = (
        (1, ())
        if source_number is None
        else (0, natural_key(source_number))
    )
    return (
        pdf_page,
        natural_key(answer.get("lesson")),
        natural_key(answer.get("groupId")),
        source_key,
        natural_key(answer.get("exerciseId")),
    )


def validate_answer_file(
    path: Path,
    expected_book: str,
    numbering: str = "book",
) -> tuple[dict, list[str]]:
    errors: list[str] = []
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"ERROR: 缺少 {path}")
    except json.JSONDecodeError as error:
        raise SystemExit(f"ERROR: {path} 不是有效 JSON: {error}")

    if document.get("schema") != SCHEMA:
        errors.append(f"schema 必须是 {SCHEMA!r}")
    if document.get("book") != expected_book:
        errors.append(f"book 必须是 {expected_book!r}")
    if numbering not in NUMBERING_SCOPES:
        errors.append(f"exerciseNumbering 非法: {numbering!r}")
    if (
        "exerciseNumbering" in document
        and document.get("exerciseNumbering") != numbering
    ):
        errors.append(f"exerciseNumbering 必须是 {numbering!r}")

    source = document.get("source")
    if not isinstance(source, dict):
        errors.append("source 必须是对象")
        source = {}
    source_pages = source.get("pdfPages")
    if (
        not isinstance(source_pages, list)
        or not source_pages
        or any(not isinstance(page, int) or page < 1 for page in source_pages)
    ):
        errors.append("source.pdfPages 必须是非空正整数数组")
        source_pages = []
    elif source_pages != sorted(set(source_pages)):
        errors.append("source.pdfPages 必须严格递增且无重复")

    answers = document.get("answers")
    if not isinstance(answers, list):
        errors.append("answers 必须是数组")
        answers = []

    seen: set[object] = set()
    previous_key: tuple | None = None
    for index, answer in enumerate(answers):
        label = f"answers[{index}]"
        if not isinstance(answer, dict):
            errors.append(f"{label} 必须是对象")
            continue
        raw = answer.get("raw")
        pdf_page = answer.get("pdfPage")
        if numbering == "lesson-group":
            exercise_id = answer.get("exerciseId")
            lesson = answer.get("lesson")
            group_id = answer.get("groupId")
            group = answer.get("group")
            source_number = answer.get("sourceNumber")
            if not isinstance(exercise_id, str) or not exercise_id.strip():
                errors.append(f"{label}.exerciseId 必须是非空字符串")
            if not isinstance(lesson, str) or not lesson.strip():
                errors.append(f"{label}.lesson 必须是非空字符串")
            if not isinstance(group_id, str) or not group_id.strip():
                errors.append(f"{label}.groupId 必须是非空字符串")
            if "group" not in answer:
                errors.append(f"{label}.group 必须显式记录，可为 null")
            elif group is not None and (not isinstance(group, str) or not group.strip()):
                errors.append(f"{label}.group 必须是非空字符串或 null")
            if "sourceNumber" not in answer:
                errors.append(f"{label}.sourceNumber 必须显式记录，未编号题写 null")
            elif source_number is not None and (
                isinstance(source_number, bool)
                or not isinstance(source_number, (int, str))
                or not str(source_number).strip()
            ):
                errors.append(f"{label}.sourceNumber 必须是编号字符串、整数或 null")
            identity = (lesson, exercise_id)
            if all(isinstance(value, str) and value.strip() for value in identity):
                if identity in seen:
                    errors.append(f"lesson/exerciseId {identity} 重复")
                seen.add(identity)
        else:
            exercise = answer.get("exercise")
            lesson = answer.get("lesson")
            if not isinstance(exercise, int) or exercise < 1:
                errors.append(f"{label}.exercise 必须是正整数")
            if numbering == "lesson" and (
                not isinstance(lesson, str) or not lesson.strip()
            ):
                errors.append(f"{label}.lesson 必须是非空字符串")
            identity = exercise if numbering == "book" else (lesson, exercise)
            if isinstance(exercise, int) and exercise >= 1:
                if identity in seen:
                    errors.append(f"exercise {identity} 重复")
                seen.add(identity)
        if not isinstance(raw, str) or not raw.strip():
            errors.append(f"{label}.raw 不能为空")
        if not isinstance(pdf_page, int) or pdf_page not in source_pages:
            errors.append(f"{label}.pdfPage 不在 source.pdfPages 中")
        if answer.get("needsReview") is True and not str(answer.get("reviewNote", "")).strip():
            errors.append(f"{label} 标记 needsReview 时必须写 reviewNote")
        printed_page = answer.get("printedPage")
        if printed_page is not None and (
            not isinstance(printed_page, int) or printed_page < 1
        ):
            errors.append(f"{label}.printedPage 必须是正整数")
        if isinstance(pdf_page, int):
            key = answer_key(answer, numbering)
            if previous_key is not None and key <= previous_key:
                errors.append(f"{label} 未按 PDF 页和题目标识严格递增")
            previous_key = key

    return document, errors


def cmd_finalize(args: argparse.Namespace) -> int:
    path = Path(args.root) / args.book / "answers.json"
    numbering = exercise_numbering(args)
    document, errors = validate_answer_file(path, args.book, numbering)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 2

    answers = document["answers"]
    source_pages = document["source"]["pdfPages"]
    counts = {
        str(page): sum(1 for answer in answers if answer["pdfPage"] == page)
        for page in source_pages
    }
    review = [
        answer.get("exerciseId", answer.get("exercise"))
        for answer in answers
        if answer.get("needsReview") is True
    ]
    document["status"] = "captured"
    document["count"] = len(answers)
    dump(path, document)
    audit = {
        "schema": "ld-s10y-answer/audit@1",
        "book": args.book,
        "status": "pass",
        "answerCount": len(answers),
        "exerciseRange": (
            [
                min((answer["exercise"] for answer in answers), default=None),
                max((answer["exercise"] for answer in answers), default=None),
            ]
            if numbering == "book"
            else None
        ),
        "answersByPdfPage": counts,
        "needsReview": review,
    }
    if numbering != "book" or "exerciseNumbering" in document:
        audit["exerciseNumbering"] = numbering
    audit_path = path.with_name("answers.audit.json")
    dump(audit_path, audit)
    print(f"[finalize] PASS: {len(answers)} answers -> {path}")
    print(f"[finalize] audit -> {audit_path}")
    return 0


def add_common(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--book", required=True)
    parser.add_argument("--root", default=str(DEFAULT_ROOT))
    parser.add_argument("--books", default=str(DEFAULT_BOOKS))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="answers.py",
        description="Soviet 10 Years 教材书后答案抄录",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    prepare = subparsers.add_parser("prepare", help="渲染答案页并生成抄录模板")
    add_common(prepare)
    prepare.add_argument("--pages", required=True, help="PDF 物理页，如 305-309")
    prepare.add_argument("--work", default=str(DEFAULT_WORK))
    prepare.add_argument("--series")
    prepare.add_argument("--pdf")
    prepare.add_argument("--dpi", type=int, default=300)
    prepare.set_defaults(handler=cmd_prepare)

    finalize = subparsers.add_parser("finalize", help="验证并收口 answers.json")
    add_common(finalize)
    finalize.set_defaults(handler=cmd_finalize)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    return args.handler(args)


if __name__ == "__main__":
    raise SystemExit(main())
