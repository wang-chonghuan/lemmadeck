import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import normalize_prose_layout


class ProseSentenceGroupsTest(unittest.TestCase):
    def test_long_complete_sentences_stay_in_pairs(self):
        sentences = [f"Sentence {n} " + "word " * 24 + "." for n in range(4)]
        result = normalize_prose_layout("\n".join(sentences))
        self.assertEqual([len(p.splitlines()) for p in result.split("\n\n")], [2, 2])

    def test_four_sentences_do_not_leave_a_singleton(self):
        sentences = ["First.", "Second.", "Third.", "Fourth."]
        result = normalize_prose_layout("\n".join(sentences))
        self.assertEqual(result, "First.\nSecond.\n\nThird.\nFourth.")

    def test_formula_stays_with_its_intro(self):
        text = "First.\nSecond.\nA formula:\n$x=2$\nLast."
        result = normalize_prose_layout(text)
        self.assertIn("A formula:\n$x=2$", result)


if __name__ == "__main__":
    unittest.main()
