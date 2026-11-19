import json
import sys
from pathlib import Path

from PIL import Image
import numpy as np

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import layout

result = []
for page in (229, 233):
    image_path = ROOT / f".tmp/ld-s10y-lesson/7a/pages/{page:04d}/page.png"
    ink = layout.ink_mask(Image.open(image_path))
    columns = np.flatnonzero(ink.any(axis=0))
    content_w = int(columns[-1] - columns[0] + 1)
    bands = layout.line_bands(ink, content_w)
    audit_path = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/7a/pages/{page:04d}/audit.json"
    result.append({
        "page": page,
        "image": {"path": str(image_path), "sha256": layout.sha256_file(image_path)},
        "layout": {
            "path": ".claude/skills/ld-s10y-lesson/tools/layout.py",
            "sha256": layout.sha256_file(ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"),
        },
        "audit": {"path": str(audit_path), "sha256": layout.sha256_file(audit_path)},
        "detected_bands": bands,
        "raw_fragments": layout._row_fragments(ink, content_w),
        "source_truth_claim": False,
        "parent_image_opens": 0,
    })
print(json.dumps({"diagnostic_only": True, "pages": result}, ensure_ascii=False))
