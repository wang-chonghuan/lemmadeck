import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import assemble


class NumberedHeadingTests(unittest.TestCase):
    def test_number_and_title_encodings(self):
        cases = [
            ("96*. History", "96", "History"),
            ("96$^{*}$. History", "96", "History"),
            ("96. History", "96", "History"),
            ("96 History", "96", "History"),
            ("$96^{+}$. History", "96", "History"),
            (r"96 $\blacktriangledown$. History", "96", "History"),
        ]
        for text, number, title in cases:
            with self.subTest(text=text):
                match = assemble.SEC_NUM.fullmatch(text)
                self.assertIsNotNone(match)
                self.assertEqual(match.groups(), (number, title))

    def test_rejects_non_heading_number_prefixes(self):
        for text in ["96*History", "96**. History", "96*. ", "History 96*."]:
            with self.subTest(text=text):
                self.assertIsNone(assemble.SEC_NUM.fullmatch(text))

    def test_claim_preserves_printed_heading(self):
        text = "96*. History"
        stream = [
            {"kind": "h3", "lines": [text], "page": 98, "printed_page": 92},
            {"kind": "p", "lines": ["Content."], "page": 98, "printed_page": 92},
        ]
        lesson = assemble.cut_lessons(stream)[0]
        self.assertEqual(lesson["number"], "96")
        self.assertEqual(lesson["title"], "History")
        self.assertEqual(lesson["printed_title"], text)


if __name__ == "__main__":
    unittest.main()
