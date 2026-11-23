# FIGURE79 Author Handoff

Date: 2026-11-23. Book: 8p. Lesson: phy8-c2-s1-n25. Ticket: STEMROBIN-180.
Exact command workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.

**Status: FIGURE79_AUTHOR_TECHNICAL_HOLD_NOT_APPROVED.**
This is author evidence only, not independent review, figure approval,
edition finalization, promotion, or publication.

## Source Inventory

Original `8p/figures/fig-79.png` was opened once, at its original 582 x 384
canvas including padding. The source inventory was frozen before drawing or
reading old FigureSpecs. No old FigureSpec, answer key, old choices, source
page, crop, or source-batch image was used.

The independently observed 18 semantic objects are:

- One dark steel cylinder; two light, joined aluminum cylinders.
- One horizontal rod; one central vertical shaft.
- One lower curved rotation arrow, not a force arrow.
- Two outer vertical dimension witnesses; the shaft supplies the shared inner witness.
- Two horizontal radius dimension lines; four outward endpoint arrowheads.
- Four source labels: steel material, aluminum material, r2, r1.

The left steel reference is nearer the shaft than the right aluminum-pair
join/reference. Both radius dimensions share the shaft reference. The two
aluminum cylinders touch on the common rod axis. There are no source numeric
distances, force vectors, answer annotations, or kilogram-prototype apparatus.

`source-inventory.freeze.json` is the untouched original freeze. The FigureSpec
maps all 18 source units to stable visible geometry/label IDs and executable
assertions. Its nineteenth inventory group explicitly records modern
regularization rather than treating it as source content.
The initial durable copy had identical JSON content but different formatting;
the evidence-binding check failed on that byte mismatch. After content
equality was checked, the unchanged scratch freeze was copied byte-for-byte
to this durable location. That evidence-format recovery is recorded in
`fig-79.author-relations.json`; it did not alter inventory content or geometry.

## Accepted Context

The parent reported aggregate WHOLETEXT/SCIENCE PASS during this assignment.
Canonical n25 `lesson.json` matched accepted SHA-256:
`713def5d7da63a4154e6b900b383c815c345a3bb67027a360c7303ae20d504f4`.

The existing `build_context.py` CLI successfully read real canonical lesson
and exercise files with the original PNG. No fake finalized file was made.
`fig-79.context.json` is that helper output. `fig-79.input-binding.json`
preserves the consumed complete current prose, the directly related
p0118#6 + p0119#1 experiment, adjacent source-context text, and provenance.

The experiment retains 3 and 3/2 in its prose, with its low-speed/energy
approximation caveat. Those values were not added as visible image labels.
Historical-prototype and invariant-mass caveat text is accepted input, not an
identification of this centrifuge as a kilogram standard.
No entire modern-edition approval, adapt-audit, finalization, or publication
is claimed. Existing raw SOURCE approval at
`../source-review/final-affected-source-review-8p-n25.md` remains unedited;
this author did not repeat that review.

## Candidate

`fig-79.spec.json` uses the existing JSXGraph FigureSpec renderer.
Its clean cylinder paths are deterministic curve/filled-region fallbacks in
the spec, not manually edited generated SVG or changes to renderer code.

Visible labels are Steel, Aluminum, r2 and r1 with typographic subscripts.
All four labels declare 18 px at instructional fixed-width 640 px scroll media.
No numeric measurement, force vector, or solution label is introduced.
The selected layout coordinates are regularization, not source measured data.

Draft validation passed for both attempts, with 22 executable assertions:
connected apparatus/dimension edges and heads, shared rod axis, shaft and
witness perpendicularity, common dimension baseline, witness associations,
and equal aluminum layout lengths.
`fig-79.author-relations.json` additionally executes qualitative r1 > r2,
left/shaft/right ordering, equal joined contour bindings, required label-only
coverage, and current source/context/freeze bindings.
These are author mechanical checks, not independent scientific/visual review.
The source has no drawn point markers; invisible implementation anchors are
not presented as source points or used as visible inventory entries.

## First Failure And One Repair

First render exited 1 before producing SVG or render metadata:

```text
Unsupported arrow marker aspect ratio:
ld-fig-79_ld-source-rotation-arrowheadTriangleEnd1
```

`first-failure/fig-79.spec.json` and
`first-failure/author-execution.json` preserve the initial candidate and
actual failed call. `author-execution.json` also remains unchanged.

One ordinary affected repair changed only
`source-rotation-arrowhead.strokeWidth` from 2.5 to 2 px to match the dimension
arrows. No coordinates, text, source freeze, or renderer changed.
`affected-repair-execution.json` proves that narrow comparison and the second
draft validation PASS. The affected render still exited 1 at the same marker
aspect-ratio check. Both failures are retained.

The bounded single affected repair is exhausted. No further renderer/spec
repair, substitute drawing path, or retry was performed.
This is a technical rendering HOLD, not a source/science rejection.

## Outputs And Remaining Work

All durable candidate/evidence paths are under this `figure-author/` owner.
`author-bindings.json` provides current file hashes and counters.

Expected paths, currently absent:

```text
ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n25/figure-author/fig-79.svg
ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n25/figure-author/fig-79.render.json
```

The isolated headless desktop/mobile fixture and screenshots were not run:
they depend on a successful renderer output. Complete output, endpoint,
label-screen-transform, theme legibility, and horizontal-scroll-end
inspection therefore remain unverified. Declared font size is not a measured
final-surface readability PASS.

Parent must resolve this technical HOLD within its authority, then obtain
the sole independent figure review before any byte-identical promotion.
No `record_review.py` call or independent-review PASS file exists here.
No edition manifest or parent working/canonical lesson file was edited.

**Actual image opens: 1/8 total: original PNG 1, rendered output 0.**
Paid calls 0; actual render calls 2; ordinary affected repairs 1;
fixture calls 0; independent reviews 0; promotions 0.
No DB, Git, installation, paid artwork, agent/chat creation, peer message,
headed browser, OS window, real-user profile, or CDP was used.
Other workers' source/review/snapshots/dirty/staged/installer files were preserved.
