from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import line_bands


class PunctuatedShortRowTests(unittest.TestCase):
    def image(self):
        ink = np.zeros((430, 600), dtype=bool)
        for y in (40, 120, 350):
            for x in (60, 110, 160, 210):
                ink[y:y + 37, x:x + 25] = True
        return ink

    def test_one_stroke_glyph_with_semicolon_is_a_row(self):
        ink = self.image()
        ink[245:252, 100:140] = True
        ink[241:248, 145:152] = True
        ink[255:268, 145:153] = True
        original = ink.copy()
        bands = line_bands(ink, 540)
        self.assertEqual(len(bands), 4)
        self.assertTrue(any(a <= 241 and b >= 267 for a, b in bands))
        np.testing.assert_array_equal(ink, original)

    def test_one_stroke_without_punctuation_is_not_a_row(self):
        ink = self.image()
        ink[245:252, 100:140] = True
        self.assertEqual(len(line_bands(ink, 540)), 3)

    def test_unaligned_specks_do_not_support_a_streak(self):
        ink = self.image()
        ink[245:252, 100:140] = True
        ink[241:248, 145:152] = True
        ink[255:268, 170:178] = True
        self.assertEqual(len(line_bands(ink, 540)), 3)


if __name__ == "__main__":
    unittest.main()
