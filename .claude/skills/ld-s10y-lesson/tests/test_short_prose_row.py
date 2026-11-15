import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

from layout import line_bands


class ShortProseRowTests(unittest.TestCase):
    def test_short_normal_height_row_remains_a_row(self):
        ink = np.zeros((800, 700), dtype=bool)
        for top, count in [(100, 10), (180, 10), (260, 2), (340, 10), (420, 10)]:
            for column in range(count):
                x = 100 + column * 45
                ink[top:top + 45, x:x + 4] = True
                ink[top:top + 4, x:x + 32] = True
                ink[top + 20:top + 24, x:x + 32] = True
                ink[top + 41:top + 45, x:x + 32] = True
                ink[top:top + 45, x + 28:x + 32] = True
        self.assertEqual(len(line_bands(ink, 700)), 5)


if __name__ == "__main__":
    unittest.main()
