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

    def test_exercise_figures_localize_labels_only(self):
        source = {
            "number": "2", "figure_refs": ["fig-24", "fig-30"],
            "figures": [
                {"id": "fig-24", "label": "\u56fe 24", "owner": "2"},
                {"id": "fig-30", "label": "\u56fe 30"},
            ],
        }
        modern = copy.deepcopy(source)
        modern["figures"][0]["label"] = "Figure 24"
        modern["figures"][1]["label"] = "Figure 30"
        self.assertEqual(edition.validate_exercise_identity(source, modern, "en", "ex"), [])
        for locale in (None, "zh"):
            self.assertTrue(edition.validate_exercise_identity(source, modern, locale, "ex"))
        for change in (
            lambda row: row["figures"].reverse(),
            lambda row: row["figures"].pop(),
            lambda row: row["figures"][0].update(label="Figure 25"),
            lambda row: row["figures"][0].update(id="fig-25"),
            lambda row: row["figures"][0].update(owner="3"),
            lambda row: row["figures"][0].update(extra=True),
            lambda row: row["figures"][0].pop("owner"),
            lambda row: row["figure_refs"].reverse(),
            lambda row: row.update(number="3"),
        ):
            candidate = copy.deepcopy(modern)
            change(candidate)
            self.assertTrue(edition.validate_exercise_identity(source, candidate, "en", "ex"))

    def test_exercise_figure_field_presence_and_unchanged_labels(self):
        for source in ({}, {"figures": None}, {"figures": []}, {"figures": [{"id": "fig-24"}]}):
            self.assertEqual(
                edition.validate_exercise_identity(source, copy.deepcopy(source), "en", "ex"), [],
            )
        self.assertTrue(edition.validate_exercise_identity({}, {"figures": None}, "en", "ex"))
        self.assertTrue(edition.validate_exercise_identity({"figures": []}, {}, "en", "ex"))
        self.assertTrue(edition.validate_exercise_identity(
            {"figures": [{"id": "fig-24"}]},
            {"figures": [{"id": "fig-24", "label": "Figure 24"}]}, "en", "ex",
        ))

    def test_english_figure_references_do_not_relax_formula_order(self):
        source = "In \u56fe $24$, processes $1-1'$ and $1'-2$."
        reordered = "Processes $1-1'$ and $1'-2$ in Figure $24$."
        preserved = "In Figure $24$, processes $1-1'$ and $1'-2$."
        self.assertTrue(edition.validate_text(source, reordered, ["translation"], [], "ex", []))
        self.assertEqual(edition.validate_text(source, preserved, ["translation"], [], "ex", []), [])

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
