from pathlib import Path
import hashlib
import json
import sys
from datetime import datetime, timezone

ROOT = Path.cwd()
assert str(ROOT) == "/Users/yong/.codex/worktrees/d9b1/lemmadeck"
OWNED = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source228-234-review"
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/source228-234-author"
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def binding(path):
    path = Path(path)
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": path.stat().st_size,
    }


def write_json(name, data):
    target = OWNED / name
    assert not target.exists(), f"Do not replace earlier evidence: {target}"
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return target


source_counts = {228: 22, 229: 22, 230: 20, 231: 22, 232: 22, 233: 23, 234: 25}
source_block_rows = {
    228: [5, 3, 2, 2, 2, 1, 3, 3, 1],
    229: [3, 3, 5, 6, 4, 1],
    230: [2, 4, 6, 4, 3, 1],
    231: [1, 2, 3, 3, 2, 2, 6, 2, 1],
    232: [1, 5, 3, 2, 7, 3, 1],
    233: [1, 3, 2, 1, 3, 4, 3, 3, 2, 1],
    234: [1, 3, 3, 3, 2, 2, 4, 4, 1, 1, 1],
}
observations = {
    228: "Theorem2 continuation, two proof steps, conclusion, example1 complete, example2 open. All 21 content rows present.",
    229: "Example2 complete; examples3-5 complete; example6 open. Middle numerator33 independently confirmed and correctly registered as erratum. All 21 content rows present.",
    230: "Example6 complete; example7 complete; exercises777/778 complete;779 open. All 19 content rows present.",
    231: "779 complete;780-785 complete; printed736 open. Label736 is independently settled, not786. All 21 content rows present.",
    232: "Printed736 complete;737 and738 labels settled, not787/788;789/790 complete;791 open. All 21 content rows present, but738(a) exponent is wrong.",
    233: "791 complete;792/793, review heading,794-798 all complete. Parallel796 systems use two shared equation rows;798 uses two rows. All 22 content rows present.",
    234: "Unit38 starts; table discussion is prose, not a printed figure/table; final introduction for7.34^2 is open. All 24 content rows present.",
}
author_report = json.loads((AUTHOR / "source228-234-author.json").read_text(encoding="utf-8"))
author_pages = {item["page"]: item for item in author_report["pages"]}
pages = []
observed_hashes = {}
for number in range(228, 235):
    directory = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/7a/pages/{number:04d}"
    files = {name: binding(directory / name) for name in ("page.md", "page.json", "audit.json")}
    for item in files.values():
        observed_hashes[item["path"]] = item["sha256"]
    meta, parsed_blocks = blocks.load(directory / "page.md")
    page_json = json.loads((directory / "page.json").read_text(encoding="utf-8"))
    audit = json.loads((directory / "audit.json").read_text(encoding="utf-8"))
    assert meta == page_json["meta"]
    assert parsed_blocks == page_json["blocks"]
    actual_block_rows = [blocks.printed_lines([block]) for block in parsed_blocks]
    assert actual_block_rows == source_block_rows[number]
    assert sum(source_block_rows[number]) == source_counts[number]
    assert audit["lines_md"] == source_counts[number]
    assert not any(block["kind"] in ("fig", "cap") for block in parsed_blocks)
    assert meta["figures"] == [] and audit["figures"] == []
    first = AUTHOR / f"source-author-p{number:04d}-FIRST.receipt.json"
    receipt = json.loads(first.read_text(encoding="utf-8"))
    expected_exit = 1 if number in (229, 233) else 0
    assert receipt["cwd"] == str(ROOT) and receipt["exit"] == expected_exit
    assert receipt["command"][3:8] == ["finalize", "--book", "7a", "--page", str(number)]
    receipt_streams = []
    for stream in receipt["streams"]:
        stream_binding = binding((ROOT / stream["path"]).resolve())
        assert stream_binding["sha256"] == stream["sha256"]
        receipt_streams.append(stream_binding)
    first_hashes_match = all(
        files[Path(item["path"]).name]["sha256"] == item["sha256"]
        for item in author_pages[number]["files"]
    )
    assert first_hashes_match
    status = (
        "source-defect" if number == 232
        else "source-pass-gate-failed" if number in (229, 233)
        else "passed-unchanged"
    )
    grid = binding(ROOT / f".tmp/ld-s10y-lesson/7a/pages/{number:04d}/page.grid.png")
    raster = binding(ROOT / f".tmp/ld-s10y-lesson/7a/pages/{number:04d}/page.png")
    assert raster["sha256"] == meta["render"]["sha256"]
    boundary_blocks = [
        {"ref": f"p{number:04d}#{index}", "kind": block["kind"],
         "label": block["label"], "open": block["open"], "cont": block["cont"]}
        for index, block in enumerate(parsed_blocks, 1)
        if block["open"] or block["cont"] or block["kind"] == "h3"
    ]
    pages.append({
        "physical_page": number,
        "printed_page": number - 6,
        "status": status,
        "files": files,
        "same_hashes_as_author_FIRST": first_hashes_match,
        "md_json_meta_and_blocks_equal": True,
        "source_grid": {**grid, "model_opens": 1},
        "source_raster": {**raster, "direct_model_opens": 0},
        "layout_evidence": binding(ROOT / f".tmp/ld-s10y-lesson/7a/pages/{number:04d}/layout.json"),
        "independent_physical_rows_including_footer": source_counts[number],
        "independent_content_rows": source_counts[number] - 1,
        "independent_rows_by_block": [
            {"ref": f"p{number:04d}#{index}", "rows": count}
            for index, count in enumerate(source_block_rows[number], 1)
        ],
        "artifact_rows": audit["lines_md"],
        "detected_rows_not_source_truth": audit["lines_printed"],
        "audit_errors": audit["errors"],
        "first_finalize": {"exit": receipt["exit"], "receipt": binding(first), "streams": receipt_streams},
        "source_figure_count": 0,
        "artifact_figure_and_caption_count": 0,
        "boundary_blocks": boundary_blocks,
        "source_observation": observations[number],
    })

findings = [
    {
        "id": "p0232-ex738-a-exponent",
        "priority": 1,
        "type": "actual-transcription-defect",
        "page": 232,
        "block_ref": "p0232#3",
        "subquestion": "а",
        "page_md_line": 49,
        "page_json_pointer": "/blocks/2/lines/1",
        "source_region_xyxy_approx": [405, 958, 459, 1000],
        "source": r"$\sqrt{2^6\times3^4}$",
        "current": r"$\sqrt{2^8\times3^4}$",
        "evidence": "The superscript on the left2 is6 in the original grid opened once before comparison; it has the same open upper stroke/lower loop as the other6 exponents on this page, not an8.",
        "effect": "Changes the mathematical question; a green row/charset/KaTeX audit did not prove source fidelity.",
        "required_action": "Owner must correct only the affected faithful text and generated projection, retain FIRST receipt, and obtain affected-only verification. This reviewer performed no edit, retry or approval.",
    },
    {
        "id": "p0229-spurious-radical-overbar-row",
        "priority": 2,
        "type": "line-detector-defect-not-missing-source-text",
        "page": 229,
        "block_ref": "p0229#5",
        "layout_band_index_1based": 21,
        "layout_band_y_inclusive": [1888, 1892],
        "independent_physical_rows_including_footer": 22,
        "current_detector_rows": 23,
        "diagnosis": "This five-pixel strip is the upper radical/overbar component of the concluding quotient identity centered near1940, not another printed text row. It belongs with detector band[1907,1982]. Nested fractions share their horizontal text row.",
        "genuine_wrap": {"block_ref": "p0229#3", "row_centers": [1018, 1086],
                         "source": r"7\times(-a) followed on the next row by =-7a",
                         "marker_correct": True},
        "no_missed_source_text": True,
        "required_action": "Repair the counter under separate ownership with independent positive/negative row cases; do not add text, blanks or fake wrap markers. Gate remains failed; no rerun here.",
    },
    {
        "id": "p0233-parallel-system-overexpansion",
        "priority": 2,
        "type": "line-detector-defect-not-missing-source-text",
        "page": 233,
        "block_ref": "p0233#7",
        "layout_band_indices_1based": [16, 17, 18],
        "layout_bands_y_inclusive": [[1348, 1395], [1396, 1443], [1444, 1491]],
        "source_region_xyxy_approx": [295, 1348, 1120, 1492],
        "independent_equation_rows": 2,
        "independent_equation_row_centers": [1389, 1474],
        "independent_physical_rows_including_footer": 23,
        "current_detector_rows": 24,
        "diagnosis": "Brace-connected parallel systems spanning1348-1491 were expanded into three evenly divided bands. The top two bands both contain parts of the same first-equation row, including the fraction denominators and vertically centered subquestion labels. Second equations occupy one further shared row. There is no third equation and no missing text.",
        "marker_correct": "Two aligned environments preserve both systems; only one ↵ counts their shared vertical wrap, giving two equation rows rather than four.",
        "genuine_wrap": {"block_ref": "p0233#9", "row_centers": [1783, 1910],
                         "marker_correct": True, "exercise798_complete": True},
        "single_tall_fraction_control": {"block_ref": "p0233#3", "row_center": 603,
                                         "physical_rows": 1},
        "no_missed_source_text": True,
        "required_action": "Repair the counter under separate ownership; preserve all equations and real798 wrap. Gate remains failed; no retry or self approval.",
    },
]

settled = [
    {"page": 229, "block_ref": "p0229#2", "region_xyxy": [520, 630, 970, 775],
     "middle_numerator": 33, "not": 36, "status": "correctly-preserved-source-misprint",
     "erratum_id": "p0229-math-1",
     "source": r"$\sqrt{\frac{36}{169}}=\frac{\sqrt{33}}{\sqrt{169}}=\frac{6}{13}$"},
    {"page": 231, "block_ref": "p0231#8", "region_xyxy_approx": [205, 1805, 291, 1840],
     "printed_label": "736", "not": "786", "status": "source-numbering-anomaly-preserved",
     "continuation_to": "p0232#1"},
    {"page": 232, "block_ref": "p0232#2", "region_xyxy_approx": [210, 392, 292, 431],
     "printed_label": "737", "not": "787", "status": "source-numbering-anomaly-preserved"},
    {"page": 232, "block_ref": "p0232#3", "region_xyxy_approx": [210, 895, 297, 933],
     "printed_label": "738", "not": "788", "status": "source-numbering-anomaly-preserved"},
]
continuations = [
    {"from": "p0227 last p open", "to": "p0228#1 p cont",
     "basis": "User-supplied accepted textual boundary plus independently inspected228 pixels;227 not reopened."},
    {"from": "p0228#8 p open", "to": "p0229#1 p cont", "object": "example2"},
    {"from": "p0229#5 p open", "to": "p0230#1 p cont", "object": "example6"},
    {"from": "p0230#5 ex779 open", "to": "p0231#1 ex779 cont", "object": "exercise779"},
    {"from": "p0231#8 ex736 open", "to": "p0232#1 ex736 cont", "object": "printed736"},
    {"from": "p0232#6 ex791 open", "to": "p0233#1 ex791 cont", "object": "exercise791"},
    {"from": "p0233#9 ex798 closed", "to": "p0234#1 h3 unit38",
     "object": "798 complete; new unit38 starts without798 carryover"},
    {"from": "p0234#10 p open", "to": "unread235",
     "last_source_phrase": "我们利用普通的乘法求 $7.34^2$ 的值：",
     "next_page_uninspected": True},
]
crop = json.loads((OWNED / "crop-receipt.json").read_text(encoding="utf-8"))
assert binding(crop["crop"])["sha256"] == crop["crop_sha256"]
report = {
    "schema": "ld-s10y-independent-source-review@1",
    "ticket": "STEMROBIN-182",
    "role": "fresh-independent-source228-234-reviewer",
    "created_at": datetime.now(timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "assigned_branch": "codex/STEMROBIN-182-textbooks",
    "branch_evidence": "Local ticket.json only; git operations forbidden and not performed.",
    "finish": "review",
    "offline_production_invocation": "Continuation of supplied invocation, not a new production/recovery capability.",
    "book": "7a",
    "status": "hold",
    "source_approval": False,
    "summary": {
        "passed_unchanged": [228, 230, 231, 234],
        "source_faithful_but_FIRST_gate_failed": [229, 233],
        "actual_content_defect": [232],
        "source_content_rows": 149,
        "source_physical_rows_including_footers": 156,
        "source_figures": 0,
        "missing_source_text_found": False,
        "detector_false_positive_rows": 2,
    },
    "source_first": {
        "recorded_before_target_md_json_audit_and_author_report_reads": True,
        "evidence": binding(OWNED / "source-observations.md"),
        "recording_note": "Original notebook preserved, including preliminary shorthand; reconciliation clarifications below do not rewrite the pre-comparison evidence.",
        "notebook_reconciliation": [
            "Page234 display has4.840, not notebook shorthand4.84. The original grid already loaded shows trailing0; current artifact is faithful and no extra image was opened.",
            "Page233 notebook colon-like pixel notation0:2 and15:2 denotes the rough printed decimal dots; final source readings are0.2 and15.2. Current artifact is faithful.",
            "Page232 exponent defect was identified by comparing authored text with the original grid already loaded, without reopening/cropping; pre-comparison notebook did not enumerate this exponent.",
        ],
    },
    "image_budget": {
        "grid_opens": 7, "targeted_crop_opens": 1, "total_model_opens": 8,
        "reopens": 0, "image_payloads_returned_to_parent": False,
        "crop": crop, "crop_receipt": binding(OWNED / "crop-receipt.json"),
        "no_other_image_open": True,
    },
    "settled_source_questions": settled,
    "findings": findings,
    "continuation_checks": {"status": "pass-with-unread-external-boundaries", "pairs": continuations},
    "figure_ownership": {
        "independently_verified_zero_on_each_of_seven_pages": True,
        "artifact_figures_and_captions_zero": True,
        "page233_ex794_ex795": "Requests to draw graphs; no supplied source graph to extract or own.",
        "page234": "Square-table references and numerical examples are text; no actual printed table to extract.",
        "missing_figure_owner": False,
    },
    "pages": pages,
    "existing_evidence_reused_without_rerun": {
        "author_report": binding(AUTHOR / "source228-234-author.json"),
        "author_md": binding(AUTHOR / "source228-234-author.md"),
        "all_21_current_artifact_hashes_equal_author_FIRST": True,
        "receipt_location": str(AUTHOR),
        "receipt_streams_verified": True,
        "ticket_metadata": binding(ROOT / ".intentfold/tickets/STEMROBIN-182/ticket.json"),
        "tool_reads_only": [
            binding(ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"),
            binding(ROOT / ".claude/skills/ld-s10y-lesson/tools/blocks.py"),
            binding(ROOT / ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
        ],
    },
    "restrictions": {
        "owned_write_root": str(OWNED), "source_artifact_edits": 0,
        "tool_index_lesson_edits": 0, "prepare_invocations": 0, "finalize_invocations": 0,
        "assembly_db_publisher_app_dependency_git_network_operations": 0,
        "new_chats_or_agents": 0, "retries": 0, "self_approvals": 0,
    },
}

md = [
    "# 7a Physical228-234 Independent Source Review",
    "",
    "**HOLD:** actual transcription defect on232; FIRST gates229/233 remain failed.",
    "Offline, finish: review. All operations used the assigned d9b1 checkout; writes only in this reviewer scratch directory.",
    "",
    "## Findings",
    "",
    "- **P1, p0232#3,738(а), page.md:49:** source `sqrt(2^6*3^4)`; current `sqrt(2^8*3^4)`. Superscript6 at approximately x435-451,y960-982 was misread as8. Current md/json agree on the wrong exponent; FIRST exit0 is not source approval.",
    "- **P2, p0229#5:** source22 rows including footer; detector23. Band[1888,1892] is the final radical's overbar fragment, not missing text; it belongs to the formula band[1907,1982].",
    "- **P2, p0233#7:** source23 rows including footer; detector24.796 has two shared equation rows, not three. Detector splits1348-1491 into[1348,1395],[1396,1443],[1444,1491]; the middle band is not a new equation/text row.",
    "",
    "## Settled Source",
    "",
    "- **229 example3, p0229#2:** middle numerator is definitively33, not36. Sole crop[520,630,970,775] confirms it. Existing erratum `p0229-math-1` correctly preserves the mathematical source misprint.",
    "- **231/232:** printed labels736/737/738, not786/787/788. Preserve them; numbering-sequence expectation is not pixel evidence. Source positions and block refs are in JSON.",
    "- **229:**21 content rows; example4's `=-7a` is a genuine second row, correctly marked. Tall/nested fractions are single rows. Every source text row is present.",
    "- **233:**22 content rows.793's parallel radicals occupy one row;794 prompt occupies2;795 prompt2 plus subquestions2;796 prompt1 plus systems2;797 occupies3;798 occupies2 and ends completely. No missed source text.",
    "- Original notebook shorthand4.84 on234 omitted the visible trailing0; final pixel reading is4.840, correctly retained. Notebook0:2/15:2 on233 represents rough decimal dots; final readings0.2/15.2 are faithful. No images reopened.",
    "",
    "## Boundaries And Figures",
    "",
    "- Accepted227 theorem2 open ->228 cont; example2:228->229; example6:229->230;779:230->231; printed736:231->232;791:232->233. All current open/cont markers match.",
    "-233 completes798;234 starts unit38.234 ends `我们利用普通的乘法求 $7.34^2$ 的值：` with p open. Neither227 nor235 pixels were opened.",
    "- **Zero figures independently verified on all7 pages.**233 asks learners to draw graphs but supplies none;234 discusses square tables without printing one. No figure/caption/ownership gap.",
    "",
    "## Current Hash-Bound Verdicts",
    "",
    "|Physical|Printed|Source rows incl. footer|FIRST exit|Verdict|",
    "|---|---|---|---|---|",
]
for item in pages:
    md.append(
        f"|{item['physical_page']}|{item['printed_page']}|"
        f"{item['independent_physical_rows_including_footer']}|"
        f"{item['first_finalize']['exit']}|{item['status']}|"
    )
md += [
    "",
    "Each line below lists SHA256 in `page.md / page.json / audit.json` order. Full absolute paths, image hashes, receipt hashes, per-block physical rows and parity checks are in JSON.",
    "",
]
for item in pages:
    md.append(
        f"- {item['physical_page']}: "
        + " / ".join(f"`{item['files'][name]['sha256']}`" for name in ("page.md", "page.json", "audit.json"))
    )
md += [
    "",
    "## Evidence",
    "",
    "- `source-observations.md` was saved before target artifacts or author reports were read; its hash binds the independent notebook.",
    "- Visual loads:7 unique grid opens +1 unique crop open =8;0 reopens. JSON binds each grid and the crop.",
    "- All21 current md/json/audit hashes equal the author FIRST report. Existing FIRST receipts and their stdout/stderr hashes were verified in source228-234-author, not stages.",
    "- Passed unchanged:228,230,231,234. Source-faithful but gates failed:229,233. Real content defect:232.",
    "- No source/tool/index/lesson edits, production reruns, retries, assembly, DB, publishers, app, dependencies, git, network, new chats/agents or self approval. Retain FIRST failures; owner-only affected repair remains required.",
]
md_path = OWNED / "source228-234-review.md"
assert not md_path.exists()
md_path.write_text("\n".join(md) + "\n", encoding="utf-8")
report_path = write_json("source228-234-review.json", report)

unchanged = all(
    binding(path)["sha256"] == digest for path, digest in observed_hashes.items()
)
assert unchanged, "Concurrent artifact drift: do not publish stale review"
manifest = write_json("report-hashes.json", {
    "schema": "source-review-evidence-bindings@1",
    "reports": [binding(report_path), binding(md_path), binding(OWNED / "source-observations.md")],
    "current_artifact_hashes_rechecked_after_report_write": True,
    "all_21_unchanged_during_collection": unchanged,
    "images_opened": 8,
})
print(json.dumps({
    "status": report["status"],
    "passed_unchanged": report["summary"]["passed_unchanged"],
    "source_faithful_gate_failed": [229, 233],
    "content_defect": [232],
    "all_21_artifact_hashes_equal_FIRST_and_stable": unchanged,
    "reports": [binding(report_path), binding(md_path)],
    "manifest": binding(manifest),
}, ensure_ascii=False))
