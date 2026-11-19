#!/usr/bin/env python3
"""Build an isolated source snapshot and merge three authored replacements."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys


OWN = Path(__file__).resolve().parent
ROOT = next(parent for parent in OWN.parents if (parent / "AGENTS.md").is_file())
FIRST = OWN.parent / "n40-choice-author"
SCRIPTS = ROOT / ".agents/skills/ld-s10y-choice/scripts"
STAGE = OWN / "source-repo"
AFFECTED = {
    "n40-lookup-method-comparison": "829",
    "n40-table-ready-plan": "830",
    "n40-radius-and-area": "831",
}
DECODER = json.JSONDecoder()
sys.path.insert(0, str(SCRIPTS))
from prepare import digest  # noqa: E402


def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value) -> None:
    assert path.resolve().is_relative_to(OWN)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=True, indent=2)
        stream.write("\n")


def skip(raw: str, index: int) -> int:
    while index < len(raw) and raw[index].isspace():
        index += 1
    return index


def object_fields(raw: str):
    index = skip(raw, 0)
    assert raw[index] == "{"
    index += 1
    fields = {}
    while True:
        index = skip(raw, index)
        if raw[index] == "}":
            return fields
        key, end = DECODER.raw_decode(raw, index)
        index = skip(raw, end)
        assert raw[index] == ":"
        start = skip(raw, index + 1)
        value, end = DECODER.raw_decode(raw, start)
        fields[key] = (start, end, value)
        index = skip(raw, end)
        if raw[index] == ",":
            index += 1
        else:
            assert raw[index] == "}"


def array_spans(raw: str, start: int):
    assert raw[start] == "["
    index = start + 1
    result = []
    while True:
        index = skip(raw, index)
        if raw[index] == "]":
            return result
        value, end = DECODER.raw_decode(raw, index)
        result.append((index, end, value))
        index = skip(raw, end)
        if raw[index] == ",":
            index += 1
        else:
            assert raw[index] == "]"


def replacement_bytes(raw: str, start: int, value) -> str:
    prefix = raw[raw.rfind("\n", 0, start) + 1:start]
    assert not prefix.strip()
    lines = json.dumps(value, ensure_ascii=True, indent=2).splitlines()
    return "\n".join([lines[0], *(prefix + line for line in lines[1:])])


def command(arguments: list[str]):
    result = subprocess.run(arguments, cwd=ROOT, capture_output=True, text=True)
    return {
        "command": arguments,
        "cwd": str(ROOT),
        "exitCode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }


def main() -> int:
    assert (OWN / "source-solutions-AFFECTED-1.md").is_file()
    first_seed = load(FIRST / "seed.json")
    original = (FIRST / "draft.json").read_text(encoding="utf-8")
    first_draft = json.loads(original)
    replacements = load(OWN / "replacements.json")
    context = load(OWN / "supplementary-context.json")
    assert len(first_draft["questions"]) == 20
    assert len(replacements["questions"]) == 3
    assert first_draft["new_figures"] == []
    assert first_seed["figures"] == []
    assert set(q["id"] for q in replacements["questions"]) == set(AFFECTED)
    assert set(context["contexts"]) == set(AFFECTED.values())
    for binding in context["sourceCaptureBindings"]:
        assert sha(Path(binding["path"])) == binding["sha256"]

    source_trace = []
    for entry in first_seed["trace"]:
        source = ROOT / entry["path"]
        target = STAGE / entry["path"]
        target.parent.mkdir(parents=True, exist_ok=True)
        assert not target.exists()
        if target.name != "exercises.json":
            shutil.copyfile(source, target)
        else:
            source_data = load(source)
            indexed = {item["number"]: item for item in source_data["exercises"]}
            first_indexed = {item["number"]: item for item in first_seed["exercises"]}
            for number, item in indexed.items():
                if number in first_indexed:
                    assert item["text"] == first_indexed[number]["text"]
            for number in AFFECTED.values():
                supplement = context["contexts"][number]
                item = indexed[number]
                item["text"] += (
                    "\n\nSupplementary context for this offline choice adaptation "
                    "(not original exercise prose):\n"
                    + context["rules"] + "\n\n"
                    + supplement["table"] + "\n\n"
                    + supplement["condition"]
                )
                item["offline_authored_context"] = {
                    "identity": context["sourceIdentity"],
                    "printed_pages": supplement["printedPages"],
                    "original_prose_retained_as_prefix": True,
                    "historical_equivalence_claimed": False,
                }
            write_json(target, source_data)
        source_trace.append({
            "originalPath": str(source),
            "originalSha256": sha(source),
            "stagedPath": str(target),
            "stagedSha256": sha(target),
            "changed": sha(source) != sha(target),
        })
    assert sum(entry["changed"] for entry in source_trace) == 1

    # Preparation still runs its standard whitelist against four real JSON files.
    # The local snapshot explicitly tags additions instead of inventing a figure.
    prepared_path = STAGE / ".tmp/seed.json"
    selection = first_seed["source"]
    inspect_result = command([
        sys.executable, str(SCRIPTS / "prepare.py"), "inspect",
        "--repo", str(STAGE), "--book", selection["book"],
        "--lesson", selection["lesson"],
    ])
    write_json(OWN / "staged-inspect-receipt.json", inspect_result)
    assert inspect_result["exitCode"] == 0
    arguments = [
        sys.executable, str(SCRIPTS / "prepare.py"), "prepare",
        "--repo", str(STAGE), "--book", selection["book"],
        "--lesson", selection["lesson"],
    ]
    for exercise in first_seed["exercises"]:
        arguments.extend(["--exercise", exercise["number"]])
    for concept in first_seed["concepts"]:
        arguments.extend(["--concept-block", str(concept["block"])])
    if not first_seed["concepts"]:
        arguments.append("--no-concepts")
    for figure in selection["concept_figure_ids"]:
        arguments.extend(["--concept-figure", figure])
    arguments.extend(["--out", str(prepared_path)])
    prepare_result = command(arguments)
    write_json(OWN / "prepare-affected-receipt.json", prepare_result)
    assert prepare_result["exitCode"] == 0
    assert not (OWN / "seed.json").exists()
    shutil.copyfile(prepared_path, OWN / "seed.json")
    seed = load(OWN / "seed.json")
    assert seed["concepts"] == first_seed["concepts"]
    assert seed["figures"] == []
    changed_seed_numbers = [
        old["number"]
        for old, new in zip(first_seed["exercises"], seed["exercises"], strict=True)
        if old != new
    ]
    assert set(changed_seed_numbers) == set(AFFECTED.values())

    question_replacements = {}
    for question in replacements["questions"]:
        number = AFFECTED[question["id"]]
        assert question["source_numbers"] == [number]
        supplement = context["contexts"][number]
        question["view"]["stem"] += (
            "\n\n" + context["rules"] + "\n\n" + supplement["table"]
            + "\n\n" + supplement["condition"]
        )
        question_replacements[question["id"]] = question
    coverage_replacements = {
        entry["source_number"]: entry for entry in replacements["coverage"]
    }
    assert set(coverage_replacements) == set(AFFECTED.values())

    fields = object_fields(original)
    edits = [(fields["seed_sha256"][0], fields["seed_sha256"][1],
              json.dumps(digest(seed)))]
    old_questions = array_spans(original, fields["questions"][0])
    for start, end, question in old_questions:
        if question["id"] in question_replacements:
            edits.append((start, end, replacement_bytes(
                original, start, question_replacements[question["id"]])))
    for start, end, coverage in array_spans(original, fields["coverage"][0]):
        if coverage["source_number"] in coverage_replacements:
            edits.append((start, end, replacement_bytes(
                original, start, coverage_replacements[coverage["source_number"]])))
    assert len(edits) == 7
    merged = original
    for start, end, replacement in sorted(edits, reverse=True):
        merged = merged[:start] + replacement + merged[end:]
    draft_path = OWN / "draft.json"
    with draft_path.open("x", encoding="utf-8") as stream:
        stream.write(merged)
    draft = json.loads(merged)

    new_fields = object_fields(merged)
    new_questions = array_spans(merged, new_fields["questions"][0])
    preservation = []
    for old, new in zip(old_questions, new_questions, strict=True):
        old_start, old_end, old_value = old
        new_start, new_end, new_value = new
        assert old_value["id"] == new_value["id"]
        old_bytes = original[old_start:old_end].encode("utf-8")
        new_bytes = merged[new_start:new_end].encode("utf-8")
        changed = old_value["id"] in AFFECTED
        if not changed:
            assert old_value == new_value
            assert old_bytes == new_bytes
        else:
            assert old_bytes != new_bytes
        preservation.append({
            "questionId": old_value["id"],
            "affected": changed,
            "oldRawUnitSha256": hashlib.sha256(old_bytes).hexdigest(),
            "newRawUnitSha256": hashlib.sha256(new_bytes).hexdigest(),
            "byteIdentical": old_bytes == new_bytes,
        })
    assert sum(item["byteIdentical"] for item in preservation) == 17
    assert sum(item["affected"] for item in preservation) == 3
    assert first_draft["schema"] == draft["schema"]
    assert first_draft["new_figures"] == draft["new_figures"]
    old_coverage = {
        entry["source_number"]: entry for entry in first_draft["coverage"]
    }
    for entry in draft["coverage"]:
        if entry["source_number"] not in AFFECTED.values():
            assert entry == old_coverage[entry["source_number"]]

    reviewer_view = {
        "schema": "STEMROBIN-182/affected-reviewer-views@1",
        "seed_sha256": digest(seed),
        "draft_sha256": digest(draft),
        "seedPath": str(OWN / "seed.json"),
        "sourceRepoForStructuralValidation": str(STAGE),
        "questions": [
            {"id": question["id"], "source_numbers": question["source_numbers"],
             "view": question["view"]}
            for question in draft["questions"] if question["id"] in AFFECTED
        ],
    }
    assert len(reviewer_view["questions"]) == 3
    for question in reviewer_view["questions"]:
        assert set(question) == {"id", "source_numbers", "view"}
        assert set(question["view"]) == {"mode", "stem", "figure_ids", "options"}
    write_json(OWN / "reviewer-views.json", reviewer_view)
    write_json(OWN / "preservation.json", {
        "schema": "STEMROBIN-182/raw-question-preservation@1",
        "unaffectedByteIdenticalCount": 17,
        "affectedCount": 3,
        "questions": preservation,
        "firstDraftPath": str(FIRST / "draft.json"),
        "firstDraftSha256": sha(FIRST / "draft.json"),
        "newDraftSha256": sha(draft_path),
    })
    write_json(OWN / "source-provenance.json", {
        "schema": "STEMROBIN-182/choice-source-snapshot@1",
        "kind": "offline-authored-supplement-to-original-prose",
        "originalRepo": str(ROOT),
        "stagedRepo": str(STAGE),
        "affectedSources": sorted(AFFECTED.values()),
        "sourceTrace": source_trace,
        "sourceCaptureBindings": context["sourceCaptureBindings"],
        "supplementaryContextPath": str(OWN / "supplementary-context.json"),
        "supplementaryContextSha256": sha(OWN / "supplementary-context.json"),
        "independentSolutionPath": str(OWN / "source-solutions-AFFECTED-1.md"),
        "independentSolutionSha256": sha(OWN / "source-solutions-AFFECTED-1.md"),
        "seedPreparedByStandardCli": True,
        "seedManuallyAssembled": False,
        "sourceFigureFabricated": False,
        "newFigures": [],
        "originalTextPrefixPreserved": True,
        "historicalTableEquivalenceClaimed": False,
        "mustValidateAgainstStagedRepo": True,
        "sharedSourceFilesChanged": False,
    })
    validate_result = command([
        sys.executable, str(SCRIPTS / "validate.py"),
        "--repo", str(STAGE), "--seed", str(OWN / "seed.json"),
        "--draft", str(draft_path),
    ])
    write_json(OWN / "structural-validator-affected-receipt.json", validate_result)
    assert validate_result["exitCode"] == 0
    write_json(OWN / "author-completion.json", {
        "schema": "STEMROBIN-182/affected-choice-author-handoff@1",
        "status": "awaiting-independent-affected-review",
        "structuralExitCode": validate_result["exitCode"],
        "semanticApproval": False,
        "selfReviewRecorded": False,
        "unaffectedQuestionsByteIdentical": 17,
        "affectedQuestions": list(AFFECTED),
        "additionalImageLoads": 0,
        "totalContextImageLoads": 7,
        "newFigures": [],
        "seedCanonicalSha256": digest(seed),
        "draftCanonicalSha256": digest(draft),
        "reviewerViewProjectionChecked": True,
        "bindings": [
            {"path": str(path), "sha256": sha(path)}
            for path in (
                FIRST / "seed.json", FIRST / "draft.json",
                OWN / "source-solutions-AFFECTED-1.md",
                OWN / "supplementary-context.json", OWN / "replacements.json",
                OWN / "seed.json", draft_path, OWN / "reviewer-views.json",
                OWN / "preservation.json", OWN / "source-provenance.json",
                OWN / "structural-validator-affected-receipt.json",
            )
        ],
        "parentAction": "Send only the three repaired views plus new seed/provenance to Nash for affected review. Do not treat structural success as semantic PASS.",
    })
    print(json.dumps({
        "status": "awaiting-independent-affected-review",
        "unaffectedByteIdentical": 17,
        "affectedQuestions": list(AFFECTED),
        "structuralExitCode": validate_result["exitCode"],
        "seedCanonicalSha256": digest(seed),
        "draftCanonicalSha256": digest(draft),
        "outputDirectory": str(OWN),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
