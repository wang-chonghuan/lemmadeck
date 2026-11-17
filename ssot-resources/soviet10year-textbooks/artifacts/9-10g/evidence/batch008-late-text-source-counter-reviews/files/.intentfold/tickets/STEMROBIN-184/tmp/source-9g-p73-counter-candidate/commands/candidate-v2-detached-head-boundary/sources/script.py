import hashlib
import importlib.util
import json
import re
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

HERE = Path(__file__).resolve().parent
VERSION = sys.argv.pop(1)


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


layout = load("isolated_candidate", HERE / "candidate/layout.py")
baseline = load("frozen_baseline", HERE / "baseline/layout.py")


def glyph(mask, x, y, width=24, height=38, walls=6, shape="hollow"):
    mask[y:y + height, x:x + walls] = True
    mask[y:y + height, x + width - walls:x + width] = True
    if shape == "H":
        mask[y + height // 2 - walls // 2:y + height // 2 + walls // 2, x:x + width] = True
    else:
        mask[y:y + walls, x:x + width] = True
        mask[y + height - walls:y + height, x:x + width] = True


def arrow(mask, start=50, stop=119, y=48, thickness=3, head=12):
    mask[y:y + thickness, start:stop + 1] = True
    center = y + thickness // 2
    for x in range(stop - head, stop + 1):
        reach = stop - x
        for dy in (-reach, reach):
            mask[center + dy - 1:center + dy + 2, x] = True


def fraction(body=True, numerator=True, denominator=True, kind="hollow"):
    mask = np.zeros((110, 250), dtype=bool)
    mask[48:51, 50:120] = True
    if body:
        glyph(mask, 114, 25 if kind == "H" else 32, shape=kind)
    if numerator:
        glyph(mask, 70, 4, width=22, height=30, walls=4)
    if denominator:
        glyph(mask, 70, 62, width=22, height=30, walls=4)
    return mask


def opened_bounds(mask, left=50, right=120):
    opened = ndimage.binary_opening(mask, structure=np.ones((1, 26), dtype=bool))
    labels, _ = ndimage.label(opened)
    return next(
        bounds for bounds in ndimage.find_objects(labels)
        if bounds is not None and bounds[1].start <= left
        and bounds[1].stop >= right and bounds[0].start <= 49 < bounds[0].stop
    )


def supported(mask, bounds=None):
    components, _ = ndimage.label(mask)
    original = ndimage.find_objects(components)
    if bounds is None:
        bounds = opened_bounds(mask)
    ids = np.unique(components[bounds][mask[bounds]])
    return layout._bar_local_fraction_support(
        components, original, ids, *bounds, 38
    )


class FractionContracts(unittest.TestCase):
    def test_source_fraction_row_at_both_actual_scales(self):
        diag = HERE.parent / "source-9g-p73-first-counter-diagnostic"
        with np.load(diag / "fraction-geometry-arrays.npz") as arrays:
            band = arrays["before"].copy()
        for height in (38, 39):
            with self.subTest(height=height):
                self.assertFalse(baseline._single_fraction_row(band, 0, len(band) - 1, height))
                self.assertTrue(layout._single_fraction_row(band, 0, len(band) - 1, height))

    def test_source_exercise192_two_rows(self):
        with Image.open(HERE / "inputs/0073/page.png") as source:
            ink = layout.ink_mask(source)[1460:1650].copy()
        self.assertEqual(2, len(layout.line_bands(ink, 1468)))

    def test_actual_source_bar_local_bilateral_support_at_both_scales(self):
        diag = HERE.parent / "source-9g-p73-first-counter-diagnostic"
        with np.load(diag / "fraction-geometry-arrays.npz") as arrays:
            band = arrays["before"].copy()
        components, _ = ndimage.label(band)
        bounds = ndimage.find_objects(components)
        region = (slice(47, 49), slice(600, 651))
        ids = np.unique(components[region][band[region]])
        for height in (38, 39):
            with self.subTest(height=height):
                self.assertTrue(layout._bar_local_fraction_support(
                    components, bounds, ids, *region, height
                ))

    def test_full_source73_unique_baselines(self):
        with Image.open(HERE / "inputs/0073/page.png") as source:
            ink = layout.ink_mask(source)
        xs = np.flatnonzero(ink.any(axis=0))
        bands = layout.line_bands(ink, int(xs[-1] - xs[0] + 1))
        text = (HERE / "protected/diagnostic/source-facts/p73-source-first.txt").read_text()
        rows = [
            (int(row), int(y)) for row, y in re.findall(
                r"^\|\s*(\d{2})\s*\|\s*(\d+)\s*\|", text, re.M
            )
        ]
        self.assertEqual(24, len(rows))
        self.assertEqual(24, len(bands))
        for row, y in rows:
            with self.subTest(row=row):
                self.assertEqual(1, sum(a <= y <= b for a, b in bands))
        for a, b in bands:
            self.assertEqual(1, sum(a <= y <= b for _, y in rows))

    def test_short_body_connected_genuine_fraction(self):
        for kind in ("hollow", "H"):
            with self.subTest(body=kind):
                mask = fraction(kind=kind)
                self.assertTrue(supported(mask))
                self.assertTrue(layout._single_fraction_row(mask, 0, 109, 38))

    def test_detached_single_fraction(self):
        mask = fraction(body=False)
        self.assertTrue(layout._single_fraction_row(mask, 0, 109, 38))
        self.assertTrue(baseline._single_fraction_row(mask, 0, 109, 38))

    def test_translated_and_scaled_fraction_support(self):
        for scale in (1, 2, 3):
            mask = np.repeat(np.repeat(fraction(), scale, axis=0), scale, axis=1)
            components, _ = ndimage.label(mask)
            bounds = ndimage.find_objects(components)
            region = (slice(48 * scale, 51 * scale), slice(50 * scale, 120 * scale))
            ids = np.unique(components[region][mask[region]])
            self.assertTrue(layout._bar_local_fraction_support(
                components, bounds, ids, *region, 38 * scale
            ))
        shifted = np.pad(fraction(), ((13, 7), (19, 11)))
        region = (slice(61, 64), slice(69, 139))
        components, _ = ndimage.label(shifted)
        self.assertTrue(layout._bar_local_fraction_support(
            components, ndimage.find_objects(components),
            np.unique(components[region][shifted[region]]), *region, 38
        ))

    def test_missing_bilateral_support(self):
        for numerator, denominator in ((False, True), (True, False), (False, False)):
            with self.subTest(numerator=numerator, denominator=denominator):
                self.assertFalse(supported(fraction(numerator=numerator, denominator=denominator)))

    def test_misaligned_or_outside_support(self):
        mask = fraction(numerator=False)
        glyph(mask, 20, 4, width=22, height=30, walls=4)
        self.assertFalse(supported(mask))
        mask = fraction(numerator=False)
        glyph(mask, 96, 4, width=16, height=30, walls=4)
        self.assertFalse(supported(mask))

    def test_small_fragments_not_support(self):
        mask = fraction(numerator=False)
        mask[21:25, 70:92] = True
        self.assertFalse(supported(mask))

    def test_real_overarrow_with_bilateral_glyphs(self):
        mask = fraction(body=False)
        mask[48:51, 50:120] = False
        arrow(mask)
        components, _ = ndimage.label(mask)
        component_id = components[49, 51]
        bounds = ndimage.find_objects(components)[component_id - 1]
        self.assertTrue(baseline._arrow_headed_rule(components[bounds] == component_id, 38))
        self.assertFalse(supported(mask))
        self.assertFalse(layout._single_fraction_row(mask, 0, 109, 38))

    def test_true_head_before_body_connected_shaft(self):
        mask = fraction()
        arrow(mask, start=50, stop=101, y=48, head=12)
        self.assertFalse(supported(mask))
        self.assertFalse(layout._single_fraction_row(mask, 0, 109, 38))

    def test_real_head_touching_body_with_bilateral_glyphs(self):
        for denominator_y in (62, 72):
            mask = fraction(body=False, denominator=False)
            glyph(mask, 70, denominator_y, width=22, height=30, walls=4)
            mask[48:51, 50:120] = False
            arrow(mask, start=50, stop=101, y=48, head=12)
            glyph(mask, 96, 32)
            for mirror in (False, True):
                trial = mask[:, ::-1] if mirror else mask
                opened = ndimage.binary_opening(trial, structure=np.ones((1, 26), dtype=bool))
                regions = [
                    bounds for bounds in ndimage.find_objects(ndimage.label(opened)[0])
                    if bounds is not None and bounds[0].start <= 49 < bounds[0].stop
                    and bounds[1].stop - bounds[1].start >= 40
                ]
                with self.subTest(mirror=mirror, denominator_y=denominator_y):
                    self.assertEqual(1, len(regions))
                    self.assertFalse(supported(trial, regions[0]))
                    self.assertFalse(layout._single_fraction_row(trial, 0, 109, 38))

    def test_full_hollow_glyph_is_not_arrow_or_fraction(self):
        mask = np.zeros((90, 150), dtype=bool)
        glyph(mask, 50, 24)
        self.assertFalse(layout._arrow_headed_rule(mask[24:62, 50:74], 38))
        self.assertFalse(layout._single_fraction_row(mask, 0, 89, 38))

    def test_full_H_and_two_terminal_body_do_not_supply_fraction(self):
        for kind in ("H", "hollow"):
            mask = np.zeros((110, 250), dtype=bool)
            glyph(mask, 50, 28, width=70, height=38, walls=6, shape=kind)
            with self.subTest(kind=kind):
                self.assertFalse(layout._single_fraction_row(mask, 0, 109, 38))
                self.assertFalse(supported(mask, (slice(45, 51), slice(50, 120))))

    def test_minus_and_equality_no_bilateral_fraction_support(self):
        mask = fraction(body=False, numerator=False, denominator=False)
        self.assertFalse(supported(mask))
        mask[62:65, 50:120] = True
        self.assertFalse(supported(mask))
        self.assertTrue(baseline._single_fraction_row(mask, 0, 109, 38))
        self.assertTrue(layout._single_fraction_row(mask, 0, 109, 38))
        glyph(mask, 160, 4, width=22, height=30, walls=4)
        glyph(mask, 160, 62, width=22, height=30, walls=4)
        self.assertFalse(baseline._single_fraction_row(mask, 0, 109, 38))
        self.assertFalse(layout._single_fraction_row(mask, 0, 109, 38))

    def test_radical_no_numerator_and_no_fraction_support(self):
        mask = fraction(body=False, numerator=False)
        mask[30:51, 48:51] = True
        for y in range(40, 51):
            mask[y, 38 + (y - 40)] = True
        self.assertFalse(supported(mask))
        self.assertTrue(baseline._single_fraction_row(mask, 0, 109, 38))
        self.assertTrue(layout._single_fraction_row(mask, 0, 109, 38))
        glyph(mask, 160, 4, width=22, height=30, walls=4)
        glyph(mask, 160, 62, width=22, height=30, walls=4)
        self.assertFalse(baseline._single_fraction_row(mask, 0, 109, 38))
        self.assertFalse(layout._single_fraction_row(mask, 0, 109, 38))

    def test_two_independent_vector_prose_rows(self):
        mask = np.zeros((190, 650), dtype=bool)
        for y in (35, 110):
            for x in range(50, 570, 40):
                glyph(mask, x, y)
            arrow(mask, start=290, stop=359, y=y - 17, head=8)
        self.assertEqual(2, len(baseline.line_bands(mask, 600)))
        self.assertEqual(2, len(layout.line_bands(mask, 600)))
        self.assertFalse(layout._single_fraction_row(mask, 18, 147, 38))

    def test_input_bytes_not_mutated(self):
        mask = fraction()
        before = hashlib.sha256(mask.tobytes()).hexdigest()
        layout._single_fraction_row(mask, 0, 109, 38)
        layout.line_bands(mask, 230)
        self.assertEqual(before, hashlib.sha256(mask.tobytes()).hexdigest())


suite = unittest.defaultTestLoader.loadTestsFromTestCase(FractionContracts)
result = unittest.TextTestRunner(verbosity=2).run(suite)
summary = {
    "version": VERSION, "tests_run": result.testsRun,
    "failures": [{"test": str(test), "traceback": text} for test, text in result.failures],
    "errors": [{"test": str(test), "traceback": text} for test, text in result.errors],
    "passed": result.wasSuccessful(),
    "candidate_sha256": hashlib.sha256((HERE / "candidate/layout.py").read_bytes()).hexdigest(),
    "test_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
}
with (HERE / f"tests-{VERSION}.json").open("x") as stream:
    json.dump(summary, stream, indent=2)
    stream.write("\n")
print(json.dumps(summary, indent=2))
sys.exit(0 if result.wasSuccessful() else 1)
