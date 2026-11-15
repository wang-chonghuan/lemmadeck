import importlib.util
from pathlib import Path
import tempfile
import unittest

import numpy as np
from PIL import Image
from scipy import ndimage


TOOLS = Path(__file__).resolve().parents[1] / "tools"
SPEC = importlib.util.spec_from_file_location(
    "interleaved_figure_layout", TOOLS / "layout.py"
)
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)

ROUGH_A = [25, 25, 130, 125]
ROUGH_B = [65, 65, 115, 115]
ENVELOPE_A = [30, 30, 120, 115]
ENVELOPE_B = [70, 70, 104, 105]


def interleaved_ink():
    # Opposite U shapes: overlapping envelopes, disjoint strokes and labels.
    first = np.zeros((220, 240), dtype=bool)
    first[30:145, 30:34] = True
    first[30:145, 146:150] = True
    first[30:34, 30:150] = True
    first[40:48, 80:88] = True

    second = np.zeros_like(first)
    second[70:175, 70:74] = True
    second[70:175, 170:174] = True
    second[171:175, 70:174] = True
    second[160:168, 110:118] = True
    # A 1px blank gap remains beside A; a 2px neighbour halo reaches A.
    second[120:124, 151:174] = True
    return first, second


def diamond_halo(mask):
    # Independently enumerate the Manhattan-radius-2 neighbourhood.
    height, width = mask.shape
    padded = np.pad(mask, 2)
    halo = np.zeros_like(mask)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if abs(dx) + abs(dy) <= 2:
                halo |= padded[
                    2 + dy:2 + dy + height, 2 + dx:2 + dx + width
                ]
    return halo


class InterleavedFigureCropsTests(unittest.TestCase):
    def setUp(self):
        scratch = tempfile.TemporaryDirectory(prefix="interleaved-figure-crops-")
        self.addCleanup(scratch.cleanup)
        self.root = Path(scratch.name)

    def test_interleaved_envelopes_preserve_each_figures_complete_components(self):
        first, second = interleaved_ink()
        ink = first | second
        original = ink.copy()
        self.assertFalse((first & second).any())
        # Both figures actually have strokes inside the other's envelope.
        self.assertTrue(second[30:145, 30:150].any())
        self.assertTrue(first[70:175, 70:174].any())
        for rough, expected_box, expected_ink in (
            (ROUGH_A, ENVELOPE_A, first),
            (ROUGH_B, ENVELOPE_B, second),
        ):
            with self.subTest(rough=rough):
                box, info = layout.snap(ink, rough)
                self.assertEqual(box, expected_box)
                self.assertEqual(info, {"components": 2, "from": rough})
                owned = layout.figure_ink(ink, rough)
                self.assertEqual(owned.shape, ink.shape)
                self.assertEqual(owned.dtype, np.dtype(bool))
                np.testing.assert_array_equal(owned, expected_ink)
                x, y, width, height = box
                self.assertEqual(
                    int(expected_ink[y:y + height, x:x + width].sum()),
                    int(expected_ink.sum()),
                )
        np.testing.assert_array_equal(ink, original)

    def test_masked_crops_remove_neighbour_halo_without_losing_owned_pixels(self):
        first, second = interleaved_ink()
        ink = first | second
        yy, xx = np.indices(ink.shape)
        pixels = np.full(ink.shape, 255, dtype=np.uint8)
        pixels[diamond_halo(ink) & ~ink] = 190
        pixels[ink] = (20 + (yy[ink] + xx[ink]) % 90).astype(np.uint8)
        np.testing.assert_array_equal(pixels < 128, ink)

        for mode in ("L", "RGB"):
            values = pixels if mode == "L" else np.stack(
                (pixels, pixels, pixels), axis=-1
            )
            source = self.root / f"page-{mode}.png"
            Image.fromarray(values).save(source)
            source_bytes = source.read_bytes()
            for name, rough, box, own, neighbour in (
                ("a", ROUGH_A, ENVELOPE_A, first, second),
                ("b", ROUGH_B, ENVELOPE_B, second, first),
            ):
                with self.subTest(mode=mode, figure=name):
                    owned = layout.figure_ink(ink, rough)
                    neighbour_owned = layout.figure_ink(
                        ink, ROUGH_B if name == "a" else ROUGH_A
                    )
                    exclusion = (
                        ndimage.binary_dilation(neighbour_owned, iterations=2)
                        & ~owned
                    )
                    expected_exclusion = diamond_halo(neighbour) & ~own
                    np.testing.assert_array_equal(exclusion, expected_exclusion)
                    if name == "a":
                        self.assertTrue((diamond_halo(neighbour) & own).any())
                    self.assertFalse((exclusion & own).any())
                    unchanged_exclusion = exclusion.copy()
                    target = self.root / f"{mode}/{name}.png"
                    layout.crop(source, box, target, pad=12, exclude=exclusion)

                    x, y, width, height = box
                    bounds = (
                        slice(y - 12, y + height + 12),
                        slice(x - 12, x + width + 12),
                    )
                    expected_page = np.full_like(values, 255)
                    expected_page[y:y + height, x:x + width] = values[
                        y:y + height, x:x + width
                    ]
                    expected_page[expected_exclusion] = 255
                    with Image.open(target) as image:
                        self.assertEqual(image.mode, mode)
                        actual = np.asarray(image).copy()
                    np.testing.assert_array_equal(actual, expected_page[bounds])
                    np.testing.assert_array_equal(
                        actual[own[bounds]], values[bounds][own[bounds]]
                    )
                    self.assertTrue(neighbour[bounds].any())
                    self.assertTrue(np.all(actual[neighbour[bounds]] == 255))
                    halo_only = expected_exclusion[bounds] & ~ink[bounds]
                    self.assertTrue(halo_only.any())
                    self.assertTrue(np.all(actual[halo_only] == 255))
                    np.testing.assert_array_equal(exclusion, unchanged_exclusion)
                    self.assertEqual(source.read_bytes(), source_bytes)

    def test_shared_component_ownership_masks_intersect(self):
        first, second = interleaved_ink()
        ink = first | second
        ink[121, 150] = True
        # This bridge connects both U shapes, but not their detached labels.
        shared = ink.copy()
        shared[40:48, 80:88] = False
        shared[160:168, 110:118] = False
        owned_a = layout.figure_ink(ink, ROUGH_A)
        owned_b = layout.figure_ink(ink, ROUGH_B)
        self.assertTrue((owned_a & owned_b).any())
        np.testing.assert_array_equal(owned_a & owned_b, shared)
        np.testing.assert_array_equal(owned_a, shared | first)
        np.testing.assert_array_equal(owned_b, shared | second)
        for rough in (ROUGH_A, ROUGH_B):
            self.assertEqual(layout.snap(ink, rough)[0], [30, 30, 144, 145])

    def test_ownership_and_snap_keep_the_45_percent_component_threshold(self):
        ink = np.zeros((100, 100), dtype=bool)
        ink[40:45, 30:50] = True
        # Exactly 45 of 100 connected pixels are inside the first rough box.
        accepted = [30, 40, 9, 5]
        rejected = [30, 40, 8, 5]
        np.testing.assert_array_equal(layout.figure_ink(ink, accepted), ink)
        self.assertEqual(layout.snap(ink, accepted)[0], [30, 40, 20, 5])
        self.assertFalse(layout.figure_ink(ink, rejected).any())
        self.assertEqual(layout.snap(ink, rejected), (rejected, {"components": 0}))

    def test_page_spanning_scan_component_is_not_owned(self):
        ink = np.zeros((100, 100), dtype=bool)
        ink[:, 2:4] = True
        ink[30:40, 30:40] = True
        expected = np.zeros_like(ink)
        expected[30:40, 30:40] = True
        np.testing.assert_array_equal(
            layout.figure_ink(ink, [0, 0, 60, 100]), expected
        )
        self.assertEqual(layout.snap(ink, [0, 0, 60, 100])[0], [30, 30, 10, 10])

    def test_normal_rectangle_crop_preserves_core_with_white_padding(self):
        yy, xx = np.indices((120, 140))
        gray = ((3 * yy + 5 * xx) % 256).astype(np.uint8)
        for mode in ("L", "RGB", "RGBA"):
            values = gray if mode == "L" else np.stack(
                (gray, gray ^ 85, gray ^ 170)
                + ((np.full_like(gray, 255),) if mode == "RGBA" else ()),
                axis=-1,
            )
            source = self.root / f"normal-{mode}.png"
            Image.fromarray(values).save(source)
            source_bytes = source.read_bytes()
            # The original core is unchanged; clipped padding is white.
            for name, box, bounds in (
                ("inner", [18, 20, 61, 71], (6, 8, 91, 103)),
                ("edge", [2, 3, 40, 30], (0, 0, 54, 45)),
            ):
                with self.subTest(mode=mode, crop=name):
                    left, top, right, bottom = bounds
                    x, y, width, height = box
                    expected = np.full_like(values[top:bottom, left:right], 255)
                    expected[y - top:y - top + height, x - left:x - left + width] = (
                        values[y:y + height, x:x + width]
                    )
                    baseline = self.root / f"baseline-{mode}-{name}.png"
                    Image.fromarray(expected).save(baseline)
                    target = self.root / f"normal-{mode}-{name}.png"
                    layout.crop(source, box, target)
                    self.assertEqual(target.read_bytes(), baseline.read_bytes())
                    with Image.open(target) as image:
                        np.testing.assert_array_equal(np.asarray(image), expected)
                    empty_mask_target = self.root / f"empty-{mode}-{name}.png"
                    layout.crop(
                        source, box, empty_mask_target,
                        exclude=np.zeros(gray.shape, dtype=bool),
                    )
                    self.assertEqual(
                        empty_mask_target.read_bytes(), baseline.read_bytes()
                    )
                    self.assertEqual(source.read_bytes(), source_bytes)

    def test_invalid_exclusion_masks_are_rejected_without_output(self):
        source = self.root / "invalid-source.png"
        Image.new("RGB", (40, 30), "white").save(source)
        source_bytes = source.read_bytes()
        for name, mask in (
            ("wrong-height", np.zeros((29, 40), dtype=bool)),
            ("wrong-width", np.zeros((30, 39), dtype=bool)),
            ("transposed", np.zeros((40, 30), dtype=bool)),
            ("channels", np.zeros((30, 40, 1), dtype=bool)),
            ("uint8", np.zeros((30, 40), dtype=np.uint8)),
            ("float", np.zeros((30, 40), dtype=float)),
        ):
            with self.subTest(mask=name):
                target = self.root / name / "crop.png"
                with self.assertRaisesRegex(
                    ValueError, "page-sized boolean mask"
                ):
                    layout.crop(source, [5, 5, 10, 10], target, exclude=mask)
                self.assertFalse(target.exists())
                self.assertFalse(target.parent.exists())
                self.assertEqual(source.read_bytes(), source_bytes)


if __name__ == "__main__":
    unittest.main()
