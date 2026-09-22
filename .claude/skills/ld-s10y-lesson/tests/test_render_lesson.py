import json
import subprocess
import tempfile
import unittest
from pathlib import Path


SKILL = Path(__file__).resolve().parents[1]
RENDERER = SKILL / "tools" / "render_lesson.js"


class RenderLessonFigureDisplayTests(unittest.TestCase):
    def write_json(self, path, payload):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload), encoding="utf-8")

    def test_offline_render_consumes_figure_display_contract(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            book = root / "book"
            edition = book / "editions" / "modern-us-neutral"
            figures = edition / "figures"
            lesson = edition / "lessons" / "lesson-test"
            output = root / "render"
            figures.mkdir(parents=True)

            svg = (
                '<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">'
                '<text x="10" y="25" font-size="20">A</text></svg>'
            )
            for figure_id in ("fig-inline", "fig-scroll"):
                (figures / f"{figure_id}.svg").write_text(svg, encoding="utf-8")

            self.write_json(figures / "fig-inline.spec.json", {
                "mode": "deterministic",
                "display": {
                    "layout": "inline",
                    "purpose": "instructional",
                    "maxWidthPx": 360,
                },
            })
            self.write_json(figures / "fig-scroll.spec.json", {
                "mode": "deterministic",
                "display": {
                    "layout": "scroll",
                    "purpose": "instructional",
                },
            })
            self.write_json(lesson / "lesson.json", {
                "title": "Display contract",
                "printed_title": "Display contract",
                "prose": [{"kind": "fig", "id": "fig-inline", "label": "Inline"}],
                "section_breaks": [],
            })
            self.write_json(lesson / "exercises.json", {
                "count": 1,
                "exercises": [{
                    "number": "1",
                    "group": None,
                    "text": "Inspect the figure.",
                    "figures": [{"id": "fig-scroll", "label": "Scroll"}],
                }],
            })

            result = subprocess.run(
                [
                    "node",
                    str(RENDERER),
                    str(book),
                    "--out",
                    str(output),
                    "--edition",
                    "modern-us-neutral",
                    "--lesson",
                    "lesson-test",
                ],
                cwd=SKILL.parents[2],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

            text_html = (output / "lesson-test" / "text.html").read_text()
            exercises_html = (
                output / "lesson-test" / "exercises.html"
            ).read_text()
            self.assertIn('data-figure-layout="inline"', text_html)
            self.assertIn('data-figure-purpose="instructional"', text_html)
            self.assertIn('style="width:360px;max-width:100%"', text_html)
            self.assertIn('data-figure-layout="scroll"', exercises_html)
            self.assertIn('data-figure-mode="deterministic"', exercises_html)
            self.assertIn('width:40em;max-width:none', exercises_html)
            self.assertNotIn(
                ".fig svg{max-width:min(100%,26em)",
                exercises_html,
            )
            self.assertNotIn(
                "li.ex .body .fig svg,li.ex .body img{max-width:min(100%,18em)",
                exercises_html,
            )


if __name__ == "__main__":
    unittest.main()
