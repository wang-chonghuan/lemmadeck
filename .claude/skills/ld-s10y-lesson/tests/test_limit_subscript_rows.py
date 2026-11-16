"""Independent printed-row expectations, not counts copied from layout output."""
import hashlib
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import _merge_close, ink_mask, line_bands


ROOT = Path(__file__).resolve().parents[4]


def glyph(ink, x, y, width=26, height=40, stroke=3):
    ink[y:y + height, x:x + stroke] = True
    ink[y:y + height, x + width - stroke:x + width] = True
    ink[y:y + stroke, x:x + width] = True
    ink[y + height - stroke:y + height, x:x + width] = True


def page():
    ink = np.zeros((1500, 1100), dtype=bool)
    # Eight unrelated, explicit body rows establish the ordinary font scale.
    for y in range(100, 661, 80):
        for x in range(100, 421, 40):
            glyph(ink, x, y)
    return ink


def limit(ink, x, y):
    glyph(ink, x, y, 12, 34)
    glyph(ink, x + 18, y + 10, 10, 24)
    glyph(ink, x + 34, y + 10, 28, 24)
    for dx in (90, 124, 158):
        glyph(ink, x + dx, y + 8, 24, 28)


def script(ink, x, y, fraction=False):
    glyph(ink, x, y, 12, 14, 2)
    glyph(ink, x + 18, y + 2, 12, 10, 2)
    glyph(ink, x + 38, y, 14, 12, 2)
    if fraction:
        ink[y + 16:y + 19, x + 34:x + 60] = True
        glyph(ink, x + 40, y + 24, 14, 14, 2)


class LimitSubscriptRowsTest(unittest.TestCase):
    def test_contained_projection_fragments_cannot_shorten_a_glyph(self):
        self.assertEqual(
            _merge_close([(100, 139), (110, 112), (130, 135), (160, 179)], 0),
            [(100, 139), (160, 179)],
        )

    def assert_rows(self, ink, target_rows):
        original = ink.copy()
        self.assertEqual(len(line_bands(ink, ink.shape[1])), 8 + target_rows)
        np.testing.assert_array_equal(ink, original)

    def test_local_left_subscript_is_not_a_separate_row(self):
        ink = page()
        limit(ink, 200, 780)
        script(ink, 200, 835)
        self.assert_rows(ink, 1)

    def test_staggered_parallel_fractional_subscripts_share_one_row(self):
        for offsets in ((0, 12, 0), (15, 0, 15), (12, 15)):
            with self.subTest(offsets=offsets):
                ink = page()
                for index, offset in enumerate(offsets):
                    x = 130 + 300 * index
                    limit(ink, x, 780)
                    script(ink, x, 830 + offset, fraction=offset > 0)
                glyph(ink, 1030, 860, 10, 14, 2)  # Isolated side speck.
                self.assert_rows(ink, 1)

    def test_preceding_prose_and_tall_fraction_are_two_rows(self):
        ink = page()
        glyph(ink, 160, 780)
        glyph(ink, 200, 780)
        limit(ink, 200, 885)
        script(ink, 200, 940)
        for x in (540, 580, 620):
            glyph(ink, x, 835, 26, 34)
            glyph(ink, x, 923, 26, 34)
        ink[906:909, 510:710] = True
        script(ink, 540, 975)
        self.assert_rows(ink, 2)

    def test_two_cases_branches_remain_two_rows(self):
        ink = page()
        glyph(ink, 420, 780, 22, 22)
        ink[810:813, 410:490] = True
        glyph(ink, 430, 820, 22, 22)
        for y in (790, 895):
            for x in (640, 680, 720):
                glyph(ink, x, y)
        glyph(ink, 440, 895)
        ink[780:935, 390:395] = True
        self.assert_rows(ink, 2)

    def test_single_tall_fraction_is_not_split(self):
        ink = page()
        for x in (420, 460, 500):
            glyph(ink, x, 780)
            glyph(ink, x, 890)
        ink[851:854, 400:550] = True
        glyph(ink, 650, 835)
        self.assert_rows(ink, 1)

    def test_independent_complete_number_under_text_is_not_a_subscript(self):
        ink = page()
        limit(ink, 200, 780)
        glyph(ink, 220, 835)
        self.assert_rows(ink, 2)

    def test_three_small_font_rows_are_not_discarded_as_scripts(self):
        ink = page()
        for y in (780, 805, 830):
            for x in (200, 224, 248, 272):
                glyph(ink, x, y, 14, 18, 2)
        self.assert_rows(ink, 3)

    def test_two_brace_connected_ordinary_rows_are_not_merged(self):
        ink = page()
        for y in (780, 834):
            for x in (200, 240, 280, 320):
                glyph(ink, x, y, 24, 32)
        ink[780:866, 180:185] = True
        self.assert_rows(ink, 2)

    def test_frozen_source_rows_and_affected_regions(self):
        cases = (
            ("0015", "eb8a734d0f3823857b8fbc1f9c72eed5c40a7486fece8e80548e69cbf80a0a41",
             22, ((1426, 1518, 1), (2004, 2237, 2))),
            ("0016", "ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340",
             20, ((528, 642, 1), (665, 791, 1), (791, 928, 1), (1197, 1382, 2))),
        )
        for number, digest, expected, regions in cases:
            with self.subTest(page=number):
                path = ROOT / ".tmp/ld-s10y-lesson/10c/pages" / number / "page.png"
                if not path.exists():
                    self.skipTest("Optional original scan is not present")
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), digest)
                with Image.open(path) as img:
                    ink = ink_mask(img)
                before = ink.copy()
                bands = line_bands(ink, ink.shape[1])
                self.assertEqual(len(bands), expected)
                for top, bottom, rows in regions:
                    self.assertEqual(
                        sum(a <= bottom and b >= top for a, b in bands), rows,
                        f"p{number} frozen region {top}:{bottom}",
                    )
                np.testing.assert_array_equal(ink, before)


if __name__ == "__main__":
    unittest.main()
