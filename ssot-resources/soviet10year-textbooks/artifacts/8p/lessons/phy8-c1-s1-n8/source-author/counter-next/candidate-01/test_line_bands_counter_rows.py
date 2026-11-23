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
        page = PAGES / f"{cls.number:04d}" / "finalize-initial"
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
        if [f["box"] for f in audit["figures"]] != [cls.figure_box]:
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


class CounterPage45Tests(SourceRowControls, unittest.TestCase):
    number = 45
    rows = ROWS45
    figure_box = [221, 1261, 1287, 663]
    marks = ((1815, 1935, 0, 120), (530, 615, 0, 120))
    glyph_samples = (
        (835, 880, 345, 394), (355, 465, 390, 450), (2275, 2315, 1325, 1470),
    )


class CounterPage48Tests(SourceRowControls, unittest.TestCase):
    number = 48
    rows = ROWS48
    figure_box = [898, 1718, 507, 491]
    marks = ((540, 665, 1580, 1695),)
    glyph_samples = (
        (1075, 1125, 192, 242), (585, 710, 625, 680), (2300, 2335, 195, 340),
    )


if __name__ == "__main__":
    unittest.main(verbosity=2)
