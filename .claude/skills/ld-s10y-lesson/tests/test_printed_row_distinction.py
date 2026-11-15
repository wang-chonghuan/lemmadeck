from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def body_row(ink, top, count=20, left=100):
    for index in range(count):
        x = left + index * 45
        ink[top:top + 40, x:x + 36] = True


def base_page():
    ink = np.zeros((800, 1400), dtype=bool)
    for top in (40, 112, 600, 672):
        body_row(ink, top)
    return ink


class PrintedRowDistinction(unittest.TestCase):
    def test_two_emphasis_dots_do_not_bridge_a_two_glyph_row(self):
        ink = base_page()
        body_row(ink, 184, count=2)
        for left in (114, 159):
            ink[233:242, left:left + 9] = True
        body_row(ink, 256)
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 6)
        self.assertIn((184, 223), bands)
        self.assertIn((256, 295), bands)
        np.testing.assert_array_equal(ink, original)

    def test_missing_emphasis_dot_does_not_join_neighboring_rows(self):
        ink = base_page()
        body_row(ink, 184)
        for index in range(20):
            if index == 7:
                continue
            left = 114 + index * 45
            ink[233:242, left:left + 9] = True
        body_row(ink, 256)

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 6)
        self.assertIn((184, 223), bands)
        self.assertIn((256, 295), bands)

    def test_unaligned_two_dot_punctuation_is_not_erased(self):
        ink = base_page()
        body_row(ink, 184, count=2)
        for left in (800, 845):
            ink[233:242, left:left + 9] = True

        self.assertIn((184, 241), layout.line_bands(ink, 1400))

    def test_emphasis_can_belong_to_shallow_and_split_body_strokes(self):
        ink = base_page()
        body_row(ink, 184)
        for index in (3, 7):
            left = 100 + index * 45
            ink[184:224, left:left + 36] = False
            ink[198:204, left:left + 36] = True
            if index == 7:
                ink[209:224, left + 8:left + 28] = True
        for index in range(20):
            if index == 10:
                continue
            left = 114 + index * 45
            ink[233:242, left:left + 9] = True
        body_row(ink, 256)

        bands = layout.line_bands(ink, 1400)

        self.assertIn((184, 223), bands)
        self.assertIn((256, 295), bands)

    def test_single_aligned_dot_is_not_an_emphasis_sequence(self):
        ink = base_page()
        body_row(ink, 184, count=2)
        ink[233:242, 114:123] = True
        ink[233:242, 129:132] = True

        self.assertIn((184, 241), layout.line_bands(ink, 1400))

    def test_fraction_and_close_following_prose_are_two_exact_rows(self):
        ink = base_page()
        ink[300:331, 540:576] = True
        ink[342:346, 500:610] = True
        ink[352:390, 520:556] = True
        ink[352:390, 565:601] = True
        body_row(ink, 321, count=2, left=350)
        ink[399:405, 465:485] = True
        body_row(ink, 419)
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 6)
        self.assertIn((300, 404), bands)
        self.assertIn((419, 458), bands)
        np.testing.assert_array_equal(ink, original)

    def test_close_disjoint_numeric_foot_is_a_separate_row(self):
        ink = base_page()
        body_row(ink, 300, count=12)
        ink[350:377, 800:817] = True
        ink[350:377, 823:847] = True

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 6)
        self.assertIn((300, 339), bands)
        self.assertIn((350, 376), bands)

    def test_aligned_fraction_fragments_still_form_one_row(self):
        ink = base_page()
        ink[300:331, 540:576] = True
        ink[342:346, 500:610] = True
        ink[352:390, 520:556] = True
        ink[352:390, 565:601] = True
        body_row(ink, 321, count=2, left=350)

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 5)
        self.assertIn((300, 389), bands)

    def test_split_numeric_glyph_is_not_two_complete_rows(self):
        ink = base_page()
        ink[300:321, 800:847] = True
        ink[332:349, 800:847] = True

        self.assertIn((300, 348), layout.line_bands(ink, 1400))

    def test_normal_row_before_a_multiline_band_keeps_all_three_rows(self):
        ink = base_page()
        body_row(ink, 300)
        ink[349:400, 100:550] = True
        ink[390:455, 700:1200] = True

        self.assertEqual(len(layout.line_bands(ink, 1400)), 7)


if __name__ == "__main__":
    unittest.main()
