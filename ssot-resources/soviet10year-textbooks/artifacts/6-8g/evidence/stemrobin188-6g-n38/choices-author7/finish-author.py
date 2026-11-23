"""Run the native structural command once and project only learner views."""

import hashlib
import json
from pathlib import Path
import subprocess


own = Path(__file__).resolve().parent
repo = Path.cwd()
relative = own.relative_to(repo)
argv = [
    "python3",
    ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".",
    "--seed", str(relative / "seed.json"),
    "--draft", str(relative / "draft.json"),
]
receipt = own / "STRUCTURAL-RESULT.json"
if receipt.exists():
    raise SystemExit("Existing structural receipt: refusing an unrequested repeat.")
result = subprocess.run(argv, cwd=repo, capture_output=True)
stdout = own / "structural.stdout"
stderr = own / "structural.stderr"
stdout.write_bytes(result.stdout)
stderr.write_bytes(result.stderr)
receipt.write_text(json.dumps({
    "cwd": str(repo),
    "argv": argv,
    "exit_code": result.returncode,
    "review_supplied": False,
    "semantic_review": "NOT_RUN; AUTHOR_ONLY",
    "streams": {
        "stdout": str(stdout),
        "stderr": str(stderr),
        "stdout_sha256": hashlib.sha256(result.stdout).hexdigest(),
        "stderr_sha256": hashlib.sha256(result.stderr).hexdigest(),
    },
}, indent=2) + "\n")
print(json.dumps({
    "argv": argv,
    "exit_code": result.returncode,
    "stdout": result.stdout.decode(),
    "stderr": result.stderr.decode(),
}, indent=2))

seed = json.loads((own / "seed.json").read_text())
draft = json.loads((own / "draft.json").read_text())
view = {
    "schema": "s10y-choice-view-only-v1",
    "figures": [
        {
            "id": figure["id"],
            "label": figure["label"],
            "assets": [{"path": asset["path"]} for asset in figure["assets"]],
        }
        for figure in seed["figures"]
    ],
    "questions": [question["view"] for question in draft["questions"]],
}
with (own / "view-only.json").open("x") as stream:
    json.dump(view, stream, ensure_ascii=False, indent=2)
    stream.write("\n")

sources = draft["coverage"]
summary = {
    "status": "AUTHOR_ONLY",
    "source_count": len(seed["exercises"]),
    "source_numbers": [exercise["number"] for exercise in seed["exercises"]],
    "concept_blocks": [concept["block"] for concept in seed["concepts"]],
    "questions": len(draft["questions"]),
    "single_questions": sum(q["view"]["mode"] == "single" for q in draft["questions"]),
    "multiple_questions": sum(q["view"]["mode"] == "multiple" for q in draft["questions"]),
    "options": sum(len(q["view"]["options"]) for q in draft["questions"]),
    "rationales": sum(len(q["key"]["rationales"]) for q in draft["questions"]),
    "covered_sources": sum(bool(source["question_ids"]) for source in sources),
    "sources_without_questions": sum(not source["question_ids"] for source in sources),
    "coverage_loss_entries": sum(len(source["omitted_tasks"]) for source in sources),
    "question_limitation_entries": sum(len(q["intent"]["limitations"]) for q in draft["questions"]),
    "original_figures": len(seed["figures"]),
    "new_figures": len(draft["new_figures"]),
    "images_loaded_batch_1": 4,
    "images_loaded_context": 4,
    "image_reopens": 0,
    "cropped_images": 0,
    "structural_exit_code": result.returncode,
    "structural_runs": 1,
    "semantic_reviews": 0,
}
with (own / "AUTHOR-COUNTS.json").open("x") as stream:
    json.dump(summary, stream, indent=2)
    stream.write("\n")
print(json.dumps(summary, indent=2))
raise SystemExit(result.returncode)
