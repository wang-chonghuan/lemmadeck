from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
REPO = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(TOOLS))

import assemble


class TocBindingTest(unittest.TestCase):
    def test_six_algebra_exercise_cards_receive_formal_ids(self) -> None:
        toc = REPO / "ssot-resources/soviet10year-textbooks/toc/6a/zh.json"
        expected = {
            32: "alg6-c1-ex",
            95: "alg6-c2-ex",
            143: "alg6-c3-ex",
            183: "alg6-c4-ex",
            249: "alg6-c5-ex",
            267: "alg6-hard",
        }
        cards = assemble._toc_cards(json.loads(toc.read_text(encoding="utf-8")))
        lessons = [
            {
                "number": (
                    str(card["printedNumber"])
                    if card.get("printedNumber") is not None
                    else None
                ),
                "title": card["title"],
                "start_printed": card["page"],
            }
            for card in cards
        ]

        warnings = assemble.check_toc(lessons, toc, "6a")

        self.assertEqual(warnings, [])
        self.assertEqual(
            {
                lesson["start_printed"]: lesson["card_id"]
                for lesson in lessons
                if lesson["number"] is None
            },
            expected,
        )
        self.assertTrue(all(lesson["toc_title"] for lesson in lessons))

    def test_numbered_topic_still_requires_number_and_page(self) -> None:
        toc = REPO / "ssot-resources/soviet10year-textbooks/toc/6a/zh.json"
        lessons = [
            {"number": "1", "title": "数式", "start_printed": 1},
            {"number": "2", "title": "含有变量的式", "start_printed": 4},
        ]

        warnings = assemble.check_toc(lessons, toc, "6a")

        self.assertEqual(warnings, [])
        self.assertEqual(
            [lesson["card_id"] for lesson in lessons],
            ["alg6-c1-s1-n1", "alg6-c1-s1-n2"],
        )

    def test_toc_coverage_ignores_unextracted_page_ranges(self) -> None:
        toc = REPO / "ssot-resources/soviet10year-textbooks/toc/6a/zh.json"
        lessons = [
            {"number": "1", "title": "数式", "start_printed": 1},
            {"number": "30", "title": "自然数指数幂", "start_printed": 152},
        ]

        warnings = assemble.check_toc(
            lessons,
            toc,
            "6a",
            extracted_printed_pages={1, 152},
        )

        self.assertEqual(warnings, [])
        self.assertEqual(
            [lesson["card_id"] for lesson in lessons],
            ["alg6-c1-s1-n1", "alg6-c4-s1-n30"],
        )


if __name__ == "__main__":
    unittest.main()
