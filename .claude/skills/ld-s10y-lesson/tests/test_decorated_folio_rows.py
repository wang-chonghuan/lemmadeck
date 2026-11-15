import importlib.util
from pathlib import Path
import unittest

import numpy as np
from PIL import Image


SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
SPEC = importlib.util.spec_from_file_location(
    "decorated_folio_layout", SKILL / "tools" / "layout.py"
)
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)

PAGE = REPO / ".tmp/ld-s10y-lesson/6-8g/pages/0037/page.png"
PAGE_SHA256 = "f5e2f8d157c74a2803d8b57f7a6033d28718f0634643be1aa9120a49db17d987"


def glyph(ink, top, left, height=28, width=24):
    ink[top:top + height, left:left + 5] = True
    ink[top:top + height, left + width - 5:left + width] = True
    for offset in (0, height // 2, height - 3):
        ink[top + offset:top + offset + 3, left:left + width] = True


def text_row(ink, top, count=24, tilt=0):
    for column in range(count):
        glyph(ink, top + round(column * tilt), 100 + column * 30)


class DecoratedFolioRowsTests(unittest.TestCase):
    def source_region(self, box):
        if not PAGE.is_file():
            self.skipTest("Prepared p37 PNG is not present")
        self.assertEqual(layout.sha256_file(PAGE), PAGE_SHA256)
        with Image.open(PAGE) as image:
            self.assertEqual(image.size, (1441, 2079))
            ink = layout.ink_mask(image)
        # Keep page coordinates: folio recognition uses the original page height.
        region = np.zeros_like(ink)
        left, top, right, bottom = box
        region[top:bottom, left:right] = ink[top:bottom, left:right]
        return region, right - left

    def test_p37_exercises_79_and_80_have_four_printed_rows(self):
        # Pixel review: two rows per exercise, including short figure references.
        ink, width = self.source_region((150, 645, 1340, 935))
        bands = layout.line_bands(ink, width)
        self.assertEqual(len(bands), 4)
        # Band recovery may partition faint tilted edges; check each row's core.
        for band, row_center in zip(bands, (686, 770, 825, 906)):
            self.assertLessEqual(band[0], row_center)
            self.assertGreaterEqual(band[1], row_center)

    def test_p37_decorated_folio_is_separate_from_final_prose(self):
        # Pixel review: final subpart 2 is one row; dot-27-dot is another.
        ink, width = self.source_region((260, 1850, 1340, 1990))
        bands = layout.line_bands(ink, width)
        self.assertEqual(len(bands), 2)
        self.assertLessEqual(bands[0][0], 1863)
        self.assertGreaterEqual(bands[0][1], 1916)
        self.assertLess(bands[0][1], 1932)
        self.assertGreater(bands[1][0], 1916)
        self.assertLessEqual(bands[1][0], 1932)
        self.assertGreaterEqual(bands[1][1], 1956)

    def test_close_dot_number_dot_does_not_join_previous_row(self):
        ink = np.zeros((1000, 1000), dtype=bool)
        text_row(ink, 910)
        glyph(ink, 940, 630, height=18, width=20)
        glyph(ink, 940, 655, height=18, width=20)
        ink[946:951, 600:605] = True
        ink[946:951, 700:705] = True
        original = ink.copy()

        # One hand-drawn prose row plus one decorated numeral, only 2px apart.
        self.assertEqual(layout.line_bands(ink, 900), [(910, 937), (940, 957)])
        np.testing.assert_array_equal(ink, original)

    def test_four_tilted_glyph_rows_are_not_inline_fractions(self):
        ink = np.zeros((500, 1000), dtype=bool)
        for top in (100, 160, 220, 280):
            text_row(ink, top, tilt=0.9)

        # Four authored baselines; glyph crossbars are not fraction rules.
        self.assertFalse(layout._single_fraction_row(ink, 100, 328, 28))
        self.assertEqual(
            layout.line_bands(ink, 900),
            [(100, 148), (160, 208), (220, 268), (280, 328)],
        )

    def test_single_inline_fraction_is_not_split_into_printed_rows(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text_row(ink, 40)
        text_row(ink, 230)
        glyph(ink, 130, 500)
        glyph(ink, 130, 550)
        glyph(ink, 105, 260)
        ink[138:141, 250:298] = True
        glyph(ink, 146, 260)

        # One numerator/rule/denominator with centered text is ONE printed row.
        self.assertTrue(layout._single_fraction_row(ink, 105, 173, 28))
        self.assertEqual(
            layout.line_bands(ink, 900), [(40, 67), (105, 173), (230, 257)]
        )


if __name__ == "__main__":
    unittest.main()
