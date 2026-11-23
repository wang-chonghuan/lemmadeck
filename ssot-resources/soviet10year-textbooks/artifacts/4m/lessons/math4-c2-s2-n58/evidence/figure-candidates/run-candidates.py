"""Run official candidate checks without promotion; retain first command results."""

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
WORK = ROOT / ".tmp/stemrobin-187/n58/figures"
RESULTS = WORK / "candidate-command-results.json"
VALIDATOR = ".agents/skills/ld-s10y-image/scripts/validate_spec.py"
RENDERER = ".agents/skills/ld-s10y-image/scripts/render_spec.mjs"

assert Path.cwd() == ROOT
assert not RESULTS.exists(), "Preserve first failures and candidates."
results = []
for figure in ("fig-222", "tbl-p0216-01"):
    stem = f".tmp/stemrobin-187/n58/figures/{figure}"
    commands = [
        ["python3", VALIDATOR, f"{stem}.spec.json", "--stage", "draft", "--json"],
        ["node", RENDERER, "--spec", f"{stem}.spec.json", "--svg", f"{stem}.svg",
         "--report", f"{stem}.render.json", "--png", f"{stem}.normal640.png"],
    ]
    for argv in commands:
        started = datetime.now(timezone.utc).isoformat()
        completed = subprocess.run(argv, cwd=ROOT, capture_output=True, text=True, check=False)
        result = {
            "figure": figure,
            "cwd": str(ROOT),
            "argv": argv,
            "startedAt": started,
            "finishedAt": datetime.now(timezone.utc).isoformat(),
            "exitCode": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
        }
        results.append(result)
        RESULTS.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result, indent=2), flush=True)
        if completed.returncode:
            break
raise SystemExit(0 if all(result["exitCode"] == 0 for result in results) else 1)
