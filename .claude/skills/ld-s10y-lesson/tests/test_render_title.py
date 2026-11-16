import html
import json
from pathlib import Path
import subprocess
import tempfile
import unittest


TOOL = Path(__file__).resolve().parents[1] / "tools" / "render_lesson.js"


class RenderTitleTests(unittest.TestCase):
    def fixture(self, root, title, choices=False):
        lesson = root / "book" / "editions" / "modern-us-neutral" / "lessons" / "unit"
        lesson.mkdir(parents=True)
        (lesson / "lesson.json").write_text(json.dumps({"title": title}), encoding="utf-8")
        (lesson / "exercises.json").write_text('{"count":0,"exercises":[]}', encoding="utf-8")
        (lesson / "figures.json").write_text('{"figures":[]}', encoding="utf-8")
        if choices:
            (lesson / "choice-set").mkdir()
        output = root / "out" / "unit"
        output.mkdir(parents=True)
        surfaces = [("text", title), ("exercises", title + " \u00b7 \u4e60\u9898")]
        if choices:
            surfaces.append(("choices", title + " \u00b7 \u9009\u62e9\u9898"))
        originals = {}
        for surface, heading in surfaces:
            content = "<h1>" + html.escape(heading, quote=False) + "</h1><p>unchanged body</p>"
            (output / (surface + ".html")).write_text(content, encoding="utf-8")
            originals[surface] = content
        return output, originals

    def render(self, root):
        return subprocess.run(
            ["node", str(TOOL), str(root / "book"), "--edition", "modern-us-neutral",
             "--out", str(root / "out"), "--lesson", "unit", "--titles-only"],
            capture_output=True, text=True,
        )

    def test_inline_emphasis_and_escaping_only_change_heading(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output, originals = self.fixture(root, "*matter* & <script> **phase**", choices=True)
            result = self.render(root)
            self.assertEqual(result.returncode, 0, result.stderr)
            for surface, original in originals.items():
                actual = (output / (surface + ".html")).read_text(encoding="utf-8")
                self.assertIn("<em>matter</em> &amp; &lt;script&gt; <strong>phase</strong>", actual)
                self.assertNotIn("<script>", actual)
                self.assertEqual(actual.split("</h1>")[1], original.split("</h1>")[1])

    def test_heading_mismatch_does_not_partially_write(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output, originals = self.fixture(root, "*matter*")
            (output / "exercises.html").write_text("<h1>different title</h1>", encoding="utf-8")
            result = self.render(root)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("does not match approved title", result.stderr)
            self.assertEqual((output / "text.html").read_text(), originals["text"])

    def test_repeated_partial_repair_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output, _ = self.fixture(root, "*matter*")
            self.assertEqual(self.render(root).returncode, 0)
            before = (output / "text.html").read_bytes()
            self.assertNotEqual(self.render(root).returncode, 0)
            self.assertEqual((output / "text.html").read_bytes(), before)


if __name__ == "__main__":
    unittest.main()
