"""Source-owned exclusions resolve interleaved envelopes, not arbitrary erasure."""

import copy
from pathlib import Path
import sys
import tempfile
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout
from p2c import _figure_crop_exclusions, _figure_overlap_error


class FigureCropOwnershipTests(unittest.TestCase):
    def setUp(self):
        self.first = {"id": "fig-86", "box": [5, 5, 30, 30]}
        self.second = {"id": "fig-87", "box": [25, 20, 20, 10]}
        self.figures = [self.first, self.second]
        self.meta = {"figure_crops": {"fig-86": {
            "padding_px": 12, "reason": "Independent source inspection",
            "exclude_figures": ["fig-87"],
        }}}

    def test_default_does_not_allow_overlapping_rectangles(self):
        self.assertEqual(_figure_crop_exclusions({}, self.first, self.figures), [])
        self.assertIsNotNone(_figure_overlap_error(np.ones((50, 50), dtype=bool), self.first, self.second))

    def test_exclusion_is_derived_from_complete_partner_and_padding(self):
        self.assertEqual(_figure_crop_exclusions(self.meta, self.first, self.figures), [
            {"id": "fig-87", "box": [13, 8, 44, 34]},
        ])

    def test_invalid_identity_lists_and_reason_reject(self):
        for ids in (None, "fig-87", [True], ["fig-86"], ["missing"], ["fig-87", "fig-87"]):
            meta = copy.deepcopy(self.meta)
            meta["figure_crops"]["fig-86"]["exclude_figures"] = ids
            with self.subTest(ids=ids), self.assertRaises(ValueError):
                _figure_crop_exclusions(meta, self.first, self.figures)
        meta = copy.deepcopy(self.meta)
        meta["figure_crops"]["fig-86"]["reason"] = " "
        with self.assertRaises(ValueError):
            _figure_crop_exclusions(meta, self.first, self.figures)

    def test_nonoverlapping_mutual_and_chained_exclusions_reject(self):
        outside = {"id": "fig-87", "box": [40, 40, 5, 5]}
        with self.assertRaises(ValueError):
            _figure_crop_exclusions(self.meta, self.first, [self.first, outside])
        for target_ids in (["fig-86"], ["fig-88"]):
            meta = copy.deepcopy(self.meta)
            meta["figure_crops"]["fig-87"] = {
                "padding_px": 12, "reason": "Source", "exclude_figures": target_ids,
            }
            with self.subTest(target_ids=target_ids), self.assertRaises(ValueError):
                _figure_crop_exclusions(meta, self.first, self.figures)

    def test_explicit_ownership_keeps_every_overlap_pixel_once(self):
        first = copy.deepcopy(self.first)
        first["crop_excluded_figures"] = _figure_crop_exclusions(self.meta, first, self.figures)
        ink = np.ones((50, 50), dtype=bool)
        self.assertIsNone(_figure_overlap_error(ink, first, self.second))
        first["crop_excluded_figures"][0]["box"] = [25, 20, 1, 1]
        self.assertIsNotNone(_figure_overlap_error(ink, first, self.second))

    def test_missing_overlap_ink_cannot_be_silently_dropped(self):
        first = copy.deepcopy(self.first)
        second = copy.deepcopy(self.second)
        first["crop_excluded_figures"] = [{"id": "fig-87", "box": [0, 0, 50, 50]}]
        second["crop_excluded_figures"] = [{"id": "fig-86", "box": [0, 0, 50, 50]}]
        self.assertIsNotNone(_figure_overlap_error(np.ones((50, 50), dtype=bool), first, second))

    def test_crop_preserves_source_and_owned_pixels_without_moving_them(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = Image.new("RGB", (60, 60), "white")
            source.putpixel((31, 7), (0, 0, 0))
            source.putpixel((10, 25), (0, 0, 0))
            source.putpixel((28, 24), (0, 0, 0))
            source.save(root / "source.png")
            before = (root / "source.png").read_bytes()
            layout.crop(root / "source.png", [5, 5, 30, 30], root / "plain.png", pad=3)
            source.crop((2, 2, 38, 38)).save(root / "expected.png")
            self.assertEqual((root / "plain.png").read_bytes(), (root / "expected.png").read_bytes())
            layout.crop(root / "source.png", [5, 5, 30, 30], root / "owned.png", pad=3,
                        exclude_boxes=[[25, 20, 20, 10]])
            with Image.open(root / "owned.png") as owned:
                self.assertEqual(owned.size, (36, 36))
                self.assertEqual(owned.getpixel((29, 5)), (0, 0, 0))
                self.assertEqual(owned.getpixel((8, 23)), (0, 0, 0))
                self.assertEqual(owned.getpixel((26, 22)), (255, 255, 255))
            self.assertEqual((root / "source.png").read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
