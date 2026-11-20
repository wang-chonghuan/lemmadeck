import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import blocks


class StarredOwnerTests(unittest.TestCase):
    def test_starred_printed_identity_round_trips(self):
        md = (
            '---\n{"book":"3m","page":34}\n---\n'
            '<!-- ex 117* -->\n117* 1) Units\n'
            '<!-- fig table box 303,2882,1997,486 owner-ex 117* -->\n'
        )
        meta, parsed = blocks.parse(md)
        self.assertEqual(parsed[0]["label"], "117*")
        self.assertEqual(parsed[1]["owner_exercise"], "117*")
        self.assertEqual(parsed[1]["label"], "table")
        _, reparsed = blocks.parse(blocks.dump(meta, parsed, 34))
        self.assertEqual(reparsed, parsed)

    def test_existing_owners_and_flags(self):
        for owner in ("33", "g2-1", "q1", "117*"):
            with self.subTest(owner=owner):
                _, parsed = blocks.parse(
                    '---\n{}\n---\n'
                    f'<!-- fig table owner-ex {owner} box 1,2,3,4 cont -->\n'
                )
                self.assertEqual(parsed[0]["owner_exercise"], owner)
                self.assertEqual(parsed[0]["label"], "table")
                self.assertTrue(parsed[0]["cont"])


if __name__ == "__main__":
    unittest.main()
