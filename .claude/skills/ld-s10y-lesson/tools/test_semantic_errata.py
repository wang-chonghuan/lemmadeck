import copy
import unittest
from pathlib import Path
from unittest.mock import patch

import edition


class SemanticErrataTests(unittest.TestCase):
    def setUp(self):
        self.expected = {
            "id": "source-wording",
            "target": "lesson.prose[0]",
            "source": {"page": 1, "block": "p0001#1", "sha256": "a" * 64},
            "original": "wrong word",
            "corrected": "",
            "reason": "The original wording contradicts the stated definition.",
        }

    def validate(self, source, modern, corrected="right word", mutate=None):
        record = copy.deepcopy(self.expected)
        record["corrected"] = corrected
        if mutate:
            mutate(record)
        raw = {"prose": [{"text": source}]}
        lesson = {"prose": [{"text": modern}], "errata": [record]}
        exercises = {"exercises": []}
        with patch.object(edition, "source_errata", return_value=[self.expected]):
            return edition.validate_errata(
                Path("."), raw, exercises, lesson, exercises,
            )

    def test_bound_nonformula_wording_is_accepted(self):
        corrections, errors = self.validate("wrong word.", "right word.")
        self.assertEqual(errors, [])
        self.assertEqual(len(corrections["lesson.prose[0]"]), 1)

    def test_bound_disclosure_may_add_vector_notation(self):
        corrected = r"The arrow was reversed relative to $\vec{a}$."
        corrections, errors = self.validate("wrong word", corrected, corrected)
        self.assertEqual(errors, [])
        self.assertEqual(
            edition.validate_text(
                "wrong word", corrected, ["math-correction"], [],
                "lesson.prose[0]", [],
                math_corrections=corrections["lesson.prose[0]"],
            ),
            [],
        )

    def test_source_hash_drift_is_rejected(self):
        _, errors = self.validate(
            "wrong word", "right word",
            mutate=lambda record: record["source"].update(sha256="b" * 64),
        )
        self.assertTrue(any("source" in error for error in errors))

    def test_unregistered_id_is_rejected(self):
        _, errors = self.validate(
            "wrong word", "right word",
            mutate=lambda record: record.update(id="unregistered"),
        )
        self.assertTrue(any("unregistered" in error for error in errors))

    def test_target_drift_is_rejected(self):
        _, errors = self.validate(
            "wrong word", "right word",
            mutate=lambda record: record.update(target="lesson.prose[1]"),
        )
        self.assertTrue(any("target" in error for error in errors))

    def test_original_must_occur_exactly_once(self):
        for source in ("unrelated text", "wrong word; wrong word"):
            with self.subTest(source=source):
                _, errors = self.validate(source, "right word")
                self.assertTrue(any(".original" in error for error in errors))

    def test_corrected_text_must_be_applied(self):
        _, errors = self.validate("wrong word", "unrelated text")
        self.assertTrue(any(".corrected" in error for error in errors))

    def test_known_error_must_not_remain(self):
        _, errors = self.validate("wrong word", "wrong word; right word")
        self.assertTrue(any("source-wording" in error for error in errors))

    def test_formula_erratum_cannot_erase_the_formula(self):
        self.expected["original"] = "$1+1=3$"
        _, errors = self.validate("$1+1=3$", "two", "two")
        self.assertEqual(
            errors, ["lesson.errata[source-wording] 必须绑定数学原式与修正式"],
        )

    def test_unrelated_formula_change_is_rejected(self):
        source, modern = "wrong word; $x+1$.", "right word; $x+2$."
        corrections, errors = self.validate(source, modern)
        self.assertEqual(errors, [])
        text_errors = edition.validate_text(
            source, modern, ["math-correction"], [], "lesson.prose[0]", [],
            math_corrections=corrections["lesson.prose[0]"],
        )
        self.assertTrue(any("lesson.prose[0]" in error for error in text_errors))


if __name__ == "__main__":
    unittest.main()
