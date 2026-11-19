"""Record offline preparation, source projection, freezing and structural checks."""

import hashlib
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[6]
OWN = Path(__file__).resolve().parent
REL = OWN.relative_to(ROOT)
CHOICE = ROOT / ".agents/skills/ld-s10y-choice/scripts"
BASE = OWN.parent


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode()).hexdigest()


def write(name, value):
    with (OWN / name).open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


def run(name, args):
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
    write(name, {
        "cwd": str(ROOT), "command": args, "started_at": started,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "exit_code": result.returncode, "stdout": result.stdout, "stderr": result.stderr,
    })
    print(result.stdout, end="")
    print(result.stderr, end="", file=sys.stderr)
    if result.returncode:
        raise SystemExit(result.returncode)
    return result.stdout


def sources():
    args = [sys.executable, str(CHOICE / "prepare.py"), "inspect",
            "--repo", ".", "--book", "7a", "--lesson", "alg7-c4-s2-n39"]
    inventory = json.loads(run("inspect-receipt.json", args))
    write("inspect.json", inventory)
    args[2] = "prepare"
    for number in range(806, 820):
        args += ["--exercise", str(number)]
    for block in (0, 1, 10, 16, 27):
        args += ["--concept-block", str(block)]
    args += ["--out", str(REL / "seed.json")]
    run("prepare-receipt.json", args)
    allowed_keys = {"n39_main_and_correction_cells", "n39_context_cells",
                    "n39_816_square_cells"}
    cells = []
    inputs = []
    for image in range(33, 41):
        path = BASE / f"bradis-cell-review/capture-{image}.json"
        capture = read(path)
        inputs.append({"path": str(path.relative_to(ROOT)), "sha256": sha(path)})
        for record in capture["records_in_request_address_order"]:
            if record["key"] in allowed_keys:
                cells.append({
                    "table": capture["table"], "pdf_image": image,
                    "printed_page": capture["printed_page"], **record,
                })
    rules_path = BASE / "bradis-tables-source-review/source-rules.corrected.json"
    rules = read(rules_path)
    general_path = BASE / "bradis-method-rules/source-rules.json"
    general = read(general_path)
    inputs += [{"path": str(p.relative_to(ROOT)), "sha256": sha(p)}
               for p in (rules_path, general_path)]
    write("source-cells.json", {
        "schema": "n39-literal-source-cells@1",
        "identity": rules["source"],
        "authority": "2010 supplemental source cells, not historical equivalence or solved outputs",
        "cells": cells,
    })
    write("source-rules-projection.json", {
        "identity": rules["source"],
        "tables": [{"id": t["id"], "grid": t["grid"], "rules": t["rules"]}
                   for t in rules["tables"]],
        "general_rules": [r for r in general["rules"] if r["id"] in {
            "G8-relative-preprocessing", "G9-k-plus-one", "G3-G7-earlier-page-context",
            "G-no-last-digit-guarantee", "I-main-entry-error",
            "I-step-and-difference", "I-linear-correction-and-route",
            "I-interpolation-error-and-admissibility", "I-ready-correction-construction",
            "I-second-excess-digit", "A-exact-five-tie",
            "A-universal-four-figure-cutoff", "A-table-first-mixed-staging",
        }],
        "policy": "Rules only; lesson applicability summaries and previous solved outputs excluded.",
    })
    figure_paths = [
        "ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-55.png",
        "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-55.spec.json",
        "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-55.svg",
        "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-55.review.json",
        ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n39-fig55-review/fig-55-640.png",
        ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n39-fig55-review/fig-55.render-approved-FIRST.json",
    ]
    inputs += [{"path": p, "sha256": sha(ROOT / p)} for p in figure_paths]
    inputs += read(OWN / "seed.json")["trace"]
    write("input-hashes.json", {
        "cwd": str(ROOT),
        "branch": subprocess.check_output(
            ["git", "branch", "--show-current"], cwd=ROOT, text=True).strip(),
        "head": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
        "inputs": inputs,
        "successful_image_loads": 2,
        "svg_decoder_failure": "unable to process image: invalid or unsupported image data",
        "new_renders": 0, "network": 0,
    })
    print(f"Saved {len(cells)} literal n39 cell records, no computed outputs.")


def freeze():
    names = ["seed.json", "source-solutions.json", "source-solves.md",
             "method-assumptions.json", "image-observations.json",
             "source-cells.json", "source-rules-projection.json", "input-hashes.json"]
    solutions = read(OWN / "source-solutions.json")
    assert sum(s["source_task_count"] for s in solutions["sources"]) == 76
    assert [s["source_number"] for s in solutions["sources"]] == [
        str(n) for n in range(806, 820)]
    assert not (OWN / "author-items.json").exists()
    assert not (OWN / "draft.json").exists()
    write("solve-freeze.json", {
        "stage": "independent-full-source-solve-before-options",
        "frozen_at": datetime.now(timezone.utc).isoformat(),
        "seed_sha256": digest(read(OWN / "seed.json")),
        "source_originals": 14, "source_tasks": 76,
        "options_present": False,
        "files": [{"path": str(REL / name), "sha256": sha(OWN / name),
                   "canonical_sha256": digest(read(OWN / name)) if name.endswith(".json") else None}
                  for name in names],
        "approval": "none; author freeze only",
    })
    print("Frozen full independent solutions: 14 originals / 76 source tasks.")


def validate():
    run("structural-validation-FIRST.json", [
        sys.executable, str(CHOICE / "validate.py"), "--repo", ".",
        "--seed", str(REL / "seed.json"), "--draft", str(REL / "draft.json"),
    ])


if __name__ == "__main__":
    {"sources": sources, "freeze": freeze, "validate": validate}[sys.argv[1]]()
