"""Bounded local receipts and exact pixel evidence; no approval decisions."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import traceback


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
BASE = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source191192-author"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
PREDECESSOR_SHA = "1632d9d42d005861c5f8af156c5fcd0375ac9446133cbd703ae246eb411e8d54"


def owned(path: Path) -> Path:
    assert Path.cwd() == REPO, "Wrong invocation cwd"
    assert path.is_relative_to(BASE) and path.resolve() == path, str(path)
    return path


def file_record(path: Path) -> dict:
    data = path.read_bytes()
    return {
        "path": str(path),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
    }


def save(path: Path, data: dict) -> None:
    owned(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def finalize(page: int) -> int:
    assert page in (191, 192)
    pdir = BASE / f"artifacts/9-10g/pages/{page:04d}"
    audit = pdir / "audit.json"
    if audit.exists():
        previous = json.loads(audit.read_text(encoding="utf-8"))
        assert previous["errors"], "Refusing to repeat a passed native finalize"
        raise RuntimeError("Failed native stage needs explicit affected-only recovery, not automatic retry")
    receipts = owned(BASE / "receipts")
    assert receipts.is_dir(), "Receipt directory must exist before native execution"
    prefix = receipts / f"finalize-{page:04d}.0001"
    receipt = Path(str(prefix) + ".json")
    assert not receipt.exists(), "Refusing duplicate native attempt"
    candidate = pdir / "page.md"
    before = file_record(candidate)
    first = file_record(BASE / f"FIRST-{page:04d}.json")
    input_record = file_record(BASE / f"work/9-10g/pages/{page:04d}/page.png")
    entry = [
        str(PYTHON), str(BASE / "author_tools.py"), "native", str(page),
    ]
    stdout_path = owned(Path(str(prefix) + ".stdout"))
    stderr_path = owned(Path(str(prefix) + ".stderr"))
    # Open receipt streams before the native child starts.
    with stdout_path.open("xb") as stdout, stderr_path.open("xb") as stderr:
        result = subprocess.run(
            entry, cwd=REPO, stdout=stdout, stderr=stderr,
            env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
            check=False,
        )
    exit_path = owned(Path(str(prefix) + ".exit"))
    exit_path.write_text(str(result.returncode) + "\n", encoding="ascii")
    payload = {
        "schema": "same188-6/native-finalize-receipt@1",
        "page": page,
        "cwd": str(REPO),
        "entry": entry,
        "native_function": "p2c.cmd_finalize",
        "native_cli_main_called": False,
        "reason": "CLI main invokes git rev-parse; direct human forbids all Git commands.",
        "root": str(BASE / "artifacts"),
        "work": str(BASE / "work"),
        "book": "9-10g",
        "receipts_directory_existed_before_native": True,
        "stdout_file_opened_before_native": True,
        "stderr_file_opened_before_native": True,
        "candidate_before": before,
        "FIRST": first,
        "page_png": input_record,
        "exit_code": result.returncode,
        "stdout": file_record(stdout_path),
        "stderr": file_record(stderr_path),
        "exit": file_record(exit_path),
        "emitted": [
            file_record(path) for path in (candidate, pdir / "page.json", audit)
            if path.exists()
        ],
        "approval": False,
    }
    save(receipt, payload)
    print(stdout_path.read_text(encoding="utf-8"), end="")
    print(stderr_path.read_text(encoding="utf-8"), end="", file=sys.stderr)
    print(json.dumps({"receipt": file_record(receipt), "exit_code": result.returncode}))
    return result.returncode


def native(page: int) -> int:
    assert Path.cwd() == REPO and page in (191, 192)
    sys.path.insert(0, str(TOOLS))
    import p2c
    from production import validate_book, validate_output_owner

    root = owned(BASE / "artifacts")
    work = owned(BASE / "work")
    for path in (root / "9-10g", work / "9-10g",
                 root / f"9-10g/pages/{page:04d}", work / f"9-10g/pages/{page:04d}"):
        validate_output_owner(REPO, path)
    validate_book(REPO, "9-10g")
    args = argparse.Namespace(
        book="9-10g", page=page, root=str(root), work=str(work),
        books=str(REPO / "ssot-resources/soviet10year-textbooks/sources"),
        series=None, pdf=None,
    )
    return p2c.cmd_finalize(args)


def detail(page: int, name: str, box: list[int]) -> int:
    from PIL import Image
    import numpy as np

    assert page in (191, 192) and Path(name).name == name
    source = BASE / f"input/9-10g/pages/{page:04d}/page.png"
    x, y, w, h = box
    output = owned(BASE / f"evidence/crops/{page:04d}-{name}.png")
    assert not output.exists(), "Do not overwrite source detail evidence"
    with Image.open(source) as image:
        assert x >= 0 and y >= 0 and x + w <= image.width and y + h <= image.height
        crop = image.crop((x, y, x + w, y + h))
        crop.save(output)
        expected = np.asarray(image)[y:y+h, x:x+w]
    with Image.open(output) as image:
        actual = np.asarray(image)
        assert np.array_equal(actual, expected)
    save(output.with_suffix(".json"), {
        "schema": "same188-6/exact-detail-crop@1",
        "source": file_record(source), "box_xywh": box,
        "output": file_record(output), "resized": False,
        "pixel_sha256": hashlib.sha256(actual.tobytes()).hexdigest(),
        "mismatched_pixels": 0, "semantic_approval": False,
    })
    print(json.dumps(file_record(output)))
    return 0


if __name__ == "__main__":
    assert Path.cwd() == REPO, "All commands must use the exact authorized cwd"
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("finalize", "native", "detail"))
    parser.add_argument("page", type=int, choices=(191, 192))
    parser.add_argument("extra", nargs="*")
    args = parser.parse_args()
    try:
        if args.action == "detail":
            name, *coords = args.extra
            raise SystemExit(detail(args.page, name, [int(value) for value in coords]))
        raise SystemExit(finalize(args.page) if args.action == "finalize" else native(args.page))
    except Exception:
        traceback.print_exc()
        raise SystemExit(1)
