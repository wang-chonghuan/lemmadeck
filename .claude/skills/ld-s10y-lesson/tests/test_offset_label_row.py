import sys
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))
import blocks


class OffsetLabelRowTests(unittest.TestCase):
    def setUp(self):
        self.body = (
            "\u0430) " + r"$\begin{cases}x+y=1,\\" + blocks.WRAP
            + r"x-y=2\end{cases}$; " + "\u0431) $x=3$."
        )
        self.plain = "---\n{}\n---\n\n<!-- ex 805 -->\n" + self.body + "\n"
        self.marked = self.plain.replace("ex 805", "ex 805 labelrow")

    def test_independent_label_row_adds_one_without_changing_math(self):
        _, plain = blocks.parse(self.plain)
        _, marked = blocks.parse(self.marked)
        self.assertEqual(blocks.printed_lines(plain), 2)
        self.assertEqual(blocks.printed_lines(marked), 3)
        self.assertEqual(blocks.text_of(plain[0]), blocks.text_of(marked[0]))
        self.assertEqual(marked[0]["lines"], plain[0]["lines"])
        self.assertEqual(marked[0]["label"], "805")
        self.assertTrue(marked[0]["offset_label_row"])
        self.assertNotIn("offset_label_row", plain[0])

    def test_flag_round_trips_without_repeating_labels(self):
        meta, marked = blocks.parse(self.marked)
        _, retained = blocks.parse(blocks.dump(meta, marked, 237))
        self.assertEqual(retained, marked)
        self.assertEqual(retained[0]["lines"], [self.body])

    def test_plain_prose_cannot_claim_a_label_row(self):
        with self.assertRaises(ValueError):
            blocks.parse("---\n{}\n---\n\n<!-- p labelrow -->\nText.\n")


if __name__ == "__main__":
    unittest.main()
