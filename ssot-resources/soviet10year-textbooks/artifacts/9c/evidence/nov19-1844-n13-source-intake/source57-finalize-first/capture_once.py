import datetime
import difflib
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
ROOT = REPO / ".tmp/stemrobin-184-resume/n13-source57-finalize-first"
PAGE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0057"
WORK = REPO / ".tmp/ld-s10y-lesson/9c/pages/0057"
FIRST = REPO / ".tmp/stemrobin-184-resume/n13-source57-independent/first-source.md"
ROI = REPO / ".tmp/stemrobin-184-resume/n13-source57-underbrace-roi/candidate-local-notation.md"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def split_document(text):
    if not text.startswith("---\n"):
        raise ValueError("Missing frontmatter start")
    end = text.index("\n---\n", 4)
    return text[4:end], text[end + len("\n---\n"):]


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def main():
    if Path.cwd() != REPO:
        raise RuntimeError("Wrong cwd")
    marker = ROOT / "INVOCATION.json"
    if marker.exists():
        raise RuntimeError("First invocation already reserved; no retry permitted")
    if sorted(p.name for p in PAGE.iterdir()) != ["page.md"]:
        raise RuntimeError("Unexpected pre-existing page-57 native files; stop")

    template = WORK / "page.template.md"
    candidate = PAGE / "page.md"
    first_raw = FIRST.read_text(encoding="utf-8")
    candidate_raw = candidate.read_text(encoding="utf-8")
    template_meta = json.loads(split_document(template.read_text(encoding="utf-8"))[0])
    candidate_header, candidate_body = split_document(candidate_raw)
    candidate_meta = json.loads(candidate_header)
    first_body = split_document(first_raw)[1]
    old = r"0.2399\cdots9"
    new = r"0.\underbrace{2399\cdots9}_{k\text{ 位}}"
    if first_body.count(old) != 2:
        raise RuntimeError("Frozen first body does not contain exactly two target decimals")
    if candidate_body != first_body.replace(old, new):
        raise RuntimeError("Candidate body differs beyond the two authorized brace insertions")
    if new not in ROI.read_text(encoding="utf-8"):
        raise RuntimeError("Resolved local candidate does not support the substitution")
    allowed_meta = dict(template_meta)
    allowed_meta["printed_page"] = 50
    allowed_meta["notes"] = candidate_meta["notes"]
    if allowed_meta != candidate_meta or not candidate_meta["notes"]:
        raise RuntimeError("Unexpected frontmatter changes")
    source = WORK / "page.png"
    if sha(source) != template_meta["render"]["sha256"]:
        raise RuntimeError("Prepared source hash changed")

    snapshot = ROOT / "candidate.page.md"
    shutil.copy2(candidate, snapshot)
    snapshot.chmod(0o444)
    preflight = {
        "canonicalPageWasAbsentAtInitialExistenceCheck": True,
        "templateFrontmatterPreservedExcept": ["printed_page: null -> 50", "notes: eight provenance strings"],
        "frozenBodyMatchesExceptExactlyTwoUnderbraceInsertions": True,
        "numbersExponentWrapsHeadersContOpenUnchangedBeforeFinalize": True,
        "manualCountPaddingOrExclusionsAdded": False,
        "inputHashes": {
            str(template): sha(template),
            str(FIRST): sha(FIRST),
            str(ROI): sha(ROI),
            str(source): sha(source),
            str(candidate): sha(candidate),
            str(ROOT / "capture_once.py"): sha(ROOT / "capture_once.py"),
        },
        "candidateSnapshot": str(snapshot),
        "priorFirstFreeze": "73e3e9dfac9a2ca5e53a669d1a0307ea03b67ba5118fa705bd29c3e6c84711b6",
        "priorRoiFreeze": "fe8d0244835ec0daa91575228df8ef9108b7df52ea888b6f2f8eee352afcd37a",
        "cumulativeContextImages": {"used": 2, "limit": 4, "newThisInvocation": 0},
    }
    dump(ROOT / "preflight.json", preflight)
    command = [
        ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "finalize", "--book", "9c", "--page", "57",
    ]
    started = utc()
    with marker.open("x", encoding="utf-8") as handle:
        json.dump({"command": command, "cwd": str(REPO), "startedUtc": started,
                   "officialInvocationLimit": 1, "retryPermitted": False}, handle, indent=2)
        handle.write("\n")

    # Capture raw streams even on a mechanical failure; preserve every native output.
    result = subprocess.run(command, cwd=REPO, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    ended = utc()
    stdout = ROOT / "finalize.stdout.txt"
    stderr = ROOT / "finalize.stderr.txt"
    stdout.write_bytes(result.stdout)
    stderr.write_bytes(result.stderr)
    (ROOT / "finalize.exit.txt").write_text(str(result.returncode) + "\n", encoding="ascii")
    native = []
    for path in sorted(PAGE.rglob("*")):
        if not path.is_file():
            continue
        target = ROOT / "nativecapture" / path.relative_to(PAGE)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)
        target.chmod(0o444)
        native.append({"currentPath": str(path), "snapshotPath": str(target),
                       "sha256": sha(path), "bytes": path.stat().st_size})
    current = candidate.read_text(encoding="utf-8")
    current_header, current_body = split_document(current)
    current_meta = json.loads(current_header)
    diff = "".join(difflib.unified_diff(
        candidate_body.splitlines(keepends=True), current_body.splitlines(keepends=True),
        fromfile="candidate.page.md body", tofile="nativecapture/page.md body",
    ))
    (ROOT / "native-body.diff").write_text(diff, encoding="utf-8")
    changes = {
        key: {"before": candidate_meta.get(key), "after": current_meta.get(key)}
        for key in sorted(set(candidate_meta) | set(current_meta))
        if candidate_meta.get(key) != current_meta.get(key)
    }
    audit_path = PAGE / "audit.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8")) if audit_path.exists() else None
    receipt = {
        "kind": "first-official-page57-finalize-receipt",
        "ticket": "STEMROBIN-184",
        "command": command,
        "cwd": str(REPO),
        "startedUtc": started,
        "endedUtc": ended,
        "officialInvocations": 1,
        "exitCode": result.returncode,
        "stdout": {"path": str(stdout), "sha256": sha(stdout), "bytes": len(result.stdout)},
        "stderr": {"path": str(stderr), "sha256": sha(stderr), "bytes": len(result.stderr)},
        "candidateSha256": sha(snapshot),
        "currentPageMdSha256": sha(candidate),
        "nativeOutputs": native,
        "officialMetadataChanges": changes,
        "bodyDiffPath": str(ROOT / "native-body.diff"),
        "bodyDiffSha256": sha(ROOT / "native-body.diff"),
        "mechanicalAudit": audit,
        "cumulativeImages": {"used": 2, "limit": 4, "newThisInvocation": 0},
        "sourceApproval": "NOT_ESTABLISHED",
        "mathematicalProofOrIndependentMathReview": "NOT_PERFORMED",
        "page56ReportedFailure": "21/20; NOT_CLEARED",
        "assembledN13Approval": "NOT_ESTABLISHED",
        "page58": "UNKNOWN; unit 14 prose remains open",
        "retry": "NONE; STOP",
        "dependentStagesRun": [],
    }
    dump(ROOT / "receipt.json", receipt)
    for path in ROOT.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    print(json.dumps({"officialExitCode": result.returncode,
                      "candidateSha256": receipt["candidateSha256"],
                      "currentPageMdSha256": receipt["currentPageMdSha256"],
                      "nativeOutputs": native, "audit": audit,
                      "receipt": str(ROOT / "receipt.json")}, ensure_ascii=False, indent=2))
    sys.stdout.flush()
    sys.stderr.flush()
    sys.stdout.buffer.write(result.stdout)
    sys.stderr.buffer.write(result.stderr)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
