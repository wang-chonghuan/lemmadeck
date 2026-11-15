# Modern Figure Author: 6p Figure 79 / Figure 80

2026-11-15. **AUTHOR COMPLETE: scratch drafts frozen; independent image review pending.**
No approved figure/review file exists. This report does not approve or promote
either figure and is only batch7 preparation, not batch6 completion.

## Separate Source-Review Delivery

Completed and delivered the separately authorized independent review first:
[source-review-116-120.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-116-120.md).
All five pages PASS at source-page scope: 5/17/17/20/26 = 85 independently
counted rows. The 117 first heading FAIL/unique repair and 120 trailing open
remain intact. Final source-evidence freeze check reports
`UNCHANGED: 63 hash-bound inputs`. No source repair or assembly by this reviewer.

The s27/s28 text-author report was already delivered separately and is unchanged:
[modern-text-author-c3-s27-s28.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-author-c3-s27-s28.md).

## Figure Status

| Figure | Mode | Draft Spec | Final Renderer | Actual Width / Minimum Text | Repair Used | Independent Review |
| --- | --- | --- | --- | --- | --- | --- |
| 79 | deterministic | PASS | PASS, 43 objects / 10 labels | 306px / 17.2125px; 640px / 36px | 1 of 1 | pending; not approved |
| 80 | deterministic | PASS | PASS, 38 objects / 2 labels | 306px / 17.2125px; 640px / 36px | 1 of 1 | pending; not approved |

Both are instructional, inline, maximum media width 640px, with explicit
`display.widths: [306,640]` and `minTextPx:16`. These are actual SVG media
widths, not only canvas/viewport widths. No scroll contract or production
display measurement is claimed.

## Source And Full Frozen Text

Actually reopened each durable original PNG individually before inventory,
spec or drawing, then opened local enlarged source contours. No old modern
SVG/spec was reused. Detailed independent inventories are the per-figure
`source-inventory.md` files.

| Original | SHA256 |
| --- | --- |
| fig-79.png | `9aa85a82ad65987d4fa66c8b7d38a8aeebb574dac4706e67cb31cb3157af7f89` |
| fig-80.png | `5538fedf48dfe85b8a35a176dc167d99b99e4975fd0affff545fb73712fcabd3` |

Authoritative text is the complete frozen s27 lesson/exercises pair in the
isolated text-author work root, not a stale durable edition or nearby-text
excerpt:

- lesson SHA256 `ea115767149acc2ade3d1b2a74028fe574dc75f8ea51a86806ec3a690980db58`
- exercises SHA256 `5e94bf782b9a8812cea9d80af5abb19e54fa295a8438afdc3e030de813695bf4`

The existing `build_context.py` was run against read-only symlink bindings
inside each owned figure scratch directory, using the frozen templates as
its lesson/exercises inputs and the actual durable source PNG. Its
`context.tool.json` is retained. Each final `context.json` additionally
contains both complete frozen template JSONs with hashes and all prose,
captions and all five original written prompts. Each FigureSpec's
`source.authoritativeText` contains that complete text, with lesson and
question identities. No answers/choice files were read.

## Source Facts Versus Modern Regularization

Figure 79 preserves both original views:

- Oblique housing/front annular bushing and empty bore; housing split seam,
  visible base/flange depth, two upper fastener assemblies, two lower
  mounting fasteners and both source-visible end attachment details.
- Side/sectional shaft through the bushing and pedestal housing, the stepped
  exposed right end, top oil-port shape and long lower base/reference line.
  No hidden fasteners, internal oil channel or rolling bodies were invented.
- Exact original numeric labels and plain leaders: left 1/2, right 2/3/4.
  Full frozen caption mapping is retained: 1 housing / 轴承架, 2 bushing / 轴瓦,
  3 shaft / 轴, 4 oil port / 加油孔. English legend wording is a modern addition,
  not a claim that the original pixels contained English.

Figure 80 preserves both original cutaway types:

- Left ball bearing: distinct inner/outer rings, empty projected bore,
  continuous rear/top lip, front cutout, both surviving wall/cut faces and
  lower curved race fragments. Three foreground ball contours remain; the
  right one stays partly hidden by the right cut face. Two rear pale
  fragments remain partial, not a claimed five-ball total.
- Right roller bearing: distinct inner/outer rings and empty bore, front/side
  cut faces and lower race fragments. Two foreground cylindrical contours and
  one right-slot cylindrical contour remain, with curved ends and source
  occlusion. The rear-left partial lobe does not imply a fully revealed
  cylinder or a hidden roller count. No full cage or shaft was added.
- The original bore/side-wall shading and hatch-depth distinction is
  regularized to neutral semantic fills, not counted as physical parts.

Vertical reflow, reduced whitespace, explicit English view names, regularized
line weights, mechanical shading and roller-axis alignment are modern
diagram/layout decisions, not original measured angles or proportions.
Neither original contains given dimensions, scales, units or ring-thickness
ratios; none were added. There are no invented motion/force arrows.

The least-generative route was reported before service use: both deterministic.
Explicit cutaway curves use supported `svgPath` fallback; JSXGraph owns the
numeric/English label overlay and plain leader geometry. No hybrid/generated
artwork, raster-source tracing, model-generated image or Azure call.

## First Failures And Sole Repairs

Figure 79 first renderer: exit 2, status fail. The only collision was
`b-original-label-2-label` meeting the bottom base/reference line; actual
canvas confirms it. Both font checks already passed. Preserved first
spec/SVG/canvas/render/mechanism/command ledger and author generator in
`fig-79/failure-01/`, plus the actual first-canvas composite.

Sole repair changed only that label's y-position, the plain leader's start
and its matching executable `connects` assertion. Bushing target, all
apparatus geometry, source/full-text bindings, inventory, fonts, canvas and
thresholds are unchanged. Second renderer exited 0.

Figure 80 first renderer: exit 0, mechanical status pass. Actual source
comparison then found overly exposed round rear lobes and insufficient
occlusion of the right foreground ball. Retained that mechanical PASS and
the source-comparison FAIL diagnosis in `fig-80/failure-01/`, with exact first
spec/SVG/canvas/render/mechanism/ledger/generator snapshots.

Sole source-visibility repair changed only four contour paths: the two rear
ball fragments, rear-left roller fragment, and the right foreground ball's
position beneath the existing cut face. Rings, cut faces, roller bodies,
source/full text, labels, display/fonts and assertions are unchanged. No
hidden piece was inserted. Second renderer exited 0; repaired source/canvas
and actual-size previews were opened by the author.

First spec SHA256:

- 79 `ec91b4b3c1c7af67e261079e14816c83e4ff245663451d24499acca1769dee52`
- 80 `a406e5f5436f60290f9d802a61b66f6ae45d6f08ec3b32e6b9b54eccf2c8933c`

Both figures have consumed their sole repair. No further figure repair is
performed by this author run. Any remaining independent-review FAIL blocks
this handoff; it must not be silently repaired or promoted.

## Actual Previews And Checks

Each figure has complete `preview-306-themes.png` and
`preview-640-themes.png`: Neutral, Accent and Print at actual media widths.
`preview-metrics.json` records `getScreenCTM()` font sizes, actual media
widths/heights, text containment and finite path bounding boxes for all six
width/theme combinations. All pass, with no label collision, clipping or
undersized text.

Opened the complete 306px three-theme composite and complete 640px neutral
composite at original detail, comparing them with the actual source images
and frozen prose. Per-figure full-resolution neutral canvas PNGs are also
retained. These are author checks, not independent visual approval.

An additional first 640px neutral diagnostic was limited to 1344x960 by its
headless viewport. Complete 306/640 theme sheets and their checks were already
unaffected. That diagnostic/helper are retained in `preview-failure-01/`.
Screenshot-only correction changed the isolated headless viewport height to
the measured first-row height and reran only that auxiliary capture; no
FigureSpec/SVG/renderer change. The final auxiliary PNG is complete.

Focused author checks also verify:

- Exact current source hashes and both complete frozen text snapshots.
- Exact allowed first/second spec diff, not changed counts/thresholds.
- Shaft-through-sleeve/housing ordering, annular empty bore and label-2 target
  actually in the bushing annulus.
- Each of the six explicitly exposed foreground rolling-body centers lies
  outside the inner-ring envelope and inside the outer-ring envelope.
  Partial rear contours are not treated as full components or hidden counts.
- Actual canvas pixel probes for exposed bodies, open-bore regions and the
  right ball's cut-face occlusion. These are apparatus/render checks, not a
  claim of byte/pixel equality to the original modern-recreated source.
- Final renderer metadata matches current spec/SVG hashes, all widths/themes
  pass, and no independent `.review.json` approval was authored.

## Actual Commands And Ledger

Used only existing shared Python, existing image-skill dependencies and its
existing headless JSXGraph/Playwright renderer. No install/new environment.
All browsers were isolated headless, without user profile, CDP, visible/debug
mode, OS input or automatic HTML report; only task-owned contexts were closed.

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author.py build
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author.py run fig-79 validate
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author.py run fig-79 render
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author.py repair fig-79
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/6p/fig-79/preview.mjs
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author.py run fig-79 preview-neutral
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author-check.py --write-evidence
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-79/author-check.py --verify-frozen
```

The validate/render/repair commands above were also executed for fig-80.
Initial build invoked existing `build_context.py` once per figure; each
targeted repair rebuilt that figure's unchanged authoritative context. All
actual underlying context/validator/renderer commands, stdout/stderr and exit
codes are retained per figure in `command-ledger.json`.

| Actual Operation | 79 | 80 |
| --- | --- | --- |
| Azure image calls | 0 | 0 |
| Azure retries | 0 | 0 |
| JSXGraph renders | 2 (exit 2, then 0) | 2 (exit 0, then 0; first source-visibility FAIL retained) |
| Targeted figure repairs | 1 | 1 |
| Draft validator runs | 2, both exit 0 | 2, both exit 0 |
| Complete theme-preview browser runs | 1 shared, exit 0 | same shared run |
| Auxiliary screenshot-only rerun | 1 shared, exit 0 | same shared run |

`image-call-ledger.json` records actual service calls/retries as zero and
repair count as one, separately from renderer/screenshot invocations. No
generation metadata is fabricated for deterministic output.

Final author checks exit 0: `PASS: 65 hash-bound author inputs/outputs`.
Freeze verification exits 0:
`UNCHANGED: 65 hash-bound author inputs/outputs`.

## Frozen Files

Final scratch SVGs, not approved assets:

- [fig-79.svg](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-79/fig-79.svg)
- [fig-80.svg](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-80/fig-80.svg)

Each figure directory contains: `spec.json`, `context.json`,
`context.tool.json`, `source-inventory.md`, `source-detail.png`,
`mechanism.json`, its `fig-N.svg`, `fig-N.canvas.png`, `fig-N.render.json`,
`preview-306-themes.png`, `preview-640-themes.png`, `preview-metrics.json`,
`image-call-ledger.json`, `command-ledger.json`, read-only `context-input/`
symlinks, and the complete `failure-01/` first-failure snapshot listed above.

The fig-79 directory additionally contains shared `author.py`,
`author-check.py`, `author-evidence.json`, `preview.mjs`,
`first-canvas-composite.png`, both complete width composites,
`preview-640-neutral-composite.png`, and the retained
`preview-failure-01/` auxiliary screenshot diagnosis/snapshot.
All files and symlink-bound inputs are individually listed and SHA-bound in
[author-evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-79/author-evidence.json).

| Figure | File | SHA256 |
| --- | --- | --- |
| 79 | spec.json | `7c714d2aca6b8cf40ed41c6a38163629af6a17046bdc61e74cdace05a66d1832` |
| 79 | fig-79.svg | `6938ac8beb3959de0d87b293a6c234e89bd0111486f8da0a5b5a01e73332fa76` |
| 79 | fig-79.render.json | `78b7ea1e5ab2b435ded187d966e0d088316f6f1302eb73518bb60c8a6603380d` |
| 79 | context.json | `8fbf6082a9136a927738a6aca44fbc6ffd02b5bc4a558899c210d80fb35f37fa` |
| 79 | image-call-ledger.json | `f6ced21947c0b49fc79ca49584633339577bddd9196d30df90b977decc8d4ff7` |
| 80 | spec.json | `c7ef11e8aa7ebaf047a53caabc2efd023b11a936fa908363465d1450dbd48350` |
| 80 | fig-80.svg | `99b2cc56d1561e6dd808c72950dde1394cc1eca3a0019bbc9b2eeacdaa6ecbc4` |
| 80 | fig-80.render.json | `67f2fe72af5417570fbd1fde82b395c002dafec3061fafdb82b8cd8da2e4c8d2` |
| 80 | context.json | `89c7b882f928d94900d45a3cce9106d2725105c9b6146b34fbe2e1ebc45273ce` |
| 80 | image-call-ledger.json | `08f054e11aaa2dbdbdd1f2234fd8323a26c85a0919651e4a4db7c056762ffe24` |

Author-evidence SHA256:
`6526636647ae97da4a911387f7ceb250e117ab04f39038b9557086594939d1bb`.

## Stop Boundary

Only the two owned figure scratch directories and this author report were
written after the separate source-review delivery. The complete frozen s27
text, original figures, source pages/audits, source-review conclusions,
lesson/figure manifests, book/index and every other author's work are
unchanged. No `record_review`, promotion, adapt-finalize, assemble, model
service, app, DB, publication, Git or dependency action.

All commands, renderer children and task-owned headless browser contexts have
exited/closed. No in-flight session. Stop for independent figure review; no
new source, image or course task is taken.
