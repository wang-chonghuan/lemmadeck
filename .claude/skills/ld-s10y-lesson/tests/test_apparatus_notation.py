import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class ApparatusNotation(unittest.TestCase):
    def check_text(self, source, modern, declaration=None, changes=None):
        return edition.validate_text(
            source, modern, changes or ["notation"], [], "block", [],
            notation_changes=declaration,
        )

    def declaration(self, **overrides):
        return [{
            "kind": "apparatus-label",
            "from": "$Г$",
            "to": "$G$",
            "reason": "Source air-bulb label, matched to modern figure G.",
            **overrides,
        }]

    def test_declared_label(self):
        self.assertEqual(self.check_text(
            "The bulb $Г$ feeds box $K$.",
            "The bulb $G$ feeds box $K$.",
            self.declaration(),
        ), [])

    def test_undeclared_alias_fails(self):
        self.assertTrue(self.check_text("$Г$", "$G$"))

    def test_declaration_requires_notation(self):
        self.assertTrue(self.check_text("$Г$", "$G$", self.declaration(), ["clarity"]))

    def test_retained_cyrillic_fails(self):
        self.assertTrue(self.check_text("$Г$", "$Г$", self.declaration()))

    def test_nested_equation_cannot_use_alias(self):
        self.assertTrue(self.check_text("$Г+1$", "$G+1$", self.declaration()))

    def test_duplicate_source_label_fails(self):
        self.assertTrue(self.check_text("$Г$ $Г$", "$G$ $G$", self.declaration()))

    def test_other_cyrillic_alias_fails(self):
        self.assertTrue(self.check_text("$Д$", "$D$", self.declaration(**{
            "from": "$Д$", "to": "$D$",
        })))

    def test_unrelated_math_change_fails(self):
        self.assertTrue(self.check_text("$Г$ $p=1$", "$G$ $p=2$", self.declaration()))

    def test_wrong_shape_fails(self):
        for declaration in (False, {}, ["bad"], [None], self.declaration(reason="")):
            with self.subTest(declaration=declaration):
                self.assertTrue(self.check_text("$Г$", "$G$", declaration))

    def test_existing_descriptive_subscript_alias(self):
        self.assertEqual(self.check_text(
            r"$p_{\mathrm{н}}$", r"$p_{\mathrm{n}}$",
        ), [])


if __name__ == "__main__":
    unittest.main()
