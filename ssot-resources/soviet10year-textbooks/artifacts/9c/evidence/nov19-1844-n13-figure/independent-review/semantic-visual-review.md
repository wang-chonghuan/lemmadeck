# Independent StageB Figure Review

Verdict: PASS for this figure candidate and the exact intended metadata only.
No whole-lesson PASS, promotion, canonical review recording or publication.
This review uses the same reviewer and immutable independent FIRST from StageA,
not the author's inventory as the definition of what the source must contain.
The author's disclosed inventory was read only after that independent freeze.

## Evidence And Image Ledger

StageA retained FIRST SHA-256:
`1cbe6768ce2678f1ab8285e65d3c3b1a2bbdacae1e1cf3e5ccfc9bf9b466f638`.
The source and both current templates still match its original input bindings.
The current figure paragraph matches the candidate authoritativeText exactly.
The complete 14-prose-entry context and exercise text were read in StageA and
remain hash-bound; no old StageA check or source view was replayed in StageB.

One fail-capable targeted command ran once. Its receipt preserves actual stdout,
actual stderr, argv and exit code 0. The independent check evaluated every one
of the 65 existing assertions, verified semantic group coverage and actual SVG
geometry, and made one isolated headless visual projection of the unchanged SVG.
It did not call render_spec, validate_spec, record_review or a prior PASS stage.
Its mechanical result correctly remains "pending-two-visual-views": this separate
review records the subsequent observed visual outcome rather than editing that
immutable command evidence.

Images loaded in this same context:

1. StageA original source: once, cumulative 1.
2. StageB existing natural raster, 360x424: once, cumulative 2.
3. StageB full-canvas 331x390 projection at DPR1: once, cumulative 3.

Maximum 4, remaining 1, no reset, source reopen, crop or 350px raster view.
The 331px projection is not computed-only evidence: I inspected its actual
pixels once. It preserves the whole canvas, including right and bottom margins.
The rasterization used a fresh isolated headless Chromium with all network
requests aborted, no user window or headed browser. Browser temporary files
were created and removed only inside this new review directory. Browser closed.

## Division Header

PASS. The natural raster and actual 331px projection both show divisor `55`
left of the bracket, dividend `12` inside/right of it, and quotient `0.218`
above the roof. All seven header labels and the two dividend labels are visible
and distinct. There is no added dividend zero, decimal point after `12`,
quotient ellipsis, repetition overbar, parentheses, equals sign or answer text.

The source's single curved hook maps to two connected candidate segments:
vertical (80,368) to (80,335), then down-left to (66,322) in user coordinates.
The roof starts at (80,368), runs right to (308,368), and is above the dividend
and below the quotient. Angular hook corners are explicitly declared layout
regularization, not a false claim that the original was angular. Its divisor/
dividend separation and down-left foot remain visually faithful.

All 10 header assertions were evaluated, not merely counted: one divisor
baseline relation, two decimal-position relations, two successive quotient-digit
relations, three fixed roof/hook endpoint relations, one quotient-to-roof
clearance and one divisor-to-bracket clearance. Literal anchors used in clearance
assertions are tied to the fixed roof/bracket through their endpoint assertions.
Every mapped header point has a relationship wholly inside its inventory group.

## Every Digit Row And Column

PASS. The targeted check maps each FIRST glyph ID to its actual labeled point
object and then to the actual SVG text element; all 24 digits and the single
decimal point match. No additional visible text or point markers were found.

| Printed Number | FIRST Columns | Candidate X Positions |
| --- | --- | --- |
| Divisor 55 | D0,D1 | 24,48 |
| Quotient 0.218 | C1,dot,C2,C3,C4 | 144,164,190,236,282 |
| Dividend 12 | C0,C1 | 98,144 |
| 110 | C0,C1,C2 | 98,144,190 |
| 100 | C1,C2,C3 | 144,190,236 |
| Lower 55 | C2,C3 | 190,236 |
| 450 | C2,C3,C4 | 190,236,282 |
| 440 | C2,C3,C4 | 190,236,282 |
| Final 10 | C3,C4 | 236,282 |

These are shared columns in one common frame. The six working rows remain
`110`, `100`, `55`, `450`, `440`, `10`, in that order, with progressive starts
and ends; they were not centered or right-aligned independently. Quotient `0`,
`2`, `1`, `8` remain aligned to C1,C2,C3,C4 respectively. Row centers are
regularized to 50-unit spacing; that choice is declared as modern layout,
not a newly inferred source metric or arithmetic step.

All 29 digit-column assertions were evaluated: 11 adjacent-digit row/baseline
relations, 13 same-column cross-row alignments, four quotient-to-column
alignments and one dividend-to-bracket relation. Every mapped point, including
each quotient point, participates in a mapped relationship within this group.
Actual SVG label anchors agree with spec coordinates after the y-axis transform.
Both pixel views make the stepped alignments and different row lengths evident.

## Subtraction Bars And Boundaries

PASS. Exactly three solid bars remain: under `110`/above `100`, under lower
`55`/above `450`, under `440`/above final `10`. No minus sign was inserted.
The first runs x=80..310; the latter two run x=172..334. The latter two start
farther right than the first and extend farther right than both first bar and
roof. The last two share regularized extents, consistent with the approximate
shared source extents. This is not an invented exact equality of source pixels.

All 15 bar assertions were evaluated: three fixed endpoints, six neighboring
row clearances, three horizontal extents, two shared-extent relations and one
left inset. Literal extent endpoints are connected to the actual bar objects
by the corresponding fixed endpoint assertions. Thus arithmetic on unrelated
free anchors is not being substituted for the visible rules.

All nine rendered line geometries were checked against their actual spec
coordinates; the extra line relative to the eight FIRST stroke groups is the
explicitly split curved hook, not an extra subtraction bar. Both arrowhead
groups were also checked separately. Every stroke footprint, head footprint
and text box stays inside the full projected canvas. At actual 331px width,
rightmost stroked extent is x=308.2435 with 22.7565px right clearance. Lowest
text-box bottom is y=362.8990 with 26.9447px bottom clearance. The natural
360px view independently shows the complete right bar ends and final `10`.
The screenshot's 390px integer height includes, rather than crops, the
389.84375px CSS canvas height.

## Arrowheads, Direction And Endpoints

PASS. The upper head visibly points RIGHT into the space before leading `1`
of `100`; the lower head visibly points RIGHT into the space before leading
`1` of final `10`. Both filled triangular heads are present at natural and
331px widths. The left track is an unheaded vertical segment, not a directed
upward arrow. No candidate arrow has tail at final `10` and head at `100`.

Actual SVG head polygons, not just shafts or metadata, were inspected. Each
triangle is `M 0,0 L 10,5 L 0,10 z` transformed at the corresponding shaft end.
Its tip is right of both base vertices and aligned to the intended row.
The upper actual tip is (119.9250,182), before target center (144,182) in screen
user coordinates. Lower actual tip is (211.9250,382), before target center
(236,382). Both rendered heads have about 14.9715px gap to the target glyph
at 331px width. Their 0.075-unit shortfall from spec endpoints is marker
subpixel fitting, not reversed direction or a changed semantic destination.

The upper source branch maps to recurrence-upper; lower maps to
recurrence-lower. The latter's longer reach preserves the shift from C1
to C3. The shared left spine runs above the upper shaft down to the lower
shaft. Original small junction gaps are explicitly regularized into connected
corners; no annotation claims the source gaps never existed.

All 11 recurrence assertions were evaluated: three fixed segment/arrow
endpoints, one relation between the two target points, two positive horizontal
directions, two target clearances, one unheaded track direction and two finite
track-incidence relations. Their literal anchors are tied to actual objects
by endpoint assertions, while the target relations name the correct leading
digits. Both target points have wholly in-group mapped relationships. No
vertical arrowhead, extra return label, multiplication-by-10 label or closed
directed loop was added.

## Mathematics, Culture And Legibility

PASS. The internal arithmetic check of the written example gives quotient
digits 2,1,8, subtraction products 110,55,440 and repeated remainder 10.
These are mathematical review evidence only, not additional labels in the
candidate. The source still displays upper `100`, not an extra standalone
`10`, and no isolated `45` or `120` row was inserted. Repetition notation
`0.2(18)` remains in the authoritative prose only. The diagram is a deliberately
partial worked division, not a question-answer completion for exercise 115.

Visible content is limited to the 24 source digits, one decimal point, division
structure and recurrence strokes. No Cyrillic/Chinese text, decorative symbols,
archival texture, flag, cultural label or extra answer-bearing annotation is
visible. Ink and accent use semantic CSS variables with a dark neutral fallback;
white background and both arrowheads are visibly distinct. Hidden JSXGraph
construction ellipses and unused hidden paths do not become visible objects.

Both observed pixel views are nonblank, legible and complete. At actual 331px
width the minimum screen-transformed text size is 25.7444px, above the 16px
minimum; all 25 label boxes are separate and inside the canvas. Glyph shape,
decimal dot, zeros, fours, fives and eights remain recognizable. No crowded
digit row, lost arrowhead, black raster, overlay collision or clipped boundary
was seen. This proves the declared smallest media projection, not an unvisited
running application's layout or whole-lesson rendering.

## Intended Metadata

PASS for the exact intended render-report bytes with SHA-256:
`4f86e54934c46a9d8970f773a3d9faaa4ed64a9f539a92a7d47bc9e860b77d45`.

Structured comparison finds exactly two differences from the original report:
`spec.path` and `output.svg.path`. Both point to the future durable modern
edition figure directory. Every other value is unchanged, including the actual
candidate spec SHA-256
`e8c2194c7e14adb1c855d8a770694ea4dfd039d11cdb77a05a7c5464884cbbfb`
and SVG SHA-256
`28b8d7a561d96aa9f597794db7925ecd311e2497d7b99cfd2ca452b753d691ff`.
Both hashes were checked against actual candidate bytes. Original report hash
is `fff8d551db6ba6cdbda1ed4241788ea06c942636dc094c606f667a002177c09b`;
receipt hashes and paths match both actual reports. This approval does not
assert those future destinations exist or authorize promotion.

## Retained Limits And Stop

No genuine figure defect or missing required proof was found in this bounded
StageB review. The StageA UNKNOWN origin/intention of the tiny upper-right
source speck remains UNKNOWN; its absence from this mathematical redraw is not
silently recast as proof of its historical purpose. Exact original scan metrics
remain unmeasured; candidate regularization is declared separately.

The earlier author-context hash mismatch described in the disclosed handoff
is not erased or overwritten. This verdict binds the independently read current
templates and unchanged relevant paragraph; it does not rewrite prior failures.
No other worker's FIRST, FAIL, UNKNOWN or evidence file was changed.

All candidate files and StageA files were untouched. No official renderer or
validator rerun, source crop/reopen, promotion, record_review, canonical write,
backend, Git/history, DB, publisher, paid call, worker creation or worker message.
New evidence files are frozen mode 0444. Stop at parent intake with cumulative
image usage 3/4 and no whole-lesson approval.
