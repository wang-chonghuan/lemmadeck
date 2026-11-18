import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import prose_number_signature, validate_text


class DottedFigureReferenceTests(unittest.TestCase):
    def test_dotted_source_reference_is_not_a_quantity(self):
        self.assertEqual(
            prose_number_signature("图177、图.178；距离 3.5"),
            (["3.5"], {"图号": {"177", "178"}, "节号": set()}),
        )

    def test_localization_preserves_dotted_reference_identity(self):
        for modern in ("图 177、图 178；距离 3.5", "Figure 177, Figure 178; distance 3.5"):
            with self.subTest(modern=modern):
                self.assertEqual(
                    validate_text("图177、图.178；距离 3.5", modern,
                                  ["language", "layout"], [], "prose", []),
                    [],
                )

    def test_changed_reference_and_quantity_still_fail(self):
        errors = validate_text(
            "图.178；距离 3.5", "Figure 179; distance 4.5",
            ["language"], [], "prose", [],
        )
        self.assertTrue(any("图号" in error for error in errors))
        self.assertTrue(any("数字" in error for error in errors))

    def test_undeclared_formula_change_still_fails(self):
        errors = validate_text(
            "图.178，$SB$", "Figure 178, $SA$",
            ["language"], [], "prose", [],
        )
        self.assertTrue(any("数学公式" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
