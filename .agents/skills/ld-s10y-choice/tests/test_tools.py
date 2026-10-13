#!/usr/bin/env python3
"""New synthetic fixtures for whitelist and contract behavior, not math proof."""

import argparse
from copy import deepcopy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))
from prepare import (ARTIFACTS, ContractError, digest, inventory, load_json,
                     prepare_seed, scratch_path, write_seed)
from validate import validate

SCRATCH = None


def store(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=True), encoding="utf-8")


class ToolTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=SCRATCH)
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.book = self.repo / ARTIFACTS / "sample"
        self.lesson = self.book / "editions/modern-us-neutral/lessons/unit-a"
        self.lesson.mkdir(parents=True)
        self.image = self.lesson.parent.parent / "figures/diagram.svg"
        self.image.parent.mkdir()
        self.image.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40">'
                              '<text x="5" y="25">A: 1 to 2</text></svg>', encoding="utf-8")
        poison = {"part": [{"expected": "DO-NOT-PROJECT"}],
                  "answer": "DO-NOT-PROJECT", "metadata": {"secret": "DO-NOT-PROJECT"}}
        store(self.book / "book.json", {"lessons": [{"id": "unit-a", **poison}], **poison})
        store(self.lesson / "lesson.json", {"id": "unit-a", "prose": [
            {"kind": "p", "text": "A function gives each input a unique output.", **poison},
            {"kind": "fig", "id": "diagram", "text": ""},
            {"kind": "p", "text": "Example solution, not a definition.", **poison}], **poison})
        store(self.lesson / "exercises.json", {"exercises": [
            {"number": "1", "text": "Which displayed relations are functions?",
             "figure_refs": ["diagram"], "figures": [{"id": "diagram", **poison}], **poison},
            {"number": "2", "text": "Compute 2 times 3.", "figure_refs": [], **poison},
            {"number": "3", "text": "Draw the graph yourself.", "figure_refs": [], **poison}],
            **poison})
        store(self.lesson / "figures.json", {"figures": [{
            "id": "diagram", "label": "Diagram", "source": {
                "svg": {"path": "figures/diagram.svg", **poison}},
            "svg": "figures/diagram.svg", "spec": "must-not-open.json", **poison}], **poison})
        self.seed = prepare_seed(self.repo, "sample", "unit-a", ["1", "2", "3"], [0], [])
        self.draft = {
            "schema": "s10y-choice-draft-v1", "seed_sha256": digest(self.seed),
            "new_figures": [],
            "questions": [self.question("relations", ["1"]), self.question("product", ["2"])],
            "coverage": [
                {"source_number": "1", "question_ids": ["relations"], "omitted_tasks": [],
                 "reason": "The entire diagram collection is judged as one unit."},
                {"source_number": "2", "question_ids": ["product"], "omitted_tasks": [],
                 "reason": "This arithmetic problem is independent of the diagram task."},
                {"source_number": "3", "question_ids": [],
                 "omitted_tasks": ["Producing a graph remains unassessed."],
                 "reason": "No supported choice unit is being supplied for production."}]}
        self.review = self.make_review()

    def question(self, identity, sources):
        is_diagram = "1" in sources
        options = [{"id": "A", "text": "Relation A" if is_diagram else "6", "figure_ids": []},
                   {"id": "B", "text": "Relation B" if is_diagram else "5", "figure_ids": []}]
        return {
            "id": identity, "source_numbers": sources,
            "view": {"mode": "multiple" if is_diagram else "single",
                     "stem": "Select every function." if is_diagram else "What is $2\\times3$?",
                     "figure_ids": ["diagram"] if is_diagram else [], "options": options},
            "intent": {
                "task": "Classify the collection." if is_diagram else "Compute the complete product.",
                "source_solution": "A has one image per input; B has two." if is_diagram else "2*3=6.",
                "unit_reason": "A collective judgement uses one exact set." if is_diagram else
                               "The product is an independent complete result.",
                "concept_blocks": [0] if is_diagram else [], "limitations": [],
                "figure_observations": [{"figure_id": "diagram",
                                        "observation": "The image labels A: 1 to 2."}]
                if is_diagram else []},
            "key": {"correct": ["A"], "rationales": [
                {"option_id": "A", "truth": "correct", "derivation": "One output." if is_diagram
                 else "2+2+2=6.", "misconception": None},
                {"option_id": "B", "truth": "incorrect", "derivation": "Two outputs." if is_diagram
                 else "Replacing multiplication with addition gives 2+3=5.",
                 "misconception": "Allowing more than one image." if is_diagram else
                                 "Using addition in place of multiplication."}]}}

    def make_review(self):
        asset = self.seed["figures"][0]["assets"][0]
        return {
            "schema": "s10y-choice-review-v1", "seed_sha256": digest(self.seed),
            "draft_sha256": digest(self.draft),
            "reviewer": {"kind": "self_review", "identity": "Synthetic contract test, not math evidence"},
            "source_reviews": [
                {"source_number": row["number"], "independent_solution": "Synthetic test reasoning.",
                 "coverage": {"verdict": "pass", "evidence": "Explicit source coverage record."}}
                for row in self.seed["exercises"]],
            "new_figure_reviews": [],
            "figure_checks": [{"figure_id": "diagram", "asset_path": asset["path"],
                               "asset_sha256": asset["sha256"],
                               "observation": "Synthetic image label checked in test."}],
            "question_reviews": [
                {"question_id": q["id"],
                 "task_fidelity": {"verdict": "pass", "evidence": "Complete synthetic unit retained."},
                 "redundancy": {"verdict": "pass", "evidence": "Each source serves a distinct unit."},
                 "answer_leakage": {"verdict": "pass", "evidence": "No synthetic cue asserted."},
                 "mathematics": {"verdict": "pass", "independent_solution": "Synthetic derivation.",
                                 "correct": ["A"], "option_checks": [
                                     {"option_id": "A", "truth": "correct", "evidence": "Synthetic A."},
                                     {"option_id": "B", "truth": "incorrect", "evidence": "Synthetic B."}]}}
                for q in self.draft["questions"]], "outcome": "pass"}

    def check(self, review=False):
        return validate(self.repo, self.seed, self.draft, self.review if review else None)

    def test_whitelist_drops_nested_metadata_and_unselected_prose(self):
        self.assertNotIn("DO-NOT-PROJECT", json.dumps(self.seed))
        self.assertNotIn("Example solution", json.dumps(self.seed))
        self.assertNotIn("spec", json.dumps(self.seed))
        self.assertEqual(len(self.seed["figures"][0]["assets"]), 1)
        self.assertEqual([item["block"] for item in self.seed["concepts"]], [0])

    def test_only_four_json_sources_and_referenced_image_are_read(self):
        opened = []
        original_text, original_bytes = Path.read_text, Path.read_bytes

        def read_text(path, *args, **kwargs):
            opened.append(path.resolve())
            return original_text(path, *args, **kwargs)

        def read_bytes(path, *args, **kwargs):
            opened.append(path.resolve())
            return original_bytes(path, *args, **kwargs)

        with patch.object(Path, "read_text", read_text), patch.object(Path, "read_bytes", read_bytes):
            prepare_seed(self.repo, "sample", "unit-a", ["1"], [0], [])
        allowed = {self.book / "book.json", self.lesson / "lesson.json",
                   self.lesson / "exercises.json", self.lesson / "figures.json", self.image}
        self.assertEqual(set(opened), allowed)

    def test_inspect_is_also_projected(self):
        projected = inventory(self.repo, "sample", "unit-a")
        self.assertNotIn("DO-NOT-PROJECT", json.dumps(projected))
        self.assertEqual([c["block"] for c in projected["concept_candidates"]], [0, 2])

    def test_missing_or_nonprose_concept_is_rejected(self):
        for block in (1, 20, -1):
            with self.subTest(block=block), self.assertRaises(ContractError):
                prepare_seed(self.repo, "sample", "unit-a", ["2"], [block], [])

    def test_unknown_duplicate_and_empty_exercises_rejected(self):
        for numbers in (["9"], ["1", "1"], []):
            with self.subTest(numbers=numbers), self.assertRaises(ContractError):
                prepare_seed(self.repo, "sample", "unit-a", numbers, [], [])

    def test_path_traversal_rejected(self):
        with self.assertRaises(ContractError):
            prepare_seed(self.repo, "../sample", "unit-a", ["1"], [], [])

    def test_missing_asset_rejected(self):
        self.image.unlink()
        with self.assertRaises(OSError):
            prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])

    def test_paths_are_edition_relative_not_lesson_relative(self):
        self.assertEqual(self.seed["figures"][0]["assets"][0]["path"],
                         self.image.relative_to(self.repo).as_posix())
        decoy = self.lesson / "figures/diagram.svg"
        decoy.parent.mkdir()
        decoy.write_text("wrong lesson-relative asset", encoding="utf-8")
        projected = prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])
        self.assertEqual(projected["figures"], self.seed["figures"])

    def test_missing_historical_png_does_not_replace_final_svg(self):
        path = self.lesson / "figures.json"
        data = load_json(path)
        data["figures"][0]["source"]["png"] = {"path": "figures/historical.png"}
        store(path, data)
        seed = prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])
        self.assertEqual(seed["figures"], self.seed["figures"])

    def test_missing_declared_final_asset_cannot_fall_back_to_source(self):
        path = self.lesson / "figures.json"
        data = load_json(path)
        data["figures"][0]["svg"] = "figures/missing-final.svg"
        store(path, data)
        with self.assertRaises(OSError):
            prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])

    def test_source_only_assets_use_existing_representations(self):
        path = self.lesson / "figures.json"
        data = load_json(path)
        del data["figures"][0]["svg"]
        data["figures"][0]["source"]["png"] = {"path": "figures/absent-source.png"}
        store(path, data)
        seed = prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])
        self.assertEqual(seed["figures"], self.seed["figures"])
        self.image.unlink()
        with self.assertRaises(ContractError):
            prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])

    def test_asset_symlink_escape_rejected(self):
        target = self.repo / "outside.svg"
        target.write_text("outside", encoding="utf-8")
        self.image.unlink()
        self.image.symlink_to(target)
        with self.assertRaises(ContractError):
            prepare_seed(self.repo, "sample", "unit-a", ["1"], [], [])

    def test_only_scratch_output_and_no_overwrite(self):
        allowed = ".intentfold/tickets/SAMPLE-1/tmp/seed.json"
        write_seed(allowed, self.seed, self.repo)
        with self.assertRaises(FileExistsError):
            write_seed(allowed, self.seed, self.repo)
        with self.assertRaises(ContractError):
            write_seed("ssot-resources/seed.json", self.seed, self.repo)
        escaped = self.repo / ".tmp/link"
        escaped.parent.mkdir()
        escaped.symlink_to(self.book, target_is_directory=True)
        with self.assertRaises(ContractError):
            write_seed(".tmp/link/seed.json", self.seed, self.repo)

    def test_unknown_seed_field_and_stale_source_rejected(self):
        changed = deepcopy(self.seed)
        changed["metadata"] = {}
        with self.assertRaises(ContractError):
            validate(self.repo, changed, self.draft)
        self.image.write_text("changed asset", encoding="utf-8")
        with self.assertRaises(ContractError):
            self.check()

    def test_duplicate_json_keys_and_nonfinite_numbers_rejected(self):
        path = self.repo / "bad.json"
        for value in ('{"x":1,"x":2}', '{"x":NaN}', '{"x":Infinity}'):
            path.write_text(value, encoding="utf-8")
            with self.subTest(value=value), self.assertRaises(ContractError):
                load_json(path)

    def test_single_multiple_and_explicit_defer_are_valid(self):
        self.assertIsNone(self.check())
        self.assertEqual(self.check(review=True), "pass")

    def test_many_to_many_relationship_not_one_question_per_source(self):
        questions = self.draft["questions"]
        questions[0]["source_numbers"] = ["1", "2"]
        self.draft["coverage"][1]["question_ids"] = ["relations", "product", "second-product"]
        questions.append(self.question("second-product", ["2"]))
        self.assertIsNone(self.check())

    def test_missing_source_or_coverage_links_rejected(self):
        for mutate in (
            lambda d: d["coverage"].pop(),
            lambda d: d["coverage"][0].update(question_ids=[]),
            lambda d: d["questions"][0].update(source_numbers=["9"]),
            lambda d: d["coverage"][2].update(omitted_tasks=[]),
        ):
            draft = deepcopy(self.draft)
            mutate(draft)
            with self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_single_cardinality_and_invalid_correct_sets_rejected(self):
        for correct in ([], ["A", "A"], ["X"], ["A", "B"]):
            draft = deepcopy(self.draft)
            draft["questions"][1]["key"]["correct"] = correct
            with self.subTest(correct=correct), self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_multiple_can_have_more_than_one_correct(self):
        key = self.draft["questions"][0]["key"]
        key["correct"] = ["B", "A"]
        key["rationales"][1].update(truth="correct", misconception=None)
        self.assertIsNone(self.check())

    def test_rationale_coverage_truth_and_misconception_required(self):
        for mutate in (
            lambda k: k["rationales"].pop(),
            lambda k: k["rationales"][1].update(truth="correct"),
            lambda k: k["rationales"][1].update(misconception=None),
            lambda k: k["rationales"][0].update(misconception="unnecessary"),
        ):
            draft = deepcopy(self.draft)
            mutate(draft["questions"][0]["key"])
            with self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_unknown_or_unobserved_figure_rejected(self):
        for mutate in (
            lambda q: q["view"].update(figure_ids=["unknown"]),
            lambda q: q["intent"].update(figure_observations=[]),
        ):
            draft = deepcopy(self.draft)
            mutate(draft["questions"][0])
            with self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_extra_app_payload_field_rejected(self):
        self.draft["questions"][0]["view"]["correct_index"] = 0
        with self.assertRaises(ContractError):
            self.check()

    def add_new_figure(self):
        output = self.repo / ".intentfold/tickets/SAMPLE-1/tmp/candidate.svg"
        output.parent.mkdir(parents=True)
        output.write_bytes(self.image.read_bytes())
        self.draft["new_figures"] = [{
            "id": "candidate", "path": output.relative_to(self.repo).as_posix(),
            "sha256": self.seed["figures"][0]["assets"][0]["sha256"],
            "basis": "The new diagram deliberately shows input 1 with output 2."}]
        self.draft["questions"][0]["view"]["options"][0]["figure_ids"] = ["candidate"]
        self.draft["questions"][0]["intent"]["figure_observations"].append({
            "figure_id": "candidate", "observation": "The candidate labels A: 1 to 2."})
        self.review["draft_sha256"] = digest(self.draft)
        self.review["figure_checks"].append({
            "figure_id": "candidate", "asset_path": self.draft["new_figures"][0]["path"],
            "asset_sha256": self.draft["new_figures"][0]["sha256"],
            "observation": "The registered candidate label is visible."})
        self.review["new_figure_reviews"] = [{
            "figure_id": "candidate", "asset_sha256": self.draft["new_figures"][0]["sha256"],
            "reviewer": {"kind": "independent_agent", "identity": "Synthetic second reviewer"},
            "verdict": "pass", "evidence": "Synthetic rendered relationship matches the basis."}]
        return output

    def test_new_figures_are_separate_and_referenceable(self):
        before = deepcopy(self.seed)
        self.add_new_figure()
        self.assertEqual(self.check(review=True), "pass")
        self.assertEqual(self.seed, before)

    def test_retained_handoff_figures_are_lesson_scoped_and_hash_bound(self):
        output = self.add_new_figure()
        retained = self.lesson / "choice-set/figures/candidate.svg"
        retained.parent.mkdir(parents=True)
        retained.write_bytes(output.read_bytes())
        figure = self.draft["new_figures"][0]
        figure["path"] = retained.relative_to(self.repo).as_posix()
        self.review["draft_sha256"] = digest(self.draft)
        self.review["figure_checks"][-1]["asset_path"] = figure["path"]
        self.assertEqual(self.check(review=True), "pass")
        retained.write_text("changed", encoding="utf-8")
        with self.assertRaises(ContractError):
            self.check()
        for target in (self.lesson / "choice-set/other.svg",
                       self.lesson.parent / "unit-b/choice-set/figures/candidate.svg"):
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(output.read_bytes())
            figure["path"] = target.relative_to(self.repo).as_posix()
            with self.assertRaises(ContractError):
                self.check()

    def test_new_figure_path_hash_collision_and_basis_rejected(self):
        self.add_new_figure()
        for change in (
            {"id": "diagram"}, {"path": str(self.image)}, {"path": "../candidate.svg"},
            {"path": self.image.relative_to(self.repo).as_posix()}, {"sha256": "old"},
            {"basis": ""},
        ):
            draft = deepcopy(self.draft)
            draft["new_figures"][0].update(change)
            with self.subTest(change=change), self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_new_figure_missing_changed_and_symlink_escape_rejected(self):
        output = self.add_new_figure()
        output.write_text("changed", encoding="utf-8")
        with self.assertRaises(ContractError):
            self.check()
        output.unlink()
        with self.assertRaises(OSError):
            self.check()
        output.symlink_to(self.image)
        with self.assertRaises(ContractError):
            self.check()

    def test_new_figure_review_must_be_independent_complete_and_hash_bound(self):
        self.add_new_figure()
        for change in (
            {"asset_sha256": "old"},
            {"reviewer": {"kind": "self_review", "identity": "Author"}},
            {"evidence": ""},
        ):
            review = deepcopy(self.review)
            review["new_figure_reviews"][0].update(change)
            with self.subTest(change=change), self.assertRaises(ContractError):
                validate(self.repo, self.seed, self.draft, review)
        self.review["new_figure_reviews"] = []
        with self.assertRaises(ContractError):
            self.check(review=True)

    def test_failed_new_figure_review_blocks_handoff(self):
        self.add_new_figure()
        self.review["new_figure_reviews"][0]["verdict"] = "revise"
        self.review["outcome"] = "revise"
        self.assertEqual(self.check(review=True), "revise")

    def test_exact_duplicate_options_rejected(self):
        self.draft["questions"][0]["view"]["options"][1]["text"] = "Relation A"
        with self.assertRaises(ContractError):
            self.check()

    def test_inequalities_allowed_but_html_and_embeds_rejected(self):
        self.draft["questions"][1]["view"]["stem"] = "Choose the solution of $2<x\\le5$."
        self.assertIsNone(self.check())
        for body in ('<img src="answer.svg">', '![hidden](x.svg)', 'https://example.org',
                     '<script>key</script>', '<!-- hidden -->'):
            draft = deepcopy(self.draft)
            draft["questions"][1]["view"]["stem"] = body
            with self.subTest(body=body), self.assertRaises(ContractError):
                validate(self.repo, self.seed, draft)

    def test_review_snapshot_and_complete_records_required(self):
        for mutate in (
            lambda r: r.update(draft_sha256="stale"),
            lambda r: r["question_reviews"].pop(),
            lambda r: r["source_reviews"].pop(),
            lambda r: r["figure_checks"][0].update(asset_sha256="stale"),
            lambda r: r["question_reviews"][0]["mathematics"]["option_checks"].pop(),
            lambda r: r["question_reviews"][0]["task_fidelity"].update(evidence=""),
        ):
            review = deepcopy(self.review)
            mutate(review)
            with self.assertRaises(ContractError):
                validate(self.repo, self.seed, self.draft, review)
        with self.assertRaises(ContractError):
            validate(self.repo, self.seed, self.draft, {})

    def test_changed_draft_invalidates_prior_review(self):
        self.draft["questions"][1]["view"]["stem"] += " Give the final result."
        with self.assertRaises(ContractError):
            self.check(review=True)

    def test_failed_review_preserves_disagreement(self):
        math = self.review["question_reviews"][0]["mathematics"]
        math.update(verdict="revise", correct=["B"])
        math["option_checks"][0]["truth"] = "incorrect"
        math["option_checks"][1]["truth"] = "correct"
        self.review["outcome"] = "revise"
        self.assertEqual(self.check(review=True), "revise")
        math["verdict"] = "pass"
        self.review["outcome"] = "pass"
        with self.assertRaises(ContractError):
            self.check(review=True)

    def test_blocked_review_has_no_guessed_key(self):
        math = self.review["question_reviews"][0]["mathematics"]
        math.update(verdict="blocked", independent_solution="The diagram is unreadable.",
                    correct=None, option_checks=[])
        self.review["outcome"] = "blocked"
        self.assertEqual(self.check(review=True), "blocked")

    def test_outcome_cannot_silently_override_fidelity_failure(self):
        self.review["question_reviews"][0]["task_fidelity"]["verdict"] = "revise"
        with self.assertRaises(ContractError):
            self.check(review=True)
        self.review["outcome"] = "revise"
        self.assertEqual(self.check(review=True), "revise")

    def test_mechanical_check_does_not_claim_to_prove_mathematics(self):
        q = self.draft["questions"][1]
        q["view"]["options"][0]["text"] = "999"
        q["key"]["rationales"][0]["derivation"] = "An intentionally wrong synthetic derivation."
        self.assertIsNone(self.check())

    def test_cli_output_and_exit_status(self):
        for name, value in (("seed", self.seed), ("draft", self.draft), ("review", self.review)):
            store(self.repo / f"{name}.json", value)
        command = [sys.executable, str(SCRIPTS / "validate.py"), "--repo", str(self.repo),
                   "--seed", str(self.repo / "seed.json"), "--draft", str(self.repo / "draft.json")]
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("semantic review still required", result.stdout)
        self.review["question_reviews"][0]["task_fidelity"]["verdict"] = "revise"
        self.review["outcome"] = "revise"
        store(self.repo / "review.json", self.review)
        result = subprocess.run(command + ["--review", str(self.repo / "review.json")],
                                capture_output=True, text=True)
        self.assertEqual(result.returncode, 3, result.stderr)
        self.assertIn("revise", result.stderr)
        store(self.repo / "draft.json", {})
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 2, result.stderr)

    def test_cli_requires_explicit_concept_selection(self):
        command = [sys.executable, str(SCRIPTS / "prepare.py"), "prepare", "--repo", str(self.repo),
                   "--book", "sample", "--lesson", "unit-a", "--exercise", "2",
                   "--out", ".tmp/result.json"]
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 2)
        result = subprocess.run(command + ["--no-concepts"], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        output = load_json(self.repo / ".tmp/result.json")
        self.assertNotIn("questions", output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scratch", required=True)
    args, remaining = parser.parse_known_args()
    repo_root = Path(__file__).resolve().parents[4]
    SCRATCH = scratch_path(args.scratch, repo_root)
    SCRATCH.mkdir(parents=True, exist_ok=True)
    unittest.main(argv=[sys.argv[0]] + remaining, verbosity=2)
