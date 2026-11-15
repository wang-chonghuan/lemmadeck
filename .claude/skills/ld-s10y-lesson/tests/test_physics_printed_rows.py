"""Source-pixel regressions: footnotes and italic rows remain separate."""
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

SKILL = Path(__file__).resolve().parents[1]
ROOT = SKILL.parents[2]
sys.path.insert(0, str(SKILL / "tools"))
import layout
import normalize


class PhysicsPrintedRows(unittest.TestCase):
    def test_independently_counted_physics_pages(self):
        pdf = ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf"
        # Counts and figure bounds come from reading the source, not page audits.
        cases = [
            (14, 17, [(221, 983, 1030, 571)]),
            (15, 25, []),
            (16, 18, [(199, 360, 1075, 565)]),
        ]
        with tempfile.TemporaryDirectory() as tmp:
            for page, expected, figures in cases:
                with self.subTest(page=page):
                    png = layout.render_page(pdf, page, Path(tmp) / f"{page}.png")
                    ink = layout.ink_mask(Image.open(png))
                    columns = np.flatnonzero(ink.any(axis=0))
                    width = int(columns[-1] - columns[0] + 1)
                    for x, y, w, h in figures:
                        ink[y:y + h, x:x + w] = False
                    self.assertEqual(len(layout.line_bands(ink, width)), expected)

    def test_single_fraction_is_not_two_rows(self):
        ink = np.zeros((160, 320), dtype=bool)
        ink[32:55, 136:157] = True
        ink[67:70, 126:166] = True
        ink[82:105, 136:157] = True
        self.assertTrue(layout._single_fraction_row(ink, 32, 104, 24))

    def test_circled_footnote_is_retained(self):
        import json
        profile = json.loads((SKILL / "profiles/soviet-cn.json").read_text())
        self.assertEqual(normalize.check_charset("摆①。", profile), [])

    def test_footnote_separator_is_not_a_text_row(self):
        ink = np.zeros((500, 1000), dtype=bool)
        for top in (40, 120, 300, 355):
            for x in range(100, 900, 35):
                ink[top:top + 35, x:x + 20] = True
        ink[240:245, 100:380] = True
        self.assertEqual(len(layout.line_bands(ink, 1000)), 4)


if __name__ == "__main__":
    unittest.main()
