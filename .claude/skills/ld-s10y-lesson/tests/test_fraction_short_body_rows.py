import hashlib
from pathlib import Path
import sys
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def glyph(ink, y, x, height=40, width=26):
    ink[y:y + height, x:x + 3] = True
    ink[y:y + height, x + width // 2:x + width // 2 + 3] = True
    ink[y:y + height, x + width - 3:x + width] = True
    ink[y:y + 3, x:x + width] = True
    ink[y + height - 3:y + height, x:x + width] = True


def prose(ink, y, xs, height=40, width=26):
    for x in xs:
        glyph(ink, y, x, height, width)


def fraction(ink, top=252, with_prose=True):
    prose(ink, top, [470, 510, 550], height=28, width=24)
    ink[top + 43:top + 46, 450:610] = True
    prose(ink, top + 60, [470, 510, 550], height=28, width=24)
    if with_prose:
        prose(ink, top + 20, [100, 145, 190, 750, 795, 840])


def page_with_fraction():
    ink = np.zeros((550, 1100), dtype=bool)
    for y in (20, 100, 180):
        prose(ink, y, range(100, 920, 45))
    fraction(ink)
    return ink


class FractionShortBodyRows(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        fixture = Path(__file__).parent / "fixtures" / "7p-0242.png"
        if hashlib.sha256(fixture.read_bytes()).hexdigest() != (
            "6e9bd9cd4db3940c3497de0100d6207285fdbe46af260f28d191c055960e914d"
        ):
            raise AssertionError("Original source fixture changed")
        with Image.open(fixture) as image:
            cls.source_ink = layout.ink_mask(image)

    def test_source_q2_first_fraction_is_one_row(self):
        for height in (40, 41):
            with self.subTest(height=height):
                self.assertTrue(layout._single_fraction_row(self.source_ink, 1012, 1099, height))

    def test_source_q2_short_body_is_independent(self):
        for height in (40, 41):
            with self.subTest(height=height):
                self.assertFalse(layout._single_fraction_row(self.source_ink, 1012, 1143, height))

    def test_source_q3_full_fraction_is_one_row(self):
        for height in (40, 41):
            with self.subTest(height=height):
                self.assertTrue(layout._single_fraction_row(self.source_ink, 1148, 1238, height))

    def test_source_exact_rows_preserve_the_two_questions(self):
        # Original p0242: Q2's short final row lies between two whole fractions.
        self.assertEqual(layout.line_bands(self.source_ink, self.source_ink.shape[1]), [
            (187, 280), (311, 352), (382, 424), (453, 494), (525, 566),
            (599, 638), (669, 711), (742, 783), (871, 908), (939, 980),
            (1012, 1099), (1113, 1143), (1148, 1238), (1268, 1309),
            (1341, 1381), (1456, 1502), (1535, 1580), (1627, 1669),
            (1699, 1740), (1771, 1813), (1844, 1885), (1915, 1954),
            (1993, 2018),
        ])

    def test_one_fraction(self):
        ink = page_with_fraction()
        self.assertTrue(layout._single_fraction_row(ink, 252, 339, 40))
        self.assertEqual(layout.line_bands(ink, ink.shape[1]),
                         [(20, 59), (100, 139), (180, 219), (252, 339)])

    def test_offset_complete_body_row(self):
        ink = page_with_fraction()
        prose(ink, 353, [220, 263], height=31, width=28)
        self.assertFalse(layout._single_fraction_row(ink, 252, 383, 40))
        self.assertEqual(layout.line_bands(ink, ink.shape[1]),
                         [(20, 59), (100, 139), (180, 219), (252, 339), (353, 383)])

    def test_partial_body_ink_does_not_expand_a_detected_row(self):
        ink = page_with_fraction()
        glyph(ink, 353, 220, height=38, width=28)
        ink[353:360, 220:248] = False
        ink[353:360, 220:223] = True
        ink[353:360, 245:248] = True
        self.assertEqual(layout.line_bands(ink, ink.shape[1]),
                         [(20, 59), (100, 139), (180, 219), (252, 339), (360, 390)])

    def test_denominator_only_is_not_an_independent_body_pair(self):
        ink = np.zeros((440, 1100), dtype=bool)
        fraction(ink, with_prose=False)
        prose(ink, 310, [150, 195], height=30)
        self.assertTrue(layout._single_fraction_row(ink, 252, 339, 40))

    def test_detached_denominator_only_is_not_inline_prose(self):
        ink = np.zeros((440, 1100), dtype=bool)
        fraction(ink, with_prose=False)
        prose(ink, 352, [150, 195], height=31)
        self.assertFalse(layout._single_fraction_row(ink, 252, 383, 40))

    def test_scrambled_fragments_do_not_prove_a_complete_row(self):
        ink = page_with_fraction()
        for y, x in ((348, 200), (362, 245), (375, 290)):
            glyph(ink, y, x, height=10, width=15)
        self.assertTrue(layout._single_fraction_row(ink, 252, 384, 40))

    def test_adjacent_next_fraction_keeps_its_numerator_and_denominator(self):
        ink = page_with_fraction()
        prose(ink, 353, [220, 263], height=31, width=28)
        fraction(ink, top=389)
        self.assertEqual(layout.line_bands(ink, ink.shape[1]), [
            (20, 59), (100, 139), (180, 219), (252, 339), (353, 383), (389, 476),
        ])

    def test_adjacent_full_fractions_without_short_row(self):
        ink = page_with_fraction()
        fraction(ink, top=353)
        self.assertEqual(layout.line_bands(ink, ink.shape[1]), [
            (20, 59), (100, 139), (180, 219), (252, 339), (353, 440),
        ])


if __name__ == "__main__":
    unittest.main()
