import json
import tempfile
import unittest
from pathlib import Path

from prepare import ARTIFACTS, ContractError, prepare_seed, source_files
from validate import check_seed


class EditionSourceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name)
        self.base = self.repo / ARTIFACTS / "10p"
        self.base.mkdir(parents=True)
        (self.base / "book.json").write_text(json.dumps({"lessons": [{"id": "sample"}]}))
        for edition, body in (
            ("modern-us-neutral", "Chinese edition source"),
            ("modern-us-neutral-en", "English edition source"),
        ):
            target = self.base / "editions" / edition / "lessons/sample"
            target.mkdir(parents=True)
            documents = {
                "lesson.json": {"id": "sample", "prose": [{"kind": "p", "text": body}]},
                "exercises.json": {"exercises": [{"number": "1", "text": body}]},
                "figures.json": {"figures": []},
            }
            for name, document in documents.items():
                (target / name).write_text(json.dumps(document))

    def test_default_keeps_chinese_source(self):
        seed = prepare_seed(self.repo, "10p", "sample", ["1"], [0], [])
        self.assertEqual(seed["exercises"][0]["text"], "Chinese edition source")
        check_seed(seed, self.repo)

    def test_explicit_english_binds_english_paths(self):
        seed = prepare_seed(self.repo, "10p", "sample", ["1"], [0], [],
                            edition="modern-us-neutral-en")
        self.assertEqual(seed["exercises"][0]["text"], "English edition source")
        self.assertTrue(all("/modern-us-neutral-en/" in row["path"]
                            for row in seed["trace"][1:]))
        check_seed(seed, self.repo, edition="modern-us-neutral-en")
        self.assertNotIn("edition", seed["source"])

    def test_wrong_edition_cannot_validate_english_snapshot(self):
        seed = prepare_seed(self.repo, "10p", "sample", ["1"], [0], [],
                            edition="modern-us-neutral-en")
        with self.assertRaises(ContractError):
            check_seed(seed, self.repo)

    def test_unsafe_or_missing_edition_never_falls_back(self):
        with self.assertRaises(ContractError):
            source_files(self.repo, "10p", "sample", "../modern-us-neutral")
        with self.assertRaises(FileNotFoundError):
            source_files(self.repo, "10p", "sample", "missing")


if __name__ == "__main__":
    unittest.main()
