import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys


W = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
T = W / ".intentfold/tickets/STEMROBIN-188/tmp/source6g173174-author-first7"
D = W / "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source173174/author-first7"
M = T / "manifest.json"
PREPARED = W / ".tmp/ld-s10y-lesson/6-8g/pages"
PYTHON = W / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
P2C = W / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def sha(path):
    return hashlib.file_digest(path.open("rb"), "sha256").hexdigest()


def binding(path):
    return {"path": str(path), "sha256": sha(path), "bytes": path.stat().st_size}


def save(data):
    M.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def copy_exact(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        if sha(source) != sha(target):
            raise RuntimeError(f"Refuse overwrite of existing differing file: {target}")
    else:
        shutil.copyfile(source, target)
    if sha(source) != sha(target):
        raise RuntimeError(f"Copy mismatch: {source}")
    return binding(target)


def init():
    if M.exists():
        raise RuntimeError("Existing manifest must be resumed, not replaced")
    data = {
        "schema": "stemrobin188/source-author-manifest@1",
        "status": "AUTHORING_NOT_REVIEWED",
        "cwd": str(W),
        "scope": {"book": "6-8g", "physical_pages": [173, 174], "printed_pages": [163, 164]},
        "ownership": {"tmp": str(T), "durable": str(D)},
        "FIRST": binding(D / "FIRST.json"),
        "authorization": {
            "finish": "review offline",
            "independent_review": False,
            "lesson_approval": False,
            "core_source_writes": False,
            "modern_answers_choices": False,
            "db_app_git_chat_peer_actions": False
        },
        "counters": {
            "image_batch_max": 8, "image_context_max": 24,
            "image_opens": 4, "original_opens": 2, "grid_opens": 2,
            "source_representations_reopened": 2,
            "same_file_reopens": 0, "crop_opens": 0,
            "native_finalize_calls": 0, "native_finalize_exit0": 0,
            "native_finalize_failures": 0, "native_crops_generated": 0,
            "author_candidates_per_page": {"173": 1, "174": 1},
            "source_revisions": 0, "technical_repairs": 0,
            "prepare_calls_this_author": 0,
            "paid_calls": 0, "model_service_calls": 0
        },
        "image_events": [
            {"ordinal": 1, "type": "original", "path": str(PREPARED / "0173/page.png")},
            {"ordinal": 2, "type": "original", "path": str(PREPARED / "0174/page.png")},
            {"ordinal": 3, "type": "grid_source_reopen", "path": str(PREPARED / "0173/page.grid.png")},
            {"ordinal": 4, "type": "grid_source_reopen", "path": str(PREPARED / "0174/page.grid.png")}
        ],
        "prepared_inputs": {},
        "native": [],
        "source_observations": {
            "173": {
                "printed": 163, "titles": [], "exercises": list(range(480, 488)),
                "exercise487_star": True, "figures": [230, 231],
                "all_exercises_open": False, "all_exercises_cont": False,
                "prior479_text_join": False, "figure230_prior_reference": True
            },
            "174": {
                "printed": 164, "titles": ["38. 多边形的内角和"],
                "exercises": [], "figures": [232, 233], "theorem": 47,
                "proof_open": True, "incoming_cont": False,
                "internal_proof_join_around_caption233": True,
                "teaching_footnote_lines": 2
            }
        }
    }
    for page in (173, 174):
        key = f"{page:04d}"
        data["prepared_inputs"][key] = []
        for name in ("page.png", "page.grid.png", "layout.json", "page.template.md",
                     "prepare.0001.stdout", "prepare.0001.stderr"):
            source = PREPARED / key / name
            target = T / "work/6-8g/pages" / key / name
            data["prepared_inputs"][key].append({
                "prepared": binding(source),
                "isolated_exact_copy": copy_exact(source, target)
            })
    data["tool_bindings"] = {"p2c": binding(P2C), "author_driver": binding(Path(__file__))}
    data["parent_prepare"] = {
        "performed_by": "parent, before this author",
        "reported_argv": [
            str(PYTHON), str(W / ".claude/skills/ld-s10y-lesson/tools/production.py"),
            "prepare-range", "--repo", ".", "--book", "6-8g",
            "--first", "173", "--last", "174", "--work", ".tmp/ld-s10y-lesson"
        ],
        "reported_exit": 0,
        "verification_scope": "Caller-reported exit0; existing per-page streams bound above. No fabricated per-page argv/exit receipt."
    }
    save(data)
    print(json.dumps({"status": "initialized", "manifest": str(M)}, indent=2))


def finalize(page):
    data = json.loads(M.read_text())
    if any(record["page"] == page for record in data["native"]):
        raise RuntimeError("Refuse rerun: native page already attempted")
    key = f"{page:04d}"
    out = T / "native" / key / "finalize.0001"
    out.mkdir(parents=True, exist_ok=False)
    md = T / "artifacts/6-8g/pages" / key / "page.md"
    before = copy_exact(md, out / "page.md.before")
    argv = [str(PYTHON), str(P2C), "finalize", "--book", "6-8g", "--page", str(page),
            "--root", str(T / "artifacts"), "--work", str(T / "work")]
    stdout, stderr = out / "stdout", out / "stderr"
    record = {"page": page, "attempt": 1, "argv": argv, "cwd": str(W),
              "status": "IN_FLIGHT", "author_source_before_native": before}
    data["native"].append(record)
    data["counters"]["native_finalize_calls"] += 1
    save(data)
    with stdout.open("wb") as output, stderr.open("wb") as errors:
        result = subprocess.run(argv, cwd=W, stdout=output, stderr=errors, check=False)
    record.update({"status": "PASS" if result.returncode == 0 else "HELD",
                   "exit_code": result.returncode,
                   "streams": {"stdout": binding(stdout), "stderr": binding(stderr)},
                   "outputs": []})
    for path in sorted((T / "artifacts/6-8g/pages" / key).glob("*")):
        if path.is_file():
            record["outputs"].append(binding(path))
    figures = sorted((T / "work/6-8g/pages" / key / "figures").glob("*.png"))
    record["figure_outputs"] = [binding(path) for path in figures]
    data["counters"]["native_crops_generated"] += len(figures)
    counter = "native_finalize_exit0" if result.returncode == 0 else "native_finalize_failures"
    data["counters"][counter] += 1
    save(data)
    print(json.dumps({"page": page, "exit_code": result.returncode,
                      "stdout": stdout.read_text(), "stderr": stderr.read_text(),
                      "manifest": str(M)}, ensure_ascii=False, indent=2))


def retain():
    data = json.loads(M.read_text())
    if len(data["native"]) != 2 or any(r["status"] == "IN_FLIGHT" for r in data["native"]):
        raise RuntimeError("Cannot retain unfinished native execution")
    retained = []
    for page in (173, 174):
        key = f"{page:04d}"
        for entry in data["prepared_inputs"][key]:
            source = Path(entry["isolated_exact_copy"]["path"])
            retained.append(copy_exact(source, D / "inputs" / key / source.name))
        for source in sorted((T / "artifacts/6-8g/pages" / key).glob("*")):
            if source.is_file():
                retained.append(copy_exact(source, D / "pages" / key / source.name))
        for source in sorted((T / "work/6-8g/pages" / key / "figures").glob("*.png")):
            retained.append(copy_exact(source, D / "figures" / source.name))
        for source in sorted((T / "native" / key / "finalize.0001").glob("*")):
            if source.is_file():
                retained.append(copy_exact(source, D / "native" / key / "finalize.0001" / source.name))
    retained.append(copy_exact(Path(__file__), D / "author_run.py"))
    data["retained_files"] = retained
    data["status"] = "SOURCE_CANDIDATE_READY_FOR_OFFLINE_REVIEW" if all(
        r["exit_code"] == 0 for r in data["native"]
    ) else "SOURCE_CANDIDATE_HELD_FOR_OFFLINE_REVIEW"
    data["durable_manifest"] = str(D / "manifest.json")
    data["durable_manifest_self_hash"] = "External SHA256 reported separately; no circular self-hash."
    save(data)
    copy_exact(M, D / "manifest.json")
    for path in D.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    print(json.dumps({"status": data["status"], "manifest": binding(D / "manifest.json"),
                      "retained_file_count": len(retained), "counters": data["counters"]},
                     ensure_ascii=False, indent=2))


if Path.cwd() != W:
    raise RuntimeError(f"Every-command cwd must be W, got {Path.cwd()}")
if sys.argv[1] == "init":
    init()
elif sys.argv[1] == "finalize":
    finalize(int(sys.argv[2]))
elif sys.argv[1] == "retain":
    retain()
else:
    raise RuntimeError("Unknown action")
