"""Bind offline author drafts; import only the page-block parser, never native tools."""
from __future__ import annotations

import hashlib
import importlib.util
import json
import os
import re
import stat
from datetime import datetime, timezone
from pathlib import Path


CWD = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = CWD / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d225-10p-source80-82-author"
ROOT = CWD / ".tmp/STEMROBIN-181/d1816-d225/root"
EXPECTED_FREEZE = "c5bcd39e4d945ab290eb05aa5cef382ae598768202843fd0733e6c5d1d866a1a"
assert Path.cwd().resolve() == CWD


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def binding(path: Path) -> dict:
    path = path.resolve()
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": digest(data)}


def verify(ref: dict) -> dict:
    actual = binding(Path(ref["path"]))
    assert actual == ref, f"Frozen input changed: {ref['path']}"
    return actual


def encoded(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def write_new(path: Path, data: bytes, mode: int = 0o644) -> dict:
    path = path.resolve()
    assert path.is_relative_to(AUTHOR) or path.is_relative_to(ROOT)
    path.parent.mkdir(parents=True, exist_ok=True)
    # Existing bytes and permissions are never replaced, including after a retry.
    if path.exists():
        assert path.read_bytes() == data, f"Refusing to replace existing artifact: {path}"
    else:
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, mode)
        with os.fdopen(fd, "wb") as stream:
            stream.write(data)
    return binding(path)


def snapshot(path: Path, group: str) -> dict:
    data = path.read_bytes()
    target = AUTHOR / "pre-native" / group / f"{digest(data)}-{path.name}"
    ref = write_new(target, data, 0o444)
    assert stat.S_IMODE(target.stat().st_mode) & 0o222 == 0
    return ref


freeze_path = AUTHOR / "input-freeze.json"
freeze_ref = binding(freeze_path)
assert freeze_ref["sha256"] == EXPECTED_FREEZE
freeze = json.loads(freeze_path.read_bytes())
facts_path = AUTHOR / "author-facts.json"
facts = json.loads(facts_path.read_bytes())
assert freeze["writeScope"] == [str(AUTHOR), str(ROOT)]
assert freeze["pages"] and [item["page"] for item in freeze["pages"]] == [80, 81, 82]
assert facts["finish"] == "review"

source_refs = [
    ref for page in freeze["pages"]
    for ref in (page["original"], page["grid"], page["layout"], page["template"])
] + [
    freeze["preparation"], freeze["precedingCandidate"],
    freeze["source78FirstFailure"], freeze["toc"],
]
for ref in source_refs:
    verify(ref)

consulted_paths = [
    ".intentfold/readme.md",
    ".intentfold/charter/engineering.md",
    ".intentfold/charter/operations.md",
    ".intentfold/project.json",
    ".intentfold/tickets/STEMROBIN-181/ticket.json",
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ".agents/skills/ld-s10y-image/SKILL.md",
    ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    "/Users/yong/.agents/skills/intentfold/SKILL.md",
    ".tmp/STEMROBIN-181/d1816-d225/source-work/10p/pages/0080/prepare.0001.stdout",
    ".intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d223-source77-79-first-native/current/0078/audit.json",
    ".intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d223-source77-79-first-native/native/d223-source78-first-finalize/stdout.txt",
]
consulted = [freeze_ref, binding(AUTHOR / "dispatch-record.json")]
consulted += [binding(CWD / item) for item in consulted_paths]
consulted += source_refs
assert len({item["path"] for item in consulted}) == len(consulted)
audit78 = json.loads((CWD / consulted_paths[-2]).read_bytes())
assert (audit78["lines_printed"], audit78["lines_md"]) == (25, 24)
preparation = json.loads(Path(freeze["preparation"]["path"]).read_bytes())
assert preparation["exitCode"] == 0

parser_path = CWD / ".claude/skills/ld-s10y-lesson/tools/blocks.py"
module_spec = importlib.util.spec_from_file_location("d225_blocks", parser_path)
assert module_spec and module_spec.loader
blocks_api = importlib.util.module_from_spec(module_spec)
# Disable bytecode output so importing shared read-only code writes nowhere.
import sys
sys.dont_write_bytecode = True
module_spec.loader.exec_module(blocks_api)

current_drafts = []
snapshots = [
    snapshot(freeze_path, "inputs"),
    snapshot(facts_path, "authoring"),
    snapshot(Path(__file__), "authoring"),
]
inventory = []
parsed_by_page = {}
canonical_observations = []
for page_facts, prepared in zip(facts["pages"], freeze["pages"], strict=True):
    page = page_facts["page"]
    page_dir = ROOT / "10p/pages" / f"{page:04d}"
    md_path = page_dir / "page.md"
    md_ref = binding(md_path)
    assert md_ref["sha256"] == facts["expectedCurrentMd"][str(page)]
    meta, blocks = blocks_api.parse(md_path.read_text(encoding="utf-8"))
    template_meta, _ = blocks_api.parse(Path(prepared["template"]["path"]).read_text(encoding="utf-8"))
    assert meta["page"] == page and meta["book"] == "10p"
    assert meta["printed_page"] == prepared["printedPage"] == page_facts["printedPage"]
    for key in ("schema", "source", "render", "profile"):
        assert meta[key] == template_meta[key], (page, key)
    assert meta["errata"] == []
    assert blocks_api.printed_lines(blocks) == page_facts["actualPrintedRows"]
    assert sum(len(block["lines"]) for block in blocks if block["kind"] == "p") == page_facts["proseRows"]
    assert not any(block["kind"] in ("ex", "exhead") for block in blocks)
    titles = [line for block in blocks if block["kind"] in ("h1", "h2", "h3") for line in block["lines"]]
    assert titles == page_facts["titles"]
    figure_blocks = [(index, block) for index, block in enumerate(blocks, 1) if block["kind"] == "fig"]
    assert [blocks_api.fig_id(block["label"], page, n) for n, (_, block) in enumerate(figure_blocks, 1)] == page_facts["figureIds"]
    assert all(block["box"] and not block["lines"] for _, block in figure_blocks)
    for _, block in figure_blocks:
        x, y, width, height = block["box"]
        assert min(x, y) >= 0 and min(width, height) > 0
        assert x + width <= meta["render"]["w"] and y + height <= meta["render"]["h"]

    rows = []
    formulas = []
    for index, block in enumerate(blocks, 1):
        if block["kind"] == "fig":
            continue
        for line_number, line in enumerate(block["lines"], 1):
            assert "↵" not in line
            assert line.count("$") % 2 == 0
            segment = {"block": f"p{page:04d}#{index}", "line": line_number, "kind": block["kind"], "text": line}
            if block["samerow"] and (block["kind"] == "cap" or line_number == 1):
                assert rows
                rows[-1]["segments"].append(segment)
            else:
                rows.append({"row": len(rows) + 1, "segments": [segment]})
            for raw_formula in re.findall(r"\$[^$]+\$", line):
                formulas.append({"block": segment["block"], "line": line_number, "raw": raw_formula})
    assert len(rows) == len(page_facts["approximateRowY"]) == page_facts["actualPrintedRows"]
    for row, y in zip(rows, page_facts["approximateRowY"], strict=True):
        row["approximateSourceY"] = y

    json_path = page_dir / "page.json"
    json_ref = write_new(json_path, encoded({"meta": meta, "blocks": blocks}))
    json_roundtrip = json.loads(json_path.read_bytes())
    assert json_roundtrip == {"meta": meta, "blocks": blocks}
    parsed_by_page[page] = blocks
    md_snapshot = snapshot(md_path, f"pages/{page:04d}")
    json_snapshot = snapshot(json_path, f"pages/{page:04d}")
    snapshots += [md_snapshot, json_snapshot]
    current_drafts.append({
        "page": page,
        "md": md_ref,
        "parsedJson": json_ref,
        "preNative": {"md": md_snapshot, "parsedJson": json_snapshot},
        "parsedOnly": True,
        "nativeProcessed": False,
    })
    page_inventory = dict(page_facts)
    page_inventory.update({
        "sourceInputs": prepared,
        "rows": rows,
        "inlineFormulas": formulas,
        "parsedPrintedRows": blocks_api.printed_lines(blocks),
        "preparedUnmaskedBandCount": len(json.loads(Path(prepared["layout"]["path"]).read_bytes())["line_bands"]),
        "nativeMaskedRowCount": None,
        "nativeRowReconciliation": "UNATTEMPTED_PARENT_PENDING",
    })
    inventory.append(page_inventory)
    canonical = CWD / "ssot-resources/soviet10year-textbooks/artifacts/10p/pages" / f"{page:04d}"
    assert not canonical.exists(), f"Parent's canonical-missing premise changed: {canonical}"
    canonical_observations.append({"page": page, "path": str(canonical), "exists": False, "writeAttempted": False})

previous = json.loads(Path(freeze["precedingCandidate"]["path"]).read_bytes())
previous_prose = [block for block in previous["blocks"] if block["kind"] == "p"][-1]
assert previous_prose["open"] and previous_prose["lines"][-1].endswith("在电路中接通")
assert parsed_by_page[80][0]["cont"] and not parsed_by_page[80][0]["open"]
assert parsed_by_page[80][4]["open"] and parsed_by_page[80][7]["cont"] and parsed_by_page[80][7]["open"]
assert parsed_by_page[81][0]["cont"] and not parsed_by_page[81][0]["open"]
assert parsed_by_page[81][2]["kind"] == "h3" and parsed_by_page[81][2]["lines"] == ["29. 三极电子管"]
assert not parsed_by_page[81][5]["open"] and parsed_by_page[81][5]["lines"][-1].endswith("所示.")
assert parsed_by_page[82][3]["open"] and not parsed_by_page[82][3]["cont"] and parsed_by_page[82][5]["cont"]
assert parsed_by_page[82][11]["open"] and parsed_by_page[82][11]["lines"][-1].endswith("（电子")

for figure in facts["figures"]:
    block_index = int(figure["block"].split("#")[1]) - 1
    block = parsed_by_page[figure["page"]][block_index]
    assert block["kind"] == "fig"
    figure["coarseBoxXYWH"] = block["box"]
    figure["boxStatus"] = "COARSE_AUTHOR_OBSERVATION_ONLY"
    figure["source"] = next(item["original"] for item in freeze["pages"] if item["page"] == figure["page"])
    caption_index = int(figure["captionBlock"].split("#")[1]) - 1
    caption = parsed_by_page[figure["page"]][caption_index]
    assert caption["kind"] == "cap" and caption["label"] == block["label"]
    figure["captionSharesPhysicalRow"] = caption["samerow"]
    for citation in figure["citationBlocks"]:
        match = re.fullmatch(r"p(\d+)#(\d+)", citation)
        assert match
        cited = parsed_by_page[int(match[1])][int(match[2]) - 1]
        assert block["label"].replace(" ", "") in blocks_api.text_of(cited).replace(" ", "")

image_ledger = []
for item in facts["imageLedger"]:
    entry = dict(item)
    prepared = next(page for page in freeze["pages"] if page["page"] == item["page"])
    if "preparedKey" in item:
        entry["artifact"] = prepared[item["preparedKey"]]
    else:
        crop_path = CWD / item["path"]
        entry["path"] = str(crop_path.resolve())
        entry["artifact"] = binding(crop_path)
        entry["source"] = prepared[item["sourceKey"]]
        entry["preNativeSnapshot"] = snapshot(crop_path, "images")
        snapshots.append(entry["preNativeSnapshot"])
    image_ledger.append(entry)
assert len(image_ledger) == 6 <= freeze["maximumActualImageOpens"]
assert len(image_ledger) <= freeze["maximumContextImageOpens"]

counters = {
    "nativeSubprocesses": 0, "nativeCalls": 0, "prepare": 0, "prepareRange": 0,
    "finalize": 0, "vectorize": 0, "assemble": 0, "reindex": 0, "preview": 0,
    "adaptPrepare": 0, "adaptFinalize": 0, "render": 0,
    "sourceApproval": 0, "sourcePagesAdded": 0, "completeCoursesAdded": 0,
    "canonicalPromotions": 0, "contentRepairs": 0, "figureContentRepairs": 0,
    "paidCalls": 0, "modelApiCalls": 0, "databaseCalls": 0, "publisherCalls": 0,
    "gitCalls": 0, "globalChecks": 0, "peerMessages": 0, "childrenCreated": 0,
    "parentImageOpens": 0, "actualImageOpens": 6, "contextImageOpens": 6,
    "originalImageOpens": 3, "gridImageOpens": 2, "cropImageOpens": 1,
    "imageReopens": 0, "inProcessBlocksParses": 3,
}
common = {
    "schema": "ld-s10y-lesson/offline-author-freeze@1",
    "batch": "D225", "ticket": "STEMROBIN-181", "book": "10p",
    "role": freeze["role"], "finish": "review",
    "status": "AUTHOR_DRAFT_CLOSED_REVIEW_READY_WITH_HOLDS_NATIVE_PARENT_PENDING",
    "closureTimeUTC": datetime.now(timezone.utc).isoformat(),
    "cwd": str(CWD), "writeScope": [str(AUTHOR), str(ROOT)],
    "inputFreeze": freeze_ref,
    "sourceApproval": False, "contentApproval": False,
    "independentReviewPerformed": False, "formalHandoff": False,
    "firstNativeParentLanePending": True,
    "counters": counters,
}
checks = {
    "frozenInputShaAndAllFrozenReferencesMatch": True,
    "preparedRangeParentExitCode": 0,
    "currentMdBytesMatchAuthoredFacts": True,
    "metadataMatchesPreparedTemplatesExceptPrintedPageAndNotes": True,
    "rowInventoryAndBlocksPrintedLinesAgree": {"80": 18, "81": 25, "82": 17},
    "totalActualPrintedRows": 60,
    "taskCount": 0, "titleCount": 1, "figureCount": 6,
    "figureIds": ["fig-49", "fig-50", "fig-51", "fig-52", "fig-53", "fig-54"],
    "allFiguresHaveActualCitationAndRetainedCaption": True,
    "actualBoundaryFlagsChecked": True,
    "currentJsonIsInProcessBlocksParseOnly": True,
    "snapshotBytesEqualCurrentDraftBytes": True,
    "snapshotFilesCreatedReadOnlyWithoutChangingAnyExistingPermissions": True,
    "allNativeChecks": "UNATTEMPTED_PARENT_PENDING",
    "sourceFidelityApproval": "NOT_PERFORMED",
    "glyphHoldResolution": "NONE",
}
local_artifacts = [binding(facts_path), binding(Path(__file__))]
local_artifacts += [draft[key] for draft in current_drafts for key in ("md", "parsedJson")]
local_artifacts += [entry["artifact"] for entry in image_ledger if entry["kind"] == "crop"]
report = dict(common)
report.update({
    "schema": "ld-s10y-lesson/offline-author-report@1",
    "consultedInputs": consulted,
    "currentDrafts": current_drafts,
    "currentOperativeDraftsFrozenToCurrentBytes": True,
    "historicalPreNativeSnapshots": snapshots,
    "originalInventory": {"pages": inventory, "figures": facts["figures"], "tasks": [], "totalTaskCount": 0},
    "actualBoundaries": facts["boundaries"],
    "glyphHolds": facts["glyphHolds"],
    "imageLedger": image_ledger,
    "imageLimits": {"maximumActual": 8, "maximumContext": 24, "parent": 0},
    "localAuthorChecks": checks,
    "inheritedSource78Failure": {
        "retainedNative": freeze["source78FirstFailure"],
        "audit": binding(CWD / consulted_paths[-2]),
        "stdout": binding(CWD / consulted_paths[-1]),
        "linesPrinted": 25, "linesMd": 24,
        "status": "RETAINED_UNCHANGED_OUTSIDE_AUTHOR_SCOPE",
        "repairAttempted": False,
    },
    "incomingSource79": {"candidate": freeze["precedingCandidate"], "status": freeze["precedingStatus"], "tail": freeze["incomingTail"], "nativeAttemptedHere": False},
    "parentPreparationReceipt": freeze["preparation"],
    "canonicalMissingObservations": canonical_observations,
    "authoredArtifacts": local_artifacts,
    "notExecuted": [
        "p2c.py", "production.py", "native preparation/finalize/vectorize",
        "assembly/reindex", "preview/adapt/render", "Git or native wrapper",
        "source-pixel/prepared-input/permission/shared-code/canonical mutation",
        "content repair", "paid/model API", "DB/publisher", "charter/global checks",
        "peer messages", "children", "setup/grill/freshness repetition",
    ],
})
report_ref = write_new(AUTHOR / "report.json", encoded(report))
report_snapshot = snapshot(Path(report_ref["path"]), "reports")
author_freeze = dict(common)
author_freeze.update({
    "consultedInputs": consulted,
    "currentDrafts": current_drafts,
    "currentOperativeDraftsFrozenToCurrentBytes": True,
    "historicalPreNativeSnapshots": snapshots + [report_snapshot],
    "report": report_ref,
    "reportPreNativeSnapshot": report_snapshot,
    "authoredArtifacts": local_artifacts,
    "originalInventory": report["originalInventory"],
    "actualBoundaries": facts["boundaries"],
    "glyphHolds": facts["glyphHolds"],
    "imageLedger": image_ledger,
    "localAuthorChecks": checks,
    "historicalReferencePolicy": "Historical pre-native artifacts use only the exclusive-created, content-addressed read-only paths. Current operative MD/JSON references bind current bytes, never stand in for history.",
    "selfHashPolicy": "Self SHA and its content-addressed immutable copy are emitted as final closure output; no cyclic self-hash field.",
})
author_freeze_ref = write_new(AUTHOR / "author-freeze.json", encoded(author_freeze))
author_freeze_snapshot = snapshot(Path(author_freeze_ref["path"]), "reports")

# One final byte-binding check, not a second source/content review.
for ref in consulted + local_artifacts + snapshots + [report_ref, report_snapshot, author_freeze_ref, author_freeze_snapshot]:
    verify(ref)
print(json.dumps({
    "status": common["status"], "report": report_ref, "authorFreeze": author_freeze_ref,
    "reportImmutable": report_snapshot, "authorFreezeImmutable": author_freeze_snapshot,
    "currentDrafts": current_drafts, "rows": [18, 25, 17],
    "actualImageOpens": 6, "nativeCalls": 0, "sourceApproval": 0,
    "firstNativeParentLanePending": True,
}, ensure_ascii=False, indent=2))
