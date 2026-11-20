import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

from edition import normalize_prose_layout


class ExplicitProseParagraphTests(unittest.TestCase):
    def test_explicit_single_sentence_paragraph_is_not_merged(self):
        text = "First sentence.\nSecond sentence.\nThird sentence.\n\nA new concept."
        self.assertEqual(normalize_prose_layout(text), text)

    def test_explicit_break_remains_after_two_line_formula_paragraph(self):
        text = "The stored energy is:\n$E=q^2/(2C)$.\n\nThe next state has no charge."
        self.assertEqual(normalize_prose_layout(text), text)

    def test_long_paragraph_still_gets_shortened(self):
        text = "One.\nTwo.\nThree.\nFour.\nFive.\nSix.\n\nNew concept."
        self.assertEqual(
            normalize_prose_layout(text),
            "One.\nTwo.\nThree.\n\nFour.\nFive.\nSix.\n\nNew concept.",
        )

    def test_whitespace_only_blank_line_is_a_boundary(self):
        self.assertEqual(
            normalize_prose_layout("One.\nTwo.\n \t\nThree."),
            "One.\nTwo.\n\nThree.",
        )

    def test_bold_closer_stays_with_sentence(self):
        text = "**First sentence;**\nSecond sentence.\nThird sentence.\n\nNew concept."
        self.assertEqual(normalize_prose_layout(text), text)


if __name__ == "__main__":
    unittest.main()
