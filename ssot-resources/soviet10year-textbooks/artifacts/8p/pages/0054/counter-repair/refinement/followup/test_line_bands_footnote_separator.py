"""Original-PDF controls for isolated footnote rules and subglyph margin ink."""
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
import sys
import unittest

import numpy as np
from PIL import Image

import blocks
import layout
import p2c


ROOT = Path(p2c.__file__).resolve().parents[4]
ROWS = (
    (381, 452), (557, 605), (661, 709), (744, 794), (823, 868),
    (901, 948), (983, 1026), (1064, 1110), (1144, 1188),
    (1225, 1272), (1304, 1351), (1443, 1495), (1549, 1595),
    (1630, 1677), (1715, 1760), (1795, 1886), (1930, 1975),
    (2012, 2058), (2120, 2155), (2189, 2243), (2295, 2321),
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


class FootnoteSeparatorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        page = ROOT / (
            "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/"
            "finalize-first-failure/page.md"
        )
        meta, cls.parsed = blocks.parse(page.read_text())
        source = p2c._find_pdf(SimpleNamespace(
            book="8p", pdf=None,
            books=ROOT / "ssot-resources/soviet10year-textbooks/sources",
        ))
        if layout.sha256_file(source) != meta["source"]["pdf_sha256"]:
            raise AssertionError("Original source PDF changed")
        with TemporaryDirectory(prefix="s10y-footnote-counter-") as directory:
            png = layout.render_page(source, 54, Path(directory) / "page54.png")
            if layout.sha256_file(png) != meta["render"]["sha256"]:
                raise AssertionError("Original page54 render changed")
            with Image.open(png) as image:
                cls.ink = layout.ink_mask(image)
            png = layout.render_page(source, 31, Path(directory) / "page31.png")
            with Image.open(png) as image:
                cls.minus_ink = layout.ink_mask(image)
        xs = np.flatnonzero(cls.ink.any(axis=0))
        cls.width = int(xs[-1] - xs[0] + 1)
        cls.rule = np.zeros_like(cls.ink)
        cls.rule[2095:2102, 178:663] = cls.ink[2095:2102, 178:663]

    def inventory(self, bands, rows=ROWS):
        self.assertEqual(len(bands), len(rows))
        anchors = [(first + last) // 2 for first, last in rows]
        for (first, last), anchor in zip(bands, anchors):
            self.assertLessEqual(first, anchor)
            self.assertLessEqual(anchor, last)
            self.assertEqual(sum(first <= y <= last for y in anchors), 1)

    def test_source_rows_and_input_are_preserved(self):
        original = self.ink.copy()
        self.inventory(layout.line_bands(self.ink, self.width))
        self.inventory(layout.line_bands(np.fliplr(self.ink), self.width))
        self.assertEqual(blocks.printed_lines(self.parsed), 21)
        np.testing.assert_array_equal(self.ink, original)

    def test_every_real_row_deletion_lowers_count_in_both_orientations(self):
        for row in ROWS:
            for mirrored in (False, True):
                with self.subTest(row=row, mirrored=mirrored):
                    control = self.ink.copy()
                    control[row[0]:row[1] + 1] = False
                    if mirrored:
                        control = np.fliplr(control)
                    self.inventory(
                        layout.line_bands(control, self.width),
                        tuple(other for other in ROWS if other != row),
                    )

    def test_isolated_subtypographic_margin_cores_do_not_add_rows(self):
        for height, width in ((12, 12), (18, 9)):
            for left in (24, self.ink.shape[1] - 24 - width):
                for mirrored in (False, True):
                    with self.subTest(shape=(height, width), left=left, mirrored=mirrored):
                        control = self.ink & ~self.rule
                        control[2420:2420 + height, left:left + width] = True
                        if mirrored:
                            control = np.fliplr(control)
                        self.inventory(layout.line_bands(control, self.width))

    def test_small_real_denominators_are_counted_as_standalone_rows(self):
        for top, bottom, source_left, source_right in (
            (1855, 1889, 849, 877), (2218, 2247, 1398, 1416),
            (2222, 2250, 220, 238),
        ):
            sample = self.ink[top:bottom, source_left:source_right]
            for left in (24, 600, self.ink.shape[1] - 24 - sample.shape[1]):
                with self.subTest(top=top, left=left):
                    control = self.ink.copy()
                    control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                    self.inventory(
                        layout.line_bands(control, self.width),
                        (*ROWS, (2420, 2419 + sample.shape[0])),
                    )

    def test_original_minus_and_fraction_strokes_survive_alone_at_either_margin(self):
        for source, box in (
            (self.minus_ink, (730, 754, 394, 451)),
            (self.ink, (1844, 1849, 835, 889)),
            (self.ink, (2206, 2214, 210, 247)),
            (self.ink, (2205, 2213, 1388, 1430)),
        ):
            top, bottom, source_left, source_right = box
            sample = source[top:bottom, source_left:source_right]
            self.assertTrue(sample.any())
            for left in (24, self.ink.shape[1] - 24 - sample.shape[1]):
                with self.subTest(box=box, left=left):
                    control = self.ink.copy()
                    control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                    _, mask = counted_mask(control, self.width)
                    self.assertTrue(np.all(
                        mask[2420:2420 + sample.shape[0], left:left + sample.shape[1]][sample]
                    ))

    def test_only_the_genuine_rule_is_extra_filtered_ink(self):
        _, actual = counted_mask(self.ink, self.width)
        _, no_rule = counted_mask(self.ink & ~self.rule, self.width)
        np.testing.assert_array_equal(actual, no_rule)
        for top, bottom, left, right in (
            (1793, 1890, 708, 900), (2118, 2158, 252, 1448),
            (2185, 2247, 178, 1440), (2010, 2062, 178, 568),
        ):
            np.testing.assert_array_equal(
                actual[top:bottom, left:right], self.ink[top:bottom, left:right],
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
