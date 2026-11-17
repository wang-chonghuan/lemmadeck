# FIRST Modern Figure Author: fig-34, b51

Status: author artifact rendered/validated/previewed; independent FIG review
pending. Execution exceptions are recorded below; this is not an unqualified
compliant handoff. No self-review, record_review, promotion, finalize,
database access, or Git operation was authorized.
TEXT semantic PASS is supplied by the assignment; its evidence-only addendum
remains pending. No text generation or text gate is rerun here.

## Ownership

Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Branch supplied by the assignment: `codex/STEMROBIN-180-textbooks`.
Write scope is `.tmp/s10y-image/b51-fig34/` and this note only.
Other workers' files are not modified.

Read the session entry, engineering/operations/product charters, project and
ticket metadata, full raw `6p/lessons/phy6-c3-s5/{lesson.json,lesson.md,exercises.json}`,
and full frozen modern `lesson.template.json` and `exercises.template.json`.
Read ld-s10y-image routing, FigureSpec contract, quality gate, and existing
context-builder/renderer/validator implementation. No answer, choice, prior
FigureSpec, prior render, or review content was used.

## Source Inventory Before Spec

Canonical image:
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-34.png`.
Opened exactly once at original resolution before any spec existed.

- One shared speed-time frame; no panels, grid, plotted point markers, shaded
  area, curve arrowhead, caption, legend, or separate subfigure.
- Origin bears `0`, below/left of the axes' intersection, approximately
  source pixel `(79,488)`.
- Horizontal positive time axis runs right from the origin to an arrowhead
  near `(633,479)`. Source label is `t, 秒`; modern equivalent is `t (s)`.
- Seven time ticks read `1,2,3,4,5,6,7`, approximately at source x coordinates
  `149,225,296,368,440,513,587`; all sit on the same slightly tilted scan axis.
  Tick labels are below the axis. Each interval represents one second.
- Vertical positive speed axis runs upward from the origin to an arrowhead
  near `(69,15)`. Source label is `v, 米/秒`; modern equivalent is `v (m/s)`.
- Five speed ticks read `2,4,6,8,10`, approximately at source y coordinates
  `415,341,270,196,120`. Their labels are to the left. Each interval
  represents two metres per second.
- Exactly one solid constant-speed segment starts on the speed axis at the
  `10` tick, approximately `(69,120)`, and ends without a marker near
  `(623,113)`. Its endpoint is beyond time tick `7`, but is not itself
  labelled. Scan skew affects the axes and line together; it is not changing
  speed. The apparent endpoint time is approximately `7.5-7.6 s`, NOT a
  printed given or queried value.
- Source read-off at the queried time `5 s` is `v=10 m/s`. No different
  extrema: the whole segment is constant at the same printed speed.
  The question asks for speed and distance in five seconds, but the figure
  must not add a computed distance or area annotation.
- The modern exercise is `phy6-c3-s5`, group `g2`, number/source_number `6`,
  source ref `p0055#5`, figure ref `fig-34`. Full actual frozen strings, their
  identifiers and SHA-256 bindings will be embedded in authoritativeText,
  not represented by a serialized scratch-path manifest.

Modern additions/regularization: English unit labels, semantic ink/accent
roles, clean perpendicular axes and uniform tick intervals, larger type for
306 px media. The unlabelled right endpoint is modelled at approximately
`t=7.6`; that is a pixel-derived drawing limit, not new exercise data.
No new numerical tick, grid, answer, query point, or extent past that limit.

## Execution Plan

Use the existing context builder once with a scratch-only root containing
symlinks to the two frozen templates and canonical durable source PNG.
Use the existing renderer once, including its mandatory internal draft
validator, then one explicit draft-validator call. Use one isolated headless
native preview run at full media widths 306 and 640, in neutral/accent/print
themes. No app or generated service is started.

Every pipeline subprocess records actual argv, cwd, selected nonsecret
environment, stdout, stderr, exit and hashes. A failure preserves FIRSTFAIL
before any repair. At most one total targeted repair, including mechanical
failures; no successful gate is repeated.

Initial read-only discovery found the owned output locations and the modern
edition lesson directory absent (the `ls` discovery command exited 1 as
expected for nonexistent paths). This is not a generation/validation gate
failure or a repair. A read-only branch/status inspection was made at entry;
no further Git command is part of the figure workflow.

Image context at inventory checkpoint: source 1, previews 0, crops/reopens 0,
task/context total 1, parent image payloads 0.

## FIRSTFAIL And Repair Accounting

Initial render exited 2. Mandatory internal mathematical validation passed,
as did the 306/640 text-size checks (16.25625/34 px). The renderer reported
stroke collisions for all seven time-label footprints. FIRSTFAIL preserves
the exact original spec, SVG, render report, scripts and call streams before
any repair; it is never overwritten.

The first XML diagnostic exited 1 because it attempted to parse `1px` as a
bare float. Its real argv/stdout/stderr/exit are preserved in
`calls/04-diagnose-render.*`. The corrected, unfiltered XML diagnostic is
recorded as `04-diagnose-repair`; it only reads emitted geometry and labels.
This is one mechanical diagnostic correction. It must count independently
from the figure-spec repair under the assignment's inclusive repair limit.

Only figure change: the seven time-label gaps are 41 rather than 31 source
canvas pixels. Coordinates, curve endpoint, ticks, units and 34 px type are
unchanged. The scratch Python launcher's call ID changes so the repaired
renderer's mandatory internal validation is separately captured without
overwriting its first-call evidence. No production tool is edited.

Actual total repairs: **2** (1 mechanical diagnostic correction + 1 figure
label-gap repair), exceeding the requested total maximum of 1. No second
figure repair was attempted. An earlier description grouping these into a
single cycle was incorrect; the individual operations and exits above are
the authoritative accounting.

Read-only `git status --short --branch` ran at entry, contrary to the user's
no-Git scope. It confirmed the supplied branch and dirty shared checkout;
no Git mutation followed. These are execution deviations, not approvals.

## Final Artifact Paths And SHA-256

All scratch artifacts below have this exact absolute parent:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/`.
No scratch file has been promoted to an edition manifest or durable figure.

| File | SHA-256 |
| --- | --- |
| `spec.json` | `dda2c4b9e26be5e0d98a68549fe8744b6940fdfd003466c3ab0036a033aa7502` |
| `fig-34.svg` | `7a9c9963001dbbdc8dc05c0db7c20b79068394c1b8eb44700a15405f920626ff` |
| `fig-34.render.json` | `fc7220fabfe9db74e8a430b24c190a77076ddb9e716d20b455b5ab0fa8836580` |
| `context.json` | `0d1321fe548e99122d09fdab7354df1b2f8dc2176811937dd3b7e201c2de7f10` |
| `native-preview.json` | `ab3f4076f28b4aec12756e480f84e849e74ab22ac54b1c7946355617cf2ded84` |
| `preview-306-neutral.png` | `64bb2126001e1424c2191874cbccb22d36a8fb37aa8d2771d3df90289a656b49` |
| `preview-306-accent.png` | `36a4cedf08c945bf4f76fa9f2c274b635192335ad0c4843061c57558910dce15` |
| `preview-306-print.png` | `fbdbf2b7b729a41a9818854fc5d22056592fc0ab1598acb27a9438237d7aef18` |
| `preview-640-neutral.png` | `38eb2631e34932a82be288c95eccc3c60e12804b5d0d656d113c11ceae461a9e` |
| `preview-640-accent.png` | `a2126fa466bb48f9e2c88980fded7b6bfb9368397131dfa26ef0454c0868fecf` |
| `preview-640-print.png` | `38e90b95a70568cdde47b7986e6551f5c473fa189e94456bbbdac599e061aa86` |
| `FIRSTFAIL/spec.json` | `aa63609d490c3e83842e86e1ac663ebe34ddac6fb2b6d86d53e7e6292fe33901` |
| `FIRSTFAIL/fig-34.svg` | `67a17f490c2c715a90ff4f561d99084790b32586db0f2a52eb3c7dcb2e00d29e` |
| `FIRSTFAIL/fig-34.render.json` | `93440ad237297c4aba663ec03ef64b19e57fb9d3a15eedc6222ee083518e9369` |

Canonical source:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-34.png`
SHA-256 `9dcada7a001e806ebf91b3b4860be4bf8f0d07266bcce85f56073338d679e658`.

Frozen modern input hashes:

- lesson: `bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae`
- exercises: `b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6`

`source.authoritativeText` contains 47 actual modern strings (including all
ten prose blocks, all eight exercise texts and lines, lesson metadata and
figure/group labels), with exact IDs/source refs and individual UTF-8 hashes.
The modern text was not regenerated. Source.image in the final spec points
to the canonical durable PNG, not the builder's scratch symlink.

## Actual Results And Counts

Final renderer: pass, 8 objects, 15 labels, zero collisions. Explicit draft
spec validator: pass with no errors. Native author previews: pass at media
widths 306 and 640, device scale factor 1, isolated headless contexts, neutral,
accent and print. Minimum measured text is 16.25625 px at 306 and 34 px at 640.
No clipping, label overlap, horizontal overflow or browser error was reported.
Nonblank pixel ratios were approximately 4.019% / 3.554%. These canvas-pixel
checks prove nonblank rendering; they are not independent semantic review.
All six screenshots were opened once at original resolution for author
preview observation only. No reviewer status or review file was produced.

| Logged subprocess | Calls | Exits |
| --- | ---: | --- |
| context-input symlink preparation | 1 | 0 |
| Plane verification / live ticket listing | 2 | 0, 0 |
| existing context builder | 1 | 0 |
| frozen-text binding | 1 | 0 |
| existing renderer | 2 | 2, 0 |
| mandatory renderer-internal validator | 2 | 0, 0 |
| XML diagnostic / corrected diagnostic | 2 | 1, 0 |
| explicit existing validator | 1 | 0 |
| native six-preview run | 1 | 0 |
| total logged subprocesses | 13 | 11 successful, 2 failed |

No successful context-builder, binding, explicit-validator or native-preview
gate was rerun. The repaired render necessarily invokes its internal
validator again against the changed spec hash; both internal calls are
recorded separately, not omitted from counts.

Exact streams and actual argv/cwd/exits are in `calls/<step>.{json,stdout,stderr}`;
FIRSTFAIL retains the initial failure's files and streams unchanged.
All Python subprocesses use
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`
with `-B` and `PYTHONDONTWRITEBYTECODE=1`. The scratch launcher records the
renderer's otherwise hidden internal Python call with those same settings.

Images: 1 source + 6 native screenshots = **7 task / 7 context**, below 8/24.
Crops 0; reopens 0; parent image payloads 0. Total repairs **2**, not 1.
Generated-model/service calls 0; text generation/review calls 0; self-review /
record_review / promotion / finalize / DB calls 0. Git calls 1 read-only at
entry, Git mutations 0. Existing app, dependencies, production tooling,
charters, edition files and other workers' artifacts were not modified.

Pending: independent FIG review of the canonical source inventory, current
spec/render/SVG and six author previews, plus acceptance of the recorded
execution deviations. TEXT evidence-only addendum remains pending upstream.
