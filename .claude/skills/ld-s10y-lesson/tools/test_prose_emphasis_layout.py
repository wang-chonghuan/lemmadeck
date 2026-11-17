"""Source-bound layout regressions for STEMROBIN-180 Batch57 R1."""

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from edition import MATH, normalize_prose_layout


TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parents[3]
DOTS = '<span style="text-emphasis-style: dot; text-emphasis-position: under;">'
STOP = "\u3002"


class ProseEmphasisLayoutTests(unittest.TestCase):
    def test_css_semicolons_and_newlines_are_not_sentence_boundaries(self):
        tag = DOTS.replace("; ", ";\n")
        first = f"Before {tag}\u52a8\u80fd</span> after{STOP}"
        second = f"Next sentence{STOP}"
        self.assertEqual(
            normalize_prose_layout(f"*{first}{second}*"),
            f"*{first}\n{second}*",
        )

    def test_tag_bytes_do_not_count_toward_prose_paragraph_length(self):
        lines = [
            "A" * 55 + STOP,
            DOTS + "B" * 55 + "</span>" + STOP,
            "C" * 55 + STOP,
        ]
        expected = "\n".join(lines)
        self.assertEqual(normalize_prose_layout("".join(lines)), expected)
        self.assertEqual(normalize_prose_layout(expected), expected)

    def test_whole_block_wrappers_close_in_each_split_paragraph(self):
        for marker, nested in [("*", "**key**"), ("**", "*key*"), ("***", "key")]:
            with self.subTest(marker=marker):
                lines = [
                    f"First {nested}{STOP}",
                    f"Second{STOP}",
                    f"Third{STOP}",
                    f"Fourth{STOP}",
                    f"Fifth{STOP}",
                ]
                expected = (
                    marker + "\n".join(lines[:3]) + marker + "\n\n"
                    + marker + "\n".join(lines[3:]) + marker
                )
                actual = normalize_prose_layout(marker + "".join(lines) + marker)
                self.assertEqual(actual, expected)
                self.assertEqual(normalize_prose_layout(actual), actual)

    def test_distinct_inline_emphasis_is_not_a_whole_block_wrapper(self):
        text = "*First* and *second*" + STOP
        self.assertEqual(normalize_prose_layout(text), text)
        escaped = "*A literal closing star \\*"
        self.assertEqual(normalize_prose_layout(escaped), escaped)

    def test_canonical_multiple_paragraph_boundaries_are_preserved(self):
        text = f"*First{STOP}*\n\n*Second{STOP}\nThird{STOP}*"
        self.assertEqual(normalize_prose_layout(text), text)
        plain = f"First{STOP}\n\nSecond{STOP}\nThird{STOP}"
        self.assertEqual(normalize_prose_layout(plain), plain)

    def test_math_whitespace_and_newlines_remain_exact_across_split(self):
        math = "$m|\\vec{g}|h +\n  \\vec{v}^{*}$"
        lines = [
            f"\u7b2c\u4e00\u53e5{STOP}",
            f"\u77e2\u91cf{math}{STOP}",
            f"\u7b2c\u4e09\u53e5{STOP}",
            f"\u7b2c\u56db\u53e5{STOP}",
            f"\u7b2c\u4e94\u53e5{STOP}",
        ]
        actual = normalize_prose_layout("*" + "".join(lines) + "*")
        expected = "*" + "\n".join(lines[:3]) + "*\n\n*" + "\n".join(lines[3:]) + "*"
        self.assertEqual(actual, expected)
        self.assertEqual([match.group() for match in MATH.finditer(actual)], [math])
        self.assertEqual(normalize_prose_layout(actual), actual)

    def test_r1_source_blocks_keep_text_math_and_displayable_emphasis(self):
        source = json.loads(
            (ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/"
             "phy8-c4-s2-t15/lesson.json").read_text(encoding="utf-8"),
        )
        paragraphs = []
        for block in source["prose"][1:4]:
            text = block["text"].replace(". ", STOP).replace(".*", STOP + "*")
            actual = normalize_prose_layout(text)
            self.assertEqual(actual.count(DOTS), 1)
            self.assertEqual(
                [match.group() for match in MATH.finditer(actual)],
                [match.group() for match in MATH.finditer(text)],
            )
            plain = lambda value: re.sub(
                r"\s+", "", re.sub(r"<[^>]+>", "", value).replace("*", ""),
            )
            self.assertEqual(plain(actual), plain(text))
            self.assertEqual(normalize_prose_layout(actual), actual)
            paragraphs.extend(actual.split("\n\n"))

        vector = "$m|\\vec{g}|h +\n  \\vec{v}^{*}$"
        vector_lines = [f"\u529b{STOP}", vector + STOP] + [f"\u529b{STOP}"] * 3
        paragraphs.extend(
            normalize_prose_layout("*" + "".join(vector_lines) + "*").split("\n\n"),
        )
        result = subprocess.run(
            ["node", "-e", (
                "const fs=require('node:fs');"
                "const {proseInline}=require(process.argv[1]);"
                "process.stdout.write(JSON.stringify("
                "JSON.parse(fs.readFileSync(0,'utf8')).map(proseInline)))"
            ), str(TOOLS / "htmlfrag.js")],
            input=json.dumps(paragraphs), text=True, capture_output=True, check=True,
        )
        fragments = json.loads(result.stdout)
        for paragraph, fragment in zip(paragraphs, fragments):
            self.assertTrue(fragment.startswith("<em>"), paragraph)
            self.assertTrue(fragment.endswith("</em>"), paragraph)
            self.assertEqual(fragment.count("<em>"), 1)
            self.assertNotIn("katex-error", fragment)
            self.assertNotIn("sr-tex-err", fragment)
            if DOTS in paragraph:
                self.assertIn(DOTS, fragment)
                self.assertNotIn("&lt;span", fragment)
                self.assertNotIn('sr-prose-math">span', fragment)
                self.assertNotIn('sr-prose-math">text', fragment)
            if not MATH.search(paragraph):
                self.assertNotIn("*", fragment)
        self.assertEqual(fragments[-2].count('class="katex"'), 1)
        self.assertIn(vector[1:-1], fragments[-2])


if __name__ == "__main__":
    unittest.main()
