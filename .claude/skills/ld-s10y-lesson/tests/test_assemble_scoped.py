from __future__ import annotations

import contextlib
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import assemble
import blocks


class ScopedAssemblyTest(unittest.TestCase):
    def test_supplied_stream_keeps_original_refs_and_ignores_unselected_pages(self) -> None:
        _, parsed = blocks.parse("---\n{}\n---\n<!-- h3 -->\n32. Symmetry\n\n<!-- p -->\nA complete paragraph.\n")
        stream = [
            {**block, "page": 111, "printed_page": 104, "ref": f"p0111#{index + 5}"}
            for index, block in enumerate(parsed)
        ]
        with tempfile.TemporaryDirectory() as temporary:
            book = Path(temporary) / "9-10g"
            unrelated = book / "pages" / "0001"
            unrelated.mkdir(parents=True)
            (unrelated / "page.json").write_text("unselected input", encoding="utf-8")
            with contextlib.redirect_stdout(io.StringIO()):
                result = assemble.run(
                    book, None, TOOLS.parent / "profiles" / "soviet-cn.json",
                    stream=stream,
                )
            self.assertEqual(result, 0)
            lesson = json.loads((book / "lessons" / "32-Symmetry" / "lesson.json").read_text())
            self.assertEqual(lesson["prose"][0]["source_refs"], ["p0111#6"])
            self.assertEqual((unrelated / "page.json").read_text(), "unselected input")


if __name__ == "__main__":
    unittest.main()
