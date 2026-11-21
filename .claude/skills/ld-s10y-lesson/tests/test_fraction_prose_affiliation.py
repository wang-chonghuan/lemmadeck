"""Independent prose stays separate; fraction levels remain one printed row."""

from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class FractionProseAffiliationTests(unittest.TestCase):
    scale = 20

    def canvas(self):
        return np.zeros((180, 400), dtype=bool)

    def prose(self, ink, top):
        for left in (40, 70, 100):
            ink[top:top + self.scale, left:left + 14] = True

    def fraction(self, ink, bar_top):
        ink[bar_top - 22:bar_top - 6, 212:228] = True
        ink[bar_top:bar_top + 2, 200:260] = True
        ink[bar_top + 8:bar_top + 24, 212:228] = True
        ink[bar_top - 8:bar_top + 12, 345:359] = True
        return bar_top - 22, bar_top + 23

    def extent(self, ink):
        rows = np.flatnonzero(ink.any(axis=1))
        return int(rows[0]), int(rows[-1])

    def test_prose_above_a_fraction_is_not_its_inline_caption(self):
        ink = self.canvas()
        self.prose(ink, 40)
        self.fraction(ink, 102)
        a, b = self.extent(ink)
        self.assertFalse(layout._single_fraction_row(ink, a, b, self.scale))

    def test_prose_below_a_fraction_is_not_its_inline_caption(self):
        ink = self.canvas()
        self.fraction(ink, 58)
        self.prose(ink, 120)
        a, b = self.extent(ink)
        self.assertFalse(layout._single_fraction_row(ink, a, b, self.scale))

    def test_affiliated_prose_and_nested_denominator_remain_one_row(self):
        ink = self.canvas()
        self.prose(ink, 60)
        ink[48:64, 222:238] = True
        ink[70:72, 200:280] = True
        ink[78:98, 230:248] = True
        ink[108:110, 220:262] = True
        ink[116:136, 230:248] = True
        a, b = self.extent(ink)
        self.assertGreater(b - a + 1, 3 * self.scale)
        self.assertTrue(layout._single_fraction_row(ink, a, b, self.scale))

    def test_a_standalone_fraction_is_one_printed_row(self):
        ink = self.canvas()
        top, bottom = self.fraction(ink, 102)
        bands = layout.line_bands(ink, ink.shape[1])
        self.assertEqual(len(bands), 1)
        self.assertLessEqual(bands[0][0], top)
        self.assertGreaterEqual(bands[0][1], bottom)

    def test_multiple_prose_rows_precede_an_intact_fraction_tail(self):
        ink = self.canvas()
        prose_rows = (40, 67)
        for top in prose_rows:
            self.prose(ink, top)
        fraction_top, fraction_bottom = self.fraction(ink, 116)
        bands = layout.line_bands(ink, ink.shape[1])
        self.assertEqual(len(bands), len(prose_rows) + 1)
        owners = [(a, b) for a, b in bands
                  if a <= fraction_top and b >= fraction_bottom]
        self.assertEqual(len(owners), 1)
        self.assertTrue(layout._single_fraction_row(
            ink, owners[0][0], owners[0][1], self.scale,
        ))


class CompactFractionOwnershipTests(unittest.TestCase):
    scale = 40

    def canvas(self):
        return np.zeros((900, 1000), dtype=bool)

    def glyph(self, ink, left, top):
        ink[top:top + 40, left:left + 4] = True
        ink[top:top + 40, left + 20:left + 24] = True
        ink[top + 18:top + 22, left:left + 24] = True

    def prose(self, ink, top):
        for left in range(50, 290, 40):
            self.glyph(ink, left, top)

    def compact(self, ink, bar, width=100, short_side=False):
        ink[bar - 28:bar - 12, 524:540] = True
        ink[bar:bar + 4, 500:500 + width] = True
        ink[bar + 12:bar + 32, 524:540] = True
        if short_side:
            ink[bar - 7:bar + 5, 760:774] = True
        else:
            self.glyph(ink, 760, bar - 18)
        return bar - 28, bar + 31

    def tall(self, ink, bar):
        ink[bar - 70:bar - 10, 524:548] = True
        ink[bar:bar + 4, 500:660] = True
        ink[bar + 14:bar + 74, 524:548] = True
        self.glyph(ink, 760, bar - 18)
        return bar - 70, bar + 73

    def nested(self, ink, bar):
        ink[bar - 32:bar - 10, 530:552] = True
        ink[bar:bar + 4, 500:660] = True
        ink[bar + 24:bar + 48, 532:554] = True
        ink[bar + 56:bar + 60, 520:576] = True
        ink[bar + 72:bar + 96, 532:554] = True
        self.glyph(ink, 760, bar - 18)
        return bar - 32, bar + 95

    def calibrated(self, ink):
        for top in range(30, 400, 70):
            self.prose(ink, top)
        return ink

    def extent(self, ink):
        rows = np.flatnonzero(ink.any(axis=1))
        return int(rows[0]), int(rows[-1])

    def owners(self, bands, top, bottom):
        return [(a, b) for a, b in bands if a <= top and b >= bottom]

    def assert_intact(self, ink, top, bottom):
        self.assertTrue(layout._single_fraction_row(ink, top, bottom, self.scale))
        bands = layout.line_bands(self.calibrated(ink), ink.shape[1])
        self.assertEqual(len(self.owners(bands, top, bottom)), 1)

    def test_compact_fraction_owns_numerator_bar_and_denominator(self):
        ink = self.canvas()
        top, bottom = self.compact(ink, 650)
        self.assertLess(bottom - top + 1, 2 * self.scale)
        self.assert_intact(ink, top, bottom)

    def test_one_supported_prose_row_precedes_a_compact_fraction(self):
        ink = self.canvas()
        self.prose(ink, 540)
        top, bottom = self.compact(ink, 622)
        a, b = self.extent(ink)
        self.assertLess(b - a + 1, 3 * self.scale)
        cut = layout._fraction_tail_split(ink, a, b, ink.shape[1], self.scale)
        self.assertIsNotNone(cut)
        self.assertGreater(cut, 579)
        self.assertLessEqual(cut, top)
        self.assertTrue(layout._single_fraction_row(ink, cut, b, self.scale))

    def test_two_supported_prose_rows_keep_the_compact_tail_intact(self):
        ink = self.canvas()
        prose_tops = (530, 590)
        for top in prose_tops:
            self.prose(ink, top)
        top, bottom = self.compact(ink, 678)
        a, b = self.extent(ink)
        cut = layout._fraction_tail_split(ink, a, b, ink.shape[1], self.scale)
        self.assertIsNotNone(cut)
        self.assertGreater(cut, prose_tops[-1] + 39)
        self.assertLessEqual(cut, top)
        self.assertLess(b - cut + 1, 2 * self.scale)
        prefix_rows = layout._fraction_prefix_rows(ink[a:cut], ink.shape[1], self.scale)
        self.assertEqual(len(prefix_rows), len(prose_tops))
        bands = layout.line_bands(self.calibrated(ink), ink.shape[1])
        self.assertEqual(len(self.owners(bands, top, bottom)), 1)
        prose_owners = [self.owners(bands, y, y + 39) for y in prose_tops]
        self.assertTrue(all(len(owners) == 1 for owners in prose_owners))
        self.assertNotEqual(prose_owners[0], prose_owners[1])
        self.assertNotEqual(prose_owners[-1], self.owners(bands, top, bottom))

    def test_valid_narrow_bar_does_not_need_tall_bar_width(self):
        ink = self.canvas()
        self.prose(ink, 540)
        top, bottom = self.compact(ink, 622, width=self.scale)
        a, b = self.extent(ink)
        cut = layout._fraction_tail_split(ink, a, b, ink.shape[1], self.scale)
        self.assertIsNotNone(cut)
        self.assertLessEqual(cut, top)
        self.assertTrue(layout._single_fraction_row(ink, cut, bottom, self.scale))

    def test_compact_predicate_rejects_unaffiliated_prose_above(self):
        ink = self.canvas()
        self.prose(ink, 90)
        self.compact(ink, 156, short_side=True)
        a, b = self.extent(ink)
        self.assertFalse(layout._single_fraction_row(ink, a, b, self.scale))

    def test_compact_predicate_rejects_unaffiliated_prose_below(self):
        ink = self.canvas()
        self.compact(ink, 90, short_side=True)
        self.prose(ink, 118)
        a, b = self.extent(ink)
        self.assertFalse(layout._single_fraction_row(ink, a, b, self.scale))

    def test_tall_fraction_stays_one_owned_row(self):
        ink = self.canvas()
        top, bottom = self.tall(ink, 650)
        self.assertGreater(bottom - top + 1, 3 * self.scale)
        self.assert_intact(ink, top, bottom)

    def test_nested_fraction_stays_one_owned_row(self):
        ink = self.canvas()
        top, bottom = self.nested(ink, 650)
        self.assertGreater(bottom - top + 1, 3 * self.scale)
        self.assert_intact(ink, top, bottom)

    def test_prose_above_a_nested_fraction_is_not_its_body(self):
        ink = self.canvas()
        self.prose(ink, 520)
        self.nested(ink, 650)
        a, b = self.extent(ink)
        self.assertFalse(layout._single_fraction_row(ink, a, b, self.scale))

    def test_completed_bounded_short_rule_has_its_own_vertical_support(self):
        ink = self.canvas()
        ink[145:169, 345:369] = True
        ink[180:184, 300:430] = True
        ink[200:224, 345:369] = True
        ink[122:242, 445:450] = True
        ink[115:133, 456:472] = True
        ink[236:254, 456:472] = True
        ink[184:202, 602:618] = True
        ink[210:214, 600:620] = True
        ink[222:240, 602:618] = True
        self.prose(ink, 197)
        a, b = self.extent(ink)
        self.assertTrue(layout._single_fraction_row(ink, a, b, self.scale))


if __name__ == "__main__":
    unittest.main()
