import copy
import hashlib
import json
import pathlib
import subprocess
import sys
from datetime import datetime, timezone

ROOT = pathlib.Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
SCRATCH = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWNER = SCRATCH / "n40-choice-review"
AUTHOR = SCRATCH / "n40-choice-affected-author/RECOVERY-BINDING"
NEW_NAMES = {
    "build-review-RECOVERY-BINDING.py",
    "stage3-comparison-evidence-RECOVERY-BINDING.json",
}
OUTPUTS = [
    "review.json", "stage3-key-comparison-RECOVERY-BINDING.json",
    "stage3-binding-summary-RECOVERY-BINDING.json",
    "official-validator-FIRST-stdout.txt", "official-validator-FIRST-stderr.txt",
    "official-validator-FIRST-receipt.json", "stage3-summary-RECOVERY-BINDING.json",
    "stage3-hashes-RECOVERY-BINDING.json", "stage3-freeze-RECOVERY-BINDING.json",
    "stage3-freeze-RECOVERY-BINDING.sha256",
]
for name in OUTPUTS:
    assert not (OWNER / name).exists(), f"Write-once output already exists: {name}"


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_digest(value):
    data = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_once(name, value):
    with (OWNER / name).open("x", encoding="utf-8") as stream:
        stream.write(value)


def write_json(name, value):
    write_once(name, json.dumps(value, ensure_ascii=True, indent=2) + "\n")


preserved = []
for file in OWNER.iterdir():
    if file.name in NEW_NAMES:
        continue
    assert file.is_file() and (file.stat().st_mode & 0o777) == 0o444
    preserved.append({"name": file.name, "path": str(file), "sha256": file_hash(file), "mode": "0444"})

expected_inputs = {
    "seed.json": "d1380a97e156c61eee1518a9646a820ed130deba4b520ff98385b3d19eff69b4",
    "draft.json": "337b08c6fa9a7d966886ca1d30a571b24b17e7ff70e19ee6ef9f86847707c0b9",
    "reviewer-views.json": "430fbfac2c936aeaa12b2f74eaa98313b3bbdf8bc23391e5719a9bdb64469c8e",
    "source-provenance.json": "df9b105f11bddeba89b723666a321a30b297e78e71c69fee55adf69f57007e0a",
    "preservation-receipt.json": "77f8f45a30156784453928ea7d5bb687195c0bc8a394e45c5c841206cbfc717c",
    "recovery-receipt.json": "5f816194ae2d94b82904b2539b5728c2b64dd282981f06e6586b87b084dd71af",
    "prepare-receipt.json": "30ba3cff08741fd6230a6554117852231bfa38698769b2d49dbee627a26a191c",
}
inputs = []
for name, expected in expected_inputs.items():
    file = AUTHOR / name
    assert file_hash(file) == expected, f"Changed authorized input: {name}"
    inputs.append({"path": str(file), "sha256": expected})

seed = load(AUTHOR / "seed.json")
draft = load(AUTHOR / "draft.json")
views = load(AUTHOR / "reviewer-views.json")
provenance = load(AUTHOR / "source-provenance.json")
preservation = load(AUTHOR / "preservation-receipt.json")
recovery = load(AUTHOR / "recovery-receipt.json")
first = load(OWNER / "review-FIRST.json")
first_summary = load(OWNER / "FIRST-summary.json")
frozen_truths = load(OWNER / "affected-every-option-true-sets-RECOVERY-BINDING.json")
frozen_view_review = load(OWNER / "affected-view-review-RECOVERY-BINDING.json")
frozen_operations = load(OWNER / "affected-source-operations-RECOVERY-BINDING.json")
manual = load(OWNER / "stage3-comparison-evidence-RECOVERY-BINDING.json")
assert canonical_digest(seed) == manual["seedCanonicalSha256"]
assert canonical_digest(draft) == manual["draftCanonicalSha256"]
assert draft["seed_sha256"] == canonical_digest(seed)
assert file_hash(OWNER / "affected-every-option-true-sets-RECOVERY-BINDING.json") == manual["frozenAffectedTruthsSha256"]
assert draft["new_figures"] == []
assert provenance["sourceRepoForStructuralValidation"] == str(ROOT)
assert recovery["realRepo"] == str(ROOT)
assert recovery["same17UnaffectedFirstQuestionUnitsByteIdentical"]
assert preservation["unaffectedFirstQuestionUnitsByteIdenticalCount"] == 17
assert first["outcome"] == "blocked"
affected_ids = {question["question_id"] for question in manual["questionComparisons"]}
assert len(affected_ids) == 3
assert len(draft["questions"]) == 20
assert sum(len(question["view"]["options"]) for question in draft["questions"]) == 84

decoder = json.JSONDecoder()


def skip_space(text, cursor):
    while cursor < len(text) and text[cursor].isspace():
        cursor += 1
    return cursor


def object_value_spans(text):
    """Use the JSON decoder's consumed offsets to retain exact raw object values."""
    cursor = skip_space(text, 0)
    assert text[cursor] == "{"
    cursor += 1
    while True:
        cursor = skip_space(text, cursor)
        if text[cursor] == "}":
            return
        key, cursor = decoder.raw_decode(text, cursor)
        cursor = skip_space(text, cursor)
        assert text[cursor] == ":"
        start = skip_space(text, cursor + 1)
        value, end = decoder.raw_decode(text, start)
        yield key, value, text[start:end]
        cursor = skip_space(text, end)
        if text[cursor] == "}":
            return
        assert text[cursor] == ","
        cursor += 1


raw_text = (AUTHOR / "draft.json").read_text(encoding="utf-8")
questions_raw = next(raw for key, value, raw in object_value_spans(raw_text) if key == "questions")
cursor = skip_space(questions_raw, 0) + 1
raw_unit_checks = []
while True:
    cursor = skip_space(questions_raw, cursor)
    if questions_raw[cursor] == "]":
        break
    question, end = decoder.raw_decode(questions_raw, cursor)
    raw = questions_raw[cursor:end]
    metadata = next(item for item in preservation["questions"] if item["questionId"] == question["id"])
    raw_digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    assert raw_digest == metadata["recoveryRawUnitSha256"]
    assert raw_digest == metadata["retainedCandidateRawUnitSha256"]
    view_raw = next(value_raw for key, value, value_raw in object_value_spans(raw) if key == "view")
    assert hashlib.sha256(view_raw.encode("utf-8")).hexdigest() == metadata["rawViewSha256"]
    is_affected = question["id"] in affected_ids
    assert metadata["affected"] == is_affected
    if not is_affected:
        assert metadata["originalFirstUnaffectedUnitByteIdentical"]
    raw_unit_checks.append({
        "questionId": question["id"],
        "affected": is_affected,
        "rawUnitSha256": raw_digest,
        "currentRawUnitMatchesPreservationMetadata": True,
        "rawViewMatchesPreservationMetadata": True,
        "FIRSTUnchangedAuthority": "User-verified preservation and sidecar assertion; old approved option content is not reopened." if not is_affected else None,
    })
    cursor = skip_space(questions_raw, end)
    if questions_raw[cursor] == ",":
        cursor += 1
    else:
        assert questions_raw[cursor] == "]"
assert len(raw_unit_checks) == 20

question_map = {question["id"]: question for question in draft["questions"]}
view_map = {question["id"]: question for question in views["questions"]}
truth_map = {question["question_id"]: question for question in frozen_truths["questions"]}
review_map = {question["question_id"]: question for question in frozen_view_review["questionReviews"]}
comparison_records = []
for record in manual["questionComparisons"]:
    question = question_map[record["question_id"]]
    frozen = truth_map[question["id"]]["mathematics"]
    assert question["view"] == view_map[question["id"]]["view"], "View changed after pre-key freeze"
    assert question["key"]["correct"] == frozen["correct"] == record["correct"]
    rationales = {rationale["option_id"]: rationale for rationale in question["key"]["rationales"]}
    assert set(rationales) == {option["id"] for option in question["view"]["options"]}
    assert len(rationales) == 4
    option_records = []
    for option_record in record["optionComparisons"]:
        rationale = rationales[option_record["option_id"]]
        frozen_check = next(item for item in frozen["option_checks"] if item["option_id"] == option_record["option_id"])
        assert rationale["truth"] == frozen_check["truth"] == option_record["truth"]
        assert rationale["derivation"].strip()
        if rationale["truth"] == "correct":
            assert rationale["misconception"] is None
        else:
            assert isinstance(rationale["misconception"], str) and rationale["misconception"].strip()
        option_records.append({
            **option_record, "authorDerivation": rationale["derivation"],
            "authorMisconception": rationale["misconception"],
            "frozenTruthEvidence": frozen_check["evidence"],
        })
    coverage = next(item for item in draft["coverage"] if item["source_number"] == record["source_number"])
    assert coverage["question_ids"] == [question["id"]]
    assert question["source_numbers"] == [record["source_number"]]
    assert question["intent"]["limitations"]
    comparison_records.append({
        **record, "optionComparisons": option_records,
        "coverage": coverage, "authorIntent": question["intent"],
        "independentPreKeyReviewReused": review_map[question["id"]],
        "viewUnchangedSincePreKeyFreeze": True,
    })

review = copy.deepcopy(first)
review["seed_sha256"] = canonical_digest(seed)
review["draft_sha256"] = canonical_digest(draft)
review["reviewer"] = {
    "kind": "independent_agent",
    "identity": "Dedicated independent reviewer: FIRST17 approvals preserved; affected3 source/view/truth freeze precedes repaired key comparison.",
}
for index, question_review in enumerate(review["question_reviews"]):
    question_id = question_review["question_id"]
    if question_id not in affected_ids:
        continue
    staged = review_map[question_id]
    review["question_reviews"][index] = {
        "question_id": question_id,
        "task_fidelity": copy.deepcopy(staged["task_fidelity"]),
        "redundancy": copy.deepcopy(staged["redundancy"]),
        "answer_leakage": copy.deepcopy(staged["answer_leakage"]),
        "mathematics": copy.deepcopy(truth_map[question_id]["mathematics"]),
    }
source_solutions = {
    "829": "Reuse the frozen exact source solution:6sqrt(1/3)=sqrt12, while0.3333 is an input approximation. Under the disclosed supplementary2010 TableIV context,0.3333=33.33*10^-2, row33/main3/correction3 gives(5.771+0.003)/10=0.5774 and multiplying by6 gives3.4644, reporting3.464 at three decimals. The exact rewrite uses row12/main0=3.464 directly. Thus reports match at three decimals; the direct route needs fewer correction/rescaling operations. This is not an equality of exact inputs/errors or historical-edition authentication.",
    "830": "Reuse frozen exact absorption:sqrt80,sqrt450,sqrt28,sqrt120. With the disclosed supplementary main cells and even-power rule, normalized roots are sqrt80,10sqrt4.5,sqrt28,10sqrt1.2; their table-derived reports are8.944,21.21,5.292,10.95 in source order. The corresponding literal cells8.944,2.121,5.292,1.095 were independently authenticated before keys. Full-table navigation and independent written production are not assessed; all four numerical tasks remain in the complete result.",
    "831": "Reuse frozen physical inverse r=sqrt(S/pi) with nonnegative S and positive pi; for the stated positive areas take the positive radius in cm. With approximate inputs and the explicit authored four-significant policy,625/157=3.9808917... gives3.981 and412/157=2.6242038... gives2.624. The independently captured main/correction cells give1.995+0.000=1.995cm and1.619+0.001=1.620cm. Area multipliers4 and1/25 give radius multipliers2 and1/5. These are finite-table reports under disclosed conditions, not exact measured radii or historical-table equivalence.",
}
for source_review in review["source_reviews"]:
    number = source_review["source_number"]
    if number in source_solutions:
        staged = next(item for item in frozen_view_review["sourceCoverage"] if item["source_number"] == number)
        source_review["independent_solution"] = source_solutions[number]
        source_review["coverage"] = {"verdict": staged["verdict"], "evidence": staged["evidence"]}
review["outcome"] = "pass"
old_review_map = {item["question_id"]: item for item in first["question_reviews"]}
carried_ids = []
for item in review["question_reviews"]:
    if item["question_id"] not in affected_ids:
        assert item == old_review_map[item["question_id"]]
        carried_ids.append(item["question_id"])
assert set(carried_ids) == set(first_summary["unaffected_17_approvals"])
assert len(carried_ids) == 17
assert sum(len(item["mathematics"]["option_checks"]) for item in review["question_reviews"]) == 84
assert set(review) == {
    "schema", "seed_sha256", "draft_sha256", "reviewer", "source_reviews",
    "figure_checks", "new_figure_reviews", "question_reviews", "outcome",
}
assert review["schema"] == "s10y-choice-review-v1"
assert review["figure_checks"] == [] and review["new_figure_reviews"] == []
write_json("review.json", review)
write_json("stage3-key-comparison-RECOVERY-BINDING.json", {
    "schema": "stemrobin182/n40-affected-stage3-key-comparison@1",
    "ticket": "STEMROBIN-182", "outcome": "pass",
    "seedCanonicalSha256": canonical_digest(seed), "draftCanonicalSha256": canonical_digest(draft),
    "frozenPreKeyTruthsSha256": manual["frozenAffectedTruthsSha256"],
    "comparisons": comparison_records, "counts": manual["totals"], "findings": [],
    "scope": "Only12 changed options/3 units compared;72 unaffected options retain FIRST reviews. No independent full source re-solve or images.",
})
write_json("stage3-binding-summary-RECOVERY-BINDING.json", {
    "schema": "stemrobin182/n40-affected-stage3-binding-summary@1",
    "status": "PASS", "authorizedInputs": inputs,
    "realRepo": str(ROOT), "retiredSyntheticSourceUsed": False,
    "seedCanonicalSha256": canonical_digest(seed), "draftCanonicalSha256": canonical_digest(draft),
    "viewsUnchangedSincePreKeyFreeze": True, "currentRawUnitAndViewChecks": raw_unit_checks,
    "unchanged17QuestionReviewsCopiedExactlyFromFIRST": carried_ids,
    "unchanged17ContentAuthority": "Direct human disclosure plus current raw-unit matching to authorized preservation metadata; approved options were not reopened for semantic comparison.",
    "FIRSTCanonicalOutcomePreserved": first["outcome"], "FIRSTFilesRewritten": False,
    "affectedPreKeyFindingsResolvedOnlyForNewSnapshot": frozen_view_review["FIRSTFindingDispositionsForThisNewViewOnly"],
    "sourceOperationsReused": {
        "path": str(OWNER / "affected-source-operations-RECOVERY-BINDING.json"),
        "sha256": file_hash(OWNER / "affected-source-operations-RECOVERY-BINDING.json"),
        "lookupTasks": len(frozen_operations["operations"]),
    },
    "canonicalReviewFieldsOnly": True,
})

validator = ROOT / ".agents/skills/ld-s10y-choice/scripts/validate.py"
command = [
    sys.executable, "-B", str(validator),
    "--repo", str(ROOT), "--seed", str(AUTHOR / "seed.json"),
    "--draft", str(AUTHOR / "draft.json"), "--review", str(OWNER / "review.json"),
]
started = datetime.now(timezone.utc).isoformat()
completed = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, check=False)
write_once("official-validator-FIRST-stdout.txt", completed.stdout)
write_once("official-validator-FIRST-stderr.txt", completed.stderr)
validator_receipt = {
    "schema": "stemrobin182/n40-official-validator-first-invocation@1",
    "startedAtUtc": started, "finishedAtUtc": datetime.now(timezone.utc).isoformat(),
    "command": command, "cwd": str(ROOT), "firstExitCode": completed.returncode,
    "stdout": completed.stdout, "stderr": completed.stderr,
    "invocationCount": 1, "rerun": False,
    "reviewCanonicalSha256": canonical_digest(review), "reviewFileSha256": file_hash(OWNER / "review.json"),
    "validatorScriptSha256": file_hash(validator),
    "sourceRefresh": "Official source freshness/structure check only; not a repeated mathematical source solve.",
}
write_json("official-validator-FIRST-receipt.json", validator_receipt)
status = "PASS" if completed.returncode == 0 else "NOT_APPROVED_VALIDATOR_FAILURE"
summary = {
    "schema": "stemrobin182/n40-recovery-stage3-summary@1",
    "ticket": "STEMROBIN-182", "status": status, "semanticOutcome": review["outcome"],
    "officialValidatorFirstExit": completed.returncode, "officialValidatorInvocations": 1,
    "questionCount": 20, "optionCount": 84, "changedQuestionCount": 3,
    "changedOptionChecks": 12, "changedCorrectOptions": 3, "changedIncorrectOptions": 9,
    "unaffectedFIRSTApprovalsRetained": 17, "unaffectedOptionsNotReReviewed": 72,
    "restoredLookupTasks": 8, "newIndependentSourceSolves": 0, "newImages": 0,
    "findings": [] if completed.returncode == 0 else [{"kind": "validator_failure", "firstExit": completed.returncode, "evidence": completed.stderr or completed.stdout}],
    "FIRSTOutcomeRemains": "blocked", "bothPriorFreezesPreserved": True,
    "canonicalReview": {
        "path": str(OWNER / "review.json"), "sha256": file_hash(OWNER / "review.json"),
        "canonicalSha256": canonical_digest(review),
    },
    "validatorReceipt": {
        "path": str(OWNER / "official-validator-FIRST-receipt.json"),
        "sha256": file_hash(OWNER / "official-validator-FIRST-receipt.json"),
    },
    "scope": "Offline semantic/structural choice review only; no promotion, finalizer, publish, DB/app, dependency installation or commit.",
}
write_json("stage3-summary-RECOVERY-BINDING.json", summary)
payload_names = [
    "build-review-RECOVERY-BINDING.py", "stage3-comparison-evidence-RECOVERY-BINDING.json",
    "review.json", "stage3-key-comparison-RECOVERY-BINDING.json",
    "stage3-binding-summary-RECOVERY-BINDING.json", "official-validator-FIRST-stdout.txt",
    "official-validator-FIRST-stderr.txt", "official-validator-FIRST-receipt.json",
    "stage3-summary-RECOVERY-BINDING.json",
]
artifacts = [
    {"name": name, "path": str(OWNER / name), "sha256": file_hash(OWNER / name), "bytes": (OWNER / name).stat().st_size, "mode": "0444"}
    for name in payload_names
]
write_json("stage3-hashes-RECOVERY-BINDING.json", {
    "schema": "stemrobin182/n40-recovery-stage3-hashes@1",
    "algorithm": "sha256", "inputs": inputs, "artifacts": artifacts,
    "allPriorFIRSTAndAffectedPreKeyArtifactsPreserved": preserved,
})
hash_manifest = OWNER / "stage3-hashes-RECOVERY-BINDING.json"
write_json("stage3-freeze-RECOVERY-BINDING.json", {
    "schema": "stemrobin182/n40-recovery-stage3-freeze@1",
    "ticket": "STEMROBIN-182", "frozenAtUtc": datetime.now(timezone.utc).isoformat(),
    "status": "FROZEN_" + status, "mode": "0444", "writeOnce": True,
    "owner": str(OWNER), "summary": summary,
    "hashManifest": {"path": str(hash_manifest), "sha256": file_hash(hash_manifest)},
    "canonicalReview": summary["canonicalReview"], "priorArtifactsPreserved": preserved,
    "nextAction": "Stop at offline review handoff. Parent owns all later integration/finalization/promotion.",
})
checksum_names = payload_names + ["stage3-hashes-RECOVERY-BINDING.json", "stage3-freeze-RECOVERY-BINDING.json"]
write_once("stage3-freeze-RECOVERY-BINDING.sha256", "".join(f"{file_hash(OWNER / name)}  {name}\n" for name in checksum_names))
for old in preserved:
    file = pathlib.Path(old["path"])
    assert file_hash(file) == old["sha256"] and (file.stat().st_mode & 0o777) == 0o444
for item in inputs:
    assert file_hash(pathlib.Path(item["path"])) == item["sha256"]
for name in checksum_names + ["stage3-freeze-RECOVERY-BINDING.sha256"]:
    (OWNER / name).chmod(0o444)
print(json.dumps({
    **summary, "frozenMode": "0444",
    "freezeReceipt": {
        "path": str(OWNER / "stage3-freeze-RECOVERY-BINDING.json"),
        "sha256": file_hash(OWNER / "stage3-freeze-RECOVERY-BINDING.json"),
    },
}, indent=2))
