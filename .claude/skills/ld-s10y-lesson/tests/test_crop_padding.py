import importlib.util
from pathlib import Path
import tempfile
import unittest

from PIL import Image, ImageChops


TOOLS = Path(__file__).resolve().parents[1] / "tools"
SPEC = importlib.util.spec_from_file_location("layout", TOOLS / "layout.py")
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)


class CropPaddingTests(unittest.TestCase):
    def test_padding_does_not_copy_caption_outside_snapped_box(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "source.png"
            output = Path(directory) / "figure.png"
            image = Image.new("RGB", (200, 200), "white")
            image.paste("black", (50, 40, 150, 140))
            image.paste("black", (90, 145, 110, 155))
            image.save(source)
            layout.crop(source, [50, 40, 100, 100], output)
            result = Image.open(output).convert("RGB")
            self.assertEqual(result.size, (124, 124))
            self.assertIsNone(ImageChops.difference(
                result.crop((12, 12, 112, 112)),
                image.crop((50, 40, 150, 140)),
            ).getbbox())
            self.assertEqual(result.getpixel((62, 118)), (255, 255, 255))
            self.assertIsNone(ImageChops.difference(
                result.crop((0, 112, 124, 124)),
                Image.new("RGB", (124, 12), "white"),
            ).getbbox())

    def test_page_edge_still_clips_padding_without_losing_figure_pixels(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "source.png"
            output = Path(directory) / "figure.png"
            image = Image.new("L", (30, 30), "white")
            image.paste(0, (0, 0, 10, 10))
            image.save(source)
            layout.crop(source, [0, 0, 10, 10], output)
            result = Image.open(output)
            self.assertEqual(result.size, (22, 22))
            self.assertIsNone(ImageChops.difference(
                result.crop((0, 0, 10, 10)), image.crop((0, 0, 10, 10)),
            ).getbbox())
            self.assertEqual(result.getpixel((15, 15)), 255)


if __name__ == "__main__":
    unittest.main()
