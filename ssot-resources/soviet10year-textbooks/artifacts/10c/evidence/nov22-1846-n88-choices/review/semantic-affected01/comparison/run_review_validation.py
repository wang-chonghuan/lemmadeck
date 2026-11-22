import hashlib
import json
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path


OWN = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-choice-review/semantic-affected01/comparison")
data = json.loads((OWN / "intake.json").read_text(encoding="utf-8"))
original = data["validator_receipt"]
review_path = OWN / "review.json"
output_names = ("validation.stdout.txt", "validation.stderr.txt", "execution.json")
if any((OWN / name).exists() for name in output_names):
    raise RuntimeError("refuse to replay validation or overwrite its receipts")
argv = original["argv"] + ["--review", str(review_path)]
resolved = shutil.which(argv[0])
if resolved != original["resolved_interpreter"]:
    raise RuntimeError("validator interpreter differs from structural receipt")
if Path.cwd() != Path(original["cwd"]):
    raise RuntimeError("runner cwd differs from structural receipt")
tool_path = Path(argv[1])
draft_path = Path(original["argv"][original["argv"].index("--draft") + 1])
draft_before = draft_path.read_bytes()
draft_sha = hashlib.sha256(draft_before).hexdigest()
if draft_sha != data["bindings"]["draft"]["sha256"]:
    raise RuntimeError("current draft bytes changed after the single reviewer intake")
review_before = review_path.read_bytes()
review_sha = hashlib.sha256(review_before).hexdigest()
review_value = json.loads(review_before)
review_canonical = hashlib.sha256(
    json.dumps(review_value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
).hexdigest()
tool_sha = hashlib.sha256(tool_path.read_bytes()).hexdigest()

started = datetime.now(timezone.utc).isoformat()
tick = time.perf_counter()
result = subprocess.run(argv, cwd=original["cwd"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
elapsed = time.perf_counter() - tick
finished = datetime.now(timezone.utc).isoformat()
streams = {}
for label, raw in (("stdout", result.stdout), ("stderr", result.stderr)):
    path = OWN / f"validation.{label}.txt"
    with path.open("xb") as handle:
        handle.write(raw)
    streams[label] = {
        "path": str(path),
        "bytes": len(raw),
        "sha256": hashlib.sha256(raw).hexdigest(),
        "text_utf8": raw.decode("utf-8", errors="replace"),
    }

draft_after_sha = hashlib.sha256(draft_path.read_bytes()).hexdigest()
review_after_sha = hashlib.sha256(review_path.read_bytes()).hexdigest()
receipt = {
    "schema": "stemrobin1846/affected12-first-WITH-REVIEW-actual-execution@1",
    "argv": argv,
    "cwd": original["cwd"],
    "only_change_from_structural_argv": ["--review", str(review_path)],
    "structural_argv_prefix_exactly_preserved": argv[:-2] == original["argv"],
    "resolved_interpreter": resolved,
    "runner_interpreter": sys.executable,
    "interpreter_matches_structural_receipt": resolved == original["resolved_interpreter"],
    "tool_path": str(tool_path),
    "tool_sha256": tool_sha,
    "started_at_utc": started,
    "finished_at_utc": finished,
    "elapsed_seconds": elapsed,
    "exit_code": result.returncode,
    "validator_invocations": 1,
    "prior_structural_replay": False,
    "retry_count": 0,
    "review": {
        "path": str(review_path),
        "bytes": len(review_before),
        "sha256": review_sha,
        "canonical_sha256": review_canonical,
        "after_sha256": review_after_sha,
        "bytes_unchanged_through_run": review_sha == review_after_sha,
        "outcome": review_value["outcome"],
    },
    "draft": {
        **data["bindings"]["draft"],
        "before_sha256": draft_sha,
        "after_sha256": draft_after_sha,
        "bytes_unchanged_through_run": draft_sha == draft_after_sha,
        "reviewer_semantic_parse_count": 1,
        "validator_read": "separate explicitly authorized tool read; no reviewer semantic replay",
    },
    "seed": {
        "path": original["argv"][original["argv"].index("--seed") + 1],
        "canonical_sha256": data["seed_sha256"],
        "binding_basis": "same recorded seed; tool's explicitly authorized mechanical refresh",
    },
    "structural_receipt": data["bindings"]["structural_receipt"],
    "stdout": streams["stdout"],
    "stderr": streams["stderr"],
    "nonzero_result_preserved": result.returncode != 0,
    "process_state": "validator_exited",
    "dependent_production_or_repair_started": False,
    "candidate_or_tool_edits": 0,
    "parent_accounting": {
        "basis": "PARENT-AGENT TEXT under original human delegation",
        "permanent_image_budget": "24/24 spent",
        "charges": 74,
        "paid_calls": 0,
        "fees": "UNKNOWN",
        "complete": 0,
        "counters_modified": False,
    },
}
with (OWN / "execution.json").open("x", encoding="utf-8") as handle:
    json.dump(receipt, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps(receipt, ensure_ascii=False, indent=2))
raise SystemExit(result.returncode)
