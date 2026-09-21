from __future__ import annotations

import sys
import json
import io
import tempfile
import unittest
from argparse import Namespace
from contextlib import redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

TOOLS = Path(__file__).resolve().parents[1] / "tools"
sys.path.insert(0, str(TOOLS))

import p2c


class ReusableFigureGeometryTest(unittest.TestCase):
    def test_reuses_finalized_geometry_for_the_same_render(self) -> None:
        meta = {
            "render": {"sha256": "render-sha"},
            "provenance": {"normalized": True},
        }
        prior_audit = {
            "figures": [
                {
                    "id": "fig-121",
                    "label": "图 121",
                    "box": [928, 976, 413, 296],
                    "components": 18,
                    "from": [930, 960, 410, 330],
                }
            ]
        }

        result = p2c._reusable_figure_geometry(
            meta,
            prior_audit,
            "fig-121",
            [928, 976, 413, 296],
            "render-sha",
        )

        self.assertEqual(
            result,
            (
                [928, 976, 413, 296],
                {"components": 18, "from": [930, 960, 410, 330]},
            ),
        )

    def test_resnaps_when_the_render_or_box_changed(self) -> None:
        meta = {
            "render": {"sha256": "old-render"},
            "provenance": {"normalized": True},
        }
        prior_audit = {
            "figures": [
                {
                    "id": "fig-121",
                    "box": [928, 976, 413, 296],
                    "components": 18,
                }
            ]
        }

        self.assertIsNone(
            p2c._reusable_figure_geometry(
                meta,
                prior_audit,
                "fig-121",
                [928, 976, 413, 296],
                "new-render",
            )
        )
        self.assertIsNone(
            p2c._reusable_figure_geometry(
                meta,
                prior_audit,
                "fig-121",
                [930, 960, 410, 330],
                "old-render",
            )
        )


class PdfResolutionTest(unittest.TestCase):
    def test_catalog_book_resolves_manifest_source_pdf_alias(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            sources = root / "sources"
            pdfs = sources / "pdfs"
            pdfs.mkdir(parents=True)
            expected = pdfs / "bound-volume.pdf"
            expected.write_bytes(b"%PDF")
            (sources / "manifest.json").write_text(json.dumps({
                "pdfRoot": "pdfs",
                "pdfs": [{"book": "6-7p", "file": expected.name}],
                "catalogs": [{"book": "6p", "sourcePdf": "6-7p"}],
            }))
            args = Namespace(
                books=str(sources),
                book="6p",
                pdf=None,
                series=None,
            )

            self.assertEqual(p2c._find_pdf(args), expected)


class VectorizeCommandTest(unittest.TestCase):
    def test_reports_renderer_failure_without_masking_it(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            figure = root / "6p" / "pages" / "0013" / "figures" / "fig-01.png"
            figure.parent.mkdir(parents=True)
            figure.write_bytes(b"png")
            args = Namespace(work=str(root), book="6p", page=None, turdsize=2)
            fake = SimpleNamespace(
                vectorize=lambda *_args, **_kwargs: {
                    "ok": False,
                    "error": "SVG renderer unavailable",
                }
            )
            output = io.StringIO()

            with patch.dict(sys.modules, {"vectorize": fake}), redirect_stdout(output):
                status = p2c.cmd_vectorize(args)

            self.assertEqual(status, 1)
            self.assertIn("SVG renderer unavailable", output.getvalue())


if __name__ == "__main__":
    unittest.main()
