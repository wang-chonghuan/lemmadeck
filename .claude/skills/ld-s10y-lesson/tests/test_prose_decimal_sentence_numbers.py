import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import prose_number_signature, validate_text


class ProseDecimalSentenceNumbers(unittest.TestCase):
    def test_source_and_localized_sentence_stops_keep_decimal_values(self):
        source = r"$n_1=$1.33. $n_2=$1.343."
        localized = r"$n_1=$1.33。 $n_2=$1.343。"
        self.assertEqual(prose_number_signature(source)[0], ["1.33", "1.343"])
        self.assertEqual(prose_number_signature(source), prose_number_signature(localized))
        self.assertEqual(
            validate_text(source, localized, ["translation"], [], "t12-q2", []),
            [],
        )

    def test_a_changed_decimal_still_fails_conservation(self):
        errors = validate_text(
            r"$n_1=$1.33.", r"$n_1=$1.34。", ["translation"], [], "t12-q2", []
        )
        self.assertTrue(any("want=['1.33'], got=['1.34']" in error for error in errors))

    def test_existing_decimal_boundaries_and_signs_are_preserved(self):
        self.assertEqual(
            prose_number_signature("1.33, -1.343. 12.5; 0.04!")[0],
            ["1.33", "-1.343", "12.5", "0.04"],
        )

    def test_identifier_and_version_fragments_are_not_quantities(self):
        self.assertEqual(
            prose_number_signature("v1.33. 1.33e2. 1.33.4 1.33.name")[0],
            [],
        )

    def test_numbered_references_are_not_decimal_quantities(self):
        self.assertEqual(
            prose_number_signature("Figure 213. 1.33."),
            (["1.33"], {"图号": {"213"}, "节号": set()}),
        )

    def test_numbered_prefix_behavior_is_unchanged(self):
        self.assertEqual(prose_number_signature("2. $n_1=$1.33.")[0], ["1.33"])

    def test_formula_numbers_remain_outside_the_prose_signature(self):
        self.assertEqual(
            prose_number_signature(r"$1.33 + 1.343$ and 2.45.")[0],
            ["2.45"],
        )


if __name__ == "__main__":
    unittest.main()
