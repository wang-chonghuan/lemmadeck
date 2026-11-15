import unittest
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class ShortDigitsTest(unittest.TestCase):
    def page(self):
        ink = np.zeros((900, 1200), dtype=bool)
        for y in (100, 260, 420):
            ink[y:y + 30, 200:230] = True
            ink[y + 42:y + 45, 185:250] = True
            ink[y + 54:y + 84, 200:230] = True
            ink[y + 20:y + 57, 80:105] = True
        return ink

    def test_small_footer_below_tall_fraction_rows(self):
        ink = self.page()
        ink[700:729, 800:816] = True
        ink[701:729, 824:838] = True
        bands = layout.line_bands(ink, 1100)
        self.assertEqual(len(bands), 4)
        self.assertEqual(bands[-1], (700, 728))

    def test_single_short_quotient_survives(self):
        ink = self.page()
        ink[700:729, 800:816] = True
        bands = layout.line_bands(ink, 1100)
        self.assertEqual(len(bands), 4)
        self.assertEqual(bands[-1], (700, 728))

    def test_isolated_scan_streak_still_excluded(self):
        ink = self.page()
        ink[700:704, 600:980] = True
        self.assertEqual(len(layout.line_bands(ink, 1100)), 3)

    def test_small_isolated_blemish_is_not_a_digit(self):
        ink = self.page()
        ink[700:709, 800:815] = True
        self.assertEqual(len(layout.line_bands(ink, 1100)), 3)

    def test_distant_tiny_noise_does_not_widen_footer(self):
        ink = self.page()
        ink[700:729, 800:816] = True
        ink[701:729, 824:838] = True
        ink[700:703, 300:305] = True
        ink[701:702, 312:313] = True
        self.assertEqual(len(layout.line_bands(ink, 1100)), 4)

    def test_full_text_row_after_fraction_remains_separate(self):
        ink = self.page()
        ink[526:563, 80:105] = True
        ink[526:563, 200:230] = True
        bands = layout.line_bands(ink, 1100)
        self.assertEqual(len(bands), 4)
        self.assertIn((526, 562), bands)


if __name__ == "__main__":
    unittest.main()
