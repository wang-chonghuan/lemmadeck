# Affected-Only Independent SOURCE Review: 8p 21 Repaired

**SOURCE PASS for the exact frozen page-21 subset below.**
Fresh independent review for STEMROBIN-180/C, offline, physical page 21 /
printed page 9. Only `p0021#3` line 2, physical row 9, was substantively
reviewed. No source edits, gate reruns, promotion, assembly or numbering change.
Inflight: 0.

## Affected FIRST Verdict

Actual `source/page.png` was visually inspected before current candidate text.
The source prints the correct final glyph **U+5EA6**, not U+77ED.
An independent unresampled row crop confirms the printed glyph.
Current MD and JSON match that source phrase. No remaining essential defect.

The original immutable `SOURCE-FIRST.json` decision remains page-21
**REVISE**: one word mismatch. This new affected-FIRST verdict resolves only
that finding, without rewriting the FIRST history or performing a full review.
All 17 other physical rows, the unchanged remainder of row 9, figure-6 and
figure-7 approvals are reused from that hash-bound FIRST review.

## Machine Delta Evidence

- MD: exactly one code-point replacement, U+77ED -> U+5EA6, offset 1686
  (zero-based); UTF-8 offset 2130; file line 72.
- JSON: exactly the same one-character replacement, code-point offset 2430,
  UTF-8 offset 2874; structured path `/blocks/2/lines/1`.
- Both files retain their byte lengths; all bytes outside that glyph are
  identical. Restoring just the target JSON string makes the complete
  parsed JSON equal FIRST. All other blocks, flags, metadata, numbers,
  punctuation, captions, footer and figure boxes remain identical.
- `audit.json` is byte-identical FIRST/current: 10 blocks, 18/18 rows,
  2 figures, 0 normalizations. The sole-repair pre-finalize MD hash equals
  the current MD hash; finalization introduced no other MD change.
- Both figure PNG pairs are byte-identical FIRST/current and pixel-identical
  to their actual source rectangles. Figure visuals were not reopened or
  substantively rereviewed; the unchanged visual approvals are reused.
- Actual source PNG matches the immutable FIRST raw-source hash and the
  pre-finalize source binding. Layout and figures match pre-finalize bindings.

The 18 read-only payload files all match the packet manifest before and after
comparison: 164189 payload bytes. Manifest: 9559 bytes, SHA-256
`2abc2434a5a8b941b4e64bf50af4997e623673e6ae8f72ad0b12ef12423018bc`.
Original-path metadata is provenance only; no mutable source tree was opened.

## Approved Frozen Subset

Paths below resolve only against
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-repair-8p21/affected-review-packet`.

| Packet-relative file | Bytes | SHA-256 |
| --- | --- | --- |
| current/page.md | 2881 | `21c4fa98ce5b5f2e267ed3b451e10d686af41227a88ec01645a35ebabea16e28` |
| current/page.json | 5035 | `2ff4b7b2a3714d1be44a76c75957f06c793c56be9a210750b2be69258e1abc57` |
| current/audit.json | 649 | `c5015fc3edd5f3d55760c28babaef3db47997b4b2ccdcbffb16acb6fac963f25` |
| current/figures/fig-06.png | 5245 | `b59309678769895087a9b1c7a33479bb9969a958c0dfaebbdb4b9174978e1741` |
| current/figures/fig-07.png | 6175 | `6078b261d71eeca1492f623a2eae47011ecf662efc7b223543cf7c078b8765a4` |

## Receipts, Budget And History

Reuse the official affected-finalize receipt: one call, exit 0, 18/18 rows,
2 figures, 0 normalizations; empty stderr. No official gate run by this reviewer.
Receipt: 998 bytes, SHA-256
`9fda38a58f3f861c1a687810de6be08659c5dfe8b5a680fa5731ee636b641dfe`.
Author repairs 0, main sole repair 1; total **1/1**, remaining **0**.
Any remaining defect would be **BLOCKED**, with no further repair.

New reviewer command failures: 0. Preserve original SOURCE REVISE, original
successful FIRST finalize, both reported author non-gate discovery failures
and both prior FIRST-reviewer bookkeeping failures from the frozen report.
Their external logs were not opened; no historical raw output is fabricated.

## Evidence And Boundaries

Owned evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p21-repaired`.
`AFFECTED-FIRST.json`, `bindings.json`, `delta-checks.json`,
`pixel-checks.json`, `image-ledger.json`, `failure-history.json`, `handoff.json`
and `manifest.json` freeze the verdict, current bindings and evidence hashes.
`verify.mjs` preserves the successful machine-comparison implementation.
Row crop `p0021-row9-source.png`: LTRB `[230,875,1530,923]`, 1300x48,
5055 bytes, SHA-256
`970f1438e295ddca6faa99187b3b48b7a996a2cc036454a082db048b220854ae`.
No image payload is returned to the parent.

One image batch: 2/8 visual opens, 2/24 context images, reopens 0, parent 0.
Permanent gaps 17/18/20 remain; 23 remains BLOCKED (FIRST rows fail plus spent
startup, per user instruction). No gap, other page or other unit was opened.
Existing page-22 approval is untouched, not reissued here.
Exercise numbering remains UNSET. This verdict closes no unit, batch or course.
No DB/env/network/modern/answers/choice/Git/IntentFold/freshness/Grill/install/
fullchecks/services/app schema/other-chat work was performed. Stopped at this
affected-only report; no promotion or assembly authorized.
