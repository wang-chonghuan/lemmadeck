"""Layout whitespace is equivalent; mathematical changes are not."""
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class MathLayoutWhitespaceTests(unittest.TestCase):
    def validate(self, source, modern):
        return edition.validate_text(
            source, modern, ["layout"], [], "prose", [],
        )

    def test_formula_layout_compression_is_not_math_correction(self):
        source = r"$\frac{a+3}{a(a+b)}  =\frac3{ab}$。"
        modern = r"$\frac{a+3}{a(a+b)} =\frac3{ab}$。"
        self.assertEqual(self.validate(source, modern), [])

    def test_sign_and_coefficient_changes_still_fail(self):
        source = r"$\frac{a+3}{a(a+b)}  =\frac3{ab}$。"
        for modern in (
            r"$\frac{a-3}{a(a+b)} =\frac3{ab}$。",
            r"$\frac{a+3}{a(a+b)} =\frac4{ab}$。",
        ):
            self.assertTrue(any("数学公式变化" in e for e in self.validate(source, modern)))

    def test_control_word_boundary_and_fraction_scope_still_fail(self):
        for source, modern in (
            (r"$\frac ab$", r"$\fracab$"),
            (r"$\frac{a+b}{c}$", r"$\frac a{b+c}$"),
        ):
            self.assertTrue(any("数学公式变化" in e for e in self.validate(source, modern)))


if __name__ == "__main__":
    unittest.main()
