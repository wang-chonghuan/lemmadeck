# N30 fig-190 / fig-191 independent review, 188-7

Date: 2026-11-23. Fresh NONFORK reviewer, independent of figure authoring.
Only workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only write scope: this `fig190191-independent7/` directory.

## Result

| Figure | Mathematical/source relationships | Visual, existing offline figure surfaces | Cultural/answer leakage |
| --- | --- | --- | --- |
| fig-190 | PASS, original weak glyph remains UNKNOWN | PASS | PASS |
| fig-191 | PASS, original radius glyph case and lower named-branch identity remain UNKNOWN | PASS | PASS |

These verdicts apply to the current bound candidate specs and the actual retained
SVGs, not to a canonical promotion, lesson-wide approval, choices, answers, DB
publication or live-product acceptance. Promotion belongs to the parent.
Existing registered radius-c errata and approved prose were supplied premises,
not new review subjects. No other figure review scope was read.

## Source FIRST

Before candidate inventory/geometry, I extracted only `source.authoritativeText`
from the two designated specs, opened the two designated original PNGs once each,
and recorded independent pixel observations in `source-first.json`.
That snapshot was made read-only (`0444`) and hashed before candidate inspection:

`69c9e7fe71d8f491408e20bba4b4268ed26f3c88cf485598f30ceadc28d98914`

The complete text extraction is bound by SHA-256
`30fcb4bc617e7ff290af946ac49be0b3e786c42467e398fdc8d39b6ab375b5ef`
using UTF-8 `JSON.stringify(source.authoritativeText)`.

## fig-190

**Mathematical verdict: PASS.** Original A is above C, B is right of C, AC is
vertical, BC horizontal, and AB joins the upper-left vertex to the lower-right
vertex. The C right-angle square is preserved. The separate upper c and lower a
bars both retain endpoint caps; the c bar is longer. These are relationships,
not a conclusion drawn from the count of generated objects.

| Independent requirement | Candidate objects | Executable assertions checked |
| --- | --- | --- |
| A, B, C and three triangle edges | `triangle-A`, `triangle-B`, `triangle-C`, `triangle-AC`, `triangle-CB`, `triangle-AB` | `triangle-leg-a`, `triangle-hypotenuse-c`, `triangle-right-at-C` |
| c bar equals AB and a bar equals CB | `given-c-bar`, `given-a-bar` and their four caps | `given-c-matches-AB`, `given-a-matches-CB` |
| Both given bars parallel the base | same bars and `triangle-CB` | `given-bars-parallel-base`, `given-bars-mutually-parallel` |
| Right-angle marker has correct orientation at C | `right-angle-upright`, `right-angle-top` | `right-mark-upright-parallel-AC`, `right-mark-top-parallel-CB` |

Every named point is covered by a mapped within-group relationship. The source
orientation and actual cap attachment were also checked directly in pixels and
coordinates. The illustrative coordinates A=(0,3), C=(0,0), B=(4,0) and bar lengths
5 and 4 implement AB=c>BC=a. They are hidden regularization, not printed numeric
givens. No circle, p, mirror triangle, grid or extra solved value is introduced.

**Visual verdict: PASS.** Existing desktop-max and mobile-prose screenshots show
the entire two-bar/triangle composition, with all seven mathematical labels
separated from lines and each other. No clipped vertex or bar cap, missing right
angle, broken raster or black frame. The lowercase c on AB is justified by the
current text, not by pretending the source's weak diagonal glyph is certain.
Candidate inventory's shorthand claim of a source c is qualified by the sealed
independent UNKNOWN record; the candidate bytes were not rewritten.

**Cultural/leakage verdict: PASS.** SVG labels are A, B, C, a, c, c, a. No Cyrillic,
Chinese, Soviet symbol, ideological decoration, numeric answer or new exercise
solution is embedded. The external screenshot caption "figure 190" is lesson
chrome, not an SVG mathematical label. This is the text's supplied analysis
diagram, not an unanswered-question illustration.

## fig-191

**Mathematical verdict: PASS.** One complete circle is centered at B. C is left of
B on the same horizontal trace; p passes through C and is perpendicular to BC.
A is the upper intersection of p with the circle, and AB is a radius. The
horizontal a label names BC, not a diameter. There are no separate given bars,
added right-angle box, arrows, ticks, dots, dashed branch or numerical labels.

| Independent requirement | Candidate objects | Executable assertions checked |
| --- | --- | --- |
| BC=a; AB=c; perpendicular at C | `construction-A`, `construction-B`, `construction-C`, `construction-AB`, `construction-a` | `construction-leg-a`, `construction-radius-c`, `construction-right-at-C` |
| A on circle centered at B and on p | `construction-circle`, `construction-p`, `construction-A` | `A-on-circle`, `A-on-p` |
| C on shared horizontal trace and p | `construction-horizontal`, `construction-C`, `construction-p` | `C-on-horizontal`, `p-through-C` |
| Visible unnamed lower crossing retained on both traces | same circle and p; coordinate literal (-4,-3), no visible added point | `lower-crossing-on-circle`, `lower-crossing-on-p` |
| Both circle/horizontal crossings retained | same horizontal and circle; literals (-5,0), (5,0) | `left-crossing-on-circle`, `left-crossing-on-horizontal`, `right-crossing-on-circle`, `right-crossing-on-horizontal` |
| p extends above A and below lower crossing | `construction-p`, `construction-p-name` | `upper-p-stroke-collinear`, `lower-p-stroke-collinear` |

All three labelled points are covered by mapped within-group relationships.
The same visible frame, incidence and line extents were checked, not substituted
by object counts. A=(-4,3), C=(-4,0), B=(0,0), radius 5 and BC length 4 satisfy the
current text's c>a, circle (B,c), and perpendicular p through C. The existing
lower crossing is visibly present and left unnamed. Its mirror placement does
not create a second congruence class. No lower AB or second labelled triangle
is drawn, and no claim of a uniquely located planar A is added.

The source radius glyph's case (including the legacy capital-C reading) remains
UNKNOWN, and the lower crossing's named second-vertex/triangle identity remains
UNKNOWN. Current c notation is an already authorized text premise. These
uncertainties do not negate the observed crossing or reopen registered errata.

**Visual verdict: PASS.** Desktop-max and mobile-prose show an intact circular
frame and horizontal/vertical traces, the upper A, center B, C, radius c, BC a
and p. The repaired p label is readable near the top extension, clear of the
stroke and canvas edge. No label collision, endpoint clipping, blank frame,
black raster or falsely highlighted lower branch.

**Cultural/leakage verdict: PASS.** SVG labels are A, B, C, c, a, p. No cultural
source lettering or symbols, computed length, extra answer-bearing annotation
or second solution branch. The external lesson caption is not an SVG label.
The circle and perpendicular are the given construction exposition.

## Display and native bindings

Existing render PASS is reused, with no rerender, browser, new screenshots or
whole-lesson display work. Existing figure-only offline checks have eight
figure/width observations: media widths 331, 358 and 640, plus desktop 1440
viewport at the same 640 maximum. Each figure has 34 px SVG text: minimum actual
mathematical text 17.584375 px at 331, 19.01875 px at 358, and 34 px at 640.
The desktop screenshot container is 928 px, not the figure media width.
All recorded label clipping/overlap and document overflow checks are clear.
This evidence is a headless offline CSS-adapted figure surface, not headed App
or whole-lesson acceptance; that limitation is explicit and not a new HOLD.

Source, current spec, actual SVG and all four screenshot hashes matched.
Author and bound candidates have identical rendering fields, inventory and
assertions; only non-rendering source bindings/text differ. Visible SVG paints
use semantic CSS variables. JSXGraph's literal-color construction helpers have
`display="none"` and hidden visibility; they do not paint extra source points.

Each original render metadata file retains old scratch paths and is untouched.
The local `fig-190/render.bound.json` and `fig-191/render.bound.json` change only
`spec.path` and `output.svg.path` to the actual durable locations. Hashes,
assertions, PASS status and display measurements are preserved exactly.
Native `record_review.py` is invoked once per figure with the current spec and
this bound evidence. It validates the spec at rendered stage, checks the
render/schema/id/status/spec hash, actual source and output hash, and writes
the separate hash-bound `ld-s10y-image/review@1` record. No full tool/package
audit or path-migration mathematics review is required.

## Accounting and handoff

This fresh review loaded exactly six images: original 190, original 191, desktop
190, mobile 190, desktop 191, mobile 191. Batch 6/8; actual context 6/24. Zero
crops, reopens or failed image loads. No new rendering, paid calls, installation,
network, environment, App, DB, Git, canonical asset changes, chats or agents.

Historical author counts remain separate and unchanged: fig-190 two authored
spec versions, fig-191 three; two content-gate failures, one technical display
failure, one preparation-tool failure; author loads 6/8 and context 6/24.
The initial fig-190 receipt's old `contentFailure=false` classification is also
left intact; the author's final aggregate reports two content-gate failures.
Failure receipts/snapshots and existing successful evidence are referenced,
not replaced, repeated or laundered into a first-attempt PASS.

The manifest supplies actual necessary source/spec/evidence/output/display
bindings, native review results and independent/current vs historical counters.
Parent may use these two completed figure reviews with already approved N30
work. No unrelated source, answer, choice, other-figure or publication scope
is approved or reopened here.
