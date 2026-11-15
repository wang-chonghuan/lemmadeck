"""Independent row expectations for prose, footer digits and real fractions."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class ProseFooterFractionConfusionTest(unittest.TestCase):
    def glyphs(
        self, ink, top, left, count, height=40, width=32, stagger=False
    ):
        for index in range(count):
            x = left + index * 40
            y = top + (index % 8 if stagger else index % 6)
            for dx in (0, width // 2, width - 3):
                ink[y:y + height, x + dx:x + dx + 3] = True
            for dy in (0, height // 2, height - 2):
                ink[y + dy:y + dy + 2, x:x + width] = True

    def context_page(self):
        ink = np.zeros((800, 1504), dtype=bool)
        for top in (30, 110, 190, 270, 350):
            self.glyphs(ink, top, 100, 26)
        return ink

    def final_prose_row(self, ink):
        self.glyphs(ink, 500, 196, 19, stagger=True)

    def emphasis_dots(self, ink):
        ink[557:565, 882:890] = True
        ink[557:565, 925:933] = True

    def page_footer(self, ink):
        self.glyphs(ink, 580, 251, 2, height=26, width=16)
        ink[589:597, 210:220] = True
        ink[589:597, 330:340] = True

    def check_rows(self, ink, expected_total, expected_local):
        before = ink.copy()
        bands = layout.line_bands(ink, 1504)
        np.testing.assert_array_equal(ink, before)
        self.assertEqual(len(bands), expected_total)
        self.assertEqual(
            len([(a, b) for a, b in bands if a >= 480]),
            expected_local,
        )

    def test_prose_and_separate_footer_are_two_rows(self):
        ink = self.context_page()
        self.final_prose_row(ink)
        self.emphasis_dots(ink)
        self.page_footer(ink)

        # Five context rows, one prose row and one footer row.
        self.check_rows(ink, expected_total=7, expected_local=2)

    def test_prose_with_emphasis_but_no_footer_is_one_row(self):
        ink = self.context_page()
        self.final_prose_row(ink)
        self.emphasis_dots(ink)

        # Emphasis dots do not add another printed row.
        self.check_rows(ink, expected_total=6, expected_local=1)

    def test_real_fraction_with_small_denominator_is_one_row(self):
        ink = self.context_page()
        self.glyphs(ink, 500, 350, 8)
        ink[550:553, 320:700] = True
        self.glyphs(ink, 566, 430, 2, height=26, width=16)

        # Numerator, independent rule and denominator form one printed row.
        self.check_rows(ink, expected_total=6, expected_local=1)


if __name__ == "__main__":
    unittest.main()
