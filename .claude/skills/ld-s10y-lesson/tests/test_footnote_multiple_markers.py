import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

from assemble import cut_lessons, merge_across_pages


def block(kind, text, ref, **extra):
    return {
        "kind": kind, "lines": [text], "ref": ref, "page": 36,
        "printed_page": 27, **extra,
    }


class MultipleFootnoteMarkersTests(unittest.TestCase):
    def test_distinct_markers_keep_ownership_before_next_heading(self):
        stream = [
            block("h3", "12. Gas law", "p0036#1"),
            block("p", "Apparatus warning①.", "p0036#2"),
            block("p", "Temperature explanation②.", "p0036#3"),
            block("h3", "13. Molecular model", "p0036#4"),
            block("p", "Next lesson.", "p0036#5"),
            block("p", "① Mercury warning.", "p0036#6", label="footnote"),
            block("p", "② See section 18.", "p0036#7", label="footnote"),
        ]
        merged, warnings = merge_across_pages(stream)
        self.assertEqual(warnings, [])
        lessons = cut_lessons(merged)
        self.assertEqual(
            [item["ref"] for item in lessons[0]["blocks"]],
            ["p0036#2", "p0036#6", "p0036#3", "p0036#7"],
        )
        self.assertEqual([item["ref"] for item in lessons[1]["blocks"]], ["p0036#5"])

    def test_second_marker_does_not_match_first_marker(self):
        stream = [
            block("h3", "12. Gas law", "p0036#1"),
            block("p", "First warning①.", "p0036#2"),
            block("p", "② Missing callout.", "p0036#3", label="footnote"),
        ]
        merged, _ = merge_across_pages(stream)
        with self.assertRaisesRegex(ValueError, "找到 0 个"):
            cut_lessons(merged)

    def test_ambiguous_second_marker_fails(self):
        stream = [
            block("h3", "12. Gas law", "p0036#1"),
            block("p", "First explanation②.", "p0036#2"),
            block("p", "Another explanation②.", "p0036#3"),
            block("p", "② Ambiguous footnote.", "p0036#4", label="footnote"),
        ]
        merged, _ = merge_across_pages(stream)
        with self.assertRaisesRegex(ValueError, "找到 2 个"):
            cut_lessons(merged)


if __name__ == "__main__":
    unittest.main()
