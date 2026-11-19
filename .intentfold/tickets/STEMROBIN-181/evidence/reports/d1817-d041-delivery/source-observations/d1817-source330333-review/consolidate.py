"""Normalize only this bounded batch's immutable textual observations."""

import copy
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORKTREE = ROOT.parents[4]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_json(path):
    return json.loads(path.read_text())


def write_new(name, data):
    target = ROOT / name
    assert not target.exists(), f"Never overwrite frozen evidence: {target}"
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    return {"path": str(target), "sha256": digest(target)}


def span(block, line_number, text):
    line = block["lines"][line_number - 1]
    assert line.count(text) == 1, (block["id"], line_number, text)
    start_zero = line.index(text)
    block_offset = sum(len(value) + 1 for value in block["lines"][:line_number - 1])
    return {
        "block": block["id"],
        "line": line_number,
        "start": start_zero + 1,
        "end": start_zero + len(text),
        "text": text,
        "column_basis": "Unicode scalar, 1-based inclusive, over stored source line",
        "source_text_scalar_start_0based": block_offset + start_zero,
        "source_text_scalar_end_0based_exclusive": block_offset + start_zero + len(text),
    }


styles = {
    "p0330#2": [(1, "126.　原子核与基本粒子")],
    "p0330#4": [(1, "核物理学"), (1, "基本粒子物理学。")],
    "p0330#6": [(1, "127.　基本粒子的观察和记录方法")],
    "p0331#5": [(1, "盖革气体放电计数器")],
    "p0332#6": [(1, "威尔逊云室")],
    "p0333#1": [(6, "径")],
    "p0333#6": [(1, "迹")],
    "p0333#9": [(1, "气泡云室")],
}

pages = []
initial_snapshots = []
correction_snapshots = []
evidence = []
holds = []
image_ledger = []
block_lookup = {}

for number in range(330, 334):
    initial_path = ROOT / f"initial-{number:04d}.json"
    correction_path = ROOT / f"corrections-{number:04d}.json"
    crop_meta_path = ROOT / f"evidence0444-p{number:04d}-crop.json"
    initial = read_json(initial_path)
    correction = read_json(correction_path)
    crop = read_json(crop_meta_path)
    source_path = Path(initial["evidence"]["path"])
    crop_path = Path(crop["crop_path"])
    assert digest(source_path) == initial["evidence"]["sha256"]
    assert digest(initial_path) == crop["initial_snapshot_sha256"]
    assert digest(crop_path) == crop["crop_sha256"]
    initial_ref = {"path": str(initial_path), "sha256": digest(initial_path), "immutable": True}
    correction_ref = {"path": str(correction_path), "sha256": digest(correction_path), "immutable": True}
    initial_snapshots.append(initial_ref)
    correction_snapshots.append(correction_ref)
    evidence.append({
        "page": number,
        "original": initial["evidence"],
        "crop": crop,
        "crop_metadata": {"path": str(crop_meta_path), "sha256": digest(crop_meta_path)},
    })
    for kind, path, hash_value, sequence in [
        ("original", source_path, digest(source_path), initial["evidence"]["image_open_sequence"]),
        ("essential_full_native_width_crop", crop_path, digest(crop_path), correction["evidence_open_sequence"]),
    ]:
        image_ledger.append({
            "sequence": sequence,
            "kind": kind,
            "physical_page": number,
            "path": str(path),
            "sha256": hash_value,
            "opens": 1,
            "initial_frozen_before_crop": True if kind != "original" else None,
            "purpose": crop["reason"] if kind != "original" else "Fresh SOURCE page observation",
        })
    blocks = []
    for raw in initial["blocks"]:
        block = {
            "id": raw["id"],
            "kind": raw["type"],
            "lines": copy.deepcopy(raw.get("lines", [])),
            "line_count": len(raw.get("lines", [])),
            "flags": {flag: bool(raw.get(flag, False)) for flag in ("cont", "open", "samerow")},
            "heavy_spans_certain": [],
            "under_dot_spans_certain": [],
        }
        for key in ("figure_id", "same_row_with", "approx_native_box_xywh"):
            if key in raw:
                block[key] = copy.deepcopy(raw[key])
        block["source_text"] = "\n".join(block["lines"])
        block["source_text_sha256"] = hashlib.sha256(block["source_text"].encode()).hexdigest()
        block["source_text_contains_hold_placeholder"] = "⟦HOLD:" in block["source_text"]
        block["heavy_spans_certain"] = [span(block, line, text) for line, text in styles.get(block["id"], [])]
        block["under_dot_observation"] = "No under-dot runs observed in this block."
        blocks.append(block)
        block_lookup[block["id"]] = block
    figure_inventory = copy.deepcopy(initial.get("figures", []))
    figures = []
    for raw in figure_inventory:
        owner_block = next(block for block in blocks if block.get("figure_id") == raw["id"] and block["kind"] == "fig")
        figure = {
            "block": owner_block["id"],
            "id": raw["id"],
            "approx_native_box_xywh": raw["approx_native_box_xywh"],
            "box_excludes_captions": True,
            "coordinate_basis": "integer approximate native pixels, 1536 x 2337 original",
            "source_refs": raw["source_refs"],
            "unique_owner": raw["unique_owner"],
            "inventory": {"subfigures": raw["subfigures"]},
            "observation_evidence": [initial_ref, correction_ref],
        }
        for update in correction.get("corrections", []):
            if update.get("block") == owner_block["id"] and "subfigures" in update:
                figure["approx_native_box_xywh"] = update["approx_native_box_xywh"]
                figure["inventory"] = {"subfigures": update["subfigures"]}
                owner_block["approx_native_box_xywh"] = update["approx_native_box_xywh"]
        figures.append(figure)
    row_groups = []
    row_for_member = {}
    for block in blocks:
        for line_number, text in enumerate(block["lines"], 1):
            member = {"block": block["id"], "line": line_number, "text": text}
            partner = block.get("same_row_with") if block["flags"]["samerow"] and line_number == 1 else None
            if partner:
                row = row_for_member[(partner["block"], partner["line"])]
                row["members"].append(member)
                row["shared_row_reason"] = next(
                    item["reason"] for item in initial["row_observation"]["shared_rows"]
                    if item["block"] == block["id"]
                )
            else:
                row = {"row": len(row_groups) + 1, "members": [member]}
                row_groups.append(row)
            row_for_member[(block["id"], line_number)] = row
    observed_count = initial["row_observation"]["text_rows_excluding_figure_internal_labels"]
    assert len(row_groups) == observed_count
    accounting = {
        "unique_physical_lines": observed_count,
        "scope": "All h1/h2/h3/p/cap/exhead/ex/foot rows; graphic-internal text retained separately in figure_inventory_text_rows, not counted as body blocks.",
        "block_line_sum": sum(block["line_count"] for block in blocks),
        "shared_row_deductions": sum(len(row["members"]) - 1 for row in row_groups),
        "physical_rows": row_groups,
        "shared_rows": copy.deepcopy(initial["row_observation"]["shared_rows"]),
        "graphic_objects": len(figures),
        "graphic_regions_are_not_text_rows": True,
        "no_text_rows_skipped": True,
        "figure_inventory_text_rows": [],
    }
    if number == 331:
        accounting["figure_inventory_text_rows"] = [
            {"figure": "图 258", "labels": ["阴极", "阳极"], "approx_native_y_band": [1398, 1437], "shared_label_row": True, "distinct_from_body_rows": True},
            {"figure": "图 258", "labels": ["R"], "approx_native_y_band": [1547, 1578], "distinct_from_body_rows": True},
            {"figure": "图 258", "labels": ["玻璃泡", "接记录装置"], "approx_native_y_band": [1588, 1632], "shared_label_row": True, "approximately_same_body_row": {"block": "p0331#5", "line": 6}, "reason": "Two differently placed diagram labels share the left prose's sixth horizontal band; retain all texts."},
        ]
    if number == 333:
        accounting["figure_inventory_text_rows"] = [
            {"figure": "图 259", "labels": ["玻璃板"], "approx_native_y_band": [432, 467], "approximately_same_body_row": {"block": "p0333#1", "line": 5}, "reason": "Glass-plate label at left shares the right prose row ending 水滴形."},
            {"figure": "图 259", "labels": ["活塞"], "approx_native_y_band": [728, 765], "distinct_from_body_rows": True},
            {"figure": "图 259", "labels": ["气门"], "approx_native_y_band": [806, 842], "distinct_from_body_rows": True},
        ]
    accounting["figure_inventory_label_count"] = sum(len(row["labels"]) for row in accounting["figure_inventory_text_rows"])
    accounting["figure_inventory_text_row_count"] = len(accounting["figure_inventory_text_rows"])
    accounting["unique_physical_lines_including_figure_inventory_text"] = observed_count + sum(
        bool(row.get("distinct_from_body_rows")) for row in accounting["figure_inventory_text_rows"]
    )
    pages.append({
        "book": "10p",
        "physical_page": number,
        "printed_page": initial["printed_page"],
        "source": {"path": str(source_path), "sha256": digest(source_path)},
        "native_size_wh": [1536, 2337],
        "blocks": blocks,
        "figures": figures,
        "line_accounting": accounting,
        "initial_snapshot": initial_ref,
        "correction_snapshot": correction_ref,
        "observed_boundaries": copy.deepcopy(initial["boundary_observation"]),
        "status": "SOURCE_OBSERVED_WITH_NARROW_HOLDS" if correction.get("holds") else "SOURCE_OBSERVED",
    })
    for raw_hold in correction.get("holds", []):
        hold = copy.deepcopy(raw_hold)
        block = block_lookup[hold["block"]]
        hold["stored_source_span"] = span(block, hold["line"], hold["stored_placeholder"])
        hold["evidence"] = correction_ref
        hold["status"] = "HOLD"
        hold["not_a_paragraph_or_object_boundary_hold"] = True
        holds.append(hold)

assert len(image_ledger) == 8
assert {item["sequence"] for item in image_ledger} == set(range(1, 9))
assert sum(page["line_accounting"]["unique_physical_lines"] for page in pages) == 93
assert sum(page["line_accounting"]["unique_physical_lines_including_figure_inventory_text"] for page in pages) == 97

paragraph_groups = [
    ["p0330#3"], ["p0330#4"], ["p0330#5"],
    ["p0330#7", "p0331#1"], ["p0331#2"], ["p0331#3"], ["p0331#4"],
    ["p0331#5", "p0331#8", "p0332#1"],
    ["p0332#2"], ["p0332#3"], ["p0332#4"], ["p0332#5"], ["p0332#6"], ["p0332#7"],
    ["p0332#8", "p0333#1", "p0333#6"], ["p0333#7"], ["p0333#8"], ["p0333#9"],
]
paragraph_boundaries = []
for group in paragraph_groups:
    last = block_lookup[group[-1]]
    group_holds = [hold["id"] for hold in holds if hold["block"] in group]
    paragraph_boundaries.append({
        "source_refs": group,
        "start": {"block": group[0], "line": 1},
        "end_observed": {"block": group[-1], "line": last["line_count"], "text": last["lines"][-1]},
        "boundary_status": "OPEN_AT_BATCH_STOP" if group == ["p0333#9"] else "COMPLETE",
        "text_status": "NARROW_GLYPH_HOLD" if group_holds else "OBSERVED",
        "holds": group_holds,
    })

manifest_entries = []
for pattern in ("initial-*.json", "corrections-*.json", "evidence0444-p*-crop.png", "evidence0444-p*-crop.json", "*.py"):
    for path in sorted(ROOT.glob(pattern)):
        manifest_entries.append({"path": str(path), "sha256": digest(path), "immutable": True})
manifest = write_new("evidence0444-manifest.json", {
    "schema": "d1817-source-evidence0444-manifest@1",
    "immutable": True,
    "entries": manifest_entries,
    "originals_read_only": [{"path": page["source"]["path"], "sha256": page["source"]["sha256"]} for page in pages],
    "image_open_count": 8,
    "images_may_not_be_reopened": True,
})
phase = {
    "schema": "ld-s10y-source/phase1-observation@1",
    "batch": "D041-SOURCE330333-evidence0444",
    "ticket": "STEMROBIN-181",
    "book": "10p",
    "active_worktree": str(WORKTREE),
    "write_scope": str(ROOT),
    "physical_pages": [330, 331, 332, 333],
    "pages": pages,
    "initial_snapshots": initial_snapshots,
    "correction_snapshots": correction_snapshots,
    "evidence": evidence,
    "evidence0444_manifest": manifest,
    "initial_snapshots_never_rewritten": True,
    "correction_snapshots_never_rewritten": True,
    "normalization": "Field names, derived line counts, scalar spans and hash references only; no observation text or immutable snapshot bytes altered.",
    "source_text_contract": {
        "line_break": "One stored array entry equals one printed text line; source_text joins with LF and no trailing LF.",
        "span_basis": "Unicode scalar positions over stored source text, not UTF-16; same-line start/end are 1-based inclusive.",
        "bold_maximality": "Certain runs include observed strong punctuation and full-width spaces; thinner adjacent punctuation is excluded by the correction observation, not lexical-core selection.",
        "hold_placeholders": "Angle-bracketed HOLD tokens are evidence placeholders, not claimed printed text. Exact locations and shape reasons are supplied in holds.",
        "math": "Clearly identified raster mathematical shapes conventionally encoded in LaTeX with dollar delimiters; no claim that raster stores Unicode glyph identities.",
        "printed_wording_retained": ["化费", "就象", "必需", "充电", "蒸汽", "斯科白岑"],
        "under_dot_runs_observed": 0,
        "h2_exhead_ex_blocks_observed": 0,
    },
    "holds": holds,
    "observed_boundaries": {
        "incoming_text_only": {
            "exercise_heading": "练 习 13",
            "last_task_source_ref": "p0329#3",
            "last_task_line1": "5. 求巴耳末系中光的最小波长。",
            "prior_source_images_not_loaded": True,
            "prior_content_artifacts_not_read": True,
        },
        "exercises13": {
            "boundary_status": "COMPLETE",
            "end": {"block": "p0329#3", "line": 1, "basis": "parent incoming TEXT ONLY"},
            "closed_by": {"block": "p0330#1", "line": 1, "text": "第十二章　原子核物理"},
            "previous_boundary_hold_resolved": True,
            "no_incoming_question_or_paragraph_fragment": True,
        },
        "chapter12": {"start": {"block": "p0330#1", "line": 1, "text": "第十二章　原子核物理"}, "end_status": "NOT_OBSERVED"},
        "n126": {
            "boundary_status": "COMPLETE",
            "start": {"block": "p0330#2", "line": 1, "text": "126.　原子核与基本粒子"},
            "prose_source_refs": ["p0330#3", "p0330#4", "p0330#5"],
            "end": {"block": "p0330#5", "line": 6, "text": "报。"},
            "closed_by": {"block": "p0330#6", "line": 1, "text": "127.　基本粒子的观察和记录方法"},
            "holds": [],
            "figures": [],
            "exercises_observed": [],
        },
        "n127": {
            "boundary_status": "OPEN_AT_BATCH_STOP",
            "start": {"block": "p0330#6", "line": 1, "text": "127.　基本粒子的观察和记录方法"},
            "last_observed": {"block": "p0333#9", "line": 2, "text": "的径迹。 在这种液体中，快速的带电粒子运动时形成的离子"},
            "holds": [hold["id"] for hold in holds],
            "figures": ["图 258", "图 259", "图 260"],
            "exercises_observed": [],
            "next_page": "Forbidden and unobserved; no completion or approval claimed.",
        },
        "paragraphs": paragraph_boundaries,
        "cross_figure_bold_continuation": {
            "source_spans": [span(block_lookup["p0333#1"], 6, "径"), span(block_lookup["p0333#6"], 1, "迹")],
            "text": "径迹",
            "transparent_interruption_refs": ["p0333#2", "p0333#3", "p0333#4", "p0333#5"],
            "dash_and_parentheses": "Excluded by immutable native-crop correction.",
        },
        "figure_boundary_status": [
            {"id": "图 258", "status": "COMPLETE", "figure_block": "p0331#6", "caption_block": "p0331#7"},
            {"id": "图 259", "status": "COMPLETE", "figure_block": "p0333#2", "caption_block": "p0333#4"},
            {"id": "图 260", "status": "COMPLETE", "figure_block": "p0333#3", "caption_block": "p0333#5"},
        ],
    },
    "line_accounting_summary": {
        "unique_physical_lines": 93,
        "per_page": {"330": 21, "331": 26, "332": 26, "333": 20},
        "all_block_line_sum": 95,
        "shared_body_caption_deductions": 2,
        "figure_inventory_text_rows": 6,
        "figure_inventory_label_texts": 8,
        "figure_text_rows_sharing_body_bands": 2,
        "unique_physical_lines_including_figure_inventory_text": 97,
        "per_page_including_figure_inventory_text": {"330": 21, "331": 28, "332": 26, "333": 22},
        "graphic_objects": 3,
        "no_rows_omitted_for_counter_fit": True,
    },
    "image_usage": {
        "limit": 8,
        "total_opens": 8,
        "original_opens": 4,
        "crop_opens": 4,
        "reopens": 0,
        "rerenders": 0,
        "source_preparations": 0,
        "all_crops_full_native_width": True,
        "ledger": sorted(image_ledger, key=lambda entry: entry["sequence"]),
        "image_context_closed": True,
        "further_image_reads_authorized": False,
        "parent_return": "TEXT/PATH/HASH ONLY; no image payload",
    },
    "scope_compliance": {
        "shared_main": "Not read or written",
        "read_pages": [330, 331, 332, 333],
        "old_page_md_lessons_modern_answers_choices": "Not read",
        "git_environment_database_network_paid_calls": "Not used",
        "canonical_content_code_publish_deploy_solve": "Not performed",
        "approval": "SOURCE observation only; no RAW/modern/answer/choice approval",
        "new_batch": "Not started",
    },
    "close_status": {
        "status": "CLOSED_TO_IMAGE_READS_AWAITING_PARENT_COLLECTION",
        "stopped_at_physical_page": 333,
        "immutable_evidence": True,
        "no_child_agents_started": True,
        "running_jobs": 0,
        "n127_remains_open": True,
    },
}
phase_ref = write_new("phase1-observation.json", phase)
summary_ref = write_new("text-only-return.json", {
    "batch": phase["batch"],
    "phase": phase_ref,
    "evidence0444_manifest": manifest,
    "image_total": 8,
    "printed_pages": [320, 321, 322, 323],
    "body_unique_rows": [21, 26, 26, 20],
    "complete_boundaries": ["Exercises13 closed by p0330#1", "n126 p0330#2 through p0330#5, closed by p0330#6", "Figures258/259/260 and their captions", "17 paragraph objects; three have only narrow glyph holds"],
    "narrow_holds": [{"id": hold["id"], "block": hold["block"], "line": hold["line"], "reason": hold["reason"]} for hold in holds],
    "open_boundary": "n127 and p0333#9 at batch stop; do not observe p0334",
    "close_status": phase["close_status"]["status"],
    "payload": "TEXT/PATH/HASH ONLY",
})
for path in ROOT.iterdir():
    if path.is_file():
        path.chmod(0o444)
print(json.dumps({"phase": phase_ref, "return": summary_ref, "image_total": 8, "holds": len(holds)}, ensure_ascii=False))
