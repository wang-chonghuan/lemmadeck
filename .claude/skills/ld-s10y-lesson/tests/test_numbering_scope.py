import json
from pathlib import Path
import sys
import tempfile
import unittest

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import assemble
import blocks


def block(page, index, kind, text="", scope="", **fields):
    result = {
        "kind": kind, "lines": [text] if text else [], "label": None,
        "ref": f"p{page:04d}#{index}", "page": page, "printed_page": page,
        "cont": False, "open": False, "samerow": False, **fields,
    }
    if scope:
        result["numbering_scope"] = scope
    return result


def lesson(scope, page, number=1, figure_number=1):
    figure = block(page, 1, "fig", scope=scope, label=f"图 {figure_number}",
                   id=blocks.fig_id(f"图 {figure_number}", page, 1, scope))
    exercise = block(page, 2, "ex", f"观察图 {figure_number}。", scope,
                     label=str(number))
    result = {
        "title": f"lesson-{page}", "blocks": [figure, exercise],
        "start_page": page, "start_printed": page,
    }
    result["prose"], result["exercises"] = assemble.split_lesson(result)
    return result, [figure, exercise]


class NumberingScopeTests(unittest.TestCase):
    def test_scope_is_explicit_and_path_safe(self):
        self.assertEqual(blocks.numbering_scope({}), "")
        self.assertEqual(blocks.numbering_scope({"numbering_scope": "g10"}), "g10")
        for invalid in ("", "../g10", "G10", "g10/fig", None, 10):
            with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                blocks.numbering_scope({"numbering_scope": invalid})

    def test_legacy_and_scoped_figure_ids(self):
        self.assertEqual(blocks.fig_id("图 7", 152, 1), "fig-07")
        self.assertEqual(blocks.fig_id("图 7", 152, 1, "g10"), "fig-g10-07")
        self.assertEqual(blocks.fig_id("图 7", 153, 1, "g10"), "fig-g10-07")
        self.assertEqual(blocks.fig_id("表", 152, 2, "g10"), "tbl-p0152-02")

    def test_dump_scoped_image_reference(self):
        figure = block(152, 1, "fig", label="图 1", box=[10, 20, 30, 40])
        text = blocks.dump({"numbering_scope": "g10"}, [figure], 152)
        self.assertIn("![图 1](figures/fig-g10-01.png)", text)

    def test_load_stream_keeps_unscoped_blocks_unchanged(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for page, scope in ((1, None), (2, "g10")):
                directory = root / "pages" / f"{page:04d}"
                directory.mkdir(parents=True)
                meta = {"page": page, "printed_page": page}
                if scope:
                    meta["numbering_scope"] = scope
                (directory / "page.json").write_text(json.dumps({
                    "meta": meta, "blocks": [{"kind": "p", "lines": ["text"]}],
                }))
            stream = assemble.load_stream(root)
            self.assertNotIn("numbering_scope", stream[0])
            self.assertEqual(stream[1]["numbering_scope"], "g10")

    def test_same_printed_figure_stays_with_its_scope(self):
        old, old_stream = lesson("", 1)
        new, new_stream = lesson("g10", 2)
        errors, warnings = assemble.claim_figures([old, new], old_stream + new_stream)
        self.assertEqual((errors, warnings), ([], []))
        self.assertEqual(old["exercises"][0]["figure_refs"], ["fig-01"])
        self.assertEqual(new["exercises"][0]["figure_refs"], ["fig-g10-01"])
        self.assertEqual([f["id"] for f in new["exercises"][0]["figures"]],
                         ["fig-g10-01"])

    def test_adjacent_figure_moves_without_cross_scope_reference_collision(self):
        old_text = block(1, 1, "p", "旧图 1。")
        new_figure = block(2, 1, "fig", scope="g10", label="图 1", id="fig-g10-01")
        new_caption = block(2, 2, "cap", "图 1", "g10", label="图 1")
        new_text = block(2, 4, "p", "新图 1。", "g10")
        old = {"start_page": 1, "blocks": [old_text, new_figure, new_caption],
               "prose": [old_text, new_figure, new_caption], "exercises": []}
        new = {"start_page": 2, "blocks": [new_text], "prose": [new_text],
               "exercises": []}
        assemble._claim_next_lesson_prose_figures([old, new])
        self.assertEqual(old["blocks"], [old_text])
        self.assertEqual([b["kind"] for b in new["blocks"]], ["p", "fig", "cap"])

    def test_book_exercise_restart_requires_different_scopes(self):
        old, old_stream = lesson("", 1)
        new, new_stream = lesson("g10", 2)
        assemble.claim_figures([old, new], old_stream + new_stream)
        report = assemble.audit([old, new], old_stream + new_stream,
                                TOOLS.parent / "profiles/soviet-cn.json")
        self.assertEqual(report["errors"], [])
        repeated, repeated_stream = lesson("", 2)
        assemble.claim_figures([old, repeated], old_stream + repeated_stream)
        report = assemble.audit([old, repeated], old_stream + repeated_stream,
                                TOOLS.parent / "profiles/soviet-cn.json")
        self.assertTrue(any("题号重复" in error for error in report["errors"]))

    def test_other_scope_cannot_fill_numbering_gaps(self):
        old1, stream1 = lesson("", 1, number=1, figure_number=1)
        old3, stream3 = lesson("", 3, number=3, figure_number=3)
        new2, stream2 = lesson("g10", 2, number=2, figure_number=2)
        lessons = [old1, new2, old3]
        stream = stream1 + stream2 + stream3
        assemble.claim_figures(lessons, stream)
        report = assemble.audit(lessons, stream, TOOLS.parent / "profiles/soviet-cn.json")
        self.assertTrue(any("题号缺号" in error and "[2]" in error
                            for error in report["errors"]))
        self.assertTrue(any("图号缺号" in error and "[2]" in error
                            for error in report["errors"]))

    def test_continuation_cannot_cross_numbering_scope(self):
        left = block(1, 1, "ex", "旧题", label="1", open=True)
        right = block(2, 1, "ex", "新题", "g10", label="1", cont=True)
        merged, warnings = assemble.merge_across_pages([left, right])
        self.assertEqual(len(merged), 2)
        self.assertEqual(merged[0]["lines"], ["旧题"])
        self.assertTrue(any("不同编号作用域" in warning for warning in warnings))

    def test_unscoped_partial_audit_input_remains_valid(self):
        report = assemble.audit([], [{"kind": "p", "page": 1}],
                                TOOLS.parent / "profiles/soviet-cn.json")
        self.assertEqual(report["errors"], [])
        with self.assertRaisesRegex(ValueError, "来源引用"):
            assemble.audit([], [{"kind": "p", "page": 1, "numbering_scope": "g10"}],
                           TOOLS.parent / "profiles/soviet-cn.json")


if __name__ == "__main__":
    unittest.main()
