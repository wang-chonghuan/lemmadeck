"""A tall fraction under a connected radical remains one printed row."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class RadicalFractionHeightTest(unittest.TestCase):
    def radical(self):
        ink = np.zeros((70, 120), dtype=bool)
        ink[0:3, 40:80] = True
        for y in range(3, 44):
            x = 40 - y // 3
            ink[y, x:x + 3] = True
        ink[41:45, 26:34] = True
        ink[5:8, 60:65] = True
        ink[24:27, 55:82] = True
        ink[30:48, 57:67] = True
        return ink

    def test_tall_radical_fraction_with_numerator_in_upper_band(self):
        self.assertTrue(layout._connected_radical_row(
            self.radical(), 0, 7, 20, 47, 20,
        ))

    def test_disconnected_cap_does_not_merge_rows(self):
        ink = self.radical()
        ink[11:15, :50] = False
        self.assertFalse(layout._connected_radical_row(ink, 0, 7, 20, 47, 20))

    def test_two_pixel_scan_gap_between_cap_and_inclined_stem(self):
        ink = self.radical()
        ink[0:3, 43:45] = False
        self.assertTrue(layout._connected_radical_row(ink, 0, 7, 20, 47, 20))

    def test_distant_cap_does_not_merge_rows(self):
        ink = self.radical()
        ink[0:3, 43:60] = False
        self.assertFalse(layout._connected_radical_row(ink, 0, 7, 20, 47, 20))

    def test_vertical_rule_is_not_a_radical_stem(self):
        ink = self.radical()
        ink[3:44, :50] = False
        ink[3:44, 40:43] = True
        self.assertFalse(layout._connected_radical_row(ink, 0, 7, 20, 47, 20))

    def test_full_height_upper_text_row_remains_separate(self):
        self.assertFalse(layout._connected_radical_row(
            self.radical(), 0, 19, 30, 47, 20,
        ))

    def test_overlong_combined_region_remains_separate(self):
        self.assertFalse(layout._connected_radical_row(
            self.radical(), 0, 7, 20, 55, 20,
        ))


if __name__ == "__main__":
    unittest.main()
