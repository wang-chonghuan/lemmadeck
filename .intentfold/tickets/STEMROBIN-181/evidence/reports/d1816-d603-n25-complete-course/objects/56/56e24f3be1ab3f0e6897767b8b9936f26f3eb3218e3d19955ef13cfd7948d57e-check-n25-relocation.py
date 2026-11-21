import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import edition

book = Path(sys.argv[1])
output = Path(sys.argv[2])
assert not output.exists()
profile = edition.load(Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"))
errors = []
records = []
for name in ["modern-us-neutral", "modern-us-neutral-en"]:
    root = book / "editions" / name
    manifest = edition.load(root / "lessons/phy10-c1-s3-n25/figures.json")
    assert [figure["id"] for figure in manifest["figures"]] == ["fig-40", "fig-41", "fig-42"]
    for figure in manifest["figures"]:
        files = {key: root / figure[key] for key in ["svg", "spec", "render", "review"]}
        errors.extend(edition.validate_svg(
            files["svg"], files["spec"], figure, profile.get("figure_text_language"),
            files["render"],
        ))
        errors.extend(edition.validate_review(
            files["review"], files["spec"], "render", files["render"],
            {"svg": files["svg"]}, figure["id"],
        ))
        records.append({
            "edition": name, "figure": figure["id"],
            "files": {key: {"path": str(file.resolve()),
                            "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}
                      for key, file in files.items()},
        })
output.write_text(json.dumps({
    "status": "FAIL" if errors else "PASS", "errors": errors, "records": records,
    "scope": "Canonical relocation path/hash check only; no rendering or semantic review replay.",
    "imageOpens": 0, "paidCalls": 0, "databaseWrites": False,
}, indent=2) + "\n")
print(json.dumps({"status": "FAIL" if errors else "PASS", "errors": errors}))
sys.exit(1 if errors else 0)
