"""Deterministic receipts and metadata only; never constructs choice content."""

import hashlib
import json
from pathlib import Path
import subprocess
import sys

OWN = Path(__file__).resolve().parent
ROOT = OWN.parents[5]
SEED = OWN / "seed.json"
DRAFT = OWN / "draft.json"
NUMBERS = ("820", "821", "822", "823", "824", "825", "826",
           "827", "828", "829", "830", "831", "832", "833")
SUPPLEMENT = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/7a/"
    "editions/modern-us-neutral/lessons/alg7-c4-s2-n39/lesson.json"
)


def canonical(value):
    return hashlib.sha256(json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def record(path):
    value = {"path": str(path.relative_to(ROOT)),
             "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
    if path.suffix == ".json":
        value["canonical_sha256"] = canonical(load(path))
    return value


def write_new(name, value):
    with (OWN / name).open("x", encoding="utf-8") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=True)
        stream.write("\n")


def run_first(name, command):
    receipt = OWN / (name + ".json")
    if receipt.exists():
        raise RuntimeError(f"FIRST receipt already exists: {receipt}")
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    for suffix, output in (("stdout.txt", result.stdout),
                           ("stderr.txt", result.stderr)):
        with (OWN / (name + "." + suffix)).open("x", encoding="utf-8") as stream:
            stream.write(output)
    write_new(receipt.name, {
        "cwd": str(ROOT), "argv": command, "exit_code": result.returncode,
        "stdout": name + ".stdout.txt", "stderr": name + ".stderr.txt",
        "semantic_approval": False,
    })
    print(result.stdout, end="")
    print(result.stderr, end="", file=sys.stderr)
    print(f"actual FIRST exit_code={result.returncode}")
    return result.returncode


def main():
    if ROOT != Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck"):
        raise RuntimeError(f"wrong root: {ROOT}")
    stage = sys.argv[1]
    if stage == "prepare":
        command = ["python3", "-B",
                   ".agents/skills/ld-s10y-choice/scripts/prepare.py",
                   "prepare", "--repo", ".", "--book", "7a",
                   "--lesson", "alg7-c4-s2-n40"]
        for number in NUMBERS:
            command += ["--exercise", number]
        command += ["--concept-block", "6", "--concept-block", "7",
                    "--out", str(SEED)]
        return run_first("prepare-FIRST", command)
    if stage == "freeze":
        if DRAFT.exists():
            raise RuntimeError("source solution freeze must precede draft")
        source = OWN / "source-solutions-FIRST.md"
        write_new("author-solutions-FIRST.hashes.json", {
            "stage": "source-solving-before-options",
            "draft_existed": False, "selected_source_numbers": list(NUMBERS),
            "files": [record(SEED), record(source), record(OWN / "notes.md")],
            "supplementary_teaching_source": record(SUPPLEMENT),
            "observed_bradis_lookup_cells": [],
            "semantic_approval": False,
        })
        print("Frozen source solutions before options; no semantic approval.")
        return 0
    if stage == "validate":
        frozen = load(OWN / "author-solutions-FIRST.hashes.json")
        for old in frozen["files"][:2]:
            now = record(ROOT / old["path"])
            if old != now:
                raise RuntimeError(f"FIRST source changed: {old['path']}")
        return run_first("structural-validator-FIRST", [
            "python3", "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
            "--repo", ".", "--seed", str(SEED), "--draft", str(DRAFT),
        ])
    if stage == "package":
        draft = load(DRAFT)
        write_new("coverage.json", {
            "seed_sha256": canonical(load(SEED)),
            "draft_sha256": canonical(draft),
            "coverage": draft["coverage"],
        })
        write_new("reviewer-views.json", {
            "seed_sha256": canonical(load(SEED)),
            "draft_sha256": canonical(draft),
            "questions": [{"id": q["id"], "view": q["view"]}
                          for q in draft["questions"]],
        })
        files = [SEED, DRAFT, OWN / "source-solutions-FIRST.md",
                 OWN / "coverage.json", OWN / "notes.md",
                 OWN / "handoff.md", OWN / "reviewer-views.json",
                 OWN / "author-solutions-FIRST.hashes.json",
                 OWN / "structural-validator-FIRST.json",
                 OWN / "structural-validator-FIRST.stdout.txt",
                 OWN / "structural-validator-FIRST.stderr.txt",
                 OWN / "metadata.py", OWN / "prepare-FIRST.json",
                 OWN / "prepare-FIRST.stdout.txt", OWN / "prepare-FIRST.stderr.txt"]
        write_new("hashes.json", {
            "schema": "n40-offline-author-hashes-v1",
            "files": [record(path) for path in files],
            "counts": {
                "selected_sources": len(load(SEED)["exercises"]),
                "questions": len(draft["questions"]),
                "single": sum(q["view"]["mode"] == "single"
                              for q in draft["questions"]),
                "multiple": sum(q["view"]["mode"] == "multiple"
                                for q in draft["questions"]),
                "source_figures": len(load(SEED)["figures"]),
                "new_figures": len(draft["new_figures"]),
            },
            "structural_validator_first": load(
                OWN / "structural-validator-FIRST.json"
            ),
            "semantic_status": "pending-separate-independent-source-view-key-review",
            "deferred_lookup_tasks": [
                "829.route1", "829.route2",
                "830.a", "830.b", "830.c", "830.d", "831.a", "831.b",
            ],
        })
        print(json.dumps(load(OWN / "hashes.json")["counts"], sort_keys=True))
        print("Hashes/coverage/view-only handoff packaged. Semantic review pending.")
        return 0
    raise RuntimeError(f"unknown stage: {stage}")


if __name__ == "__main__":
    sys.exit(main())
