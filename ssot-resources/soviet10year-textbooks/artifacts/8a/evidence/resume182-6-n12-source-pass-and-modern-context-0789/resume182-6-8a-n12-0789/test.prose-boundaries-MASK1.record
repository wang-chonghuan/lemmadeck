import unittest

import edition


class ProseLayoutContract(unittest.TestCase):
    def test_explicit_paragraph_boundary_survives(self):
        source = "First sentence.\n\nSecond sentence."
        self.assertEqual(edition.normalize_prose_layout(source), source)

    def test_formula_tail_stays_attached(self):
        source = "\u5f97\u5230\uff1a\n$b_1=1$\uff0c\n$b_2=3$\uff0c\u7b49\u7b49."
        normalized = edition.normalize_prose_layout(source)
        self.assertIn("$b_2=3$\uff0c\u7b49\u7b49.", normalized)
        self.assertNotIn("\n\n\u7b49\u7b49.", normalized)
        self.assertEqual(edition.math_signature(normalized), edition.math_signature(source))

    def test_blank_line_inside_math_is_not_a_paragraph_boundary(self):
        source = "A formula:\n$x+\n\n1$."
        normalized = edition.normalize_prose_layout(source)
        self.assertNotIn("\n\n", normalized)
        self.assertEqual(edition.math_signature(normalized), edition.math_signature(source))

    def test_multi_formula_example_is_idempotent(self):
        source = (
            "A formula gives the sequence:\n$b_n=n^2-n+1$.\n\n"
            "Substitution gives:\n"
            "$b_1=1^2-1+1=1$\uff0c\n"
            "$b_2=2^2-2+1=3$\uff0c\n"
            "$b_3=3^2-3+1=7$\uff0c\n"
            "$b_4=4^2-4+1=13$\uff0c\u7b49\u7b49."
        )
        normalized = edition.normalize_prose_layout(source)
        self.assertEqual(edition.normalize_prose_layout(normalized), normalized)
        self.assertEqual(edition.math_signature(normalized), edition.math_signature(source))
        self.assertIn("$b_4=4^2-4+1=13$\uff0c\u7b49\u7b49.", normalized)
        self.assertEqual(normalized.count("\n\n"), 1)


if __name__ == "__main__":
    unittest.main()
