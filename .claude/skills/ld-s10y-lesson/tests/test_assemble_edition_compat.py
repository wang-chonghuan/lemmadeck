from __future__ import annotations

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

TOOLS = Path(__file__).resolve().parents[1] / "tools"
SKILL = TOOLS.parent
REPO = Path(__file__).resolve().parents[4]
ARTIFACTS = REPO / "ssot-resources" / "soviet10year-textbooks" / "artifacts"
TOC = REPO / "ssot-resources" / "soviet10year-textbooks" / "toc"
PROFILE = SKILL / "profiles" / "modern-us-neutral.json"
sys.path.insert(0, str(TOOLS))

import assemble
import edition


class AssembleEditionCompatibilityTest(unittest.TestCase):
    def test_reuse_only_allows_new_optional_identity_fields(self) -> None:
        existing = {
            "lesson": "lesson-1",
            "count": 1,
            "exercises": [{"number": "1", "text": "same"}],
        }
        rebuilt = {
            "lesson": "lesson-1",
            "count": 1,
            "exercises": [{
                "number": "1",
                "source_number": "1",
                "group_id": "g0",
                "text": "same",
            }],
        }

        self.assertTrue(assemble._can_reuse_exercises(existing, rebuilt))
        rebuilt["exercises"][0]["text"] = "changed"
        self.assertFalse(assemble._can_reuse_exercises(existing, rebuilt))
        existing["exercises"][0]["source_number"] = "1"
        rebuilt["exercises"][0]["text"] = "same"
        rebuilt["exercises"][0]["source_number"] = "2"
        self.assertFalse(assemble._can_reuse_exercises(existing, rebuilt))

    def assert_noop_reassembly_preserves_edition(
        self,
        book_id: str,
        lesson_id: str,
        exercise_numbering: str,
    ) -> None:
        with tempfile.TemporaryDirectory() as temp:
            book = Path(temp) / book_id
            shutil.copytree(ARTIFACTS / book_id, book)
            source_path = book / "lessons" / lesson_id / "exercises.json"
            source_bytes = source_path.read_bytes()

            with patch.object(assemble.mathcheck, "collect_and_check", return_value=([], [])):
                result = assemble.run(
                    book,
                    TOC / book_id / "zh.json",
                    PROFILE,
                    exercise_numbering=exercise_numbering,
                )

            self.assertEqual(result, 0)
            self.assertEqual(source_path.read_bytes(), source_bytes)
            _, _, _, errors = edition.validate_lesson(
                book,
                book / "editions" / "modern-us-neutral",
                lesson_id,
                json.loads(PROFILE.read_text(encoding="utf-8")),
            )
            self.assertEqual(errors, [])

    def test_6p_noop_reassembly_preserves_existing_edition(self) -> None:
        self.assert_noop_reassembly_preserves_edition(
            "6p",
            "phy6-c1-s2",
            "lesson-group",
        )

    def test_old_math_noop_reassembly_preserves_edition_with_figures(self) -> None:
        self.assert_noop_reassembly_preserves_edition(
            "6a",
            "alg6-c1-s1-n2",
            "book",
        )


if __name__ == "__main__":
    unittest.main()
