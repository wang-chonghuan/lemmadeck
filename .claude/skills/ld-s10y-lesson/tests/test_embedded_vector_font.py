"""Only the bundled renderer font can cross the SVG data-URI boundary."""

import base64
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL / "tools"))
from edition import svg_resource_scan


class EmbeddedVectorFont(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        font = SKILL / "node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2"
        cls.uri = "data:font/woff2;base64," + base64.b64encode(font.read_bytes()).decode("ascii")
        cls.css = '@font-face{font-family:LDVectorAccents;src:url(' + cls.uri + ') format("woff2");}'

    def scan(self, body):
        root = ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg">' + body + '</svg>')
        before = ET.tostring(root)
        scanned = svg_resource_scan(root)
        self.assertEqual(ET.tostring(root), before, "Do not alter the actual SVG")
        return scanned

    def test_exact_bundled_style_is_allowed_without_changing_svg(self):
        scanned = self.scan('<style>' + self.css + '</style><text>i\u20d7</text>')
        self.assertNotIn("data:", scanned)
        self.assertIn("i\u20d7", scanned)

    def test_other_data_and_external_links_are_not_hidden(self):
        for body, marker in [
            ('<style>@font-face{src:url(data:font/woff2;base64,bad)}</style>', "data:"),
            ('<style>' + self.css.replace("LDVectorAccents", "UnknownFont") + '</style>', "data:"),
            ('<style>' + self.css.replace('format("woff2")', 'format("woff")') + '</style>', "data:"),
            ('<style>' + self.css + 'body{background:url(https://example.com)}</style>', "https://"),
            ('<text>' + self.css + '</text>', "data:"),
            ('<image href="' + self.uri + '"/>', "data:"),
            ('<style>text{fill:url(data:image/svg+xml;base64,bad)}</style>', "data:"),
            ('<use href="http://example.com/asset.svg"/>', "http://"),
        ]:
            with self.subTest(marker=marker, body=body[:100]):
                self.assertIn(marker, self.scan(body))

    def test_allowed_font_does_not_hide_a_separate_external_link(self):
        scanned = self.scan('<style>' + self.css + '</style><use href="https://example.com"/>')
        self.assertNotIn("data:", scanned)
        self.assertIn("https://", scanned)


if __name__ == "__main__":
    unittest.main()
