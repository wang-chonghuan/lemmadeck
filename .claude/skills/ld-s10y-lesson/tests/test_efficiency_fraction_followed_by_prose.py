from __future__ import annotations

import hashlib
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout


def text_row(ink, top, left=220, count=24, height=43):
    for index in range(count):
        x = left + 45 * index
        ink[top:top + height, x:x + 30] = True


def efficiency_fixture(*, following_prose=True, independent_middle_row=False):
    """Six context rows, one fraction baseline, and explicitly owned extra rows."""
    ink = np.zeros((800, 1504), dtype=bool)
    for top in (50, 119, 188, 540, 609, 678):
        text_row(ink, top)

    # Numerators, rules, and denominators all belong to this one equation.
    for left in (610, 740, 790, 940):
        ink[300:336, left:left + 28] = True
    for left, width in ((608, 44), (697, 129), (936, 43)):
        ink[339:343, left:left + width] = True
    for left in (610, 740, 940):
        ink[353:389, left:left + 28] = True
    for left in (300, 340, 480, 650, 700, 900, 1250, 1300):
        ink[327:352, left:left + 24] = True

    if following_prose:
        text_row(ink, 400, height=52)
    if independent_middle_row:
        # A separately typeset one-glyph row, outside every fraction column.
        ink[354:390, 180:208] = True
    return ink


class EfficiencyFractionFollowedByProse(unittest.TestCase):
    def test_fraction_and_following_prose_are_two_not_three_rows(self):
        ink = efficiency_fixture()
        original = ink.copy()
        bands = layout.line_bands(ink, 1504, edge_margin_px=100)
        np.testing.assert_array_equal(ink, original)
        # Six constructed context rows + equation + following sentence.
        self.assertEqual(len(bands), 8)
        self.assertEqual(len([b for b in bands if 300 <= b[0] < 452]), 2)

    def test_real_short_middle_row_outside_fraction_columns_is_not_hidden(self):
        ink = efficiency_fixture(independent_middle_row=True)
        original = ink.copy()
        bands = layout.line_bands(ink, 1504, edge_margin_px=100)
        np.testing.assert_array_equal(ink, original)
        # The independent glyph adds one printed row; denominators do not.
        self.assertEqual(len(bands), 9)
        self.assertEqual(len([b for b in bands if 300 <= b[0] < 452]), 3)

    def test_standalone_fraction_remains_one_row(self):
        ink = efficiency_fixture(following_prose=False)
        original = ink.copy()
        bands = layout.line_bands(ink, 1504, edge_margin_px=100)
        np.testing.assert_array_equal(ink, original)
        self.assertEqual(len(bands), 7)

    def test_pdf70_equation_and_next_sentence_have_two_source_rows(self):
        root = Path(__file__).resolve().parents[4]
        path = root / ".tmp/ld-s10y-lesson/9p/pages/0070/page.png"
        if not path.exists():
            self.skipTest("The independently inspected PDF70 raster is not available")
        self.assertEqual(
            hashlib.sha256(path.read_bytes()).hexdigest(),
            "e85c98848942aea66646255cabb770ba7a779903e55e379a3c13895dd6d3c851",
        )
        with Image.open(path) as image:
            ink = layout.ink_mask(image)
        original = ink.copy()
        columns = np.flatnonzero(ink.any(axis=0))
        content_w = int(columns[-1] - columns[0] + 1)
        bands = layout.line_bands(ink, content_w, edge_margin_px=100)
        np.testing.assert_array_equal(ink, original)
        # Only p0070#6 rows 3 and 4: one complete equation and one prose row.
        affected = [(a, b) for a, b in bands if a <= 1699 and b >= 1547]
        self.assertEqual(len(affected), 2)


if __name__ == "__main__":
    unittest.main()
