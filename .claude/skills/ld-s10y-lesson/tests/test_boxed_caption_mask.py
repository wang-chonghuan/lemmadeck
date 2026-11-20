import importlib.util
from pathlib import Path
import unittest

import numpy as np

SPEC = importlib.util.spec_from_file_location(
    "caption_layout", Path(__file__).resolve().parents[1] / "tools" / "layout.py"
)
LAYOUT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(LAYOUT)


class BoxedCaptionMaskTest(unittest.TestCase):
    def test_only_caption_pixels_are_restored(self):
        ink = np.zeros((40, 40), dtype=bool)
        ink[12:15, 12:15] = True
        ink[20:24, 20:24] = True
        masked = LAYOUT.mask_figures_for_lines(
            ink, [{"box": [10, 10, 20, 20]}],
            [{"kind": "cap", "box": [11, 11, 5, 5]}],
        )
        self.assertEqual(int(masked.sum()), 9)
        self.assertTrue(np.array_equal(ink[12:15, 12:15], masked[12:15, 12:15]))
        self.assertFalse(masked[20:24, 20:24].any())
        self.assertEqual(int(ink.sum()), 25)

    def test_unboxed_caption_does_not_restore_figure(self):
        ink = np.ones((20, 20), dtype=bool)
        masked = LAYOUT.mask_figures_for_lines(
            ink, [{"box": [0, 0, 20, 20]}], [{"kind": "cap", "box": None}],
        )
        self.assertFalse(masked.any())

    def test_outside_caption_box_is_rejected(self):
        with self.assertRaises(ValueError):
            LAYOUT.mask_figures_for_lines(
                np.zeros((20, 20), dtype=bool), [],
                [{"kind": "cap", "box": [18, 18, 4, 4]}],
            )


if __name__ == "__main__":
    unittest.main()
