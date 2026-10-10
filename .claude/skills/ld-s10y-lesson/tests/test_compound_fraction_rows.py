from __future__ import annotations

import sys
import unittest
from copy import deepcopy
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout
import blocks


def text_row(ink, top, left=100, count=18):
    for index in range(count):
        x = left + 35 * index
        ink[top:top + 40, x:x + 24] = True


def balanced_fraction(ink, top, left):
    ink[top:top + 30, left + 70:left + 94] = True
    ink[top + 39:top + 43, left + 50:left + 110] = True
    ink[top + 52:top + 82, left + 70:left + 94] = True
    ink[top + 87:top + 91, left:left + 180] = True
    ink[top + 96:top + 126, left + 40:left + 64] = True
    ink[top + 135:top + 139, left + 20:left + 80] = True
    ink[top + 148:top + 178, left + 40:left + 64] = True


def unbalanced_fraction(ink, top, left):
    ink[top:top + 30, left + 120:left + 144] = True
    ink[top + 39:top + 43, left:left + 180] = True
    ink[top + 48:top + 78, left + 125:left + 149] = True
    ink[top + 86:top + 90, left + 60:left + 180] = True
    ink[top + 98:top + 128, left + 140:left + 164] = True
    ink[top + 136:top + 140, left + 120:left + 180] = True
    ink[top + 148:top + 178, left + 140:left + 164] = True


class CompoundFractionRows(unittest.TestCase):
    def test_balanced_compound_fraction_is_one_not_three_rows(self):
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (40, 110, 180, 580, 650, 720):
            text_row(ink, top)
        balanced_fraction(ink, 300, 320)
        text_row(ink, 365, left=100, count=3)
        text_row(ink, 365, left=610, count=6)
        bands = layout.line_bands(ink, 900)
        self.assertEqual(len(bands), 7)
        self.assertIn((300, 477), bands)

    def test_unbalanced_nested_denominator_with_one_text_baseline(self):
        ink = np.zeros((220, 1000), dtype=bool)
        for left in (270, 650):
            unbalanced_fraction(ink, 20, left)
            text_row(ink, 35, left=left - 130, count=3)
        self.assertTrue(layout._single_fraction_row(ink, 20, 197, 40))

    def test_compound_fraction_does_not_hide_two_independent_text_rows(self):
        ink = np.zeros((220, 1000), dtype=bool)
        balanced_fraction(ink, 20, 320)
        text_row(ink, 40, left=600, count=8)
        text_row(ink, 145, left=600, count=8)
        self.assertFalse(layout._single_fraction_row(ink, 20, 197, 40))

    def test_unbalanced_fraction_does_not_hide_two_text_baselines(self):
        ink = np.zeros((220, 1000), dtype=bool)
        unbalanced_fraction(ink, 20, 320)
        text_row(ink, 35, left=600, count=8)
        text_row(ink, 145, left=600, count=8)
        self.assertFalse(layout._single_fraction_row(ink, 20, 197, 40))

    def test_three_brace_connected_equations_still_count_as_three(self):
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (40, 110, 180, 580, 650, 720):
            text_row(ink, top)
        for top in (300, 360, 420):
            text_row(ink, top, left=270, count=16)
        ink[300:460, 240:250] = True
        self.assertEqual(len(layout.line_bands(ink, 900)), 9)

    def test_compound_fraction_beside_three_text_rows_does_not_hide_rows(self):
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (40, 110, 180, 580, 650, 720):
            text_row(ink, top)
        balanced_fraction(ink, 300, 200)
        for top in (300, 360, 420):
            text_row(ink, top, left=600, count=8)
        original = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 900)), 9)
        np.testing.assert_array_equal(ink, original)

    def test_source_pages_match_independently_read_printed_rows(self):
        root = Path(__file__).resolve().parents[4]
        expected = {268: (15, [(687, 861), (915, 1092)]),
                    269: (14, [(517, 698), (1790, 1978)]),
                    270: (20, [(245, 431)]),
                    275: (21, [(1818, 1993)])}
        for page, (count, intervals) in expected.items():
            with self.subTest(page=page):
                path = root / f".tmp/ld-s10y-lesson/5m/pages/{page:04d}/page.png"
                if not path.exists():
                    self.skipTest("Local source-page renders are not available")
                ink = layout.ink_mask(Image.open(path))
                bands = layout.line_bands(ink, int(np.ptp(np.flatnonzero(ink.any(axis=0)))) + 1)
                self.assertEqual(len(bands), count)
                for interval in intervals:
                    self.assertIn(interval, bands)
                source = root / f"ssot-resources/soviet10year-textbooks/artifacts/5m/pages/{page:04d}/page.md"
                _, content = blocks.load(source)
                self.assertEqual(blocks.printed_lines(content), count)
                incomplete = deepcopy(content)
                next(block for block in incomplete if block["lines"])["lines"].pop()
                self.assertNotEqual(blocks.printed_lines(incomplete), len(bands))


if __name__ == "__main__":
    unittest.main()
