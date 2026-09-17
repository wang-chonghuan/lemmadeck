from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path

from PIL import Image, ImageDraw

TOOLS = Path(__file__).resolve().parents[1] / "tools"
PROFILE = Path(__file__).resolve().parents[1] / "profiles" / "modern-us-neutral.json"
sys.path.insert(0, str(TOOLS))

import edition


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


class EditionTest(unittest.TestCase):
    def test_hybrid_artwork_requires_aspect_ratio_report(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source_path = root / "source.png"
            artwork_path = root / "figure.artwork.png"
            generation_path = root / "artwork.generated.png.json"
            render_path = root / "figure.render.json"
            spec_path = root / "figure.spec.json"
            Image.new("RGB", (1024, 1024), "#0f766e").save(source_path)
            Image.new("RGBA", (1024, 1024), "#0f766e").save(artwork_path)
            dump(generation_path, {
                "schema": "n-azure/image-generation@1",
                "model": "gpt-image-2",
                "mode": "edit",
                "prompt": "Create artwork only.",
                "references": [{"sha256": edition.sha256(source_path)}],
                "output": {
                    "path": artwork_path.as_posix(),
                    "sha256": edition.sha256(artwork_path),
                },
            })
            spec = {
                "schema": edition.IMAGE_FIGURE_SPEC_SCHEMA,
                "id": "fig-01",
                "mode": "hybrid",
                "description": "Generated artwork with an exact overlay.",
                "source": {
                    "image": {
                        "path": source_path.as_posix(),
                        "sha256": edition.sha256(source_path),
                    },
                    "authoritativeText": [{"text": "Place the figure on a grid."}],
                    "inventory": [{
                        "id": "artwork",
                        "description": "One generated artwork layer.",
                        "objects": ["artwork"],
                        "assertions": ["image-count"],
                    }],
                },
                "canvas": {
                    "width": 1024,
                    "height": 1024,
                    "boundingBox": [0, 10, 10, 0],
                    "background": "transparent",
                    "keepAspectRatio": True,
                },
                "display": {
                    "layout": "inline",
                    "minTextPx": 16,
                    "widths": [352],
                },
                "assets": [{
                    "id": "art",
                    "path": artwork_path.as_posix(),
                    "metadata": generation_path.as_posix(),
                    "role": "artwork",
                }],
                "objects": [{
                    "id": "artwork",
                    "type": "image",
                    "asset": "art",
                    "at": [1, 1],
                    "size": [8, 8],
                }],
                "assertions": [{
                    "id": "image-count",
                    "type": "objectCount",
                    "objectType": "image",
                    "count": 1,
                }],
            }
            dump(spec_path, spec)
            metadata = {
                "schema": edition.IMAGE_RENDER_SCHEMA,
                "figure": "fig-01",
                "mode": "hybrid",
                "renderer": {"name": "JSXGraph"},
                "status": "pass",
                "assets": [{
                    "id": "art",
                    "sha256": edition.sha256(artwork_path),
                    "metadata": {"sha256": edition.sha256(generation_path)},
                }],
                "imageFits": [{
                    "id": "artwork",
                    "status": "pass",
                    "preserveAspectRatio": "xMidYMid meet",
                }],
                "output": {
                    "artwork": {"sha256": edition.sha256(artwork_path)},
                },
                "spec": {"sha256": edition.sha256(spec_path)},
            }
            dump(render_path, metadata)
            figure = {"id": "fig-01"}
            self.assertEqual(
                edition.validate_artwork(
                    artwork_path,
                    render_path,
                    spec_path,
                    figure,
                ),
                [],
            )

            metadata.pop("imageFits")
            dump(render_path, metadata)
            errors = edition.validate_artwork(
                artwork_path,
                render_path,
                spec_path,
                figure,
            )
            self.assertTrue(any("imageFits" in error for error in errors))

    def test_numbered_subparts_are_sorted_and_line_broken(self) -> None:
        source = (
            "下列每两个数之间包括哪些整数："
            "1) $-8.8$ 和 $3.85$；　　　　3) $-9.2$ 和 $4.73$；"
            "2) $-3.11$ 和 $3.11$；　　　4) $-3.22$ 和 $3.22$."
        )
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "下列每两个数之间包括哪些整数：\n"
            "1) $-8.8$ 和 $3.85$；\n"
            "2) $-3.11$ 和 $3.11$；\n"
            "3) $-9.2$ 和 $4.73$；\n"
            "4) $-3.22$ 和 $3.22$.",
        )

    def test_fullwidth_numbered_subparts_are_sorted_and_line_broken(self) -> None:
        source = "选择：1）甲； 4）丁；2）乙； 3）丙."
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "选择：\n1）甲；\n2）乙；\n3）丙.\n4）丁；",
        )

    def test_numbered_subparts_touching_chinese_text_are_line_broken(self) -> None:
        source = "用什么数字代替星号才能使所得的数1) 被 3 整除？和 2) 被 5 整除？"
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "用什么数字代替星号才能使所得的数\n"
            "1) 被 3 整除？和\n"
            "2) 被 5 整除？",
        )

    def test_parenthesized_numbered_subparts_are_line_broken(self) -> None:
        source = "计算：(1) $a+1$；　　　(2) $b+2$."
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "计算：\n(1) $a+1$；\n(2) $b+2$.",
        )

    def test_latin_lettered_subparts_are_line_broken(self) -> None:
        source = (
            "求值：a) $a+1$； b) $b+2$； c) $c+3$，\n"
            "其中 $c=4$."
        )
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "求值：\n"
            "a) $a+1$；\n"
            "b) $b+2$；\n"
            "c) $c+3$， 其中 $c=4$.",
        )

    def test_cyrillic_lettered_subparts_are_line_broken(self) -> None:
        source = "求值：а) $a+1$；　в) $c+3$； б) $b+2$."
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "求值：\n"
            "а) $a+1$；\n"
            "б) $b+2$.\n"
            "в) $c+3$；",
        )

    def test_figure_number_is_not_treated_as_a_subpart(self) -> None:
        source = "观察图 72），回答：\n1) 第一问；\n2) 第二问."
        self.assertEqual(edition.normalize_numbered_subparts(source), source)

    def test_numbered_subpart_layout_validator_rejects_unnormalized_text(self) -> None:
        self.assertTrue(
            edition.validate_numbered_subpart_layout("计算：1）甲；2）乙.")
        )
        self.assertEqual(
            edition.validate_numbered_subpart_layout("计算：\n1）甲；\n2）乙."),
            [],
        )

    def test_layout_reordering_preserves_math_and_numbers(self) -> None:
        source = "计算：1) $a+1$；3) $c+3$；2) $b+2$；4) $d+4$."
        modern = edition.normalize_numbered_subparts(source)
        self.assertEqual(
            edition.validate_text(
                source,
                modern,
                ["layout"],
                [],
                "exercise",
                [],
            ),
            [],
        )

    def test_coordinate_values_are_not_treated_as_subparts(self) -> None:
        source = (
            "作折线，顶点为 $A(-6,2),B(-4,6),C(1,1),D(2,-5)$，"
            "再求交点坐标."
        )
        self.assertEqual(edition.normalize_numbered_subparts(source), source)

    def test_prose_is_line_broken_at_sentences_and_introduced_formulas(self) -> None:
        source = (
            "下面是数式的例：$a+1,\\ b+2.$其中第一个式子含有 $a$。"
            "当 $a=1$ 时，式的值为 2；当 $a=2$ 时，式的值为 3。"
            "定义域记作：$\\{x\\mid x\\ne1\\}$，读作变量 $x$ 的取值集合。"
            "在式中有的运算不能进行（零不能作除数！），所以它没有意义。"
        )
        self.assertEqual(
            edition.normalize_prose_layout(source),
            "下面是数式的例：\n"
            "$a+1,\\ b+2.$\n"
            "其中第一个式子含有 $a$。\n"
            "\n"
            "当 $a=1$ 时，式的值为 2；\n"
            "当 $a=2$ 时，式的值为 3。\n"
            "定义域记作：\n"
            "$\\{x\\mid x\\ne1\\}$，\n"
            "\n"
            "读作变量 $x$ 的取值集合。\n"
            "在式中有的运算不能进行（零不能作除数！），所以它没有意义。",
        )

    def test_prose_layout_creates_real_paragraph_groups(self) -> None:
        source = "甲。乙。丙。丁。戊。"
        modern = edition.normalize_prose_layout(source)
        self.assertEqual(modern, "甲。\n乙。\n丙。\n\n丁。\n戊。")
        self.assertEqual(len(modern.split("\n\n")), 2)

    def test_section_breaks_only_point_between_paragraphs(self) -> None:
        self.assertEqual(edition.validate_section_breaks([2, 4], 5), [])
        self.assertTrue(edition.validate_section_breaks([0], 5))
        self.assertTrue(edition.validate_section_breaks([5], 5))
        self.assertTrue(edition.validate_section_breaks([3, 2], 5))
        self.assertTrue(edition.validate_section_breaks([2, 2], 5))
        self.assertTrue(edition.validate_section_breaks(["2"], 5))

    def test_layout_normalization_preserves_prose_signatures(self) -> None:
        source = "例如：$x+1.$式的值是 2。"
        modern = edition.normalize_prose_layout(source)
        self.assertEqual(
            edition.validate_text(
                source,
                modern,
                ["layout"],
                [],
                "prose",
                [],
            ),
            [],
        )

    def test_text_validation_preserves_math_and_rejects_old_culture(self) -> None:
        errors = edition.validate_text(
            "苏联的产量从 10 增加到 12，求增长率 $r=2/10$.",
            "一个地区的产量从 10 增加到 12，求增长率 $r=2/10$.",
            ["setting"],
            [],
            "exercise",
            ["苏联"],
        )
        self.assertEqual(errors, [])

        errors = edition.validate_text(
            "苏联的产量为 10.",
            "苏联的产量为 10.",
            [],
            [],
            "exercise",
            ["苏联"],
        )
        self.assertTrue(any("旧文化词" in error for error in errors))

        errors = edition.validate_text(
            "阿廖沙和别佳是同学.",
            "阿廖沙和别佳是同学.",
            [],
            [],
            "exercise",
            ["阿廖沙", "别佳"],
        )
        self.assertTrue(any("俄文人名" in error for error in errors))

    def test_text_validation_allows_cultural_copy_inside_latex_text(self) -> None:
        errors = edition.validate_text(
            "集合 $\\{\\text{КОТ，СОН，ТОК}\\}$ 中哪些单词由相同字母组成？",
            "集合 $\\{\\text{ACT，CAT，TAC}\\}$ 中哪些单词由相同字母组成？",
            ["context"],
            [],
            "exercise",
            [],
        )
        self.assertEqual(errors, [])

        errors = edition.validate_text(
            "计算 $x+\\text{10 apples}$。",
            "计算 $x-\\text{10 oranges}$。",
            ["context"],
            [],
            "exercise",
            [],
        )
        self.assertTrue(any("数学公式发生变化" in error for error in errors))

    def test_context_numbers_must_be_declared_exactly(self) -> None:
        errors = edition.validate_text(
            "数据来自 1970—1974 年.",
            "数据来自 2020—2024 年.",
            ["setting", "context-number"],
            [
                {"from": "1970", "to": "2020", "reason": "Update the period."},
                {"from": "1974", "to": "2024", "reason": "Update the period."},
            ],
            "exercise",
            [],
        )
        self.assertEqual(errors, [])

        errors = edition.validate_text(
            "数据来自 1970—1974 年.",
            "数据来自 2020—2024 年.",
            ["setting"],
            [],
            "exercise",
            [],
        )
        self.assertTrue(any("非公式数字变化未被准确声明" in error for error in errors))

    def test_svg_figure_text_must_be_english(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "source.png"
            svg = root / "fig-01.svg"
            spec = root / "fig-01.spec.json"
            render = root / "fig-01.render.json"
            Image.new("RGB", (320, 320), "white").save(source)
            dump(spec, {
                "schema": edition.IMAGE_FIGURE_SPEC_SCHEMA,
                "id": "fig-01",
                "mode": "deterministic",
                "description": "A newly authored tree.",
                "source": {
                    "image": {
                        "path": source.as_posix(),
                        "sha256": edition.sha256(source),
                    },
                    "authoritativeText": [{"text": "One tree."}],
                    "inventory": [{
                        "id": "tree",
                        "description": "The visible tree label.",
                        "objects": ["tree-label"],
                        "assertions": [],
                    }],
                },
                "canvas": {
                    "width": 320,
                    "height": 320,
                    "boundingBox": [0, 60, 100, 0],
                    "background": "paper",
                    "keepAspectRatio": True,
                },
                "display": {
                    "layout": "inline",
                    "minTextPx": 16,
                    "widths": [320],
                },
                "objects": [{
                    "id": "tree-label",
                    "type": "text",
                    "at": [10, 20],
                    "text": "Tree",
                    "fontSize": 20,
                    "labelColor": "ink",
                }],
                "assertions": [],
            })
            svg.write_text(
                '<svg viewBox="0 0 100 60">'
                '<title>一棵树</title>'
                '<text x="10" y="20">Tree</text>'
                "</svg>"
            )
            dump(render, {
                "schema": edition.IMAGE_RENDER_SCHEMA,
                "figure": "fig-01",
                "mode": "deterministic",
                "renderer": {"name": "JSXGraph"},
                "status": "pass",
                "spec": {"sha256": edition.sha256(spec)},
                "output": {"svg": {"sha256": edition.sha256(svg)}},
                "displayChecks": [{"status": "pass"}],
                "theme": {"output": "css-variables"},
            })

            errors = edition.validate_svg(
                svg,
                spec,
                {"id": "fig-01"},
                "English",
                render,
            )
            self.assertTrue(any("必须使用英文" in error for error in errors))

            svg.write_text(
                '<svg viewBox="0 0 100 60">'
                '<title>One tree</title>'
                '<text x="10" y="20">Tree 1</text>'
                "</svg>"
            )
            metadata = edition.load(render)
            metadata["output"]["svg"]["sha256"] = edition.sha256(svg)
            dump(render, metadata)
            self.assertEqual(
                edition.validate_svg(
                    svg,
                    spec,
                    {"id": "fig-01"},
                    "English",
                    render,
                ),
                [],
            )

    def test_prepare_and_finalize_modern_edition(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            book = root / "5m"
            lesson_id = "math5-c1-s1-n1"
            raw_dir = book / "lessons" / lesson_id
            raw_lesson = {
                "id": lesson_id,
                "card_id": lesson_id,
                "chapter": "第一章",
                "section": "第一节",
                "number": "1",
                "title": "测试",
                "printed_title": "1. 测试",
                "start_page": 1,
                "start_printed": 1,
                "figures": [{"id": "fig-01", "label": "图 1", "page": 1}],
                "exercise_count": 1,
                "prose": [
                    {
                        "kind": "p",
                        "text": "观察图 1.",
                        "id": None,
                        "label": None,
                        "printed_page": 1,
                    },
                    {
                        "kind": "fig",
                        "text": "",
                        "id": "fig-01",
                        "label": "图 1",
                        "printed_page": 1,
                    },
                ],
            }
            raw_exercises = {
                "lesson": lesson_id,
                "count": 1,
                "exercises": [
                    {
                        "number": "1",
                        "group": None,
                        "text": "苏联农场有 10 棵树.",
                        "lines": ["苏联农场有 10 棵树."],
                        "pages": ["p0001#1"],
                        "figure_refs": [],
                        "figures": [],
                    }
                ],
            }
            dump(raw_dir / "lesson.json", raw_lesson)
            dump(raw_dir / "exercises.json", raw_exercises)
            dump(book / "book.json", {
                "lessons": [{
                    "id": lesson_id,
                    "card_id": lesson_id,
                    "number": "1",
                }],
            })
            (book / "figures").mkdir(parents=True)
            Image.new("RGB", (120, 80), "white").save(
                book / "figures" / "fig-01.png"
            )
            args = Namespace(
                root=str(root),
                work=str(root / "work"),
                book="5m",
                edition="modern-us-neutral",
                lesson=[lesson_id],
                profile=str(PROFILE),
                force=False,
            )
            self.assertEqual(edition.cmd_prepare(args), 0)

            template_target = (
                root
                / "work"
                / "adapt"
                / "5m"
                / args.edition
                / "lessons"
                / lesson_id
            )
            target = book / "editions" / args.edition / "lessons" / lesson_id
            target.mkdir(parents=True)
            shutil.copy2(
                template_target / "lesson.template.json",
                target / "lesson.json",
            )
            shutil.copy2(
                template_target / "exercises.template.json",
                target / "exercises.json",
            )
            shutil.copy2(
                template_target / "figures.template.json",
                target / "figures.json",
            )
            self.assertFalse(any(target.glob("*.template.json")))
            figures = edition.load(target / "figures.json")
            figures["figures"][0].update({
                "png": "figures/fig-01.png",
                "generation": "figures/fig-01.png.json",
                "review": "figures/fig-01.review.json",
            })
            dump(target / "figures.json", figures)
            exercises = edition.load(target / "exercises.json")
            exercises["exercises"][0]["text"] = "一个社区农场有 10 棵树."
            exercises["exercises"][0]["changes"] = ["setting"]
            dump(target / "exercises.json", exercises)

            figure_dir = book / "editions" / args.edition / "figures"
            figure_dir.mkdir(parents=True)
            image_path = figure_dir / "fig-01.png"
            image = Image.new("RGB", (1024, 1024), "white")
            draw = ImageDraw.Draw(image)
            draw.rectangle((120, 430, 904, 594), fill="#0f766e")
            image.save(image_path)
            source_sha = edition.sha256(book / "figures" / "fig-01.png")
            dump(figure_dir / "fig-01.png.json", {
                "schema": "n-azure/image-generation@1",
                "model": "gpt-image-2",
                "mode": "edit",
                "prompt": "Create a full-color horizontal line diagram.",
                "references": [{"sha256": source_sha}],
                "output": {
                    "path": image_path.as_posix(),
                    "sha256": edition.sha256(image_path),
                },
            })
            spec_path = figure_dir / "fig-01.spec.json"
            dump(spec_path, {
                "schema": edition.IMAGE_FIGURE_SPEC_SCHEMA,
                "id": "fig-01",
                "mode": "generated",
                "description": "A generated full-color line diagram.",
                "source": {
                    "image": {
                        "path": (book / "figures" / "fig-01.png").as_posix(),
                        "sha256": source_sha,
                    },
                    "authoritativeText": [{
                        "lesson": lesson_id,
                        "text": "观察图 1.",
                    }],
                    "inventory": [{
                        "id": "line-diagram",
                        "description": "One complete semantic line diagram.",
                        "objects": [],
                        "assertions": [],
                    }],
                },
                "canvas": {
                    "width": 1024,
                    "height": 1024,
                    "boundingBox": [0, 10, 10, 0],
                    "background": "paper",
                    "keepAspectRatio": True,
                },
                "display": {
                    "layout": "inline",
                    "minTextPx": 16,
                    "widths": [352],
                },
                "objects": [],
                "assertions": [],
            })
            generation_path = figure_dir / "fig-01.png.json"
            dump(figure_dir / "fig-01.review.json", {
                "schema": edition.IMAGE_REVIEW_SCHEMA,
                "figure": "fig-01",
                "status": "pass",
                "spec": {"sha256": edition.sha256(spec_path)},
                "generation": {"sha256": edition.sha256(generation_path)},
                "outputs": {
                    "png": {"sha256": edition.sha256(image_path)},
                },
            })

            self.assertEqual(edition.cmd_finalize(args), 0)
            self.assertEqual(edition.load(target / "lesson.json")["status"], "ready")
            self.assertEqual(
                edition.load(target / "adaptation.audit.json")["status"],
                "pass",
            )
            gate_args = [
                sys.executable, str(TOOLS / "validate_publish.py"), str(book),
                "--edition", args.edition, "--lesson", lesson_id,
            ]
            gate = subprocess.run(gate_args, capture_output=True, text=True)
            self.assertEqual(gate.returncode, 0, gate.stdout + gate.stderr)

            current_spec = edition.load(spec_path)
            legacy_spec = dict(current_spec)
            legacy_spec["schema"] = edition.LEGACY_IMAGE_FIGURE_SPEC_SCHEMA
            legacy_spec["review"] = {"status": "pass"}
            dump(spec_path, legacy_spec)
            gate = subprocess.run(gate_args, capture_output=True, text=True)
            self.assertEqual(gate.returncode, 2, gate.stdout + gate.stderr)
            self.assertIn("历史 FigureSpec 只读", gate.stdout)
            dump(spec_path, current_spec)

            image_path.unlink()
            gate = subprocess.run(gate_args, capture_output=True, text=True)
            self.assertEqual(gate.returncode, 2, gate.stdout + gate.stderr)
            self.assertIn("缺少现代 PNG", gate.stdout)
            self.assertEqual(
                edition.load(target / "adaptation.audit.json")["status"], "pass",
            )

    def test_book_index_uses_source_order_for_unnumbered_exercises(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            book = root / "6a"
            edition_dir = book / "editions" / "modern-us-neutral"
            profile = root / "profile.json"
            dump(profile, {"id": "modern-us-neutral"})
            dump(book / "book.json", {
                "lessons": [
                    {"id": "alg6-c1-s1-n1", "card_id": "alg6-c1-s1-n1", "number": "1"},
                    {"id": "alg6-c1-ex", "card_id": "alg6-c1-ex", "number": None},
                    {"id": "alg6-c2-s1-n2", "card_id": "alg6-c2-s1-n2", "number": "2"},
                ],
            })
            dump(edition_dir / "book.json", {
                "schema": edition.BOOK_SCHEMA,
                "edition": "modern-us-neutral",
                "status": "draft",
                "profile": {},
                "lessons": [
                    {"id": "alg6-c2-s1-n2", "number": "2"},
                    {"id": "alg6-c1-s1-n1", "number": "1"},
                ],
            })

            edition.update_book_index(
                book,
                edition_dir,
                profile,
                [{"id": "alg6-c1-ex", "number": None}],
            )

            self.assertEqual(
                [item["id"] for item in edition.load(edition_dir / "book.json")["lessons"]],
                ["alg6-c1-s1-n1", "alg6-c1-ex", "alg6-c2-s1-n2"],
            )


if __name__ == "__main__":
    unittest.main()
