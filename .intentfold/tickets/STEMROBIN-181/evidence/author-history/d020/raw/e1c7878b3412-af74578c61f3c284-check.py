#!/usr/bin/env python
"""Read-only C1/C2 delta proof; one native count per affected page."""
import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
TMP = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import blocks
import layout
import p2c
from PIL import Image


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


verified = {}


def verify(binding):
    path = ROOT / binding["path"]
    actual = digest(path)
    assert actual == binding["sha256"], (binding["path"], actual)
    verified[binding["path"]] = actual


review_path = TMP / "source-review-9p-0192-0195.json"
freeze_path = TMP / "9p-next-source-0192-0195-correction-1/author-freeze.json"
assert digest(review_path) == "e039b84d6ad03b7e7dddcbc51544271b1fc8cdc20dfa5bc495ce3b948179388d"
assert digest(freeze_path) == "14d17a500494a568504892ee7fb65f3fccaba1f4f3d0694439bbf2763d12e49b"
review = json.loads(review_path.read_text())
freeze = json.loads(freeze_path.read_text())
assert freeze["authorizedFindingIds"] == ["C1", "C2"]
assert review["status"] == "blocked" and review["blockers"] == ["G1", "G2"]

for key in (
    "independentInitialReview", "preservedInitialReview", "initialAuthorFreeze",
    "preservedInitialAuthorFreeze", "helper", "nativeParser", "nativeLayout",
    "nativeCountingEntry",
):
    verify(freeze["bindings"][key])

initial_freeze = json.loads(
    (ROOT / freeze["bindings"]["initialAuthorFreeze"]["path"]).read_text()
)
for binding in freeze["initialPackageBindingsVerifiedUnchangedAfterCorrection"]:
    verify(binding)
for page in review["pages"]:
    for binding in page["bindings"].values():
        verify(binding)
for figure in review["figures"]:
    verify(figure["candidate"])
for detail in review["affected_detail_evidence"]:
    verify(detail)

results = []
for page_number, finding, expected_rows, false_band, footer_band in (
    (192, "C1", 17, [2154, 2177], [2021, 2047]),
    (194, "C2", 26, [2162, 2193], [1995, 2019]),
):
    current = next(p for p in freeze["pages"] if p["pdf_page"] == page_number)
    original = next(p for p in initial_freeze["pages"] if p["pdf_page"] == page_number)
    reviewed = next(p for p in review["pages"] if p["page"] == page_number)
    assert reviewed["actual_rows_including_footer"] == expected_rows
    assert current["finding"] == finding
    for key in ("before", "preservedBefore", "current", "source"):
        verify(current[key])

    before_bytes = (ROOT / current["preservedBefore"]["path"]).read_bytes()
    current_bytes = (ROOT / current["current"]["path"]).read_bytes()
    before_text = before_bytes.decode("utf-8")
    current_text = current_bytes.decode("utf-8")
    before_meta, before_blocks = blocks.parse(before_text)
    meta, parsed = blocks.parse(current_text)
    assert "counting" not in before_meta
    assert set(meta["counting"]) == {"edge_margin_px", "reason"}
    assert type(meta["counting"]["edge_margin_px"]) is int
    assert meta["counting"]["edge_margin_px"] == 100
    assert meta["counting"]["reason"] == current["counting"]["reason"]
    assert finding in meta["counting"]["reason"] and meta["counting"]["reason"].strip()
    reversed_meta = copy.deepcopy(meta)
    reversed_meta.pop("counting")
    assert reversed_meta == before_meta
    reversed_blocks = copy.deepcopy(parsed)
    changed_flags = []
    if page_number == 192:
        cap = parsed[10]
        assert cap["kind"] == "cap" and cap["label"] == "\u56fe146"
        assert cap["samerow"] and not before_blocks[10]["samerow"]
        reversed_blocks[10]["samerow"] = False
        changed_flags = ["p0192#11/samerow"]
        assert parsed[8]["lines"] == before_blocks[8]["lines"]
        assert sum(line.count("\u21b5") for line in parsed[8]["lines"]) == 1
    assert reversed_blocks == before_blocks

    # Reverse the serialized insertion too, proving every remaining byte.
    insertion = json.dumps(
        {"counting": meta["counting"]}, ensure_ascii=False, indent=2
    )[2:-2] + ",\n"
    assert current_text.count(insertion) == 1
    reversed_text = current_text.replace(insertion, "", 1)
    if page_number == 192:
        flag = "<!-- cap \u56fe146 samerow -->"
        assert reversed_text.count(flag) == 1
        reversed_text = reversed_text.replace(flag, "<!-- cap \u56fe146 -->", 1)
    reversed_bytes = reversed_text.encode("utf-8")
    assert reversed_bytes == before_bytes
    assert original["figures"] == current["figure_masking_uses_inherited_snapped_boxes"]
    for figure in original["figures"]:
        index = int(figure["block"].split("#")[1]) - 1
        assert parsed[index]["box"] == figure["rough_box"]

    # Machine-only array decoding; no image is displayed, cropped or written.
    with Image.open(ROOT / reviewed["bindings"]["source"]["path"]) as image:
        assert list(image.size) == original["dimensions_px"]
        ink = layout.ink_mask(image)
        width = image.width
    masked = ink.copy()
    for figure in original["figures"]:
        x, y, w, h = figure["snapped_box"]
        masked[max(0, y):y + h, max(0, x):x + w] = False
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else width
    frozen_layout = json.loads((ROOT / reviewed["bindings"]["layout"]["path"]).read_text())
    assert content_width == frozen_layout["content_width"]
    bands = [list(band) for band in p2c._counting_line_bands(meta, masked, content_width)]
    assert len(bands) == blocks.printed_lines(parsed) == expected_rows
    assert false_band in original["native_bands"]
    assert bands == [band for band in original["native_bands"] if band != false_band]
    assert footer_band in bands
    if page_number == 192:
        assert [1774, 1852] in bands
    results.append({
        "page": page_number,
        "finding": finding,
        "status": "pass",
        "changed_pointers": ["/counting"] + changed_flags,
        "counting": meta["counting"],
        "reversed_entire_file_sha256": hashlib.sha256(reversed_bytes).hexdigest(),
        "exact_remaining_bytes": True,
        "all_other_parsed_metadata_and_blocks_exact": True,
        "blocks": len(parsed),
        "original_geometry_not_resnapped": True,
        "frozen_content_width": content_width,
        "native_count_invocations": 1,
        "draft_rows": blocks.printed_lines(parsed),
        "independent_expected_rows_from_initial_pixel_gate": expected_rows,
        "native_rows": len(bands),
        "bands": bands,
        "only_removed_band": false_band,
        "retained_footer_band": footer_band,
    })

for binding_path, expected in verified.items():
    assert digest(ROOT / binding_path) == expected, ("changed-during-proof", binding_path)
assert digest(freeze_path) == "14d17a500494a568504892ee7fb65f3fccaba1f4f3d0694439bbf2763d12e49b"

skill_paths = (
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".agents/skills/ld-s10y-image/SKILL.md",
)
skills = {path: digest(ROOT / path) for path in skill_paths}
background = Path("/Users/yong/.agents/skills/ips-chrome-background/SKILL.md")
skills[str(background)] = digest(background)
print(json.dumps({
    "status": "pass",
    "affected_pages": results,
    "verified_unique_bindings": len(verified),
    "binding_mismatches": [],
    "all_checked_bindings_unchanged_during_proof": True,
    "proof_script_sha256": digest(Path(__file__).resolve()),
    "loaded_skills": skills,
    "native_count_probe_invocations": 1,
    "native_count_function_calls": 2,
    "native_count_pages": [192, 194],
    "author_helper_executed": False,
    "author_count_results_used_as_independent_evidence": False,
    "machine_only_page_array_decodes": 2,
    "images_loaded_into_context": 0,
    "blocked_pages_193_195": "hash-checked only; no parsing, counting, glyph interpretation or repair",
    "overall_status": "blocked",
    "preserved_blockers": ["G1", "G2"],
    "files_written_by_proof": [],
}, ensure_ascii=True, indent=2))
