"""Wave underlines are not fraction bars, including on tilted scans."""

from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _single_fraction_row, _straight_fraction_rule


def rule(y):
    mask = np.zeros((60, len(y)), dtype=bool)
    for x, row in enumerate(y):
        mask[row:row + 2, x] = True
    return mask


class UnderlinedRowsTests(unittest.TestCase):
    def test_horizontal_fraction_rule(self):
        self.assertTrue(_straight_fraction_rule(rule(np.full(180, 25)), 24))

    def test_tilted_fraction_rule(self):
        self.assertTrue(_straight_fraction_rule(rule(20 + np.arange(180) // 30), 24))

    def test_wave_underline(self):
        y = 25 + np.rint(3 * np.sin(np.arange(180) * np.pi / 10)).astype(int)
        self.assertFalse(_straight_fraction_rule(rule(y), 24))

    def test_underlined_full_text_rows_do_not_collapse(self):
        y = 25 + np.rint(3 * np.sin(np.arange(180) * np.pi / 10)).astype(int)
        mask = rule(y)
        for x in range(0, 180, 24):
            mask[0:20, x:x + 18] = True
            mask[36:56, x:x + 18] = True
        self.assertFalse(_single_fraction_row(mask, 0, 59, 24))

    def test_wide_rule_connected_to_normal_height_numerator(self):
        mask = np.zeros((104, 320), dtype=bool)
        mask[44:47, 60:300] = True
        mask[8:45, 130:151] = True
        mask[64:101, 170:191] = True
        mask[35:74, 10:31] = True
        self.assertTrue(_single_fraction_row(mask, 0, 103, 40))


if __name__ == "__main__":
    unittest.main()
