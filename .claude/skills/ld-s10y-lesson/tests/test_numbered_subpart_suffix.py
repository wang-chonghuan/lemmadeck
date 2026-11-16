import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import normalize_numbered_subparts


class NumberedSubpartSuffixTests(unittest.TestCase):
    def assert_normalizes(self, source, expected):
        actual = normalize_numbered_subparts(source)
        self.assertEqual(actual, expected)
        self.assertEqual(normalize_numbered_subparts(actual), expected)

    def test_complete_task_retains_independent_tail_paragraphs(self):
        text = (
            "8. Construct the section.\n"
            "The given points are interior.\n\n"
            "Assume the construction is available.\n"
            "Use the two intersections.\n"
            "Construction:\n"
            "1) $[UV]\\mathbin{//}(AC)$, $V\\in[BC]$;\n"
            "2) $[WX]\\mathbin{//}(AC)$, $X\\in[DC]$.\n"
            "The quadrilateral is the section.\n\n"
            "Its plane has the required direction.\n"
            "The intersection determines a unique point.\n\n"
            "Plan the construction first.\n"
            "Then verify every given condition.\n"
        )
        self.assert_normalizes(text, text.rstrip())

    def test_explicit_blank_boundary_needs_no_sentence_keyword(self):
        text = "Data:\n1) $a$\n2) $b$\n\nA new paragraph\nAnother existing line"
        self.assert_normalizes(text, text)

    def test_completed_sentence_lines_survive_without_blank_separator(self):
        text = (
            "Evaluate:\n1) $a$;\n2) $b$.\n"
            "A complete statement.\nA second complete statement.\n\n"
            "A final paragraph."
        )
        self.assert_normalizes(text, text)

    def test_cjk_sentence_and_closing_quote_boundaries(self):
        text = (
            "7. List:\n1) First;\n2) \"Second\u3002\"\n"
            "Third\u3002\nFourth\u3002\n\nFifth\u3002"
        )
        self.assert_normalizes(text, text)

    def test_inline_subparts_sort_and_wrapped_continuations_join(self):
        self.assert_normalizes(
            "Evaluate: 2) find the\n  perimeter. 1) find the\n  area;",
            "Evaluate:\n1) find the area;\n2) find the perimeter.",
        )

    def test_independent_suffix_stays_after_the_sorted_sequence(self):
        self.assert_normalizes(
            "List: 2) $b$; 1) $a$.\n\nA separate paragraph.\nIts next sentence.",
            "List:\n1) $a$.\n2) $b$;\n\nA separate paragraph.\nIts next sentence.",
        )

    def test_numeric_prefix_and_marker_only_line(self):
        self.assert_normalizes(
            "11.1) Find the\nlength;\n2)\n  give the units.",
            "11.\n1) Find the length;\n2) give the units.",
        )

    def test_inline_tail_is_not_promoted_to_a_new_paragraph(self):
        self.assert_normalizes(
            "List: 1) $a$; 2) $b$. An inline statement.",
            "List:\n1) $a$;\n2) $b$. An inline statement.",
        )

    def test_colon_continuation_is_not_a_completed_sentence(self):
        self.assert_normalizes(
            "List:\n1) $a$;\n2) Give:\n  $b$.",
            "List:\n1) $a$;\n2) Give: $b$.",
        )

    def test_sentence_punctuation_and_blank_lines_inside_math_are_not_boundaries(self):
        self.assert_normalizes(
            "Compute:\n1) $a$;\n2) $\\text{term.}\n\n+b$.",
            "Compute:\n1) $a$;\n2) $\\text{term.} +b$.",
        )

    def test_math_punctuation_does_not_end_a_wrapped_sentence(self):
        self.assert_normalizes(
            "List:\n1) $a$;\n2) $\\text{term.}$\n  with a condition.",
            "List:\n1) $a$;\n2) $\\text{term.}$ with a condition.",
        )

    def test_incomplete_marker_sequence_is_not_reinterpreted(self):
        text = "List: 1) $a$;\n3) $b$.\n\nA separate note."
        self.assert_normalizes(text, text)

    def test_two_columns_keep_source_column_membership(self):
        self.assert_normalizes(
            "Compute:\n1) $a$\u3000\u30002) $b$\n"
            "$c$\u3000\u3000$d$\n$e$\u3000\u3000$f$.",
            "Compute:\n1) $a$ $c$ $e$\n2) $b$ $d$ $f$.",
        )

    def test_two_columns_also_retain_independent_suffix(self):
        self.assert_normalizes(
            "Compute:\n1) $a$\u3000\u30002) $b$\n"
            "$c$\u3000\u3000$d$.\n\n"
            "Explain the result.\nState its domain.",
            "Compute:\n1) $a$ $c$\n2) $b$ $d$.\n\n"
            "Explain the result.\nState its domain.",
        )

    def test_blank_between_table_rows_is_not_a_prose_suffix(self):
        self.assert_normalizes(
            "Compute:\n1) $a$\u3000\u30002) $b$\n\n"
            "$c$\u3000\u3000$d$\n$e$\u3000\u3000$f$.\n\n"
            "An independent paragraph.\nAnother complete sentence.",
            "Compute:\n1) $a$ $c$ $e$\n2) $b$ $d$ $f$.\n\n"
            "An independent paragraph.\nAnother complete sentence.",
        )

    def test_table_blank_suffix_boundary_needs_no_punctuation(self):
        self.assert_normalizes(
            "Compute:\n1) $a$\u3000\u30002) $b$\n"
            "$c$\u3000\u3000$d$\n\nA separate paragraph.",
            "Compute:\n1) $a$ $c$\n2) $b$ $d$\n\nA separate paragraph.",
        )

    def test_no_alignment_evidence_does_not_invent_columns(self):
        self.assert_normalizes(
            "Compute: 1) $a$ 2) $b$\n$c$ $d$.",
            "Compute:\n1) $a$\n2) $b$ $c$ $d$.",
        )

    def test_crlf_suffix_preserves_paragraph_structure(self):
        self.assert_normalizes(
            "List:\r\n1) $a$;\r\n2) $b$.\r\n\r\n"
            "One sentence.\r\nAnother sentence.",
            "List:\n1) $a$;\n2) $b$.\n\n"
            "One sentence.\nAnother sentence.",
        )


if __name__ == "__main__":
    unittest.main()
