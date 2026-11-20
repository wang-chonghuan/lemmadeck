import copy
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

from PIL import Image

SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
sys.path.insert(0, str(SKILL / "scripts"))
from validate_spec import validate


def fixture():
    return {
        "schema": "ld-s10y-image/figure-spec@2",
        "id": "fig-choice-layer-fixture",
        "mode": "deterministic",
        "description": "Synthetic opaque cover and underlying segment.",
        "source": {
            "authoredBasis": "A horizontal segment passes behind an opaque square.",
            "authoritativeText": [{"text": "Inspect the visible segment portions."}],
            "inventory": [{
                "id": "cover-and-segment",
                "description": "One segment and one opaque square.",
                "objects": ["underlying", "cover"],
                "assertions": ["segment-count", "cover-count"],
            }],
        },
        "canvas": {
            "width": 640, "height": 640, "boundingBox": [-4, 4, 4, -4],
            "background": "paper",
        },
        "display": {
            "layout": "scroll", "purpose": "instructional",
            "minTextPx": 16, "widths": [640],
        },
        "objects": [
            {"id": "underlying", "type": "segment",
             "from": [-3, 0], "to": [3, 0], "stroke": "ink"},
            {"id": "cover", "type": "polygon",
             "points": [[-1, 1], [1, 1], [1, -1], [-1, -1]],
             "stroke": "ink", "fill": "paper", "fillOpacity": 1},
        ],
        "assertions": [
            {"id": "segment-count", "type": "objectCount",
             "objectType": "segment", "count": 1},
            {"id": "cover-count", "type": "objectCount",
             "objectType": "polygon", "count": 1},
        ],
    }


class LayerOrderTest(unittest.TestCase):
    def setUp(self):
        scratch = REPO / ".tmp"
        scratch.mkdir(exist_ok=True)
        self.temp = tempfile.TemporaryDirectory(dir=scratch)
        self.root = Path(self.temp.name)
        self.spec = fixture()

    def tearDown(self):
        self.temp.cleanup()

    def check_spec(self, spec):
        file = self.root / "spec.json"
        file.write_text(json.dumps(spec))
        return validate(file, "draft")

    def test_only_supported_integer_layers_are_accepted(self):
        for value in [0, 19]:
            for item in self.spec["objects"]:
                item["layer"] = value
            self.assertEqual(self.check_spec(self.spec), [])
        for value in [-1, 20, 1.5, True, "3", None]:
            with self.subTest(value=value):
                self.spec["objects"][0]["layer"] = value
                self.assertTrue(any(".layer must be" in error
                                    for error in self.check_spec(self.spec)))
        spec = copy.deepcopy(self.spec)
        spec["objects"][0] = {
            "id": "underlying", "type": "line",
            "from": [-3, 0], "to": [3, 0], "layer": 2,
        }
        self.assertTrue(any("only for segments and polygons" in error
                            for error in self.check_spec(spec)))

    def render(self):
        file = self.root / "spec.json"
        file.write_text(json.dumps(self.spec))
        result = subprocess.run([
            "node", str(SKILL / "scripts/render_spec.mjs"),
            "--spec", str(file), "--svg", str(self.root / "figure.svg"),
            "--report", str(self.root / "render.json"),
            "--png", str(self.root / "figure.png"),
        ], cwd=REPO, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        return ET.fromstring((self.root / "figure.svg").read_text())

    def test_opaque_fill_and_borders_paint_after_underlying_segment(self):
        self.spec["objects"][0]["layer"] = 0
        self.spec["objects"][1]["layer"] = 19
        svg = self.render()
        nodes = list(svg.iter())
        parents = {child: parent for parent in svg.iter() for child in parent}
        segment = next(node for node in nodes
                       if node.get("id", "").endswith("_ld-underlying"))
        cover = next(node for node in nodes
                     if node.get("id", "").endswith("_ld-cover"))
        self.assertLess(nodes.index(segment), nodes.index(cover))
        self.assertIsNot(parents[segment], parents[cover])
        borders = [node for node in nodes
                   if node.tag.endswith("line") and node is not segment]
        self.assertEqual(len(borders), 4)
        self.assertTrue(all(parents[node] is parents[cover] for node in borders))
        self.assertEqual(float(cover.get("fill-opacity")), 1)
        with Image.open(self.root / "figure.png") as image:
            self.assertEqual(image.convert("RGB").getpixel((320, 320)),
                             (255, 255, 255))
            self.assertEqual(image.convert("RGB").getpixel((160, 320)),
                             (21, 32, 31))

    def test_omitted_layers_keep_existing_default_order(self):
        nodes = list(self.render().iter())
        segment = next(node for node in nodes
                       if node.get("id", "").endswith("_ld-underlying"))
        cover = next(node for node in nodes
                     if node.get("id", "").endswith("_ld-cover"))
        self.assertLess(nodes.index(cover), nodes.index(segment))
        with Image.open(self.root / "figure.png") as image:
            self.assertEqual(image.convert("RGB").getpixel((320, 320)),
                             (21, 32, 31))


if __name__ == "__main__":
    unittest.main()
