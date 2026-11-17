# STEMROBIN-184: Additive Stage B Ledger

Date: 2026-11-17.
Status: SOLE_STAGE_B_COMPLETE / AUTHOR_CORRECTION_REQUIRED / WAIT.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

This ledger is new and additive. The original reviewer Stage A freeze
and image ledger, the six disclosed author texts, and all original
page PNGs were not edited.

## Immutable Stage A Anchors

| Existing Reviewer File | SHA-256 Verified Before Stage B Crop |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/source-first.md` | `b5a30c741076f8d081c0eb310b773c6da21aec8a94e1990f392ed48743c20893` |
| `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/image-ledger.md` | `0264b56c014c41a57901a9a4d094f5c34ac16c758abb0a5626c3bd9f16366251` |

The existing Stage A 394а reading remains `x\in]0,\infty[;`.
No text was replaced, patched, or silently corrected in either anchor.

## Six-File Disclosure Snapshot

Each of these six texts was read in full. No other new author file was
read. Absolute path prefix for every entry:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/`.

| Disclosed Text Path | SHA-256 at Full-Text Review |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0106/page.md` | `2b7b588c96c1a452d562a3435d867572589ebe7fe13aef1c96403449b52f576c` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0107/page.md` | `0b8f65ce7810e5280695875d1698d2742beed6788e11e0409fdef046a4a9db15` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0108/page.md` | `71748176a14018c1e71595fcfcbd7804fbce7f8b7b771024d3599cf5184cdbfc` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0109/page.md` | `abc8b1d2a8aaba6627dace0a42fe051b1b96541aa121553156146ef860974c24` |
| `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/handoff.md` | `3b6431d040eddb88e40198b9c30fa0dfe6df664ba528cea364cb0b4aa6022f63` |
| `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/ledger.md` | `9193dff39a5063bb4af8c6d169bbff3574c63a76e820b12f1a81d5e46e0299be` |

The first four hashes agree with those reported in the author handoff
and ledger. They identify the untouched versions reviewed here.

Preserved mistake in the first disclosed page: p0106#2 has
`x\in[0,\infty[;` in 394а. This is preserved separately from the
Stage A reading and the new pixel finding; no author correction has
been executed or claimed.

## Carried Permanent Image Loads

All paths below use the absolute workspace prefix above.
These loads were already completed in Stage A and were NOT repeated.

| Permanent Slot | Original Path | Dimensions | Original SHA-256 | Original View Count |
| --- | --- | --- | --- | --- |
| 1 | `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0106/page.png` | 1695 x 2580 | `dc99f6a793ede1732a5d5525bab10089c707c6a49aba3ad860beeae7dbd4ea35` | 1 |
| 2 | `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0107/page.png` | 1695 x 2580 | `267c5c5c8f6998966a7e9c98499ec9cb822b554ccb15398be5a52112731942ff` | 1 |
| 3 | `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0108/page.png` | 1695 x 2580 | `c0fda47bf8b1ca7a0dbb192e11f27893f9bdf751517700ba1a8f357e3123556d` | 1 |
| 4 | `.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0109/page.png` | 1695 x 2580 | `b223d3342f2499f0f1712929a551fb40a7b9bb0d7b3905ffd60b7761ab8912d3` | 1 |

Stage B entry counts: **4/8 batch**, **4/24 context**, permanent.
No image-bearing history or payload was sent to parent.

## New Native Targeted Crop / Permanent Slot 5

Authorization: explicit parent sole Stage B request, naming the genuine
394а bracket disagreement and allowing at most four new necessary
native targeted crops.

Reason: Stage A records `]0,\infty[` while author p0106#2 records
`[0,\infty[`. Need direct local glyph evidence, not calculus.

Original source:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0106/page.png`

Original dimensions, already verified before Stage A view: **1695 x 2580**.
Original SHA-256 from immutable Stage A:
`dc99f6a793ede1732a5d5525bab10089c707c6a49aba3ad860beeae7dbd4ea35`.

New crop output:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/stage-b-crop-0106-394a-interval.png`

- Rectangle `[x,y,w,h]`: **[850,480,310,95]**.
- Coordinate convention: zero-based top-left, width/height in original
  pixels; half-open bounds `[850,1160) x [480,575)`.
- Native crop dimensions: **310 x 95**.
- Bytes: **2083**.
- PNG SHA-256:
  `49e73650cccd22038a72f6c8065e055ab28895c229c5f8c99da3fd2d77a0f6f6`.
- Generated directly from original with native crop only:
  `sips --cropToHeightWidth 95 310 --cropOffset 480 850 <original> --out <new-crop>`.
- The processor emitted only this new local crop, not a whole-page
  image, grid, resampling, composition, or full-row crop.
- Before visual load, Node built-ins checked PNG signature/IHDR,
  verified dimensions 310 x 95, and computed the full crop SHA-256.
- Visual load tool: `functions.view_image`.
- Detail: `original`.
- Visual load count for this crop: **1**.
- New image ordinal: **5**.
- Cumulative counts after load: **5/8 batch**, **5/24 context**.
- Crop reopens: **0**.
- Original-page visual reopens: **0**.
- Original-grid loads: **0**.
- Other Stage B image loads: **0**.

Direct crop text: `x∈]0,∞[;`. The left bracket is `]` with horizontal
strokes extending left from the right-side stem; the right endpoint
bracket is `[`. Stage A is confirmed. The author 394а left bracket
is the mistaken reading, retained in its original hash-identified file.
No mathematical inference or source erratum is involved.

## Permanent Final Budget

- Originals loaded in Stage A: **4**, each exactly once.
- New crops loaded in Stage B: **1**, exactly once.
- Total reviewer image loads: **5**.
- Batch use: **5/8**, permanent.
- Context use: **5/24**, permanent.
- Remaining batch slots: **3**, not used.
- No wait, text response, reset, or compaction restarts these counters.
- Parent remains permanently **24/24**.
- Return no crop embed, whole-page embed, or image payload to parent.
  Return only existing textual evidence paths and hashes.
- This completed Stage B does not authorize another image load.

## Content Counts and Comparison Coverage

| Physical / Printed | Source Outside-Figure Rows Including Footer | Author Stored Rows | Shared-Row Deductions | Typed Blocks Compared |
| --- | --- | --- | --- | --- |
| 0106 / 100 | 19 | 21 | 2 | 14 |
| 0107 / 101 | 26 | 26 | 0 | 11 |
| 0108 / 102 | 14 | 15 | 1 | 9 |
| 0109 / 103 | 18 | 21 | 3 | 15 |

Actual outside-figure source-row total: **77**. All **49** author typed
blocks are compared in `stage-b.md`. The table has two internal actual
text rows and 12 cells, all compared: **79** when table rows are added.
Diagram-internal `x,y,0` labels are separately inventoried, not counted
as body rows. No machine gate or layout file was read or run here.

Author raw-layout band counts 27/22 are only disclosed author statements.
They were not independently verified and do not change source counts.

## Additive Provenance and Boundary Qualifications

- `human-supplied` in author ledger means parent delegation/testimony
  in this invocation, NOT new direct-human source evidence.
- No 0105 source/artifact was read. Incoming solved p0105#4/#5
  exclusions remain whole-owner testimony-backed exclusions.
- The direct first object 393 on 0106 proves no continuation of 392
  onto this page; the reported 0105 subparts are not upgraded to
  independent pixel evidence.
- Unit97 closure is source-proven by the actual unit98 heading on 0106.
- Both supplied theorem/proof owners and the full unnumbered worked
  example with fig47/caption are mapped and retained as whole excluded
  owners in `stage-b.md`.
- Unsolved proofs 393-397 and the reader's table-verification request
  remain unsolved; no answer is inferred or created.
- 408 is visibly complete as a three-row, two-question prompt, but
  its global right boundary remains **unproved**.
- Unit98 global right boundary remains **unproved**.
- No physical110 or other next-page text/pixels were read.

## New Writes Only

1. New targeted crop:
   `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/stage-b-crop-0106-394a-interval.png`
2. New findings/disposition:
   `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/stage-b.md`
3. New additive ledger:
   `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/stage-b-ledger.md`

All three target paths were absent before creation.
The two reports were created with `apply_patch`.
No existing author page, handoff, ledger, reviewer freeze, source image,
or other agent's file was edited.

Output report hashes are returned after writing, outside their own
contents to avoid self-referential hash claims. Existing anchor and
disclosure hashes are rechecked after report creation without any
image loading.

No finalize, assembly, gate, extraction, vectorization, binder, render,
test, database, publish, Git, SkillHost, or new workflow was run.

WAIT. Source-content correction B1 is reported, not performed.
