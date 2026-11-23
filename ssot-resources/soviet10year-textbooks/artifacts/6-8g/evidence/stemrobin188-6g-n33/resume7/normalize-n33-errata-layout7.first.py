import copy
import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

book = repo / "ssot-resources/soviet10year-textbooks/artifacts/6-8g"
evidence = book / "evidence/stemrobin188-6g-n33"
resume = evidence / "resume7"
lesson_id = "geo68-c3-s1-n33"
template = repo / f".tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/{lesson_id}/lesson.template.json"
original = json.loads(template.read_text())
candidate = copy.deepcopy(original)
approval = json.loads((evidence / "content-independent7/approval.json").read_text())
changes = []
for correction in candidate["errata"]:
    approved = next(item for item in approval["approvedCorrections"] if item["id"] == correction["id"])
    assert correction["corrected"] == approved["corrected"]
    if correction["id"] == "n33-d1-equivalence-notation-independent7":
        continue
    index = int(approved["target"]["pointer"].split("/")[2])
    normalized = edition.normalize_prose_layout(candidate["prose"][index]["text"])
    replacement = edition.normalize_prose_layout(correction["corrected"])
    assert replacement in normalized, correction["id"]
    assert "".join(normalized.split()) == "".join(candidate["prose"][index]["text"].split())
    assert "".join(replacement.split()) == "".join(approved["corrected"].split())
    candidate["prose"][index]["text"] = normalized
    correction["corrected"] = replacement
    changes.append({"id": correction["id"], "index": index, "delta": "native-layout-whitespace-only"})
assert candidate["source"] == original["source"]
assert candidate["section_breaks"] == original["section_breaks"]
with (resume / "lesson.before-errata-layout-recovery7.json").open("x") as stream:
    json.dump(original, stream, ensure_ascii=False, indent=2)
    stream.write("\n")
template.write_text(json.dumps(candidate, ensure_ascii=False, indent=2) + "\n")
record = {
    "lesson": lesson_id,
    "changed": changes,
    "approvedWordsAndMathUnchanged": True,
    "sourceBlocksAndSnapshotsUnchanged": True,
    "sourceFinalizerReplays": 0,
    "imageLoads": 0,
    "candidateSha256": hashlib.sha256(template.read_bytes()).hexdigest(),
}
with (resume / "errata-layout-recovery7.json").open("x") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
print(json.dumps(record))
