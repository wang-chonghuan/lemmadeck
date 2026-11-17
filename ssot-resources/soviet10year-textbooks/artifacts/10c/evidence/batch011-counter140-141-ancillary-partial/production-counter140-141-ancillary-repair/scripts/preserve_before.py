#!/usr/bin/env python3
"""Preserve baseline bytes and immutable 140/141 inputs before production edits."""
import hashlib
import json
from pathlib import Path

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]
tool = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
test = ROOT / ".claude/skills/ld-s10y-lesson/tools/test_layout_carrier_ancillary_rows.py"
frozen = "5a40298cf32590aa93fc87d5b158efda0e6d85b1defbfe7b8d3fb8a515c325b7"
before = OWNED / "before"
before.mkdir(exist_ok=True)
tool_bytes = tool.read_bytes()
tool_sha = hashlib.sha256(tool_bytes).hexdigest()
if tool_sha != frozen:
    raise SystemExit("Current tool differs from authorized baseline: " + tool_sha)
for name, data in (("layout.py", tool_bytes), ("test_layout_carrier_ancillary_rows.py", test.read_bytes())):
    path = before / name
    if path.exists():
        raise SystemExit("Baseline preservation must not overwrite an existing file")
    path.write_bytes(data)
paths = [tool, test]
for page in (140, 141):
    source = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/"
        f"10c/pages/{page:04d}"
    )
    paths.extend(source / name for name in ("page.png", "layout.json"))
    durable = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}"
    paths.extend(durable / name for name in ("page.md", "page.json", "audit.json"))
    first = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/"
        f"production-source10c140-143-first-finalize/{page:04d}"
    )
    paths.extend(first / name for name in ("command.json", "audit.json", "page.md", "page.json"))
paths.append(ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143-review/source-first.md")
inventory = [{
    "path": str(path), "size": path.stat().st_size,
    "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    "immutable": path != tool,
} for path in paths]
result = {
    "baseline_layout_sha256": tool_sha,
    "new_test_authored_before_patch_sha256": hashlib.sha256(test.read_bytes()).hexdigest(),
    "expected_source_rows": {"140": 18, "141": 23},
    "images_decoded": 0,
    "inputs": inventory,
}
(before / "inputs.json").write_text(json.dumps(result, indent=2) + "\n", encoding="ascii")
print(json.dumps(result, indent=2))
