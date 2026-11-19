#!/usr/bin/env python3
"""Run the existing structural validator against only the authorized projection."""

import argparse
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181/tmp"
OUT = T / "d885-n87-first-choice-author"
sys.path.insert(0, str(R / ".agents/skills/ld-s10y-choice/scripts"))

import prepare
import validate as checker


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--locale", choices=("zh", "en"), required=True)
    args = parser.parse_args()
    locale = args.locale
    repo = T / f"d884-n87-first-choice-preparation/{locale}/source"
    seed_path = repo / ".intentfold/tickets/STEMROBIN-181/tmp/seed.json"
    lesson_relative = prepare.ARTIFACTS / "10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87"
    relative_paths = [lesson_relative / name for name in ("lesson.json", "exercises.json", "figures.json")]
    seed = prepare.load_json(seed_path)
    draft = prepare.load_json(OUT / locale / "draft.json")
    retained_seed = prepare.load_json(OUT / locale / "seed.json")
    prepare.require(seed == retained_seed, "retained seed differs from authorized preparation seed")
    prepare.require(Path.cwd().resolve() == R, "explicit workdir is not the sole authorized repository")

    def refresh_without_index(selected_repo, book, lesson, numbers, blocks, concept_figures):
        prepare.require(Path(selected_repo).resolve() == repo.resolve(), "wrong projected source root")
        prepare.require((book, lesson) == ("10p", "phy10-c2-s3-n87"), "wrong source identity")
        prepare.require(numbers == ["1", "2", "3", "4", "5", "6"], "source IDs must be exactly 1..6")
        prepare.require(blocks == [1, 6, 11, 12, 14, 16, 17, 20, 21], "wrong concept selection")
        prepare.require(concept_figures == [], "no selected figures authorized")
        data = [prepare.load_json(repo / relative) for relative in relative_paths]
        prepare.require(data[0].get("id") == lesson, "projected lesson identity mismatch")
        prepare.require(data[1].get("lesson") == lesson, "projected exercises identity mismatch")
        prepare.require(data[2].get("lesson") == lesson, "projected figures identity mismatch")
        exercises = [prepare.exercise_projection(item) for item in data[1]["exercises"]]
        prepare.unique([item["number"] for item in exercises], "source exercise numbers")
        by_number = {item["number"]: item for item in exercises}
        selected_exercises = [by_number[number] for number in numbers]
        prepare.require(all(item["figure_ids"] == [] for item in selected_exercises), "unexpected source figure")
        concepts = []
        for index in blocks:
            block = data[0]["prose"][index]
            prepare.require(block.get("kind") == "p", f"concept block {index} is not prose")
            concepts.append({"block": index, "text": prepare.text(block["text"], f"prose[{index}]")})
        figure_ids = [prepare.text(item["id"], "figure id") for item in data[2]["figures"]]
        prepare.unique(figure_ids, "source manifest figure IDs")
        book_relative = (prepare.ARTIFACTS / book / "book.json").as_posix()
        book_entries = [entry for entry in seed["trace"] if entry["path"] == book_relative]
        prepare.require(len(book_entries) == 1, "missing original index provenance")
        # Preserve the preparation's provenance; do not read or fabricate an index.
        trace = [dict(book_entries[0])] + [
            {"path": relative.as_posix(), "sha256": prepare.file_hash(repo / relative)}
            for relative in relative_paths
        ]
        return {
            "schema": prepare.SEED_SCHEMA,
            "source": {"book": book, "lesson": lesson, "concept_figure_ids": []},
            "exercises": selected_exercises,
            "concepts": concepts,
            "figures": [],
            "trace": trace,
        }

    # Only source refresh is bounded; draft fields/references/keys use the skill's
    # unchanged structural checks. This is not full index-validating CLI evidence.
    checker.prepare_seed = refresh_without_index
    outcome = checker.validate(repo, seed, draft)
    prepare.require(outcome is None, "semantic review must not run")
    print(json.dumps({
        "schema": "d885-n87-projected-structural-result-v1",
        "locale": locale,
        "mechanical_checks": "pass",
        "seed_path": str(seed_path),
        "source_root": str(repo),
        "draft_path": str(OUT / locale / "draft.json"),
        "seed_sha256": prepare.digest(seed),
        "draft_sha256": prepare.digest(draft),
        "source_files_rehashed": [relative.as_posix() for relative in relative_paths],
        "projection_verified": "full selected written prose, exact concept blocks, source JSON hashes, empty selected figures",
        "existing_checker": str(R / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
        "checker_scope": "unchanged seed shape/comparison and draft structural checks, with explicitly bounded three-file source refresh",
        "index_read": False,
        "index_membership_verified": False,
        "index_hash_status": "preparation provenance retained only; not refreshed or independently verified",
        "semantic_review": "pending; not executed",
        "semantic_approval": False,
        "native_finalization": "pending; text-only exact approved draft projection",
        "question_count": len(draft["questions"]),
        "option_count": sum(len(question["view"]["options"]) for question in draft["questions"]),
        "new_figures": [],
    }, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    try:
        main()
    except (prepare.ContractError, OSError, KeyError, TypeError, IndexError, json.JSONDecodeError) as error:
        print(f"contract error: {error}", file=sys.stderr)
        sys.exit(2)
