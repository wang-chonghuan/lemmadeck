import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class NumberSentencePunctuationTests(unittest.TestCase):
    def test_sentence_period_and_chinese_full_stop_have_equal_numbers(self):
        self.assertEqual(edition.number_signature("653. 0."), ["653", "0"])
        self.assertEqual(
            edition.number_signature("653. 0."),
            edition.number_signature("653。 0。"),
        )

    def test_decimal_and_negative_value_before_sentence_period(self):
        self.assertEqual(
            edition.number_signature("1.8; -0.97. 263.4."),
            ["1.8", "-0.97", "263.4"],
        )

    def test_changed_numeric_value_remains_a_change(self):
        self.assertNotEqual(
            edition.number_signature("0.64."),
            edition.number_signature("0.65。"),
        )

    def test_embedded_identifiers_and_partial_decimal_are_not_numbers(self):
        self.assertEqual(edition.number_signature("A2B .5 1.2.3"), [])


if __name__ == "__main__":
    unittest.main()
