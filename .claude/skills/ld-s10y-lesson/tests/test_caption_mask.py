import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import blocks
import layout
import p2c


class CaptionMaskTests(unittest.TestCase):
    def setUp(self):
        self.ink = np.zeros((180, 240), dtype=bool)
        self.ink[15:70, 30:35] = True
        self.ink[15:20, 30:200] = True
        self.ink[15:70, 195:200] = True
        for x in (80, 100, 120, 140):
            self.ink[80:94, x:x + 10] = True
        for x in range(30, 180, 20):
            self.ink[130:144, x:x + 10] = True
        self.figures = [{"box": [25, 10, 180, 90]}]
        self.cap = {"kind": "cap", "label": "Figure 1", "box": [75, 75, 80, 25],
                    "lines": ["Figure 1"]}

    def test_caption_pixels_restore_one_real_row_without_changing_source(self):
        original = self.ink.copy()
        masked, regions, errors = p2c._counting_mask(self.ink, self.figures, [self.cap])
        self.assertEqual(errors, [])
        self.assertEqual(len(layout.line_bands(masked, 240)), 2)
        self.assertEqual(regions, [{"label": "Figure 1", "box": [75, 75, 80, 25], "lines": 1}])
        np.testing.assert_array_equal(original, self.ink)
        self.assertFalse(masked[15:70, 30:35].any())

    def test_unboxed_caption_does_not_add_an_inferred_row(self):
        cap = {key: value for key, value in self.cap.items() if key != "box"}
        masked, regions, errors = p2c._counting_mask(self.ink, self.figures, [cap])
        self.assertEqual((regions, errors), ([], []))
        self.assertEqual(len(layout.line_bands(masked, 240)), 1)

    def test_blank_caption_region_is_rejected(self):
        cap = {**self.cap, "box": [40, 75, 20, 25]}
        masked, regions, errors = p2c._counting_mask(self.ink, self.figures, [cap])
        self.assertEqual(regions, [])
        self.assertEqual(len(errors), 1)
        self.assertEqual(len(layout.line_bands(masked, 240)), 1)

    def test_wrong_caption_line_count_is_rejected(self):
        cap = {**self.cap, "lines": ["Figure", "1"]}
        _, regions, errors = p2c._counting_mask(self.ink, self.figures, [cap])
        self.assertEqual(regions, [])
        self.assertEqual(len(errors), 1)

    def test_out_of_bounds_caption_is_rejected(self):
        for box in ([230, 75, 20, 25], [75, 170, 80, 25], [75, 75, 0, 25]):
            with self.subTest(box=box):
                _, regions, errors = p2c._counting_mask(self.ink, self.figures, [{**self.cap, "box": box}])
                self.assertEqual(regions, [])
                self.assertEqual(len(errors), 1)

    def test_unmasked_caption_box_is_rejected(self):
        _, regions, errors = p2c._counting_mask(self.ink, self.figures, [{**self.cap, "box": [25, 125, 180, 25]}])
        self.assertEqual(regions, [])
        self.assertEqual(len(errors), 1)

    def test_samerow_caption_restores_pixels_without_adding_a_second_row(self):
        self.ink[80:94, 210:220] = True
        cap = {**self.cap, "samerow": True}
        masked, regions, errors = p2c._counting_mask(self.ink, self.figures, [cap])
        self.assertEqual(errors, [])
        self.assertEqual(len(regions), 1)
        self.assertEqual(len(layout.line_bands(masked, 240)), 2)
        self.assertEqual(blocks.printed_lines([cap]), 0)

    def test_existing_box_field_round_trips_for_caption(self):
        md = '---\n{"printed_page": 1}\n---\n<!-- cap Figure 1 box 75,75,80,25 -->\nFigure 1\n'
        meta, parsed = blocks.parse(md)
        self.assertEqual(parsed[0]["box"], self.cap["box"])
        self.assertEqual(blocks.parse(blocks.dump(meta, parsed, 1))[1], parsed)


if __name__ == "__main__":
    unittest.main()
