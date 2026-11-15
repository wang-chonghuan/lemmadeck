"""Small footnote rows and Chinese strokes must not become fraction fragments."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def glyphs(ink, top, left, height, count):
    for index in range(count):
        x = left + index * (height + 8)
        ink[top:top + height, x:x + 4] = True
        ink[top:top + height, x + height - 4:x + height] = True
        for y in (top, top + height // 2, top + height - 4):
            ink[y:y + 4, x:x + height] = True


class SmallFootnoteRowsTest(unittest.TestCase):
    def test_han_horizontal_strokes_are_not_fraction_rules(self):
        ink = np.zeros((110, 800), dtype=bool)
        glyphs(ink, 5, 100, 40, 12)
        glyphs(ink, 70, 100, 40, 2)
        self.assertFalse(layout._single_fraction_row(ink, 0, 109, 40))

    def test_small_footnote_rows_remain_separate_from_body_rows(self):
        ink = np.zeros((800, 800), dtype=bool)
        for top in (100, 170, 240, 310, 380):
            glyphs(ink, top, 100, 40, 12)
        glyphs(ink, 530, 100, 30, 14)
        glyphs(ink, 580, 100, 30, 14)
        self.assertEqual(len(layout.line_bands(ink, 800)), 7)

    def test_genuine_fraction_still_counts_as_one_row(self):
        ink = np.zeros((100, 300), dtype=bool)
        glyphs(ink, 5, 120, 26, 1)
        ink[45:48, 105:165] = True
        glyphs(ink, 65, 120, 26, 1)
        self.assertTrue(layout._single_fraction_row(ink, 0, 99, 40))

    def test_short_second_row_survives_an_isolated_han_stroke(self):
        ink = np.zeros((112, 800), dtype=bool)
        glyphs(ink, 5, 100, 40, 12)
        ink[67:71, 100:138] = True
        ink[78:110, 112:116] = True
        glyphs(ink, 72, 145, 38, 1)
        self.assertFalse(layout._single_fraction_row(ink, 0, 111, 40))


if __name__ == "__main__":
    unittest.main()
