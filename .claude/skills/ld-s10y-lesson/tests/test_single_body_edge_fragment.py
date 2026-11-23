import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SingleBodyEdgeFragmentTests(unittest.TestCase):
    def fixture(self, edge_x=940, edge_height=27, edge_count=1, gap=1, body_count=4):
        ink = np.zeros((140, 1000), dtype=bool)
        for x in [250, 350, 450, 550][:body_count]:
            ink[5:57, x:x + 25] = True
        edge_y = 57 + gap
        for index in range(edge_count):
            x = edge_x + 22 * index
            ink[edge_y:edge_y + edge_height, x:x + (12 if edge_count > 1 else 42)] = True
        return ink, [(5, 56), (edge_y, edge_y + edge_height - 1)]

    def test_close_single_subbody_edge_fragment(self):
        ink, rows = self.fixture()
        self.assertTrue(layout._single_body_with_edge_fragment(ink, rows, 45))

    def test_full_body_edge_glyph_remains_independent(self):
        ink, rows = self.fixture(edge_height=45)
        self.assertFalse(layout._single_body_with_edge_fragment(ink, rows, 45))

    def test_internal_subbody_glyph_remains_independent(self):
        ink, rows = self.fixture(edge_x=600)
        self.assertFalse(layout._single_body_with_edge_fragment(ink, rows, 45))

    def test_multiple_small_glyphs_remain_independent(self):
        ink, rows = self.fixture(edge_count=2)
        self.assertFalse(layout._single_body_with_edge_fragment(ink, rows, 45))

    def test_remote_edge_fragment_is_not_attached(self):
        ink, rows = self.fixture(gap=25)
        self.assertFalse(layout._single_body_with_edge_fragment(ink, rows, 45))

    def test_sparse_main_row_does_not_claim_edge_fragment(self):
        ink, rows = self.fixture(body_count=2)
        self.assertFalse(layout._single_body_with_edge_fragment(ink, rows, 45))


if __name__ == "__main__":
    unittest.main()
