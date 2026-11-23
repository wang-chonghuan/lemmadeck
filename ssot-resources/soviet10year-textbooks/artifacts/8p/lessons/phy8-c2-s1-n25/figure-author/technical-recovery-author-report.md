# FIGURE79 Technical Recovery Author Handoff

Date: 2026-11-23. Book: 8p. Lesson: phy8-c2-s1-n25. Ticket: STEMROBIN-180.
Every command workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.

**Status: AUTHOR COMPLETE; technical rendering HOLD resolved; NOT APPROVED.**
This is not an independent source/science/figure review, promotion,
edition finalization, or publication. The parent assigns the sole reviewer.

## Preserved Evidence

The original `author-report.md`, `author-bindings.json`, static relation
evidence and both failed execution records are unchanged and read-only.
The original first candidate/receipt remains in `first-failure/`.
The second failed candidate and receipt are in `second-failure/`.
Read-only copies of the completed report, bindings and static evidence are
in `pre-recovery/`; its `preserved-state.json` binds these bytes.
The old HOLD report describes the historical result, not this recovered state.

The original 18-object pixel inventory and accepted canonical context were
reused unchanged. No source PNG/page/crop/batch was reopened, and no text
was rebuilt. The canonical n25 lesson still matches accepted SHA-256
`713def5d7da63a4154e6b900b383c815c345a3bb67027a360c7303ae20d504f4`.
No entire modern-edition approval is claimed.

## Identified Construction Recovery

The installed JSXGraph `getArrowHeadData` requires a default last-arrow
segment longer than the 2 px stroke times size 6, plus numerical epsilon.
The old segment from (222,57) to (225,68) was only sqrt(130) pixels.
Its suppressed marker acquired a zero-sized viewBox, causing the misleading
`materializeArrowheads` aspect-ratio error. This was a technical construction
defect, not a source fidelity or science verdict.

Only the invisible `rotation-tip` construction point changed, from
(225,68) to (226.2,72.4). This is the exact original direction vector scaled
by 1.4, not a different tangent. The tail stays (222,57); the rotation curve
and every apparatus object, dimension, label, assertion, source inventory,
accepted text and display field are unchanged. Layout coordinates are modern
regularization, not source measured data.

Before the recovered full-figure render, an isolated headless JSXGraph
preflight measured the actual 640 x 400 board:

- User-to-screen scale: 1 in both directions.
- Tail screen point: (222,343); tip: (226.2,327.6).
- Actual arrow segment: 15.9624559514 px.
- Installed minimum: 12.000001 px; default last-arrow size: 6.
- Marker viewBox: 20 x 20, nonzero.

`technical-recovery-execution.json` records the exact preflight, narrowed
candidate comparison, changed-spec draft validation PASS and one recovered
render exit 0. The renderer reports PASS, 39 objects, 4 labels, zero collisions,
and 18 px minimum measured text at the declared 640 px width.
No shared renderer, dependency, validator or arrowhead implementation changed.

## Display Evidence

`fig-79.fixture.mjs` uses the existing installed Playwright and actual app
figure/token/print CSS. It embeds the byte-identical emitted SVG in an
isolated fixture, with no app/DB connection, remote request, user profile,
CDP, headed browser or OS window. No prior executable fixture existed in
this owner's files; this is the first actual display fixture execution.

`fig-79.display.json` records five mechanical display cases:

- Desktop neutral: 1440 x 960, complete 640 x 400 figure.
- Mobile left: 390 x 844, 640 px media, scroll 0/282.
- Mobile right: 390 x 844, scroll 282/282; the right rod end is reachable.
- Desktop accent: actual semantic theme variables applied.
- Desktop print: print media and actual app print palette applied at 640 px.

Every case measures all four labels at 18 px through their screen transforms.
Geometry and labels stay inside the source canvas, labels do not overlap,
all seven deterministic path definitions match the emitted SVG, and all five
arrowheads have nonzero footprints. The curve endpoint and arrow tail
coincide in rendered coordinates. The qualitative right arm remains longer.
The figure bottom and shaft end fit the viewport. There is no document-level
horizontal overflow, page error or remote request.

The author then opened all five corresponding screenshots exactly once.
`technical-recovery-author-inspection.json` records those observations
separately from the mechanical fixture report.
The complete apparatus, right end, bottom shaft, material and radius labels,
continuous lower rotation indication and neutral/accent/print legibility
were inspected. Mobile left and right panels expose the corresponding
details without shrinking the 640 px media.
Only Steel, Aluminum, r2 and r1 with typographic subscripts appear in the
figure. No source measurement, 3 or 3/2 value, force vector, kilogram-prototype
label, solution text or cultural source lettering was added.

## Bound Outputs

All paths below are in this existing `figure-author/` directory:

```text
source-inventory.freeze.json
fig-79.context.json
fig-79.input-binding.json
fig-79.spec.json
fig-79.svg
fig-79.render.json
fig-79.fixture.mjs
fig-79.fixture.html
fig-79.display.json
technical-recovery-execution.json
technical-recovery-author-inspection.json
technical-recovery-bindings.json
```

Screenshots are `fig-79.desktop-neutral.png`, `fig-79.mobile-left.png`,
`fig-79.mobile-right.png`, `fig-79.desktop-accent.png`, and
`fig-79.desktop-print.png`. The recovered spec/SVG/render and indispensable
source/context/failure/display evidence are hash-bound in
`technical-recovery-bindings.json`.

No known author technical/display HOLD remains. Independent figure approval
is still required before the parent performs any byte-identical promotion.
No `ld-s10y-image/review@1` or `record_review.py` PASS was authored.
Edition manifests, lesson/exercise files and other workers' edits were untouched.

**Cumulative actual image opens: 6/8: original PNG 1, display screenshots 5.**
This recovery added 5 opens; no counter was reset.
Paid calls 0; total full-figure render calls 3 (2 failed, 1 recovered);
ordinary affected repairs 1; identified technical recovery attempts 1;
headless preflights 1; fixture executions 1; independent reviews/promotions 0.
No DB, Git, installation, paid generation, new agent/chat or peer message was used.
