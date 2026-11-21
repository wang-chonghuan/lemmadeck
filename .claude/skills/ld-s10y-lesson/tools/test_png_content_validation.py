import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image, ImageDraw

import edition


class PngContentValidationTests(unittest.TestCase):
    def validate(self, image):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output = root / "figure.png"
            metadata = root / "generation.json"
            spec = root / "spec.json"
            image.save(output)
            metadata.write_text("{}", encoding="utf-8")
            spec.write_text("{}", encoding="utf-8")
            with (
                patch.object(edition, "validate_figure_spec", return_value=(
                    {"schema": edition.IMAGE_FIGURE_SPEC_SCHEMA, "mode": "generated"}, [],
                )),
                patch.object(edition, "validate_generation_metadata", return_value=[]),
            ):
                return edition.validate_png(output, metadata, spec, {"id": "test"})

    def test_naturally_achromatic_rgb_artwork_is_valid(self):
        image = Image.new("RGB", (768, 768), "white")
        draw = ImageDraw.Draw(image)
        draw.ellipse((160, 80, 610, 690), fill=(38, 38, 38))
        draw.ellipse((260, 180, 510, 590), fill=(220, 220, 220))
        self.assertEqual(self.validate(image), [])

    def test_color_artwork_is_valid(self):
        image = Image.new("RGB", (768, 768), "white")
        ImageDraw.Draw(image).rectangle((128, 128, 640, 640), fill=(32, 160, 80))
        self.assertEqual(self.validate(image), [])

    def test_color_palette_png_is_valid(self):
        image = Image.new("RGB", (768, 768), "white")
        ImageDraw.Draw(image).rectangle((128, 128, 640, 640), fill=(32, 160, 80))
        self.assertEqual(self.validate(image.quantize(colors=16)), [])

    def test_grayscale_encoding_is_not_color_artwork(self):
        image = Image.new("L", (768, 768), 255)
        ImageDraw.Draw(image).rectangle((128, 128, 640, 640), fill=38)
        self.assertTrue(any("RGB" in error for error in self.validate(image)))

    def test_blank_and_black_placeholders_are_rejected(self):
        for color in ["white", "black"]:
            with self.subTest(color=color):
                self.assertTrue(any("对比度" in error for error in self.validate(
                    Image.new("RGB", (768, 768), color),
                )))

    def test_transparent_hidden_rgb_is_not_visible_content(self):
        image = Image.new("RGBA", (768, 768), (10, 20, 30, 0))
        self.assertTrue(any("对比度" in error for error in self.validate(image)))

    def test_transparent_artwork_is_composited_on_white(self):
        image = Image.new("RGBA", (768, 768), (10, 20, 30, 0))
        ImageDraw.Draw(image).ellipse((160, 80, 610, 690), fill=(38, 38, 38, 255))
        self.assertEqual(self.validate(image), [])


if __name__ == "__main__":
    unittest.main()
