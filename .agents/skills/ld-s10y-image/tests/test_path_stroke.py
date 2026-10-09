import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET

SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
SOURCE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/6a/editions/modern-us-neutral/figures/fig-58.spec.json"
NS = {"svg": "http://www.w3.org/2000/svg"}


def pixel_stroke(path):
    return (path.get("vector-effect") == "non-scaling-stroke"
            and float(path.get("stroke-width")) == 3)


class PathStroke(unittest.TestCase):
    def test_solid_and_dashed_paths_are_distinct(self):
        spec = json.loads(SOURCE.read_text())
        curve_spec = next(o for o in spec["objects"] if o["type"] == "svgPath")
        curve_spec["strokeWidth"] = 3
        with tempfile.TemporaryDirectory(dir=REPO / ".tmp") as scratch:
            root = Path(scratch)
            for dash, expected in [(0, None), (2, "15,15")]:
                curve_spec["dash"] = dash
                file = root / "spec.json"
                file.write_text(json.dumps(spec))
                result = subprocess.run([
                    "node", str(SKILL / "scripts/render_spec.mjs"),
                    "--spec", str(file), "--svg", str(root / "figure.svg"),
                    "--report", str(root / "render.json"),
                ], cwd=REPO, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                paths = ET.fromstring((root / "figure.svg").read_text()).findall(".//svg:path", NS)
                curve = next(p for p in paths if p.get("d") == curve_spec["d"])
                self.assertEqual(curve.get("stroke-dasharray"), expected)
                if dash:
                    curve.attrib.pop("stroke-dasharray")
                    self.assertNotEqual(curve.get("stroke-dasharray"), expected)

    def test_anisotropic_canvas_retains_pixel_width(self):
        spec = json.loads(SOURCE.read_text())
        with tempfile.TemporaryDirectory(dir=REPO / ".tmp") as scratch:
            root = Path(scratch)
            for height in [400, 800]:
                spec["canvas"]["height"] = height
                file = root / "spec.json"
                file.write_text(json.dumps(spec))
                result = subprocess.run([
                    "node", str(SKILL / "scripts/render_spec.mjs"),
                    "--spec", str(file), "--svg", str(root / "figure.svg"),
                    "--report", str(root / "render.json"),
                ], cwd=REPO, capture_output=True, text=True)
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
                paths = ET.fromstring((root / "figure.svg").read_text()).findall(".//svg:path", NS)
                curve = next(p for p in paths if p.get("d") == spec["objects"][-1]["d"])
                self.assertTrue(pixel_stroke(curve))
                curve.attrib.pop("vector-effect")
                self.assertFalse(pixel_stroke(curve))


if __name__ == "__main__":
    unittest.main()
