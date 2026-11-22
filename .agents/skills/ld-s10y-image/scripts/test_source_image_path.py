import hashlib
import tempfile
import unittest
from pathlib import Path

from validate_spec import source_image_path


class SourceImagePathTests(unittest.TestCase):
    def test_identical_relocated_pixels(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            suffix = "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-09.png"
            current = root / suffix
            current.parent.mkdir(parents=True)
            current.write_bytes(b"retained source pixels")
            old = Path("/missing/.codex/worktrees/00b1/lemmadeck") / suffix
            digest = hashlib.sha256(current.read_bytes()).hexdigest()
            self.assertEqual(source_image_path(str(old), digest, root), current.resolve())
            self.assertEqual(source_image_path(str(old), "0" * 64, root), old)
            current.unlink()
            self.assertEqual(source_image_path(str(old), digest, root), old)

    def test_existing_declared_file_is_not_substituted(self):
        with tempfile.TemporaryDirectory() as directory:
            declared = Path(directory) / "original.png"
            declared.write_bytes(b"changed")
            self.assertEqual(source_image_path(str(declared), "0" * 64), declared)

    def test_non_worktree_and_escape_paths_are_not_remapped(self):
        for value in [
            "/unrelated/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10p/fig.png",
            "/missing/.codex/worktrees/00b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/../../../../secret.png",
        ]:
            self.assertEqual(source_image_path(value, "0" * 64, Path("/tmp/project")), Path(value))


if __name__ == "__main__":
    unittest.main()
