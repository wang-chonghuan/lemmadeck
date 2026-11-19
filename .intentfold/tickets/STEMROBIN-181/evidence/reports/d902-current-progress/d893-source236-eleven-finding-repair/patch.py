import copy
import json
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import blocks

root = Path(__file__).resolve().parent
source = root / "root/10p/pages/0236/page.md"
review = Path(".intentfold/tickets/STEMROBIN-181/tmp/d883-source236-first-independent-review")
rows = json.loads((review / "row-review.json").read_text())
findings = json.loads((review / "report.json").read_text())["review"]["findings"]
metadata, items = blocks.load(source)
before_metadata, before_items = copy.deepcopy(metadata), copy.deepcopy(items)
assert len(findings) == 11
changes = []
for finding in findings:
    row = next(row for row in rows["rows"] if row["row"] == finding["row"])
    block, line = row["block"] - 1, row["line"] - 1
    old = items[block]["lines"][line]
    assert old.count(finding["candidate"]) == 1, finding["id"]
    new = old.replace(finding["candidate"], finding["source"], 1)
    items[block]["lines"][line] = new
    changes.append({"finding": finding["id"], "block": block + 1, "line": line + 1,
                    "before": old, "after": new})
note_matches = [i for i, note in enumerate(metadata["notes"]) if "正确的" in note]
assert len(note_matches) == 1
note = note_matches[0]
metadata["notes"][note] = metadata["notes"][note].replace("正确的", "准确的")
allowed_lines = {(change["block"] - 1, change["line"] - 1) for change in changes}
for i, (before, after) in enumerate(zip(before_items, items)):
    restored = copy.deepcopy(after)
    restored["lines"] = before["lines"]
    assert restored == before
    for j, (old, new) in enumerate(zip(before["lines"], after["lines"])):
        assert old == new or (i, j) in allowed_lines
restored_metadata = copy.deepcopy(metadata)
restored_metadata["notes"] = before_metadata["notes"]
assert restored_metadata == before_metadata
clean = lambda text: "".join(text.replace("**", "").split())
for row in rows["rows"]:
    if row["status"] == "HOLD":
        assert clean(items[row["block"] - 1]["lines"][row["line"] - 1]) == clean(row["sourceText"])
source.write_text(blocks.dump(metadata, items, 236), encoding="utf-8")
(root / "changes.json").write_text(json.dumps({
    "findingCount": 11, "changes": changes, "metadataNoteIndex": note,
    "metadataNoteBefore": before_metadata["notes"][note], "metadataNoteAfter": metadata["notes"][note],
    "affectedRows": sorted({change["block"] * 100 + change["line"] for change in changes}),
    "allOtherBlockFieldsAndMetadataUnchanged": True,
}, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
print("PASS exactly two glyphs, nine stops and one matching metadata note")
