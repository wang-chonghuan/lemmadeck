# N88 Independent PhaseB Comparison

STEMROBIN-184 / 184-6. SAME, offline, finish=review. Date: 2026-11-22.
Authority: PARENT-AGENT TEXT under the existing human delegation, not new
direct human approval. Parent supplied intake ed6c35/a28d96 and text f2f767.

## Findings

- Figure 38: PASS within the bounded candidate-comparison scope.
- Figure 39: HOLD, solely for normal-640 raster visual evidence. Its mathematics,
  five-branch shared-frame structure, labels, culture and leakage checks PASS.
- Figure 40: PASS within the bounded candidate-comparison scope.
- Figure 41: PASS within the bounded candidate-comparison scope.

No mathematical or source-structure defect requiring a candidate edit was
found. No producer edit or repair is proposed or applied. These are substantive
comparison findings, not `review@1`, promotion, whole-source, crop, lesson,
production, or publication approval. Original optical unknowns stay UNKNOWN.

**B39-DISPLAY-640:** The once-viewed supplied figure 39 preview was presented
as the wide complete figure. Its serialized SVG declares width 1280 and height
640; labels are 34px. Independent text calculation confirms 34*640/1280=17px
at the declared fixed 640px media width, agreeing with the existing receipt.
However, neither that technical number nor clear labels in the larger preview
is a separately observed normal-640 raster visual check. No PNG header was read,
no resized image was created or opened, and no second preview view was taken.
This is an evidence gap, not a demonstrated layout defect or an instruction
to alter the candidate. The parent owns any resolution and additional authority.

## Evidence and Boundaries

Only the new `phaseB` directory was written. PhaseA's seal, manifest, six bound
artifacts, directory mode 0555 and file modes 0444 were checked as text/bytes
and remained unchanged. No original PNG was read again, even for hashing.
The original source byte hashes are carried from those sealed inventories.

The current candidate manifest was verified against:
`50ba897fe6bb4122e1bbcec9d7f09a9d1eb43ff27880309aea8065d6bedc0340`.
All four current contexts, specs, mathematical bases, draft-validation receipts,
render receipts, render reports, SVGs and preview PNG byte hashes matched it.
`comparison.json` records each figure's source, independent inventory and eight
candidate/receipt hashes, as well as every frozen source observation ID.

The full released modern lesson's 34 prose objects, including 26 paragraphs,
and all 34 exercise texts were read. Embedded authoritative text in each spec
matches all 26 released prose paragraphs; context nearby text also matches.
None of the 34 exercises references these four figures. The lesson hash is
f25f3d3c67a2fd900d0d36e06a2ca7f73cc86da3902bb08621de536ef434adb4;
the exercises hash is
c415dabb6e8145256181b508970807808618a1856e9f994e7adfe9eea326a917.

The authorized science-comparison report hash is
11404fb727ebc5d40999d8f384b0dd8849c7b31fa3608e46af792b949d3d3fed.
Its accepted modern-text scope supports the corrected branch convention, not
figure or whole-lesson approval. Its answer-related sections are not used as
keys or figure authority; no answer-key file was read.

Four existing candidate previews were viewed once each, in order 38, 39, 40,
41. New image events are 4/4, total with PhaseA 8/8. No original reopen, ROI,
crop, header, diagnostic decode, OCR, additional image, screenshot, converter,
browser or render occurred. Native PNG dimensions/counts and image-transport
internals remain UNKNOWN. SVG dimensions below are text fields, not native
image measurements.

## Independent Mathematics

The text defines cotangent on real inputs excluding integer multiples of pi.
Writing cot(x)=cos(x)/sin(x), differentiation gives
cot'(x)=-1/sin(x)^2<0 at every legal input. This supports decrease on each
connected open branch, not global decrease across poles. On (0,pi), the
limits are +infinity and -infinity at the excluded ends, the range is R,
and cot(pi/2)=0. Pole spacing is pi; any positive period must preserve the
pole set, so the least positive period is pi.

Restricting to (0,pi) gives a bijection to R. Its inverse is
arccot(x)=atan2(1,x)=pi/2-atan(x), defined for all real x with open range
(0,pi), derivative -1/(1+x^2), and arccot(0)=pi/2. The inverse is one curve,
not an inverse of the full periodic cotangent relation. Coordinate swapping
establishes the restricted-branch reflection; differently scaled display
windows do not establish a pixel-perfect reflection between the two previews.

The independent `audit-text.py` was run once, synchronously, exit 0. It uses
standard JSON/XML parsing and mathematical calculations on serialized text;
it does not execute producer code, a renderer, or an installed native validator.
It strictly consumes every M/L node and checks all eight emitted SVG path
strings against their specs. Actual raw-path transforms agree with the
canvas's independent horizontal/vertical scales. All serialized points are
finite, inside the window, ordered with increasing x and decreasing y, and
inside their legal branches/range. Every emitted text label matches its spec.
All segment endpoints/dash distinctions and both visible point centers match.

Maximum serialized cotangent residual across all seven cotangent paths is
5.153e-12; inverse residual against pi/2-atan(x) is 5.001e-13. Checking
cot(y)=x for all serialized inverse nodes gives maximum residual 1.404e-11.
Each cotangent path has 1025 nodes; the inverse has 2049. Figure 39's five
actual paths differ from the middle branch by k*pi horizontally, with maximum
offset residual 7.941e-13 and equal ordinates.

This is not merely checking producer-declared control points: all actual
serialized nodes and every segment's quarter, midpoint and three-quarter
positions were checked. For either inverse parameter function,
|second derivative| <= 9/(8*sqrt(3)); the interpolation bound M*h^2/8,
using the actual largest serialized parameter step and scale, is below
0.000415 canvas pixel for every path. The largest sampled segment deviation
is also below 0.000415 pixel. These are floating-point polyline accuracy
bounds, not an assertion of an exact analytic-path primitive or source scale.
Actual observed metrics are frozen in `audit-results.json`.

## Figure 38: PASS

The cold inventory has one unframed, ungridded coordinate system, two solid
axes, one solid descending branch, one long right dashed vertical guide, and
five recognizable label forms. The candidate preview retains all of them:
right/up arrows, 0 below-left of the origin, x/y at the positive arrow areas,
pi/2 below-left of the single curve-axis crossing, and pi below-left of the
right guide. There are no explicit point markers, regular numerical y ticks,
extra curves or enclosing panels.

The curve stays right of the vertical axis and left of the right guide, with
one zero crossing in the correct order. The text/math-derived modern values
are cotangent on (0,pi), zero pi/2 and excluded guide x=pi. Upright exact axes,
bounding box [-0.8,3.9,4.1,-3.9], |y|<=3.2 truncation, chosen stroke lengths,
semantic colors and inline fraction typography are modern regularization.
Differences in curve-versus-axis terminal extents are plot-window choices,
not recovered source endpoints or inclusion semantics.

All five labels are readable and all strokes unobscured in the supplied
preview. The serialized SVG width is 640 and its text is 24px. Source flecks,
isolated hook, irregular ends, exact original codepoints/scales/coordinates
and native counts remain UNKNOWN; none were invented as labels or points.

## Figure 39: HOLD

The cold inventory's entire frame is retained, not split into subfigures:
five descending solid branches, five long dashed vertical guides, and one
solid y axis between branches 2 and 3. Two dashed guides lie left of that
axis and three right. All five branches cross the same horizontal axis once.
No branch joins across a pole and no extra dot, grid or numerical y tick
appears. The y/x/0 forms and all ten pole/zero label forms are present.

The boundary labels read -2pi,-pi,0,pi,2pi,3pi; the five zero labels read
-3pi/2,-pi/2,pi/2,3pi/2,5pi/2. Relative order and source-side associations
are retained. Moving the fraction labels into a lower row and replacing
stacked fractions with slash typography is declared legibility regularization,
not an assertion that the original had that row or exact label coordinates.

The five modern open branches use k=-2,-1,0,1,2 and domains
(k*pi,(k+1)*pi), with range R and period pi. Their zeros are
k*pi+pi/2. Guide positions, spacing, branch translation and formula follow
the released mathematics. The cold source's exact period/scales remain
UNKNOWN. The finite |y|<=3.2 window is not the function's range or domain end.

Every source structural and mathematical comparison passes; all 13 labels
are clear in the supplied wide preview. The separate normal-640 visual
evidence limitation is B39-DISPLAY-640 above. It keeps this figure's final
comparison at HOLD despite the technically correct 17px calculation.

## Figure 40: PASS

One shared unframed graph retains the cold inventory's two solid axes, single
solid descending curve, upper dashed horizontal line and five label forms.
The curve crosses the vertical axis next to pi/2, stays below the upper pi
guide and above the lower 0 axis throughout its displayed trace, and becomes
shallower toward both visible ends. No additional inverse branch, y=x line,
endpoint circle, point label, grid or numerical x tick is introduced.

The modern formula and restriction are the principal inverse described above.
The bounding box [-6,3.7,6,-0.6] and x window [-5.25,5.25] are illustrative
finite windows. The two x-window ends do not exclude any finite real input
from the actual domain; output values 0 and pi are limits, never admitted
endpoints. Exact source curve values and limits were not optically certified.

All five labels are readable and both horizontal gaps visible in the supplied
preview; serialized SVG width 640 and text 24px. Right-margin fragments,
axis protrusions and original encoding/endpoint intent remain UNKNOWN.

## Figure 41: PASS

One shared frame retains a single descending solid branch, two solid axes,
two additional solid horizontal levels, two short dashed vertical projections,
one long right dashed guide, nine label forms and two distinct dark axis-foot
marks. Upper/middle/lower horizontals are not three coordinate panels.
The two a labels and their a>0/a<0 conditions retain separate sign cases
within this single schematic. No visible numeric level values are added.

Reading left to right on the middle axis gives vertical axis, upper foot,
pi/2 crossing, lower foot, pi guide. Each projection links its own foot to
the correct curve/level crossing. Exactly two visible point shapes occur,
both on the middle axis; no new junction dots, zero-crossing dot or curve
endpoint circles are present. Heavy original intersection ink is represented
by strokes, not promoted to point-marker certainty.

The unlabelled illustrative levels +1.5 and -1.2 are explicit modern choices,
not original source values. Their principal inverse coordinates are
0.5880026035475675 and 2.44685437739309. They satisfy
0 < upper foot < pi/2 < lower foot < pi and differ by
1.8588517738455228. The exact modern curve/guide/projection meetings appear
in the serialized path within 4.325e-13 and 9.060e-14 coordinate units;
emitted projection endpoint and dot coordinates agree with these values.
The finite |y|<=3.2 window and equalized level-guide lengths are regularization.
Source coordinates, exact incidence and original filled-point intent remain
UNKNOWN despite the valid modern projection-marker interpretation.

All nine labels, both dots and both projections are readable in the supplied
preview; serialized width 640 and text 24px. Native image dimensions were
not measured.

## Culture and Leakage

The actual previews and emitted labels contain only mathematical letters,
numbers, pi, fraction slash and comparator forms. No historical/cultural
wording, Cyrillic, Chinese in-figure label, old-book texture, portrait,
decorative symbol or generated artwork is present.

No figure displays a worked exercise solution, periodic solution family,
unit-circle construction, extra inverse example value or answer-coordinate
annotation. Existing basic pi/2 and pole labels are instructional source/text
content, not additional keyed answers. Figure 41's invisible authored +1.5
equals task 213's input, but the preview does not display that number, its
inverse angle, a unit-circle point set, or the task's answer. No key was
needed or read to reach this finding.

## Accounting and Stop

Existing four first draft and render receipts exit 0; render reports have
zero collisions and technical minimum text sizes 24/17/24/24 at 640. These
were inspected and hash-bound, not rerun or substituted for this comparison.
The candidate usage ledger records no failures. Earlier upstream failures
and unknown fees are preserved, not erased, replayed, or reapproved.

New comparison execution failures: 0. New paid generation: 0. Charges 74
carried; fees UNKNOWN; complete 0; parent 24/24 permanently exhausted.
Source/extraction/crop/full-lesson holds remain. No desktop/mobile/browser,
keyboard, scroll-end, mounted-media, theme switching, grader or production
claim is made.

All commands are synchronous and exited; no background or persistent session
was started. Parent owns application. STOP after this one PhaseB comparison.
Return is text and evidence paths/hashes only, never image payloads.
