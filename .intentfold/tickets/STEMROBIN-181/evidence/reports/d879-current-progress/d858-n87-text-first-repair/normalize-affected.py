import hashlib
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == R
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / ".claude/skills/ld-s10y-lesson/tools"))
import edition

receipt = O / "normalization-FIRST.json"
assert not receipt.exists(), "One affected normalization only."
rows = []
for locale, indices in [("zh", [3, 11, 18, 20]), ("en", [3, 6, 11, 16, 18, 20])]:
    target = O / "candidate" / locale / "lesson.template.json"
    document = json.loads(target.read_text())
    for index in indices:
        block = document["prose"][index]
        before = block["text"]
        block["text"] = edition.normalize_prose_layout(before)
        rows.append({
            "locale": locale, "pointer": f"/prose/{index}/text",
            "source_refs": block["source_refs"],
            "inputText": before, "normalizedText": block["text"],
            "layoutChanged": before != block["text"],
        })
    target.write_text(json.dumps(document, ensure_ascii=False, indent=2) + "\n")
report = {
    "schema": "STEMROBIN-181/d858-affected-normalization@1",
    "command": [sys.executable, "-B", str(Path(__file__).resolve())],
    "workdir": str(R), "normalizeProseLayoutCalls": len(rows),
    "unchangedBlocksNormalized": 0, "validateTextCalls": 0,
    "coreSha256": hashlib.sha256((R / ".claude/skills/ld-s10y-lesson/tools/edition.py").read_bytes()).hexdigest(),
    "rows": rows, "scope": "Layout of affected text within this one author repair; no preflight or finalization.",
}
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"normalizationCalls": len(rows), "receipt": str(receipt)}))
