"""Independent geometric expectations for fractional evaluation-row ownership."""
from __future__ import annotations

import unittest

import numpy as np
from scipy import ndimage

import layout


GLYPHS = {
    "H": ("10001", "10001", "10001", "11111", "10001", "10001", "10001"),
    "1": ("00100", "01100", "00100", "00100", "00100", "00100", "01110"),
    "2": ("11111", "00001", "00001", "11111", "10000", "10000", "11111"),
    "3": ("11111", "00001", "00001", "11111", "00001", "00001", "11111"),
    "4": ("10010", "10010", "10010", "11111", "00010", "00010", "00010"),
}


def glyph(mask, x, y, char, scale):
    bits = np.array([[value == "1" for value in row] for row in GLYPHS[char]])
    pixels = np.repeat(np.repeat(bits, scale, axis=0), scale, axis=1)
    mask[y:y + pixels.shape[0], x:x + pixels.shape[1]] |= pixels


def nested_evaluation(*, upper=True, limit_offset=0):
    mask = np.zeros((210, 460), dtype=bool)
    for x, width in ((30, 90), (205, 95)):
        glyph(mask, x + 25, 45, "3", 3)
        mask[80:83, x:x + width] = True
    glyph(mask, 60, 93, "3", 3)
    # The second denominator is itself a fraction.
    glyph(mask, 254, 95, "1", 3)
    mask[122:125, 235:283] = True
    glyph(mask, 249, 131, "2", 4)
    glyph(mask, 166, 65, "3", 5)
    for x in (130, 308):
        mask[20:170, x:x + 3] = True
        if upper:
            glyph(mask, x + 11, 25, "4", 3)
        left = x + 8 + limit_offset
        glyph(mask, left + 8, 104, "1", 3)
        mask[132:135, left:left + 27] = True
        glyph(mask, left + 3, 141, "4", 3)
    return mask


def independent_equations():
    mask = np.zeros((250, 460), dtype=bool)
    for offset in (0, 100):
        glyph(mask, 15, 25 + offset, "H", 6)
        mask[43 + offset:46 + offset, 56:78] = True
        mask[51 + offset:54 + offset, 56:78] = True
        glyph(mask, 115, 3 + offset, "3", 4)
        mask[37 + offset:40 + offset, 100:185] = True
        glyph(mask, 121, 47 + offset, "2", 4)
    return mask


def page_with_math(math, scale=1, offset=(0, 0)):
    page = np.zeros((800, 1000), dtype=bool)
    for y in (50, 130, 210, 640):
        for x in range(50, 771, 60):
            glyph(page, x, y, "H", 6)
    page[320:320 + math.shape[0], 220:220 + math.shape[1]] |= math
    if scale != 1:
        page = np.repeat(np.repeat(page, scale, axis=0), scale, axis=1)
    x, y = offset
    shifted = np.zeros((page.shape[0] + y, page.shape[1] + x), dtype=bool)
    shifted[y:, x:] = page
    return shifted


def fraction_decision(mask, line_h=42):
    rows = np.flatnonzero(mask.any(axis=1))
    components, _ = ndimage.label(mask)
    return layout._single_fraction_row(mask, int(rows[0]), int(rows[-1]), line_h, components)


class NestedFractionRowsTests(unittest.TestCase):
    def test_tall_nested_evaluation_is_one_row(self):
        math = nested_evaluation()
        original = math.copy()
        self.assertTrue(fraction_decision(math))
        np.testing.assert_array_equal(math, original)
        page = page_with_math(math)
        before = page.copy()
        self.assertEqual(len(layout.line_bands(page, page.shape[1])), 5)
        np.testing.assert_array_equal(page, before)

    def test_translated_double_scale_row_is_one(self):
        page = page_with_math(nested_evaluation(), scale=2, offset=(47, 89))
        self.assertEqual(len(layout.line_bands(page, page.shape[1])), 5)

    def test_two_independent_text_rows_stay_two(self):
        math = np.zeros((210, 460), dtype=bool)
        for y in (20, 120):
            for x in (30, 100, 170, 240, 310):
                glyph(math, x, y, "H", 6)
        self.assertFalse(fraction_decision(math))
        page = page_with_math(math)
        self.assertEqual(len(layout.line_bands(page, page.shape[1])), 6)

    def test_two_independent_equation_rows_stay_two(self):
        math = independent_equations()
        self.assertFalse(fraction_decision(math))
        page = page_with_math(math)
        self.assertEqual(len(layout.line_bands(page, page.shape[1])), 6)

    def test_two_independent_fraction_rows_stay_two(self):
        math = np.zeros((250, 460), dtype=bool)
        for offset in (0, 120):
            glyph(math, 128, 10 + offset, "3", 5)
            math[52 + offset:55 + offset, 100:205] = True
            glyph(math, 136, 62 + offset, "2", 5)
        self.assertFalse(fraction_decision(math))
        page = page_with_math(math)
        self.assertEqual(len(layout.line_bands(page, page.shape[1])), 6)

    def test_independent_text_below_valid_limits_is_not_owned(self):
        math = nested_evaluation()
        for x in (355, 400):
            glyph(math, x, 158, "H", 6)
        self.assertFalse(fraction_decision(math))

    def test_missing_upper_limits_cannot_claim_lower_fractions(self):
        math = nested_evaluation(upper=False)
        components, _ = ndimage.label(math)
        roles = layout._fraction_limit_ownership(components, [(30, 119), (205, 299)], 42)
        self.assertFalse(roles.any())
        self.assertFalse(fraction_decision(math))

    def test_horizontal_offset_fraction_is_not_a_limit(self):
        math = nested_evaluation(limit_offset=80)
        components, _ = ndimage.label(math)
        roles = layout._fraction_limit_ownership(components, [(30, 119), (205, 299)], 42)
        self.assertFalse(roles.any())

    def test_wrong_body_scale_does_not_claim_limits(self):
        math = nested_evaluation()
        components, _ = ndimage.label(math)
        roles = layout._fraction_limit_ownership(components, [(30, 119), (205, 299)], 12)
        self.assertFalse(roles.any())


if __name__ == "__main__":
    unittest.main()
