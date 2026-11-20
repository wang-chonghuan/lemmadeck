import copy
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import validate_lesson_identity


class EnglishLessonHeadingTests(unittest.TestCase):
    def setUp(self):
        self.source = {
            "id": "phy10-c4-s1",
            "card_id": "phy10-c4-s1",
            "chapter": "\u7269\u7406\u5b66",
            "section": None,
            "number": "151",
            "title": "\u4e16\u754c\u7684\u7269\u7406\u56fe\u666f",
            "printed_title": "$151$. \u4e16\u754c\u7684\u7269\u7406\u56fe\u666f",
            "start_page": 388,
            "start_printed": 378,
            "exercise_count": 0,
        }
        self.modern = {
            **self.source,
            "locale": "en",
            "chapter": "Physics",
            "title": "A Physical Picture of the World",
            "printed_title": "151. A Physical Picture of the World",
        }

    def test_english_headings_translate_without_mutating_source(self):
        before = copy.deepcopy(self.source)
        self.assertEqual(validate_lesson_identity(self.source, self.modern), [])
        self.assertEqual(self.source, before)

    def test_structural_identity_stays_protected(self):
        replacements = {
            "id": "other", "card_id": "other", "section": "other",
            "number": "152", "start_page": 389, "start_printed": 379,
            "exercise_count": 1,
        }
        for field, replacement in replacements.items():
            with self.subTest(field=field):
                modern = {**self.modern, field: replacement}
                self.assertTrue(validate_lesson_identity(self.source, modern))

    def test_printed_number_cannot_change_or_disappear(self):
        for title in ("152. A Physical Picture", "A Physical Picture"):
            with self.subTest(title=title):
                modern = {**self.modern, "printed_title": title}
                self.assertTrue(validate_lesson_identity(self.source, modern))

    def test_translated_headings_must_be_nonempty_and_english(self):
        for field in ("title", "chapter", "printed_title"):
            for value in ("", "   ", None, "\u4e16\u754c", "\u041c\u0438\u0440"):
                with self.subTest(field=field, value=value):
                    modern = {**self.modern, field: value}
                    self.assertTrue(validate_lesson_identity(self.source, modern))
            modern = dict(self.modern)
            del modern[field]
            self.assertTrue(validate_lesson_identity(self.source, modern))

    def test_missing_or_null_optional_headings_stay_missing_or_null(self):
        for field in ("chapter", "printed_title"):
            source = {**self.source, field: None}
            modern = {**self.modern, field: None}
            self.assertEqual(validate_lesson_identity(source, modern), [])
            self.assertTrue(validate_lesson_identity(source, {**modern, field: "Added heading"}))
            del source[field]
            del modern[field]
            self.assertEqual(validate_lesson_identity(source, modern), [])
            self.assertTrue(validate_lesson_identity(source, {**modern, field: None}))

    def test_chinese_and_unspecified_locale_keep_exact_headings(self):
        for locale in ("zh", None):
            modern = {**self.modern, "locale": locale}
            errors = validate_lesson_identity(self.source, modern)
            for field in ("title", "chapter", "printed_title"):
                self.assertIn(f"lesson.{field} \u4e0d\u5f97\u6539\u53d8", errors)


if __name__ == "__main__":
    unittest.main()
