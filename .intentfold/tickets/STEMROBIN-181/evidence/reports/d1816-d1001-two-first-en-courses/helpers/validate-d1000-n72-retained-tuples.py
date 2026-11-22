import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

root = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en"
errors = []
for number in range(134, 138):
    figure = f"fig-{number}"
    files = {key: root / "figures" / f"{figure}.{extension}"
             for key, extension in [("spec", "spec.json"), ("svg", "svg"),
                                    ("render", "render.json"), ("review", "review.json")]}
    errors.extend(edition.validate_review(
        files["review"], files["spec"], "render", files["render"],
        {"svg": files["svg"]}, figure))
    review = edition.load(files["review"])
    source = repo / review["source"]["path"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == review["source"]["sha256"]
print(json.dumps({"task": "D1000", "status": "PASS" if not errors else "FAIL",
                  "figures": 4, "errors": errors, "scope": "First canonical EN tuple bindings only"}))
sys.exit(1 if errors else 0)
