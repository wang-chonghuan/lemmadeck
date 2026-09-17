#!/usr/bin/env python3
"""Prepare and validate culturally modernized lesson editions."""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


LESSON_SCHEMA = "ld-s10y-lesson/edition-lesson@1"
EXERCISES_SCHEMA = "ld-s10y-lesson/edition-exercises@1"
FIGURES_SCHEMA = "ld-s10y-lesson/edition-figures@1"
IMAGE_FIGURE_SPEC_SCHEMA = "ld-s10y-image/figure-spec@2"
LEGACY_IMAGE_FIGURE_SPEC_SCHEMA = "ld-s10y-image/figure-spec@1"
IMAGE_RENDER_SCHEMA = "ld-s10y-image/render@2"
LEGACY_IMAGE_RENDER_SCHEMA = "ld-s10y-image/render@1"
IMAGE_REVIEW_SCHEMA = "ld-s10y-image/review@1"
AUDIT_SCHEMA = "ld-s10y-lesson/edition-audit@1"
BOOK_SCHEMA = "ld-s10y-lesson/edition-book@1"
MATH = re.compile(r"\$\$(.+?)\$\$|\$([^$]+?)\$", re.S)
MATH_TEXT_LITERAL = re.compile(r"\\text\{([^{}]*)\}")
NUMBER = re.compile(r"(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])")
PART_MARKER = re.compile(
    r"(?<![A-Za-z0-9_.\u0400-\u04ff])"
    r"(?P<open>[(（]?)(?P<label>\d{1,2}|[a-z]|[\u0430-\u044f\u0451])(?P<close>[)）])"
)
LATIN_PARTS = tuple("abcdefghijklmnopqrstuvwxyz")
CYRILLIC_PARTS = tuple("абвгдежзиклмнопрстуфхцчшщэюя")
CYRILLIC = re.compile(r"[\u0400-\u04ff]")
NON_ENGLISH_FIGURE_SCRIPT = re.compile(
    r"[\u0400-\u04ff\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]"
)
GRAPHIC_TAGS = {
    "path", "line", "polyline", "polygon", "rect", "circle", "ellipse", "text",
}
IDENTITY_FIELDS = (
    "id", "card_id", "chapter", "section", "number", "title", "printed_title",
    "start_page", "start_printed", "exercise_count",
)


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


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def selected_lessons(args: argparse.Namespace) -> list[str]:
    if not args.lesson:
        raise SystemExit("ERROR: 至少指定一个 --lesson")
    if len(args.lesson) != len(set(args.lesson)):
        raise SystemExit("ERROR: --lesson 有重复")
    return args.lesson


def source_ref(book: Path, path: Path) -> dict:
    return {
        "path": path.relative_to(book).as_posix(),
        "sha256": sha256(path),
        "data": load(path),
    }


def edition_dir(args: argparse.Namespace) -> Path:
    return Path(args.root) / args.book / "editions" / args.edition


def work_edition_dir(args: argparse.Namespace) -> Path:
    return Path(args.work) / "adapt" / args.book / args.edition


def source_dir(args: argparse.Namespace) -> Path:
    return Path(args.root) / args.book


def modern_prose(source: dict) -> list[dict]:
    result = []
    for block in source.get("prose", []):
        source_text = block.get("text", "")
        modern_text = (
            normalize_prose_layout(source_text)
            if block.get("kind") == "p"
            else source_text
        )
        result.append({
            **copy.deepcopy(block),
            "text": modern_text,
            "source_text": source_text,
            "changes": ["layout"] if modern_text != source_text else [],
            "numeric_changes": [],
        })
    return result


def modern_exercises(source: dict) -> list[dict]:
    result = []
    for exercise in source.get("exercises", []):
        source_text = exercise.get("text", "")
        modern_text = normalize_numbered_subparts(source_text)
        result.append({
            **copy.deepcopy(exercise),
            "text": modern_text,
            "lines": modern_text.splitlines(),
            "source_text": source_text,
            "changes": ["layout"] if modern_text != source_text else [],
            "numeric_changes": [],
        })
    return result


def figure_sources(book: Path, figures: list[dict]) -> list[dict]:
    result = []
    for figure in figures:
        item = {
            "id": figure["id"],
            "label": figure.get("label"),
            "spec": f"figures/{figure['id']}.spec.json",
            "changes": ["modernized"],
            "source": {},
        }
        for suffix in (".png", ".svg"):
            path = book / "figures" / f"{figure['id']}{suffix}"
            if path.exists():
                item["source"][suffix[1:]] = {
                    "path": path.relative_to(book).as_posix(),
                    "sha256": sha256(path),
                }
        result.append(item)
    return result


def cmd_prepare(args: argparse.Namespace) -> int:
    book = source_dir(args)
    edition = edition_dir(args)
    work_edition = work_edition_dir(args)
    profile_path = Path(args.profile)
    profile = load(profile_path)
    book_index = edition / "book.json"
    existing_lessons = load(book_index).get("lessons", []) if book_index.exists() else []
    dump(work_edition / "book.template.json", {
        "schema": BOOK_SCHEMA,
        "edition": args.edition,
        "status": "draft",
        "profile": {
            "id": profile["id"],
            "path": profile_path.as_posix(),
            "sha256": sha256(profile_path),
        },
        "lessons": existing_lessons,
    })

    for lesson_id in selected_lessons(args):
        raw_dir = book / "lessons" / lesson_id
        lesson_path = raw_dir / "lesson.json"
        exercises_path = raw_dir / "exercises.json"
        lesson_source = source_ref(book, lesson_path)
        exercises_source = source_ref(book, exercises_path)
        raw_lesson = lesson_source["data"]
        raw_exercises = exercises_source["data"]
        target = work_edition / "lessons" / lesson_id

        lesson_template = {
            **copy.deepcopy(raw_lesson),
            "schema": LESSON_SCHEMA,
            "edition": args.edition,
            "status": "draft",
            "source": lesson_source,
            "prose": modern_prose(raw_lesson),
            "section_breaks": [],
        }
        exercises_template = {
            **copy.deepcopy(raw_exercises),
            "schema": EXERCISES_SCHEMA,
            "edition": args.edition,
            "status": "draft",
            "source": exercises_source,
            "exercises": modern_exercises(raw_exercises),
        }
        figures_template = {
            "schema": FIGURES_SCHEMA,
            "edition": args.edition,
            "lesson": lesson_id,
            "status": "draft",
            "figures": figure_sources(book, raw_lesson.get("figures", [])),
        }
        for name, value in (
            ("lesson.template.json", lesson_template),
            ("exercises.template.json", exercises_template),
            ("figures.template.json", figures_template),
        ):
            path = target / name
            if path.exists() and not args.force:
                raise SystemExit(f"ERROR: {path} 已存在；确认重建模板时加 --force")
            dump(path, value)
        print(
            f"[adapt-prepare] {lesson_id}: "
            f"正文 {len(raw_lesson.get('prose', []))} 块, "
            f"题 {len(raw_exercises.get('exercises', []))} 道, "
            f"图 {len(raw_lesson.get('figures', []))} 张 -> {target}"
        )
        print(f"  完成后写入 {edition / 'lessons' / lesson_id}")
    return 0


def math_signature(text: str) -> list[str]:
    def normalize_text_literals(expression: str) -> str:
        return MATH_TEXT_LITERAL.sub(
            lambda match: (
                "\\text{" + "|".join(NUMBER.findall(match.group(1))) + "}"
            ),
            expression,
        )

    return [
        normalize_text_literals(match.group(1) or match.group(2)).strip()
        for match in MATH.finditer(text)
    ]


def number_signature(text: str) -> list[str]:
    without_math = MATH.sub("", text)
    return NUMBER.findall(without_math)


def masked_math(text: str) -> str:
    masked = list(text)
    for match in MATH.finditer(text):
        masked[match.start():match.end()] = " " * (match.end() - match.start())
    return "".join(masked)


def nesting_depths(text: str) -> list[int]:
    depths = []
    depth = 0
    for char in text:
        depths.append(depth)
        if char in "(（":
            depth += 1
        elif char in ")）":
            depth = max(0, depth - 1)
    return depths


def normalize_prose_layout(text: str) -> str:
    """Create short paragraphs while keeping complete sentences and formulas legible."""
    if not isinstance(text, str):
        return text
    text = re.sub(r"[\t \u3000]+", " ", text.replace("\r\n", "\n")).strip()
    if not text:
        return text

    masked = masked_math(text)
    depths = nesting_depths(masked)
    boundaries = set()
    for index, char in enumerate(masked):
        if char == "\n":
            boundaries.add(index + 1)
            continue
        if depths[index] != 0:
            continue
        if char in "。！？；;":
            boundaries.add(index + 1)
        elif char in "：:":
            rest = text[index + 1:].lstrip()
            if rest.startswith("$"):
                boundaries.add(index + 1)

    for match in MATH.finditer(text):
        tex = (match.group(1) or match.group(2)).rstrip()
        if (
            depths[match.start()] == 0
            and tex.endswith((".", "。", "!", "！", "?", "？"))
            and text[match.end():].strip()
        ):
            boundaries.add(match.end())

    initial_boundaries = sorted(boundaries)
    for match in MATH.finditer(text):
        previous = max(
            (boundary for boundary in initial_boundaries if boundary <= match.start()),
            default=0,
        )
        if text[previous:match.start()].strip():
            continue
        trailing = re.match(r"[，,；;]", text[match.end():])
        if trailing and text[match.end() + trailing.end():].strip():
            boundaries.add(match.end() + trailing.end())

    lines = []
    start = 0
    for end in sorted(boundaries):
        line = re.sub(r"\s*\n\s*", " ", text[start:end]).strip()
        if line:
            lines.append(line)
        start = end
    tail = re.sub(r"\s*\n\s*", " ", text[start:]).strip()
    if tail:
        lines.append(tail)

    paragraphs = []
    current = []
    current_chars = 0
    for line in lines:
        bare = line.rstrip("，,；;。.!！?？")
        standalone_formula = bool(MATH.fullmatch(bare))
        attaches_to_previous = bool(
            current
            and (
                current[-1].endswith(("：", ":"))
                or standalone_formula
            )
        )
        if current and not attaches_to_previous and (
            len(current) >= 3 or current_chars + len(line) > 180
        ):
            paragraphs.append(current)
            current = []
            current_chars = 0
        current.append(line)
        current_chars += len(line)
    if current:
        paragraphs.append(current)
    return "\n\n".join("\n".join(paragraph) for paragraph in paragraphs)


def marker_order(markers: list[re.Match[str]]) -> dict[str, int] | None:
    labels = [marker.group("label") for marker in markers]
    if all(label.isdigit() for label in labels):
        expected = [str(number) for number in range(1, len(labels) + 1)]
    elif all(label in LATIN_PARTS for label in labels):
        expected = list(LATIN_PARTS[:len(labels)])
    elif all(label in CYRILLIC_PARTS for label in labels):
        expected = list(CYRILLIC_PARTS[:len(labels)])
    else:
        return None
    if (
        len(labels) != len(set(labels))
        or set(labels) != set(expected)
        or sorted(labels, key=expected.index) != expected
    ):
        return None
    return {label: index for index, label in enumerate(expected)}


def normalize_numbered_subparts(text: str) -> str:
    """Sort a complete numeric or lettered sequence and line-break its parts."""
    if not isinstance(text, str):
        return text
    masked_text = masked_math(text)
    depths = nesting_depths(masked_text)
    markers = [
        marker
        for marker in PART_MARKER.finditer(masked_text)
        if depths[marker.start()] == 0
        and (
            not marker.group("open")
            or (marker.group("open"), marker.group("close")) in {("(", ")"), ("（", "）")}
        )
        and not re.search(r"图\s*$", masked_text[max(0, marker.start() - 3):marker.start()])
    ]
    if len(markers) < 2:
        return text
    order = marker_order(markers)
    if order is None:
        return text

    prefix = text[:markers[0].start()].rstrip()
    parts = []
    for index, marker in enumerate(markers):
        end = markers[index + 1].start() if index + 1 < len(markers) else len(text)
        part = text[marker.start():end]
        part = re.sub(r"[\t \u3000\r\n]+", " ", part).strip()
        parts.append((order[marker.group("label")], part))
    ordered = [part for _, part in sorted(parts)]
    return "\n".join(([prefix] if prefix else []) + ordered)


def validate_numbered_subpart_layout(text: object) -> list[str]:
    if not isinstance(text, str):
        return []
    if normalize_numbered_subparts(text) != text:
        return ["完整数字或字母分题必须按自然顺序排列，并且每个分题独占一行"]
    return []


def normalize_lesson_layout(lesson: dict) -> None:
    for block in lesson.get("prose", []):
        if block.get("kind") != "p":
            continue
        text = block.get("text")
        normalized = normalize_prose_layout(text)
        if normalized == text:
            continue
        block["text"] = normalized
        changes = block.get("changes")
        if isinstance(changes, list) and "layout" not in changes:
            changes.append("layout")


def prose_paragraph_count(prose: object) -> int:
    if not isinstance(prose, list):
        return 0
    return sum(
        len(re.split(r"\n{2,}", block.get("text", "").strip()))
        for block in prose
        if isinstance(block, dict)
        and block.get("kind") == "p"
        and isinstance(block.get("text"), str)
        and block["text"].strip()
    )


def validate_section_breaks(section_breaks: object, paragraph_count: int) -> list[str]:
    if section_breaks is None:
        return []
    if (
        not isinstance(section_breaks, list)
        or any(isinstance(item, bool) or not isinstance(item, int) for item in section_breaks)
    ):
        return ["lesson.section_breaks 必须是整数数组"]
    if section_breaks != sorted(set(section_breaks)):
        return ["lesson.section_breaks 必须严格递增且不得重复"]
    if any(item <= 0 or item >= paragraph_count for item in section_breaks):
        return [
            "lesson.section_breaks 只能指向正文段落之间的 0 起始位置"
        ]
    return []


def normalize_exercise_layout(exercises: dict) -> None:
    for exercise in exercises.get("exercises", []):
        text = exercise.get("text")
        normalized = normalize_numbered_subparts(text)
        if normalized == text:
            continue
        exercise["text"] = normalized
        exercise["lines"] = normalized.splitlines()
        changes = exercise.get("changes")
        if isinstance(changes, list) and "layout" not in changes:
            changes.append("layout")


def validate_text(
    source: str,
    modern: object,
    changes: object,
    numeric_changes: object,
    label: str,
    forbidden_terms: list[str],
) -> list[str]:
    errors = []
    if not isinstance(modern, str):
        return [f"{label}.text 必须是字符串"]
    if not isinstance(changes, list) or any(not isinstance(item, str) for item in changes):
        errors.append(f"{label}.changes 必须是字符串数组")
        changes = []
    if modern != source and not changes:
        errors.append(f"{label} 已改写但 changes 为空")
    if modern == source and changes:
        errors.append(f"{label} 未改写但 changes 非空")
    canonical_source = normalize_numbered_subparts(source)
    canonical_modern = normalize_numbered_subparts(modern)
    if math_signature(canonical_modern) != math_signature(canonical_source):
        errors.append(f"{label} 的数学公式发生变化")
    source_numbers = number_signature(canonical_source)
    modern_numbers = number_signature(canonical_modern)
    if not isinstance(numeric_changes, list):
        errors.append(f"{label}.numeric_changes 必须是数组")
        numeric_changes = []
    expected_numbers = source_numbers[:]
    for index, change in enumerate(numeric_changes):
        change_label = f"{label}.numeric_changes[{index}]"
        if not isinstance(change, dict):
            errors.append(f"{change_label} 必须是对象")
            continue
        before = str(change.get("from", ""))
        after = str(change.get("to", ""))
        reason = change.get("reason")
        if not before or not after or not isinstance(reason, str) or not reason.strip():
            errors.append(f"{change_label} 必须包含 from、to 和 reason")
            continue
        try:
            position = expected_numbers.index(before)
        except ValueError:
            errors.append(f"{change_label}.from={before!r} 不在原文剩余数字中")
            continue
        expected_numbers[position] = after
    if modern_numbers != expected_numbers:
        errors.append(
            f"{label} 的非公式数字变化未被准确声明: "
            f"want={expected_numbers}, got={modern_numbers}"
        )
    if numeric_changes and "context-number" not in changes:
        errors.append(f"{label} 有 numeric_changes，但 changes 缺 context-number")
    if CYRILLIC.search(modern):
        errors.append(f"{label} 仍含西里尔字母")
    hits = [term for term in forbidden_terms if term in modern]
    if hits:
        errors.append(f"{label} 仍含旧文化词或俄文人名: {', '.join(hits)}")
    return errors


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def validate_figure_spec(
    spec_path: Path,
    figure_id: str,
    require_review: bool,
) -> tuple[dict, list[str]]:
    if not spec_path.exists():
        return {}, [f"缺少 figure spec: {spec_path}"]
    spec = load(spec_path)
    errors = []
    if spec.get("id") != figure_id:
        errors.append(f"{spec_path}: id 与 figure 不一致")
    schema = spec.get("schema")
    if schema in {
        IMAGE_FIGURE_SPEC_SCHEMA,
        LEGACY_IMAGE_FIGURE_SPEC_SCHEMA,
    }:
        stage = "draft"
        if require_review:
            stage = (
                "rendered"
                if schema == IMAGE_FIGURE_SPEC_SCHEMA
                else "approved"
            )
        repo = Path(__file__).resolve().parents[4]
        validator = (
            repo
            / ".agents"
            / "skills"
            / "ld-s10y-image"
            / "scripts"
            / "validate_spec.py"
        )
        result = subprocess.run(
            [
                sys.executable,
                str(validator),
                str(spec_path),
                "--stage",
                stage,
                "--json",
            ],
            cwd=repo,
            capture_output=True,
            text=True,
            check=False,
        )
        try:
            payload = json.loads(result.stdout)
        except json.JSONDecodeError:
            errors.append(
                f"{spec_path}: ld-s10y-image validator 输出异常: "
                f"{(result.stderr or result.stdout).strip()[:300]}"
            )
        else:
            errors += [
                f"{spec_path}: {error}"
                for error in payload.get("errors", [])
            ]
        return spec, errors
    errors.append(f"{spec_path}: schema 必须是 {IMAGE_FIGURE_SPEC_SCHEMA}")
    return spec, errors


def validate_svg(
    path: Path,
    spec_path: Path,
    figure: dict,
    figure_text_language: str | None = None,
    metadata_path: Path | None = None,
    expected_modes: set[str] | None = None,
) -> list[str]:
    errors = []
    if not path.exists():
        return [f"缺少现代 SVG: {path}"]
    if not spec_path.exists():
        return [f"缺少 SVG spec: {spec_path}"]
    text = path.read_text(encoding="utf-8")
    link_scan = re.sub(r'\sxmlns(?::\w+)?="[^"]+"', "", text)
    if "data:" in link_scan or "http://" in link_scan or "https://" in link_scan:
        errors.append(f"{path}: 禁止 data URI 或外链")
    try:
        root = ET.fromstring(text)
    except ET.ParseError as error:
        return [f"{path}: SVG XML 无效: {error}"]
    if local_name(root.tag) != "svg":
        errors.append(f"{path}: 根节点必须是 svg")
    if not root.get("viewBox"):
        errors.append(f"{path}: 缺 viewBox")
    tags = [local_name(node.tag) for node in root.iter()]
    banned = sorted(set(tags) & {"image", "foreignObject", "script"})
    if banned:
        errors.append(f"{path}: 禁止节点 {banned}")
    if not (set(tags) & GRAPHIC_TAGS):
        errors.append(f"{path}: 没有可见矢量图元")
    if figure_text_language == "English":
        for node in root.iter():
            if local_name(node.tag) not in {"text", "title", "desc"}:
                continue
            value = "".join(node.itertext()).strip()
            if NON_ENGLISH_FIGURE_SCRIPT.search(value):
                errors.append(
                    f"{path}: {local_name(node.tag)} 必须使用英文，发现 {value!r}"
                )
    spec, spec_errors = validate_figure_spec(
        spec_path,
        figure["id"],
        require_review=True,
    )
    errors += spec_errors
    expected_modes = expected_modes or {"deterministic"}
    if spec.get("mode") not in expected_modes:
        errors.append(
            f"{spec_path}: SVG mode 必须是 {', '.join(sorted(expected_modes))}"
        )
    if spec.get("schema") in {
        IMAGE_FIGURE_SPEC_SCHEMA,
        LEGACY_IMAGE_FIGURE_SPEC_SCHEMA,
    }:
        if metadata_path is None or not metadata_path.exists():
            errors.append(f"{path}: 缺 JSXGraph 渲染报告")
        else:
            metadata = load(metadata_path)
            expected_render_schema = (
                IMAGE_RENDER_SCHEMA
                if spec.get("schema") == IMAGE_FIGURE_SPEC_SCHEMA
                else LEGACY_IMAGE_RENDER_SCHEMA
            )
            if metadata.get("schema") != expected_render_schema:
                errors.append(f"{metadata_path}: render schema 非法")
            if metadata.get("mode") != spec.get("mode"):
                errors.append(f"{metadata_path}: mode 与 FigureSpec 不一致")
            if metadata.get("renderer", {}).get("name") != "JSXGraph":
                errors.append(f"{metadata_path}: renderer 必须是 JSXGraph")
            if metadata.get("status") != "pass":
                errors.append(f"{metadata_path}: render status 必须是 pass")
            if metadata.get("output", {}).get("svg", {}).get("sha256") != sha256(path):
                errors.append(f"{metadata_path}: output SVG SHA 不一致")
            if metadata.get("spec", {}).get("sha256") != sha256(spec_path):
                errors.append(f"{metadata_path}: FigureSpec SHA 不一致")
            if spec.get("schema") == IMAGE_FIGURE_SPEC_SCHEMA:
                display_checks = metadata.get("displayChecks")
                if not isinstance(display_checks, list) or not display_checks:
                    errors.append(f"{metadata_path}: 缺实际显示字号检查")
                elif any(
                    not isinstance(item, dict) or item.get("status") != "pass"
                    for item in display_checks
                ):
                    errors.append(f"{metadata_path}: 实际显示字号检查未通过")
                if metadata.get("theme", {}).get("output") != "css-variables":
                    errors.append(f"{metadata_path}: SVG 未使用可切换语义颜色")
    return errors


def validate_review(
    path: Path,
    spec_path: Path,
    evidence_name: str,
    evidence_path: Path,
    outputs: dict[str, Path],
    figure_id: str,
) -> list[str]:
    if not path.exists():
        return [f"缺少图片 review 证据: {path}"]
    review = load(path)
    errors = []
    if review.get("schema") != IMAGE_REVIEW_SCHEMA:
        errors.append(f"{path}: review schema 非法")
    if review.get("figure") != figure_id:
        errors.append(f"{path}: figure 与清单不一致")
    if review.get("status") != "pass":
        errors.append(f"{path}: review status 必须是 pass")
    if review.get("spec", {}).get("sha256") != sha256(spec_path):
        errors.append(f"{path}: FigureSpec review 已过期")
    if not evidence_path.is_file():
        errors.append(f"{path}: 缺 review 对应的 {evidence_name} 文件")
    elif review.get(evidence_name, {}).get("sha256") != sha256(evidence_path):
        errors.append(f"{path}: {evidence_name} review 已过期")
    recorded_outputs = review.get("outputs")
    if not isinstance(recorded_outputs, dict):
        errors.append(f"{path}: 缺输出 review 记录")
        recorded_outputs = {}
    for name, output_path in outputs.items():
        record = recorded_outputs.get(name, {})
        if (
            not output_path.is_file()
            or record.get("sha256") != sha256(output_path)
        ):
            errors.append(f"{path}: {name} review 已过期")
    return errors


def validate_generation_metadata(
    metadata_path: Path,
    spec: dict,
    figure: dict,
    output_path: Path | None = None,
) -> list[str]:
    if not metadata_path.exists():
        return [f"缺少图片生成元数据: {metadata_path}"]
    metadata = load(metadata_path)
    errors = []
    if metadata.get("schema") != "n-azure/image-generation@1":
        errors.append(f"{metadata_path}: schema 非法")
    if metadata.get("model") != "gpt-image-2":
        errors.append(f"{metadata_path}: model 必须是 gpt-image-2")
    if metadata.get("mode") != "edit":
        errors.append(f"{metadata_path}: 必须通过 image edit 读取原图")
    references = metadata.get("references")
    expected_source = (
        spec.get("source", {}).get("image", {}).get("sha256")
        or figure.get("source", {}).get("png", {}).get("sha256")
    )
    reference_shas = {
        item.get("sha256")
        for item in references
        if isinstance(item, dict)
    } if isinstance(references, list) else set()
    if not expected_source or expected_source not in reference_shas:
        errors.append(f"{metadata_path}: 未记录当前原图 PNG SHA")
    if (
        output_path is not None
        and metadata.get("output", {}).get("sha256") != sha256(output_path)
    ):
        errors.append(f"{metadata_path}: output SHA 与 PNG 不一致")
    if not isinstance(metadata.get("prompt"), str) or not metadata["prompt"].strip():
        errors.append(f"{metadata_path}: prompt 不能为空")
    return errors


def validate_png(
    path: Path,
    metadata_path: Path,
    spec_path: Path,
    figure: dict,
) -> list[str]:
    errors = []
    if not path.exists():
        return [f"缺少现代 PNG: {path}"]
    if not metadata_path.exists():
        errors.append(f"缺少 PNG 生成元数据: {metadata_path}")
    if not spec_path.exists():
        errors.append(f"缺少 PNG spec: {spec_path}")
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            if image.format != "PNG":
                errors.append(f"{path}: 必须是 PNG")
            width, height = image.size
            if width < 768 or height < 768:
                errors.append(f"{path}: 分辨率过低 {width}x{height}")
            sample = image.convert("RGB")
            sample.thumbnail((128, 128))
            pixels = list(sample.get_flattened_data())
            nonwhite = [pixel for pixel in pixels if min(pixel) < 245]
            colorful = [
                pixel for pixel in nonwhite
                if max(pixel) - min(pixel) >= 18
            ]
            if not nonwhite or len(colorful) / len(nonwhite) < 0.01:
                errors.append(f"{path}: 图像近似黑白，必须是完整彩色图")
    except (OSError, ValueError) as error:
        errors.append(f"{path}: PNG 无效: {error}")

    spec, spec_errors = validate_figure_spec(
        spec_path,
        figure["id"],
        require_review=True,
    )
    errors += spec_errors
    if metadata_path.exists():
        metadata = load(metadata_path)
        if spec.get("schema") == IMAGE_FIGURE_SPEC_SCHEMA:
            if spec.get("mode") != "generated":
                errors.append(f"{spec_path}: 当前 PNG 只允许 generated mode")
            errors += validate_generation_metadata(
                metadata_path,
                spec,
                figure,
                path,
            )
        else:
            if spec.get("mode") == "hybrid":
                if metadata.get("schema") != LEGACY_IMAGE_RENDER_SCHEMA:
                    errors.append(f"{metadata_path}: hybrid mode 缺 JSXGraph 渲染报告")
                if metadata.get("mode") != "hybrid":
                    errors.append(f"{metadata_path}: mode 必须是 hybrid")
                if metadata.get("renderer", {}).get("name") != "JSXGraph":
                    errors.append(f"{metadata_path}: renderer 必须是 JSXGraph")
                if metadata.get("status") != "pass":
                    errors.append(f"{metadata_path}: render status 必须是 pass")
                expected_image_ids = [
                    item.get("id")
                    for item in spec.get("objects", [])
                    if isinstance(item, dict) and item.get("type") == "image"
                ]
                image_fits = metadata.get("imageFits")
                if not isinstance(image_fits, list):
                    errors.append(f"{metadata_path}: 缺少 hybrid 图片比例保护报告")
                else:
                    reported = {
                        item.get("id"): item
                        for item in image_fits
                        if isinstance(item, dict) and isinstance(item.get("id"), str)
                    }
                    if set(reported) != set(expected_image_ids):
                        errors.append(f"{metadata_path}: imageFits 与 FigureSpec 图片对象不一致")
                    for image_id in expected_image_ids:
                        fit = reported.get(image_id, {})
                        if (
                            fit.get("status") != "pass"
                            or fit.get("preserveAspectRatio") != "xMidYMid meet"
                        ):
                            errors.append(
                                f"{metadata_path}: {image_id} 未通过图片比例保护"
                            )
                if metadata.get("output", {}).get("png", {}).get("sha256") != sha256(path):
                    errors.append(f"{metadata_path}: output PNG SHA 不一致")
                if metadata.get("spec", {}).get("sha256") != sha256(spec_path):
                    errors.append(f"{metadata_path}: FigureSpec SHA 不一致")
            else:
                errors += validate_generation_metadata(
                    metadata_path,
                    spec,
                    figure,
                    path,
                )
    return errors


def validate_artwork(
    path: Path,
    render_path: Path,
    spec_path: Path,
    figure: dict,
) -> list[str]:
    if not path.exists():
        return [f"缺少 hybrid artwork: {path}"]
    errors = []
    spec, spec_errors = validate_figure_spec(
        spec_path,
        figure["id"],
        require_review=True,
    )
    errors += spec_errors
    if spec.get("schema") != IMAGE_FIGURE_SPEC_SCHEMA:
        errors.append(f"{spec_path}: layered hybrid 必须使用当前 FigureSpec")
        return errors
    if spec.get("mode") != "hybrid":
        errors.append(f"{spec_path}: artwork 只允许 hybrid mode")
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            if image.format != "PNG":
                errors.append(f"{path}: artwork 必须是 PNG")
            expected = (
                spec.get("canvas", {}).get("width"),
                spec.get("canvas", {}).get("height"),
            )
            if image.size != expected:
                errors.append(
                    f"{path}: artwork 尺寸 {image.size} 与画布 {expected} 不一致"
                )
    except (OSError, ValueError) as error:
        errors.append(f"{path}: artwork PNG 无效: {error}")

    if not render_path.exists():
        errors.append(f"{path}: 缺 JSXGraph 渲染报告")
        return errors
    metadata = load(render_path)
    if metadata.get("schema") != IMAGE_RENDER_SCHEMA:
        errors.append(f"{render_path}: render schema 非法")
    if metadata.get("mode") != "hybrid":
        errors.append(f"{render_path}: mode 必须是 hybrid")
    if metadata.get("output", {}).get("artwork", {}).get("sha256") != sha256(path):
        errors.append(f"{render_path}: output artwork SHA 不一致")
    expected_assets = {
        asset.get("id"): asset
        for asset in spec.get("assets", [])
        if isinstance(asset, dict)
    }
    reported_assets = {
        asset.get("id"): asset
        for asset in metadata.get("assets", [])
        if isinstance(asset, dict)
    }
    if set(expected_assets) != set(reported_assets):
        errors.append(f"{render_path}: assets 与 FigureSpec 不一致")
    for asset_id, asset in expected_assets.items():
        asset_path = Path(asset.get("path", ""))
        report = reported_assets.get(asset_id, {})
        if not asset_path.is_file() or report.get("sha256") != sha256(asset_path):
            errors.append(f"{render_path}: artwork asset {asset_id} 已过期")
        metadata_value = asset.get("metadata")
        if not metadata_value:
            errors.append(f"{spec_path}: artwork asset {asset_id} 缺生成元数据")
            continue
        generation_path = Path(metadata_value)
        errors += validate_generation_metadata(
            generation_path,
            spec,
            figure,
        )
        if (
            not generation_path.is_file()
            or report.get("metadata", {}).get("sha256") != sha256(generation_path)
        ):
            errors.append(f"{render_path}: artwork asset {asset_id} 元数据已过期")
    expected_image_ids = [
        item.get("id")
        for item in spec.get("objects", [])
        if isinstance(item, dict) and item.get("type") == "image"
    ]
    image_fits = metadata.get("imageFits")
    reported_fits = {
        item.get("id"): item
        for item in image_fits
        if isinstance(item, dict) and isinstance(item.get("id"), str)
    } if isinstance(image_fits, list) else {}
    if set(reported_fits) != set(expected_image_ids):
        errors.append(f"{render_path}: imageFits 与 FigureSpec 图片对象不一致")
    for image_id in expected_image_ids:
        fit = reported_fits.get(image_id, {})
        if (
            fit.get("status") != "pass"
            or fit.get("preserveAspectRatio") != "xMidYMid meet"
        ):
            errors.append(f"{render_path}: {image_id} 未通过图片比例保护")
    return errors


def validate_source(book: Path, source: object, expected_path: Path, label: str) -> list[str]:
    if not isinstance(source, dict):
        return [f"{label}.source 必须是对象"]
    errors = []
    current = load(expected_path)
    if source.get("path") != expected_path.relative_to(book).as_posix():
        errors.append(f"{label}.source.path 不匹配")
    if source.get("sha256") != sha256(expected_path):
        errors.append(f"{label}.source 已过期")
    if source.get("data") != current:
        errors.append(f"{label}.source.data 不是当前原书 JSON 的完整快照")
    return errors


def validate_lesson(
    book: Path,
    edition: Path,
    lesson_id: str,
    profile: dict,
    require_current_figures: bool = False,
) -> tuple[dict, dict, dict, list[str]]:
    target = edition / "lessons" / lesson_id
    lesson_path = target / "lesson.json"
    exercises_path = target / "exercises.json"
    figures_path = target / "figures.json"
    lesson = load(lesson_path)
    normalize_lesson_layout(lesson)
    exercises = load(exercises_path)
    normalize_exercise_layout(exercises)
    figures = load(figures_path)
    raw_lesson_path = book / "lessons" / lesson_id / "lesson.json"
    raw_exercises_path = book / "lessons" / lesson_id / "exercises.json"
    raw_lesson = load(raw_lesson_path)
    raw_exercises = load(raw_exercises_path)
    forbidden = [
        *profile.get("forbidden_terms", []),
        *profile.get("forbidden_person_names", []),
    ]
    errors = []

    if lesson.get("schema") != LESSON_SCHEMA:
        errors.append(f"lesson.schema 必须是 {LESSON_SCHEMA}")
    if exercises.get("schema") != EXERCISES_SCHEMA:
        errors.append(f"exercises.schema 必须是 {EXERCISES_SCHEMA}")
    if figures.get("schema") != FIGURES_SCHEMA:
        errors.append(f"figures.schema 必须是 {FIGURES_SCHEMA}")
    for name, document in (("lesson", lesson), ("exercises", exercises), ("figures", figures)):
        if document.get("edition") != edition.name:
            errors.append(f"{name}.edition 必须是 {edition.name}")
    errors += validate_source(book, lesson.get("source"), raw_lesson_path, "lesson")
    errors += validate_source(book, exercises.get("source"), raw_exercises_path, "exercises")

    for field in IDENTITY_FIELDS:
        if lesson.get(field) != raw_lesson.get(field):
            errors.append(f"lesson.{field} 不得改变")
    raw_prose = raw_lesson.get("prose", [])
    modern_prose_items = lesson.get("prose")
    if not isinstance(modern_prose_items, list) or len(modern_prose_items) != len(raw_prose):
        errors.append("lesson.prose 数量与原书不一致")
        modern_prose_items = []
    errors += validate_section_breaks(
        lesson.get("section_breaks"),
        prose_paragraph_count(modern_prose_items),
    )
    for index, (source_block, modern_block) in enumerate(zip(raw_prose, modern_prose_items)):
        label = f"lesson.prose[{index}]"
        if modern_block.get("source_text") != source_block.get("text", ""):
            errors.append(f"{label}.source_text 与原书不一致")
        for field in ("kind", "id", "label", "printed_page"):
            if modern_block.get(field) != source_block.get(field):
                errors.append(f"{label}.{field} 不得改变")
        errors += validate_text(
            source_block.get("text", ""),
            modern_block.get("text"),
            modern_block.get("changes"),
            modern_block.get("numeric_changes"),
            label,
            forbidden,
        )

    raw_items = raw_exercises.get("exercises", [])
    modern_items = exercises.get("exercises")
    if not isinstance(modern_items, list) or len(modern_items) != len(raw_items):
        errors.append("exercises.exercises 数量与原书不一致")
        modern_items = []
    for index, (source_item, modern_item) in enumerate(zip(raw_items, modern_items)):
        label = f"exercises[{index}]"
        if modern_item.get("source_text") != source_item.get("text", ""):
            errors.append(f"{label}.source_text 与原书不一致")
        for field in ("number", "group", "figure_refs", "figures"):
            if modern_item.get(field) != source_item.get(field):
                errors.append(f"{label}.{field} 不得改变")
        errors += validate_text(
            source_item.get("text", ""),
            modern_item.get("text"),
            modern_item.get("changes"),
            modern_item.get("numeric_changes"),
            label,
            forbidden,
        )
        errors += [
            f"{label}: {error}"
            for error in validate_numbered_subpart_layout(modern_item.get("text"))
        ]

    raw_figure_ids = [item["id"] for item in raw_lesson.get("figures", [])]
    displayed_ids = {
        item.get("id") for item in modern_prose_items if item.get("kind") == "fig"
    } | {
        figure.get("id")
        for item in modern_items
        for figure in item.get("figures", [])
    }
    exercise_figure_ids = {
        figure_id for item in modern_items for figure_id in item.get("figure_refs", [])
    }
    for figure_id in exercise_figure_ids:
        if figure_id not in displayed_ids:
            errors.append(f"{figure_id}: referenced exercise figure is never displayed")
    figure_items = figures.get("figures")
    if not isinstance(figure_items, list):
        errors.append("figures.figures 必须是数组")
        figure_items = []
    if [item.get("id") for item in figure_items] != raw_figure_ids:
        errors.append("现代图 id 或顺序与原书不一致")
    for figure in figure_items:
        spec_path = edition / figure.get("spec", "")
        spec = load(spec_path) if spec_path.is_file() else {}
        schema = spec.get("schema")
        mode = spec.get("mode")
        if require_current_figures and schema != IMAGE_FIGURE_SPEC_SCHEMA:
            errors.append(
                f"{figure.get('id')}: 发布要求 {IMAGE_FIGURE_SPEC_SCHEMA}，"
                "历史 FigureSpec 只读"
            )
        if figure["id"] in exercise_figure_ids and spec:
            if not spec.get("source", {}).get("inventory"):
                errors.append(f"{figure['id']}: exercise figure requires source.inventory")
        if schema == IMAGE_FIGURE_SPEC_SCHEMA:
            review = figure.get("review")
            if not isinstance(review, str) or not review:
                errors.append(f"{figure.get('id')}: 当前图片缺 review 证据路径")
                review = f"figures/{figure.get('id')}.review.json"
            review_path = edition / review
            if mode == "deterministic":
                if any(figure.get(field) for field in ("png", "artwork", "generation")):
                    errors.append(f"{figure.get('id')}: deterministic 只允许 svg/render/review")
                svg = figure.get("svg")
                render = figure.get("render")
                if not isinstance(svg, str) or not svg:
                    errors.append(f"{figure.get('id')}: deterministic 缺 svg")
                    svg = f"figures/{figure.get('id')}.svg"
                if not isinstance(render, str) or not render:
                    errors.append(f"{figure.get('id')}: deterministic 缺 render")
                    render = f"figures/{figure.get('id')}.render.json"
                svg_path = edition / svg
                render_path = edition / render
                errors += validate_svg(
                    svg_path,
                    spec_path,
                    figure,
                    profile.get("figure_text_language"),
                    render_path,
                    {"deterministic"},
                )
                errors += validate_review(
                    review_path,
                    spec_path,
                    "render",
                    render_path,
                    {"svg": svg_path},
                    figure["id"],
                )
            elif mode == "hybrid":
                if any(figure.get(field) for field in ("png", "generation")):
                    errors.append(f"{figure.get('id')}: hybrid 不再交付扁平 PNG")
                artwork = figure.get("artwork")
                svg = figure.get("svg")
                render = figure.get("render")
                if not isinstance(artwork, str) or not artwork:
                    errors.append(f"{figure.get('id')}: hybrid 缺 artwork")
                    artwork = f"figures/{figure.get('id')}.artwork.png"
                if not isinstance(svg, str) or not svg:
                    errors.append(f"{figure.get('id')}: hybrid 缺 overlay svg")
                    svg = f"figures/{figure.get('id')}.svg"
                if not isinstance(render, str) or not render:
                    errors.append(f"{figure.get('id')}: hybrid 缺 render")
                    render = f"figures/{figure.get('id')}.render.json"
                artwork_path = edition / artwork
                svg_path = edition / svg
                render_path = edition / render
                errors += validate_svg(
                    svg_path,
                    spec_path,
                    figure,
                    profile.get("figure_text_language"),
                    render_path,
                    {"hybrid"},
                )
                errors += validate_artwork(
                    artwork_path,
                    render_path,
                    spec_path,
                    figure,
                )
                errors += validate_review(
                    review_path,
                    spec_path,
                    "render",
                    render_path,
                    {"artwork": artwork_path, "svg": svg_path},
                    figure["id"],
                )
            elif mode == "generated":
                if any(figure.get(field) for field in ("svg", "artwork", "render")):
                    errors.append(f"{figure.get('id')}: generated 只允许 png/generation/review")
                png = figure.get("png")
                generation = figure.get("generation")
                if not isinstance(png, str) or not png:
                    errors.append(f"{figure.get('id')}: generated 缺 png")
                    png = f"figures/{figure.get('id')}.png"
                if not isinstance(generation, str) or not generation:
                    errors.append(f"{figure.get('id')}: generated 缺 generation")
                    generation = f"figures/{figure.get('id')}.png.json"
                png_path = edition / png
                generation_path = edition / generation
                errors += validate_png(
                    png_path,
                    generation_path,
                    spec_path,
                    figure,
                )
                errors += validate_review(
                    review_path,
                    spec_path,
                    "generation",
                    generation_path,
                    {"png": png_path},
                    figure["id"],
                )
            else:
                errors.append(f"{spec_path}: 当前 FigureSpec mode 非法")
        else:
            if figure.get("png"):
                generation = figure.get("generation")
                if not isinstance(generation, str) or not generation:
                    errors.append(f"{figure.get('id')}: 缺 generation 元数据路径")
                    generation = f"figures/{figure.get('id')}.png.json"
                errors += validate_png(
                    edition / figure["png"],
                    edition / generation,
                    spec_path,
                    figure,
                )
            else:
                svg_path = edition / figure.get("svg", "")
                render_path = edition / figure.get(
                    "render",
                    f"{figure.get('svg', '')}.json",
                )
                errors += validate_svg(
                    svg_path,
                    spec_path,
                    figure,
                    profile.get("figure_text_language"),
                    render_path,
                )
        raw_figure = book / "figures" / f"{figure.get('id')}.png"
        recorded = figure.get("source", {}).get("png", {}).get("sha256")
        if raw_figure.exists() and recorded != sha256(raw_figure):
            errors.append(f"{figure.get('id')}: 原书 PNG 来源已过期")
    return lesson, exercises, figures, errors


def source_lesson_order(book: Path) -> dict[str, int]:
    source_index = load(book / "book.json")
    order = {}
    for position, item in enumerate(source_index.get("lessons", [])):
        lesson_id = item.get("card_id") or item.get("id")
        if not lesson_id:
            raise SystemExit("ERROR: 原始 book.json 含无 id 的课程条目")
        if lesson_id in order:
            raise SystemExit(f"ERROR: 原始 book.json 含重复课程 id: {lesson_id}")
        order[lesson_id] = position
    return order


def update_book_index(
    book: Path,
    edition: Path,
    profile_path: Path,
    lesson_rows: list[dict],
) -> None:
    path = edition / "book.json"
    existing = load(path) if path.exists() else {
        "schema": BOOK_SCHEMA,
        "edition": edition.name,
        "status": "ready",
        "profile": {
            "id": load(profile_path)["id"],
            "path": profile_path.as_posix(),
            "sha256": sha256(profile_path),
        },
        "lessons": [],
    }
    existing["profile"] = {
        "id": load(profile_path)["id"],
        "path": profile_path.as_posix(),
        "sha256": sha256(profile_path),
    }
    by_id = {item["id"]: item for item in existing.get("lessons", [])}
    for row in lesson_rows:
        by_id[row["id"]] = row
    source_order = source_lesson_order(book)

    def sort_key(item: dict) -> tuple[int, int, str]:
        lesson_id = item.get("id", "")
        if lesson_id in source_order:
            return (0, source_order[lesson_id], lesson_id)
        number = item.get("number")
        return (
            1,
            int(number) if str(number).isdigit() else sys.maxsize,
            lesson_id,
        )

    existing["status"] = "ready"
    existing["lessons"] = sorted(by_id.values(), key=sort_key)
    dump(path, existing)


def cmd_finalize(args: argparse.Namespace) -> int:
    book = source_dir(args)
    edition = edition_dir(args)
    profile_path = Path(args.profile)
    profile = load(profile_path)
    failed = False
    index_rows = []
    for lesson_id in selected_lessons(args):
        lesson, exercises, figures, errors = validate_lesson(
            book, edition, lesson_id, profile,
        )
        target = edition / "lessons" / lesson_id
        if errors:
            failed = True
            dump(target / "adaptation.audit.json", {
                "schema": AUDIT_SCHEMA,
                "edition": args.edition,
                "lesson": lesson_id,
                "status": "fail",
                "errors": errors,
            })
            for error in errors:
                print(f"ERROR {lesson_id}: {error}")
            continue
        for document, path in (
            (lesson, target / "lesson.json"),
            (exercises, target / "exercises.json"),
            (figures, target / "figures.json"),
        ):
            document["status"] = "ready"
            dump(path, document)
        changed_prose = sum(item["text"] != item["source_text"] for item in lesson["prose"])
        changed_exercises = sum(
            item["text"] != item["source_text"] for item in exercises["exercises"]
        )
        audit = {
            "schema": AUDIT_SCHEMA,
            "edition": args.edition,
            "lesson": lesson_id,
            "status": "pass",
            "sourceLessonSha256": lesson["source"]["sha256"],
            "sourceExercisesSha256": exercises["source"]["sha256"],
            "proseBlocks": len(lesson["prose"]),
            "changedProseBlocks": changed_prose,
            "sectionBreaks": len(lesson.get("section_breaks") or []),
            "exercises": len(exercises["exercises"]),
            "changedExercises": changed_exercises,
            "figures": len(figures["figures"]),
            "errors": [],
        }
        dump(target / "adaptation.audit.json", audit)
        index_rows.append({
            "id": lesson_id,
            "number": lesson["number"],
            "title": lesson["title"],
            "prose_blocks": len(lesson["prose"]),
            "exercises": len(exercises["exercises"]),
            "figures": len(figures["figures"]),
            "source_lesson_sha256": lesson["source"]["sha256"],
            "source_exercises_sha256": exercises["source"]["sha256"],
        })
        print(
            f"[adapt-finalize] {lesson_id}: PASS "
            f"正文改写 {changed_prose}/{len(lesson['prose'])}, "
            f"题改写 {changed_exercises}/{len(exercises['exercises'])}, "
            f"新图 {len(figures['figures'])}"
        )
    if not failed:
        update_book_index(book, edition, profile_path, index_rows)
    return 2 if failed else 0


def common(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--book", required=True)
    parser.add_argument("--edition", required=True)
    parser.add_argument("--lesson", action="append")
    parser.add_argument(
        "--root",
        default="ssot-resources/soviet10year-textbooks/artifacts",
    )
    parser.add_argument("--work", default=".tmp/ld-s10y-lesson")
    parser.add_argument(
        "--profile",
        default=str(Path(__file__).resolve().parent.parent / "profiles" / "modern-us-neutral.json"),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="生成和验证现代主题 edition")
    subparsers = parser.add_subparsers(dest="command", required=True)
    prepare = subparsers.add_parser("prepare")
    common(prepare)
    prepare.add_argument("--force", action="store_true")
    prepare.set_defaults(handler=cmd_prepare)
    finalize = subparsers.add_parser("finalize")
    common(finalize)
    finalize.set_defaults(handler=cmd_finalize)
    args = parser.parse_args()
    return args.handler(args)


if __name__ == "__main__":
    raise SystemExit(main())
