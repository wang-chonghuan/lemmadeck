"""Authored diagrams keep geometry checks without inventing original pixels."""

import copy
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "validate_spec.py"
IMPORT = importlib.util.spec_from_file_location("authored_validator", SCRIPT)
VALIDATOR = importlib.util.module_from_spec(IMPORT)
IMPORT.loader.exec_module(VALIDATOR)


class AuthoredSpecTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.directory = Path(self.temp.name)
        self.spec = {
            "schema": "ld-s10y-image/figure-spec@2",
            "id": "fig-choice-authored",
            "mode": "deterministic",
            "description": "Candidate line derived from y=x, not source pixels.",
            "source": {
                "authoredBasis": "y=x has slope 1; the line joins (-1,-1),(1,1).",
                "authoritativeText": [{"text": "Recognize the graph of y=x."}],
                "inventory": [{
                    "id": "derived-line", "description": "Authored line and panel label.",
                    "objects": ["line", "label"], "assertions": ["count"],
                }],
            },
            "canvas": {"width": 640, "height": 640, "boundingBox": [-2, 2, 2, -2]},
            "display": {"layout": "scroll", "purpose": "instructional",
                        "minTextPx": 16, "widths": [640]},
            "objects": [
                {"id": "line", "type": "line", "from": [-1, -1], "to": [1, 1]},
                {"id": "label", "type": "text", "at": [-1, 1], "text": "A"},
            ],
            "assertions": [{"id": "count", "type": "objectCount", "objectType": "line", "count": 1}],
        }

    def tearDown(self):
        self.temp.cleanup()

    def check_spec(self, payload):
        path = self.directory / "spec.json"
        path.write_text(json.dumps(payload), encoding="utf-8")
        return VALIDATOR.validate(path, "rendered")

    def test_authored_does_not_require_a_fake_original(self):
        self.assertEqual(self.check_spec(self.spec), [])

    def test_authored_is_not_an_escape_for_other_modes_or_missing_basis(self):
        for mode in ["hybrid", "generated"]:
            payload = copy.deepcopy(self.spec)
            payload["mode"] = mode
            self.assertTrue(any("authoredBasis requires" in e for e in self.check_spec(payload)))
        payload = copy.deepcopy(self.spec)
        payload["source"]["authoredBasis"] = " "
        self.assertTrue(any("authoredBasis must be nonempty" in e for e in self.check_spec(payload)))
        payload = copy.deepcopy(self.spec)
        payload["id"] = "fig-77"
        self.assertTrue(any("new fig-choice-" in e for e in self.check_spec(payload)))

    def test_cannot_claim_both_provenance_types(self):
        payload = copy.deepcopy(self.spec)
        payload["source"]["image"] = {"path": "unused.png", "sha256": "0" * 64}
        self.assertTrue(any("cannot claim source.image" in e for e in self.check_spec(payload)))

    def test_existing_source_path_still_requires_current_image(self):
        payload = copy.deepcopy(self.spec)
        del payload["source"]["authoredBasis"]
        self.assertTrue(any("source.image must be" in e for e in self.check_spec(payload)))
        image = self.directory / "source.png"
        image.write_bytes(b"source fixture")
        payload["source"]["image"] = {
            "path": str(image), "sha256": hashlib.sha256(image.read_bytes()).hexdigest(),
        }
        self.assertEqual(self.check_spec(payload), [])
        image.write_bytes(b"changed fixture")
        self.assertTrue(any("sha256 is stale" in e for e in self.check_spec(payload)))

    def test_authored_still_checks_inventory_and_canvas(self):
        payload = copy.deepcopy(self.spec)
        payload["source"]["inventory"][0]["objects"].append("absent")
        self.assertTrue(self.check_spec(payload))
        payload = copy.deepcopy(self.spec)
        payload["objects"].append({"id": "outside", "type": "point", "at": [3, 3]})
        self.assertTrue(any("outside" in e for e in self.check_spec(payload)))

    def test_review_binds_authored_basis_and_rejects_stale_spec(self):
        self.assertEqual(self.check_spec(self.spec), [])
        spec_path = self.directory / "spec.json"
        asset = self.directory / "fixture.svg"
        asset.write_text('<svg xmlns="http://www.w3.org/2000/svg"/>', encoding="utf-8")
        digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
        render = self.directory / "render.json"
        render.write_text(json.dumps({
            "schema": "ld-s10y-image/render@2", "figure": self.spec["id"],
            "status": "pass", "spec": {"sha256": digest(spec_path)},
            "output": {"svg": {"path": str(asset), "sha256": digest(asset)}},
        }), encoding="utf-8")
        review = self.directory / "review.json"
        command = [
            sys.executable, str(SCRIPT.with_name("record_review.py")),
            "--spec", str(spec_path), "--render", str(render),
            "--output", str(review), "--status", "pass",
            "--notes", "Synthetic evidence-binding fixture, not a content approval.",
        ]
        result = subprocess.run(command, text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(review.read_text())["source"],
                         {"authoredBasis": self.spec["source"]["authoredBasis"]})
        self.spec["source"]["authoredBasis"] += " Modified basis."
        self.check_spec(self.spec)
        result = subprocess.run(command, text=True, capture_output=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("stale FigureSpec", result.stderr)


if __name__ == "__main__":
    unittest.main()
