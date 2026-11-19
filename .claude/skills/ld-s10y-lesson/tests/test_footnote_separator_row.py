import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import layout


class FootnoteSeparatorRowTests(unittest.TestCase):
    def test_rule_between_body_and_note_is_not_a_text_row(self):
        ink = np.zeros((320, 1000), dtype=bool)
        for x in range(100, 800, 45):
            ink[20:50, x:x + 20] = True
            ink[160:188, x:x + 18] = True
        ink[105:109, 100:350] = True
        ink[250:280, 450:470] = True
        before = ink.copy()
        self.assertEqual(len(layout.line_bands(ink, 700)), 3)
        np.testing.assert_array_equal(ink, before)

    def test_short_letter_row_remains_a_text_row(self):
        ink = np.zeros((320, 1000), dtype=bool)
        for x in range(100, 800, 45):
            ink[20:50, x:x + 20] = True
            ink[160:188, x:x + 18] = True
        ink[100:130, 450:470] = True
        ink[250:280, 450:470] = True
        self.assertEqual(len(layout.line_bands(ink, 700)), 4)

    def test_reviewed_238_pixels_have_twenty_five_rows(self):
        image = TOOLS.parents[3] / ".tmp/ld-s10y-lesson/7a/pages/0238/page.png"
        if not image.exists():
            self.skipTest("Prepared source pixels are unavailable.")
        ink = layout.ink_mask(Image.open(image))
        columns = np.flatnonzero(ink.any(axis=0))
        self.assertEqual(
            len(layout.line_bands(ink, int(columns[-1] - columns[0] + 1))), 25,
        )


if __name__ == "__main__":
    unittest.main()
