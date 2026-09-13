from __future__ import annotations

import sys
import unittest
from pathlib import Path

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


if __name__ == "__main__":
    unittest.main()
