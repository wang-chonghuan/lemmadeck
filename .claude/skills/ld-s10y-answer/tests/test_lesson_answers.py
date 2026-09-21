from __future__ import annotations

import contextlib
import io
import json
import shutil
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
REPO = Path(__file__).resolve().parents[4]
TEXTBOOK_ROOT = REPO / "ssot-resources" / "soviet10year-textbooks"
PROFILE = (
    REPO
    / ".claude"
    / "skills"
    / "ld-s10y-lesson"
    / "profiles"
    / "modern-us-neutral.json"
)
sys.path.insert(0, str(TOOLS))

import answers
import lesson_answers
import edition


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


class LessonAnswersTest(unittest.TestCase):
    def test_legacy_group_identity_joins_new_capture_without_rewriting_source(self) -> None:
        lesson_id = "phy6-c1-s2"
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            book = root / "6p"
            shutil.copytree(TEXTBOOK_ROOT / "artifacts" / "6p", book)
            source_path = book / "lessons" / lesson_id / "exercises.json"
            source_bytes = source_path.read_bytes()
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(
                    lesson_answers.assemble.run(
                        book,
                        TEXTBOOK_ROOT / "toc" / "6p" / "zh.json",
                        PROFILE,
                        exercise_numbering="lesson-group",
                    ),
                    0,
                )
            self.assertEqual(source_path.read_bytes(), source_bytes)
            _, _, _, edition_errors = edition.validate_lesson(
                book,
                book / "editions" / "modern-us-neutral",
                lesson_id,
                edition.load(PROFILE),
                require_current_figures=True,
            )
            self.assertEqual(edition_errors, [])

            rebuilt = lesson_answers.rebuilt_exercises(
                book,
                "6p",
                {lesson_id},
            )[lesson_id]["exercises"][0]
            page = int(rebuilt["pages"][0].split("#")[0][1:])
            captured = {
                "lesson": lesson_id,
                "exerciseId": rebuilt["number"],
                "sourceNumber": rebuilt["source_number"],
                "groupId": rebuilt["group_id"],
                "group": rebuilt["group"],
                "raw": "TEST-ONLY IDENTITY FIXTURE, NOT A TEXTBOOK ANSWER",
                "pdfPage": page,
            }
            answer_path = book / "answers.json"
            dump(answer_path, {
                "schema": answers.SCHEMA,
                "book": "6p",
                "exerciseNumbering": "lesson-group",
                "source": {"pdfPages": [page]},
                "answers": [captured],
            })
            _, capture_errors = answers.validate_answer_file(
                answer_path,
                "6p",
                "lesson-group",
            )
            self.assertEqual(capture_errors, [])
            args = Namespace(
                root=str(root),
                work=str(root / "work"),
                book="6p",
                edition="modern-us-neutral",
                lesson=[lesson_id],
            )

            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(lesson_answers.cmd_prepare(args), 0)
            template = lesson_answers.load(
                root / "work" / "6p" / "modern-us-neutral" / "lessons"
                / lesson_id / "answer-keys.template.json"
            )
            self.assertEqual(template["answers"][0]["bookRaw"], captured["raw"])

            captured["groupId"] = "g2"
            dump(answer_path, {
                "schema": answers.SCHEMA,
                "book": "6p",
                "exerciseNumbering": "lesson-group",
                "source": {"pdfPages": [page]},
                "answers": [captured],
            })
            with self.assertRaisesRegex(SystemExit, "groupId"):
                lesson_answers.cmd_prepare(args)

    def test_lesson_scoped_capture_rejects_unscoped_numeric_answer(self) -> None:
        answers = [
            {"exercise": 1, "raw": "global"},
            {"lesson": "phy6-c1-s2", "exercise": 1, "raw": "scoped"},
        ]

        self.assertIsNone(
            lesson_answers.captured_answer(
                answers,
                "phy6-c1-s1",
                {"number": "1", "source_number": "1"},
                "lesson",
            )
        )
        self.assertEqual(
            lesson_answers.captured_answer(
                answers,
                "phy6-c1-s2",
                {"number": "1", "source_number": "1"},
                "lesson",
            )["raw"],
            "scoped",
        )

    def test_group_scoped_capture_matches_stable_identity_and_evidence(self) -> None:
        answers = [
            {
                "exerciseId": "1",
                "lesson": "phy6-c2-s4",
                "groupId": "g1",
                "group": "问题",
                "sourceNumber": 1,
                "raw": "问题答案",
            },
            {
                "exerciseId": "g2-1",
                "lesson": "phy6-c2-s4",
                "groupId": "g2",
                "group": "练习",
                "sourceNumber": 1,
                "raw": "练习答案",
            },
            {
                "exerciseId": "q1",
                "lesson": "phy6-c2-s4",
                "groupId": "g3",
                "group": "作业",
                "sourceNumber": None,
                "raw": "作业答案",
            },
        ]
        exercises = [
            {
                "number": "1",
                "source_number": "1",
                "group": "问题",
                "group_id": "g1",
            },
            {
                "number": "g2-1",
                "source_number": "1",
                "group": "练习",
                "group_id": "g2",
            },
            {
                "number": "q1",
                "source_number": None,
                "group": "作业",
                "group_id": "g3",
            },
        ]

        self.assertEqual(
            [
                lesson_answers.captured_answer(
                    answers,
                    "phy6-c2-s4",
                    exercise,
                    "lesson-group",
                )["raw"]
                for exercise in exercises
            ],
            ["问题答案", "练习答案", "作业答案"],
        )

    def test_group_scoped_capture_rejects_mismatched_group_evidence(self) -> None:
        with self.assertRaisesRegex(SystemExit, "groupId"):
            lesson_answers.captured_answer(
                [{
                    "exerciseId": "g2-1",
                    "lesson": "phy6-c2-s4",
                    "groupId": "g1",
                    "group": "问题",
                    "sourceNumber": 1,
                    "raw": "错误归组",
                }],
                "phy6-c2-s4",
                {
                    "number": "g2-1",
                    "source_number": "1",
                    "group": "练习",
                    "group_id": "g2",
                },
                "lesson-group",
            )

    def test_finalize_allows_source_bound_historical_entity(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            lesson_id = "phy6-c1-s6"
            lesson_dir = (
                root / "6p" / "editions" / "modern-us-neutral"
                / "lessons" / lesson_id
            )
            dump(lesson_dir / "exercises.json", {
                "exercises": [{
                    "number": "q1",
                    "source_number": None,
                    "text": "苏联航天事业为什么发展迅速？",
                }],
            })
            dump(lesson_dir / "answer-keys.json", {
                "schema": lesson_answers.SCHEMA,
                "book": "6p",
                "lesson": lesson_id,
                "edition": "modern-us-neutral",
                "answers": [{
                    "exercise": "q1",
                    "grading": "ungraded",
                    "source": "derived",
                    "displayAnswer": "苏联航天事业依靠科学研究与工程协作。",
                    "parts": [],
                    "historical_entities": [{
                        "term": "苏联",
                        "reason": "题面讨论真实航天史。",
                    }],
                }],
            })

            _, errors = lesson_answers.validate_lesson(
                lesson_dir / "answer-keys.json",
                lesson_dir / "exercises.json",
                "6p",
                lesson_id,
                "modern-us-neutral",
                ["苏联"],
            )

            self.assertEqual(errors, [])

    def test_finalize_rejects_russian_names_in_modern_answer(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            lesson_id = "math5-c1-s1-n1"
            lesson_dir = (
                root / "5m" / "editions" / "modern-us-neutral"
                / "lessons" / lesson_id
            )
            dump(lesson_dir / "exercises.json", {
                "exercises": [{"number": "4", "text": "Alex meets Ben."}],
            })
            dump(lesson_dir / "answer-keys.json", {
                "schema": lesson_answers.SCHEMA,
                "book": "5m",
                "lesson": lesson_id,
                "edition": "modern-us-neutral",
                "answers": [{
                    "exercise": "4",
                    "grading": "ungraded",
                    "source": "derived",
                    "displayAnswer": "阿廖沙会遇到别佳。",
                    "parts": [],
                }],
            })
            _, errors = lesson_answers.validate_lesson(
                lesson_dir / "answer-keys.json",
                lesson_dir / "exercises.json",
                "5m",
                lesson_id,
                "modern-us-neutral",
                ["阿廖沙", "别佳"],
            )
            self.assertTrue(any("俄文人名" in error for error in errors))

    def test_prepare_writes_only_to_selected_edition(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            lesson_id = "math5-c1-s1-n1"
            dump(root / "5m" / "answers.json", {
                "answers": [{"exercise": 1, "raw": "42"}],
            })
            lesson_dir = (
                root / "5m" / "editions" / "modern-us-neutral"
                / "lessons" / lesson_id
            )
            dump(lesson_dir / "exercises.json", {
                "exercises": [{
                    "number": "1",
                    "text": "求答案.",
                    "figure_refs": ["fig-01"],
                }],
            })
            dump(lesson_dir / "figures.json", {
                "figures": [{
                    "id": "fig-01",
                    "svg": "figures/fig-01.svg",
                    "spec": "figures/fig-01.spec.json",
                }],
            })
            args = Namespace(
                root=str(root),
                work=str(root / "work"),
                book="5m",
                edition="modern-us-neutral",
                lesson=[lesson_id],
            )

            self.assertEqual(lesson_answers.cmd_prepare(args), 0)
            template = lesson_answers.load(
                root / "work" / "5m" / "modern-us-neutral" / "lessons"
                / lesson_id / "answer-keys.template.json"
            )
            self.assertEqual(template["edition"], "modern-us-neutral")
            self.assertEqual(template["answers"][0]["bookRaw"], "42")
            evidence = template["answers"][0]["figureEvidence"][0]
            self.assertTrue(evidence["originalPng"].endswith("figures/fig-01.png"))
            self.assertTrue(evidence["editionAsset"].endswith("figures/fig-01.svg"))
            self.assertTrue(evidence["figureSpec"].endswith("figures/fig-01.spec.json"))
            self.assertFalse(
                (lesson_dir / "answer-keys.template.json").exists()
            )

    def test_prepare_joins_repeated_numbers_by_stable_exercise_id(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            lesson_id = "phy6-c2-s4"
            dump(root / "6p" / "book.json", {
                "exercise_numbering": "lesson-group",
            })
            dump(root / "6p" / "answers.json", {
                "answers": [
                    {
                        "exerciseId": "1",
                        "lesson": lesson_id,
                        "groupId": "g1",
                        "group": "问题",
                        "sourceNumber": 1,
                        "raw": "问题答案",
                    },
                    {
                        "exerciseId": "g2-1",
                        "lesson": lesson_id,
                        "groupId": "g2",
                        "group": "练习",
                        "sourceNumber": 1,
                        "raw": "练习答案",
                    },
                    {
                        "exerciseId": "q1",
                        "lesson": lesson_id,
                        "groupId": "g3",
                        "group": "作业",
                        "sourceNumber": None,
                        "raw": "作业答案",
                    },
                ],
            })
            lesson_dir = (
                root / "6p" / "editions" / "modern-us-neutral"
                / "lessons" / lesson_id
            )
            dump(lesson_dir / "exercises.json", {
                "exercises": [
                    {
                        "number": "1",
                        "source_number": "1",
                        "group": "问题",
                        "group_id": "g1",
                        "text": "问题",
                    },
                    {
                        "number": "g2-1",
                        "source_number": "1",
                        "group": "练习",
                        "group_id": "g2",
                        "text": "练习",
                    },
                    {
                        "number": "q1",
                        "source_number": None,
                        "group": "作业",
                        "group_id": "g3",
                        "text": "作业",
                    },
                ],
            })
            dump(lesson_dir / "figures.json", {"figures": []})
            args = Namespace(
                root=str(root),
                work=str(root / "work"),
                book="6p",
                edition="modern-us-neutral",
                lesson=[lesson_id],
            )

            self.assertEqual(lesson_answers.cmd_prepare(args), 0)
            template = lesson_answers.load(
                root / "work" / "6p" / "modern-us-neutral" / "lessons"
                / lesson_id / "answer-keys.template.json"
            )
            self.assertEqual(
                [answer["bookRaw"] for answer in template["answers"]],
                ["问题答案", "练习答案", "作业答案"],
            )


if __name__ == "__main__":
    unittest.main()
