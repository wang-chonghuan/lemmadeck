"""Numerical affected-page evidence; does not render or open image payloads."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))

import layout
from PIL import Image

result = []
for page in (261, 264):
    image = Path(f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png")
    ink = layout.ink_mask(Image.open(image))
    cols = ink.any(axis=0).nonzero()[0]
    width = int(cols[-1] - cols[0] + 1) if cols.size else ink.shape[1]
    bands = layout.line_bands(ink, width)
    result.append({
        "page": page,
        "render_sha256": layout.sha256_file(image),
        "layout_sha256": layout.sha256_file(Path(layout.__file__)),
        "content_width": width,
        "detected_rows": len(bands),
        "bands_y_inclusive": bands,
    })
print(json.dumps(result, ensure_ascii=False, indent=2))
