# Modern Figure Author: 6p Figures 86/87

2026-11-15. **AUTHOR COMPLETE: scratch drafts frozen, independent review pending.**
Neither figure is approved or promoted. No complete lesson/batch/course claim.
This delivery is separate from the already persisted92/93 report.

## Status

| Figure | Route | Draft Validator | Renderer | Actual Text | Figure Repairs | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| 86 | deterministic | PASS, exit0 | PASS, exit0, 43 objects/1 label | 306px:17.2125px; 640px:36px | 0/1 | pending independent review |
| 87 | deterministic | PASS, exit0 | PASS, exit0, 64 objects/1 label | 306px:17.2125px; 640px:36px | 0/1 | pending independent review |

Each figure rendered exactly once. No figure failure/repair, second render,
review-PASS record or promotion. Auxiliary screenshot-check failure is recorded
separately below; it did not change these drafts.

## Full Text And Original Pixels

Before authoring, independently opened each actual durable original PNG,
verified s31 frozen handoff/template/raw hashes, and read all14 modern prose
blocks and all8 original written exercises. No answers or choices.

Frozen s31 authority:

- lesson `48ef37791a8eaf3bdcf1315237e8627b49c70b197eeddb0f41578d19b718da79`
- exercises `2cb593c54b361540497b547e3d759dd022c7e1879667f94221df7303801072e4`
- figures template `2696340df1d9d5a25ea35efe4d1855f1bb14fe76a7a749bfd25645fed321aa60`
- durable raw lesson `f065c949f2eff1906d2d119286cc7d97aa7d74ee04659ae9076240188a176d78`
- durable raw exercises `70066984ac0a892bfcad4e4f1465a3c29c9f42e9a50942eee71b3b0055e895d6`

Original PNGs:

- 86,349x602: `4663080585aafc7af9c9e8341565cae20492b3ad2a706b6f55a59e1e6dcc2c09`
- 87,427x312: `a3c7c7e6b4d9faab1b3760712e380848025f9162446fcf127d27d8230540838f`

Per-figure `source-inventory.md` records original visible structure and
separately identifies all modern regularization. Existing `build_context.py`
ran once per figure against read-only symlink bindings to the actual PNG and
complete frozen lesson/exercises. Its output is `context.tool.json`.
`context.json` additionally includes every frozen template JSON, SHA binding,
handoff, complete modern prose and all8 exercises. `source.authoritativeText`
in each spec contains the full modern title/prose/captions/eight tasks.
No source, edition text, exercise identity or figure manifest was edited.

## Source Structure And Modern Changes

86: one oblique cutaway building; four rows of two exterior framed/partitioned
windows; four upper far-wall angular opening groups; five exposed slab edges
including lower base; vertical supports, basement, slab roof/eave, exposed
corner masonry, wider foundation and ground. No extra storeys/hidden rooms.
The original foundation label is translated to `Foundation`. Projection,
course texture, shading and line weights are regularized, not measured
depths/width ratios or a recovered brick count.

87: one heavy tracked tractor, front hood/grille/cap/headlamp, two rows of
five visible engine ventilation marks, tall single exhaust/visible base,
divided slanted front glazing, side-door/window, roof/mirror, bumper/chassis
and two distinct continuous tracked supports. Near track has visible inner
rails/curved end/partial roller contours; far track remains partly occluded.
Both retain long broad ground-contact runs. No tires, blade, military identity
or additional engine internals. Tread pitch and partial roller arcs are
regularized schematic texture, not claimed hidden wheel/link totals.
`Tracked tractor` is a new English descriptive caption.

Neither source PNG has scales, arrows, numerical labels, units or apparatus
measurements. None were invented; the complete prose's numbers/units remain
in context, not repurposed as figure dimensions or solved pressure labels.

## Route, Layers And Actual Previews

Reported least-generative route before service use: both deterministic;
**Azure image calls0/retries0**. All silhouettes/fills/strokes are deterministic
supported `svgPath` objects; JSXGraph owns the final text overlay.
No generated artwork/model call, source-raster tracing or stable tool change.

No source semantic leader/arrow exists, and none was added. Thus no JSXGraph
segment is hidden behind an opaque raw path. Within the raw layer, opaque
body/ground surfaces precede their visible details; track inner faces precede
rails/tread/partial contours. Rendered raw path order is checked against spec.

Both are instructional inline media with max width640,
`display.widths:[306,640]`, `minTextPx:16`, labels fontSize36.
One shared isolated headless preview run produced all individual Neutral/
Accent/Print PNGs, complete three-theme sheets and full two-figure composites
at both actual media widths. Both full composites were opened at original
detail. DOM media widths, actual `getScreenCTM()` fonts, label containment
and finite raw-path geometry bounds pass for all six width/theme cases.
No product headed-viewport verification is claimed or performed.

Focused author checks independently require8 facade windows,4 far-wall opening
groups and5 slabs, a foundation support edge wider than the wall-support
edge,10 vent marks and2 closed distinct track belts with long lower runs.
Actual six-theme/width pixel probes cover window/slab/foundation edges,
all10 vent symbols, both lower contact runs, exhaust/lamp/window borders.
Missing-window and missing-far-belt negative cases fail as intended.
These are author checks, not source/figure independent approval.

## Auxiliary First Failure

First `author-check.py --write` exited1 on its PNG-height assertion.
Figure87's actual306px CSS height is286.875px; it follows a fractional
figure86 row. The element screenshot encloses its fractional top/bottom with
integer pixel edges, giving288px, not the helper's assumed near286.875px.
Both render reports and font/geometry metrics were already PASS.

The first helper/trace/diagnosis are retained in
`fig-86/author-check-failure-01/`, with existing unchanged PNG/DOM metrics.
One helper-only correction checks the DOM-scaled CSS height exactly and the
integer enclosure rule: PNG height is ceil(H) or ceil(H)+1.
No font/geometry gate weakened, no preview/renderer rerun, no FigureSpec/SVG/
source edit or figure repair. Second author-check exited0.

## Actual Commands And Calls

Used the existing shared lesson Python/PIL and existing skill Node/Playwright.
All browsers isolated headless, no PWDEBUG/Inspector/UI/visible fallback,
user profile, CDP, OS input or automatic HTML report. Task-owned contexts closed.

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author.py build
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author.py run fig-86 validate
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author.py run fig-87 validate
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author.py run fig-86 render
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author.py run fig-87 render
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/6p/fig-86/preview.mjs
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author-check.py --write
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-86/author-check.py --verify-frozen
```

Each context/validator/renderer ran once, exit0. Preview ran once, exit0.
Author-check write ran twice, exit1 then0; freeze verification once, exit0.
Each `command-ledger.json` contains actual underlying context/validator/
renderer argv, time, stdout/stderr and exit codes.
Each `image-call-ledger.json`: image calls0, retries0, figure repairs0/1.
No fabricated generation or approved-review metadata.

## Frozen Files

Each owned directory contains spec/context/tool-context/source inventory/
mechanism/handoff snapshot, SVG/canvas/render, image/command ledgers,
individual306/640 three-theme PNGs, full theme sheets/preview metrics and
read-only context-input symlinks. Shared author/check/preview helpers,
full-width composites, auxiliary failure and the complete frozen file list
are under fig86.

| Figure | File | SHA256 |
| --- | --- | --- |
| 86 | spec.json | `064d58342ff063e7cc56b9aee8d44093d4066a0e740addb4e98836c8329c0bc6` |
| 86 | fig-86.svg | `fc3cc6b33543f73450cdf2e61556782ab720331465ac10fb393dd48b99b1a575` |
| 86 | fig-86.render.json | `8e7a35227d28edbbfceeab99115fc2184856724627fe9a140117ab5837c5b9b4` |
| 86 | context.json | `4b094d68f1663929139355dbb4f1cb181a8ec2bc973162e98e613fed72c73458` |
| 87 | spec.json | `aeae82c4ad473407af280873ee9a80c7327f780bc13f96b03ceb35d3336a63b5` |
| 87 | fig-87.svg | `63fb0ea0fa121d3642e4c446e22db4bb6b54cfcec545522bb6d1e182768a825a` |
| 87 | fig-87.render.json | `1390ad0a35a76999d7192c9b7ef228bdb856c51f6ad78721765ca60f89010a5e` |
| 87 | context.json | `02f2cca09f5b45ea60ebf6615dbfd08cf0a559628969fea712e0b8a5677cf3cd` |

Evidence `.tmp/s10y-image/6p/fig-86/author-evidence.json`, SHA256
`1aa1a86d033611c67c26461d82ea7fde8ed3a94abf03738c83b5a91654f84cc1`.
Freeze output: `UNCHANGED: 58 hash-bound inputs/outputs; both author-only pending review`.

Only fig86/87 scratch and this report written in this new author assignment.
No fig88/89 work, no re-review/repair of blocked79/83/92;92/93 report already
delivered separately. No source/text/manifest/index/book, renderer/tool,
app/dependency, DB/publication, assemble/finalize, Git, review-PASS or promotion.
**No in-flight exec or browser session. Stop for main's independent review.**
