import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class FigurePaddingTests(unittest.TestCase):
    def test_margin_does_not_copy_adjacent_caption(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = np.full((60, 70), 255, dtype=np.uint8)
            source[20:35, 20:40] = 0
            source[38:40, 25:35] = 0
            Image.fromarray(source).save(root / "source.png")
            layout.crop(root / "source.png", [20, 20, 20, 15], root / "out.png")
            actual = np.asarray(Image.open(root / "out.png"))
            self.assertEqual(actual.shape, (39, 44))
            np.testing.assert_array_equal(actual[12:27, 12:32], source[20:35, 20:40])
            self.assertTrue((actual[27:] == 255).all())

    def test_boundary_ink_and_edge_clamping_are_preserved(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = np.full((20, 20), 255, dtype=np.uint8)
            source[:5, :5] = 0
            Image.fromarray(source).save(root / "source.png")
            layout.crop(root / "source.png", [0, 0, 5, 5], root / "out.png")
            actual = np.asarray(Image.open(root / "out.png"))
            self.assertEqual(actual.shape, (17, 17))
            np.testing.assert_array_equal(actual[:5, :5], source[:5, :5])
            self.assertTrue((actual[5:] == 255).all())
            self.assertTrue((actual[:, 5:] == 255).all())

    def test_owned_pixels_survive_existing_exclusion(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = np.full((40, 40), 255, dtype=np.uint8)
            source[10:20, 10:20] = 0
            exclude = np.zeros(source.shape, dtype=bool)
            exclude[10:20, 15:20] = True
            Image.fromarray(source).save(root / "source.png")
            layout.crop(root / "source.png", [10, 10, 10, 10], root / "out.png", exclude=exclude)
            actual = np.asarray(Image.open(root / "out.png"))
            self.assertTrue((actual[10:20, 10:15] == 0).all())
            self.assertTrue((actual[10:20, 15:20] == 255).all())


if __name__ == "__main__":
    unittest.main()
