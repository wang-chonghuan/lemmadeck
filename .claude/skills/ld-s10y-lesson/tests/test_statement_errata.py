from copy import deepcopy
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class StatementErrataTests(unittest.TestCase):
    def setUp(self):
        self.original = "The intersection is parallel to the given plane."
        self.corrected = "The intersection is parallel to the given line."
        self.record = {
            "id": "statement-target",
            "target": "lesson.prose[0]",
            "source": {
                "page": 26,
                "printed_page": 19,
                "block": "p0026#11",
                "sha256": "source-page-hash",
                "pdf_sha256": "source-pdf-hash",
            },
            "original": self.original,
            "corrected": "",
            "reason": "The explicit theorem goal compares two lines.",
        }
        self.raw = {"prose": [{"text": self.original}]}
        self.modern = {
            "prose": [{"text": self.corrected}],
            "errata": [{**deepcopy(self.record), "corrected": self.corrected}],
        }

    def check(self, modern=None, raw=None):
        with patch.object(edition, "source_errata", return_value=[self.record]):
            return edition.validate_errata(
                Path("unused"),
                raw or self.raw,
                {"exercises": []},
                modern or self.modern,
                {"exercises": []},
            )

    def test_bound_statement_without_math_delimiters(self):
        corrections, errors = self.check()
        self.assertEqual(errors, [])
        self.assertEqual(corrections, {
            "lesson.prose[0]": [{
                "original": self.original,
                "corrected": self.corrected,
            }]
        })

    def test_formula_correction_still_supported(self):
        self.original = "$[QP)=\\alpha\\cap\\triangle ABC$"
        self.corrected = "$[QP]=\\alpha\\cap\\triangle BDC$"
        self.record["original"] = self.original
        self.raw["prose"][0]["text"] = self.original
        self.modern["prose"][0]["text"] = self.corrected
        self.modern["errata"][0].update(
            original=self.original, corrected=self.corrected,
        )
        self.assertEqual(self.check()[1], [])

    def test_source_binding_cannot_change(self):
        for field in ("target", "source", "original", "reason"):
            with self.subTest(field=field):
                modern = deepcopy(self.modern)
                modern["errata"][0][field] = "unbound"
                self.assertTrue(any(
                    f".{field} " in error for error in self.check(modern)[1]
                ))

    def test_missing_or_undeclared_record_rejected(self):
        missing = deepcopy(self.modern)
        missing["errata"] = []
        self.assertTrue(self.check(missing)[1])
        undeclared = deepcopy(self.modern)
        undeclared["errata"][0]["id"] = "not-registered"
        self.assertTrue(self.check(undeclared)[1])

    def test_blank_or_unchanged_replacement_rejected(self):
        for replacement in ("", " ", self.original):
            with self.subTest(replacement=replacement):
                modern = deepcopy(self.modern)
                modern["errata"][0]["corrected"] = replacement
                self.assertTrue(self.check(modern)[1])

    def test_exact_unique_source_span_required(self):
        for text in ("A different statement.", self.original * 2):
            with self.subTest(text=text):
                self.assertTrue(self.check(raw={"prose": [{"text": text}]})[1])

    def test_replacement_must_be_visible_and_original_absent(self):
        for text in ("A different statement.", self.corrected + self.original):
            with self.subTest(text=text):
                modern = deepcopy(self.modern)
                modern["prose"][0]["text"] = text
                self.assertTrue(self.check(modern)[1])


if __name__ == "__main__":
    unittest.main()
