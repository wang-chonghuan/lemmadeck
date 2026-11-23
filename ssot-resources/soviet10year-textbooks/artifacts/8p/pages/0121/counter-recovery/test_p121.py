"""Geometric real-pixel controls; not semantic SOURCE inventory or approval."""
import unittest

import numpy as np
from scipy import ndimage

import layout
from diagnose import NOISE_BOX, counted, page_mask

# Independently visible non-margin bands; a shared caption occupies one y band.
# Formula extents include superscripts/numerators outside projection thresholds.
ROWS = (
    (867, 896), (933, 978), (1014, 1057), (1092, 1137),
    (1171, 1216), (1252, 1297), (1333, 1375), (1415, 1515),
    (1547, 1595), (1630, 1677), (1727, 1813), (1849, 1894),
    (1931, 2024), (2068, 2158), (2208, 2236),
)
ANCHORS = (881, 955, 1035, 1115, 1195, 1275, 1355, 1465,
           1570, 1650, 1770, 1870, 1975, 2120, 2220)
CAPTIONS = ((490, 860, 160, 45), (1190, 860, 160, 45))


def inventory(case, bands, anchors=ANCHORS):
    case.assertEqual(len(bands), len(anchors))
    for (a, b), anchor in zip(bands, anchors):
        case.assertLessEqual(a, anchor)
        case.assertLessEqual(anchor, b)
        case.assertEqual(sum(a <= other <= b for other in anchors), 1)


class Page121CounterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original, cls.ink, cls.width = page_mask(layout)
        x, y, w, h = NOISE_BOX
        cls.noise = np.zeros_like(cls.ink)
        cls.noise[y:y + h, x:x + w] = cls.ink[y:y + h, x:x + w]

    def test_non_margin_anchors_normal_and_mirror(self):
        for mirror in (False, True):
            with self.subTest(mirror=mirror):
                ink = np.fliplr(self.ink) if mirror else self.ink
                snapshot = ink.copy()
                inventory(self, layout.line_bands(ink, self.width))
                np.testing.assert_array_equal(ink, snapshot)

    def test_exact_extra_band_and_exact_removed_ink_delta(self):
        for mirror in (False, True):
            with self.subTest(mirror=mirror):
                ink = np.fliplr(self.ink) if mirror else self.ink
                noise = np.fliplr(self.noise) if mirror else self.noise
                actual, mask, _ = counted(layout, ink, self.width)
                no_noise, cleaned_without, _ = counted(layout, ink & ~noise, self.width)
                inventory(self, actual)
                self.assertEqual(actual, no_noise)
                self.assertFalse(mask[noise].any())
                np.testing.assert_array_equal(mask, cleaned_without)

    def test_every_geometric_row_deletion_normal_and_mirror(self):
        for index, (first, last) in enumerate(ROWS):
            for mirror in (False, True):
                with self.subTest(row=index, extent=(first, last), mirror=mirror):
                    ink = self.ink.copy()
                    ink[first:last + 1] = False
                    if mirror:
                        ink = np.fliplr(ink)
                    inventory(
                        self, layout.line_bands(ink, self.width),
                        [a for i, a in enumerate(ANCHORS) if i != index],
                    )

    def test_single_caption_removal_keeps_other_shared_caption(self):
        for x, y, w, h in CAPTIONS:
            for mirror in (False, True):
                with self.subTest(box=(x, y, w, h), mirror=mirror):
                    ink = self.ink.copy()
                    ink[y:y + h, x:x + w] = False
                    if mirror:
                        ink = np.fliplr(ink)
                    inventory(self, layout.line_bands(ink, self.width))

    def test_actual_row_and_caption_ink_survives_counting_copy(self):
        for mirror in (False, True):
            ink = np.fliplr(self.ink) if mirror else self.ink
            _, cleaned, _ = counted(layout, ink, self.width)
            if mirror:
                cleaned = np.fliplr(cleaned)
            for first, last in ROWS:
                with self.subTest(row=(first, last), mirror=mirror):
                    np.testing.assert_array_equal(
                        cleaned[first:last + 1, 250:1550],
                        self.ink[first:last + 1, 250:1550],
                    )

    def test_real_fraction_caption_body_and_smallglyph_are_extra_rows(self):
        samples = (
            ("fraction", (710, 1414, 365, 103)),
            ("caption", (490, 860, 160, 45)),
            ("numerator-digit", (963, 2065, 46, 42)),
            ("denominator-digits", (955, 2120, 63, 40)),
            ("body-glyph", (276, 1545, 52, 52)),
            ("footer-digits", (1410, 2205, 82, 35)),
        )
        for name, (x, y, w, h) in samples:
            sample = self.ink[y:y + h, x:x + w]
            self.assertTrue(sample.any(), name)
            for left in (24, 600, self.ink.shape[1] - 24 - w):
                for mirror in (False, True):
                    with self.subTest(sample=name, left=left, mirror=mirror):
                        ink = self.ink.copy()
                        ink[2400:2400 + h, left:left + w] |= sample
                        if mirror:
                            ink = np.fliplr(ink)
                        bands, mask, _ = counted(layout, ink, self.width)
                        self.assertEqual(len(bands), len(ANCHORS) + 1)
                        self.assertEqual(sum(a <= 2400 + h // 2 <= b for a, b in bands), 1)
                        if mirror:
                            mask = np.fliplr(mask)
                        self.assertTrue(np.all(mask[2400:2400 + h, left:left + w][sample]))

    def test_every_actual_compact_glyph_at_both_margins_survives(self):
        # Sample every connected, body-sized compact component in real text.
        # This catches thin/hollow glyph loss, not only one chosen numeral.
        labels, _ = ndimage.label(self.ink)
        glyphs = []
        for item in ndimage.find_objects(labels):
            if item is None:
                continue
            r, c = item
            h, w = r.stop - r.start, c.stop - c.start
            if (
                250 <= c.start and c.stop <= 1550
                and 18 <= h <= 56 and 18 <= w <= 60
                and any(a <= r.start and r.stop <= b + 1 for a, b in ROWS)
            ):
                glyphs.append(item)
        self.assertGreaterEqual(len(glyphs), 50)
        self.glyph_control_count = len(glyphs)
        for r, c in glyphs:
            sample = self.ink[r, c]
            h, w = sample.shape
            for left in (24, self.ink.shape[1] - 24 - w):
                with self.subTest(box=(c.start, r.start, w, h), left=left):
                    ink = self.ink.copy()
                    ink[2400:2400 + h, left:left + w] |= sample
                    _, mask, _ = counted(layout, ink, self.width)
                    self.assertTrue(np.all(mask[2400:2400 + h, left:left + w][sample]))

    def test_margin_only_scope_preserves_identical_interior_blot(self):
        x, y, w, h = NOISE_BOX
        sample = self.ink[y:y + h, x:x + w]
        for left in (24, 600, self.ink.shape[1] - 24 - w):
            for mirror in (False, True):
                with self.subTest(left=left, mirror=mirror):
                    ink = self.ink & ~self.noise
                    ink[2400:2400 + h, left:left + w] |= sample
                    if mirror:
                        ink = np.fliplr(ink)
                    bands, mask, _ = counted(layout, ink, self.width)
                    expected = len(ANCHORS) + (left == 600)
                    self.assertEqual(len(bands), expected)
                    if mirror:
                        mask = np.fliplr(mask)
                    surviving = mask[2400:2400 + h, left:left + w][sample]
                    self.assertEqual(bool(surviving.all()), left == 600)
