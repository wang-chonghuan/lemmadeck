"""Verify this bounded source package and emit hash-bound textual handoffs."""
from __future__ import annotations

from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import sys

import numpy as np
from PIL import Image

from author_tools import BASE, REPO, TOOLS, PREDECESSOR_SHA, file_record, owned, save


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def pixel_record(image: Image.Image) -> dict:
    array = np.asarray(image)
    return {
        "mode": image.mode,
        "width": image.width,
        "height": image.height,
        "pixel_sha256": hashlib.sha256(array.tobytes()).hexdigest(),
    }


def verify() -> dict:
    sys.path.insert(0, str(TOOLS))
    import blocks as B

    predecessor = BASE / "input/predecessor-next-source-author.json"
    assert file_record(predecessor)["sha256"] == PREDECESSOR_SHA
    originals = REPO / ".tmp/ld-s10y-lesson/9-10g/pages"
    checks = []
    for page in (191, 192):
        slug = f"{page:04d}"
        source_dir = originals / slug
        for name in (
            "page.png", "page.grid.png", "layout.json", "page.template.md",
            "prepare.0001.stdout", "prepare.0001.stderr",
        ):
            original = file_record(source_dir / name)
            retained = file_record(BASE / f"input/9-10g/pages/{slug}/{name}")
            assert original["sha256"] == retained["sha256"]
            checks.append({"original": original, "copy": retained, "byte_identical": True})
        for name in ("page.png", "page.grid.png", "layout.json", "page.template.md"):
            original = file_record(source_dir / name)
            working = file_record(BASE / f"work/9-10g/pages/{slug}/{name}")
            assert original["sha256"] == working["sha256"]
            checks.append({"original": original, "work": working, "byte_identical": True})

    pages, figures = [], []
    for page in (191, 192):
        slug = f"{page:04d}"
        pdir = BASE / f"artifacts/9-10g/pages/{slug}"
        data = load(pdir / "page.json")
        audit = load(pdir / "audit.json")
        receipt = load(BASE / f"receipts/finalize-{slug}.0001.json")
        assert not audit["errors"] and receipt["exit_code"] == 0
        assert audit["normalizations"] == []
        assert audit["count_exclusions"] == [] and audit["errata"] == 0
        first = load(BASE / f"FIRST-{slug}.json")
        assert first["template_spec_candidate_read_before_freeze"] is False
        assert receipt["FIRST"] == file_record(BASE / f"FIRST-{slug}.json")
        initial = BASE / f"initial-candidate/{slug}/page.md"
        initial_meta, initial_blocks = B.parse(initial.read_text(encoding="utf-8"))
        assert receipt["candidate_before"]["sha256"] == file_record(initial)["sha256"]
        assert receipt["candidate_before"]["bytes"] == file_record(initial)["bytes"]
        final_meta, final_blocks = B.parse((pdir / "page.md").read_text(encoding="utf-8"))
        assert final_blocks == [
            {key: value for key, value in block.items() if key != "id"}
            for block in data["blocks"]
        ]
        assert B.printed_lines(final_blocks) == audit["lines_printed"] == audit["lines_md"]
        # Only native figure IDs/geometry and generated metadata may change.
        semantic_keys = ("kind", "label", "owner_exercise", "cont", "open", "samerow", "lines")
        assert len(initial_blocks) == len(final_blocks)
        for initial_block, final_block in zip(initial_blocks, final_blocks):
            assert {k: initial_block[k] for k in semantic_keys} == {
                k: final_block[k] for k in semantic_keys
            }
        original = originals / slug / "page.png"
        retained = BASE / f"input/9-10g/pages/{slug}/page.png"
        working = BASE / f"work/9-10g/pages/{slug}/page.png"
        with Image.open(original) as image:
            source_pixels = np.asarray(image).copy()
            pixels = pixel_record(image)
        for copy in (retained, working):
            with Image.open(copy) as image:
                assert np.array_equal(source_pixels, np.asarray(image))
        pages.append({
            "page": page, "source": file_record(original),
            "retained": file_record(retained), "work": file_record(working),
            "pixels": pixels, "full_page_array_mismatches": 0,
            "FIRST": file_record(BASE / f"FIRST-{slug}.json"),
            "initial_candidate": file_record(initial),
            "candidate_semantic_text_and_flags_unchanged": True,
            "page_md": file_record(pdir / "page.md"),
            "page_json": file_record(pdir / "page.json"),
            "audit": file_record(pdir / "audit.json"),
            "native_receipt": file_record(BASE / f"receipts/finalize-{slug}.0001.json"),
            "native_exit_code": 0, "line_count": audit["lines_md"],
            "native_audit_errors": [], "source_approval": False,
        })
        for figure in audit["figures"]:
            x, y, w, h = figure["box"]
            crop_path = BASE / f"work/9-10g/pages/{slug}/figures/{figure['id']}.png"
            exact_path = owned(BASE / f"evidence/crops/{slug}-{figure['id']}-exact.png")
            with Image.open(original) as image:
                exact = image.crop((x, y, x+w, y+h))
                expected = np.asarray(exact).copy()
                if not exact_path.exists():
                    exact.save(exact_path)
            with Image.open(crop_path) as image:
                crop_pixels = np.asarray(image).copy()
                padding = 12
                left, top = max(0, x-padding), max(0, y-padding)
                right, bottom = min(source_pixels.shape[1], x+w+padding), min(source_pixels.shape[0], y+h+padding)
                native_expected = np.full_like(crop_pixels, 255)
                offset_x, offset_y = x-left, y-top
                native_expected[offset_y:offset_y+h, offset_x:offset_x+w] = expected
                assert image.size == (right-left, bottom-top)
                assert np.array_equal(crop_pixels, native_expected), "Native crop changed source pixels"
                inner = crop_pixels[offset_y:offset_y+h, offset_x:offset_x+w]
                assert np.array_equal(inner, expected)
                native_pixel_record = pixel_record(image)
            with Image.open(exact_path) as image:
                assert np.array_equal(np.asarray(image), expected)
                exact_pixel_record = pixel_record(image)
            figures.append({
                "page": page, "id": figure["id"], "box_xywh": figure["box"],
                "rough_box_xywh": figure.get("from"),
                "source": file_record(original), "native_crop": file_record(crop_path),
                "native_padding_px": 12, "native_crop_pixels": native_pixel_record,
                "native_padding": "Native white pad; inner rectangle is exactly original source pixels.",
                "exact_unpadded_crop": file_record(exact_path),
                "exact_unpadded_crop_pixels": exact_pixel_record,
                "source_box_inner_png_mismatched_pixels": 0,
                "native_crop_mismatched_values_including_white_padding": 0,
                "foreign_pixel_removal": False,
                "semantic_and_all_ink_approval": False,
            })
    detail = load(BASE / "evidence/crops/0191-area-formula.json")
    assert detail["mismatched_pixels"] == 0 and detail["resized"] is False
    result = {
        "schema": "same188-6/source-pixel-verification@1",
        "cwd": str(REPO), "book": "9-10g", "pages": pages,
        "prepared_copy_checks": checks, "figures": figures,
        "detail_crops": [detail],
        "verification_invocations": 1,
        "full_page_source_array_comparisons": 4,
        "figure_inner_array_comparisons": 1,
        "crop_mismatched_pixels": 0,
        "passed_native_finalizes_repeated": 0,
        "image_payloads_emitted": 0,
        "approval": False,
    }
    save(BASE / "pixel-verification.json", result)
    return result


def collect() -> None:
    assert Path.cwd() == REPO
    assert not (BASE / "output-index.json").exists(), "Collect completed batch only once"
    verification = verify()
    sys.path.insert(0, str(TOOLS))
    import blocks as B

    predecessor_record = file_record(BASE / "input/predecessor-next-source-author.json")
    predecessor = load(BASE / "input/predecessor-next-source-author.json")
    assert predecessor["physical_page"] == 190 and predecessor_record["sha256"] == PREDECESSOR_SHA
    docs = {page: load(BASE / f"artifacts/9-10g/pages/{page:04d}/page.json") for page in (191, 192)}
    blocks = [block for page in (191, 192) for block in docs[page]["blocks"]]
    counts = Counter(block["kind"] for block in blocks)
    lines = sum(B.printed_lines(docs[page]["blocks"]) for page in (191, 192))
    tail = docs[192]["blocks"][-2]
    assert tail["kind"] == "p" and tail["open"] and not tail["cont"]
    assert B.text_of(tail).endswith("正十二面体")
    assert docs[191]["blocks"][0]["cont"]
    assert B.text_of(docs[191]["blocks"][0]) == "做棱台."
    ex191 = next(block for block in docs[191]["blocks"] if block["kind"] == "ex" and block["label"] == "102")
    ex192 = next(block for block in docs[192]["blocks"] if block["kind"] == "ex" and block["label"] == "102")
    assert ex191["open"] and ex192["cont"] and not ex192["open"]
    joins = [
        {
            "from":"p0190#11 p open", "to":"p0191#1 p cont",
            "status":"OBSERVED_CONTINUATION_AUTHOR_ONLY",
            "prior_bound_text":predecessor["last_text"],
            "source191_first_row":"做棱台.",
            "actual_join_text":predecessor["last_text"] + B.text_of(docs[191]["blocks"][0]),
            "basis":"Actually incomplete190 sentence is completed by actual191 first row, not TOC.",
            "predecessor_modified":False, "predecessor_approved":False,
            "original_predecessor_boundary_HOLD":"Carried verbatim; new observed join does not edit or approve predecessor.",
        },
        {
            "from":"p0191#12 ex102 open", "to":"p0192#3 ex102 cont",
            "status":"OBSERVED_CONTINUATION_AUTHOR_ONLY",
            "actual_join_text":B.text_of(ex191) + B.text_of(ex192),
            "figure":"fig-g10-48",
            "basis":"Actual191 ends 为; actual192 begins 制造 and explicitly excludes A/B claws.",
            "resolution":"Exercise102 closes before printed103.",
            "new_count_exclusion":False,
        },
        {
            "from":"p0192#5 ex104", "to":"p0192#6 h3",
            "status":"OBSERVED_LOCAL_HEADING_BOUNDARY",
            "actual_heading":"§54. 正多面体的概念",
            "basis":"Actual printed heading after104, no TOC consulted.",
            "wholeN53_approval":False,
        },
        {
            "from":"p0192#8 p open", "to":"physical193 unobserved",
            "status":"HOLD_UNSEEN_NEXT_SOURCE",
            "last_content_row":tail["lines"][-1],
            "basis":"Last paragraph actually stops at 正十二面体 without punctuation; no continuation or figure53 invented.",
        },
    ]
    first191 = load(BASE / "FIRST-0191.json")
    first192 = load(BASE / "FIRST-0192.json")
    local_holds = first191["local_HOLDs"] + first192["local_HOLDs"] + [
        {
            "id":"source191192-independent-source-and-wholeunit-approval",
            "status":"NOT_PERFORMED",
            "scope":"191192, N53/N54 and predecessors",
            "reason":"Source author only. Native audits and exact array equality do not approve glyphs, all ink, whole units, readiness, promotion or publishing.",
        },
        {
            "id":"N54-following-figure-ownership-and-right-boundary",
            "status":"HOLD_UNSEEN_PHYSICAL193",
            "scope":"p0192#8 and refs49/50/51/52",
            "reason":"Figure refs49-52 appear in actual192 prose but their images are outside authorized pages. No unseen figure, caption, ownership or right boundary inferred.",
        },
    ]
    inherited_holds = {
        "text_only_predecessor":predecessor_record,
        "local_holds":predecessor["local_holds"],
        "inherited_holds":predecessor["inherited_holds"],
        "qualification":"All original190 and earlier HOLD objects retained verbatim, including historical189 TECHNICAL_RECEIPT_HOLD. Only new191/192 source facts are added separately; no historical HOLD is cleared.",
    }
    image_items = [
        {
            "order":1, "page":191, "purpose":"FIRST full original before page191 template/spec/candidate",
            **file_record(REPO / ".tmp/ld-s10y-lesson/9-10g/pages/0191/page.png"),
        },
        {
            "order":2, "page":191, "purpose":"Targeted exact formula detail once after FIRST, no resize",
            **file_record(BASE / "evidence/crops/0191-area-formula.png"),
        },
        {
            "order":3, "page":192, "purpose":"FIRST full original after191 finalized, before192 template/spec/candidate",
            **file_record(REPO / ".tmp/ld-s10y-lesson/9-10g/pages/0192/page.png"),
        },
        {
            "order":4, "page":192, "purpose":"Final native crop48 once after192 native finalize",
            **file_record(BASE / "work/9-10g/pages/0192/figures/fig-g10-48.png"),
        },
    ]
    image_ledger = {
        "scope":"Fresh author context for physical191/192 only",
        "batch_count":1, "batch_limit":8, "context_limit":24,
        "images_loaded":4, "batch_max_images":4, "cumulative_context_images":4,
        "full_source_originals":2, "source_detail_crops":1, "native_final_crop_views":1,
        "routine_reopens":0, "predecessor_images":0, "additional_source_pages":0,
        "items":image_items,
        "array_decodes":"PIL/numpy evidence is text/hash-only, emits no image payload; not image context loads.",
        "parent_return":"Text and absolute paths/hashes only; no image payloads.",
    }
    counters = {
        "scope":"Local bounded physical191/192 author task; inherited usage below is not reset.",
        "physical_pages_observed":2, "FIRST_inventories":2, "FIRST_revisions":0,
        "initial_candidates":2, "content_revisions":0,
        "targeted_content_repair_budget":1, "targeted_content_repairs_used":0,
        "new_exercise_numbers":["99","100","101","102","103","104"],
        "continuation_numbers":["102"], "unique_exercises_represented":6,
        "exercise_blocks":counts["ex"], "prose_blocks":counts["p"],
        "heading_blocks":counts["h3"], "exercise_heading_blocks":counts["exhead"],
        "figure_blocks":counts["fig"], "caption_blocks":counts["cap"],
        "folio_blocks":counts["foot"], "total_blocks":len(blocks),
        "content_printed_rows":lines-2, "folio_printed_rows":2,
        "native_printed_rows":lines,
        "stored_text_lines":sum(len(block["lines"]) for block in blocks),
        "formula_wrap_markers":sum(line.count(B.WRAP) for block in blocks for line in block["lines"]),
        "samerow_flags":0,
        "figure_visible_label_count":5, "figure_point_letters_assigned":0,
        "open_blocks":["p0191#12 ex102 (paired with observed192)", "p0192#8 p (unseen193)"],
        "cont_blocks":["p0191#1 p (paired with bound text190)", "p0192#3 ex102"],
        "alphabetic_subpart_markers_observed":0, "Cyrillic_subpart_markers_invented":0,
        "native_finalize_invocations":2, "native_finalize_retries":0,
        "native_audits_PASS":2,
        "native_stdout_receipts_captured":2, "native_stdout_receipts_lost":0,
        "native_exit_codes_observed":{"191":0,"192":0},
        "native_line_count_mismatches":0, "native_charset_errors":0, "native_math_errors":0,
        "normalizations":0, "count_exclusions":0, "errata":0,
        "pixel_verification_invocations":1,
        "source_full_page_array_comparisons":4,
        "source_box_inner_png_comparisons":1,
        "mismatched_figure_pixels":0,
        "failed_exec_commands":1,
        "initial_path_inventory_missing_author_directory":1,
        "native_failures":0, "native_wrapper_failures":0,
        "preparation_reruns":0, "git_commands":0, "backend_calls":0,
        "model_calls":0, "paid_calls":0, "independent_review_runs":0,
        "publishes":0, "supervisor_or_peer_messages":0,
    }
    inherited_usage = {
        "bound_predecessor":predecessor_record,
        "predecessor_counters_verbatim":predecessor["cumulative_counters"],
        "predecessor_image_ledger_verbatim":predecessor["image_ledger"],
        "known_189_to_192_totals":{
            "scope":"Numeric sum of bound predecessor189/190 plus local191/192 only, not earlier invocation lifetime.",
            "pages_observed":4, "FIRST_inventories":4,
            "images_loaded_across_separate_author_contexts":8,
            "content_revisions":0, "native_finalize_invocations":4,
            "native_audits_PASS":4, "native_stdout_receipts_captured":3,
            "native_stdout_receipts_lost":1,
            "native_exit_codes_observed":{"189":None,"190":0,"191":0,"192":0},
            "native_printed_rows":predecessor["cumulative_counters"]["native_printed_rows"]+lines,
            "failed_exec_commands":predecessor["cumulative_counters"]["failed_exec_commands"]+1,
            "count_exclusions":0, "errata":0, "model_calls":0, "paid_calls":0,
            "independent_review_runs":0, "publishes":0,
        },
        "earlier_numeric_usage":"Not supplied in predecessor metadata; not guessed or reset. Original earlier HOLDs remain nested in inherited_holds.",
    }
    report = {
        "schema":"same188-6/source-author-report@1",
        "ticket":"STEMROBIN-188", "invocation":"SAME188-6", "role":"SOURCE AUTHOR",
        "book":"9-10g", "physical_pages":[191,192], "printed_pages":[184,185],
        "cwd":str(REPO), "sole_write_scope":str(BASE),
        "status":"BOUNDED_AUTHOR_COMPLETE_WITH_HOLDS",
        "author_qualification":"191 native exit0 audit24/24;192 native exit0 audit18/18; exact source crop48. SOURCE AUTHOR only.",
        "authorization":"Continue same invocation; prepared inputs reused exactly; no setup/freshness/Grill, passed-stage rerun, git, backend, DB, credentials, dependencies, paid/model services, core resources or messages.",
        "native_entry_contract":{
            "function":"p2c.cmd_finalize", "python":str(REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
            "root":str(BASE / "artifacts"), "work":str(BASE / "work"),
            "reason_for_function_entry":"CLI main calls git rev-parse; no Git permitted. Native function and existing book/output-owner guards used with explicit paths.",
            "receipt_streams_and_directory_created_before_native":True,
            "native_cli_main_called":False,
            "PYTHONDONTWRITEBYTECODE":"1",
        },
        "prepared_inputs":"Original png/grid/layout/template and existing preparation logs copied byte-for-byte; no prepare run.",
        "predecessor":predecessor_record,
        "pages":verification["pages"], "figures":verification["figures"],
        "pixel_verification":file_record(BASE / "pixel-verification.json"),
        "FIRST_order":"191 original -> FIRST191 frozen -> template/candidate -> exact formula crop -> native191 once;192 original -> FIRST192 frozen -> template/candidate -> native192 once -> native48 crop once.",
        "FIRST_preservation":"Both inventories unchanged after first freeze; receipt hashes match current FIRST files.",
        "joins":joins,
        "observed_boundaries":[
            "190 actual incomplete definition completes on191 with 做棱台.",
            "102 continues191->192, closes before103, and owns actual48.",
            "Actual§54 heading after104 establishes a local N53/N54 boundary.",
            "Actual192 last prose is incomplete and open to unread193.",
        ],
        "repair_policy":{
            "one_repeat_only_targeted_content_repair_limit":1,
            "repairs_used":0, "repairs_needed":False,
            "passed_native_finalizes_repeated":False,
            "initial_candidates_retained":True,
        },
        "failure_preservation":{
            "local_failure":file_record(BASE / "receipts/initial-discovery-failure.json"),
            "native_failures":[],
            "historical189":"Native26/26, lost stdout/stderr/exit TECHNICAL_RECEIPT_HOLD preserved verbatim from bound metadata; no native rerun or invented recovery.",
        },
        "local_holds":local_holds, "inherited_holds":inherited_holds,
        "image_ledger":image_ledger, "cumulative_counters":counters,
        "inherited_numeric_usage":inherited_usage,
        "next_source_author_path":str(BASE / "next-source-author.json"),
        "output_index_path":str(BASE / "output-index.json"),
        "independent_review_performed":False, "all_ink_PASS":False,
        "wholeunit_approval":False, "readiness_assessed":False,
        "promoted":False, "published":False,
        "stop":"Bounded author task complete; no193 read, downstream work, promotion or peer/supervisor message.",
    }
    save(BASE / "report.json", report)
    markdown = (
        "# SAME188-6 Source Author: physical191/192\n\n"
        "STEMROBIN-188; book9-10g; printed184/185. Bounded author complete with HOLDs. "
        "No independent source, all-ink, whole-unit or promotion approval.\n\n"
        "## Native Results\n\n"
        "- 191: native exit0, 24/24 lines, 13 blocks, no figure, no native errors.\n"
        "- 192: native exit0, 18/18 lines, 9 blocks, figure48, no native errors.\n"
        "- Exactly one native finalize per page; both raw stdout/stderr/exit receipts saved. "
        "Receipt directories and streams existed before native execution.\n"
        "- Existing p2c.cmd_finalize used directly with explicit local root/work; "
        "CLI main was not called because its guard invokes prohibited Git.\n\n"
        "## Actual Joins And Boundaries\n\n"
        "- Bound190 p0190#11 ends 这样的多面体叫;191 p0191#1 actually says 做棱台. "
        "The sentence completes without predecessor edits or approval.\n"
        "- 191 p0191#12 ex102 ends 为;192 p0192#3 begins 制造 and completes the iron-sheet question, "
        "explicitly excluding claws A/B. Actual48 is retained and belongs to102.\n"
        "- Exercises103/104 complete, then actual p0192#6 heading is §54. 正多面体的概念. "
        "This is a local boundary only, not wholeN53 approval.\n"
        "- Last content object is p0192#8 p, open=true, cont=false; it ends 正十二面体 "
        "without punctuation.193 remains unseen.\n\n"
        "## Pixel Evidence And FIRST\n\n"
        "- Original191 and192 opened one at a time before their own templates/specs/candidates. "
        "Both FIRST inventories frozen unchanged. Prepared inputs reused byte-exact; no prepare.\n"
        "- Figure48 exact source box [542,213,435,448]; native PNG has12px white padding. "
        "Inner rectangle and exact unpadded crop have zero pixel mismatches. "
        "275/125/200 and tabs A/B retained; no geometric point letters assigned.\n"
        "- Source191 formula detail [465,815,430,100] is unresized and pixel-exact; tiny subscripts "
        "remain glyphHOLD. Pixel equality is not semantic approval.\n\n"
        "## Usage And HOLDs\n\n"
        "- Fresh context4/24 images, one batch4/8.2 originals,1 formula detail,1 native crop; "
        "no reopens, predecessor images or193.\n"
        "- Local2 FIRSTs,2 initial candidates,0 content repairs of the one-repair limit; "
        "2 native finalizes,42 printed rows,2 real formula wrap markers;0 exclusions/errata.\n"
        "- Known189-192 total:4 pages,8 images across separate contexts,4 native audits, "
        "3 captured native receipts and1 historical lost receipt; earlier usage not guessed/reset.\n"
        "- One initial read-only ls exited1 because author directory did not yet exist; "
        "observed failure retained. Native failures0.\n"
        "- All original predecessor HOLDs retained verbatim, including189 "
        "TECHNICAL_RECEIPT_HOLD26/26 with missing native stdout/exit. No historical reruns or guessed receipts.\n"
        "- Local tiny glyph, underline/margin/all-ink and figure48 dense-ink HOLDs remain. "
        "Historical boundary HOLDs are unchanged; new observed joins are separate facts.\n"
        "- No core writes, Git, DB/backend, credentials, dependencies, paid/model services, "
        "supervisor/peer messages, independent review, promotion or publishing.\n\n"
        "## Files\n\n"
        f"- Report: `{BASE / 'report.json'}`\n"
        f"- Index: `{BASE / 'output-index.json'}`\n"
        f"- Next tail: `{BASE / 'next-source-author.json'}`\n"
        f"- Pixel verification: `{BASE / 'pixel-verification.json'}`\n\n"
        "All paths/hashes and receipt bindings are in report.json and output-index.json. "
        "Return only text and absolute paths/hashes; stop after this bounded author task.\n"
    )
    owned(BASE / "report.md").write_text(markdown, encoding="utf-8")
    tail_obj = {"ref":"p0192#8", **tail}
    next_payload = {
        "schema":"same188-6/next-source-author-tail@1",
        "ticket":"STEMROBIN-188", "invocation":"SAME188-6", "role":"SOURCE AUTHOR",
        "book":"9-10g", "physical_page":192, "printed_page":185, "numbering_scope":"g10",
        "block_ref":"p0192#8", "kind":"p", "type":"p", "label":None,
        "cont":False, "open":True, "samerow":False,
        "open_basis":"Actually incomplete prose ends 正十二面体 without punctuation; not a provisional unseen-boundary assumption.",
        "last_text":B.text_of(tail), "full_text":B.text_of(tail),
        "exact_last_object_lines":tail["lines"], "actual_tail_object":tail_obj,
        "literal_last_page_block":{"ref":"p0192#9", **docs[192]["blocks"][-1]},
        "last_printed_row":tail["lines"][-1],
        "last_sentence_complete_from_pixels":False,
        "actual_heading_observed":"§54. 正多面体的概念", "actual_heading_ref":"p0192#6",
        "figure_refs":["fig-g10-49","fig-g10-50","fig-g10-51","fig-g10-52"],
        "next_physical_page":193, "next_page_read":False, "next_heading_seen":False,
        "boundary_status":"HOLD_UNSEEN_PHYSICAL193_INCOMPLETE_PARAGRAPH",
        "next_author_instruction":"Only after separate direct authorization, inspect actual193 full original FIRST before its template/spec/candidate. Use this192 tail as text-only context; do not reopen predecessor images. Determine continuation and figure ownership from193 pixels, never TOC. Do not modify or approve predecessor. Retain every original HOLD including historical189 missing stdout/exit receipt.",
        "bound_previous_tail":predecessor_record,
        "local_holds":local_holds, "inherited_holds":inherited_holds,
        "joins":joins, "image_ledger":image_ledger,
        "cumulative_counters":counters, "inherited_numeric_usage":inherited_usage,
        "page_png":verification["pages"][1]["retained"],
        "page_pixel_sha256":verification["pages"][1]["pixels"]["pixel_sha256"],
        "page_md":verification["pages"][1]["page_md"],
        "page_json":verification["pages"][1]["page_json"],
        "audit":verification["pages"][1]["audit"],
        "FIRST":verification["pages"][1]["FIRST"],
        "initial_candidate":verification["pages"][1]["initial_candidate"],
        "native_receipt":verification["pages"][1]["native_receipt"],
        "pixel_verification":file_record(BASE / "pixel-verification.json"),
        "exact_crops":verification["figures"],
        "report":file_record(BASE / "report.json"),
        "author_qualification":report["author_qualification"],
        "independent_review_performed":False, "all_ink_PASS":False,
        "wholeunit_approval":False, "readiness_assessed":False,
        "promoted":False, "published":False,
    }
    save(BASE / "next-source-author.json", next_payload)
    files = [
        file_record(path) for path in sorted(BASE.rglob("*"))
        if path.is_file() and path.name != "output-index.json"
    ]
    index = {
        "schema":"same188-6/hash-bound-output-index@1",
        "ticket":"STEMROBIN-188", "invocation":"SAME188-6", "book":"9-10g",
        "role":"SOURCE AUTHOR", "cwd":str(REPO), "sole_write_scope":str(BASE),
        "bound_predecessor":predecessor_record,
        "status":"BOUNDED_AUTHOR_COMPLETE_WITH_HOLDS",
        "files":files, "file_count":len(files),
        "index_self_hash":"Intentionally external: final text returns index SHA256; no circular self-binding.",
        "independent_review_performed":False, "all_ink_PASS":False,
        "wholeunit_approval":False, "promoted":False, "published":False,
    }
    save(BASE / "output-index.json", index)
    for record in files:
        assert file_record(Path(record["path"])) == record
    assert file_record(BASE / "input/predecessor-next-source-author.json")["sha256"] == PREDECESSOR_SHA
    print(json.dumps({
        "status":report["status"], "pages":{"191":"24/24 exit0","192":"18/18 exit0"},
        "image_context":4, "content_repairs":0, "indexed_files":len(files),
        "deliverables":[file_record(BASE / name) for name in
                        ("report.json","report.md","output-index.json","next-source-author.json")],
        "next_tail":tail_obj, "native_figures":verification["figures"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    collect()
