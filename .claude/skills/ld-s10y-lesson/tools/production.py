#!/usr/bin/env python
"""Small offline helpers for existing S10Y tools; no content approval decisions."""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path


TOOL = Path(".claude/skills/ld-s10y-lesson/tools/p2c.py")
SOURCES = Path("ssot-resources/soviet10year-textbooks/sources")
ARTIFACTS = Path("ssot-resources/soviet10year-textbooks/artifacts")
PREPARED_FILES = ("page.png", "page.grid.png", "layout.json", "page.template.md")


def validate_workspace(repo: str | Path) -> Path:
    repo = Path(repo).expanduser().resolve(strict=True)
    if Path.cwd().resolve() != repo:
        raise ValueError(f"invocation cwd must equal --repo: {repo}")
    markers = (Path(".intentfold/readme.md"), Path(".intentfold/project.json"), TOOL)
    if not all((repo / marker).is_file() for marker in markers):
        raise ValueError(f"not a project checkout: {repo}")
    project = json.loads((repo / ".intentfold/project.json").read_text(encoding="utf-8"))
    if not isinstance(project, dict) or project.get("project") != "lemmadeck":
        raise ValueError(f"not the lemmadeck project: {repo}")
    result = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "--show-toplevel"],
        capture_output=True, text=True, check=False,
    )
    if result.returncode or not result.stdout.strip() or Path(result.stdout.strip()).resolve() != repo:
        raise ValueError(f"--repo must be the exact git checkout root: {repo}")
    return repo


def validate_book(repo: str | Path, book: str) -> None:
    manifest = json.loads(
        (Path(repo) / SOURCES / "manifest.json").read_text(encoding="utf-8")
    )
    catalogs = manifest.get("catalogs", []) if isinstance(manifest, dict) else []
    if (
        not book or Path(book).name != book or book in {".", ".."}
        or not isinstance(catalogs, list)
        or not any(isinstance(item, dict) and item.get("book") == book for item in catalogs)
    ):
        raise ValueError(f"book {book!r} is not in manifest.catalogs")


def validate_output_owner(repo: Path, path: Path) -> None:
    declared = path.absolute()
    if not declared.is_relative_to(repo) or declared.resolve() != declared:
        raise ValueError(f"output is outside this checkout or redirects its owner: {path}")


def validate_lesson_owner(book: Path, lesson: str) -> None:
    if not lesson or Path(lesson).name != lesson or lesson in {".", ".."}:
        raise ValueError(f"invalid lesson identity: {lesson!r}")
    index = json.loads((book / "book.json").read_text(encoding="utf-8"))
    if not any((row.get("card_id") or row.get("id")) == lesson
               for row in index.get("lessons", [])):
        raise ValueError(f"lesson {lesson!r} is absent from source book {book.name}")


def read_json_documents(text: str) -> list:
    """Decode top-level JSON objects/arrays, skipping prose and listing lines."""
    decoder = json.JSONDecoder()
    documents = []
    position = 0
    while position < len(text):
        if text[position].isspace():
            position += 1
            continue
        newline = text.find("\n", position)
        next_line = len(text) if newline < 0 else newline + 1
        if text[position] not in "{[":
            position = next_line
            continue
        try:
            document, end = decoder.raw_decode(text, position)
        except json.JSONDecodeError as error:
            # Bracketed log labels are not incomplete JSON arrays.
            line = text[position:next_line]
            label, closing, _ = line[1:].partition("]")
            if line.startswith("[") and closing and label.lstrip() and label.lstrip()[0].isalpha() and all(
                c.isalnum() or c in "-_ .:" for c in label
            ):
                try:
                    decoder.raw_decode(label.lstrip())
                except json.JSONDecodeError:
                    position = next_line
                    continue
            raise ValueError(f"incomplete or malformed JSON at offset {position}: {error}") from error
        documents.append(document)
        position = end
    if not documents:
        raise ValueError("no complete JSON documents found")
    return documents


def _receipt_field(record: dict, names: tuple[str, ...]):
    values = [record[name] for name in names if name in record]
    if not values:
        raise ValueError(f"receipt is missing {names[0]}")
    if any(value != values[0] for value in values[1:]):
        raise ValueError(f"receipt has conflicting aliases for {names[0]}")
    return values[0]


def normalize_receipt(record: dict, base: Path) -> dict:
    """Read execution facts, not a package's incidental nesting or bookkeeping."""
    if not isinstance(record, dict):
        raise ValueError("execution receipt must be an object")
    if record.get("error") or record.get("signal") or record.get("ok") is False:
        raise ValueError("execution receipt records a failure or interruption")
    cwd = _receipt_field(record, ("cwd", "workdir"))
    if not isinstance(cwd, str) or not Path(cwd).is_absolute():
        raise ValueError("receipt cwd must be an absolute path")
    code = _receipt_field(record, ("exitCode", "exit_code", "returncode"))
    if type(code) is not int or code != 0:
        raise ValueError(f"execution did not complete successfully: {code!r}")
    arguments = {name: record[name] for name in ("argv", "child_argv") if name in record}
    command = record.get("command")
    if isinstance(command, list):
        arguments["command"] = command
    argv = _receipt_field(arguments, ("argv", "child_argv", "command"))
    if not isinstance(argv, list) or not argv or any(not isinstance(arg, str) for arg in argv):
        raise ValueError("receipt argv must be a nonempty string array")
    if isinstance(command, str):
        if not command.strip() or any(char.isspace() for char in command):
            raise ValueError("receipt command must be one executable, not a shell string")
        if argv[0] != command:
            argv = [command, *argv]
    elif command is not None and not isinstance(command, list):
        raise ValueError("receipt command must be an executable or argv array")
    streams = record.get("streams", {})
    if not isinstance(streams, dict):
        raise ValueError("receipt streams must be an object")

    def stream_binding(value) -> dict:
        binding = {"path": value} if isinstance(value, str) else value
        if not isinstance(binding, dict) or not isinstance(binding.get("path"), str) or not binding["path"]:
            raise ValueError("receipt stream must name a saved file")
        path = Path(binding["path"])
        path = path if path.is_absolute() else base / path
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        if "sha256" in binding and binding["sha256"] != digest:
            raise ValueError(f"receipt stream hash mismatch: {path}")
        if "bytes" in binding and binding["bytes"] != len(data):
            raise ValueError(f"receipt stream size mismatch: {path}")
        return {"path": str(path.resolve()), "sha256": digest}

    result = {"cwd": cwd, "argv": argv, "exitCode": code}
    for name in ("stdout", "stderr"):
        bindings = [stream_binding(container[name]) for container in (record, streams) if name in container]
        if not bindings or any(binding != bindings[0] for binding in bindings[1:]):
            raise ValueError(f"receipt missing or conflicting {name} stream")
        result[name] = bindings[0]
    return result


def read_receipt(path: Path, expected: Path | None = None) -> dict:
    record = json.loads(path.read_text(encoding="utf-8"))
    result = normalize_receipt(record, path.parent)
    if expected is not None:
        comparison = normalize_receipt(
            json.loads(expected.read_text(encoding="utf-8")), expected.parent,
        )
        if comparison != result:
            raise ValueError("receipt execution facts differ from expected receipt")
    return {"ok": True, "execution": result}


def validate_prepared_page(page_dir: Path, book: str, page: int, source: dict) -> None:
    import blocks as B
    from layout import sha256_file
    from PIL import Image

    meta, _ = B.parse((page_dir / "page.template.md").read_text(encoding="utf-8"))
    if not isinstance(meta, dict) or (
        meta.get("schema") != "ld-s10y-lesson/page@3"
        or meta.get("book") != book or meta.get("page") != page
        or meta.get("source") != {**source, "pdf_page": page}
    ):
        raise ValueError(f"prepared page identity or source mismatch: {page_dir}")
    render = meta.get("render")
    dimensions = json.loads((page_dir / "layout.json").read_text(encoding="utf-8"))
    if not isinstance(render, dict) or not isinstance(dimensions, dict) or (
        not isinstance(render.get("dpi"), int) or render["dpi"] <= 0
        or (dimensions.get("w"), dimensions.get("h")) != (render.get("w"), render.get("h"))
        or not isinstance(dimensions.get("line_bands"), list)
        or not isinstance(dimensions.get("content_width"), int)
        or render.get("sha256") != sha256_file(page_dir / "page.png")
    ):
        raise ValueError(f"prepared page render or layout mismatch: {page_dir}")
    for name in ("page.png", "page.grid.png"):
        with Image.open(page_dir / name) as image:
            if image.format != "PNG" or image.size != (render["w"], render["h"]):
                raise ValueError(f"prepared image dimensions mismatch: {page_dir / name}")
            image.verify()


def prepare_range(repo: str | Path, book: str, first: int, last: int, work: str | Path) -> dict:
    repo = validate_workspace(repo)
    validate_book(repo, book)
    if first < 1 or last < first or last - first + 1 > 4:
        raise ValueError("range must contain 1 to 4 positive page numbers")
    work = Path(work).expanduser().resolve()
    if not work.is_relative_to(repo):
        raise ValueError(f"work must be inside the validated repository: {repo}")
    from layout import sha256_file
    from p2c import _find_pdf
    pdf = _find_pdf(argparse.Namespace(book=book, books=repo / SOURCES))
    source = {"pdf": pdf.name, "pdf_sha256": sha256_file(pdf)}
    result = {"ok": True, "book": book, "pages": []}
    for page in range(first, last + 1):
        page_dir = work / book / "pages" / f"{page:04d}"
        validate_output_owner(repo, page_dir)
        entry = {"page": page, "work": str(page_dir)}
        if all((page_dir / name).is_file() and (page_dir / name).stat().st_size
               for name in PREPARED_FILES):
            validate_prepared_page(page_dir, book, page, source)
            entry["status"] = "reused"
            result["pages"].append(entry)
            print(f"[prepare-range] {book} p{page:04d}: reused", file=sys.stderr)
            continue
        page_dir.mkdir(parents=True, exist_ok=True)
        attempt = 1
        while any((page_dir / f"prepare.{attempt:04d}.{stream}").exists()
                  for stream in ("stdout", "stderr")):
            attempt += 1
        stdout = page_dir / f"prepare.{attempt:04d}.stdout"
        stderr = page_dir / f"prepare.{attempt:04d}.stderr"
        command = [
            sys.executable, str(repo / TOOL), "prepare",
            "--book", book, "--page", str(page),
            "--root", str(repo / ARTIFACTS), "--books", str(repo / SOURCES),
            "--work", str(work),
        ]
        entry.update(command=command, stdout=str(stdout), stderr=str(stderr))
        with stdout.open("xb") as output, stderr.open("xb") as errors:
            try:
                completed = subprocess.run(
                    command, cwd=repo, stdout=output, stderr=errors, check=False,
                )
                entry["returncode"] = completed.returncode
            except OSError as error:
                entry.update(returncode=None, error=str(error))
                errors.write((str(error) + "\n").encode("utf-8"))
        entry["status"] = "prepared" if entry["returncode"] == 0 else "failed"
        if entry["status"] == "prepared":
            try:
                validate_prepared_page(page_dir, book, page, source)
            except (OSError, ValueError) as error:
                entry.update(status="failed", error=str(error))
        result["pages"].append(entry)
        print(f"[prepare-range] {book} p{page:04d}: {entry['status']} ({stderr})",
              file=sys.stderr)
        if entry["status"] == "failed":
            result["ok"] = False
            break
    return result


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    prepare = commands.add_parser("prepare-range")
    prepare.add_argument("--repo", required=True)
    prepare.add_argument("--book", required=True)
    prepare.add_argument("--first", type=int, required=True)
    prepare.add_argument("--last", type=int, required=True)
    prepare.add_argument("--work", required=True)
    read = commands.add_parser("read-json")
    read.add_argument("--input", type=Path, required=True)
    receipt = commands.add_parser("read-receipt")
    receipt.add_argument("--input", type=Path, required=True)
    receipt.add_argument("--expected", type=Path)
    args = parser.parse_args(argv)
    try:
        if args.command == "read-json":
            result = {"docs": read_json_documents(args.input.read_text(encoding="utf-8"))}
        elif args.command == "read-receipt":
            result = read_receipt(args.input, args.expected)
        else:
            result = prepare_range(args.repo, args.book, args.first, args.last, args.work)
    except (OSError, ValueError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        print(json.dumps({"ok": False, "error": str(error)}))
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result.get("ok", True) else 1


if __name__ == "__main__":
    raise SystemExit(main())
