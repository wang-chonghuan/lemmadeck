"""Sentence/formula layout contracts independent of source print-line wrapping."""

import unittest

import edition


class AsciiSentenceLayoutTests(unittest.TestCase):
    def test_six_sentences_become_two_short_paragraphs(self):
        source = "First sentence. Second sentence. Third sentence. Fourth sentence. Fifth sentence. Sixth sentence."
        self.assertEqual(
            edition.normalize_prose_layout(source),
            "First sentence.\nSecond sentence.\nThird sentence.\n\nFourth sentence.\nFifth sentence.\nSixth sentence.",
        )

    def test_decimal_is_not_a_sentence_boundary(self):
        self.assertEqual(
            edition.normalize_prose_layout("Value is 3.50. Next is 0.80."),
            "Value is 3.50.\nNext is 0.80.",
        )

    def test_leading_heading_ordinal_is_not_a_sentence(self):
        for marker in ("", "*", "**", "***"):
            with self.subTest(marker=marker):
                source = f"{marker}2. Heading.{marker} First sentence. Second sentence."
                expected = f"{marker}2. Heading.{marker}\nFirst sentence.\nSecond sentence."
                actual = edition.normalize_prose_layout(source)
                self.assertEqual(actual, expected)
                self.assertEqual(edition.normalize_prose_layout(actual), expected)

    def test_sentence_ending_integer_still_breaks(self):
        self.assertEqual(
            edition.normalize_prose_layout("The number is 2. Next sentence."),
            "The number is 2.\nNext sentence.",
        )

    def test_math_periods_remain_inside_math(self):
        self.assertEqual(
            edition.normalize_prose_layout("Take $0.50$ kg. Then use $Q=cm(20.5-10.5)$."),
            "Take $0.50$ kg.\nThen use $Q=cm(20.5-10.5)$.",
        )

    def test_ellipsis_is_not_three_sentences(self):
        self.assertEqual(
            edition.normalize_prose_layout("Consider... the change. Then compare."),
            "Consider... the change.\nThen compare.",
        )

    def test_parenthetical_period_is_not_a_boundary(self):
        self.assertEqual(
            edition.normalize_prose_layout("Compare (first case. second case). Then solve."),
            "Compare (first case. second case).\nThen solve.",
        )

    def test_closing_bold_does_not_hide_introduced_formula(self):
        self.assertEqual(
            edition.normalize_prose_layout("**Multiply the mass by its value:**$Q=qm$, where $q$ is the value."),
            "**Multiply the mass by its value:**\n$Q=qm$,\nwhere $q$ is the value.",
        )

    def test_inline_bold_stays_with_its_sentence(self):
        self.assertEqual(
            edition.normalize_prose_layout("This is **the rule.** Next sentence."),
            "This is **the rule.**\nNext sentence.",
        )

    def test_normalization_is_idempotent_and_retains_tokens(self):
        source = "**Use $m=0.50$ kg. Then calculate:**$Q=qm$, where $q$ is known."
        result = edition.normalize_prose_layout(source)
        self.assertEqual(edition.normalize_prose_layout(result), result)
        self.assertEqual("".join(result.split()), "".join(source.split()))


if __name__ == "__main__":
    unittest.main()
