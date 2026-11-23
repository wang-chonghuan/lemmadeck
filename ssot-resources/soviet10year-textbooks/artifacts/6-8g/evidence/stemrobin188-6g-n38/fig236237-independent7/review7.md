# Independent comparison 7: fig-236 and fig-237

Status: **pass** for the two exact retained candidate snapshots bound in
`review7.json`. No candidate edits, canonical promotion, DB operation, or
publication occurred. This is substantive independent comparison, not a native
PASS adopted as semantic approval.

Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
The original immutable FIRST remains unchanged. Parent retention was authorized
before disclosure; its retained first-seal matches
`c3dbaaa63f3e8fb99cb905da41d2080c10d0ecc20da3e3ce20e861857a76c214`.
The author manifest matches
`38babda75706a7c32971e55eb754def7b4cf3ebca7505f5b0cac60acd3beec71`.
Only fig-236/237 candidate files and relevant receipts were evaluated.
No fig-238 figure/source/candidate was inspected.

## Findings

No affected geometric, incidence, arc, label-placement, display, or cultural
neutrality defect was found in either current candidate. All 21 sealed FIRST
requirements have a comparison entry in the JSON.

The figure-specific mathematical roles remain those sealed from the authorized
text: fig-236 illustrates one supplementary exterior angle at each vertex of a
convex polygon; fig-237 illustrates a nonconvex pentagon partitioned into three
triangles. No additional numerical givens or exercise answers are drawn.
The old approved prose/answer work was not re-solved or re-approved.

## fig-236

The positional mapping is upper-left/top/upper-right/lower-right/lower-left to
the candidate's five successive side junctions at (1.8,6.5), (6.7,8),
(8.75,6.65), (6.9,2.5), and (3.4,2.5), in mathematical y-up coordinates.
All five sides close the same simple convex pentagon. Literal geometry anchors
are not extra visible point markers.

The six FIRST continuation requirements map to `continuation1`,
`continuation2`, `continuation3`, `continuation4r`, `continuation5`, and
`continuation4l`, respectively. Their outward parameters relative to the
reversed incident side are approximately 0.22, 0.80, 0.36, 0.671429, 0.43,
and 0.542857. All are positive and collinear within floating-point tolerance.
The west tip, lower-left corner, lower-right corner, and east tip lie in that
order on the shared baseline. The west continuation is not mistaken for a
sixth selected exterior angle.

The five selected sectors map to `exterior1`, `exterior2`,
`exterior3a` plus `exterior3b`, `exterior4`, and `exterior5`.
All six curves are centered at their correct corner, connect the intended
side/continuation directions, and sweep through the exterior supplementary
wedge. The nested upper-right pair is preserved.

Independent inspection of actual SVG line coordinates found zero discrepancy
from transformed spec endpoints for all 11 straight segments. The six actual
SVG cubic paths match transformed spec arc endpoints within
2.28e-13 output pixels. Crucially, all 12 arc endpoints have positive segment
parameters strictly below one (range about 0.120989 to 0.620909) on the actual
visible side/continuation, so the assertions named `*-ray` are not accepted
merely because their `pointOnLine` checks pass. Each of the six paths has the
short intended exterior sweep; 12 interior path samples per arc lie outside
the polygon. Full/normal-width visual inspection agrees with that geometry.

FIRST requirement dispositions:

| FIRST requirement | Comparison |
| --- | --- |
| `f236-r-boundary` | Five solid sides and exact endpoint incidence preserved |
| `f236-r-simple-convex` | Five nonzero same-sign turns; simple convex boundary preserved |
| `f236-r-ext-southwest` | `continuation1`: correct vertex, reversed outgoing side and direction |
| `f236-r-ext-northwest` | `continuation2`: correct vertex, reversed outgoing side and direction |
| `f236-r-ext-northeast` | `continuation3`: correct vertex, reversed outgoing side and direction |
| `f236-r-ext-east` | `continuation4r`: correct lower-right east continuation |
| `f236-r-ext-southeast` | `continuation5`: correct lower-left southeast continuation |
| `f236-r-ext-west` | `continuation4l`: extra unmarked west continuation retained |
| `f236-r-baseline-order` | West tip/lower-left/lower-right/east tip order preserved |
| `f236-r-five-sectors` | Five correctly centered, incident exterior wedges; no sixth arc site |
| `f236-r-upper-right-double` | Two nested upper-right traces, one at each other site |
| `f236-r-unknown-marks` | No invented source glyph, equality code, arrow direction or numeric value |

## fig-237

The independent aliases map to candidate `a`/A = lower-left, `b`/B =
upper-left, `c`/C = top-right, `d`/D = inset, and `e`/E = lower-right.
These are accepted as declared modern positional labels, not a recovery of
original character identity and not names supplied by the fig-237 prose.
The candidate description expressly leaves original alphabet/code/fine-mark
identity UNKNOWN. The review does not convert its phrase "edition roles" into
a claim that the authoritative prose names these five vertices.

The actual geometry has five solid boundary segments and precisely the
upper-left/inset and lower-left/inset internal segments (`diagonal-bd`,
`diagonal-ad`). All seven actual SVG segment endpoints match the transformed
spec exactly. No original plotted dots were confirmed; `visible:false` hides
the five candidate markers while the five vertex labels remain visible.

Inset/d is the unique opposite-turn/reflex boundary vertex. The three regions
upper-left/top-right/inset, upper-left/inset/lower-left, and
lower-left/inset/lower-right remain connected, internally disjoint, and cover
the pentagon. Independent candidate-coordinate arithmetic gives signed triangle
areas -5.3075, -9.73 and -11.0125, totaling the polygon's -26.05. These are
review-only layout consistency values, not source measurements or exercise
answers. The displayed notch and the diagonal incidence preserve the three
triangle sectors at the reflex corner, the splits at upper-left/lower-left,
and the unsplit top-right/lower-right angles.

FIRST requirement dispositions:

| FIRST requirement | Comparison |
| --- | --- |
| `f237-r-boundary` | Five solid sides, correct closed nonconvex cycle |
| `f237-r-reflex` | Unique inset reflex vertex and right-hand excluded notch retained |
| `f237-r-upper-diagonal` | `diagonal-bd` terminates at existing upper-left/inset vertices |
| `f237-r-lower-diagonal` | `diagonal-ad` terminates at existing lower-left/inset vertices |
| `f237-r-partition` | Two diagonals share inset; three connected triangles tile the polygon |
| `f237-r-angle-partition` | Reflex interior is not replaced by the shorter exterior wedge |
| `f237-r-labels` | Five readable modern labels map to the five positional aliases |
| `f237-r-no-extras` | No extra vertex, ray, arc, dashed diagonal, measurement or detached triangle |
| `f237-r-unknown-marks` | Original glyph/fine-mark identities remain UNKNOWN; no inferred constraints |

## Retained failure and execution evidence

The original fig-237 render failure is retained, not replaced by the later
PASS. Its report SHA256 is
`e3a733974a221dca8a08b0ffb6b305782e9e2710b0e8f57665df3b0439efe41f`,
its spec SHA256 is
`ee48dfb137997c859e88400819fc9ba33425ccadb700e5b152f3deeb2464a315`,
and its SVG hash recorded in that report is
`fcf9afb081219fd1bb53fbb9bf0be0e976a5557b0effe4925994da0b0ab8342a`.
The failed renderer execution has exit 2 and reports `d-label`, position NE,
collision score 10000.

The complete structural spec comparison found exactly one changed field:
`/objects/3/labelPlacement/gap`, 15 -> 36. Source metadata, vertex coordinates,
geometry, assertions, label identity and font size are unchanged. The current
successful fig-237 renderer receipt has exit 0 and binds the current spec/SVG
hashes; its report has no collisions. The D-label is at SVG (448.8,152.8),
NE of inset at (412.8,188.8), and is clear of the top-right/inset side and
other labels in all sheet panels.

The fig-236 current renderer receipt has exit 0 and binds its current spec/SVG.
Both retained render reports are exactly their native reports with only
`spec.path` and `output.svg.path` normalized to eventual edition paths.
Those paths are metadata, not proof of canonical promotion. Relevant saved
stdout/stderr streams were hash-checked; nothing was rerun.
The early fig-237 standalone validator receipt is not falsely described as
post-revision validation; the final current-spec renderer report/execution and
independent comparison supply the current evidence.

## Complete display and neutrality

Each existing complete-preview sheet was opened once, without cropping or
reopening. The full 640-pixel panels and inline 294, 310, 346, and 358-pixel
panels were inspected. Neither raster sheet is blank, black, truncated, or
missing geometry. All continuations/arcs and all five fig-237 labels are
visible; there are no unintended overlaps or clipped endpoints/letters.

Actual SVG sizes/viewBoxes are 640 x 640 for fig-236 and 640 x 480 for fig-237.
Both specs declare instructional inline layout, maximum width 640, and the
same five display widths. Fig-236 has no text labels, so its reported
`measuredMinPx:null` is appropriate, not missing letter-size evidence.
Fig-237's actual SVG uses 38-pixel text; at width 294 it becomes 17.45625 px,
matching the current report and exceeding 16 px. Larger widths also pass.
No new headed-product page or lesson render was opened; this review uses the
authorized current offline display contract and supplied complete sheets.

Visible SVG strokes/text use `--ld-figure-ink` and the paper background uses
`--ld-figure-paper`. Literal colors on hidden JSXGraph construction helpers do
not create visible color or point additions. No Chinese/Cyrillic prose,
historical/cultural decorations, scan texture, numeric answer annotations,
arrow-direction guesses, or equality claims appear in the actual visible SVGs.
Sheet titles and width captions are evidence framing, not candidate content.

Original UNKNOWNs remain unchanged: all five original fig-237 glyph
alphabets/codes; fig-236 dark arc patches and double-arc code; both figures'
fine flecks and fig-237's lower-diagonal mark. Clean candidates do not reproduce
the unidentified blotches as purported mathematical glyphs. Acceptance here
neither identifies them as mere scan artifacts nor approves an interpretation
derived from them. Known positions, segments, sectors and arc multiplicity are
preserved; any later claim about an unknown code still needs authority.

## Actual counters and stop

- Inherited original loads: 2, one per original; originals were not reopened.
- New loads: 2, one per current complete-preview sheet.
- Cumulative batch/context loads: 4/8 and 4/24; no reset.
- Crops, image reopens, native PNG opens, whole-page loads, new screenshots,
  affected-repair image loads, shared/native reruns, paid calls, network calls,
  candidate edits and promotion: 0.
- Independent in-memory geometry calculations: 1 new, 2 cumulative.
- Author's fig-237 revision: 1 retained; reviewer revisions: 0.
- New authoritative-template parses/prose-review/answer-solving: 0.
- Other prohibited operations from the original authorization: 0.

Both review files are sealed 0444. Remaining image slots are reserved for a
real affected repair, not used for routine reassurance. Stop after handoff;
no further candidate changes, review loads, or promotion are authorized here.
