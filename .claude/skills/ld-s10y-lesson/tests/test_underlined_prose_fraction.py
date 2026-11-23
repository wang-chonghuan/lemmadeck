import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class UnderlinedProseFractionTests(unittest.TestCase):
    def prose(self):
        ink = np.zeros((300, 1100), dtype=bool)
        for top in (40, 150):
            for left in range(100, 901, 60):
                ink[top:top + 50, left:left + 40] = True
            for x in range(100, 941):
                y = top + 57 + (x % 20 if x % 20 < 10 else 19 - x % 20)
                ink[y:y + 3, x] = True
        return ink

    def fraction(self):
        ink = np.zeros((230, 600), dtype=bool)
        ink[30:70, 260:290] = True
        ink[85:89, 240:320] = True
        ink[105:145, 260:290] = True
        return ink

    def test_wavy_underlines_do_not_support_a_fraction(self):
        self.assertFalse(layout._fraction_across_split(self.prose(), 40, 130, 215, 50))

    def test_underlined_prose_remains_two_rows(self):
        self.assertEqual(len(layout.line_bands(self.prose(), 841)), 2)

    def test_straight_fraction_bar_still_supported(self):
        self.assertTrue(layout._fraction_across_split(self.fraction(), 30, 87, 145, 40))

    def test_single_fraction_remains_one_row(self):
        self.assertEqual(len(layout.line_bands(self.fraction(), 80)), 1)


if __name__ == "__main__":
    unittest.main()
