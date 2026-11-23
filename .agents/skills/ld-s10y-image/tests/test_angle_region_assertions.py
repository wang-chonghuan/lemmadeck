import copy
import importlib.util
from pathlib import Path
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate_spec.py"
MODULE_SPEC = importlib.util.spec_from_file_location("angle_region_validator", SCRIPT)
validator = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(validator)


class AngleRegionAssertionsTest(unittest.TestCase):
    def check_region(self, obj, region="minor", a=(4, 1), b=(4, -1)):
        points = {"vertex": (0, 0), "a": a, "b": b}
        assertion = {
            "id": "selection", "type": "angleRegion", "object": obj["id"],
            "vertex": "vertex", "a": "a", "b": "b", "region": region,
        }
        return validator.assertion_errors([assertion], [obj], points)

    def test_minor_segment_including_boundary(self):
        obj = {"id": "hatch", "type": "segment", "from": [2, 0.5], "to": [2, -0.5]}
        self.assertEqual(self.check_region(obj), [])
        self.assertEqual(self.check_region(obj, a=(4, -1), b=(4, 1)), [])

    def test_each_segment_end_and_backward_extension_are_checked(self):
        base = {"id": "hatch", "type": "segment", "from": [1, 0], "to": [3, 0]}
        for endpoint in ("from", "to"):
            for outside in ([3, 2], [-1, 0]):
                with self.subTest(endpoint=endpoint, outside=outside):
                    obj = copy.deepcopy(base)
                    obj[endpoint] = outside
                    self.assertTrue(self.check_region(obj))

    def test_reflex_arc_attached_to_forward_drawn_rays(self):
        obj = {"id": "selector", "type": "arc", "center": [0, 0],
               "start": [1, 1], "end": [1, -1]}
        self.assertEqual(self.check_region(obj, "reflex", (3, 3), (3, -3)), [])
        self.assertTrue(self.check_region(obj, "minor", (3, 3), (3, -3)))

    def test_minor_arc_and_wrong_route(self):
        obj = {"id": "selector", "type": "arc", "center": [0, 0],
               "start": [-1, 1], "end": [-1, -1]}
        self.assertEqual(self.check_region(obj, "minor", (-3, 3), (-3, -3)), [])
        self.assertTrue(self.check_region(obj, "reflex", (-3, 3), (-3, -3)))

    def test_arc_attachment_radius_and_center_defects(self):
        base = {"id": "selector", "type": "arc", "center": [0, 0],
                "start": [1, 1], "end": [1, -1]}
        mutations = [
            {"start": [1, 2]}, {"end": [2, -1]}, {"start": [-1, -1]},
            {"start": [4, 4], "end": [4, -4]}, {"center": [0.1, 0]},
            {"end": [0.5, -0.5]}, {"start": [0, 0]}, {"end": [0, 0]},
            {"start": [1, -1], "end": [1, 1]},
        ]
        for mutation in mutations:
            with self.subTest(mutation=mutation):
                self.assertTrue(self.check_region(
                    {**base, **mutation}, "reflex", (3, 3), (3, -3)
                ))

    def test_malformed_and_degenerate_inputs_fail(self):
        obj = {"id": "hatch", "type": "segment", "from": [1, 0], "to": [2, 0]}
        self.assertTrue(self.check_region(obj, region=[]))
        self.assertTrue(self.check_region(obj, a=(0, 0)))
        self.assertTrue(self.check_region(obj, a=(1, 0), b=(-1, 0)))
        self.assertTrue(self.check_region({**obj, "to": [1, 0]}))
        self.assertTrue(self.check_region({**obj, "type": "line"}))
        self.assertTrue(validator.assertion_errors(
            [{"type": "angleRegion", "object": [], "region": "minor"}], [], {}
        ))


if __name__ == "__main__":
    unittest.main()
