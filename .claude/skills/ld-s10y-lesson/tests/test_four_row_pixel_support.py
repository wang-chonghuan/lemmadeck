"""Independent printed-row facts: fractions, accents, scan noise and baselines."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import line_bands


def glyph(ink, x, y, height=48, width=32):
    ink[y:y + height, x:x + width] = True
    ink[y + 4:y + height - 4, x + 4:x + width - 4] = False


def text(ink, y, x=160, count=10, height=48):
    for index in range(count):
        glyph(ink, x + index * 44, y, height)


def fraction(ink, x, y, width=160):
    for offset in range(12, width - 28, 40):
        glyph(ink, x + offset, y, height=40, width=28)
        glyph(ink, x + offset, y + 64, height=40, width=28)
    ink[y + 50:y + 54, x:x + width] = True


def radical(ink, x, y):
    ink[y:y + 4, x + 40:x + 240] = True
    for offset in range(60):
        ink[y + offset:y + offset + 4, x + 60 - offset:x + 64 - offset] = True
    for offset in range(72, 216, 40):
        glyph(ink, x + offset, y + 12, height=40, width=28)


class FourRowPixelSupportTests(unittest.TestCase):
    def assert_rows(self, ink, centres):
        original = ink.copy()
        bands = line_bands(ink, ink.shape[1])
        self.assertTrue(np.array_equal(original, ink), "Extraction ink is read-only.")
        self.assertEqual(len(centres), len(bands), bands)
        for centre, (a, b) in zip(centres, bands):
            self.assertLessEqual(a, centre)
            self.assertGreaterEqual(b, centre)

    def test_parallel_fractions_are_one_row_after_a_heading(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 80)
        fraction(ink, 160, 220)
        fraction(ink, 620, 220)
        self.assert_rows(ink, [104, 272])

    def test_isolated_blemish_cannot_connect_heading_to_fractions(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 80)
        fraction(ink, 160, 220)
        fraction(ink, 620, 220)
        ink[157:179, 60:86] = True
        ink[149:156, 870:898] = True
        self.assert_rows(ink, [104, 272])

    def test_raised_arrow_and_distant_specks_are_not_an_extra_row(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 70)
        text(ink, 220)
        text(ink, 340)
        ink[202:206, 248:320] = True
        for offset in range(16):
            ink[194 + offset:198 + offset, 306 + offset:310 + offset] = True
        ink[182:190, 60:84] = True
        self.assert_rows(ink, [94, 244, 364])

    def test_radical_fraction_page_keeps_seven_rows_and_footer(self):
        ink = np.zeros((2100, 1000), dtype=bool)
        text(ink, 80)
        radical(ink, 160, 200)
        radical(ink, 600, 200)
        fraction(ink, 160, 340)
        fraction(ink, 600, 340)
        radical(ink, 160, 500)
        radical(ink, 160, 640)
        fraction(ink, 160, 780)
        fraction(ink, 160, 940)
        text(ink, 1880, count=2, height=32)
        for index in range(30):
            y = 1120 + index * 22
            ink[y:y + 6 + index % 5, 750:770] = True
        self.assert_rows(ink, [104, 230, 392, 530, 670, 832, 992, 1896])

    def test_two_full_baselines_with_interline_specks_remain_two(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 80)
        text(ink, 164, count=16)
        ink[141:147, 900:920] = True
        self.assert_rows(ink, [104, 188])

    def test_wrapped_text_below_fractions_is_not_a_denominator(self):
        ink = np.zeros((500, 1000), dtype=bool)
        fraction(ink, 160, 80)
        fraction(ink, 600, 80)
        text(ink, 214, count=5)
        self.assert_rows(ink, [132, 238])

    def test_two_equation_rows_are_not_a_single_inline_fraction(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 80)
        text(ink, 200, count=6)
        text(ink, 284, count=6)
        ink[200:332, 132:137] = True
        self.assert_rows(ink, [104, 224, 308])

    def test_short_quotient_is_retained_beside_a_noisy_blank_area(self):
        ink = np.zeros((700, 1000), dtype=bool)
        text(ink, 80)
        glyph(ink, 360, 240, height=32, width=18)
        for index in range(10):
            ink[400 + index * 20:406 + index * 20, 800:820] = True
        self.assert_rows(ink, [104, 256])

    def test_supported_small_subpart_label_is_retained(self):
        ink = np.zeros((500, 1000), dtype=bool)
        text(ink, 80)
        glyph(ink, 160, 240, height=20, width=14)
        glyph(ink, 184, 240, height=20, width=14)
        self.assert_rows(ink, [104, 250])

    def test_separated_fraction_rows_do_not_collapse(self):
        ink = np.zeros((700, 1000), dtype=bool)
        text(ink, 60)
        fraction(ink, 160, 220)
        fraction(ink, 600, 220)
        fraction(ink, 160, 410)
        fraction(ink, 600, 410)
        self.assert_rows(ink, [84, 272, 462])


if __name__ == "__main__":
    unittest.main()
