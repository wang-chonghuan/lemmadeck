import ast
import hashlib
import importlib.util
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
VERSION = sys.argv.pop(1)
spec = importlib.util.spec_from_file_location("carrier_candidate", HERE / "candidate/layout.py")
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)
tree = ast.parse((HERE / "test_contracts.py").read_text())
fixtures = [node for node in tree.body if isinstance(node, ast.FunctionDef)
            and node.name in ("glyph", "fraction", "arrow")]
namespace = {"np": np}
exec(compile(ast.Module(body=fixtures, type_ignores=[]), "unchanged-fixtures", "exec"), namespace)
glyph, fraction = namespace["glyph"], namespace["fraction"]


def carrier_rows():
    mask = np.pad(fraction(body=False), ((0, 40), (0, 400)))
    glyph(mask, 114, 32, width=60, height=38, walls=6)
    mask[32:70, 162:174] = True
    for x in (280, 340, 400):
        glyph(mask, x, 94)
    return mask


def call_trace(mask, height):
    code = HERE / "candidate/layout.py"
    lines = code.read_text().splitlines()
    captured = {}

    def trace(frame, event, result):
        if frame.f_code.co_filename != str(code):
            return None
        if frame.f_code.co_name == "_single_fraction_row" and event == "return":
            captured.update(frame.f_locals)
            captured["result"] = result
        return trace

    sys.settrace(trace)
    try:
        result = layout._single_fraction_row(mask, 0, len(mask) - 1, height)
    finally:
        sys.settrace(None)
    return result, captured


class AcceptedCarrierContracts(unittest.TestCase):
    def test_source_genuine_bar_carrier_retains_body_identity(self):
        diagnostic = HERE.parent.parent / "source-9g-p73-first-counter-diagnostic"
        with np.load(diagnostic / "fraction-geometry-arrays.npz") as arrays:
            mask = arrays["before"].copy()
        labels, _ = ndimage.label(mask)
        carrier_id = int(labels[47, 600])
        self.assertEqual(19, carrier_id)
        bounds = ndimage.find_objects(labels)[carrier_id - 1]
        carrier = labels[bounds] == carrier_id
        before = mask.tobytes()
        for height in (38, 39):
            with self.subTest(height=height):
                self.assertTrue(layout._arrow_headed_rule(carrier, height))
                self.assertFalse(layout._original_arrow_decoration(carrier, height))
                result, trace = call_trace(mask, height)
                self.assertTrue(result)
                self.assertNotIn(carrier_id, trace["original_decorations"])
                self.assertTrue(np.any(trace["band"] & (labels == carrier_id)))
        self.assertEqual(before, mask.tobytes())

    def test_genuine_bar_touching_full_glyph_preserves_independent_body_row(self):
        mask = carrier_rows()
        for mirror in (False, True):
            trial = mask[:, ::-1].copy() if mirror else mask.copy()
            before = trial.tobytes()
            with self.subTest(mirror=mirror):
                result, trace = call_trace(trial, 38)
                self.assertFalse(result)
                self.assertGreaterEqual(len(trace["glyph_bounds"]), 4)
                self.assertTrue(any(
                    rows.start == 32 and rows.stop == 70
                    for rows, _ in trace["glyph_bounds"]
                ))
                self.assertEqual(before, trial.tobytes())

    def test_accepted_carrier_wins_over_decoration_false_positive(self):
        mask = carrier_rows()
        for mirror in (False, True):
            trial = mask[:, ::-1].copy() if mirror else mask.copy()
            labels, _ = ndimage.label(trial)
            x = trial.shape[1] - 61 if mirror else 60
            carrier_id = int(labels[49, x])
            bounds = ndimage.find_objects(labels)[carrier_id - 1]
            carrier = labels[bounds] == carrier_id
            real = layout._original_arrow_decoration

            def mistaken_decoration(component, height):
                if component.shape == carrier.shape and np.array_equal(component, carrier):
                    return True
                return real(component, height)

            with self.subTest(mirror=mirror):
                with patch.object(layout, "_original_arrow_decoration", mistaken_decoration):
                    result, trace = call_trace(trial, 38)
                self.assertFalse(result)
                self.assertNotIn(carrier_id, trace["original_decorations"])


suite = unittest.defaultTestLoader.loadTestsFromTestCase(AcceptedCarrierContracts)
result = unittest.TextTestRunner(verbosity=2).run(suite)
summary = {
    "version": VERSION, "tests_run": result.testsRun,
    "failures": [{"test": str(test), "traceback": text} for test, text in result.failures],
    "errors": [{"test": str(test), "traceback": text} for test, text in result.errors],
    "passed": result.wasSuccessful(),
    "candidate_sha256": hashlib.sha256((HERE / "candidate/layout.py").read_bytes()).hexdigest(),
    "test_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
}
with (HERE / f"carrier-tests-{VERSION}.json").open("x") as stream:
    json.dump(summary, stream, indent=2)
    stream.write("\n")
print(json.dumps(summary, indent=2))
sys.exit(0 if result.wasSuccessful() else 1)
