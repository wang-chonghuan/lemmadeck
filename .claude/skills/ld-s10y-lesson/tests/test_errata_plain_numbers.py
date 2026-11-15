import copy
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class PlainNumberErrataTests(unittest.TestCase):
    def check_record(self, original, corrected, mutate=None, modern=None):
        expected = {
            "id": "units-class",
            "target": "exercises[0]",
            "source": {"page": 1, "block": "p0001#1", "sha256": "a" * 64},
            "original": original,
            "corrected": "",
            "reason": "The units class must agree with the given number.",
        }
        record = {**copy.deepcopy(expected), "corrected": corrected}
        if mutate:
            mutate(record)
        with patch.object(edition, "source_errata", return_value=[expected]):
            return edition.validate_errata(
                Path("unused"),
                {"prose": []},
                {"exercises": [{"text": f"Read 48 573. {original}."}]},
                {"prose": [], "errata": [record]},
                {"exercises": [{"text": f"Read 48 573. {modern or corrected}."}]},
            )

    def test_plain_numeric_erratum_is_accepted(self):
        original = "537 units, read 48 thousand 537"
        corrected = "573 units, read 48 thousand 573"
        corrections, errors = self.check_record(original, corrected)
        self.assertEqual(errors, [])
        self.assertEqual(
            corrections,
            {"exercises[0]": [{"original": original, "corrected": corrected}]},
        )

    def test_formula_erratum_remains_accepted(self):
        _, errors = self.check_record("$2+2=5$", "$2+2=4$")
        self.assertEqual(errors, [])

    def test_numeric_fact_can_adjoin_chinese_prose(self):
        _, errors = self.check_record("\u6709537\u4e2a", "\u6709573\u4e2a")
        self.assertEqual(errors, [])

    def test_digits_inside_ascii_identifier_are_not_numeric_facts(self):
        _, errors = self.check_record("x537", "x573")
        self.assertTrue(any("公式或数字" in error for error in errors))

    def test_plain_words_are_not_math_errata(self):
        _, errors = self.check_record("old spelling", "new spelling")
        self.assertTrue(any("公式或数字" in error for error in errors))

    def test_numeric_original_cannot_be_replaced_by_numberless_text(self):
        _, errors = self.check_record("537 units", "several units")
        self.assertTrue(any("公式或数字" in error for error in errors))

    def test_numeric_erratum_keeps_source_hash_binding(self):
        _, errors = self.check_record(
            "537 units",
            "573 units",
            mutate=lambda record: record["source"].update(sha256="b" * 64),
        )
        self.assertTrue(any(".source" in error for error in errors))

    def test_known_error_cannot_remain_in_modern_target(self):
        _, errors = self.check_record(
            "537 units", "573 units", modern="537 units and 573 units"
        )
        self.assertTrue(any("已知错误仍在" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
