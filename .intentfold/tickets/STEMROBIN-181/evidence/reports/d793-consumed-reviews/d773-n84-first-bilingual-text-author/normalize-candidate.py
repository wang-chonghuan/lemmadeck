"""Normalize only an assigned text candidate with the native edition tool."""

import hashlib
import json
import sys
from pathlib import Path


repo = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
allowed = repo / ".intentfold/tickets/STEMROBIN-181/tmp/d773-n84-first-bilingual-text-author"
candidate = Path(sys.argv[1]).resolve()
if not candidate.is_relative_to(allowed) or candidate.name != "lesson.template.json":
    raise SystemExit("Refusing a write outside the assigned lesson candidates.")

sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
from edition import normalize_prose_layout, prose_number_signature


before_bytes = candidate.read_bytes()
document = json.loads(before_bytes)
calls = []
for index, block in enumerate(document["prose"]):
    if block["kind"] != "p":
        continue
    before = block["text"]
    after = normalize_prose_layout(before)
    source_numbers, source_references = prose_number_signature(block["source_text"])
    modern_numbers, modern_references = prose_number_signature(after)
    assert source_numbers == modern_numbers, f"Numeric drift in block {index}"
    assert source_references == modern_references, f"Reference drift in block {index}"
    block["text"] = after
    if after != before and "layout" not in block["changes"]:
        block["changes"].append("layout")
    calls.append({
        "block_index": index,
        "function": "edition.normalize_prose_layout",
        "invocations": 1,
        "source_refs": block["source_refs"],
        "changed": after != before,
        "before_text_sha256": hashlib.sha256(before.encode("utf-8")).hexdigest(),
        "after_text_sha256": hashlib.sha256(after.encode("utf-8")).hexdigest(),
        "source_nonformula_numbers": source_numbers,
        "modern_nonformula_numbers": modern_numbers,
        "numbered_references_unchanged": source_references == modern_references,
    })

candidate.write_text(
    json.dumps(document, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(json.dumps({
    "status": "NORMALIZED-ONLY-NOT-FINALIZED",
    "path": str(candidate),
    "input_sha256": hashlib.sha256(before_bytes).hexdigest(),
    "output_sha256": hashlib.sha256(candidate.read_bytes()).hexdigest(),
    "calls": calls,
    "source_finalization_replayed": False,
    "modern_finalization_replayed": False,
}, ensure_ascii=False, indent=2))
