import ast
import hashlib
import importlib.util
import unittest
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("projection_boundaries", HERE / "candidate/layout.py")
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
tree = ast.parse((HERE / "test_contracts.py").read_bytes())
fixtures = [node for node in tree.body if isinstance(node, ast.FunctionDef)
            and node.name in ("glyph", "arrow", "fraction")]
namespace = {"np": np}
exec(compile(ast.Module(body=fixtures, type_ignores=[]), "frozen-fixtures", "exec"), namespace)
glyph, arrow, fraction = namespace["glyph"], namespace["arrow"], namespace["fraction"]


def relation(mask, prev_a=23, prev_b=25, a=40, b=62, height=23):
    labels, _ = ndimage.label(mask)
    return layout._overhead_arrow_continues(
        mask, labels, ndimage.find_objects(labels),
        prev_a, prev_b, a, b, height, 600,
    )


def original_mask(kind):
    with np.load(HERE / "original-projection-arrays.npz") as arrays:
        return arrays[f"{kind}_ink"].copy()


class ProjectionIdentityContracts(unittest.TestCase):
    def test_head_clipped_original_identity_and_mirrored_body(self):
        for kind in ("H", "hollow"):
            mask = original_mask(kind)
            for mirror in (False, True):
                trial = mask[:, ::-1].copy() if mirror else mask
                labels, _ = ndimage.label(trial)
                point = trial.shape[1] - 301 if mirror else 300
                component_id = labels[24, point]
                bounds = ndimage.find_objects(labels)[component_id - 1]
                with self.subTest(kind=kind, mirror=mirror):
                    self.assertTrue(layout._original_arrow_decoration(labels[bounds] == component_id, 23))
                    self.assertFalse(layout._arrow_headed_rule(trial[23:26], 23))
                    self.assertTrue(relation(trial))
                    self.assertEqual([(23, 62), (83, 122)], layout.line_bands(trial, 600))

    def test_distant_and_nonoverlapping_body_do_not_claim_arrow(self):
        mask = original_mask("hollow")
        self.assertFalse(relation(mask, a=100, b=122))
        mask = np.zeros((160, 650), dtype=bool)
        for x in range(50, 210, 40):
            glyph(mask, x, 40, height=23, walls=4)
        arrow(mask, start=290, stop=359, y=23, head=8)
        self.assertFalse(relation(mask))

    def test_missing_or_partial_body_is_not_complete_support(self):
        mask = original_mask("hollow")
        self.assertFalse(relation(mask, b=50))
        mask[40:63] = False
        self.assertFalse(relation(mask))

    def test_mixed_prose_ink_is_not_exclusive_arrow_decoration(self):
        mask = original_mask("hollow")
        glyph(mask, 50, 15, height=23, walls=4)
        self.assertFalse(relation(mask))
        mask = original_mask("hollow")
        mask[23:26, 50:74] = True
        self.assertFalse(relation(mask))

    def test_complete_independent_full_glyph_rows_are_not_decoration(self):
        for kind in ("H", "hollow"):
            mask = np.zeros((160, 650), dtype=bool)
            for y in (23, 48):
                for x in range(50, 570, 40):
                    glyph(mask, x, y, height=23, walls=4, shape=kind)
            with self.subTest(kind=kind):
                self.assertFalse(relation(mask, prev_b=45, a=48, b=70))

    def test_minus_equality_and_radical_do_not_claim_body(self):
        for kind in ("minus", "equality", "radical"):
            mask = np.zeros((160, 650), dtype=bool)
            for x in range(50, 570, 40):
                glyph(mask, x, 40, height=23, walls=4)
            mask[23:26, 290:360] = True
            prev_b = 25
            if kind == "equality":
                mask[28:31, 290:360] = True
                prev_b = 30
            elif kind == "radical":
                mask[10:26, 287:290] = True
                for y in range(18, 26):
                    mask[y, 279 + y - 18] = True
            with self.subTest(kind=kind):
                self.assertFalse(relation(mask, prev_b=prev_b))

    def test_body_touching_true_arrow_keeps_original_body_ink(self):
        mask = original_mask("hollow")
        glyph(mask, 350, 30, height=23, walls=4)
        for mirror in (False, True):
            trial = mask[:, ::-1].copy() if mirror else mask
            before = trial.tobytes()
            with self.subTest(mirror=mirror):
                self.assertFalse(relation(trial))
                self.assertEqual(before, trial.tobytes())

    def test_genuine_fraction_bar_carrier_is_not_overhead_arrow(self):
        mask = np.pad(fraction(), ((0, 50), (0, 400)))
        before = mask.tobytes()
        self.assertFalse(relation(mask, prev_a=48, prev_b=50, a=62, b=91, height=38))
        self.assertTrue(layout._single_fraction_row(mask[:110], 0, 109, 38))
        self.assertEqual(before, mask.tobytes())

    def test_counting_copy_preserves_all_original_ink(self):
        for kind in ("H", "hollow"):
            mask = original_mask(kind)
            before = hashlib.sha256(mask.tobytes()).hexdigest()
            relation(mask)
            layout.line_bands(mask, 600)
            with self.subTest(kind=kind):
                self.assertEqual(before, hashlib.sha256(mask.tobytes()).hexdigest())
