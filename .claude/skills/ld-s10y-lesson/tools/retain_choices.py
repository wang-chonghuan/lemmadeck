#!/usr/bin/env python3
"""Retain an approved offline choice set in its explicit source book."""

import argparse
import subprocess
import sys
from pathlib import Path

from production import validate_book, validate_workspace


def retain(repo: Path, book: str, lesson: str, source: Path,
           edition: str = "modern-us-neutral") -> str:
    validate_workspace(repo)
    validate_book(repo, book)
    sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
    from prepare import component, load_json

    component(lesson, "lesson")
    component(edition, "edition")
    source = source.resolve(strict=True)
    seed = load_json(source / "seed.json")
    if seed["source"]["book"] != book or seed["source"]["lesson"] != lesson:
        raise ValueError("choice seed belongs to another book or lesson")
    target = repo / "ssot-resources/soviet10year-textbooks/artifacts" / book / \
        "editions" / edition / "lessons" / lesson / "choice-set"
    if target.resolve() != target:
        raise ValueError("choice output has a redirected owner")
    gate = subprocess.run([
        sys.executable, str(repo / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
        "--repo", str(repo), "--edition", edition, "--seed", str(source / "seed.json"),
        "--draft", str(source / "draft.json"), "--review", str(source / "review.json"),
    ], capture_output=True, text=True)
    if gate.returncode:
        raise ValueError(gate.stdout + gate.stderr)

    files = [Path(name) for name in ("seed.json", "draft.json", "review.json")]
    for figure in load_json(source / "draft.json")["new_figures"]:
        declared = repo / figure["path"]
        if not declared.resolve().is_relative_to(target / "figures"):
            raise ValueError("authored figures must already declare the retained lesson path")
        # The image skill retains figure assets before this question snapshot.
        for path in [declared, *(declared.with_suffix(suffix) for suffix in
                                 (".spec.json", ".render.json", ".review.json"))]:
            if not path.is_file():
                raise ValueError(f"missing retained figure artifact: {path}")
    missing = []
    for relative in files:
        if not (source / relative).is_file():
            raise ValueError(f"missing retained input: {relative}")
        output = target / relative
        if output.exists():
            if not output.is_file() or output.read_bytes() != (source / relative).read_bytes():
                raise ValueError("existing choice output differs; no overwrite")
        else:
            missing.append(relative)
    if not missing:
        return "reused"
    target.mkdir(parents=True, exist_ok=True)
    for relative in missing:
        with (target / relative).open("xb") as output:
            output.write((source / relative).read_bytes())
    return "retained"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--book", required=True)
    parser.add_argument("--edition", default="modern-us-neutral")
    parser.add_argument("--lesson", required=True)
    parser.add_argument("--source", required=True)
    args = parser.parse_args()
    try:
        result = retain(Path(args.repo).resolve(), args.book, args.lesson, Path(args.source),
                        args.edition)
    except (ValueError, OSError) as error:
        parser.exit(1, f"ERROR: {error}\n")
    print(f"{result}: {args.book}/{args.lesson}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
