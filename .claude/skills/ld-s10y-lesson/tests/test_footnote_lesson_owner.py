import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import cut_lessons, merge_across_pages


def block(kind, text, ref, label=None, spans=None):
    value = {
        "kind": kind, "lines": [text], "ref": ref, "page": 17,
        "printed_page": 8, "label": label,
    }
    if spans:
        value["spans"] = spans
    return value


class FootnoteLessonOwner(unittest.TestCase):
    def test_note_after_next_heading_belongs_to_its_callout(self):
        stream = [
            block("h3", "4. 分子运动论的基本内容", "p0016#8"),
            block("p", "分子、原子①都在运动。", "p0017#2"),
            block("h3", "5. 分子存在的证明", "p0017#3"),
            block("p", "观察原子。", "p0017#4"),
            block("p", "① 原子与分子的说明。", "p0017#6", "footnote"),
        ]
        lessons = cut_lessons(merge_across_pages(stream)[0])
        self.assertEqual([b["ref"] for b in lessons[0]["blocks"]], ["p0017#2", "p0017#6"])
        self.assertEqual([b["ref"] for b in lessons[1]["blocks"]], ["p0017#4"])

    def test_cross_page_callout_uses_source_spans(self):
        start = block("p", "前页开始，", "p0015#11")
        start.update(page=15, open=True)
        continuation = block("p", "本页继续①。", "p0017#1")
        continuation["cont"] = True
        stream = [
            block("h3", "2. 振动条件", "p0015#10"),
            start, continuation,
            block("p", "① 本页的注释。", "p0017#6", "footnote"),
        ]
        self.assertEqual(len(cut_lessons(merge_across_pages(stream)[0])[0]["blocks"]), 2)

    def test_missing_or_ambiguous_callout_is_not_guessed(self):
        for texts in [[], ["第一处①。", "第二处①。"]]:
            with self.subTest(texts=texts):
                stream = [block("h3", "4. 内容", "p0017#1")]
                stream += [block("p", text, f"p0017#{index+2}") for index, text in enumerate(texts)]
                stream += [block("p", "① 说明。", "p0017#9", "footnote")]
                with self.assertRaises(ValueError):
                    cut_lessons(merge_across_pages(stream)[0])

    def test_same_marker_on_next_page_does_not_steal_previous_note(self):
        start = block("p", "物质的量从本页开始，", "p0017#3")
        start["open"] = True
        continuation = block("p", "下一页分子数①的说明。", "p0018#1")
        continuation.update(page=18, cont=True)
        next_note = block("p", "① 下一页注释。", "p0018#2", "footnote")
        next_note["page"] = 18
        stream = [
            block("h3", "6. 物质的量", "p0017#1"),
            block("p", "本页相对质量①。", "p0017#2"),
            start,
            block("p", "① 本页注释。", "p0017#4", "footnote"),
            continuation, next_note,
        ]
        lessons = cut_lessons(merge_across_pages(stream)[0])
        self.assertEqual(
            [item["ref"] for item in lessons[0]["blocks"]],
            ["p0017#2", "p0017#4", "p0017#3", "p0018#2"],
        )
