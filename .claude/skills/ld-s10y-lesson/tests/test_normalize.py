from __future__ import annotations

import sys
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import normalize


class EnumScriptTest(unittest.TestCase):
    def test_late_cyrillic_exercise_markers_are_accepted(self) -> None:
        self.assertEqual(normalize.enum_key_script("л"), "cyrillic")
        self.assertEqual(normalize.enum_key_script("м"), "cyrillic")


if __name__ == "__main__":
    unittest.main()
