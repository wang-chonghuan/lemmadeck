"""Freeze C1/C2 author metadata deltas with one configured count per affected page."""

import copy
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
INITIAL = OUT.parent / "9p-next-source-0192-0195"
REVIEW = OUT.parent / "source-review-9p-0192-0195.json"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c

REVIEW_SHA = "e039b84d6ad03b7e7dddcbc51544271b1fc8cdc20dfa5bc495ce3b948179388d"
INITIAL_SHA = "86320e1e8c5a460ce4d3da207326be734c03d065166dfc0069c986a4cbc35fc4"
CAP_BEFORE = b"<!-- cap \xe5\x9b\xbe146 -->"
CAP_AFTER = b"<!-- cap \xe5\x9b\xbe146 samerow -->"


def bind(file):
    file = Path(file)
    return {"path": file.relative_to(ROOT).as_posix(), "sha256": layout.sha256_file(file)}


def verify(binding):
    assert bind(ROOT / binding["path"])["sha256"] == binding["sha256"], binding


target = OUT / "author-freeze.json"
assert not target.exists(), "Preserve single affected author freeze; no repeated audit"
assert bind(REVIEW)["sha256"] == REVIEW_SHA
assert bind(INITIAL / "author-freeze.json")["sha256"] == INITIAL_SHA
review = json.loads(REVIEW.read_text())
initial_check = json.loads((INITIAL / "author-check.json").read_text())
assert review["status"] == "blocked"
for key in ("authorCheck", "authorNotes", "nativeParser", "nativeLayout", "nativeCountingEntry"):
    verify(review["bindings"][key])
findings = {finding["id"]: finding for finding in review["findings"]}
assert set(findings) == {"C1", "C2", "G1", "G2"}
initial_pages = {page["pdf_page"]: page for page in initial_check["pages"]}
review_pages = {page["page"]: page for page in review["pages"]}

# Preserve the exact prior bytes, not a recreation of historical metadata.
before_dir = OUT / "before"
assert not before_dir.exists(), "Do not overwrite a previous correction attempt"
before_dir.mkdir()
for source in [INITIAL / "0192.page.md", INITIAL / "0194.page.md",
               INITIAL / "author-freeze.json", REVIEW]:
    shutil.copyfile(source, before_dir / source.name)
initial_bindings = []
for page in review["pages"]:
    for binding in page["bindings"].values():
        verify(binding)
        initial_bindings.append(binding)
for page in initial_check["pages"]:
    for figure in page["figures"]:
        verify(figure["candidate"])
        initial_bindings.append(figure["candidate"])
for key in ("authorFreeze", "authorCheck", "authorNotes"):
    initial_bindings.append(review["bindings"][key])
book_before = bind(ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/book.json")

pages = []
for number, finding_id in [(192, "C1"), (194, "C2")]:
    old_file = INITIAL / f"{number:04d}.page.md"
    new_file = OUT / f"{number:04d}.page.md"
    old_meta, old_blocks = blocks.load(old_file)
    new_meta, new_blocks = blocks.load(new_file)
    assert "counting" not in old_meta
    assert new_meta["counting"]["edge_margin_px"] == 100
    assert set(new_meta["counting"]) == {"edge_margin_px", "reason"}
    assert finding_id in new_meta["counting"]["reason"]
    reverted_meta = copy.deepcopy(new_meta)
    del reverted_meta["counting"]
    assert reverted_meta == old_meta, "No other frontmatter changes allowed"
    old_body = old_file.read_bytes().split(b"---", 2)[2]
    new_body = new_file.read_bytes().split(b"---", 2)[2]
    reverted_blocks = copy.deepcopy(new_blocks)
    changes = ["/counting"]
    if number == 192:
        assert old_body.count(CAP_BEFORE) == new_body.count(CAP_AFTER) == 1
        assert new_body.replace(CAP_AFTER, CAP_BEFORE) == old_body
        cap = reverted_blocks[10]
        assert cap["kind"] == "cap" and cap["label"] == "图146" and cap["samerow"]
        assert not old_blocks[10]["samerow"]
        cap["samerow"] = False
        changes.append("p0192#11/samerow")
    else:
        assert old_body == new_body
    assert reverted_blocks == old_blocks, "Prose/formulas/boxes/other flags must stay exact"
    expected = findings[finding_id]["actual_rows_including_footer"]
    assert blocks.printed_lines(new_blocks) == expected
    frozen_page = initial_pages[number]
    source = ROOT / frozen_page["source"]["path"]
    # Reuse the original snapped figure inventory. No crop, snap or pixel review.
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        for figure in frozen_page["figures"]:
            x, y, width, height = figure["snapped_box"]
            masked[y:y + height, x:x + width] = False
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        bands = p2c._counting_line_bands(new_meta, masked, content_width)
    count_matches = len(bands) == expected
    pages.append({
        "pdf_page": number,
        "printed_page": new_meta["printed_page"],
        "finding": finding_id,
        "status": "author-configured-count-matches" if count_matches else "author-count-still-blocked",
        "before": bind(old_file),
        "preservedBefore": bind(before_dir / old_file.name),
        "current": bind(new_file),
        "source": frozen_page["source"],
        "changed_pointers": changes,
        "all_other_frontmatter_exact": True,
        "full_body_exact_after_reversing_only_authorized_cap_flag": True,
        "all_text_math_wraps_figure_boxes_and_other_flags_exact": True,
        "independent_expected_rows": expected,
        "initial_author_native_count_inherited_not_rerun": frozen_page["native_count"],
        "current_draft_rows": blocks.printed_lines(new_blocks),
        "configured_native_count": len(bands),
        "configured_native_bands": bands,
        "count_matches_independent_expected": count_matches,
        "counting": new_meta["counting"],
        "configured_count_invocations": 1,
        "figure_masking_uses_inherited_snapped_boxes": frozen_page["figures"],
    })

for binding in initial_bindings:
    verify(binding)
assert bind(REVIEW)["sha256"] == REVIEW_SHA
assert bind(INITIAL / "author-freeze.json")["sha256"] == INITIAL_SHA
book_after = bind(ROOT / book_before["path"])
assert book_before == book_after
matches = all(page["count_matches_independent_expected"] for page in pages)
report = {
    "schema": "ld-s10y-lesson/source-author-correction-freeze@1",
    "ticket": "STEMROBIN-181",
    "batch": "D020-future-source",
    "role": "source-correction-author-only",
    "status": ("frozen-author-metadata-correction-awaiting-affected-independent-review"
               if matches else "frozen-author-correction-native-count-blocked"),
    "bindings": {
        "independentInitialReview": bind(REVIEW),
        "preservedInitialReview": bind(before_dir / REVIEW.name),
        "initialAuthorFreeze": bind(INITIAL / "author-freeze.json"),
        "preservedInitialAuthorFreeze": bind(before_dir / "author-freeze.json"),
        "helper": bind(Path(__file__).resolve()),
        "nativeParser": bind(TOOLS / "blocks.py"),
        "nativeLayout": bind(TOOLS / "layout.py"),
        "nativeCountingEntry": bind(TOOLS / "p2c.py"),
        "durableBookBefore": book_before,
        "durableBookAfter": book_after,
    },
    "authorizedFindingIds": ["C1", "C2"],
    "pages": pages,
    "initialPackageBindingsVerifiedUnchangedAfterCorrection": initial_bindings,
    "unmodifiedBlockedPages": [
        {"page": number, "finding": finding_id,
         "draft": review_pages[number]["bindings"]["draft"],
         "status": "unresolved-original-source-glyph-not-changed-or-approved"}
        for number, finding_id in [(193, "G1"), (195, "G2")]
    ],
    "historicalAuthorCountingNotes": (
        "Initial draft notes and author measurements are preserved verbatim, not treated as current row conclusions. "
        "C1 supersedes the initial18-row/separate-caption observation with17 rows and cap146 samerow; "
        "C2 keeps26 printed rows and excludes only the independently identified scan-shadow band."
    ),
    "nativeProvenance": {
        "api": ["blocks.load", "blocks.printed_lines", "layout.ink_mask", "p2c._counting_line_bands"],
        "configured_count_invocations": 2,
        "original_grid_or_source_pixel_views": 0,
        "crop_snap_render_or_source_finalize_invocations": 0,
        "full_source_science_or_passed_figure_gate_repeats": 0,
        "checks_are_author_bindings_not_independent_approval": True,
    },
    "sourceOrScienceSelfApproval": False,
    "initialReportDraftsFreezesAndAllCandidatesPreserved": True,
    "page193And195BodiesUntouched": True,
    "noDurableSourceIndexAppSharedToolDependenciesBrowserDBGitOrProductionWrites": True,
    "remaining": ["Main/Zeno affected-only C1/C2 metadata recheck", "G1/G2 source-glyph resolution"],
    "inFlightProcesses": [],
}
target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "freeze": bind(target),
    "status": report["status"],
    "pages": [{key: page[key] for key in
               ("pdf_page", "before", "current", "current_draft_rows", "configured_native_count")}
              for page in pages],
    "unresolved": ["G1/p0193#6", "G2/p0195#7"],
    "inFlightProcesses": [],
}, ensure_ascii=False, indent=2))
