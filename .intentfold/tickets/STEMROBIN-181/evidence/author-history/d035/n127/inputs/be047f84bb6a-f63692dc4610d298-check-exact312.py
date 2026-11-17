import copy
import difflib
import hashlib
import importlib.util
import json
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
OUT = Path(__file__).resolve().parent
EXPECTED_FREEZE = "9338c6c6fb3439727e982a583d58ac0343039ee58a55479db0d1e56528418e8d"
EXPECTED_TARGETED = "cf773fff1b362fb9f23c70936dcd1726af52acc3cd01d0b97bd3c1395c013041"
EXPECTED_ORIGINAL = "109635ef6530aea222c55c2b6d120fe9cb55c84b366ed0ef452c702408f10640"
BINDINGS = []


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def bind(file, expected=None):
    file = Path(file)
    if not file.is_absolute():
        file = ROOT / file
    actual = digest(file)
    if expected is not None and actual != expected:
        raise AssertionError(f"Hash mismatch: {file}: {actual} != {expected}")
    BINDINGS.append({"path": str(file), "sha256": actual, "bytes": file.stat().st_size})
    return file


def read_json(file):
    return json.loads(file.read_text(encoding="utf-8"))


freeze_path = bind(TMP / "d035-source312-316-exact-repair/repair-freeze.json", EXPECTED_FREEZE)
targeted_path = bind(TMP / "d035-source312-314-targeted-review.json", EXPECTED_TARGETED)
original_path = bind(TMP / "d035-source312-315-source-review.json", EXPECTED_ORIGINAL)
freeze = read_json(freeze_path)
targeted = read_json(targeted_path)
original = read_json(original_path)
entries = [entry for entry in freeze["pages"] if entry["page"] == 312]
assert len(entries) == 1
entry = entries[0]
prior312 = next(page for page in original["pages"] if page["physicalPage"] == 312)
target_binding = targeted["bindings"]["pages"]["312"]
assert entry["original"]["sha256"] == prior312["candidate"]["sha256"]
assert entry["original"]["sha256"] == target_binding["candidateSha256"]
assert entry["source"]["sha256"] == prior312["source"]["sha256"]
assert entry["source"]["sha256"] == target_binding["sourceSha256"]
assert entry["expectedRows"] == prior312["sourceRows"] == 22
for review in entry["reviews"]:
    expected = {
        str(targeted_path.relative_to(ROOT)): EXPECTED_TARGETED,
        str(original_path.relative_to(ROOT)): EXPECTED_ORIGINAL,
    }
    assert review["sha256"] == expected[review["path"]]

old_path = bind(entry["original"]["path"], entry["original"]["sha256"])
new_path = bind(entry["candidate"]["path"], entry["candidate"]["sha256"])
bind(entry["source"]["path"], entry["source"]["sha256"])
bind(target_binding["sourcePath"], entry["source"]["sha256"])
parser_path = bind(
    ROOT / ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66",
)
spec = importlib.util.spec_from_file_location("exact312_existing_blocks", parser_path)
blocks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blocks)
old_text = old_path.read_text(encoding="utf-8")
new_text = new_path.read_text(encoding="utf-8")
old_meta, old_blocks = blocks.parse(old_text)
new_meta, new_blocks = blocks.parse(new_text)
old_rows = blocks.printed_lines(old_blocks)
new_rows = blocks.printed_lines(new_blocks)
assert old_rows == new_rows == 22
assert len(old_blocks) == len(new_blocks) == 10
assert new_meta["page"] == old_meta["page"] == 312
assert new_meta["printed_page"] == old_meta["printed_page"] == 303

proposals = {change["id"]: change for change in targeted["supportedChanges"]}
expected_operations = [
    {
        "type": "replace",
        "block": 0,
        "from": proposals["script-curl-rendering"]["from"],
        "to": proposals["script-curl-rendering"]["to"],
        "ref": proposals["script-curl-rendering"]["onlyAtRef"],
        "id": "script-curl-rendering",
    },
    {
        "type": "replace",
        "block": 3,
        "from": proposals["terminal-period-emphasis"]["from"],
        "to": proposals["terminal-period-emphasis"]["to"],
        "ref": proposals["terminal-period-emphasis"]["onlyAtRef"],
        "id": "terminal-period-emphasis",
    },
]
assert entry["operations"] == expected_operations
expected_blocks = copy.deepcopy(old_blocks)
changes = []
for operation in expected_operations:
    index = operation["block"]
    lines = expected_blocks[index]["lines"]
    occurrences = sum(line.count(operation["from"]) for line in lines)
    assert occurrences == 1
    changed_rows = []
    for row, line in enumerate(lines):
        if operation["from"] in line:
            after = line.replace(operation["from"], operation["to"])
            changed_rows.append({"rowOneBased": row + 1, "before": line, "after": after})
            lines[row] = after
    changes.append({**operation, "actualOccurrences": occurrences, "changedRows": changed_rows})
assert expected_blocks == new_blocks
changed_indices = [index for index, pair in enumerate(zip(old_blocks, new_blocks)) if pair[0] != pair[1]]
assert changed_indices == [0, 3]
for old_block, new_block in zip(old_blocks, new_blocks):
    assert {key: value for key, value in old_block.items() if key != "lines"} == {
        key: value for key, value in new_block.items() if key != "lines"
    }
    assert len(old_block["lines"]) == len(new_block["lines"])
assert old_blocks[6] == new_blocks[6]
assert old_blocks[6]["lines"] == ["127a. \u6da1\u65cb\u7535\u573a"]

old_body = old_text.split("---", 2)[2]
new_body = new_text.split("---", 2)[2]
expected_body = old_body
for operation in expected_operations:
    assert expected_body.count(operation["from"]) == 1
    expected_body = expected_body.replace(operation["from"], operation["to"])
assert expected_body == new_body
body_diff = "".join(
    difflib.unified_diff(
        old_body.splitlines(keepends=True),
        new_body.splitlines(keepends=True),
        fromfile=str(old_path),
        tofile=str(new_path),
    )
)
diff_path = OUT / "312-body.diff"
diff_path.write_text(body_diff, encoding="utf-8")

old_without_counting = copy.deepcopy(old_meta)
new_without_counting = copy.deepcopy(new_meta)
old_counting = old_without_counting.pop("counting", None)
new_counting = new_without_counting.pop("counting", None)
assert old_counting is None
assert old_without_counting == new_without_counting
assert new_counting == entry["counting"]
proposal = prior312["countingOnlyProposal"]
assert new_counting == {
    "edge_margin_px": proposal["edge_margin_px"],
    "reason": proposal["reason"],
}
assert new_counting["edge_margin_px"] == 120
assert proposal["visibleTextFreeCheck"] is True
assert proposal["applied"] is False
assert len(new_meta) == len(old_meta) + 1
assert set(new_meta) - set(old_meta) == {"counting"}
assert entry["bodyChanges"] == 2
assert entry["printedRowsRetained"] == 22
assert entry["sourcePixelsChanged"] is False

for binding in BINDINGS:
    assert digest(Path(binding["path"])) == binding["sha256"]
receipt = {
    "schema": "ld-s10y-lesson/exact-repair-binding-evidence@1",
    "ticket": "STEMROBIN-181",
    "physicalPageOnly": 312,
    "status": "PASS",
    "readBindings": BINDINGS,
    "freezeEntry312": entry,
    "parser": {
        "path": str(parser_path),
        "sha256": digest(parser_path),
        "functions": ["parse", "printed_lines"],
        "parseCalls": 2,
        "printedLinesCalls": 2,
        "pixelLibrariesImported": False,
        "nativeOrPixelCountInvocations": 0,
    },
    "blockProof": {
        "originalBlockCount": len(old_blocks),
        "repairedBlockCount": len(new_blocks),
        "changedZeroBasedBlockIndices": changed_indices,
        "unchangedZeroBasedBlockIndices": [1, 2, 4, 5, 6, 7, 8, 9],
        "allHeadersKindsLabelsBoxesFlagsOwnershipUnchanged": True,
        "allPerBlockLineCountsUnchanged": True,
        "originalPerBlockLineCounts": [len(block["lines"]) for block in old_blocks],
        "repairedPerBlockLineCounts": [len(block["lines"]) for block in new_blocks],
        "originalPrintedRows": old_rows,
        "repairedPrintedRows": new_rows,
        "sourceHeading127aRetainedVerbatim": True,
        "exactOriginalBodyPlusOnlyTwoReplacementsEqualsRepairedBody": True,
        "bodyDiff": {"path": str(diff_path), "sha256": digest(diff_path)},
        "changes": changes,
    },
    "frontmatterProof": {
        "onlyChangedKey": "counting",
        "allOtherFieldsDeepEqual": True,
        "oldCounting": old_counting,
        "newCounting": new_counting,
        "exactOriginalSourceSupportedMarginAndReason": True,
        "sourceAndProfileAndRenderBindingsUnchanged": True,
        "notesAndErrataUnchanged": True,
        "metadataAppliedByParentNotReviewer": True,
        "marginEffectOrNativeSuccessTested": False,
    },
    "retainedConventionProof": {
        "targetedReviewHash": EXPECTED_TARGETED,
        "originalReviewHash": EXPECTED_ORIGINAL,
        "glyphAndPunctuationVisualReviewsReplayed": False,
        "sourceCodepointsUnapproved": True,
        "sourceCodepointProofNewlyRequired": False,
        "retainedHeading127aConventionVerdict": "PASS",
        "effectiveSource312Status": "PASS",
        "effectiveScope": "Exact repaired312 transcription under retained conventional-rendering decisions and original unaffected approved facts only",
        "originalSource312RecordStatus": prior312["status"],
        "original22Slash23NativeFAILRetained": prior312["initialAuthorNative"],
        "otherPageEntriesReviewed": [],
        "originalAggregateFAILAndOtherPageHoldsUnchangedByReviewer": True,
    },
    "execution": {
        "newImageOpens": 0,
        "imageDecodes": 0,
        "sourceCandidateOrParentFreezeWrites": 0,
        "nativeOrPixelRecounts": 0,
        "nativeFinalizeOrRAWOrCardApprovals": 0,
        "countAdditions": 0,
        "dbGitPlaneIndexMeterCharterWrites": 0,
        "children": 0,
    },
    "generator": {"path": str(Path(__file__).resolve()), "sha256": digest(Path(__file__))},
}
receipt_path = OUT / "312-binding-receipt.json"
receipt_path.write_text(json.dumps(receipt, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
print(json.dumps(receipt, ensure_ascii=True, indent=2))
