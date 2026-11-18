import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class EnglishEditionIdentityTests(unittest.TestCase):
    def setUp(self):
        self.source = {
            "id": "phy10-c2-s3-n82",
            "card_id": "phy10-c2-s3-n82",
            "number": 82,
            "title": "\u60e0\u66f4\u65af\u539f\u7406",
            "printed_title": "82. \u60e0\u66f4\u65af\u539f\u7406",
        }

    def test_english_title_can_translate_without_changing_source_identity(self):
        modern = {**self.source, "locale": "en", "title": "Huygens's Principle"}
        self.assertEqual(edition.validate_lesson_identity(self.source, modern), [])
        modern["number"] = 83
        self.assertIn(
            "lesson.number \u4e0d\u5f97\u6539\u53d8",
            edition.validate_lesson_identity(self.source, modern),
        )

    def test_printed_title_stays_immutable_in_english(self):
        modern = {**self.source, "locale": "en", "title": "Huygens's Principle"}
        modern["printed_title"] = "82. Huygens's Principle"
        self.assertTrue(edition.validate_lesson_identity(self.source, modern))

    def test_default_and_chinese_title_identity_stay_immutable(self):
        for locale in (None, "zh"):
            modern = {**self.source, "locale": locale, "title": "Other"}
            self.assertTrue(edition.validate_lesson_identity(self.source, modern))

    def test_english_title_must_be_nonempty_and_localized(self):
        for title in ("", self.source["title"]):
            modern = {**self.source, "locale": "en", "title": title}
            self.assertTrue(edition.validate_lesson_identity(self.source, modern))

    def test_figure_label_translation_preserves_exact_number(self):
        self.assertTrue(edition.same_figure_label("\u56fe 195", "Figure 195", "en"))
        self.assertFalse(edition.same_figure_label("\u56fe 195", "Figure 196", "en"))
        self.assertFalse(edition.same_figure_label("\u56fe 195", "Drawing 195", "en"))
        self.assertFalse(edition.same_figure_label("\u56fe 195", "Figure 195", "zh"))

    def test_localization_does_not_relax_source_snapshot_binding(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            file = root / "lesson.json"
            file.write_text(json.dumps(self.source), encoding="utf-8")
            source = {
                "path": "lesson.json",
                "sha256": edition.sha256(file),
                "data": copy.deepcopy(self.source),
            }
            self.assertEqual(edition.validate_source(root, source, file, "lesson"), [])
            source["data"]["title"] = "Huygens's Principle"
            self.assertTrue(edition.validate_source(root, source, file, "lesson"))


if __name__ == "__main__":
    unittest.main()
