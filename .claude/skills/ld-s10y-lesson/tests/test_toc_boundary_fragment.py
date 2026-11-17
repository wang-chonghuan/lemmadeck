import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import assemble


class BoundaryFragmentIdentityTest(unittest.TestCase):
    def test_untitled_fragment_does_not_claim_same_page_summary(self):
        with tempfile.TemporaryDirectory() as directory:
            toc = Path(directory) / "toc.json"
            toc.write_text(json.dumps({"contents": [{
                "id": "phy8-c2", "kind": "chapter", "lessons": [{
                    "id": "phy8-c2-s2", "title": "第五章 自然力", "page": 131, "topics": [{
                        "id": "phy8-c2-s2-t13", "title": "第五章提要", "page": 158,
                    }],
                }],
            }]}))
            fragment = {
                "number": None, "title": "（承上页）", "printed_title": None,
                "start_printed": 158,
            }
            summary = {
                "number": None, "title": "第五章提要", "printed_title": "第五章提要",
                "start_printed": 158,
            }
            warnings = assemble.check_toc([fragment, summary], toc, "8p", {158})
            self.assertNotIn("card_id", fragment)
            self.assertEqual(summary["card_id"], "phy8-c2-s2-t13")
            self.assertEqual(warnings, [])


if __name__ == "__main__":
    unittest.main()
