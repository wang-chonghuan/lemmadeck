import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import assemble
import blocks

ANSWER_TOOLS = TOOLS.parents[1] / "ld-s10y-answer" / "tools"
sys.path.insert(0, str(ANSWER_TOOLS))
import lesson_answers


class ExerciseNumberingErrataTests(unittest.TestCase):
    def setUp(self):
        self.block = {
            "kind": "ex", "label": "736", "cont": False, "open": False,
            "lines": ["736. Simplify the quotient."],
        }
        self.record = {
            "id": "p0231-number-1", "block": "p0231#1",
            "printed": "736", "corrected": "786", "reason": "Printed numbering error.",
        }
        self.meta = {"page": 231, "exercise_numbering_errata": [self.record]}

    def test_corrected_identity_preserves_printed_text_and_number(self):
        original = copy.deepcopy(self.block)
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            page = book / "pages" / "0231"
            page.mkdir(parents=True)
            (page / "page.json").write_text(json.dumps({
                "meta": self.meta, "blocks": [self.block],
            }))
            stream = assemble.load_stream(book)
        _, exercises = assemble.split_lesson({"blocks": stream})
        exercise = exercises[0]
        self.assertEqual(exercise["number"], "786")
        self.assertEqual(exercise["source_number"], "736")
        self.assertEqual(exercise["text"], original["lines"][0])
        self.assertEqual(exercise["numbering_erratum"], self.record)
        self.assertEqual(assemble._numeric_source_numbers(exercises), [786])
        self.assertEqual(self.block, original)

    def test_binding_rejects_changed_printed_number_and_continuations(self):
        for field, value in (("label", "737"), ("cont", True), ("lines", ["737. Other."])):
            changed = {**self.block, field: value}
            with self.subTest(field=field), self.assertRaises(ValueError):
                blocks.exercise_numbering_errata(self.meta, [changed], 231)

    def test_wrong_page_duplicate_and_equal_number_are_rejected(self):
        for changed in (
            {**self.record, "block": "p0232#1"},
            {**self.record, "corrected": "736"},
        ):
            with self.assertRaises(ValueError):
                blocks.exercise_numbering_errata(
                    {"exercise_numbering_errata": [changed]}, [self.block], 231,
                )
        with self.assertRaises(ValueError):
            blocks.exercise_numbering_errata(
                {"exercise_numbering_errata": [self.record, self.record]},
                [self.block], 231,
            )

    def test_answer_reference_uses_bound_corrected_number_not_old_same_number(self):
        exercise = {
            "number": "786", "source_number": "736", "pages": ["p0231#1"],
            "numbering_erratum": self.record,
        }
        answers = [
            {"exercise": 736, "raw": "Earlier unrelated answer."},
            {"exercise": 786, "raw": "Correct answer reference."},
        ]
        match = lesson_answers.captured_answer(answers, "lesson", exercise, "book")
        self.assertEqual(match, answers[1])
        exercise["numbering_erratum"] = {**self.record, "corrected": "787"}
        with self.assertRaises(ValueError):
            lesson_answers.captured_answer(answers, "lesson", exercise, "book")

    def test_missing_registration_does_not_change_source_identity(self):
        stream = [{**self.block, "ref": "p0231#1", "page": 231}]
        _, exercises = assemble.split_lesson({"blocks": stream})
        self.assertEqual(exercises[0]["number"], "736")
        self.assertEqual(assemble._numeric_source_numbers(exercises), [736])
        self.assertNotIn("numbering_erratum", exercises[0])


if __name__ == "__main__":
    unittest.main()
