"""A source-inspected counting boundary excludes remote shallow scanning dust."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import line_bands


class IsolatedScanningDustTest(unittest.TestCase):
    def image(self):
        ink = np.zeros((440, 500), dtype=bool)
        for y in (40, 110, 180):
            for x in range(80, 400, 45):
                ink[y:y + 40, x:x + 28] = True
        return ink

    def test_inspected_isolated_dust_is_not_a_row(self):
        ink = self.image()
        ink[340:353, 360:405] = True
        ink[377:385, 370:400] = True
        self.assertEqual(len(line_bands(ink, 500, edge_margin_px=40)), 3)

    def test_default_does_not_assume_source_inspection(self):
        ink = self.image()
        ink[340:353, 360:405] = True
        self.assertEqual(len(line_bands(ink, 500)), 4)

    def test_nearby_small_text_is_retained(self):
        ink = self.image()
        for x in range(130, 270, 20):
            ink[270:283, x:x + 9] = True
        self.assertEqual(len(line_bands(ink, 500, edge_margin_px=40)), 4)


if __name__ == "__main__":
    unittest.main()
