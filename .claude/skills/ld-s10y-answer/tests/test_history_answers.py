import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import lesson_answers


class HistoryAnswerSourceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.exercise = {"number": "6", "text": "Who discovered the lever law?"}
        self.answer = {
            "schema": lesson_answers.SCHEMA,
            "book": "6p", "lesson": "phy6-c5-s4", "edition": "modern-us-neutral",
            "answers": [{
                "exercise": "6", "grading": "ungraded", "source": "derived",
                "displayAnswer": "The textbook attributes the law to Archimedes.",
                "parts": [],
                "historical_entities": [{
                    "term": "Archimedes", "reason": "Textbook scientific-history attribution.",
                    "lessonSourceRef": "p0193#6",
                }],
            }],
        }
        original = {"text": "Archimedes discovered the lever law.", "source_refs": ["p0193#6"]}
        self.lesson = {
            "card_id": "phy6-c5-s4", "edition": "modern-us-neutral",
            "source": {"data": {"card_id": "phy6-c5-s4", "prose": [original]}},
            "prose": [{
                "text": "The textbook attributes the lever law to Archimedes.",
                "source_text": original["text"], "source_refs": ["p0193#6"],
                "historical_entities": [{
                    "term": "Archimedes", "reason": "Identity retained from this source paragraph.",
                }],
            }],
        }

    def errors(self, lesson=True):
        def save(name, value):
            (self.root / name).write_text(json.dumps(value), encoding="utf-8")
        save("exercises.json", {"exercises": [self.exercise]})
        save("answer-keys.json", self.answer)
        if lesson:
            save("lesson.json", self.lesson)
        return lesson_answers.validate_lesson(
            self.root / "answer-keys.json", self.root / "exercises.json",
            "6p", "phy6-c5-s4", "modern-us-neutral", ["Archimedes"],
        )[1]

    def test_source_bound_name_not_leaked_in_question(self):
        before = copy.deepcopy(self.exercise)
        self.assertEqual(self.errors(), [])
        self.assertEqual(self.exercise, before)

    def test_prompt_declaration_still_works_without_lesson(self):
        self.exercise["text"] = "What law does the textbook attribute to Archimedes?"
        self.answer["answers"][0]["historical_entities"][0].pop("lessonSourceRef")
        self.assertEqual(self.errors(lesson=False), [])

    def test_no_lesson_cannot_authorize_name(self):
        self.assertTrue(self.errors(lesson=False))

    def test_wrong_ref_cannot_authorize_name(self):
        self.answer["answers"][0]["historical_entities"][0]["lessonSourceRef"] = "p0193#7"
        self.assertTrue(self.errors())

    def test_other_lesson_cannot_authorize_name(self):
        self.lesson["card_id"] = "phy6-c5-s8"
        self.assertTrue(self.errors())

    def test_undeclared_paragraph_cannot_authorize_name(self):
        self.lesson["prose"][0]["historical_entities"] = []
        self.assertTrue(self.errors())

    def test_changed_source_snapshot_cannot_authorize_name(self):
        self.lesson["source"]["data"]["prose"][0]["text"] = "A different historical person."
        self.assertTrue(self.errors())

    def test_wrong_original_refs_cannot_authorize_name(self):
        self.lesson["source"]["data"]["prose"][0]["source_refs"] = ["p0193#7"]
        self.assertTrue(self.errors())

    def test_name_must_still_appear_in_display_answer(self):
        self.answer["answers"][0]["displayAnswer"] = "A scientist."
        self.assertTrue(self.errors())


if __name__ == "__main__":
    unittest.main()
