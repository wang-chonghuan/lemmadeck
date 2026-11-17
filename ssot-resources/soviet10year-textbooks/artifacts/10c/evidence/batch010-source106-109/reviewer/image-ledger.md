# STEMROBIN-184: Stage A Image Ledger

Date: 2026-11-17.
Stage: A ONLY; frozen; WAIT.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Permanent Budget

- New independent reviewer; no image-bearing parent history supplied.
- Allowed originals: physical 0106, 0107, 0108, 0109 only.
- Original image loads: **4**.
- Batch usage: **4/8**, permanent.
- Context usage: **4/24**, permanent.
- Reopens: **0**.
- Crops: **0**.
- Grids: **0**.
- Resampled or composed images: **0**.
- Other image loads: **0**.
- Four remaining batch image slots are reserved for NEW targeted crops
  ONLY after an explicit parent Stage B request.
- No resets, smaller views, waiting, text returns, or budget restarts.
- Parent usage is permanently **24/24**. Return only text paths, hashes,
  and observations; no image payloads or original-page reopening at parent.

## Pre-View Validation Method

Before any visual load, one read-only Node built-in command read only the
four allowed original files, checked the PNG signature
`89504e470d0a1a0a`, checked the `IHDR` chunk identifier, read the big-endian
width and height fields at offsets 16 and 20, and required **1695 x 2580**
for each file. It computed SHA-256 over each complete unchanged file.
No raster decode, visual payload, derivative file, or resampling was
produced by this metadata/hash check.

The same command checked existence, not contents, of the two allowed output
paths. Both were absent before creation. No author or other-reviewer file
was inspected.

## Original 1 / Physical 0106

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0106/page.png`
- SHA-256: `dc99f6a793ede1732a5d5525bab10089c707c6a49aba3ad860beeae7dbd4ea35`
- Byte size: **76244**.
- Native dimensions verified before viewing: **1695 x 2580**.
- Visual tool: `functions.view_image`.
- Detail: `original`.
- Visual load ordinal: **1**.
- File visual load count: **1**.
- Batch/context usage immediately after load: **1/8**, **1/24**.
- Reopen/crop/grid/resampling counts: **0 / 0 / 0 / 0**.
- Direct printed footer: **100**.
- Outside-figure printed rows including footer: **19**.
- Direct first object: **393. а)**.
- Direct unit boundary: **98. 原函数的基本性质**, after 400/401.
- Figures: **0**.

## Original 2 / Physical 0107

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0107/page.png`
- SHA-256: `267c5c5c8f6998966a7e9c98499ec9cb822b554ccb15398be5a52112731942ff`
- Byte size: **103356**.
- Native dimensions verified before viewing: **1695 x 2580**.
- Visual tool: `functions.view_image`.
- Detail: `original`.
- Visual load ordinal: **2**.
- File visual load count: **1**.
- Batch/context usage immediately after load: **2/8**, **2/24**.
- Reopen/crop/grid/resampling counts: **0 / 0 / 0 / 0**.
- Direct printed footer: **101**.
- Outside-figure printed rows including footer: **26**.
- First object: preparatory-theorem proof continuation.
- Last non-footer row: **因此，**, main-theorem proof still open.
- Figures: **0**.

## Original 3 / Physical 0108

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0108/page.png`
- SHA-256: `c0fda47bf8b1ca7a0dbb192e11f27893f9bdf751517700ba1a8f357e3123556d`
- Byte size: **65015**.
- Native dimensions verified before viewing: **1695 x 2580**.
- Visual tool: `functions.view_image`.
- Detail: `original`.
- Visual load ordinal: **3**.
- File visual load count: **1**.
- Batch/context usage immediately after load: **3/8**, **3/24**.
- Reopen/crop/grid/resampling counts: **0 / 0 / 0 / 0**.
- Direct printed footer: **102**.
- Outside-figure printed rows including footer: **14**.
- Figure captions share one printed row.
- Figures: **2**, numbered **46** and **47**.
- F46 inventory: one coordinate plane, labels `x`, `y`, `0`, four curves.
- F47 inventory: one coordinate plane, labels `x`, `y`, `0`, eight curves.
- F46 owner: lesson geometrical interpretation.
- F47 owner: whole excluded unnumbered worked example.
- Example's printed `M(9,-2)` is prose, not a labeled point in F47.
- Final equation: `-2=2sqrt(9)+C`; example remains open at page end.

## Original 4 / Physical 0109

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109/10c/pages/0109/page.png`
- SHA-256: `b223d3342f2499f0f1712929a551fb40a7b9bb0d7b3905ffd60b7761ab8912d3`
- Byte size: **86190**.
- Native dimensions verified before viewing: **1695 x 2580**.
- Visual tool: `functions.view_image`.
- Detail: `original`.
- Visual load ordinal: **4**.
- File visual load count: **1**.
- Batch/context usage immediately after load: **4/8**, **4/24**.
- Reopen/crop/grid/resampling counts: **0 / 0 / 0 / 0**.
- Direct printed footer: **103**.
- Outside-figure printed rows including footer: **18**.
- Table-internal printed text rows: **2**; including them gives **20**.
- Figures: **1** unnumbered table, **2 x 6**, all **12** cells transcribed.
- First two rows close the excluded worked example with `C=-8` and
  `2sqrt(x)-8`.
- Printed exercise heading: **习题**.
- Direct exercise objects: **402-408**; no supplied solutions.
- Last visible prompt: exercise 408, three rows ending in a question mark.
- Unit 98 right boundary beyond this page: **unproved**.

## Frozen Outputs and Content Limits

Created ONLY:

1. `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/source-first.md`
2. `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c106-109-review/image-ledger.md`

`source-first.md` freezes complete row transcriptions, source figure labels
and structures, whole-owner assignments, continuations, excluded solved
owners, unsolved proof/verification status, actual unit boundaries, and
uncertainty. Incoming physical 0105 remains testimony, with no image load
or independent source hash claimed for that page.

No derivative image evidence path exists because none was created.
No author comparison, Stage B work, or reserved crop use occurred.
Output SHA-256 hashes are returned after the files are written, outside
these files, avoiding self-referential hash claims.

WAIT for explicit parent Stage B disclosure/request.
