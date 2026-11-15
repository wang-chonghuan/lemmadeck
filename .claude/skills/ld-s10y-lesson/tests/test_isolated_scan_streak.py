"""Thin isolated scan streaks are not rows; fraction rules and digits are."""
from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class IsolatedScanStreakTests(unittest.TestCase):
    def text_rows(self):
        ink = np.zeros((420, 500), dtype=bool)
        for y in (40, 105, 170):
            for x in (50, 95, 140, 185):
                ink[y:y + 35, x:x + 25] = True
        return ink

    def test_distant_thin_streak_does_not_add_row(self):
        ink = self.text_rows()
        ink[350:354, 100:390] = True
        self.assertEqual(len(layout.line_bands(ink, 450)), 3)
        self.assertTrue(ink[350:354, 100:390].all())

    def test_standalone_digit_remains_a_row(self):
        ink = self.text_rows()
        ink[350:385, 100:116] = True
        self.assertEqual(len(layout.line_bands(ink, 450)), 4)

    def test_thin_fraction_rule_between_glyphs_remains(self):
        ink = self.text_rows()
        ink[275:305, 160:200] = True
        ink[312:315, 120:245] = True
        ink[323:353, 160:200] = True
        bands = layout.line_bands(ink, 450)
        self.assertEqual(len(bands), 4)
        self.assertTrue(any(a <= 275 and b >= 352 for a, b in bands))


if __name__ == "__main__":
    unittest.main()
