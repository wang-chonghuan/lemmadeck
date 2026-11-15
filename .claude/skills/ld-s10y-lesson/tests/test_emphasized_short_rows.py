"""Independent printed-row expectations for emphasis and short text."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class EmphasizedShortRowsTest(unittest.TestCase):
    def glyphs(self, ink, top, left, count):
        for index in range(count):
            x = left + index * 40
            for dx in (0, 14, 29):
                ink[top:top + 40, x + dx:x + dx + 3] = True
            for dy in (0, 19, 38):
                ink[top + dy:top + dy + 2, x:x + 32] = True

    def emphasis_dots(self, ink, top, left, count):
        for index in range(count):
            x = left + index * 40 + 13
            ink[top:top + 8, x:x + 5] = True

    def context_page(self):
        ink = np.zeros((850, 1000), dtype=bool)
        for top in (30, 110, 190, 540, 620, 700):
            self.glyphs(ink, top, 50, 22)
        return ink

    def check_rows(self, ink, expected_total, expected_local):
        before = ink.copy()
        bands = layout.line_bands(ink, 1000)
        np.testing.assert_array_equal(ink, before)
        self.assertEqual(len(bands), expected_total)
        self.assertEqual(
            len([(a, b) for a, b in bands if 260 < a < 500]),
            expected_local,
        )

    def test_emphasized_two_glyph_row_between_full_rows(self):
        ink = self.context_page()
        self.glyphs(ink, 280, 110, 22)
        self.emphasis_dots(ink, 329, 110, 22)
        self.glyphs(ink, 352, 50, 2)
        self.emphasis_dots(ink, 401, 50, 2)
        self.glyphs(ink, 424, 110, 22)

        # Three text rows; emphasis dots add no printed rows.
        self.check_rows(ink, expected_total=9, expected_local=3)

    def test_midgap_dots_do_not_create_a_third_text_row(self):
        ink = self.context_page()
        self.glyphs(ink, 280, 110, 22)
        self.emphasis_dots(ink, 329, 110, 22)
        self.glyphs(ink, 424, 110, 22)
        self.emphasis_dots(ink, 352, 50, 2)

        self.check_rows(ink, expected_total=8, expected_local=2)

    def test_fraction_parts_remain_one_printed_row(self):
        ink = self.context_page()
        self.glyphs(ink, 280, 200, 8)
        ink[328:331, 180:530] = True
        self.glyphs(ink, 342, 280, 3)

        self.check_rows(ink, expected_total=7, expected_local=1)


if __name__ == "__main__":
    unittest.main()
