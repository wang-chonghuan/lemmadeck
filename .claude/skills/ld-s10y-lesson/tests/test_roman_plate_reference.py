import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class RomanPlateReferenceTest(unittest.TestCase):
    def test_reference_tokens(self):
        self.assertEqual(
            assemble.FIGREF.findall("图IV中AB、图 III和图$81$，图 6.2"),
            ["IV", "III", "81", "6"],
        )
        self.assertEqual(assemble.FIGREF.findall("图IMAGE"), [])

    def test_remote_plate_is_bound_once(self):
        figure = {
            "kind": "fig", "id": "tbl-p0322-03", "label": "图 IV",
            "page": 322, "ref": "322:3", "lines": [],
        }
        exercises = [
            {
                "number": number, "source_number": number,
                "text": "图IV中哪些线是线段？", "pages": ["63:1"],
                "figure_refs": [], "figures": [],
            }
            for number in ("253", "254")
        ]
        lesson = {"blocks": [], "prose": [], "exercises": exercises}
        errors, warnings = assemble.claim_figures([lesson], [figure])
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])
        self.assertEqual(
            lesson["figures"],
            [{"id": "tbl-p0322-03", "label": "图 IV", "page": 322}],
        )
        for exercise in exercises:
            self.assertEqual(exercise["figure_refs"], ["tbl-p0322-03"])
        self.assertEqual(sum(len(e["figures"]) for e in exercises), 1)


if __name__ == "__main__":
    unittest.main()
