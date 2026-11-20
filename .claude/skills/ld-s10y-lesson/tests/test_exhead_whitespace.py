from __future__ import annotations

import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import assemble


class ExheadWhitespaceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.card = {"id": "exercise-card", "title": "练习 16", "page": 314}
        self.heading = self.block("h3", "131. 电流的能量", 311)

    @staticmethod
    def block(kind: str, text: str, page: int, label: str | None = None) -> dict:
        return {
            "kind": kind, "lines": [text], "page": page + 9,
            "printed_page": page, "ref": f"p{page + 9:04d}#{text}",
            "label": label,
        }

    def test_spacing_preserves_heading_and_separates_question_numbers(self) -> None:
        for title in ["练习 16", "练　习　16", "练 习 16", "**练　习　16**"]:
            with self.subTest(title=title):
                stream = [
                    self.heading,
                    self.block("exhead", "例　题", 313),
                    self.block("ex", "例题一", 313, "1"),
                    self.block("ex", "例题二", 313, "2"),
                    self.block("exhead", title, 314),
                    self.block("ex", "习题一", 314, "1"),
                    self.block("ex", "习题二", 314, "2"),
                ]
                original = copy.deepcopy(stream)
                lessons = assemble.cut_lessons(stream, [self.card])
                self.assertEqual(len(lessons), 2)
                self.assertEqual(lessons[1]["printed_title"], title)
                self.assertEqual(lessons[1]["start_printed"], 314)
                for lesson in lessons:
                    _, questions = assemble.split_lesson(lesson, "lesson")
                    self.assertEqual([q["number"] for q in questions], ["1", "2"])
                self.assertEqual(stream, original)

    def test_wrong_page_does_not_open_a_card(self) -> None:
        lessons = assemble.cut_lessons([
            self.heading, self.block("exhead", "练　习　16", 315),
        ], [self.card])
        self.assertEqual(len(lessons), 1)

    def test_different_title_stays_a_rubric(self) -> None:
        for title in ["例　题", "练习 17"]:
            with self.subTest(title=title):
                lessons = assemble.cut_lessons([
                    self.heading, self.block("exhead", title, 314),
                ], [self.card])
                self.assertEqual(len(lessons), 1)
                self.assertEqual(lessons[0]["blocks"][0]["kind"], "exhead")

    def test_whitespace_equivalent_ambiguity_is_rejected(self) -> None:
        duplicate = {**self.card, "id": "other-card", "title": "练　习16"}
        with self.assertRaisesRegex(ValueError, "多个目录卡片"):
            assemble.cut_lessons([
                self.heading, self.block("exhead", "练　习　16", 314),
            ], [self.card, duplicate])


if __name__ == "__main__":
    unittest.main()
