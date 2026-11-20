import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class ModelDesignationNumberSignatureTest(unittest.TestCase):
    def test_cyrillic_and_latin_model_hyphens_agree(self):
        self.assertEqual(edition.number_signature("\u0411\u042d\u0421\u041c-2"), ["2"])
        self.assertEqual(edition.number_signature("BESM-2"), ["2"])

    def test_two_component_designations_agree(self):
        self.assertEqual(edition.number_signature("\u0415\u0421-10-50"), ["10", "50"])
        self.assertEqual(edition.number_signature("EC-10-50"), ["10", "50"])

    def test_embedded_letter_suffix_does_not_become_a_number(self):
        self.assertEqual(edition.number_signature("A2B"), [])
        self.assertEqual(edition.number_signature("\u04102\u0412"), [])

    def test_real_negative_numbers_keep_their_sign(self):
        self.assertEqual(edition.number_signature("-2, -10, -0.01"), ["-2", "-10", "-0.01"])

    def test_chinese_adjacent_numbers_are_still_checked(self):
        self.assertEqual(
            edition.number_signature("\u5e74\u4efd1975\u5e74\uff0c\u51cf\u5c11-2\u6b21"),
            ["1975", "-2"],
        )

    def test_formula_numbers_are_not_counted_as_prose(self):
        self.assertEqual(edition.number_signature("EC-10-50 $8\\cdot10^3$ 1975"), ["10", "50", "1975"])

    def test_changed_model_digits_are_not_ignored(self):
        self.assertNotEqual(
            edition.number_signature("\u0415\u0421-10-50"),
            edition.number_signature("EC-10-51"),
        )

    def test_changed_negative_prose_value_is_not_ignored(self):
        self.assertNotEqual(edition.number_signature("-2"), edition.number_signature("2"))

    def test_punctuation_and_decimal_boundaries(self):
        self.assertEqual(edition.number_signature("(1.5); 0.05; 1975"), ["1.5", "0.05", "1975"])


if __name__ == "__main__":
    unittest.main()
