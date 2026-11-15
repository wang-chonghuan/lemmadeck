"""Independent expectations for small-font prose rows versus one fraction."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SmallFootnoteRowsTest(unittest.TestCase):
    def glyphs(self, ink, top, left, count, height, width=None):
        width = height if width is None else width
        for index in range(count):
            x = left + index * (width + 5)
            ink[top:top + height, x:x + 2] = True
            ink[top:top + height, x + width // 2:x + width // 2 + 2] = True
            ink[top:top + height, x + width - 2:x + width] = True
            for y in (top, top + height // 2, top + height - 2):
                ink[y:y + 2, x:x + width] = True

    def body_page(self):
        ink = np.zeros((500, 1000), dtype=bool)
        for top in (20, 100, 180):
            self.glyphs(ink, top, 60, 18, 42)
        return ink

    def test_two_small_footnote_rows_with_short_continuation(self):
        ink = self.body_page()
        self.glyphs(ink, 280, 90, 22, 30)
        self.glyphs(ink, 322, 30, 5, 30)
        before = ink.copy()

        bands = layout.line_bands(ink, 1000)

        self.assertEqual(bands, [
            (20, 61), (100, 141), (180, 221), (280, 309), (322, 351),
        ])
        np.testing.assert_array_equal(ink, before)

    def test_small_fraction_is_one_printed_row(self):
        ink = self.body_page()
        self.glyphs(ink, 280, 180, 9, 30)
        ink[318:321, 160:510] = True
        self.glyphs(ink, 329, 180, 3, 30)

        self.assertEqual(layout.line_bands(ink, 1000), [
            (20, 61), (100, 141), (180, 221), (280, 358),
        ])

    def test_centered_small_fraction_is_not_a_prose_continuation(self):
        ink = self.body_page()
        self.glyphs(ink, 280, 90, 18, 30)
        ink[318:321, 70:730] = True
        self.glyphs(ink, 329, 330, 5, 30)

        self.assertEqual(layout.line_bands(ink, 1000), [
            (20, 61), (100, 141), (180, 221), (280, 358),
        ])


if __name__ == "__main__":
    unittest.main()
