"""Preserve the authored test contract before any production edit or test run."""
import ast
import shutil

import evidence


assert evidence.sha(evidence.LAYOUT) == evidence.LAYOUT_SHA
assert not (evidence.OUT / "new-test-design-checkpoint.json").exists()
tree = ast.parse(evidence.TEST.read_text())
cases = [
    node.name for item in tree.body if isinstance(item, ast.ClassDef)
    for node in item.body if isinstance(node, ast.FunctionDef) and node.name.startswith("test_")
]
assert len(cases) == 20
for path in (evidence.TEST, evidence.OUT / "test-design.md", evidence.OUT / "role_probe.py"):
    shutil.copyfile(path, evidence.OUT / "original" / ("prepatch-" + path.name))
evidence.dump(evidence.OUT / "new-test-design-checkpoint.json", {
    "timestamp": evidence.stamp(), "layout_sha256": evidence.sha(evidence.LAYOUT),
    "test_sha256": evidence.sha(evidence.TEST), "cases": cases,
    "design_sha256": evidence.sha(evidence.OUT / "test-design.md"),
    "production_edits_at_checkpoint": 0, "test_executions_at_checkpoint": 0,
    "design_construction_corrections": [
        "Two separate bound glyph assertions exclude the blank gap, not a solid rectangle.",
        "Unpaired/detached/offset negatives assert ownership, not semantic row identity.",
    ],
})
print({"cases": len(cases), "test_sha256": evidence.sha(evidence.TEST),
       "layout_sha256": evidence.sha(evidence.LAYOUT)})
