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

receipt = O / "affected-contract-FIRST.json"
assert not receipt.exists(), "Retain FIRST result; no validation retry."
raw = json.loads((O / "inputs/raw-lesson.json").read_text())
profile = json.loads((R / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json").read_text())
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
rows = []
errors = []
for locale, indices in [("zh", [3, 11, 18, 20]), ("en", [3, 6, 11, 16, 18, 20])]:
    document = json.loads((O / "candidate" / locale / "lesson.template.json").read_text())
    for index in indices:
        source = raw["prose"][index]
        block = document["prose"][index]
        label = f"{locale}:prose[{index}]"
        found = edition.validate_text(
            source["text"], block["text"], block["changes"], block["numeric_changes"],
            label, forbidden, block["historical_entities"],
        )
        source_math = [m.group(0) for m in edition.MATH.finditer(source["text"])]
        modern_math = [m.group(0) for m in edition.MATH.finditer(block["text"])]
        if source_math != modern_math:
            found.append(f"{label}: ordered literal math tokens changed")
        source_numbers, source_refs = edition.prose_number_signature(source["text"])
        modern_numbers, modern_refs = edition.prose_number_signature(block["text"])
        if source_numbers != modern_numbers or source_refs != modern_refs:
            found.append(f"{label}: exact quantities/reference signatures changed")
        if block["source_text"] != source["text"] or block["numeric_changes"]:
            found.append(f"{label}: immutable source or numeric changes violated")
        declarations = [
            {
                **declaration,
                "sourceTermPresentExactly": declaration.get("source_term", declaration["term"]) in source["text"],
                "modernTermPresentExactly": declaration["term"] in block["text"],
                "translationDeclared": "translation" in block["changes"],
            }
            for declaration in block["historical_entities"]
        ]
        rows.append({
            "locale": locale, "pointer": f"/prose/{index}", "source_refs": source["source_refs"],
            "sourceMathTokens": source_math, "candidateMathTokens": modern_math,
            "sourceQuantitySignature": source_numbers, "candidateQuantitySignature": modern_numbers,
            "sourceReferences": {k: sorted(v) for k, v in source_refs.items()},
            "candidateReferences": {k: sorted(v) for k, v in modern_refs.items()},
            "historicalDeclarations": declarations, "errors": found,
        })
        errors.extend(found)
report = {
    "schema": "STEMROBIN-181/d858-affected-text-math-contract@1",
    "status": "PASS-AFFECTED-NATIVE-CONTRACT-ONLY" if not errors else "FAIL-FIRST-PRESERVED",
    "command": [sys.executable, "-B", str(Path(__file__).resolve())],
    "workdir": str(R), "runtime": sys.version,
    "liveEditionSha256": hashlib.sha256((R / ".claude/skills/ld-s10y-lesson/tools/edition.py").read_bytes()).hexdigest(),
    "parentAliasContractReport": str(R / ".intentfold/tickets/STEMROBIN-181/tmp/d866-historical-alias-contract/report.json"),
    "validateTextCalls": len(rows), "unaffectedValidateTextCalls": 0,
    "normalizeCalls": 0, "candidateWrites": 0, "fullNativeCalls": 0,
    "rows": rows, "errors": errors,
    "scope": "Only affected per-item native validate_text plus ordered exact token/quantity checks. No SCI/ZHEN review or semantic alias approval; no full native/finalize.",
}
with receipt.open("x") as handle:
    handle.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"status": report["status"], "calls": len(rows), "errors": errors}, ensure_ascii=False))
sys.exit(1 if errors else 0)
