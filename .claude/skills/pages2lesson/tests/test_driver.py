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
        "force_prepare": False, "no_publish": False, "edition_ready": False,
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


class PagesEntryTest(unittest.TestCase):
    """正确的页码范围必然含收口页，所以「只覆盖一张卡」做不了判据。"""

    def test_pages_picks_the_card_the_range_starts_at(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        plan = p2l.resolve(args(pages="44-47"), report)
        self.assertEqual(report.stops, [])
        self.assertEqual(plan["card"], "math3-c1-ex5")

    def test_a_range_not_starting_at_a_card_stops(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        self.assertIsNone(p2l.resolve(args(pages="45-47"), report))
        self.assertTrue(
            any("不是任何一张卡片的首页" in stop for stop in report.stops),
            report.stops,
        )


class PollutionOwnerTest(unittest.TestCase):
    def test_owner_is_read_from_either_lessons_path(self) -> None:
        self.assertEqual(
            p2l._owner_of("ssot-resources/.../artifacts/3m/lessons/other/lesson.json"),
            "other",
        )
        self.assertEqual(
            p2l._owner_of(".../editions/modern-us-neutral/lessons/other/lesson.json"),
            "other",
        )
        self.assertIsNone(p2l._owner_of(".../artifacts/3m/book.json"))
        self.assertIsNone(
            p2l._owner_of(".../artifacts/3m/lessons/"),
            "目录本身没有归属——这正是 -uall 要解决的那个漏网情况",
        )


class AssembleVerdictTest(unittest.TestCase):
    """对账按本次交付的那张卡作用域——否则 3m 的既有红让这条路径永远过不去。"""

    def verdict(
        self, audit: dict, card: str = "math3-c1-ex5",
        lessons: list[dict] | None = None, completed: bool = True,
        printed_pages: list[int] | None = None,
    ) -> p2l.Report:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        with tempfile.TemporaryDirectory() as temp:
            book_dir = Path(temp)
            (book_dir / "book.json").write_text(
                json.dumps({
                    "audit": audit,
                    "lessons": lessons if lessons is not None else [
                        {"id": "math3-c1-ex1", "card_id": "math3-c1-ex1",
                         "title": "巩固练习"},
                        {"id": "math3-c1-ex5", "card_id": "math3-c1-ex5",
                         "title": "巩固练习"},
                        {"id": "x1-承上页", "card_id": None, "title": "（承上页）"},
                    ],
                }),
                encoding="utf-8",
            )
            p2l._assemble_verdict(
                book_dir,
                {"card": card, "title": "巩固练习",
                 "printed_pages": printed_pages or [40, 41, 42, 43]},
                report, completed,
            )
        return report

    def test_a_crashed_assemble_is_not_a_pass(self) -> None:
        """book.json 是 assemble 最后一步才写的；崩了的话磁盘上留着上一次的 audit。"""
        report = self.verdict({"errors": []}, completed=False)
        self.assertTrue(report.failures)
        self.assertIn("没有跑完", report.failures[0])

    def test_a_page_segment_error_in_our_range_is_ours(self) -> None:
        """「题号缺号（页段 44-47）」既不含卡片 id 也不含 title，却正是本次漏题的信号。"""
        report = self.verdict({
            "errors": ["题号缺号（页段 40-43）: [21, 22]（可能漏页或漏题）"],
        })
        self.assertEqual(len(report.failures), 1)
        self.assertIn("题号缺号", report.failures[0])

    def test_a_page_segment_error_outside_our_range_is_not_ours(self) -> None:
        report = self.verdict({
            "errors": ["题号缺号（页段 64-67）: [90]（可能漏页或漏题）"],
        })
        self.assertEqual(report.failures, [])

    def test_a_same_titled_other_card_does_not_steal_the_blame(self) -> None:
        """3m 的 math3-c1-ex1 和 ex5 都叫「巩固练习」，按 title 匹配会把本卡锁死。"""
        report = self.verdict({"errors": ["math3-c1-ex1: 题号重复: [3]"]})
        self.assertEqual(
            report.failures, [],
            "点名别的卡 id 的错误不该算本卡的，哪怕两张卡同名",
        )

    def test_an_unattributable_error_fails_closed(self) -> None:
        report = self.verdict({"errors": ["某条谁也认不出来的失败"]})
        self.assertEqual(
            len(report.failures), 1,
            "认不出归属时要拦住——静默放行一条可能是漏题的失败代价更大",
        )

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
            p2l._assemble_verdict(
                Path(temp), {"card": "x", "title": "", "printed_pages": []},
                report, True,
            )
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


class UnitBriefTest(unittest.TestCase):
    """brief 必须自包含，且失败重试要把报错带进去——否则子代理还得回头问。"""

    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self._work = p2l.WORK
        p2l.WORK = Path(self.tmp.name)

    def tearDown(self) -> None:
        p2l.WORK = self._work
        self.tmp.cleanup()

    def test_a_brief_is_self_contained(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        ok = p2l._add_unit(
            report, "3m", "card-1", "page-0045", "page",
            "转写第 45 页", "读 foo.png，写 bar.md",
        )
        self.assertTrue(ok)
        self.assertEqual(len(report.units), 1)
        unit = report.units[0]
        self.assertEqual(unit["attempt"], 1)
        text = (Path(self.tmp.name) / "3m/card-1/units/page-0045.md").read_text()
        self.assertIn("转写第 45 页", text)
        self.assertIn("读 foo.png，写 bar.md", text)
        # 自包含的意思是纪律也在里面，子代理不必再去问环境怎么用
        self.assertIn(".venv/bin/python", text)
        self.assertIn("不要重装依赖", text)
        # 同一项目有多个工作树，子代理不先 cd 会写到别的分支上，而且没有工具会报警
        self.assertIn(f"cd {p2l.REPO}", text.splitlines()[2])

    def test_a_retry_carries_the_failures_into_the_brief(self) -> None:
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        p2l._add_unit(report, "3m", "c", "page-1", "page", "t", "body")
        report2 = p2l.Report(book="3m", edition="modern-us-neutral")
        p2l._add_unit(
            report2, "3m", "c", "page-1", "page", "t", "body",
            ["行数对不上：印刷 27 行，块体 26 行", "白名单外字符 1 处"],
        )
        self.assertEqual(report2.units[0]["attempt"], 2)
        text = (Path(self.tmp.name) / "3m/c/units/page-1.md").read_text()
        self.assertIn("上一次没通过", text)
        self.assertIn("行数对不上", text)
        self.assertIn("白名单外字符", text)

    def test_attempts_run_out_and_then_stop(self) -> None:
        for expected in range(1, p2l.UNIT_MAX_ATTEMPTS + 1):
            report = p2l.Report(book="3m", edition="modern-us-neutral")
            self.assertTrue(p2l._add_unit(report, "3m", "c", "u", "page", "t", "b"))
            self.assertEqual(report.units[0]["attempt"], expected)
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        self.assertFalse(p2l._add_unit(report, "3m", "c", "u", "page", "t", "b"))
        self.assertEqual(report.units, [])
        self.assertTrue(any("不再自动重试" in stop for stop in report.stops))

    def test_attempts_are_never_cleared_mid_flow(self) -> None:
        """中途清会让图单元每轮从 1 重新开始——无限循环、永不硬停。

        `phase_figures` 通过后再清 `figure-`，而 `phase_adapt_finalize` 还会把带图 id
        的失败路由回图单元，于是计数永远回到 1。所以代码里不该有任何中途清的调用点。
        """
        source = (
            Path(p2l.__file__).read_text(encoding="utf-8")
        )
        calls = [
            line.strip() for line in source.splitlines()
            if "_clear_attempts(" in line and not line.strip().startswith("def ")
        ]
        self.assertEqual(
            len(calls), 1,
            f"_clear_attempts 只该在交付成功后调一次，实际 {calls}",
        )

    def test_clearing_is_scoped_by_prefix_when_asked(self) -> None:
        for unit in ("page-1", "figure-a"):
            report = p2l.Report(book="3m", edition="modern-us-neutral")
            p2l._add_unit(report, "3m", "c", unit, "page", "t", "b")
        p2l._clear_attempts("3m", "c", "page-")
        self.assertEqual(p2l._attempt_count("3m", "c", "page-1"), 0)
        self.assertEqual(p2l._attempt_count("3m", "c", "figure-a"), 1)

    def test_emit_prints_paths_not_brief_content(self) -> None:
        import contextlib, io
        report = p2l.Report(book="3m", edition="modern-us-neutral")
        report.gate = p2l.GATE_PAGES
        p2l._add_unit(
            report, "3m", "c", "page-1", "page", "t",
            "SECRET-BRIEF-BODY-SHOULD-NOT-BE-PRINTED",
        )
        buffer = io.StringIO()
        with contextlib.redirect_stdout(buffer):
            report.emit(Path(self.tmp.name) / "r.json", as_json=False)
        out = buffer.getvalue()
        self.assertIn("units/page-1.md", out)
        self.assertNotIn("SECRET-BRIEF-BODY", out, "brief 内容不该进主会话的上下文")
        self.assertIn("不要用 fork", out)


class PreviousPageTailTest(unittest.TestCase):
    def test_absent_previous_page_yields_nothing(self) -> None:
        self.assertEqual(p2l._previous_page_tail("3m", 1), "")

    def test_tail_comes_from_the_real_previous_page(self) -> None:
        """跨页上下文传文字不传像素——SKILL 的原话。"""
        tail = p2l._previous_page_tail("3m", 45)
        self.assertTrue(tail, "PDF 44 已转写，应该取到它的尾部")
        self.assertLessEqual(len(tail.splitlines()), 4)


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
