"""Printed separator symbols count as one row; rules and specks do not."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SpacedSeparatorRowTest(unittest.TestCase):
    def page(self):
        ink = np.zeros((240, 1000), dtype=bool)
        ink[40:80, 100:850] = True
        ink[170:210, 100:850] = True
        return ink

    def symbols(self, ink, positions=(240, 500, 760)):
        for left in positions:
            for i in range(15):
                ink[110 + i, left + i] = True
                ink[110 + i, left + 14 - i] = True
            ink[116:119, left:left + 15] = True
            ink[110:125, left + 6:left + 9] = True

    def test_three_aligned_spaced_symbols_are_one_printed_row(self):
        ink = self.page()
        self.symbols(ink)
        self.assertEqual(layout.line_bands(ink, 750), [(40, 79), (110, 124), (170, 209)])

    def test_thin_horizontal_rule_does_not_add_a_row(self):
        ink = self.page()
        ink[110:114, 100:850] = True
        self.assertEqual(len(layout.line_bands(ink, 750)), 2)

    def test_three_tiny_specks_do_not_add_a_row(self):
        ink = self.page()
        for left in (240, 500, 760):
            ink[110:113, left:left + 3] = True
        self.assertEqual(len(layout.line_bands(ink, 750)), 2)

    def test_irregularly_spaced_isolated_marks_do_not_add_a_row(self):
        ink = self.page()
        self.symbols(ink, (180, 270, 780))
        self.assertEqual(len(layout.line_bands(ink, 750)), 2)


if __name__ == "__main__":
    unittest.main()
