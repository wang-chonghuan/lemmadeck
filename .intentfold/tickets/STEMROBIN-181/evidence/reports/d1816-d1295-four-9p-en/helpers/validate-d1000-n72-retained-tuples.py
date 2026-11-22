import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

card = sys.argv[1] if len(sys.argv) > 1 else "phy9-c2-s2-n72"
task = sys.argv[2] if len(sys.argv) > 2 else "D1000"
book = sys.argv[3] if len(sys.argv) > 3 else "9p"
assert book in ("9p", "10p")
root = repo / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/editions/modern-us-neutral-en"
manifest = edition.load(root / "lessons" / card / "figures.json")
errors = []
for entry in manifest["figures"]:
    figure = entry["id"]
    spec = edition.load(root / "figures" / f"{figure}.spec.json")
    generated = spec.get("mode") == "generated"
    if generated:
        assert card in ("phy9-c1-s1-n1", "phy9-c1-s1-n2", "phy9-c1-s1-n3") and book == "9p"
        assert not any(entry.get(key) for key in ("svg", "render", "artwork"))
        files = {key: root / entry[key] for key in ("spec", "png", "generation", "review")}
        evidence_name, output_name = "generation", "png"
        errors.extend(edition.validate_generation_metadata(
            files["generation"], spec, entry, files["png"]))
    else:
        files = {key: root / "figures" / f"{figure}.{extension}"
                 for key, extension in [("spec", "spec.json"), ("svg", "svg"),
                                        ("render", "render.json"), ("review", "review.json")]}
        evidence_name, output_name = "render", "svg"
    errors.extend(edition.validate_review(
        files["review"], files["spec"], evidence_name, files[evidence_name],
        {output_name: files[output_name]}, figure))
    review = edition.load(files["review"])
    historical_source = Path(review["source"]["path"])
    source = repo / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/figures" / f"{figure}.png"
    assert historical_source.as_posix().endswith(
        f"ssot-resources/soviet10year-textbooks/artifacts/{book}/figures/{figure}.png")
    assert spec["source"]["image"]["sha256"] == review["source"]["sha256"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == review["source"]["sha256"]
print(json.dumps({"task": task, "status": "PASS" if not errors else "FAIL",
                  "figures": len(manifest["figures"]), "errors": errors, "scope": "First canonical EN tuple bindings only"}))
sys.exit(1 if errors else 0)
