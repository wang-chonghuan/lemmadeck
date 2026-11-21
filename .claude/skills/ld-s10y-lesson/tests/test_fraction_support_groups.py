"""Compact fractions use the same support groups as taller fraction bands."""

from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class FractionSupportGroupTests(unittest.TestCase):
    def fraction(self):
        ink = np.zeros((80, 320), dtype=bool)
        ink[10:28, 65:80] = True
        ink[35:38, 50:95] = True
        ink[48:68, 65:82] = True
        return ink

    def check(self, ink, expected):
        original = ink.copy()
        self.assertEqual(layout._single_fraction_row(ink, 0, 79, 20), expected)
        np.testing.assert_array_equal(ink, original)

    def test_isolated_remote_glyph_does_not_establish_a_second_row(self):
        ink = self.fraction()
        ink[48:68, 230:247] = True
        self.check(ink, True)

    def test_supported_second_row_is_not_a_side_caption(self):
        ink = self.fraction()
        for left in (230, 258):
            ink[48:68, left:left + 17] = True
        self.check(ink, False)

    def test_two_supported_rows_remain_separate(self):
        ink = self.fraction()
        for top in (10, 58):
            for left in (210, 240):
                ink[top:top + 20, left:left + 17] = True
        self.check(ink, False)

    def test_supported_centered_caption_remains_a_single_row(self):
        ink = self.fraction()
        for left in (210, 240):
            ink[27:47, left:left + 17] = True
        self.check(ink, True)


if __name__ == "__main__":
    unittest.main()
