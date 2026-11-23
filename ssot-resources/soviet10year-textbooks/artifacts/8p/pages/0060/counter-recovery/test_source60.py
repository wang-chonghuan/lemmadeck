"""Portable original-PDF controls, independent of the production row count."""
import copy
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest

import numpy as np
from PIL import Image

import blocks
import layout
import p2c


ROOT = Path(p2c.__file__).resolve().parents[4]
OWN = Path(__file__).resolve().parent
# Source-image row extents; emphasis dots and inline fractions belong to their row.
ROWS = (
    (231, 277), (312, 360), (397, 447), (479, 526),
    (558, 618), (636, 686), (719, 762), (813, 854),
    (899, 966), (981, 1026), (1060, 1109), (1140, 1189),
    (1223, 1270), (1301, 1350), (1383, 1428), (1468, 1558),
    (1602, 1649), (1685, 1752), (1767, 1832), (1849, 1895),
    (2000, 2035), (2062, 2097), (2126, 2162), (2189, 2221),
    (2266, 2293),
)
# Anchors are on body ink, not the formula denominator or emphasis dots.
ANCHORS = (
    254, 336, 422, 502, 590, 660, 740, 835, 924, 1003,
    1084, 1164, 1246, 1325, 1405, 1515, 1625, 1710, 1790,
    1870, 2017, 2080, 2144, 2205, 2280,
)


def counted_mask(ink, width):
    masks = []

    def trace(frame, event, arg):
        if frame.f_code is layout.line_bands.__code__ and event == "return":
            masks.append(frame.f_locals["ink"].copy())
        return trace

    previous = sys.gettrace()
    try:
        sys.settrace(trace)
        bands = layout.line_bands(ink, width)
    finally:
        sys.settrace(previous)
    return bands, masks[0]


def inventory(case, bands, anchors=ANCHORS):
    case.assertEqual(len(bands), len(anchors))
    for band, anchor in zip(bands, anchors):
        first, last = band
        case.assertLessEqual(first, anchor)
        case.assertLessEqual(anchor, last)
        case.assertEqual(sum(first <= other <= last for other in anchors), 1)


class Source60Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        page = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0060"
        cls.meta, cls.parsed = blocks.parse((page / "page.md").read_text())
        source = p2c._find_pdf(SimpleNamespace(
            book="8p", pdf=None,
            books=ROOT / "ssot-resources/soviet10year-textbooks/sources",
        ))
        if layout.sha256_file(source) != cls.meta["source"]["pdf_sha256"]:
            raise AssertionError("Original source PDF changed")
        render = OWN / "original-pdf"
        render.mkdir(exist_ok=True)
        png = layout.render_page(source, 60, render / "page60.png")
        if layout.sha256_file(png) != cls.meta["render"]["sha256"]:
            raise AssertionError("Original page60 render changed")
        with Image.open(png) as image:
            cls.ink = layout.ink_mask(image)
        retained = ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png"
        if layout.sha256_file(retained) != layout.sha256_file(png):
            raise AssertionError("Retained page60 is not the original PDF render")
        png = layout.render_page(source, 31, render / "page31.png")
        with Image.open(png) as image:
            cls.minus_ink = layout.ink_mask(image)
        xs = np.flatnonzero(cls.ink.any(axis=0))
        cls.width = int(xs[-1] - xs[0] + 1)
        cls.rule = np.zeros_like(cls.ink)
        cls.rule[1960:1967, 150:633] = cls.ink[1960:1967, 150:633]

    def test_all_25_anchors_individually_and_mirrored(self):
        self.assertEqual(self.width, 1640)
        self.assertEqual(blocks.printed_lines(self.parsed), 25)
        self.assertEqual(len(self.parsed), 11)
        self.assertFalse(any(block["kind"] == "fig" for block in self.parsed))
        for mirrored in (False, True):
            with self.subTest(mirrored=mirrored):
                control = np.fliplr(self.ink) if mirrored else self.ink
                bands = layout.line_bands(control, self.width)
                self.assertEqual(len(bands), 25)
                for index, anchor in enumerate(ANCHORS):
                    with self.subTest(row=index, anchor=anchor, mirrored=mirrored):
                        inventory(self, [bands[index]], [anchor])
                        self.assertEqual(sum(a <= anchor <= b for a, b in bands), 1)

    def test_every_actual_row_deletion_including_notes_footer_and_mirror(self):
        for index, (first, last) in enumerate(ROWS):
            for mirrored in (False, True):
                with self.subTest(row=index, extent=(first, last), mirrored=mirrored):
                    control = self.ink.copy()
                    control[first:last + 1] = False
                    if mirrored:
                        control = np.fliplr(control)
                    inventory(
                        self, layout.line_bands(control, self.width),
                        [anchor for i, anchor in enumerate(ANCHORS) if i != index],
                    )

    def test_every_authored_omission_fails_reconciliation(self):
        count = len(layout.line_bands(self.ink, self.width))
        self.assertEqual(count, 25)
        omissions = 0
        for index, block in enumerate(self.parsed):
            for line_index in range(len(block["lines"])):
                with self.subTest(block=index, line=line_index):
                    control = copy.deepcopy(self.parsed)
                    del control[index]["lines"][line_index]
                    self.assertEqual(blocks.printed_lines(control), 24)
                    self.assertNotEqual(blocks.printed_lines(control), count)
                    omissions += 1
        self.assertEqual(omissions, 25)

    def test_only_rule_is_additionally_removed_in_counting_copy(self):
        for mirrored in (False, True):
            with self.subTest(mirrored=mirrored):
                original = self.ink.copy()
                rule = self.rule
                if mirrored:
                    original, rule = np.fliplr(original), np.fliplr(rule)
                snapshot = original.copy()
                bands, actual = counted_mask(original, self.width)
                _, no_rule = counted_mask(original & ~rule, self.width)
                inventory(self, bands)
                np.testing.assert_array_equal(actual, no_rule)
                self.assertFalse(np.any(actual[rule]))
                np.testing.assert_array_equal(original, snapshot)
        self.assertEqual(int(self.rule.sum()), 2267)

    def test_actual_body_formula_footnote_and_footer_pixels_survive(self):
        _, mask = counted_mask(self.ink, self.width)
        for top, bottom, left, right in (
            (231, 278, 260, 1435), (813, 856, 670, 890),
            (1468, 1560, 438, 565), (1849, 1896, 240, 1415),
            (2000, 2036, 220, 1415), (2062, 2098, 145, 1415),
            (2126, 2163, 145, 1415), (2189, 2222, 140, 268),
            (2266, 2294, 155, 296),
        ):
            with self.subTest(box=(top, bottom, left, right)):
                np.testing.assert_array_equal(
                    mask[top:bottom, left:right], self.ink[top:bottom, left:right],
                )

    def test_actual_formula_numerator_denominator_glyphs_and_footer_add_rows(self):
        samples = (
            (1468, 1560, 439, 565),  # Complete printed fraction.
            (1468, 1507, 441, 561),  # Numerator.
            (1527, 1560, 490, 515),  # Denominator t.
            (2187, 2224, 140, 181),  # Small footnote body glyph.
            (2263, 2297, 198, 251),  # Actual printed footer digits.
            (812, 857, 670, 709),    # Vector glyph.
        )
        for box in samples:
            top, bottom, source_left, source_right = box
            sample = self.ink[top:bottom, source_left:source_right]
            self.assertTrue(sample.any())
            for left in (24, 600, self.ink.shape[1] - 24 - sample.shape[1]):
                for mirrored in (False, True):
                    with self.subTest(box=box, left=left, mirrored=mirrored):
                        control = self.ink.copy()
                        control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                        if mirrored:
                            control = np.fliplr(control)
                        bands, mask = counted_mask(control, self.width)
                        inventory(self, bands, (*ANCHORS, 2420 + sample.shape[0] // 2))
                        expected = np.fliplr(control) if mirrored else control
                        actual = np.fliplr(mask) if mirrored else mask
                        self.assertTrue(np.all(
                            actual[2420:2420 + sample.shape[0], left:left + sample.shape[1]][sample]
                        ))

    def test_standalone_actual_fraction_bar_minus_and_glyph_ink_survives(self):
        for source, box in (
            (self.ink, (1514, 1521, 443, 564)),
            (self.ink, (1481, 1490, 469, 509)),
            (self.minus_ink, (730, 754, 394, 451)),
            (self.ink, (1527, 1560, 490, 515)),
        ):
            top, bottom, source_left, source_right = box
            sample = source[top:bottom, source_left:source_right]
            self.assertTrue(sample.any())
            for left in (24, 600, self.ink.shape[1] - 24 - sample.shape[1]):
                for mirrored in (False, True):
                    with self.subTest(box=box, left=left, mirrored=mirrored):
                        control = self.ink.copy()
                        control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                        snapshot = control.copy()
                        if mirrored:
                            control = np.fliplr(control)
                        _, mask = counted_mask(control, self.width)
                        if mirrored:
                            mask = np.fliplr(mask)
                        self.assertTrue(np.all(
                            mask[2420:2420 + sample.shape[0], left:left + sample.shape[1]][sample]
                        ))
                        np.testing.assert_array_equal(
                            control, np.fliplr(snapshot) if mirrored else snapshot,
                        )

    def test_same_rule_without_small_type_is_not_removed(self):
        control = self.ink.copy()
        control[2000:2222] = False
        for first, last, top in ((1060, 1109, 2000), (1140, 1189, 2080)):
            sample = self.ink[first:last + 1]
            control[top:top + sample.shape[0]] |= sample
        _, mask = counted_mask(control, self.width)
        self.assertTrue(np.all(mask[self.rule]))

    def test_actual_long_bar_with_numerator_and_denominator_is_not_removed(self):
        control = self.ink.copy()
        # Place true fraction context beside the genuine separator.
        for top, bottom, source_left, source_right, destination in (
            (1468, 1507, 441, 561, 1910), (1527, 1560, 490, 515, 1980),
        ):
            sample = self.ink[top:bottom, source_left:source_right]
            control[destination:destination + sample.shape[0], 350:350 + sample.shape[1]] |= sample
        _, mask = counted_mask(control, self.width)
        self.assertTrue(np.all(mask[self.rule]))

    def test_vertical_translation_does_not_change_inventory(self):
        for offset in (-70, 70):
            with self.subTest(offset=offset):
                control = np.zeros_like(self.ink)
                if offset > 0:
                    control[offset:] = self.ink[:-offset]
                else:
                    control[:offset] = self.ink[-offset:]
                inventory(
                    self, layout.line_bands(control, self.width),
                    [anchor + offset for anchor in ANCHORS],
                )


if __name__ == "__main__":
    unittest.main(verbosity=2)
