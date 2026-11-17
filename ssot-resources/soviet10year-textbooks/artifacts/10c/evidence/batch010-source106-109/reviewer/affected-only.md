# STEMROBIN-184: Affected-Text-Only Confirmation

Date: 2026-11-17.
Verdict: **PASS_APPROVED_B1_ONLY**.
Scope: the single authorized post-patch text confirmation, not a new
Stage B or source review.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Comparison Evidence

Compared complete file bytes, not just displayed lines or hashes:

- Preserved originals:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-originals/{0106,0107,0108,0109}/page.md`
- Current durable pages:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{0106,0107,0108,0109}/page.md`

Each preserved original's SHA-256 matches its previously reviewed
Stage B author version. All four pairs have equal byte lengths.

## Approved 0106 Change

Location: exercise 394а, author typed block p0106#2.

| Evidence | Result |
| --- | --- |
| Preserved original SHA-256 | `2b7b588c96c1a452d562a3435d867572589ebe7fe13aef1c96403449b52f576c` |
| Current durable SHA-256 | `431db8070e5c201d6b7487246a8295160ae91884aa16b03d0e890930e51fb832` |
| Original byte length | 2592 |
| Current byte length | 2592 |
| Byte-length delta | 0 |
| Differing byte positions | Exactly 1 |
| Zero-based differing byte offset | 1459 |
| One-based byte position | 1460 |
| Old byte | `0x5B`, decimal 91, `[` |
| New byte | `0x5D`, decimal 93, `]` |
| Old interval text | `x\in[0,\infty[;` |
| New interval text | `x\in]0,\infty[;` |
| Verdict | **PASS: only the approved B1 bracket replacement** |

The differing byte was located inside the preserved `<!-- ex 394 -->`
block and its 394а interval. A copy of the preserved bytes with only
that byte replaced by `]` is exactly equal to the current durable
0106 file. No other byte, whitespace, newline, frontmatter, formula,
subpart, or block changed.

## Other Pages: Exact Equality

| Page | Preserved SHA-256 | Current SHA-256 | Old / New Bytes | Length Delta | Differing Bytes | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 0107 | `0b8f65ce7810e5280695875d1698d2742beed6788e11e0409fdef046a4a9db15` | `0b8f65ce7810e5280695875d1698d2742beed6788e11e0409fdef046a4a9db15` | 2708 / 2708 | 0 | 0 | PASS_UNCHANGED |
| 0108 | `71748176a14018c1e71595fcfcbd7804fbce7f8b7b771024d3599cf5184cdbfc` | `71748176a14018c1e71595fcfcbd7804fbce7f8b7b771024d3599cf5184cdbfc` | 2255 / 2255 | 0 | 0 | PASS_UNCHANGED |
| 0109 | `abc8b1d2a8aaba6627dace0a42fe051b1b96541aa121553156146ef860974c24` | `abc8b1d2a8aaba6627dace0a42fe051b1b96541aa121553156146ef860974c24` | 2883 / 2883 | 0 | 0 | PASS_UNCHANGED |

These verdicts use exact whole-file byte comparisons as well as SHA-256,
not hash equality alone.

## Reused Conclusions and Limits

The consumed sole Stage B report remains the historical review of the
pre-patch author version:

- `stage-b.md` SHA-256:
  `930f9852904cab527bed1b96aa39a1c9315923e57ef94526c3040a382a1c1ef5`.
- `stage-b-ledger.md` SHA-256:
  `8a59691578683f147b4e9c257314379d5e246a7b157a7f20ddc9309bf20faa1f`.

Its source, row, figure, whole-owner, continuation, and boundary
conclusions are reused without re-review. The sole B1 transcription
change is now confirmed in the current 0106 bytes; the historical
mistaken author reading and original freezes remain separate records.

Source outside-figure row counts remain 19, 26, 14, 18, total 77;
the two table-internal rows remain separately accounted for. Whole
worked-example exclusions and unsolved-proof distinctions are unchanged.
The additive parent-testimony provenance qualification is unchanged.
Exercise 408 and unit 98 global right boundaries remain unproved.

No image was opened or reopened. No crop was opened or reopened.
Permanent reviewer image counts remain **5/8 batch**, **5/24 context**;
parent remains **24/24**. No source re-review or new Stage B occurred.

Only this new `affected-only.md` was written, using `apply_patch`.
Preserved originals, durable pages, Stage A freezes, Stage B reports,
ledgers, and images were not rewritten. No finalize, gate, assembly,
render, test, database, publication, Git, or other product/workflow
operation was performed.

Confirmation complete. Stop after returning this file's path and hash.
