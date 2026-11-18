import sys
import unittest
from pathlib import Path

import numpy as np
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SystemLabelsAndFractionTailTests(unittest.TestCase):
    def test_offset_labels_are_not_an_equation_row(self):
        ink = np.zeros((180, 400), dtype=bool)
        for x in (100, 280):
            ink[35:135, x:x + 8] = True
            ink[70:100, x - 50:x - 36] = True
            ink[70:100, x - 31:x - 18] = True
            ink[30:55, x + 25:x + 100] = True
            ink[115:140, x + 25:x + 100] = True
        labels, _ = ndimage.label(ink)
        self.assertTrue(layout._offset_system_label_band(
            ink, 70, 99, 30, ndimage.find_objects(labels)
        ))
        ink[75:95, 140:170] = True
        labels, _ = ndimage.label(ink)
        self.assertFalse(layout._offset_system_label_band(
            ink, 70, 99, 30, ndimage.find_objects(labels)
        ))

    def test_standalone_short_text_without_spanning_braces_is_a_row(self):
        ink = np.zeros((180, 400), dtype=bool)
        ink[70:100, 50:90] = True
        labels, _ = ndimage.label(ink)
        self.assertFalse(layout._offset_system_label_band(
            ink, 70, 99, 30, ndimage.find_objects(labels)
        ))

    def test_thick_fraction_rule_keeps_denominator_with_numerator(self):
        ink = np.zeros((140, 500), dtype=bool)
        ink[12:35, 150:170] = True
        ink[12:35, 200:220] = True
        ink[50:58, 130:280] = True
        ink[72:96, 160:180] = True
        ink[72:96, 215:235] = True
        self.assertTrue(layout._fraction_across_split(ink, 5, 70, 100, 33))
        ink[74:99, 350:380] = True
        self.assertFalse(layout._fraction_across_split(ink, 5, 70, 100, 33))


if __name__ == "__main__":
    unittest.main()
