"""Tall fractions stay single rows without absorbing neighboring body rows."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from layout import line_bands


class FractionLineBandsTests(unittest.TestCase):
    def fraction_page(self, *, blot=False, body=False):
        ink = np.zeros((360, 1695), dtype=bool)
        for x in range(200, 800, 60):
            ink[20:60, x:x + 35] = True
        ink[100:140, 610:640] = True
        ink[157:197, 610:640] = True
        ink[147:150, 570:700] = True
        ink[132:172, 500:530] = True
        ink[132:172, 760:790] = True
        if blot:
            left = int(0.95 * ink.shape[1])
            ink[195:230, left:left + 42] = True
        if body:
            for x in range(200, 1100, 60):
                ink[242:282, x:x + 35] = True
        return ink

    def test_tall_fraction_is_one_row(self):
        self.assertEqual(
            line_bands(self.fraction_page(), 1499),
            [(20, 59), (100, 196)],
        )

    def test_margin_blot_does_not_extend_fraction(self):
        self.assertEqual(
            line_bands(self.fraction_page(blot=True), 1499),
            [(20, 59), (100, 196)],
        )

    def test_margin_blot_does_not_join_fraction_to_body(self):
        self.assertEqual(
            line_bands(self.fraction_page(blot=True, body=True), 1499),
            [(20, 59), (100, 196), (242, 281)],
        )

    def test_true_body_rows_remain_separate(self):
        ink = np.zeros((300, 1695), dtype=bool)
        for top in (20, 100, 168):
            for x in range(200, 800, 60):
                ink[top:top + 40, x:x + 35] = True
        self.assertEqual(
            line_bands(ink, 1499), [(20, 59), (100, 139), (168, 207)],
        )


if __name__ == "__main__":
    unittest.main()
