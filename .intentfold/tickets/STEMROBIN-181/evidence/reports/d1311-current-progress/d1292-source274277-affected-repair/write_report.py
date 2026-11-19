"""Verify exact affected replacements and emit an author-only repair report."""

import hashlib
import json
from pathlib import Path


CWD = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = CWD / ".intentfold/tickets/STEMROBIN-181/tmp"
OWNED = TMP / "d1292-source274277-affected-repair"
FIRST = TMP / "d1273-source274277-first-author"
REVIEW = TMP / "d1283-source274277-first-independent-review"
PAGES = (274, 276, 277)


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def sha256(path):
    return sha256_bytes(path.read_bytes())


def binding(path):
    return {"path": str(path), "sha256": sha256(path)}


def main():
    assert Path.cwd() == CWD
    assert not (OWNED / "report.json").exists()
    manifest_path = OWNED / "crop-manifest.json"
    freeze_path = OWNED / "source-only-freeze.json"
    decisions_path = OWNED / "decisions.json"
    manifest = json.loads(manifest_path.read_text())
    freeze = json.loads(freeze_path.read_text())
    decisions_document = json.loads(decisions_path.read_text())
    decisions = decisions_document["decisions"]
    first_review = json.loads((REVIEW / "report.json").read_text())
    assert sha256(freeze_path) == decisions_document["source_only_freeze_sha256"]
    assert sha256(manifest_path) == freeze["crop_manifest"]["sha256"]
    assert len(decisions) == len(freeze["observations"]) == len(manifest["crops"]) == 8
    assert len(list((OWNED / "crops").glob("*.png"))) == 8
    assert freeze["images"]["context_opens"] == 8
    assert freeze["images"]["reopens"] == 0
    assert not freeze["candidate_text_read_before_freeze"]
    for item in manifest["input_bindings"]:
        assert sha256(Path(item["path"])) == item["sha256"], item["path"]
    for page in manifest["pages"].values():
        for key in ("page_png", "page_grid_png", "layout_json"):
            assert sha256(Path(page[key]["path"])) == page[key]["sha256"]
    observations = {item["id"]: item for item in freeze["observations"]}
    crops = {item["id"]: item for item in manifest["crops"]}
    findings = {item["id"]: item for item in first_review["findings"]}
    assert set(observations) == set(crops) == set(findings)
    for item in crops.values():
        assert sha256(Path(item["crop"]["path"])) == item["crop"]["sha256"]
        assert item["crop"]["sha256"] == observations[item["id"]]["crop_sha256"]

    candidates = {}
    changed_lines = []
    enriched_decisions = []
    for page in PAGES:
        relative = f"root/10p/pages/{page:04d}/page.md"
        before_path = FIRST / relative
        after_path = OWNED / relative
        before = before_path.read_bytes()
        after = after_path.read_bytes()
        assert sha256_bytes(before) == first_review["input_hashes"][
            "candidate_sha256"
        ][relative]
        assert after_path.stat().st_mode & 0o200
        before_rows = before.splitlines(keepends=True)
        after_rows = after.splitlines(keepends=True)
        assert len(before_rows) == len(after_rows)
        expected_rows = list(before_rows)
        allowed_lines = set()
        for decision in [item for item in decisions if item["page"] == page]:
            line_number = decision["md_line"]
            assert line_number == findings[decision["id"]]["candidate_md_line"]
            old_row = before_rows[line_number - 1]
            before_fragment = decision["before_fragment"].encode()
            after_fragment = decision["after_fragment"].encode()
            assert old_row.count(before_fragment) == 1
            new_row = old_row.replace(before_fragment, after_fragment, 1)
            if "before_line" in decision:
                assert old_row.decode().rstrip("\r\n") == decision["before_line"]
                assert new_row.decode().rstrip("\r\n") == decision["after_line"]
            expected_rows[line_number - 1] = new_row
            is_changed = old_row != new_row
            assert is_changed == decision["status"].startswith("REPAIRED_")
            if is_changed:
                allowed_lines.add(line_number)
            enriched = {
                **decision,
                "first_finding": findings[decision["id"]],
                "source_only_observation": observations[decision["id"]],
                "crop_binding": crops[decision["id"]],
                "first_md": binding(before_path),
                "candidate_md": binding(after_path),
                "before_line": old_row.decode().rstrip("\r\n"),
                "after_line": new_row.decode().rstrip("\r\n"),
                "before_line_sha256_utf8_without_newline": sha256_bytes(
                    old_row.rstrip(b"\r\n")
                ),
                "after_line_sha256_utf8_without_newline": sha256_bytes(
                    new_row.rstrip(b"\r\n")
                ),
                "before_line_sha256_with_original_newline": sha256_bytes(old_row),
                "after_line_sha256_with_original_newline": sha256_bytes(new_row),
                "actually_changed": is_changed,
                "source_pass_claimed": False,
            }
            enriched_decisions.append(enriched)
            if is_changed:
                changed_lines.append({
                    "id": decision["id"],
                    "page": page,
                    "md_line": line_number,
                    "candidate_path": str(after_path),
                    "before": enriched["before_line"],
                    "after": enriched["after_line"],
                    "before_line_sha256": enriched[
                        "before_line_sha256_with_original_newline"
                    ],
                    "after_line_sha256": enriched[
                        "after_line_sha256_with_original_newline"
                    ],
                    "line_hash_contract": "UTF-8 bytes including the unchanged "
                                          "original line terminator",
                })
        expected = b"".join(expected_rows)
        assert expected == after, page
        actual_changed = [
            index + 1
            for index, (old, new) in enumerate(zip(before_rows, after_rows))
            if old != new
        ]
        assert set(actual_changed) == allowed_lines
        unaffected_before = b"".join(
            row for index, row in enumerate(before_rows, 1)
            if index not in allowed_lines
        )
        unaffected_after = b"".join(
            row for index, row in enumerate(after_rows, 1)
            if index not in allowed_lines
        )
        assert unaffected_before == unaffected_after
        candidates[str(page)] = {
            "first_md": binding(before_path),
            "writable_candidate_md": binding(after_path),
            "before_bytes": len(before),
            "after_bytes": len(after),
            "before_physical_lines": len(before_rows),
            "after_physical_lines": len(after_rows),
            "actual_changed_md_lines": actual_changed,
            "only_declared_minimal_replacements": True,
            "all_unaffected_bytes_equal": True,
            "unaffected_rows_sha256": sha256_bytes(unaffected_before),
            "line_divisions_preserved": True,
            "each_original_line_terminator_preserved": all(
                old[len(old.rstrip(b"\r\n")):] ==
                new[len(new.rstrip(b"\r\n")):]
                for old, new in zip(before_rows, after_rows)
            ),
            "figure_boxes_headings_OPEN_CONT_all_other_data_preserved":
                "Exact reconstruction from FIRST bytes using only the listed "
                "body-text substitutions; every other byte is identical.",
        }
    assert len(changed_lines) == 6
    assert sum(
        item["status"] == "HOLD_SOURCE_EMPHASIS_UNRESOLVED"
        for item in decisions
    ) == 2
    order = {item["id"]: index for index, item in enumerate(decisions)}
    enriched_decisions.sort(key=lambda item: order[item["id"]])
    report = {
        "schema": "ld-s10y-lesson/affected-only-source-recovery-author@1",
        "ticket": "STEMROBIN-181",
        "date": "2026-11-19",
        "cwd": str(CWD),
        "owned_root": str(OWNED),
        "book": "10p",
        "pages": list(PAGES),
        "role": "Fresh affected-only SOURCE recovery AUTHOR/clarification, "
                "not independent review",
        "result": "Six smallest source-text repairs in six MD lines; two "
                  "emphasis sites remain unchanged on HOLD. SOURCE PASS is not "
                  "claimed or self-approved.",
        "SOURCE": "NOT_APPROVED_PENDING_FRESH_INDEPENDENT_AFFECTED_REVIEW",
        "SOURCE_pass_claimed": False,
        "self_approved": False,
        "candidate_approved": False,
        "source_promotion_authorized": False,
        "repairRounds": 1,
        "substantive_repair_rounds": 1,
        "actual_changed_sites": 6,
        "actual_changed_md_lines": changed_lines,
        "held_sites": ["U276-4", "U276-5"],
        "hold_policy": "Stop each unresolved emphasis site without a guess, "
                       "reopen or second batch; unchanged FIRST spans are not "
                       "an emphasis pass or a claim of source fidelity.",
        "candidate_root": str(OWNED / "root"),
        "candidates": candidates,
        "decisions": enriched_decisions,
        "source_only_freeze": binding(freeze_path),
        "source_only_freeze_before_candidate_read": True,
        "crop_manifest": binding(manifest_path),
        "crop_bindings": manifest["crops"],
        "dimensions_and_scale_proof": {
            "pages": manifest["pages"],
            "grid_overlay_implementation": manifest["grid_overlay"],
            "conclusion": "For pages274/276/277 page.png and page.grid.png "
                          "are each 1536x2337, equal to layout.json w/h. "
                          "Grid overlay preserves the native canvas and "
                          "unchanged interior pixels. future_focus_xywh "
                          "therefore uses native pixels at scale [1,1], "
                          "offset [0,0]. All eight crops use Image.crop "
                          "without resizing; exact actual rectangles and "
                          "translations are recorded.",
        },
        "first_review_bindings": [
            item for item in manifest["input_bindings"]
            if item["path"].startswith(str(REVIEW) + "/")
        ],
        "first_author_evidence_bindings": [
            item for item in manifest["input_bindings"]
            if item["path"].startswith(str(FIRST) + "/")
        ],
        "first_review_and_author_inputs_unchanged": True,
        "reused_passes": {
            "page275_SOURCE": "Existing FIRST PASS reused by reference to "
                              "the independent report, without opening or "
                              "re-reviewing any page275 artifact.",
            "RAWPNG": "Existing three RAW PNG PASS results reused by "
                      "reference to the independent report; no RAW figure "
                      "read or reviewed.",
        },
        "write_scope": "Only the owned repair directory. Three copied writable "
                       "page.md candidates, eight crops, saved scripts and "
                       "author evidence. FIRST and canonical never edited.",
        "images": freeze["images"],
        "usage": {
            "token_usage": None,
            "token_usage_status": "unknown",
            "images": 8,
            "batches": 1,
            "paid_calls": 0,
            "usage_not_reset": True,
        },
        "prohibited_actions_performed": {
            "whole_page_or_grid_visual_open": False,
            "RAW_figure_open_or_review": False,
            "page275_open_or_review": False,
            "reopen_or_second_batch": False,
            "FIRST_or_canonical_edit": False,
            "finalize": False,
            "native": False,
            "vectorize": False,
            "assemble": False,
            "env": False,
            "network": False,
            "database": False,
            "paid": False,
            "git": False,
            "chats": False,
            "app": False,
        },
        "saved_scripts": [
            binding(OWNED / "make_crops.py"),
            binding(Path(__file__).resolve()),
        ],
        "author_decisions": binding(decisions_path),
        "next_action": "Parent arranges fresh independent affected-only "
                       "SOURCE review/clarification, including the two "
                       "emphasis HOLD sites. Only independently approved "
                       "affected pages may then be finalized by the parent. "
                       "Page275 SOURCE and all three RAW PNG passes remain "
                       "reused and unopened.",
    }
    report_path = OWNED / "report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    )
    print(json.dumps({
        "report": binding(report_path),
        "result": report["result"],
        "images": 8,
        "repairRounds": 1,
        "changed_md_lines": {
            page: candidate["actual_changed_md_lines"]
            for page, candidate in candidates.items()
        },
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
