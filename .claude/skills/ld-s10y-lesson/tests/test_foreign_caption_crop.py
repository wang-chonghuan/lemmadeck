"""A foreign caption edge must not crop away a figure label's descender."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import figure_crop_exclusion, figure_ink, snap


class ForeignCaptionCropTests(unittest.TestCase):
    def page(self):
        ink = np.zeros((220, 260), dtype=bool)
        ink[40:110, 30:180] = True
        ink[118:144, 50:57] = True
        ink[140:161, 120:145] = True
        return ink

    def test_caption_top_removed_and_complete_descender_preserved(self):
        ink = self.page()
        coarse = [20, 30, 170, 110]
        box, info = snap(ink, coarse)
        self.assertEqual(box, [30, 40, 150, 104])
        self.assertEqual(info["components"], 2)
        owned = figure_ink(ink, coarse)
        excluded = figure_crop_exclusion(ink, owned, box)
        self.assertIsNotNone(excluded)
        self.assertTrue(excluded[140:144, 120:145].all())
        self.assertFalse((excluded & owned).any())
        result = ink & ~excluded
        self.assertTrue(result[118:144, 50:57].all())
        self.assertTrue(np.array_equal(result[owned], ink[owned]))

    def test_dilation_does_not_erase_nearby_owned_pixels(self):
        ink = self.page()
        owned = np.zeros_like(ink)
        owned[118:144, 50:57] = True
        ink[143:147, 58:62] = True
        excluded = figure_crop_exclusion(ink, owned, [45, 115, 25, 33])
        self.assertIsNotNone(excluded)
        self.assertFalse((excluded & owned).any())
        self.assertTrue(excluded[143:147, 58:62].all())

    def test_foreign_caption_outside_envelope_needs_no_mask(self):
        ink = self.page()
        ink[140:161, 120:145] = False
        ink[160:181, 120:145] = True
        coarse = [20, 30, 170, 110]
        box, _ = snap(ink, coarse)
        self.assertIsNone(figure_crop_exclusion(ink, figure_ink(ink, coarse), box))

    def test_fully_owned_figure_needs_no_mask(self):
        ink = self.page()
        self.assertIsNone(figure_crop_exclusion(ink, ink.copy(), [0, 0, 260, 220]))


if __name__ == "__main__":
    unittest.main()
