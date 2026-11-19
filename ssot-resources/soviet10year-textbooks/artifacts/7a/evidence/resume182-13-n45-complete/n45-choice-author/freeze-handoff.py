"""Freeze this author's artifacts and run the one authorized structural check."""
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = Path.cwd().resolve()
REL = HERE.relative_to(REPO)


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_hash(value):
    text = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def save_pair(name, value):
    work = HERE / name.replace(".", ".work.", 1)
    frozen = HERE / name
    if frozen.exists() or work.exists():
        raise FileExistsError(f"Do not overwrite retained evidence: {name}")
    if isinstance(value, str):
        with work.open("x", encoding="utf-8") as stream:
            stream.write(value)
    else:
        with work.open("x", encoding="utf-8") as stream:
            json.dump(value, stream, ensure_ascii=True, indent=2)
            stream.write("\n")
    with work.open("rb") as source, frozen.open("xb") as target:
        shutil.copyfileobj(source, target)
    frozen.chmod(0o444)
    return frozen


def freeze_existing(work_name, frozen_name):
    work, frozen = HERE / work_name, HERE / frozen_name
    with work.open("rb") as source, frozen.open("xb") as target:
        shutil.copyfileobj(source, target)
    frozen.chmod(0o444)


seed = json.loads((HERE / "seed.work.json").read_text())
draft = json.loads((HERE / "draft.work.json").read_text())
counts = json.loads((HERE / "authored-counts.work.json").read_text())
freeze_existing("seed.work.json", "seed.json")
freeze_existing("draft.work.json", "draft.json")

base = "ssot-resources/soviet10year-textbooks/artifacts/7a"
modern = base + "/editions/modern-us-neutral"
image_rows = [
    ("fig-60", base + "/figures/fig-60.png", "original_png",
     "Finite half-unit grid curve: endpoints x=-1.5,6; queried y=3 crossings x=0,4; valley near (2,1)."),
    ("fig-60", modern + "/figures/evidence/n45-independent/fig-60.preview.png", "modern_640px_preview",
     "Full curve, axes, endpoint guides and arrowheads visible; same crossings and finite domain; no analytic equation inferred."),
    ("fig-61", base + "/figures/fig-61.png", "original_png",
     "Panel a 0<A(x)<B(x^2); panel b 0<B(x^2)<A(x); no unit tick or numeric scale."),
    ("fig-61", modern + "/figures/evidence/n45-independent/fig-61.preview.png", "modern_640px_preview",
     "Both full schematic lines, arrowheads and labels visible; order preserved; spacing is not numerical data."),
]
images = []
for figure_id, path, kind, observation in image_rows:
    images.append({
        "figure_id": figure_id,
        "path": path,
        "sha256": byte_hash(REPO / path),
        "kind": kind,
        "open_count": 1,
        "batch": 1,
        "observation": observation,
    })
ledger = {
    "schema": "n45-author-input-image-ledger-v1",
    "authorization": "STEMROBIN-182 n45 choice AUTHOR offline only",
    "selected_originals": [e["number"] for e in seed["exercises"]],
    "selected_concept_blocks": [],
    "concept_selection": "--no-concepts: inspect candidates are solved examples, not standalone definitions",
    "concept_figure_ids": [],
    "excluded_figure": {"id": "fig-59", "reason": "Prose-only solved example; not a seed/definition and never opened"},
    "seed_canonical_sha256": canonical_hash(seed),
    "draft_canonical_sha256": canonical_hash(draft),
    "input_json_hashes_from_prepare": seed["trace"],
    "declared_final_figure_assets": seed["figures"],
    "images": images,
    "image_batch_count": 1,
    "distinct_images_opened": 4,
    "total_image_opens": 4,
    "reopens": 0,
    "crops": 0,
    "new_images": 0,
    "maximum_authorized_distinct_images": 6,
    "source_solutions_frozen_before_options": {
        "path": str(REL / "source-solutions.pre-options.md"),
        "sha256": byte_hash(HERE / "source-solutions.pre-options.md"),
    },
    "boundary": {
        "no_answer_keys_or_interactions_or_bookanswers": True,
        "no_other_authors_or_previous_choice_outputs_or_tests": True,
        "no_frozen_n45_answer_directories": True,
        "no_env_db_dependencies_network_model_services": True,
        "no_git_progress_application_or_promotion_changes": True,
        "all_writes_under": str(REL),
    },
}
save_pair("input-hash-image-ledger.json", ledger)

prepare_command = [
    "python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "prepare",
    "--repo", ".", "--book", "7a", "--lesson", "alg7-c4-s3-n45",
]
for exercise in seed["exercises"]:
    prepare_command += ["--exercise", exercise["number"]]
prepare_command += ["--no-concepts", "--out", str(REL / "seed.work.json")]
command = [
    "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".", "--seed", str(REL / "seed.json"),
    "--draft", str(REL / "draft.json"),
]
completed = subprocess.run(
    command, cwd=REPO, text=True, capture_output=True,
    env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
)
first = {
    "cwd": str(REPO),
    "command": command,
    "run_number": 1,
    "scope": "structure only, frozen seed/draft, no review",
    "exit_code": completed.returncode,
    "stdout": completed.stdout,
    "stderr": completed.stderr,
    "seed_canonical_sha256": canonical_hash(seed),
    "draft_canonical_sha256": canonical_hash(draft),
    "timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "first_failure_preserved": completed.returncode != 0,
    "semantic_review": "pending independent parent source->view->key review",
}
save_pair("validation.first.json", first)
receipts = [
    {
        "command": ["python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "inspect",
                    "--repo", ".", "--book", "7a", "--lesson", "alg7-c4-s3-n45"],
        "exit_code": 0,
        "result": "Projected 19 originals 873-891, figure IDs 59/60/61, concept candidates; explicitly selected all originals and no concepts.",
        "original_tool_receipt": "c2c9d8",
        "rerun": False,
    },
    {
        "command": prepare_command,
        "exit_code": 0,
        "stdout": "prepared 19 written seeds; no questions generated\nseed_sha256=b70e5b9375e56a8aca27a42b717b4b1e7cdb40ef8b787c8f984563f660991f8e\n",
        "original_tool_receipt": "ea3880",
        "rerun": False,
    },
    {
        "command": ["python3", str(REL / "author-data.py")],
        "exit_code": 0,
        "result": "Serializes explicit authored records after independent solutions were frozen; option ordering depends only on visible text and ID, never correctness.",
        "draft_canonical_sha256": canonical_hash(draft),
    },
    first,
]
save_pair("command-receipts.json", {"cwd": str(REPO), "receipts": receipts})

outcome = "AUTHOR_COMPLETE_STRUCTURE_PASS_REVIEW_PENDING" if completed.returncode == 0 else "AUTHOR_STRUCTURE_FAILURE_PRESERVED"
report = f"""# STEMROBIN-182 n45 Choice AUTHOR

Outcome: {outcome}

Only the uniquely authorized offline author stage was performed. No semantic
self-review, finalizer, retention/promotion, progress update, app, DB, Git,
dependency, network or model-service operation was performed. Independent parent
source -> view -> key review remains required; structure pass is not semantic approval.

## Counts And Tasks

- Inputs: 19 originals 873-891; 44 lettered subparts in 873-888.
- Result-task accounting: 44 lettered tasks + 889 equality/greater/less sets (3)
  + 890 full graph/function classification (2) + 891 two panels/four coordinates (8)
  = 57 mathematical result tasks.
- Draft: {counts['questions']} questions: {counts['single']} single, {counts['multiple']} multiple;
  {counts['options']} options, {counts['correct_options']} correct alternatives.
- 873-888 each lettered task has one meaningful complete response unit; 889 one
  full three-set partition; 890 one complete six-row graph plus classification;
  891 one complete order for each panel. No mathematical result task wholly deferred.
- Source figures used: fig-60 and fig-61. Fig-59 is a prose solved example,
  not a relevant definition and not opened. No concepts selected; no new figures.
- One image batch, 4 distinct images, each opened once: actual source PNG and
  existing modern 640px preview for each of fig-60/61. No reopens/crops/other images.

## Domains, Conventions And Capacity Loss

- 873b retains both {{10,12}} and {{-12,-10}}; no unstated natural/positive restriction.
- 881b retains return speeds 12 and 50 km/h. 883b retains lake speeds 5 and 6 km/h.
  All original rational-equation denominator exclusions are retained, including
  empty root set 878i. Negative physical speeds are rejected on physical conditions.
- 880a explicitly allows integer components with either sign: (4,3),(-5,-6).
  Positive-component convention would keep only (4,3). The negative pair satisfies
  literal equations and is never labeled false. Its value 5/6 must not be reduced
  before the component modifications.
- 880b explicitly allows zero numerator: (11,15),(0,4). Positive-numerator
  convention would keep only (11,15); (0,4) is not labeled a literal false answer.
- 890 explicitly uses N={{0,1,2,...}}: 21 isolated points, including (0,0).
  Positive-natural convention gives 20 points by deleting exactly (0,0).
  Both are functions; no historical zero convention has been inferred.
- Historical unqualified component/N interpretation in 880a,880b,890 remains
  unresolved. These are qualified authored choices, not proof of the historical
  convention. Qualified production loss is declared in intent and coverage.
- 889 uses the actual nonanalytic graph: equality {{0,4}}, above
  [-1.5,0) union (4,6], below (0,4); no extrapolation or formula reconstruction.
- 891 uses only 0<x<x^2 in a and 0<x^2<x in b, giving x>1 and 0<x<1.
  No schematic spacing or hollow marker is treated as a numerical coordinate or
  missing domain endpoint.
- Choices do not demonstrate independent derivation writing for 873-885/887-888,
  writing the proofs in 886a/b, drawing the discrete graph in 890, or placing the
  eight points in 891. 889 assesses recognition of a full partition rather than
  independently recording it. These are precise production losses, not removed
  by full result-task coverage.
- Options have explicit correct derivations and concrete mistaken procedures.
  Per-question SHA-256 ordering of ID plus visible option text does not inspect
  correctness and uses no fixed rotation, key template or position quota.

## Frozen Handoff

- seed.json and draft.json: mode 0444; seed.work.json/draft.work.json remain writable.
- source-solutions.pre-options.md: mode 0444, created before options;
  source-solutions.work.md remains writable.
- author-report.md, input-hash-image-ledger.json, command-receipts.json and
  validation.first.json: mode 0444, each with a writable .work copy.
- Seed canonical SHA-256: {canonical_hash(seed)}
- Draft canonical SHA-256: {canonical_hash(draft)}
- Pre-options source-solution byte SHA-256: {byte_hash(HERE / 'source-solutions.pre-options.md')}
- Explicit task mappings, convention losses, complete independent solutions,
  per-option procedures and observations are internal, not learner-facing.

## Structural Command Receipt

Working directory: {REPO}

```text
{' '.join(command)}
```

Run count: 1. Exit code: {completed.returncode}.
Stdout:

```text
{completed.stdout.rstrip()}
```

Stderr:

```text
{completed.stderr.rstrip() or '(empty)'}
```

First failure receipt is retained unchanged if there was a failure. No semantic
review was fabricated or repeated. Parent should start from the frozen seed and
actual figures, using its existing independent source mathematics only within
the separately authorized reviewer stage.
"""
save_pair("author-report.md", report)
print(json.dumps({"task": "STEMROBIN-182 7a n45 choice AUTHOR",
                  "outcome": outcome,
                  "report": str(HERE / "author-report.md"),
                  "validation_exit": completed.returncode}, indent=2))
sys.exit(completed.returncode)
