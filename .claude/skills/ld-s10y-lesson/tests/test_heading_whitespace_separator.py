import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


TITLE = "\u5f26\u957f\u4e0e\u5f26\u6240\u5bf9\u7684\u5f27\u957f\u7684\u6bd4\u7684\u6781\u9650"
HEADING = "78$^{*}$\u3000" + TITLE


class HeadingWhitespaceSeparatorTests(unittest.TestCase):
    def test_actual_starred_heading_preserves_printed_text(self):
        lesson = assemble.cut_lessons([{
            "kind": "h3", "lines": [HEADING], "page": 16,
            "printed_page": 10,
        }])[0]
        self.assertEqual(lesson["number"], "78")
        self.assertEqual(lesson["title"], TITLE)
        self.assertEqual(lesson["printed_title"], HEADING)

    def test_supported_separators_and_markers(self):
        cases = [
            ("78$^{*}$ " + TITLE, "78", TITLE),
            ("79 second derivatives", "79", "second derivatives"),
            ("75. sine derivative", "75", "sine derivative"),
            ("77$^{*}$. continuity", "77", "continuity"),
            ("12\uff0eSets", "12", "Sets"),
            ("12\u3001Sets", "12", "Sets"),
            ("\u00a7 15. derivatives", "15", "derivatives"),
            ("$12^{+}$. Sets", "12", "Sets"),
            ("12 $\\blacktriangledown$. Sets", "12", "Sets"),
            ("12 $\\blacktriangledown$ Sets", "12", "Sets"),
            ("78 2026 example", "78", "2026 example"),
        ]
        for heading, number, title in cases:
            with self.subTest(heading=heading):
                match = assemble.SEC_NUM.fullmatch(heading)
                self.assertIsNotNone(match)
                self.assertEqual(match.groups(), (number, title))

    def test_separator_and_nonblank_title_are_required(self):
        for heading in [
            "78Title", "78$^{*}$Title", "78", "78$^{*}$",
            "78 ", "78$^{*}$\u3000", "78.   ",
            "78: Title", "Theorem 78 continuity", "Supplement", "78x Title",
        ]:
            with self.subTest(heading=heading):
                self.assertIsNone(assemble.SEC_NUM.fullmatch(heading))

    def test_numeric_prose_does_not_open_a_lesson(self):
        lessons = assemble.cut_lessons([
            {"kind": "h3", "lines": [HEADING], "page": 16, "printed_page": 10},
            {"kind": "p", "lines": ["78 ordinary prose"], "page": 16,
             "printed_page": 10},
        ])
        self.assertEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["blocks"][0]["kind"], "p")
        self.assertEqual(lessons[0]["blocks"][0]["lines"], ["78 ordinary prose"])

    def check_card(self, printed_page, card):
        lesson = {
            "number": "78", "title": TITLE, "start_printed": printed_page,
        }
        with tempfile.TemporaryDirectory() as directory:
            toc = Path(directory) / "toc.json"
            toc.write_text(json.dumps({"contents": [card]}), encoding="utf-8")
            warnings = assemble.check_toc([lesson], toc, "10c", {printed_page})
        return lesson, warnings

    def test_toc_claim_keeps_number_and_page_contract(self):
        card = {
            "id": "ana10-c6-s1-n78", "printedNumber": 78,
            "title": TITLE, "page": 10,
        }
        lesson, warnings = self.check_card(10, card)
        self.assertEqual(lesson["card_id"], "ana10-c6-s1-n78")
        self.assertEqual(warnings, [])
        lesson, warnings = self.check_card(11, card)
        self.assertNotIn("card_id", lesson)
        self.assertTrue(any("TOC" in warning for warning in warnings))

    def test_printed_name_conflicts_still_reject(self):
        for source in [
            {"printedName": "78 " + TITLE, "printedSection": 79},
            {"printedName": "78 different title"},
        ]:
            with self.subTest(source=source):
                lesson, warnings = self.check_card(10, {
                    "id": "ana10-c6-s1-n78", "printedNumber": 78,
                    "title": TITLE, "page": 10, "source": source,
                })
                self.assertNotIn("card_id", lesson)
                self.assertTrue(warnings)


if __name__ == "__main__":
    unittest.main()
