import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class BoldNumberedHeadingTests(unittest.TestCase):
    def lesson(self, title):
        return assemble.cut_lessons([{
            "kind": "h3", "lines": [title], "page": 265, "printed_page": 254,
        }])[0]

    def test_complete_bold_numbered_heading_retains_printed_source(self):
        for number, text in [("103", "蒸发与凝结"), ("104", "液体蒸发时要吸收能量")]:
            title = f"**{number}. {text}**"
            lesson = self.lesson(title)
            self.assertEqual(lesson["number"], number)
            self.assertEqual(lesson["title"], text)
            self.assertEqual(lesson["printed_title"], title)

    def test_plain_heading_keeps_internal_emphasis(self):
        lesson = self.lesson("99. 用*物质*的分子结构学说")
        self.assertEqual(lesson["number"], "99")
        self.assertEqual(lesson["title"], "用*物质*的分子结构学说")

    def test_bold_unnumbered_heading_is_not_assigned_a_number(self):
        title = "**金属的铸造**"
        lesson = self.lesson(title)
        self.assertIsNone(lesson["number"])
        self.assertEqual(lesson["title"], title)
        self.assertEqual(lesson["printed_title"], title)


if __name__ == "__main__":
    unittest.main()
