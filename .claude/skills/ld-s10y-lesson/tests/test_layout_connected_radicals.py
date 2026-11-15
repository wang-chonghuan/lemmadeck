"""Printed-row expectations for connected radical caps, not projection runs."""

import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class ConnectedRadicalRowsTest(unittest.TestCase):
    def page(self):
        image = Image.new("L", (480, 210), 255)
        return image, ImageDraw.Draw(image)

    def text_row(self, draw, top, left=90, count=10):
        for index in range(count):
            x = left + index * 26
            draw.rectangle((x, top, x + 13, top + 31), fill=0)

    def radical(self, draw):
        draw.line((230, 32, 268, 32), fill=0, width=4)
        draw.line((230, 32, 216, 94), fill=0, width=2)
        draw.line((200, 73, 207, 68, 216, 94), fill=0, width=2)

    def bands(self, image):
        return layout.line_bands(np.asarray(image) < 128, 440)

    def test_radical_cap_and_main_formula_are_one_printed_row(self):
        image, draw = self.page()
        self.radical(draw)
        self.text_row(draw, 62, count=4)
        draw.rectangle((245, 62, 258, 93), fill=0)
        self.text_row(draw, 140)
        ink = np.asarray(image) < 128
        before = ink.copy()

        bands = layout.line_bands(ink, 440)

        self.assertEqual(len(bands), 2)  # One formula, then one ordinary row.
        self.assertLessEqual(bands[0][0], 32)
        self.assertGreaterEqual(bands[0][1], 93)
        np.testing.assert_array_equal(ink, before)

    def test_radical_cap_with_fraction_is_one_printed_row(self):
        image, draw = self.page()
        self.radical(draw)
        self.text_row(draw, 62, count=4)
        draw.rectangle((248, 62, 257, 74), fill=0)
        draw.line((239, 80, 268, 80), fill=0, width=3)
        draw.rectangle((248, 86, 258, 97), fill=0)
        self.text_row(draw, 140)

        self.assertEqual(len(self.bands(image)), 2)

    def test_independent_rule_and_formula_remain_two_rows(self):
        image, draw = self.page()
        draw.line((230, 32, 268, 32), fill=0, width=4)
        self.text_row(draw, 62)
        self.text_row(draw, 140)

        self.assertEqual(len(self.bands(image)), 3)

    def test_title_and_body_remain_separate_rows(self):
        image, draw = self.page()
        self.text_row(draw, 30, left=178, count=4)
        self.text_row(draw, 94)
        self.text_row(draw, 158)

        self.assertEqual(len(self.bands(image)), 3)

    def test_rule_with_vertical_connector_is_not_a_radical(self):
        image, draw = self.page()
        draw.line((230, 32, 268, 32), fill=0, width=4)
        draw.line((230, 32, 230, 94), fill=0, width=2)
        self.text_row(draw, 62, left=230, count=4)
        self.text_row(draw, 140)

        self.assertEqual(len(self.bands(image)), 3)


if __name__ == "__main__":
    unittest.main()
