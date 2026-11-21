import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import edition


def binding(file):
    return {"path": str(file.resolve()), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


output = Path(sys.argv[1])
assert not output.exists()
assert len(sys.argv) in [2, 4]
affected_index = int(sys.argv[2]) if len(sys.argv) == 4 else None
affected_locale = sys.argv[3] if len(sys.argv) == 4 else None
base = Path(".tmp/STEMROBIN-181/d1816-d492")
raw_file = base / "root/10p/lessons/phy10-c4-s4/lesson.json"
raw = json.loads(raw_file.read_text())
profile = json.loads(Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json").read_text())
records = []
errors = []
for locale, name in [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]:
    if affected_locale is not None and locale != affected_locale:
        continue
    file = base / f"source-work/adapt/10p/{name}/lessons/phy10-c4-s4/lesson.template.json"
    lesson = json.loads(file.read_text())
    assert len(lesson["prose"]) == len(raw["prose"]) == 110
    for index, (source, modern) in enumerate(zip(raw["prose"], lesson["prose"])):
        if affected_index is not None and index != affected_index:
            continue
        assert modern["source_text"] == source["text"]
        for field in ["kind", "id", "printed_page", "source_refs"]:
            assert modern[field] == source[field]
        errors.extend(edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            f"{locale}.prose[{index}]", profile.get("forbidden_terms", []),
            modern.get("historical_entities"),
        ))
    records.append({
        "locale": locale, "lesson": binding(file),
        "blocks": 110 if affected_index is None else 1,
        "checkedIndices": list(range(110)) if affected_index is None else [affected_index],
    })
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({
    "status": "FAIL" if errors else "PASS", "source": binding(raw_file),
    "records": records, "errors": errors, "imageOpens": 0,
    "scope": "Affected-only text mechanical check; unchanged gates inherited, not replayed."
    if affected_index is not None else
    "First text-only mechanical identity, formula and numeric checks; not independent SCI/TEXT/figure/display approval.",
}, indent=2) + "\n")
print(json.dumps({"status": "FAIL" if errors else "PASS", "errors": errors}))
sys.exit(1 if errors else 0)
