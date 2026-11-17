import argparse
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import edition


class PartialEditionIndexTests(unittest.TestCase):
    def test_successful_lesson_is_indexed_when_peer_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            book = root / "book"
            target = book / "editions" / "modern-us-neutral"
            work = root / "work"
            book.mkdir()
            target.mkdir(parents=True)
            profile_path = root / "profile.json"
            profile_path.write_text('{"id":"test"}', encoding="utf-8")
            (book / "book.json").write_text(json.dumps({
                "lessons": [{"id": name} for name in ["old", "good", "bad"]],
            }), encoding="utf-8")
            old = {"id": "old", "number": "1", "title": "Existing"}
            (target / "book.json").write_text(json.dumps({
                "schema": edition.BOOK_SCHEMA, "edition": target.name,
                "status": "ready", "lessons": [old],
            }), encoding="utf-8")
            lesson = {
                "number": "2", "title": "Complete", "source": {"sha256": "lesson-sha"},
                "prose": [{"text": "Definition.", "source_text": "Definition."}],
                "section_breaks": [], "errata": [],
            }
            exercises = {"source": {"sha256": "exercise-sha"}, "exercises": []}
            figures = {"figures": []}
            args = argparse.Namespace(profile=str(profile_path), edition=target.name)
            with (
                patch.object(edition, "source_dir", return_value=book),
                patch.object(edition, "edition_dir", return_value=target),
                patch.object(edition, "work_edition_dir", return_value=work),
                patch.object(edition, "selected_lessons", return_value=["good", "bad"]),
                patch.object(edition, "validate_lesson", side_effect=[
                    (lesson, exercises, figures, []),
                    ({}, {}, {}, ["Bad lesson boundary."]),
                ]),
                patch.object(edition, "prose_flow_contract", return_value=({"boundaries": []}, [])),
            ):
                result = edition.cmd_finalize(args)
            self.assertEqual(result, 2)
            index = json.loads((target / "book.json").read_text(encoding="utf-8"))
            self.assertEqual([item["id"] for item in index["lessons"]], ["old", "good"])
            self.assertEqual(index["lessons"][0], old)
            self.assertEqual(index["lessons"][1]["source_lesson_sha256"], "lesson-sha")
            self.assertEqual(
                json.loads((target / "lessons/good/adaptation.audit.json").read_text())["status"],
                "pass",
            )
            self.assertEqual(
                json.loads((target / "lessons/bad/adaptation.audit.json").read_text())["status"],
                "fail",
            )
            self.assertFalse((target / "lessons/bad/lesson.json").exists())


if __name__ == "__main__":
    unittest.main()
