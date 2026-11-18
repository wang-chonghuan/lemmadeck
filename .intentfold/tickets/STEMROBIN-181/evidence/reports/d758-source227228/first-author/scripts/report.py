from pathlib import Path
import hashlib
import json
import re


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWN = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d741-source227228-first-author"
REPORTS = OWN / "reports"
PREPARED = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d740-source227228-first-preparation/work/10p/pages"
TAIL = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d731-source225226-first-author/root/10p/pages/0226/page.md"
assert Path.cwd().resolve() == REPO
output = REPORTS / "report.json"
if output.exists():
    raise SystemExit("Report already exists; refusing to repeat evidence collection.")


def sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def evidence(path):
    return {"path": str(path), "sha256": sha(path), "bytes": path.stat().st_size}


inventories = {
    227: {
        "id": "fig-199",
        "source_label": "图 199",
        "visible_subfigures": 1,
        "objects": [
            "One plano-convex lens with a straight upper surface and curved lower surface.",
            "One horizontal glass plate, touching the lens at its lower central region.",
            "One downward incident ray with an arrowhead.",
            "Two upward emerging rays, each with an arrowhead and its printed numerical label.",
            "Printed hatching inside the lens and underneath the plate, retained by tracing.",
        ],
        "labels": [{"text": "1", "count": 1}, {"text": "2", "count": 1}],
        "arrowheads": 3,
        "table_rows": None,
        "table_columns": None,
        "grid_rows": None,
        "grid_columns": None,
        "layout_note": "No source table or grid. The coordinate grid is inspection-only, not textbook content.",
        "caption_block": "p0227#7",
        "caption_samerow": True,
        "source_prose_blocks": ["p0227#5", "p0227#8"],
        "raw_crop_viewed": True,
        "crop_complete_no_prose_or_caption_intrusion": True,
    },
    228: {
        "id": "fig-200",
        "source_label": "图 200",
        "visible_subfigures": 1,
        "objects": [
            "One plano-convex lens over one horizontal glass plate, with their central contact retained.",
            "A slanted radius segment and a vertical radius segment meet at the same upper vertex.",
            "Each radius segment has its own printed R label.",
            "A horizontal radial-distance segment from the left selected surface point towards the vertical radius is labelled r_k.",
            "A short thickness indicator and leader at the left selected gap are labelled h_k.",
            "Printed hatching inside the lens and underneath the plate, retained by tracing.",
        ],
        "labels": [
            {"text": "R", "count": 2},
            {"text": "r_k", "count": 1},
            {"text": "h_k", "count": 1},
        ],
        "arrowheads": 0,
        "table_rows": None,
        "table_columns": None,
        "grid_rows": None,
        "grid_columns": None,
        "layout_note": "No source table or grid. The geometric triangle, lens boundaries and thickness marks are source content.",
        "caption_block": "p0228#7",
        "caption_samerow": True,
        "source_prose_blocks": ["p0228#5", "p0228#8"],
        "raw_crop_viewed": True,
        "crop_complete_no_prose_or_caption_intrusion": True,
    },
}

pages = []
receipts = []
for page in (227, 228):
    page_dir = OWN / "root/10p/pages" / f"{page:04d}"
    page_data = json.loads((page_dir / "page.json").read_text())
    audit = json.loads((page_dir / "audit.json").read_text())
    for stage in ("finalize", "vectorize"):
        receipt_path = REPORTS / f"p{page:04d}-{stage}.json"
        receipt = json.loads(receipt_path.read_text())
        if receipt["status"] != "passed" or receipt["exit_code"] != 0 or receipt["native_calls"] != 1:
            raise SystemExit(f"Failed or replayed native stage: {receipt_path}")
        receipts.append({**receipt, "receipt": evidence(receipt_path)})
    finalize = receipts[-2]
    if not finalize["literal_text_and_flags_preserved"] or audit["errors"]:
        raise SystemExit(f"Native source evidence failed: {page_dir}")
    vector_stdout = Path(receipts[-1]["stdout"]).read_text()
    mismatch = re.search(r"不匹配 ([0-9.]+)%", vector_stdout)
    if not mismatch:
        raise SystemExit("Missing native mismatch evidence; no producer replay permitted.")
    figure = audit["figures"][0]
    if len(audit["figures"]) != 1 or figure["id"] != inventories[page]["id"]:
        raise SystemExit("Observed figure inventory does not match native outputs.")
    figure_dir = OWN / "work/10p/pages" / f"{page:04d}/figures"
    figures = {
        **inventories[page],
        "native_box_xywh": figure["box"],
        "png": evidence(figure_dir / f"{figure['id']}.png"),
        "svg": evidence(figure_dir / f"{figure['id']}.svg"),
        "native_mismatch_percent_reported": float(mismatch.group(1)),
        "native_mismatch_limit_percent": 2,
        "native_vectorize_passed": True,
    }
    pages.append({
        "physical_page": page,
        "printed_page": page_data["meta"]["printed_page"],
        "blocks": len(page_data["blocks"]),
        "lines_printed": audit["lines_printed"],
        "lines_md": audit["lines_md"],
        "normalization_count": len(audit["normalizations"]),
        "unknown_char_count": len(audit["unknown_chars"]),
        "katex_warnings": audit["katex_warnings"],
        "literal_text_and_flags_preserved": finalize["literal_text_and_flags_preserved"],
        "page_md": evidence(page_dir / "page.md"),
        "page_json": evidence(page_dir / "page.json"),
        "audit": evidence(page_dir / "audit.json"),
        "literal_authored_snapshot": evidence(REPORTS / f"p{page:04d}-literal-authored.md"),
        "figure_inventory": [figures],
        "typed_flags": [
            {
                "block": f"p{page:04d}#{index + 1}",
                "kind": block["kind"],
                "label": block["label"],
                "cont": block["cont"],
                "open": block["open"],
                "samerow": block["samerow"],
                "text_rows": len(block["lines"]),
            }
            for index, block in enumerate(page_data["blocks"])
        ],
    })

images = [
    ("grid", PREPARED / "0227/page.grid.png", 227),
    ("detail_crop", REPORTS / "inspection/p0227-detail.png", 227),
    ("grid", PREPARED / "0228/page.grid.png", 228),
    ("detail_crop", REPORTS / "inspection/p0228-detail.png", 228),
    ("raw_figure_crop", OWN / "work/10p/pages/0227/figures/fig-199.png", 227),
    ("raw_figure_crop", OWN / "work/10p/pages/0228/figures/fig-200.png", 228),
]
report = {
    "schema": "d741/source-first-author-report@1",
    "ticket": "STEMROBIN-181",
    "batch": "d741-source227228-first-author",
    "date": "2026-11-18",
    "status": "first_author_native_stages_passed_not_source_approved",
    "sole_checkout": str(REPO),
    "owned_paths": [str(OWN / name) for name in ("root", "work", "reports", "scripts")],
    "book": "10p",
    "physical_pages": [227, 228],
    "source": {
        "pdf_path": str(REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf"),
        "pdf_sha256_from_native_finalization": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
        "preparation_reused": True,
        "prepared_inputs": [
            {"page": page, "files": [evidence(PREPARED / f"{page:04d}" / name) for name in ("page.png", "page.grid.png", "layout.json", "page.template.md")]}
            for page in (227, 228)
        ],
        "source226_context": {
            **evidence(TAIL),
            "read_mode": "text_only",
            "observed_tail": "Source226 ends with a closed p cont biography paragraph. Source227 starts a new indented concluding paragraph.",
            "images_opened": 0,
            "not_copied_or_modified": True,
        },
        "whole_pdf_copies": 0,
        "runtime_copies": 0,
        "existing_python": str(REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    },
    "native_counts": {
        "prepare": 0,
        "finalize": 2,
        "finalize_by_page": {"227": 1, "228": 1},
        "vectorize": 2,
        "vectorize_by_page": {"227": 1, "228": 1},
        "passed_stage_replays": 0,
        "failures": 0,
        "technical_recoveries": 0,
        "assemble": 0,
        "reindex": 0,
        "modernization": 0,
        "answers": 0,
        "source_approvals": 0,
    },
    "native_invocation_note": "Existing p2c.cmd_finalize and p2c.cmd_vectorize were called directly once/page with book=10p and explicit absolute root/work/books. No native extraction/vectorization logic was patched. The CLI-only Git workspace probe was not called; exact cwd, project markers, p2c.REPO, manifest book and existing output-owner checks were retained.",
    "pages": pages,
    "boundaries": {
        "source84_right": {
            "confirmed_from_pixels": True,
            "last_source_block": "p0227#1",
            "next_unit_heading": "p0227#2",
            "heading": "85. 牛顿环",
            "printed_page": 217,
            "note": "The two-row Young conclusion is retained before the observed heading. This records a boundary, not approval of previous pages.",
        },
        "source85_left": {"block": "p0227#2", "confirmed_from_pixels": True},
        "source85_right": {
            "confirmed_from_pixels": True,
            "last_main_prose_block": "p0228#2",
            "next_unit_heading": "p0228#3",
            "heading": "86. 光的波长",
            "printed_page": 218,
            "late_footnote": "p0228#10",
            "footnote_owner": "p0228#1, unique printed ①",
            "note": "Unit85 is locally bounded by actual 85 and 86 headings; no assembly or source approval performed.",
        },
        "source86_left": {"block": "p0228#3", "confirmed_from_pixels": True},
        "source86_right": {
            "confirmed": False,
            "reason": "No subsequent unit heading in the two authorized pages; no source229 pixels or text were read.",
            "partial_unit": True,
        },
        "paragraph_flags": {
            "source227_first": "p, neither cont nor open; source226 tail is already closed.",
            "source228_first": "p, neither cont nor open; actual first row is indented and source227 ends a complete sentence.",
            "around_fig199": ["p0227#5 open", "p0227#8 cont"],
            "around_fig200": ["p0228#5 open", "p0228#8 cont"],
            "captions": ["p0227#7 samerow", "p0228#7 samerow"],
            "source228_last_main_prose": "p0228#9: complete printed formula/where-k statement; no fabricated cross-page continuation.",
        },
        "colour_plate_refs": {
            "literal_source": ["彩图 III，1", "彩图 III，2及3"],
            "visible_new_figures_in_pages227228": False,
            "note": "References retained in prose; no unseen plate opened, copied or manufactured.",
        },
    },
    "image_usage": {
        "batches": 1,
        "images_opened": 6,
        "current_context_image_total": 6,
        "batch_limit": 8,
        "context_limit": 24,
        "grid_opens": 2,
        "detail_crop_opens": 2,
        "raw_figure_crop_opens": 2,
        "reopens": 0,
        "whole_pdf_page_opens": 0,
        "source226_image_opens": 0,
        "ledger": [
            {"ordinal": index + 1, "kind": kind, "page": page, **evidence(path)}
            for index, (kind, path, page) in enumerate(images)
        ],
    },
    "native_receipts": receipts,
    "scripts": [evidence(path) for path in sorted((OWN / "scripts").glob("*.py"))],
    "scope": {
        "canonical_writes": 0,
        "meter_or_index_writes": 0,
        "git_commands": 0,
        "backend_calls": 0,
        "database_calls": 0,
        "paid_calls": 0,
        "new_agents": 0,
        "freshness_calls": 0,
        "other_chat_operations": 0,
        "whole_tests": 0,
        "source_approval": False,
        "others_preserved": True,
        "native_pass_is_not_source_approval": True,
    },
}
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")

summary = REPORTS / "report.md"
summary.write_text(
    "# D741 SOURCE227/228 First Author\n\n"
    "Ticket: STEMROBIN-181. Book: 10p. Offline scratch only; not source-approved.\n\n"
    "| Physical | Printed | Blocks | Printed/Typed Rows | Figure | Native Trace Mismatch |\n"
    "|---|---|---|---|---|---|\n"
    "| 227 | 217 | 9 | 25/25 | fig-199 | 0.012% |\n"
    "| 228 | 218 | 11 | 25/25 | fig-200 | 0.011% |\n\n"
    "Native calls: finalize 1/page, vectorize 1/page; four first attempts passed. "
    "No prepare, replay, failure or technical recovery. Zero text normalizations; "
    "literal block text, labels and typed flags unchanged.\n\n"
    "Existing p2c native functions were used directly with explicit absolute root/work "
    "and book=10p, avoiding its CLI-only Git probe. All native content checks stayed intact.\n\n"
    "Boundaries: source84 ends before actual h3 85 on source227; source85 ends before "
    "actual h3 86 on source228. The late ① footnote belongs to unit85's matching ①, "
    "not to unit86. Source86's right boundary remains unconfirmed. No source229 read.\n\n"
    "Figures: one complete lens/plate/rays figure199 and one lens/plate/radius figure200. "
    "Both captions are typed cap samerow. Figure199 retains 1/2 labels and three arrowheads; "
    "figure200 retains two R labels, r_k and h_k. Neither contains a source table/grid. "
    "Colour-plate III references remain literal prose, not invented local figures.\n\n"
    "Images: one batch, 6/8 images (2 grids, 2 detail crops, 2 original figure crops); "
    "context 6/24; no reopens or source226 pixels.\n\n"
    "All paths, SHA-256 hashes, native receipts, figure inventories, typed flags and "
    f"image ledger are in {output}.\n\n"
    "No canonical, meter/index, Git, backend, DB, paid, agent, freshness, other-chat, "
    "whole-test, modernization, answer or source-approval operations.\n"
)
manifest = REPORTS / "report-hashes.sha256"
manifest.write_text(
    "".join(f"{sha(path)}  {path}\n" for path in (output, summary))
)
print(json.dumps({
    "report_json": evidence(output),
    "report_md": evidence(summary),
    "hash_manifest": str(manifest),
    "page_hashes": {str(page["physical_page"]): page["page_md"]["sha256"] for page in pages},
    "native_counts": report["native_counts"],
    "images_opened": 6,
}, ensure_ascii=False, indent=2))
