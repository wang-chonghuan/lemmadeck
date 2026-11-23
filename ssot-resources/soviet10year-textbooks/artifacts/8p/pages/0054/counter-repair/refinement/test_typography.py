"""Additional small-type positives and absence/noise controls."""
import unittest

import numpy as np

import layout
from p54_controls import Page54CounterTests, ROWS


class SmallerTypeRecoveryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not hasattr(Page54CounterTests, "ink"):
            Page54CounterTests.setUpClass()
        cls.ink = Page54CounterTests.ink

    def test_both_real_footnote_denominators_are_standalone_rows(self):
        for box in ((2218, 2247, 1398, 1416), (2222, 2250, 220, 238)):
            top, bottom, left, right = box
            sample = self.ink[top:bottom, left:right]
            for x in (24, 600, 1400):
                for mirrored in (False, True):
                    with self.subTest(box=box, left=x, mirrored=mirrored):
                        control = self.ink.copy()
                        control[2420:2420 + sample.shape[0], x:x + sample.shape[1]] |= sample
                        if mirrored:
                            control = np.fliplr(control)
                        bands = layout.line_bands(control, 1690)
                        self.assertEqual(len(bands), 22)
                        self.assertTrue(any(a <= 2435 <= b for a, b in bands))

    def test_letter_sized_mark_without_nearby_small_type_is_not_recovered(self):
        control = self.ink.copy()
        control[2118:2250] = False
        expected = layout.line_bands(control, 1690)
        for box in ((1855, 1889, 849, 877), (2218, 2247, 1398, 1416)):
            top, bottom, left, right = box
            sample = self.ink[top:bottom, left:right]
            for x in (24, 600, 1400):
                with self.subTest(box=box, left=x):
                    actual = control.copy()
                    actual[2420:2420 + sample.shape[0], x:x + sample.shape[1]] |= sample
                    self.assertEqual(layout.line_bands(actual, 1690), expected)

    def test_subtypographic_specks_are_not_extra_rows(self):
        samples = [self.ink[1855:1889, 849:877][::2, ::2]]
        for height, width in ((2, 2), (5, 5), (12, 12), (18, 9)):
            samples.append(np.ones((height, width), dtype=bool))
        for sample in samples:
            for left in (24, 600, 1400):
                with self.subTest(shape=sample.shape, left=left):
                    control = self.ink & ~Page54CounterTests.separator
                    control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                    self.assertEqual(len(layout.line_bands(control, 1690)), 21)

    def test_separator_rule_is_vertical_position_independent(self):
        for offset in (70, 170):
            with self.subTest(offset=offset):
                control = np.pad(self.ink, ((offset, 90), (0, 0)))
                bands = layout.line_bands(control, 1690)
                self.assertEqual(len(bands), 21)
                for (a, b), (top, bottom) in zip(bands, ROWS):
                    self.assertLessEqual(a, (top + bottom) // 2 + offset)
                    self.assertLessEqual((top + bottom) // 2 + offset, b)
