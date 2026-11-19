import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout


class SparseShallowRuleTests(unittest.TestCase):
    def test_support_requires_horizontal_proximity(self):
        for left, retained_area in ((430, 266), (450, 0)):
            with self.subTest(left=left):
                ink = np.zeros((480, 720), dtype=bool)
                for top, positions in (
                    (40, [260, 300]),
                    (88, [left, left + 40]),
                    (180, [80, 130, 180, 230, 280, 330, 380, 430]),
                    (340, [80, 130, 180, 230, 280, 330, 380, 430]),
                ):
                    for position in positions:
                        ink[top:top + 40, position:position + 22] = True
                component = np.zeros_like(ink)
                for column in range(250, 383):
                    top = 100 + round(14 * (column - 250) / 132)
                    component[top:top + 2, column] = True
                ink |= component
                original = ink.copy()
                snapshots = []
                fragments = layout._row_fragments

                def record_fragments(mask, width):
                    snapshots.append(mask.copy())
                    return fragments(mask, width)

                with patch.object(layout, "_row_fragments", record_fragments):
                    layout.line_bands(ink, 720)
                # Final bands alone conceal removal beside full-height glyphs.
                self.assertGreaterEqual(len(snapshots), 2)
                self.assertEqual(
                    int(np.count_nonzero(snapshots[1] & component)), retained_area
                )
                self.assertTrue(np.array_equal(ink, original))


if __name__ == "__main__":
    unittest.main()
