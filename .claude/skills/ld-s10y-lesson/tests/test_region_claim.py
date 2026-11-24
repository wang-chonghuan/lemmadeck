"""STEMROBIN-192: 机器提候选裁图区域，模型只认领编号。"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import blocks as B
import layout


def page_with_a_table() -> np.ndarray:
    """三行正文 + 一张画在右下的方格表。"""
    img = Image.new("L", (900, 1200), 255)
    draw = ImageDraw.Draw(img)
    for row in range(3):
        y = 120 + row * 70
        for column in range(24):
            x = 80 + column * 30
            draw.rectangle([x, y, x + 16, y + 26], fill=0)
    # 一张 3x3 的表：长横线与长竖线，连通域明显不是字形
    for index in range(4):
        draw.line([(420, 700 + index * 90), (840, 700 + index * 90)], fill=0, width=5)
        draw.line([(420 + index * 140, 700), (420 + index * 140, 970)], fill=0, width=5)
    return layout.ink_mask(img)


class CandidateRegionTest(unittest.TestCase):
    def test_a_table_becomes_one_candidate_that_contains_it(self) -> None:
        ink = page_with_a_table()
        regions = layout.candidate_regions(ink, ink.shape[1])
        self.assertTrue(regions, "表格没有被提成候选区域")
        table = [
            region for region in regions
            if region["box"][1] > 600 and region["box"][2] > 300
        ]
        self.assertEqual(len(table), 1, [region["box"] for region in regions])
        x, y, w, h = table[0]["box"]
        self.assertLessEqual(x, 420)
        self.assertLessEqual(y, 700)
        self.assertGreaterEqual(x + w, 840)
        self.assertGreaterEqual(y + h, 970)
        self.assertEqual(table[0]["id"], f"r{regions.index(table[0]) + 1}")

    def test_body_text_is_not_a_candidate(self) -> None:
        ink = page_with_a_table()
        regions = layout.candidate_regions(ink, ink.shape[1])
        text_rows = [region for region in regions if region["box"][1] < 400]
        self.assertEqual(text_rows, [], "正文行被当成了候选区域")


class RegionBlockSyntaxTest(unittest.TestCase):
    def md(self, head: str) -> list[dict]:
        meta = json.dumps({"schema": "x", "page": 1})
        return B.parse(f"---{meta}---\n\n<!-- {head} -->\n")[1]

    def test_single_region_claim(self) -> None:
        block, = self.md("fig 图 7 region r3")
        self.assertEqual(block["regions"], ["r3"])
        self.assertIsNone(block["box"])
        self.assertEqual(block["label"], "图 7")

    def test_combined_region_claim(self) -> None:
        block, = self.md("fig 表 region r2+r3 owner-ex 20")
        self.assertEqual(block["regions"], ["r2", "r3"])
        self.assertEqual(block["owner_exercise"], "20")
        self.assertEqual(block["label"], "表")

    def test_box_syntax_still_works(self) -> None:
        block, = self.md("fig 图 7 box 790,1640,490,250")
        self.assertEqual(block["box"], [790, 1640, 490, 250])
        self.assertIsNone(block["regions"])

    def test_region_survives_a_dump_round_trip(self) -> None:
        blocks = self.md("fig 图 7 region r2+r3")
        blocks[0]["box"] = [10, 20, 30, 40]
        text = B.dump({"schema": "x", "page": 1}, blocks, 1)
        self.assertIn("region r2+r3", text)
        self.assertIn("box 10,20,30,40", text)
        again = B.parse(text)[1][0]
        self.assertEqual(again["regions"], ["r2", "r3"])
        self.assertEqual(again["box"], [10, 20, 30, 40])


if __name__ == "__main__":
    unittest.main()
