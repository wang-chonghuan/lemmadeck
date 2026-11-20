from pathlib import Path
import sys
import unittest
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout

# Original page 155, box [90,1474,1220,370], contains four actual printed rows.
# Source SHA256: 3cc05770b46010d9cc9e70eebe7785ae94922b1571b7b3fa41e65ee00db0bbb0
FIXTURE = Path(__file__).parent / "fixtures/page155-fractions.png"
PAGE = Path(__file__).parent / "fixtures/page155.png"


class ThickenedFractionRowsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ink = layout.ink_mask(Image.open(FIXTURE))

    def test_complete_page_preserves_sixteen_printed_rows(self):
        original = layout.ink_mask(Image.open(PAGE))
        counting = original.copy()
        # Exact finalized figure boxes; the original fixture remains unchanged.
        for x, y, width, height in [(209, 842, 343, 321), (799, 840, 347, 331)]:
            counting[y:y + height, x:x + width] = False
        columns = np.flatnonzero(original.any(axis=0))
        bands = layout.line_bands(counting, int(columns[-1] - columns[0] + 1))
        self.assertEqual(len(bands), 16)
        self.assertEqual(
            [band for band in bands if 1474 <= band[0] <= 1843],
            [(1474, 1575), (1597, 1646), (1669, 1716), (1759, 1843)],
        )

    def test_vector_fraction_with_attached_scan_ink_is_one_row(self):
        self.assertTrue(layout._single_fraction_row(self.ink, 0, 101, 41))

    def test_radical_denominator_fraction_is_one_row(self):
        self.assertTrue(layout._single_fraction_row(self.ink, 285, 369, 41))

    def test_two_full_body_rows_are_not_one_fraction_row(self):
        body = self.ink[123:243]
        self.assertFalse(layout._single_fraction_row(body, 0, body.shape[0] - 1, 41))

    def test_two_complete_fraction_rows_are_not_collapsed(self):
        fraction = self.ink[:102]
        stacked = np.concatenate((fraction, np.zeros((15, fraction.shape[1]), dtype=bool),
                                  fraction), axis=0)
        self.assertFalse(layout._single_fraction_row(stacked, 0, stacked.shape[0] - 1, 41))


if __name__ == "__main__":
    unittest.main()
