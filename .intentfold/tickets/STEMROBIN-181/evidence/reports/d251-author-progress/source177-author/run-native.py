import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys


OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
TOOL = ROOT / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
SOURCE = OUT / "source"
WORK = OUT / "work"
BINDINGS = json.loads((OUT / "input-bindings.json").read_text())
NATIVE = OUT / "native.json"
MD = SOURCE / "10p/pages/0177/page.md"
SNAPSHOT = OUT / "authored-page-before-finalize.md"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


if NATIVE.exists() or SNAPSHOT.exists():
    raise RuntimeError("Native execution already recorded; refuse a repeat")
for item in BINDINGS["preparedInputs"]:
    if sha256(Path(item["path"])) != item["sha256"]:
        raise RuntimeError("Prepared input changed")
    if sha256(OUT / item["destination"]) != item["sha256"]:
        raise RuntimeError("Isolated prepared copy changed")
shutil.copyfile(MD, SNAPSHOT)
temp = OUT / "native-tmp"
temp.mkdir(exist_ok=True)
env = os.environ.copy()
env["PYTHONDONTWRITEBYTECODE"] = "1"
env["TMPDIR"] = str(temp)
base = [
    sys.executable,
    "-B",
    str(TOOL),
]
options = [
    "--book", "10p",
    "--page", "177",
    "--root", str(SOURCE),
    "--work", str(WORK),
]
commands = []


def run(command):
    result = subprocess.run(
        command, cwd=ROOT, env=env, text=True, capture_output=True, check=False
    )
    receipt = {
        "argv": command,
        "cwd": str(ROOT),
        "exitCode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "attempt": 1,
        "nativeOnly": True,
    }
    commands.append(receipt)
    print(json.dumps(receipt, ensure_ascii=False, indent=2), flush=True)
    return result.returncode


finalize_exit = run(base + ["finalize"] + options)
vectorize_exit = None
if finalize_exit == 0:
    page = json.loads((SOURCE / "10p/pages/0177/page.json").read_text())
    figures = page["meta"]["figures"]
    if len(figures) != 1 or figures[0]["id"] != "fig-135":
        raise RuntimeError("Unexpected figure set; no batch vectorization allowed")
    vectorize_exit = run(base + ["vectorize"] + options)
receipt = {
    "schema": "bounded-source177-native-author-receipt@1",
    "role": "First author, not independent reviewer",
    "page": 177,
    "finalizeCalls": 1,
    "vectorizeCalls": int(vectorize_exit is not None),
    "finalizeExitCode": finalize_exit,
    "vectorizeExitCode": vectorize_exit,
    "sourceRoot": str(SOURCE),
    "workRoot": str(WORK),
    "authoredBeforeFinalizeSha256": sha256(SNAPSHOT),
    "pageMdAfterFinalizeSha256": sha256(MD),
    "commands": commands,
    "prepareCalls": 0,
    "assembleCalls": 0,
    "sourceOrRawIndependentPassClaim": False,
}
with NATIVE.open("x", encoding="utf-8") as output:
    output.write(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
for item in BINDINGS["preparedInputs"]:
    if sha256(Path(item["path"])) != item["sha256"]:
        raise RuntimeError("External prepared input changed")
print(json.dumps({"nativeReceipt": str(NATIVE), "sha256": sha256(NATIVE)}))
