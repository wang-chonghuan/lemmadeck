"""A lesson review must survive unrelated book growth, not changed lesson facts."""

import copy
import importlib.util
from pathlib import Path
import unittest


MODULE = Path(__file__).resolve().parents[1] / "scripts/prepare.py"
SPEC = importlib.util.spec_from_file_location("choice_prepare", MODULE)
prepare = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(prepare)


class BookLessonSnapshotTests(unittest.TestCase):
    def setUp(self):
        self.book = {
            "book": "6p",
            "exercise_numbering": "lesson-group",
            "pages": 2,
            "lessons": [{"id": "lesson-a", "exercises": 2, "title": "First"}],
            "figures": [],
        }

    def test_unrelated_growth_preserves_snapshot(self):
        grown = copy.deepcopy(self.book)
        grown["pages"] = 3
        grown["lessons"].append({"id": "lesson-b", "exercises": 3})
        grown["figures"].append({"id": "fig-1"})
        self.assertEqual(prepare.book_lesson_hash(self.book, "lesson-a"),
                         prepare.book_lesson_hash(grown, "lesson-a"))

    def test_selected_lesson_or_numbering_change_invalidates_snapshot(self):
        baseline = prepare.book_lesson_hash(self.book, "lesson-a")
        for field, value in (("exercises", 3), ("title", "Changed")):
            changed = copy.deepcopy(self.book)
            changed["lessons"][0][field] = value
            self.assertNotEqual(baseline, prepare.book_lesson_hash(changed, "lesson-a"))
        changed = copy.deepcopy(self.book)
        changed["exercise_numbering"] = "book"
        self.assertNotEqual(baseline, prepare.book_lesson_hash(changed, "lesson-a"))

    def test_absent_or_duplicate_lesson_is_rejected(self):
        with self.assertRaises(prepare.ContractError):
            prepare.book_lesson_hash(self.book, "missing")
        self.book["lessons"].append(copy.deepcopy(self.book["lessons"][0]))
        with self.assertRaises(prepare.ContractError):
            prepare.book_lesson_hash(self.book, "lesson-a")


if __name__ == "__main__":
    unittest.main()
