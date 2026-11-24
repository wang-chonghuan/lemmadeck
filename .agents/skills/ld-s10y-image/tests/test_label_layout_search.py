"""STEMROBIN-192: 标签布局由渲染器自己解出，解不开时报出它试过什么。"""
from __future__ import annotations

import copy
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
REPO = SKILL.parents[2]
FIXTURE = SKILL / "tests" / "fixtures" / "number-line.json"


def render(spec: dict) -> tuple[int, dict]:
    (REPO / ".tmp").mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=REPO / ".tmp") as temp:
        directory = Path(temp)
        spec_path = directory / "spec.json"
        report_path = directory / "render.json"
        spec_path.write_text(json.dumps(spec), encoding="utf-8")
        result = subprocess.run(
            ["node", str(SKILL / "scripts" / "render_spec.mjs"),
             "--spec", str(spec_path), "--svg", str(directory / "figure.svg"),
             "--report", str(report_path)],
            cwd=REPO, capture_output=True, text=True,
        )
        report = (
            json.loads(report_path.read_text(encoding="utf-8"))
            if report_path.is_file() else {"stderr": result.stderr}
        )
        return result.returncode, report


class LabelLayoutSearchTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.base = json.loads(FIXTURE.read_text(encoding="utf-8"))

    def test_a_clean_figure_needs_no_concession(self) -> None:
        code, report = render(copy.deepcopy(self.base))
        self.assertEqual(code, 0, report)
        self.assertEqual(report["collisions"], [])
        self.assertEqual(report["layout"]["resolution"]["margin"], 0)
        self.assertTrue(
            all(
                item["gapScale"] == 1
                for item in report["layout"]["resolution"]["labels"]
            ),
            report["layout"]["resolution"]["labels"],
        )

    def test_a_requested_position_that_collides_is_solved_not_failed(self) -> None:
        """改造前：指定了 position 又没写 fallback，候选集只有那一个，撞了直接失败。"""
        spec = copy.deepcopy(self.base)
        spec["objects"][-1]["labelPlacement"] = {"position": "CENTER"}
        code, report = render(spec)
        self.assertEqual(code, 0, report)
        self.assertEqual(report["collisions"], [])
        placed = {
            item["id"]: item
            for item in report["layout"]["resolution"]["labels"]
        }
        self.assertNotEqual(placed["right-name-label"]["position"], "CENTER")

    def test_the_resolution_records_every_label(self) -> None:
        code, report = render(copy.deepcopy(self.base))
        self.assertEqual(code, 0, report)
        resolution = report["layout"]["resolution"]
        self.assertEqual(len(resolution["labels"]), report["labels"])
        for item in resolution["labels"]:
            self.assertIn("position", item)
            self.assertIn("gapScale", item)
            self.assertIn("score", item)

    def test_a_failure_reports_what_was_tried(self) -> None:
        """字号要求高到任何布局都满足不了：失败，但必须报出试过哪些让步。"""
        spec = copy.deepcopy(self.base)
        spec["display"] = {**spec["display"], "minTextPx": 400}
        code, report = render(spec)
        self.assertNotEqual(code, 0)
        self.assertEqual(report["status"], "fail")
        attempts = report["layout"]["attempts"]
        self.assertGreaterEqual(len(attempts), 1)
        for attempt in attempts:
            self.assertIn("margin", attempt)
            self.assertIn("display", attempt)
            self.assertIn("collisions", attempt)
        self.assertTrue(
            any(item["status"] == "fail" for item in report["displayChecks"]),
            report["displayChecks"],
        )

    def test_an_unsupported_placement_is_named(self) -> None:
        """渲染器前置的 validate_spec 就把它挡住并指名道姓。

        渲染循环里那条 `layoutErrors.push('Unsupported label placement: …')` 因此
        是条防御带：validate_spec 放行的九个方位正好是渲染器认得的九个，所以走
        CLI 到不了那里。改造后它不再 `throw`——真有一天两边不同步时，报告会把
        它和别的标签、别的宽度的结论一起带回来，而不是打断整次渲染。
        """
        spec = copy.deepcopy(self.base)
        spec["objects"][-1]["labelPlacement"] = {"position": "NNE"}
        code, report = render(spec)
        self.assertNotEqual(code, 0)
        self.assertIn("unsupported", report.get("stderr", "").lower())
        self.assertIn("NNE", report.get("stderr", ""))


if __name__ == "__main__":
    unittest.main()
