from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import layout


class LineBandsTest(unittest.TestCase):
    def test_merges_split_glyphs_and_ignores_scan_decorations(self) -> None:
        ink = np.zeros((700, 400), dtype=bool)
        ink[0:16, 0:390] = True
        for top in (60, 130, 200, 270, 340):
            ink[top:top + 40, 40:360] = True

        ink[410:416, 170:230] = True
        ink[428:434, 140:260] = True
        ink[442:478, 160:240] = True

        ink[530:538, 40:360] = True
        ink[585:594, 10:25] = True

        bands = layout.line_bands(ink, content_w=400)

        self.assertEqual(len(bands), 6)
        self.assertIn((410, 477), bands)
        self.assertNotIn((0, 15), bands)
        self.assertNotIn((530, 537), bands)
        self.assertNotIn((585, 593), bands)

    def test_keeps_split_standalone_enumerator_near_a_table(self) -> None:
        ink = np.zeros((500, 400), dtype=bool)
        for top in (40, 110, 180, 250, 320):
            ink[top:top + 40, 40:360] = True
        ink[400:405, 180:213] = True
        ink[414:417, 182:211] = True

        bands = layout.line_bands(ink, content_w=400)

        self.assertEqual(len(bands), 6)
        self.assertIn((400, 416), bands)


if __name__ == "__main__":
    unittest.main()
