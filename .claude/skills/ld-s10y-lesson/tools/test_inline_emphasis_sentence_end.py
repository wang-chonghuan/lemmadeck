"""Sentence-end emphasis cases from the prose layout contract and batch 58."""

import re
import unittest

import edition


class InlineEmphasisSentenceEndTests(unittest.TestCase):
    def assert_layout(self, source, expected, preserves_markers=True):
        actual = edition.normalize_prose_layout(source)
        self.assertEqual(actual, expected)
        self.assertEqual(edition.normalize_prose_layout(actual), expected)
        self.assertEqual(edition.MATH.findall(actual), edition.MATH.findall(source))
        self.assertEqual(len(actual.split("\n\n")), len(expected.split("\n\n")))
        for paragraph in actual.split("\n\n"):
            self.assertIsNone(re.fullmatch(r"[\s*]*", paragraph))
        if preserves_markers:
            self.assertEqual(
                re.sub(r"\s+", "", actual),
                re.sub(r"\s+", "", source),
            )

    def test_batch58_original_wording(self):
        self.assert_layout(
            "势能是由另外的物体对该物体的作用力来确定的。"
            "但是，相互作用的物体是平等的。"
            "因此，*只有相互作用的物体才具有势能。* "
            "**势能是物体的相互作用能。**",
            "势能是由另外的物体对该物体的作用力来确定的。\n"
            "但是，相互作用的物体是平等的。\n"
            "因此，*只有相互作用的物体才具有势能。*\n\n"
            "**势能是物体的相互作用能。**",
        )

    def test_single_double_triple_inline_closers(self):
        for marker in ("*", "**", "***"):
            with self.subTest(marker=marker):
                self.assert_layout(
                    f"第一句。第二句。因此，{marker}强调句。{marker} 后一句。",
                    f"第一句。\n第二句。\n因此，{marker}强调句。{marker}\n\n后一句。",
                )

    def test_nested_closing_runs(self):
        for span in (
            "*外层 **内层。***",
            "**外层 *内层。***",
            "*外层**内层。***",
            "**外层*内层。***",
            "*外层 ***内层。****",
            "***外层 **内层。*****",
            "*外层 **内层。** 外层结束。*",
            "**外层 *内层。* 外层结束。**",
        ):
            with self.subTest(span=span):
                if "外层结束" in span:
                    normalized_span = span.replace("。** ", "。**\n").replace("。* ", "。*\n")
                    expected = f"前言，{normalized_span}\n尾句。"
                else:
                    expected = f"第一句。\n第二句。\n前言，{span}\n\n尾句。"
                source = (
                    f"前言，{span} 尾句。"
                    if "外层结束" in span
                    else f"第一句。第二句。前言，{span} 尾句。"
                )
                self.assert_layout(source, expected)

    def test_adjacent_closing_and_opening_runs(self):
        for first in ("*", "**", "***"):
            for second in ("*", "**", "***"):
                with self.subTest(first=first, second=second):
                    self.assert_layout(
                        f"第一句。第二句。前言，{first}强调。{first}"
                        f"{second}后句。{second}",
                        f"第一句。\n第二句。\n前言，{first}强调。{first}"
                        f"\n\n{second}后句。{second}",
                    )

    def test_opening_markers_stay_with_following_sentence(self):
        self.assert_layout(
            "第一句。第二句。第三句。**后句。**",
            "第一句。\n第二句。\n第三句。\n\n**后句。**",
        )

    def test_whole_wrappers_keep_paragraph_count(self):
        for marker in ("*", "**", "***"):
            with self.subTest(marker=marker):
                self.assert_layout(
                    f"{marker}第一句。第二句。第三句。第四句。{marker}",
                    f"{marker}第一句。\n第二句。\n第三句。{marker}\n\n"
                    f"{marker}第四句。{marker}",
                    preserves_markers=False,
                )
        for outer, inner in (("*", "**"), ("**", "*")):
            with self.subTest(outer=outer, inner=inner):
                self.assert_layout(
                    f"{outer}第一句。第二句。前言，{inner}第三句。{inner} 第四句。{outer}",
                    f"{outer}第一句。\n第二句。\n前言，{inner}第三句。{inner}{outer}\n\n"
                    f"{outer}第四句。{outer}",
                    preserves_markers=False,
                )

    def test_existing_paragraphs_and_sentence_punctuation(self):
        for punctuation in ("。", "！", "？", "；", ";"):
            with self.subTest(punctuation=punctuation):
                self.assert_layout(
                    f"前言，*强调{punctuation}*\n\n后句。",
                    f"前言，*强调{punctuation}*\n\n后句。",
                )

    def test_formula_sentence_end_and_html_bytes(self):
        self.assert_layout(
            r'<span title="x*y">前言</span>，*公式 $x=1.$* 后句。',
            '<span title="x*y">前言</span>，*公式 $x=1.$*\n后句。',
        )

    def test_protected_and_escaped_stars_are_not_delimiters(self):
        self.assert_layout(
            r"前言 $a*b=c$。转义 \*文字。后句。",
            "前言 $a*b=c$。\n转义 \\*文字。\n后句。",
        )


if __name__ == "__main__":
    unittest.main()
