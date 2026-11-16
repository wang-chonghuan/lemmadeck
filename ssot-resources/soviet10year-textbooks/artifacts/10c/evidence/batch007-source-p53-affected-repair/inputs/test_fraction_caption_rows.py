"""A compact fraction envelope must not absorb a separately printed caption."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _single_fraction_row


class FractionCaptionRows(unittest.TestCase):
    def fraction(self):
        ink = np.zeros((95, 300), dtype=bool)
        ink[40:43, 90:137] = True
        ink[12:30, 105:120] = True
        ink[53:73, 105:120] = True
        ink[11:53, 20:40] = True
        ink[13:48, 55:72] = True
        return ink

    def test_lower_caption_is_a_separate_row(self):
        ink = self.fraction()
        ink[60:95, 220:241] = True
        ink[65:91, 260:273] = True
        self.assertFalse(_single_fraction_row(ink, 0, 94, 43))

    def test_caption_at_same_height_is_one_row(self):
        ink = self.fraction()
        ink[14:49, 220:241] = True
        ink[18:44, 260:273] = True
        self.assertTrue(_single_fraction_row(ink, 0, 94, 43))

    def test_fraction_without_caption_is_one_row(self):
        self.assertTrue(_single_fraction_row(self.fraction(), 0, 94, 43))

    def test_staggered_caption_overlapping_glyph_rows_is_one_row(self):
        ink = self.fraction()
        ink[45:80, 220:241] = True
        ink[46:81, 260:273] = True
        self.assertTrue(_single_fraction_row(ink, 0, 94, 43))

    def test_separate_caption_to_left_is_also_rejected(self):
        ink = self.fraction()
        ink[60:95, 0:14] = True
        self.assertFalse(_single_fraction_row(ink, 0, 94, 43))


if __name__ == "__main__":
    unittest.main()
