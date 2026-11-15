import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

from edition import normalize_prose_layout


class FullwidthProseStopTests(unittest.TestCase):
    def test_source_fullwidth_stops_form_short_paragraphs(self):
        source = "长度是量．时间也是量．它们不同类．不同类的量不能比较．"
        self.assertEqual(
            normalize_prose_layout(source),
            "长度是量．\n时间也是量．\n它们不同类．\n\n不同类的量不能比较．",
        )

    def test_math_and_decimal_are_not_split(self):
        source = "长度的数值为5.6．公式是$a=5.6e$．单位变化时量不变．"
        self.assertEqual(
            normalize_prose_layout(source),
            "长度的数值为5.6．\n公式是$a=5.6e$．\n单位变化时量不变．",
        )

    def test_formula_literal_is_not_a_prose_boundary(self):
        source = "记号$\\text{a．b}$不在正文中断句．另一句．"
        self.assertEqual(
            normalize_prose_layout(source),
            "记号$\\text{a．b}$不在正文中断句．\n另一句．",
        )


if __name__ == "__main__":
    unittest.main()
