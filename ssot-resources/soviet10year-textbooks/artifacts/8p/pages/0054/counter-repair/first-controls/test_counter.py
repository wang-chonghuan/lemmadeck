"""Private original-pixel controls; no finalize or source mutations."""
import copy
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

import blocks
import layout

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
ROWS = (
    (381, 452), (557, 605), (661, 709), (744, 794), (823, 868),
    (901, 948), (983, 1026), (1064, 1110), (1144, 1188),
    (1225, 1272), (1304, 1351), (1443, 1495), (1549, 1595),
    (1630, 1677), (1715, 1760), (1800, 1867), (1930, 1975),
    (2012, 2058), (2120, 2155), (2189, 2243), (2295, 2321),
)


def counted_mask(ink):
    captured = []

    def trace(frame, event, arg):
        if frame.f_code is layout.line_bands.__code__ and event == "return":
            captured.append(frame.f_locals["ink"].copy())
        return trace

    old = sys.gettrace()
    try:
        sys.settrace(trace)
        bands = layout.line_bands(ink, 1690)
    finally:
        sys.settrace(old)
    return bands, captured[0]


class Page54CounterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0054/page.png") as im:
            cls.ink = layout.ink_mask(im)
        with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0031/page.png") as im:
            cls.minus_ink = layout.ink_mask(im)
        cls.meta, cls.parsed = blocks.parse((ROOT /
            "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/"
            "finalize-first-failure/page.md").read_text())
        cls.separator = np.zeros_like(cls.ink)
        cls.separator[2095:2102, 178:663] = cls.ink[2095:2102, 178:663]

    def inventory(self, bands, rows=ROWS):
        self.assertEqual(len(bands), len(rows))
        anchors = [(a + b) // 2 for a, b in rows]
        for (a, b), anchor in zip(bands, anchors):
            self.assertLessEqual(a, anchor)
            self.assertLessEqual(anchor, b)
            self.assertEqual(sum(a <= other <= b for other in anchors), 1)

    def test_all_real_rows_and_original_input_survive(self):
        original = self.ink.copy()
        self.inventory(layout.line_bands(self.ink, 1690))
        np.testing.assert_array_equal(self.ink, original)
        self.assertEqual(blocks.printed_lines(self.parsed), 21)

    def test_actual_separator_is_the_only_extra_filtered_ink(self):
        _, actual = counted_mask(self.ink)
        no_rule = self.ink & ~self.separator
        _, expected = counted_mask(no_rule)
        np.testing.assert_array_equal(actual, expected)
        self.assertEqual(int(self.separator.sum()), 1802)
        self.inventory(layout.line_bands(no_rule, 1690))

    def test_every_actual_text_row_deletion_lowers_count(self):
        for row in ROWS:
            with self.subTest(row=row):
                control = self.ink.copy()
                control[row[0]:row[1] + 1] = False
                self.inventory(
                    layout.line_bands(control, 1690),
                    tuple(other for other in ROWS if other != row),
                )

    def test_each_authored_omission_fails_reconciliation(self):
        count = len(layout.line_bands(self.ink, 1690))
        self.assertEqual(count, 21)
        omissions = 0
        for index, block in enumerate(self.parsed):
            for line in range(len(block["lines"])):
                control = copy.deepcopy(self.parsed)
                del control[index]["lines"][line]
                self.assertEqual(blocks.printed_lines(control), count - 1)
                omissions += 1
        self.assertEqual(omissions, 21)

    def test_scientific_fraction_numerator_denominator_and_body_ink_survive(self):
        _, mask = counted_mask(self.ink)
        for box in (
            (1795, 1875, 708, 900), (2118, 2158, 252, 1448),
            (2185, 2247, 178, 1440), (2010, 2062, 178, 568),
        ):
            with self.subTest(box=box):
                a, b, c, d = box
                np.testing.assert_array_equal(mask[a:b, c:d], self.ink[a:b, c:d])

    def test_actual_formula_numerator_denominator_and_body_are_extra_rows(self):
        for box in (
            (1795, 1875, 708, 900), (1800, 1833, 848, 878),
            (1848, 1875, 849, 877), (1223, 1275, 278, 332),
            (718, 776, 390, 496),
        ):
            for left in (24, 600, 1400):
                with self.subTest(box=box, left=left):
                    a, b, c, d = box
                    source = self.minus_ink if a == 718 else self.ink
                    sample = source[a:b, c:d]
                    control = self.ink.copy()
                    control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                    bands = layout.line_bands(control, 1690)
                    self.assertEqual(len(bands), 22)
                    self.assertTrue(any(a <= 2435 <= b for a, b in bands))

    def test_true_minus_stroke_and_real_fraction_bars_are_not_newly_masked(self):
        # Short original horizontal ink stays in an otherwise real text row.
        for source, box in (
            (self.minus_ink, (730, 754, 394, 451)),
            (self.ink, (1844, 1849, 835, 889)),
            (self.ink, (2206, 2214, 210, 247)),
            (self.ink, (2205, 2213, 1388, 1430)),
        ):
            a, b, c, d = box
            sample = source[a:b, c:d]
            self.assertTrue(sample.any())
            control = self.ink.copy()
            control[2130:2130 + sample.shape[0], 1460:1460 + sample.shape[1]] |= sample
            _, mask = counted_mask(control)
            self.assertTrue(np.all(
                mask[2130:2130 + sample.shape[0], 1460:1460 + sample.shape[1]][sample]
            ))

    def test_same_shape_without_smaller_footnote_type_is_not_a_separator(self):
        control = self.ink.copy()
        control[2120:2244] = False
        for a, b, top in ((1225, 1272, 2120), (1304, 1351, 2200)):
            sample = self.ink[a:b + 1]
            control[top:top + sample.shape[0]] |= sample
        _, mask = counted_mask(control)
        self.assertTrue(np.all(mask[self.separator]))

    def test_long_fraction_with_numerator_and_denominator_keeps_rule_pixels(self):
        control = self.ink.copy()
        # A stretched bar still has genuine original numerator/denominator ink.
        for box, top in (((1800, 1833, 848, 878), 2055),
                         ((1848, 1875, 849, 877), 2110)):
            a, b, c, d = box
            sample = self.ink[a:b, c:d]
            control[top:top + sample.shape[0], 400:400 + sample.shape[1]] |= sample
        _, mask = counted_mask(control)
        self.assertTrue(np.all(mask[self.separator]))

    def test_mirrored_source_keeps_all_real_rows(self):
        self.inventory(layout.line_bands(np.fliplr(self.ink), 1690))

    def test_removing_actual_margin_marks_keeps_all_real_rows(self):
        control = self.ink.copy()
        control[:, 1580:] = False
        self.inventory(layout.line_bands(control, 1690))

