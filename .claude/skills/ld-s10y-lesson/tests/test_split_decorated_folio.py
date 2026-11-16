import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def page_with_folio(x=180, *, connected=True, split=True, dots=True):
    ink = np.zeros((800, 640), dtype=bool)
    for y in (100, 168, 236, 304, 372):
        for column in range(40, 590, 24):
            ink[y:y + 28, column:column + 14] = True
    for column in (x, x + 22):
        ink[745:750, column:column + 13] = True
        ink[751:769, column:column + 13] = True
        if connected:
            ink[750, column:column + (2 if split else 13)] = True
    if dots:
        for column in (x - 50, x + 75):
            ink[754:762, column:column + 8] = True
    return ink


class SplitDecoratedFolioTests(unittest.TestCase):
    def test_connected_sparse_neck_is_one_printed_folio(self):
        for x in (140, 420):
            with self.subTest(x=x):
                ink = page_with_folio(x)
                self.assertEqual(layout._row_fragments(ink, 640)[-2:],
                                 [(745, 749), (751, 768)])
                self.assertEqual(len(layout.line_bands(ink, 640)), 6)

    def test_unsplit_folio_preserves_five_body_rows(self):
        self.assertEqual(len(layout.line_bands(
            page_with_folio(split=False), 640)), 6)

    def test_detached_upper_fragment_has_no_ownership_proof(self):
        ink = page_with_folio(connected=False)
        self.assertTrue(layout._decorated_folio(ink, 745, 768, 28))
        self.assertFalse(layout._folio_fragment_continues(
            ink, 745, 749, 751, 768, 28))

    def test_page_border_is_not_a_shared_numeral(self):
        ink = page_with_folio(connected=False)
        ink[:, 3] = True
        self.assertFalse(layout._folio_fragment_continues(
            ink, 745, 749, 751, 768, 28))

    def test_preceding_body_row_cannot_be_absorbed(self):
        ink = page_with_folio()
        ink[710:738, 180:216] = True
        self.assertFalse(layout._folio_fragment_continues(
            ink, 710, 737, 751, 768, 28))

    def test_plain_number_is_not_decorated_folio(self):
        self.assertFalse(layout._folio_fragment_continues(
            page_with_folio(dots=False), 745, 749, 751, 768, 28))


if __name__ == "__main__":
    unittest.main()
