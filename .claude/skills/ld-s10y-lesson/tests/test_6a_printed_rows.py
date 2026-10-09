import json
from pathlib import Path
import sys
import tempfile
import unittest

import numpy as np
from PIL import Image

SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
sys.path.insert(0, str(SKILL / "tools"))
import layout
import blocks


class PrintedRowsContract(unittest.TestCase):
    def test_source_rows_and_missing_row_rejection(self):
        source = next((REPO / "ssot-resources/soviet10year-textbooks/sources").rglob("6a *.pdf"))
        root = REPO / "ssot-resources/soviet10year-textbooks/artifacts/6a/pages"
        # Independently counted from the source pixels, excluding figure ink.
        expected = {66: 23, 67: 15, 68: 15, 69: 10, 70: 21, 71: 19,
                    72: 23, 73: 25, 74: 24, 75: 20, 76: 15, 77: 18,
                    78: 27, 79: 28, 80: 14, 81: 22}
        with tempfile.TemporaryDirectory() as scratch:
            for page, count in expected.items():
                with self.subTest(page=page):
                    png = layout.render_page(source, page, Path(scratch) / f"{page}.png")
                    ink = layout.ink_mask(Image.open(png))
                    audit = json.loads((root / f"{page:04d}/audit.json").read_text())
                    for figure in audit["figures"]:
                        x, y, w, h = figure["box"]
                        ink[y:y + h, x:x + w] = False
                    cols = np.flatnonzero(ink.any(axis=0))
                    detected = len(layout.line_bands(ink, int(cols[-1] - cols[0] + 1)))
                    self.assertEqual(detected, count)
                    _, content = blocks.load(root / f"{page:04d}/page.md")
                    self.assertEqual(blocks.printed_lines(content), count)
                    text = next(block for block in content if block["kind"] in blocks.KINDS_TEXT and block["lines"])
                    text["lines"].pop()
                    self.assertNotEqual(blocks.printed_lines(content), detected,
                                        "Dropping a real printed row must still fail reconciliation")

    def test_nearby_caption_and_text_remain_two_rows(self):
        ink = np.zeros((240, 500), dtype=bool)
        ink[30:66, 180:260] = True
        ink[83:121, 30:470] = True
        ink[155:191, 30:470] = True
        self.assertEqual(len(layout.line_bands(ink, 440)), 3)


if __name__ == "__main__":
    unittest.main()
