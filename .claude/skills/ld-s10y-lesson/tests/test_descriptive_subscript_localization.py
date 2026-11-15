import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import math_signature, validate_text


class DescriptiveSubscriptLocalizationTests(unittest.TestCase):
    def test_upright_descriptive_labels_localize_without_formula_change(self):
        for source, modern in [
            (r"$x_{\mathrm{м}}$", r"$x_{\mathrm{m}}$"),
            (r"$\vec{G}_{\mathrm{н}}$", r"$\vec{G}_{\mathrm{n}}$"),
        ]:
            with self.subTest(source=source):
                self.assertEqual(math_signature(source), math_signature(modern))
                self.assertEqual(
                    validate_text(source, modern, ["notation"], [], "p", []), []
                )

    def test_other_formula_changes_are_not_label_localization(self):
        for source, modern in [
            (r"$м$", r"$m$"),
            (r"$x_{\mathrm{м}}$", r"$x_{\mathrm{n}}$"),
            (r"$x_{\mathrm{м}}=2$", r"$x_{\mathrm{m}}=3$"),
            (r"$\vec{G}_{\mathrm{н}}$", r"$G_{\mathrm{n}}$"),
        ]:
            with self.subTest(source=source):
                self.assertNotEqual(math_signature(source), math_signature(modern))


if __name__ == "__main__":
    unittest.main()
