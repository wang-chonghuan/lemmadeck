"""Run the single authorized structural check and retain its actual outcome."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path.cwd()
BASE = ROOT / ".tmp/stemrobin-184-six/c6-resume"
AUTHOR = BASE / "author"
report_path = AUTHOR / "handoff.json"
stdout_path = AUTHOR / "validation-first.stdout.txt"
stderr_path = AUTHOR / "validation-first.stderr.txt"
assert not any(p.exists() for p in (report_path, stdout_path, stderr_path))
argv = [
    "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", ".tmp/stemrobin-184-six/c6-resume/seed.json",
    "--draft", ".tmp/stemrobin-184-six/c6-resume/draft.json",
]
result = subprocess.run(argv, cwd=ROOT, text=True, capture_output=True)
stdout_path.write_text(result.stdout)
stderr_path.write_text(result.stderr)
draft = json.loads((BASE / "draft.json").read_text())
draft_digest = subprocess.run([
    "python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py",
    "digest", str(BASE / "draft.json"),
], check=True, text=True, capture_output=True).stdout.strip()
file_hashes = {}
for path in (
    BASE / "seed.json", BASE / "draft.json",
    AUTHOR / "source-solving.md", AUTHOR / "source-solving.json",
    AUTHOR / "source-freeze.json", stdout_path, stderr_path,
):
    file_hashes[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
freeze = json.loads((AUTHOR / "source-freeze.json").read_text())
for name, digest in freeze["file_sha256"].items():
    assert hashlib.sha256((AUTHOR / name).read_bytes()).hexdigest() == digest
report = {
    "scope": "STEMROBIN-184 / 10c / ana10-c6-ex / source335..391",
    "cwd": str(ROOT),
    "status": ("authored_structurally_valid_semantic_review_pending"
               if result.returncode == 0 else "authored_structural_failure_retained"),
    "seed_sha256_canonical_official": draft["seed_sha256"],
    "draft_sha256_canonical_official": draft_digest,
    "source_count": len(draft["coverage"]),
    "covered_sources": [c["source_number"] for c in draft["coverage"] if c["question_ids"]],
    "question_count": len(draft["questions"]),
    "single_count": sum(q["view"]["mode"] == "single" for q in draft["questions"]),
    "multiple_count": sum(q["view"]["mode"] == "multiple" for q in draft["questions"]),
    "option_count": sum(len(q["view"]["options"]) for q in draft["questions"]),
    "held_units": [],
    "new_figures": [],
    "losses_by_source": {c["source_number"]: c["omitted_tasks"]
                         for c in draft["coverage"] if c["omitted_tasks"]},
    "structural_validation": {
        "argv": argv,
        "cwd": str(ROOT),
        "exit_code": result.returncode,
        "stdout": str(stdout_path),
        "stderr": str(stderr_path),
        "invocation_count": 1,
    },
    "source_freeze_unchanged": True,
    "independent_semantic_approval": False,
    "review": "Parent dispatches the separate independent reviewer.",
    "model_hidden_cost": "UNKNOWN",
    "new_auxiliary_paid_calls": 0,
    "actual_image_opens": 0,
    "file_sha256": file_hashes,
}
report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "validation_exit_code": result.returncode,
    "validation_stdout": result.stdout,
    "validation_stderr": result.stderr,
    "draft_sha256_canonical_official": draft_digest,
    "draft_file_sha256": file_hashes[str((BASE / "draft.json").relative_to(ROOT))],
    "handoff": str(report_path),
}, ensure_ascii=False))
