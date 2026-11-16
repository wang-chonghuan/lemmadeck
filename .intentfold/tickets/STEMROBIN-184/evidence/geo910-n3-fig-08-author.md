# fig-08 Frozen Author Handoff

Current candidate frozen. Mechanical draft validation and current renderer are **PASS**. This is an author handoff, not an independent review or approval. Parent reports independent source/math/visual PASS and owns `record_review.py` and promotion. No candidate change or rerender after the freeze instruction.

## Inputs And Mathematics

The already frozen, individually observed raw source inventory was reused unchanged. Complete official `context.json` and complete approved n3 prose were read before authoring. No answers, choices, parent source solutions, or prior specs were used.

- Original PNG SHA: `af5d4d076448046993f46b942cdcd2d6ae97cb606cb811e7e9de2eb0df91be6e`.
- Official context SHA: `00a3667034f7a124c0cff5fc2201ff06496a4e6c791ae7bb857fa1798e634735`.
- Approved n3 `lesson.json` SHA: `96c55e5e7ef97d49ae2610ac7823fe83602685e437642d4fdb942ac838913f10`.
- Approved n3 `exercises.json` SHA: `251aaa5219b796eafde40d37df0ba5ad2906e277cb0fd085c508578966864d9d`.

All four source points B/C/M/O and all ten label occurrences are retained. Left B/C lie on one line with unlabelled continuations beyond them. M is off that line: the determinant of BC and BM is9.84, not0, for the declared representative coordinates. Right a/b share exactly O; their direction determinant is-58.24, not0, and dot product4.48, not0. No unintended perpendicular relation or extra point is asserted. These unlabelled coordinate calculations establish the illustrative realization, not source measurements.

Plane membership is source/modern-text semantics. `inside` assertions only check placement in the drawn patch; they do not equate an unbounded plane to a finite polygon. Rounded source plane-sketch ink was regularized as an irregular polygonal patch, with no measured polygon, rectangle, axes, lengths, ticks, or angle marks. Extra vertical label spacing, clean strokes/type and ASCII a)/b) are declared modern display choices. Frozen cap1 notes retain their historical pre-context wording and were not rewritten.

## Actual Attempts

1. Explicit draft validation: PASS.
2. Initial renderer: FAIL, 16 objects / 10 labels, solely `a-M-label`, position E, score10000. Exact initial spec/SVG/report/native PNG are retained in `initial-render/`.
3. One read-only SVG label-bounds diagnostic; no SVG edits or candidate geometry changes.
4. One targeted repair: only `a-M.labelPlacement.offset` added as `[0,12]`. Every non-label-placement field is unchanged by structured comparison.
5. Second renderer: PASS, 16 objects / 10 labels, empty collisions. No further renderer run.

Native640 PNG is reused from the successful renderer output. One isolated preview batch created neutral240 and print346 from the current SVG, with actual print-media emulation. Measured widths/heights: 640x480, 240x180, 346x259.5; corresponding minimum text sizes: 44, 16.5, 23.7875px. All three current previews were opened by the author. Parent separately reports having opened all three once.

All browser launches were isolated official Playwright with explicit `headless:true` and `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`; preview network requests were aborted. No user window/profile/CDP/OS input, Azure/model call, service, DB, git, source/helper/text edit, review, or promotion. Owned browsers are closed.

## Current Files

Base directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-08/`.

| File | SHA-256 |
| --- | --- |
| `source-inventory.md` | `d2a937ce68dcc77cf581a41aae7dc2bc536f6609750049236f06e2b2a4719ba0` |
| `spec.json` | `290fc3b038acbc2194458783d0b85f75efb30b909220dbdc530d0dce11a12d6d` |
| `fig-08.svg` | `79208e7254c33228aa66f941186435c238b4a7add4b613d79aa361ab486acdcf` |
| `fig-08.render.json` | `06a82a39b76ed9ff50d819af034dc431f5b0e98553ee90dbfe2f2b68b5c0e655` |
| `fig-08.native.preview.png` | `f866b2e0794b33f9e027c793761005ca92530637882f59aa912aee713be52fd7` |
| `fig-08.neutral-240.preview.png` | `d61538b6be558489173f43b52cec2ec5fd6e74ce5174f0e3ca39ea60d9ef4c51` |
| `fig-08.print-346.preview.png` | `3f8a3d4e9e63c32cd1032c9358544fb8036fc547705dd61c8e80c47c487d0ead` |
| `fig-08.display.json` | `4a90f76c09df4b3892f6d01801772c984ef820c92d50b43d35f80d0c2bb4e8b4` |

## Preserved Initial Failure

The following exact files remain below the same base directory.

| File | SHA-256 |
| --- | --- |
| `initial-render/spec.json` | `39ff65bfab1e2839f66b4d4560f4ff00fb70a9ed6238954e3b223bc99b3186e4` |
| `initial-render/fig-08.svg` | `2eda03bae5507229571609b33d81045823829fe945642d19d807888f2da825e4` |
| `initial-render/fig-08.render.json` | `55db5e3b7ea6846726a3e3f5a82c24604d4fd59dcff191645c9e7bcd3181421f` |
| `initial-render/fig-08.native.preview.png` | `57602138387396e1b76656cdf11951e66e3e4e431044955da677853a071ea5c1` |

`fig-08.display.json` binds source, inventory, official context, modern lesson/exercises, current spec/SVG/report, every preview, and every initial snapshot by hash. Current mathematical/visual approval is the parent's separate responsibility, not this author's gate.
