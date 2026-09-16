#!/usr/bin/env python3
"""Read-only publication gate. Revalidate current files, not a stale pass flag."""

import argparse
from pathlib import Path

from edition import load, validate_lesson


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("book", type=Path)
    parser.add_argument("--edition", required=True)
    parser.add_argument("--lesson", action="append", required=True)
    args = parser.parse_args()
    profile = load(Path(__file__).resolve().parents[1] / "profiles" / f"{args.edition}.json")
    errors = []
    for lesson in args.lesson:
        _, _, _, failures = validate_lesson(
            args.book, args.book / "editions" / args.edition, lesson, profile,
        )
        errors.extend(f"{lesson}: {failure}" for failure in failures)
    for error in errors:
        print(f"ERROR: {error}")
    if not errors:
        print(f"PASS: {len(args.lesson)} lessons revalidated for publication")
    return 2 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
