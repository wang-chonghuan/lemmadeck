from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
REPO = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(TOOLS))

import assemble


class TocBindingTest(unittest.TestCase):
    def test_leaf_physics_sections_receive_formal_ids(self) -> None:
        toc = REPO / "ssot-resources/soviet10year-textbooks/toc/6p/zh.json"
        lessons = [
            {"number": str(number), "title": title, "start_printed": page}
            for number, title, page in (
                (1, "自然界和人", 1),
                (2, "物理学是研究什么的", 2),
                (3, "物体、物质和实物", 4),
                (4, "观察和实验", 5),
                (5, "物理量　物理量的测量", 7),
                (6, "物理学与技术", 8),
            )
        ]

        warnings = assemble.check_toc(
            lessons,
            toc,
            "6p",
            extracted_printed_pages=set(range(1, 12)),
        )

        self.assertEqual(warnings, [])
        self.assertEqual(
            [lesson["card_id"] for lesson in lessons],
            [f"phy6-c1-s{index}" for index in range(1, 7)],
        )

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

    def test_promote_figures_keeps_library_when_work_is_deleted(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            book = root / "artifacts" / "6a"
            work = root / ".tmp" / "ld-s10y-lesson" / "6a"
            page_figures = work / "pages" / "0010" / "figures"
            page_figures.mkdir(parents=True)
            (page_figures / "fig-01.png").write_bytes(b"png")
            (page_figures / "fig-01.svg").write_text("<svg/>", encoding="utf-8")
            durable = book / "figures"
            durable.mkdir(parents=True)
            (durable / "fig-existing.svg").write_text("<svg/>", encoding="utf-8")

            warnings = []
            assemble.promote_figures(book, work, warnings)

            self.assertEqual(warnings, [])
            self.assertEqual((durable / "fig-01.png").read_bytes(), b"png")
            self.assertEqual((durable / "fig-01.svg").read_text(), "<svg/>")

            for path in sorted(work.rglob("*"), reverse=True):
                path.unlink() if path.is_file() else path.rmdir()
            work.rmdir()
            assemble.promote_figures(book, work, warnings)

            self.assertTrue((durable / "fig-01.png").is_file())
            self.assertTrue((durable / "fig-existing.svg").is_file())


if __name__ == "__main__":
    unittest.main()
