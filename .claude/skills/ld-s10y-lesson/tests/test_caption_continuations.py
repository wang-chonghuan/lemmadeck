import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import assemble
import blocks


def block(kind, ref, lines, **fields):
    page = int(ref[1:5])
    return {
        "kind": kind,
        "label": None,
        "box": None,
        "owner_exercise": None,
        "cont": False,
        "open": False,
        "samerow": False,
        "lines": list(lines),
        "page": page,
        "printed_page": page - 11,
        "ref": ref,
        **fields,
    }


class CaptionContinuationsTest(unittest.TestCase):
    def merge(self, stream):
        before = copy.deepcopy(stream)
        merged, warnings = assemble.merge_across_pages(stream)
        self.assertEqual(stream, before, "merging must not mutate source objects")
        return merged, warnings

    def test_approved_caption_fragments(self):
        cases = [
            (
                "图 99", "p0119#13", "p0119#14",
                ["图 99　瓶子的制做：1—管子；"],
                ["2—玻璃；3—模子，"],
                "图 99　瓶子的制做：1—管子；2—玻璃；3—模子，", 1,
            ),
            (
                "图 102", "p0123#7", "p0123#8",
                ["图 102　液压千斤顶构造示意图："],
                [
                    "1—被举升的物体；2—小活",
                    "塞；3—阀门；4—下放重物用的",
                    "阀门；5—大活塞.",
                ],
                "图 102　液压千斤顶构造示意图：1—被举升的物体；"
                "2—小活塞；3—阀门；4—下放重物用的阀门；5—大活塞.", 3,
            ),
        ]
        for label, head_ref, tail_ref, head_lines, tail_lines, text, rows in cases:
            with self.subTest(label=label):
                stream = [
                    block("cap", head_ref, head_lines,
                          label=label, open=True, samerow=True),
                    block("cap", tail_ref, tail_lines, label=label, cont=True),
                ]
                self.assertEqual(blocks.printed_lines(stream), rows)
                merged, warnings = self.merge(stream)
                self.assertEqual(warnings, [])
                self.assertEqual(len(merged), 1)
                self.assertEqual(merged[0]["lines"], head_lines + tail_lines)
                self.assertEqual(blocks.text_of(merged[0]), text)
                self.assertEqual(merged[0]["label"], label)
                self.assertEqual(merged[0]["ref"], head_ref)
                self.assertEqual(merged[0]["printed_page"],
                                 stream[0]["printed_page"])
                self.assertTrue(merged[0]["samerow"])
                self.assertFalse(merged[0]["open"])
                self.assertEqual(merged[0]["spans"], [head_ref, tail_ref])
                self.assertEqual(blocks.printed_lines(stream), rows)

    def test_transparent_prose_and_exercise_pairing(self):
        for kind in ("p", "ex"):
            with self.subTest(kind=kind):
                label = "2" if kind == "ex" else None
                stream = [
                    block(kind, "p0100#1", ["First "], label=label, open=True,
                          spans=["p0099#4", "p0100#1"]),
                    block("cap", "p0100#2", ["One; "], label="图 99",
                          owner_exercise="2", open=True),
                    block("fig", "p0100#3", [], id="fig-99", label="图 99"),
                    block("foot", "p0100#4", ["89"]),
                    block("cap", "p0101#1", ["Two."], label="图 99",
                          owner_exercise="2", cont=True),
                    block(kind, "p0101#2", ["second."], label=label, cont=True,
                          open=True, spans=["p0101#2", "p0102#1"]),
                ]
                merged, warnings = self.merge(stream)
                self.assertEqual(warnings, [])
                self.assertEqual([b["kind"] for b in merged],
                                 [kind, "cap", "fig", "foot"])
                self.assertEqual(merged[0]["lines"], ["First ", "second."])
                self.assertEqual(merged[0]["label"], label)
                self.assertTrue(merged[0]["open"])
                self.assertEqual(merged[0]["spans"],
                                 ["p0099#4", "p0100#1", "p0101#2", "p0102#1"])
                self.assertEqual(merged[1]["lines"], ["One; ", "Two."])
                self.assertEqual(merged[1]["owner_exercise"], "2")
                self.assertEqual(merged[1]["spans"], ["p0100#2", "p0101#1"])
                self.assertFalse(merged[1]["open"])
                self.assertEqual(merged[2], stream[2])
                self.assertEqual(merged[3], stream[3])
                repeated, repeated_warnings = self.merge(merged)
                self.assertEqual(repeated, merged)
                self.assertEqual(repeated_warnings, [])

    def test_caption_chain_preserves_identity_and_existing_spans(self):
        stream = [
            block("cap", "p0119#13", ["A "], open=True, samerow=True,
                  owner_lesson="phy6-c4-s1",
                  spans=["p0118#8", "p0119#13"]),
            block("cap", "p0120#1", ["$x$ "], cont=True, open=True,
                  owner_lesson="phy6-c4-s1",
                  spans=["p0120#1", "p0120#2"]),
            block("cap", "p0121#1", ["B."], cont=True,
                  owner_lesson="phy6-c4-s1"),
        ]
        merged, warnings = self.merge(stream)
        self.assertEqual(warnings, [])
        self.assertEqual(len(merged), 1)
        self.assertEqual(merged[0]["lines"], ["A ", "$x$ ", "B."])
        self.assertEqual(merged[0]["spans"],
                         ["p0118#8", "p0119#13", "p0120#1",
                          "p0120#2", "p0121#1"])
        self.assertIsNone(merged[0]["label"])
        self.assertEqual(merged[0]["owner_lesson"], "phy6-c4-s1")
        self.assertEqual(merged[0]["ref"], "p0119#13")
        self.assertEqual(merged[0]["page"], 119)
        self.assertFalse(merged[0]["cont"])
        self.assertFalse(merged[0]["open"])
        self.assertTrue(merged[0]["samerow"])

    def test_orphan_and_mismatched_captions_warn_without_loss(self):
        cases = [
            (None, {"label": "图 99"}),
            ({"label": "图 99", "open": False}, {"label": "图 99"}),
            ({"label": "图 99", "open": True}, {"label": "图 102"}),
            ({"label": "图 99", "open": True, "owner_exercise": "1"},
             {"label": "图 99", "owner_exercise": "2"}),
            ({"label": "图 99", "open": True, "owner_lesson": "lesson-a"},
             {"label": "图 99", "owner_lesson": "lesson-b"}),
            ({"label": "图 99", "open": True, "owner_lesson": "lesson-a"},
             {"label": "图 99"}),
        ]
        for index, (head_fields, tail_fields) in enumerate(cases):
            with self.subTest(case=index):
                stream = []
                if head_fields is not None:
                    stream.append(block("cap", "p0100#1", ["Head."],
                                        **head_fields))
                stream.append(block("cap", "p0100#2", ["Tail."],
                                    cont=True, **tail_fields))
                merged, warnings = self.merge(stream)
                self.assertEqual(merged, stream)
                self.assertEqual(len(warnings), 1)
                self.assertIn("p0100#2", warnings[0])
                self.assertIn("cont", warnings[0])

    def test_caption_candidates_do_not_cross_text_or_heading_boundaries(self):
        for kind in ("h1", "h2", "h3", "exhead", "p", "ex"):
            with self.subTest(kind=kind):
                stream = [
                    block("cap", "p0100#1", ["Head."],
                          label="图 99", open=True),
                    block(kind, "p0100#2", ["Boundary."]),
                    block("cap", "p0100#3", ["Tail."],
                          label="图 99", cont=True),
                ]
                merged, warnings = self.merge(stream)
                self.assertEqual(merged, stream)
                self.assertEqual(len(warnings), 1)
                self.assertIn("p0100#3", warnings[0])

    def test_consumed_body_continuation_is_caption_boundary(self):
        stream = [
            block("p", "p0100#1", ["Body "], open=True),
            block("cap", "p0100#2", ["Head."], label="图 99", open=True),
            block("p", "p0100#3", ["end."], cont=True),
            block("cap", "p0100#4", ["Tail."], label="图 99", cont=True),
        ]
        merged, warnings = self.merge(stream)
        self.assertEqual([b["kind"] for b in merged], ["p", "cap", "cap"])
        self.assertEqual(merged[0]["lines"], ["Body ", "end."])
        self.assertEqual(merged[1]["lines"], ["Head."])
        self.assertTrue(merged[1]["open"])
        self.assertEqual(merged[2]["lines"], ["Tail."])
        self.assertEqual(len(warnings), 1)
        self.assertIn("p0100#4", warnings[0])

    def test_caption_continuation_does_not_search_past_another_caption(self):
        stream = [
            block("cap", "p0100#1", ["Earlier."], label="图 99", open=True),
            block("cap", "p0100#2", ["Other."], label="图 102"),
            block("cap", "p0100#3", ["Tail."], label="图 99", cont=True),
        ]
        merged, warnings = self.merge(stream)
        self.assertEqual(merged, stream)
        self.assertEqual(len(warnings), 1)
        self.assertIn("p0100#3", warnings[0])

    def test_caption_without_cont_does_not_implicitly_close_open_head(self):
        stream = [
            block("cap", "p0100#1", ["Head."], label="图 99", open=True),
            block("cap", "p0100#2", ["Fresh."], label="图 99"),
        ]
        merged, warnings = self.merge(stream)
        self.assertEqual(merged, stream)
        self.assertEqual(warnings, [])
        self.assertTrue(merged[0]["open"])


if __name__ == "__main__":
    unittest.main()
