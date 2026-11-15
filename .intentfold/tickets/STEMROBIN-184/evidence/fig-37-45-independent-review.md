# Independent Figure Review: 37-45

Ticket: STEMROBIN-184. Role: independent reviewer, not figure author.
Result: **PASS for all nine current scratch figures; no author repair requested.**

## Scope And Evidence

One substantive source-first review, in numerical order. For each figure I
opened the complete original PNG at
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-NN.png`
before its current spec/render/preview. I independently described the
visible source structure, then compared current FigureSpec objects,
inventory, assertions and actual 640px preview. The author handoffs for37/43
were consulted only after the original pixels. No answer, choice, other
reviewer's report or old rejected package supplied mathematical evidence.

Current semantic authority was the complete modern s9 lesson/exercises:

- lesson.template.json SHA-256:
  `405aad569b70e60dbde903145dfcf989e89cdb81088b61c00a30b2f759982a63`
- exercises.template.json SHA-256:
  `1c6b31c8fd92226a46503b01b321d3b943de24f0ae4fb3822b96eb2cf281d058`

All37-42 `source.authoritativeText` arrays equal the current full prose
context. All43-45 arrays equal that context plus the complete referenced
exercise91/93/94 respectively, including all six/five subparts of93/94.
This equality was checked on actual files, not a handoff hash alone.

Exact current source/spec/render/SVG/preview/validation and independent
screenshot SHA-256 records, actual SVG labels/geometry, screen transforms,
pixel comparisons and scroll metrics are in:

`tmp/fig-37-45-independent-review/svg-display-evidence.json`

SHA-256:
`5c4524f1af0009626f08033f6e7b7cd5c36d9f2e9b1ed02b226a9e4a4ec6a724`

The `tmp/` paths here are relative to
`.intentfold/tickets/STEMROBIN-184/`. Author assets remain untouched under
`.tmp/s10y-image/6-8g/fig-NN/`.

## Per-Figure Conclusions

### fig-37: PASS

Original pixels show one oblique parallelepiped with eight vertex names:
front face A/B/C/D and back face K/F/E/H. Nine solid edges are
AB/BC/CD/DA/BF/FE/EC/EH/HD. AK/KH/KF are the three dashed hidden edges.
No extra diagonal, path highlight, shaded face, length, tick or right-angle
mark appears. The current SVG retains all eight labels and exactly this
edge topology and dash distinction; K is the lower hidden vertex, not a
substitute front corner.

I checked the spatial claim independently of the 2D validator. In an
abstract nondegenerate parallelepiped take A=(0,0,0), D=(1,0,0),
K=(0,1,0), H=(1,1,0), B=(0,0,1), C=(1,0,1), F=(0,1,1),
E=(1,1,1). AKHD lies in z=0. The determinant of AB, AC, AE is1,
so A/B/C/E cannot lie in one plane. These are reasoning coordinates,
not new printed measurements. Current projected coordinates are consistent
with the same independent edge families: AD=(240,-25), AB=(0,220),
AK=(125,90), with the other vertices formed by their corresponding sums.
Thus the modern diagram supports the actual text, not a false claim that
all screen points being2D proves the spatial result. Named parallelepiped
semantics authorize parallel families; no rectangular/cubic interpretation
or exact source slope is invented.

### fig-38: PASS

Source has finite AB ascending from lower-left A to upper-right B,
finite CD descending from upper-left C to lower-right D, and one marked
common interior point M. Five dots/names, two segments, no extensions.
All survive in the current diagram. `connect-AB`/`connect-CD` and the two
M-on-line assertions map to the same source group.

Independently, M has parameter5/11 on AB and10/21 on CD in current
coordinates, strictly between0 and1 on both; directions are not parallel.
Thus M is the unique common interior point, not an endpoint or a
midpoint assumption. The rightward M-label offset remains unambiguous and
clear of both strokes at640px.

### fig-39: PASS

Source contains A at the shared lower-left endpoint, B upper-right and C
lower-right; only finite AB and AC are drawn. Current output has the same
three dots/labels, both edges connected to the same A, and no BC closure,
new intersection, arrow or angle mark. The two noncollinear segments meet
at their shared endpoint only. This preserves the source distinction from
the common-interior-point case in38.

### fig-40: PASS

Source has finite AB with A lower-left and B upper-right. CD starts at
upper-left C and ends at D on the interior of AB; it does not continue
through D. Current connections and D-on-AB assertion match those pixels.
D has current AB parameter0.6, strictly interior to AB but an endpoint of
CD. All four dots/labels remain; no added AC/BC or lower-right CD tail.
This is not silently converted into the two-segment crossing of38.

### fig-41: PASS

Original shows three marked points A/B/M. AB is finite and ascending;
the other descending stroke passes through M and carries the p-shaped
line-name glyph at upper-left. The current full prose calls the crossing
object a straight line. Current spec therefore correctly uses lowercase
`p` as text and one infinite `line-p`, with no P point or P dot.
Literal line construction anchors are not rendered endpoints.

M has parameter0.62 on finite AB and lies on p; the directions differ,
so this is its unique interior intersection. Current SVG has exactly
A/B/M/p as visible text and three point markers. Extending p to the
canvas boundary is a declared infinite-line regularization, not accidental
clipping or an invented marked endpoint.

### fig-42: PASS

Original has two unarrowed crossing strokes, lowercase a on the descending
upper-left branch, b on the ascending lower-left branch, and only M
marked/named at their crossing. Current SVG preserves that assignment,
one dot and M/a/b text. Both M-on-line assertions resolve.
Current direction determinant270600 is nonzero, so the intersection is
unique; it is not changed to coincident or parallel lines. No new endpoint,
angle/right-angle mark or quantitative claim appears.

### fig-43: PASS

Independently visible source inventory: one frame; descending line a has
A-X-B-D in order; ascending b has E-B and a small round ink enlargement
near source(360,56) on its upper branch. C is a separate dot below-left of
the crossing, off both lines. There are six uppercase source names
A/X/B/D/E/C and two lowercase line names a/b.

The upper-branch ink mark has no independent uppercase name. Current
`source-mark-b-upper` retains it visibly without a label. It does not
invent a named exercise target, and lowercase b still names the line.
The scan alone does not settle whether that anonymous enlargement was
intended as a formal mathematical point; preservation as unnamed ink is
faithful without making that additional claim.

The current a-incidence assertions cover A/X/B/D. b is defined by E/B
and `upper-mark-on-b` covers the preserved unnamed mark. C's mapped
`C-offset-from-B-modern` is explicitly a layout displacement, not a
source-given distance. With the actual line coordinates, C is113.518052
user units from a and115.568584 from b, so it is robustly off both.
The chosen displacement is not shown as numeric data. Eight visible
labels match the source name inventory; no membership answers appear.

### fig-44: PASS

Source has two crossing full strokes and one shared A. Ascending p carries
C-D-A-E in order; descending q carries T-F-A-B in order. All seven named
points are retained, including T despite its absence from exercise93's
six propositions. Lowercase p/q remain line names, never additional dots.

Current p is defined by C/E with D/A incidence assertions; q by T/B with
F/A assertions. Current increasing x orders are100<175<300<555 on p
and100<165<300<505 on q, so neither source order is reversed or collapsed.
The full modern propositions are compatible with these same orders.
No ray-direction arrows, union/intersection overlays, result labels or
answer shading were added. Labels stay locally associated with their dots.

### fig-45: PASS

Source has one unarrowed ascending line a and K-L-M-N in that order, with
all four uppercase names above their marked dots. Current SVG retains one
infinite line, those four dots and a as a line name. K/N define the line,
and L/M incidence assertions cover the other points.

Current x coordinates95<205<360<520 preserve the order with unequal gaps
110/155/160. No equal-spacing, midpoint or source-given metric condition
is invented. All five modern exercise subparts are bound; no requested
set result is highlighted in the picture.

## Actual SVG And Display Evidence

I inspected the existing app Playwright config and the image renderer's
custom launcher without running either test suite or author renderer.
The standalone review entrypoint explicitly launched
`{channel:"chrome", headless:true}` through the app's existing Playwright.
Execution was:

```sh
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .intentfold/tickets/STEMROBIN-184/tmp/fig-37-45-independent-review/inspect-current-svg.cjs
```

One isolated browser/context, one worker, every network request aborted.
No persistent profile, CDP attachment, headed/debug/UI/Inspector,
bringToFront, tab/window activation, system mouse or keyboard was used.
The browser/context were closed before this report was written.

For each actual current SVG:

- fixed media width640px; all visible text measured32 screen px using
  `getScreenCTM()`, exceeding required16px;
- every expected label matched actual SVG text; label boxes stayed inside
  the full SVG, and no source-required finite object was clipped;
- the complete independent640px SVG screenshot was compared by decoded
  pixels with the already inspected current author preview;
-37/38 had identical pixels;39-45 had only maximum channel difference1
  in314/298/801/1102/404 pixels for41/42/43/44/45 respectively, and
 689/540 for39/40, with equal dimensions and no structural change;
- a310px isolated scroll fixture retained media width640, scrollWidth640,
  scrollLeft330 and a reachable end, with documentWidth=viewportWidth=310;
- neutral/accent/print CSS ink changes propagated to every SVG label.

The observed previews have no label collisions, wrong point associations,
missing labels, answer annotations, CJK/Cyrillic artwork text, old-book
texture or cultural decoration. Changes to font, ink and schematic
unmeasured placement are modern regularization, not new given facts.

## Limits And Handoff

This is an independent scratch figure review, not durable promotion or a
claim that the final integrated app route has already passed. Scroll
metrics come from the described isolated fixture, not an activated user
window or the published product. Parent owns asset promotion, durable-path
rebinding and batch integration acceptance.

All current source/spec/SVG hashes matched their producer metadata.
Per-figure hash-bound review records use the existing
`record_review.py` rendered-stage verifier under
`tmp/fig-37-45-independent-review/fig-NN.review.json`. Its mandatory
validation is not a rerun of the author renderer. No source, modern
template, author spec/render/SVG/preview or existing reviewer output was
edited. No repairs, regeneration, model calls, DB writes, promotion or
commit were performed.
