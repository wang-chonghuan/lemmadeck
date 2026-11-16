import json
from pathlib import Path
import subprocess
import tempfile
import unittest


TOOL = Path(__file__).resolve().parents[1] / "tools" / "render_lesson.js"


class RenderGroupTests(unittest.TestCase):
    def fixture(self, root, groups):
        lesson = root / "book" / "lessons" / "unit"
        lesson.mkdir(parents=True)
        (lesson / "lesson.json").write_text(
            json.dumps({"title": "Unit", "prose": []}), encoding="utf-8"
        )
        exercises = [
            {"number": str(i), "source_number": str(i), "group": group,
             "text": "Unchanged question", "figures": []}
            for i, group in enumerate(groups, 1)
        ]
        (lesson / "exercises.json").write_text(
            json.dumps({"count": len(exercises), "exercises": exercises}), encoding="utf-8"
        )
        out = root / "out" / "unit"
        out.mkdir(parents=True)
        return out

    def render(self, root, partial=False):
        args = ["node", str(TOOL), str(root / "book"),
                "--out", str(root / "out"), "--lesson", "unit"]
        if partial:
            args.append("--groups-only")
        return subprocess.run(args, capture_output=True, text=True)

    def test_full_render_formats_emphasis_and_escapes_labels(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = self.fixture(root, ["**Practice** & <script>", "*Homework*"])
            result = self.render(root)
            self.assertEqual(result.returncode, 0, result.stderr)
            html = (out / "exercises.html").read_text()
            self.assertIn('<div class="exgroup"><strong>Practice</strong> &amp; &lt;script&gt;</div>', html)
            self.assertIn('<div class="exgroup"><em>Homework</em></div>', html)
            self.assertNotIn("<script>", html)

    def test_partial_render_changes_only_group_markup(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = self.fixture(root, ["**Practice**", "**Practice**", "*Homework*"])
            original = '<h1>Unit</h1><div class="exgroup">**Practice**</div><p>unchanged</p><div class="exgroup">*Homework*</div>'
            (out / "exercises.html").write_text(original)
            (out / "text.html").write_text("untouched text")
            result = self.render(root, partial=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(
                (out / "exercises.html").read_text(),
                original.replace("**Practice**", "<strong>Practice</strong>").replace("*Homework*", "<em>Homework</em>"),
            )
            self.assertEqual((out / "text.html").read_text(), "untouched text")
            before = (out / "exercises.html").read_bytes()
            self.assertNotEqual(self.render(root, partial=True).returncode, 0)
            self.assertEqual((out / "exercises.html").read_bytes(), before)

    def test_partial_mismatch_is_atomic(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = self.fixture(root, ["**Practice**", "*Homework*"])
            original = '<div class="exgroup">**Practice**</div><div class="exgroup">different</div>'
            (out / "exercises.html").write_text(original)
            result = self.render(root, partial=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual((out / "exercises.html").read_text(), original)


if __name__ == "__main__":
    unittest.main()
