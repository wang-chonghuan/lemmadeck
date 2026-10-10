import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
from edition import sha256, validate_generation_metadata


class ReviewedArtworkReuseTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        root = Path(self.directory.name)
        self.old_source = root / "old-source.png"
        self.current_source = root / "current-source.png"
        self.generated = root / "generated.png"
        self.asset = root / "transparent.png"
        for path in (self.old_source, self.current_source, self.generated, self.asset):
            path.write_bytes(path.name.encode("ascii"))
        self.metadata = root / "generation.json"
        self.metadata.write_text(json.dumps({
            "schema": "n-azure/image-generation@1",
            "model": "gpt-image-2", "mode": "edit", "prompt": "Isolated artwork.",
            "references": [{"path": str(self.old_source), "sha256": sha256(self.old_source)}],
            "output": {"path": str(self.generated), "sha256": sha256(self.generated)},
        }))
        self.spec = {"source": {"image": {"sha256": sha256(self.current_source)}}}
        self.reuse = {
            "reason": "Both source figures require the same isolated child.",
            "source": {"path": str(self.current_source), "sha256": sha256(self.current_source)},
            "generationSha256": sha256(self.metadata),
            "assetSha256": sha256(self.asset),
        }

    def check(self, reuse):
        return validate_generation_metadata(
            self.metadata, self.spec, {}, reuse=reuse, asset_path=self.asset,
        )

    def test_current_source_still_required_without_reviewed_reuse(self):
        self.assertTrue(validate_generation_metadata(self.metadata, self.spec, {}))

    def test_reviewed_reuse_preserves_original_generation(self):
        before = self.metadata.read_bytes()
        self.assertEqual(self.check(self.reuse), [])
        self.assertEqual(self.metadata.read_bytes(), before)

    def test_every_reuse_binding_is_required(self):
        for field in ("source", "reason", "generationSha256", "assetSha256"):
            with self.subTest(field=field):
                changed = copy.deepcopy(self.reuse)
                changed.pop(field)
                self.assertTrue(self.check(changed))

    def test_original_source_and_output_remain_verified(self):
        for path in (self.old_source, self.generated):
            with self.subTest(path=path.name):
                original = path.read_bytes()
                path.write_bytes(b"changed")
                self.assertTrue(self.check(self.reuse))
                path.write_bytes(original)

    def test_changed_current_asset_or_source_is_rejected(self):
        for path in (self.asset, self.current_source):
            with self.subTest(path=path.name):
                original = path.read_bytes()
                path.write_bytes(b"changed")
                self.assertTrue(self.check(self.reuse))
                path.write_bytes(original)


if __name__ == "__main__":
    unittest.main()
