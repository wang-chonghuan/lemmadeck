"""Capture hashes and immutable author snapshots, not mathematical verdicts."""
import hashlib
import json
from pathlib import Path
import shutil
import sys

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n44-choice-author"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical(path):
    value = json.loads(path.read_text())
    return hashlib.sha256(json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode()).hexdigest()


def write_new(name, value):
    target = OWNED / name
    with target.open("x") as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


if sys.argv[1] == "seal-first":
    solution = OWNED / "FIRST-author-independent-solutions.md"
    value = {
        "path": str(solution.relative_to(ROOT)),
        "sha256": sha(solution),
        "seed_sha256": canonical(OWNED / "seed.json"),
        "before_draft_exists": not (OWNED / "draft.json").exists(),
        "before_key_artifact_exists": not (OWNED / "draft.json").exists(),
        "immutable": True,
        "kind": "first_author_source_solutions_not_reviewer",
    }
    write_new("FIRST-solution-seal.json", value)
    print(json.dumps(value, indent=2))
elif sys.argv[1] == "snapshot-draft":
    draft = OWNED / "draft.json"
    snapshot = OWNED / "draft.first.json"
    if snapshot.exists():
        raise SystemExit("Refusing to overwrite first draft.")
    shutil.copyfile(draft, snapshot)
    value = {
        "path": str(snapshot.relative_to(ROOT)), "sha256": sha(snapshot),
        "canonical_sha256": canonical(snapshot),
        "before_first_structural_validator": True,
    }
    write_new("FIRST-draft-seal.json", value)
    print(json.dumps(value, indent=2))
elif sys.argv[1] == "inventory":
    seed = json.loads((OWNED / "seed.json").read_text())
    paths = {entry["path"] for entry in seed["trace"]}
    for figure in seed["figures"]:
        paths.update(asset["path"] for asset in figure["assets"])
    paths.update([
        ".agents/skills/ld-s10y-choice/SKILL.md",
        ".agents/skills/ld-s10y-choice/references/authoring.md",
        ".agents/skills/ld-s10y-choice/references/contract.md",
        ".agents/skills/ld-s10y-choice/references/review.md",
        ".agents/skills/ld-s10y-choice/scripts/prepare.py",
        ".agents/skills/ld-s10y-choice/scripts/validate.py",
        ".agents/skills/ld-s10y-image/SKILL.md",
        ".agents/skills/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md",
        ".agents/skills/node_modules/playwright-core/index.mjs",
        ".intentfold/readme.md", ".intentfold/charter/engineering.md",
    ])
    values = [{"path": value, "sha256": sha(ROOT / value)} for value in sorted(paths)]
    for file in OWNED.glob("*"):
        if file.is_file() and file.name != "input-hashes.json":
            values.append({"path": str(file.relative_to(ROOT)), "sha256": sha(file)})
    for file in (OWNED / "previews").glob("*.png"):
        values.append({"path": str(file.relative_to(ROOT)), "sha256": sha(file)})
    write_new("input-hashes.json", values)
    print(json.dumps(values, indent=2))
elif sys.argv[1] == "final-report":
    report = json.loads((OWNED / "report-author-data.json").read_text())
    draft = json.loads((OWNED / "draft.json").read_text())
    report["counts"] = {
        "selected_sources": len(draft["coverage"]),
        "native_questions": len(draft["questions"]),
        "single": sum(q["view"]["mode"] == "single" for q in draft["questions"]),
        "multiple": sum(q["view"]["mode"] == "multiple" for q in draft["questions"]),
        "options": sum(len(q["view"]["options"]) for q in draft["questions"]),
        "new_figures": len(draft["new_figures"]),
    }
    report["coverage"] = draft["coverage"]
    report["first_solution_seal"] = json.loads((OWNED / "FIRST-solution-seal.json").read_text())
    report["first_draft_seal"] = json.loads((OWNED / "FIRST-draft-seal.json").read_text())
    report["input_hashes"] = json.loads((OWNED / "input-hashes.json").read_text())
    report["image_opens"] = json.loads((OWNED / "image-opens.json").read_text())
    report["input_render_records"] = json.loads((OWNED / "input-render-record.json").read_text())
    report["commands"] = [
        json.loads(file.read_text()) for file in sorted((OWNED / "commands").glob("*.json"))
    ]
    report["hashes"] = {
        "seed_file_sha256": sha(OWNED / "seed.json"),
        "seed_canonical_sha256": canonical(OWNED / "seed.json"),
        "draft_file_sha256": sha(OWNED / "draft.json"),
        "draft_canonical_sha256": canonical(OWNED / "draft.json"),
        "first_solution_file_sha256": sha(OWNED / "FIRST-author-independent-solutions.md"),
        "report_md_sha256": sha(OWNED / "report.md"),
    }
    report["audit_note"] = (
        "Mechanical evidence aggregation only: no mathematical re-solve, "
        "review-aware semantic check, reviewer verdict or retainer. "
        "Recorder appends this final command after capturing its output."
    )
    write_new("report.json", report)
    print("Author-only report.json created; semantic review remains pending.")
    print(json.dumps(report["counts"], indent=2))
    print("FIRST solution SHA-256: " + report["hashes"]["first_solution_file_sha256"])
    print("No draft content repair or second structural validator run.")
