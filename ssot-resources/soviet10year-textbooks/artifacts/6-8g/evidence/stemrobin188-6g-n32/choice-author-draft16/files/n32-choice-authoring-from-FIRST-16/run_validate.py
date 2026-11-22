import datetime
import hashlib
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
WORK = Path(__file__).resolve().parent
PYTHON = ROOT / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
SEED = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n32-formal-choice-seed-16/seed.json"
DRAFT = WORK / "draft.json"
FIRST = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n32-choice-source-solving-first-author-15/source-solving-FIRST.md"
RECEIPT = WORK / "validate-first.execution.json"
STDOUT = WORK / "validate-first.stdout.txt"
STDERR = WORK / "validate-first.stderr.txt"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def file_binding(file):
    data = file.read_bytes()
    return {"path": str(file), "sha256": sha(data), "bytes": len(data)}


def canonical_digest(file):
    value = json.loads(file.read_bytes())
    data = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return sha(data)


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def main():
    if any(file.exists() for file in (RECEIPT, STDOUT, STDERR)):
        raise RuntimeError("First validation already recorded; do not overwrite or rerun")
    if sha(SEED.read_bytes()) != "f4f84696ce28d72f64ced2fdcef4c4266ae2f9d0bbf68ab339c077335e4dd778":
        raise RuntimeError("Formal seed byte hash drift")
    if canonical_digest(SEED) != "1155d99b6978dde29816e56a5ba4deb5ec0c5a338330c6820d7fb920d109bbcd":
        raise RuntimeError("Formal seed canonical digest drift")
    if sha(FIRST.read_bytes()) != "b54165fbfce5ca00f3f1ff42edaa1edafee6365e4899fa94a8cf9b4cef522271":
        raise RuntimeError("Sealed FIRST byte hash drift")
    argv = [
        str(PYTHON),
        str(ROOT / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
        "--repo", str(ROOT),
        "--seed", str(SEED),
        "--draft", str(DRAFT),
    ]
    inputs = {
        "seed": file_binding(SEED),
        "draft": file_binding(DRAFT),
        "sourceFIRST": file_binding(FIRST),
        "seedCanonicalSha256": canonical_digest(SEED),
        "draftCanonicalSha256": canonical_digest(DRAFT),
    }
    started = now()
    completed = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
    finished = now()
    STDOUT.write_bytes(completed.stdout)
    STDERR.write_bytes(completed.stderr)
    receipt = {
        "operation": "Structural choice validation only; no semantic approval",
        "attempt": 1,
        "cwd": str(ROOT),
        "argv": argv,
        "startedAt": started,
        "finishedAt": finished,
        "exitCode": completed.returncode,
        "inputFiles": inputs,
        "streams": {
            "stdout": file_binding(STDOUT),
            "stderr": file_binding(STDERR),
        },
        "launcher": file_binding(Path(__file__).resolve()),
        "imageAttemptsAdded": 0,
        "contentRevision": 0,
        "authoringFormatRevision": 1,
        "structuralRepairRevision": 0,
        "independentReviewPerformed": False,
    }
    RECEIPT.write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n")
    print(json.dumps(receipt, ensure_ascii=True, indent=2))
    if completed.stdout:
        print(completed.stdout.decode("utf-8", errors="replace"), end="")
    if completed.stderr:
        print(completed.stderr.decode("utf-8", errors="replace"), end="", file=sys.stderr)
    return completed.returncode


if __name__ == "__main__":
    sys.exit(main())
