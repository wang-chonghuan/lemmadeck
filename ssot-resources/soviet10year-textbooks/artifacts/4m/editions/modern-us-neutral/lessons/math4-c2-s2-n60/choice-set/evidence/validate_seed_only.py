#!/usr/bin/env python3
"""Bounded structural check; never refresh source prose or claim semantic approval."""

import hashlib
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187")
WORK = ROOT / ".tmp/stemrobin-187/n60/choices"
sys.path.insert(0, str(ROOT / ".agents/skills/ld-s10y-choice/scripts"))

from validate import check_draft, entries, fields, ids, keyed
from prepare import ContractError, digest, load_json, require, text, unique

SEED_CANONICAL = "96fbc8d7a2f6936723f7ccb8b86f0f53ab12a30b706e7531fa717af5dce00f6f"
SEED_BYTES = "d71265fdbd82da2f4be4039fb46f28ded787a1450f8b1bb0ad07df083d1b32c1"
SOLVING_BYTES = "0f4e996d3109a92711be9e52302d32cefd62acc4c43729dad0a9c7f474fd3a0a"
SVG_PATH = (
    "ssot-resources/soviet10year-textbooks/artifacts/4m/"
    "editions/modern-us-neutral/figures/fig-225.svg"
)
SVG_HASH = "f83ab314a783706359555dc7483ed70532415ea5e560b1a2fdcd2aff61486f68"


def byte_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def seed_structure(seed):
    fields(seed, "schema source exercises concepts figures trace", "seed")
    require(seed["schema"] == "s10y-choice-seed-v1", "seed schema mismatch")
    fields(seed["source"], "book lesson concept_figure_ids", "seed.source")
    require(seed["source"] == {
        "book": "4m", "lesson": "math4-c2-s2-n60", "concept_figure_ids": []
    }, "assignment source scope changed")
    exercises = keyed(
        seed["exercises"], "number", "number text figure_ids", "seed.exercises",
        {str(number) for number in range(1009, 1020)}
    )
    figures = keyed(seed["figures"], "id", "id label assets", "seed.figures", {"fig-225"})
    require(figures["fig-225"]["assets"] == [{"path": SVG_PATH, "sha256": SVG_HASH}],
            "seed figure registration changed")
    for figure in figures.values():
        require(figure["label"] is None or isinstance(figure["label"], str),
                "figure label type")
        for asset in entries(figure["assets"], "assets", True):
            fields(asset, "path sha256", "asset")
            require(re.fullmatch(r"[0-9a-f]{64}", asset["sha256"]) is not None,
                    "asset digest syntax")
    for exercise in exercises.values():
        text(exercise["text"], "exercise text")
        ids(exercise["figure_ids"], "exercise figures", figures)
    require(seed["concepts"] and len(seed["concepts"]) == 1, "one concept required")
    for concept in seed["concepts"]:
        fields(concept, "block text", "concept")
        require(type(concept["block"]) is int and concept["block"] == 10,
                "only general rounding block 10 authorized")
        text(concept["text"], "concept text")
    require(len(entries(seed["trace"], "trace")) == 4, "four trace records required")
    for item in seed["trace"]:
        fields(item, "path sha256", "trace item")
        text(item["path"], "trace path")
        require(re.fullmatch(r"[0-9a-f]{64}", item["sha256"]) is not None,
                "trace digest syntax")
    unique([item["path"] for item in seed["trace"]], "trace paths")
    return exercises, figures, {10}


def main():
    require(Path.cwd().resolve() == ROOT, "wrong shell workdir")
    require(byte_hash(WORK / "seed.json") == SEED_BYTES, "seed bytes changed")
    require(byte_hash(WORK / "author-source-solutions.md") == SOLVING_BYTES,
            "pre-option solving snapshot changed")
    seed = load_json(WORK / "seed.json")
    draft = load_json(WORK / "draft.json")
    require(digest(seed) == SEED_CANONICAL, "seed canonical snapshot changed")
    exercises, figures, blocks = seed_structure(seed)
    require(draft.get("new_figures") == [], "new figures not authorized")
    # Reuse the real draft contract without its forbidden source-refresh stage.
    questions, _ = check_draft(seed, draft, ROOT, exercises, figures, blocks)
    modes = [question["view"]["mode"] for question in questions.values()]
    print(json.dumps({
        "status": "structural_checks_succeeded",
        "semantic_review": "not_performed_author_handoff_only",
        "source_refresh": "not_run_forbidden_by_assignment",
        "asset_rehash": "not_repeated_already_compared_once",
        "seed_canonical_sha256": digest(seed),
        "seed_byte_sha256": byte_hash(WORK / "seed.json"),
        "draft_canonical_sha256": digest(draft),
        "draft_byte_sha256": byte_hash(WORK / "draft.json"),
        "frozen_solving_byte_sha256": SOLVING_BYTES,
        "questions": len(questions),
        "single": modes.count("single"),
        "multiple": modes.count("multiple"),
        "options": sum(len(q["view"]["options"]) for q in questions.values()),
        "keyed_true_options": sum(len(q["key"]["correct"]) for q in questions.values()),
        "coverage_sources": list(exercises),
        "new_figures": len(draft["new_figures"])
    }, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ContractError, OSError, ValueError, KeyError, TypeError) as error:
        print(f"STRUCTURAL_FAILURE: {error}", file=sys.stderr)
        sys.exit(2)
