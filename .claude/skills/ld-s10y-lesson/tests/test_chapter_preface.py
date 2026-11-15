"""Explicit chapter introductions and instructional footnotes survive assembly."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


def block(kind, text, ref, label=None, **flags):
    return {
        "kind": kind, "lines": [text], "ref": ref, "page": 11,
        "printed_page": 1, "label": label, **flags,
    }


class ChapterProseTests(unittest.TestCase):
    def test_explicit_preface_belongs_to_next_card(self):
        source = [
            block("h1", "第一章", "p0011#1"),
            block("p", "几何课程导语。", "p0011#2", "preface"),
            block("h3", "1. 几何图形", "p0011#3"),
            block("p", "定义。", "p0011#4"),
            block("h3", "2. 基本概念", "p0011#5"),
        ]
        lessons = assemble.cut_lessons(source)
        self.assertEqual(len(lessons), 2)
        self.assertEqual([b["ref"] for b in lessons[0]["blocks"]],
                         ["p0011#2", "p0011#4"])
        self.assertEqual(lessons[1]["blocks"], [])
        self.assertEqual(lessons[0]["number"], "1")
        self.assertEqual(lessons[0]["start_printed"], 1)

    def test_note_does_not_interrupt_cross_page_prose(self):
        source = [
            block("h3", "1. 图形", "p0011#1"),
            block("p", "圆由", "p0011#2", open=True),
            block("foot", "空集也算图形。", "p0011#3", "note"),
            block("foot", "1", "p0011#4"),
            {**block("p", "这些点组成。", "p0012#1", cont=True), "page": 12},
        ]
        merged, warnings = assemble.merge_across_pages(source)
        self.assertEqual(warnings, [])
        prose = assemble.cut_lessons(merged)[0]["blocks"]
        self.assertEqual([b["lines"] for b in prose],
                         [["圆由", "这些点组成。"], ["空集也算图形。"]])
        self.assertEqual(prose[0]["spans"], ["p0011#2", "p0012#1"])
        self.assertEqual(prose[1]["kind"], "p")

    def test_unmarked_partial_prose_is_not_guessed_as_preface(self):
        lessons = assemble.cut_lessons([
            block("p", "承上页残段。", "p0011#1"),
            block("h3", "1. 下一课", "p0011#2"),
        ])
        self.assertEqual(len(lessons), 2)
        self.assertEqual(lessons[0]["title"], "（承上页）")
        self.assertEqual(lessons[1]["blocks"], [])

    def test_unbound_preface_fails(self):
        with self.assertRaisesRegex(ValueError, "preface"):
            assemble.cut_lessons([block("p", "未闭合导语。", "p0011#1", "preface")])

    def test_exercise_note_keeps_ownership_after_next_heading(self):
        source = [
            block("h3", "1. 归纳法", "p0011#1"),
            block("ex", "证明有限范围。", "p0011#2", "1"),
            block("h3", "2. 下一课", "p0011#3"),
            block("foot", "一般范围尚未解决。", "p0011#4", "note", owner_exercise="1"),
        ]
        lessons = assemble.cut_lessons(source)
        self.assertEqual(lessons[0]["blocks"][0]["lines"],
                         ["证明有限范围。", "一般范围尚未解决。"])
        self.assertEqual(lessons[0]["blocks"][0]["spans"], ["p0011#2", "p0011#4"])
        self.assertEqual(lessons[1]["blocks"], [])


if __name__ == "__main__":
    unittest.main()
