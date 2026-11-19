import copy
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWNER = BASE / "n41-n42-normalized-binding"
assert Path(__file__).resolve().parent == OWNER
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition

inputs = {}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read_bytes(path):
    path = Path(path)
    data = path.read_bytes()
    inputs[str(path)] = {"path": str(path), "sha256": sha(data), "bytes": len(data)}
    return data


def load(path):
    return json.loads(read_bytes(path))


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def changed_paths(before, after, prefix=""):
    if type(before) is not type(after):
        return [prefix]
    if isinstance(before, dict):
        result = []
        for key in sorted(before.keys() | after.keys()):
            path = prefix + "/" + key
            if key not in before or key not in after:
                result.append(path)
            else:
                result.extend(changed_paths(before[key], after[key], path))
        return result
    if isinstance(before, list):
        if len(before) != len(after):
            return [prefix]
        return [
            path
            for index, (left, right) in enumerate(zip(before, after))
            for path in changed_paths(left, right, prefix + "/" + str(index))
        ]
    return [] if before == after else [prefix]


def whitespace_free(text):
    return "".join(text.split())


def formulas(text):
    return [match.group(1) or match.group(2) for match in edition.MATH.finditer(text)]


def verify_receipt(stem, exit_code, lesson=None, required_text=None):
    path = BASE / "stages" / (stem + ".receipt.json")
    receipt = load(path)
    require(receipt["exit"] == exit_code, str(path) + ": wrong exit")
    require(receipt["cwd"] == str(ROOT), str(path) + ": wrong checkout")
    require(receipt.get("signal") is None and receipt.get("error") is None, str(path) + ": execution error")
    if lesson:
        require(receipt["command"][-2:] == ["--lesson", lesson], str(path) + ": wrong lesson")
        require("adapt-finalize" in receipt["command"], str(path) + ": wrong command")
        require(receipt["command"][receipt["command"].index("--book") + 1] == "7a", str(path) + ": wrong book")
    streams = []
    for stream in receipt["streams"]:
        stream_path = ROOT / stream["path"]
        data = read_bytes(stream_path)
        require(sha(data) == stream["sha256"], str(stream_path) + ": stream hash mismatch")
        streams.append(data.decode("utf-8"))
    if required_text:
        require(required_text in "\n".join(streams), str(path) + ": missing expected diagnosis")
    return {"path": str(path), "sha256": inputs[str(path)]["sha256"], "exit": exit_code, "command": receipt["command"]}


def safe_document(path):
    data = read_bytes(path)
    require(
        not any(token in data for token in [b'"answerKey"', b'"answer_key"', b'"correct_index"', b'"choices"']),
        str(path) + ": out-of-scope answer/choice payload; not opened for comparison",
    )
    return json.loads(data)


def normalized(doc, kind):
    result = copy.deepcopy(doc)
    if kind == "lesson":
        edition.normalize_lesson_layout(result)
    else:
        edition.normalize_exercise_layout(result)
    return result


def flow(doc):
    value, errors = edition.prose_flow_contract(doc["prose"], doc.get("section_breaks", []))
    require(not errors, "; ".join(errors))
    return value


def serialize(doc):
    return (json.dumps(doc, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def run():
    review_path = BASE / "n41-n43-modern-review/first-review.md"
    review = read_bytes(review_path).decode("utf-8")
    require("| alg7-c4-s2-n41 | PASS |" in review, "Missing FIRST n41 PASS")
    require("| alg7-c4-s3-n42 | PASS |" in review, "Missing FIRST n42 PASS")
    require("### O1: Exercise 851 Normalization Observation" in review, "Missing FIRST O1")
    hash_path = BASE / "n41-n43-modern-review/input-hashes.sha256"
    approved_hashes = {
        path: digest
        for line in read_bytes(hash_path).decode("utf-8").splitlines()
        if line.strip()
        for digest, path in [line.split("  ", 1)]
    }
    repair_path = BASE / "n41-anchor-repair.json"
    repair = load(repair_path)
    read_bytes(BASE / "repair-n41-normalized-anchors.py")
    for name in ["edition.py", "p2c.py", "prose_flow.mjs", "htmlfrag.js"]:
        read_bytes(TOOLS / name)
    receipt_first = verify_receipt(
        "n41-modern-finalize-FIRST", 2, "alg7-c4-s2-n41",
        "section_breaks[0] must identify exactly one adjacent paragraph pair; matched 0",
    )
    receipt_repair = verify_receipt("n41-anchor-repair-RECOVERY1", 0)
    receipt_recovery = verify_receipt(
        "n41-modern-finalize-RECOVERY1", 0, "alg7-c4-s2-n41",
        "[adapt-finalize] alg7-c4-s2-n41: PASS",
    )
    receipt_n42 = verify_receipt(
        "n42-modern-finalize-FIRST", 0, "alg7-c4-s3-n42",
        "[adapt-finalize] alg7-c4-s3-n42: PASS",
    )
    book = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a"
    modern = book / "editions/modern-us-neutral"
    index_path = modern / "book.json"
    index = load(index_path)
    profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"
    profile = load(profile_path)
    require(index["status"] == "ready", "Edition book index not ready")
    require(index["profile"]["id"] == profile["id"], "Book profile id differs")
    require(index["profile"]["sha256"] == inputs[str(profile_path)]["sha256"], "Book profile hash differs")
    require((ROOT / index["profile"]["path"]).resolve() == profile_path, "Book profile path differs")
    lesson_results = []
    for lesson_id, expected_exercises in [
        ("alg7-c4-s2-n41", [str(i) for i in range(834, 851)]),
        ("alg7-c4-s3-n42", [str(i) for i in range(851, 855)]),
    ]:
        first_dir = BASE / "n41-n42-modern-author/first-authored" / lesson_id
        adapt_dir = BASE / "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons" / lesson_id
        durable_dir = modern / "lessons" / lesson_id
        first_lesson = safe_document(first_dir / "lesson.template.json")
        first_exercises = safe_document(first_dir / "exercises.template.json")
        current_lesson = safe_document(adapt_dir / "lesson.template.json")
        current_exercises = safe_document(adapt_dir / "exercises.template.json")
        for basename in ["lesson", "exercises"]:
            original_approved_path = str((adapt_dir / (basename + ".template.json")).relative_to(ROOT))
            first_path = first_dir / (basename + ".template.json")
            require(inputs[str(first_path)]["sha256"] == approved_hashes[original_approved_path], "FIRST snapshot not approved hash: " + str(first_path))
        require(current_exercises == first_exercises, lesson_id + ": current exercise template drift")
        require(inputs[str(adapt_dir / "exercises.template.json")]["sha256"] == approved_hashes[str((adapt_dir / "exercises.template.json").relative_to(ROOT))], lesson_id + ": exercise bytes changed")
        expected_lesson = normalized(current_lesson, "lesson")
        expected_exercises_doc = normalized(current_exercises, "exercises")
        normalization_lesson_changes = changed_paths(current_lesson, expected_lesson)
        normalization_exercise_changes = changed_paths(current_exercises, expected_exercises_doc)
        template_changes = changed_paths(first_lesson, current_lesson)
        if lesson_id.endswith("n41"):
            unchanged = copy.deepcopy(current_lesson)
            unchanged["section_breaks"] = first_lesson["section_breaks"]
            require(unchanged == first_lesson, "n41 repair exceeded section_breaks")
            old_flow = flow(first_lesson)
            require(old_flow["resolvedBreaks"] == [8, 16, 27], "n41 FIRST paragraph indices differ")
            original_normalized = normalized(first_lesson, "lesson")
            paragraph_flow, errors = edition.prose_flow_contract(original_normalized["prose"], [])
            require(not errors, "n41 normalized paragraphs fail")
            block_pairs = [
                [old_flow["paragraphs"][i - 1]["blockIndex"], old_flow["paragraphs"][i]["blockIndex"]]
                for i in old_flow["resolvedBreaks"]
            ]
            require(block_pairs == [[4, 5], [8, 9], [15, 16]], "n41 FIRST boundary block pairs differ")
            normalized_indices = []
            for before, after in block_pairs:
                matches = [
                    i for i in range(1, len(paragraph_flow["paragraphs"]))
                    if paragraph_flow["paragraphs"][i - 1]["blockIndex"] == before
                    and paragraph_flow["paragraphs"][i]["blockIndex"] == after
                ]
                require(len(matches) == 1, "n41 boundary block pair not unique")
                normalized_indices.append(matches[0])
            new_anchors = [
                {"before": paragraph_flow["paragraphs"][i - 1]["text"], "after": paragraph_flow["paragraphs"][i]["text"]}
                for i in normalized_indices
            ]
            require(normalized_indices == [5, 10, 17], "n41 normalized indices differ")
            require(current_lesson["section_breaks"] == new_anchors == repair["after"], "n41 anchors not exact standard-normalized block-pair anchors")
            require(repair["before"] == first_lesson["section_breaks"], "n41 original anchors receipt mismatch")
            require(repair["blockPairs"] == block_pairs, "n41 repair pairs mismatch")
            require(repair["first"]["sha256"] == inputs[str(first_dir / "lesson.template.json")]["sha256"], "n41 repair FIRST hash mismatch")
            anchor_result = {"originalParagraphIndices": [8, 16, 27], "normalizedParagraphIndices": normalized_indices, "unchangedBlockPairs": block_pairs}
        else:
            require(current_lesson == first_lesson, "n42 template drift")
            anchor_result = {"resolvedParagraphIndices": [6, 9], "templateAnchorsChanged": False}
            require(flow(expected_lesson)["resolvedBreaks"] == [6, 9], "n42 normalized boundary indices changed")
        for first, current, expected in [
            (first_lesson["prose"], current_lesson["prose"], expected_lesson["prose"]),
            (first_exercises["exercises"], current_exercises["exercises"], expected_exercises_doc["exercises"]),
        ]:
            require(len(first) == len(current) == len(expected), lesson_id + ": object count changed")
            for before, intermediate, after in zip(first, current, expected):
                require(before["source_text"] == intermediate["source_text"] == after["source_text"], lesson_id + ": source_text drift")
                require(whitespace_free(before.get("text", "")) == whitespace_free(after.get("text", "")), lesson_id + ": non-layout wording changed")
                require(formulas(before.get("text", "")) == formulas(after.get("text", "")), lesson_id + ": exact formulas/order changed")
                for key in ["numeric_changes", "historical_entities", "source_refs", "group", "group_id", "number", "source_number", "figure_refs", "figures"]:
                    require(before.get(key) == after.get(key), lesson_id + ": identity/group/domain/number declaration drift: " + key)
        changed_exercise_numbers = [
            before["number"]
            for before, after in zip(current_exercises["exercises"], expected_exercises_doc["exercises"])
            if before != after
        ]
        require(changed_exercise_numbers == (["851"] if lesson_id.endswith("n42") else []), lesson_id + ": unapproved exercise normalization")
        if lesson_id.endswith("n42"):
            old_851 = first_exercises["exercises"][0]["text"]
            new_851 = expected_exercises_doc["exercises"][0]["text"]
            require(old_851.endswith("\n其中哪几个方程是简化的二次方程？"), "851 FIRST follow-up changed")
            require(new_851.endswith("f) $x^2-81=0$。 其中哪几个方程是简化的二次方程？"), "851 normalization differs from FIRST O1")
        expected_lesson["status"] = "ready"
        expected_exercises_doc["status"] = "ready"
        durable_lesson = safe_document(durable_dir / "lesson.json")
        durable_exercises = safe_document(durable_dir / "exercises.json")
        for label, expected, actual, path in [
            ("lesson", expected_lesson, durable_lesson, durable_dir / "lesson.json"),
            ("exercises", expected_exercises_doc, durable_exercises, durable_dir / "exercises.json"),
        ]:
            require(expected == actual, lesson_id + ": output differs from existing normalizers + ready: " + ", ".join(changed_paths(expected, actual)))
            require(sha(serialize(expected)) == inputs[str(path)]["sha256"], lesson_id + ": not exact standard serialized bytes")
            raw_path = book / "lessons" / lesson_id / (label + ".json")
            read_bytes(raw_path)
            require(not edition.validate_source(book, actual["source"], raw_path, label), lesson_id + ": raw source binding invalid")
            require(actual["source"] == (first_lesson if label == "lesson" else first_exercises)["source"], lesson_id + ": source metadata changed")
        durable_flow = flow(durable_lesson)
        figure_ids = {figure["id"] for figure in durable_lesson.get("figures", [])}
        for item in durable_exercises["exercises"]:
            figure_ids.update(item.get("figure_refs", []))
        expected_audit = {
            "schema": edition.AUDIT_SCHEMA, "edition": "modern-us-neutral", "lesson": lesson_id,
            "status": "pass",
            "sourceLessonSha256": durable_lesson["source"]["sha256"],
            "sourceExercisesSha256": durable_exercises["source"]["sha256"],
            "proseBlocks": len(durable_lesson["prose"]),
            "changedProseBlocks": sum(item["text"] != item["source_text"] for item in durable_lesson["prose"]),
            "sectionBreaks": len(durable_lesson.get("section_breaks") or []),
            "resolvedSectionBreaks": durable_flow.get("boundaries", []),
            "errata": len(durable_lesson.get("errata") or []),
            "exercises": len(durable_exercises["exercises"]),
            "changedExercises": sum(item["text"] != item["source_text"] for item in durable_exercises["exercises"]),
            "figures": len(figure_ids), "errors": [],
        }
        actual_audit = load(durable_dir / "adaptation.audit.json")
        require(actual_audit == expected_audit, lesson_id + ": adaptation audit not exact cmd_finalize fields")
        require(sha(serialize(expected_audit)) == inputs[str(durable_dir / "adaptation.audit.json")]["sha256"], lesson_id + ": audit serialization differs")
        expected_row = {
            "id": lesson_id, "number": durable_lesson["number"], "title": durable_lesson["title"],
            "prose_blocks": len(durable_lesson["prose"]), "exercises": len(durable_exercises["exercises"]),
            "figures": len(figure_ids),
            "source_lesson_sha256": durable_lesson["source"]["sha256"],
            "source_exercises_sha256": durable_exercises["source"]["sha256"],
        }
        require([item for item in index["lessons"] if item["id"] == lesson_id] == [expected_row], lesson_id + ": generated book-index row differs")
        require(durable_exercises["count"] == len(expected_exercises), lesson_id + ": exercise count mismatch")
        require([item["number"] for item in durable_exercises["exercises"]] == expected_exercises, lesson_id + ": exercise identities mismatch")
        lesson_results.append({
            "lesson": lesson_id, "status": "PASS",
            "FIRSTModernTextPASSReused": True,
            "scope": "Only normalized-output binding, anchors and documented 851 layout; no new mathematical/source/figure review.",
            "firstTemplateToCurrentLessonChanges": template_changes,
            "firstTemplateToCurrentExercisesChanges": [],
            "normalizerLessonChangedPointers": normalization_lesson_changes,
            "normalizerExerciseChangedPointers": normalization_exercise_changes,
            "known851O1Reused": lesson_id.endswith("n42"),
            "anchorBinding": anchor_result,
            "formulaOrderAndContent": "Exact tokens unchanged",
            "nonWhitespaceWordingAndDomainConditions": "Unchanged",
            "sourceSnapshotsAndPaths": "Exact FIRST source dictionaries unchanged; existing validate_source passed",
            "generatedDocumentMetadata": {"status": "draft -> ready", "sourcePathChanges": [], "sourceBookMetadataChanges": []},
            "generatedBookMetadata": {"ownedIndexRowMatchesCmdFinalize": True, "profileHashAndPathBound": True},
            "durableOutputsMatchExistingNormalizersAndReady": True,
            "exactSerializedBytesAndAudit": True,
            "exercises": len(expected_exercises),
            "outputHashes": [
                inputs[str(durable_dir / name)] for name in ["lesson.json", "exercises.json", "adaptation.audit.json"]
            ],
        })
    return {
        "schema": "ld-s10y-lesson/normalized-binding-review@1",
        "ticket": "STEMROBIN-182", "status": "PASS",
        "FIRSTReuse": {"report": inputs[str(review_path)], "inputHashes": inputs[str(hash_path)], "lessons": ["alg7-c4-s2-n41", "alg7-c4-s3-n42"], "O1": "Existing FIRST observation reused, not a new semantic review."},
        "historicalReceiptsPreserved": {"n41FIRSTFailure": receipt_first, "n41AnchorRepair": receipt_repair, "n41RecoveryFinalizer": receipt_recovery, "n42FIRSTFinalizer": receipt_n42},
        "lessons": lesson_results, "defects": [],
        "boundInputs": list(inputs.values()),
        "limits": {"imagesOpened": 0, "keysOrChoicesOpened": False, "network": False, "DB": False, "productionChanged": False, "finalizerRerun": False, "fullValidateLessonRerun": False, "fullSemanticOrSourceReviewRepeated": False},
        "helpers": ["edition.normalize_lesson_layout", "edition.normalize_exercise_layout", "edition.prose_flow_contract", "edition.validate_source"],
        "auditAndBookFields": "Reconstructed exactly from existing edition.cmd_finalize/update_book_index fields; no invented metadata allowances.",
    }


for name in ["binding-review.json", "freeze-receipt.json"]:
    require(not (OWNER / name).exists(), "Refusing to overwrite frozen binding evidence")
try:
    result = run()
except (AssertionError, KeyError, ValueError, SystemExit) as error:
    result = {
        "schema": "ld-s10y-lesson/normalized-binding-review@1",
        "ticket": "STEMROBIN-182", "status": "DEFECT",
        "defects": [{"detail": str(error)}],
        "boundInputs": list(inputs.values()),
        "limits": {"productionChanged": False, "imagesOpened": 0, "finalizerRerun": False},
    }
for record in inputs.values():
    require(sha(Path(record["path"]).read_bytes()) == record["sha256"], "Input changed during binding: " + record["path"])
result["frozenAt"] = datetime.now(timezone.utc).isoformat()
report_path = OWNER / "binding-review.json"
with report_path.open("x", encoding="utf-8") as handle:
    json.dump(result, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
script_path = Path(__file__).resolve()
freeze = {
    "schema": "ld-s10y-lesson/normalized-binding-freeze@1",
    "ticket": "STEMROBIN-182", "status": result["status"], "frozenAt": result["frozenAt"],
    "outputs": [
        {"path": str(path), "sha256": sha(path.read_bytes()), "mode": "0444"}
        for path in [report_path, script_path]
    ],
    "inputsRecheckedUnchanged": True, "productionChanged": False, "FIRSTBytesPreserved": True,
}
freeze_path = OWNER / "freeze-receipt.json"
with freeze_path.open("x", encoding="utf-8") as handle:
    json.dump(freeze, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
for path in [report_path, script_path, freeze_path]:
    path.chmod(0o444)
    require(path.stat().st_mode & 0o777 == 0o444, "Not frozen: " + str(path))
for record in freeze["outputs"]:
    require(sha(Path(record["path"]).read_bytes()) == record["sha256"], "Output hash mismatch")
print(json.dumps({
    "status": result["status"], "defects": result.get("defects", []),
    "report": freeze["outputs"][0],
    "freezeReceipt": {"path": str(freeze_path), "sha256": sha(freeze_path.read_bytes()), "mode": "0444"},
}, ensure_ascii=False, indent=2))
