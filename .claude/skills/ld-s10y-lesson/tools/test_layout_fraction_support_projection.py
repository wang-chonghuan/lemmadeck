"""Specification-driven arrays; no scan, image decode or pixel fixture."""
import unittest

import numpy as np

from layout import _single_fraction_row


class FractionSupportProjectionTests(unittest.TestCase):
    def nested_fraction(self):
        ink = np.zeros((192, 900), dtype=bool)
        ink[70:73, 450:530] = True
        ink[40:64, 465:489] = True
        ink[82:108, 475:499] = True
        ink[126:129, 400:760] = True
        ink[146:174, 505:529] = True
        return ink

    def check_fraction(self, ink, expected):
        before = ink.copy()
        for line_h in (40, 37):
            with self.subTest(line_h=line_h):
                self.assertEqual(
                    _single_fraction_row(ink, 0, ink.shape[0] - 1, line_h),
                    expected,
                )
                np.testing.assert_array_equal(ink, before)

    def test_nested_fraction_is_one_row(self):
        self.check_fraction(self.nested_fraction(), True)

    def test_rejected_singleton_does_not_set_residual_projection(self):
        ink = self.nested_fraction()
        ink[0:51, 20:44] = True
        ink[112:127, 55:70] = True
        self.check_fraction(ink, True)

    def test_repeated_remote_glyphs_retain_vertical_evidence(self):
        ink = self.nested_fraction()
        ink[0:51, 20:44] = True
        ink[0:51, 65:89] = True
        ink[112:127, 55:70] = True
        self.check_fraction(ink, False)

    def test_real_adjacent_prose_rows_are_not_owned_by_fraction(self):
        ink = self.nested_fraction()
        for start in (20, 65, 110):
            ink[0:35, start:start + 24] = True
            ink[112:147, start:start + 24] = True
        self.check_fraction(ink, False)

    def test_repeated_inline_side_glyphs_remain_one_row(self):
        ink = self.nested_fraction()
        for start in (20, 65, 110):
            ink[108:146, start:start + 24] = True
        self.check_fraction(ink, True)

    def test_singleton_connected_to_rule_group_still_has_evidence(self):
        ink = self.nested_fraction()
        ink[0:51, 350:374] = True
        self.check_fraction(ink, False)

    def test_two_complete_fraction_rows_remain_separate(self):
        ink = np.zeros((192, 900), dtype=bool)
        for bar in (55, 145):
            ink[bar:bar + 3, 400:600] = True
            ink[bar - 30:bar - 4, 450:474] = True
            ink[bar + 7:bar + 33, 460:484] = True
        self.check_fraction(ink, False)

    def test_two_plain_prose_rows_are_not_fraction_rows(self):
        ink = np.zeros((192, 900), dtype=bool)
        for start in (20, 65, 110):
            ink[10:45, start:start + 24] = True
            ink[112:147, start:start + 24] = True
        self.check_fraction(ink, False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
