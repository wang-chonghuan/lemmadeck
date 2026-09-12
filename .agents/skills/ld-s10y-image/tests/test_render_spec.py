import json
import re
import subprocess
import tempfile
import unittest
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


if __name__ == "__main__":
    unittest.main()
