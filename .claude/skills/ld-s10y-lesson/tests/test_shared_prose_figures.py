import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import validate_figure_references, validate_shared_prose_figures


class SharedProseFiguresTests(unittest.TestCase):
    def test_source_reference_and_manifest_are_required(self):
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            (book / "figures").mkdir()
            (book / "figures/fig-03.png").touch()
            prose = [{
                "kind": "p", "source_text": "See 图 $3$a.",
                "figures": [{"id": "fig-03", "label": "Figure 3"}],
            }]
            self.assertEqual(validate_shared_prose_figures(book, prose), ({"fig-03"}, []))
            self.assertEqual(
                validate_figure_references(prose, [], [{"id": "fig-03"}]), []
            )
            self.assertTrue(validate_figure_references(prose, [], []))
            prose[0]["source_text"] = "See 图 $30$."
            self.assertTrue(validate_shared_prose_figures(book, prose)[1])
            prose[0]["source_text"] = "See 图 $3$."
            (book / "figures/fig-03.png").unlink()
            self.assertTrue(validate_shared_prose_figures(book, prose)[1])

    def test_duplicate_and_malformed_shared_figures_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            book = Path(directory)
            for shared in [None, "fig-03", [None], [{"id": "../fig-03"}]]:
                self.assertTrue(validate_shared_prose_figures(
                    book, [{"kind": "p", "figures": shared}]
                )[1])
            prose = [
                {"kind": "p", "source_text": "图 $3$", "figures": [{"id": "fig-03"}]},
                {"kind": "p", "source_text": "图 $3$", "figures": [{"id": "fig-03"}]},
            ]
            errors = validate_shared_prose_figures(book, prose)[1]
            self.assertTrue(any("重复" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
