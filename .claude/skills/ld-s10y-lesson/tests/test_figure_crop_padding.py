"""Per-figure margins cannot alter the source figure or silently accept bad input."""

import tempfile
import unittest
from pathlib import Path
import sys

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout
from p2c import _figure_crop_padding


class FigureCropPaddingTests(unittest.TestCase):
    def test_default_margin_is_unchanged(self):
        self.assertEqual(_figure_crop_padding({}, "fig-17"), 12)
        self.assertEqual(
            _figure_crop_padding({"figure_crops": {"fig-18": {
                "padding_px": 0, "reason": "Reviewed source boundary",
            }}}, "fig-17"), 12,
        )

    def test_invalid_override_fails(self):
        for value in (-1, 13, True, 6.0, "6", None):
            with self.subTest(value=value), self.assertRaises(ValueError):
                _figure_crop_padding({"figure_crops": {"fig-17": {
                    "padding_px": value, "reason": "Reviewed source boundary",
                }}}, "fig-17")
        for override in ({}, {"padding_px": 6}, {"padding_px": 6, "reason": " "}):
            with self.subTest(override=override), self.assertRaises(ValueError):
                _figure_crop_padding({"figure_crops": {"fig-17": override}}, "fig-17")
        with self.assertRaises(ValueError):
            _figure_crop_padding({"figure_crops": []}, "fig-17")

    def test_smaller_margin_retains_exact_figure_and_excludes_neighbor(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = Image.new("RGB", (60, 60), "white")
            source.putpixel((25, 11), (0, 0, 0))
            for x, y in ((20, 20), (39, 20), (20, 39), (39, 39)):
                source.putpixel((x, y), (0, 0, 0))
            source.save(root / "source.png")
            layout.crop(root / "source.png", [20, 20, 20, 20], root / "crop.png", pad=6)
            with Image.open(root / "crop.png") as cropped:
                self.assertEqual(cropped.size, (32, 32))
                self.assertEqual(cropped.tobytes(), source.crop((14, 14, 46, 46)).tobytes())
                self.assertEqual(
                    cropped.crop((6, 6, 26, 26)).tobytes(),
                    source.crop((20, 20, 40, 40)).tobytes(),
                )
                self.assertEqual(cropped.crop((0, 0, 32, 6)).getextrema(), ((255, 255),) * 3)


if __name__ == "__main__":
    unittest.main()
