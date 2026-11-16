import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _single_fraction_row, line_bands


class VectorArrowRowsTest(unittest.TestCase):
    def test_slightly_shorter_second_row_is_not_a_fraction(self):
        ink = np.zeros((116, 400), dtype=bool)
        for left in (20, 80, 140):
            ink[:41, left:left + 38] = True
            ink[74:114, left:left + 38] = True
        ink[61:64, 260:325] = True
        ink[58:67, 322:325] = True

        self.assertFalse(_single_fraction_row(ink, 0, 115, 41))
        self.assertEqual(len(line_bands(ink, 400)), 2)

    def test_small_fraction_denominator_stays_on_one_row(self):
        ink = np.zeros((125, 300), dtype=bool)
        for left in (20, 70, 120):
            ink[35:76, left:left + 38] = True
        ink[5:35, 210:230] = True
        ink[54:57, 205:240] = True
        ink[80:104, 210:230] = True

        self.assertTrue(_single_fraction_row(ink, 0, 124, 40))
        self.assertEqual(len(line_bands(ink, 300)), 1)

    def test_full_size_fraction_denominator_stays_on_one_row(self):
        ink = np.zeros((125, 300), dtype=bool)
        for left in (20, 70, 120):
            ink[35:76, left:left + 38] = True
        ink[5:35, 210:230] = True
        ink[54:57, 205:240] = True
        ink[79:109, 210:230] = True

        self.assertTrue(_single_fraction_row(ink, 0, 124, 40))
        self.assertEqual(len(line_bands(ink, 300)), 1)


if __name__ == "__main__":
    unittest.main()
