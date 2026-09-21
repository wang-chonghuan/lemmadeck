from __future__ import annotations

import sys
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import blocks


class BlockTextTest(unittest.TestCase):
    def test_adjacent_line_math_runs_are_separated(self) -> None:
        _, parsed = blocks.parse(
            '---\n{"printed_page": 1}\n---\n\n'
            '<!-- p -->\n'
            '因为 $0.05\\\\times10=$\n'
            '$0.5$。\n'
        )

        self.assertEqual(
            blocks.text_of(parsed[0]),
            '因为 $0.05\\\\times10=$ $0.5$。',
        )
        self.assertNotIn("$$", blocks.text_of(parsed[0]))

    def test_same_page_exercise_continuation_after_figure_is_preserved(self) -> None:
        _, parsed = blocks.parse(
            '---\n{"printed_page": 1}\n---\n\n'
            '<!-- ex 15 -->\n'
            '填表：\n'
            'а)\n\n'
            '<!-- fig 表 а box 1,2,3,4 owner-ex 15 -->\n'
            '![表 а](figures/a.png)\n\n'
            '<!-- ex 15 cont -->\n'
            'б)\n'
        )

        self.assertEqual(parsed[0]["lines"], ["填表：", "а)"])
        self.assertTrue(parsed[2]["cont"])
        self.assertEqual(parsed[2]["lines"], ["б)"])
        self.assertEqual(
            blocks.text_of({"lines": parsed[0]["lines"] + parsed[2]["lines"]}),
            "填表：а) б)",
        )

    def test_multiline_side_by_side_caption_reuses_each_printed_row(self) -> None:
        _, parsed = blocks.parse(
            '---\n{"printed_page": 1}\n---\n\n'
            '<!-- cap -->\n'
            '左一\n'
            '左二\n\n'
            '<!-- cap samerow -->\n'
            '右一\n'
            '右二\n'
        )

        self.assertEqual(blocks.printed_lines(parsed), 2)


if __name__ == "__main__":
    unittest.main()
