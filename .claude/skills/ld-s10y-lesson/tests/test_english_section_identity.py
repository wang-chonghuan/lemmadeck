import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import validate_lesson_identity


class EnglishSectionIdentityTests(unittest.TestCase):
    def setUp(self):
        self.source = {
            "id": "example", "title": "Lesson", "chapter": "Part I",
            "section": "Chapter 1", "printed_title": "1. Lesson",
        }
        self.modern = {**copy.deepcopy(self.source), "locale": "en"}

    def test_english_section_can_be_translated(self):
        self.modern["section"] = "Chapter 1: Molecular Kinetic Theory"
        self.assertEqual(validate_lesson_identity(self.source, self.modern), [])
        self.assertEqual(self.source["section"], "Chapter 1")

    def test_other_identity_fields_stay_immutable(self):
        self.modern["id"] = "other"
        self.assertIn("lesson.id", " ".join(validate_lesson_identity(self.source, self.modern)))

    def test_chinese_identity_rule_is_unchanged(self):
        self.modern["locale"] = "zh"
        self.modern["section"] = "Other chapter"
        self.assertIn("lesson.section", " ".join(validate_lesson_identity(self.source, self.modern)))

    def test_empty_and_non_english_section_are_rejected(self):
        for value in ["", "   ", "\u7b2c\u4e00\u7ae0", "\u0413\u043b\u0430\u0432\u0430"]:
            with self.subTest(value=value):
                self.modern["section"] = value
                self.assertIn("lesson.section", " ".join(validate_lesson_identity(self.source, self.modern)))

    def test_absent_or_null_section_cannot_be_invented(self):
        for source in [{key: value for key, value in self.source.items() if key != "section"},
                       {**self.source, "section": None}]:
            with self.subTest(source=source):
                modern = {**copy.deepcopy(source), "locale": "en", "section": "Invented"}
                self.assertIn("lesson.section", " ".join(validate_lesson_identity(source, modern)))

    def test_printed_title_number_gate_stays_active(self):
        self.modern["printed_title"] = "2. Lesson"
        self.assertIn("lesson.printed_title", " ".join(validate_lesson_identity(self.source, self.modern)))


if __name__ == "__main__":
    unittest.main()
