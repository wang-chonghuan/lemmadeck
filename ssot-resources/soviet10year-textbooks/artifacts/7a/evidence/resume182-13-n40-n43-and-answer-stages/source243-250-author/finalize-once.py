import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import shutil
import subprocess


REPO = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
SCRATCH = REPO / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source243-250-author"
PAGES = tuple(range(243, 251))
PYTHON = ".claude/skills/ld-s10y-lesson/.venv/bin/python"
TOOL = ".claude/skills/ld-s10y-lesson/tools/p2c.py"
ROOT = "ssot-resources/soviet10year-textbooks/artifacts"
BOOKS = "ssot-resources/soviet10year-textbooks/sources"
WORK = ".tmp/ld-s10y-lesson"


def stamp():
    return datetime.now(timezone.utc).isoformat()


def sha(path):
    return hashlib.file_digest(path.open("rb"), "sha256").hexdigest()


def save(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


if Path.cwd().resolve() != REPO:
    raise SystemExit("Wrong checkout; no finalization attempted.")

# Refuse the entire run if any prior invocation receipt or destination exists.
for page in PAGES:
    name = f"{page:04d}"
    if not (SCRATCH / f"{name}.first.md").is_file():
        raise SystemExit(f"Missing first author manuscript: {name}")
    if (SCRATCH / f"{name}.start.json").exists():
        raise SystemExit(f"Prior invocation exists: {name}; refusing rerun.")
    if (REPO / ROOT / "7a/pages" / name / "page.md").exists():
        raise SystemExit(f"Destination already exists: {name}; preserving it.")

save(SCRATCH / "run-inputs.json", {
    "repo": str(REPO),
    "user_checkpoint_commit": "e16207d939526da0ebb2cfc528f084f0c3791afb",
    "image_loads": 8,
    "reopens": 0,
    "scope": "source capture only; no independent review or lesson approval",
    "tool_sha256": {
        TOOL: sha(REPO / TOOL),
        ".claude/skills/ld-s10y-lesson/tools/layout.py": sha(
            REPO / ".claude/skills/ld-s10y-lesson/tools/layout.py"
        ),
        ".claude/skills/ld-s10y-lesson/tools/blocks.py": sha(
            REPO / ".claude/skills/ld-s10y-lesson/tools/blocks.py"
        ),
    },
})

results = []
for page in PAGES:
    name = f"{page:04d}"
    author = SCRATCH / f"{name}.first.md"
    target = REPO / ROOT / "7a/pages" / name
    target.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(author, target / "page.md")
    command = [
        PYTHON, "-B", TOOL, "finalize", "--book", "7a", "--page", str(page),
        "--root", ROOT, "--books", BOOKS, "--work", WORK,
    ]
    save(SCRATCH / f"{name}.start.json", {
        "started_at": stamp(),
        "cwd": str(REPO),
        "argv": command,
        "first_md_sha256": sha(author),
        "grid_sha256": sha(REPO / WORK / "7a/pages" / name / "page.grid.png"),
        "template_sha256": sha(REPO / WORK / "7a/pages" / name / "page.template.md"),
    })
    with (SCRATCH / f"{name}.stdout").open("xb") as stdout, \
            (SCRATCH / f"{name}.stderr").open("xb") as stderr:
        result = subprocess.run(command, cwd=REPO, stdout=stdout, stderr=stderr)
    receipt = {
        "page": page,
        "exit": result.returncode,
        "ended_at": stamp(),
        "output_sha256": {
            filename: sha(target / filename)
            for filename in ("page.md", "page.json", "audit.json")
            if (target / filename).is_file()
        },
        "stdout_sha256": sha(SCRATCH / f"{name}.stdout"),
        "stderr_sha256": sha(SCRATCH / f"{name}.stderr"),
    }
    save(SCRATCH / f"{name}.exit.json", receipt)
    results.append(receipt)
    print(json.dumps(receipt, ensure_ascii=False), flush=True)

save(SCRATCH / "results.json", results)
raise SystemExit(0 if all(item["exit"] == 0 for item in results) else 1)
