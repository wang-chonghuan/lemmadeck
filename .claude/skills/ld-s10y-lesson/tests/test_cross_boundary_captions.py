import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class CrossBoundaryCaptionTests(unittest.TestCase):
    def claim(self, next_prose):
        figure = {
            "kind": "fig", "id": "fig-27", "label": "图 27",
            "lines": [], "ref": "p0028#3", "page": 28,
        }
        previous = {
            "blocks": [figure], "prose": [figure],
            "exercises": [{
                "number": "81", "text": "81. 利用图27列方程。",
                "pages": ["p0028#2"], "figure_refs": [], "figures": [],
            }],
        }
        following = {"blocks": [], "prose": next_prose, "exercises": []}
        errors, _ = assemble.claim_figures([previous, following], [figure])
        self.assertEqual(errors, [])
        self.assertEqual(previous["exercises"][0]["figure_refs"], ["fig-27"])
        return following

    def test_exercise_caption_after_next_heading_is_not_next_lesson_prose(self):
        caption = {"kind": "cap", "label": "图 27", "lines": ["图 27"]}
        text = {"kind": "p", "lines": ["点O把直线分成两部分。"]}
        following = self.claim([text, caption])
        self.assertEqual(following["prose"], [text])

    def test_caption_remains_when_next_lesson_really_references_figure(self):
        caption = {"kind": "cap", "label": "图 27", "lines": ["图 27"]}
        text = {"kind": "p", "lines": ["比较图27中的线段。"]}
        following = self.claim([text, caption])
        self.assertEqual(following["prose"], [text, caption])

    def test_local_prose_figure_keeps_caption_despite_remote_exercise_reference(self):
        figure = {
            "kind": "fig", "id": "fig-27", "label": "图 27",
            "lines": [], "ref": "p0028#7", "page": 28,
        }
        caption = {"kind": "cap", "label": "图 27", "lines": ["图 27"]}
        previous = {
            "blocks": [], "prose": [],
            "exercises": [{
                "number": "81", "text": "81. 利用图27列方程。",
                "pages": ["p0028#2"], "figure_refs": [], "figures": [],
            }],
        }
        following = {
            "blocks": [figure], "prose": [figure, caption], "exercises": [],
        }
        errors, _ = assemble.claim_figures([previous, following], [figure])
        self.assertEqual(errors, [])
        self.assertEqual(following["prose"], [figure, caption])


if __name__ == "__main__":
    unittest.main()
