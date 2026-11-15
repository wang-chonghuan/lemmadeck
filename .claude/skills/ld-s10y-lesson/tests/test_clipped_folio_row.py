"""A projected ornament row must retain the complete narrow folio glyph."""

import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _decorated_folio, line_bands


class ClippedFolioRowTests(unittest.TestCase):
    def page(self):
        ink = np.zeros((2126, 1506), dtype=bool)
        for y in (150, 300, 450, 600):
            for x in range(180, 1000, 50):
                ink[y:y + 43, x:x + 25] = True
        ink[1975, 20] = True
        ink[1984:1986, 197] = True
        return ink

    def folio(self, ink):
        ink[1974:1986, 1158:1169] = True
        ink[1974:1985, 1268:1280] = True
        ink[1965:1993, 1216:1221] = True
        ink[1965:1967, 1209:1224] = True
        ink[1991:1993, 1209:1224] = True

    def test_complete_folio_not_just_projected_dots_is_recognized(self):
        ink = self.page()
        self.folio(ink)
        self.assertFalse(_decorated_folio(ink, 1974, 1985, 43))
        self.assertTrue(_decorated_folio(ink, 1965, 1992, 43))
        self.assertEqual(len(line_bands(ink, 1466)), 5)

    def test_same_shape_away_from_footer_is_not_folio(self):
        ink = self.page()
        self.folio(ink)
        ink[974:986, 1158:1169] = ink[1974:1986, 1158:1169]
        ink[974:985, 1268:1280] = ink[1974:1985, 1268:1280]
        ink[965:993, 1209:1224] = ink[1965:1993, 1209:1224]
        self.assertFalse(_decorated_folio(ink, 965, 992, 43))

    def test_three_short_dots_and_dust_are_not_a_folio(self):
        ink = self.page()
        for x in (1158, 1210, 1268):
            ink[1974:1986, x:x + 11] = True
        self.assertFalse(_decorated_folio(ink, 1974, 1985, 43))
        self.assertEqual(len(line_bands(ink, 1466)), 4)

    def test_wide_footer_separator_remains_nontext(self):
        ink = self.page()
        ink[1974:1986, 180:1280] = True
        self.assertFalse(_decorated_folio(ink, 1974, 1985, 43))
        self.assertEqual(len(line_bands(ink, 1466)), 4)


if __name__ == "__main__":
    unittest.main()
