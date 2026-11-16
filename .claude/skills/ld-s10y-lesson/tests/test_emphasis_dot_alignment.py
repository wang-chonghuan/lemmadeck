from __future__ import annotations

import hashlib
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def alignment_page(dot_left: int, dot_right: int) -> np.ndarray:
    ink = np.zeros((800, 1400), dtype=bool)
    for top in (40, 112, 600, 672):
        for index in range(20):
            left = 100 + index * 45
            ink[top:top + 40, left:left + 36] = True
    for left in (100, 300):
        ink[184:224, left:left + 36] = True
    # Widely spaced marks cannot qualify through the regular-spacing branch.
    ink[233:242, dot_left:dot_right] = True
    ink[233:242, 314:322] = True
    return ink


class EmphasisDotAlignmentTests(unittest.TestCase):
    def test_frozen_6p_157_has_sixteen_independent_printed_rows(self):
        png = Path(__file__).resolve().parent / "fixtures" / "6p-0157.png"
        self.assertEqual(
            hashlib.sha256(png.read_bytes()).hexdigest(),
            "6ea043493bbef3974ceefc70783670ee6de9c5b4f83c2d0b42311e85f33312b4",
        )
        with Image.open(png) as image:
            ink = layout.ink_mask(image)
        columns = np.flatnonzero(ink.any(axis=0))
        content_w = int(columns[-1] - columns[0] + 1)
        self.assertEqual(content_w, 1186)
        # Frozen source figure152 geometry, not a newly inferred text region.
        ink[658:1100, 213:1322] = False
        original = ink.copy()

        bands = layout.line_bands(ink, content_w)

        # Source-first observation: the long prose row and "yin zhu." are
        # separate printed rows, not a fraction or a shared horizontal row.
        self.assertEqual(len(bands), 16)
        self.assertIn((429, 470), bands)
        self.assertIn((500, 537), bands)
        np.testing.assert_array_equal(ink, original)

    def test_alignment_accepts_only_one_pixel_boundary_tolerance(self):
        for left, right in ((95, 103), (96, 103), (133, 141), (133, 140)):
            with self.subTest(center=(left + right) / 2):
                ink = alignment_page(left, right)
                original = ink.copy()

                bands = layout.line_bands(ink, 1400)

                self.assertEqual(len(bands), 5)
                self.assertIn((184, 223), bands)
                np.testing.assert_array_equal(ink, original)

    def test_marks_outside_one_pixel_alignment_are_not_erased(self):
        for left, right in ((94, 102), (134, 142)):
            with self.subTest(center=(left + right) / 2):
                ink = alignment_page(left, right)
                original = ink.copy()

                bands = layout.line_bands(ink, 1400)

                self.assertEqual(len(bands), 5)
                self.assertIn((184, 241), bands)
                np.testing.assert_array_equal(ink, original)

    def test_alignment_does_not_bypass_dot_area_guard(self):
        ink = alignment_page(95, 103)
        ink[233:242, 600:620] = True
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertIn((184, 241), bands)
        np.testing.assert_array_equal(ink, original)

    def test_single_aligned_mark_is_not_an_emphasis_sequence(self):
        ink = alignment_page(95, 103)
        ink[233:242, 314:322] = False
        ink[233:242, 129:132] = True
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertIn((184, 241), bands)
        np.testing.assert_array_equal(ink, original)

    def test_inline_fraction_fragments_still_form_one_printed_row(self):
        ink = alignment_page(95, 103)
        ink[184:242] = False
        ink[300:331, 540:576] = True
        ink[342:346, 500:610] = True
        ink[352:390, 520:556] = True
        ink[352:390, 565:601] = True
        for left in (350, 395):
            ink[321:361, left:left + 36] = True
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 5)
        self.assertIn((300, 389), bands)
        np.testing.assert_array_equal(ink, original)

    def test_tall_nested_fraction_still_forms_one_printed_row(self):
        ink = alignment_page(95, 103)
        ink[184:242] = False
        ink[300:331, 450:490] = True
        ink[348:428, 200:800] = True
        ink[445:476, 450:490] = True
        original = ink.copy()

        bands = layout.line_bands(ink, 1400)

        self.assertEqual(len(bands), 5)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main()
