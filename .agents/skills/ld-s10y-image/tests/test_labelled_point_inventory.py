"""Source label anchors retain visibility, relationships and containment."""

import importlib.util
from pathlib import Path
import unittest


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "validate_spec.py"
MODULE_SPEC = importlib.util.spec_from_file_location("labelled_inventory", MODULE_PATH)
validator = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(validator)


class LabelledPointInventoryTests(unittest.TestCase):
    def setUp(self):
        self.points = [
            {"id": "a", "type": "point", "at": [2, 2], "visible": False, "label": "A"},
            {"id": "b", "type": "point", "at": [6, 2], "visible": False, "label": "B"},
        ]
        self.relations = [
            {"id": "ab", "type": "distance", "a": "a", "b": "b", "value": 4},
        ]
        self.spec = {
            "mode": "deterministic",
            "canvas": {"boundingBox": [0, 10, 10, 0]},
            "source": {"inventory": [{
                "id": "pair", "description": "Two source labels at unmarked positions",
                "objects": ["a", "b"], "assertions": ["ab"],
                "requires": ["pointRelationships"],
            }]},
        }

    def errors(self, current=True):
        return validator.completeness_errors(
            self.spec, self.points, validator.point_map(self.points),
            self.relations, current,
        )

    def test_labelled_hidden_points_are_visible_representations(self):
        self.assertEqual(self.errors(), [])

    def test_legacy_hidden_inventory_remains_rejected(self):
        self.assertEqual(sum("missing visible object" in e for e in self.errors(False)), 2)

    def test_hidden_point_requires_nonblank_string_label(self):
        for label in (None, "", " \t\n ", False, 7):
            with self.subTest(label=label):
                self.points[0]["label"] = label
                self.assertTrue(any("missing visible object 'a'" in e for e in self.errors()))

    def test_hidden_nonpoint_and_unresolved_ids_remain_rejected(self):
        self.points.append({"id": "line", "type": "segment", "visible": False, "label": "L"})
        self.spec["source"]["inventory"][0]["objects"].extend(["line", "missing"])
        errors = self.errors()
        self.assertTrue(any("missing visible object 'line'" in e for e in errors))
        self.assertTrue(any("missing visible object 'missing'" in e for e in errors))

    def test_visible_and_unmapped_hidden_points_keep_existing_behavior(self):
        for point in self.points:
            point["visible"] = True
            point.pop("label")
        self.points.append({"id": "construction", "type": "point", "at": [99, 99], "visible": False})
        self.assertEqual(self.errors(), [])

    def test_all_mapped_hidden_points_still_require_relationship_coverage(self):
        self.points.append({"id": "c", "type": "point", "at": [2, 6], "visible": False, "label": "C"})
        self.spec["source"]["inventory"][0]["objects"].append("c")
        self.assertTrue(any("missing mapped relation coverage for 'c'" in e for e in self.errors()))

    def test_counts_or_escaping_relationships_do_not_cover_source_points(self):
        for relation in (
            {"id": "ab", "type": "objectCount", "objectType": "point", "count": 2},
            {"id": "ab", "type": "distance", "a": "a", "b": "outside", "value": 4},
        ):
            with self.subTest(relation=relation):
                self.relations = [relation]
                self.points.append({"id": "outside", "type": "point", "at": [6, 2]})
                self.assertTrue(any("wholly within" in e for e in self.errors()))
                self.points.pop()

    def test_label_offset_cannot_hide_out_of_canvas_anchor(self):
        self.points[0]["at"] = [-1, 2]
        self.points[0]["labelPlacement"] = {"offset": [100, 0]}
        self.assertTrue(any("geometry outside canvas" in e for e in self.errors()))

    def test_false_geometry_remains_rejected(self):
        self.relations[0]["value"] = 5
        errors = validator.assertion_errors(
            self.relations, self.points, validator.point_map(self.points),
        )
        self.assertTrue(errors)

    def test_hidden_labelled_set_member_cannot_skip_inside_or_clearance(self):
        objects = [
            {"id": "left-set", "type": "polygon", "points": [[0, 0], [400, 0], [400, 400], [0, 400]]},
            {"id": "right-set", "type": "polygon", "points": [[500, 0], [900, 0], [900, 400], [500, 400]]},
            {"id": "left-1", "type": "point", "at": [200, 200], "visible": False,
             "label": "A", "fontSize": 40, "labelPlacement": {"position": "CENTER"}},
            {"id": "right-1", "type": "point", "at": [700, 200], "visible": True},
        ]
        assertions = [
            {"type": "connects", "arrow": "edge", "from": "left-1", "to": "right-1"},
            {"type": "inside", "point": "right-1", "container": "right-set"},
        ]
        spec = {
            "canvas": {"width": 900, "boundingBox": [0, 400, 900, 0]},
            "display": {"widths": [900]},
        }
        def errors():
            return validator.relation_membership_errors(
                spec, objects, validator.point_map(objects), assertions, True,
            )
        self.assertTrue(any("inside assertion" in e and "left-1" in e for e in errors()))
        assertions.append({"type": "inside", "point": "left-1", "container": "left-set"})
        self.assertEqual(errors(), [])
        objects[2]["at"] = [10, 200]
        self.assertTrue(any("boundary clearance" in e for e in errors()))
        objects[2]["at"] = [200, 200]
        objects[2]["labelPlacement"]["offset"] = [190, 0]
        self.assertTrue(any("boundary clearance" in e for e in errors()))


if __name__ == "__main__":
    unittest.main()
