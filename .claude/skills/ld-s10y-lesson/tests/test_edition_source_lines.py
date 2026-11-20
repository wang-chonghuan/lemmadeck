"""Bound source rows preserve layout without relaxing ordered text signatures."""

import sys
import unittest
from copy import deepcopy
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import blocks
import edition


class SourceLinesTextTest(unittest.TestCase):
    def validate(self, lines, modern, *, source=None):
        return edition.validate_text(
            blocks.text_of({"lines": lines}) if source is None else source,
            modern, ["layout"], [], "exercise", [],
            source_lines=lines,
        )

    def test_independent_number_rows_do_not_merge(self):
        lines = ["Compare:", "35 000", "801 000"]
        self.assertEqual(self.validate(lines, "Compare:\n35 000; 801 000"), [])

    def test_numbered_rows_preserve_all_markers(self):
        lines = ["Read:", "1) 9 345", "2) 84 536"]
        self.assertEqual(self.validate(lines, "Read:\n1) 9 345。\n2) 84 536。"), [])

    def test_existing_thousands_groups_remain_intact(self):
        lines = ["Read:", "3 100 257", "418 000 035"]
        self.assertEqual(self.validate(lines, "Read:\n3 100 257; 418 000 035"), [])

    def test_changed_number_is_rejected(self):
        lines = ["Compare:", "35 000", "801 000"]
        self.assertTrue(any("非公式数字变化" in error for error in
                            self.validate(lines, "Compare:\n35 000; 810 000")))

    def test_merged_thousands_chunks_are_rejected(self):
        lines = ["Read:", "3 100 257", "418 000 035"]
        self.assertTrue(any("非公式数字变化" in error for error in
                            self.validate(lines, "Read:\n3100257; 418000035")))

    def test_swapped_number_rows_are_rejected(self):
        lines = ["Compare:", "35 000", "801 000"]
        self.assertTrue(any("非公式数字变化" in error for error in
                            self.validate(lines, "Compare:\n801 000; 35 000")))

    def test_swapped_formulas_are_rejected(self):
        lines = ["Compute:", "$7+2$", "$9-4$"]
        self.assertTrue(any("数学公式变化" in error for error in
                            self.validate(lines, "Compute:\n$9-4$; $7+2$")))

    def test_changed_formula_is_rejected(self):
        lines = ["Compute:", "$7+2$", "$9-4$"]
        self.assertTrue(any("数学公式变化" in error for error in
                            self.validate(lines, "Compute:\n$7+3$; $9-4$")))

    def test_formula_internal_print_wrap_does_not_add_space(self):
        lines = ["Compute $12+", "3$; then $5+7$."]
        self.assertEqual(self.validate(lines, "Compute $12+3$;\nthen $5+7$."), [])

    def test_number_correction_cannot_be_hidden_in_source_lines(self):
        self.assertTrue(any("source_lines" in error for error in self.validate(
            ["Read:", "36 000", "801 000"],
            "Read:\n36 000; 801 000",
            source="Read:35 000801 000",
        )))

    def test_formula_reorder_cannot_be_hidden_in_source_lines(self):
        self.assertTrue(any("source_lines" in error for error in self.validate(
            ["Compute:", "$9-4$", "$7+2$"],
            "Compute:\n$9-4$; $7+2$",
            source="Compute:$7+2$ $9-4$",
        )))

    def test_malformed_source_lines_are_rejected(self):
        for lines in ([], ["Read:", 35], "Read:35"):
            with self.subTest(lines=lines):
                self.assertTrue(any("source_lines" in error for error in
                                    self.validate(lines, "Read:\n35", source="Read:35")))

    def test_flat_source_without_lines_keeps_existing_strict_failure(self):
        errors = edition.validate_text(
            "Compare:35 000801 000", "Compare:\n35 000; 801 000",
            ["layout"], [], "exercise", [],
        )
        self.assertTrue(any("非公式数字变化" in error for error in errors))


class ModernLinesNormalizationTest(unittest.TestCase):
    def test_cultural_edit_syncs_lines_without_changing_source(self):
        document = {
            "exercises": [{
                "text": "105. Ethan has 123 stamps, three times Noah's count.",
                "lines": ["105. Old names remain in this source line."],
                "source_text": "105. Original source wording.",
                "changes": ["names"],
            }],
            "source": {"data": {"text": "Immutable source snapshot"}},
        }
        before = deepcopy(document)
        edition.normalize_exercise_layout(document)
        self.assertEqual(
            document["exercises"][0]["lines"],
            [before["exercises"][0]["text"]],
        )
        document["exercises"][0]["lines"] = before["exercises"][0]["lines"]
        self.assertEqual(document, before)

    def test_canonical_latin_subparts_replace_stale_line_markers(self):
        text = "49. Calculate:\na) $6+1$;\nb) $7-2$."
        document = {"exercises": [{
            "text": text,
            "lines": ["49. Calculate:", "\u0430) $6+1$;", "\u0431) $7-2$."],
            "changes": ["layout"],
        }]}
        edition.normalize_exercise_layout(document)
        self.assertEqual(document["exercises"][0]["text"], text)
        self.assertEqual(document["exercises"][0]["lines"], text.splitlines())

    def test_invalid_text_is_not_coerced_into_modern_lines(self):
        document = {"exercises": [{"text": None, "lines": ["source"]}]}
        before = deepcopy(document)
        edition.normalize_exercise_layout(document)
        self.assertEqual(document, before)


if __name__ == "__main__":
    unittest.main()
