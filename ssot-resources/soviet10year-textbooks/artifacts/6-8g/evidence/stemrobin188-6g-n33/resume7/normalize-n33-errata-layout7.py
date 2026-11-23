import copy
import hashlib
import json
import re
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
    pattern = r"\s*".join(re.escape(char) for char in correction["corrected"] if not char.isspace())
    matches = list(re.finditer(pattern, normalized))
    assert len(matches) == 1, correction["id"]
    replacement = matches[0].group()
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
    "firstRecoveryFailurePreserved": {
        "stage": "standalone-correction-normalization",
        "error": "AssertionError: n33-d2-negation-quantifiers-independent7",
        "candidateWritesBeforeFailure": 0,
        "cause": "Native paragraph grouping depends on the surrounding sentences.",
        "failedScript": "normalize-n33-errata-layout7.first.py",
    },
}
with (resume / "errata-layout-recovery7.json").open("x") as stream:
    json.dump(record, stream, indent=2)
    stream.write("\n")
print(json.dumps(record))
