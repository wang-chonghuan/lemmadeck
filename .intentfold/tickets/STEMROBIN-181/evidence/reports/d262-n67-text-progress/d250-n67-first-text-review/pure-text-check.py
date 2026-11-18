import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition
import mathcheck

def read(p):
    return json.loads(p.read_text())

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
base = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d248-n67-text-author"
freeze = read(base / "author-freeze.json")
source = read(ROOT / freeze["sourceLesson"]["path"])
original = read(ROOT / freeze["originalTemplate"]["path"])
authored = read(base / "texts.json")
profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"
profile = read(profile_path)
rows = []
checks = []
candidates = {}
for language in ["zh", "en"]:
    p = ROOT / freeze["textCandidates"][language]["lesson"]["path"]
    candidate = read(p)
    candidates[language] = candidate
    normalized = copy.deepcopy(candidate)
    edition.normalize_lesson_layout(normalized)
    for index, block in enumerate(candidate["prose"]):
        original_block = source["prose"][index]
        text_errors = edition.validate_text(
            original_block["text"], block["text"], block.get("changes"),
            block.get("numeric_changes"), f"{language}.prose[{index}]",
            profile.get("forbidden_terms", []),
            historical_entities=block.get("historical_entities"),
        )
        rows.append({
            "language": language,
            "ordinal": index + 1,
            "sourceRefs": block["source_refs"],
            "nativeTextErrors": text_errors,
            "delimiterErrors": mathcheck.check_delimiters(block["text"]),
            "mathSignatureSource": edition.math_signature(original_block["text"]),
            "mathSignatureCandidate": edition.math_signature(block["text"]),
            "inMemoryNormalizedText": normalized["prose"][index]["text"],
            "normalizationWouldChangeText": normalized["prose"][index]["text"] != block["text"],
            "sourceSnapshotPreserved": block["source_text"] == original_block["text"] == original["prose"][index]["source_text"],
            "sourceRefsPreserved": block["source_refs"] == original_block["source_refs"] == original["prose"][index]["source_refs"],
            "embeddedSourcePreserved": candidate["source"]["data"] == source == original["source"]["data"],
            "textMatchesAuthoredList": block["text"] == authored[language][index],
        })
for index, (zh, en) in enumerate(zip(candidates["zh"]["prose"], candidates["en"]["prose"])):
    checks.append({
        "ordinal": index + 1,
        "sourceRefsMatch": zh["source_refs"] == en["source_refs"],
        "sourceSnapshotsMatch": zh["source_text"] == en["source_text"],
        "kindsAndIdsMatch": zh["kind"] == en["kind"] and zh["id"] == en["id"],
        "mathSignaturesMatch": edition.math_signature(zh["text"]) == edition.math_signature(en["text"]),
        "numberedFigureRefsMatch": edition.prose_number_signature(zh["text"])[1] == edition.prose_number_signature(en["text"])[1],
        "nonReferenceNumberSequencesMatch": edition.prose_number_signature(zh["text"])[0] == edition.prose_number_signature(en["text"])[0],
    })
errors = sum(len(row["nativeTextErrors"]) + len(row["delimiterErrors"]) for row in rows)
structural_ok = len(source["prose"]) == len(candidates["zh"]["prose"]) == len(candidates["en"]["prose"]) == 19
snapshots_ok = all(row["sourceSnapshotPreserved"] and row["sourceRefsPreserved"] and row["embeddedSourcePreserved"] and row["textMatchesAuthoredList"] for row in rows)
alignment_ok = all(all(value for key, value in row.items() if key != "ordinal") for row in checks)
result = {
    "schema": "stemrobin/one-shot-existing-pure-text-check@1",
    "status": "PASS" if errors == 0 and structural_ok and snapshots_ok and alignment_ok else "FAIL",
    "invocationCount": 1,
    "existingFunctions": ["edition.normalize_lesson_layout", "edition.validate_text", "edition.math_signature", "edition.prose_number_signature", "mathcheck.check_delimiters"],
    "tools": [{"path": str(p), "sha256": sha(p)} for p in [TOOLS / "edition.py", TOOLS / "mathcheck.py", profile_path]],
    "normalizationInMemoryOnly": True,
    "candidatesModified": False,
    "nativeTextErrorCount": errors,
    "nineteenBlockStructure": structural_ok,
    "sourceBindingsPreserved": snapshots_ok,
    "bilingualMechanicalAlignment": alignment_ok,
    "rows": rows,
    "alignment": checks,
    "katexExecuted": False,
    "katexStatus": "NOT-RUN; delimiter/signature checks only, not an invented KaTeX PASS",
    "adaptFinalizeExecuted": False,
    "newImagesOpened": 0,
    "cumulativeContextImages": 24,
    "subprocessesOrAgentsSpawned": False,
}
with (OUT / "pure-text-check.json").open("x") as handle:
    json.dump(result, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({
    "status": result["status"],
    "errorCount": errors,
    "sourceBindingsPreserved": snapshots_ok,
    "alignment": alignment_ok,
    "nativeErrors": [{"language": r["language"], "ordinal": r["ordinal"], "sourceRefs": r["sourceRefs"], "errors": r["nativeTextErrors"]} for r in rows if r["nativeTextErrors"]],
    "normalizationAffectedOrdinals": [{"language": r["language"], "ordinal": r["ordinal"]} for r in rows if r["normalizationWouldChangeText"]],
}, ensure_ascii=False))
if result["status"] != "PASS":
    sys.exit(1)
