"""Independent synthetic row contracts; no image files or historical test replay."""
import unittest

import numpy as np

import layout


def fraction(scale=1, offset=0, canvas_height=120):
    ink = np.zeros((canvas_height * scale, 420 * scale), dtype=bool)
    for left in (130, 210):
        ink[(offset + 10) * scale:(offset + 43) * scale,
            left * scale:(left + 32) * scale] = True
        ink[(offset + 75) * scale:(offset + 106) * scale,
            left * scale:(left + 32) * scale] = True
    for x in range(70 * scale, 350 * scale):
        y = (offset + 54) * scale + int((x - 70 * scale) * 0.035)
        ink[y:y + 3 * scale, x] = True
    return ink


def compact_rows(scale=1):
    ink = np.zeros((80 * scale, 1000 * scale), dtype=bool)
    for left in (165, 206):
        ink[3 * scale:38 * scale, left * scale:(left + 37) * scale] = True
        ink[:3 * scale, (left + 18) * scale:(left + 20) * scale] = True
    for left in (456, 511, 584):
        ink[39 * scale:80 * scale, left * scale:(left + 15) * scale] = True
    return ink


class SkewedFractionGapRows(unittest.TestCase):
    def test_skewed_rule_thickness_is_not_envelope_height(self):
        for scale in (1, 2):
            with self.subTest(scale=scale):
                ink = fraction(scale)
                bar = ink[54 * scale:67 * scale, 70 * scale:350 * scale]
                self.assertGreater(bar.shape[0], 0.2 * 40 * scale)
                self.assertTrue(layout._thin_fraction_rule(bar, 40 * scale))
                self.assertTrue(layout._single_fraction_row(
                    ink, 10 * scale, 106 * scale - 1, 40 * scale))

    def test_two_complete_fractions_are_two_rows(self):
        for scale in (1, 2):
            with self.subTest(scale=scale):
                ink = fraction(scale, canvas_height=240)
                ink |= fraction(scale, offset=120, canvas_height=240)
                self.assertFalse(layout._single_fraction_row(
                    ink, 10 * scale, 226 * scale - 1, 40 * scale))

    def test_thick_rule_is_not_a_thin_fraction_bar(self):
        ink = np.ones((18, 300), dtype=bool)
        self.assertFalse(layout._thin_fraction_rule(ink, 40))

    def test_diagonal_stroke_is_not_a_fraction_bar(self):
        ink = np.zeros((150, 300), dtype=bool)
        for x in range(300):
            y = x // 3
            ink[y:y + 3, x] = True
        self.assertFalse(layout._thin_fraction_rule(ink, 40))

    def test_sparse_glyph_edges_do_not_hide_a_complete_row(self):
        for scale in (1, 2):
            with self.subTest(scale=scale):
                ink = compact_rows(scale)
                fragments = layout._row_fragments(ink, 1000 * scale)
                self.assertEqual(len(fragments), 2)
                self.assertEqual(
                    layout._supported_glyph_rows(ink, fragments, 42 * scale),
                    fragments)

    def test_remote_glyph_is_not_affiliated_to_a_fragment(self):
        ink = np.zeros((100, 200), dtype=bool)
        ink[:38, 20:57] = True
        self.assertEqual(layout._supported_glyph_rows(ink, [(20, 60)], 42), [])

    def test_compact_text_and_formula_stay_two_printed_rows(self):
        for scale in (1, 2):
            with self.subTest(scale=scale):
                ink = np.zeros((1000 * scale, 1200 * scale), dtype=bool)
                for top in (70, 170, 270, 370, 470, 570):
                    for left in (160, 240, 320, 400):
                        ink[top * scale:(top + 43) * scale,
                            left * scale:(left + 30) * scale] = True
                rows = compact_rows(scale)
                ink[700 * scale:780 * scale, :1000 * scale] = rows
                self.assertEqual(len(layout.line_bands(ink, 1000 * scale)), 8)


if __name__ == "__main__":
    unittest.main()
