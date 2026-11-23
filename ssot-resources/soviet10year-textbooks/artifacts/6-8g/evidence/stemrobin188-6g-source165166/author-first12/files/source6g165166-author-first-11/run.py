import hashlib
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]


def stamp():
    return datetime.now(timezone.utc).isoformat()


def save(path, data):
    with path.open("x", encoding="utf-8") as output:
        json.dump(data, output, ensure_ascii=False, indent=2)
        output.write("\n")


def main():
    label, *argv = sys.argv[1:]
    if argv and argv[0] == "--":
        argv = argv[1:]
    if not argv or "/" in label or not REPO.joinpath("AGENTS.md").is_file():
        raise ValueError("invalid receipt label, argv, or actual repository")
    target = ROOT / "receipts" / label
    target.mkdir(parents=True, exist_ok=False)
    started = {"argv": argv, "cwd": str(REPO), "startedAt": stamp()}
    save(target / "started.json", started)
    with (target / "stdout").open("xb") as out, (target / "stderr").open("xb") as err:
        try:
            result = subprocess.run(argv, cwd=REPO, stdout=out, stderr=err, check=False)
            code = result.returncode
            error = None
        except OSError as exc:
            code = None
            error = str(exc)
            err.write((error + "\n").encode())
    receipt = {**started, "endedAt": stamp(), "exitCode": code, "error": error}
    receipt["streams"] = {
        name: {
            "path": str(target / name),
            "sha256": hashlib.sha256((target / name).read_bytes()).hexdigest(),
        }
        for name in ("stdout", "stderr")
    }
    save(target / "execution.json", receipt)
    print(json.dumps(receipt, ensure_ascii=False, indent=2))
    for name in ("stdout", "stderr"):
        text = (target / name).read_text(encoding="utf-8", errors="replace")
        if text:
            print(name + ":\n" + text, end="" if text.endswith("\n") else "\n")
    return code if isinstance(code, int) and code >= 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
