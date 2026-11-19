import importlib.util
from pathlib import Path
import sys
import unittest


TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
SPEC = importlib.util.spec_from_file_location("edition_sentence_numbers", TOOLS / "edition.py")
edition = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(edition)


class SentencePeriodNumbersTest(unittest.TestCase):
    def test_sentence_period_keeps_integer(self):
        self.assertEqual(edition.number_signature("The coefficient is below 1. Next sentence."), ["1"])

    def test_sentence_period_keeps_decimal(self):
        self.assertEqual(edition.number_signature("The coefficient is 0.04."), ["0.04"])

    def test_full_stop_localization_preserves_numbers(self):
        source = "\u901a\u5e38\u5c0f\u4e8e1. \u7cfb\u6570\u662f0.5\uff0c\u56fe114\uff0c20 N\uff0c10 N."
        modern = source.replace(". ", "\u3002 ").removesuffix(".") + "\u3002"
        expected = ["1", "0.5", "114", "20", "10"]
        self.assertEqual(edition.number_signature(source), expected)
        self.assertEqual(edition.number_signature(modern), expected)

    def test_rejects_partial_decimal_and_word_tokens(self):
        self.assertEqual(edition.number_signature("x12 12x .5 1.2.3 1..2"), [])

    def test_math_is_excluded(self):
        self.assertEqual(edition.number_signature("$F=0.04N$; outside 20."), ["20"])

    def test_sign_and_decimal_survive(self):
        self.assertEqual(edition.number_signature("-3.125. Then 4.5 and 20."), ["-3.125", "4.5", "20"])


if __name__ == "__main__":
    unittest.main()
