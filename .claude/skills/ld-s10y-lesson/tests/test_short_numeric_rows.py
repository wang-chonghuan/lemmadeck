import importlib.util
import unittest
from pathlib import Path

import numpy as np


spec = importlib.util.spec_from_file_location(
    "lesson_layout", Path(__file__).resolve().parents[1] / "tools" / "layout.py"
)
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)


class ShortNumericRows(unittest.TestCase):
    def base(self):
        ink = np.zeros((400, 1500), dtype=bool)
        ink[100:140, 200:1200] = True
        ink[250:290, 200:1200] = True
        return ink

    def test_short_signed_number_is_a_printed_row(self):
        ink = self.base()
        ink[200:205, 300:333] = True
        ink[195:209, 343:362] = True
        ink[203:209, 369:376] = True
        self.assertEqual(len(layout.line_bands(ink, 1400)), 3)

    def test_thin_horizontal_noise_is_not_a_row(self):
        ink = self.base()
        ink[200:204, 300:365] = True
        self.assertEqual(len(layout.line_bands(ink, 1400)), 2)

    def test_short_top_border_is_not_a_row(self):
        ink = self.base()
        ink[1:15, 300:370] = True
        self.assertEqual(len(layout.line_bands(ink, 1400)), 2)


if __name__ == "__main__":
    unittest.main()
