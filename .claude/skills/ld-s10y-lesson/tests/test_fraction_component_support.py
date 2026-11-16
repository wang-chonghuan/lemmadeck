import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _fraction_across_split, _single_fraction_row


class FractionComponentSupportTests(unittest.TestCase):
    def fraction(self):
        ink = np.zeros((181, 560), dtype=bool)
        ink[77:81, 100:440] = True
        for x in (140, 210, 280, 350):
            ink[25:53, x:x + 18] = True
            ink[108:136, x:x + 18] = True
        return ink

    def test_short_outside_components_do_not_split_one_fraction(self):
        ink = self.fraction()
        ink[5:20, 40:70] = True
        ink[150:166, 475:505] = True
        self.assertTrue(_single_fraction_row(ink, 0, 180, 36))
        self.assertTrue(_fraction_across_split(ink, 0, 78, 180, 36))

    def test_full_outside_rows_are_not_discarded(self):
        ink = self.fraction()
        ink[5:33, 40:70] = True
        ink[145:173, 475:505] = True
        self.assertFalse(_single_fraction_row(ink, 0, 180, 36))
        self.assertFalse(_fraction_across_split(ink, 0, 78, 180, 36))

    def test_complete_wrapped_row_prevents_fraction_join(self):
        ink = self.fraction()
        ink[145:173, 40:70] = True
        self.assertFalse(_fraction_across_split(ink, 0, 78, 180, 36))

    def test_small_numerator_still_supports_outer_fraction_rule(self):
        ink = self.fraction()
        ink[25:53] = False
        ink[40:55, 140:158] = True
        self.assertTrue(_fraction_across_split(ink, 0, 78, 180, 36))

    def test_counting_helpers_leave_input_pixels_unchanged(self):
        ink = self.fraction()
        ink[5:20, 40:70] = True
        original = ink.copy()
        _single_fraction_row(ink, 0, 180, 36)
        _fraction_across_split(ink, 0, 78, 180, 36)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main()
