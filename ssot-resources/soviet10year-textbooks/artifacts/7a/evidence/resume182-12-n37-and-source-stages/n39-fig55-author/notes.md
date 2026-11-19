# Figure 55 cap1 handoff

STEMROBIN-182; offline; finish:review; notalone; preserve all other work.
Only `n39-fig55-author/` was written. Every shell operation used
`/Users/yong/.codex/worktrees/d9b1/lemmadeck` as cwd.

## Status

Cap1 source inventory and deterministic draft complete, not semantic approval.
No render, promotion, publish, database, network, model service, app, dependency
installation/change, interaction cap3, E, merge, deploy, closure, agent/chat
operation, or Git operation was performed.

Images actually loaded into context: **1**, the original PNG at original
resolution. Reopens 0; crops 0; rendered images 0; screenshots 0; extra images 0.
Budget 8. The numerical PNG probes emitted text only, not image payloads.

`source-inventory-FIRST.md` was written from the independent opening before
object planning. `source-inventory.json` adds the measured grid, stroke runs,
calibration, source requirements, and uncertainty ranges. Neither was derived
from a previous modern spec or answer/choice data.

## Frozen text and FIRST failure

The existing `build_context.py` was attempted once with the user-specified
isolated source-stage root. FIRST failed with exit 1:

```text
ERROR: fig-55 is not referenced by edition modern-us-neutral
```

The failure is preserved in `context-FIRST.json.buildContextAttempt`.
User clarification: adapt-prepare writes templates only; isolated n39 edition
lesson files appear on finalization. This is an input-path technical issue, not
missing source. No prepare/finalize was rerun and no edition files were invented.

The complete frozen exercise 819 text was independently read from:

```text
../n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39/exercises.template.json
SHA256 e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907
../n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39/lesson.template.json
SHA256 7bb0d75094540710884273718cb9f18d27f81f6611511837b3fc9c8b240b6fb9
```

All 28 current lesson prose blocks were read structurally; none references
figure 55. Only exercise 819 references it. The complete current 819 text is
in `context-FIRST.json` and `spec-draft.json.source.authoritativeText`, verbatim.
The context path is provisional with respect to the finalized edition path,
not the now-frozen text.

## Source precision

- Grid cell counts and half-unit scale are exact instructional requirements:
  36 columns, 12 rows, x[-7,11], y[-2,4]. The scan is skewed and uneven.
- Horizontal curve domain [-6,8] is specified by frozen exercise text.
  Endpoint ordinates read as -1.5 +/- 0.1 and 3 +/- 0.1.
- Broad maximum: x[-2.25,-1.65], y[1.9,2.1]. Broad minimum:
  x[1.8,2.3], y[-1.1,-0.9]. Representatives (-2,2) and (2,-1)
  are interpolation choices inside those neighborhoods, not named points.
- Left zero reading range [-4.15,-3.85]; middle [0.45,0.75];
  right [2.95,3.25]. All three are unlabeled source readings.
- The middle curve/axis meeting is merged with the half-unit grid stroke.
  Its center appears near 0.6. **0.5 is not an exact given** and was not
  inserted as a zero knot, asserted as a source value, or displayed.
- Typical curve stroke spans 7-14 source pixels. About 0.1 unit is a
  reasonable unobscured centerline reading precision; crossing neighborhoods
  and broad extremum positions need the explicit wider ranges above.
- The exact source middle crossing, other zero coordinates, extremum
  abscissas, and endpoint ordinates remain unresolved beyond those ranges.
  No exact function formula is printed or inferred.

## Draft Construction

`spec-draft.json` is `ld-s10y-image/figure-spec@2`, deterministic,
instructional, scroll, tested nominal media width **640 px**, min text **16 px**.
Canvas 960 by 360; 26 px scale/origin text becomes approximately 17.33 px at
640; 28 px axis names become approximately 18.67 px. No hypothetical 960-only
readability claim or unverified 300 px inline layout was substituted.

Grid, axes, arrowheads, and labels use canonical objects and semantic colors.
The curve alone uses `svgPath`; its explicit graph-space samples, source pixel
coordinates, calibration assumptions, sample uncertainty, and compiler are
in `source-curve.geometryProvenance`. No SVG text/point/tick is embedded in it.
Ideal spacing, label repositioning, and hidden witnesses are modern
regularization/construction, not newly discovered source facts.

The samples-to-path transform is deterministic cubic Hermite interpolation
with shape-preserving tangents. The renderer's raw path convention is
`[x-xMin, yMax-y]`; the compiler encodes this explicitly. No zero coordinate
is forced as a knot. The resulting computed crossings in `draft-check.json`
are construction diagnostics only, not exact source values or answer data.

Four invisible construction witnesses are tied to actual path knots.
There are no visible point or endpoint markers. Original visible axis labels
are preserved, including absence of a printed x=1 numeral. No answer labels,
legend, dashed curve, shaded regions, or interval annotations were added.

## Requirement Mapping

Canonical assertion IDs are in the spec. Supplemental assertion/check IDs
are in `draft-check.json`, executed by `compile_and_check.py`.

| Source requirement | Visible objects | Canonical assertions | Supplemental checks |
| --- | --- | --- | --- |
| frame | source-grid, source-x-axis, source-y-axis, source-curve | one-grid, two-axes, one-curve, orthogonal-axes | standard-draft-validation |
| grid | source-grid | source-grid-36x12 (requires gridDimensions) | standard-draft-validation |
| axes | source-x-axis, source-y-axis, source-x-arrow, source-y-arrow, source-x-label, source-y-label | orthogonal-axes, two-axis-arrows, x-arrow-direction, y-arrow-direction | standard-draft-validation |
| scale | source-x-axis, source-y-axis, source-origin-label | two-axes | source-scale-labels, display-minimum-text |
| curve | source-curve | one-curve, construction-points-only | path-is-compiled, path-sample-pixel-calibration, path-segment-monotonicity, path-fits-canvas |
| endpoints | source-curve | left-endpoint-reading, right-endpoint-reading, finite-domain | path-witness-binding, path-finite-domain, path-leftEndpoint-reading, path-rightEndpoint-reading |
| extrema | source-curve | maximum-reading, minimum-reading | path-witness-binding, path-extrema-reading, path-segment-monotonicity |
| query-crossings | source-curve | one-curve | path-query-crossings, path-segment-monotonicity |
| absence | source-curve | one-curve, construction-points-only | no-extra-markings, source-scale-labels |
| text | source-curve, source-grid | finite-domain, source-grid-36x12 | full-frozen-text, current-source-hash |

The original has no named or marked source points, so it does not acquire a
`pointRelationships` requirement from the four hidden modern witnesses.
They are not inventoried as visible source objects. Structural point
assertions alone cannot verify a free-form curve; the supplemental checks
bind them to the actual compiled path and check all curve segments.

## Offline Verification

From the sole allowed cwd:

```bash
python3 .intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n39-fig55-author/compile_and_check.py
```

This checks without rendering or changing the spec. Reports are written only
in the owned folder. `--compile` mechanically regenerates the path from its
explicit samples, not from a guessed function.

`spec-validation-draft.json`: draft-stage validator pass, no errors.
`draft-check.json`: all 16 source-bound draft checks pass, semanticApproval false.
Analytic derivative sign tests cover every cubic; only two direction changes
and three transverse axis crossings remain. All crossings fit the independently
recorded source ranges; the whole control hull stays inside the canvas and
finite domain. Approximate local pixel-calibration coordinate deviation is
at most 0.049 unit versus the declared 0.15-unit sample tolerance.

These are mathematical draft checks, not a substitute for rendered inspection.
Font collisions, clipping, grid/curve contrast, endpoint appearance, actual
product text sizing, and scroll reachability have not been observed.

## Parent Handoff

1. Bind the complete finalized n39 edition text before FIRST render. Compare
   its formulas/domain to the frozen template; recheck draft assumptions if
   there is a substantive change. Keep the FIRST technical failure.
2. Parent runs cap2 FIRST render and investigates any targeted label/geometry
   problem through the spec, not by hand-editing generated SVG.
3. An independent cap4 reviewer compares the original PNG, final edition
   text, and actual rendered graph, including all reading ranges above.
4. Any promotion, final-output references, review hash binding, publishing,
   acceptance, interaction work, merge, deployment, or closure is outside
   this cap1 delivery. No semantic approval or review@1 file was issued.
