"""Numbered source continuity retains intervening prose without crossing units."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from assemble import merge_across_pages


def block(kind, ref, lines, **fields):
    return {"kind": kind, "ref": ref, "page": int(ref[1:5]),
            "lines": lines, **fields}


class NumberedContinuationTests(unittest.TestCase):
    def test_retained_footnote_does_not_split_numbered_exercise(self):
        stream = [
            block("ex", "p0014#7", ["23. a+b-40", "1) 200,300"], label="23", open=True),
            block("p", "p0014#8", ["Translator's note."]),
            block("foot", "p0014#9", ["10"]),
            block("ex", "p0015#1", ["4) 290,160"], label="23", cont=True),
        ]
        merged, warnings = merge_across_pages(stream)
        self.assertEqual(warnings, [])
        self.assertEqual(len(merged), 3)
        self.assertEqual(merged[0]["lines"], ["23. a+b-40", "1) 200,300", "4) 290,160"])
        self.assertEqual(merged[0]["spans"], ["p0014#7", "p0015#1"])
        self.assertFalse(merged[0]["open"])
        self.assertEqual(merged[1]["lines"], ["Translator's note."])

    def test_another_exercise_is_a_boundary(self):
        stream = [
            block("ex", "p0014#1", ["23."], label="23", open=True),
            block("ex", "p0014#2", ["24."], label="24"),
            block("p", "p0014#3", ["Note."]),
            block("ex", "p0015#1", ["Continuation."], label="23", cont=True),
        ]
        merged, warnings = merge_across_pages(stream)
        self.assertTrue(warnings)
        self.assertEqual(merged[0]["lines"], ["23."])
        self.assertEqual(len(merged), 4)

    def test_new_section_is_a_boundary_even_when_number_matches(self):
        stream = [
            block("ex", "p0014#1", ["1."], label="1", open=True),
            block("h3", "p0014#2", ["Next section"]),
            block("p", "p0014#3", ["Text."]),
            block("ex", "p0015#1", ["Continuation."], label="1", cont=True),
        ]
        merged, warnings = merge_across_pages(stream)
        self.assertTrue(warnings)
        self.assertEqual(merged[0]["lines"], ["1."])
        self.assertEqual(len(merged), 4)

    def test_unnumbered_continuation_does_not_guess_past_prose(self):
        stream = [
            block("ex", "p0014#1", ["23."], label="23", open=True),
            block("p", "p0014#2", ["Text."]),
            block("ex", "p0015#1", ["Continuation."], cont=True),
        ]
        merged, warnings = merge_across_pages(stream)
        self.assertTrue(warnings)
        self.assertEqual(len(merged), 3)


if __name__ == "__main__":
    unittest.main()
