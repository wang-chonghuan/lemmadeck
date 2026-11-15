import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble
import blocks


class PlateLessonOwnerTests(unittest.TestCase):
    def figure(self, owner="phy6-c2-s2"):
        return {
            "kind": "fig", "id": "tbl-p0005-01", "label": "彩图 I 上图",
            "owner_lesson": owner, "page": 5, "printed_page": None,
            "ref": "p0005#1", "lines": [],
        }

    def lesson(self, identity="phy6-c2-s2"):
        return {
            "card_id": identity, "blocks": [], "prose": [],
            "exercises": [], "figures": [],
        }

    def test_parse_dump_preserves_owner_without_polluting_label(self):
        meta, stream = blocks.parse(
            '---\n{"page":5}\n---\n'
            '<!-- fig 彩图 I 上图 box 1,2,3,4 owner-lesson phy6-c2-s2 -->\n'
        )
        self.assertEqual(stream[0]["label"], "彩图 I 上图")
        self.assertEqual(stream[0]["owner_lesson"], "phy6-c2-s2")
        self.assertEqual(blocks.parse(blocks.dump(meta, stream, 5))[1], stream)

    def test_front_plate_does_not_create_spurious_lesson(self):
        stream = [
            self.figure(),
            {"kind": "h3", "lines": ["8. 物质结构"], "page": 25, "printed_page": 14},
            {"kind": "p", "lines": ["正文"], "page": 25, "ref": "p0025#2"},
        ]
        lessons = assemble.cut_lessons(stream)
        self.assertEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["start_page"], 25)
        self.assertEqual(lessons[0]["blocks"][0]["kind"], "p")

    def test_explicit_binding_is_once_and_at_prose_end(self):
        lesson = self.lesson()
        lesson["prose"].append({"kind": "p", "lines": ["正文"]})
        errors, _ = assemble.claim_figures([lesson], [self.figure()])
        self.assertEqual(errors, [])
        self.assertEqual(lesson["prose"][-1]["id"], "tbl-p0005-01")
        self.assertEqual(lesson["figures"], [
            {"id": "tbl-p0005-01", "label": "彩图 I 上图", "page": 5},
        ])

    def test_missing_or_duplicate_lesson_fails(self):
        for lessons in ([], [self.lesson(), self.lesson()]):
            errors, _ = assemble.claim_figures(lessons, [self.figure()])
            self.assertTrue(errors)

    def test_duplicate_figure_fails(self):
        lesson = self.lesson()
        errors, _ = assemble.claim_figures([lesson], [self.figure(), self.figure()])
        self.assertTrue(errors)

    def test_exercise_and_lesson_ownership_cannot_mix(self):
        figure = {**self.figure(), "owner_exercise": "1"}
        errors, _ = assemble.claim_figures([self.lesson()], [figure])
        self.assertTrue(errors)


if __name__ == "__main__":
    unittest.main()
