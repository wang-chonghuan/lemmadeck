"""Scanner borders do not count as text or connect separate printed rows."""
import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


def printed_rows():
    ink = np.zeros((1200, 800), dtype=bool)
    for y in (200, 265, 330, 395, 460, 525):
        for x in range(100, 650, 30):
            ink[y:y + 32, x:x + 19] = True
    return ink


class ScannerBorderTests(unittest.TestCase):
    def test_bottom_border_is_not_a_printed_row(self):
        ink = printed_rows()
        ink[-20:, :] = True
        mask = layout.counting_ink(ink, [
            {"kind": "scan-artifact", "box": [0, 1180, 800, 20], "reason": "bottom scanner strip"}
        ])
        self.assertEqual(len(layout.line_bands(mask, 800)), 6)

    def test_gutter_streak_does_not_join_three_rows(self):
        ink = printed_rows()
        ink[190:375, 740:772] = True
        mask = layout.counting_ink(ink, [
            {"kind": "scan-artifact", "box": [735, 185, 45, 195], "reason": "right gutter streak"}
        ])
        self.assertEqual(len(layout.line_bands(mask, 800)), 6)

    def test_in_body_tall_structure_is_retained(self):
        ink = printed_rows()
        ink[190:375, 90:120] = True
        with self.assertRaisesRegex(ValueError, "页边"):
            layout.counting_ink(ink, [
                {"kind": "scan-artifact", "box": [90, 190, 30, 185], "reason": "body brace"}
            ])

    def test_source_counting_does_not_mutate_pixels(self):
        ink = printed_rows()
        ink[-20:, :] = True
        before = ink.copy()
        layout.counting_ink(ink, [
            {"kind": "scan-artifact", "box": [0, 1180, 800, 20], "reason": "bottom strip"}
        ])
        np.testing.assert_array_equal(ink, before)

    def test_separator_is_not_text_and_bad_boxes_fail(self):
        ink = printed_rows()
        ink[580:585, 100:650] = True
        mask = layout.counting_ink(ink, [
            {"kind": "separator-rule", "box": [100, 580, 550, 5], "reason": "footnote divider"}
        ])
        self.assertEqual(len(layout.line_bands(mask, 800)), 6)
        for box in ([100, 580, 550, 50], [100, 580, 50, 5], [0, 1199, 800, 5]):
            with self.assertRaises(ValueError):
                layout.counting_ink(ink, [
                    {"kind": "separator-rule", "box": box, "reason": "invalid region"}
                ])


if __name__ == "__main__":
    unittest.main()
