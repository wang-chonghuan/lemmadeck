import json
import subprocess
import tempfile
import unittest
from pathlib import Path


SKILL = Path(__file__).resolve().parents[1]
FIXTURE = SKILL / "tests" / "fixtures" / "number-line.json"
RENDERER = SKILL / "scripts" / "render_spec.mjs"
REVIEWER = SKILL / "scripts" / "record_review.py"
REPO = SKILL.parents[2]


class ReviewEvidenceTests(unittest.TestCase):
    def test_spec_change_invalidates_render_review_input(self):
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            spec = json.loads(FIXTURE.read_text(encoding="utf-8"))
            spec_path = directory / "figure.spec.json"
            svg_path = directory / "figure.svg"
            report_path = directory / "figure.render.json"
            review_path = directory / "figure.review.json"
            spec_path.write_text(json.dumps(spec), encoding="utf-8")

            rendered = subprocess.run(
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
            self.assertEqual(rendered.returncode, 0, rendered.stdout + rendered.stderr)

            spec["description"] = "Changed after rendering."
            spec_path.write_text(json.dumps(spec), encoding="utf-8")
            reviewed = subprocess.run(
                [
                    "python3",
                    str(REVIEWER),
                    "--spec",
                    str(spec_path),
                    "--render",
                    str(report_path),
                    "--output",
                    str(review_path),
                    "--status",
                    "pass",
                    "--notes",
                    "Reviewed.",
                ],
                cwd=REPO,
                capture_output=True,
                text=True,
            )

            self.assertNotEqual(reviewed.returncode, 0)
            self.assertIn("stale FigureSpec", reviewed.stdout + reviewed.stderr)
            self.assertFalse(review_path.exists())


if __name__ == "__main__":
    unittest.main()
