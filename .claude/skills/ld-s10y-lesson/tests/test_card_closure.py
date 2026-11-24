"""STEMROBIN-192: 末页没被下一张卡片收口时必须报出来。"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import assemble


TOC = {
    "book": "3m",
    "contents": [
        {
            "id": "c1", "kind": "chapter", "page": 6, "title": "计数法",
            "lessons": [
                {"id": "c1-s4", "kind": "section", "page": 38, "title": "时间单位"},
                {"id": "c1-ex5", "kind": "exercises", "page": 40, "title": "巩固练习"},
            ],
        },
        {"id": "c2", "kind": "chapter", "page": 43, "title": "加法和减法",
         "lessons": [
             {"id": "c2-ex1", "kind": "exercises", "page": 64, "title": "巩固练习"},
         ]},
    ],
}


class CardClosureTest(unittest.TestCase):
    def check(self, extracted: set[int], lessons: list[dict]) -> list[dict]:
        with tempfile.TemporaryDirectory() as temp:
            toc_path = Path(temp) / "zh.json"
            toc_path.write_text(json.dumps(TOC), encoding="utf-8")
            return assemble.check_card_closure(lessons, toc_path, extracted)

    def test_an_unclosed_last_page_is_reported(self) -> None:
        # 印刷页 40 转写了，43（下一张卡的首页）没有：无从判断 40–42 是否吃完
        open_cards = self.check({38, 39, 40}, [{"card_id": "c1-ex5", "title": "巩固练习"}])
        self.assertEqual([card["card_id"] for card in open_cards], ["c1-ex5"])
        self.assertEqual(open_cards[0]["next_card"], "c2")
        self.assertEqual(open_cards[0]["next_printed"], 43)
        self.assertIn("可能没收完", open_cards[0]["message"])

    def test_closing_page_present_closes_the_card(self) -> None:
        open_cards = self.check(
            {38, 39, 40, 41, 42, 43},
            [{"card_id": "c1-ex5", "title": "巩固练习"}],
        )
        self.assertEqual(open_cards, [])

    def test_the_boundary_is_the_next_toc_entry_not_the_next_card(self) -> None:
        """c1-ex5 之后是章头 c2（印刷页 43），不是 c2 的第一张卡（64）。"""
        open_cards = self.check({40}, [{"card_id": "c1-ex5", "title": "巩固练习"}])
        self.assertEqual(open_cards[0]["next_printed"], 43)

    def test_a_closed_card_is_not_reported(self) -> None:
        open_cards = self.check(
            {38, 39, 40},
            [{"card_id": "c1-s4", "title": "时间单位"}],
        )
        self.assertEqual(open_cards, [])


if __name__ == "__main__":
    unittest.main()
