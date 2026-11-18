from __future__ import annotations

import sys
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import normalize


class EnumScriptTest(unittest.TestCase):
    def test_printed_proof_square_keeps_forbidden_math_characters_rejected(self) -> None:
        profile = normalize.load_profile(TOOLS.parent / "profiles" / "soviet-cn.json")
        self.assertEqual(normalize.check_charset("\u25a0", profile), [])
        self.assertTrue(normalize.check_charset("\u2212", profile))
        self.assertTrue(normalize.check_charset("\u00b2", profile))

    def test_late_cyrillic_exercise_markers_are_accepted(self) -> None:
        self.assertEqual(normalize.enum_key_script("л"), "cyrillic")
        self.assertEqual(normalize.enum_key_script("м"), "cyrillic")


if __name__ == "__main__":
    unittest.main()
