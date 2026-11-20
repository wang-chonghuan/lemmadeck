import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

from edition import same_figure_label


class EnglishTableLabelTests(unittest.TestCase):
    def test_unnumbered_table_translation_is_exact_and_english_only(self):
        source = "\u8868"
        self.assertTrue(same_figure_label(source, "Table", "en"))
        self.assertFalse(same_figure_label(source, "Table", "zh"))
        self.assertFalse(same_figure_label(source, "Table 1", "en"))

    def test_numbered_figure_translation_keeps_source_number(self):
        source = "\u56fe 28"
        self.assertTrue(same_figure_label(source, "Figure 28", "en"))
        self.assertFalse(same_figure_label(source, "Figure 29", "en"))

    def test_table_translation_cannot_replace_figure_or_unknown_label(self):
        self.assertFalse(same_figure_label("\u56fe 28", "Table", "en"))
        self.assertFalse(same_figure_label("unknown", "Table", "en"))


if __name__ == "__main__":
    unittest.main()
