import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _single_fraction_row, line_bands


def glyphs(ink, y, x=100, count=12):
    for column in range(count):
        left = x + 35 * column
        ink[y:y + 40, left:left + 24] = True


def fraction_row(ink, y):
    for x in [180, 360, 540]:
        ink[y:y + 30, x:x + 24] = True
        ink[y + 35:y + 39, x - 4:x + 36] = True
        ink[y + 43:y + 78, x:x + 24] = True


class FractionLineSpacing(unittest.TestCase):
    def test_fraction_heights_do_not_merge_neighboring_text(self):
        ink = np.zeros((1000, 1000), dtype=bool)
        glyphs(ink, 40)
        fraction_row(ink, 110)
        fraction_row(ink, 240)
        fraction_row(ink, 370)
        glyphs(ink, 480)
        fraction_row(ink, 550)
        glyphs(ink, 660)
        self.assertEqual(len(line_bands(ink, 900)), 7)

    def test_isolated_shallow_blot_is_not_a_printed_line(self):
        ink = np.zeros((500, 1000), dtype=bool)
        glyphs(ink, 40)
        glyphs(ink, 150)
        glyphs(ink, 260)
        ink[205:225, 200:265] = True
        self.assertEqual(len(line_bands(ink, 900)), 3)

    def test_normal_narrow_digit_and_fraction_rule_are_preserved(self):
        ink = np.zeros((500, 1000), dtype=bool)
        glyphs(ink, 40)
        ink[150:190, 200:216] = True
        fraction_row(ink, 260)
        self.assertEqual(len(line_bands(ink, 900)), 3)

    def test_connected_fraction_rules_and_tall_parentheses_are_one_row(self):
        ink = np.zeros((180, 1000), dtype=bool)
        glyphs(ink, 60, count=3)
        for x in [300, 480, 660]:
            ink[42:72, x:x + 20] = True
            ink[75:79, x - 4:x + 28] = True
            ink[82:119, x - 3:x + 28] = True
            ink[68:86, x + 5:x + 8] = True
        ink[40:121, 270:279] = True
        ink[40:121, 720:729] = True
        self.assertTrue(_single_fraction_row(ink, 40, 120, 40))

    def test_fraction_prose_and_side_caption_share_one_printed_row(self):
        ink = np.zeros((180, 1000), dtype=bool)
        glyphs(ink, 60, count=4)
        fraction_row(ink, 40)
        glyphs(ink, 98, x=760, count=3)
        self.assertTrue(_single_fraction_row(ink, 40, 137, 40))

    def test_fraction_above_independent_full_text_row_stays_two_rows(self):
        ink = np.zeros((220, 1000), dtype=bool)
        fraction_row(ink, 40)
        glyphs(ink, 140, count=20)
        self.assertFalse(_single_fraction_row(ink, 40, 179, 40))

    def test_short_previous_sentence_is_not_fraction_spill(self):
        ink = np.zeros((700, 1000), dtype=bool)
        glyphs(ink, 40)
        glyphs(ink, 140, x=180, count=2)
        fraction_row(ink, 200)
        glyphs(ink, 360)
        glyphs(ink, 470)
        self.assertEqual(len(line_bands(ink, 900)), 5)


if __name__ == "__main__":
    unittest.main()
