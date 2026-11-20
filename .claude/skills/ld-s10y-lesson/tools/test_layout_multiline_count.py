"""Printed-baseline contract: systems add rows, fraction stacks do not."""
import argparse
import hashlib
import json
from pathlib import Path
import unittest

import numpy as np
from PIL import Image

from layout import ink_mask, line_bands


def glyph(ink, x, y, width=20, height=30, stroke=3):
    ink[y:y + height, x:x + stroke] = True
    ink[y:y + height, x + width - stroke:x + width] = True
    ink[y:y + stroke, x:x + width] = True
    ink[y + height - stroke:y + height, x:x + width] = True


def text_row(ink, y, x=100, count=10, height=30):
    for index in range(count):
        glyph(ink, x + index * 28, y, height=height)


def brace(ink, x, top, bottom):
    middle = (top + bottom) // 2
    ink[top:middle, x + 8:x + 13] = True
    ink[middle:bottom, x:x + 5] = True
    ink[middle - 2:middle + 3, x:x + 13] = True


def system(ink, y, rows=2, paired=True):
    columns = (120, 450) if paired else (120,)
    for column in columns:
        for index in range(rows):
            text_row(ink, y + 52 * index, x=column, count=7)
        brace(ink, column - 22, y, y + 52 * (rows - 1) + 30)
        glyph(ink, column - 60, y + 26 * (rows - 1))


def fraction(ink, x, y, width=40, nested=False):
    glyph(ink, x + 12, y, width=16, height=26)
    ink[y + 34:y + 37, x:x + width] = True
    if nested:
        glyph(ink, x + 12, y + 46, width=16, height=26)
        ink[y + 80:y + 83, x + 4:x + width - 4] = True
        glyph(ink, x + 12, y + 92, width=16, height=26)
    else:
        glyph(ink, x + 10, y + 46, height=26)


class MultilineCountTest(unittest.TestCase):
    def assert_rows(self, ink, expected):
        original = ink.copy()
        bands = line_bands(ink, ink.shape[1] - 40)
        self.assertEqual(len(bands), expected, bands)
        np.testing.assert_array_equal(ink, original)
        self.assertTrue(all(a <= b for a, b in bands))
        self.assertTrue(all(b < c for (_, b), (c, _) in zip(bands, bands[1:])))
        return bands

    def test_majority_paired_two_equation_systems(self):
        ink = np.zeros((800, 900), dtype=bool)
        text_row(ink, 15)
        for y in (70, 190, 310, 430, 550):
            system(ink, y)
        text_row(ink, 710, count=2, height=20)
        self.assert_rows(ink, 12)

    def test_three_equations_and_parallel_systems_share_rows(self):
        ink = np.zeros((400, 900), dtype=bool)
        text_row(ink, 15)
        system(ink, 90, rows=3)
        text_row(ink, 310, count=2, height=20)
        self.assert_rows(ink, 5)

    def test_single_column_two_equation_system(self):
        ink = np.zeros((350, 900), dtype=bool)
        text_row(ink, 15)
        system(ink, 100, paired=False)
        text_row(ink, 260, count=2, height=20)
        self.assert_rows(ink, 4)

    def test_labels_overlapping_equation_ink_are_not_independent(self):
        ink = np.zeros((400, 900), dtype=bool)
        text_row(ink, 15)
        system(ink, 100)
        text_row(ink, 310, count=2, height=20)
        self.assert_rows(ink, 4)

    def test_single_reciprocal_baseline_above_full_equation(self):
        ink = np.zeros((400, 900), dtype=bool)
        text_row(ink, 15)
        for x in (140, 210, 310, 470, 540, 640):
            fraction(ink, x, 90)
        text_row(ink, 190, x=140, count=7)
        text_row(ink, 190, x=470, count=7)
        text_row(ink, 320, count=2, height=20)
        bands = self.assert_rows(ink, 4)
        self.assertTrue(any(a <= 90 and b >= 161 for a, b in bands), bands)

    def test_short_fraction_rules_with_lower_centred_sublabels(self):
        ink = np.zeros((400, 900), dtype=bool)
        text_row(ink, 15)
        for x in (140, 210, 310, 470, 540, 640):
            fraction(ink, x, 90)
        for x in (270, 600):
            glyph(ink, x, 122)
        for x in (70, 400):
            glyph(ink, x, 139)
        text_row(ink, 210, x=140, count=7)
        text_row(ink, 210, x=470, count=7)
        text_row(ink, 320, count=2, height=20)
        bands = self.assert_rows(ink, 4)
        self.assertTrue(any(a <= 90 and b >= 168 for a, b in bands), bands)

    def test_single_tall_fraction(self):
        ink = np.zeros((350, 900), dtype=bool)
        text_row(ink, 15)
        fraction(ink, 150, 100)
        text_row(ink, 260, count=2, height=20)
        self.assert_rows(ink, 3)

    def test_single_nested_stacked_fraction(self):
        ink = np.zeros((400, 900), dtype=bool)
        text_row(ink, 15)
        fraction(ink, 150, 100, width=96, nested=True)
        text_row(ink, 320, count=2, height=20)
        self.assert_rows(ink, 3)

    def test_two_fraction_equations_are_two_rows(self):
        ink = np.zeros((500, 900), dtype=bool)
        text_row(ink, 15)
        for y in (100, 210):
            for x in (140, 210, 310):
                fraction(ink, x, y)
        brace(ink, 110, 100, 282)
        text_row(ink, 390, count=2, height=20)
        self.assert_rows(ink, 4)

    def test_nearby_full_text_rows_stay_separate(self):
        ink = np.zeros((220, 900), dtype=bool)
        text_row(ink, 50)
        text_row(ink, 90)
        self.assert_rows(ink, 2)

    def test_isolated_dense_bottom_edge_blot_is_not_a_row(self):
        ink = np.zeros((600, 900), dtype=bool)
        for y in (50, 200):
            text_row(ink, y)
        text_row(ink, 470, count=2, height=20)
        yy, xx = np.ogrid[:20, :18]
        ink[575:595, 210:228] = (
            ((yy - 9.5) / 10) ** 2 + ((xx - 8.5) / 9) ** 2 <= 1
        )
        self.assert_rows(ink, 3)

    def test_short_outline_footer_at_bottom_edge_is_retained(self):
        ink = np.zeros((600, 900), dtype=bool)
        for y in (50, 200):
            text_row(ink, y)
        glyph(ink, 210, 575, width=18, height=20, stroke=2)
        self.assert_rows(ink, 3)


class ReviewedPageCountTest(unittest.TestCase):
    source_root = None
    fixtures = {
        66: (26, "2874fe3003762f0ca5484e44dc04461320bac38de9f46899e3c2989309b5a121"),
        67: (25, "9f82b6b7cb38365fea228743b8deaa6e8dbb2497e5fab7d05679c12c0e21ca9c"),
        72: (26, "85cc2a807c3b1e310a5db266cb13938422e19523417a339031575cc53faaf44c"),
        73: (20, "82f5d8938d16bff784e2956498fddd4084a2d7a5d2e95c4d54c083939a8b8516"),
    }
    figure_masks = {73: (346, 1930, 1724, 611)}

    def setUp(self):
        if self.source_root is None:
            self.skipTest("Supply --source-root for the reviewed numerical fixtures.")

    def check_page(self, page):
        # p72/p73 use the affected independent convention correction, not FIRST.
        expected, digest = self.fixtures[page]
        base = self.source_root / f"{page:04d}"
        source = base / "page.png"
        self.assertEqual(hashlib.sha256(source.read_bytes()).hexdigest(), digest)
        metadata = json.loads((base / "layout.json").read_text())
        with Image.open(source) as image:
            ink = ink_mask(image)
        if page in self.figure_masks:
            x, y, width, height = self.figure_masks[page]
            ink[y:y + height, x:x + width] = False
        original = ink.copy()
        bands = line_bands(ink, metadata["content_width"])
        self.assertEqual(len(bands), expected, bands)
        np.testing.assert_array_equal(ink, original)
        if page == 67:
            self.assertTrue(any(a <= 987 and b >= 1132 for a, b in bands), bands)
            self.assertFalse(any(a <= 3422 and b >= 3391 for a, b in bands), bands)

    def test_reviewed_p66_has_26_baselines(self):
        self.check_page(66)

    def test_reviewed_p67_has_25_baselines(self):
        self.check_page(67)

    def test_reviewed_p72_has_26_baselines(self):
        self.check_page(72)

    def test_reviewed_p73_has_20_baselines_outside_snapped_figure(self):
        self.check_page(73)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-root", type=Path)
    options = parser.parse_args()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(MultilineCountTest)
    if options.source_root:
        ReviewedPageCountTest.source_root = options.source_root.resolve()
        suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(ReviewedPageCountTest))
    outcome = unittest.TextTestRunner(verbosity=2).run(suite)
    raise SystemExit(not outcome.wasSuccessful())
