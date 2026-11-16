import copy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


def block(kind, ref, text="", **fields):
    return {"kind": kind, "ref": ref, "page": 25, "lines": [text], **fields}


def fixture():
    figure = block("fig", "p0025#4", id="fig-17", label="图 17")
    caption = block("cap", "p0025#5", "图 17", label="图 17")
    earlier = block("p", "p0024#1", "Skew lines.")
    later = block("p", "p0025#9", "Construction (图 17).")
    lessons = [
        {"blocks": [earlier, figure, caption], "prose": [earlier, figure, caption],
         "exercises": [], "start_page": 24},
        {"blocks": [later], "prose": [later], "exercises": [], "start_page": 25},
    ]
    return lessons, [earlier, figure, caption, later]


class NextLessonFigureTests(unittest.TestCase):
    def test_unique_next_lesson_body_owner_preserves_source_refs(self):
        lessons, stream = fixture()
        before = copy.deepcopy(stream)
        errors, warnings = assemble.claim_figures(lessons, stream)
        self.assertEqual((errors, warnings), ([], []))
        self.assertEqual([b["ref"] for b in lessons[0]["prose"]], ["p0024#1"])
        self.assertEqual([b["ref"] for b in lessons[1]["prose"]],
                         ["p0025#9", "p0025#4", "p0025#5"])
        self.assertEqual(lessons[0]["figures"], [])
        self.assertEqual(lessons[1]["figures"],
                         [{"id": "fig-17", "label": "图 17", "page": 25}])
        self.assertEqual(stream, before)

    def test_existing_body_reference_keeps_its_figure(self):
        lessons, stream = fixture()
        lessons[0]["prose"][0]["lines"] = ["Earlier reference 图 17."]
        assemble.claim_figures(lessons, stream)
        self.assertEqual(len(lessons[0]["figures"]), 1)
        self.assertEqual(lessons[1]["figures"], [])

    def test_existing_exercise_reference_is_not_rehomed(self):
        lessons, stream = fixture()
        lessons[0]["exercises"] = [{
            "number": "43", "text": "Exercise 图 17.", "figure_refs": [],
            "figures": [], "pages": ["p0025#2"],
        }]
        assemble.claim_figures(lessons, stream)
        self.assertEqual(len(lessons[0]["figures"]), 1)
        self.assertEqual(lessons[1]["figures"], [])
        self.assertEqual(lessons[0]["exercises"][0]["figure_refs"], ["fig-17"])

    def test_unrelated_page_is_not_rehomed(self):
        lessons, stream = fixture()
        lessons[1]["start_page"] = 26
        assemble.claim_figures(lessons, stream)
        self.assertEqual(len(lessons[0]["figures"]), 1)
        self.assertEqual(lessons[1]["figures"], [])

    def test_multiple_body_owners_are_not_guessed(self):
        lessons, stream = fixture()
        extra = block("p", "p0026#3", "Another reference 图 17.")
        lessons.append({"blocks": [extra], "prose": [extra], "exercises": [],
                        "start_page": 26})
        stream.append(extra)
        assemble.claim_figures(lessons, stream)
        self.assertEqual(len(lessons[0]["figures"]), 1)
        self.assertEqual(lessons[1]["figures"], [])


if __name__ == "__main__":
    unittest.main()
