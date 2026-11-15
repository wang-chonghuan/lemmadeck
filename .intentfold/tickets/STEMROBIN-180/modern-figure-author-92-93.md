# Modern Figure Author: 6p Figures 92/93

2026-11-15. AUTHOR RUN CLOSED, scratch bytes frozen.
**92 BLOCKED; 93 mechanically passing author draft, independent review pending.**
Neither figure is approved or promoted. This does not complete s33, a lesson
batch, or a course. Main independently handles text/source/figure acceptance.

## Final Status

| Figure | Mode | Draft Validator | Renderer | Repairs | Actual Font Sizes | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| 92 | deterministic | initial FAIL, repaired PASS | FAIL, exit 2, `b-view-label` collision | 1/1 used | 306: 17.2125px; 640: 36px | BLOCKED, not approved |
| 93 | deterministic | PASS, exit 0 | PASS, exit 0, 49 objects/2 labels | 0/1 used | 306: 17.2125px; 640: 36px | pending independent review, not approved |

No further FigureSpec edits or renderer runs for 92 after its post-repair
FAIL. Its actual canvas and both product-width previews show b touching the
outward/downward membrane. Good fonts and other passing checks do not override
that FAIL.

## Authority And Inventory

Waited for Ramanujan's s33 `author-handoff.json` to appear with
`status: frozen_for_independent_review` before authoring. Verified the actual
frozen template hashes and durable raw lesson/exercises hashes. Opened each
original PNG individually, then read the complete modern prose and all four
written questions, without answer or choice inputs.

Frozen text authority:

- lesson `59c4c7dbecf060f484ab4619895df0bf509beec754c16c6e7ad8760e360c1c10`
- exercises `fce2caea60941e5637e8172e2a2b9c9ea2396590895caa32f683d4f0e6379b83`
- figures template `335d606a87a19df7d43d82400740d2e11cc111ea4eccc77066ae72cc7104c26f`
- durable raw lesson `fc8405b26a7f1ed2a9fa8dc9b0de5f605d40f5af42fb37db084abea71e39b5c9`
- durable raw exercises `99c7f7d8580187cadfdb9926e3d90ad144160f6b2891e9eea91f19abf3259e70`

Original PNGs:

- 92, 536x571: `0fa0f7517c8f519a703d2eaaa88946861d9fb786265fd64d519b985712e11aa7`
- 93, 279x373: `54cb36e84397c2b746d8688efb97117b981bf3b6cedc1d5a00790a8a1330023e`

The original-image pixel inventories are `source-inventory.md` in each owned
directory. Context was produced with existing `build_context.py`, using
read-only symlink bindings to the frozen templates and durable PNGs.
`context.tool.json` retains its result. `context.json` additionally contains
complete frozen template JSONs, modern prose, all four questions and the
handoff/hash bindings. Each spec contains all modern prose/captions/questions
in `source.authoritativeText`, not only nearby fragments.

92 preserves three upright piston/tube/membrane states: original initial a,
compression be with a down arrow/outward membrane, expansion ve with an up
arrow/inward membrane. Gas stays below the sealing piston. Modern Latin a/b/c
is relabeling; it does not turn the middle apparatus into expansion.
No text/source-reference edits were made by this image author.

93 preserves the opaque metal exterior/protective cover/highlight/shading/
flared stand and the gas-filled sectional body/exposed valve/rounded lower
end/open stand. It does not add the connected-cylinder exercise's pipe,
empty vessel, pressure result or numerical ratio.

Aligned schematic apparatus widths/baselines, semantic shading, regularized
line weights, Latin/English labels and 36 molecular circles per gas depiction
are explicitly modern presentation conventions, not recovered measured
proportions or source particle counts. No source dimension, unit, scale,
rating, hidden valve construction or solved annotation was invented.

## Route And Layer Visibility

Least-generative route declared in user commentary before any service use:
both deterministic, using existing JSXGraph/SVG tooling; Azure calls/retries 0.

No renderer or stable tool change. Apparatus contours use supported `svgPath`;
JSXGraph owns molecular circles, text overlay and the two motion arrows.
All 92 arrows lie completely to the right of the filled apparatus paths.
They have `connects`/direction assertions and actual 306/640 pixel checks,
not merely logical endpoint assertions. Both are visibly unobscured.
93's sectional body has no opaque fill, so it does not hide its JSXGraph
molecular circles. No semantic leader crosses a raw opaque shape.

## First Failure And One Repair

92 first draft validator exited 2 before rendering:

- Three unsupported per-state `objectCount.ids` assumptions requested 36
  circles from the global 108-circle object type.
- Nine invisible rod-axis construction points were incorrectly listed as
  source-visible inventory.

Exact initial spec, mechanism, author helper, image/command ledgers and
stdout are preserved in `fig-92/failure-01/`; initial spec hash
`4e22d85ee7b51ef76e38bda63e9e1704de47d84959be04ee32516246ad7d15f0`.

The sole assertion/inventory adapter repair used the supported honest global
108-circle count and removed hidden construction points from visible source
inventory. Actual geometry objects, coordinates, text/context, font/display
contract and rod collinearity were unchanged. Separate author checks still
require 36 symbols inside each of the three gas regions; no count was changed
to conceal a missing or extra rendered symbol.

Repaired draft validator exited 0. First and only renderer invocation then
exited 2 with `b-view-label` collision. Its exact current spec/SVG/canvas/render,
command ledger and diagnosis are separately preserved in
`fig-92/failure-02-render/`. No second repair or second renderer invocation.
The first pre-render failure snapshot remains intact.

93 had no author failure or repair: one validator and one renderer, both exit 0.

## Actual Checks And Commands

Both instructional figures declare inline max width 640,
`display.widths: [306,640]`, `minTextPx:16`, and canvas fontSize 36.
The isolated headless preview measured actual SVG media widths and
`getScreenCTM()` text sizes, not only nominal viewport/canvas size.
Complete Neutral/Accent/Print sheets at both widths were generated and
opened at original detail; the 92 collision remains visibly marked BLOCKED.
93 has no reported renderer label collision or clipping.

Focused author checks pass for source/current output hashes, complete text/
four-question bindings, unchanged 92 geometry across the contract repair,
piston ordering, membrane signs, enclosed gas positions, 36 symbols per
state and actual arrow/gas/silhouette pixels in all six width/theme cases.
Negative gas-above-piston and opaque-sectional-fill checks fail as intended.
These are author evidence only, not an independent source/visual review.

Executed using only the existing lesson Python and skill Node dependencies:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py build
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py run fig-92 validate
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py run fig-93 validate
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py repair92-contract
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py run fig-93 render
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author.py run fig-92 render
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/s10y-image/6p/fig-92/preview.mjs
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author-check.py --write
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-92/author-check.py --verify-frozen
```

92 validate ran twice (exit 2 then 0). Its render ran once (exit 2).
93 validate/render ran once each (exit 0). Preview ran once (shared, exit 0),
without invoking the figure renderer. Author check/freeze commands exited 0.
Exact underlying build-context/validator/renderer arguments, outputs and exit
codes are in each `command-ledger.json`.

Actual image service ledger: **92: 0 calls/0 retries; 93: 0 calls/0 retries**.
Per-figure `image-call-ledger.json` records repair usage separately.
All browsers were isolated headless; no PWDEBUG, Inspector, visible UI,
user profile, CDP, OS input or automatic HTML report. Task contexts/processes
closed. **No in-flight exec or browser session at this delivery.**

## Frozen Paths And Hashes

Only owned scratch directories and this report were written. Per figure:
`spec.json`, `context.json`, `context.tool.json`, `source-inventory.md`,
`mechanism.json`, `author-handoff.snapshot.json`, SVG/canvas/render,
actual 306/640 individual theme PNGs/full theme sheets, preview metrics,
image/command ledgers and read-only context-input symlinks.
92 also contains both preserved failure directories and shared author/check/
preview helpers, complete width composites and the SHA-bound evidence list.

| Figure | File | SHA256 |
| --- | --- | --- |
| 92 | spec.json | `da91f9a28eaf3efa3bde79ed5fec37c0ee59ac6328d582b243a256d25736d182` |
| 92 | fig-92.svg | `52029f727e2a9fd4c149653ea346f6320f5c05c3d9c735bce90a454bdf5bb6ff` |
| 92 | fig-92.render.json | `3c364c85f203225682767a2f4952a94f3f973ccdd24ba3d7f5fac3882559829b` |
| 92 | context.json | `a22eeaa22f55a9bdfbe4a21b163ea65b2c7558719ea26d24c90c9de77016005e` |
| 93 | spec.json | `f3e57949967eecfc678d55005c85e06bc927dc827de1988aaf040bdcc49e8057` |
| 93 | fig-93.svg | `aa614ee57d77a2e3fd926f2a5a4431c98c2952bca7d9cf609a7b88afad48a898` |
| 93 | fig-93.render.json | `51ee2a95979551237b8800a266dc51ca98101d01979ffff1035da63e63113292` |
| 93 | context.json | `5fc5be97803872b6beaed38728635446632542b2605c46dbda906c4ee3d8e60e` |

Evidence: `.tmp/s10y-image/6p/fig-92/author-evidence.json`,
SHA256 `637aab030b21f2deb1d098cdc1f984bda712dc90fee59f00c54d6724b6ce7e39`.
Final freeze: `UNCHANGED: 69 hash-bound inputs/outputs; 92 BLOCKED, 93 pending independent review`.

No `record_review`, review-PASS file, promotion, source/book/index edit,
assemble/finalize, stable renderer/tool, app, dependency, DB, publication or
Git action. No changes to figures79/80/83 or other authors' work.
This figure run stops here; separately authorized86/87 author work starts only
after this report is persisted.
