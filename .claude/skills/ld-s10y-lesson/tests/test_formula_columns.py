import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class FormulaColumnsTest(unittest.TestCase):
    def test_two_source_columns_keep_their_continuations(self):
        source = (
            "Plot: a) $y=2x,$\u3000\u3000b) $y=-0.5x,$ "
            "$y=2x-3,$\u3000\u3000$y=-0.5x-2,$ "
            "$y=2x+4$;\u3000\u3000$y=-0.5x+3$. Compare."
        )
        expected = (
            "Plot:\na) $y=2x,$ $y=2x-3,$ $y=2x+4$\n"
            "b) $y=-0.5x,$ $y=-0.5x-2,$ $y=-0.5x+3$. Compare."
        )
        self.assertEqual(edition.normalize_numbered_subparts(source), expected)
        self.assertEqual(
            edition.normalize_numbered_subparts(expected), expected
        )

    def test_no_alignment_evidence_does_not_guess_columns(self):
        source = "Plot: a) $y=2x$ b) $y=-x$ $y=2x-3$ $y=-x-2$."
        result = edition.normalize_numbered_subparts(source)
        self.assertEqual(result, "Plot:\na) $y=2x$\nb) $y=-x$ $y=2x-3$ $y=-x-2$.")

    def test_odd_formula_count_is_not_reinterpreted(self):
        source = "a) $u$\u3000\u3000b) $v$ $w$\u3000\u3000$x$ $z$"
        self.assertEqual(
            edition.normalize_numbered_subparts(source),
            "a) $u$\nb) $v$ $w$ $x$ $z$",
        )


if __name__ == "__main__":
    unittest.main()
