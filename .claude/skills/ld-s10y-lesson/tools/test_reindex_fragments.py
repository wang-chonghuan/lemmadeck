import argparse
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import p2c


class ReindexFragmentsTest(unittest.TestCase):
    def run_case(self, fragment_number=None, fragment_card=None):
        with tempfile.TemporaryDirectory() as temporary:
            book = Path(temporary)
            cards = [{"id": "before", "page": 10}, {"id": "after", "page": 30}]
            for identity, page, number, card in [
                ("before", 10, "1", "before"),
                ("fragment", 20, fragment_number, fragment_card),
                ("after", 30, "2", "after"),
            ]:
                folder = book / "lessons" / identity
                folder.mkdir(parents=True)
                (folder / "lesson.json").write_text(json.dumps({
                    "id": identity, "card_id": card, "number": number,
                    "title": identity, "start_printed": page,
                    "prose": [], "figures": [],
                }))
                (folder / "exercises.json").write_text(json.dumps({
                    "lesson": identity, "exercises": [],
                }))
            toc = book / "toc.json"
            toc.write_text("{}")
            args = argparse.Namespace(book="10c", toc=toc)
            with patch.object(p2c, "_book_dir", return_value=book), \
                 patch.object(p2c, "_catalog_config", return_value={}), \
                 patch("assemble._toc_cards", return_value=cards):
                p2c.cmd_reindex(args)
            return json.loads((book / "book.json").read_text())

    def test_unclaimed_fragment_is_retained_between_toc_cards(self):
        index = self.run_case()
        self.assertEqual([row["id"] for row in index["lessons"]],
                         ["before", "fragment", "after"])
        self.assertIn("Unclaimed continuation", index["audit"]["warnings"][1])

    def test_numbered_non_toc_lesson_still_fails(self):
        with self.assertRaises(SystemExit):
            self.run_case(fragment_number="3")

    def test_wrong_claimed_card_still_fails(self):
        with self.assertRaises(SystemExit):
            self.run_case(fragment_card="missing")


if __name__ == "__main__":
    unittest.main()
