import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import line_bands


class HollowMarginBlotsTest(unittest.TestCase):
    def body(self):
        ink = np.zeros((600, 1000), dtype=bool)
        for y in (40, 120, 200):
            for x in range(100, 800, 60):
                ink[y:y + 40, x:x + 32] = True
        return ink

    def test_isolated_open_outer_margin_blots_are_not_rows(self):
        ink = self.body()
        ink[340:380, 954:994] = True
        ink[347:373, 961:987] = False
        ink[340:347, 970:977] = False
        ink[460:494, 956:990] = True
        ink[465:489, 961:985] = False
        ink[460:465, 970:977] = False
        original = ink.copy()
        self.assertEqual(len(line_bands(ink, 900)), 3)
        np.testing.assert_array_equal(ink, original)

    def test_narrow_standalone_numeral_is_retained(self):
        ink = self.body()
        ink[340:380, 958:970] = True
        self.assertEqual(len(line_bands(ink, 900)), 4)

    def test_nearby_body_glyphs_protect_outer_margin_ink(self):
        ink = self.body()
        for x in (850, 905, 960):
            ink[340:380, x:x + 30] = True
        self.assertEqual(len(line_bands(ink, 900)), 4)


if __name__ == "__main__":
    unittest.main()
