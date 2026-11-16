import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "build_context.py"
SPEC = importlib.util.spec_from_file_location("null_caption_context", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class NullFigureCaptionTest(unittest.TestCase):
    def test_null_caption_preserves_identity_and_nearby_context(self):
        blocks = [
            {"kind": "p", "text": "Historical portrait."},
            {"kind": "fig", "id": "portrait", "label": None},
        ]
        self.assertEqual(
            MODULE.prose_context(blocks, "portrait"),
            [{"figureLabel": None, "nearbyText": ["Historical portrait."]}],
        )

    def test_missing_caption_does_not_match_every_distant_paragraph(self):
        blocks = [
            {"kind": "p", "text": "Unrelated distant paragraph."},
            {"kind": "fig", "id": "other-1"},
            {"kind": "fig", "id": "other-2"},
            {"kind": "fig", "id": "other-3"},
            {"kind": "p", "text": "Nearby portrait context."},
            {"kind": "fig", "id": "portrait"},
        ]
        self.assertEqual(
            MODULE.prose_context(blocks, "portrait"),
            [{"figureLabel": "", "nearbyText": ["Nearby portrait context."]}],
        )

    def test_numbered_caption_still_finds_distant_direct_reference(self):
        blocks = [
            {"kind": "p", "text": "Read FIG 150 carefully."},
            {"kind": "fig", "id": "other-1"},
            {"kind": "fig", "id": "other-2"},
            {"kind": "fig", "id": "other-3"},
            {"kind": "fig", "id": "fig-150", "label": "Fig 150"},
        ]
        self.assertEqual(
            MODULE.prose_context(blocks, "fig-150"),
            [{"figureLabel": "Fig 150", "nearbyText": ["Read FIG 150 carefully."]}],
        )


if __name__ == "__main__":
    unittest.main()
