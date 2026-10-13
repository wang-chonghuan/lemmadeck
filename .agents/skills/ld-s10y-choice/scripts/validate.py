#!/usr/bin/env python3
"""Mechanical artifact checks. These do not prove mathematics or task fidelity."""

import argparse
import json
from pathlib import Path
import re
import sys

from prepare import (ARTIFACTS, ContractError, digest, file_hash, inside, load_json,
                     prepare_seed, require, scratch_path, text, unique)

DRAFT_SCHEMA = "s10y-choice-draft-v1"
REVIEW_SCHEMA = "s10y-choice-review-v1"
VERDICTS = {"pass", "revise", "blocked"}


def fields(value, names, where):
    require(isinstance(value, dict) and set(value) == set(names.split()), f"{where}: wrong fields")


def entries(value, where, nonempty=False):
    require(isinstance(value, list) and (bool(value) or not nonempty), f"{where}: list required")
    return value


def ids(value, where, allowed=None, nonempty=False):
    values = entries(value, where, nonempty)
    for item in values:
        text(item, where)
    unique(values, where)
    if allowed is not None:
        require(set(values) <= set(allowed), f"{where}: unknown reference")
    return set(values)


def prose_list(value, where):
    for item in entries(value, where):
        text(item, where)


def keyed(value, key, names, where, expected=None):
    result = {}
    for item in entries(value, where):
        fields(item, names, where)
        identity = item[key]
        text(identity, f"{where}.{key}")
        require(identity not in result, f"{where}: duplicate {identity}")
        result[identity] = item
    if expected is not None:
        require(set(result) == set(expected), f"{where}: incomplete or extra records")
    return result


def visible_text(value, where):
    text(value, where)
    # Assets have a dedicated field; embedded media/HTML can hide extra inputs.
    require(not re.search(r"!\[|</?[A-Za-z][^>]*>|<!--|(?:https?|file|data):",
                          value, re.IGNORECASE), f"{where}: embedded media/HTML/URL")


def check_seed(seed, repo):
    fields(seed, "schema source exercises concepts figures trace", "seed")
    require(seed["schema"] == "s10y-choice-seed-v1", "seed schema mismatch")
    fields(seed["source"], "book lesson concept_figure_ids", "seed.source")
    exercises = keyed(seed["exercises"], "number", "number text figure_ids", "seed.exercises")
    require(bool(exercises), "empty seed")
    blocks = []
    for concept in entries(seed["concepts"], "seed.concepts"):
        fields(concept, "block text", "seed.concept")
        require(type(concept["block"]) is int, "concept block must be an integer")
        text(concept["text"], "concept text")
        blocks.append(concept["block"])
    source = seed["source"]
    refreshed = prepare_seed(repo, source["book"], source["lesson"], list(exercises),
                             blocks, source["concept_figure_ids"])
    require(seed == refreshed, "seed projection/source/asset changed; prepare again")
    return exercises, {figure["id"]: figure for figure in seed["figures"]}, set(blocks)


def question_figures(question, exercises):
    return set(question["view"]["figure_ids"]) | \
        {ref for option in question["view"]["options"] for ref in option["figure_ids"]} | \
        {ref for number in question["source_numbers"] for ref in exercises[number]["figure_ids"]}


def draft_figures(seed, draft, repo, source_figures):
    registered = keyed(draft["new_figures"], "id", "id path sha256 basis", "new_figures")
    require(not (set(registered) & set(source_figures)), "new figure ID collides with seed figure")
    figures = dict(source_figures)
    for figure_id, figure in registered.items():
        path_text = text(figure["path"], "new figure path")
        path = Path(path_text)
        require(not path.is_absolute() and ".." not in path.parts, "new figure needs repo-relative path")
        retained_root = Path(repo) / ARTIFACTS / seed["source"]["book"] / \
            "editions/modern-us-neutral/lessons" / seed["source"]["lesson"] / \
            "choice-set/figures"
        resolved = inside(Path(repo) / path, Path(repo))
        if not resolved.is_relative_to(retained_root.resolve()):
            resolved = scratch_path(path, repo)
        require(resolved.suffix.lower() in {".png", ".svg", ".jpg", ".jpeg", ".webp"},
                "new figure must be an image file")
        require(figure["sha256"] == file_hash(resolved), "new figure file/hash mismatch")
        text(figure["basis"], "new figure mathematical basis")
        figures[figure_id] = {"assets": [{"path": path_text, "sha256": figure["sha256"]}]}
    return figures


def check_draft(seed, draft, repo, exercises, source_figures, blocks):
    fields(draft, "schema seed_sha256 new_figures questions coverage", "draft")
    require(draft["schema"] == DRAFT_SCHEMA, "draft schema mismatch")
    require(draft["seed_sha256"] == digest(seed), "draft seed snapshot mismatch")
    figures = draft_figures(seed, draft, repo, source_figures)
    questions = keyed(draft["questions"], "id", "id source_numbers view intent key", "questions")
    require(bool(questions), "empty question draft; report a blocker instead")
    for question_id, question in questions.items():
        ids(question["source_numbers"], "source_numbers", exercises, True)
        view = question["view"]
        fields(view, "mode stem figure_ids options", f"{question_id}.view")
        require(view["mode"] in {"single", "multiple"}, "native single/multiple mode required")
        visible_text(view["stem"], "stem")
        ids(view["figure_ids"], "view.figure_ids", figures)
        options = keyed(view["options"], "id", "id text figure_ids", "options")
        require(len(options) >= 2, "at least two options required")
        signatures = []
        for option in options.values():
            visible_text(option["text"], "option.text")
            ids(option["figure_ids"], "option.figure_ids", figures)
            signatures.append(digest({"text": option["text"].strip(),
                                      "figures": sorted(option["figure_ids"])}))
        unique(signatures, "identical visible options")
        intent = question["intent"]
        fields(intent, "task source_solution unit_reason concept_blocks limitations figure_observations",
               "intent")
        for name in ("task", "source_solution", "unit_reason"):
            text(intent[name], f"intent.{name}")
        selected = entries(intent["concept_blocks"], "intent.concept_blocks")
        require(all(type(block) is int for block in selected), "integer concept blocks required")
        unique(selected, "intent.concept_blocks")
        require(set(selected) <= blocks, "unselected concept block")
        prose_list(intent["limitations"], "intent.limitations")
        observations = keyed(intent["figure_observations"], "figure_id",
                             "figure_id observation", "figure_observations",
                             question_figures(question, exercises))
        for observation in observations.values():
            text(observation["observation"], "figure observation")
        key = question["key"]
        fields(key, "correct rationales", "key")
        correct = ids(key["correct"], "key.correct", options, True)
        require(view["mode"] != "single" or len(correct) == 1, "single must have one correct option")
        rationales = keyed(key["rationales"], "option_id",
                           "option_id truth derivation misconception", "rationales", options)
        for option_id, rationale in rationales.items():
            truth = "correct" if option_id in correct else "incorrect"
            require(rationale["truth"] == truth, "rationale/key truth mismatch")
            text(rationale["derivation"], "rationale.derivation")
            if truth == "correct":
                require(rationale["misconception"] is None, "correct option needs null misconception")
            else:
                text(rationale["misconception"], "incorrect option misconception")
    coverage = keyed(draft["coverage"], "source_number",
                     "source_number question_ids omitted_tasks reason", "coverage", exercises)
    for number, row in coverage.items():
        actual = {qid for qid, question in questions.items() if number in question["source_numbers"]}
        require(ids(row["question_ids"], "coverage.question_ids", questions) == actual,
                "coverage/source relationship mismatch")
        prose_list(row["omitted_tasks"], "coverage.omitted_tasks")
        text(row["reason"], "coverage.reason")
        require(bool(actual) or bool(row["omitted_tasks"]), "deferred source needs explicit omissions")
    return questions, figures


def verdict(value, where):
    require(value in VERDICTS, f"{where}: unknown verdict")
    return value


def check_review(seed, draft, review, exercises, figures, questions):
    fields(review, "schema seed_sha256 draft_sha256 reviewer source_reviews figure_checks "
           "new_figure_reviews question_reviews outcome", "review")
    require(review["schema"] == REVIEW_SCHEMA, "review schema mismatch")
    require(review["seed_sha256"] == digest(seed), "review seed snapshot mismatch")
    require(review["draft_sha256"] == digest(draft), "review draft snapshot mismatch")
    fields(review["reviewer"], "kind identity", "reviewer")
    require(review["reviewer"]["kind"] in {"independent_agent", "self_review"}, "invalid reviewer kind")
    text(review["reviewer"]["identity"], "reviewer.identity")
    verdicts = []

    def evidence_check(check, where):
        fields(check, "verdict evidence", where)
        verdicts.append(verdict(check["verdict"], where))
        text(check["evidence"], f"{where}.evidence")

    sources = keyed(review["source_reviews"], "source_number",
                    "source_number independent_solution coverage", "source_reviews", exercises)
    for row in sources.values():
        text(row["independent_solution"], "source independent_solution")
        evidence_check(row["coverage"], "source coverage")
    used_figures = set().union(*(question_figures(q, exercises) for q in questions.values()))
    checks = keyed(review["figure_checks"], "figure_id",
                   "figure_id asset_path asset_sha256 observation", "figure_checks", used_figures)
    for figure_id, check in checks.items():
        require({"path": check["asset_path"], "sha256": check["asset_sha256"]}
                in figures[figure_id]["assets"], "review figure asset/hash mismatch")
        text(check["observation"], "review figure observation")
    new_figures = {figure["id"]: figure for figure in draft["new_figures"]}
    new_reviews = keyed(review["new_figure_reviews"], "figure_id",
                        "figure_id asset_sha256 reviewer verdict evidence",
                        "new_figure_reviews", new_figures)
    for figure_id, row in new_reviews.items():
        require(row["asset_sha256"] == new_figures[figure_id]["sha256"],
                "new figure review/hash mismatch")
        fields(row["reviewer"], "kind identity", "new figure reviewer")
        require(row["reviewer"]["kind"] == "independent_agent",
                "new figures need a genuinely independent figure reviewer")
        text(row["reviewer"]["identity"], "new figure reviewer.identity")
        verdicts.append(verdict(row["verdict"], "new figure verdict"))
        text(row["evidence"], "new figure review evidence")
    rows = keyed(review["question_reviews"], "question_id",
                 "question_id task_fidelity redundancy answer_leakage mathematics",
                 "question_reviews", questions)
    for question_id, row in rows.items():
        for name in ("task_fidelity", "redundancy", "answer_leakage"):
            evidence_check(row[name], name)
        math = row["mathematics"]
        fields(math, "verdict independent_solution correct option_checks", "mathematics")
        status = verdict(math["verdict"], "mathematics")
        verdicts.append(status)
        if status == "blocked" and math["correct"] is None:
            require(math["option_checks"] == [], "unresolved math must not pretend to check options")
            text(math["independent_solution"], "mathematics blocker")
            continue
        text(math["independent_solution"], "mathematics.independent_solution")
        question = questions[question_id]
        options = {option["id"] for option in question["view"]["options"]}
        correct = ids(math["correct"], "review correct set", options)
        option_checks = keyed(math["option_checks"], "option_id",
                              "option_id truth evidence", "option_checks", options)
        for option_id, check in option_checks.items():
            require(check["truth"] == ("correct" if option_id in correct else "incorrect"),
                    "independent option truth/set mismatch")
            text(check["evidence"], "option check evidence")
        if status == "pass":
            require(correct == set(question["key"]["correct"]), "passing math disagrees with draft key")
    outcome = "blocked" if "blocked" in verdicts else "revise" if "revise" in verdicts else "pass"
    require(review["outcome"] == outcome, "review outcome disagrees with check verdicts")
    return outcome


def validate(repo, seed, draft, review=None):
    exercises, figures, blocks = check_seed(seed, repo)
    questions, figures = check_draft(seed, draft, repo, exercises, figures, blocks)
    return check_review(seed, draft, review, exercises, figures, questions) if review is not None else None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--seed", required=True)
    parser.add_argument("--draft", required=True)
    parser.add_argument("--review")
    args = parser.parse_args()
    try:
        outcome = validate(args.repo, load_json(args.seed), load_json(args.draft),
                           load_json(args.review) if args.review else None)
        if outcome and outcome != "pass":
            print(f"mechanical checks passed; semantic review outcome: {outcome}", file=sys.stderr)
            return 3
        print("mechanical checks passed; " +
              ("declared semantic review: pass (not automatically proved)" if outcome else
               "semantic review still required"))
        return 0
    except (ContractError, OSError, KeyError, TypeError, IndexError, json.JSONDecodeError) as error:
        print(f"contract error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
