"""Independent row geometry for integer evaluation limits, not native fixtures."""
from __future__ import annotations

import unittest

import numpy as np
from scipy import ndimage

import layout


BITS = {
    "H": ("10001", "10001", "10001", "11111", "10001", "10001", "10001"),
    "1": ("00100", "01100", "00100", "00100", "00100", "00100", "01110"),
    "2": ("11111", "00001", "00001", "11111", "10000", "10000", "11111"),
    "9": ("11111", "10001", "10001", "11111", "00001", "00001", "11111"),
}


def draw_glyph(mask, x, y, text, scale):
    bits = np.array([[bit == "1" for bit in row] for row in BITS[text]])
    pixels = np.repeat(np.repeat(bits, scale, axis=0), scale, axis=1)
    mask[y:y + pixels.shape[0], x:x + pixels.shape[1]] |= pixels


def integer_evaluation(*, upper=True, lower_x=216, central=False, paired=False):
    mask = np.zeros((260, 720), dtype=bool)
    terms = (0, 300) if paired else (0,)
    for dx in terms:
        draw_glyph(mask, 151 + dx, 78, "2", 3)
        mask[117:121, 138 + dx:196 + dx] = True
        # The denominator has an independently printed nested fraction.
        draw_glyph(mask, 160 + dx, 135, "1", 3)
        mask[165:169, 142 + dx:192 + dx] = True
        draw_glyph(mask, 155 + dx, 183, "2", 3)
        mask[30:230, 205 + dx:208 + dx] = True
        if upper:
            draw_glyph(mask, 216 + dx, 32 if not central else 83, "9", 3)
        draw_glyph(mask, lower_x + dx, 224 if not central else 152, "1", 3)
    draw_glyph(mask, 65, 104, "H", 5)
    if paired:
        draw_glyph(mask, 362, 107, "H", 5)
    return mask


def decision(mask, height=35):
    live = np.flatnonzero(mask.any(axis=1))
    labels, _ = ndimage.label(mask)
    before, original_labels = mask.copy(), labels.copy()
    result = layout._single_fraction_row(mask, int(live[0]), int(live[-1]), height, labels)
    np.testing.assert_array_equal(mask, before)
    np.testing.assert_array_equal(labels, original_labels)
    return result


def owned(mask):
    labels, _ = ndimage.label(mask)
    before = labels.copy()
    result = layout._fraction_limit_ownership(labels, [(138, 195)], 35)
    np.testing.assert_array_equal(labels, before)
    return result


class IntegerEvaluationRowsTests(unittest.TestCase):
    def test_integer_evaluation_limits_form_one_printed_row(self):
        self.assertTrue(decision(integer_evaluation()))

    def test_paired_integer_limits_with_translation_and_scale_are_one_row(self):
        mask = integer_evaluation(paired=True)
        scaled = np.repeat(np.repeat(mask, 2, axis=0), 2, axis=1)
        shifted = np.zeros((scaled.shape[0] + 47, scaled.shape[1] + 29), dtype=bool)
        shifted[47:, 29:] = scaled
        self.assertTrue(decision(shifted, 70))

    def test_missing_upper_limit_does_not_claim_lower_digit(self):
        self.assertFalse(owned(integer_evaluation(upper=False)).any())

    def test_misaligned_integer_bounds_do_not_establish_ownership(self):
        self.assertFalse(owned(integer_evaluation(lower_x=265)).any())

    def test_short_central_side_glyphs_are_not_extreme_limits(self):
        self.assertFalse(owned(integer_evaluation(central=True)).any())

    def test_incomplete_fractional_lower_limit_is_not_reclassified_as_integer(self):
        mask = integer_evaluation()
        mask[212:216, 212:239] = True
        self.assertFalse(owned(mask).any())

    def test_full_height_lower_text_remains_an_independent_row(self):
        mask = integer_evaluation()
        draw_glyph(mask, 280, 213, "H", 5)
        draw_glyph(mask, 321, 214, "H", 5)
        self.assertFalse(decision(mask))

    def test_two_complete_fraction_rows_remain_independent(self):
        mask = np.zeros((260, 600), dtype=bool)
        for y in (20, 140):
            draw_glyph(mask, 220, y, "2", 5)
            mask[y + 42:y + 46, 200:280] = True
            draw_glyph(mask, 223, y + 55, "2", 5)
        self.assertFalse(decision(mask))

    def test_two_independent_equation_rows_remain_independent(self):
        mask = np.zeros((260, 600), dtype=bool)
        for y in (20, 140):
            draw_glyph(mask, 50, y + 15, "H", 5)
            mask[y + 27:y + 31, 95:120] = True
            mask[y + 37:y + 41, 95:120] = True
            draw_glyph(mask, 170, y, "2", 4)
            mask[y + 38:y + 42, 155:225] = True
            draw_glyph(mask, 174, y + 55, "2", 4)
        self.assertFalse(decision(mask))


if __name__ == "__main__":
    unittest.main()
