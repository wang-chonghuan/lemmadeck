import copy
from pathlib import Path
import sys
import unittest

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class ScanNoiseTests(unittest.TestCase):
    def setUp(self):
        self.ink = np.zeros((100, 100), dtype=bool)
        self.ink[40:42, 30:32] = True
        self.ink[60:62, 30:32] = True
        self.entry = {"box": [30, 40, 2, 2], "render_sha256": "a" * 64,
                      "reason": "A source-observed isolated scan blemish."}

    def test_bound_counting_copy_preserves_source_and_other_ink(self):
        before = self.ink.copy()
        masked, audit = layout.mask_scan_noise(self.ink, [self.entry], "a" * 64)
        self.assertTrue(np.array_equal(self.ink, before))
        self.assertFalse(masked[40:42, 30:32].any())
        self.assertTrue(masked[60:62, 30:32].all())
        self.assertEqual(audit, [{**self.entry, "ink_pixels": 4}])

    def test_unbound_pixels_fail(self):
        with self.assertRaisesRegex(ValueError, "current page pixels"):
            layout.mask_scan_noise(self.ink, [self.entry], "b" * 64)

    def test_invalid_regions_fail(self):
        for box in ([30, 40, 0, 2], [-1, 40, 2, 2], [99, 40, 2, 2],
                    [30, 40, 20, 20], [80, 80, 2, 2], [30, 40, 2.0, 2]):
            with self.subTest(box=box):
                entry = {**self.entry, "box": box}
                with self.assertRaises(ValueError):
                    layout.mask_scan_noise(self.ink, [entry], "a" * 64)

    def test_missing_reason_unknown_field_and_overlaps_fail(self):
        for changes in ({"reason": ""}, {"unbound": True}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                layout.mask_scan_noise(self.ink, [{**self.entry, **changes}], "a" * 64)
        with self.assertRaisesRegex(ValueError, "overlaps"):
            layout.mask_scan_noise(self.ink, [self.entry], "a" * 64, [[30, 40, 2, 2]])
        with self.assertRaisesRegex(ValueError, "overlaps"):
            layout.mask_scan_noise(self.ink, [self.entry, copy.deepcopy(self.entry)], "a" * 64)

    def test_no_exclusions_preserves_counting_input(self):
        masked, audit = layout.mask_scan_noise(self.ink, [], "a" * 64)
        self.assertTrue(np.array_equal(masked, self.ink))
        self.assertIsNot(masked, self.ink)
        self.assertEqual(audit, [])


if __name__ == "__main__":
    unittest.main()
