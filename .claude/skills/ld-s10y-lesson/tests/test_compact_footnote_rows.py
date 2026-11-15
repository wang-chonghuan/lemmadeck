"""Direct compact text bands must not lose a row to a wider body pitch."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _single_fraction_row, line_bands


class CompactFootnoteRowsTests(unittest.TestCase):
    def page(self):
        ink = np.zeros((1100, 1000), dtype=bool)
        for top in (100, 186, 272, 358, 444):
            for left in range(100, 800, 40):
                ink[top:top + 46, left:left + 25] = True
        return ink

    def row(self, ink, top, count):
        for index in range(count):
            left = 100 + index * 40
            ink[top:top + 38, left:left + 25] = True

    def test_three_compact_rows_including_short_final_line(self):
        ink = self.page()
        for top, count in ((750, 18), (798, 18), (846, 2)):
            self.row(ink, top, count)
        self.assertFalse(_single_fraction_row(ink, 750, 883, 46))
        self.assertEqual(len(line_bands(ink, 1000)), 8)

    def test_three_full_compact_rows(self):
        ink = self.page()
        for top in (750, 798, 846):
            self.row(ink, top, 18)
        self.assertEqual(len(line_bands(ink, 1000)), 8)

    def test_two_compact_rows_remain_two(self):
        ink = self.page()
        for top in (750, 798):
            self.row(ink, top, 18)
        self.assertEqual(len(line_bands(ink, 1000)), 7)

    def test_compact_fraction_is_still_one_row(self):
        ink = self.page()
        ink[750:788, 480:505] = True
        ink[798:801, 470:515] = True
        ink[811:849, 480:505] = True
        self.assertTrue(_single_fraction_row(ink, 750, 848, 46))
        self.assertEqual(len(line_bands(ink, 1000)), 6)


if __name__ == "__main__":
    unittest.main()
