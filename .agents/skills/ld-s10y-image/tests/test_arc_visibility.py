import copy
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET

SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
SOURCE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/6a/editions/modern-us-neutral/figures/fig-63.spec.json"
NS = {"svg": "http://www.w3.org/2000/svg"}


def visible_points(svg):
    tree = ET.fromstring(svg)
    return [p for p in tree.findall(".//svg:ellipse", NS)
            if p.get("display") != "none" and "visibility: hidden" not in p.get("style", "")]


class ArcVisibility(unittest.TestCase):
    def test_literal_helpers_hidden_but_declared_points_remain(self):
        spec = json.loads(SOURCE.read_text())
        spec["objects"] = [x for x in spec["objects"] if x["type"] == "arc"][:1]
        spec["assertions"] = [{"id": "arc-count", "type": "objectCount",
                               "objectType": "arc", "count": 1}]
        spec["source"]["inventory"] = [{
            "id": "arc", "description": "One circular arc without endpoint markers.",
            "objects": [spec["objects"][0]["id"]], "assertions": ["arc-count"],
        }]
        with tempfile.TemporaryDirectory(dir=REPO / ".tmp") as scratch:
            root = Path(scratch)
            for explicit in [False, True]:
                candidate = copy.deepcopy(spec)
                if explicit:
                    candidate["objects"].insert(0, {
                        "id": "endpoint", "type": "point", "at": [0.9, 0],
                        "stroke": "ink", "fill": "ink",
                    })
                    candidate["objects"][1]["start"] = "endpoint"
                    candidate["source"]["inventory"][0]["objects"].append("endpoint")
                file = root / "spec.json"
                file.write_text(json.dumps(candidate))
                result = subprocess.run([
                    "node", str(SKILL / "scripts/render_spec.mjs"),
                    "--spec", str(file), "--svg", str(root / "figure.svg"),
                    "--report", str(root / "render.json"),
                ], cwd=REPO, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                svg = (root / "figure.svg").read_text()
                self.assertEqual(len(visible_points(svg)), int(explicit))
                if not explicit:
                    corrupted = svg.replace('display="none"', 'display="inline"').replace(
                        "visibility: hidden", "visibility: inherit")
                    self.assertGreater(len(visible_points(corrupted)), 0)


if __name__ == "__main__":
    unittest.main()
