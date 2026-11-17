"""Independent boundaries for close-gap attribution of detached horizontal ink."""
from __future__ import annotations

import hashlib
import json
import unittest

import numpy as np

import layout


def glyphs(ink, y, x=100, count=9, height=20, width=16, pitch=27):
    for index in range(count):
        left = x + pitch * index
        ink[y:y + height, left:left + width] = True


def ordinary_page():
    ink = np.zeros((1000, 900), dtype=bool)
    for y in (70, 130, 190, 250, 600, 660):
        glyphs(ink, y)
    return ink


def close_offset_rows():
    ink = ordinary_page()
    glyphs(ink, 310)
    ink[335:338, 510:630] = True
    glyphs(ink, 344)
    return ink


class OffsetRuleRows(unittest.TestCase):
    def assert_rows(self, ink, expected, rule_rows=None, separate_rule=False):
        before = ink.copy()
        before_hash = hashlib.sha256(ink.tobytes()).hexdigest()
        bands = layout.line_bands(ink, ink.shape[1])
        np.testing.assert_array_equal(ink, before)
        after_hash = hashlib.sha256(ink.tobytes()).hexdigest()
        self.assertEqual(before_hash, after_hash)
        rule_retained = None
        if rule_rows is not None:
            first, last = rule_rows
            rule_retained = all(any(a <= y <= b for a, b in bands) for y in range(first, last + 1))
            self.assertTrue(rule_retained)
            if separate_rule:
                self.assertIn(rule_rows, bands)
        print(json.dumps({
            "fixture": self._testMethodName, "independent_expected_rows": expected,
            "actual_rows": len(bands), "bands": bands,
            "input_sha256": before_hash, "after_sha256": after_hash,
            "ink_pixels_before": int(before.sum()), "ink_pixels_after": int(ink.sum()),
            "unchanged_ink": True, "rule_rows": rule_rows, "rule_retained": rule_retained,
        }))
        self.assertEqual(len(bands), expected)

    def test_rule_close_to_both_body_rows_stays_separate(self):
        self.assert_rows(close_offset_rows(), 9, (335, 337), separate_rule=True)

    def test_scaled_reflected_rule_stays_separate(self):
        ink = np.repeat(np.repeat(close_offset_rows()[:, ::-1], 2, axis=0), 2, axis=1)
        self.assert_rows(ink, 9, (670, 675), separate_rule=True)

    def test_rule_inside_horizontal_envelope_without_ink_support_stays_separate(self):
        ink = ordinary_page()
        for y in (350, 388):
            glyphs(ink, y, x=100, count=3)
            glyphs(ink, y, x=450, count=3)
        ink[375:378, 280:380] = True
        self.assert_rows(ink, 9, (375, 377), separate_rule=True)

    def test_disjoint_rule_at_close_gap_boundary_stays_separate(self):
        ink = ordinary_page()
        glyphs(ink, 350)
        ink[377:380, 510:630] = True
        glyphs(ink, 394)
        self.assert_rows(ink, 9, (377, 379), separate_rule=True)

    def test_standalone_minus_row_is_not_dropped_or_attached(self):
        ink = ordinary_page()
        glyphs(ink, 350)
        ink[375:378, 510:558] = True
        glyphs(ink, 388)
        self.assert_rows(ink, 9, (375, 377), separate_rule=True)

    def test_inline_minus_keeps_its_body_row(self):
        ink = ordinary_page()
        glyphs(ink, 350)
        ink[358:361, 510:558] = True
        self.assert_rows(ink, 7, (358, 360))

    def test_aligned_rule_with_close_numerator_and_denominator_is_one_row(self):
        ink = ordinary_page()
        glyphs(ink, 346, x=330, count=2, height=18, width=18, pitch=43)
        ink[368:371, 320:415] = True
        glyphs(ink, 375, x=330, count=2, height=18, width=18, pitch=43)
        self.assert_rows(ink, 7, (368, 370))

    def test_body_connected_fraction_rule_is_one_row(self):
        ink = ordinary_page()
        glyphs(ink, 346, x=330, count=2, height=18, width=18, pitch=43)
        ink[362:371, 343:346] = True
        ink[368:371, 320:415] = True
        glyphs(ink, 375, x=330, count=2, height=18, width=18, pitch=43)
        self.assert_rows(ink, 7, (368, 370))

    def test_delimiter_connected_multirow_math_stays_two_rows(self):
        ink = ordinary_page()
        glyphs(ink, 350)
        glyphs(ink, 386)
        ink[350:406, 500:503] = True
        ink[350:353, 500:507] = True
        ink[403:406, 496:503] = True
        self.assert_rows(ink, 8)


if __name__ == "__main__":
    unittest.main()
