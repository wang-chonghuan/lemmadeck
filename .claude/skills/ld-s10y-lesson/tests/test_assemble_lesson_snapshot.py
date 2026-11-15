import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import can_reuse_lesson


class LessonSnapshotTests(unittest.TestCase):
    def setUp(self):
        self.old = {
            "id": "phy6-c1-s2",
            "exercise_count": 5,
            "prose": [{"kind": "p", "text": "Source paragraph.", "printed_page": 2}],
        }
        self.new = copy.deepcopy(self.old)
        self.new["prose"][0]["source_refs"] = ["p0013#1"]

    def test_optional_provenance_does_not_replace_completed_snapshot(self):
        self.assertTrue(can_reuse_lesson(self.old, self.new))

    def test_changed_source_text_requires_rebuild(self):
        self.new["prose"][0]["text"] = "Changed source paragraph."
        self.assertFalse(can_reuse_lesson(self.old, self.new))

    def test_existing_provenance_must_match(self):
        self.old["prose"][0]["source_refs"] = ["p0014#1"]
        self.assertFalse(can_reuse_lesson(self.old, self.new))

    def test_changed_exercise_count_requires_rebuild(self):
        self.new["exercise_count"] = 6
        self.assertFalse(can_reuse_lesson(self.old, self.new))


if __name__ == "__main__":
    unittest.main()
