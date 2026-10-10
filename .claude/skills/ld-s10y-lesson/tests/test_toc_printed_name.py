from __future__ import annotations

from copy import deepcopy
import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
REPO = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(TOOLS))
import assemble


def card():
    return {
        "id": "math5-c3-s1",
        "kind": "section",
        "number": "3.1",
        "title": "算术和代数的历史",
        "page": 269,
        "source": {"printedName": "62. 算术和代数的历史"},
    }


def lesson():
    return {"number": "62", "title": "算术和代数的历史", "start_printed": 269}


class PrintedNameTocBinding(unittest.TestCase):
    def bind(self, cards, lessons):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "toc.json"
            path.write_text(json.dumps({"contents": [
                {"kind": "chapter", "lessons": cards}
            ]}, ensure_ascii=False))
            return assemble.check_toc(lessons, path, "5m")

    def test_number_page_and_source_title_bind_without_ui_number_inference(self):
        lessons = [lesson()]
        self.assertEqual(self.bind([card()], lessons), [])
        self.assertEqual(lessons[0]["card_id"], "math5-c3-s1")
        self.assertEqual(assemble._card_printed_number(card()), "62")

    def test_number_page_and_title_each_must_match(self):
        for field, value in (
            ("number", "63"), ("start_printed", 270),
            ("title", "算术与代数的历史"), ("number", None),
        ):
            with self.subTest(field=field, value=value):
                wrong = {**lesson(), field: value}
                warnings = self.bind([card()], [wrong])
                self.assertTrue(warnings)
                self.assertNotIn("card_id", wrong)

    def test_source_title_must_agree_with_toc_title(self):
        broken = card()
        broken["source"]["printedName"] = "62. 不同标题"
        target = lesson()
        self.assertTrue(self.bind([broken], [target]))
        self.assertNotIn("card_id", target)

    def test_conflicting_explicit_numbers_are_not_silently_preferred(self):
        for field in ("printedNumber", "printedSection"):
            with self.subTest(field=field):
                broken = card()
                if field == "printedNumber":
                    broken[field] = 63
                else:
                    broken["source"][field] = 63
                target = {**lesson(), "number": "63"}
                self.assertTrue(self.bind([broken], [target]))
                self.assertNotIn("card_id", target)

    def test_duplicate_matching_cards_do_not_bind(self):
        duplicate = {**deepcopy(card()), "id": "duplicate"}
        target = lesson()
        self.assertTrue(self.bind([card(), duplicate], [target]))
        self.assertNotIn("card_id", target)

    def test_unnumbered_name_still_binds_without_inventing_a_number(self):
        unnumbered = {
            "id": "math5-primes", "kind": "section", "number": None,
            "title": "质数表", "page": 301, "source": {"printedName": "质数表"},
        }
        target = {"number": None, "title": "质数表", "start_printed": 301}
        self.assertEqual(self.bind([unnumbered], [target]), [])
        self.assertEqual(target["card_id"], "math5-primes")
        self.assertIsNone(assemble._card_printed_number(unnumbered))

    def test_numeric_ui_number_is_not_a_printed_number(self):
        broken = card()
        broken["source"] = {"printedName": "算术和代数的历史"}
        broken["number"] = 62
        target = lesson()
        self.assertTrue(self.bind([broken], [target]))
        self.assertNotIn("card_id", target)

    def test_actual_5m_62_to_65_receive_exact_canonical_ids(self):
        lessons = [
            {"number": "62", "title": "算术和代数的历史", "start_printed": 269},
            {"number": "63", "title": "我们周围的几何学", "start_printed": 274},
            {"number": "64", "title": "大地测量", "start_printed": 279},
            {"number": "65", "title": "难度较大的问题", "start_printed": 282},
        ]
        warnings = assemble.check_toc(
            lessons, REPO / "ssot-resources/soviet10year-textbooks/toc/5m/zh.json",
            "5m", {269, 274, 279, 282},
        )
        self.assertEqual(warnings, [])
        self.assertEqual([item["card_id"] for item in lessons], [
            "math5-c3-s1", "math5-c3-s2", "math5-c3-s3", "math5-c3-ex4",
        ])


if __name__ == "__main__":
    unittest.main()
