"""Smaller co-row digits support a caption, but detached marks do not."""

import os
from pathlib import Path
import sys
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def fraction_caption(caption_top=60, peers=True):
    ink = np.zeros((95, 1500), dtype=bool)
    ink[34:37, 419:466] = True
    ink[0:20, 432:450] = True
    ink[53:78, 432:450] = True
    ink[11:53, 229:272] = True
    ink[11:52, 277:321] = True
    ink[13:48, 525:545] = True
    ink[caption_top:caption_top + 35, 1196:1228] = True
    if peers:
        ink[caption_top + 5:caption_top + 31, 1270:1283] = True
        ink[caption_top + 6:caption_top + 31, 1289:1301] = True
    return ink


class FractionCaptionSmallPeers(unittest.TestCase):
    def check(self, ink, expected):
        original = ink.copy()
        ink.setflags(write=False)
        for height in (44, 49):
            with self.subTest(height=height):
                self.assertEqual(
                    layout._single_fraction_row(ink, 0, 94, height), expected
                )
        np.testing.assert_array_equal(ink, original)

    def test_lower_caption_with_smaller_digits_is_not_one_fraction(self):
        self.check(fraction_caption(), False)

    def test_inline_caption_with_smaller_digits_is_one_row(self):
        self.check(fraction_caption(caption_top=14), True)

    def test_remote_singleton_still_does_not_establish_a_row(self):
        self.check(fraction_caption(peers=False), True)

    def test_detached_small_marks_do_not_support_the_singleton(self):
        ink = fraction_caption(peers=False)
        ink[12:38, 1270:1283] = True
        ink[13:38, 1289:1301] = True
        self.check(ink, True)

    def test_fraction_without_caption_remains_one_row(self):
        ink = fraction_caption(peers=False)
        ink[:, 1100:] = False
        self.check(ink, True)

    def test_translation_and_scaling_preserve_separate_caption(self):
        original = fraction_caption()
        for scale, dy, dx in ((1, 13, 17), (2, 0, 0)):
            with self.subTest(scale=scale, dy=dy, dx=dx):
                ink = np.pad(
                    np.repeat(np.repeat(original, scale, axis=0), scale, axis=1),
                    ((dy, 0), (dx, 0)),
                )
                self.assertFalse(layout._single_fraction_row(
                    ink, dy, dy + 95 * scale - 1, 44 * scale
                ))

    @unittest.skipUnless(os.environ.get("P53_SCAN"), "set P53_SCAN to reuse the original scan")
    def test_original_p53_has_two_rows_and_twenty_total(self):
        source = Path(os.environ["P53_SCAN"])
        self.assertEqual(layout.sha256_file(source),
                         "10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333")
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
        cols = np.flatnonzero(ink.any(axis=0))
        content_w = int(cols[-1] - cols[0] + 1)
        # Reuse the unchanged, already bound fig-31 extraction rectangle.
        ink[939:1439, 1017:1464] = False
        original = ink.copy()
        ink.setflags(write=False)
        for height in (44, 49):
            self.assertFalse(layout._single_fraction_row(ink, 1409, 1503, height))
        bands = layout.line_bands(ink, content_w)
        self.assertEqual(len(bands), 20)
        self.assertEqual(sum(a <= 1503 and b >= 1409 for a, b in bands), 2)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main()
