# STEMROBIN-184 SOURCE-FIRST Stage A Image And Access Ledger

Status: COMPLETE Stage A; WAIT for parent consumption and exact Stage B author bytes.
Date: 2026-11-17.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Own scratch root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review`.

## Permanent Budget

- One batch only: at most 8 loaded images.
- Context total ceiling: 24 loaded images; no reset, reopen, or assumed clearing.
- Authorized allocation: 4 original pages plus at most 4 newly created essential
  native-resolution crops.
- Originals loaded: 4. Essential native crops loaded: 4. Reopens: 0.
- Batch permanently consumed: 8/8. This context consumed: 8/24.
- No further batch image load; no reset, image-history clearing, or delegation.
- Parent's supplied budget status: 24/24; return text and file paths/hashes only,
  never image payloads.

## Pre-Load Evidence And Loads

| Sequence | Physical page | Dimensions before load | SHA-256 before load | Load |
| --- | --- | --- | --- | --- |
| 1 | 0122 | 1695 x 2580 | `f2b14350ddc99c9330a0de3fcbd531bf4def183e79ec33a0c5fd0dacce501582` | `functions.view_image`, `detail: original`, once |
| 2 | 0123 | 1695 x 2580 | `47d3d19da383163f00bac4457c47557d7473cb548408d982b5a82ccba2fc9b07` | `functions.view_image`, `detail: original`, once |
| 3 | New crop from 0123, coordinate-integral sign | 1180 x 230 | `e0d426d9b58ef766a9cc34851c9b09089a084b742bb3ad31edc5eb15650e51f2` | `functions.view_image`, `detail: original`, once |
| 4 | New crop from 0123, exercise 442 coefficient | 1240 x 180 | `6d0cbec4badb3544fe627b35605ecb2d7bd7025a836fb98d8794f743618cf99c` | `functions.view_image`, `detail: original`, once |
| 5 | 0124 | 1695 x 2580 | `0c827c0253e29fc6ae55c2515511f589e99f03890911271e0ac9cc9c1bab9ac4` | `functions.view_image`, `detail: original`, once |
| 6 | New crop from 0124, formula (1) lower bound | 900 x 160 | `b9c466bd91fe84e9fbdd78286eefef61149a14ca6115876dfae0c337c4bd2ba3` | `functions.view_image`, `detail: original`, once |
| 7 | 0125 | 1695 x 2580 | `141bb38b345bb0889b511f70207a49c81530d848be0195ae870a3d47461e7aaf` | `functions.view_image`, `detail: original`, once |
| 8 | New crop from 0125, figure 56 inventory | 800 x 520 | `630a5313e5c0f1a1044b407878bba7a66a4361bbe66ccd9a9f2e135f8c0c4696` | `functions.view_image`, `detail: original`, once |

Original paths:

- Sequence 1:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0122/page.png`.
- Sequence 2:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0123/page.png`.
- Sequence 5:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0124/page.png`.
- Sequence 7:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0125/page.png`.

Essential native crop paths:

- Sequence 3:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/0123-coordinate-integral-native.png`.
  Source box `[x,y,w,h] = [300,925,1180,230]`. Needed to resolve the printed
  sign inside the example's coordinate-integral bracket. Native crop confirms
  `z-t_0`. Its lower edge clips part of the second-row fraction; that fraction
  was read from the already loaded original, not reconstructed from this crop.
- Sequence 4:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/0123-ex442-coefficient-native.png`.
  Source box `[x,y,w,h] = [280,1990,1240,180]`. Needed to resolve exercise
  442's first coefficient. Native crop confirms capital `R` in `Rt`, not `8`.
- Sequence 6:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/0124-eq1-lower-bound-native.png`.
  Source box `[x,y,w,h] = [520,1320,900,160]`. Needed to resolve the printed
  lower limit in 104* formula (1). Native crop confirms `b`.
- Sequence 8:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/0125-fig56-inventory-native.png`.
  Source box `[x,y,w,h] = [440,865,800,520]`. Needed to distinguish partition
  boundaries from the overlaid y-axis and inspect the printed labels.
  Confirms seven rectangles, origin between `x_1` and `x_2`, caption 56.
  The isolated round glyph left of the axis remains explicitly uncertain
  (`o`/`0`) rather than inferred from mathematical context.

All four crops were newly produced using `sips --cropToHeightWidth ... --cropOffset
... --out ...` without resize, enhancement, interpolation, or opening any
other page. Their individual metadata/hash calls preceded their individual loads.

For each load, `sips -g pixelWidth -g pixelHeight` and `shasum -a 256` were
completed on that exact path before `view_image`. Metadata reads do not load
images into the model context.

## Non-Source Access

- Read `.intentfold/readme.md` as repository session-entry instructions.
- Read `.intentfold/charter/engineering.md` as binding engineering rules.
- Read `.claude/skills/ld-s10y-lesson/SKILL.md` through its cap1 instructions.
- Read `.agents/skills/ld-s10y-image/SKILL.md`, including Image batches.
- Checked only the two owned scratch paths with `stat`; neither existed before
  creation. No existing file was overwritten.
- Read back only this run's own two scratch text files for patch-failure
  verification and final text consistency. These are newly authored independent
  notes, not prior reviews or author source.

No product source Markdown, grids, template bodies, previous reviews, answer
material, choices, TOC, adjacent-page pixels, live ticket/backend, other chat,
or unrelated scratch was read. No proactive discovery was performed.

## Writes And Prohibitions

- Manual text writes: `apply_patch`, only `source-first.md` and `ledger.md` under
  the owned scratch root.
- Four new essential native crop outputs were written by `sips` under that same
  scratch root. Originals were only read; no source pixels were edited.
- A multi-file `apply_patch` attempt failed context verification before writing
  either file; the corrected manual patch was then applied. The existing owned
  scratch text was read only to confirm that failure left both files unchanged.
- No source edit, finalize, assemble, vectorize, count repair, adaptation,
  answers, choices, tests, Git, database, publish, app, dependency, schema,
  Charter, SkillHost, or workflow action.
- Physical 0121 owner is UNKNOWN until a later parent transport of bounded text;
  no such transport has occurred in Stage A.
- Stage B author text has not been requested, discovered, or read.

## Freeze

Stage A text is complete. After the final text-only readback, both files are
SHA-256 hashed and the values are returned externally as the freeze evidence,
avoiding self-referential file hashes. No file edit is permitted after that
hash command. The source-original hashes may be rechecked as read-only byte
evidence; no image load or test is involved.

Frozen artifacts:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/source-first.md`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/ledger.md`

Handoff is text-only. Stage B author bytes remain unseen. Parent consumption
must occur before the sole exact-author-byte transport; until then WAIT.
