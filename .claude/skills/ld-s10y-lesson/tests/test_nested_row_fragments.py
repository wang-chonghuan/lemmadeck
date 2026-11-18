import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _merge_close


class NestedRowFragmentsTest(unittest.TestCase):
    def test_nested_strokes_preserve_complete_glyph_height(self):
        self.assertEqual(
            _merge_close([(760, 798), (761, 765), (792, 797)], 0),
            [(760, 798)],
        )

    def test_nested_stroke_does_not_hide_later_overlap(self):
        self.assertEqual(_merge_close([(10, 49), (42, 48), (48, 60)], 0), [(10, 60)])

    def test_disjoint_rows_stay_separate(self):
        self.assertEqual(_merge_close([(10, 49), (50, 60)], 0), [(10, 49), (50, 60)])

    def test_gap_limit_is_respected(self):
        self.assertEqual(_merge_close([(10, 49), (50, 60)], 1), [(10, 60)])
        self.assertEqual(_merge_close([(10, 49), (51, 60)], 1), [(10, 49), (51, 60)])

    def test_empty_input(self):
        self.assertEqual(_merge_close([], 0), [])


if __name__ == "__main__":
    unittest.main()
