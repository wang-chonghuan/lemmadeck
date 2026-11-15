"""A source figure belongs with its unique prose citation, not a nearby heading."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import claim_figures


def paragraph(text):
    return {"kind": "p", "lines": [text], "page": 27}


def lesson(blocks):
    return {"blocks": list(blocks), "prose": list(blocks), "exercises": []}


class CrossLessonProseFigureTests(unittest.TestCase):
    def setUp(self):
        self.figure = {"kind": "fig", "id": "fig-09", "label": "图 9",
                       "lines": [], "page": 27, "ref": "p0027#5"}
        self.caption = {"kind": "cap", "label": "图 9", "lines": ["图 9"],
                        "page": 27, "ref": "p0027#7"}

    def test_unique_next_unit_citation_moves_figure_and_caption(self):
        earlier = paragraph("上一单元正文。")
        later = paragraph("旋转矢量的投影如图 $9$ 所示。")
        lessons = [lesson([earlier, self.figure, self.caption]), lesson([later])]
        errors, _ = claim_figures(lessons, [earlier, self.figure, self.caption, later])
        self.assertEqual(errors, [])
        self.assertEqual(lessons[0]["prose"], [earlier])
        self.assertEqual(lessons[0]["figures"], [])
        self.assertEqual(lessons[1]["prose"], [self.figure, self.caption, later])
        self.assertEqual(lessons[1]["figures"], [{"id": "fig-09", "label": "图 9", "page": 27}])
        self.assertEqual(lessons[1]["prose"][0]["ref"], "p0027#5")

    def test_existing_prose_owner_is_not_removed(self):
        prose = paragraph("图 9说明本单元。")
        lessons = [lesson([prose, self.figure, self.caption]), lesson([paragraph("下一单元。")])]
        errors, _ = claim_figures(lessons, [prose, self.figure, self.caption])
        self.assertEqual(errors, [])
        self.assertEqual(lessons[0]["prose"], [prose, self.figure, self.caption])
        self.assertEqual(lessons[1]["figures"], [])

    def test_ambiguous_other_units_do_not_guess(self):
        lessons = [lesson([self.figure, self.caption]),
                   lesson([paragraph("参见图 9。")]), lesson([paragraph("见图 9。")])]
        errors, _ = claim_figures(lessons, [self.figure, self.caption])
        self.assertEqual(len(errors), 1)
        self.assertIn("归属不唯一", errors[0])
        self.assertIs(lessons[0]["prose"][0], self.figure)


if __name__ == "__main__":
    unittest.main()
