import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET


SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
NS = {"svg": "http://www.w3.org/2000/svg"}


class CircleDash(unittest.TestCase):
    def test_solid_and_excluded_circle_boundaries_remain_distinct(self):
        spec = {
            "schema": "ld-s10y-image/figure-spec@2",
            "id": "fig-choice-circle-dash-fixture",
            "mode": "deterministic",
            "description": "Synthetic solid and excluded circular boundaries.",
            "source": {
                "authoredBasis": "Two radius-one circles with distinct boundary styles.",
                "authoritativeText": [{"text": "Compare solid and dashed boundaries."}],
                "inventory": [{
                    "id": "circles", "description": "One solid and one dashed circle.",
                    "objects": ["solid", "dashed"], "assertions": ["two-circles"],
                }],
            },
            "canvas": {"width": 640, "height": 320,
                       "boundingBox": [-4, 2, 4, -2], "background": "paper"},
            "display": {"purpose": "instructional", "layout": "scroll",
                        "widths": [640], "minTextPx": 16},
            "objects": [
                {"id": "solid", "type": "circle", "center": [-2, 0],
                 "radius": 1, "stroke": "ink", "strokeWidth": 3, "dash": 0},
                {"id": "dashed", "type": "circle", "center": [2, 0],
                 "radius": 1, "stroke": "ink", "strokeWidth": 3, "dash": 2},
            ],
            "assertions": [{"id": "two-circles", "type": "objectCount",
                            "objectType": "circle", "count": 2}],
        }
        with tempfile.TemporaryDirectory(dir=REPO / ".tmp") as scratch:
            root = Path(scratch)
            source = root / "spec.json"
            source.write_text(json.dumps(spec), encoding="utf-8")
            result = subprocess.run([
                "node", str(SKILL / "scripts/render_spec.mjs"),
                "--spec", str(source), "--svg", str(root / "figure.svg"),
                "--report", str(root / "render.json"),
            ], cwd=REPO, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            tree = ET.fromstring((root / "figure.svg").read_text())
            circles = {
                key: next(node for node in tree.iter()
                          if node.get("id", "").endswith("_ld-" + key))
                for key in ("solid", "dashed")
            }
            self.assertFalse(circles["solid"].get("stroke-dasharray"))
            self.assertTrue(circles["dashed"].get("stroke-dasharray"))
            circles["dashed"].attrib.pop("stroke-dasharray")
            self.assertFalse(circles["dashed"].get("stroke-dasharray"))


if __name__ == "__main__":
    unittest.main()
