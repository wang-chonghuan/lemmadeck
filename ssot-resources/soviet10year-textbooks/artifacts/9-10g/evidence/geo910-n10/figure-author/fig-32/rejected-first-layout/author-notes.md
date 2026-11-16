# fig-32 deterministic author notes

STEMROBIN-184; 2026-11-16. Parent-agent delegation under existing human
ticket authority. Sole assigned output is this scratch fig32 package.
Not independent review, manifest update, promotion or choice authorship.

## Source/context before spec

Read the supplied official `context.json` and the retained own
`source-inventory.md`, then independently reopened the actual durable original
PNG at original resolution before drafting the FigureSpec.
The source is one tilted elliptical projection of a circular instrument dial,
with visible front thickness, two tubular spirit levels on the rear portions
of two crossing diameter direction strokes, M/M1/N/N1 rim-position labels
without dot markers, and the object wording 度盘. Solid rear versus broken
front guides remain instructional structure. No 90-degree mark or reading
exists. No answer/choice, other spec/review or parent source solution was read.

Current source PNG SHA-256:
`3a4dacdc9c1b902b5f45349631041cffdab19ac68a6027e3a423f0e4279ff1df`.
Official context SHA-256:
`619540382b36fe42c5aefd356a8af4080221f4e308b61edade03ed674f3b1330`.
Retained own inventory SHA-256:
`b77c2ae904668268e1953964c0ac20d33e757f4af435dd135906279d2be9a8e7`.

The spec's authoritativeText is the exact COMPLETE exercise84 text from
that official context, including both written subparts. The context has no
prose entries; none were invented. English "Dial" translates the source
object label without adding a measurement, answer or scale.

## Construction and unmeasured simplifications

Use existing JSXGraph segment/point/text primitives and deterministic
svgPath contours, not a new engine or image model.
Screen projection of a unit circular plate is
`(u,v) -> (320+260u, 210-10u+100v)`.
The rim's opposite pairs use source-position directions
`M=(-0.8,-0.6)`, `M1=(0.8,0.6)`,
`N=(0.8,-0.6)`, `N1=(-0.8,0.6)`.
These are unmeasured illustration coordinates, not given angles or lengths.
The two circular-plane directions are distinct and are NOT orthogonal.

Both diameter pairs have one exact common midpoint; centralSymmetry and
collinear assertions cover all four labelled point anchors inside the
same pointRelationships group. Anchor markers are hidden but labels visible.
No named or marked centre is added. Rear/front segments extend slightly
past the rim with anonymous endpoints, not extra source points.

Clean cubic contours approximate the projected ellipse. The front band
adds modest unmeasured thickness; its light semantic-role fill is casing,
not solution/locus shading. Both housings are separate rounded tubes on the
rear diameter portions, with near-end cap contours and simple viewing slots.
Their alignment is asserted; slot shapes do not depict a calibrated state
or bubble reading. The total path count does not independently prove two
tubes: the two specific mapped housing objects preserve that source count
for the parent's independent visual review.

Dash spacing and precise contour dimensions are modern cleanup, not recovered
source measurements. No grid, ticks, values, angle square, 90 label, extra
level, endpoint dots or answer annotation is added.

## Intended display and bounded execution

Native canvas: 640x400. Intended inline maximum:346px.
Declared actual/intended widths:240,280,310,343,346px; all labels46 native px,
nominally17.25px even at240px. The native640 screenshot is also required.
Author must inspect native output,240px neutral and346px print screenshots.
This is output checking, not self-issued independent approval.

Existing renderer launcher was read before execution: isolated
`chromium.launch({executablePath:..., headless:true})`, fresh page, task-owned
browser closed in finally. Use `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`.
No user profile/CDP, desktop/window/tab activation or system input.

At most one actual first render and one smallest targeted layout repair are
authorized. Preserve any first failed spec/SVG/report/PNG bytes before that
repair; a second failing result stops. No blocked fig21 retry or other
figure directory edit is authorized.

Execution status: spec drafted; validation/render/preview results pending.
Parent owns the unique independent full source/spec/visual gate.
