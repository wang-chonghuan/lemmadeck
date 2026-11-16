"""One author-only structural check; never load pixels or invoke a counter."""

import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
BEFORE = OUT / "before"
INITIAL = OUT.parent / "9p-next-source-0196-0199"
REVIEW = OUT.parent / "source-review-9p-0196-0199.json"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
REVIEW_SHA = "bbb48baf6a54d10f570c317646eba1fbe0ef6a06ddf3c2ae5fa976c362b7196d"
INITIAL_SHA = "89d490e90702e380a5640f2389cfd49e04b3841ce289c35b7363e6cb357200b1"
ROWS = {196: 23, 197: 18, 198: 24, 199: 20}
CORRECTIONS = {
    196: ["p0196-counting", "p0196-dotted-emphasis"],
    197: [],
    198: ["p0198-counting"],
    199: ["p0199-counting"],
}


def bind(path):
    return {
        "path": str(path.relative_to(ROOT)),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def checked_binding(path, expected_sha):
    value = bind(path)
    assert value["sha256"] == expected_sha, f"Changed frozen bytes: {path}"
    return value


def main():
    target = OUT / "author-correction-freeze.json"
    assert not target.exists(), "One structural check only; preserve its freeze"
    assert OUT == ROOT / (
        ".intentfold/tickets/STEMROBIN-181/tmp/"
        "9p-next-source-0196-0199-correction-1"
    )
    inputs = {
        "initial_review": checked_binding(REVIEW, REVIEW_SHA),
        "preserved_initial_review": checked_binding(
            BEFORE / REVIEW.name, REVIEW_SHA
        ),
        "initial_author_freeze": checked_binding(
            INITIAL / "author-freeze.json", INITIAL_SHA
        ),
        "preserved_initial_author_freeze": checked_binding(
            BEFORE / "author-freeze.json", INITIAL_SHA
        ),
    }
    review = json.loads((BEFORE / REVIEW.name).read_bytes())
    initial = json.loads((BEFORE / "author-freeze.json").read_bytes())
    review_pages = {item["pdf_page"]: item for item in review["pages"]}
    initial_pages = {item["pdf_page"]: item for item in initial["pages"]}
    assert list(review_pages) == list(ROWS)
    assert review["ticket"] == "STEMROBIN-181" and review["batch"] == "D020"
    assert review["author_freeze"]["sha256"] == INITIAL_SHA
    contracts = {
        name: checked_binding(ROOT / initial[name]["path"], initial[name]["sha256"])
        for name in ("lesson_skill", "profile")
    }
    parser = checked_binding(
        TOOLS / "blocks.py", initial["tools"]["blocks.py"]["sha256"]
    )
    sys.path.insert(0, str(TOOLS))
    import blocks

    pages = []
    for page, expected_rows in ROWS.items():
        reviewed = review_pages[page]
        authorized = reviewed["authorized_corrections"]
        assert [item["id"] for item in authorized] == CORRECTIONS[page]
        old_file = BEFORE / f"{page:04d}.page.md"
        new_file = OUT / old_file.name
        frozen_sha = reviewed["draft"]["sha256"]
        assert frozen_sha == initial_pages[page]["draft"]["sha256"]
        original_binding = checked_binding(INITIAL / old_file.name, frozen_sha)
        before_binding = checked_binding(old_file, frozen_sha)
        before = old_file.read_bytes()
        after = new_file.read_bytes()
        expected = before
        reverse = after
        configuration = None
        emphasis = None
        if authorized:
            configuration = reviewed["rows"][
                "single_independent_configured_probe"
            ]["configuration"]
            assert set(configuration) == {
                "reason", "top_margin_px" if page == 199 else "edge_margin_px"
            }
            assert configuration.get(
                "top_margin_px" if page == 199 else "edge_margin_px"
            ) == (26 if page == 199 else 120)
            serialized = json.dumps(configuration, ensure_ascii=False, indent=2)
            indented = serialized.replace("\n", "\n  ")
            old_tail = b'  "errata": []\n}\n---\n'
            new_tail = (
                '  "errata": [],\n  "counting": ' + indented + "\n}\n---\n"
            ).encode("utf-8")
            assert expected.count(old_tail) == 1
            assert reverse.count(new_tail) == 1
            expected = expected.replace(old_tail, new_tail, 1)
            reverse = reverse.replace(new_tail, old_tail, 1)
        if page == 196:
            emphasis = authorized[1]
            lines = emphasis["corrected_block_lines"]
            assert len(lines) == 5
            corrected = "\n".join(lines).encode("utf-8")
            assert corrected.count(b"**") == 2
            unmarked = corrected.replace(b"**", b"")
            assert expected.count(unmarked) == 1
            assert reverse.count(corrected) == 1
            expected = expected.replace(unmarked, corrected, 1)
            reverse = reverse.replace(corrected, unmarked, 1)
        assert after == expected, f"Unauthorized byte changes on page {page}"
        assert reverse == before, f"Non-reversible correction on page {page}"

        # Compare native structures after undoing only the authorized changes.
        before_meta, before_blocks = blocks.parse(before.decode("utf-8"))
        after_meta, after_blocks = blocks.parse(after.decode("utf-8"))
        reversed_meta = copy.deepcopy(after_meta)
        if configuration is not None:
            assert reversed_meta.pop("counting") == configuration
        assert reversed_meta == before_meta
        reversed_blocks = copy.deepcopy(after_blocks)
        if emphasis is not None:
            assert after_blocks[1]["lines"] == emphasis["corrected_block_lines"]
            reversed_blocks[1]["lines"] = [
                line.replace("**", "") for line in after_blocks[1]["lines"]
            ]
        assert reversed_blocks == before_blocks
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in after_blocks
        ]
        assert block_rows == reviewed["rows"]["block_rows_before_samerow"]
        counted_rows = blocks.printed_lines(after_blocks)
        assert counted_rows == expected_rows
        assert counted_rows == reviewed["rows"]["parsed_draft_rows"]
        pages.append({
            "pdf_page": page,
            "printed_page": after_meta["printed_page"],
            "initial_draft": original_binding,
            "before": before_binding,
            "after": bind(new_file),
            "authorized_corrections_applied": authorized,
            "counting_configuration_applied": configuration,
            "native_structural_rows": counted_rows,
            "block_rows_before_samerow": block_rows,
            "samerow_adjustment": counted_rows - sum(block_rows),
            "native_parser_and_body_reversal_match": True,
            "whole_file_authorized_changes_reversal_byte_identical": True,
            "byte_identical_copy": after == before,
            "words_formulas_flags_rough_boxes_and_other_metadata_unchanged": True,
            "configured_counter_evidence": {
                "origin": "initial independent reviewer evidence; not author rerun",
                "review_page_rows_pointer": (
                    f"pages[pdf_page={page}].rows."
                    + ("single_independent_configured_probe" if authorized
                       else "native_initial_author_masked_evidence")
                ),
                "author_counter_calls": 0,
            },
        })

    candidates = []
    for figure in review["figures"]:
        candidate = figure["candidate"]
        candidates.append(checked_binding(
            ROOT / candidate["path"], candidate["sha256"]
        ))
    for page in pages:
        checked_binding(ROOT / page["initial_draft"]["path"],
                        page["initial_draft"]["sha256"])
    checked_binding(REVIEW, REVIEW_SHA)
    checked_binding(INITIAL / "author-freeze.json", INITIAL_SHA)

    result = {
        "schema": "s10y/source-author-correction-freeze@1",
        "ticket": "STEMROBIN-181",
        "batch": "D020",
        "book": "9p",
        "role": "source-correction-author-only",
        "status": "frozen-author-corrections-awaiting-independent-review",
        "date": "2026-11-16",
        "ownership": str(OUT.relative_to(ROOT)) + "/",
        "inputs": inputs,
        "contracts": contracts,
        "helper": bind(Path(__file__).resolve()),
        "native_parser": parser,
        "pages": pages,
        "unchanged_candidate_bindings": candidates,
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
        },
        "approval": {
            "independent_source_approval": False,
            "science_approval": False,
            "modern_approval": False,
            "author_only_not_approval": True,
        },
        "not_performed": [
            "image loading or image payloads", "source gates", "SCI",
            "full counter rerun", "native counter", "snap", "crop", "finalize",
            "vectorize", "assemble", "browser", "DB", "Git",
            "original edits", "candidate edits", "retention or promotion",
        ],
        "in_flight_processes": [],
    }
    with target.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "freeze": bind(target),
        "native_structural_rows": list(ROWS.values()),
        "author_only_not_approval": True,
        "native_counter_calls": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
