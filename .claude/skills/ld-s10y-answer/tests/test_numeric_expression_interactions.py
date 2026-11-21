import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


REPO = Path(__file__).resolve().parents[4]
MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "lesson_interactions.py"
MODULE_SPEC = importlib.util.spec_from_file_location("numeric_interactions", MODULE_PATH)
interactions = importlib.util.module_from_spec(MODULE_SPEC)
MODULE_SPEC.loader.exec_module(interactions)


class NumericExpressionInteractionTests(unittest.TestCase):
    def derive(self, parts, **exercise_fields):
        return interactions.derive(
            {"number": "1", **exercise_fields},
            {"grading": "auto", "parts": parts},
            {},
            Path("."),
        )

    def assert_actual_numeric_math(self, lesson, exercise, expected):
        base = REPO / (
            "ssot-resources/soviet10year-textbooks/artifacts/10c/"
            f"editions/modern-us-neutral/lessons/{lesson}"
        )
        answers = json.loads((base / "answer-keys.json").read_text(encoding="utf-8"))
        self.assertEqual(answers["status"], "ready")
        answer = next(a for a in answers["answers"] if str(a["exercise"]) == exercise)
        self.assertEqual(answer["grading"], "auto")
        self.assertEqual(len(answer["parts"]), 1)
        self.assertEqual(answer["parts"][0]["judge"], "numeric")
        self.assertEqual(answer["parts"][0]["expected"], [expected])
        exercises = json.loads((base / "exercises.json").read_text(encoding="utf-8"))
        prompt = next(e for e in exercises["exercises"] if str(e["number"]) == exercise)
        result = interactions.derive(prompt, answer, {}, Path("."))
        self.assertEqual(result["widget"], "math")
        self.assertNotIn("needsAuthoring", result)
        self.assertIn("judge=numeric", result["derivation"])
        self.assertNotIn("expected", result)

    def test_n77_e35_existing_radical_key(self):
        self.assert_actual_numeric_math(
            "ana10-c6-s1-n77", "35", r"\frac{\sqrt{2}}{2}"
        )

    def test_n78_e43_existing_fraction_key(self):
        self.assert_actual_numeric_math("ana10-c6-s1-n78", "43", r"\frac{5}{4}")

    def test_n78_e45_existing_fraction_key(self):
        self.assert_actual_numeric_math("ana10-c6-s1-n78", "45", r"\frac{6}{5}")

    def test_numeric_alternatives_with_nonplain_value(self):
        result = self.derive([
            {"judge": "numeric", "expected": ["1.25", r"\frac{5}{4}"]},
            {"judge": "numeric", "expected": ["2"]},
        ])
        self.assertEqual(result["widget"], "math")
        self.assertNotIn("needsAuthoring", result)

    def test_plain_numeric_keeps_number_metadata(self):
        result = self.derive([
            {"label": "value", "unit": "cm", "judge": "numeric", "expected": ["-2.5"]},
        ])
        self.assertEqual(result["widget"], "number")
        self.assertEqual(result["parts"], [{"label": "value", "unit": "cm"}])
        self.assertNotIn("needsAuthoring", result)

    def test_plain_numeric_keeps_grid_plot(self):
        result = self.derive(
            [{"judge": "numeric", "expected": [v]} for v in ["2", "8", "3", "4"]],
            text="A(2,8), B(3,4)",
        )
        self.assertEqual(result["widget"], "grid-plot")
        self.assertEqual(result["points"], {"A": [2, 8], "B": [3, 4]})
        self.assertEqual(result["parts"], [
            {"point": "A", "axis": "x"}, {"point": "A", "axis": "y"},
            {"point": "B", "axis": "x"}, {"point": "B", "axis": "y"},
        ])

    def test_plain_numeric_keeps_grid_point(self):
        objects = [
            {"type": "text", "text": str(n), "at": [n * 10, 100]}
            for n in [1, 2, 3]
        ] + [
            {"type": "text", "text": str(n), "at": [0, 100 - n * 10]}
            for n in [1, 2, 3]
        ]
        for name, at in [("M", [20, 90]), ("N", [30, 80])]:
            objects.extend([
                {"type": "point", "at": at},
                {"type": "text", "text": name, "at": at},
            ])
        with tempfile.TemporaryDirectory() as directory:
            spec_dir = Path(directory)
            (spec_dir / "grid.spec.json").write_text(
                json.dumps({"mode": "deterministic", "objects": objects}), encoding="utf-8"
            )
            result = interactions.derive(
                {"number": "1", "figureRefs": ["grid"]},
                {"grading": "auto", "parts": [
                    {"judge": "numeric", "expected": [v]} for v in ["2", "1", "3", "2"]
                ]},
                {"grid": {"spec": "grid.spec.json"}},
                spec_dir,
            )
        self.assertEqual(result["widget"], "grid-point")
        self.assertEqual(result["points"], {"M": [2, 1], "N": [3, 2]})
        self.assertNotIn("needsAuthoring", result)

    def test_exact_keeps_math_without_authoring(self):
        result = self.derive([{"judge": "exact", "expected": [r"\frac{5}{4}"]}])
        self.assertEqual(result["widget"], "math")
        self.assertNotIn("needsAuthoring", result)
        self.assertIn("judge=exact", result["derivation"])

    def test_expression_keeps_math_in_mixed_parts(self):
        result = self.derive([
            {"judge": "expression", "expected": ["x+1"]},
            {"judge": "numeric", "expected": ["2"]},
        ])
        self.assertEqual(result["widget"], "math")
        self.assertNotIn("needsAuthoring", result)
        self.assertIn("judge=expression", result["derivation"])

    def test_truly_mixed_judges_keep_authoring_flag(self):
        result = self.derive([
            {"judge": "numeric", "expected": [r"\frac{5}{4}"]},
            {"judge": "exact", "expected": ["x"]},
        ])
        self.assertEqual(result["widget"], "math")
        self.assertIn("needsAuthoring", result)
        self.assertIn("['exact', 'numeric']", result["derivation"])

    def test_missing_parts_keep_authoring_flag(self):
        result = self.derive([])
        self.assertEqual(result["widget"], "math")
        self.assertIn("needsAuthoring", result)

    def test_ungraded_keeps_free(self):
        result = interactions.derive(
            {"number": "1"}, {"grading": "ungraded"}, {}, Path(".")
        )
        self.assertEqual(result["widget"], "free")
        self.assertNotIn("needsAuthoring", result)


if __name__ == "__main__":
    unittest.main()
