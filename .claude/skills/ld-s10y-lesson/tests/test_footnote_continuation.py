import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class FootnoteContinuation(unittest.TestCase):
    def test_footnote_preserved_between_continuing_paragraph(self):
        stream = [
            {"kind": "p", "label": None, "ref": "p0014#4", "page": 14,
             "lines": ["重复运动。"], "open": True, "cont": False},
            {"kind": "p", "label": "footnote", "ref": "p0014#5", "page": 14,
             "lines": ["地球属于振动系统。"], "open": False, "cont": False},
            {"kind": "p", "label": None, "ref": "p0015#1", "page": 15,
             "lines": ["准确重复称周期运动。"], "open": False, "cont": True}
        ]
        merged, warnings = assemble.merge_across_pages(stream)
        self.assertEqual(warnings, [])
        self.assertEqual(len(merged), 2)
        self.assertEqual(
            merged[0]["lines"], ["重复运动。", "准确重复称周期运动。"]
        )
        self.assertEqual(merged[1]["lines"], ["地球属于振动系统。"])


if __name__ == "__main__":
    unittest.main()
