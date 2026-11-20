"""Standalone TOC exercise cards must not contaminate a preceding lesson."""

import json
import tempfile
import unittest
from pathlib import Path

import assemble
import blocks
import edition


def block(kind, text, ref, printed_page, label=None):
    return {
        "kind": kind, "lines": [text], "ref": ref,
        "page": int(ref[1:5]), "printed_page": printed_page,
        "label": label, "open": False, "cont": False,
    }


class TocExheadBoundariesTest(unittest.TestCase):
    def test_exact_declared_card_splits_but_ordinary_or_repeated_heading_does_not(self):
        with tempfile.TemporaryDirectory() as temporary:
            toc = Path(temporary) / "toc.json"
            toc.write_text(json.dumps({"contents": [{
                "kind": "chapter", "lessons": [{
                    "id": "section", "topics": [
                        {"id": "n41", "title": "三面角和多面角的面角的性质",
                         "printedNumber": 41, "page": 133},
                        {"id": "review", "title": "第三章复习题", "page": 136},
                    ],
                }],
            }]}), encoding="utf-8")
            stream = [
                block("h3", "§41. 三面角和多面角的面角的性质", "p0140#5", 133),
                block("p", "定理正文", "p0140#6", 133),
                block("exhead", "习题", "p0142#6", 135),
                block("ex", "391. 原课题", "p0142#7", 135, "391"),
                block("exhead", "第三章复习题", "p0143#9", 136),
                block("ex", "405. 下一卡题", "p0143#10", 136, "405"),
                block("exhead", "第三章复习题", "p0144#1", 137),
                block("ex", "406. 复习卡续题", "p0144#2", 137, "406"),
            ]
            lessons = assemble.cut_lessons(stream, toc)
            self.assertEqual(len(lessons), 2)
            first_prose, first_exercises = assemble.split_lesson(lessons[0])
            _, review_exercises = assemble.split_lesson(lessons[1])
            self.assertEqual([blocks.text_of(row) for row in first_prose], ["定理正文"])
            self.assertEqual([row["number"] for row in first_exercises], ["391"])
            self.assertEqual([row["number"] for row in review_exercises], ["405", "406"])
            self.assertEqual(review_exercises[0]["group"], "第三章复习题")
            self.assertEqual(stream[4]["kind"], "exhead")
            self.assertEqual(len(assemble.cut_lessons(stream)), 1)

    def test_source_reconstruction_uses_full_snapshots_without_absorbing_review(self):
        with tempfile.TemporaryDirectory() as temporary:
            book = Path(temporary) / "9-10g"
            first = book / "pages/0140/page.json"
            last = book / "pages/0143/page.json"
            first.parent.mkdir(parents=True)
            last.parent.mkdir(parents=True)
            first.write_text(json.dumps({
                "meta": {"page": 140, "printed_page": 133},
                "blocks": [
                    {"kind": "h3", "lines": ["§41. 三面角和多面角的面角的性质"]},
                    {"kind": "p", "lines": ["定理正文"]},
                    {"kind": "exhead", "lines": ["习题"]},
                    {"kind": "ex", "label": "391", "lines": ["391. 原课题"]},
                ],
            }), encoding="utf-8")
            last.write_text(json.dumps({
                "meta": {"page": 143, "printed_page": 136},
                "blocks": [
                    {"kind": "exhead", "lines": ["第三章复习题"]},
                    {"kind": "ex", "label": "405", "lines": ["405. 下一卡题"]},
                ],
            }), encoding="utf-8")
            original_last = last.read_bytes()
            lesson = {
                "number": "41", "title": "三面角和多面角的面角的性质",
                "printed_title": "§41. 三面角和多面角的面角的性质",
                "start_page": 140, "start_printed": 133,
                "prose": [{"kind": "p", "text": "定理正文", "printed_page": 133}],
            }
            exercises = {"exercises": [{
                "number": "391", "text": "391. 原课题", "group": "习题",
            }]}
            targets = edition._authoritative_source_targets(book, lesson, exercises)
            self.assertEqual(targets, {
                "p0140#2": {"lesson.prose[0]": "定理正文"},
                "p0140#4": {"exercises[0]": "391. 原课题"},
            })
            self.assertEqual(last.read_bytes(), original_last)


if __name__ == "__main__":
    unittest.main()
