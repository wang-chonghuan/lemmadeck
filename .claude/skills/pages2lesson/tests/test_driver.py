"""pages2lesson 驱动自己的防线。

这些判据保护的是**生产会话不要花回合调驱动**：页码范围推错、把别的课的既有失败
当成本次失败、渲染失败报不出试过什么，三者任一出错都会把一课的成本打回原样。
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import p2l


def args(**overrides) -> Namespace:
    base = {
        "book": "3m", "lesson": None, "pages": None,
        "edition": "modern-us-neutral", "json": False,
        "force_prepare": False, "accept_figure": None,
        "review_note": "t", "no_publish": False, "edition_ready": False,
    }
    return Namespace(**{**base, **overrides})


class PageRangeTest(unittest.TestCase):
    def test_pages_forms(self) -> None:
        self.assertEqual(p2l._parse_pages("44"), [44])
        self.assertEqual(p2l._parse_pages("44-47"), [44, 45, 46, 47])
        self.assertEqual(p2l._parse_pages(" 44 - 46 "), [44, 45, 46])
        with self.assertRaises(SystemExit):
            p2l._parse_pages("44..47")
        with self.assertRaises(SystemExit):
            p2l._parse_pages("47-44")


class ResolveTest(unittest.TestCase):
    """用仓库里真实的 3m TOC：这本书正是「边界落在印刷页中间」的现场。"""

    def test_lesson_derives_a_range_that_includes_the_closing_page(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        plan = p2l.resolve(args(lesson="math3-c1-ex5"), report)
        self.assertEqual(report.stops, [])
        self.assertEqual(report.failures, [])
        self.assertEqual(plan["card"], "math3-c1-ex5")
        self.assertEqual(plan["next_card"], "math3-c2")
        self.assertEqual(plan["next_printed_page"], 43)
        # 卡片起于印刷页 40、下一张起于 43 —— 43 必须在范围内，否则无从判断收完没有
        self.assertEqual(plan["printed_pages"], [40, 41, 42, 43])
        self.assertEqual(plan["pdf_pages"], [44, 45, 46, 47])

    def test_pages_alone_derives_the_card(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        plan = p2l.resolve(args(pages="44-47"), report)
        self.assertEqual(report.stops, [])
        self.assertEqual(plan["card"], "math3-c1-ex5")

    def test_the_two_arguments_cross_check(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        plan = p2l.resolve(args(lesson="math3-c1-ex5", pages="50-52"), report)
        self.assertIsNone(plan)
        self.assertTrue(
            any("两个参数对不上" in stop for stop in report.stops), report.stops,
        )

    def test_a_range_that_drops_the_closing_page_is_a_failure(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        p2l.resolve(args(lesson="math3-c1-ex5", pages="44-46"), report)
        self.assertTrue(
            any("没有包含收口页" in failure for failure in report.failures),
            report.failures,
        )

    def test_an_unknown_card_stops(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        self.assertIsNone(p2l.resolve(args(lesson="math3-c9-s9"), report))
        self.assertTrue(report.stops)


class AssembleVerdictTest(unittest.TestCase):
    """对账按本次交付的那张卡作用域——否则 3m 的既有红让这条路径永远过不去。"""

    def verdict(self, audit: dict, card: str = "math3-c1-ex5") -> p2l.Report:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        with tempfile.TemporaryDirectory() as temp:
            book_dir = Path(temp)
            (book_dir / "book.json").write_text(
                json.dumps({"audit": audit}), encoding="utf-8",
            )
            p2l._assemble_verdict(book_dir, {"card": card, "title": "巩固练习"}, report)
        return report

    def test_another_cards_pre_existing_error_does_not_fail_this_delivery(self) -> None:
        report = self.verdict({
            "errors": ["（承上页）/未命名栏目(g0): 题号缺号: [17, 24, 25]（可能漏页或漏题）"],
        }, card="math3-c1-s4")
        self.assertEqual(report.failures, [])
        self.assertTrue(
            any("既有失败" in item["step"] for item in report.steps), report.steps,
        )

    def test_an_error_naming_this_card_fails(self) -> None:
        report = self.verdict({"errors": ["math3-c1-ex5: 题号重复: [3]"]})
        self.assertEqual(len(report.failures), 1)
        self.assertIn("math3-c1-ex5", report.failures[0])

    def test_an_unclosed_card_fails_this_delivery(self) -> None:
        report = self.verdict({
            "errors": [],
            "unclosed_cards": [
                {"card_id": "math3-c1-ex5", "message": "可能没收完：下一张卡片 math3-c2 …"},
            ],
        })
        self.assertEqual(len(report.failures), 1)
        self.assertIn("小节边界", report.failures[0])

    def test_another_cards_unclosed_warning_is_ignored(self) -> None:
        report = self.verdict({
            "errors": [],
            "unclosed_cards": [{"card_id": "math3-c2", "message": "可能没收完"}],
        })
        self.assertEqual(report.failures, [])

    def test_a_missing_book_json_is_a_failure(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        with tempfile.TemporaryDirectory() as temp:
            p2l._assemble_verdict(Path(temp), {"card": "x", "title": ""}, report)
        self.assertTrue(report.failures)


class RenderFailureReportTest(unittest.TestCase):
    """渲染失败必须报出它试过哪些布局，而不是一句「碰撞」。"""

    def failures(self, payload: dict) -> list[str]:
        class Result:
            returncode = 2
            stderr = json.dumps(payload)
            stdout = ""
        with tempfile.TemporaryDirectory() as temp:
            return p2l._render_failures("fig-01", Result(), Path(temp) / "absent.json")

    def test_a_collision_names_the_ladder(self) -> None:
        failures = self.failures({
            "collisions": [{
                "id": "a-label", "text": "A", "position": "NE", "gapScale": 3,
                "score": 10000,
                "tried": [{"position": "NE", "gapScale": 1, "score": 10000}],
            }],
            "layout": {"attempts": [
                {"margin": 0, "collisions": 1, "display": "pass"},
                {"margin": 96, "collisions": 1, "display": "fail"},
            ]},
            "displayChecks": [], "imageFits": [], "layoutErrors": [],
        })
        self.assertEqual(len(failures), 1)
        self.assertIn("NE×1=10000", failures[0])
        self.assertIn("margin 0(碰撞1/显示pass)", failures[0])
        self.assertIn("margin 96(碰撞1/显示fail)", failures[0])

    def test_a_display_failure_reports_the_measured_size(self) -> None:
        failures = self.failures({
            "collisions": [], "layout": {"attempts": []}, "layoutErrors": [],
            "displayChecks": [{
                "width": 331, "minTextPx": 16, "measuredMinPx": 9.4,
                "status": "fail", "failures": [{"text": "12"}],
            }],
            "imageFits": [],
        })
        self.assertEqual(len(failures), 1)
        self.assertIn("331px", failures[0])
        self.assertIn("9.4px", failures[0])

    def test_an_unsupported_placement_is_surfaced(self) -> None:
        failures = self.failures({
            "collisions": [], "layout": {"attempts": []},
            "layoutErrors": ["Unsupported label placement: NNE"],
            "displayChecks": [], "imageFits": [],
        })
        self.assertTrue(any("NNE" in failure for failure in failures), failures)

    def test_a_non_json_crash_still_reports_something(self) -> None:
        class Result:
            returncode = 1
            stderr = "ERROR: node blew up"
            stdout = ""
        with tempfile.TemporaryDirectory() as temp:
            failures = p2l._render_failures(
                "fig-01", Result(), Path(temp) / "absent.json",
            )
        self.assertEqual(len(failures), 1)
        self.assertIn("node blew up", failures[0])


class ReportTest(unittest.TestCase):
    def test_exit_codes(self) -> None:
        self.assertEqual(p2l.Report(book="b", edition="e").exit_code(), 0)
        self.assertEqual(
            p2l.Report(book="b", edition="e", gate="G1").exit_code(), 3,
        )
        self.assertEqual(
            p2l.Report(book="b", edition="e", failures=["x"]).exit_code(), 1,
        )
        self.assertEqual(
            p2l.Report(book="b", edition="e", stops=["x"], failures=["y"]).exit_code(),
            2,
            "硬停优先于失败：需要人决定的事不能被一堆失败盖住",
        )


if __name__ == "__main__":
    unittest.main()
