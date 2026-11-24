#!/usr/bin/env python3
"""Every limit must actually fail. A checker that cannot fail is not a checker."""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import checkpoint as cp


def good(**over):
    doc = {
        "schema": cp.SCHEMA,
        "book": "3m",
        "updated": "2026-11-24T00:00:00Z",
        "lessons": [{"lesson": "math3-c1-ex1", "stage": "published", "commit": "abc1234"}],
        "sessions": [{"session": "s1", "turns": 30, "input": 1, "cached": 2, "output": 3, "total": 6}],
    }
    doc.update(over)
    return doc


class Shape(unittest.TestCase):
    def test_good_document_validates(self):
        cp.validate(good())

    def test_unknown_top_level_key_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "unknown keys: activeHumanDirection"):
            cp.validate(good(activeHumanDirection="…"))

    def test_missing_top_level_key_fails(self):
        doc = good()
        del doc["sessions"]
        with self.assertRaisesRegex(cp.CheckpointError, "missing sessions"):
            cp.validate(doc)

    def test_wrong_schema_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "schema must be"):
            cp.validate(good(schema="lemmadeck/content-production-meter@1"))

    def test_unknown_row_key_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, r"lessons\[0\] has unknown keys: resume"):
            cp.validate(good(lessons=[{"lesson": "a", "stage": "held", "resume": "…"}]))

    def test_nested_object_in_a_row_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "note must be a string"):
            cp.validate(good(lessons=[{"lesson": "a", "stage": "held", "note": {"deep": 1}}]))


class Limits(unittest.TestCase):
    def test_over_long_field_fails_and_names_the_limit(self):
        with self.assertRaisesRegex(cp.CheckpointError, f"is 201 characters, limit is {cp.MAX_STR}"):
            cp.validate(good(lessons=[{"lesson": "a", "stage": "held", "note": "x" * 201}]))

    def test_field_at_the_limit_passes(self):
        cp.validate(good(lessons=[{"lesson": "a", "stage": "held", "note": "x" * cp.MAX_STR}]))

    def test_over_size_document_fails(self):
        rows = [{"lesson": f"l{i}", "stage": "published", "note": "x" * cp.MAX_STR}
                for i in range(4000)]
        with self.assertRaisesRegex(cp.CheckpointError, f"limit is {cp.MAX_BYTES}"):
            cp.serialize(good(lessons=rows))

    def test_negative_counter_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "must not be negative"):
            cp.validate(good(sessions=[{"session": "s", "total": -1}]))

    def test_non_integer_counter_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "must be an integer"):
            cp.validate(good(sessions=[{"session": "s", "total": "1,234"}]))


class Stages(unittest.TestCase):
    def test_free_text_stage_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "stage must be one of"):
            cp.validate(good(lessons=[
                {"lesson": "a", "stage": "active-1817-explicit-human-resume-after-pause"}
            ]))

    def test_every_declared_stage_passes(self):
        for stage in cp.STAGES:
            cp.validate(good(lessons=[{"lesson": "a", "stage": stage}]))

    def test_duplicate_lesson_fails(self):
        with self.assertRaisesRegex(cp.CheckpointError, "duplicate"):
            cp.validate(good(lessons=[
                {"lesson": "a", "stage": "held"}, {"lesson": "a", "stage": "published"}
            ]))


class Writing(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.path = Path(self.dir.name) / "checkpoint.json"
        cp.store(self.path, good())
        self.addCleanup(self.dir.cleanup)

    def test_rejected_write_leaves_the_file_untouched(self):
        before = self.path.read_bytes()
        with self.assertRaises(cp.CheckpointError):
            cp.store(self.path, good(lessons=[{"lesson": "a", "stage": "held", "note": "x" * 999}]))
        self.assertEqual(before, self.path.read_bytes())

    def test_no_temp_file_is_left_behind(self):
        with self.assertRaises(cp.CheckpointError):
            cp.store(self.path, good(book="x" * 999))
        leftovers = list(Path(self.dir.name).glob(".checkpoint-*"))
        self.assertEqual([], leftovers)

    def test_round_trip(self):
        self.assertEqual(good(), cp.load(self.path))

    def test_check_command_fails_on_an_injected_over_long_field(self):
        doc = good()
        doc["lessons"][0]["note"] = "x" * 400
        self.path.write_text(json.dumps(doc, ensure_ascii=False), encoding="utf-8")
        self.assertEqual(1, cp.main(["check", "--path", str(self.path)]))

    def test_check_command_passes_on_a_good_file(self):
        self.assertEqual(0, cp.main(["check", "--path", str(self.path)]))

    def test_upsert_updates_in_place(self):
        doc = good()
        cp.upsert(doc["lessons"], "lesson", "math3-c1-ex1", {"stage": "published", "note": None})
        self.assertEqual(1, len(doc["lessons"]))
        self.assertEqual("abc1234", doc["lessons"][0]["commit"])


if __name__ == "__main__":
    unittest.main()
