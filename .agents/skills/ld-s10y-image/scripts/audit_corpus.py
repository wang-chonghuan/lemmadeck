#!/usr/bin/env python3
"""Audit figures from the lesson references that actually reach the product."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


CURRENT_SPEC = "ld-s10y-image/figure-spec@2"
CURRENT_REVIEW = "ld-s10y-image/review@1"
REPO = Path(__file__).resolve().parents[4]


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def resolve(value: str, edition: Path) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path
    if value.startswith("ssot-resources/"):
        return REPO / path
    return edition / path


def ordered_unique(values: list[str]) -> list[str]:
    return list(dict.fromkeys(values))


def lesson_references(lesson: dict, exercises: dict) -> list[str]:
    references = [
        item["id"]
        for item in lesson.get("prose", [])
        if isinstance(item, dict)
        and item.get("kind") == "fig"
        and isinstance(item.get("id"), str)
    ]
    for exercise in exercises.get("exercises", []):
        references.extend(
            value
            for value in exercise.get("figure_refs", [])
            if isinstance(value, str)
        )
        references.extend(
            item["id"]
            for item in exercise.get("figures", [])
            if isinstance(item, dict) and isinstance(item.get("id"), str)
        )
    return ordered_unique(references)


def issue(
    issues: list[dict],
    code: str,
    book: str,
    lesson: str,
    figure: str | None,
    message: str,
) -> None:
    issues.append({
        "code": code,
        "book": book,
        "lesson": lesson,
        "figure": figure,
        "message": message,
    })


def check_hash(
    issues: list[dict],
    code: str,
    book: str,
    lesson: str,
    figure: str,
    path: Path,
    recorded: object,
) -> None:
    if not path.is_file():
        issue(issues, f"missing-{code}", book, lesson, figure, f"missing {path}")
    elif recorded != sha256(path):
        issue(issues, f"stale-{code}", book, lesson, figure, f"stale hash for {path}")


def inspect_current_figure(
    issues: list[dict],
    book: str,
    lesson: str,
    edition: Path,
    figure: dict,
    spec_path: Path,
    spec: dict,
) -> None:
    figure_id = figure["id"]
    inventory = spec.get("source", {}).get("inventory")
    if not isinstance(inventory, list) or not inventory:
        issue(
            issues,
            "missing-source-inventory",
            book,
            lesson,
            figure_id,
            "current FigureSpec has no source inventory",
        )

    review_value = figure.get("review")
    if not isinstance(review_value, str) or not review_value:
        issue(
            issues,
            "missing-review",
            book,
            lesson,
            figure_id,
            "current figure manifest has no review path",
        )
        return
    review_path = resolve(review_value, edition)
    if not review_path.is_file():
        issue(
            issues,
            "missing-review",
            book,
            lesson,
            figure_id,
            f"missing {review_path}",
        )
        return
    review = load(review_path)
    if review.get("schema") != CURRENT_REVIEW or review.get("status") != "pass":
        issue(
            issues,
            "invalid-review",
            book,
            lesson,
            figure_id,
            "review schema or status is invalid",
        )
    if review.get("figure") != figure_id:
        issue(
            issues,
            "invalid-review",
            book,
            lesson,
            figure_id,
            "review figure id differs from the manifest",
        )
    check_hash(
        issues,
        "review-spec",
        book,
        lesson,
        figure_id,
        spec_path,
        review.get("spec", {}).get("sha256"),
    )

    source = spec.get("source", {}).get("image", {})
    source_path = resolve(source.get("path", ""), edition)
    check_hash(
        issues,
        "review-source",
        book,
        lesson,
        figure_id,
        source_path,
        review.get("source", {}).get("sha256"),
    )

    mode = spec.get("mode")
    evidence_name = "generation" if mode == "generated" else "render"
    evidence_value = figure.get(evidence_name)
    if not isinstance(evidence_value, str) or not evidence_value:
        issue(
            issues,
            f"missing-{evidence_name}",
            book,
            lesson,
            figure_id,
            f"manifest has no {evidence_name} path",
        )
    else:
        evidence_path = resolve(evidence_value, edition)
        check_hash(
            issues,
            f"review-{evidence_name}",
            book,
            lesson,
            figure_id,
            evidence_path,
            review.get(evidence_name, {}).get("sha256"),
        )

    outputs = {
        "deterministic": ("svg",),
        "hybrid": ("artwork", "svg"),
        "generated": ("png",),
    }.get(mode, ())
    if not outputs:
        issue(
            issues,
            "invalid-mode",
            book,
            lesson,
            figure_id,
            f"unsupported current mode {mode!r}",
        )
    for name in outputs:
        value = figure.get(name)
        if not isinstance(value, str) or not value:
            issue(
                issues,
                f"missing-{name}",
                book,
                lesson,
                figure_id,
                f"manifest has no {name} path",
            )
            continue
        check_hash(
            issues,
            f"review-output-{name}",
            book,
            lesson,
            figure_id,
            resolve(value, edition),
            review.get("outputs", {}).get(name, {}).get("sha256"),
        )


def audit(artifact_root: Path, edition_name: str, require_current: bool) -> dict:
    issues: list[dict] = []
    lessons: list[dict] = []
    unique: dict[tuple[str, str], str] = {}
    for book_dir in sorted(path for path in artifact_root.iterdir() if path.is_dir()):
        edition = book_dir / "editions" / edition_name
        lessons_dir = edition / "lessons"
        if not lessons_dir.is_dir():
            continue
        for lesson_dir in sorted(path for path in lessons_dir.iterdir() if path.is_dir()):
            lesson_id = lesson_dir.name
            required = ("lesson.json", "exercises.json", "figures.json")
            missing = [name for name in required if not (lesson_dir / name).is_file()]
            if missing:
                issue(
                    issues,
                    "missing-lesson-file",
                    book_dir.name,
                    lesson_id,
                    None,
                    f"missing {', '.join(missing)}",
                )
                continue
            lesson = load(lesson_dir / "lesson.json")
            exercises = load(lesson_dir / "exercises.json")
            figures = load(lesson_dir / "figures.json").get("figures", [])
            manifest = {
                item.get("id"): item
                for item in figures
                if isinstance(item, dict) and isinstance(item.get("id"), str)
            }
            if len(manifest) != len(figures):
                issue(
                    issues,
                    "invalid-manifest",
                    book_dir.name,
                    lesson_id,
                    None,
                    "figure manifest has missing or duplicate ids",
                )
            references = lesson_references(lesson, exercises)
            schemas: dict[str, int] = {}
            for figure_id in references:
                unique.setdefault((book_dir.name, figure_id), lesson_id)
                figure = manifest.get(figure_id)
                if figure is None:
                    issue(
                        issues,
                        "missing-manifest",
                        book_dir.name,
                        lesson_id,
                        figure_id,
                        "referenced figure is absent from figures.json",
                    )
                    continue
                spec_value = figure.get("spec")
                if not isinstance(spec_value, str) or not spec_value:
                    issue(
                        issues,
                        "missing-spec",
                        book_dir.name,
                        lesson_id,
                        figure_id,
                        "manifest has no spec path",
                    )
                    continue
                spec_path = resolve(spec_value, edition)
                if not spec_path.is_file():
                    issue(
                        issues,
                        "missing-spec",
                        book_dir.name,
                        lesson_id,
                        figure_id,
                        f"missing {spec_path}",
                    )
                    continue
                spec = load(spec_path)
                schema = spec.get("schema", "unknown")
                schemas[schema] = schemas.get(schema, 0) + 1
                if require_current and schema != CURRENT_SPEC:
                    issue(
                        issues,
                        "legacy-spec",
                        book_dir.name,
                        lesson_id,
                        figure_id,
                        f"referenced figure uses {schema}",
                    )
                if schema == CURRENT_SPEC:
                    inspect_current_figure(
                        issues,
                        book_dir.name,
                        lesson_id,
                        edition,
                        figure,
                        spec_path,
                        spec,
                    )
            unreferenced = sorted(set(manifest) - set(references))
            for figure_id in unreferenced:
                issue(
                    issues,
                    "unreferenced-manifest",
                    book_dir.name,
                    lesson_id,
                    figure_id,
                    "manifest figure is not used by lesson prose or exercises",
                )
            lessons.append({
                "book": book_dir.name,
                "lesson": lesson_id,
                "references": references,
                "schemas": schemas,
            })

    schema_counts: dict[str, int] = {}
    for book, figure_id in unique:
        lesson_id = unique[(book, figure_id)]
        lesson = next(
            row for row in lessons
            if row["book"] == book and row["lesson"] == lesson_id
        )
        for schema, count in lesson["schemas"].items():
            if figure_id in lesson["references"] and count:
                edition = artifact_root / book / "editions" / edition_name
                manifest = {
                    item["id"]: item
                    for item in load(
                        edition / "lessons" / lesson_id / "figures.json"
                    ).get("figures", [])
                }
                item = manifest.get(figure_id)
                if item:
                    spec_path = resolve(item.get("spec", ""), edition)
                    if spec_path.is_file():
                        actual = load(spec_path).get("schema", "unknown")
                        schema_counts[actual] = schema_counts.get(actual, 0) + 1
                break
    affected = {
        (entry["book"], entry["lesson"])
        for entry in issues
        if entry["code"] == "legacy-spec"
    }
    return {
        "schema": "ld-s10y-image/corpus-audit@1",
        "edition": edition_name,
        "status": "fail" if issues else "pass",
        "counts": {
            "lessons": len(lessons),
            "referencedFigures": len(unique),
            "legacyFigures": schema_counts.get(
                "ld-s10y-image/figure-spec@1", 0
            ),
            "currentFigures": schema_counts.get(CURRENT_SPEC, 0),
            "affectedLessons": len(affected),
            "issues": len(issues),
        },
        "lessons": lessons,
        "issues": issues,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--artifact-root",
        type=Path,
        default=Path("ssot-resources/soviet10year-textbooks/artifacts"),
    )
    parser.add_argument("--edition", default="modern-us-neutral")
    parser.add_argument("--require-current", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = audit(args.artifact_root, args.edition, args.require_current)
    payload = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(payload, encoding="utf-8")
    print(payload, end="")
    return 2 if report["issues"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
