"""STEMROBIN-192: 一次调用报出全部不通过项，不在第一类错误处返回。"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import edition


def spec_with_three_defects(figure_id: str) -> dict:
    """同时坏三处：mode 非法、display 缺、assertions 缺。"""
    return {
        "schema": "ld-s10y-image/figure-spec@2",
        "id": figure_id,
        "mode": "nonsense",
        "description": "",
        "source": {
            "image": {"path": "figures/x.png", "sha256": "0" * 64},
            "authoritativeText": [],
        },
        "canvas": {"width": 10, "height": 10, "boundingBox": [0, 0, 0, 0]},
        "objects": [{"type": "point", "at": [0, 0]}],
        "assertions": [],
    }


class AllErrorsAtOnceTest(unittest.TestCase):
    def test_a_missing_svg_no_longer_hides_the_figurespec_errors(self) -> None:
        """改造前 validate_svg 在「缺少现代 SVG」就 return，FigureSpec 的错一个也看不到。

        新图的 SVG 本来就还不存在，所以这正是第一次 adapt-finalize 的常态：
        每张图只报一句「缺 SVG」，spec 的问题要等渲染出来才看见——三轮里的一轮。
        """
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            spec_path = directory / "fig-01.spec.json"
            spec_path.write_text(
                json.dumps(spec_with_three_defects("fig-01")), encoding="utf-8",
            )
            errors = edition.validate_svg(
                directory / "fig-01.svg",      # 不存在
                spec_path,
                {"id": "fig-01"},
                "English",
                directory / "fig-01.render.json",   # 也不存在
            )
        self.assertTrue(
            any("缺少现代 SVG" in error for error in errors), errors,
        )
        spec_errors = [error for error in errors if "spec.json" in error]
        self.assertGreaterEqual(
            len(spec_errors), 3,
            f"缺 SVG 时仍然应该报出 FigureSpec 的全部问题，实际只有: {errors}",
        )
        self.assertTrue(
            any("mode" in error for error in spec_errors), spec_errors,
        )
        self.assertTrue(
            any("display" in error for error in spec_errors), spec_errors,
        )

    def test_a_missing_spec_is_reported_without_crashing_the_review_check(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            directory = Path(temp)
            review = directory / "r.review.json"
            review.write_text(json.dumps({
                "schema": "ld-s10y-image/review@1",
                "figure": "fig-01",
                "status": "pass",
                "spec": {"sha256": "0" * 64},
            }), encoding="utf-8")
            errors = edition.validate_review(
                review, directory / "absent.spec.json", "render",
                directory / "absent.render.json", {}, "fig-01",
            )
        self.assertTrue(
            any("缺 review 绑定的 FigureSpec" in error for error in errors), errors,
        )
        # 缺 spec 不应该掩盖「缺 render 文件」和「缺输出记录」这两类
        self.assertGreaterEqual(len(errors), 3, errors)


class FigureManifestMessageTest(unittest.TestCase):
    def test_the_manifest_error_names_the_ids(self) -> None:
        """以前只说一句「必须保留原书图顺序，并只追加实际引用的共享图」。"""
        raw_exercises = {
            "exercises": [
                {"number": "1", "figure_refs": ["tbl-shared-01"]},
                {"number": "2", "figures": [{"id": "tbl-shared-02"}]},
                {"number": "3", "figure_refs": ["fig-01"]},
            ],
        }
        appended = edition.exercise_shared_figures(
            raw_exercises, [{"id": "fig-01"}],
        )
        self.assertEqual(
            [item["id"] for item in appended],
            ["tbl-shared-01", "tbl-shared-02"],
        )


if __name__ == "__main__":
    unittest.main()
