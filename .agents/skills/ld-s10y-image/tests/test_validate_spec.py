import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SKILL = Path(__file__).resolve().parents[1]
FIXTURE = SKILL / "tests" / "fixtures" / "number-line.json"
MODULE_SPEC = importlib.util.spec_from_file_location(
    "validate_spec",
    SKILL / "scripts" / "validate_spec.py",
)
MODULE = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(MODULE)


class ValidateSpecTests(unittest.TestCase):
    def setUp(self):
        self.payload = json.loads(FIXTURE.read_text(encoding="utf-8"))

    def write(self, payload):
        handle = tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            encoding="utf-8",
            delete=False,
        )
        json.dump(payload, handle)
        handle.close()
        return Path(handle.name)

    def test_valid_geometry_passes(self):
        path = self.write(self.payload)
        self.assertEqual(MODULE.validate(path, "draft"), [])

    def test_wrong_distance_fails(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"][2]["at"] = [4, 0]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("distance" in error for error in errors))

    def test_non_english_label_fails(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"][-1]["text"] = "点B"
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("visible text must be English" in error for error in errors))

    def test_generated_mode_rejects_geometry(self):
        payload = copy.deepcopy(self.payload)
        payload["mode"] = "generated"
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(
            any("must not contain deterministic objects" in error for error in errors)
        )

    def test_image_rotation_requires_center(self):
        payload = copy.deepcopy(self.payload)
        payload["mode"] = "hybrid"
        payload["assets"] = [
            {"id": "art", "path": "art.png", "role": "artwork"}
        ]
        payload["objects"] = [
            {
                "id": "image-1",
                "type": "image",
                "asset": "art",
                "at": [0, 0],
                "size": [1, 1],
                "rotation": {"angleDegrees": 180},
            }
        ]
        payload["assertions"] = []
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(
            any("rotation.center must be [x, y]" in error for error in errors)
        )

    def test_central_symmetry_pairs_pass(self):
        payload = copy.deepcopy(self.payload)
        payload["description"] = "A half-turn symmetric segment."
        payload["assertions"].append({
            "id": "half-turn",
            "type": "centralSymmetry",
            "center": [2, 0],
            "pairs": [{"a": [0, 0], "b": [4, 0]}],
        })
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

    def test_wrong_central_symmetry_pair_fails(self):
        payload = copy.deepcopy(self.payload)
        payload["description"] = "A half-turn symmetric segment."
        payload["assertions"].append({
            "id": "half-turn",
            "type": "centralSymmetry",
            "center": [2, 0],
            "pairs": [{"a": [0, 0], "b": [3, 0]}],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("midpoint" in error for error in errors))

    def test_central_symmetry_claim_requires_assertion(self):
        payload = copy.deepcopy(self.payload)
        payload["description"] = "A central symmetry example."
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("requires a centralSymmetry" in error for error in errors))

    def test_geometry_outside_canvas_fails_even_when_labels_fit(self):
        payload = copy.deepcopy(self.payload)
        xmax = payload["canvas"]["boundingBox"][2]
        payload["objects"].append({
            "id": "right-table-border", "type": "segment",
            "from": [xmax + 1, 0], "to": [xmax + 1, 1],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("geometry outside canvas" in error for error in errors))

    def test_inventory_catches_omission_even_if_object_count_is_changed(self):
        payload = copy.deepcopy(self.payload)
        required = next(item for item in payload["objects"] if item["type"] == "point")
        payload["source"]["inventory"] = [{
            "description": "All source points, checked before drawing",
            "objects": [required["id"]],
        }]
        payload["objects"].remove(required)
        payload["assertions"] = [{
            "id": "remaining-point-count",
            "type": "objectCount", "objectType": "point",
            "count": sum(item["type"] == "point" for item in payload["objects"]),
        }]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("missing visible object" in error for error in errors))

    def test_point_on_circle_checks_chord_endpoints(self):
        payload = copy.deepcopy(self.payload)
        payload["assertions"].append({
            "id": "test-point-on-circle",
            "type": "pointOnCircle", "point": [0, 0],
            "center": [0, 1], "radius": 2,
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("point is not on circle" in error for error in errors))
        payload["assertions"][-1]["radius"] = 1
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

    def test_current_spec_rejects_raw_colors(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"][0]["fill"] = "#00ff00"
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("semantic color role" in error for error in errors))

    def test_current_spec_requires_narrow_inline_display(self):
        payload = copy.deepcopy(self.payload)
        payload["display"]["layout"] = "inline"
        payload["display"]["widths"] = [480]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("352px or less" in error for error in errors))

    def test_decorative_display_requires_compact_inline_width(self):
        payload = copy.deepcopy(self.payload)
        payload["display"] = {
            "layout": "inline",
            "purpose": "decorative",
            "maxWidthPx": 160,
            "minTextPx": 16,
            "widths": [160],
        }
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

        del payload["display"]["maxWidthPx"]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("maxWidthPx" in error for error in errors))

        payload["display"]["maxWidthPx"] = 160
        payload["display"]["layout"] = "scroll"
        payload["display"]["widths"] = [240]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("must use inline layout" in error for error in errors))
        self.assertTrue(any("must not exceed" in error for error in errors))

    def test_instructional_display_accepts_validated_width_override(self):
        payload = copy.deepcopy(self.payload)
        payload["display"]["layout"] = "inline"
        payload["display"]["purpose"] = "instructional"
        payload["display"]["maxWidthPx"] = 480
        payload["display"]["widths"] = [331, 480]
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

        payload["display"]["maxWidthPx"] = 200
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("instructional display.maxWidthPx" in error for error in errors))

        payload["display"]["maxWidthPx"] = 480
        payload["display"]["layout"] = "scroll"
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("with maxWidthPx must use inline" in error for error in errors))

        payload["display"]["layout"] = "inline"
        payload["display"]["widths"] = [331, 640]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("must not exceed" in error for error in errors))

        payload["display"]["widths"] = [346, 480]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("331px mobile product width" in error for error in errors))

    def test_grid_accepts_local_bounds_and_finite_offsets(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].append({
            "id": "offset-grid",
            "type": "grid",
            "bounds": [-5.75, 1.75, 6.25, -2.25],
            "xStep": 1,
            "yStep": 0.5,
            "xOffset": 0.25,
            "yOffset": -0.25,
            "stroke": "grid",
        })
        payload["assertions"].append({
            "id": "offset-grid-dimensions",
            "type": "gridDimensions",
            "grid": "offset-grid",
            "columns": 12,
            "rows": 8,
        })
        payload["source"]["inventory"].append({
            "id": "source-offset-grid",
            "description": "A bounded source grid with a local coordinate phase.",
            "objects": ["offset-grid"],
            "assertions": ["offset-grid-dimensions"],
        })
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

    def test_grid_rejects_invalid_bounds_and_offsets(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].append({
            "id": "invalid-grid",
            "type": "grid",
            "bounds": [6, -2, -6, 2],
            "xStep": 1,
            "yStep": 1,
            "xOffset": "left",
            "stroke": "grid",
        })
        payload["assertions"].append({
            "id": "invalid-grid-dimensions",
            "type": "gridDimensions",
            "grid": "invalid-grid",
            "columns": 12,
            "rows": 4,
        })
        payload["source"]["inventory"].append({
            "id": "source-invalid-grid",
            "description": "An invalid bounded source grid.",
            "objects": ["invalid-grid"],
            "assertions": ["invalid-grid-dimensions"],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("bounds must be" in error for error in errors))
        self.assertTrue(any("xOffset must be finite" in error for error in errors))

    def test_grid_bounds_must_fit_canvas(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].append({
            "id": "outside-grid",
            "type": "grid",
            "bounds": [-8, 2, 6, -2],
            "xStep": 1,
            "yStep": 1,
            "stroke": "grid",
        })
        payload["assertions"].append({
            "id": "outside-grid-dimensions",
            "type": "gridDimensions",
            "grid": "outside-grid",
            "columns": 14,
            "rows": 4,
        })
        payload["source"]["inventory"].append({
            "id": "source-outside-grid",
            "description": "A source grid outside the canvas.",
            "objects": ["outside-grid"],
            "assertions": ["outside-grid-dimensions"],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any(
            "outside-grid: geometry outside canvas" in error
            for error in errors
        ))

    def grid_displacement_payload(self):
        payload = copy.deepcopy(self.payload)
        payload["canvas"]["boundingBox"] = [-1, 8, 10, -1]
        payload["objects"] = [
            {
                "id": "source-grid",
                "type": "grid",
                "bounds": [0, 7, 9, 0],
                "xStep": 1,
                "yStep": 1,
                "stroke": "grid",
            },
            {"id": "origin", "type": "point", "at": [2, 1], "label": "O"},
            {"id": "target", "type": "point", "at": [5, 6], "label": "M"},
        ]
        payload["assertions"] = [
            {
                "id": "source-grid-9x7",
                "type": "gridDimensions",
                "grid": "source-grid",
                "columns": 9,
                "rows": 7,
            },
            {
                "id": "origin-to-target",
                "type": "displacement",
                "from": "origin",
                "to": "target",
                "dx": 3,
                "dy": 5,
            },
        ]
        payload["source"]["inventory"] = [
            {
                "id": "source-grid-facts",
                "description": "The source has a 9-column by 7-row grid.",
                "objects": ["source-grid"],
                "assertions": ["source-grid-9x7"],
                "requires": ["gridDimensions"],
            },
            {
                "id": "source-point-facts",
                "description": "Point M is three cells right and five cells above O.",
                "objects": ["origin", "target"],
                "assertions": ["origin-to-target"],
                "requires": ["pointRelationships"],
            },
        ]
        return payload

    def test_grid_dimensions_and_displacement_pass(self):
        payload = self.grid_displacement_payload()
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

    def test_wrong_grid_row_count_fails(self):
        payload = self.grid_displacement_payload()
        payload["assertions"][0]["rows"] = 8
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("grid has 7 rows, expected 8" in error for error in errors))

    def test_wrong_displacement_fails(self):
        payload = self.grid_displacement_payload()
        payload["assertions"][1]["dy"] = 4
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("displacement (3, 5)" in error for error in errors))

    def test_object_count_cannot_replace_source_relationship_assertions(self):
        payload = self.grid_displacement_payload()
        payload["assertions"] = [
            {
                "id": "object-count",
                "type": "objectCount",
                "objectType": "point",
                "count": 2,
            }
        ]
        for group in payload["source"]["inventory"]:
            group["assertions"] = ["object-count"]
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("gridDimensions" in error for error in errors))
        self.assertTrue(any(
            "multiple source points require a mapped relationship assertion" in error
            for error in errors
        ))

    def multi_point_displacement_payload(self):
        payload = self.grid_displacement_payload()
        payload["objects"].extend([
            {"id": "point-k", "type": "point", "at": [6, 2], "label": "K"},
            {"id": "point-p", "type": "point", "at": [3, 4], "label": "P"},
            {"id": "point-n", "type": "point", "at": [7, 5], "label": "N"},
        ])
        payload["assertions"].extend([
            {
                "id": "origin-to-k",
                "type": "displacement",
                "from": "origin",
                "to": "point-k",
                "dx": 4,
                "dy": 1,
            },
            {
                "id": "origin-to-p",
                "type": "displacement",
                "from": "origin",
                "to": "point-p",
                "dx": 1,
                "dy": 3,
            },
            {
                "id": "origin-to-n",
                "type": "displacement",
                "from": "origin",
                "to": "point-n",
                "dx": 5,
                "dy": 4,
            },
        ])
        group = payload["source"]["inventory"][1]
        group["objects"].extend(["point-k", "point-p", "point-n"])
        group["assertions"].extend([
            "origin-to-k",
            "origin-to-p",
            "origin-to-n",
        ])
        return payload

    def test_multi_point_relationship_coverage_passes(self):
        payload = self.multi_point_displacement_payload()
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])

    def test_missing_one_multi_point_relationship_fails(self):
        payload = self.multi_point_displacement_payload()
        payload["assertions"] = [
            item
            for item in payload["assertions"]
            if item["id"] != "origin-to-target"
        ]
        group = payload["source"]["inventory"][1]
        group["assertions"].remove("origin-to-target")
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any(
            "pointRelationships missing mapped relation coverage for 'target'"
            in error
            for error in errors
        ))

    def test_relationship_outside_inventory_group_cannot_cover_point(self):
        payload = self.multi_point_displacement_payload()
        payload["objects"].append({
            "id": "external",
            "type": "point",
            "at": [8, 6],
            "label": "E",
        })
        payload["assertions"] = [
            item
            for item in payload["assertions"]
            if item["id"] != "origin-to-target"
        ]
        payload["assertions"].append({
            "id": "target-to-external",
            "type": "displacement",
            "from": "target",
            "to": "external",
            "dx": 3,
            "dy": 0,
        })
        group = payload["source"]["inventory"][1]
        group["assertions"].remove("origin-to-target")
        group["assertions"].append("target-to-external")
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any(
            "pointRelationships missing mapped relation coverage for 'target'"
            in error
            for error in errors
        ))

    def test_inventory_catches_missing_relationship(self):
        payload = copy.deepcopy(self.payload)
        payload["source"]["inventory"][0]["assertions"].append(
            "required-arrow"
        )
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("missing assertion 'required-arrow'" in error for error in errors))

    def test_inside_rejects_member_outside_set(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].extend([
            {
                "id": "set-a",
                "type": "polygon",
                "points": [[-2, -2], [2, -2], [2, 2], [-2, 2]],
                "stroke": "ink",
                "fill": "paper",
            },
            {
                "id": "outside-member",
                "type": "point",
                "at": [2.5, 0],
                "fill": "accent",
            },
        ])
        payload["assertions"].append({
            "id": "outside-member-in-set",
            "type": "inside",
            "point": "outside-member",
            "container": "set-a",
            "margin": 0.1,
        })
        payload["source"]["inventory"].append({
            "id": "set-membership",
            "description": "The named member belongs to set A.",
            "objects": ["set-a", "outside-member"],
            "assertions": ["outside-member-in-set"],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("is outside 'set-a'" in error for error in errors))

    def test_connects_rejects_wrong_arrow_endpoint(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].append({
            "id": "relation-arrow",
            "type": "arrow",
            "from": "left",
            "to": "origin",
            "stroke": "accent",
        })
        payload["assertions"].append({
            "id": "left-to-right",
            "type": "connects",
            "arrow": "relation-arrow",
            "from": "left",
            "to": "right",
        })
        payload["source"]["inventory"].append({
            "id": "relation",
            "description": "A directed arrow connects A to B.",
            "objects": ["relation-arrow"],
            "assertions": ["left-to-right"],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any("ends at the wrong member" in error for error in errors))

    def test_set_relation_requires_containment_for_every_member_and_label(self):
        payload = copy.deepcopy(self.payload)
        payload["objects"].extend([
            {
                "id": "rel-left-set",
                "type": "polygon",
                "points": [[-3, -2], [0, -2], [0, 2], [-3, 2]],
                "stroke": "ink",
                "fill": "paper",
            },
            {
                "id": "rel-right-set",
                "type": "polygon",
                "points": [[1, -2], [4, -2], [4, 2], [1, 2]],
                "stroke": "ink",
                "fill": "paper",
            },
            {
                "id": "rel-left-0",
                "type": "point",
                "at": [-1.5, 0],
                "fill": "accent",
            },
            {
                "id": "rel-left-0-label",
                "type": "text",
                "at": [-2.2, 0],
                "text": "a",
                "fontSize": 16,
                "labelColor": "ink",
            },
            {
                "id": "rel-right-0",
                "type": "point",
                "at": [2.5, 0],
                "fill": "accent",
            },
            {
                "id": "relation-arrow",
                "type": "arrow",
                "from": "rel-left-0",
                "to": "rel-right-0",
                "stroke": "accent",
            },
        ])
        payload["assertions"].append({
            "id": "left-to-right",
            "type": "connects",
            "arrow": "relation-arrow",
            "from": "rel-left-0",
            "to": "rel-right-0",
        })
        payload["source"]["inventory"].append({
            "id": "set-relation",
            "description": "Two sets, their members, and one mapping arrow.",
            "objects": [
                "rel-left-set",
                "rel-right-set",
                "rel-left-0",
                "rel-left-0-label",
                "rel-right-0",
                "relation-arrow",
            ],
            "assertions": ["left-to-right"],
        })
        errors = MODULE.validate(self.write(payload), "draft")
        self.assertTrue(any(
            "inside assertion for member 'rel-left-0'" in error
            for error in errors
        ))
        self.assertTrue(any(
            "inside assertion for member 'rel-left-0-label'" in error
            for error in errors
        ))
        self.assertTrue(any(
            "inside assertion for member 'rel-right-0'" in error
            for error in errors
        ))

        payload["assertions"][4]["count"] = 5
        containment = [
            {
                "id": "rel-left-0-inside",
                "type": "inside",
                "point": "rel-left-0",
                "container": "rel-left-set",
                "margin": 0.1,
            },
            {
                "id": "rel-left-0-label-inside",
                "type": "inside",
                "point": "rel-left-0-label",
                "container": "rel-left-set",
                "margin": 0.1,
            },
            {
                "id": "rel-right-0-inside",
                "type": "inside",
                "point": "rel-right-0",
                "container": "rel-right-set",
                "margin": 0.1,
            },
        ]
        payload["assertions"].extend(containment)
        payload["source"]["inventory"][-1]["assertions"].extend(
            assertion["id"] for assertion in containment
        )
        self.assertEqual(MODULE.validate(self.write(payload), "draft"), [])


if __name__ == "__main__":
    unittest.main()
