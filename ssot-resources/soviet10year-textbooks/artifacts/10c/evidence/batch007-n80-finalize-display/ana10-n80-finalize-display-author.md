# n80 Approved-Text Finalize And Offline Display

STEMROBIN-184, active workspace `/Users/yong/.codex/worktrees/a07e/lemmadeck`,
2026-11-16. Scope: n80 first binding, finalization, HTML rendering and offline
read-only display precursor only. No new mathematics, text review or figure
semantic gate.

## Disposition

**Offline display: PASS. Whole n80: NOT_COMPLETE.**

Source exercise 55 remains UNKNOWN / parse and interpretation HOLD. No
coefficient interpretation, solution, answer key or choices were selected.
The original figure label's optical identity remains 0/O UNKNOWN; the modern
0 is explicitly text-derived. The existing schematic-regularization limitation
remains. Tool `ready` and adaptation `pass` are not full-completion approval.

The sole parent TEXT PASS for 32 source objects and 8 tasks, prior nine focused
methods / 17 affected signature PASS evidence, and sole independent two-figure
limited PASS were reused. No source/crop image, previous semantic screenshot
batch or answer evidence was reopened. No new solve or semantic/text review ran.

## Frozen Inputs

Before any status or manifest edit, the three templates, two durable DRAFTs and
edition book were copied byte-for-byte to
`.intentfold/tickets/STEMROBIN-184/tmp/n80-finalize-display/before/`.
`before.manifest.json` binds those six snapshots and protected input/tool bytes.

Approved lesson DRAFT SHA256:
`4fe86dbb51c4668aa69e60a229941318ac26500ff5dddde4b81e2d4b146f6d39`.
Approved exercises DRAFT SHA256:
`8a35b97edf24c8111f54c22ae5ec80b8a9d6dc516f19a2c84e86903e4b9db387`.
Both were identical to their prepared templates before this operation.

Sole independent figure limited PASS SHA256:
`006a9454da2230c1e57dc160a78f7378969bd69bb2807228ed69bb784d69eadd`.
Existing durable retention roots
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n80-figures`
and `batch007-n80-approved-text` retain the original failure, sole repair,
tool, source-binding and figure evidence. Their bytes were not rewritten.

## First Commands

Each operation ran exactly once, exit 0, without automatic retry:

1. `node .intentfold/tickets/STEMROBIN-184/tmp/bind-approved-figure-manifest.mjs ana10-c6-s2-n80`, repo cwd, `FIGURE_BOOK=10c`.
2. `.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-finalize --book 10c --edition modern-us-neutral --lesson ana10-c6-s2-n80`, repo cwd.
3. The same official Python/p2c entrypoint with `render` and the same selection, repo cwd.
4. `node ../.intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs 10c ana10-c6-s2-n80`, app cwd; captured argv uses the equivalent absolute script path.

`PWDEBUG` was unset, `PLAYWRIGHT_HTML_OPEN=never`,
`PYTHONDONTWRITEBYTECODE=1`. The existing helper launched isolated headless
Chromium, aborted HTTP(S), closed its contexts/browser, and used no persistent
profile, report window, desktop input or app server.

Full actual argv/cwd/environment overrides, exit/signal and untruncated
stdout/stderr are retained in `n80-finalize-display/*-first.{argv,result}.json`
and `*-first.{stdout,stderr}.txt`. Before/after-bind and before/after-finalize
snapshots are retained separately. Official render HTML and every screenshot /
report output were copied without replacement into `render-first-output/` and
`offline-first-output/`.

## Scoped Changes

Manual content edits changed only the two text templates' top-level status from
`draft` to `ready`. The existing binder changed only the n80 figure template to
the two approved deterministic `svg/render/review/spec` output contracts and
`ready`. Official finalize wrote the n80 durable lesson/exercises as `ready`,
the bound `figures.json`, adaptation audit and its edition index row.

All non-status lesson/exercises fields, including body, formulas,
`numeric_changes`, identity, figure references, source snapshots, source fields,
errata and section boundaries are deeply identical to the approved DRAFTs.
Official normalization caused no body or formula edit. Existing promoted
fig-10/11 output/spec/render/review bytes, source lesson/exercises and stable
tools stayed unchanged. Recorded byte/JSON invariants prove this provenance;
they are not a repeated mathematical gate.

The edition index gained only n80; every pre-existing row and other book field
stayed unchanged. `edition-index-diff.json` records the actual output.
No Git, DB, application, dependencies, publication, other chat, global progress
record or stable-tool mutation occurred. No broad checks or figure rerender ran.

## Display Observation

The native offline report is `pass`, observed at
`2026-11-16T11:29:00.998Z`. Both desktop 1440x960 and mobile 390x844 display all
34 final prose paragraphs, six section boundaries, and all eight tasks 52-59.
The renderer's 38 text-flow objects include 34 paragraphs plus two figures and
two captions; these are distinct from the approved 32 source objects.

The helper found no `.err`, `.katex-error`, input or textarea, no remote
img/link/script references, no page errors, no page-level horizontal overflow,
and nonempty, contained prose/task rows. All eight tasks remain read-only; no
answers were entered and no task was judged.

Both instructional figures appear once in text and not in exercises. Each
actual SVG media box is 640x360 on both viewports. All five labels have measured
screen size exactly 26px and fit their media bounds. Mobile figure viewport
width is 358px, media width 640px, maximum scroll 282px; both observed scroll
ends reached exactly 282px. Desktop maximum scroll is 0px because both figures
already fit.

I loaded exactly six distinct images, one bounded batch, six total in context:

- `text-1440.png`: complete text, both actual figures/captions, equations and text tail visible.
- `exercises-1440.png`: all tasks 52-59, including the last row and return link, visible.
- `text-390.png`: wrapped full text and tail visible; intentional figure windows show their left/start regions.
- `exercises-390.png`: all eight tasks and page tail visible without clipping or overlap.
- `text-390-scroll-0-end.png`: fig-10 right spring/support, axis endpoint and labels visible at the true scroll end.
- `text-390-scroll-1-end.png`: fig-11 right spring/support, axis endpoint and labels visible at the true scroll end.

Math rendering observed clean prime/double-prime marks, fractions, radicals,
Greek letters, brackets, inequality signs and equation numbers. Prose/formula
spacing and task wrapping show no apparent glyph substitution, overlap or
truncation. This concerns visible rendering only, not mathematical truth or
source exercise 55's interpretation.

Six other generated screenshots were retained but **not loaded**: the four
desktop figure start/end images and two mobile figure start images.
Their hashes and explicit loaded/unloaded disposition are in the manifest.
No crops, image atlas, new screenshots, rerender, browser rerun or whole-batch
reopen was used. Two allowed image slots remained unused.

## Limits And Retention

This PASS proves only these self-contained offline HTML displays in isolated
headless Chromium. It does not prove headed/OS behavior, application card
paging, authentication, quiz judging, answer interfaces, learning records or
production visibility. The existing helper's geometry evidence is retained
as executed; no extra checks were silently attributed to it.

The adjacent `ana10-n80-finalize-display-author.manifest.json` binds this
report, exact runtime/stage membership, each command/output/snapshot,
loaded/unloaded screenshot hashes, prior retention references and the
new durable n80-only evidence archive. Historical failures remain historical;
neither them nor the 55 HOLD is replaced by the offline-display PASS.
No lesson is counted complete and no formal ticket handoff is claimed.
