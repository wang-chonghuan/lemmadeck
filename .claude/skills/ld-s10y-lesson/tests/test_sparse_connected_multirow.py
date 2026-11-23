"""Sparse connecting ink must not invent a fifth supported body row."""

import os
from pathlib import Path
import sys
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def body(ink, top, count=12, height=40, left=100):
    for index in range(count):
        ink[top:top + height, left + 24 * index:left + 24 * index + 16] = True


def connected_rows(extra_body=False, weak_body=False):
    ink = np.zeros((850, 1000), dtype=bool)
    for top in (40, 120, 200):
        body(ink, top, count=20)
    top = 300
    for offset in (0, 80, 160):
        body(ink, top + offset, count=20)
    body(ink, top + 240, count=6, height=26, left=110)
    ink[top + 270:top + 273, 100:254] = True
    body(ink, top + 279, count=6, height=26, left=110)
    bottom = top + 335
    ink[top:bottom, 700:710] = True
    ink[top:top + 3, 690:731] = True
    ink[bottom - 3:bottom, 690:731] = True
    if extra_body:
        body(ink, top + 320, count=1 if weak_body else 3, height=26, left=600)
    body(ink, 720)
    return ink


class SparseConnectedMultirow(unittest.TestCase):
    def check(self, ink, expected):
        original = ink.copy()
        ink.setflags(write=False)
        bands = layout.line_bands(ink, ink.shape[1])
        self.assertEqual(sum(a <= 645 and b >= 300 for a, b in bands), expected, bands)
        np.testing.assert_array_equal(ink, original)

    def test_four_supported_rows_with_sparse_tail(self):
        self.check(connected_rows(), 4)

    def test_a_real_extra_body_is_not_removed(self):
        self.check(connected_rows(extra_body=True), 5)

    def test_a_weak_extra_body_between_strong_rows_is_not_removed(self):
        self.check(connected_rows(extra_body=True, weak_body=True), 5)

    def test_five_normal_rows_still_count_five(self):
        ink = np.zeros((850, 1000), dtype=bool)
        for top in (40, 120, 200, 300, 380, 460, 540, 620, 720):
            body(ink, top)
        self.check(ink, 5)

    @unittest.skipUnless(os.environ.get("P24_SCAN"), "set P24_SCAN to reuse original p24")
    def test_original_p24_retains_twenty_four_printed_rows(self):
        source = Path(os.environ["P24_SCAN"])
        self.assertEqual(layout.sha256_file(source),
                         "f49f7f171441b5a813428e80703e7dd67ef0ebd4842ed98aae65d2311d48aa6c")
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
        cols = np.flatnonzero(ink.any(axis=0))
        before = ink.copy()
        ink.setflags(write=False)
        bands = layout.line_bands(ink, int(cols[-1] - cols[0] + 1))
        self.assertEqual(len(bands), 24)
        self.assertEqual(sum(a <= 2143 and b >= 1809 for a, b in bands), 4)
        np.testing.assert_array_equal(ink, before)


if __name__ == "__main__":
    unittest.main()
