import json
import re
import subprocess
import tempfile
import unittest
import base64
from pathlib import Path
from xml.etree import ElementTree


SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
FIXTURE = SKILL / "tests" / "fixtures" / "number-line.json"
RENDERER = SKILL / "scripts" / "render_spec.mjs"


class RendererNamespaceTests(unittest.TestCase):
    def render(self, figure_id, directory):
        spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
        spec["id"] = figure_id
        spec_path = directory / f"{figure_id}.json"
        svg_path = directory / f"{figure_id}.svg"
        spec_path.write_text(json.dumps(spec), encoding="utf-8")
        result = subprocess.run(
            ["node", str(RENDERER), "--spec", str(spec_path), "--svg", str(svg_path)],
            cwd=REPO,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        return svg_path

    def svg_ids_and_references(self, path):
        text = path.read_text(encoding="utf-8")
        root = ElementTree.fromstring(text)
        ids = {
            element.attrib["id"]
            for element in root.iter()
            if "id" in element.attrib
        }
        references = set(re.findall(r"""url\(["']?#([^"')]+)""", text))
        return ids, references

    def test_separate_figures_have_disjoint_svg_ids(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            first = self.render("fig-test-number-line", directory)
            second = self.render("fig-test-second", directory)
            first_ids, first_references = self.svg_ids_and_references(first)
            second_ids, second_references = self.svg_ids_and_references(second)

            self.assertTrue(first_ids.isdisjoint(second_ids))
            self.assertTrue(first_references <= first_ids)
            self.assertTrue(second_references <= second_ids)
            self.assertIn("ld-fig-test-number-line_ClipFull", first_ids)
            self.assertIn("ld-fig-test-second_ClipFull", second_ids)

    def test_deterministic_report_omits_preview_png(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
            spec_path = directory / "figure.spec.json"
            svg_path = directory / "figure.svg"
            png_path = directory / "preview.png"
            report_path = directory / "figure.svg.json"
            spec_path.write_text(json.dumps(spec), encoding="utf-8")

            result = subprocess.run(
                [
                    "node",
                    str(RENDERER),
                    "--spec",
                    str(spec_path),
                    "--svg",
                    str(svg_path),
                    "--png",
                    str(png_path),
                    "--report",
                    str(report_path),
                ],
                cwd=REPO,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            report = json.loads(report_path.read_text(encoding="utf-8"))
            self.assertEqual(report["schema"], "ld-s10y-image/render@2")
            self.assertEqual(set(report["output"]), {"svg"})
            self.assertTrue(all(
                item["status"] == "pass"
                for item in report["displayChecks"]
            ))
            self.assertTrue(png_path.is_file())

    def test_render_rejects_undersized_display_text(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
            for item in spec["objects"]:
                if item["type"] == "text":
                    item["fontSize"] = 12
                if item["type"] == "axis":
                    item["fontSize"] = 12
            spec_path = directory / "figure.spec.json"
            svg_path = directory / "figure.svg"
            report_path = directory / "figure.svg.json"
            spec_path.write_text(json.dumps(spec), encoding="utf-8")

            result = subprocess.run(
                [
                    "node",
                    str(RENDERER),
                    "--spec",
                    str(spec_path),
                    "--svg",
                    str(svg_path),
                    "--report",
                    str(report_path),
                ],
                cwd=REPO,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
            report = json.loads(report_path.read_text(encoding="utf-8"))
            self.assertTrue(any(
                item["status"] == "fail"
                for item in report["displayChecks"]
            ))

    def test_hybrid_keeps_artwork_and_vector_overlay_separate(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            artwork_source = directory / "source.png"
            artwork_source.write_bytes(base64.b64decode(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ"
                "AAAADUlEQVR42mP8z8BQDwAFgQIAffJQ9QAAAABJRU5ErkJggg=="
            ))
            spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
            spec["mode"] = "hybrid"
            spec["assets"] = [{
                "id": "art",
                "path": str(artwork_source),
                "role": "artwork",
            }]
            spec["objects"].insert(0, {
                "id": "artwork",
                "type": "image",
                "asset": "art",
                "at": [-2, -1],
                "size": [4, 2],
            })
            spec["source"]["inventory"][0]["objects"].append("artwork")
            spec_path = directory / "figure.spec.json"
            svg_path = directory / "figure.svg"
            artwork_path = directory / "figure.artwork.png"
            report_path = directory / "figure.render.json"
            spec_path.write_text(json.dumps(spec), encoding="utf-8")

            result = subprocess.run(
                [
                    "node",
                    str(RENDERER),
                    "--spec",
                    str(spec_path),
                    "--svg",
                    str(svg_path),
                    "--artwork",
                    str(artwork_path),
                    "--report",
                    str(report_path),
                ],
                cwd=REPO,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertNotIn("<image", svg_path.read_text(encoding="utf-8"))
            self.assertTrue(artwork_path.is_file())
            report = json.loads(report_path.read_text(encoding="utf-8"))
            self.assertEqual(set(report["output"]), {"artwork", "svg"})


if __name__ == "__main__":
    unittest.main()
