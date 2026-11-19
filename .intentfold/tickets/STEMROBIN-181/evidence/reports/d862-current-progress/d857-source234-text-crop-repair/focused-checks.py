import copy
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import blocks
import layout
import p2c

root = Path(".intentfold/tickets/STEMROBIN-181/tmp/d857-source234-text-crop-repair")
checks = []
ink = np.zeros((30, 30), dtype=bool)
ink[5:8, 3:6] = True
ink[15:17, 12:18] = True
source = [{"kind": "p", "lines": ["printed text"]}]
figure = {"id": "fig-01", "box": [5, 5, 15, 15]}
region = {"block": 1, "line": 1, "text": "printed text", "box": [3, 3, 3, 5], "reason": "Inspected adjacent prose"}
meta = {"figure_crops": {"fig-01": {"padding_px": 2, "reason": "Inspected source crop", "exclude_text_regions": [region]}}}


def check(name, value, candidate=figure, image=ink, fail=False):
    try:
        p2c._figure_crop_text_exclusions(value, candidate, source, image)
    except ValueError:
        assert fail, name
    else:
        assert not fail, name
    checks.append({"name": name, "result": "PASS"})


check("no-override", {})
check("valid-edge-text-preserves-figure", meta)
for field, value in [
    ("block", True), ("block", 2), ("line", 2), ("text", "changed text"),
    ("reason", ""), ("box", [3, 3, True, 5]), ("box", [2, 3, 4, 5]),
    ("box", [7, 7, 2, 2]), ("box", [3, 3, 2, 4]),
    ("box", [3, 3, 2, 2]),
]:
    bad = copy.deepcopy(meta)
    bad["figure_crops"]["fig-01"]["exclude_text_regions"][0][field] = value
    check(f"reject-{field}-{value}", bad, fail=True)
bad = copy.deepcopy(meta)
bad["figure_crops"]["fig-01"]["exclude_text_regions"].append(region)
check("reject-overlapping-regions", bad, fail=True)
bad = copy.deepcopy(meta)
bad["figure_crops"]["fig-01"]["exclude_text_regions"] = "not-a-list"
check("reject-non-list", bad, fail=True)
original = Path(".intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author")
page_meta, page_blocks = blocks.parse((original / "root/10p/pages/0234/page.md").read_text())
page_ink = layout.ink_mask(Image.open(original / "work/10p/pages/0234/page.png"))
page_meta["figure_crops"] = {"fig-204": {
    "padding_px": 8, "reason": "Independent source234 review excludes caption; exact adjacent prose region has no figure ink.",
    "exclude_text_regions": [{
        "block": 4, "line": 3, "text": page_blocks[3]["lines"][2],
        "box": [798, 1417, 80, 16],
        "reason": "Source row17 prose only; independent component inventory shows 547 prose pixels and zero figure pixels.",
    }],
}}
assert p2c._figure_crop_text_exclusions(page_meta, page_meta["figures"][0], page_blocks, page_ink)
checks.append({"name": "actual-source234-region-preserves-connected-figure", "result": "PASS"})
with (root / "focused-checks.json").open("x") as handle:
    json.dump({"status": "PASS", "checks": checks, "calls": len(checks)}, handle, indent=2)
    handle.write("\n")
print(f"PASS {len(checks)} focused crop-text-contract checks")
