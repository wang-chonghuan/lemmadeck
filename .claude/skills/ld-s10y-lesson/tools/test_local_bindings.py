import copy
from pathlib import Path
import unittest

import assemble
from edition import SourceBook


class LocalBindingsTest(unittest.TestCase):
    def stream(self):
        def block(kind, page, label=None, owner=None):
            return {
                "kind": kind, "page": page, "ref": f"p{page:04d}#1",
                "lines": ["Section" if kind == "h3" else "Original"],
                "label": label, "owner_exercise": owner,
            }
        return [
            block("h3", 1), block("ex", 1, "119"),
            block("h3", 2), block("ex", 2, "119"),
            block("h3", 197), block("foot", 197, "note", "119"),
            block("h3", 220), block("ex", 220, "3"),
        ]

    def test_strict_default_preserved(self):
        with self.assertRaises(ValueError):
            assemble.cut_lessons(self.stream())

    def test_scoped_diagnostics_never_attach_ambiguous_note(self):
        errors = []
        original = self.stream()
        candidates = assemble.cut_lessons(copy.deepcopy(original), binding_errors=errors)
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0]["ref"], "p0197#1")
        for candidate in candidates:
            for block in candidate["blocks"]:
                self.assertEqual(block["lines"], ["Original"])
        source = SourceBook(Path("."))
        source._binding_errors = errors
        source.assert_bindings(candidates[-1])
        for candidate in candidates[:-1]:
            with self.assertRaises(SystemExit):
                source.assert_bindings(candidate)

    def test_scoped_figure_errors_block_possible_owners(self):
        stream = [block for block in self.stream() if block["kind"] != "foot"]
        figure = {
            "kind": "fig", "page": 197, "ref": "p0197#2", "lines": [],
            "id": "fig-1", "label": "Figure 1", "owner_exercise": "119",
        }
        stream.insert(-2, figure)
        candidates = assemble.cut_lessons(copy.deepcopy(stream))
        for candidate in candidates:
            candidate["prose"], candidate["exercises"] = assemble.split_lesson(candidate)
        errors = []
        strict_errors, _ = assemble.claim_figures(candidates, stream, errors)
        self.assertEqual(len(strict_errors), 1)
        self.assertEqual(len(errors), 1)
        source = SourceBook(Path("."))
        source._binding_errors = errors
        source.assert_bindings(candidates[-1])
        for candidate in candidates[:-1]:
            with self.assertRaises(SystemExit):
                source.assert_bindings(candidate)


if __name__ == "__main__":
    unittest.main()
