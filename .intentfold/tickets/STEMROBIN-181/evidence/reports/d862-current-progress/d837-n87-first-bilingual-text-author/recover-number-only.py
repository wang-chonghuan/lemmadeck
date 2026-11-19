import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == R
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / ".claude/skills/ld-s10y-lesson/tools"))
import edition

receipt = O / "native/en-numeric-technical-recovery.json"
assert not receipt.exists(), "Do not repeat this technical recovery."
original = json.loads((O / "native/en.json").read_text())
assert original["errors"] == ["en:prose[3]: exact non-math numeric sequence changed."]
candidate_path = O / "candidate/en/lesson.template.json"
assert hashlib.sha256(candidate_path.read_bytes()).hexdigest() == original["candidateHashes"]["lesson"]
candidate = json.loads(candidate_path.read_text())
source = json.loads((O / "inputs/raw-lesson.json").read_text())
before = source["prose"][3]["text"]
after = candidate["prose"][3]["text"]
source_quantities, source_refs = edition.prose_number_signature(before)
candidate_quantities, candidate_refs = edition.prose_number_signature(after)
source_figure_tokens = Counter(match.group(1) for match in edition.FIGURE_REFERENCE.finditer(edition.MATH.sub("", before)))
candidate_figure_tokens = Counter(match.group(1) for match in edition.FIGURE_REFERENCE.finditer(edition.MATH.sub("", after)))
errors = []
if source_quantities != candidate_quantities:
    errors.append("Native numeric quantity sequence changed.")
if source_refs != candidate_refs or source_figure_tokens != candidate_figure_tokens:
    errors.append("Source figure/section reference identity or figure-token multiset changed.")
report = {
    "schema": "STEMROBIN-181/d837-numeric-technical-recovery@1",
    "status": "PASS-AFFECTED-NUMERIC-REFERENCE-CHECK-ONLY" if not errors else "FAIL-TECHNICAL-RECOVERY-PRESERVED",
    "command": [sys.executable, "-B", str(Path(__file__).resolve())],
    "cwd": str(R), "source_refs": ["p0230#6"],
    "failure": "Original wrapper added edition.number_signature as an extra raw numeric check. That regex rejects a digit followed by a period, so English 'Figure 201.' was falsely treated as missing the number.",
    "nativeContract": "edition.prose_number_signature and edition.FIGURE_REFERENCE retain reference identity across localization; compare numeric quantities separately from numbered references.",
    "originalFailureReceipt": str(O / "native/en.json"),
    "unchangedCandidateSha256": hashlib.sha256(candidate_path.read_bytes()).hexdigest(),
    "sourceQuantities": source_quantities, "candidateQuantities": candidate_quantities,
    "sourceReferences": {key: sorted(value) for key, value in source_refs.items()},
    "candidateReferences": {key: sorted(value) for key, value in candidate_refs.items()},
    "sourceFigureTokenMultiset": dict(source_figure_tokens),
    "candidateFigureTokenMultiset": dict(candidate_figure_tokens),
    "reusedPassedChecks": "Original English native validate_text, source/identity checks, exact math tokens, normalization and all unaffected numeric rows reused unchanged; none rerun.",
    "proseNumberSignatureCalls": 2, "figureReferenceExtractions": 2,
    "normalizeCalls": 0, "validateTextCalls": 0, "candidateWrites": 0,
    "contentRevisions": 0, "errors": errors,
    "approval": "Technical affected numeric/reference check only; not SCI/ZHEN approval.",
}
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"receipt": str(receipt), "status": report["status"], "errors": errors}))
sys.exit(1 if errors else 0)
