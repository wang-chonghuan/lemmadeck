import importlib.util
from pathlib import Path
import unittest

import numpy as np


TOOLS = Path(__file__).resolve().parents[1] / "tools"
SPEC = importlib.util.spec_from_file_location("layout", TOOLS / "layout.py")
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)


class InlineFractionRowTests(unittest.TestCase):
    def test_tall_fraction_with_one_centered_text_row(self):
        ink = np.zeros((84, 600), dtype=bool)
        ink[0:30, 80:230] = True
        ink[40:43, 60:260] = True
        ink[54:84, 60:260] = True
        ink[23:60, 290:580] = True
        self.assertTrue(layout._single_fraction_row(ink, 0, 83, 37))

    def test_fraction_rule_does_not_hide_two_text_rows(self):
        ink = np.zeros((100, 600), dtype=bool)
        ink[0:30, 80:230] = True
        ink[42:45, 60:260] = True
        ink[54:84, 60:260] = True
        ink[0:37, 290:580] = True
        ink[63:100, 290:580] = True
        self.assertFalse(layout._single_fraction_row(ink, 0, 99, 37))

    def test_two_dense_rows_without_rule_remain_two_rows(self):
        ink = np.zeros((90, 600), dtype=bool)
        ink[0:37, 60:580] = True
        ink[53:90, 60:580] = True
        self.assertFalse(layout._single_fraction_row(ink, 0, 89, 37))


if __name__ == "__main__":
    unittest.main()
