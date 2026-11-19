import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout


class SupportedFractionFragmentsTests(unittest.TestCase):
    def text_page(self, offset=0):
        ink = np.zeros((600, 500), dtype=bool)
        for y in (250, 340, 430):
            for x in range(70, 420, 40):
                ink[y + offset:y + offset + 31, x:x + 18] = True
        return ink

    def fraction(self, ink, top):
        ink[top:top + 3, 170:200] = True
        ink[top:top + 34, 170:175] = True
        ink[top + 15:top + 34, 110:126] = True
        ink[top + 48:top + 52, 105:200] = True
        ink[top + 67:top + 91, 138:152] = True

    def test_fragmented_numerator_and_narrow_denominator_are_one_row(self):
        ink = self.text_page()
        self.fraction(ink, 70)
        before = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 500)), 4)
        np.testing.assert_array_equal(ink, before)

    def test_two_fraction_rows_remain_two_rows(self):
        ink = self.text_page(50)
        self.fraction(ink, 55)
        self.fraction(ink, 155)
        self.assertEqual(len(layout.line_bands(ink, 500)), 5)

    def test_unsupported_thin_streak_remains_excluded(self):
        ink = self.text_page()
        ink[35:39, 60:420] = True
        self.assertEqual(len(layout.line_bands(ink, 500)), 3)

    def test_two_close_full_text_rows_are_not_a_fraction(self):
        ink = np.zeros((160, 500), dtype=bool)
        for top in (40, 87):
            for x in range(70, 420, 40):
                ink[top:top + 31, x:x + 18] = True
        self.assertEqual(len(layout.line_bands(ink, 500)), 2)

    def reviewed_page(self, page, count, fraction_span, following_span):
        png = TOOLS.parents[3] / f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png"
        if not png.exists():
            self.skipTest("Prepared source pixels are unavailable.")
        ink = layout.ink_mask(Image.open(png))
        before = ink.copy()
        columns = np.flatnonzero(ink.any(axis=0))
        bands = layout.line_bands(ink, int(columns[-1] - columns[0] + 1))
        self.assertEqual(len(bands), count)
        self.assertTrue(any(a <= fraction_span[0] and b >= fraction_span[1]
                            for a, b in bands))
        self.assertTrue(any(a <= following_span[0] and b >= following_span[1]
                            for a, b in bands))
        self.assertFalse(any(a <= fraction_span[0] and b >= following_span[1]
                             for a, b in bands))
        np.testing.assert_array_equal(ink, before)

    def test_reviewed_261_fraction_keeps_following_prose_separate(self):
        self.reviewed_page(261, 20, (1542, 1629), (1672, 1710))

    def test_reviewed_264_fraction_keeps_next_formula_separate(self):
        self.reviewed_page(264, 25, (238, 316), (362, 426))


if __name__ == "__main__":
    unittest.main()
