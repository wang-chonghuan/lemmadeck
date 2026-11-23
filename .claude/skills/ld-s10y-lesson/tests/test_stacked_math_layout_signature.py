import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class StackedMathLayoutSignatureTests(unittest.TestCase):
    rows = [
        r"\phantom{+}3.14\qquad\phantom{+}6.40",
        r"\underline{+\ 2.83}\qquad\underline{+\ 5.28}",
        r"\phantom{+}5.97\qquad11.68",
    ]
    source = "\n".join(f"${row}$" for row in rows)
    array = (
        r"$\begin{array}{rr}"
        r"\phantom{+}3.14&\phantom{+}6.40\\"
        r"\underline{+\ 2.83}&\underline{+\ 5.28}\\"
        r"\phantom{+}5.97&11.68\end{array}$"
    )

    def test_parallel_addition_preserves_every_source_row(self):
        self.assertEqual(edition.math_signature(self.source), edition.math_signature(self.array))

    def test_changed_operand_is_not_layout(self):
        self.assertNotEqual(
            edition.math_signature(self.source),
            edition.math_signature(self.array.replace("2.83", "2.38")),
        )

    def test_changed_result_is_not_layout(self):
        self.assertNotEqual(
            edition.math_signature(self.source),
            edition.math_signature(self.array.replace("11.68", "11.86")),
        )

    def test_changed_operation_is_not_layout(self):
        self.assertNotEqual(
            edition.math_signature(self.source),
            edition.math_signature(self.array.replace(r"+\ 2.83", r"-\ 2.83")),
        )

    def test_row_reordering_is_not_layout(self):
        reversed_rows = list(reversed(self.rows))
        reversed_source = "\n".join(f"${row}$" for row in reversed_rows)
        self.assertNotEqual(edition.math_signature(reversed_source), edition.math_signature(self.array))

    def test_column_reordering_is_not_layout(self):
        swapped = self.array.replace(
            r"\phantom{+}3.14&\phantom{+}6.40",
            r"\phantom{+}6.40&\phantom{+}3.14",
        )
        self.assertNotEqual(edition.math_signature(self.source), edition.math_signature(swapped))

    def test_incomplete_array_is_not_layout(self):
        incomplete = self.array.replace(r"\phantom{+}5.97&11.68", r"\phantom{+}5.97")
        self.assertNotEqual(edition.math_signature(self.source), edition.math_signature(incomplete))

    def test_single_column_subtraction_preserves_rows(self):
        source = (
            r"$\phantom{-}114.80$ "
            r"$\underline{-\ \phantom{1}71.35}$ "
            r"$\phantom{-1}43.45$"
        )
        array = (
            r"$\begin{array}{r}\phantom{-}114.80\\"
            r"\underline{-\ \phantom{1}71.35}\\"
            r"\phantom{-1}43.45\end{array}$"
        )
        self.assertEqual(edition.math_signature(source), edition.math_signature(array))

    def test_unrelated_matrix_remains_an_exact_expression(self):
        matrix = r"$\begin{array}{rr}1&2\\3&4\end{array}$"
        self.assertEqual(edition.math_signature(matrix), [matrix[1:-1]])

    def test_three_row_matrix_is_not_a_vertical_arithmetic_layout(self):
        matrix = r"$\begin{array}{rr}1&2\\3&4\\5&6\end{array}$"
        self.assertEqual(edition.math_signature(matrix), [matrix[1:-1]])


if __name__ == "__main__":
    unittest.main()
