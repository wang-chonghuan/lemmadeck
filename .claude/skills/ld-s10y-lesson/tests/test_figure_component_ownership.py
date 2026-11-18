"""Contract checks for explicit source-bound component ownership."""
import contextlib
import copy
import hashlib
import io
import json
import sys
import tempfile
import unittest
from argparse import Namespace
from pathlib import Path
from unittest.mock import patch

import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import blocks
import layout
import p2c


def transfer(ink, donor, receiver, box):
    x, y, w, h = box
    local = ink[y:y + h, x:x + w]
    return {
        "from": donor, "to": receiver, "box": box, "pixels": int(local.sum()),
        "ink_sha256": hashlib.sha256(local.tobytes()).hexdigest(),
        "reason": "Explicit source inspection assigns this complete component.",
    }


class ComponentOwnershipTests(unittest.TestCase):
    def setUp(self):
        self.ink = np.zeros((100, 120), dtype=bool)
        self.ink[40:60, 20:40] = True
        self.ink[40:60, 80:100] = True
        self.ink[20:24, 50:54] = True
        self.ink[70:74, 50:54] = True
        self.figures = [
            {"id": "fig-01", "box": [10, 10, 50, 80]},
            {"id": "fig-02", "box": [45, 10, 65, 80]},
        ]
        self.spec = {
            "render_sha256": "source",
            "transfers": [
                transfer(self.ink, "fig-01", "fig-02", [50, 70, 4, 4]),
                transfer(self.ink, "fig-02", "fig-01", [50, 20, 4, 4]),
            ],
        }

    def resolve(self, spec=None, ink=None):
        return layout.figure_component_ownership(
            self.ink if ink is None else ink, self.figures,
            self.spec if spec is None else spec, "source",
        )

    def test_all_own_components_and_source_union_retained(self):
        masks = self.resolve()
        expected_left = np.zeros_like(self.ink)
        expected_left[40:60, 20:40] = True
        expected_left[20:24, 50:54] = True
        np.testing.assert_array_equal(masks["fig-01"], expected_left)
        np.testing.assert_array_equal(masks["fig-02"], self.ink & ~expected_left)
        self.assertFalse((masks["fig-01"] & masks["fig-02"]).any())
        np.testing.assert_array_equal(masks["fig-01"] | masks["fig-02"], self.ink)
        for figure in self.figures:
            exclusion = layout.figure_crop_exclusion(self.ink, masks[figure["id"]], figure["box"])
            self.assertFalse((exclusion & masks[figure["id"]]).any())

    def test_without_metadata_collision_is_not_silently_fixed(self):
        masks = layout.figure_component_ownership(self.ink, self.figures, None, "source")
        self.assertEqual(int((masks["fig-01"] & masks["fig-02"]).sum()), 32)

    def test_invalid_and_stale_provenance(self):
        for value in ({}, [], {"render_sha256": "old", "transfers": self.spec["transfers"]}):
            with self.subTest(value=value), self.assertRaises(ValueError):
                self.resolve(value)
        changed = self.ink.copy()
        changed[20, 50] = False
        with self.assertRaises(ValueError):
            self.resolve(ink=changed)

    def test_partial_selector_and_changed_hash_rejected(self):
        for key, value in (
            ("box", [50, 70, 3, 4]), ("pixels", 15), ("ink_sha256", "changed"),
        ):
            spec = copy.deepcopy(self.spec)
            spec["transfers"][0][key] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                self.resolve(spec)

    def test_own_only_foreign_and_unknown_owners_rejected(self):
        spec = copy.deepcopy(self.spec)
        spec["transfers"][0] = transfer(self.ink, "fig-01", "fig-02", [20, 40, 20, 20])
        with self.assertRaisesRegex(ValueError, "own-only"):
            self.resolve(spec)
        for field, value in (("to", "absent"), ("to", "fig-01"), ("from", "absent")):
            spec = copy.deepcopy(self.spec)
            spec["transfers"][0][field] = value
            with self.subTest(field=field, value=value), self.assertRaises(ValueError):
                self.resolve(spec)

    def test_duplicate_and_shared_component_rejected(self):
        spec = copy.deepcopy(self.spec)
        spec["transfers"].append(copy.deepcopy(spec["transfers"][0]))
        with self.assertRaisesRegex(ValueError, "assigned twice"):
            self.resolve(spec)
        ink = self.ink.copy()
        ink[50, 20:100] = True
        spec = copy.deepcopy(self.spec)
        spec["transfers"][0] = transfer(ink, "fig-01", "fig-02", [20, 40, 80, 20])
        with self.assertRaisesRegex(ValueError, "shared/partial"):
            self.resolve(spec, ink)

    def test_receiver_crop_cannot_clip_component(self):
        self.figures[1]["from"] = self.figures[1]["box"]
        self.figures[1]["box"] = [55, 10, 55, 80]
        with self.assertRaisesRegex(ValueError, "crop cuts"):
            self.resolve()

    def finalize_fixture(self, specification):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        root = Path(temporary.name)
        page = root / "root/test/pages/0001"
        work = root / "work/test/pages/0001"
        page.mkdir(parents=True)
        work.mkdir(parents=True)
        Image.fromarray(np.where(self.ink, 0, 255).astype(np.uint8)).save(work / "page.png")
        source_sha = layout.sha256_file(work / "page.png")
        meta = {"printed_page": 1, "render": {"sha256": source_sha}}
        if specification is not None:
            specification = copy.deepcopy(specification)
            specification["render_sha256"] = source_sha
            meta["figure_component_ownership"] = specification
        figs = []
        for number, figure in enumerate(self.figures, 1):
            figs.append({
                "kind": "fig", "label": f"Figure {number}", "box": figure["box"],
                "lines": [], "open": False, "cont": False,
            })
        (page / "page.md").write_text(blocks.dump(meta, figs, 1))
        pdf = root / "source.pdf"
        pdf.write_bytes(b"local synthetic provenance fixture")
        args = Namespace(root=root / "root", work=root / "work", book="test", page=1)
        return page, work, pdf, args

    def test_repeated_finalize_provenance_and_crop_hashes_stable(self):
        page, work, pdf, args = self.finalize_fixture(self.spec)
        with patch.object(p2c, "_find_pdf", return_value=pdf), contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(p2c.cmd_finalize(args), 0)
            paths = [page / "page.md", page / "page.json", page / "audit.json",
                     *sorted((work / "figures").glob("*.png"))]
            first = {str(path): layout.sha256_file(path) for path in paths}
            self.assertEqual(p2c.cmd_finalize(args), 0)
        self.assertEqual(first, {str(path): layout.sha256_file(path) for path in paths})
        audit = json.loads((page / "audit.json").read_text())
        self.assertEqual(audit["errors"], [])
        self.assertEqual(audit["figures"][0]["component_ownership"]["transfers"],
                         json.loads((page / "page.json").read_text())["meta"]
                         ["figure_component_ownership"]["transfers"])

    def test_finalize_duplicate_gate_still_fails(self):
        page, _, pdf, args = self.finalize_fixture(None)
        with patch.object(p2c, "_find_pdf", return_value=pdf), contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(p2c.cmd_finalize(args), 1)
        errors = json.loads((page / "audit.json").read_text())["errors"]
        self.assertTrue(any("同一连通域" in error for error in errors))

    def test_bad_metadata_fails_before_output_mutation(self):
        spec = copy.deepcopy(self.spec)
        spec["transfers"][0]["box"] = [50, 70, 3, 4]
        page, work, _, args = self.finalize_fixture(spec)
        before = (page / "page.md").read_bytes()
        with contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(p2c.cmd_finalize(args), 2)
        self.assertEqual(before, (page / "page.md").read_bytes())
        self.assertFalse((page / "page.json").exists())
        self.assertFalse((work / "figures").exists())


if __name__ == "__main__":
    unittest.main()
