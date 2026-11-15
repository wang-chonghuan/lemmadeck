import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class PlainNumberLayoutTests(unittest.TestCase):
    def test_period_to_line_break_keeps_subpart_numbers(self):
        source = "63. 1) 距离为а) 1cm，б)2cm.2) 有几个点？"
        modern = "63.\n1) 距离为a) 1cm，b) 2cm．\n2) 有几个点？"
        self.assertEqual(edition.number_signature(source), ["63", "1", "1", "2", "2"])
        self.assertEqual(edition.number_signature(modern), ["63", "1", "1", "2", "2"])

    def test_cjk_units_and_decimal_values_are_all_retained(self):
        text = "第7课：2cm、-3.7公里、7.3cm；图22。"
        self.assertEqual(edition.number_signature(text), ["7", "2", "-3.7", "7.3", "22"])

    def test_math_numbers_are_not_double_counted(self):
        text = "1) $A(2),B(-3)$；2) $$x=10$$；3) 4cm。"
        self.assertEqual(edition.number_signature(text), ["1", "2", "3", "4"])

    def test_layout_only_change_passes_validation(self):
        errors = edition.validate_text(
            "1) 距离为1cm.2) 距离为2cm.",
            "1) 距离为1cm．\n2) 距离为2cm．",
            ["layout"], [], "exercise", [],
        )
        self.assertEqual(errors, [])

    def test_changed_unit_value_is_rejected(self):
        errors = edition.validate_text(
            "1) 距离为1cm.2) 距离为2cm.",
            "1) 距离为1cm．\n2) 距离为3cm．",
            ["layout"], [], "exercise", [],
        )
        self.assertTrue(any("非公式数字变化" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
