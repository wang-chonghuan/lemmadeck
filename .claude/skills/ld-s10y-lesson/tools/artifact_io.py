"""Replace changed working artifacts without rewriting unchanged evidence bytes."""
from __future__ import annotations

import tempfile
from pathlib import Path


def write_if_changed(path: Path, data: bytes, root: Path | None = None) -> bool:
    if path.is_symlink() or (
        root is not None and not path.parent.resolve().is_relative_to(root.resolve())
    ):
        raise ValueError(f"artifact output redirects its owner: {path}")
    if path.is_file() and path.read_bytes() == data:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as handle:
        temporary = Path(handle.name)
        handle.write(data)
    try:
        temporary.chmod(0o644)
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    return True
