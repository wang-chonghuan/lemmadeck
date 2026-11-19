import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout


class RadicalOverbarMarginOutlineTests(unittest.TestCase):
    def test_radical_overbar_is_not_a_second_fraction_baseline(self):
        ink = np.zeros((92, 560), dtype=bool)
        ink[2:5, 70:180] = True
        ink[0:2, 75:78] = True
        ink[18:40, 95:115] = True
        ink[50:53, 90:170] = True
        ink[64:91, 115:133] = True
        ink[10:40, 250:270] = True
        ink[10:40, 310:330] = True
        ink[50:53, 230:370] = True
        ink[64:91, 280:298] = True
        ink[30:67, 410:430] = True
        before = ink.copy()
        self.assertTrue(layout._single_fraction_row(ink, 0, 91, 33))
        np.testing.assert_array_equal(ink, before)

    def test_two_fraction_rows_keep_their_separate_baselines(self):
        ink = np.zeros((165, 560), dtype=bool)
        for top in (0, 90):
            ink[top:top + 25, 110:128] = True
            ink[top + 35:top + 38, 80:180] = True
            ink[top + 50:top + 75, 130:148] = True
        self.assertFalse(layout._single_fraction_row(ink, 0, 164, 33))

    def margin_page(self):
        ink = np.zeros((1000, 600), dtype=bool)
        for y in (230, 320, 410):
            for x in range(90, 490, 45):
                ink[y:y + 38, x:x + 24] = True
        return ink

    def test_isolated_sparse_top_outline_is_not_text(self):
        ink = self.margin_page()
        for index in range(56):
            x = 360 + index
            ink[55 + index:58 + index, x:x + 39] = True
        before = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 600)), 3)
        np.testing.assert_array_equal(ink, before)

    def test_title_glyphs_in_top_margin_survive(self):
        ink = self.margin_page()
        for x in range(90, 490, 45):
            ink[55:93, x:x + 24] = True
        self.assertEqual(len(layout.line_bands(ink, 600)), 4)

    def reviewed_page(self, page, expected):
        png = TOOLS.parents[3] / f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png"
        if not png.exists():
            self.skipTest("Prepared source pixels are unavailable.")
        ink = layout.ink_mask(Image.open(png))
        columns = np.flatnonzero(ink.any(axis=0))
        before = ink.copy()
        self.assertEqual(
            len(layout.line_bands(ink, int(columns[-1] - columns[0] + 1))),
            expected,
        )
        np.testing.assert_array_equal(ink, before)

    def test_reviewed_251_has_nineteen_rows(self):
        self.reviewed_page(251, 19)

    def test_reviewed_258_has_twenty_one_rows(self):
        self.reviewed_page(258, 21)


if __name__ == "__main__":
    unittest.main()
