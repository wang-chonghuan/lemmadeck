# Independent figure 79 semantic review

Date: 2026-11-23. Ticket: STEMROBIN-180. Book: 8p.
Lesson: phy8-c2-s1-n25.
Exact workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Sole source-first independent figure reviewer.

## Verdict

**REVISE: one necessary source-apparatus completeness correction.**
The technical rotation-head recovery and supplied mechanical/display results
are not disputed. They do not establish source fidelity: the final candidate
omits a source connection already recorded in this reviewer's original-only
freeze.

No PASS formal review was recorded, and `record_review.py` was not executed.
The user's PASS-recording condition is not met. No promotion, manifest change,
edition finalization or publication is authorized by this result.
The completed WHOLETEXT/SCIENCE PASS is reused unchanged.

## F79-SR-01: Missing upper connection between body groups

Status: **REVISE, P2**.
Independent source object: **`src79-upper-connection`**.
Independent requirement: **`R79-upper-connection`**.
Affected candidate scope: **`fig-79.spec.json#/source/inventory`** and
**`fig-79.spec.json#/objects`**, plus the resulting `fig-79.svg`.

Before any author inventory/spec/report was opened, the frozen independent
inventory recorded a thin approximately horizontal stroke above the two body
groups, with short bent/raised terminal strokes connecting into their upper
regions. This is distinct from the thick carrier through the cylinders.
The source-only freeze also separately recorded the upper connection's right
terminal as distinct from the lower r1 witness.

The complete desktop-neutral screenshot shows no such upper connection:
only the material labels occupy the space above the bodies. The accent and
print screenshots confirm the same omission; it is not a theme-contrast issue
or off-screen clipping. There is no mapped upper-connection group or object
in the author's source inventory/spec. The shared thick horizontal carrier
does not substitute for this separate source relationship.

The precise connector material and small terminal hardware were, and remain,
uncertain. The **presence and topology of the connecting stroke** were positive
source observations, not an uncertainty. Simplifying unknown hardware is
allowed; deleting the observed connection is not the same regularization.
The accepted prose at p0118#6 + p0119#1 discusses the steel cylinder interacting
with the joined aluminum assembly. Preserving the source's separate connection
keeps that apparatus relationship available to the learner without inventing
a force vector or quantitative annotation.

Required author action: restore a clear, source-faithful upper connection
between the body groups, with simple terminal attachments as needed. Map it
in source inventory and executable connection/endpoint assertions. Keep its
apparatus identity distinct from the carrier, radius dimensions and rotation
arrow. Declare regularized hardware/attachment geometry as regularization,
not exact recovered source measurements. No new numeric value, solution
annotation, material claim or paid artwork is required.

Only this missing connection and any actually affected layout need repair
and follow-up review. No source reopening, wholesale scene replacement,
new text review or replay of unrelated passed checks is needed.

## Other Independent Requirements

| Frozen requirement | Result and final-candidate comparison |
| --- | --- |
| `R79-body-count-and-material` | PASS: one dark steel cylinder left; two light aluminum sections right; English material labels map to the correct groups. |
| `R79-joined-pair` | PASS: the right sections touch end to end, have a visible seam, share the carrier and are regularized to matching contours. |
| `R79-shared-apparatus-frame` | PASS: a single carrier and descending shaft connect the left/right arrangement; no unrelated panels or invented graph axes. |
| `R79-left-radius-endpoints` | PASS: r2 runs from the steel midplane witness to the shared shaft reference, with the correct subscript and terminals. |
| `R79-right-radius-endpoints` | PASS: r1 runs from the shared shaft to the aluminum pair's join/midplane witness, not to its near edge or far rod end. |
| `R79-radius-order` | PASS: the right span is longer. Its coordinates are schematic layout, not a printed radius ratio; no measured value was added. |
| `R79-upper-connection` | REVISE: omitted from the candidate and its source/object mappings, as detailed above. |
| `R79-rotation-cue` | PASS: a visible curved rotation cue encircles the lower shaft and joins the arrowhead; the shaft continues below it. The exact source rotation sense remains uncertain, so the chosen clear direction is regularization, not a newly proven source fact. |

Cylinder perspective, line weights, monochrome semantic fills, English label
translation, identical aluminum contours and readable dimension terminals
are acceptable regularization. The figure is the centrifuge experiment,
not the kilogram prototype. Only Steel, Aluminum, r2 and r1 appear inside
the apparatus SVG; no mass, speed, acceleration, force, ratio, solution,
answer/choice key or cultural source lettering is added.

The precise final invisible `rotation-tip` is **[226.2, 72.4]** and the tail
is **[222, 57]**, matching the actual spec/binding rather than the rounded
handoff example. This recovery is not the cause of the semantic REVISE.

## Full Output And Display Inspection

All five supplied final screenshots were opened once by this reviewer:

- Desktop neutral: inspected the entire 640 x 400 output, including the right
  rod end, complete joined pair, lower arrow and shaft end. These fit visibly.
- Desktop accent: the same full geometry and labels remain legible; its hash
  equals neutral because this figure uses the unchanged ink/muted/paper roles.
- Desktop print: full apparatus, seam, dimensions and lower shaft are legible.
- Mobile left: steel, r2, shaft and lower rotation cue are visible at normal
  media scale; expected clipping at the scroll-window edge is not canvas loss.
- Mobile right: both aluminum sections, r1, its outer witness and the far rod
  end are reachable and visible at the recorded maximum scroll.

The author reports 640 px media, 18 px label text, no canvas clipping/collision,
and mobile scroll 282/282 at the right end. These mechanical observations are
reused, not re-executed. The visual inspection agrees for the present objects;
it does not approve the absent upper connection.

Evidence is an isolated headless fixture using app display/token/print CSS,
not a headed app or DB session. No new browser or fixture was launched here.
No deployed/integrated lesson approval is claimed.

## Bindings And Rejected-Candidate Preservation

Bindings were checked once for the current source, spec, SVG, render, display
report, five screenshots and accepted canonical text. The spec's authoritative
text matches the accepted canonical lesson; its SHA-256 remains
`713def5d7da63a4154e6b900b383c815c345a3bb67027a360c7303ae20d504f4`.
No whole-text/science review was replayed.

Current rejected spec SHA-256:
`682dddbc3fec214251f843e5ac306aecc0b205f5f129f443487c512301e8ebf8`.

Current rejected SVG SHA-256:
`e9b58b591645cee54c03b6ead14a74c1557b1aefa9729b6c51ee2a15acbab7eb`.

The unchanged independent source freeze SHA-256 remains
`e321ecc659329d8a9190abfa16954d0c39bcc91e7910bb177478f3bccdf838e3`.
Its source PNG SHA-256 remains
`6d35760a3497a0c692b9223fc0f217a359d5b5efcb53b23d6dcea0acd90d2e9e`.

The exact rejected spec, SVG and render report are retained once in
**`first-semantic-failure/`**, read-only, with unchanged bytes. This is a
small failed-candidate snapshot, not a duplicate full evidence package.
No snapshot copy was opened as an image. The supplied screenshots and author
failure/recovery files remain at their existing durable paths, untouched.
**`fig-79.semantic-review-bindings.json`** binds this report, the rejected
candidate/snapshot, independent freeze, accepted text and inspected display.

## Counts And Limits

**Reviewer cumulative actual images: 6/8**:
one original PNG in the preceding source-only phase plus five final screenshots
in this phase. Source reopens: 0; screenshot reopens: 0; crops/new fixtures: 0.
**Remaining reviewer batch images: 2.** The author's separately reported
cumulative 6/8 is retained as author usage, not counted as images received
or loaded into this reviewer's context.

Paid calls: 0. Author validator/render/display checks rerun by reviewer: 0.
Review recorder calls: 0. Browser/headed/app/DB/Git/install: 0.
No new agent/chat, peer message, answer/choice key or solving note was read.

Only this report, its binding and the three-file rejected-candidate snapshot
were written, all within `figure-review/`. The source-only freeze, original
text reviews, author files and other dirty/staged/installer/source/failure
files are unchanged. This original semantic failure must survive later
affected repair; the passed unchanged findings can be reused.
