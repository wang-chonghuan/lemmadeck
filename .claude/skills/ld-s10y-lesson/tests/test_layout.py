from __future__ import annotations

import sys
import unittest
from pathlib import Path

import numpy as np

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import layout


class LineBandsTest(unittest.TestCase):
    def test_smaller_complete_footnote_rows_keep_their_tight_spacing(self) -> None:
        ink = np.zeros((1000, 1000), dtype=bool)
        for top in (40, 130, 220, 310, 400, 490, 580):
            for left in range(100, 900, 40):
                ink[top:top + 40, left:left + 25] = True
        for top in (700, 739, 778):
            for left in range(100, 900, 30):
                ink[top:top + 30, left:left + 20] = True
        original = ink.copy()
        bands = layout.line_bands(ink, content_w=1000)
        self.assertEqual(len(bands), 10)
        self.assertEqual(len([(a, b) for a, b in bands if 700 <= a < 820]), 3)
        np.testing.assert_array_equal(ink, original)

    def test_wide_fraction_rows_still_merge_across_their_rule(self) -> None:
        ink = np.zeros((1000, 1000), dtype=bool)
        for top in (40, 130, 220, 310, 400, 490, 580):
            for left in range(100, 900, 40):
                ink[top:top + 40, left:left + 25] = True
        for top in (700, 745):
            for left in range(150, 850, 30):
                ink[top:top + 30, left:left + 20] = True
        ink[735:739, 140:870] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 8)

    def test_short_complete_wrap_remains_a_separate_printed_row(self) -> None:
        ink = np.zeros((1000, 1000), dtype=bool)
        for top in (40, 130, 220, 310, 400, 490, 580):
            for left in range(100, 900, 40):
                ink[top:top + 40, left:left + 25] = True
        for left in range(100, 900, 40):
            ink[700:740, left:left + 25] = True
        for left in (100, 140, 180, 220):
            ink[752:787, left:left + 25] = True
        bands = layout.line_bands(ink, content_w=1000)
        self.assertEqual(len(bands), 9)
        self.assertIn((752, 786), bands)

    def test_short_wrap_glyph_strokes_are_not_fraction_rules(self) -> None:
        ink = np.zeros((1000, 1000), dtype=bool)
        for top in (40, 130, 220, 310, 400, 490, 580):
            for left in range(100, 900, 40):
                ink[top:top + 40, left:left + 25] = True
        for left in range(100, 900, 40):
            ink[700:740, left:left + 25] = True
        for left in (100, 140, 180, 220):
            ink[752:756, left:left + 35] = True
            ink[756:787, left + 12:left + 22] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 9)

    def test_parallel_stacked_arithmetic_keeps_three_operand_rows(self) -> None:
        ink = np.zeros((1150, 1000), dtype=bool)
        for top in (40, 130, 220, 680, 770, 860, 950, 1040):
            for left in range(100, 900, 40):
                ink[top:top + 50, left:left + 25] = True
        for left in (220, 620):
            for top in (350, 400, 450):
                for offset in (0, 40, 80):
                    ink[top:top + 35, left + offset:left + offset + 25] = True
            ink[441:446, left - 20:left + 120] = True
        original = ink.copy()
        bands = layout.line_bands(ink, content_w=1000)
        self.assertEqual(len(bands), 11)
        self.assertEqual(
            len([(a, b) for a, b in bands if 350 <= (a + b) / 2 <= 484]), 3
        )
        np.testing.assert_array_equal(ink, original)

    def test_arithmetic_rule_does_not_remove_a_short_following_number(self) -> None:
        ink = np.zeros((1150, 1000), dtype=bool)
        for top in (40, 130, 220, 680, 770, 860, 950, 1040):
            for left in range(100, 900, 40):
                ink[top:top + 50, left:left + 25] = True
        for top in (350, 400, 450):
            for left in (400, 440, 480):
                ink[top:top + 35, left:left + 25] = True
        ink[441:446, 380:520] = True
        ink[550:585, 480:500] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 12)

    def test_sparse_enumerator_on_a_wide_page(self) -> None:
        ink = np.zeros((500, 1473), dtype=bool)
        for top in (40, 110, 180, 250):
            ink[top:top + 40, 100:1300] = True
        ink[350:355, 210:220] = True
        ink[350:355, 239:241] = True
        ink[360:369, 231:241] = True
        ink[360:369, 210:212] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1473)), 5)

    def test_sparse_wide_scan_noise_is_not_a_text_row(self) -> None:
        ink = np.zeros((500, 1473), dtype=bool)
        for top in (40, 110, 180, 250):
            ink[top:top + 40, 100:1300] = True
        ink[350:360, 100:1000:90] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1473)), 4)

    def test_nested_fraction_fragments_ignore_scan_edge_streak(self) -> None:
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (60, 130, 200, 270, 340):
            ink[top:top + 40, 100:900] = True
        ink[420:451, 490:530] = True
        ink[468:548, 200:800] = True
        ink[565:583, 490:530] = True
        ink[400:700, 3:5] = True
        bands = layout.line_bands(ink, content_w=1000)
        self.assertEqual(len(bands), 6)
        self.assertIn((420, 582), bands)

    def test_keeps_separate_narrow_row_outside_fraction_span(self) -> None:
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (60, 130, 200, 270, 340):
            ink[top:top + 40, 100:900] = True
        ink[420:451, 850:890] = True
        ink[468:548, 200:800] = True
        bands = layout.line_bands(ink, content_w=1000)
        self.assertEqual(len(bands), 7)
        self.assertIn((420, 450), bands)
        self.assertIn((468, 547), bands)

    def test_merges_split_glyphs_and_ignores_scan_decorations(self) -> None:
        ink = np.zeros((700, 400), dtype=bool)
        ink[0:16, 0:390] = True
        for top in (60, 130, 200, 270, 340):
            ink[top:top + 40, 40:360] = True

        ink[410:416, 170:230] = True
        ink[428:434, 140:260] = True
        ink[442:478, 160:240] = True

        ink[530:538, 40:360] = True
        ink[585:594, 10:25] = True

        bands = layout.line_bands(ink, content_w=400)

        self.assertEqual(len(bands), 6)
        self.assertIn((410, 477), bands)
        self.assertNotIn((0, 15), bands)
        self.assertNotIn((530, 537), bands)
        self.assertNotIn((585, 593), bands)

    def test_keeps_split_standalone_enumerator_near_a_table(self) -> None:
        ink = np.zeros((500, 400), dtype=bool)
        for top in (40, 110, 180, 250, 320):
            ink[top:top + 40, 40:360] = True
        ink[400:405, 180:213] = True
        ink[414:417, 182:211] = True

        bands = layout.line_bands(ink, content_w=400)

        self.assertEqual(len(bands), 6)
        self.assertIn((400, 416), bands)

    def test_recovers_rows_from_an_unusually_tall_merged_band(self) -> None:
        ink = np.zeros((600, 400), dtype=bool)
        for top in (40, 110, 180, 500, 570):
            ink[top:top + 40, 40:360] = True

        # Three staggered rows leave no empty horizontal projection between
        # them, as happens beside a portrait caption.
        ink[250:310, 40:190] = True
        ink[300:370, 210:360] = True
        ink[360:430, 40:190] = True

        bands = layout.line_bands(ink, content_w=400)

        self.assertEqual(len(bands), 8)

    def test_three_brace_connected_rows_use_nearest_pitch(self) -> None:
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (40, 110, 180, 580, 650, 720):
            ink[top:top + 40, 100:900] = True
        for top in (300, 360, 420):
            ink[top:top + 40, 220:650] = True
        ink[300:460, 200:212] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 9)

    def test_tall_nested_fraction_remains_one_row(self) -> None:
        ink = np.zeros((800, 1000), dtype=bool)
        for top in (40, 110, 180, 580, 650, 720):
            ink[top:top + 40, 100:900] = True
        ink[300:331, 450:490] = True
        ink[348:428, 200:800] = True
        ink[445:476, 450:490] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 7)

    def test_parallel_two_row_systems_with_fraction_spill(self) -> None:
        ink = np.zeros((900, 1000), dtype=bool)
        for top in (40, 110, 180, 650, 720, 790):
            ink[top:top + 40, 100:900] = True
        for left in (180, 590):
            ink[300:440, left:left + 10] = True
            ink[315:355, left + 30:left + 320] = True
            ink[385:425, left + 30:left + 320] = True
            ink[290:301, left + 130:left + 165] = True
        # Side-by-side systems have two horizontal rows, not four or three.
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 8)

    def test_three_system_rows_followed_by_two_prose_rows(self) -> None:
        ink = np.zeros((900, 1000), dtype=bool)
        for top in (40, 110, 180, 650, 720, 790):
            ink[top:top + 40, 100:900] = True
        ink[300:460, 180:190] = True
        for top in (300, 360, 420):
            ink[top:top + 40, 220:650] = True
        ink[490:530, 100:900] = True
        ink[550:590, 100:900] = True
        self.assertEqual(len(layout.line_bands(ink, content_w=1000)), 11)


if __name__ == "__main__":
    unittest.main()
