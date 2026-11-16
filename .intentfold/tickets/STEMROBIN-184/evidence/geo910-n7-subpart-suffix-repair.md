# Numbered Subpart Suffix Repair

Date: 2026-11-16. Ticket: STEMROBIN-184.
Scope: authorized helper repair, not new source or mathematical authoring and not independent semantic approval.

## Changes

Only these files were edited with `apply_patch`:

- `.claude/skills/ld-s10y-lesson/tools/edition.py`: only `normalize_numbered_subparts`, lines565-650.
- `.claude/skills/ld-s10y-lesson/references/edition-text-contract.md`: one sentence defining preservation of independently paragraphed suffixes and complete sentence newlines.
- New `.claude/skills/ld-s10y-lesson/tests/test_numbered_subpart_suffix.py`:18 independently expected focused tests.
- This report.

Paths are relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
No n7 template adjustment was needed. No source, figure, answer, choice, existing test, application, dependency or other tool edit occurred. No prepare/finalize/assemble/render, full suite, browser, service, database, publication or Git operation was run.

## Generic Boundary Rule

The existing complete-sequence and natural-order checks still run first. Ordinary inline subparts and wrapped continuation lines still use the existing whitespace joining.

Within the final source subpart, an existing blank-line boundary or a sentence-ending newline outside math separates an independently laid-out suffix. That suffix retains its paragraph boundaries and existing sentence newlines rather than being flattened into the last item. The implementation uses punctuation and whitespace only, not a task number or Chinese/English semantic keyword.

Actual blank lines are detected in the original string; the existing math mask only excludes candidate boundaries inside formulas and punctuation inside math. This avoids confusing erased formula ink with an empty paragraph.

For explicitly aligned two-column formula lists, source column membership is reconstructed first, including across blank inter-row spacing. Suffix detection then starts after the final source formula. No-alignment and odd-formula cases retain the existing conservative behavior.

The plain-statement erratum patch and every other byte outside `normalize_numbered_subparts` are unchanged. In-memory reversal of only this function patch reproduces the previous actual module SHA-256 `82c4aa0a8c827f5964a4616881333c2176d75a36513e1ec4c7c38f48bd0cbd1a`; no predecessor file was written.

## Tests and Actual Results

New expected outputs were written directly from the approved text contract and synthetic examples before consulting existing test expectations. Existing test bodies were not read as specifications; only method names were listed to select affected regression tests.

The18 new cases cover:

- Complete task plus construction items and multiple independent trailing paragraphs.
- Explicit blank boundaries without semantic keywords or sentence punctuation.
- Existing complete-sentence newlines, including CJK stops and closing quotes.
- Sorted inline numeric subparts, standalone marker lines and ordinary wrapped continuations.
- Preservation of inline text without inventing paragraph breaks.
- Formula-internal punctuation and blank lines not being interpreted as prose boundaries.
- Incomplete enumeration not being silently reinterpreted.
- Two-column source membership, absent alignment evidence, blank inter-row spacing and independent table suffixes.
- LF/CRLF paragraph structure and idempotence for every expected output.

Actual execution through `.claude/skills/ld-s10y-lesson/.venv/bin/python -B`:

1. First new-test run:14 cases, exit1,12 passed and2 failed. One real defect in the first patch mistook three masked formula rows for a blank paragraph. The other was a new CRLF expected-output mistake: the existing prefix join already emits LF. The former implementation defect and latter test expectation were corrected explicitly, without deleting either test.
2. Intermediate affected run:35 cases, exit0.
3. Final affected run after adding two table-boundary cases: **37 cases, exit0**.

The final37 comprise18 new cases plus19 existing affected cases: all3 `test_formula_columns`, all3 `test_adjacent_exercise_subpart`, all3 `test_sentence_part_boundary`, and10 selected numeric/lettered ordering, layout-validator, figure-number, coordinate and signature cases from `test_edition`. No unrelated edition integration tests or full suite were run.

## Actual n7 In-Memory Check

After the final patch, one read-only check used current `validate_source`, `source_ref`, `validate_errata`, `validate_text`, `normalize_prose_layout`, `validate_numbered_subpart_layout`, `normalize_exercise_layout` and `prose_flow_contract`.

Actual process exit: **0**.

```json
{
  "text_errors": [],
  "errata_errors": [],
  "protected_errors": [],
  "layout_errors": [],
  "text_items_checked": 36,
  "in_memory_normalization_document_equal": true,
  "drafts_unchanged": {
    "lesson": true,
    "exercises": true,
    "figures": true
  }
}
```

The in-memory normalized complete exercises document strictly equals the authored document, not only its mathematical signatures.

Exercise53 now retains all27 authored lines, including the full conclusion, proof, uniqueness research and methodological note:

- Authored UTF-8 text SHA-256: `3b98554aae3aabae443700a9c692580525341b9a877c589ca196d02642ee0abb`
- New normalized text SHA-256: the same `3b98554aae3aabae443700a9c692580525341b9a877c589ca196d02642ee0abb`
- New normalization is idempotent.
- The previous actual11-line normalized output and exit1 remain recorded in `geo910-n7-modern-author.md`; that original report was not overwritten.

The current n7 has23 prose objects,13 written tasks and19 official text paragraphs. Its four existing anchor boundaries still resolve at1/7/9/14. Registered `p0026-theorem3-target-line` remains bound to `lesson.prose[17]` and passes current source/hash/original/replacement checks. No math or wording was edited in this repair.

## Actual Hashes

SHA-256 of current file bytes:

| Changed file | Current hash |
| --- | --- |
| `tools/edition.py` | `0e634a4a77db27c43a2dcb5fbc13b011e400ecd90dc7cdc4abcba5118b54ed30` |
| `tests/test_numbered_subpart_suffix.py` | `1ff7411388f0f33f0e7d39b60d135d093ac3b682420fd09f4b018d6f4a09bb85` |
| `references/edition-text-contract.md` | `97d086b100b63150a23d218a2c6f0bafd2ddff17b17d189a91ec01638b75b977` |

n7 prepared author files are byte-identical before and after this repair:

| Unedited file | Before and after hash |
| --- | --- |
| `lesson.template.json` | `090ce96e411d57914431064281e6b526281ced5b5a7a60357e9ca897363b04cb` |
| `exercises.template.json` | `5f8ebbe42550de1f915e513b5de103a26cc53fb5c7480e6ad3da8c1b687243d2` |
| `figures.template.json` | `256d04656ebf45b0926022e5baac784d48faeb0e4649745533ecfe466c5286dd` |

The sole previously reported n7 layout blocker is resolved by the generic helper fix, with the gate still active. Parent independent text review and any finalization remain separate. Stopped after this scoped handoff.
