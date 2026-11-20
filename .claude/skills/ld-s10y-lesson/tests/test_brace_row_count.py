import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class BraceRowCountTests(unittest.TestCase):
    def test_tight_system_uses_glyph_height_not_staggered_band_height(self):
        ink = np.zeros((2500, 800), dtype=bool)
        for top in (100, 260, 420, 580, 740):
            for x in range(100, 600, 60):
                offset = 16 if x % 120 == 100 else 0
                ink[top + offset:top + offset + 60, x:x + 35] = True
        for top in (950, 1180, 1410, 1640, 1870, 2100):
            ink[top:top + 167, 70:95] = True
            for row in (top + 6, top + 111):
                for x in range(110, 400, 60):
                    ink[row:row + 45, x:x + 28] = True
        original = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 650)), 17)
        np.testing.assert_array_equal(ink, original)

    def test_tall_inline_fraction_is_one_row(self):
        ink = np.zeros((700, 800), dtype=bool)
        for top in (100, 500):
            for x in range(100, 600, 60):
                ink[top:top + 60, x:x + 35] = True
        ink[270:310, 200:230] = True
        ink[323:327, 180:250] = True
        ink[340:380, 200:230] = True
        self.assertEqual(len(layout.line_bands(ink, 650)), 3)

    def test_ordinary_rows_stay_separate(self):
        ink = np.zeros((500, 800), dtype=bool)
        for top in (100, 220, 340):
            for x in range(100, 600, 60):
                ink[top:top + 60, x:x + 35] = True
        self.assertEqual(len(layout.line_bands(ink, 650)), 3)

    def test_scan_edge_is_not_a_short_spanning_brace(self):
        ink = np.zeros((700, 800), dtype=bool)
        ink[:, 15:17] = True
        for top in (100, 500):
            for x in range(100, 600, 60):
                ink[top:top + 60, x:x + 35] = True
        ink[270:310, 200:230] = True
        ink[323:327, 180:250] = True
        ink[340:380, 200:230] = True
        self.assertEqual(len(layout.line_bands(ink, 650)), 3)


if __name__ == "__main__":
    unittest.main()
