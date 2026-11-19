import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


def block(kind, text, ref, label=None, **fields):
    return {
        "kind": kind,
        "lines": [text],
        "ref": ref,
        "page": int(ref[1:5]),
        "printed_page": int(ref[1:5]) - 10,
        "label": label,
        **fields,
    }


class HeadingFootnoteOwnershipTests(unittest.TestCase):
    def cut(self, blocks):
        merged, _ = assemble.merge_across_pages(blocks)
        return assemble.cut_lessons(merged)

    def test_heading_note_belongs_to_new_card(self):
        heading = block("h3", "94. Postulates\u2460", "p0251#5")
        prose = block("p", "An unfinished introduction", "p0251#6", open=True)
        note = block("p", "\u2460 A postulate is a basic proposition.", "p0251#7", label="footnote")
        lessons = self.cut([
            block("h3", "93. Experiment", "p0248#1"),
            block("p", "The earlier card ends here.", "p0251#4"),
            heading, prose, note,
        ])
        self.assertEqual(len(lessons), 2)
        self.assertEqual([b["ref"] for b in lessons[0]["blocks"]], ["p0251#4"])
        self.assertEqual([b["ref"] for b in lessons[1]["blocks"]], ["p0251#7", "p0251#6"])
        self.assertEqual(lessons[1]["printed_title"], "94. Postulates\u2460")
        self.assertTrue(lessons[1]["blocks"][1]["open"])
        self.assertEqual(lessons[1]["blocks"][0]["lines"], note["lines"])

    def test_body_note_still_follows_its_body(self):
        lessons = self.cut([
            block("h3", "94. Postulates", "p0251#5"),
            block("p", "A statement\u2460", "p0251#6"),
            block("p", "Following paragraph.", "p0251#7"),
            block("p", "\u2460 Note.", "p0251#8", label="footnote"),
        ])
        self.assertEqual([b["ref"] for b in lessons[0]["blocks"]], ["p0251#6", "p0251#8", "p0251#7"])

    def test_heading_and_body_same_page_marker_is_ambiguous(self):
        with self.assertRaisesRegex(ValueError, "2"):
            self.cut([
                block("h3", "94. Postulates\u2460", "p0251#5"),
                block("p", "A statement\u2460", "p0251#6"),
                block("p", "\u2460 Note.", "p0251#7", label="footnote"),
            ])

    def test_other_page_heading_does_not_claim_note(self):
        with self.assertRaisesRegex(ValueError, "0"):
            self.cut([
                block("h3", "94. Postulates\u2460", "p0250#5"),
                block("p", "A statement.", "p0251#6"),
                block("p", "\u2460 Note.", "p0251#7", label="footnote"),
            ])


if __name__ == "__main__":
    unittest.main()
