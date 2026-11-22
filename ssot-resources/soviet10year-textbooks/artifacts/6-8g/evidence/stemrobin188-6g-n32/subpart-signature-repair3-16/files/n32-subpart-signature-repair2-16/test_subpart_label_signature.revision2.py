import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import edition


class SubpartLabelSignatureTests(unittest.TestCase):
    def check_text(self, source, modern, numeric_changes=None):
        return edition.validate_text(
            source, modern, ["layout"], numeric_changes or [], "exercise", []
        )

    def test_complete_letter_sequence_can_become_numeric(self):
        source = "438. Prove: " + "; ".join(
            f"{label}) $x={index}$"
            for index, label in enumerate(edition.CYRILLIC_PARTS[:10], 1)
        ) + ". Figure 208, angles 1 and 8."
        modern = "438. Prove:\n" + ";\n".join(
            f"{index}) $x={index}$" for index in range(1, 11)
        ) + ".\n\nFigure 208, angles 1 and 8."
        self.assertEqual(self.check_text(source, modern), [])

    def test_latin_labels_keep_nonformula_data_checked(self):
        source = "12. a) length 7; b) length 9."
        self.assertEqual(self.check_text(source, "12.\n1) length 7;\n2) length 9."), [])
        errors = self.check_text(source, "12.\n1) length 8;\n2) length 9.")
        self.assertTrue(any("want=" in error for error in errors))

    def test_formula_values_are_not_subpart_labels(self):
        source = "12. a) $f(1)=7$; b) $f(2)=9$."
        errors = self.check_text(source, "12.\n1) $f(1)=8$;\n2) $f(2)=9$.")
        self.assertTrue(any("数学公式变化" in error for error in errors))

    def test_missing_duplicate_and_extra_labels_fail(self):
        source = "12. a) value 7; b) value 9; c) value 11."
        for modern in [
            "12.\n1) value 7;\n2) value 9.",
            "12.\n1) value 7;\n2) value 9;\n2) value 11.",
            "12.\n1) value 7;\n2) value 9;\n3) value 11;\n4) value 13.",
        ]:
            with self.subTest(modern=modern):
                self.assertTrue(any("want=" in error for error in self.check_text(source, modern)))

    def test_nested_figure_and_math_numbers_remain_data(self):
        text = "12. (condition 1) Figure 2) $f(1)$, not a complete list."
        self.assertEqual(edition.canonical_subpart_labels(text), text)

    def test_declared_context_number_change_is_still_required(self):
        source = "12. a) length 7; b) length 9."
        modern = "12.\n1) length 8;\n2) length 9."
        errors = edition.validate_text(
            source, modern, ["layout", "context-number"],
            [{"from": "7", "to": "8", "reason": "Approved problem-data revision."}],
            "exercise", [],
        )
        self.assertEqual(errors, [])

    def test_missing_label_cannot_be_replaced_by_plain_number(self):
        source = "12. a) Draw a circle; b) Name its center."
        modern = "12.\n1) Draw a circle; Name its center, step 2."
        self.assertTrue(self.check_text(source, modern))

    def test_duplicate_label_cannot_replace_real_data(self):
        source = "12. a) Red; b) 3 blue; c) Green."
        modern = "12.\n1) Red;\n2) Blue;\n3) Green;\n3) Green."
        self.assertTrue(self.check_text(source, modern))

    def test_figure_number_cannot_replace_missing_label(self):
        source = "12. a) Trace the line; b) Mark its end."
        modern = "12.\n1) Trace the line; See Figure2) for its end."
        self.assertTrue(self.check_text(source, modern))

    def test_parenthesized_point_identifiers_are_not_list_labels(self):
        source = "12. Consider the points (a) and (b)."
        modern = "12. Consider the points (1) and (2)."
        self.assertTrue(self.check_text(source, modern))

    def test_inline_identifiers_and_math_numbers_are_not_structural_labels(self):
        source = "12. Use labels a) and b) for the points $P_1$ and $P_2$."
        modern = "12. Use labels 1) and 2) for the points $P_1$ and $P_2$."
        self.assertTrue(self.check_text(source, modern))


if __name__ == "__main__":
    unittest.main()
