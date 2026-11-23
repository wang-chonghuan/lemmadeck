"""Solid margin smears are noise; printed strokes and body rows are not."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from layout import line_bands


class MarginCoreLineBandsTests(unittest.TestCase):
    def page(self):
        ink = np.zeros((500, 1695), dtype=bool)
        for top in (20, 320):
            for left in range(200, 800, 60):
                ink[top:top + 40, left:left + 35] = True
        return ink

    def smear(self, ink, left, top=150):
        ink[top:top + 10, left:left + 20] = True
        ink[top + 5:top + 25, left + 10:left + 40] = True

    def outline(self, ink, left, top, height=25, width=40):
        ink[top:top + 2, left:left + width] = True
        ink[top + height - 2:top + height, left:left + width] = True
        ink[top:top + height, left:left + 2] = True
        ink[top:top + height, left + width - 2:left + width] = True

    def test_shallow_solid_margin_smear_is_not_a_row(self):
        for left in (24, int(0.95 * 1695)):
            with self.subTest(left=left):
                ink = self.page()
                self.smear(ink, left)
                original = ink.copy()
                self.assertEqual(line_bands(ink, 1659), [(20, 59), (320, 359)])
                np.testing.assert_array_equal(ink, original)

    def test_smear_stays_noise_when_body_glyph_estimate_changes(self):
        for height in (36, 38, 40):
            with self.subTest(height=height):
                ink = self.page()
                ink[20 + height:60] = False
                ink[320 + height:360] = False
                self.smear(ink, 24)
                self.assertEqual(
                    line_bands(ink, 1659),
                    [(20, 19 + height), (320, 319 + height)],
                )

    def test_interior_ink_is_not_discarded_as_margin_noise(self):
        ink = self.page()
        self.smear(ink, 400)
        self.assertEqual(
            line_bands(ink, 1659), [(20, 59), (150, 174), (320, 359)]
        )

    def test_neighboring_margin_ink_blocks_smear_removal(self):
        ink = self.page()
        self.outline(ink, 24, 80, height=40, width=35)
        self.smear(ink, 24)
        self.assertEqual(
            line_bands(ink, 1659),
            [(20, 59), (80, 119), (150, 174), (320, 359)],
        )

    def test_shallow_printed_outline_is_not_a_solid_core(self):
        for left in (24, int(0.95 * 1695)):
            with self.subTest(left=left):
                ink = self.page()
                self.outline(ink, left, 150)
                self.assertEqual(
                    line_bands(ink, 1659), [(20, 59), (150, 174), (320, 359)]
                )

    def test_standalone_margin_quotient_stays_visible(self):
        for left in (24, int(0.95 * 1695)):
            with self.subTest(left=left):
                ink = self.page()
                ink[150:190, left + 8:left + 12] = True
                ink[150:154, left:left + 12] = True
                ink[186:190, left:left + 14] = True
                self.assertEqual(
                    line_bands(ink, 1659), [(20, 59), (150, 189), (320, 359)]
                )

    def test_two_single_glyph_body_rows_remain_separate(self):
        ink = self.page()
        for top in (150, 230):
            self.outline(ink, 24, top, height=40, width=35)
        self.assertEqual(
            line_bands(ink, 1659),
            [(20, 59), (150, 189), (230, 269), (320, 359)],
        )


if __name__ == "__main__":
    unittest.main()
