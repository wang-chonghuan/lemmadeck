# STEMROBIN-184 Fig61 Scroll Harness Repair

## Disposition

**HOLD - authorized single harness-repair run did not complete.**

Only fig61 accent/print were scheduled; no fig60, source, mathematics, neutral,
mobile, or full-package verification was rerun. The new helper executed **once**
and exited **1**. Chromium was closed and the command process had terminated
before this report was written.

The repaired scroll assertion correctly accepted the declared scroll surface
and validated the left endpoint's native canvas, full visible DOM height,
labels and contrast. A separate screenshot-coordinate mistake then produced
a **627x541** PNG instead of the measured **627.234375x560** visible region.
The faithful-clip/full-height assertion rejected it. Right-end scrolling and
actual print were therefore **not executed**. No fig61 theme PASS is claimed.

The initial `geo910-n15-offline-themes` report/check/measurements/run marker and
two fig60 PNGs remain byte-identical. Its original failure is retained, not
rewritten or superseded as though it had passed.

## Authorized Boundary

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

All new files are confined to:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/`.

Only the new helper and this report were manually created with `apply_patch`.
The run produced its own exclusive run marker, measurement JSON and one PNG.
No figure, original HTML, stylesheet, durable metadata, parent retention file,
or other worker's edit was changed. No DB, dev server, publisher, Git, new
dependency, model API, remote page, headed browser, or foreground action.
No answer/choice key, original source image, or independent mathematical review.

Current readme, engineering, operations and image quality gate were read.
The existing first helper was read as the inherited measurement implementation;
it was never edited or executed again.

## Real Scroll CSS

Read from the existing exercises HTML and subsequently observed in browser CSSOM:

```css
.fig[data-figure-layout="scroll"] {
  overflow: auto hidden;
  scrollbar-width: thin;
}
.fig[data-figure-layout="scroll"] .figure-media,
li.ex .body .fig[data-figure-layout="scroll"] .figure-media {
  width: 40em;
  max-width: none;
}
```

The exercise body also has `overflow-x:auto`; its computed overflow is
`auto/auto`. The helper intersects the real figure/body clipping ancestors
and browser viewport, rather than assuming the entire 640px media is visible.

Actual accent left surface:

| Measurement | Actual Value |
| --- | --- |
| Declared layout / computed direction | `scroll` / `ltr` |
| Figure overflow | `auto` horizontally, `hidden` vertically |
| SVG native canvas / rendered media | 640x560 / 640x560 |
| Figure visible width / `clientWidth` | 627.234375 / 627 CSS px |
| `scrollWidth` / derived maximum | 640 / 13 CSS px |
| Observed initial `scrollLeft` | 0 |
| Effective visible DOM surface | 627.234375x560 CSS px |
| Visible native x range at left | 0 to 627.234375 |
| SVG CTM scale | 1 |
| Declared / visible label count | 6 / 6 |
| Minimum actual label size | 28px |
| Minimum text contrast | 17.224382887077635:1 |
| Minimum painted contrast | 5.32921162976606:1 |
| Painted geometry count / outside-canvas geometry | 30 / 0 |
| Native labels outside canvas | 0 |

All six labels were fully inside the left DOM surface. The native SVG left
endpoint was actually reachable. The positive 13px scroll range was measured,
but **reaching the right end was not observed**.

Display disposition is **scroll-two-visible-surfaces required**, not
full-width-in-context. There is **no single full640 in-context PNG**.
Neither the SVG nor the surrounding CSS was resized to make it fit.

## Failure And Limitation

```text
AssertionError [ERR_ASSERTION]: Faithful visible clip within raster rounding
at captureSurface (.../check.mjs:241:3)
at .../check.mjs:297:5
```

The browser measured the SVG at screen top `399.96875`; the helper passed
capture top `418.96875`, adding a 19px page scroll offset. The PNG was 541px high,
19px shorter than the full 560px DOM surface. This offset addition was my
capture-harness mistake. The observed dimensions are consistent with a
viewport-relative clip being shifted down and truncated at the viewport edge;
that diagnosis was not tested with another capture.

The PNG is nonblank and readable, but it cannot prove the entire native canvas
height. No existing assertion was weakened to accept the smaller PNG.
The helper's right-end, continuous canvas coverage, label coverage across both
endpoints, actual-print checks, and final SVG/stylesheet DOM comparisons are
present but **were not reached**, so they are not acceptance evidence.

This is not evidence of a figure defect. The source/figure was not repaired.
There was no second repair, execution, alternate capture or image reopen.
The fig61 accent/print evidence gap remains open.

## Four Planned Screenshots

| File Below New Evidence Directory | Result | Actual Observation |
| --- | --- | --- |
| `fig-61-accent-left-visible.png` | **FAIL - capture height mismatch** | Exists, 627x541; opened exactly once. M, N, M1, N1, ell and alpha glyphs, subscripts, dots, solid/dashed lines and polygon edges are clear and not black. However, the full 560px native height is not captured; visual readability does not override the failed capture assertion. |
| `fig-61-accent-right-visible.png` | **FAIL - not run** | No PNG or right-end measurements. |
| `fig-61-print-left-visible.png` | **FAIL - not run** | No actual-print measurements or PNG. |
| `fig-61-print-right-visible.png` | **FAIL - not run** | No actual-print or right-end evidence, no PNG. |

The single PNG has 11,537 nonpaper and 5,816 dark pixels out of 339,207 pixels,
approximately 3.40% nonpaper. Its nonblank statistics are preserved in the
measurement JSON but the case never reached PASS.

Image inspection: one new screenshot opened once, one-image batch. This worker
context has loaded three images total including the prior two fig60 inspections;
neither prior image was reopened. No image payload was sent to the parent, whose
24/24 budget was explicitly respected. Final reporting is textual paths/hashes.

## Execution Evidence

New run interval: `2026-11-16T18:44:07.715Z` to `2026-11-16T18:44:08.485Z`.
Chromium `149.0.7827.55`, headless, ephemeral context, 1440x960 viewport,
device scale factor 1. The viewport is only the offline capture environment,
not a repeated desktop product pass.

The route was installed before the single exercises HTML navigation, allowing
only `file:` and `data:` and aborting all other schemes. Service workers were
blocked. Observed remote requests: **0**; page errors: **0**.
`browserClosed:true`, `initialFilesUnchanged:true`, `inputUnchanged:true`.
Final SVG/stylesheet DOM checks were not reached, not falsely reported as PASS.

Accent used only existing `var(--accent)` and `var(--sub)` media variables,
resolving to `rgb(43,95,142)` and `rgb(107,107,107)`. Actual painted roles are
ink/muted. Print was scheduled to remove those overrides and emulate real print
media, with no synthetic stylesheet, but was not reached.

## Exact Commands And Exits

Read-only CSS inspection, workspace-root cwd, exit **0**:

```sh
sed -n '6,47p' .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html
```

Output-directory preflight, exit **1** because this new directory did not exist:

```sh
ls -ld .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair
```

Sole new helper execution, cwd
`/Users/yong/.codex/worktrees/a07e/lemmadeck/app`, exit **1**:

```sh
node ../.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/check.mjs
```

Final output: `fail-stop-no-repeat-no-figure-repair`, one theme started,
one screenshot generated, browser closed, initial files unchanged.

Final new evidence and preservation hashes, workspace-root cwd, exit **0**:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/check.mjs .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/measurements.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/run-once.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/fig-61-accent-left-visible.png .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/report.md .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/check.mjs .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/measurements.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/run-once.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/fig-60-accent-640.png .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/fig-60-print-640.png .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html
```

This report was written with `apply_patch` after the browser and helper process
ended. Its own hash is returned separately.

## Paths And SHA-256

New evidence base:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes-fig61-scroll-repair/`

| Existing New File | SHA-256 |
| --- | --- |
| `check.mjs` | `5291d8fa884d5412ced01585e649f2d9682d355f128e91d8673e49c8c78cad50` |
| `measurements.json` | `0f357ae0b3d91ddc94b6f7e62f333a0b8518912863eb8cc53d4be448dd8f21a0` |
| `run-once.json` | `97299e615c48cacbc1e0c90078d64c28c399c096159b57c973a10455467e6e7d` |
| `fig-61-accent-left-visible.png` | `f8bbe1acf21fbd578bae344be5d48cf0bf96d405defb5035fa581c21e09d406b` |

Preserved initial evidence base:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/`

| Preserved File | SHA-256 Before And After |
| --- | --- |
| `report.md` | `aa1df86402201cea61034198ccb39c71bea6e83d82c50e6ed7956d59b618656d` |
| `check.mjs` | `d8c548a249c5968bc4397945ca93e0a72912002e431d943a62d631d713f6f2fe` |
| `measurements.json` | `faa5729bf90d05cd7437fed9874d2240eee5d9d98d1895bd74518e2c1b6b5553` |
| `run-once.json` | `bdbed4ddb75c02929e09443077241586aa8d1b9a88baed32de9f25425b38dfe7` |
| `fig-60-accent-640.png` | `3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38` |
| `fig-60-print-640.png` | `3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38` |

Unchanged input:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html`
SHA-256 `d0c5e597f9ceba9f1da0e797368b0155243188107fc0cddd1011bec77512d914`.
Initial and newly observed fig61 inline SVG SHA-256:
`c95440ec1a1df2cf2eda584269454fa7d13f1fe755b958b03a5051c24edcae38`.
