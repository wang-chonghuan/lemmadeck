# Batch 03: Bounded Pixel Review

Outcome: **needs review**. Six requested images opened exactly once each, with
`detail: original`; zero reopens, crops, other images, browser runs, or renders.
Source/math and headed runtime PASS are inherited, not rechecked or upgraded.

## Findings

- `right-6`, question 14: complete visible table right column, both rows, and
  final choice result. No obvious vertical clipping or overlap.
- `right-7`, question 15: all three table rows and final D result are visible.
  A-D conversion line endings run into the right boundary; D's line ending in
  `giving` is also crowded.
- `right-8`, question 16: A-D final result lines are separate and inside the
  bottom frame. First transformation lines abut the right boundary.
- `right-9`, question 17: final sentence is visible; no obvious vertical overlap.
  A/C conversion lines have no clear right-edge clearance.
- `right-10`, question 18: final radical result is visible, without obvious
  vertical overlap. A-C first-line endings are crowded at the right boundary.
- `right-11`, question 28: final D sentence is inside the frame. **B's terminal
  zero after the greater-than sign appears partly cut at the right image edge.**

Concrete issues: I01, right-edge crowding in the specified long option lines;
I02, apparent terminal-glyph cutoff in `right-11` B. Exact lost-pixel counts and
product-versus-capture causation are not established. These findings prevent an
unqualified unclipped-glyph visual PASS; they do not adjudicate any mathematics.

Left-side stem/table/formula loss is compatible with the specified right-end
views and is not independently called a defect. Filename direction does not
prove scrollMax; runtime evidence remains inherited.

## Limits And Ledger

PNG widths are 358, not the declared 390-pixel viewport. Heights in request order
are 826, 964, 477, 508, 480, and 510. These are region captures, not complete
844-pixel-high app-shell screenshots; the 964-pixel image cannot prove simultaneous
viewport fit. Final rows and bottom boundaries support only captured-region
framing.

Six image loads total in this fresh context; no prior or additional image loads.
Hashing and IHDR metadata reads were nonvisual. Original detail was requested,
but no observer-display scale/resampling trace was supplied. There was no zoom,
crop, reopen, native pixel count, font-size/transform/DPR measurement, or
independent small-glyph check. Fractions, powers, signs, and edge punctuation
remain limited-confidence. The at-least-16-pixel final-text gate and native
glyph completeness are **not certified**. No off-capture overlap is cleared.

Only `review.json` and this report were created, both to be frozen at `0444`.
The immutable request and all screenshot hashes matched. No answer/source,
product, database, dependency, git, or ticket-backend work was performed.

## Checked Images

1. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-6.png`
   SHA-256: `93fa7101f96487550445ec89a008130fee9b395377503047b1840c12744e5f99`
2. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-7.png`
   SHA-256: `94f81a349e10b03768002aac36a69e5e5160691468d5923a97b9c1130443848c`
3. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-8.png`
   SHA-256: `1f659a043e32518be3ef349cdd71397130da2e6ee538bdacb72107a8daded64d`
4. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-9.png`
   SHA-256: `79d29736cdc21aa15e1866188648df84c72a82ba1ba99e4138d3ba1b4c91254e`
5. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-10.png`
   SHA-256: `9bce94a7f06ec9207d80ccfd9365cc6339915cc4adb6026663c05a4f10de254e`
6. `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/alg7-c4-s3-n44-choices-390-right-11.png`
   SHA-256: `dcaa6b7038f2702e5acc1cb717dfa58cf38d05fa6e07a91e2c80001dd689cbb5`

Request: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-pixel-review/batch-03/request.json`

SHA-256: `925740a829d11fa67435eeb80b19479acc3b86e813302d72b810fbb96c2823a5`

Inherited capture-result reference (hash verified, contents not consulted):
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display/n44-complete-RECOVERY1/result.json`

SHA-256: `1921375f9e0ac4b75ace47a849f54473ccc6df1b2439d1b219f8a245bfe4f52d`
