"""Source-inspected top margins affect counting copies, not extraction pixels."""

from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import layout
import p2c


class CountingTopMarginTests(unittest.TestCase):
    def printed_rows(self):
        ink = np.zeros((1000, 500), dtype=bool)
        for y in (150, 250, 350):
            for x in range(100, 420, 40):
                ink[y:y + 30, x:x + 20] = True
        return ink

    def with_top_artifact(self):
        ink = self.printed_rows()
        ink[50:80, 260:300] = True
        return ink

    def test_source_inspected_top_artifact_only_is_removed(self):
        ink = self.with_top_artifact()
        before = ink.copy()
        self.assertEqual(
            layout.line_bands(ink, 500),
            [(50, 79), (150, 179), (250, 279), (350, 379)],
        )
        self.assertEqual(
            layout.line_bands(ink, 500, top_margin_px=100),
            [(150, 179), (250, 279), (350, 379)],
        )
        np.testing.assert_array_equal(ink, before)

    def test_default_never_assumes_a_top_artifact(self):
        ink = self.with_top_artifact()
        expected = [(50, 79), (150, 179), (250, 279), (350, 379)]
        self.assertEqual(layout.line_bands(ink, 500), expected)
        self.assertEqual(layout.line_bands(ink, 500, top_margin_px=None), expected)
        self.assertEqual(p2c._counting_line_bands({}, ink, 500), expected)
        self.assertEqual(
            p2c._counting_line_bands({"counting": {"reason": "No boundary set."}}, ink, 500),
            expected,
        )

    def test_text_at_boundary_and_standalone_glyph_are_retained(self):
        ink = np.zeros((1000, 500), dtype=bool)
        for y in (100, 200):
            for x in range(100, 420, 40):
                ink[y:y + 30, x:x + 20] = True
        ink[300:330, 240:256] = True
        self.assertEqual(
            layout.line_bands(ink, 500, top_margin_px=100),
            [(100, 129), (200, 229), (300, 329)],
        )

    def test_text_above_main_body_is_not_implicitly_hidden(self):
        ink = self.with_top_artifact()
        # Here the top object is a printed heading, not a declared artifact.
        expected = [(50, 79), (150, 179), (250, 279), (350, 379)]
        self.assertEqual(layout.line_bands(ink, 500), expected)
        self.assertEqual(
            p2c._counting_line_bands(
                {"counting": {"top_margin_px": 40, "reason": "Inspected blank top40px."}},
                ink, 500,
            ),
            expected,
        )
        with self.assertRaisesRegex(ValueError, "source inspection reason"):
            p2c._counting_line_bands({"counting": {"top_margin_px": 100}}, ink, 500)

    def test_top_and_side_boundaries_are_independent(self):
        ink = self.with_top_artifact()
        ink[600:630, 15:45] = True
        self.assertEqual(len(layout.line_bands(ink, 500)), 5)
        self.assertEqual(len(layout.line_bands(ink, 500, edge_margin_px=50)), 4)
        self.assertEqual(len(layout.line_bands(ink, 500, top_margin_px=100)), 4)
        self.assertEqual(
            p2c._counting_line_bands(
                {"counting": {
                    "edge_margin_px": 50, "top_margin_px": 100,
                    "reason": "Inspected top100px and side50px; both contain no printed text.",
                }},
                ink, 500,
            ),
            [(150, 179), (250, 279), (350, 379)],
        )

    def test_invalid_top_margins_reject_even_on_empty_page(self):
        ink = np.zeros((1000, 500), dtype=bool)
        for margin in (0, -1, 101, True, False, 50.0, "50", [], {}, np.int64(50)):
            with self.subTest(margin=margin), self.assertRaises(ValueError):
                layout.line_bands(ink, 500, top_margin_px=margin)

    def test_integer_range_is_one_through_floor_tenth_of_height(self):
        ink = np.zeros((995, 500), dtype=bool)
        for margin in (1, 99):
            with self.subTest(margin=margin):
                self.assertEqual(layout.line_bands(ink, 500, top_margin_px=margin), [])
        with self.assertRaises(ValueError):
            layout.line_bands(ink, 500, top_margin_px=100)

    def test_page_metadata_requires_nonblank_string_reason(self):
        ink = self.with_top_artifact()
        for reason in ("", " \t\n", None, False, 5, [], {}):
            with self.subTest(reason=reason), self.assertRaisesRegex(
                ValueError, "source inspection reason"
            ):
                p2c._counting_line_bands(
                    {"counting": {"top_margin_px": 100, "reason": reason}}, ink, 500
                )

    def test_explicit_null_boolean_and_nonobject_metadata_reject(self):
        ink = self.with_top_artifact()
        for value in (None, True, False, 100.0, "100"):
            with self.subTest(value=value), self.assertRaises(ValueError):
                p2c._counting_line_bands(
                    {"counting": {"top_margin_px": value, "reason": "Source inspected."}},
                    ink, 500,
                )
        for counting in (None, [], "100", True):
            with self.subTest(counting=counting), self.assertRaises(ValueError):
                p2c._counting_line_bands({"counting": counting}, ink, 500)

    def test_finalize_counting_entry_forwards_both_boundaries(self):
        ink = self.printed_rows()
        meta = {"counting": {
            "edge_margin_px": 50, "top_margin_px": 100, "reason": "Source inspected.",
        }}
        with patch.object(p2c.layout, "line_bands", return_value=[(150, 179)]) as native:
            self.assertEqual(p2c._counting_line_bands(meta, ink, 500), [(150, 179)])
            native.assert_called_once_with(
                ink, 500, edge_margin_px=50, top_margin_px=100
            )

    def test_source_png_and_native_crop_are_unchanged(self):
        ink = self.with_top_artifact()
        pixels = np.where(ink, 0, 255).astype(np.uint8)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.png"
            Image.fromarray(pixels).save(source)
            source_before = source.read_bytes()
            image = Image.open(source)
            pixels_before = np.asarray(image).copy()
            crop_before = root / "before.png"
            layout.crop(source, [80, 35, 360, 380], crop_before, pad=12)
            self.assertEqual(
                p2c._counting_line_bands(
                    {"counting": {"top_margin_px": 100, "reason": "Source inspected."}},
                    layout.ink_mask(image), 500,
                ),
                [(150, 179), (250, 279), (350, 379)],
            )
            crop_after = root / "after.png"
            layout.crop(source, [80, 35, 360, 380], crop_after, pad=12)
            self.assertEqual(source.read_bytes(), source_before)
            self.assertEqual(crop_before.read_bytes(), crop_after.read_bytes())
            np.testing.assert_array_equal(np.asarray(image), pixels_before)


if __name__ == "__main__":
    unittest.main()
