import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import number_signature, validate_text


class NumberSignatureMathBoundaryTests(unittest.TestCase):
    def test_annotated_number_and_nested_subparts(self):
        source = (
            "26$^{\\circ}$.1\uff09$P_1$ a\uff09$P_1\\cap P_2$;"
            "b\uff09$P_1\\cup P_2$.2\uff09a\uff09$P\\cap Q=\\alpha$;"
            "b\uff09$P\\cup Q=P\\cap Q$."
        )
        modern = (
            "26$^{\\circ}$.\n1) $P_1$ a) $P_1\\cap P_2$;"
            "b) $P_1\\cup P_2$.\n2) a) $P\\cap Q=\\alpha$;"
            "b) $P\\cup Q=P\\cap Q$."
        )
        self.assertEqual(number_signature(source), ["26", "1", "2"])
        self.assertEqual(number_signature(source), number_signature(modern))
        self.assertEqual(validate_text(source, modern, ["layout"], [], "ex26", []), [])

    def test_formula_does_not_fuse_adjacent_numbers(self):
        self.assertEqual(number_signature("1$x$2"), ["1", "2"])
        self.assertEqual(number_signature("3.$x$5"), ["3", "5"])

    def test_actual_decimal_quantities_remain_decimal(self):
        self.assertEqual(number_signature("26.1 -0.5$x$-2.25"), ["26.1", "-0.5", "-2.25"])

    def test_numeric_change_still_fails(self):
        errors = validate_text(
            "26$^{\\circ}$.1) 3.5 units", "26$^{\\circ}$.\n1) 4.5 units",
            ["layout"], [], "ex26", [],
        )
        self.assertTrue(any("want=" in error for error in errors), errors)

    def test_math_numbers_do_not_enter_prose_signature(self):
        self.assertEqual(number_signature("7 $P_{12}=24$ and 0.25"), ["7", "0.25"])


if __name__ == "__main__":
    unittest.main()
