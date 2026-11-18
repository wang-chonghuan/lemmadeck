# Batch83 Exact-Byte Recovery: n149

Status: **RESTORED_EXACT_APPROVED_BYTES**, 2026-11-18.
Ticket scope: `STEMROBIN-180/180-3`; lesson: `phy7-c2-s3-n149`.
Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Observed branch: `codex/STEMROBIN-180-textbooks`.

This is recovery of previously approved TEXT template bytes, not authoring,
review, source reconstruction, approval renewal or promotion. The existing
`modern-text-review-n149-b54.md` verdict remains `PASS_TEXT_ONLY`.
Figures remain the exact approved TEXT-stage placeholder template; no figure
or publication approval is granted.

## Restored Files

Recovery root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-n149-recovered/`.

| File Under Recovery Root | Bytes | SHA-256 |
| --- | ---: | --- |
| `lesson.template.json` | 17733 | `b53c43070e8154bf159b072f4280bd0b928be0996a3726286eb221f99dfc898b` |
| `exercises.template.json` | 6708 | `d2890b0fa419631aa6601e3ec11c21889c09f1f5d267db83fcc873f22a546f7c` |
| `figures.template.json` | 2120 | `3ab2b69c1f7fd386709bfee889291398bd6fb6b403c5f845744f11bd4eb372ca` |

All three complete byte lengths and approved hashes matched in memory before
any restored-template write. After writing, the files were read back and
compared byte-for-byte with the extracted saved outputs; an additional
read-only size/SHA-256 check passed for all three.

## Exact Saved Provenance

Both source logs are under `/Users/yong/.codex/archived_sessions/`.
The structured JSONL parser selects only the template calls/outputs and
template custom apply_patch calls/outputs listed below.

Review log:
`rollout-2026-11-17T05-56-35-01a1e814-2102-77a3-976e-065118f223ba.jsonl`.

| Recovered Content | Call ID | Call / Output JSONL Lines |
| --- | --- | --- |
| Complete frozen lesson `cat` output | `call_dltcMfX3AfXN6yvM2nNE2LiT` | 33 / 47 |
| Complete frozen exercises and figures concatenated `cat` output | `call_hlk0E8JL8sUNAW9azgNZp7v4` | 34 / 48 |

Only the tool envelope preceding `Output:` was removed. The first JSON
object's boundary was located with `JSONDecoder.raw_decode`; its existing
trailing LF was retained. The saved concatenated stream was split at byte
6708 into exercises and figures. No newline was invented or stripped, and
neither JSON object was reserialized. Both complete outputs have exit 0 and
no truncation marker; each resulting JSON document parses in full.

Author log:
`rollout-2026-11-17T05-45-09-01a1e809-a901-77b1-bf71-746184aacdad.jsonl`.

| Corroborating Saved Input | Call ID | Call / Output JSONL Lines |
| --- | --- | --- |
| Prepared lesson template `cat` | `call_GJjKkG1Z4kbERuxc1t2f5FYy` | 187 / 199 |
| Prepared exercises template `cat` | `call_TfWVJ3ro8VuLQ6e96G6CAARR` | 188 / 201 |
| Unchanged figures template `cat` | `call_LI01JxUDDOHHBMrEFYL3mMW7` | 81 / 99 |
| Saved lesson/exercises template patch | `call_YzQ41LOidVFqdXi76ETvBKRf` | 215 / 218 |
| Saved lesson section-break patch | `call_ZSwtWWmZJRwFzOeVk0ZULiSv` | 231 / 234 |

The two saved patches, each with a recorded successful result, were replayed
only in memory against the exact saved prepared template outputs. All 31
hunks used ordered first-exact context matching, without fuzzy matching,
whitespace normalization or invented edits. The replayed lesson/exercises
and unchanged figures equal the saved frozen reviewer bytes exactly.
An initial recovery-only proof parser rejected repeated contexts; its
uniqueness restriction was corrected to ordered exact matching before
restored-template writes. No saved patch or candidate byte was changed,
no hash mismatch occurred, and no historical repair debit was reset.

## Recovery Evidence

Evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n149-recovery/`.

| File Under Evidence Root | Bytes | SHA-256 |
| --- | ---: | --- |
| `recover.py` | 10391 | `2510a1c7e756a96a8889d6c00cd3bf052bc8005b8971849ef2571a0353e5fd3f` |
| `selected-events.json` | 78418 | `1da64c797a11723f488607987c2d906f562ef608d3912cac9d11bdd83e6d7e34` |
| `proof.json` | 16776 | `5f7a972a6b2dca75667369dd8cc50f4b0ac4352c1eeba18444eb559f3fdf6a51` |

The evidence preserves only the selected source events, original call IDs
and line numbers, complete saved patch inputs and outputs, extraction
method, per-hunk mechanical replay bindings and restored file bindings.
No conversation-wide prose export, other chat or descendant was used.

The existing review report's observed binding stayed unchanged across
recovery: 13201 bytes, SHA-256
`7102a446de55d875d64c821a60d8a07e987fe0fad60b7e166d680cf1f250c8f3`.
Previous reports and all other workers' files were left untouched.

Writes are limited to the two owned recovery roots and this new note.
Raw source/snapshot reconstruction or edits: 0. New prose/fields/formatting
changes: 0. Pipeline, prepare/finalize, source/modern review, image/render,
database, app, dependency, setup, Git mutation and backend operations: 0.
No approvals or historical budgets were reset.
