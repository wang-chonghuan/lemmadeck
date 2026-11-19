import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from layout import line_bands


class ShortTerminalRowTests(unittest.TestCase):
    def test_empty_supported_columns_are_filtered_without_a_reduction_error(self):
        ink = np.zeros((500, 1504), dtype=bool)
        for y in (40, 140, 340):
            for x in (200, 250, 300, 350):
                ink[y:y + 40, x:x + 20] = True
        clean = ink.copy()
        for offset in range(12):
            x = 650 + 9 * offset
            ink[250 + offset, x:x + 9] = True
        original = ink.copy()

        expected = [(40, 79), (140, 179), (340, 379)]
        self.assertEqual(line_bands(ink, 1487), expected)
        self.assertEqual(line_bands(clean, 1487), expected)
        np.testing.assert_array_equal(ink, original)


if __name__ == "__main__":
    unittest.main()
