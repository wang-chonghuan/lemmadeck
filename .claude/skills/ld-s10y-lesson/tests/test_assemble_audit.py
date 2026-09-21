from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import assemble


def exercise(number: int, page: int) -> dict:
    return {
        "number": str(number),
        "text": "",
        "pages": [f"p{page:04d}#1"],
        "figures": [],
    }


def lesson(*exercises: dict) -> dict:
    return {"title": "test", "prose": [], "exercises": list(exercises)}


def page_block(page: int) -> dict:
    return {"kind": "p", "page": page, "open": False, "lines": []}


def figure(number: int, page: int) -> dict:
    return {
        "kind": "fig",
        "page": page,
        "label": f"图 {number}",
        "open": False,
        "lines": [],
    }


class IncrementalAuditTest(unittest.TestCase):
    @patch.object(assemble.mathcheck, "collect_and_check", return_value=([], []))
    def test_lesson_scoped_numbers_can_restart_and_keep_unnumbered_question(self, _) -> None:
        first = lesson(exercise(1, 1), exercise(2, 2))
        second = lesson(exercise(1, 3), exercise(2, 4))
        second["exercises"].append({
            "number": "q1",
            "source_number": None,
            "text": "",
            "pages": ["p0004#2"],
            "figures": [],
        })
        stream = [page_block(page) for page in range(1, 5)]

        report = assemble.audit(
            [first, second],
            stream,
            Path("unused.json"),
            exercise_numbering="lesson",
        )

        self.assertEqual(report["errors"], [])
        self.assertEqual(report["exercise_count"], 5)

    @patch.object(assemble.mathcheck, "collect_and_check", return_value=([], []))
    def test_lesson_scoped_numbering_still_rejects_an_in_lesson_gap(self, _) -> None:
        report = assemble.audit(
            [lesson(exercise(1, 1), exercise(3, 2))],
            [page_block(1), page_block(2)],
            Path("unused.json"),
            exercise_numbering="lesson",
        )

        self.assertIn(
            "test: 题号缺号: [2]（可能漏页或漏题）",
            report["errors"],
        )

    def test_lesson_group_numbering_preserves_first_ids_and_qualifies_collisions(self) -> None:
        prose, exercises = assemble.split_lesson(
            {
                "blocks": [
                    {"kind": "exhead", "lines": ["问题"]},
                    {"kind": "ex", "label": "1", "lines": ["问题一"], "ref": "p0029#1"},
                    {"kind": "ex", "label": "2", "lines": ["问题二"], "ref": "p0029#2"},
                    {"kind": "ex", "label": "3", "lines": ["问题三"], "ref": "p0029#3"},
                    {"kind": "exhead", "lines": ["练习"]},
                    {"kind": "ex", "label": "1", "lines": ["练习一"], "ref": "p0031#1"},
                    {"kind": "ex", "label": "2", "lines": ["练习二"], "ref": "p0031#2"},
                    {"kind": "exhead", "lines": ["作业"]},
                    {"kind": "ex", "label": None, "lines": ["作业题"], "ref": "p0031#3"},
                ],
            },
            "lesson-group",
        )

        self.assertEqual(prose, [])
        self.assertEqual(
            [
                (item["number"], item["source_number"], item["group"], item["group_id"])
                for item in exercises
            ],
            [
                ("1", "1", "问题", "g1"),
                ("2", "2", "问题", "g1"),
                ("3", "3", "问题", "g1"),
                ("g2-1", "1", "练习", "g2"),
                ("g2-2", "2", "练习", "g2"),
                ("q1", None, "作业", "g3"),
            ],
        )

    @patch.object(assemble.mathcheck, "collect_and_check", return_value=([], []))
    def test_lesson_group_numbering_rejects_duplicates_and_gaps_inside_a_group(self, _) -> None:
        first = {
            **exercise(1, 1),
            "source_number": "1",
            "group": "问题",
            "group_id": "g1",
        }
        duplicate = {
            **exercise(1, 1),
            "source_number": "1",
            "group": "问题",
            "group_id": "g1",
        }
        gap = {
            **exercise(3, 1),
            "source_number": "3",
            "group": "问题",
            "group_id": "g1",
        }
        report = assemble.audit(
            [lesson(first, duplicate, gap)],
            [page_block(1)],
            Path("unused.json"),
            exercise_numbering="lesson-group",
        )

        self.assertTrue(any("内部题目标识重复" in error for error in report["errors"]))
        self.assertTrue(any("题号重复: [1]" in error for error in report["errors"]))
        self.assertTrue(any("题号缺号: [2]" in error for error in report["errors"]))

    def test_unnumbered_exercise_gets_stable_identity_without_source_number(self) -> None:
        prose, exercises = assemble.split_lesson({
            "blocks": [
                {
                    "kind": "ex",
                    "label": None,
                    "lines": ["为什么？"],
                    "ref": "p0022#1",
                }
            ]
        })

        self.assertEqual(prose, [])
        self.assertEqual(exercises[0]["number"], "q1")
        self.assertIsNone(exercises[0]["source_number"])
        self.assertEqual(exercises[0]["group_id"], "g0")

    @patch.object(assemble.mathcheck, "collect_and_check", return_value=([], []))
    def test_gaps_between_extracted_page_ranges_are_allowed(self, _) -> None:
        lessons = [
            lesson(exercise(1, 1), exercise(2, 2)),
            lesson(exercise(10, 10), exercise(11, 11)),
        ]
        stream = [
            page_block(1),
            figure(1, 1),
            page_block(2),
            figure(2, 2),
            page_block(10),
            figure(10, 10),
            page_block(11),
            figure(11, 11),
        ]

        report = assemble.audit(lessons, stream, Path("unused.json"))

        self.assertEqual(report["errors"], [])

    @patch.object(assemble.mathcheck, "collect_and_check", return_value=([], []))
    def test_gaps_inside_an_extracted_page_range_still_fail(self, _) -> None:
        lessons = [lesson(exercise(1, 1), exercise(3, 2))]
        stream = [page_block(1), figure(1, 1), page_block(2), figure(3, 2)]

        report = assemble.audit(lessons, stream, Path("unused.json"))

        self.assertIn(
            "题号缺号（页段 1-2）: [2]（可能漏页或漏题）",
            report["errors"],
        )
        self.assertIn(
            "图号缺号（页段 1-2）: [2]（可能漏裁）",
            report["errors"],
        )


if __name__ == "__main__":
    unittest.main()
