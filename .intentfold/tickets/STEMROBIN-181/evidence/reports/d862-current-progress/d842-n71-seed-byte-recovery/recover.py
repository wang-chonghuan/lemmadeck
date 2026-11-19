import hashlib
import importlib.util
import json
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
BASE = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d842-n71-seed-byte-recovery"
INPUT = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d822-n71-first-bilingual-native"
assert Path.cwd() == REPO
spec = importlib.util.spec_from_file_location(
    "choice_prepare", REPO / ".agents/skills/ld-s10y-choice/scripts/prepare.py"
)
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)
bindings = json.loads((INPUT / "choice-bindings.json").read_text())
results = []
for packet in bindings["packages"]:
    repo = Path(packet["sourceSnapshot"])
    numbers = packet["sourceNumbers"]
    blocks = [] if packet["package"] == "q12" else [6, 9, 10, 11, 12]
    output = BASE / packet["locale"] / f'{packet["package"]}-seed.json'
    assert not output.exists()
    seed = prepare.prepare_seed(repo, "10p", "phy10-c2-s2-n71", numbers, blocks, [])
    encoded = json.dumps(seed, indent=2, ensure_ascii=True) + "\n"
    raw_hash = hashlib.sha256(encoded.encode()).hexdigest()
    canonical = prepare.digest(seed)
    result = {
        "locale": packet["locale"], "package": packet["package"],
        "sourceSnapshot": str(repo),
        "expectedMissingOriginal": packet["seedExpected"],
        "output": str(output), "rawSha256": raw_hash, "canonicalSha256": canonical,
        "rawHashMatches": raw_hash == packet["seedExpected"]["sha256"],
        "canonicalHashMatches": canonical == packet["approvedSeedCanonicalDigest"],
        "sourceNumbers": numbers, "conceptBlocks": blocks,
        "choiceAuthoringOrSemanticReviewCalls": 0, "imageLoads": 0,
    }
    results.append(result)
    assert result["rawHashMatches"] and result["canonicalHashMatches"], result
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("x") as stream:
        stream.write(encoded)
    output.chmod(0o444)
report = {
    "status": "PASS-EXACT-FOUR-MISSING-SEED-BYTES-RECOVERED",
    "method": "Unmodified prepare_seed applied to retained exact source snapshots and recorded selections.",
    "sourceOrChoiceMeaningChanged": False,
    "historicalMissingSeedFailuresPreserved": True,
    "originalSemanticPassReusedOnlyForIdenticalDigest": True,
    "recoveredSeedBytes": results, "mechanicalPreparationCalls": 4,
    "newChoiceAuthoring": 0, "newSemanticReviews": 0, "newImages": 0, "paidCalls": 0,
    "nativeLessonOrChoiceRetentionRun": False, "completeCard": False,
}
with (BASE / "report.json").open("x") as stream:
    json.dump(report, stream, indent=2)
    stream.write("\n")
print(json.dumps({"status": report["status"], "results": results}, indent=2))
