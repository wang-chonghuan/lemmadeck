import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import ink_mask, line_bands


class UnderlinedProseRowsTests(unittest.TestCase):
    def test_underlined_short_row_stays_separate_from_following_prose(self):
        ink = np.zeros((400, 1200), dtype=bool)
        for x in range(180, 540, 60):
            ink[100:160, x:x + 40] = True
        ink[170:180, 180:540] = True
        for x in range(180, 1080, 60):
            ink[205:265, x:x + 40] = True
        self.assertEqual(len(line_bands(ink, 1100)), 2)

    def test_supported_tall_fraction_remains_one_printed_row(self):
        ink = np.zeros((400, 1200), dtype=bool)
        ink[100:160, 420:460] = True
        ink[174:181, 390:490] = True
        ink[200:260, 420:460] = True
        self.assertEqual(len(line_bands(ink, 1100)), 1)

    def test_native_fractional_exponents_share_one_printed_row(self):
        repo = Path(__file__).resolve().parents[4]
        source = repo / (
            ".tmp/ld-s10y-lesson/resume182-6-3129/"
            "source-N32-FIRST/8a/pages/0210/page.png"
        )
        if not source.exists():
            self.skipTest("Prepared source pixels are unavailable.")
        with Image.open(source) as image:
            ink = ink_mask(image)
        columns = np.flatnonzero(ink.any(axis=0))
        width = int(columns[-1] - columns[0] + 1)
        self.assertEqual(len(line_bands(ink, width)), 19)


if __name__ == "__main__":
    unittest.main()
