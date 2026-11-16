"""One metadata-only source correction binding; not an independent source gate."""

import copy
import json
from pathlib import Path
import sys

from PIL import Image

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
INITIAL = OUT.parent / "9p-next-source-0188-0191"
REVIEW_FILE = OUT.parent / "source-review-9p-0188-0191.json"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c

REVIEW_SHA = "ba8874e3692a7d46dfaf817d06cd4bfadf1806751a9e38a8fc94dca3361eb831"
INITIAL_SHA = "edbc8e4b3dafc6a1e59a7464c81a13099ea95bab875a78206ec5293a85f3a7b4"


def bind(file):
    file = Path(file)
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": layout.sha256_file(file)}


target = OUT / "author-freeze.json"
assert not target.exists(), "One affected author check; preserve frozen evidence"
assert bind(REVIEW_FILE)["sha256"] == REVIEW_SHA
assert bind(INITIAL / "author-freeze.json")["sha256"] == INITIAL_SHA
assert bind(OUT / "before/author-freeze.json")["sha256"] == INITIAL_SHA
review = json.loads(REVIEW_FILE.read_text())
findings = {item["id"]: item for item in review["findings"]}
assert set(findings) == {"F1", "F2", "F3"}
assert review["status"] == "revise"
for key in ("nativeP2c", "nativeLayout", "nativeBlocks"):
    frozen = review["bindings"][key]
    assert bind(ROOT / frozen["path"])["sha256"] == frozen["sha256"]
book_before = bind(BOOK / "book.json")
pages = []
native_counts = []
crop_record = None
for page in review["pages"]:
    number = page["pdf_page"]
    name = f"{number:04d}.page.md"
    before_file = INITIAL / name
    saved_file = OUT / "before" / name
    current_file = OUT / name
    assert bind(before_file)["sha256"] == page["draft"]["sha256"]
    assert bind(saved_file)["sha256"] == page["draft"]["sha256"]
    before_bytes = before_file.read_bytes()
    current_bytes = current_file.read_bytes()
    assert before_bytes.split(b"---", 2)[2] == current_bytes.split(b"---", 2)[2]
    old_meta, old_blocks = blocks.load(before_file)
    new_meta, new_blocks = blocks.load(current_file)
    assert old_blocks == new_blocks
    expected_meta = copy.deepcopy(old_meta)
    changes = []
    if number in (188, 190):
        finding = findings["F1" if number == 188 else "F2"]
        expected_meta.update(copy.deepcopy(finding["requested"]))
        changes.append("/counting")
    if number == 188:
        expected_meta.update(copy.deepcopy(findings["F3"]["requested"]))
        changes.append("/figure_crops/fig-140")
    assert new_meta == expected_meta, f"{number}: unexpected metadata change"
    if not changes:
        assert current_bytes == before_bytes
    for field in ("source", "grid", "layout", "prepare_template"):
        frozen = page[field]
        assert bind(ROOT / frozen["path"])["sha256"] == frozen["sha256"]
    for figure in page["figures"]:
        frozen = figure["candidate"]
        assert bind(ROOT / frozen["path"])["sha256"] == frozen["sha256"]
    entry = {
        "pdf_page": number,
        "printed_page": page["printed_page"],
        "before": bind(before_file),
        "preservedBefore": bind(saved_file),
        "current": bind(current_file),
        "source": page["source"],
        "changed_metadata_pointers": changes,
        "all_other_metadata_exact": True,
        "full_body_bytes_exact": True,
        "all_parsed_blocks_formulas_flags_captions_and_boxes_exact": True,
        "blocks": page["blocks"],
        "unchanged_independent_gate_inherited": page["text_fidelity"],
    }
    if number in (188, 190):
        source_file = ROOT / page["source"]["path"]
        with Image.open(source_file) as image:
            ink = layout.ink_mask(image)
            masked = ink.copy()
            for figure in page["figures"]:
                x, y, width, height = figure["native_snapped_box"]
                masked[y:y + height, x:x + width] = False
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            bands = p2c._counting_line_bands(new_meta, masked, content_width)
        expected_count = page["actual_printed_rows_including_footer"]
        assert len(bands) == expected_count
        native_counts.append({
            "pdf_page": number,
            "invocations": 1,
            "configured_count": len(bands),
            "independent_expected": expected_count,
            "default_count_inherited_not_rerun": page["native_default_count"],
            "counting": new_meta["counting"],
            "native_bands": bands,
            "mask_uses_inherited_exact_snapped_boxes_no_resnap": True,
            "source_png_read_in_memory_only_no_grid_or_image_view": True,
        })
    if number == 188:
        figure = page["figures"][0]
        assert figure["id"] == "fig-140"
        padding = p2c._figure_crop_padding(new_meta, "fig-140")
        assert padding == 10
        box = figure["native_snapped_box"]
        candidate = OUT / "candidate-figures/fig-140.png"
        assert not candidate.exists()
        layout.crop(ROOT / page["source"]["path"], box, candidate, pad=padding)
        with Image.open(ROOT / figure["candidate"]["path"]) as old_image:
            old_image.load()
            trimmed = old_image.crop((2, 2, old_image.width - 2, old_image.height - 2))
            with Image.open(candidate) as new_image:
                assert new_image.size == (356, 299)
                assert trimmed.size == new_image.size and trimmed.tobytes() == new_image.tobytes()
                x, y, width, height = box
                own = new_image.crop((10, 10, 10 + width, 10 + height))
                with Image.open(ROOT / page["source"]["path"]) as original:
                    original_own = original.crop((x, y, x + width, y + height))
                    assert own.tobytes() == original_own.tobytes()
        crop_record = {
            "id": "fig-140",
            "status": "author-native-candidate-awaiting-affected-independent-review",
            "source_ref": figure["source_ref"],
            "source": page["source"],
            "beforeCandidate": figure["candidate"],
            "candidate": bind(candidate),
            "rough_box_unchanged": figure["rough_box"],
            "snapped_box_unchanged": box,
            "padding_before": 12,
            "padding_current": padding,
            "exact_source_extraction_xywh": [961, 1057, 356, 299],
            "equals_before_candidate_trim_two_pixels_each_side": True,
            "all_pixels_inside_own_snapped_object_exact": True,
            "new_crop_invocations": 1,
            "native_snap_invocations": 0,
            "actuallyOpenedByThisCorrectionAuthor": False,
            "independent_actual_crop_review_pending": True,
        }
    pages.append(entry)
assert crop_record is not None and len(native_counts) == 2
assert bind(REVIEW_FILE)["sha256"] == REVIEW_SHA
assert bind(INITIAL / "author-freeze.json")["sha256"] == INITIAL_SHA
book_after = bind(BOOK / "book.json")
assert book_after == book_before, "Durable source book index must stay unchanged"
report = {
    "schema": "ld-s10y-lesson/source-author-correction-freeze@1",
    "ticket": "STEMROBIN-181",
    "batch": "D020-future",
    "role": "source-correction-author-only",
    "status": "frozen-author-metadata-correction-awaiting-affected-independent-review",
    "bindings": {
        "independentInitialReview": bind(REVIEW_FILE),
        "initialAuthorFreeze": bind(INITIAL / "author-freeze.json"),
        "preservedInitialAuthorFreeze": bind(OUT / "before/author-freeze.json"),
        "helper": bind(Path(__file__).resolve()),
        "nativeP2c": bind(TOOLS / "p2c.py"),
        "nativeLayout": bind(TOOLS / "layout.py"),
        "nativeBlocks": bind(TOOLS / "blocks.py"),
        "durableBookBefore": book_before,
        "durableBookAfter": book_after,
    },
    "authorizedFindingIds": ["F1", "F2", "F3"],
    "pages": pages,
    "nativeAffectedChecks": native_counts,
    "affectedFigure": crop_record,
    "inheritedUnchangedFigures": [
        figure for page in review["pages"] for figure in page["figures"]
        if figure["id"] != "fig-140"
    ],
    "nativeProvenance": {
        "scope": "One configured count each on188/190, one crop140 using frozen exact box; byte/metadata proof only elsewhere.",
        "api": ["blocks.load", "layout.ink_mask", "p2c._counting_line_bands", "p2c._figure_crop_padding", "layout.crop"],
        "author_or_independent_full_source_gate_rerun": False,
        "original_grid_source_or_passed_figure_pixel_views": 0,
        "source_page_finalization_invocations": 0,
        "vectorize_assemble_or_durable_index_writes": 0,
        "geometry_resnap_invocations": 0,
        "counts_are_author_bindings_not_independent_approval": True,
    },
    "initialDraftsFreezesReportsAndCandidateBytesPreserved": True,
    "page187TinySubscriptBlockerUnchangedAndUnapproved": True,
    "D019FinalizedPageCountOrBookIndexNotChanged": True,
    "sourceOrScienceSelfApproval": False,
    "noBrowserAppSharedToolsDependenciesDBGitOrProductionWrites": True,
    "remaining": ["Main/Huygens affected-only metadata and actual fig140 crop recheck"],
    "inFlightProcesses": [],
}
target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "freeze": bind(target),
    "status": report["status"],
    "pages": [{"page": item["pdf_page"], "before": item["before"], "current": item["current"]} for item in pages],
    "counts": [{"page": item["pdf_page"], "configured": item["configured_count"]} for item in native_counts],
    "figure140": crop_record["candidate"],
    "durableBookIndexUnchanged": True,
    "inFlightProcesses": [],
}, ensure_ascii=False, indent=2))
