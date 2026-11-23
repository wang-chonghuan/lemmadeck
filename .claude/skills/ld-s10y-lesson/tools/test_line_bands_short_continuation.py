"""Full body rows must survive false fraction rules before column masking."""
import unittest

import numpy as np

from layout import _single_fraction_row, line_bands


def glyph(ink, x, y, size=40):
    ink[y:y + 3, x:x + size] = True
    ink[y + size - 3:y + size, x:x + size] = True
    ink[y:y + size, x:x + 3] = True
    ink[y:y + size, x + size - 3:x + size] = True


def continuation():
    ink = np.zeros((600, 1000), dtype=bool)
    for x in (200, 248, 296, 344):
        glyph(ink, x, 100)
    for x in (200, 248):
        glyph(ink, x, 178)
    # Nearby margin ink stretches the first projection without being a body row.
    ink[130:165, 22:47] = True
    for y in (300, 390, 480):
        for x in (200, 248, 296, 344):
            glyph(ink, x, y)
    return ink


class ShortContinuationTests(unittest.TestCase):
    def test_aligned_two_glyph_body_row_is_not_a_fraction(self):
        ink = continuation()
        self.assertFalse(_single_fraction_row(ink, 100, 217, 40))
        self.assertEqual(len(line_bands(ink, 1000)), 5)

    def test_deleting_first_actual_body_row_decreases_count(self):
        ink = continuation()
        ink[100:165] = False
        self.assertEqual(len(line_bands(ink, 1000)), 4)

    def test_deleting_short_actual_body_row_decreases_count(self):
        ink = continuation()
        ink[178:218, 200:288] = False
        self.assertEqual(len(line_bands(ink, 1000)), 4)

    def test_centered_two_glyph_denominator_remains_one_fraction(self):
        ink = np.zeros((160, 1000), dtype=bool)
        for x in (200, 248, 296):
            glyph(ink, x, 10)
        ink[69:72, 190:347] = True
        for x in (224, 272):
            glyph(ink, x, 95)
        self.assertTrue(_single_fraction_row(ink, 10, 134, 40))


if __name__ == "__main__":
    unittest.main()
