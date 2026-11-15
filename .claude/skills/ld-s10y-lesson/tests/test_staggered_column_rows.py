from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def glyph_row(ink, top, left, count, height=40):
    for index in range(count):
        x = left + 35 * index
        ink[top:top + height, x:x + 24] = True


def page_with_normal_rows():
    ink = np.zeros((900, 1400), dtype=bool)
    for top in (40, 110, 180, 650, 720, 790):
        glyph_row(ink, top, 100, 24)
    return ink


def staggered_variables_and_fraction(ink):
    glyph_row(ink, 300, 100, 8, height=39)
    glyph_row(ink, 367, 100, 4, height=38)
    glyph_row(ink, 418, 100, 3, height=36)
    ink[409:413, 100:380] = True
    for left in (630, 750):
        ink[301:332, left:left + 24] = True
        ink[342:346, left - 10:left + 40] = True
        ink[350:381, left:left + 24] = True
    glyph_row(ink, 414, 600, 16)


class StaggeredColumnRows(unittest.TestCase):
    def test_three_independent_variables_survive_two_full_width_peaks(self):
        ink = page_with_normal_rows()
        staggered_variables_and_fraction(ink)
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        # The left column has three rows; the right fraction is one row,
        # aligned with the first, not additional numerator/denominator rows.
        self.assertEqual(len(bands), 9)
        self.assertEqual(sum(300 <= a <= b <= 453 for a, b in bands), 3)
        np.testing.assert_array_equal(ink, original)

    def test_mirrored_columns_do_not_depend_on_left_right_order(self):
        ink = page_with_normal_rows()
        staggered_variables_and_fraction(ink)

        self.assertEqual(len(layout.line_bands(ink[:, ::-1], 1400)), 9)

    def test_parallel_two_row_systems_with_fraction_spill_stay_two(self):
        ink = page_with_normal_rows()
        for left in (180, 750):
            ink[300:440, left:left + 10] = True
            glyph_row(ink, 315, left + 30, 8)
            glyph_row(ink, 385, left + 30, 8)
            ink[290:301, left + 130:left + 165] = True

        self.assertEqual(len(layout.line_bands(ink, 1400)), 8)

    def test_short_fraction_fragments_are_not_three_body_rows(self):
        ink = np.zeros((180, 800), dtype=bool)
        for top in (0, 70, 140):
            ink[top:top + 30, 200:224] = True
            ink[top:top + 30, 330:354] = True

        self.assertFalse(layout._has_column_body_rows(ink, 0, 179, 40, 3))

    def test_one_tall_fraction_with_a_body_baseline_stays_one_row(self):
        ink = page_with_normal_rows()
        ink[300:331, 600:624] = True
        ink[339:343, 580:640] = True
        ink[352:382, 600:624] = True
        ink[387:391, 530:710] = True
        ink[396:426, 570:594] = True
        ink[435:439, 550:610] = True
        ink[448:478, 570:594] = True
        glyph_row(ink, 365, 100, 3)
        glyph_row(ink, 365, 850, 6)

        self.assertEqual(len(layout.line_bands(ink, 1400)), 7)


if __name__ == "__main__":
    unittest.main()
