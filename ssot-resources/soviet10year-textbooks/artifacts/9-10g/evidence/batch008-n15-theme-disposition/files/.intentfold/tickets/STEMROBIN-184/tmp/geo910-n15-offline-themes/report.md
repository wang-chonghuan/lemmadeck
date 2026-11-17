# STEMROBIN-184 n15 Missing Offline Themes

## Result

**HOLD - incomplete scoped evidence, not a demonstrated figure defect.**

The new helper executed exactly once, headless, and exited **1**. It completed
fig60 accent and actual print media, then stopped at the inherited
`mediaFitsFigure` assertion for fig61 accent before its screenshot. Fig61 print
was not attempted. Only **two of four** requested PNGs exist; both were actually
opened once and visually inspected. No rerun, repair, substitute screenshot, or
source/modern rendering was performed.

The parent-reported `inherited.themePrint UNKNOWN` with no scoped evidence was
the starting premise, not independently re-audited. This report closes only
fig60 accent/print; it does **not** close the aggregate n15 theme evidence gap.

## Scope And Ownership

- Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- All new files are confined to `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes`.
- Read the current `.intentfold/readme.md`, engineering, operations, project,
  product, UI, `ld-s10y-image` skill and its image quality gate.
- Reused the n16 scratch helper's palette, CTM, contrast, nonblank and SVG
  geometry-bound checks. Adapted inputs to one existing SVG per HTML and four
  planned cases; added native-aspect measurements and an exclusive run marker.
- Existing figgate/source/math/neutral/full desktop-mobile PASS evidence was
  inherited per the user's instruction and not rerun. No answer, choice key,
  original source image, or independent mathematical review was consulted.
- No durable figure, original HTML, old metadata, parent retention directory,
  or other worker's file was edited. No DB, server, publisher, Git, dependency
  installation, model API, headed browser, or foreground application action.

## Exact Commands And Exits

Commands below ran from the workspace root unless another cwd is stated.
Read-only diagnostics did not execute a renderer or a second browser check.

1. Preflight directory check, exit **1** solely because the new output directory
   did not yet exist; the existing render directory was present:

```sh
ls -ld .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15 .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes
```

2. Existing helper/input hashes before execution, exit **0**:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-offline-themes/check.mjs .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/text.html .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html
```

3. New helper created with `apply_patch`, successful. Sole execution, cwd
   `/Users/yong/.codex/worktrees/a07e/lemmadeck/app`, exit **1**:

```sh
node ../.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/check.mjs
```

The command's process was awaited to termination, not left running. Its final
output reported `fail-stop-no-repair`, `cases: 3`, `browserClosed: true`, and
measurement SHA-256 `faa5729bf90d05cd7437fed9874d2240eee5d9d98d1895bd74518e2c1b6b5553`.
Run interval: `2026-11-16T18:36:33.078Z` to `2026-11-16T18:36:33.988Z`.

4. Read the preserved first failure, exit **0**:

```sh
cat .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/measurements.json
```

5. Inspected only the existing exercise layout CSS, exit **0**:

```sh
sed -n '39,47p' .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html
```

6. Final generated-file and unchanged-input hashes, exit **0**:

```sh
shasum -a 256 .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/check.mjs .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/run-once.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/measurements.json .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/fig-60-accent-640.png .intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/fig-60-print-640.png .intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-offline-themes/check.mjs .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/text.html .tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html
```

`report.md` was subsequently created with `apply_patch`; its own hash is
returned separately rather than self-referenced.

## Browser And Theme Evidence

Chromium `149.0.7827.55`, headless, ephemeral context, device scale factor 1,
viewport 1440x960. This viewport was only the offline capture environment, not
a repeated full desktop acceptance pass.

The context route was installed before navigation to **either** HTML, allowing
only `file:` and `data:` requests and aborting all other schemes. Service workers
were blocked. Remote requests observed: **0**; page errors: **0**. Browser closed
in `finally` after the first assertion failure.

Accent set only existing media variables to `var(--accent)` and `var(--sub)`;
resolved accent was `rgb(43, 95, 142)`. Print removed those overrides and called
`emulateMedia({ media: 'print' })`; fig60's `matchMedia('print').matches` was true.
No invented stylesheet, palette, SVG styling mutation, or SVG replacement.

Both SVGs use only ink/muted painted roles. Therefore the two completed fig60
PNGs are byte-identical despite different resolved accent values and actual
screen/print modes. Equality is not a substituted screenshot.

## Four Planned Cases

Here **FAIL** for a missing case means the requested evidence was not completed,
not that a visual or mathematical figure defect was established.

| Planned PNG | Result | Measurement And Actual Visual Observation |
| --- | --- | --- |
| `fig-60-accent-640.png` | **PASS** | Existing SVG 640x460, PNG 640x461; CTM scale 1, six labels at 28px; minimum text contrast 17.2244:1, minimum painted contrast 5.3292:1; 17 painted geometry elements; no SVG label/geometry clipping. Opened once: M/M1/N/N1/O and alpha glyphs, subscripts, all point dots, strokes and outer polygon clear; no black rendering, missing glyph or crop. |
| `fig-60-print-640.png` | **PASS** | Actual print media; same native dimensions, CTM, contrasts, geometry and clipping results. Opened once independently: full outer boundary, dots, diagonal/connecting strokes, all labels and subscripts clear; no black rendering or crop. |
| `fig-61-accent-640.png` | **FAIL - evidence incomplete** | No PNG. Existing SVG measured 640x560, CTM scale 1, six labels at 28px, minimum text contrast 17.2244:1; 30 painted geometry elements, no SVG label or geometry bounds outside its canvas. Inherited container-fit assertion failed before contrast/nonblank screenshot assertions completed. Not visually opened. |
| `fig-61-print-640.png` | **FAIL - not run** | No measurements or PNG; first-failure stop occurred before this case. No visual inspection and no PASS claim. |

Each completed PNG has 10,984 nonpaper pixels and 4,829 dark pixels out of
295,040 pixels; nonpaper fraction approximately 3.72%, not blank or black.
The SVG retains its exact native 640x460 aspect. Element screenshot raster
rounding at a fractional page offset produced one extra PNG row, within the
helper's explicit one-pixel tolerance; no style was added to pad or resize it.

Image budget: **2 images loaded in one batch, 2 total in this context**,
each through `view_image` exactly once. The absent fig61 PNGs could not be opened.
No source image, crop, repeated image, or image payload was returned in the
worker's final response.

## First Failure And Limitations

First failure:

```text
AssertionError [ERR_ASSERTION]: Fit and label bounds
at .../geo910-n15-offline-themes/check.mjs:179:7
```

The failed predicate was `mediaFitsFigure: false`; all six fig61 label
`clipped` values were false and `clippedGeometryIds` was empty. Existing CSS
explicitly defines `data-figure-layout="scroll"` with `overflow-x:auto` and fixed
`width:40em;max-width:none` media. The inherited n16 text-only helper requires
that the complete 640px media fit within its figure's visible container, an
assumption not valid for this exercise scroll surface. This is a harness
surface mismatch; these measurements alone do not prove a true source/SVG defect
or successful scroll-end visibility.

The adapted helper did not account for that existing exercise scroll contract
before its sole run. No assertion was weakened, no input repaired, and no
second execution or alternative browser capture attempted after the failure.
Fig61 accent/print therefore remain unresolved under the execute-once boundary.
The two fig60 results must not be promoted to a four-case or aggregate n15 PASS.

Source fidelity and mathematical correctness were intentionally inherited,
not independently verified. This is offline theme-display evidence only, not
headed product acceptance, printer pagination/PDF output, mobile verification,
or a complete package check.

## Paths And SHA-256

Evidence base:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-offline-themes/`

| Existing Output Below Evidence Base | SHA-256 |
| --- | --- |
| `check.mjs` | `d8c548a249c5968bc4397945ca93e0a72912002e431d943a62d631d713f6f2fe` |
| `run-once.json` | `bdbed4ddb75c02929e09443077241586aa8d1b9a88baed32de9f25425b38dfe7` |
| `measurements.json` | `faa5729bf90d05cd7437fed9874d2240eee5d9d98d1895bd74518e2c1b6b5553` |
| `fig-60-accent-640.png` | `3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38` |
| `fig-60-print-640.png` | `3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38` |

Input base:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/`

| Input | SHA-256 Before And After Run |
| --- | --- |
| `text.html` | `c97b81039ab4ecc362a43cd8d18f4d9357a3a309e7807c09db8d728936331a3e` |
| `exercises.html` | `d0c5e597f9ceba9f1da0e797368b0155243188107fc0cddd1011bec77512d914` |

Observed existing inline SVG hashes:
fig60 `effc953d826028d0942667d737a0e1e1103e419ae58c90136cfb1668e8f9b545`;
fig61 `c95440ec1a1df2cf2eda584269454fa7d13f1fe755b958b03a5051c24edcae38`.
Fig60's unchanged SVG DOM assertion completed; fig61's final DOM assertion was
not reached. The final HTML byte hashes were independently confirmed unchanged.

Inherited helper:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-offline-themes/check.mjs`
remained `94fe204f911d88d2d2de368d65ff8fe5bdfa315c3bff18a8f5ae1fd716bd2573`.
