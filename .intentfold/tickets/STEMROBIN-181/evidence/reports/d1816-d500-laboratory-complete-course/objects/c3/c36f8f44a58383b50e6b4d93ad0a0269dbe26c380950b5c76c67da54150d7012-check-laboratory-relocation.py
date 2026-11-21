import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import edition


def binding(file):
    return {"path": str(file.resolve()), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


book = Path(sys.argv[1])
output = Path(sys.argv[2])
assert not output.exists()
profile = edition.load(Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))
records = []
errors = []
for name in ["modern-us-neutral", "modern-us-neutral-en"]:
    root = book / "editions" / name
    manifest = edition.load(root / "lessons/phy10-c4-s4/figures.json")
    assert len(manifest["figures"]) == 1
    figure = manifest["figures"][0]
    spec = root / figure["spec"]
    render = root / figure["render"]
    svg = root / figure["svg"]
    review = root / figure["review"]
    errors.extend(edition.validate_svg(
        svg, spec, figure, profile.get("figure_text_language"), render,
    ))
    errors.extend(edition.validate_review(
        review, spec, "render", render, {"svg": svg}, "fig-278",
    ))
    records.append({
        "edition": name, "spec": binding(spec), "render": binding(render),
        "svg": binding(svg), "review": binding(review),
    })
output.write_text(json.dumps({
    "status": "FAIL" if errors else "PASS", "errors": errors, "records": records,
    "scope": "First canonical path/hash relocation checks only; source/spec/SVG bytes unchanged; independent pixel observations inherited.",
    "imageOpens": 0, "paidCalls": 0, "databaseWrites": False,
}, indent=2) + "\n")
print(json.dumps({"status": "FAIL" if errors else "PASS", "errors": errors}))
sys.exit(1 if errors else 0)
