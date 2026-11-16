import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path.cwd()
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/source-10c-p47-p49-targeted-repair-evidence"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import layout

target = OUT / "count-exclusions-candidate.json"
assert not target.exists(), "One candidate only"
records = []
for page in [48, 49]:
    p = f"{page:04d}"
    diagnosis = json.loads((OUT / p / "diagnostic.json").read_text())
    source = ROOT / f".tmp/ld-s10y-lesson/10c/pages/{p}/page.png"
    image = Image.open(source)
    ink = layout.ink_mask(image)
    exclusion = {
        "kind": "scan-artifact", "box": [0, 2470, 1695, 40],
        "reason": (
            f"Native bottom-margin strip shows only an irregular scan-boundary trace "
            f"at y{2478 if page == 48 else 2484}-{2498 if page == 48 else 2504}; "
            f"the complete folio and flanking dots at y{2263 if page == 48 else 2280}-"
            f"{2294 if page == 48 else 2310} are above this box. "
            "No body text, formula, folio or printed separator is excluded."
        ),
    }
    count_copy = layout.counting_ink(ink, [exclusion])
    bands = layout.line_bands(count_copy, diagnosis["content_width_from_original"])
    serial = [[int(a), int(b)] for a, b in bands]
    prior = [entry["y_inclusive"] for entry in diagnosis["bands"]]
    assert serial == prior[:-1], "Every body/folio band must remain unchanged"
    assert np.array_equal(ink, layout.ink_mask(image)), "No extraction-pixel change"
    assert exclusion["box"][1] >= 0.95 * image.height
    records.append({
        "page": page, "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "count_exclusions": [exclusion], "existing_guard_accepted": True,
        "candidate_count": len(bands), "bands": serial,
        "removed_band": prior[-1], "all_prior_body_and_folio_bands_byte_equal": True,
        "content_width_unchanged": True, "source_ink_unchanged": True,
        "count_override": False, "finalize_invocations": 0,
        "status": "single justified counting-metadata candidate; not a gate",
    })
target.write_text(json.dumps(records, indent=2) + "\n")
print(json.dumps(records, indent=2))
