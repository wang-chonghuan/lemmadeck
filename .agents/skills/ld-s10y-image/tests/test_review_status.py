import copy
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
from edition import validate_review


class ReviewStatusTests(unittest.TestCase):
    def test_real_render_status_and_hash_gates(self):
        fixture = SKILL / "tests/fixtures/number-line.json"
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            spec = json.loads(fixture.read_text())
            spec_path = directory / "spec.json"
            svg = directory / "figure.svg"
            report = directory / "render.json"
            review = directory / "review.json"

            def save(path, payload):
                path.write_text(json.dumps(payload))

            def render():
                return subprocess.run(
                    ["node", str(SKILL / "scripts/render_spec.mjs"),
                     "--spec", str(spec_path), "--svg", str(svg),
                     "--report", str(report)],
                    cwd=REPO, capture_output=True, text=True,
                )

            def record(status, accepted):
                review.unlink(missing_ok=True)
                result = subprocess.run(
                    [sys.executable, str(SKILL / "scripts/record_review.py"),
                     "--spec", str(spec_path), "--render", str(report),
                     "--output", str(review), "--status", status,
                     "--notes", "CLI acceptance of real renderer evidence."],
                    cwd=REPO, capture_output=True, text=True,
                )
                self.assertEqual(result.returncode == 0, accepted,
                                 result.stdout + result.stderr)
                self.assertEqual(review.exists(), accepted)

            save(spec_path, spec)
            result = render()
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            record("pass", True)
            self.assertEqual(validate_review(review, spec_path, "render",
                                             report, {"svg": svg}, spec["id"]), [])

            # Move a real label into a visible point to create a renderer failure.
            spec["objects"][-1]["labelPlacement"] = {"position": "CENTER"}
            save(spec_path, spec)
            result = render()
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(json.loads(report.read_text())["status"], "fail")
            record("fail", True)
            payload = json.loads(review.read_text())
            self.assertEqual(payload["status"], "fail")
            for key, path in [("spec", spec_path), ("render", report)]:
                self.assertEqual(payload[key]["sha256"],
                                 hashlib.sha256(path.read_bytes()).hexdigest())
            self.assertEqual(payload["source"], spec["source"]["image"])
            self.assertEqual(payload["outputs"]["svg"]["sha256"],
                             hashlib.sha256(svg.read_bytes()).hexdigest())
            self.assertTrue(validate_review(review, spec_path, "render",
                                            report, {"svg": svg}, spec["id"]))
            record("pass", False)

            valid_failure = json.loads(report.read_text())
            for state in [None, "draft", "unknown"]:
                broken = copy.deepcopy(valid_failure)
                broken["status"] = state
                save(report, broken)
                record("fail", False)
            broken = copy.deepcopy(valid_failure)
            del broken["status"]
            save(report, broken)
            record("fail", False)
            for key, value in [("figure", "other-figure"),
                               ("schema", "ld-s10y-image/render@0")]:
                broken = copy.deepcopy(valid_failure)
                broken[key] = value
                save(report, broken)
                record("fail", False)
            broken = copy.deepcopy(valid_failure)
            broken["spec"]["sha256"] = "0" * 64
            save(report, broken)
            record("fail", False)
            broken = copy.deepcopy(valid_failure)
            broken["output"]["svg"]["sha256"] = "0" * 64
            save(report, broken)
            record("fail", False)
            save(report, valid_failure)
            spec["source"]["image"]["sha256"] = "0" * 64
            save(spec_path, spec)
            record("fail", False)


if __name__ == "__main__":
    unittest.main()
