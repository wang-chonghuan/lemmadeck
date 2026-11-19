# FIRST Independent FIG220/221 Assessment

Ticket STEMROBIN-181, D036, n95. Overall **HOLD**. FIG220 **PASS**; FIG221
**HOLD** for F221-01. This is figure review only, not card completion, promotion,
publication, lesson finalization, or full-app acceptance.

## Independence And Inputs

The only cwd was `/Users/yong/.codex/worktrees/00b1/lemmadeck`. Both original
PNGs were opened first, in order 220 then 221, with a complete independent
inventory derived after each open. `source-inventory.json` was frozen at
SHA-256 `0397e86a856a2ea4412024b41f4ac10f379ce89976e10ad50a245033cf4efb26`
before any downstream prose, prepared requirements, candidate, FigureSpec,
author report, or author inventory was read. It has not been revised to match
the author's objects.

The full approved Chinese and English templates were read, including all n95
prose, references, retained raw source, and section boundaries. Prepared raw
lesson/exercises and source requirements were also read. The d1146 text FIRST
independent PASS report matches supplied SHA-256
`670e7544cf537e30f8b409f292fad04d732f2b15c3b089d95835cbaeb6e3e31b`.
Both current FigureSpecs contain exactly the complete approved bilingual
authoritative text, not a shortened clock-experiment excerpt.

Only then was d1147's author report read. It matches supplied SHA-256
`e4957dde4a769521cbd44880095f5d8260d84592f8c715f2c4feaa15be3227a3`.
Its own PASS reviews are author self-reviews, not independent approvals.
The independent binding audit verified 70 unique source, input, spec, render,
SVG, preview, failure, repair, script, receipt, author-review, CSS/component
and screenshot records against current SHA-256 and recorded byte counts.
Bindings are current; this does not make FIG221 scientifically approved.

## F221-01: Inconsistent Frame-Relative Transverse Position

Affected candidate: d1147 `fig221.spec.json`, SHA-256
`3feab978682f0b8a6ea1013298404c06665aad922829b18d536b5efba029ed4f`.
Affected output: `fig221.repaired.svg`, SHA-256
`20306460a3a207d5cdf019791e9c67fedd2d16fd66475472eada9803e923e2bd`.
The discrepancy is also visible in the repaired preview and product-640
screenshot. No additional image was needed.

Exact JSON pointers and stable object IDs:

| Pointer | ID | Coordinate |
| --- | --- | --- |
| `/objects/6/at` | `221-a-origin` | `[100,520]` |
| `/objects/7/at` | `221-a-C` | `[330,520]` |
| `/objects/1/at` | `221-a-B` | `[170,610]` |
| `/objects/3/at` | `221-a-A` | `[490,610]` |
| `/objects/5/at` | `221-a-flash` | `[330,610]` |
| `/objects/30/at` | `221-b-O` | `[100,180]` |
| `/objects/31/at` | `221-b-O1` | `[140,180]` |
| `/objects/32/at` | `221-b-C` | `[330,180]` |
| `/objects/19/at` | `221-b-B` | `[210,260]` |
| `/objects/21/at` | `221-b-A` | `[530,260]` |
| `/objects/23/at` | `221-b-emission` | `[330,260]` |

Subtract each panel's ground origin to remove the arbitrary stacked-panel
placement. Panel a then has B `[70,90]`, emission `[230,90]`, A `[390,90]`.
Panel b has B `[110,80]`, emission `[230,80]`, A `[430,80]`.
The clocks move right by 40 layout units but also move down by 10 relative
to K. The purported fixed emission location also moves down by 10.
No absolute physical magnitude is inferred from these layout units; the
defect is the changed relationship in the deterministic frame.

The approved experiment has straight-line relative motion along X, and the
flash's emission position must remain fixed in K after emission. A marker
that changes transverse position relative to its own ground axes contradicts
that claim. This is not a requirement to replicate the hand-drawn hull,
fin angles, clock hands, or photographed pixel distances.

The native assertions allow this mismatch. `221-a-C-aligned` fixes height 90,
while `221-b-C-aligned` fixes height 80. The three cross-panel displacement
assertions `221-panels-emission-fixed-x`, `221-panels-rear-moves-right`,
and `221-panels-front-moves-right` use a -350 y translation, while ground
O and C use a -340 translation. `221-panels-origin-to-rear` only compares
horizontal projection distances. The existing native PASS therefore proves
the submitted assertions, not the missing transverse-position requirement.

The new executable diagnostic in `evidence-audit.mjs` subtracts the actual
ground origin of each panel and checks fixed emission and horizontal-only
clock motion. All three checks return HOLD with delta -10 in
`evidence-audit.json#/findings/0/transverseChecks`. This is an affected
relationship check, not a replay of the passed native assertion list.

Closure requires an authorized FIG221-only candidate change that preserves
one common panel-to-panel frame translation and unchanged frame-relative
transverse coordinates for both clocks and the fixed emission mark. Add
executable coverage tying the ground origins/C axes to the emission and
clock translation; independent axis-alignment assertions with conflicting
heights are insufficient. Preserve the original failure and single label
repair evidence. Obtain fresh affected native/hash-bound output and an
independent affected-only check; unchanged FIG220 needs no replay.
This review neither makes that edit nor authorizes a further ordinary repair
or any paid, browser, producer, publication, or promotion action.

## FIG220: PASS

One K1 rest-frame diagram, exactly two clock locations B (rear/left) and
A (front/right), central flash, C axis station below the flash, and right/up/
down-left X1/Y1/Z1 directions are preserved. O1 remains at the rear, left of
B, and is not conflated with C or the flash. The entire apparatus is above
and parallel to the X1 axis.

`220-midpoint` and `220-ends-collinear` cover B/source/A.
`220-light-left-connects` and `220-light-right-connects` cover both outward
light arrows. `220-axis-alignment`, `220-baseline`,
`220-apparatus-parallel-X1`, `220-xy-perpendicular`, the three axis
`connects` assertions and the C-guide `connects` assertion cover the
frame relationships. No instructional lattice exists in either original;
grid-dimension assertions are not applicable.

Circles without dial readings are acceptable clock-location regularization
in this particular prose-supported experiment, not new measured clocks.
The hull/fins are acknowledged historical pictorial context and omitted;
the diagram does not need spacecraft recognition, structural measurement
or a generated vehicle asset. The rest-frame title makes apparatus context
explicit. There is no claim about displayed times, equal ticking rates,
or malfunction. The earlier hypothetical 0:45 text example has not been
imported into this real light-synchronization figure.

The source's burst is regularized as a plus marker. Wave strokes become
deterministic outward arrows; c labels, the speed statement and the dashed
C projection guide are disclosed text-bound additions. Equality is from
approved midpoint/c prose, not measurement of the historical art.
The source K1 label is represented by the explicit rest-frame title.
All meaningful source requirements have been covered; no numerical physical
givens, historical symbols, cultural wording or hidden answer data were added.

The current native renderer records 22 objects, 12 labels, no collisions,
and 20 px minimum text at the actual 640 px media width. The full repaired
preview and 640 px saved product view were inspected. The one existing
O1/C label-clearance repair is exactly the declared repair; source data,
geometry, text, assertions and object count did not change.
A separate native `ld-s10y-image/review@1` PASS is recorded only for FIG220,
against current files and these independent observations.

## FIG221: Other Findings

Exactly two a/b events and all endpoint clock identities remain, with a
coincident K/K1 frame at emission and displaced O1/Y1/Z1 later. Both X
directions remain rightwards on the shared horizontal baseline. Restoring
the unclear B label in panel a is justified by approved clock identity
and the original panel b, not an invented third clock.

The modern b plus explicitly represents the old emission location, not a
source physically remaining at its old midpoint. The original has a burst
at the moving apparatus's center; replacing that ambiguous historical
symbol with an explicitly labelled emission-location marker is a declared
clarification supported by the approved prose. The actual continuing
source is not drawn; it is not required to stay there.
C is interpreted as the longitudinal axis station, projected up to the
flash by a guide, not the origin or a claim that its baseline point is the
same full three-dimensional event position.

Two added light-front markers are equally far from the emission x position,
with outward c arrows. The rear gap is smaller than the front gap. The
selected later picture is explicitly disclosed as pre-reception in the
inventory/routing; no exact historical wave-front time can be read from
the unnumbered wavy strokes, and no numerical arrival time is asserted.
It neither assigns inertial light speeds c+v/c-v nor suggests faulty clocks.
The later movement/frame mismatch F221-01 remains despite these correct
longitudinal relationships.

Independent inventory mapping:

| Frozen source group | Current realization / disposition |
| --- | --- |
| `220-frame`, `220-emission` | K1 title, O1/X1/Y1/Z1, C, C guide; baseline/alignment/axis assertions |
| `220-body`, `220-clocks` | Two equal circle clock locations B/A, apparatus-parallel-X1; hull/fins/dials explicitly omitted |
| `220-light` | Two outgoing arrows with connects and midpoint assertions; c annotations are approved-text additions |
| `221-panels`, `221-a-frames` | Stacked a/b titles, a paired K/K1, origins and all paired axes |
| `221-a-body`, `221-a-points`, `221-a-light` | B/A circles, central emission plus, C guide; no initial traversing light |
| `221-b-frames`, `221-b-velocity` | Distinct O/O1, Y/Y1, Z/Z1, X/X1 and rightward v arrow |
| `221-b-body-points`, `221-b-clocks` | Both clocks move right, equal separation; source marker reinterpreted as old emission location; F221-01 holds transverse relationship |
| `221-b-light` | Equal-distance added light fronts, outward arrows and smaller rear gap; precise original dial/wave timings are not numerical givens |
| Both absence groups | No added physical numbers, scales, measured hull features, dial times or cultural artwork |

All mapped IDs and native assertion IDs are listed in the current specs
and bound audit. Their existence and native PASS do not cure F221-01.

## Display And Evidence Limits

All seven expected images were opened exactly once: original 220, original
221, both repaired previews, product-640, product-320, product-280.
No crop, reopen, extra image, browser or renderer was used. Images/context
7/24, batch 7/8; the parent receives text and paths/hashes only.

Both figures correctly declare instructional scroll layout with fixed
640 px media. The saved product-check records actual containers 640/320/280,
20 px minimum final text, complete 12/29 label sets, no overlaps,
text within canvas, no replacement glyphs/cultural labels/c+v claims, no
page errors/network, and scroll ends 0/320/360 for both figures.
The fixture script was read to verify these are executable DOM and
screen-transform assertions, not nominal viewport assumptions.

The saved mobile screenshots show the readable start windows; truncation
at their right edge is expected scroll clipping, not lost SVG content.
Their paired end-view region is blank because it lies outside the capture
viewport. It is not independently visually approved. Reachability is
supported by the saved actual scrollLeft/max measurements; the complete
SVG is inspected at identical 640 px media scale in the desktop screenshot.
No missing mobile-end visual payload is fabricated.

Neutral/accent/print label-color records are existing command evidence, not
new visual inspections. The SVGs use semantic CSS variables. There is no
hybrid artwork layer to inspect. These figure-only headless fixture results
are not headed application acceptance or a finalized lesson render.

## Actions

Only independent-review artifacts in d1160 were written. No candidates,
code, skills, app, dependencies, charter, existing author evidence, Git,
progress, consumption, database, publisher or deployment were changed.
No paid calls, network calls, browser sessions, servers, new chats,
worktrees or workers were started. Native review recording uses Python
`-B` to prevent any outside-owner bytecode write. No standalone native
spec validation or passed rendering/production stage is replayed.
