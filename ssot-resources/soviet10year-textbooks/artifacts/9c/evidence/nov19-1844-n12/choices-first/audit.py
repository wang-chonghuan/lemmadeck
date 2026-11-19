"""Record one-shot offline CLI stages and freeze independently authored solutions."""

import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
OUT = ROOT / ".tmp/stemrobin-184-resume/n12-choices"
SCRIPT = ROOT / ".agents/skills/ld-s10y-choice/scripts"


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def canonical_digest(value):
    data = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def write_new(name, value):
    with (OUT / name).open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def run_once(stage, command):
    record_path = OUT / f"{stage}.json"
    if record_path.exists():
        raise SystemExit(f"Refusing to repeat recorded stage: {stage}")
    started = now()
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    with (OUT / f"{stage}.stdout.txt").open("xb") as stdout:
        with (OUT / f"{stage}.stderr.txt").open("xb") as stderr:
            result = subprocess.run(
                command, cwd=ROOT, env=env, stdout=stdout, stderr=stderr, check=False
            )
    record = {
        "stage": stage,
        "started_at_utc": started,
        "finished_at_utc": now(),
        "command": command,
        "cwd": str(ROOT),
        "exit_code": result.returncode,
        "stdout_path": str(OUT / f"{stage}.stdout.txt"),
        "stderr_path": str(OUT / f"{stage}.stderr.txt"),
    }
    write_new(record_path.name, record)
    print(json.dumps(record, ensure_ascii=False, indent=2))
    for suffix in ("stdout", "stderr"):
        contents = (OUT / f"{stage}.{suffix}.txt").read_text(encoding="utf-8")
        print(f"{suffix}:\n{contents}")
    return result.returncode


def verify_freeze():
    frozen = json.loads((OUT / "source-solution.freeze.json").read_text("utf-8"))
    for item in frozen["files"]:
        actual = hashlib.sha256(Path(item["path"]).read_bytes()).hexdigest()
        if actual != item["sha256"]:
            raise SystemExit(f"Frozen solution changed: {item['path']}")


def main():
    stage = sys.argv[1]
    if stage == "prepare":
        return run_once(
            "prepare",
            [
                sys.executable,
                str(SCRIPT / "prepare.py"),
                "prepare",
                "--repo", ".",
                "--book", "9c",
                "--lesson", "ana9-c3-s1-n12",
                "--exercise", "113",
                "--exercise", "114",
                "--concept-block", "6",
                "--concept-block", "7",
                "--concept-block", "10",
                "--concept-block", "12",
                "--out", str(OUT / "seed.json"),
            ],
        )
    if stage == "freeze":
        if (OUT / "draft.json").exists():
            raise SystemExit("Source solution must freeze before draft creation")
        seed = json.loads((OUT / "seed.json").read_text("utf-8"))
        files = []
        for name in ("source-solution.md", "source-solution.json"):
            path = OUT / name
            files.append({
                "path": str(path),
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            })
        write_new("source-solution.freeze.json", {
            "stage": "source_solution_frozen_before_options",
            "frozen_at_utc": now(),
            "seed_sha256": canonical_digest(seed),
            "files": files,
            "draft_exists_at_freeze": False,
            "semantic_review": "pending_independent_review",
        })
        for item in files:
            Path(item["path"]).chmod(0o444)
        print((OUT / "source-solution.freeze.json").read_text("utf-8"))
        return 0
    if stage == "validate":
        verify_freeze()
        seed = json.loads((OUT / "seed.json").read_text("utf-8"))
        draft = json.loads((OUT / "draft.json").read_text("utf-8"))
        write_new("draft.snapshot.json", {
            "stage": "authored_draft_before_structural_validation",
            "recorded_at_utc": now(),
            "seed_sha256": canonical_digest(seed),
            "draft_sha256": canonical_digest(draft),
            "question_count": len(draft["questions"]),
            "option_count": sum(len(q["view"]["options"]) for q in draft["questions"]),
            "semantic_review": "pending_independent_review",
        })
        return run_once(
            "validator",
            [
                sys.executable,
                str(SCRIPT / "validate.py"),
                "--repo", ".",
                "--seed", str(OUT / "seed.json"),
                "--draft", str(OUT / "draft.json"),
            ],
        )
    raise SystemExit(f"Unknown stage: {stage}")


if __name__ == "__main__":
    raise SystemExit(main())
