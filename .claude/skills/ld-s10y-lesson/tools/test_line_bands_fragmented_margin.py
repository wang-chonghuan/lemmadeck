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
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0041"
REQUIRED_ROWS = (
    (223, 270), (307, 357), (392, 436), (474, 518), (552, 599), (633, 679),
    (1243, 1279),
    (1310, 1359), (1391, 1439), (1473, 1521), (1554, 1601), (1636, 1682),
    (1718, 1765), (1799, 1843),
    (1946, 1988), (2044, 2081), (2112, 2150), (2181, 2217), (2262, 2291),
)
SUSPECT_ROWS = ((768, 801), (1871, 1907))


class FragmentedMarginContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not (PAGE / "first-failure/page.md").exists():
            raise unittest.SkipTest("Retained 8p page41 source evidence is unavailable")
        _, cls.blocks = blocks.parse((PAGE / "first-failure/page.md").read_text())
        audit = json.loads((PAGE / "first-failure/audit.json").read_text())
        source = p2c._find_pdf(SimpleNamespace(
            book="8p", pdf=None,
            books=ROOT / "ssot-resources/soviet10year-textbooks/sources",
        ))
        with TemporaryDirectory(prefix="s10y-margin-test-") as directory:
            png = layout.render_page(source, 41, Path(directory) / "page.png")
            with Image.open(png) as image:
                ink = layout.ink_mask(image)
        cls.ink, cls.captions, errors = p2c._counting_mask(
            ink, audit["figures"], cls.blocks,
        )
        if errors:
            raise AssertionError(errors)
        xs = np.flatnonzero(ink.any(axis=0))
        cls.width = int(xs[-1] - xs[0] + 1)

    def assert_rows_match_inventory(self, bands, required):
        self.assertEqual(len(bands), len(required))
        for (first, last), (expected_first, expected_last) in zip(bands, required):
            self.assertLessEqual(abs(first - expected_first), 4)
            self.assertLessEqual(abs(last - expected_last), 4)

    def test_real_page_keeps_all_required_rows_without_margin_rows(self):
        before = self.ink.copy()
        self.assert_rows_match_inventory(
            layout.line_bands(self.ink, self.width), REQUIRED_ROWS,
        )
        np.testing.assert_array_equal(self.ink, before)

    def test_source_blocks_are_nineteen_rows(self):
        self.assertEqual(blocks.printed_lines(self.blocks), 19)
        self.assertEqual(self.captions, [])

    def test_each_actual_row_pixel_deletion_changes_count(self):
        for first, last in REQUIRED_ROWS:
            with self.subTest(row=(first, last)):
                control = self.ink.copy()
                control[first:last + 1] = False
                bands = layout.line_bands(control, self.width)
                self.assertEqual(len(bands), 18)
                self.assertFalse(any(a <= last and first <= b for a, b in bands))
                self.assert_rows_match_inventory(
                    bands, [row for row in REQUIRED_ROWS if row != (first, last)],
                )

    def test_each_authored_row_deletion_still_fails_reconciliation(self):
        for index, block in enumerate(self.blocks):
            if block["kind"] == "fig" or block.get("samerow"):
                continue
            for line_index in range(len(block["lines"])):
                with self.subTest(block=index, line=line_index):
                    control = copy.deepcopy(self.blocks)
                    del control[index]["lines"][line_index]
                    self.assertEqual(blocks.printed_lines(control), 18)
                    self.assertEqual(len(layout.line_bands(self.ink, self.width)), 19)
                    self.assertNotEqual(
                        blocks.printed_lines(control),
                        len(layout.line_bands(self.ink, self.width)),
                    )

    def test_margin_pixel_deletion_does_not_remove_printed_rows(self):
        for regions in ((SUSPECT_ROWS[0],), (SUSPECT_ROWS[1],), SUSPECT_ROWS):
            with self.subTest(regions=regions):
                control = self.ink.copy()
                for first, last in regions:
                    control[first - 4:last + 4] = False
                self.assert_rows_match_inventory(
                    layout.line_bands(control, self.width), REQUIRED_ROWS,
                )

    def test_real_short_continuation_at_outer_margin_is_retained(self):
        first, last = (1799, 1843)
        glyph = self.ink[first:last + 1, 230:274]
        control = self.ink.copy()
        control[900:900 + glyph.shape[0], 25:25 + glyph.shape[1]] = glyph
        bands = layout.line_bands(control, self.width)
        self.assertEqual(len(bands), 20)
        self.assertTrue(any(a <= 944 and 900 <= b for a, b in bands))


if __name__ == "__main__":
    unittest.main(verbosity=2)
