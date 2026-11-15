import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class OptionalSectionNumberTest(unittest.TestCase):
    def test_plain_number(self):
        match = assemble.SEC_NUM.match("13. Circle positions")
        self.assertEqual(match.groups(), ("13", "Circle positions"))

    def test_optional_mark_preserves_title_and_number(self):
        heading = r"14$\blacktriangledown$. Geometry history"
        block = {
            "kind": "h3",
            "lines": [heading],
            "page": 59,
            "printed_page": 49,
        }
        lesson = assemble.cut_lessons([block])[0]
        self.assertEqual(lesson["number"], "14")
        self.assertEqual(lesson["title"], "Geometry history")
        self.assertEqual(lesson["printed_title"], heading)

    def test_non_section_formula_is_not_recognized(self):
        self.assertIsNone(
            assemble.SEC_NUM.match(r"$14\blacktriangledown$ Geometry history")
        )

    def test_superscript_plus_preserves_title_and_number(self):
        heading = r"$3^{+}$. Induction generalization"
        lesson = assemble.cut_lessons([{
            "kind": "h3", "lines": [heading], "page": 17, "printed_page": 10,
        }])[0]
        self.assertEqual(lesson["number"], "3")
        self.assertEqual(lesson["title"], "Induction generalization")
        self.assertEqual(lesson["printed_title"], heading)

    def test_unclosed_superscript_formula_is_not_recognized(self):
        self.assertIsNone(assemble.SEC_NUM.match(r"$3^{+}. Induction"))


if __name__ == "__main__":
    unittest.main()
