# n159 Figure 343 Graph Author

STEMROBIN-180; same cap3 invocation 180-3; b90; finish=review; 2026-11-19.
W=/Users/yong/.codex/worktrees/0f12/lemmadeck.
Status: AUTHOR_COMPLETE, ready for independent FIG review of these exact bytes.
Independent FIG: NOT_RUN. FIG approval: NOT_GRANTED. No promotion or publication.
The course remains NOT_FINALIZED. This report is author evidence, not an official review.

## Source And Text

First image opened: the original 468x300 PNG named by the existing scoped
`context.json`, copied from the exact canonical original:
`a296e963eb7f170f24b2d95264951c18f4ec47a515e9e7647fc3b981c0cbc59a`.
The context was not rebuilt. Its SHA is
`b573595777fd96174f00ba14137c8b76e740a573f366f058ca1a823e8909891e`.
The source-only inventory was written and frozen 0444 before candidate authoring:
`tmp/b90-n159-graph-author/source-inventory-FIRST.json`,
SHA `63b073952cff07645ec08ede5f636e55d1394d79a33b117dbd118bb6cc53d42e`.

The complete approved lesson and all four unchanged questions were read from
`.tmp/ld-s10y-lesson/b90-n159-figure-context/artifacts/`.
The accepted TEXT report was bound to
`fe6762451a46fc6a7c453608ecc20ec7d8705a1d1546e5275d97a30fd8b108cd`.
TEXT, RAW, SOURCE, prose-flow and context producers were not replayed.
No answer key was read or created.

## Actual Observations

One shared graph has an upward current axis, rightward time axis with its short
visible tail, and only the labels I, t, A, B, C. The worn current glyph is
I-like; modern I is an explicit Latin-symbol normalization, not a newly inferred
quantity. There are no numeric scales, ticks, units, origin number or grid.

The solid curve starts on the current axis above the time axis. A is below-left
of that start. AB is horizontal; B is below the transition to variation.
The observed variable stroke has unequal narrow crests, shoulders, small humps
and troughs, rather than a regular sine wave. It extends both above and below
the AB height but never reaches or crosses the time axis.

C is beneath the interior trough before the tallest crest. It is not a visible
point dot or the right endpoint. The source curve continues beyond C through
another deep trough, crest and small hump to a finite, unlabeled rising endpoint.
The candidate preserves this arrangement. No dashed baseline, second trace,
endpoint arrow, invented period, extrapolation or queried value was added.

AB remains the approved simplified constant-current case; BC remains changing
current magnitude on a DC basis, not repeated current-direction reversal.
The graph does not assert exact waveform reproduction, a linear response, a
fixed period or speech as the source of electrical energy.

Approximate screen coordinates locate thick source strokes, not measured
physical data. Exact subpixel centerlines remain unknowable. The inherited
source-footer code-point UNKNOWN remains unresolved and outside this PNG.
No inherited FIRST, FAIL, BLOCK, REVISE, PASS or UNKNOWN was overwritten.

## Construction And Checks

One deterministic FigureSpec was authored and rendered only by the existing
JSXGraph `render_spec.mjs`; no generated SVG was hand-edited.
The curve uses 20 source-bound screen landmarks and monotone cubic intervals.
Its path endpoints, all landmark bindings, consecutive point displacements,
axis directions, perpendicularity, AB alignment, and connected endpoints are
executable checks. The control hull stays above the time axis, and each interval
is checked for no added turning point. These checks do not rely on object count.

The source has no visible point dots. Hidden construction anchors bind the
visible labels, AB and curve through 33 mapped relationship assertions and the
separate executable path-to-landmark proof. No false visible-point inventory or
invented point marker was introduced. Source mapping is recorded in
`tmp/b90-n159-graph-author/source-mapping-FIRST.json`.

The first render passed: 35 objects including 25 hidden anchors, five labels,
zero collisions, and no label below 16 px. Display is instructional, inline,
maxWidthPx=640, tested at actual media widths 297 and 640. Scroll is unnecessary.
The author opened the full output once and the native screenshot once.

Native DOM checks passed at both widths in neutral, accent and print themes:
minimum text 16.498828125 px at 297, and 35.5544921875 px at 640.
No clipped or overlapping labels, clipped geometry, blank/black raster, browser
page error or network request was found. SVG-local theme geometry delta is zero.
Ink/paper contrast ratios are 16.6895, 7.2215 and 21, respectively.
One screenshot contains both native 640 and mobile 297 surfaces. It was visually
opened once; the author observed distinct axes, AB, the irregular curve, interior
C, finite continuation and readable labels at both widths.
This offline SVG harness is not product/app/lesson acceptance.

## Preserved Technical Failures

The FIRST native call failed at exact JSON equality of normalized DOM bounding
boxes, after the six width/theme readability, clipping and raster probes.
Its helper, HTML, source-geometry proof, call, stdout and stderr are preserved.
The first diagnostic repair retained exact IDs/path/point attributes but used a
0.002-pixel bounding-box tolerance; it failed on a 0.003-source-canvas-pixel delta.
That failed helper and call are also preserved.

Only the failed native comparison stage was repaired. SVG-local getBBox/getCTM
normalization removes large offscreen rectangle subtraction. The final check
keeps exact geometry attributes and a 0.00001-source-canvas-pixel tolerance;
actual maximum drift is zero. The spec, curve, SVG, render PNG, render report,
FIRST HTML and source geometry proof were unchanged throughout.
No successful render or source/text producer was rerun.

FIRST native creation=1, technical native retries=2, total native attempts=3.
All three attempts execute binding/geometry preflight arithmetic; the source
geometry proof artifact was created once and reused unchanged. The native
JSON's geometryCheckRuns=1 denotes that one proof artifact, not three arithmetic
executions; exact invocation accounting is in accounting.json.
Content defects=0; ordinary content repairs=0.

## Hashes And Accounting

Output root: W/.tmp/s10y-image/7p/b90-n159/fig-343/

- spec-FIRST.json: `3e60a27039661c403b8c69082cb4c121b4f02cc0760d78ba9298b2016a947f36`
- fig-343-FIRST.svg: `7bc312bd7f26262e0305cea9dc156a0cdbcd9c99eb54093c8b65a4ed3f81fd1a`
- fig-343-FIRST.png: `9120fdefce0721ee2508dc677f62fd2c3c67deb9c34694ef5a2e0da8b9769339`
- render-FIRST.json: `4b0d45efb6733c02be5c1503f28bef7dc89eda8d67752058ef51f395df13cef9`

Native evidence root: T/tmp/b90-n159-graph-author/

- geometry-FIRST.json: `4ad9373b5518c5dc826ed716c17aefd02a894c164c6f111028be50115e6ed325`
- native-FIRST.json: `a12e9334b260b56f48574f071bf1c7faf3b32ad3c02a86817ed0dcc4344823cc`
- native-640-and-mobile297-FIRST.png: `0d6d498a6fa7de8660c4cfaac98c516dc258ca58a608fb2662687c778c8ac36c`

Images loaded=3/4: original=1, output=1, native screenshot=1.
Crops=0, reopens=0, image-bearing history=0, remaining allowance=1.
PNG screenshots created=2: renderer=1 and native=1. Native machine canvas
probes=18 across the three attempts; no additional probe raster was saved or
loaded into author context.

Shell tool calls=39: 18 read-only bootstrap calls and 21 uniquely labeled
recorder calls including the final sealing command. The bootstrap discovery
`ls` returned 1 for the then-absent author directory/report; this is preserved
in tool history and is not a figure-content verdict. Two recorded native calls
failed; both actual receipt packages remain unchanged. The final seal receipt
is created by the recorder after the hash manifest, so is named in the manifest
but its not-yet-existing bytes are not falsely hashed there.

Spec author calls=1; source inventory freezes=1; renderer calls=1;
embedded draft validator calls=1; separate validator calls=0;
source geometry proof creations=1; source geometry preflight executions=3;
native attempts=3; technical corrections=2; content repairs=0.
Browser launches=4, all headless with fresh in-memory profiles, all closed.
Paid/generation/search/network/backend/DB/Git/app/dependency/setup/freshness/
other-chat calls=0. Context builds=0, official record_review=0, promotion=0,
lesson manifest edits=0, FIG approval reuse=0, course finalization=0.

This report, the FIRST specs and outputs, failed helpers, native evidence,
accounting and hash manifest are frozen 0444. The pre-existing context was not
rewritten or chmodded. Input preservation and output hashes are bound in:
T/tmp/b90-n159-graph-author/hash-manifest.json.
Independent FIG is still NOT_RUN; no approval is inferred from author checks.
