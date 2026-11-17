"""Independent geometric fixtures for printed rows extended by tall symbols."""
from __future__ import annotations

import unittest

import numpy as np
from scipy import ndimage

import layout


def body(ink, y, x=80, count=12, height=20, width=14, gap=12):
    for index in range(count):
        left = x + index * (width + gap)
        ink[y:y + height, left:left + width] = True


def carrier(ink, y, x=400, height=48, hooked=True, limits=True):
    ink[y:y + height, x:x + 3] = True
    if hooked:
        ink[y:y + 3, x:x + 7] = True
        ink[y + height - 3:y + height, x - 4:x + 3] = True
    if limits:
        ink[y:y + 7, x + 13:x + 20] = True
        ink[y + height - 7:y + height, x + 13:x + 20] = True


def page():
    ink = np.zeros((1100, 800), dtype=bool)
    for y in (80, 140, 200, 260, 500, 560):
        body(ink, y)
    return ink


def one_formula(hooked=True, labelled=False):
    ink = page()
    carrier(ink, 350, hooked=hooked)
    body(ink, 364, x=450, count=6)
    if labelled:
        body(ink, 364, x=730, count=2, width=12, gap=8)
    return ink


class CarrierRows(unittest.TestCase):
    def assert_rows(self, ink, expected):
        before = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, ink.shape[1])), expected)
        np.testing.assert_array_equal(ink, before)

    def test_integral_is_one_formula_row(self):
        self.assert_rows(one_formula(), 7)

    def test_evaluation_stem_is_one_formula_row(self):
        self.assert_rows(one_formula(hooked=False), 7)

    def test_distant_equation_number_shares_the_body_row(self):
        self.assert_rows(one_formula(labelled=True), 7)

    def test_two_side_by_side_integrals_share_one_row(self):
        ink = one_formula()
        carrier(ink, 350, x=170)
        body(ink, 364, x=210, count=4)
        self.assert_rows(ink, 7)

    def test_shorter_integral_is_one_row(self):
        ink = page()
        carrier(ink, 350, height=34)
        body(ink, 358, x=450, count=6)
        self.assert_rows(ink, 7)

    def test_multiple_limits_do_not_set_body_scale(self):
        ink = page()
        for y in (350, 650, 750, 850):
            carrier(ink, y)
            body(ink, y + 14, x=450, count=6)
        self.assert_rows(ink, 10)

    def test_scaled_integral_page(self):
        self.assert_rows(np.repeat(np.repeat(one_formula(), 2, axis=0), 2, axis=1), 7)

    def test_two_full_rows_connected_by_tall_delimiter_stay_two(self):
        ink = page()
        carrier(ink, 350, height=56, limits=False)
        body(ink, 350, x=450, count=6)
        body(ink, 386, x=450, count=6)
        self.assert_rows(ink, 8)

    def test_full_row_above_integral_stays_separate(self):
        ink = one_formula()
        body(ink, 310, x=450, count=6)
        self.assert_rows(ink, 8)

    def test_small_independent_row_is_not_an_integral_limit(self):
        ink = one_formula()
        body(ink, 345, x=80, count=6, height=10, width=8, gap=10)
        labels, _ = ndimage.label(ink)
        self.assertFalse(layout._single_carrier_row(
            labels, ndimage.find_objects(labels), 345, 397, 20,
        ))

    def test_repeated_small_local_glyphs_cannot_be_limits(self):
        ink = one_formula()
        body(ink, 346, x=396, count=4, height=8, width=6, gap=3)
        labels, _ = ndimage.label(ink)
        self.assertFalse(layout._single_carrier_row(
            labels, ndimage.find_objects(labels), 346, 397, 20,
        ))

    def test_distant_small_printed_row_is_not_hidden(self):
        ink = one_formula()
        body(ink, 389, x=30, count=1, height=8, width=8)
        self.assert_rows(ink, 8)

    def test_standalone_short_quotient_is_preserved(self):
        ink = page()
        body(ink, 350, x=400, count=1, width=14)
        self.assert_rows(ink, 7)

    def test_bare_fraction_has_single_row_geometry(self):
        ink = page()
        ink[375:378, 350:465] = True
        body(ink, 350, x=363, count=3)
        body(ink, 388, x=363, count=3)
        self.assertTrue(layout._single_fraction_row(ink, 350, 407, 20))

    def test_bare_fraction_is_one_printed_row(self):
        ink = page()
        ink[375:378, 350:465] = True
        body(ink, 350, x=363, count=3)
        body(ink, 388, x=363, count=3)
        self.assert_rows(ink, 7)

    def test_inline_fraction_remains_one_row(self):
        ink = page()
        ink[375:378, 350:465] = True
        body(ink, 350, x=363, count=3)
        body(ink, 388, x=363, count=3)
        body(ink, 369, x=500, count=6)
        self.assert_rows(ink, 7)

    def test_rule_is_not_silently_discarded_by_carrier_repair(self):
        ink = page()
        ink[350:354, 200:400] = True
        self.assert_rows(ink, 7)

    def test_two_ordinary_body_rows_are_not_merged(self):
        ink = page()
        body(ink, 350, x=450, count=6)
        body(ink, 386, x=450, count=6)
        self.assert_rows(ink, 8)


if __name__ == "__main__":
    unittest.main()
