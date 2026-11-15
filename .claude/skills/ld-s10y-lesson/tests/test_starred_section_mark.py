"""A source supplemental star is not part of the numbered unit identity."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import SEC_NUM, _card_printed_number, cut_lessons


class StarredSectionMarkTests(unittest.TestCase):
    def test_source_postfix_star_keeps_number_and_title(self):
        text = "77$^{*}$. Continuity"
        match = SEC_NUM.fullmatch(text)
        self.assertIsNotNone(match)
        self.assertEqual(match.groups(), ("77", "Continuity"))
        self.assertEqual(
            _card_printed_number({"source": {"printedName": text}}), "77"
        )

    def test_numbered_source_object_retains_printed_heading(self):
        heading = {
            "kind": "h3", "lines": ["77$^{*}$. Continuity"],
            "page": 13, "printed_page": 7, "ref": "p0013#4",
        }
        lessons = cut_lessons([heading])
        self.assertEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["number"], "77")
        self.assertEqual(lessons[0]["title"], "Continuity")
        self.assertEqual(lessons[0]["printed_title"], heading["lines"][0])

    def test_non_marker_postfix_is_not_silently_discarded(self):
        self.assertIsNone(SEC_NUM.fullmatch("77$^{x}$. Continuity"))

    def test_section_symbol_prefix_keeps_number_and_title(self):
        for text in ("\u00a71. Axioms", "\u00a7 1. Axioms"):
            with self.subTest(text=text):
                self.assertEqual(SEC_NUM.fullmatch(text).groups(), ("1", "Axioms"))

    def test_non_numeric_section_heading_is_not_recognized(self):
        self.assertIsNone(SEC_NUM.fullmatch("\u00a7 Axioms"))


if __name__ == "__main__":
    unittest.main()
