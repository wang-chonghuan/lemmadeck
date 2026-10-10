from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import normalize_numbered_subparts, validate_text


class SentencePartBoundaryTest(unittest.TestCase):
    def test_period_before_first_part_does_not_hide_it(self):
        source = "Compute.1) $24-(-13)$;3) $-4.3-5.4$;2) $-33-16$;4) $4.7-(-2)$."
        expected = "Compute.\n1) $24-(-13)$;\n2) $-33-16$;\n3) $-4.3-5.4$;\n4) $4.7-(-2)$."
        self.assertEqual(normalize_numbered_subparts(source), expected)
        self.assertEqual(validate_text(source, expected, ["layout"], [], "exercise", []), [])

    def test_decimal_closing_parenthesis_is_not_a_part(self):
        source = "Value 2.1) then 2) $b$; 3) $c$."
        self.assertEqual(normalize_numbered_subparts(source), source)

    def test_formula_content_is_not_a_part(self):
        source = "Compute.1) $(2.1)$;2) $(3.2)$."
        self.assertEqual(
            normalize_numbered_subparts(source),
            "Compute.\n1) $(2.1)$;\n2) $(3.2)$.",
        )


if __name__ == "__main__":
    unittest.main()
