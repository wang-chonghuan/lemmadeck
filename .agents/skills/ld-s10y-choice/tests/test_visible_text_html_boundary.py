#!/usr/bin/env python3
"""Contract checks for mathematical Markdown versus embedded media/HTML/URLs."""

from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from validate import ContractError, visible_text


class VisibleTextHtmlBoundaryTests(unittest.TestCase):
    def assert_allowed(self, values):
        for value in values:
            for where in ("stem", "option.text"):
                with self.subTest(value=value, where=where):
                    visible_text(value, where)

    def assert_forbidden(self, values):
        for value in values:
            for where in ("stem", "option.text"):
                with self.subTest(value=value, where=where):
                    with self.assertRaises(ContractError) as raised:
                        visible_text(value, where)
                    self.assertEqual(str(raised.exception),
                                     f"{where}: embedded media/HTML/URL")

    def test_source_style_multiple_inequalities(self):
        self.assert_allowed([
            "In I for $0<x<6$, and in IV for $x>6$.",
            "In II for $x<0$, in I for $0<x<4$, and in IV for $x>4$.",
            "In III for $x<-6$, in II for $-6<x<0$, and in I for $x>0$.",
            "$0 < x < 6$ followed by $x > 6$.",
            "$0<x<6$\n\n$x>6$",
            "0<x<6 and x>6",
        ])

    def test_mathematical_markdown_table(self):
        self.assert_allowed([
            "| Row | Result |\n| --- | --- |\n"
            "| a | $15>8$ |\n| b | $15<70$ |\n"
            "| c | $0<x<6$ |\n| d | $x>6$ |",
            r"$\frac{3}{5}>\frac{1}{3}$ and $4<\frac{5}{2}$",
        ])

    def test_open_and_self_closing_tags(self):
        self.assert_forbidden([
            "<b>text",
            "<script>",
            "<IMG/>",
            "<h2 >",
            "<svg\n/>",
            "<math-choice>",
            "<choice2-card />",
        ])

    def test_tag_attributes(self):
        self.assert_forbidden([
            "<input disabled>",
            "<span data-state=ready>",
            '<span title="a > b">',
            "<span title='a < b'>",
            '<svg viewBox="0 0 10 10" xml:lang=en _label="axis" data.value=ready>',
            '<math-choice\n data-answer = "$0<x<6$ and $x>6$" />',
            "<math-choice data-value=$x$>",
        ])

    def test_end_tags(self):
        self.assert_forbidden([
            "</span>",
            "</SPAN \n>",
            "</math-choice\t>",
        ])

    def test_comments(self):
        self.assert_forbidden([
            "<!-- hidden input -->",
            "<!-->",
            "<!-- unfinished",
        ])

    def test_markdown_media(self):
        self.assert_forbidden([
            "![graph](figure.svg)",
            "![graph][asset]",
            "![",
        ])

    def test_url_schemes(self):
        self.assert_forbidden([
            "[source](https://example.test)",
            "http://example.test",
            "HTTPS://example.test",
            "file:figure.svg",
            "DATA:image/png;base64,AAAA",
        ])

    def test_math_does_not_hide_forbidden_content(self):
        self.assert_forbidden([
            "$0<x<6$ <span title='value'> $x>6$",
            "$<img src='figure.png'>$",
            "$<!-- hidden -->$",
            "$![graph](figure.svg)$",
            "$https://example.test$",
            "$file:figure.svg$",
            "$data:image/png;base64,AAAA$",
        ])


if __name__ == "__main__":
    unittest.main()
