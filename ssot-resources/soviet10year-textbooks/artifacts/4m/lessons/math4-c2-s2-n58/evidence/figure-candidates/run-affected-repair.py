"""Execute the one permitted affected label repair; retain the first files."""

import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
WORK = ROOT / ".tmp/stemrobin-187/n58/figures"
RESULTS = WORK / "repair1-command-results.json"
STEM = ".tmp/stemrobin-187/n58/figures/fig-222.repair1"

assert Path.cwd() == ROOT
assert not RESULTS.exists()
first = json.loads((WORK / "fig-222.spec.json").read_text())
repaired = json.loads((WORK / "fig-222.repair1.spec.json").read_text())
restored = json.loads(json.dumps(repaired))
restored["objects"][0]["labelPlacement"]["offset"] = [12, -12]
assert restored == first, "Only the A-label offset may change."
results = []
for argv in [
    ["python3", ".agents/skills/ld-s10y-image/scripts/validate_spec.py",
     f"{STEM}.spec.json", "--stage", "draft", "--json"],
    ["node", ".agents/skills/ld-s10y-image/scripts/render_spec.mjs", "--spec",
     f"{STEM}.spec.json", "--svg", f"{STEM}.svg", "--report",
     f"{STEM}.render.json", "--png", f"{STEM}.normal640.png"],
]:
    started = datetime.now(timezone.utc).isoformat()
    completed = subprocess.run(argv, cwd=ROOT, capture_output=True, text=True, check=False)
    result = {
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
