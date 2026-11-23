"""Two-sided fraction support survives slight overhang and an attached body."""

import os
from pathlib import Path
import sys
import unittest

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def glyph(ink, x, y, width, height, thickness):
    ink[y:y + height, x:x + thickness] = True
    ink[y:y + height, x + width - thickness:x + width] = True
    ink[y + height // 2:y + height // 2 + thickness, x:x + width] = True


def supported(scale, *, overhang=0.05, upper=True, lower=True, arrow=False,
              shifted=False, distant=False):
    size = lambda value: int(round(value * scale))
    ink = np.zeros((size(4), size(7)), dtype=bool)
    left, right, top = size(1), size(3.8), size(1.5)
    thickness = max(2, size(0.08))
    ink[top:top + thickness, left:right] = True
    glyph(ink, right, top - size(0.3), size(0.5), size(0.7), thickness)
    if arrow:
        length = size(0.3)
        for offset in range(length):
            half = max(thickness // 2, size(0.24) * (length - offset) // length)
            center = top + thickness // 2
            ink[center - half:center + half + 1, right - length + offset] = True
    upper_x = left - size(overhang)
    lower_x = left + size(0.1 if not shifted else 1.2)
    if upper:
        glyph(ink, upper_x, top - size(0.15) - size(0.8),
              size(0.55), size(0.8), thickness)
    if lower:
        glyph(ink, lower_x, top + thickness + size(0.15 if not distant else 0.9),
              size(0.55), size(0.8), thickness)
    original = ink.copy()
    ink.setflags(write=False)
    components, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(components)
    rows, columns = slice(top, top + thickness), slice(left, right)
    ids = np.unique(components[rows, columns])
    result = layout._bar_local_fraction_support(
        components, bounds, ids, rows, columns, scale
    )
    np.testing.assert_array_equal(ink, original)
    return result


class AttachedComparisonFractionTests(unittest.TestCase):
    def test_wide_body_connected_bar_with_slight_overhang(self):
        for scale in (40, 50, 60):
            with self.subTest(scale=scale):
                self.assertTrue(supported(scale))

    def test_contained_wide_fraction_still_has_local_support(self):
        self.assertTrue(supported(50, overhang=0))

    def test_missing_numerator_is_not_a_fraction(self):
        self.assertFalse(supported(50, upper=False))

    def test_missing_denominator_is_not_a_fraction(self):
        self.assertFalse(supported(50, lower=False))

    def test_disjoint_glyphs_are_not_fraction_support(self):
        self.assertFalse(supported(50, shifted=True))

    def test_remote_denominator_is_not_fraction_support(self):
        self.assertFalse(supported(50, distant=True))

    def test_large_overhang_is_not_fraction_support(self):
        self.assertFalse(supported(50, overhang=0.4))

    def test_true_terminal_arrow_is_still_rejected(self):
        self.assertFalse(supported(50, arrow=True))

    @unittest.skipUnless(os.environ.get("P41_SCAN"), "set P41_SCAN to the original scan")
    def test_original_p41_fraction_is_one_row_and_next_prose_is_separate(self):
        source = Path(os.environ["P41_SCAN"])
        self.assertEqual(
            layout.sha256_file(source),
            "76077ffcb03831e262d28cbec2f22595fec27b124fdc7aefb43af213ad6205ca",
        )
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
        columns = np.flatnonzero(ink.any(axis=0))
        width = int(columns[-1] - columns[0] + 1)
        # Reuse only the independently confirmed bottom scan-boundary exclusion.
        ink[2356:] = False
        original = ink.copy()
        ink.setflags(write=False)
        for height in (41, 45):
            self.assertTrue(layout._single_fraction_row(ink, 735, 827, height))
            self.assertFalse(layout._single_fraction_row(ink, 735, 907, height))
        bands = layout.line_bands(ink, width)
        self.assertIn((735, 827), bands)
        self.assertIn((846, 907), bands)
        self.assertEqual(len(bands), 21)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main()
