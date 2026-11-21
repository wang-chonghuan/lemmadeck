import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d565-source419-first-review"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import layout


def main():
    source = ROOT / ".tmp/STEMROBIN-181/d1816-d561/work/10p/pages/0419/page.png"
    audit_path = ROOT / ".tmp/STEMROBIN-181/d1816-d564/root/10p/pages/0419/audit.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
    columns = np.flatnonzero(ink.any(axis=0))
    content_width = int(columns[-1] - columns[0] + 1)
    for figure in audit["figures"]:
        x, y, width, height = figure["box"]
        ink[y:y + height, x:x + width] = False
    before = layout.line_bands(ink, content_width)
    stamp_box = [730, 10, 235, 75]
    x, y, width, height = stamp_box
    stamp_pixels = int(ink[y:y + height, x:x + width].sum())
    ink[y:y + height, x:x + width] = False
    after = layout.line_bands(ink, content_width)
    assert before == [(20, 70), (1907, 1945), (1963, 1999)]
    assert after == [(1907, 1945), (1963, 1999)]
    result = {
        "status": "DIAGNOSTIC_IN_MEMORY_ONLY_NOT_GATE_FIX",
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "audit_sha256": hashlib.sha256(audit_path.read_bytes()).hexdigest(),
        "stamp_box_xywh": stamp_box,
        "stamp_threshold_ink_pixels_removed": stamp_pixels,
        "bands_before": before,
        "bands_after_removing_only_stamp_rectangle": after,
        "far_right_fold_not_removed": True,
        "conclusion": "The blue stamp rectangle alone accounts for the extra retained default band; far-right fold/specks within the same y-range do not retain another band by themselves.",
        "candidate_or_native_changes": 0,
        "finalize_calls": 0,
        "paid_calls": 0,
        "new_visual_loads": 0,
    }
    with (OWN / "stamp-only-counterfactual.json").open("x", encoding="utf-8") as output:
        json.dump(result, output, ensure_ascii=False, indent=2)
        output.write("\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
