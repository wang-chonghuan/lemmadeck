import importlib.util
from pathlib import Path
import sys
import unittest


TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
SPEC = importlib.util.spec_from_file_location("edition", TOOLS / "edition.py")
edition = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(edition)


class AdjacentExerciseSubpartTests(unittest.TestCase):
    def test_printed_prefix_is_not_a_decimal(self):
        source = "578.1) $x+2$；2) $x-3$."
        modern = "578.\n1) $x+2$；\n2) $x-3$."
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            edition.normalize_numbered_subparts(modern),
        )
        self.assertEqual(
            edition.validate_text(source, modern, ["layout"], [], "exercise", []),
            [],
        )

    def test_decimal_without_subpart_parenthesis_is_preserved(self):
        self.assertEqual(edition.normalize_numbered_subparts("578.1厘米"), "578.1厘米")
        self.assertEqual(edition.normalize_numbered_subparts("值为578.1)"), "值为578.1)")

    def test_math_decimal_is_not_rewritten(self):
        self.assertEqual(edition.normalize_numbered_subparts("$578.1$"), "$578.1$")


if __name__ == "__main__":
    unittest.main()
