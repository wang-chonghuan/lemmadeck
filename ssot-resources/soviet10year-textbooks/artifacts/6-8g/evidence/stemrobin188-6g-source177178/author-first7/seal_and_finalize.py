from pathlib import Path
import hashlib
import json
import os
import shutil
import stat
import subprocess
import sys

CWD = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
ROOT = CWD / ".intentfold/tickets/STEMROBIN-188/tmp/source6g177178-author7"
TOOLS = CWD / ".claude/skills/ld-s10y-lesson/tools"
PYTHON = CWD / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
assert Path.cwd() == CWD
sys.path.insert(0, str(TOOLS))
import blocks


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")


def seal():
    first_json = ROOT / "FIRST.json"
    if first_json.exists():
        raise RuntimeError("FIRST already exists; no resealing")
    observations = json.loads((ROOT / "source-observations.json").read_text())
    originals = []
    for observed in observations["pages"]:
        page = observed["physical"]
        directory = ROOT / f"original/6-8g/pages/{page:04d}"
        md = directory / "page.md"
        meta, parsed = blocks.parse(md.read_text(encoding="utf-8"))
        got = blocks.printed_lines(parsed)
        assert got == observed["visual_printed_text_lines"], (page, got)
        write_json(directory / "page.json", {"meta": meta, "blocks": parsed})
        write_json(directory / "audit.json", {
            "schema": "ld-s10y-source-author-audit@1", "page": page,
            "status": "AUTHOR_ONLY", "independent_approval": False,
            "lines_visually_observed": observed["visual_printed_text_lines"],
            "lines_typed": got, "source_observation": observed,
            "native_run": False, "content_verdict": "not an independent review"})
        candidate = ROOT / f"artifacts/6-8g/pages/{page:04d}/page.md"
        candidate.parent.mkdir(parents=True, exist_ok=True)
        if candidate.exists():
            raise RuntimeError(f"Refusing to overwrite {candidate}")
        shutil.copyfile(md, candidate)
        files = {}
        for name in ("page.md", "page.json", "audit.json"):
            path = directory / name
            files[name] = {"path": str(path), "sha256": digest(path)}
            path.chmod(0o444)
        originals.append({"physical": page, "files": files})
    copy_receipt = ROOT / "copy-receipt.json"
    first = {
        "schema": "ld-s10y-source-author-first@1", "status": "AUTHOR_ONLY",
        "ticket": "STEMROBIN-188", "book": "6-8g", "finish": "review/offline",
        "cwd": str(CWD), "owned_root": str(ROOT),
        "independent_approval": False, "sealed_before_native_finalize": True,
        "originals": originals, "observations": observations,
        "input_receipt": {"path": str(copy_receipt), "sha256": digest(copy_receipt)},
        "original_image_hashes_checked_once": json.loads(
            copy_receipt.read_text())["original_image_sha256_verified_once"],
        "FIRST_md": {"path": str(ROOT / "FIRST.md"),
                     "sha256": digest(ROOT / "FIRST.md")},
        "actual_image_load_count_at_seal": 4,
        "native_finalize_count_at_seal": 0,
        "content_revision_count_at_seal": 0,
        "technical_recovery_count_at_seal": 0
    }
    write_json(first_json, first)
    (ROOT / "FIRST.md").chmod(0o444)
    first_json.chmod(0o444)
    for path in (ROOT / "FIRST.md", first_json):
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
    print(json.dumps({"FIRST_sealed_0444": True,
                      "FIRST_md_sha256": digest(ROOT / "FIRST.md"),
                      "FIRST_json_sha256": digest(first_json)}))


def finalize(page):
    assert page in (177, 178)
    for path in (ROOT / "FIRST.md", ROOT / "FIRST.json"):
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
    call_root = ROOT / f"native/p{page:04d}-attempt1"
    call_root.mkdir(parents=True, exist_ok=False)
    page_root = ROOT / f"artifacts/6-8g/pages/{page:04d}"
    source = page_root / "page.md"
    shutil.copyfile(source, call_root / "firstcandidate.page.md")
    (call_root / "firstcandidate.page.md").chmod(0o444)
    argv = [
        str(PYTHON), "-B", str(TOOLS / "p2c.py"), "finalize",
        "--book", "6-8g", "--page", str(page),
        "--root", str(ROOT / "artifacts"), "--work", str(ROOT / "work"),
        "--books", str(CWD / "ssot-resources/soviet10year-textbooks/sources")
    ]
    before = digest(source)
    result = subprocess.run(argv, cwd=str(CWD), capture_output=True)
    stdout_path = call_root / "stdout.txt"
    stderr_path = call_root / "stderr.txt"
    stdout_path.write_bytes(result.stdout)
    stderr_path.write_bytes(result.stderr)
    outputs = []
    for name in ("page.md", "page.json", "audit.json"):
        path = page_root / name
        if path.exists():
            target = call_root / name
            shutil.copyfile(path, target)
            target.chmod(0o444)
            outputs.append({"path": str(path), "snapshot": str(target),
                            "sha256": digest(path)})
    crops = []
    for path in sorted((ROOT / f"work/6-8g/pages/{page:04d}/figures").glob("*.png")):
        crops.append({"path": str(path), "sha256": digest(path)})
    receipt = {
        "schema": "ld-s10y-native-execution@1", "cwd": str(CWD),
        "argv": argv, "exit_code": result.returncode,
        "streams": {
            "stdout": {"path": str(stdout_path), "sha256": digest(stdout_path)},
            "stderr": {"path": str(stderr_path), "sha256": digest(stderr_path)}
        },
        "book": "6-8g", "physical": page, "attempt": 1,
        "FIRST": {
            "md_sha256": digest(ROOT / "FIRST.md"),
            "json_sha256": digest(ROOT / "FIRST.json"),
            "md_mode": "0444", "json_mode": "0444"
        },
        "candidate_before": {
            "path": str(call_root / "firstcandidate.page.md"), "sha256": before
        },
        "outputs": outputs, "native_crops": crops,
        "first_failure": result.returncode != 0,
        "native_failure_is_content_verdict": False,
        "content_revisions": 0, "technical_recoveries": 0
    }
    write_json(call_root / "receipt.json", receipt)
    print(result.stdout.decode("utf-8", errors="replace"), end="")
    if result.stderr:
        print(result.stderr.decode("utf-8", errors="replace"), file=sys.stderr, end="")
    print(json.dumps({"native_exit": result.returncode,
                      "receipt": str(call_root / "receipt.json"),
                      "outputs_retained": len(outputs), "native_crops": crops}))
    return result.returncode


if sys.argv[1] == "seal":
    seal()
else:
    sys.exit(finalize(int(sys.argv[1])))
