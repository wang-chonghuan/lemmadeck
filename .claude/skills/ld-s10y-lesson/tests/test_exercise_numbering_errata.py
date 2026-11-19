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
import edition

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
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            page = book / "pages" / "0231"
            page.mkdir(parents=True)
            (page / "page.json").write_text(json.dumps({
                "meta": self.meta, "blocks": [self.block],
            }))
            match = lesson_answers.captured_answer(
                answers, "lesson", exercise, "book", source_book=book,
            )
            self.assertEqual(match, answers[1])
            exercise["numbering_erratum"] = {**self.record, "corrected": "787"}
            with self.assertRaises(ValueError):
                lesson_answers.captured_answer(
                    answers, "lesson", exercise, "book", source_book=book,
                )

    def test_missing_registration_does_not_change_source_identity(self):
        stream = [{**self.block, "ref": "p0231#1", "page": 231}]
        _, exercises = assemble.split_lesson({"blocks": stream})
        self.assertEqual(exercises[0]["number"], "736")
        self.assertEqual(assemble._numeric_source_numbers(exercises), [736])
        self.assertNotIn("numbering_erratum", exercises[0])

    def test_answer_lookup_rejects_missing_forged_stale_and_unbound_records(self):
        exercise = {
            "number": "786", "source_number": "736", "pages": ["p0231#1"],
            "numbering_erratum": self.record,
        }
        with self.assertRaises(ValueError):
            lesson_answers.captured_answer([], "lesson", exercise, "book")
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            page = book / "pages" / "0231"
            page.mkdir(parents=True)
            (page / "page.json").write_text(json.dumps({
                "meta": self.meta, "blocks": [self.block],
            }))
            candidates = [
                {key: value for key, value in exercise.items() if key != "numbering_erratum"},
                {**exercise, "numbering_erratum": None},
                {**exercise, "number": "787", "numbering_erratum": {**self.record, "corrected": "787"}},
                {**exercise, "numbering_erratum": {**self.record, "id": "stale"}},
                {**exercise, "numbering_erratum": {**self.record, "reason": "stale"}},
                {**exercise, "numbering_erratum": {**self.record, "id": ""}},
                {**exercise, "numbering_erratum": {**self.record, "reason": ""}},
                {**exercise, "pages": ["p0231#2"], "numbering_erratum": {**self.record, "block": "p0231#2"}},
            ]
            for candidate in candidates:
                with self.subTest(candidate=candidate), self.assertRaises(ValueError):
                    lesson_answers.captured_answer(
                        [{"exercise": 736}, {"exercise": 787}],
                        "lesson", candidate, "book", source_book=book,
                    )

    def test_numbering_only_edition_validates_current_source_authority(self):
        header = {"kind": "h3", "lines": ["1. Test"], "label": None}
        record = {**self.record, "block": "p0231#2"}
        meta = {"page": 231, "printed_page": 225, "exercise_numbering_errata": [record]}
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            page = book / "pages" / "0231"
            page.mkdir(parents=True)
            (page / "page.json").write_text(json.dumps({
                "meta": meta, "blocks": [header, self.block],
            }))
            candidate = assemble.cut_lessons(assemble.load_stream(book))[0]
            candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate)
            exercises = {"exercises": candidate["exercises"]}
            self.assertEqual(edition.source_errata(book, candidate, exercises), [])
            for change in ("missing", "forged", "stale"):
                altered = copy.deepcopy(exercises)
                item = altered["exercises"][0]
                if change == "missing":
                    del item["numbering_erratum"]
                elif change == "forged":
                    item["number"] = "787"
                    item["numbering_erratum"]["corrected"] = "787"
                else:
                    item["numbering_erratum"]["reason"] = "stale"
                with self.subTest(change=change), self.assertRaises(SystemExit):
                    edition.source_errata(book, candidate, altered)

    def test_numbering_only_edition_rejects_continuation_first_refs(self):
        header = {"kind": "h3", "lines": ["1. Test"], "label": None}
        record = {**self.record, "block": "p0231#2"}
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            for number, doc in (
                (231, {
                    "meta": {"page": 231, "printed_page": 225,
                             "exercise_numbering_errata": [record]},
                    "blocks": [header, {**self.block, "open": True}],
                }),
                (232, {
                    "meta": {"page": 232, "printed_page": 226},
                    "blocks": [{**self.block, "cont": True, "lines": ["Continuation."]}],
                }),
            ):
                page = book / "pages" / f"{number:04d}"
                page.mkdir(parents=True)
                (page / "page.json").write_text(json.dumps(doc))
            merged, _ = assemble.merge_across_pages(assemble.load_stream(book))
            candidate = assemble.cut_lessons(merged)[0]
            candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate)
            exercises = {"exercises": candidate["exercises"]}
            refs = ["p0231#2", "p0232#1"]
            self.assertEqual(exercises["exercises"][0]["pages"], refs)
            self.assertEqual(edition.source_errata(book, candidate, exercises), [])
            for changed in (list(reversed(refs)), refs + [refs[0]], refs[1:]):
                altered = copy.deepcopy(exercises)
                altered["exercises"][0]["pages"] = changed
                with self.subTest(refs=changed), self.assertRaises(SystemExit):
                    edition.source_errata(book, candidate, altered)
            legacy = copy.deepcopy(exercises)
            del legacy["exercises"][0]["pages"]
            self.assertEqual(edition.source_errata(book, candidate, legacy), [])


if __name__ == "__main__":
    unittest.main()
