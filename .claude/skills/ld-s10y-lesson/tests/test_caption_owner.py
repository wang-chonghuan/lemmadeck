import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import claim_figures


class WrappedCaptionOwnership(unittest.TestCase):
    def fixture(self, *, second_ref=False, caption_page=44, referenced=True):
        label = "\u56fe 21"
        paragraph = {"kind": "p", "lines": [f"See {label}" if referenced else "No reference"], "ref": "p0044#1"}
        figure = {"kind": "fig", "id": "fig-21", "label": label, "lines": [], "page": 44, "ref": "p0044#2"}
        other = {"kind": "p", "lines": [f"See {label}" if second_ref else "Other lesson"], "ref": "p0044#3"}
        caption = {"kind": "cap", "label": label, "lines": [label], "page": caption_page, "ref": "p0044#4"}
        lessons = [
            {"blocks": [paragraph, figure], "prose": [paragraph, figure], "exercises": []},
            {"blocks": [other, caption], "prose": [other, caption], "exercises": []},
        ]
        stream = [paragraph, figure, other, caption]
        errors, _ = claim_figures(lessons, stream)
        self.assertEqual(errors, [])
        self.assertCountEqual(
            [item["ref"] for lesson in lessons for item in lesson["blocks"]],
            [item["ref"] for item in stream],
        )
        return lessons, caption

    def test_same_page_caption_follows_unique_prose_figure(self):
        lessons, caption = self.fixture()
        for key in ("blocks", "prose"):
            self.assertIs(lessons[0][key][-1], caption)
            self.assertNotIn(caption, lessons[1][key])

    def test_shared_prose_reference_keeps_printed_caption(self):
        lessons, caption = self.fixture(second_ref=True)
        self.assertIn(caption, lessons[1]["prose"])

    def test_different_page_does_not_guess_attachment(self):
        lessons, caption = self.fixture(caption_page=45)
        self.assertIn(caption, lessons[1]["prose"])

    def test_unreferenced_figure_keeps_printed_caption(self):
        lessons, caption = self.fixture(referenced=False)
        self.assertIn(caption, lessons[1]["prose"])


if __name__ == "__main__":
    unittest.main()
