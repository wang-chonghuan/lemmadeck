import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import normalize_prose_layout


class ClosingQuotes(unittest.TestCase):
    def test_closing_quote_stays_with_quoted_sentence(self):
        text = "他说：“第一句。第二句。第三句。”"
        self.assertEqual(
            normalize_prose_layout(text),
            "他说：“第一句。\n第二句。\n第三句。”",
        )

    def test_existing_orphan_quote_is_rejoined_idempotently(self):
        text = "他说：“第一句。\n第二句。\n第三句。\n\n”"
        result = normalize_prose_layout(text)
        self.assertEqual(result, "他说：“第一句。\n第二句。\n第三句。”")
        self.assertEqual(normalize_prose_layout(result), result)

    def test_following_sentence_is_not_inside_the_quote(self):
        text = "他说：“第一句。第二句。第三句。”下一段。"
        self.assertEqual(
            normalize_prose_layout(text),
            "他说：“第一句。\n第二句。\n第三句。”\n\n下一段。",
        )


if __name__ == "__main__":
    unittest.main()
