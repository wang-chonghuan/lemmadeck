import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout


class FractionSystemRowsTests(unittest.TestCase):
    def test_fraction_and_plain_equation_share_two_braced_rows(self):
        ink = np.zeros((160, 240), dtype=bool)
        ink[10:150, 20:25] = True
        ink[35:39, 60:160] = True
        ink[15:30, 85:100] = True
        ink[45:60, 105:120] = True
        ink[110:140, 60:160] = True
        self.assertEqual(
            layout._fraction_system_row_count(ink, 10, 149, 30, [(110, 139)]),
            2,
        )

    def test_without_a_brace_keep_the_existing_row_estimate(self):
        ink = np.zeros((160, 240), dtype=bool)
        ink[35:39, 60:160] = True
        ink[15:30, 85:100] = True
        ink[45:60, 105:120] = True
        ink[110:140, 60:160] = True
        self.assertIsNone(
            layout._fraction_system_row_count(ink, 10, 149, 30, [(110, 139)]),
        )

    def test_one_tall_fraction_is_not_two_system_rows(self):
        ink = np.zeros((160, 240), dtype=bool)
        ink[10:150, 20:25] = True
        ink[70:74, 60:160] = True
        ink[45:65, 85:100] = True
        ink[80:100, 105:120] = True
        self.assertIsNone(
            layout._fraction_system_row_count(ink, 10, 149, 30, [(80, 99)]),
        )

    def test_independently_reviewed_source_rows(self):
        root = TOOLS.parents[3]
        expected = {228: 22, 229: 22, 230: 20, 231: 22, 232: 22, 233: 23, 234: 25}
        for page, count in expected.items():
            image = root / f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png"
            if not image.exists():
                self.skipTest("Prepared source pixels are unavailable.")
            with self.subTest(page=page):
                ink = layout.ink_mask(Image.open(image))
                columns = np.flatnonzero(ink.any(axis=0))
                self.assertEqual(
                    len(layout.line_bands(ink, int(columns[-1] - columns[0] + 1))),
                    count,
                )


if __name__ == "__main__":
    unittest.main()
