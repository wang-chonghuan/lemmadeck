import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import prose_number_signature


class SentenceNumberTests(unittest.TestCase):
    def test_integer_before_sentence_period(self):
        numbers, _ = prose_number_signature(
            "Molecule 2 acts on molecule 1. Molecule 1 acts on molecule 2."
        )
        self.assertEqual(numbers, ["2", "1", "1", "2"])

    def test_signed_integer_and_decimal_before_sentence_period(self):
        numbers, _ = prose_number_signature(
            "The value is -2. The interval ends at 1.7. The maximum is 10."
        )
        self.assertEqual(numbers, ["-2", "1.7", "10"])

    def test_identifiers_and_dotted_versions_are_not_quantities(self):
        numbers, _ = prose_number_signature(
            "F1. x2. v1.2.3. Label 1.2.3 is not a measured quantity."
        )
        self.assertEqual(numbers, [])

    def test_math_and_figure_references_keep_separate_signatures(self):
        numbers, references = prose_number_signature(
            "Molecule 1 has force $F_2$ (Figure 68). Its neighbor is molecule 2."
        )
        self.assertEqual(numbers, ["1", "2"])
        self.assertEqual(references["\u56fe\u53f7"], {"68"})


if __name__ == "__main__":
    unittest.main()
