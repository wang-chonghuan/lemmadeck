"""Focused recovery contracts, not mathematics or content-approval tests."""

import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

import edition
import retain_choices
from production import validate_lesson_owner, validate_output_owner

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / ".agents/skills/ld-s10y-choice/scripts"))
import prepare
import validate


class RecoveryTests(unittest.TestCase):
    def test_wrong_book_and_redirected_outputs_are_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary).resolve()
            book = repo / "6p"
            book.mkdir()
            (book / "book.json").write_text('{"lessons":[{"id":"phy6-s1"}]}')
            with self.assertRaises(ValueError):
                validate_lesson_owner(book, "phy7-c1-s2-n104")
            redirected = repo / "7p"
            redirected.symlink_to(book, target_is_directory=True)
            with self.assertRaises(ValueError):
                validate_output_owner(repo, redirected / "lessons")

    def test_retention_resumes_exact_partial_output_without_overwrite(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary).resolve()
            source = repo / "approved"
            source.mkdir()
            target = repo / prepare.ARTIFACTS / "7p/editions/modern-us-neutral/lessons/sample/choice-set"
            target.mkdir(parents=True)
            documents = {
                "seed.json": {"source": {"book": "7p", "lesson": "sample"}},
                "draft.json": {"new_figures": []},
                "review.json": {"outcome": "pass"},
            }
            for name, value in documents.items():
                (source / name).write_text(json.dumps(value))
            (target / "seed.json").write_bytes((source / "seed.json").read_bytes())
            (target / "seed.json").chmod(0o444)
            with patch.object(retain_choices, "validate_workspace"), \
                 patch.object(retain_choices, "validate_book"), \
                 patch.object(retain_choices.subprocess, "run", return_value=SimpleNamespace(returncode=0)):
                self.assertEqual(retain_choices.retain(repo, "7p", "sample", source), "retained")
                self.assertEqual(retain_choices.retain(repo, "7p", "sample", source), "reused")
                self.assertEqual((target / "seed.json").stat().st_mode & 0o777, 0o444)
                (target / "draft.json").write_text('{"different":true}')
                with self.assertRaises(ValueError):
                    retain_choices.retain(repo, "7p", "sample", source)
                self.assertEqual((target / "draft.json").read_text(), '{"different":true}')

    def test_read_only_output_replaced_without_unlocking_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            output, evidence = root / "lesson.json", root / "approved.json"
            output.write_text('{"status":"draft"}\n', encoding="utf-8")
            output.chmod(0o444)
            evidence.hardlink_to(output)
            edition.dump(output, {"status": "ready"})
            self.assertEqual(json.loads(output.read_text()), {"status": "ready"})
            self.assertEqual(evidence.read_text(), '{"status":"draft"}\n')
            self.assertEqual(evidence.stat().st_mode & 0o777, 0o444)
            self.assertEqual(output.stat().st_mode & 0o777, 0o644)

    def test_unrelated_index_change_preserves_reviewed_seed(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            book = repo / prepare.ARTIFACTS / "7p"
            lesson = book / "editions/modern-us-neutral/lessons/sample"
            lesson.mkdir(parents=True)
            documents = {
                book / "book.json": {"lessons": [{"id": "sample"}]},
                lesson / "lesson.json": {"id": "sample", "prose": []},
                lesson / "exercises.json": {"exercises": [
                    {"number": "1", "text": "Find the sum.", "figure_refs": []},
                ]},
                lesson / "figures.json": {"figures": []},
            }
            for path, document in documents.items():
                path.write_text(json.dumps(document), encoding="utf-8")
            seed = prepare.prepare_seed(repo, "7p", "sample", ["1"], [], [])
            before = json.dumps(seed, sort_keys=True)
            (book / "book.json").write_text(json.dumps({
                "lessons": [{"id": "sample"}, {"id": "unrelated"}],
            }), encoding="utf-8")
            validate.check_seed(seed, repo)
            self.assertEqual(json.dumps(seed, sort_keys=True), before)
            documents[lesson / "exercises.json"]["exercises"][0]["text"] = "Find the difference."
            (lesson / "exercises.json").write_text(
                json.dumps(documents[lesson / "exercises.json"]), encoding="utf-8",
            )
            with self.assertRaises(prepare.ContractError):
                validate.check_seed(seed, repo)

    def test_index_cannot_remove_source_membership(self):
        with tempfile.TemporaryDirectory() as temporary:
            repo = Path(temporary)
            directory = repo / prepare.ARTIFACTS / "7p/editions/modern-us-neutral/lessons/sample"
            directory.mkdir(parents=True)
            (repo / prepare.ARTIFACTS / "7p/book.json").write_text(
                '{"lessons":[]}', encoding="utf-8",
            )
            for name, value in [
                ("lesson", {"id": "sample", "prose": []}),
                ("exercises", {"exercises": []}),
                ("figures", {"figures": []}),
            ]:
                (directory / f"{name}.json").write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaises(prepare.ContractError):
                prepare.prepare_seed(repo, "7p", "sample", ["1"], [], [])


if __name__ == "__main__":
    unittest.main()
