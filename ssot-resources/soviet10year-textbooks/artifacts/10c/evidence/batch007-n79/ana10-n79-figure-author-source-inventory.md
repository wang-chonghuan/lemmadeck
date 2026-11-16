# ana10 n79: six original-only figure inventories, StageA

Ticket: STEMROBIN-184. Author role: inventory/routing only, delegated by the parent agent under existing human ticket authority.

Status: COMPLETE AND FROZEN at StageA. No FigureSpec, context, render, validation, review or promotion is authorized or performed. This is not a figure PASS.

## Chronology and allowed evidence

Read the current ld-s10y-image skill, routing, FigureSpec contract and relevant existing schema/renderer excerpts. Read only faithful `ana10-c6-s2-n79` lesson/exercises for figure roles. The lesson is 二阶导数; written tasks46-51 have no figure references and were not solved for this inventory.

Independently opened the durable original PNGs separately, at original resolution, once each: fig05, fig06, fig07, fig08, fig09, then tbl-p0021-01. The observations below were frozen before any modern context/spec. Following context continuation, only file hashes were reread; no PNG was reopened. No parent solutions/review, answer keys, choice packages or modern author output was used.

Root for all paths: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Original pixel identities

All files below are under `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/`. SHA values are actual SHA256, reconfirmed unchanged at handoff.

| File | Original pixels | Bytes | SHA256 |
| --- | --- | --- | --- |
| fig-05.png | 414 x 363 | 3464 | `9762fd425047afc9880b1a6ef6380fa307fdcd1fc3bbca1c7f2f3664d4b909bf` |
| fig-06.png | 441 x 357 | 3485 | `c0f74409bab468a675ff077d2feb49ba79dc9b3df89ff88a1618f6e6d5dfb50a` |
| fig-07.png | 429 x 389 | 3781 | `7b226880647ee9f862dbcf80728eed3faa1ff17928f848b4a0ec4361b9dd7c1e` |
| fig-08.png | 437 x 416 | 3870 | `a6ae8ab3af00e358db0f0b83cbe34ff49b8a09f3c6c5dd32c76f0b4e14231974` |
| fig-09.png | 478 x 394 | 4657 | `0f174d4af846f09e62f547fbe6aba503c5098218b8bf9a2ab312b37721c2ca12` |
| tbl-p0021-01.png | 1133 x 368 | 8058 | `d578034e371c0d94ac215e834abdd2f24ca41e13e1fdfeeb9e9123aeeb661d1e` |

## fig05-08: complete shared pixel inventory

Each of the four originals independently contains:

- One schematic function curve in the positive quadrant; not an additional derivative curve.
- Two perpendicular axes, positive-x arrowhead right and positive-y arrowhead up, with small left/below-origin continuations.
- Exactly five printed labels: numeric `0`, Latin `x`, `y`, `a`, `b`. The origin glyph is zero, not point O.
- Observed illustrative placement `0<a<b`, with a/b on the positive x-axis. This placement is not an extra hypothesis for the general prose theorem.
- Exactly two hollow/open curve-end circles at abscissae a and b.
- Exactly two vertical dashed/interrupted guides from the x-axis a/b positions to the corresponding open curve ends.
- No other named points, numerical heights, scales, extra ticks, horizontal guides, tangent lines, equations or derivative-sign annotations.

All depicted curve heights are positive; no height/distance is measured. Dash patterns are irregular source ink, sometimes long thin runs. Preserve dashed-guide meaning, not a fabricated dash count. Fig06's left open ring is fragmented in the scan but is not a filled point. Apparent endpoint flattening/steepness does not assert a zero/infinite endpoint derivative.

### fig05

Source roles: four-case introduction `p0019#14`; case `p0020#1`, figure `p0020#2`, caption `p0020#4`.

Observed curve rises from the lower-left hollow end to the upper-right hollow end and steepens across the shown interval. The prose states `f'>0`, `f''>0`: accelerated increase.

Planned stable inventory groups:

- `f05-axes`: x/y axes, arrows, origin and x/y labels.
- `f05-abscissae`: a/b x-axis anchors and labels; these label anchors are not invented visible dots.
- `f05-curve-ends`: left/right hollow markers and their incident curve ends.
- `f05-guides`: two vertical dashed guides and their own axis/end incidences.
- `f05-function`: exactly one increasing, positive-second-derivative curve.

All five labels and both open ends must remain. Do not add the displayed sign pair as an answer annotation.

### fig06

Source roles: case `p0020#6`, figure `p0020#3`, caption `p0020#5`.

Observed curve rises while flattening. The prose states `f'>0`, `f''<0`: decelerated increase. The low-left endpoint circle remains hollow despite fragmented ink.

Groups `f06-axes`, `f06-abscissae`, `f06-curve-ends`, `f06-guides`, `f06-function` have the same complete membership/marker constraints as fig05, but the single function has the opposite curvature sign. No decreasing curve or horizontal endpoint slope is justified.

### fig07

Source roles: case `p0020#7`, figure `p0020#8`, caption `p0020#10`.

Observed curve descends from a high-left hollow end to a low-right hollow end while flattening. The prose states `f'<0`, `f''>0`: decelerated decrease.

Groups `f07-axes`, `f07-abscissae`, `f07-curve-ends`, `f07-guides`, `f07-function` preserve the full shared inventory, with decreasing/positive-second-derivative shape. Neither the b-end height nor its slope is stated numerically.

### fig08

Source roles: case `p0020#12`, figure `p0020#9`, caption `p0020#11`.

Observed curve descends and steepens. The prose states `f'<0`, `f''<0`: accelerated decrease.

Groups `f08-axes`, `f08-abscissae`, `f08-curve-ends`, `f08-guides`, `f08-function` preserve the full shared inventory, with decreasing/negative-second-derivative shape.

### Shared source-language safeguard

The actual textbook calls positive second derivative “向下凸” (curve above its tangents), and negative second derivative “向上凸” (curve below its tangents); bindings `p0020#13` and `p0021#1`. Do not reverse the geometric shapes through a different modern naming convention. The shape/sign pair, not an inferred everyday meaning of the Chinese name, is authoritative.

The derivative definition/examples/velocity explanation occur at `p0019#11`, `#12`, `#13`; no velocity vector or extra plotted quantity appears in these PNGs.

## fig09: full pixel inventory and source roles

Source bindings: cosine intervals `p0021#2`; inflection/contact `#6`; tangent equation `#7`; tangent-side reasoning `#8`; figure `#9`, caption `#10`.

- Exactly one cosine curve, depicted from `(0,1)` to `(pi,-1)`.
- Exactly one descending straight tangent, contacting at `(pi/2,0)` and visibly extending on both sides.
- Two x/y axes with their positive-direction arrows.
- Exactly seven printed labels: `0`, `x`, `y`, `1`, `-1`, `pi/2`, `pi` (the last two are printed with the mathematical pi glyph).
- Source prose tangent equation is `y=pi/2-x`. The tangent is above the cosine to the left of contact and below it to the right.
- No dedicated contact point dot/open circle, no endpoint dots, no vertical dashed guides, no extra period of cosine.
- No printed curve-name, equation, slope value or “inflection point” annotation in the figure. `-1` is the y-axis value, not a slope annotation.
- Peripheral scan specks are not mathematical/named points. Approximate scan alignment is not additional metric data.

Planned stable groups:

- `f09-axes`: axes/arrows plus origin and axis labels.
- `f09-values`: y-values1/-1 and x-values pi/2/pi, including label/tick anchors only as actually required by the source; no visible point marker invented for an anchor.
- `f09-cosine`: one cosine trace, source endpoints as geometric locations without added dots.
- `f09-tangent`: one straight tangent with contact geometry; the contact anchor is hidden, not a new visible point.

Preserve the source tangent/contact relation and both side inequalities. Finite visible stroke ends are not labelled mathematical endpoints.

## tbl-p0021-01: complete cell/grid inventory

Source roles: table introduction `p0021#3`, table `p0021#4`, interpretation `p0021#5`; relates to cosine intervals `#2` and fig09.

Observed complete bordered 3-row x 3-column grid: four vertical and four horizontal grid boundaries. All nine cells are required, including the deliberately blank top-left cell. Exactly eight cells contain text:

| Cell | Actual source content |
| --- | --- |
| r0c0 | blank |
| r0c1 | `$0<x<\pi/2$` |
| r0c2 | `$\pi/2<x<\pi$` |
| r1c0 | `$\cos' x\ (= -\sin x)$` |
| r1c1 | `$<0$` |
| r1c2 | `$<0$` |
| r2c0 | `$\cos'' x\ (= -\cos x)$` |
| r2c1 | `$<0$` |
| r2c2 | `$>0$` |

No x=pi/2 column, zero-sign cell, cosine-value row or title in the blank cell exists. The source first column is somewhat wider and header row taller; this is an unmeasured layout, not a required numerical cell dimension.

Planned IDs: `t21-grid`, all nine `t21-rNcN` cell regions, and eight corresponding `t21-rNcN-text` objects. Explicit blank-cell inventory is necessary: neither an eight-text count nor a generic grid outline proves all nine cells/source completeness.

## Routing/assertion plan only

All six route **deterministic / instructional**, using the existing renderer core, not raster generation or a custom engine.

Target widths supplied for later authorization: native640, 346 print and240 neutral inline, with labels at least16 screen pixels at every intended width. These are targets, not measured app/preview evidence. The wide table may instead use the existing authorized640px scroll-media contract, with actual media width640 and truthful scroll metrics; canvas width alone is not evidence of that contract.

Native assertion plan:

- Graphs: `perpendicular`, `collinear`, `displacement`, `pointOnLine`, exact `objectCount` where meaningful; source point relationships explicitly mapped through `requires:["pointRelationships"]`.
- Each relationship group must cover its complete mapped points/anchors. A point relationship must not be “proved” in another unrelated group.
- Hollow curve endpoints may use the existing point primitive with `face:"o"`, `fill:"paper"`, `stroke:"ink"`. Axis label/contact anchors may have hidden markers; they do not claim printed dots.
- One analytic curve may be expressed by the existing `svgPath` fallback. Labels/ticks/endpoint point objects remain separate; do not encode them as anonymous path ink.
- Table: `requires:["gridDimensions"]`, explicit3x3 `gridDimensions`, all nine regions and eight text objects; native `inside`/placement checks where supported. Object count cannot substitute for grid dimensions or the intentional blank cell.

Important limit: the current native assertion vocabulary has no derivative-sign, monotonicity or curvature predicate. Do not claim that geometric counts/point incidences validate those signs. Analytic construction plus the parent's single independent semantic/visual review must establish the four curve shapes. No new assertion engine is authorized.

Possible later unmeasured analytic regularizations, not FigureSpecs or source equations: with normalized t and positive K,k, use `C+K exp(kt)`, `C-K exp(-kt)`, `C+K exp(-kt)`, `C-K exp(kt)` for05/06/07/08 respectively, choosing heights positive over the shown interval. Any such C/K/k/spacing is a disclosed modern unmeasured regularization, never an invented given or visible answer annotation. Fig09 may use its actual cosine and source tangent relation. Table typography/cell spacing may be regularized without changing a cell's text or blank status. Use semantic-role colors only.

## Read-input hashes

Faithful directory: `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n79/`.

| File | SHA256 |
| --- | --- |
| lesson.md | `21c1ce67b2155b869f5a6bdb548dd007197cfd6a72faef202da0b13754d8d75b` |
| lesson.json | `6ec5e4c8c85243e88f1c28d6f66ffe9cdf37d0f7c4d1247224fbf31bc0076cf5` |
| exercises.json | `ce3f1239a506e5bf744ce09a2187dcc85a297c49963697e2264ee9a6ff1fde27` |

Read skill/core identities from the initial inventory observation:

| File under `.agents/skills/ld-s10y-image/` | SHA256 |
| --- | --- |
| SKILL.md | `6e839e78f784a1e9bb370fcef1104d150380523edef8a72f0ccb7fd4a8339063` |
| references/routing.md | `dc56a358971ec631b40d305c695e6ca5dccca3420fe4754568e399eacd19f8f9` |
| references/figure-spec.md | `0de03f32aa271aed552d51d41c326911cc1137c17d9217a8f74c0c4b7f7bc3a9` |
| assets/figure-spec.schema.json | `34a91459aa2885b9d9677297137d5c7e3757a62c9f51f2cf31bf7c515da6d5c1` |
| scripts/render_spec.mjs | `28ab00dbc42840537fc06289358bd7c6934d205b8f9e2fb9e60d5a25f57e7d91` |

## Handoff/stop

All six original-only inventories and routing plans are complete. No official modern contexts were built/read and no drawing started. Await explicit StageB authorization and approved contexts. The later rendering allowance is first actual render plus at most one smallest targeted repair per figure, preserving failures; it is not consumed by this read-only inventory.
