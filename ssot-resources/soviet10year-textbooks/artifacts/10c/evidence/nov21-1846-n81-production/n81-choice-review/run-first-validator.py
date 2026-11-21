import hashlib
import json
import subprocess
import sys
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
if Path.cwd() != ROOT:
    raise SystemExit("Wrong cwd")

OWN = ".tmp/stemrobin-184-six/n81-choice-review/"
STDOUT = OWN + "validate-first.stdout.txt"
STDERR = OWN + "validate-first.stderr.txt"
RECEIPT = OWN + "validate-first.receipt.json"
if any((ROOT / path).exists() for path in [STDOUT, STDERR, RECEIPT]):
    raise SystemExit("First-validation evidence exists; refusing replay or overwrite")
argv = [
    "python3",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", ".tmp/stemrobin-184-six/n81-choice-source/seed.json",
    "--draft", ".tmp/stemrobin-184-six/n81-choice-author/draft.json",
    "--review", OWN + "review.json",
]
input_paths = [argv[5], argv[7], argv[9]]
input_hashes = {
    path: hashlib.sha256((ROOT / path).read_bytes()).hexdigest()
    for path in input_paths
}
result = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
(ROOT / STDOUT).write_bytes(result.stdout)
(ROOT / STDERR).write_bytes(result.stderr)
receipt = {
    "schema": "n81-choice-first-validation-receipt-v1",
    "stage": 3,
    "cwd": str(ROOT),
    "argv": argv,
    "exit_code": result.returncode,
    "input_byte_sha256": input_hashes,
    "streams": {
        "stdout": {
            "path": STDOUT,
            "bytes": len(result.stdout),
            "sha256": hashlib.sha256(result.stdout).hexdigest(),
        },
        "stderr": {
            "path": STDERR,
            "bytes": len(result.stderr),
            "sha256": hashlib.sha256(result.stderr).hexdigest(),
        },
    },
    "wrapper_argv": ["python3", OWN + "run-first-validator.py"],
    "first_invocation": True,
    "first_fault": result.returncode != 0,
    "source_or_option_proof_replay": False,
    "note": "The explicitly authorized official validator may rebind its allowed seed inputs. This is mechanical validation, not reviewer source/option proof replay or independent semantic proof.",
    "images_opened_or_decoded_by_reviewer": 0,
    "closure": "OPEN_FOR_PARENT_INTAKE",
}
(ROOT / RECEIPT).write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
print(json.dumps(receipt, ensure_ascii=True, indent=2))
raise SystemExit(result.returncode)
