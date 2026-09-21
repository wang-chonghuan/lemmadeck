from __future__ import annotations

import json
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
REPO = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(TOOLS))

import answers


def dump(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


class CapturedAnswersTest(unittest.TestCase):
    def test_shared_physics_pdf_resolves_through_manifest(self) -> None:
        books = REPO / "ssot-resources/soviet10year-textbooks/sources"
        paths = []
        for book in ("6p", "7p"):
            args = Namespace(book=book, books=str(books), series=None, pdf=None)
            paths.append(answers.find_pdf(args))
            self.assertEqual(answers.exercise_numbering(args), "lesson-group")

        self.assertEqual(paths[0], paths[1])
        self.assertEqual(
            paths[0].name,
            "6-7p 苏联中学课本 物理 六-七年级.pdf",
        )

    def test_group_scoped_capture_requires_stable_identity_and_source_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "answers.json"
            dump(path, {
                "schema": answers.SCHEMA,
                "book": "6p",
                "source": {
                    "pdfPages": [31],
                },
                "answers": [
                    {
                        "exerciseId": "1",
                        "lesson": "phy6-c2-s4",
                        "groupId": "g1",
                        "group": "问题",
                        "sourceNumber": 1,
                        "raw": "答一",
                        "pdfPage": 31,
                    },
                    {
                        "exerciseId": "g2-1",
                        "lesson": "phy6-c2-s4",
                        "groupId": "g2",
                        "group": "练习",
                        "sourceNumber": 1,
                        "raw": "答二",
                        "pdfPage": 31,
                    },
                    {
                        "exerciseId": "q1",
                        "lesson": "phy6-c2-s4",
                        "groupId": "g3",
                        "group": "作业",
                        "sourceNumber": None,
                        "raw": "答三",
                        "pdfPage": 31,
                    },
                ],
            })

            _, errors = answers.validate_answer_file(
                path,
                "6p",
                "lesson-group",
            )

            self.assertEqual(errors, [])

    def test_group_scoped_order_uses_natural_numeric_keys(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "answers.json"
            dump(path, {
                "schema": answers.SCHEMA,
                "book": "6p",
                "source": {
                    "pdfPages": [31],
                },
                "answers": [
                    {
                        "exerciseId": "g2-2",
                        "lesson": "phy6-c2-s4",
                        "groupId": "g2",
                        "group": "练习",
                        "sourceNumber": "2",
                        "raw": "答二",
                        "pdfPage": 31,
                    },
                    {
                        "exerciseId": "g2-10",
                        "lesson": "phy6-c2-s4",
                        "groupId": "g2",
                        "group": "练习",
                        "sourceNumber": "10",
                        "raw": "答十",
                        "pdfPage": 31,
                    },
                ],
            })

            _, errors = answers.validate_answer_file(path, "6p", "lesson-group")

            self.assertEqual(errors, [])

    def test_group_scoped_capture_requires_explicit_group(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "answers.json"
            dump(path, {
                "schema": answers.SCHEMA,
                "book": "6p",
                "source": {
                    "pdfPages": [31],
                },
                "answers": [{
                    "exerciseId": "q1",
                    "lesson": "phy6-c2-s4",
                    "groupId": "g3",
                    "sourceNumber": None,
                    "raw": "作业答案",
                    "pdfPage": 31,
                }],
            })

            _, errors = answers.validate_answer_file(path, "6p", "lesson-group")

            self.assertTrue(any(".group 必须显式记录" in error for error in errors))

    def test_book_scoped_capture_remains_backward_compatible(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "answers.json"
            dump(path, {
                "schema": answers.SCHEMA,
                "book": "5m",
                "source": {
                    "pdfPages": [305],
                },
                "answers": [{
                    "exercise": 9,
                    "raw": "18 卢布",
                    "pdfPage": 305,
                }],
            })

            _, errors = answers.validate_answer_file(path, "5m", "book")

            self.assertEqual(errors, [])

    def test_legacy_finalize_does_not_add_numbering_to_audit(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp) / "artifacts"
            books = Path(temp) / "sources"
            dump(root / "5m" / "answers.json", {
                "schema": answers.SCHEMA,
                "book": "5m",
                "source": {
                    "pdfPages": [305],
                },
                "answers": [{
                    "exercise": 9,
                    "raw": "18 卢布",
                    "pdfPage": 305,
                }],
            })
            args = Namespace(book="5m", root=str(root), books=str(books))

            self.assertEqual(answers.cmd_finalize(args), 0)
            audit = json.loads(
                (root / "5m" / "answers.audit.json").read_text(encoding="utf-8")
            )

            self.assertNotIn("exerciseNumbering", audit)


if __name__ == "__main__":
    unittest.main()
