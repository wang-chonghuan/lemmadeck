import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

root = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en"
card = sys.argv[1] if len(sys.argv) > 1 else "phy9-c2-s2-n72"
task = sys.argv[2] if len(sys.argv) > 2 else "D1000"
manifest = edition.load(root / "lessons" / card / "figures.json")
errors = []
for entry in manifest["figures"]:
    figure = entry["id"]
    files = {key: root / "figures" / f"{figure}.{extension}"
             for key, extension in [("spec", "spec.json"), ("svg", "svg"),
                                    ("render", "render.json"), ("review", "review.json")]}
    errors.extend(edition.validate_review(
        files["review"], files["spec"], "render", files["render"],
        {"svg": files["svg"]}, figure))
    review = edition.load(files["review"])
    spec = edition.load(files["spec"])
    historical_source = Path(review["source"]["path"])
    source = repo / "ssot-resources/soviet10year-textbooks/artifacts/9p/figures" / f"{figure}.png"
    assert historical_source.as_posix().endswith(
        f"ssot-resources/soviet10year-textbooks/artifacts/9p/figures/{figure}.png")
    assert spec["source"]["image"]["sha256"] == review["source"]["sha256"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == review["source"]["sha256"]
print(json.dumps({"task": task, "status": "PASS" if not errors else "FAIL",
                  "figures": len(manifest["figures"]), "errors": errors, "scope": "First canonical EN tuple bindings only"}))
sys.exit(1 if errors else 0)
