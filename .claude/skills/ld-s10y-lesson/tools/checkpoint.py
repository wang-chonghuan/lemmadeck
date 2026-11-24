#!/usr/bin/env python3
"""Bounded, machine-readable production checkpoint.

The checkpoint is the only resume input for lesson production. It is a fixed shape
with hard limits so it cannot grow into a narrative: every field is short, every key
is known, and the whole file is capped. Validation runs before any write, so an
over-limit value fails loudly and leaves the file untouched.

Standard library only.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = "lemmadeck/production-checkpoint@2"

MAX_STR = 200
MAX_BYTES = 256 * 1024

TOP_KEYS = ("schema", "book", "updated", "lessons", "sessions")
LESSON_KEYS = ("lesson", "stage", "session", "commit", "tokens", "note")
SESSION_KEYS = (
    "session", "started", "ended", "turns",
    "input", "cacheWrite", "cached", "output", "total", "peakContext", "costCents",
)
LESSON_INTS = ("tokens",)
SESSION_INTS = ("turns", "input", "cacheWrite", "cached", "output", "total",
                "peakContext", "costCents")

STAGES = ("prepared", "authored", "retained", "pushed", "published", "held")


class CheckpointError(ValueError):
    """A limit or shape was violated. The message names the field and the limit."""


def now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def checkpoint_path(repo: Path, ticket: str) -> Path:
    if not ticket or Path(ticket).name != ticket or ticket in {".", ".."}:
        raise CheckpointError(f"invalid ticket identity: {ticket!r}")
    return repo / ".intentfold/tickets" / ticket / "production/checkpoint.json"


def validate_repo(repo: str | Path) -> Path:
    repo = Path(repo).expanduser().resolve(strict=True)
    if not (repo / ".intentfold/project.json").is_file():
        raise CheckpointError(f"not a project checkout: {repo}")
    return repo


def _check_str(where: str, key: str, value, *, required: bool) -> None:
    if value is None and not required:
        return
    if not isinstance(value, str):
        raise CheckpointError(f"{where}.{key} must be a string, got {type(value).__name__}")
    if len(value) > MAX_STR:
        raise CheckpointError(
            f"{where}.{key} is {len(value)} characters, limit is {MAX_STR}"
        )


def _check_int(where: str, key: str, value) -> None:
    if value is None:
        return
    if isinstance(value, bool) or not isinstance(value, int):
        raise CheckpointError(f"{where}.{key} must be an integer, got {type(value).__name__}")
    if value < 0:
        raise CheckpointError(f"{where}.{key} must not be negative: {value}")


def _check_row(where: str, row, keys: tuple[str, ...], ints: tuple[str, ...]) -> None:
    if not isinstance(row, dict):
        raise CheckpointError(f"{where} must be an object, got {type(row).__name__}")
    unknown = sorted(set(row) - set(keys))
    if unknown:
        raise CheckpointError(f"{where} has unknown keys: {', '.join(unknown)}")
    for key, value in row.items():
        if key in ints:
            _check_int(where, key, value)
        else:
            _check_str(where, key, value, required=False)


def validate(doc) -> None:
    """Raise CheckpointError on the first violation; the message names field and limit."""
    if not isinstance(doc, dict):
        raise CheckpointError(f"checkpoint must be an object, got {type(doc).__name__}")
    unknown = sorted(set(doc) - set(TOP_KEYS))
    if unknown:
        raise CheckpointError(f"checkpoint has unknown keys: {', '.join(unknown)}")
    missing = [k for k in TOP_KEYS if k not in doc]
    if missing:
        raise CheckpointError(f"checkpoint is missing {', '.join(missing)}")
    if doc["schema"] != SCHEMA:
        raise CheckpointError(f"schema must be {SCHEMA}, got {doc['schema']!r}")
    _check_str("checkpoint", "book", doc["book"], required=True)
    _check_str("checkpoint", "updated", doc["updated"], required=True)

    for name, keys, ints in (
        ("lessons", LESSON_KEYS, LESSON_INTS),
        ("sessions", SESSION_KEYS, SESSION_INTS),
    ):
        rows = doc[name]
        if not isinstance(rows, list):
            raise CheckpointError(f"checkpoint.{name} must be a list, got {type(rows).__name__}")
        for index, row in enumerate(rows):
            _check_row(f"{name}[{index}]", row, keys, ints)

    seen: set[str] = set()
    for index, row in enumerate(doc["lessons"]):
        lesson = row.get("lesson")
        if not lesson:
            raise CheckpointError(f"lessons[{index}].lesson is required")
        if lesson in seen:
            raise CheckpointError(f"lessons[{index}].lesson is a duplicate: {lesson}")
        seen.add(lesson)
        stage = row.get("stage")
        if stage not in STAGES:
            raise CheckpointError(
                f"lessons[{index}].stage must be one of {'|'.join(STAGES)}, got {stage!r}"
            )
    for index, row in enumerate(doc["sessions"]):
        if not row.get("session"):
            raise CheckpointError(f"sessions[{index}].session is required")


def serialize(doc) -> bytes:
    """Validate, then render. Over-limit size is a failure, never a truncation."""
    validate(doc)
    payload = json.dumps(doc, ensure_ascii=False, indent=2, sort_keys=False)
    data = (payload + "\n").encode("utf-8")
    if len(data) > MAX_BYTES:
        raise CheckpointError(
            f"checkpoint is {len(data)} bytes, limit is {MAX_BYTES}; "
            "prune delivered lessons instead of extending the file"
        )
    return data


def load(path: Path):
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise CheckpointError(f"no checkpoint at {path}; run `checkpoint.py init` first") from None
    if len(text.encode("utf-8")) > MAX_BYTES:
        raise CheckpointError(
            f"checkpoint at {path} is over the {MAX_BYTES}-byte limit"
        )
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        raise CheckpointError(f"checkpoint at {path} is not valid JSON: {error}") from error


def store(path: Path, doc) -> None:
    """Serialize first, write atomically second. A rejected document never lands."""
    data = serialize(doc)
    path.parent.mkdir(parents=True, exist_ok=True)
    handle = tempfile.NamedTemporaryFile(
        "wb", dir=str(path.parent), prefix=".checkpoint-", suffix=".tmp", delete=False
    )
    try:
        with handle as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(handle.name, path)
    except BaseException:
        Path(handle.name).unlink(missing_ok=True)
        raise


def upsert(rows: list, key: str, value: str, fields: dict) -> list:
    for row in rows:
        if row.get(key) == value:
            row.update({k: v for k, v in fields.items() if v is not None})
            return rows
    rows.append({key: value, **{k: v for k, v in fields.items() if v is not None}})
    return rows


def cmd_init(args) -> int:
    repo = validate_repo(args.repo)
    path = checkpoint_path(repo, args.ticket)
    if path.exists() and not args.force:
        raise CheckpointError(f"checkpoint already exists at {path}; pass --force to replace")
    store(path, {
        "schema": SCHEMA,
        "book": args.book,
        "updated": now(),
        "lessons": [],
        "sessions": [],
    })
    print(json.dumps({"ok": True, "path": str(path.relative_to(repo))}, ensure_ascii=False))
    return 0


def cmd_set_lesson(args) -> int:
    repo = validate_repo(args.repo)
    path = checkpoint_path(repo, args.ticket)
    doc = load(path)
    validate(doc)
    upsert(doc["lessons"], "lesson", args.lesson, {
        "stage": args.stage,
        "session": args.session,
        "commit": args.commit,
        "tokens": args.tokens,
        "note": args.note,
    })
    doc["updated"] = now()
    store(path, doc)
    print(json.dumps({"ok": True, "lesson": args.lesson, "stage": args.stage}, ensure_ascii=False))
    return 0


def cmd_record_session(args) -> int:
    repo = validate_repo(args.repo)
    path = checkpoint_path(repo, args.ticket)
    doc = load(path)
    validate(doc)
    upsert(doc["sessions"], "session", args.session, {
        "started": args.started,
        "ended": args.ended or now(),
        "turns": args.turns,
        "input": args.input,
        "cached": args.cached,
        "output": args.output,
        "total": args.total,
        "peakContext": args.peak_context,
    })
    doc["updated"] = now()
    store(path, doc)
    print(json.dumps({"ok": True, "session": args.session}, ensure_ascii=False))
    return 0


def cmd_check(args) -> int:
    if args.path:
        path = Path(args.path).expanduser()
    else:
        path = checkpoint_path(validate_repo(args.repo), args.ticket)
    doc = load(path)
    validate(doc)
    size = len(path.read_bytes())
    longest = 0
    for name in ("lessons", "sessions"):
        for row in doc[name]:
            for value in row.values():
                if isinstance(value, str):
                    longest = max(longest, len(value))
    print(json.dumps({
        "ok": True,
        "path": str(path),
        "bytes": size,
        "byteLimit": MAX_BYTES,
        "longestField": longest,
        "fieldLimit": MAX_STR,
        "lessons": len(doc["lessons"]),
        "sessions": len(doc["sessions"]),
    }, ensure_ascii=False, indent=2))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    commands = parser.add_subparsers(dest="command", required=True)

    init = commands.add_parser("init", help="create an empty checkpoint")
    init.add_argument("--repo", required=True)
    init.add_argument("--ticket", required=True)
    init.add_argument("--book", required=True)
    init.add_argument("--force", action="store_true")
    init.set_defaults(func=cmd_init)

    lesson = commands.add_parser("set-lesson", help="record one lesson's stage")
    lesson.add_argument("--repo", required=True)
    lesson.add_argument("--ticket", required=True)
    lesson.add_argument("--lesson", required=True)
    lesson.add_argument("--stage", required=True, choices=STAGES)
    lesson.add_argument("--session")
    lesson.add_argument("--commit")
    lesson.add_argument("--tokens", type=int)
    lesson.add_argument("--note")
    lesson.set_defaults(func=cmd_set_lesson)

    session = commands.add_parser("record-session", help="record one session's usage")
    session.add_argument("--repo", required=True)
    session.add_argument("--ticket", required=True)
    session.add_argument("--session", required=True)
    session.add_argument("--started")
    session.add_argument("--ended")
    session.add_argument("--turns", type=int)
    session.add_argument("--input", type=int)
    session.add_argument("--cached", type=int)
    session.add_argument("--output", type=int)
    session.add_argument("--total", type=int)
    session.add_argument("--peak-context", type=int, dest="peak_context")
    session.set_defaults(func=cmd_record_session)

    check = commands.add_parser("check", help="validate a checkpoint against the limits")
    check.add_argument("--repo")
    check.add_argument("--ticket")
    check.add_argument("--path", help="validate this file instead of the ticket's own")
    check.set_defaults(func=cmd_check)

    args = parser.parse_args(argv)
    if args.command == "check" and not args.path and not (args.repo and args.ticket):
        parser.error("check needs --path, or both --repo and --ticket")
    try:
        return args.func(args)
    except CheckpointError as error:
        print(f"checkpoint: {error}", file=sys.stderr)
        return 1
    except (OSError, ValueError) as error:
        print(f"checkpoint: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
