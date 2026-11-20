import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def glyph(ink, x, y, width=20, height=32):
    ink[y:y + height, x:x + 3] = True
    ink[y:y + height, x + width - 3:x + width] = True
    ink[y:y + 3, x:x + width] = True
    ink[y + height - 3:y + height, x:x + width] = True


class AdjacentCaptionRowsTest(unittest.TestCase):
    def test_bold_description_above_two_side_by_side_figure_numbers(self):
        ink = np.zeros((160, 800), dtype=bool)
        glyph(ink, 530, 20)
        glyph(ink, 570, 20, width=95)
        for x in (170, 210, 240, 530, 570, 600):
            glyph(ink, x, 65, width=20, height=30)
        self.assertTrue(layout._separate_caption_rows(ink, 20, 51, 65, 94, 40))
        self.assertTrue(layout._separate_caption_rows(ink, 21, 50, 66, 93, 40))
        self.assertEqual(layout.line_bands(ink, 800), [(20, 51), (65, 94)])

    def test_multi_glyph_fraction_remains_one_row(self):
        ink = np.zeros((160, 800), dtype=bool)
        for x in (310, 350):
            glyph(ink, x, 20)
            glyph(ink, x, 75)
        ink[62:65, 295:385] = True
        self.assertFalse(layout._separate_caption_rows(ink, 20, 51, 75, 106, 40))
        self.assertEqual(len(layout.line_bands(ink, 800)), 1)

    def test_broken_glyph_fragments_are_not_caption_rows(self):
        ink = np.zeros((120, 800), dtype=bool)
        for x in (310, 350):
            glyph(ink, x, 20, height=8)
            glyph(ink, x, 35)
        self.assertFalse(layout._separate_caption_rows(ink, 20, 27, 35, 66, 40))


if __name__ == "__main__":
    unittest.main()
