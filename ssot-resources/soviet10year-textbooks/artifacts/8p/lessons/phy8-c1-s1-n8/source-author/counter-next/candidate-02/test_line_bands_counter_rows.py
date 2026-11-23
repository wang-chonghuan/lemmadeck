"""Portable source-row controls for fragmented and clipped margin marks."""
import copy
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
import unittest

import numpy as np
from PIL import Image

import blocks
import layout
import p2c


ROOT = Path(__file__).resolve().parents[4]
PAGES = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages"
# Independently inspected source rows, including formula arrows and emphasis.
ROWS45 = (
    (224, 333), (361, 462), (499, 599), (642, 724), (748, 824),
    (836, 877), (923, 966), (997, 1045), (1076, 1136), (1156, 1207),
    (1948, 1977), (2019, 2071), (2099, 2153), (2179, 2225), (2278, 2308),
)
ROWS48 = (
    (263, 312), (340, 402), (433, 485), (520, 565), (593, 703),
    (756, 798), (839, 881), (916, 965), (997, 1042), (1078, 1119),
    (1159, 1207), (1240, 1286), (1319, 1367), (1401, 1470), (1483, 1548),
    (1564, 1610), (1645, 1692), (1727, 1772), (1809, 1854), (1890, 1934),
    (1970, 2014), (2051, 2095), (2131, 2175), (2213, 2257), (2303, 2327),
)
ROWS53 = (
    (228, 269), (316, 359), (399, 441), (486, 519), (558, 603),
    (640, 685), (724, 792), (814, 839), (882, 925), (964, 1005),
    (1043, 1087), (1122, 1169), (1205, 1247), (1285, 1329),
    (1366, 1413), (2263, 2293),
)


def inventory(case, bands, rows):
    case.assertEqual(len(bands), len(rows))
    anchors = [(a + b) // 2 for a, b in rows]
    for (a, b), anchor in zip(bands, anchors):
        case.assertLessEqual(a, anchor)
        case.assertLessEqual(anchor, b)
        case.assertEqual(sum(a <= other <= b for other in anchors), 1)


class SourceRowControls:
    @classmethod
    def setUpClass(cls):
        page = PAGES / f"{cls.number:04d}"
        if cls.number != 53:
            page /= "finalize-initial"
        meta, cls.parsed = blocks.parse((page / "page.md").read_text())
        audit = json.loads((page / "audit.json").read_text())
        source = p2c._find_pdf(SimpleNamespace(
            book="8p", pdf=None,
            books=ROOT / "ssot-resources/soviet10year-textbooks/sources",
        ))
        if layout.sha256_file(source) != meta["source"]["pdf_sha256"]:
            raise AssertionError("Original source PDF changed")
        with TemporaryDirectory(prefix="s10y-counter-row-") as directory:
            png = layout.render_page(source, cls.number, Path(directory) / "page.png")
            if layout.sha256_file(png) != meta["render"]["sha256"]:
                raise AssertionError("Original page render changed")
            with Image.open(png) as image:
                original = layout.ink_mask(image)
        expected_boxes = [] if cls.figure_box is None else [cls.figure_box]
        if [f["box"] for f in audit["figures"]] != expected_boxes:
            raise AssertionError("Retained figure geometry changed")
        cls.ink, _, errors = p2c._counting_mask(original, audit["figures"], cls.parsed)
        if errors:
            raise AssertionError(errors)
        xs = np.flatnonzero(original.any(axis=0))
        cls.width = int(xs[-1] - xs[0] + 1)

    def test_source_inventory_and_input_pixels_are_preserved(self):
        original = self.ink.copy()
        inventory(self, layout.line_bands(self.ink, self.width), self.rows)
        self.assertEqual(blocks.printed_lines(self.parsed), len(self.rows))
        np.testing.assert_array_equal(self.ink, original)

    def test_every_actual_row_deletion_lowers_count(self):
        for first, last in self.rows:
            with self.subTest(row=(first, last)):
                control = self.ink.copy()
                control[first:last + 1, 85:-85] = False
                inventory(
                    self, layout.line_bands(control, self.width),
                    [row for row in self.rows if row != (first, last)],
                )

    def test_every_authored_omission_fails_reconciliation(self):
        counted = len(layout.line_bands(self.ink, self.width))
        self.assertEqual(counted, len(self.rows))
        omissions = 0
        for index, block in enumerate(self.parsed):
            if block["kind"] == "fig":
                continue
            for line_index in range(len(block["lines"])):
                with self.subTest(block=index, line=line_index):
                    control = copy.deepcopy(self.parsed)
                    del control[index]["lines"][line_index]
                    # A same-row caption does not add another projected row.
                    if blocks.printed_lines(control) == counted:
                        continue
                    self.assertEqual(blocks.printed_lines(control), counted - 1)
                    self.assertNotEqual(blocks.printed_lines(control), counted)
                    omissions += 1
        self.assertEqual(omissions, len(self.rows))

    def test_removing_actual_margin_marks_keeps_inventory(self):
        for top, bottom, left, right in self.marks:
            with self.subTest(mark=(top, bottom, left, right)):
                control = self.ink.copy()
                control[top:bottom, left:right] = False
                inventory(self, layout.line_bands(control, self.width), self.rows)

    def test_mirrored_source_keeps_inventory(self):
        inventory(self, layout.line_bands(np.fliplr(self.ink), self.width), self.rows)

    def test_actual_edge_glyph_fraction_and_footer_survive(self):
        for top, bottom, source_left, source_right in self.glyph_samples:
            sample = self.ink[top:bottom, source_left:source_right]
            for left in (24, self.ink.shape[1] - 24 - sample.shape[1]):
                with self.subTest(sample=(top, bottom), left=left):
                    control = self.ink.copy()
                    control[top:bottom, source_left:source_right] = False
                    control[top:bottom, left:left + sample.shape[1]] |= sample
                    inventory(self, layout.line_bands(control, self.width), self.rows)

    def test_standalone_real_glyph_fraction_and_footer_are_edge_rows(self):
        for top, bottom, source_left, source_right in self.glyph_samples:
            sample = self.ink[top:bottom, source_left:source_right]
            for left in (24, self.ink.shape[1] - 24 - sample.shape[1]):
                with self.subTest(sample=(top, bottom), left=left):
                    control = self.ink.copy()
                    control[2420:2420 + sample.shape[0], left:left + sample.shape[1]] |= sample
                    inventory(
                        self, layout.line_bands(control, self.width),
                        [*self.rows, (2420, 2419 + sample.shape[0])],
                    )


class CounterPage45Tests(SourceRowControls, unittest.TestCase):
    number = 45
    rows = ROWS45
    figure_box = [221, 1261, 1287, 663]
    marks = ((1815, 1935, 0, 120), (530, 615, 0, 120))
    glyph_samples = (
        (835, 880, 345, 394), (355, 465, 390, 450), (2275, 2315, 1325, 1470),
    )

    def test_actual_hollow_caption_glyph_is_a_standalone_margin_row(self):
        sample = self.ink[1945:1980, 820:865]
        for left in (24, 1626):
            with self.subTest(left=left):
                control = self.ink.copy()
                control[2420:2455, left:left + sample.shape[1]] |= sample
                inventory(self, layout.line_bands(control, self.width), [*self.rows, (2420, 2454)])


class CounterPage48Tests(SourceRowControls, unittest.TestCase):
    number = 48
    rows = ROWS48
    figure_box = [898, 1718, 507, 491]
    marks = ((540, 665, 1580, 1695),)
    glyph_samples = (
        (1075, 1125, 192, 242), (585, 710, 625, 680), (2300, 2335, 195, 340),
    )


class CounterPage53Tests(SourceRowControls, unittest.TestCase):
    number = 53
    rows = ROWS53
    figure_box = None
    marks = ((1835, 1940, 0, 120),)
    glyph_samples = (
        (227, 273, 255, 298), (808, 847, 766, 808), (2257, 2300, 1395, 1450),
    )


class CounterEmptyCoreTests(unittest.TestCase):
    def test_blank_counting_mask_has_no_rows(self):
        ink = np.zeros((300, 1000), dtype=bool)
        self.assertEqual(layout.line_bands(ink, 1000), [])
        self.assertFalse(ink.any())

    def test_erased_nested_margin_bounds_do_not_index_an_empty_core(self):
        ink = np.zeros((500, 1000), dtype=bool)
        for top in range(20, 260, 40):
            for left in (250, 280, 310):
                ink[top:top + 20, left:left + 20] = True
        # An earlier closed cluster's bounds enclose a disconnected later one.
        ink[200:226, 20:46] = True
        ink[205:221, 25:41] = False
        ink[211:214, 28:38] = True
        original = ink.copy()
        bands = layout.line_bands(ink, 1000)
        self.assertIsInstance(bands, list)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main(verbosity=2)
