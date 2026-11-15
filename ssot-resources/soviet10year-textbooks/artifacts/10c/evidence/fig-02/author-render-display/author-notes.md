# 10c Fig-02 Author Handoff

Role: deterministic figure author only. Files are frozen for the parent's
separate source-first mathematical/visual review. No independent review PASS,
record_review, durable promotion, lesson edit or approval was performed here.
No n76 answers, answer configuration, parent source solutions or choices were
opened. No model, dependency, database or service was used.

All paths below are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/`.

## Source and Modern Binding

The full actual original PNG was opened before authoring; complete observations
were frozen in `source-inventory.md` before `spec.json`. Exactly one shared
frame, one sine curve, two solid tangent strokes, positive x/y arrows, and the
three labels x/y/0 were observed. There are no source ticks, contact dots,
equation labels or third tangent.

The full current modern lesson was read and its 14 nonempty paragraph blocks
are bound verbatim in the spec. The origin and crest cases explicitly reference
Fig. 2; the third tangent is in prose only. It has not been added. No exercise
answer annotations were authored.

Binding snapshot:

| Item | SHA-256 |
| --- | --- |
| Original `artifacts/10c/figures/fig-02.png` | `1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6` |
| Scratch `context.json` | `2cc138d82f7e9868fdb034ff44f48b7bbd2f69649ae830436890d43cdaa5a5bc` |
| Modern `artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n76/lesson.json` at author binding | `9c55c8f125f074fa6b8d82e8b2850e0391f6264eee25791a3b1a215da86e907c` |
| Scratch `source-inventory.md` | `21f5e3963e1c7a1547d162ab72aa872160dc32a5e23f9a5723c72dd31a2376a6` |

`artifacts/` above expands to
`ssot-resources/soviet10year-textbooks/artifacts/`. Scratch filenames expand to
`.tmp/s10y-image/10c-fig02/`. Subsequent parent lesson finalization/promotion
metadata may change the lesson file hash; this records the actual author
snapshot rather than claiming finalization has already occurred.

## Mathematical Construction

Canvas: 640 x 360; bounding box `[-3.1,1.9,3.7,-1.925]`. Both scales are
`94.11764705882352` native pixels per unit, so the diagonal really is a
quadrant bisector. Crop interval `[-2.7,2.9]`, tangent stroke endpoints,
line weights and label placement are declared modern composition choices,
not supplied numerical axis values from the scan.

The existing renderer's supported `svgPath` fallback serializes 47 cubic
Hermite pieces. The knots include `-pi/2`, `0`, `pi/2`; their sine values and
cosine slopes are canonicalized before decimal serialization. Each cubic has
affine x and correct endpoint values/slopes. The native assertions cover both
axes, segment endpoints, perpendicular axes, horizontal parallelism, tangent
contact incidence, diagonal unit displacement and tangent intersection
`(1,1)`, left of the crest `(pi/2,1)`.

`author-math.json` verifies the actual serialized path, including continuous
contact slopes 1 and 0, monotonicity without extra turns, y bounds, no spurious
tangent crossing and exact shared-frame scale. With `|sin^(4)(x)|<=1`, the
Hermite remainder is at most `h^4/384`; maximum h is
`0.12083669756410131`, giving `5.55218803739257e-7` user units or
`0.0000522558874107536` native pixels. Numerical incidence/slope tolerance is
`1e-11` user units.

Limitation: the schema has no native analytic sine or tangency assertion.
Companion executable author evidence supplements the supported native
assertions; it does not falsely label cubics as identically analytic sine,
extend the schema/engine, or replace independent review.

## Completed Checks

- First explicit draft validation: PASS, no errors.
- First existing renderer invocation: PASS, 11 objects, 3 labels, no collisions.
  No spec repair or second render was needed.
- Full native preview was actually opened by the author. The parent has also
  reported opening the source and all three actual media previews; those are
  not reopened after the parent's stop instruction.
- Current app CSS/container harness measured media widths, not just columns:

| Viewport | Actual Media | Minimum Final Font |
| --- | --- | --- |
| 1440 x 960 | 640 px | 44 px |
| 390 x 844 | 346 px | 23.7875 px |
| 284 x 640 | 240 px | 16.5 px |

All labels are wholly inside the SVG, paths match the frozen spec, and the
semantic CSS stroke resolves to the current neutral ink. No document overflow
or page error occurred.

The first display diagnostic used an excessively strict `1e-9` screen-CTM
matrix tolerance, which failed on browser transform precision while font,
width, boundaries and path content passed. Failure JSON/PNG and the original
measurement script are retained. Only the measurement tolerance was corrected:
the full-frame transform error must be <=0.001 px. Actual maximum was
`0.000012207031198840925` px. No spec/SVG/renderer edit or rerender occurred.

This is an offline current-CSS/current-component-markup harness, not a running
app/DB route. External CSS/font imports were omitted and recorded; renderer
labels use Arial and the inline media has an explicit 640px maximum. Browser
was the existing app Playwright Chromium, explicitly isolated headless with
`env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`; no profile/CDP/user tabs or OS input.
Zero network requests. All task contexts/browser were closed.

## Frozen Artifacts

Prefix for every file in this table:
`.tmp/s10y-image/10c-fig02/`.

| File | SHA-256 |
| --- | --- |
| `spec.json` | `a3855bd9e1aa5497ea62579ccca773844575243e857e89e4b7eeebf5817cf17e` |
| `fig-02.svg` | `c369a96747b906d217d713f529b88c6b181341ba0c87f8a2ab80a404353aba4f` |
| `fig-02.render.json` | `d412aed56c6e3cd2ff8b38a54370bf93880f9e7b5f25d6ae92906d17d5472f29` |
| `author-math.json` | `98c98da1fc34cabbdd6b1c055bf553b2b1b6ba845e04c020cf7d23a6efb165ca` |
| `author-math.mjs` | `c182c549205263f206f6dfdb90061b895a31a96b9f67eb5d773ddcfc78bf0d4d` |
| `fig-02.display.json` | `de1ef3c000c879b6b648904bcd3f8676bcf33b94bf12f79c816758a88dfc5778` |
| `check-display.mjs` | `a675568c509fbb5d51bfdbdd4215d9d27f6c0ecfd0c7d9dcf6b529eeb24f93d0` |
| `fig-02.preview.png` (full native) | `924b55229eafeb371f23d482d851b1afd19ea8a410de02142ebbce4e72911ac5` |
| `fig-02.desktop-640.preview.png` | `be19764b62bd4dc7765bf4f212115bc2d8c7cb6d4548e532b621713ec22ac8ce` |
| `fig-02.mobile-390.preview.png` | `6ed0117312ad657b3f2f25052f34e09e2a02fdc5b8c8d51320bb21b113206ee3` |
| `fig-02.media-240.preview.png` | `51497993f2d15e1ee62f80e8ab8137a575ef53b9860b886b237e52e3301b817c` |
| `fig-02.current-css.html` | `1cdcc53baf90161f59cb3b7d51fed4ad22b16647d913a579faf8897d51faca0f` |
| `fig-02.display-first-failure.json` | `ed20244da84a904950deb28b820955de0aa537cc9371f4b9e1b35202c024c700` |
| `fig-02.display-first-failure.png` | `158887164f91f92f514197afde63783aee44c020cf7d478d14ada243290378f0` |
| `check-display.first-failure.mjs` | `ada0efe319badb262efb7e4c4e12bc792289cc749a58ca8785c595f2b9288b6e` |

The display JSON additionally binds each complete viewport page screenshot,
current CSS SHA and component SHA. No approval metadata was authored.

Author work complete; stop here. Await explicit modern-ready authorization
before starting the separate n76 choice-author task.
