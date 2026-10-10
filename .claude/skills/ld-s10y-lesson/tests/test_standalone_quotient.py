import importlib.util
from pathlib import Path
import unittest

import numpy as np


TOOLS = Path(__file__).resolve().parents[1] / "tools"
SPEC = importlib.util.spec_from_file_location("layout", TOOLS / "layout.py")
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)


class StandaloneQuotientTests(unittest.TestCase):
    def test_thin_one_is_retained_between_regular_rows(self):
        ink = np.zeros((260, 1200), dtype=bool)
        ink[40:80, 100:1050] = True
        ink[180:220, 100:1050] = True
        ink[110:140, 500:506] = True
        ink[130:140, 495:511] = True
        self.assertEqual(len(layout.line_bands(ink, 950)), 3)

    def test_isolated_noise_and_tall_border_are_not_text(self):
        ink = np.zeros((260, 1200), dtype=bool)
        ink[40:80, 100:1050] = True
        ink[180:220, 100:1050] = True
        ink[112:116, 480:484] = True
        ink[90:155, 1190:1192] = True
        self.assertEqual(len(layout.line_bands(ink, 1100)), 2)


if __name__ == "__main__":
    unittest.main()
