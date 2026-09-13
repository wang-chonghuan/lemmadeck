#!/usr/bin/env python3
"""Enforce the repository's product-resource boundary."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SSOT = REPO / "ssot-resources"
ARTIFACTS = SSOT / "soviet10year-textbooks" / "artifacts"
FROZEN_PREFIXES = (".intentmill/", ".prodfarm/", ".intentfold/tickets/")
CODE_ASSET_PREFIXES = (
    ".agents/skills/",
    ".claude/skills/",
    "app/tests/",
)
PRODUCT_BINARY_SUFFIXES = {
    ".gif", ".jpeg", ".jpg", ".mp3", ".mp4", ".pdf", ".png", ".ttf", ".wav", ".webp", ".woff",
    ".woff2",
}
LEGACY_REFERENCE_PATTERNS = (
    (re.compile(r"(?<![\w-])resources/s10y-lessons"), "resources/s10y-lessons"),
    (re.compile(r"(?<![\w-])resources/reference"), "resources/reference"),
    (re.compile(r"(?<![\w-])resources/content"), "resources/content"),
    (re.compile(r"(?<![\w-])resources/soviet10years"), "resources/soviet10years"),
    (re.compile(r"(?<![\w-])app/public"), "app/public"),
    (re.compile(r"(?<![\w-])\.tmp/ori-books"), ".tmp/ori-books"),
    (re.compile(r"(?<![\w-])sources/toc/toc/"), "sources/toc/toc/"),
)
ACTIVE_TEXT_ROOTS = (
    REPO / "AGENTS.md",
    REPO / "README.md",
    REPO / ".intentfold" / "charter",
    REPO / ".evodocs" / "modules",
    REPO / ".agents" / "skills",
    REPO / ".claude" / "skills",
    REPO / "app",
    REPO / "infra",
    REPO / "prototypes",
    SSOT,
)
TRANSIENT_NAMES = {
    "layout.json",
    "page.grid.png",
    "page.png",
    "page.template.md",
    "text.html",
    "exercises.html",
}


def tracked_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=REPO,
        check=True,
        capture_output=True,
    )
    return [
        REPO / item.decode()
        for item in result.stdout.split(b"\0")
        if item and (REPO / item.decode()).is_file()
    ]


def text_files(root: Path):
    paths = [root] if root.is_file() else root.rglob("*")
    for path in paths:
        if not path.is_file() or path.resolve() == Path(__file__).resolve():
            continue
        try:
            yield path, path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue


def is_disposable_reference(value: str) -> bool:
    return (
        value.startswith(".tmp/")
        or "/.tmp/" in value
        or (
            value.startswith(".intentfold/tickets/")
            and "/tmp/" in value
        )
    )


def json_tmp_references(value, pointer: str = "$"):
    if isinstance(value, dict):
        for key, child in value.items():
            yield from json_tmp_references(child, f"{pointer}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from json_tmp_references(child, f"{pointer}[{index}]")
    elif isinstance(value, str) and is_disposable_reference(value):
        yield pointer, value


def main() -> int:
    errors: list[str] = []
    for forbidden in (REPO / "resources", REPO / "app" / "public"):
        if forbidden.exists():
            errors.append(f"legacy resource root exists: {forbidden.relative_to(REPO)}")

    for path in tracked_files():
        relative = path.relative_to(REPO).as_posix()
        if relative.startswith(FROZEN_PREFIXES) or relative.startswith("ssot-resources/"):
            continue
        if path.suffix.lower() in PRODUCT_BINARY_SUFFIXES and not relative.startswith(
            CODE_ASSET_PREFIXES
        ):
            errors.append(f"product binary outside ssot-resources: {relative}")

    if (REPO / "prototypes" / "knowledge-galaxy" / "web" / "galaxy.json").exists():
        errors.append("duplicate galaxy data exists outside ssot-resources/public")

    if ARTIFACTS.exists():
        for path in ARTIFACTS.rglob("*"):
            if not path.is_file():
                continue
            relative = path.relative_to(REPO).as_posix()
            if path.name in TRANSIENT_NAMES or ".template." in path.name:
                errors.append(f"tracked 10y transient artifact: {relative}")
            if "pages" in path.parts and "figures" in path.parts:
                errors.append(f"page-level duplicate figure: {relative}")
            if path.suffix == ".json":
                try:
                    document = json.loads(path.read_text(encoding="utf-8"))
                except json.JSONDecodeError as error:
                    errors.append(f"invalid JSON: {relative}: {error}")
                    continue
                for pointer, value in json_tmp_references(document):
                    errors.append(
                        f"persistent JSON depends on disposable work: "
                        f"{relative}:{pointer}={value}"
                    )

    for root in ACTIVE_TEXT_ROOTS:
        if not root.exists():
            continue
        for path, text in text_files(root):
            relative = path.relative_to(REPO).as_posix()
            if relative.startswith(FROZEN_PREFIXES):
                continue
            for pattern, legacy in LEGACY_REFERENCE_PATTERNS:
                if pattern.search(text):
                    errors.append(f"legacy resource reference {legacy!r}: {relative}")

    for error in errors:
        print(f"FAIL {error}", file=sys.stderr)
    if errors:
        return 1
    print("OK - product resources are confined to ssot-resources; .tmp is disposable")
    return 0


if __name__ == "__main__":
    sys.exit(main())
