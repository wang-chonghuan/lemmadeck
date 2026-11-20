import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class HeadingAndUnnamedIdentityTests(unittest.TestCase):
    def test_split_bold_number_and_title_keep_printed_source(self):
        title = "**111**. **汽轮机**"
        result = assemble.cut_lessons([
            {"kind": "h3", "lines": [title], "page": 283, "printed_page": 272},
        ])
        self.assertEqual(result[0]["number"], "111")
        self.assertEqual(result[0]["title"], "汽轮机")
        self.assertEqual(result[0]["printed_title"], title)

    def test_whole_bold_heading_is_still_numbered(self):
        result = assemble.cut_lessons([
            {"kind": "h3", "lines": ["**112. 热机效率**"], "page": 285},
        ])
        self.assertEqual(result[0]["number"], "112")
        self.assertEqual(result[0]["title"], "热机效率")

    def test_unnumbered_report_does_not_reuse_explicit_q1(self):
        lesson = {"blocks": [
            {"kind": "exhead", "lines": ["问题"]},
            {"kind": "ex", "label": "q1", "lines": ["什么是热机效率？"], "ref": "p0285#13"},
            {"kind": "exhead", "lines": ["作业"]},
            {"kind": "ex", "label": None, "lines": ["按照下列题目准备报告："], "ref": "p0286#2"},
        ]}
        _, tasks = assemble.split_lesson(lesson, "lesson-group")
        self.assertEqual([task["number"] for task in tasks], ["q1", "q2"])
        self.assertEqual([task["group_id"] for task in tasks], ["g1", "g2"])
        self.assertIsNone(tasks[1]["source_number"])
        self.assertEqual(tasks[1]["pages"], ["p0286#2"])

    def test_later_explicit_identity_is_reserved(self):
        lesson = {"blocks": [
            {"kind": "ex", "label": None, "lines": ["报告"], "ref": "p0001#1"},
            {"kind": "ex", "label": "q1", "lines": ["问题"], "ref": "p0001#2"},
        ]}
        _, tasks = assemble.split_lesson(lesson, "lesson-group")
        self.assertEqual([task["number"] for task in tasks], ["q2", "q1"])


if __name__ == "__main__":
    unittest.main()
