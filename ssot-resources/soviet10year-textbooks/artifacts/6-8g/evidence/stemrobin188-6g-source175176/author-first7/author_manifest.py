"""Bind final author-only files without changing native page evidence."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image

REPO = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source6g175176-author7"


def binding(path: Path) -> dict:
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": path.stat().st_size,
    }


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


SOURCE_INVENTORY = {
    "fig-234": {
        "page": 175,
        "visual_load_order": 3,
        "semantic_owner": "corollary3 and its proof",
        "caption_block": 6,
        "caption_samerow": True,
        "caption_shares_block": 4,
        "caption_complete_in_page": True,
        "labels": ["A", "B", "C", "D"],
        "labels_complete": True,
        "whole_figure_bounds_complete": True,
        "structure": ["triangle A-B-C", "AC extended right through C toward D"],
        "arc_strokes_from_actual_crop": {"A": 2, "B": 3, "C_exterior": 1},
        "unknowns": [
            "intentional dot count versus thick line joins",
            "tiny stroke roles; not inferred as equal-length hatches",
        ],
    },
    "fig-235": {
        "page": 175,
        "visual_load_order": 4,
        "semantic_owner": "theorem48 proof",
        "caption_block": 11,
        "caption_samerow": True,
        "caption_shares_block": 9,
        "caption_complete_in_page": True,
        "labels": ["O"],
        "labels_complete": True,
        "whole_figure_bounds_complete": True,
        "boundary_vertices_visible": 7,
        "hub_to_vertex_segments_visible": 7,
        "structure": ["seven-vertex boundary", "interior hub labelled O"],
        "arc_strokes_identified": 0,
        "unknowns": [
            "exact intentional hatch count and role of right-edge protrusions",
            "intentional point-dot count versus thick line joins",
        ],
    },
    "fig-236": {
        "page": 176,
        "visual_load_order": 5,
        "semantic_owner": "theorem49 proof",
        "caption_block": 7,
        "caption_samerow": False,
        "caption_complete_in_page": True,
        "labels": [],
        "labels_complete": True,
        "whole_figure_bounds_complete": True,
        "boundary_vertices_visible": 5,
        "structure": [
            "five-vertex boundary with visible exterior extensions",
            "horizontal baseline extends past both edge endpoints",
            "complete terminal strokes retained",
        ],
        "arc_strokes_clockwise_from_upper_left": [1, 1, 2, 1, 1],
        "unknowns": [
            "exact hatch/dot count and semantic role of dark transverse strokes",
            "speckled scan patches versus intentional marks",
        ],
    },
    "fig-237": {
        "page": 176,
        "visual_load_order": 6,
        "semantic_owner": "four-row 附注",
        "caption_block": 8,
        "caption_samerow": True,
        "caption_shares_block": 7,
        "caption_complete_in_page": True,
        "labels": ["A", "B", "C", "D", "E"],
        "labels_complete": True,
        "whole_figure_bounds_complete": True,
        "structure": [
            "boundary A-B-C-D-E-A", "concave notch D",
            "internal A-D and B-D",
        ],
        "arc_strokes_identified": 0,
        "unknowns": [
            "explicit point-dot count versus dark joins and scan specks",
            "typographic alphabet-system attribution beyond visible uppercase shapes",
        ],
    },
}


def main() -> None:
    if Path.cwd().resolve() != REPO:
        raise RuntimeError("Wrong cwd")
    output = OWNED / "author-manifest.json"
    if output.exists():
        raise RuntimeError("Final manifest already exists")
    first = read_json(OWNED / "FIRST.json")
    pages, figures, native_calls = {}, {}, []
    for page in (175, 176):
        pdir = OWNED / f"artifacts/6-8g/pages/{page:04d}"
        document = read_json(pdir / "page.json")
        audit = read_json(pdir / "audit.json")
        receipt_path = OWNED / f"native/{page:04d}/attempt1/receipt.json"
        receipt = read_json(receipt_path)
        native_calls.append({"receipt": binding(receipt_path), **receipt})
        text_rows, same_rows, blocks = 0, 0, []
        for index, block in enumerate(document["blocks"], start=1):
            rows = len(block["lines"]) if block["kind"] != "fig" else 0
            subtractions = (rows if block["kind"] == "cap" else 1) if block["samerow"] else 0
            text_rows += rows
            same_rows += subtractions
            blocks.append({
                "block_index": index,
                "kind": block["kind"],
                "label": block["label"],
                "body_print_rows": rows,
                "samerow_subtraction": subtractions,
                "open": block["open"],
                "cont": block["cont"],
                "figure_owner_exercise": block["owner_exercise"],
            })
        pages[f"{page:04d}"] = {
            "author_status": "AUTHOR_ONLY",
            "local_status": "NO_NATIVE_HOLD" if receipt["exit_code"] == 0 else "HOLD_COUNT_ONLY",
            "independent_source_review": "NOT_PERFORMED",
            "printed_page": document["meta"]["printed_page"],
            "first_candidate": first["pages"][f"{page:04d}"]["first_candidate"],
            "candidate_after_native": binding(pdir / "page.md"),
            "native_page_json": binding(pdir / "page.json"),
            "native_audit_json": binding(pdir / "audit.json"),
            "native_exit_code": receipt["exit_code"],
            "native_errors": audit["errors"],
            "native_normalizations": audit["normalizations"],
            "source_notes": document["meta"]["notes"],
            "counts": {
                "block_count": len(document["blocks"]),
                "body_print_rows_including_captions_and_footer": text_rows,
                "genuine_shared_row_subtractions": same_rows,
                "unique_transcribed_text_rows": text_rows - same_rows,
                "native_lines_md": audit["lines_md"],
                "native_lines_printed": audit["lines_printed"],
                "count_exclusions": audit["count_exclusions"],
                "manual_count_override": None,
                "formula_wrap_fabrication": False,
            },
            "block_ranges_and_rows": blocks,
            "errata": document["meta"]["errata"],
            "source_word_unknowns": [],
            "glyph_or_inventory_unknowns": [
                note for note in document["meta"]["notes"] if "UNKNOWN" in note
            ],
        }
        for figure in audit["figures"]:
            fid = figure["id"]
            original = OWNED / f"work/6-8g/pages/{page:04d}/figures/{fid}.png"
            retained = pdir / f"figures/{fid}.png"
            retained.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(original, retained)
            if binding(original)["sha256"] != binding(retained)["sha256"]:
                raise RuntimeError("Crop retention changed bytes")
            with Image.open(original) as image:
                dimensions = list(image.size)
            figures[fid] = {
                **SOURCE_INVENTORY[fid],
                "native_original_crop": binding(original),
                "retained_exact_crop_for_page_md": binding(retained),
                "native_crop_dimensions": dimensions,
                "native_geometry_and_ownership": figure,
                "crop_inspected_exactly_once": True,
                "caption_in_crop": False,
                "caption_text": f"图 {fid.split('-')[1]}",
                "author_modified_pixels": False,
                "author_component_ownership_override": None,
                "modern_or_vector_output": False,
                "source_approval_claim": False,
            }
    grid175 = first["inputs"]["0175"][1]
    grid176 = first["inputs"]["0176"][1]
    manifest = {
        "schema": "s10y-bounded-source-author-manifest@1",
        "ticket": "STEMROBIN-188",
        "book": "6-8g",
        "scope_physical": [175, 176],
        "scope_printed": [165, 166],
        "finish": "review/offline",
        "role": "NEW_SOURCE_AUTHOR_ONLY",
        "status": "AUTHOR_ONLY",
        "local_holds": [{
            "page": 176,
            "phase": "native page row reconciliation",
            "status": "HOLD_COUNT_ONLY",
            "actual_first_native_exit": 1,
            "text_rows": 20,
            "native_projected_rows": 21,
            "cause_evidence": "Non-text printed separator matches extra band [1684,1701]",
            "resolution_performed": False,
            "no_semantic_verdict": True,
            "first_failure_preserved": True,
            "valid_page_json_audit_and_crops_preserved": True,
        }],
        "source_approval_claim": False,
        "independent_review": "NOT_PERFORMED; parent retains independent review",
        "cwd": str(REPO),
        "sole_write_root": str(OWNED),
        "first_md": binding(OWNED / "FIRST.md"),
        "first_json": binding(OWNED / "FIRST.json"),
        "crop_observations": binding(OWNED / "crop-observations.md"),
        "verified_inputs": first["inputs"],
        "native_calls": native_calls,
        "pages": pages,
        "figures": figures,
        "object_ranges": [
            {
                "object": "unit38 多边形的内角和",
                "start": "physical174 printed164, caller text-only continuity",
                "scope_observed": "physical175-176 only",
                "end": "NOT_PROVEN_WITHIN_SCOPE",
                "no_toc_or_page177_boundary_inference": True,
            },
            {
                "object": "theorem47 prior OPEN proof",
                "prior_evidence": "caller174 text, transparent teaching footnote and foot164",
                "range_observed": ["0175#1"],
                "binding": "cont from prior OPEN proof, closes at actual top black mark",
            },
            {"object": "corollary1", "range": ["0175#2"], "closed": True},
            {"object": "corollary2", "range": ["0175#3"], "closed": True},
            {
                "object": "corollary3 and proof",
                "range": ["0175#4", "0175#5", "0175#6", "0175#7"],
                "figure": "fig-234", "closed": True,
            },
            {"object": "theorem48 statement", "range": ["0175#8"], "closed": True},
            {
                "object": "theorem48 proof",
                "range": ["0175#9", "0175#10", "0175#11", "0175#12", "0176#1"],
                "binding": "p open -> transparent fig235/cap235 -> p cont open -> foot165 transparent -> p cont closed",
                "figure": "fig-235", "closed_on_actual176": True,
            },
            {"object": "quadrilateral special case", "range": ["0176#2"], "closed": True},
            {"object": "theorem49 statement", "range": ["0176#3"], "closed": True},
            {
                "object": "theorem49 proof",
                "range": ["0176#4", "0176#5", "0176#7"],
                "figure": "fig-236", "closed": True,
            },
            {
                "object": "附注",
                "range": ["0176#6", "0176#8", "0176#9"],
                "figure": "fig-237", "closed": True,
            },
            {"object": "问题和习题 heading", "range": ["0176#10"]},
            {
                "object": "exercise488",
                "range": ["0176#11"],
                "source_number": 488,
                "printed_rows": 2,
                "numeric_subparts_same_row": [1, 2, 3],
                "figures_owned": [],
                "closed_within176": True,
            },
            {"object": "foot165", "range": ["0175#13"]},
            {"object": "foot166", "range": ["0176#12"]},
        ],
        "nontext_inventory": {
            "solid_black_marks": {
                "0175": ["prior proof end", "corollary3 proof end", "between48 and 定理"],
                "0176": ["theorem48 proof end", "between49 and 定理 spanning two rows", "theorem49 proof end"],
                "exact_role": "UNKNOWN; shape encoded, not silently discarded",
            },
            "underlining175": "wavy emphasis under corollary statements; no separate text row",
            "separator176": {
                "visible_approx_endpoints": [[144, 1685], [1218, 1700]],
                "actual_native_projection_band": [1684, 1701],
                "not_text_or_figure": True,
                "excluded_from_native_count": False,
            },
            "scan_edge_and_speck_roles": "UNKNOWN where unconfirmed; no adjacent-page reopen",
        },
        "count_diagnosis176": {
            "diagnostic_source": str(OWNED / "work/6-8g/pages/0176/page.png"),
            "diagnostic_audit": str(OWNED / "artifacts/6-8g/pages/0176/audit.json"),
            "read_only": True,
            "same_existing_native_line_bands_function": True,
            "content_width": 1441,
            "actual_bands": [
                [206, 249], [275, 321], [341, 385], [412, 454],
                [479, 533], [534, 589], [621, 666], [687, 736],
                [757, 804], [826, 872], [891, 934], [1330, 1367],
                [1392, 1440], [1460, 1507], [1527, 1574], [1603, 1634],
                [1684, 1701], [1720, 1757], [1788, 1837], [1857, 1905],
                [1932, 1954],
            ],
            "extra_nontext_band": [1684, 1701],
            "independent_exclusion_review_available": False,
            "content_revision_justified": False,
            "repair_attempts": 0,
            "native_rerun": False,
        },
        "actualimage": {
            "one_bounded_batch": True,
            "batch_cap": 8,
            "context_cap": 24,
            "batch_load_count": 6,
            "context_load_count": 6,
            "remaining_batch_capacity": 2,
            "loads": [
                {"order": 1, "type": "source_grid", "path": grid175["canonical_path"], "sha256": grid175["verified_once_sha256"]},
                {"order": 2, "type": "source_grid", "path": grid176["canonical_path"], "sha256": grid176["verified_once_sha256"]},
                *[
                    {
                        "order": inventory["visual_load_order"],
                        "type": "original_native_crop",
                        "path": figures[fid]["native_original_crop"]["path"],
                        "sha256": figures[fid]["native_original_crop"]["sha256"],
                    }
                    for fid, inventory in SOURCE_INVENTORY.items()
                ],
            ],
            "reopens": 0,
            "plain_source_loads": 0,
            "missing_exact_crops": [],
        },
        "counters": {
            "prepare_reruns": 0,
            "native_finalize_calls": 2,
            "native_calls_per_completed_first_candidate": {"0175": 1, "0176": 1},
            "native_failures": 1,
            "content_revisions": 0,
            "technical_recovery_attempts": 0,
            "read_only_count_diagnoses": 1,
            "modern_render_calls": 0,
            "model_service_calls": 0,
            "git_operations": 0,
            "db_operations": 0,
            "messages_sent": 0,
            "timers_created": 0,
        },
        "retention": {
            "all_indispensable_first_facts_failures_and_outputs_in_owned_root": True,
            "native_crops_copied_byte_exact_only_for_relative_page_md_resolution": True,
            "no_source_approval_or_publication": True,
            "final_file_permissions": "0444",
            "directories_remain_traversable": True,
        },
    }
    manifest["retained_file_inventory_before_manifest"] = [
        binding(path) for path in sorted(OWNED.rglob("*")) if path.is_file()
    ]
    output.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    for path in OWNED.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    print(json.dumps({
        "manifest": binding(output),
        "first_json": binding(OWNED / "FIRST.json"),
        "first_md": binding(OWNED / "FIRST.md"),
        "status": manifest["status"],
        "local_holds": manifest["local_holds"],
        "actual_image_loads": 6,
        "content_revisions": 0,
        "technical_recovery_attempts": 0,
        "all_files_0444": all((p.stat().st_mode & 0o777) == 0o444 for p in OWNED.rglob("*") if p.is_file()),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
