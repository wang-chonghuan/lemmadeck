import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import edition


class ChineseNumberContractTests(unittest.TestCase):
    def test_joined_printed_line_keeps_chinese_unit_number(self):
        source = "三包茶叶重150克，10包这样的茶叶重多少？100包呢？"
        errors = edition.validate_text(
            source, source, [], [], "exercise54", [],
            source_lines=["三包茶叶重150克，10包这样的茶叶重多少？100", "包呢？"],
        )
        self.assertEqual(errors, [])
        self.assertEqual(edition.number_signature(source), ["150", "10", "100"])

    def test_changed_number_next_to_chinese_unit_requires_declaration(self):
        errors = edition.validate_text(
            "100天生产80000米布。", "101天生产80000米布。",
            ["context-number"], [], "exercise55", [],
        )
        self.assertTrue(any("非公式数字变化" in error for error in errors))

    def test_bound_plain_number_erratum_updates_expected_numbers(self):
        errors = edition.validate_text(
            "个级里有537个一，读作48千537",
            "个级里有573个一，读作48千573",
            ["math-correction"], [], "exercise25", [],
            math_corrections=[{
                "original": "个级里有537个一，读作48千537",
                "corrected": "个级里有573个一，读作48千573",
            }],
        )
        self.assertEqual(errors, [])
        errors = edition.validate_text(
            "个级里有537个一，读作48千537",
            "个级里有573个一，读作48千574",
            ["math-correction"], [], "exercise25", [],
            math_corrections=[{
                "original": "个级里有537个一，读作48千537",
                "corrected": "个级里有573个一，读作48千573",
            }],
        )
        self.assertTrue(any("非公式数字变化" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
