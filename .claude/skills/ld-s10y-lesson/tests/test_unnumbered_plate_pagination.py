import copy
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from p2c import _validate_page_pagination


class UnnumberedPlatePaginationTests(unittest.TestCase):
    def setUp(self):
        self.meta = {
            "printed_page": None,
            "pagination": {
                "kind": "unnumbered-plate",
                "label": "\u56fe V",
                "reason": "The source contains a Roman-V plate caption but no printed folio.",
            },
        }
        self.blocks = [
            {"kind": "fig", "label": "\u56fe V", "lines": []},
            {"kind": "cap", "label": "\u56fe V", "lines": ["\u56fe V. Emission spectra.", "Absorption spectra."]},
        ]

    def test_explicit_unnumbered_plate_preserves_null_folio(self):
        self.assertEqual(_validate_page_pagination(self.meta, self.blocks), [])
        self.assertIsNone(self.meta["printed_page"])

    def test_normal_numbered_page_needs_no_declaration(self):
        self.assertEqual(_validate_page_pagination({"printed_page": 218}, []), [])

    def test_missing_folio_without_declaration_still_fails(self):
        self.assertTrue(_validate_page_pagination({"printed_page": None}, self.blocks))

    def test_fabricated_folio_conflicts_with_unnumbered_declaration(self):
        for folio in ("V", 5, 419):
            with self.subTest(folio=folio):
                meta = copy.deepcopy(self.meta)
                meta["printed_page"] = folio
                self.assertTrue(_validate_page_pagination(meta, self.blocks))

    def test_declaration_requires_reason(self):
        self.meta["pagination"]["reason"] = " "
        self.assertTrue(_validate_page_pagination(self.meta, self.blocks))

    def test_declared_label_must_be_original_roman_label(self):
        for label in ("\u56fe 5", "V", None, 5):
            with self.subTest(label=label):
                self.meta["pagination"]["label"] = label
                self.assertTrue(_validate_page_pagination(self.meta, self.blocks))

    def test_figure_and_caption_labels_must_match(self):
        self.blocks[1]["label"] = "\u56fe IV"
        self.assertTrue(_validate_page_pagination(self.meta, self.blocks))

    def test_caption_text_must_include_declared_label(self):
        self.blocks[1]["lines"][0] = "Emission spectra."
        self.assertTrue(_validate_page_pagination(self.meta, self.blocks))

    def test_folio_or_ordinary_prose_blocks_cannot_use_plate_exception(self):
        for kind in ("foot", "p", "h3"):
            with self.subTest(kind=kind):
                blocks = self.blocks + [{"kind": kind, "label": None, "lines": ["419"]}]
                self.assertTrue(_validate_page_pagination(self.meta, blocks))

    def test_multiple_figures_cannot_use_single_plate_declaration(self):
        self.blocks.append(copy.deepcopy(self.blocks[0]))
        self.assertTrue(_validate_page_pagination(self.meta, self.blocks))

    def test_malformed_declarations_fail(self):
        for declaration in (True, "unnumbered-plate", {}, {"kind": "unnumbered-plate"}):
            with self.subTest(declaration=declaration):
                self.meta["pagination"] = declaration
                self.assertTrue(_validate_page_pagination(self.meta, self.blocks))


if __name__ == "__main__":
    unittest.main()
