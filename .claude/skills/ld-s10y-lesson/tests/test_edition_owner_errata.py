"""Independent expectations for TOC-owned figures during erratum reconstruction."""

from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import edition


class OwnerLessonErrataTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.book = self.root / "artifacts" / "fixture"
        self.toc_path = self.root / "toc" / "fixture" / "zh.json"
        self.plate = {
            "meta": {"page": 1, "printed_page": None},
            "blocks": [
                {
                    "kind": "fig", "id": "plate-1", "label": None,
                    "owner_lesson": "first-card", "lines": [],
                },
                {
                    "kind": "cap", "label": None,
                    "owner_lesson": "first-card", "lines": ["Plate caption"],
                },
            ],
        }
        self.first_page = {
            "meta": {
                "page": 10,
                "printed_page": 1,
                "source": {"pdf_sha256": "a" * 64},
                "errata": [
                    {
                        "id": "first-prose", "block": "p0010#2",
                        "original": "$x+x$", "reason": "Registered prose correction.",
                    },
                    {
                        "id": "first-task", "block": "p0010#3",
                        "original": "$y+y$", "reason": "Registered task correction.",
                    },
                ],
            },
            "blocks": [
                {"kind": "h3", "lines": ["1. First"]},
                {"kind": "p", "lines": ["Printed $x+x$."]},
                {"kind": "ex", "label": "1", "lines": ["Explain $y+y$."]},
            ],
        }
        self.second_page = {
            "meta": {"page": 20, "printed_page": 2},
            "blocks": [
                {"kind": "h3", "lines": ["2. Second"]},
                {"kind": "p", "lines": ["Unrelated text."]},
            ],
        }
        self.toc = {
            "contents": [{
                "kind": "chapter", "id": "fixture-chapter", "title": "Fixture", "page": 1,
                "lessons": [
                    {
                        "id": "first-card", "title": "First", "page": 1,
                        "printedNumber": 1,
                        "source": {"printedName": "1. First"},
                    },
                    {
                        "id": "second-card", "title": "Second", "page": 2,
                        "printedNumber": 2,
                        "source": {"printedName": "2. Second"},
                    },
                ],
            }],
        }
        self.lesson = {
            "id": "first-card", "card_id": "first-card",
            "number": "1", "title": "First", "printed_title": "1. First",
            "start_page": 10, "start_printed": 1,
            "prose": [
                {
                    "kind": "p", "id": None, "label": None, "printed_page": 1,
                    "text": "Printed $x+x$.", "source_refs": ["p0010#2"],
                },
                {
                    "kind": "fig", "id": "plate-1", "label": None,
                    "printed_page": None, "text": "", "source_refs": ["p0001#1"],
                },
                {
                    "kind": "cap", "id": None, "label": None,
                    "printed_page": None, "text": "Plate caption",
                    "source_refs": ["p0001#2"],
                },
            ],
        }
        self.exercises = {
            "lesson": "first-card", "count": 1,
            "exercises": [{
                "number": "1", "source_number": "1", "group": None, "group_id": "g0",
                "text": "Explain $y+y$.", "pages": ["p0010#3"],
            }],
        }
        self.write(self.book / "book.json", {"exercise_numbering": "lesson-group"})
        self.write(self.book / "pages" / "0001" / "page.json", self.plate)
        self.write(self.book / "pages" / "0010" / "page.json", self.first_page)
        self.write(self.book / "pages" / "0020" / "page.json", self.second_page)
        self.write(self.toc_path, self.toc)

    @staticmethod
    def write(path: Path, value: dict) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(value) + "\n", encoding="utf-8")

    def test_owned_plate_and_registered_errata_bind_exact_targets(self) -> None:
        page_path = self.book / "pages" / "0010" / "page.json"
        page_sha = hashlib.sha256(page_path.read_bytes()).hexdigest()
        records = edition.source_errata(self.book, self.lesson, self.exercises)
        self.assertEqual(records, [
            {
                "id": "first-prose", "target": "lesson.prose[0]",
                "source": {
                    "page": 10, "printed_page": 1, "block": "p0010#2",
                    "sha256": page_sha, "pdf_sha256": "a" * 64,
                },
                "original": "$x+x$", "corrected": "",
                "reason": "Registered prose correction.",
            },
            {
                "id": "first-task", "target": "exercises[0]",
                "source": {
                    "page": 10, "printed_page": 1, "block": "p0010#3",
                    "sha256": page_sha, "pdf_sha256": "a" * 64,
                },
                "original": "$y+y$", "corrected": "",
                "reason": "Registered task correction.",
            },
        ])

    def test_unrelated_lesson_does_not_inherit_registered_errata(self) -> None:
        lesson = {
            "id": "second-card", "card_id": "second-card",
            "number": "2", "title": "Second", "printed_title": "2. Second",
            "start_page": 20, "start_printed": 2,
            "prose": [{
                "kind": "p", "id": None, "label": None, "printed_page": 2,
                "text": "Unrelated text.", "source_refs": ["p0020#2"],
            }],
        }
        exercises = {"lesson": "second-card", "count": 0, "exercises": []}
        self.assertEqual(edition.source_errata(self.book, lesson, exercises), [])

    def test_missing_owner_is_rejected_not_dropped(self) -> None:
        for block in self.plate["blocks"]:
            block["owner_lesson"] = "missing-card"
        self.write(self.book / "pages" / "0001" / "page.json", self.plate)
        with self.assertRaisesRegex(SystemExit, "owner-lesson missing-card"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_ambiguous_toc_match_is_rejected(self) -> None:
        duplicate = copy.deepcopy(self.toc["contents"][0]["lessons"][0])
        duplicate["id"] = "another-first-card"
        self.toc["contents"][0]["lessons"].append(duplicate)
        self.write(self.toc_path, self.toc)
        with self.assertRaisesRegex(SystemExit, "owner-lesson first-card"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_duplicate_source_identity_is_rejected(self) -> None:
        duplicate = copy.deepcopy(self.first_page)
        duplicate["meta"] = {"page": 11, "printed_page": 1}
        self.write(self.book / "pages" / "0011" / "page.json", duplicate)
        with self.assertRaisesRegex(SystemExit, "owner-lesson first-card"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_wrong_declared_stable_ids_are_rejected(self) -> None:
        for document, field in (
            ("lesson", "id"), ("lesson", "card_id"), ("exercises", "lesson"),
        ):
            with self.subTest(document=document, field=field):
                lesson = copy.deepcopy(self.lesson)
                exercises = copy.deepcopy(self.exercises)
                target = lesson if document == "lesson" else exercises
                target[field] = "wrong-card"
                with self.assertRaisesRegex(SystemExit, "权威 TOC 卡片不一致"):
                    edition.source_errata(self.book, lesson, exercises)

    def test_wrong_populated_source_ref_is_rejected(self) -> None:
        self.lesson["prose"][0]["source_refs"] = ["p0020#2"]
        with self.assertRaisesRegex(SystemExit, "来源引用与权威页装订身份不一致"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_registered_original_drift_is_rejected(self) -> None:
        self.lesson["prose"][0]["text"] = "Printed $x-x$."
        with self.assertRaisesRegex(SystemExit, "original 未唯一"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_missing_toc_is_rejected_for_explicit_owner(self) -> None:
        self.toc_path.unlink()
        with self.assertRaisesRegex(SystemExit, "无法从权威页绑定 owner-lesson"):
            edition.source_errata(self.book, self.lesson, self.exercises)

    def test_legacy_refs_are_recovered_without_dropping_errata(self) -> None:
        for block in self.lesson["prose"]:
            block.pop("source_refs")
        self.exercises["exercises"][0].pop("pages")
        records = edition.source_errata(self.book, self.lesson, self.exercises)
        self.assertEqual(
            [(record["id"], record["target"]) for record in records],
            [("first-prose", "lesson.prose[0]"), ("first-task", "exercises[0]")],
        )


if __name__ == "__main__":
    unittest.main()
