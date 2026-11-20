"""Derive draft JSON, inventories and freezes without any native entry point."""

import hashlib
import importlib.util
import json
import os
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == REPO
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author"
ROOT = REPO / ".tmp/STEMROBIN-181/d1816-d220/root"
EXPECTED_FREEZE = "057602cfd0fbfbcb916935f5da1cc549a056adcd38153fae9ad15e139da130db"
WRITABLE = (AUTHOR, ROOT)


def binding(path):
    path = Path(path).absolute()
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def check_scope(path):
    path = Path(path).absolute()
    assert any(path.is_relative_to(root) for root in WRITABLE), path
    return path


def write_new(path, data, immutable=False):
    path = check_scope(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = 0o444 if immutable else 0o644
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, mode)
    with os.fdopen(descriptor, "wb") as stream:
        stream.write(data)
    return binding(path)


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def write_json(path, value):
    return write_new(path, json_bytes(value))


input_path = AUTHOR / "input-freeze.json"
assert binding(input_path)["sha256"] == EXPECTED_FREEZE
freeze = json.loads(input_path.read_text())
records = [
    item
    for page in freeze["pages"]
    for item in (page["original"], page["grid"], page["layout"], page["template"])
] + [
    freeze["preparation"],
    freeze["precedingCandidate"],
    freeze["toc"],
    freeze["implicitGitDiagnosis"],
]
for record in records:
    assert binding(record["path"]) == record, record["path"]
before = {
    record["path"]: (
        Path(record["path"]).stat().st_mode,
        Path(record["path"]).stat().st_mtime_ns,
        Path(record["path"]).stat().st_uid,
        Path(record["path"]).stat().st_gid,
    )
    for record in records
}

parser_path = REPO / ".claude/skills/ld-s10y-lesson/tools/blocks.py"
spec = importlib.util.spec_from_file_location("d220_source_blocks", parser_path)
blocks_module = importlib.util.module_from_spec(spec)
# Direct source execution avoids importlib's incidental shared __pycache__ write.
exec(compile(parser_path.read_bytes(), str(parser_path), "exec"), blocks_module.__dict__)

visual_rows = {
    77: [
        [86, 130], [160, 204], [233, 274], [305, 346], [376, 419], [450, 505],
        [575, 615], [665, 708], [735, 777], [808, 851], [879, 922], [949, 995],
        [1027, 1069], [1095, 1143], [1168, 1212], [1241, 1288], [1313, 1352],
        [1433, 1482], [1530, 1581], [1602, 1654], [1675, 1727], [1748, 1789],
        [1821, 1871], [1911, 1935],
    ],
    78: [
        [250, 292], [322, 364], [395, 435], [466, 507], [537, 580], [608, 651],
        [707, 763], [799, 847], [871, 909], [944, 1025], [1057, 1103],
        [1130, 1182], [1201, 1245], [1280, 1369], [1402, 1453], [1473, 1514],
        [1547, 1599], [1618, 1671], [1688, 1736], [1762, 1824], [1825, 1887],
        [1906, 1961], [1977, 2033], [2057, 2081],
    ],
    79: [
        [146, 188], [221, 261], [291, 332], [365, 403], [435, 472], [515, 606],
        [644, 734], [780, 821], [866, 907], [934, 1025], [1074, 1116],
        [1153, 1199], [1226, 1276], [1298, 1351], [1372, 1423], [1444, 1484],
        [1518, 1568], [1587, 1640], [1660, 1713], [1731, 1783],
        [1808, 1859], [1877, 1931], [1970, 1995],
    ],
}
expected_text_rows = {77: 25, 78: 24, 79: 23}
snapshots = []
operative = []
page_results = []
parsed = {}
for page in freeze["pages"]:
    number = page["page"]
    page_name = f"{number:04d}"
    directory = ROOT / "10p/pages" / page_name
    md_path = directory / "page.md"
    md = md_path.read_bytes()
    meta, page_blocks = blocks_module.parse(md.decode("utf-8"))
    assert meta["page"] == number and meta["printed_page"] == page["printedPage"]
    assert meta["render"]["sha256"] == page["original"]["sha256"]
    assert meta["source"]["pdf_page"] == number
    template_meta, _ = blocks_module.parse(Path(page["template"]["path"]).read_text())
    for key in ("schema", "book", "source", "render", "profile"):
        assert meta[key] == template_meta[key], (number, key)
    parsed[number] = (meta, page_blocks)
    figure_sequence = 0
    inventory_blocks = []
    source_rows = []
    current_visual_row = 0
    display_formulas = []
    for index, block in enumerate(page_blocks, 1):
        block_ref = f"p{page_name}#{index}"
        if block["kind"] == "fig":
            figure_sequence += 1
            block["id"] = blocks_module.fig_id(block["label"], number, figure_sequence)
        rows = []
        for line_index, text in enumerate(block["lines"], 1):
            assert blocks_module.WRAP not in text
            if not block["samerow"]:
                current_visual_row += 1
            assert current_visual_row <= len(visual_rows[number])
            row = {
                "block": block_ref,
                "line": line_index,
                "text": text,
                "visualRow": current_visual_row,
                "coarseYBandPx": visual_rows[number][current_visual_row - 1],
                "samerow": block["samerow"],
            }
            rows.append(row)
            source_rows.append(row)
            if text.startswith("$") and (
                text.endswith("$") or "（2." in text
            ):
                display_formulas.append({
                    "block": block_ref, "line": line_index, "sourceText": text
                })
        inventory_blocks.append({
            "sourceRef": block_ref,
            "kind": block["kind"],
            "label": block["label"],
            "figureId": block.get("id"),
            "box": block["box"],
            "ownerExercise": block["owner_exercise"],
            "cont": block["cont"],
            "open": block["open"],
            "samerow": block["samerow"],
            "rowCount": len(rows),
            "rows": rows,
        })
    assert len(source_rows) == expected_text_rows[number]
    assert current_visual_row == len(visual_rows[number])
    assert blocks_module.printed_lines(page_blocks) == current_visual_row
    md_binding = binding(md_path)
    draft_json = {
        "meta": meta,
        "blocks": page_blocks,
        "author_view": {
            "schema": "d220/parsed-author-view@1",
            "derivedFromCurrentMd": md_binding,
            "parser": binding(parser_path),
            "nativeStages": "UNATTEMPTED",
            "normalized": False,
            "notCanonical": True,
            "sourceApproval": False,
        },
    }
    json_binding = write_json(directory / "page.json", draft_json)
    operative.extend([md_binding, json_binding])
    for filename in ("page.md", "page.json"):
        snapshot_path = AUTHOR / "pre-native-snapshots/10p/pages" / page_name / filename
        snapshot = write_new(snapshot_path, (directory / filename).read_bytes(), immutable=True)
        assert snapshot["sha256"] == binding(directory / filename)["sha256"]
        snapshots.append(snapshot)
    page_results.append({
        "physicalPage": number,
        "printedPage": page["printedPage"],
        "currentMd": md_binding,
        "currentParsedJson": json_binding,
        "sourceOriginal": page["original"],
        "sourceTextRows": len(source_rows),
        "uniqueVisualRows": current_visual_row,
        "parserPrintedLines": blocks_module.printed_lines(page_blocks),
        "authorObservedCoarseRowsOnly": True,
        "nativePixelLineReconciliation": "UNATTEMPTED_PARENT_PENDING",
        "blocks": inventory_blocks,
        "displayedFormulas": display_formulas,
        "headingRows": [row for block in inventory_blocks if block["kind"] in ("h1", "h2", "h3") for row in block["rows"]],
        "exerciseGroupRows": [row for block in inventory_blocks if block["kind"] == "exhead" for row in block["rows"]],
        "captionRows": [row for block in inventory_blocks if block["kind"] == "cap" for row in block["rows"]],
        "footerRows": [row for block in inventory_blocks if block["kind"] == "foot" for row in block["rows"]],
        "notes": meta["notes"],
    })

tasks = []
task_start = None
for index, block in enumerate(parsed[77][1], 1):
    if block["kind"] != "ex":
        continue
    if not block["cont"]:
        task_start = {
            "printedNumber": int(block["label"]),
            "unitCandidate": "phy10-c1-s3-n27",
            "group": "问题",
            "sourceRefs": [],
            "rows": [],
            "sourceApproval": False,
        }
        tasks.append(task_start)
    else:
        assert task_start and task_start["printedNumber"] == int(block["label"])
    task_start["sourceRefs"].append(f"p0077#{index}")
    task_start["rows"].extend(block["lines"])
assert [task["printedNumber"] for task in tasks] == [1, 2, 3, 4]
assert sum(len(task["rows"]) for task in tasks) == 10
prior = json.loads(Path(freeze["precedingCandidate"]["path"]).read_text())
assert prior["blocks"][-2]["open"]
assert prior["blocks"][-2]["lines"][-1].endswith("为了提高线路中")
assert parsed[77][1][0]["cont"]
assert parsed[78][1][0]["cont"]
assert parsed[79][1][0]["cont"]
assert parsed[77][1][-2]["open"]
assert parsed[78][1][-2]["open"]
assert parsed[79][1][-2]["open"]
boundaries = {
    "incoming76": {
        "source": freeze["precedingCandidate"],
        "status": freeze["precedingStatus"],
        "unit": "phy10-c1-s3-n27",
        "previousLastRow": prior["blocks"][-2]["lines"][-1],
        "previousTail": "为了提高线路中",
        "currentRef": "p0077#1",
        "currentFirstRow": parsed[77][1][0]["lines"][0],
        "directJoin": "为了提高线路中的$\\cos\\varphi$",
        "previousSourceReviewed": False,
        "previousPixelsReopened": False,
    },
    "n27ToN28": {
        "n27LastProseRef": "p0077#1",
        "n27LastProseRow": parsed[77][1][0]["lines"][-1],
        "n27Tasks": [1, 2, 3, 4],
        "n27LastTaskRef": "p0077#9",
        "n27LastTaskRow": parsed[77][1][8]["lines"][-1],
        "n28HeadingRef": "p0077#10",
        "heading": "28. 电谐振",
        "headingYBandPx": [1433, 1482],
        "n27HasObservedLocalEnd": True,
        "n27CompleteOrApproved": False,
        "n28SourceApproved": False,
    },
    "p77ToP78": {
        "unit": "phy10-c1-s3-n28",
        "leftRef": "p0077#12",
        "leftRow": parsed[77][1][-2]["lines"][-1],
        "rightRef": "p0078#1",
        "rightRow": parsed[78][1][0]["lines"][0],
        "directJoin": "可以立即作出以下的结论",
        "flags": ["open", "cont"],
    },
    "p78ToP79": {
        "unit": "phy10-c1-s3-n28",
        "leftRef": "p0078#11",
        "leftRow": parsed[78][1][-2]["lines"][-1],
        "rightRef": "p0079#1",
        "rightRow": parsed[79][1][0]["lines"][0],
        "directJoin": "电流强度的振幅和频率间的对应关系如图 48 所示",
        "flags": ["open", "cont"],
    },
    "terminal79": {
        "unit": "phy10-c1-s3-n28",
        "lastProseRef": "p0079#12",
        "lastRow": parsed[79][1][-2]["lines"][-1],
        "tail": "在电路中接通",
        "rightOpen": True,
        "physical80Opened": False,
        "physical80Authored": False,
        "completionClaim": False,
        "approvalClaim": False,
    },
}

figure_inventory = [{
    "id": "fig-48",
    "label": "图 48",
    "physicalPage": 77,
    "sourceRef": "p0077#2",
    "source": freeze["pages"][0]["original"],
    "coarseBoxXYWH": [812, 525, 525, 565],
    "boxStatus": "AUTHOR_COARSE_UNSNAPPED",
    "captionRef": "p0077#7",
    "caption": "图 48",
    "captionSamerowWith": {"block": "p0077#6", "line": 2},
    "captionOutsideCoarseBox": True,
    "candidateSemanticOwner": "phy10-c1-s3-n28",
    "actualTextCitation": {"block": "p0079#1", "line": 1, "text": parsed[79][1][0]["lines"][0]},
    "physicalPlacementBeforeHeading": "p0077#10",
    "exerciseOwner": None,
    "objects": [
        {"id": "fig48-axes", "description": "Two solid crossing axes with visible extensions left of and below the intersection; no numeric tick scale."},
        {"id": "fig48-origin", "description": "O-like italic glyph just below-left of the intersection, about source (848,1053). Uppercase O is provisional, not digit zero."},
        {"id": "fig48-vertical-label", "description": "I with a small м/M-like amplitude subscript near the upper axis, about source (854,565); alphabet/case HOLD."},
        {"id": "fig48-horizontal-label", "description": "omega at the right end of the horizontal axis, about source (1304,1054)."},
        {"id": "fig48-center-label", "description": "omega with 0/o/O-like subscript below the dashed center trace, about source (1101,1053); subscript HOLD."},
        {"id": "fig48-center-trace", "description": "One dashed, slightly slanted near-vertical trace rising from the horizontal axis toward the tallest peak. Do not straighten or infer exact peak coincidence."},
        {"id": "fig48-curve-r1", "description": "Tall narrow solid hump, the highest of three, with leader and printed R1 at its right descending side. Visible peak about (1109,550)."},
        {"id": "fig48-curve-r2", "description": "Medium-height broader solid hump, leader and R2 at right descending side. Visible peak about (1103,803)."},
        {"id": "fig48-curve-r3", "description": "Low broad solid hump, leader and R3 at right descending side. Visible peak about (1107,945)."},
        {"id": "fig48-left-tails", "description": "Three solid curves rise from the left near-axis region; no invented negative-frequency continuation."},
        {"id": "fig48-right-tails", "description": "All three descending solid tails remain visible at the right; do not crop tails or replace with asymptote extensions."},
        {"id": "fig48-axis-end-marks", "description": "Dark wedge-like end marks visible near the upper vertical shaft and right horizontal end. Exact arrowhead extent/orientation remains HOLD; do not add or regularize."},
        {"id": "fig48-leader-tips", "description": "Three oblique curve-to-label leader strokes with source-dark joins/tips; do not assume all are directed arrows."},
    ],
    "counts": {"subfigures": 1, "solidCurves": 3, "dashedCenterTraces": 1, "axes": 2, "curveLabels": 3, "leaderStrokes": 3, "captionRows": 1, "numericTicks": 0},
    "notSourceFacts": ["symmetry", "calibrated coordinates", "extra ticks", "a grid", "negative-frequency extension", "exact analytical curves", "regularized arrows"],
    "nativeCrop": "UNATTEMPTED",
    "nativeVector": "UNATTEMPTED",
    "independentSourceFigureReview": "PENDING",
    "contentRepairsInherited": 0,
    "contentRepairsThisAuthor": 0,
    "contentRepairsTotal": 0,
    "maximumRepairs": 1,
    "sourceApproval": False,
}]

crop_paths = {
    "threshold": AUTHOR / "inspection-crops/p77-threshold.png",
    "graph": AUTHOR / "inspection-crops/p77-graph.png",
    "formulas": AUTHOR / "inspection-crops/p79-formulas.png",
}
ledger_entries = [
    (freeze["pages"][0]["original"]["path"], "original", 77, None),
    (freeze["pages"][0]["grid"]["path"], "grid", 77, None),
    (freeze["pages"][1]["original"]["path"], "original", 78, None),
    (freeze["pages"][2]["original"]["path"], "original", 79, None),
    (crop_paths["threshold"], "source-only-inspection-crop", 77, [530, 430, 790, 510]),
    (crop_paths["graph"], "source-only-inspection-crop", 77, [812, 525, 1337, 1090]),
    (crop_paths["formulas"], "source-only-inspection-crop", 79, [190, 505, 1150, 1125]),
]
image_ledger = {
    "schema": "d220/actual-image-ledger@1",
    "actualImageOpens": 7,
    "contextImageOpens": 7,
    "maximumBatchImageOpens": 8,
    "maximumContextImageOpens": 24,
    "parentImageOpens": 0,
    "childImageOpens": 0,
    "otherBatches": 0,
    "imagesReadOneAtATime": True,
    "ledgerBasis": "Actual functions.view_image calls in this author invocation, not inferred from files present.",
    "entries": [
        {
            "open": index,
            "tool": "functions.view_image",
            "image": binding(path),
            "kind": kind,
            "physicalPage": number,
            "sourceOriginal": next(page["original"] for page in freeze["pages"] if page["page"] == number),
            "cropBoxLTRB": box,
            "sourcePixelsModified": False,
            "nativeStage": False,
        }
        for index, (path, kind, number, box) in enumerate(ledger_entries, 1)
    ],
    "notOpened": [freeze["pages"][1]["grid"], freeze["pages"][2]["grid"]],
    "opensAfterThisLedger": 0,
}
ledger_binding = write_json(AUTHOR / "image-ledger.json", image_ledger)
inventory_binding = write_json(AUTHOR / "inventory.json", {
    "schema": "d220/source-author-inventory@1",
    "book": "10p",
    "pages": page_results,
    "tasks": tasks,
    "figures": figure_inventory,
    "boundaries": boundaries,
    "nativeLineAudit": "UNATTEMPTED",
    "independentSourceReview": "PENDING",
    "sourceApproval": False,
})
historical_binding = write_json(AUTHOR / "pre-native-freeze.json", {
    "schema": "d220/pre-native-snapshot-freeze@1",
    "purpose": "Immutable historical author snapshots only, never operative file paths.",
    "snapshots": snapshots,
    "snapshotsImmutableByInitialCreationMode": "0444",
    "operativePathsIncluded": False,
    "nativeStagesBeforeSnapshots": 0,
    "sourceApproval": False,
})

holds = [
    {"id": "independent-source-review", "reason": "All physical77-79 pages are FIRST author drafts; no independent page/figure/lesson review or approval."},
    {"id": "incoming76-author-only", "reason": freeze["precedingStatus"], "input": freeze["precedingCandidate"]},
    {"id": "p77-threshold-glyph", "sourceRef": "p0077#1", "line": 6, "provisional": "\\leq", "alternatives": ["<", "broken <= underbar versus detached scan speck"], "reason": "Crop preserves a clear < silhouette and a tiny detached lower mark. Current math remains provisional; no physics inference or source repair.", "evidence": binding(crop_paths["threshold"])},
    {"id": "fig48-amplitude-alphabet", "sourceRef": "p0077#2", "provisional": "I with м/M-like subscript", "alternatives": ["Latin m", "Latin M", "Cyrillic м", "Cyrillic М"], "reason": "Identical or near-identical small glyphs do not certify script/case.", "evidence": binding(crop_paths["graph"])},
    {"id": "amplitude-alphabet-p78-p79", "sourceRefs": ["p0078#6", "p0079#4", "p0079#6", "p0079#8"], "provisional": "Cyrillic м U+043C", "alternatives": ["Latin m/M", "Cyrillic м/М"], "reason": "No amplitude subscript normalization or silent CJK-to-Latin change.", "evidence": binding(crop_paths["formulas"])},
    {"id": "capacitance-alphabet-p79", "sourceRefs": ["p0079#4", "p0079#7", "p0079#8", "p0079#10"], "provisional": "Latin C U+0043", "alternatives": ["Cyrillic С", "small-font case ambiguity"], "reason": "Retain visible C-shaped glyphs without certifying alphabet from science.", "evidence": binding(crop_paths["formulas"])},
    {"id": "fig48-origin-glyph", "sourceRef": "p0077#2", "provisional": "italic uppercase O", "alternatives": ["digit 0", "lowercase o"], "reason": "Source origin mark is not a source-derived numeric tick.", "evidence": binding(crop_paths["graph"])},
    {"id": "omega-subscript-origin", "sourceRefs": ["p0077#2", "p0079#4"], "provisional": "digit 0 in omega_0", "alternatives": ["o", "O"], "reason": "The zero-like subscript cannot be settled from resonance notation.", "evidence": [binding(crop_paths["graph"]), binding(crop_paths["formulas"])]},
    {"id": "fig48-axis-and-leader-arrows", "sourceRef": "p0077#2", "reason": "Keep source wedge/end/join marks. Precise arrowhead topology, direction and leader tips remain independently unreviewed; no invented arrows.", "evidence": binding(crop_paths["graph"])},
    {"id": "n28-terminal-right-open", "sourceRef": "p0079#12", "reason": "N28 stops at 在电路中接通. Physical80 uninspected; no completion or approval claim."},
    {"id": "first-native-parent-pending", "reason": "No native entry point or subprocess was invoked. Parent owns genuinely first native stages after this author result, subject to source/HOLD handling."},
]
native = {
    name: {"attempts": 0, "status": "UNATTEMPTED_PARENT_PENDING"}
    for name in ("prepare", "finalize", "vectorize", "preview", "assemble", "adapt", "render")
}
native["alreadySuppliedPreparation"] = {
    "receipt": freeze["preparation"],
    "executedByThisAuthor": False,
    "replayed": False,
    "parentReceiptExitCode": 0,
}
local_consulted = [
    (REPO / ".intentfold/readme.md", "session router"),
    (REPO / ".intentfold/charter/engineering.md", "binding engineering boundaries"),
    (Path("/Users/yong/.agents/skills/intentfold/SKILL.md"), "workflow skill read; same invocation gates not repeated"),
    (REPO / ".claude/skills/ld-s10y-lesson/SKILL.md", "faithful source block contract"),
    (REPO / ".claude/skills/ld-s10y-lesson/references/production-resume.md", "recovery and immutable evidence contract"),
    (REPO / ".agents/skills/ld-s10y-image/SKILL.md", "image batch contract"),
    (parser_path, "pure blocks.py parser in-process; no entry point or shared pycache write"),
    (input_path, "explicit input authorization freeze"),
    (AUTHOR / "dispatch-record.json", "existing dispatch record"),
]
consulted = [
    {**binding(path), "access": purpose}
    for path, purpose in local_consulted
]
for record in records:
    access = "bytes hashed and compared with supplied immutable freeze"
    if record in [page["original"] for page in freeze["pages"]]:
        access += "; original pixels viewed individually"
    elif record == freeze["pages"][0]["grid"]:
        access += "; grid pixels viewed for figure box and row geometry"
    elif record in [freeze["pages"][1]["grid"], freeze["pages"][2]["grid"]]:
        access += "; grid image not opened"
    else:
        access += "; JSON/template content consulted"
    consulted.append({**binding(record["path"]), "access": access})
consulted.extend({
    **binding(path), "access": "source-only inspection pixels consulted; generated inside owned scope"
} for path in crop_paths.values())
script_bindings = [binding(AUTHOR / "source-crops.py"), binding(Path(__file__))]
for script in script_bindings:
    consulted.append({**script, "access": "owned author-only evidence generator source"})
for record in records:
    assert binding(record["path"]) == record
    stat = Path(record["path"]).stat()
    assert (stat.st_mode, stat.st_mtime_ns, stat.st_uid, stat.st_gid) == before[record["path"]]
input_checks = [
    {
        **record,
        "hashAndBytesMatchProvidedFreeze": True,
        "mode": oct(Path(record["path"]).stat().st_mode & 0o777),
        "originalInputPermissionsChanged": False,
        "unchangedDuringEvidenceGeneration": True,
    }
    for record in records
]
outputs_before_report = operative + snapshots + [
    binding(path) for path in crop_paths.values()
] + script_bindings + [ledger_binding, inventory_binding, historical_binding]
counters = {
    "fullTextPageDrafts": 3,
    "sourceTextRowsIncludingSharedCaption": 72,
    "uniqueVisualRows": 71,
    "actualHeadings": 1,
    "actualExerciseGroups": 1,
    "actualTaskNumbers": 4,
    "actualExerciseTextRows": 10,
    "actualFigures": 1,
    "actualCaptionRows": 1,
    "actualDisplayedFormulaRows": 7,
    "actualSquareMarkers": 0,
    "actualImageOpens": 7,
    "contextImageOpens": 7,
    "parentImageOpens": 0,
    "childImageOpens": 0,
    "sourceOnlyInspectionCrops": 3,
    "nativeStagesAttempted": 0,
    "nativeSubprocessCalls": 0,
    "preparationReplays": 0,
    "nativeStageReplays": 0,
    "sourceContentRepairs": 0,
    "figureContentRepairsIncludingInherited": 0,
    "physicsBasedGlyphNormalizations": 0,
    "sourceApprovals": 0,
    "figureApprovals": 0,
    "courseApprovals": 0,
    "canonicalPromotions": 0,
    "canonicalConsumedPageCount": 0,
    "sourcePagesAdded": 0,
    "completeCoursesAdded": 0,
    "childrenStarted": 0,
    "messagesSent": 0,
    "databaseCalls": 0,
    "publisherCalls": 0,
    "paidCalls": 0,
    "modelApiCalls": 0,
    "globalChecks": 0,
    "gitCalls": 0,
    "gitMutations": 0,
    "sharedCodeWrites": 0,
    "charterWrites": 0,
}
report = {
    "schema": "d220/author-report@1",
    "batch": "D220",
    "ticket": "STEMROBIN-181",
    "book": "10p",
    "finish": "review",
    "role": freeze["role"],
    "status": "AUTHOR_DRAFTS_RETAINED_HOLD_INDEPENDENT_SOURCE_REVIEW_NATIVE_PARENT_PENDING_N28_RIGHT_OPEN",
    "cwd": str(REPO),
    "physicalPages": [77, 78, 79],
    "printedPages": [67, 68, 69],
    "inputFreeze": binding(input_path),
    "allActuallyConsultedInputs": consulted,
    "inputChecks": input_checks,
    "operativeDraftsBoundToCurrentBytes": operative,
    "historicalDrafts": {
        "freeze": historical_binding,
        "snapshotBindings": snapshots,
        "bindOnlyImmutableSnapshotPaths": True,
        "operativePathsUsedForHistoricalHashes": False,
        "nativeStagesBeforeFreeze": 0,
    },
    "outputBindingsExcludingReportAndAuthorFreezeSelfCycle": outputs_before_report,
    "inventory": inventory_binding,
    "pageSummaries": [{
        "physicalPage": page["physicalPage"],
        "printedPage": page["printedPage"],
        "currentMd": page["currentMd"],
        "currentParsedJson": page["currentParsedJson"],
        "sourceTextRows": page["sourceTextRows"],
        "uniqueVisualRows": page["uniqueVisualRows"],
        "displayedFormulaRows": len(page["displayedFormulas"]),
        "nativeStages": "UNATTEMPTED",
        "sourceApproval": False,
    } for page in page_results],
    "tasks": tasks,
    "figures": figure_inventory,
    "boundaries": boundaries,
    "ambiguityAndProcessHolds": holds,
    "imageLedger": ledger_binding,
    "actualCounters": counters,
    "nativeStages": native,
    "parentPending": [
        "Independent original source/page/figure review of current bound drafts and all ambiguity HOLDs.",
        "Genuinely first native finalize/vectorize and pixel line reconciliation, only in parent lane.",
        "Inspect physical80 or later source as needed to close N28; do not infer its missing continuation.",
        "All downstream assembly/adaptation/render/approval/promotion remain outside this author scope.",
    ],
    "preservation": {
        "providedFrozenInputsUnchanged": True,
        "originalInputFilesOrPermissionsChanged": False,
        "newSnapshotsInitiallyCreatedImmutable": True,
        "otherWorkersChangesReverted": False,
        "writesLimitedToOwnedPaths": True,
        "sharedProfileOrToolsChanged": False,
        "noHiddenGitWrapperOrNativeSubprocess": True,
        "setupGrillFreshnessRepeated": False,
        "sourceApproval": False,
        "lessonApproval": False,
        "rightOpenCompletionClaim": False,
        "formalHandoff": False,
    },
    "hashClosure": {
        "authorFreezePath": str(AUTHOR / "author-freeze.json"),
        "authorFreezeBindsCurrentReport": True,
        "reasonForExcludingSelfHashes": "Self-referential SHA256 is not a valid file binding; final textual result supplies report and freeze hashes.",
    },
}
report_binding = write_json(AUTHOR / "report.json", report)
author_freeze = {
    "schema": "d220/author-freeze@1",
    "batch": "D220",
    "ticket": "STEMROBIN-181",
    "book": "10p",
    "status": report["status"],
    "cwd": str(REPO),
    "inputFreeze": binding(input_path),
    "consultedInputs": consulted,
    "operativeDrafts": operative,
    "historicalDraftsImmutableSnapshotsOnly": snapshots,
    "historicalFreeze": historical_binding,
    "actualOutputBindings": outputs_before_report + [report_binding],
    "report": report_binding,
    "inventory": inventory_binding,
    "imageLedger": ledger_binding,
    "inputChecks": input_checks,
    "actualCounters": counters,
    "nativeStages": native,
    "boundaries": boundaries,
    "ambiguityHolds": holds,
    "parentPending": report["parentPending"],
    "sourceApproval": False,
    "figureApproval": False,
    "lessonApproval": False,
    "rightOpenCompletionClaim": False,
    "formalHandoff": False,
    "selfHashProvidedInFinalTextNotEmbedded": True,
}
author_freeze_binding = write_json(AUTHOR / "author-freeze.json", author_freeze)
for record in author_freeze["actualOutputBindings"]:
    assert binding(record["path"]) == record
for record in snapshots:
    assert Path(record["path"]).stat().st_mode & 0o222 == 0
for record in records:
    assert binding(record["path"]) == record
print(json.dumps({
    "report": report_binding,
    "authorFreeze": author_freeze_binding,
    "inventory": inventory_binding,
    "imageLedger": ledger_binding,
    "counts": counters,
    "terminal": boundaries["terminal79"],
    "sourceApproval": False,
}, ensure_ascii=False, indent=2))
