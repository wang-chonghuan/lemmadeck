from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class UnlabelledExerciseContinuationTests(unittest.TestCase):
    def blocks(self, label=None, scope="g10"):
        return [
            {"kind": "ex", "label": "6", "open": True, "page": 154,
             "ref": "p0154#9", "lines": ["6. First part;"], "numbering_scope": "g10"},
            {"kind": "foot", "label": None, "page": 154, "ref": "p0154#10",
             "lines": ["147"], "numbering_scope": "g10"},
            {"kind": "ex", "label": label, "cont": True, "page": 155,
             "ref": "p0155#1", "lines": ["Second part."], "numbering_scope": scope},
        ]

    def test_unlabelled_cont_keeps_original_number_and_both_source_spans(self):
        merged, warnings = assemble.merge_across_pages(self.blocks())
        self.assertEqual(warnings, [])
        exercises = [block for block in merged if block["kind"] == "ex"]
        self.assertEqual(len(exercises), 1)
        self.assertEqual(exercises[0]["label"], "6")
        self.assertEqual(exercises[0]["lines"], ["6. First part;", "Second part."])
        self.assertEqual(exercises[0]["spans"], ["p0154#9", "p0155#1"])
        self.assertFalse(exercises[0]["open"])

    def test_matching_explicit_number_can_continue(self):
        merged, warnings = assemble.merge_across_pages(self.blocks(label="6"))
        self.assertEqual(warnings, [])
        self.assertEqual(sum(block["kind"] == "ex" for block in merged), 1)

    def test_other_explicit_number_is_not_swallowed(self):
        merged, warnings = assemble.merge_across_pages(self.blocks(label="7"))
        self.assertEqual(sum(block["kind"] == "ex" for block in merged), 2)
        self.assertEqual(len(warnings), 1)

    def test_unlabelled_cont_cannot_cross_numbering_scope(self):
        merged, warnings = assemble.merge_across_pages(self.blocks(scope="g9"))
        self.assertEqual(sum(block["kind"] == "ex" for block in merged), 2)
        self.assertEqual(len(warnings), 1)
        self.assertIn("作用域", warnings[0])

    def test_unlabelled_cont_requires_open_predecessor(self):
        stream = self.blocks()
        stream[0]["open"] = False
        merged, warnings = assemble.merge_across_pages(stream)
        self.assertEqual(sum(block["kind"] == "ex" for block in merged), 2)
        self.assertEqual(len(warnings), 1)


if __name__ == "__main__":
    unittest.main()
