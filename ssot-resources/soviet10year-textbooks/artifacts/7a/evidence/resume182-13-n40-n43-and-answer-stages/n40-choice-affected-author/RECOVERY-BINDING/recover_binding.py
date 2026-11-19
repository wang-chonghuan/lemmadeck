#!/usr/bin/env python3
"""Rebind unchanged choice content to the actual durable source projection."""

import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys


OUT = Path(__file__).resolve().parent
OWN = OUT.parent
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
SCRIPTS = ROOT / ".agents/skills/ld-s10y-choice/scripts"
AFFECTED = {
    "n40-lookup-method-comparison": "829",
    "n40-table-ready-plan": "830",
    "n40-radius-and-area": "831",
}
assert OWN == ROOT / (
    ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/"
    "n40-choice-affected-author"
)
assert sys.dont_write_bytecode

# Reuse only the existing JSON span parser; never invoke the staged builder.
module_spec = importlib.util.spec_from_file_location(
    "retained_json_spans", OWN / "build_affected.py"
)
parser = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(parser)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha_bytes(value):
    return hashlib.sha256(value).hexdigest()


def sha(path):
    return sha_bytes(path.read_bytes())


def digest(value):
    return sha_bytes(json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8"))


def binding(path):
    return {"path": str(path), "sha256": sha(path)}


def write_text(name, value):
    path = OUT / name
    assert path.resolve().is_relative_to(OUT)
    with path.open("x", encoding="utf-8", newline="") as stream:
        stream.write(value)


def write_json(name, value):
    write_text(name, json.dumps(value, ensure_ascii=True, indent=2) + "\n")


def command(arguments):
    completed = subprocess.run(
        arguments, cwd=ROOT, capture_output=True, text=True
    )
    return {
        "command": arguments,
        "cwd": str(ROOT),
        "exitCode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }


def rebind(raw, replacements):
    fields = parser.object_fields(raw)
    edits = [
        (fields[key][0], fields[key][1], json.dumps(value, ensure_ascii=True))
        for key, value in replacements.items()
    ]
    result = raw
    for start, end, value in sorted(edits, reverse=True):
        result = result[:start] + value + result[end:]
    before, after = json.loads(raw), json.loads(result)
    assert set(before) == set(after)
    assert {
        key for key in before if before[key] != after[key]
    } == set(replacements)
    for key in fields:
        if key not in replacements:
            new_fields = parser.object_fields(result)
            start, end, _ = fields[key]
            new_start, new_end, _ = new_fields[key]
            assert raw[start:end] == result[new_start:new_end]
    return result


def question_units(raw):
    start = parser.object_fields(raw)["questions"][0]
    return {
        question["id"]: (raw[first:last], question)
        for first, last, question in parser.array_spans(raw, start)
    }


def raw_view(raw_question):
    first, last, _ = parser.object_fields(raw_question)["view"]
    return raw_question[first:last].encode("utf-8")


def main():
    retained = {
        path: sha(path) for path in OWN.rglob("*")
        if path.is_file() and not path.is_relative_to(OUT)
    }
    prior_provenance = load(OWN / "source-provenance.json")
    source_before = {
        Path(row["originalPath"]): sha(Path(row["originalPath"]))
        for row in prior_provenance["sourceTrace"]
    }
    assert all(
        source_before[Path(row["originalPath"])] == row["originalSha256"]
        for row in prior_provenance["sourceTrace"]
    )
    capture_bindings = prior_provenance["sourceCaptureBindings"]
    allowed_captures = {
        str(OWN.parent / directory / "captures.json")
        for directory in ("n40-table-cell-author", "n40-table-cell-review")
    }
    assert {row["path"] for row in capture_bindings} == allowed_captures
    for row in capture_bindings:
        assert sha(Path(row["path"])) == row["sha256"]

    old_seed = load(OWN / "seed.json")
    first_seed_path = OWN.parent / "n40-choice-author/seed.json"
    first_seed = load(first_seed_path)
    assert first_seed["source"] == old_seed["source"]
    assert first_seed["figures"] == []
    assert [row["number"] for row in first_seed["exercises"]] == [
        str(number) for number in range(820, 834)
    ]
    assert [row["block"] for row in first_seed["concepts"]] == [6, 7]
    assert first_seed["source"]["concept_figure_ids"] == []

    prepare_args = [
        sys.executable, "-B", str(SCRIPTS / "prepare.py"), "prepare",
        "--repo", str(ROOT), "--book", "7a",
        "--lesson", "alg7-c4-s2-n40",
    ]
    for number in range(820, 834):
        prepare_args.extend(["--exercise", str(number)])
    prepare_args.extend([
        "--concept-block", "6", "--concept-block", "7",
        "--out", str(OUT / "seed.json"),
    ])
    preparation = command(prepare_args)
    write_json("prepare-receipt.json", preparation)
    assert preparation["exitCode"] == 0, preparation
    seed = load(OUT / "seed.json")
    assert seed == first_seed
    assert len(seed["trace"]) == 4
    for row in seed["trace"]:
        assert source_before[ROOT / row["path"]] == row["sha256"]
    changed_seed_numbers = [
        old["number"]
        for old, new in zip(old_seed["exercises"], seed["exercises"], strict=True)
        if old != new
    ]
    assert set(changed_seed_numbers) == set(AFFECTED.values())
    assert old_seed["concepts"] == seed["concepts"]
    assert old_seed["source"] == seed["source"]
    assert old_seed["figures"] == seed["figures"] == []

    candidate_raw = (OWN / "draft.json").read_text(encoding="utf-8")
    recovered_raw = rebind(candidate_raw, {"seed_sha256": digest(seed)})
    write_text("draft.json", recovered_raw)
    draft = json.loads(recovered_raw)
    old_units = question_units(candidate_raw)
    new_units = question_units(recovered_raw)
    assert list(old_units) == list(new_units)
    assert len(new_units) == 20
    prior_preservation = load(OWN / "preservation.json")
    prior_units = {
        row["questionId"]: row for row in prior_preservation["questions"]
    }
    preservation = []
    for question_id, (raw, question) in new_units.items():
        before_raw, before_question = old_units[question_id]
        assert raw == before_raw and question == before_question
        unit_sha = sha_bytes(raw.encode("utf-8"))
        assert prior_units[question_id]["newRawUnitSha256"] == unit_sha
        affected = question_id in AFFECTED
        if not affected:
            assert prior_units[question_id]["byteIdentical"]
            assert prior_units[question_id]["oldRawUnitSha256"] == unit_sha
        preservation.append({
            "questionId": question_id,
            "affected": affected,
            "retainedCandidateRawUnitSha256": unit_sha,
            "recoveryRawUnitSha256": unit_sha,
            "byteIdentical": True,
            "rawViewSha256": sha_bytes(raw_view(raw)),
            "originalFirstUnaffectedUnitByteIdentical": not affected,
        })

    old_views_raw = (OWN / "reviewer-views.json").read_text(encoding="utf-8")
    recovered_views_raw = rebind(old_views_raw, {
        "seed_sha256": digest(seed),
        "draft_sha256": digest(draft),
        "seedPath": str(OUT / "seed.json"),
        "sourceRepoForStructuralValidation": str(ROOT),
    })
    write_text("reviewer-views.json", recovered_views_raw)
    old_views = question_units(old_views_raw)
    new_views = question_units(recovered_views_raw)
    assert set(new_views) == set(AFFECTED)
    for question_id, (raw, view_question) in new_views.items():
        assert raw == old_views[question_id][0]
        assert raw_view(raw) == raw_view(old_views[question_id][0])
        assert set(view_question) == {"id", "source_numbers", "view"}
        assert set(view_question["view"]) == {
            "mode", "stem", "figure_ids", "options"
        }
        assert view_question["view"] == new_units[question_id][1]["view"]
        assert view_question["source_numbers"] == [AFFECTED[question_id]]
    context = load(OWN / "supplementary-context.json")
    assert context["sourceCaptureBindings"] == capture_bindings
    for question_id, number in AFFECTED.items():
        supplement = context["contexts"][number]
        suffix = (
            "\n\n" + context["rules"] + "\n\n" + supplement["table"]
            + "\n\n" + supplement["condition"]
        )
        assert new_views[question_id][1]["view"]["stem"].endswith(suffix)

    write_json("source-provenance.json", {
        "schema": "STEMROBIN-182/choice-real-source-recovery@1",
        "kind": "original-source-projection-with-separate-supplementary-view-context",
        "sourceRepoForStructuralValidation": str(ROOT),
        "seed": {
            **binding(OUT / "seed.json"), "canonicalSha256": digest(seed),
            "preparedByNativeCli": True,
            "matchesOriginalFirstSeed": True,
            "originalFirstSeed": binding(first_seed_path),
            "trace": seed["trace"],
            "supplementaryContextIncludedAsOriginalProse": False,
        },
        "draft": {
            **binding(OUT / "draft.json"), "canonicalSha256": digest(draft),
            "onlyChangedTopLevelField": "seed_sha256",
            "newFigures": [],
        },
        "supplementaryViewContext": {
            "binding": binding(OWN / "supplementary-context.json"),
            "sourceCaptureBindings": capture_bindings,
            "retainedIndependentFactSolution": binding(
                OWN / "source-solutions-AFFECTED-1.md"
            ),
            "identity": context["sourceIdentity"],
            "affectedSources": list(AFFECTED.values()),
            "includedOnlyInLearnerViewAndExistingInternalIntent": True,
            "sourceFigureFabricated": False,
            "historicalTableEquivalenceClaimed": False,
            "originalSeedOrDurableSourceEnriched": False,
        },
        "contractAssessment": {
            "nativeContextForm": "view.stem text containing complete Markdown tables",
            "nativeSourceTraceScope": "four durable source JSON files only",
            "noNativeSupplementaryTextProvenanceField": True,
            "assumption": (
                "Visible, explicitly labelled supplementary table facts and authored "
                "conditions are adaptation inputs permitted as view text, not claims "
                "that these facts occur in the original exercise seed. Their factual "
                "bindings remain in this sidecar rather than unknown seed fields."
            ),
            "preciseSemanticIssue": (
                "The displayed cells are from Bradis 2010, not certified equivalent "
                "to the original textbook's historical table. Sparse supplied rows "
                "replace navigating the full table; the 831 four-significant-figure "
                "input policy is an authored condition. The native structural checker "
                "does not authenticate these supplemental facts or establish that "
                "these adaptations retain the intended source task. Independent "
                "affected review must judge those issues against the retained captures."
            ),
            "semanticApproval": False,
        },
        "retainedStagedFirstEvidence": [
            binding(OWN / name) for name in (
                "seed.json", "draft.json", "reviewer-views.json",
                "source-provenance.json", "prepare-affected-receipt.json",
                "structural-validator-affected-receipt.json", "preservation.json",
            )
        ],
        "retainedStagedSourceTrace": prior_provenance["sourceTrace"],
        "stagedRepoUsedForRecoveryValidation": False,
        "builderMainExecuted": False,
    })
    validation = command([
        sys.executable, "-B", str(SCRIPTS / "validate.py"),
        "--repo", str(ROOT), "--seed", str(OUT / "seed.json"),
        "--draft", str(OUT / "draft.json"),
    ])
    write_json("structural-validator-receipt.json", validation)

    assert all(sha(path) == value for path, value in retained.items())
    assert all(sha(path) == value for path, value in source_before.items())
    for row in capture_bindings:
        assert sha(Path(row["path"])) == row["sha256"]
    write_json("preservation-receipt.json", {
        "schema": "STEMROBIN-182/binding-only-preservation@1",
        "draftChangedFields": ["seed_sha256"],
        "reviewerViewsChangedFields": [
            "seed_sha256", "draft_sha256", "seedPath",
            "sourceRepoForStructuralValidation",
        ],
        "all20QuestionObjectsByteIdentical": True,
        "all20ViewObjectsByteIdentical": True,
        "all3ReviewerQuestionObjectsByteIdentical": True,
        "all3ReviewerViewObjectsByteIdentical": True,
        "unaffectedFirstQuestionUnitsByteIdenticalCount": 17,
        "coverageBytesIdentical": True,
        "recoverySeedMatchesOriginalFirstSeed": True,
        "removedSupplementOnlyFromSeedExercises": changed_seed_numbers,
        "priorEvidenceFilesUnchanged": [
            binding(path) for path in sorted(retained)
        ],
        "durableSourceFilesUnchanged": [
            binding(path) for path in source_before
        ],
        "sourceCaptureFilesUnchanged": capture_bindings,
        "questions": preservation,
    })
    write_json("recovery-receipt.json", {
        "schema": "STEMROBIN-182/choice-recovery-binding-receipt@1",
        "status": (
            "binding-recovered-independent-affected-review-pending"
            if validation["exitCode"] == 0 else "structural-validation-failed"
        ),
        "realRepo": str(ROOT),
        "structuralExitCode": validation["exitCode"],
        "semanticApproval": False,
        "selfReviewRecorded": False,
        "seedCanonicalSha256": digest(seed),
        "draftCanonicalSha256": digest(draft),
        "all20QuestionObjectsByteIdentical": True,
        "same3RepairedReviewerViewsByteIdentical": True,
        "same17UnaffectedFirstQuestionUnitsByteIdentical": True,
        "originalSourceFilesChanged": False,
        "priorAuthorAndStagedSourceEvidenceChanged": False,
        "supplementaryContextMovedIntoOriginalSeed": False,
        "additionalImageLoads": 0,
        "totalContextImageLoads": 7,
        "pipelineOrCheckerChanged": False,
        "syntheticSourceRepoUsed": False,
        "bindings": [
            binding(OUT / name) for name in (
                "seed.json", "draft.json", "reviewer-views.json",
                "source-provenance.json", "prepare-receipt.json",
                "structural-validator-receipt.json", "preservation-receipt.json",
                "recover_binding.py",
            )
        ],
        "parentAction": (
            "Use the recovery seed/draft/views and separate source provenance for "
            "Nash's affected-only semantic review. Retain all FIRST evidence. "
            "Structural success is not content approval."
        ),
    })
    print(json.dumps({
        "structuralExitCode": validation["exitCode"],
        "receipt": str(OUT / "recovery-receipt.json"),
        "receiptSha256": sha(OUT / "recovery-receipt.json"),
        "seedCanonicalSha256": digest(seed),
        "draftCanonicalSha256": digest(draft),
        "questionUnitsByteIdentical": len(preservation),
        "reviewerViewsByteIdentical": len(new_views),
        "semanticApproval": False,
    }, indent=2))
    return validation["exitCode"]


if __name__ == "__main__":
    sys.exit(main())
