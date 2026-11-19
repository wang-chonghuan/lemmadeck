"""Focused contracts for explicit printed-page tables and edition preparation."""

import argparse
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import assemble
import edition


TABLE_ID = "tbl-p0241-01"
QUESTION = (
    "（2）在加热情况相同的条件下，比热表（见第230页）"
    "所列的液体中哪一种温度上升得最快？"
)


def block(kind, page, index, printed_page, label=None, text="", **fields):
    return {
        "kind": kind, "page": page, "ref": f"p{page:04d}#{index}",
        "printed_page": printed_page, "label": label,
        "lines": [text] if text else [], **fields,
    }


def table():
    return block("fig", 241, 2, 230, "表", id=TABLE_ID)


def exercise(number="g2-2", text=QUESTION, page=245):
    return {
        "number": number, "source_number": "2", "group": "练习46",
        "group_id": "g2", "text": text, "lines": [text],
        "pages": [f"p{page:04d}#11"], "figure_refs": [], "figures": [],
    }


def lesson(blocks, exercises):
    return {
        "blocks": blocks, "prose": list(blocks), "exercises": exercises,
    }


class PrintedPageTableReferenceTests(unittest.TestCase):
    def test_exact_cross_lesson_reference_preserves_prose_owner(self):
        source = table()
        caption = block("cap", 241, 3, 230, "表", "一些物质的比热")
        owner = lesson([source, caption], [])
        citing = lesson([], [exercise()])
        before = copy.deepcopy(owner)
        errors, warnings = assemble.claim_figures([owner, citing], [source, caption])
        self.assertEqual((errors, warnings), ([], []))
        self.assertEqual(owner["blocks"], before["blocks"])
        self.assertEqual(owner["prose"], before["prose"])
        self.assertEqual(owner["figures"], [{"id": TABLE_ID, "label": "表", "page": 241}])
        self.assertEqual(citing["blocks"], [])
        self.assertEqual(citing["prose"], [])
        self.assertEqual(citing["figures"], [])
        self.assertEqual(citing["exercises"][0]["figure_refs"], [TABLE_ID])
        self.assertEqual(citing["exercises"][0]["figures"], [{"id": TABLE_ID, "label": "表"}])
        self.assertEqual(citing["exercises"][0]["text"], QUESTION)

    def test_parentheses_name_and_whitespace(self):
        for text in (
            "比热表（见第230页）", "比热表(见第230页)",
            "比热表 \n（ 见 第 230 页 ）", "表 ( 见 第 230 页 )",
        ):
            with self.subTest(text=text):
                citing = lesson([], [exercise(text=text)])
                errors, _ = assemble.claim_figures([citing], [table()])
                self.assertEqual(errors, [])
                self.assertEqual(citing["exercises"][0]["figure_refs"], [TABLE_ID])

    def test_repeated_uses_share_first_explicit_display_not_nearest(self):
        first = exercise(page=245, text=QUESTION + QUESTION)
        nearer = exercise("g2-3", page=242)
        citing = lesson([], [first, nearer])
        with patch.object(assemble, "_figure_owner", side_effect=AssertionError("distance")):
            errors, _ = assemble.claim_figures([citing], [table()])
            repeated_errors, _ = assemble.claim_figures([citing], [table()])
        self.assertEqual((errors, repeated_errors), ([], []))
        self.assertEqual([item["figure_refs"] for item in citing["exercises"]],
                         [[TABLE_ID], [TABLE_ID]])
        self.assertEqual([item["figures"] for item in citing["exercises"]],
                         [[{"id": TABLE_ID, "label": "表"}], []])

    def test_missing_and_ambiguous_targets_fail_with_lookup_diagnostics(self):
        cases = (
            ([], "找到 0 页"),
            ([block("p", 241, 1, 230, text="正文")], "找到 0 张"),
            ([table(), block("fig", 241, 4, 230, "表", id="tbl-second")], "找到 2 张"),
            ([table(), block("fig", 242, 1, 230, "表", id="tbl-other-page")], "找到 2 页"),
            ([block("fig", 241, 2, 230, "图 7", id="fig-07")], "找到 0 张"),
        )
        for stream, diagnostic in cases:
            with self.subTest(diagnostic=diagnostic, stream=stream):
                with self.assertRaisesRegex(ValueError, f"印刷页 230: .*{diagnostic}"):
                    assemble.resolve_printed_page_table(stream, 230)
                citing = lesson([], [exercise()])
                errors, _ = assemble.claim_figures([citing], stream)
                self.assertEqual(len(errors), 1)
                self.assertIn(diagnostic, errors[0])
                self.assertEqual(citing["exercises"][0]["figure_refs"], [])
                self.assertEqual(citing["exercises"][0]["figures"], [])

    def test_generic_tables_and_ordinary_page_references_do_not_claim(self):
        for text in (
            "比热表所列的液体", "见第230页", "图（见第230页）",
            "列表。说明（见第230页）", "比热表见第230页",
        ):
            with self.subTest(text=text):
                citing = lesson([], [exercise(text=text)])
                errors, _ = assemble.claim_figures([citing], [table()])
                self.assertEqual(errors, [])
                self.assertEqual(citing["exercises"][0]["figure_refs"], [])
                self.assertEqual(citing["exercises"][0]["figures"], [])

    def test_numbered_figure_reference_is_unchanged(self):
        source = block("fig", 241, 2, 230, "图 7", id="fig-07")
        caption = block("cap", 241, 3, 230, "图 7")
        citing = lesson([source, caption], [exercise(text="看图 $7$（见第230页）。")])
        errors, warnings = assemble.claim_figures([citing], [source, caption])
        self.assertEqual((errors, warnings), ([], []))
        self.assertEqual(citing["prose"], [])
        self.assertEqual(citing["exercises"][0]["figure_refs"], ["fig-07"])
        self.assertEqual(citing["exercises"][0]["figures"], [{"id": "fig-07", "label": "图 7"}])


class EditionSupplementarySourceTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.book = self.root / "artifacts" / "book"
        page_path = self.book / "pages" / "0241" / "page.json"
        edition.dump(page_path, {
            "meta": {"page": 241, "printed_page": 230}, "blocks": [table()],
        })
        self.png = b"source-png-bytes"
        self.svg = b"<svg>source-table</svg>"
        (self.book / "figures").mkdir()
        (self.book / "figures" / f"{TABLE_ID}.png").write_bytes(self.png)
        (self.book / "figures" / f"{TABLE_ID}.svg").write_bytes(self.svg)

    def expected_source(self):
        return {
            "id": TABLE_ID, "label": "表", "spec": f"figures/{TABLE_ID}.spec.json",
            "changes": ["modernized"],
            "source": {
                "png": {"path": f"figures/{TABLE_ID}.png",
                        "sha256": hashlib.sha256(self.png).hexdigest()},
                "svg": {"path": f"figures/{TABLE_ID}.svg",
                        "sha256": hashlib.sha256(self.svg).hexdigest()},
            },
        }

    def test_cmd_prepare_adds_one_supplement_preserving_raw_identity(self):
        raw_lesson = {"id": "citing", "figures": [], "prose": []}
        used = exercise()
        used["figure_refs"] = [TABLE_ID, TABLE_ID]
        used["figures"] = [{"id": TABLE_ID, "label": "表"}]
        raw_exercises = {"lesson": "citing", "count": 2,
                         "exercises": [used, copy.deepcopy(used)]}
        raw_dir = self.book / "lessons" / "citing"
        edition.dump(raw_dir / "lesson.json", raw_lesson)
        edition.dump(raw_dir / "exercises.json", raw_exercises)
        original_bytes = {path: path.read_bytes() for path in raw_dir.iterdir()}
        profile = self.root / "profile.json"
        edition.dump(profile, {"id": "focused-test"})
        args = argparse.Namespace(root=self.book.parent, book="book", edition="modern",
                                  work=self.root / "work", profile=profile,
                                  lesson=["citing"], force=False)
        self.assertEqual(edition.cmd_prepare(args), 0)
        target = self.root / "work" / "adapt" / "book" / "modern" / "lessons" / "citing"
        figures = edition.load(target / "figures.template.json")
        self.assertEqual(figures["figures"], [self.expected_source()])
        modern = edition.load(target / "exercises.template.json")
        self.assertEqual(modern["source"]["data"], raw_exercises)
        for old, new in zip(raw_exercises["exercises"], modern["exercises"]):
            for field in ("number", "source_number", "group", "group_id", "figure_refs", "figures"):
                self.assertEqual(new[field], old[field])
        self.assertEqual(edition.load(target / "lesson.template.json")["figures"], [])
        for path, data in original_bytes.items():
            self.assertEqual(path.read_bytes(), data)

    def test_owned_figure_is_not_repeated_or_looked_up(self):
        source = {"id": TABLE_ID, "label": "表"}
        raw = {"figures": [source]}
        exercises = {"exercises": [{"figure_refs": [TABLE_ID],
                                   "figures": [source]}]}
        with patch.object(assemble, "load_stream", side_effect=AssertionError("lookup")):
            self.assertEqual(edition.lesson_figure_sources(self.book, raw, exercises),
                             [self.expected_source()])
        self.assertEqual(raw, {"figures": [source]})

    def test_supplement_missing_or_ambiguous_id_fails(self):
        for figure_id, blocks, count in (
            ("unknown", [table()], 0), (TABLE_ID, [table(), table()], 2),
        ):
            with self.subTest(count=count):
                edition.dump(self.book / "pages" / "0241" / "page.json", {
                    "meta": {"page": 241, "printed_page": 230}, "blocks": blocks,
                })
                with self.assertRaisesRegex(SystemExit, f"共享图 {figure_id} .*找到 {count} 张"):
                    edition.lesson_figure_sources(self.book, {"figures": []}, {
                        "exercises": [{"figure_refs": [figure_id]}],
                    })


if __name__ == "__main__":
    unittest.main()
