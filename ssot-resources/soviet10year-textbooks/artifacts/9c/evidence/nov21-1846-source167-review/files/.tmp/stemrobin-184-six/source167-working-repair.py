import copy
import hashlib
import json
import shutil
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
assert Path.cwd() == ROOT
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import blocks

base = ROOT / ".tmp/stemrobin-184-six"
source = base / "source167-active/native/9c/pages/0167"
target = base / "source167-working-repair"
progress = json.loads((base / "source-progress.json").read_text())
assert progress["source167"]["review"]["stage2Intake"]
assert progress["source167"]["review"]["approved"] is False
assert not target.exists()
recovery = json.loads((base / "source167-review/u1-recovery.json").read_text())
assert recovery["literalRead"]["actualRoiFragment"] == "2x^9+x^4-3x^9."
original_md = (source / "page.md").read_text()
original_json = json.loads((source / "page.json").read_text())
meta, body = blocks.parse(original_md)
assert meta == original_json["meta"]
assert body == original_json["blocks"]
before = copy.deepcopy(body)
matches = [block for block in body
           if block["kind"] == "ex" and block["label"] == "376"]
assert len(matches) == 1
assert matches[0]["lines"][1] == "б) $g(x)=7-2x^3+x^4-3x^9$。"
matches[0]["lines"][1] = "б) $g(x)=7-2x^9+x^4-3x^9$。"
assert sum(a != b for a, b in zip(before, body)) == 1
assert blocks.printed_lines(body) == blocks.printed_lines(before) == 22
repaired_md = blocks.dump(meta, body, 167)
assert repaired_md == original_md.replace(
    "б) $g(x)=7-2x^3+x^4-3x^9$。",
    "б) $g(x)=7-2x^9+x^4-3x^9$。",
)
target.mkdir()
(target / "page.md").write_text(repaired_md)
(target / "page.json").write_text(json.dumps(
    {"meta": meta, "blocks": body}, ensure_ascii=False, indent=2) + "\n")
shutil.copy2(source / "audit.json", target / "audit.json")


def bind(file):
    data = file.read_bytes()
    return {"path": str(file), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest()}


receipt = {
    "status": "SOURCE167_ONE_GLYPH_WORKING_REPAIR_PENDING_AFFECTED_REVIEW",
    "old": "376b first exponent3",
    "new": "376b first exponent9",
    "given": "7-2x^9+x^4-3x^9",
    "derivative": "4x^3-45x^8",
    "onlyOneBlockOneLineOneGlyphChanged": True,
    "allOtherBlocksAndMetaUnchanged": True,
    "printedRowsBeforeAfter": [22, 22],
    "nativeAudit": "Original FIRST native22/22 reused unchanged; no fresh native claim.",
    "nativeReplays": 0,
    "imageViewsOrDecodes": 0,
    "originalNativeFiles": [bind(source / name)
                            for name in ("page.md", "page.json", "audit.json")],
    "blindPixelEvidence": bind(base / "source167-review/u1-recovery.json"),
    "originalStage2": bind(base / "source167-review/comparison.json"),
    "files": [bind(target / name)
              for name in ("page.md", "page.json", "audit.json")]
             + [bind(Path(__file__))],
}
(target / "repair-receipt.json").write_text(
    json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
for file in target.iterdir():
    file.chmod(0o444)
target.chmod(0o555)
print(json.dumps({"status": receipt["status"], "files": receipt["files"],
                  "receipt": bind(target / "repair-receipt.json"),
                  "imageViewsOrDecodes": 0, "nativeReplays": 0}))
