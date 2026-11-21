import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SystemLabelRowTests(unittest.TestCase):
    def page(self, with_labels):
        ink = np.zeros((950, 600), dtype=bool)
        for top in (30, 140, 250, 700, 810):
            for left in range(70, 500, 35):
                ink[top:top + 30, left:left + 18] = True
        for left in (180, 420):
            ink[375:475, left:left + 8] = True
            for top in (370, 455):
                for x in range(left + 25, left + 125, 25):
                    ink[top:top + 25, x:x + 14] = True
            if with_labels:
                ink[410:440, left - 50:left - 36] = True
                ink[410:440, left - 31:left - 18] = True
        return ink

    def test_two_equation_rows_and_separate_labels_are_three_rows(self):
        bands = layout.line_bands(self.page(True), 600)
        system = [(top, bottom) for top, bottom in bands if 350 <= top < 500]
        self.assertEqual(len(system), 3)
        self.assertEqual(len(bands), 8)

    def test_spanning_braces_without_labels_do_not_create_a_middle_row(self):
        bands = layout.line_bands(self.page(False), 600)
        system = [(top, bottom) for top, bottom in bands if 350 <= top < 500]
        self.assertEqual(len(system), 2)
        self.assertEqual(len(bands), 7)


if __name__ == "__main__":
    unittest.main()
