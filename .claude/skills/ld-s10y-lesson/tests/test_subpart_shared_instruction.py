import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import normalize_numbered_subparts


class SharedInstructionLayoutTests(unittest.TestCase):
    def test_explicit_shared_paragraph_stays_after_complete_list(self):
        text = "660. Find the set:\na) $8$;\nb) $-1$.\n\nShow the whole set."
        self.assertEqual(normalize_numbered_subparts(text), text)

    def test_reordering_keeps_the_shared_paragraph_last(self):
        text = "Find:\nb) $-1$; a) $8$.\n\nShow the whole set."
        expected = "Find:\na) $8$.\nb) $-1$;\n\nShow the whole set."
        self.assertEqual(normalize_numbered_subparts(text), expected)

    def test_source_soft_wrap_does_not_become_an_extra_paragraph(self):
        text = "Find: a) $1+2$\ncontinued; b) $3+4$."
        expected = "Find:\na) $1+2$ continued;\nb) $3+4$."
        self.assertEqual(normalize_numbered_subparts(text), expected)

    def test_blank_line_inside_math_is_not_a_paragraph(self):
        text = "Find: a) $\\frac{1\n\n}{2}$; b) $3$."
        expected = "Find:\na) $\\frac{1 }{2}$;\nb) $3$."
        self.assertEqual(normalize_numbered_subparts(text), expected)


if __name__ == "__main__":
    unittest.main()
