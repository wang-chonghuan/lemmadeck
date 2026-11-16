"""One author-only native structural check, with exact authorized byte reversal."""

import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
BEFORE = OUT / "before"
INITIAL = OUT.parent / "9p-next-source-0200-0203"
REVIEW = OUT.parent / "source-review-9p-0200-0203.json"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
PATTERN = OUT.parent / "9p-next-source-0196-0199-correction-1/author-correction.py"
PATTERN_SHA = "b3218d701dc5eb16bc8d82e9fc7ba51fae082b3566a832e24919e9ae756e0dfd"
REVIEW_SHA = "5be67f9bbb43dcc9ab1c90bbac0e47b0f48e182fe61e5682cb20ae9f47a0cce6"
INITIAL_FILE_SHA = "9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1"
INITIAL_TEXT_SHA = "63b9870437b07e78a17f56c21970a619c72afdef784070ac9116d834ab28f9d1"
ROWS = {200: 24, 201: 21, 202: 25, 203: 24}
CORRECTIONS = {
    200: ["F-count-200"],
    201: ["F-text-201"],
    202: ["F-count-202", "F-crop-152"],
    203: ["F-text-203"],
}


def bind(path, expected=None):
    value = {
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }
    if expected is not None:
        assert value["sha256"] == expected, f"Changed frozen bytes: {path}"
    return value


def manifest(bindings):
    records = "".join(f"{page:04d}:{binding['sha256']}\n" for page, binding in bindings)
    return {
        "algorithm": "sha256 of ordered UTF-8 NNNN:draft-sha256 newline records",
        "manifest": records,
        "sha256": hashlib.sha256(records.encode("utf-8")).hexdigest(),
    }


def main():
    target = OUT / "author-correction-freeze.json"
    assert not target.exists(), "One structural check only; preserve its freeze"
    assert OUT == ROOT / (
        ".intentfold/tickets/STEMROBIN-181/tmp/"
        "9p-next-source-0200-0203-correction-1"
    )
    inputs = {
        "initial_review": bind(REVIEW, REVIEW_SHA),
        "preserved_initial_review": bind(BEFORE / REVIEW.name, REVIEW_SHA),
        "initial_author_freeze": bind(INITIAL / "author-freeze.json", INITIAL_FILE_SHA),
        "preserved_initial_author_freeze": bind(BEFORE / "author-freeze.json", INITIAL_FILE_SHA),
        "requested_initial_text_freeze_sha256": INITIAL_TEXT_SHA,
        "requested_sha_is_ordered_text_manifest_not_json_file_sha": True,
    }
    review = json.loads((BEFORE / REVIEW.name).read_bytes())
    initial = json.loads((BEFORE / "author-freeze.json").read_bytes())
    assert review["ticket"] == initial["ticket"] == "STEMROBIN-181"
    assert review["delivery"] == "D020"
    assert review["binding"]["author_freeze"]["sha256"] == INITIAL_FILE_SHA
    assert review["binding"]["requested_sha256"] == INITIAL_TEXT_SHA
    assert review["binding"]["text_freeze_sha256"] == INITIAL_TEXT_SHA
    assert initial["text_freeze"]["sha256"] == INITIAL_TEXT_SHA
    review_pages = {item["pdf_page"]: item for item in review["pages"]}
    initial_pages = {item["pdf_page"]: item for item in initial["pages"]}
    findings = {item["id"]: item for item in review["findings"]}
    assert list(review_pages) == list(initial_pages) == list(ROWS)
    assert set(findings) == {item for values in CORRECTIONS.values() for item in values}
    contracts = {
        name: bind(ROOT / initial[name]["path"], initial[name]["sha256"])
        for name in ("lesson_skill", "profile", "image_rules")
    }
    tool_bindings = {
        name: bind(ROOT / entry["path"], entry["sha256"])
        for name, entry in initial["tools"].items()
    }
    helper_pattern = bind(PATTERN, PATTERN_SHA)
    initial_helper = bind(ROOT / initial["helper"]["path"], initial["helper"]["sha256"])
    existing_metadata_probe = bind(
        Path(review["binding"]["metadata_probe"]["path"]),
        review["binding"]["metadata_probe"]["sha256"],
    )
    sys.path.insert(0, str(TOOLS))
    import blocks

    pages = []
    initial_drafts = []
    corrected_drafts = []
    sources = []
    for page, expected_rows in ROWS.items():
        reviewed = review_pages[page]
        assert set(reviewed["finding_ids"]) == set(CORRECTIONS[page])
        authorized = [findings[item] for item in CORRECTIONS[page]]
        old_file = BEFORE / f"{page:04d}.page.md"
        new_file = OUT / old_file.name
        frozen_sha = reviewed["draft_sha256"]
        assert frozen_sha == initial_pages[page]["draft"]["sha256"]
        original_binding = bind(INITIAL / old_file.name, frozen_sha)
        before_binding = bind(old_file, frozen_sha)
        source_entry = initial_pages[page]["source"]
        assert reviewed["source_sha256"] == source_entry["sha256"]
        sources.append(bind(ROOT / source_entry["path"], source_entry["sha256"]))
        before = old_file.read_bytes()
        after = new_file.read_bytes()
        expected = before
        reverse = after
        configuration = {}
        text_finding = None
        for finding in authorized:
            configuration.update(finding.get("allowed_metadata", {}))
            if finding["id"].startswith("F-text-"):
                text_finding = finding
        if configuration:
            old_tail = b'  "errata": []\n}\n---\n'
            additions = []
            for key, value in configuration.items():
                serialized = json.dumps(value, ensure_ascii=False, indent=2)
                indented = serialized.replace("\n", "\n  ")
                additions.append(f'  "{key}": {indented}')
            new_tail = (
                '  "errata": [],\n' + ",\n".join(additions) + "\n}\n---\n"
            ).encode("utf-8")
            assert expected.count(old_tail) == reverse.count(new_tail) == 1
            expected = expected.replace(old_tail, new_tail, 1)
            reverse = reverse.replace(new_tail, old_tail, 1)
        if text_finding is not None:
            old_literal = text_finding["draft_literal"].encode("utf-8")
            new_literal = text_finding["actual_source_literal"].encode("utf-8")
            assert expected.count(old_literal) == reverse.count(new_literal) == 1
            if page == 201:
                assert old_literal.replace("\u5bfc".encode("utf-8"), b"", 1) == new_literal
            else:
                assert page == 203
                assert new_literal.replace("\u5165".encode("utf-8"), b"", 1) == old_literal
            expected = expected.replace(old_literal, new_literal, 1)
            reverse = reverse.replace(new_literal, old_literal, 1)
        assert after == expected, f"Unauthorized byte changes on page {page}"
        assert reverse == before, f"Non-reversible correction on page {page}"

        # Native parse only: restore the authorized deltas and compare all structures.
        before_meta, before_blocks = blocks.parse(before.decode("utf-8"))
        after_meta, after_blocks = blocks.parse(after.decode("utf-8"))
        reversed_meta = copy.deepcopy(after_meta)
        for key, value in configuration.items():
            assert reversed_meta.pop(key) == value
        assert reversed_meta == before_meta
        reversed_blocks = copy.deepcopy(after_blocks)
        if text_finding is not None:
            block_index = int(text_finding["ref"].split("#")[1]) - 1
            row_index = text_finding["row"] - 1
            old_text = text_finding["draft_literal"]
            new_text = text_finding["actual_source_literal"]
            corrected_line = reversed_blocks[block_index]["lines"][row_index]
            assert corrected_line.count(new_text) == 1
            reversed_blocks[block_index]["lines"][row_index] = corrected_line.replace(
                new_text, old_text, 1
            )
        assert reversed_blocks == before_blocks
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in after_blocks
        ]
        assert block_rows == reviewed["observed_block_rows_before_samerow"]
        assert len(after_blocks) == reviewed["blocks"]
        counted_rows = blocks.printed_lines(after_blocks)
        assert counted_rows == expected_rows == reviewed["draft_rows"]
        inventory = [
            {
                "ref": f"p{page:04d}#{index}",
                "kind": block["kind"],
                "label": block["label"],
                "open": block["open"],
                "cont": block["cont"],
                "samerow": block["samerow"],
                "physical_rows_before_samerow": block_rows[index - 1],
            }
            for index, block in enumerate(after_blocks, 1)
        ]
        assert inventory == initial_pages[page]["block_inventory"]
        geometry = initial_pages[page]["figures"]
        for figure in geometry:
            block_index = int(figure["block"].split("#")[1]) - 1
            assert after_blocks[block_index]["box"] == figure["rough_box"]
        if page in (200, 202):
            assert configuration["counting"]["edge_margin_px"] == 96
            assert set(configuration["counting"]) == {"edge_margin_px", "reason"}
        if page == 202:
            assert configuration["figure_crops"]["fig-152"]["padding_px"] == 6
        after_binding = bind(new_file)
        initial_drafts.append((page, original_binding))
        corrected_drafts.append((page, after_binding))
        pages.append({
            "pdf_page": page,
            "printed_page": after_meta["printed_page"],
            "initial_draft": original_binding,
            "before": before_binding,
            "after": after_binding,
            "authorized_finding_ids_applied": CORRECTIONS[page],
            "exact_frontmatter_metadata_applied": configuration,
            "text_delta": text_finding,
            "native_structural_rows": counted_rows,
            "block_rows_before_samerow": block_rows,
            "samerow_adjustment": counted_rows - sum(block_rows),
            "preserved_block_inventory": inventory,
            "preserved_figure_geometry": geometry,
            "native_parser_and_body_reversal_match": True,
            "whole_file_authorized_changes_reversal_byte_identical": True,
            "identities_math_flags_rowbreaks_and_rough_boxes_preserved": True,
            "all_other_metadata_bytes_preserved_including_historical_notes": True,
            "configured_counter_evidence": {
                "origin": "existing bound independent reviewer probe; not author rerun",
                "review_page_pointer": f"pages[pdf_page={page}]",
                "reviewer_probe_rows": reviewed.get("one_local_metadata_probe_rows"),
                "native_counter_calls": 0,
            },
        })
    initial_manifest = manifest(initial_drafts)
    assert initial_manifest == initial["text_freeze"]
    assert initial_manifest["sha256"] == INITIAL_TEXT_SHA
    after_manifest = manifest(corrected_drafts)
    preserved_candidates = []
    unchanged_candidates = []
    for figure in review["figures"]:
        name = figure["id"] + ".png"
        original_candidate = INITIAL / "candidate-figures" / name
        before_candidate = BEFORE / "candidate-figures" / name
        preserved = {
            "id": figure["id"],
            "initial": bind(original_candidate, figure["candidate_sha256"]),
            "before": bind(before_candidate, figure["candidate_sha256"]),
            "byte_identical_preservation": True,
        }
        preserved_candidates.append(preserved)
        if figure["id"] != "fig-152":
            unchanged_candidates.append({
                **preserved,
                "after": bind(OUT / "candidate-figures" / name, figure["candidate_sha256"]),
                "after_byte_identical": True,
                "frozen_snapped_box_xywh": figure["frozen_snapped_box_xywh"],
                "source_ref": figure["source_ref"],
                "caption_ref": figure["caption_ref"],
                "owner": figure["owner"],
            })
    crop_report_file = OUT / "crop-152-binding.json"
    crop_report_binding = bind(crop_report_file)
    crop = json.loads(crop_report_file.read_bytes())
    assert crop["finding_id"] == "F-crop-152"
    assert crop["source_rectangle_xywh"] == [771, 220, 554, 436]
    assert crop["pillow_crop_rectangle_xyxy_exclusive"] == [771, 220, 1325, 656]
    assert crop["frozen_snapped_box_xywh"] == [777, 226, 542, 424]
    assert crop["padding_px"] == 6 and crop["dimensions_px"] == [554, 436]
    assert crop["images_viewed"] == 0 and crop["crop_calls"] == 1
    assert crop["resize_convert_whiten_resnap_or_finalize_calls"] == 0
    assert crop["whole_frozen_snapped_rectangle_preserved"] is True
    assert crop["visual_completeness_or_leakage_approval"] is False
    bind(Path(crop["source"]["path"]), crop["source"]["sha256"])
    bind(Path(crop["output"]["path"]), crop["output"]["sha256"])
    bind(Path(crop["helper"]["path"]), crop["helper"]["sha256"])
    for key in ("PIL", "Image", "PngImagePlugin", "python_executable"):
        entry = crop["tool_bindings"][key]
        bind(Path(entry["path"]), entry["sha256"])

    # Rebind external inputs without reparsing or loading pixels.
    for entry in sources:
        bind(Path(entry["path"]), entry["sha256"])
    for _, entry in initial_drafts:
        bind(Path(entry["path"]), entry["sha256"])
    bind(REVIEW, REVIEW_SHA)
    bind(INITIAL / "author-freeze.json", INITIAL_FILE_SHA)
    result = {
        "schema": "s10y/source-author-correction-freeze@1",
        "ticket": "STEMROBIN-181",
        "batch": "D020",
        "delivery": "D020",
        "book": "9p",
        "role": "source-correction-author-only",
        "status": "frozen-author-corrections-awaiting-independent-delta-review",
        "date": "2026-11-16",
        "ownership": str(OUT.resolve()) + "/",
        "inputs": inputs,
        "initial_text_freeze": initial_manifest,
        "corrected_text_freeze": after_manifest,
        "contracts": contracts,
        "helper": bind(Path(__file__).resolve()),
        "helper_pattern": helper_pattern,
        "initial_author_helper_not_rerun": initial_helper,
        "native_parser": tool_bindings["blocks.py"],
        "frozen_repo_tool_bindings": tool_bindings,
        "tools_invoked": ["blocks.parse", "blocks.printed_lines", "Pillow Image.crop"],
        "source_bindings_unchanged": sources,
        "pages": pages,
        "preserved_candidate_bindings": preserved_candidates,
        "unchanged_candidate_bindings": unchanged_candidates,
        "corrected_152": {"binding_report": crop_report_binding, **crop},
        "findings_applied": [
            {
                "id": finding["id"],
                "authorized_by_review": inputs["initial_review"],
                "original_finding": finding,
                "author_application_status": "applied-only-exact-authorized-delta",
                "independent_delta_review_status": "pending-not-performed-by-author",
            }
            for finding in review["findings"]
        ],
        "existing_independent_metadata_probe_not_rerun": existing_metadata_probe,
        "structural_check": {
            "command": (
                ".claude/skills/ld-s10y-lesson/.venv/bin/python -B "
                + str(Path(__file__).resolve().relative_to(ROOT))
            ),
            "runs": 1,
            "parser_calls": 8,
            "printed_lines_calls": 4,
            "rows_in_page_order": list(ROWS.values()),
            "total_rows": sum(ROWS.values()),
            "blocks": sum(len(item["block_rows_before_samerow"]) for item in pages),
            "all_exact_requested_changes_and_reversals_verified": True,
            "native_counter_calls": 0,
            "counter_proof_is_existing_reviewer_evidence_only": True,
            "images_viewed": 0,
        },
        "preserved_context": {
            "toc_and_ownership": review["toc_and_ownership"],
            "boundaries": review["boundaries"],
            "resolved_prior_uncertainties": review["resolved_prior_uncertainties"],
            "pixel_preserved_nonblocking_uncertainties": review[
                "pixel_preserved_nonblocking_uncertainties"
            ],
            "outgoing_82_remains_open_to_unviewed_204": True,
            "historical_author_notes_are_unchanged_not_new_assertions": True,
        },
        "live_ticket_read": {
            "backend": "Plane",
            "id": "7ebae0e0-c024-481d-8360-5b3d3bfdda79",
            "sequence_id": 181,
            "date": "2026-11-16",
            "verify_http": 200,
            "direct_read_http": 200,
            "description_actually_read": True,
            "writes": 0,
            "current_human_source_correction_only_authorization_controls_this_work": True,
        },
        "approval": {
            "independent_source_approval": False,
            "science_approval": False,
            "modern_approval": False,
            "author_only_not_approval": True,
            "corrected_152_visual_review": "pending-fresh-bounded-independent-review",
        },
        "not_performed": [
            "image viewing or image payloads", "source approval", "SCI",
            "counter or metadata probe rerun", "snap or resnap", "finalize",
            "vectorize", "assemble", "adapt", "browser", "DB", "Git",
            "original edits", "fig153-155 edits", "skill edits",
            "retention or promotion", "full tests",
        ],
        "unowned_files_written": False,
        "in_flight_processes": [],
    }
    owned_files = sorted(
        str(path.relative_to(OUT)) for path in OUT.rglob("*") if path.is_file()
    )
    owned_files.append(target.name)
    result["owned_files"] = sorted(owned_files)
    with target.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "freeze": bind(target),
        "native_structural_rows": list(ROWS.values()),
        "native_counter_calls": 0,
        "images_viewed": 0,
        "author_only_not_approval": True,
        "owned_files": result["owned_files"],
    }, indent=2))


if __name__ == "__main__":
    main()
