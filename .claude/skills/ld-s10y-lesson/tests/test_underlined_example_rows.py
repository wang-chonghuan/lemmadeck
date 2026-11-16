import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class UnderlinedExampleRows(unittest.TestCase):
    def test_original_page_with_four_row_example(self):
        # Original 6p p0170: 25 printed rows, including the four-row example.
        fixture = Path(__file__).parent / "fixtures" / "underlined-example-p0170.png"
        ink = layout.ink_mask(Image.open(fixture))
        self.assertEqual(len(layout.line_bands(ink, ink.shape[1])), 25)

    def test_short_cjk_row_outside_underlined_column(self):
        ink = np.zeros((120, 400), dtype=bool)
        ink[52:55, 10:140] = True
        ink[8:46, 180:218] = True
        ink[82:120, 180:218] = True
        self.assertFalse(layout._single_fraction_row(ink, 0, 119, 38))

    def test_single_fraction_with_body_glyphs_in_its_columns(self):
        ink = np.zeros((120, 400), dtype=bool)
        ink[52:55, 10:140] = True
        ink[8:46, 60:98] = True
        ink[82:120, 60:98] = True
        self.assertTrue(layout._single_fraction_row(ink, 0, 119, 38))

    def test_disconnected_strokes_form_a_short_body_glyph(self):
        ink = np.zeros((120, 400), dtype=bool)
        ink[52:55, 10:140] = True
        ink[8:46, 180:218] = True
        ink[82:120, 180:182] = True
        ink[117:120, 180:200] = True
        ink[83:119, 215:218] = True
        ink[83:86, 194:218] = True
        self.assertFalse(layout._single_fraction_row(ink, 0, 119, 38))


if __name__ == "__main__":
    unittest.main()
