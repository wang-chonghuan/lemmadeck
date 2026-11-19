import hashlib
import json
import sys
from pathlib import Path

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = R / ".intentfold/tickets/STEMROBIN-181/tmp/d808-source231-raw201202-first-review"
sys.path.insert(0, str(R / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


report = json.loads((OUT / "report.json").read_text())
bindings = report["bindings"]
for binding in bindings.values():
    assert digest(Path(binding["path"])) == binding["sha256"], binding["path"]
meta, md_blocks = blocks.parse(Path(bindings["candidate_md"]["path"]).read_text())
candidate = json.loads(Path(bindings["candidate_json"]["path"]).read_text())
assert meta == candidate["meta"]
figure_sequence = 0
for block in md_blocks:
    if block["kind"] == "fig":
        figure_sequence += 1
        block["id"] = blocks.fig_id(block["label"], meta["page"], figure_sequence)
assert md_blocks == candidate["blocks"]
assert blocks.printed_lines(md_blocks) == 19
assert [len(block["lines"]) for block in md_blocks] == report["SOURCE231"]["rows_by_block"]
rows = [
    (f"p0231#{block_index}", line_index, text)
    for block_index, block in enumerate(md_blocks, 1)
    if block["kind"] in blocks.KINDS_TEXT
    for line_index, text in enumerate(block["lines"], 1)
]
assert rows == [
    (row["ref"], row["line"], row["text"])
    for row in report["SOURCE231"]["rows"]
]
assert all(row["status"] == "PASS" for row in report["SOURCE231"]["rows"])
assert len(rows) == 19
assert candidate["blocks"][0]["cont"] and not candidate["blocks"][0]["open"]
assert candidate["blocks"][9]["open"] and not candidate["blocks"][9]["cont"]
assert candidate["blocks"][10]["kind"] == "p"
assert candidate["blocks"][10]["label"] == "footnote"
assert len(candidate["blocks"][10]["lines"]) == 3
assert candidate["blocks"][11]["kind"] == "foot"
assert meta.get("counting") is None
failed_audit = json.loads(Path(bindings["native_failed_audit"]["path"]).read_text())
assert failed_audit["lines_printed"] == 18 and failed_audit["lines_md"] == 19
assert len(failed_audit["errors"]) == 1
receipt = json.loads(Path(bindings["first_failure_receipt"]["path"]).read_text())
assert receipt["exit"] == 1
assert report["status"]["SOURCE231"] == "PASS-content"
assert report["status"]["SOURCE231_whole_page_canonical_approved"] is False
assert report["native_counting"]["failure_waived_or_replaced"] is False
assert report["native_counting"]["reviewer_finalize_calls"] == 0
image_ledger = report["image_batch"]
assert len(image_ledger["image_opens_in_order"]) == 7
assert image_ledger["actual_images_batch"] == image_ledger["actual_images_context"] == 7
assert 7 <= image_ledger["image_limit_batch"] <= 8
assert 7 <= image_ledger["image_limit_context"] <= 24
for entry in image_ledger["image_opens_in_order"]:
    assert entry["binding"] in bindings
diagnostics = json.loads((OUT / "diagnostics.json").read_text())
for name, entry in diagnostics["source_and_frozen_input_hash_checks"].items():
    assert digest(Path(name)) == entry["sha256"], name
for result in diagnostics["svg_previews"]:
    assert result["exit_code"] == 0
    assert result["missing_pixels_outside_tolerance"] == 0
    assert result["extra_pixels_outside_tolerance"] == 0
    assert result["svg_regenerated"] is False
    for role in ("png", "svg", "preview"):
        assert digest(Path(result[role]["path"])) == result[role]["sha256"]
trace = json.loads((OUT / "counting-trace.json").read_text())
assert trace["after_gap_merge_before_join"]["footnote_bands"] == [[1755, 1892]]
assert trace["final_footnote_bands"] == [[1755, 1823], [1824, 1892]]
assert trace["diagnosis"]["native_requirement_resolved"] is False

paths = {Path(binding["path"]) for binding in bindings.values()}
paths.update(Path(name) for name in diagnostics["source_and_frozen_input_hash_checks"])
paths.update(path for path in OUT.iterdir() if path.is_file() and path.name != "hashes.json")
manifest = {
    "schema": "independent-review-evidence-hashes@1",
    "algorithm": "SHA-256",
    "R": str(R),
    "report_internal_consistency": "PASS",
    "frozen_input_integrity": "PASS; unchanged through review completion",
    "native_failure_integrity": "PASS; original FAIL still preserved, not resolved",
    "image_count": 7,
    "hash_manifest_self_hash_omitted": True,
    "files": [
        {"path": str(path), "sha256": digest(path)}
        for path in sorted(paths)
    ],
}
(OUT / "hashes.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({
    "report_consistency": "PASS",
    "md_json_and_review_rows": 19,
    "existing_native_printed_rows": 18,
    "original_failure_exit": 1,
    "whole_page_canonical_approved": False,
    "images_opened": 7,
    "hashed_files": len(paths),
    "report_sha256": digest(OUT / "report.json"),
    "summary_sha256": digest(OUT / "summary.md"),
    "hashes_sha256": digest(OUT / "hashes.json"),
}, indent=2))
