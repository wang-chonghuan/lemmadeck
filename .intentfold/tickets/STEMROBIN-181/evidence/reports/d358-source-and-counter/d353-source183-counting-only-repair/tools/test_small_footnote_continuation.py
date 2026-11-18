import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SmallFootnoteContinuationTests(unittest.TestCase):
    def small_rows(self):
        ink = np.zeros((100, 600), dtype=bool)
        for left in range(250, 571, 40):
            ink[18:48, left:left + 28] = True
        ink[52:79, 230:255] = True
        ink[52:82, 270:298] = True
        ink[52:57, 187:217] = True
        return ink

    def test_two_glyph_short_continuation_uses_local_font_gap(self):
        ink = self.small_rows()
        self.assertTrue(layout._small_prose_continuation(
            ink, 8, 47, 52, 81, 45,
        ))

    def test_covering_rule_and_numerator_still_block_fraction_split(self):
        ink = self.small_rows()
        ink[48:50, 225:300] = True
        self.assertFalse(layout._small_prose_continuation(
            ink, 8, 47, 52, 81, 45,
        ))

    def test_one_glyph_does_not_establish_a_prose_row(self):
        ink = self.small_rows()
        ink[52:82, 270:298] = False
        self.assertFalse(layout._small_prose_continuation(
            ink, 8, 47, 52, 81, 45,
        ))

    def test_no_local_line_gap_does_not_establish_a_second_row(self):
        ink = self.small_rows()
        self.assertFalse(layout._small_prose_continuation(
            ink, 8, 50, 52, 81, 45,
        ))


if __name__ == "__main__":
    unittest.main()
