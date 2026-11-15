import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class CountingEdgeMargin(unittest.TestCase):
    def test_inspected_margin_removes_only_edge_blemish(self):
        ink = np.zeros((350, 1000), dtype=bool)
        for y in (50, 110, 170):
            for x in range(150, 750, 30):
                ink[y:y + 20, x:x + 16] = True
        ink[250:280, 15:65] = True
        self.assertEqual(len(layout.line_bands(ink, 1000)), 4)
        self.assertEqual(
            len(layout.line_bands(ink, 1000, edge_margin_px=80)), 3
        )
        self.assertTrue(ink[260, 20])

    def test_interior_single_digit_is_not_discarded(self):
        ink = np.zeros((250, 1000), dtype=bool)
        for y in (40, 100):
            for x in range(150, 750, 30):
                ink[y:y + 20, x:x + 16] = True
        ink[160:180, 490:506] = True
        self.assertEqual(
            len(layout.line_bands(ink, 1000, edge_margin_px=80)), 3
        )

    def test_invalid_margin_is_rejected(self):
        ink = np.zeros((200, 1000), dtype=bool)
        for margin in (0, -1, 101, 80.5):
            with self.assertRaises(ValueError):
                layout.line_bands(ink, 1000, edge_margin_px=margin)

    def test_isolated_shallow_specks_do_not_add_a_row(self):
        ink = np.zeros((350, 1000), dtype=bool)
        for y in (40, 100, 160):
            for x in range(150, 750, 30):
                ink[y:y + 30, x:x + 16] = True
        ink[290:296, 550:560] = True
        ink[290:296, 650:660] = True
        self.assertEqual(
            len(layout.line_bands(ink, 1000, edge_margin_px=80)), 3
        )


if __name__ == "__main__":
    unittest.main()
