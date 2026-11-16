"""Source-pixel row counts: nested fractions, real wraps, and scan specks."""
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _fraction_across_split, ink_mask, line_bands, render_page


class NestedFractionScanNoiseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        repo = Path(__file__).resolve().parents[4]
        source = repo / "ssot-resources/soviet10year-textbooks/sources/soviet10years"
        pdf = next(source.glob("8a *.pdf"))
        cls.pages = {}
        for page in (8, 9):
            png = render_page(pdf, page, Path(cls.temp.name) / str(page) / "page.png")
            with Image.open(png) as image:
                ink = ink_mask(image)
            before = ink.copy()
            xs = np.flatnonzero(ink.any(axis=0))
            bands = line_bands(ink, int(xs[-1] - xs[0] + 1))
            cls.pages[page] = (ink, before, bands)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_whole_pages_match_independent_printed_row_inventory(self):
        for page, expected in ((8, 21), (9, 18)):
            with self.subTest(page=page):
                self.assertEqual(len(self.pages[page][2]), expected)

    def test_source_pixel_regions_keep_real_rows_and_remove_only_noise(self):
        cases = [
            (8, 3320, 3480, 0, "lower-right blemish"),
            (8, 3370, 3460, 0, "full fragmented speck union"),
            (8, 3120, 3240, 1, "footer digit and decorations"),
            (8, 2440, 2570, 1, "short final prose"),
            (8, 2560, 2790, 2, "two real prose rows"),
            (8, 1885, 2110, 2, "tight complete equation rows"),
            (9, 1320, 1610, 1, "nested numerator equation"),
            (9, 720, 912, 1, "simple fraction with inline label"),
            (9, 920, 1150, 2, "shorter second prose row"),
            (9, 2070, 2375, 2, "genuine ac formula continuation"),
            (9, 1790, 2060, 1, "nested numerator and denominator"),
        ]
        for page, top, bottom, expected, name in cases:
            with self.subTest(case=name):
                bands = self.pages[page][2]
                self.assertEqual(sum(a < bottom and b >= top for a, b in bands), expected)

    def test_component_topology_supports_only_the_outer_fraction_split(self):
        self.assertTrue(_fraction_across_split(self.pages[9][0], 1362, 1503, 1569, 63))
        self.assertFalse(_fraction_across_split(self.pages[8][0], 1909, 2022, 2087, 63))
        self.assertFalse(_fraction_across_split(self.pages[9][0], 938, 1062, 1126, 63))
        self.assertFalse(_fraction_across_split(self.pages[9][0], 2093, 2311, 2343, 63))

    def test_counting_does_not_edit_the_source_mask(self):
        for page, (ink, before, _) in self.pages.items():
            with self.subTest(page=page):
                self.assertTrue(np.array_equal(ink, before))


if __name__ == "__main__":
    unittest.main()
