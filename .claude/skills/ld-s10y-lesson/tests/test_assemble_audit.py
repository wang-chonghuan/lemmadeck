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
