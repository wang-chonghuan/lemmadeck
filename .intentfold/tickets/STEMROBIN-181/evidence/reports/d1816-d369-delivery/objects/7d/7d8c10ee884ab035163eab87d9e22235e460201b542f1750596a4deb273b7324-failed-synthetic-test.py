import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout
import p2c


class CountingBottomMarginTest(unittest.TestCase):
    def make_scan(self):
        ink = np.zeros((300, 400), dtype=bool)
        for y in [50, 110, 244]:
            for x in [120, 155, 190]:
                ink[y:y + 18, x:x + 16] = True
        ink[281:285, 100:240] = True
        return ink

    def test_explicit_boundary_preserves_footer_and_original_pixels(self):
        ink = self.make_scan()
        original = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 360)), 4)
        self.assertEqual(
            layout.line_bands(ink, 360, bottom_margin_px=20),
            [(50, 67), (110, 127), (244, 261)],
        )
        self.assertTrue(np.array_equal(ink, original))

    def test_invalid_boundary_is_rejected(self):
        for value in [0, -1, 31, 1.5, True]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                layout.line_bands(self.make_scan(), 360, bottom_margin_px=value)

    def test_page_metadata_requires_reason_and_integer(self):
        for counting in [
            {"bottom_margin_px": 20},
            {"bottom_margin_px": 20, "reason": " "},
            {"bottom_margin_px": True, "reason": "observed scan edge"},
            {"bottom_margin_px": None, "reason": "observed scan edge"},
        ]:
            with self.subTest(counting=counting), self.assertRaises(ValueError):
                p2c._counting_line_bands({"counting": counting}, self.make_scan(), 360)

    def test_page_metadata_applies_observed_boundary(self):
        bands = p2c._counting_line_bands(
            {"counting": {"bottom_margin_px": 20, "reason": "observed nontext scan edge"}},
            self.make_scan(), 360,
        )
        self.assertEqual(bands, [(50, 67), (110, 127), (244, 261)])


if __name__ == "__main__":
    unittest.main()
