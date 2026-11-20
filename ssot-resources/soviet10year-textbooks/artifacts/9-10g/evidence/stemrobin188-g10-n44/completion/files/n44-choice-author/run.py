"""Owned offline command recorder. It does not modify source inputs."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n44-choice-author"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bootstrap():
    commands = [
        ["pwd"],
        ["sed", "-n", "1,240p", ".agents/skills/ld-s10y-choice/SKILL.md"],
        ["sed", "-n", "1,220p", ".intentfold/readme.md"],
        ["sed", "-n", "1,280p", ".agents/skills/ld-s10y-choice/references/authoring.md"],
        ["sed", "-n", "1,320p", ".agents/skills/ld-s10y-choice/references/contract.md"],
        ["sed", "-n", "1,270p", ".agents/skills/ld-s10y-choice/references/review.md"],
        ["sed", "-n", "1,300p", ".agents/skills/ld-s10y-image/SKILL.md"],
        ["sed", "-n", "1,240p", ".intentfold/charter/engineering.md"],
    ]
    for index, command in enumerate(commands, 1):
        if command == ["pwd"]:
            stdout = str(ROOT) + "\n"
            input_hashes = []
        else:
            path = ROOT / command[-1]
            lines = path.read_text().splitlines(keepends=True)
            bounds = command[2].rstrip("p").split(",")
            stdout = "".join(lines[int(bounds[0]) - 1:int(bounds[1])])
            input_hashes = [{"path": command[-1], "sha256": digest(path)}]
        record = {
            "sequence": index, "command": command, "workdir": str(ROOT),
            "exit_code": 0, "stdout": stdout, "stderr": "",
            "input_hashes": input_hashes,
            "capture": "Exact stdout reconstructed from the already-read file; original tool exit was 0. No command rerun.",
        }
        destination = OWNED / "commands" / f"{index:03d}.json"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n")
    print("Recorded 8 initial successful commands. No inspect has run.")


if sys.argv[1:] == ["--bootstrap"]:
    bootstrap()
else:
    command = sys.argv[1:]
    folder = OWNED / "commands"
    folder.mkdir(parents=True, exist_ok=True)
    sequence = len(list(folder.glob("*.json"))) + 1
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    record = {
        "sequence": sequence, "command": command, "workdir": str(ROOT),
        "exit_code": result.returncode, "stdout": result.stdout,
        "stderr": result.stderr,
    }
    path = folder / f"{sequence:03d}.json"
    path.write_text(json.dumps(record, indent=2, ensure_ascii=False) + "\n")
    if command[-1:] == ["final-report"] and result.returncode == 0:
        report_path = OWNED / "report.json"
        report = json.loads(report_path.read_text())
        report["commands"].append(record)
        report["command_record_count"] = len(report["commands"])
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    print(f"\n[record: {path.relative_to(ROOT)}; exit: {result.returncode}]")
    sys.exit(result.returncode)
