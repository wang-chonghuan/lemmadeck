import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SKILL = Path(__file__).resolve().parents[1]
MODULE_SPEC = importlib.util.spec_from_file_location("validate_spec", SKILL / "scripts/validate_spec.py")
MODULE = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(MODULE)
REPO = SKILL.parents[2]
SOURCE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/6a/editions/modern-us-neutral/figures/fig-59.spec.json"


class LabelPlacementContract(unittest.TestCase):
    def validate(self, spec):
        with tempfile.TemporaryDirectory() as scratch:
            file = Path(scratch) / "spec.json"
            file.write_text(json.dumps(spec))
            return MODULE.validate(file, "draft")

    def test_supported_positions_and_rejected_alias(self):
        spec = json.loads(SOURCE.read_text())
        label = next(x for x in spec["objects"] if x["type"] == "text")
        for position in ["CENTER", "NE", "NW", "SE", "SW", "E", "W", "N", "S"]:
            with self.subTest(position=position):
                label["labelPlacement"] = {"position": position}
                self.assertEqual(self.validate(spec), [])
        for position in ["C", "center", "", "invalid"]:
            with self.subTest(position=position):
                label["labelPlacement"] = {"position": position}
                self.assertTrue(any("position is unsupported" in x for x in self.validate(spec)))

    def test_tick_labels_share_the_contract(self):
        spec = json.loads(SOURCE.read_text())
        axis = next(x for x in spec["objects"] if x["type"] == "axis")
        for position in ["CENTER", "C"]:
            candidate = copy.deepcopy(spec)
            target = next(x for x in candidate["objects"] if x["id"] == axis["id"])
            target["ticks"][0]["labelPlacement"] = {"position": position}
            errors = self.validate(candidate)
            if position == "CENTER":
                self.assertEqual(errors, [])
            else:
                self.assertTrue(any(".ticks[0]" in x and "unsupported" in x for x in errors))


if __name__ == "__main__":
    unittest.main()
