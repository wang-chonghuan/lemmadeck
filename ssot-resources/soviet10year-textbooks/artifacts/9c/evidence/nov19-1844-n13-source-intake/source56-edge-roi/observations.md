# Source56 S02 Local Edge ROI

Recorded after the single ROI view, by 2026-11-19T16:57:34Z.
Scope: S02 local nontext ownership only, under existing STEMROBIN-184B authorization.

## Ordering And Image Budget

The authorized source-coordinate rectangle [0,795,100,115] was recorded in
roi-request.json at 2026-11-19T16:54:03Z, before crop generation and visual opening.
The native-size crop was generated once, with exit0, between
2026-11-19T16:55:56.167Z and 2026-11-19T16:55:56.281Z. That completed call was
reused after context compaction; it was not repeated.

functions.view_image then opened source56-edge.png exactly once. The exact tool
timestamp is UNKNOWN; it occurred after crop completion and before the UTC
terminal reading 2026-11-19T16:57:34Z. This is cumulative image2/4, including
StageA's original-page image1. No original, grid, alternate crop, enlargement,
overlay, rerender or other page was opened. Compaction does not reset usage.
The crop receipt and stdout retain their truthful pre-view count of1/4; the
separate images-ledger.json records the later view without changing those files.

## Visual Observation

The ROI contains a dense, solid, irregular dark patch attached to its left
boundary. Its top edge is ragged with small projections/specks; the main right
edge is curved and uneven, and the lower edge is uneven and rounded. These
pixels do not display a legible letter, numeral, punctuation group, or an
organized text/diagram stroke sequence. No source text is visible within this
ROI. A continuous white strip occupies its right side, with blank space also
above and below the patch.

This is positive evidence for local nontext ownership of the pictured patch,
not an attribution of its physical or historical cause. It does not establish
whether any text elsewhere on the page was obscured.

## Frozen Correspondence And Geometry

StageA S02 is [0,810,58,88], described independently as a larger irregular black
patch at the left scan edge, outside observed body text. The new patch's
location, left-edge attachment and outline agree with that frozen observation.
StageA's printed-row boxes do not intersect the proposed local box. The
retained native figure box [668,745,358,400] is far to its right and also does
not intersect it. This combines frozen context with the new ROI's visible
blank space; no intervening area outside the ROI was newly viewed.

The already retained crop stdout reports a threshold128 ink envelope
[0,22,49,77] in ROI coordinates, hence [0,817,49,77] in source coordinates,
with2530 ink pixels. It also reports51 full columns at gray>=245 on the right,
corresponding to source x49..99 within this ROI. These are computational
measurements from the completed crop call, not a claim of exact visual
boundary tracing or threshold-independent physical extent.

The proposed box is strictly inside frozen S02 and the authorized ROI. Its
half-open source extent is x[0,49), y[817,894). It contains the previously
measured dominant N08 component [16,821,31,62]. This supports the existing
technical hypothesis linking the unmatched y821..882 band to S02. No counting
API or private postfilter was rerun or instrumented here.

## Proposal Only

Local nontext ownership: SUPPORTED, high confidence within this ROI.
Minimal proposed count-only kind: scan-artifact.
Proposed source XYWH: [0,817,49,77].

Reason: the single authorized new ROI shows an irregular nontext patch attached
to the left scan edge, separated locally by a continuous blank strip; the
threshold128 envelope is wholly inside independently frozen S02 and outside
frozen source text/figure boxes.

This is a parent-intake proposal, not a canonical count_exclusions entry or
authorization to run a dependent stage. It neither changes source pixels nor
asserts that a future count would pass. No expected line count is used to choose
the box. Do not expand it to the ROI, S02's whole rough box, S06, or any interior
specks.

## Unchanged Unknowns And Stop

The six pixels in [348,822,2,3] and one pixel in [245,829,1,1] remain UNKNOWN
in origin. Both are outside the ROI and proposed box, and must remain unmasked
by this proposal. They were not viewed.

U01, source57, theorem2 continuation, S02's physical/historical origin, and
whole-page occlusion remain UNKNOWN or unapproved as previously recorded.
No source glyph or mathematical review was performed. The teaching note's
retained body encoding is untouched. The first official exit1 / printed21 /
logical20 remains the actual mechanical result.

Only this new directory is written. All earlier FIRSTs, comparison, diagnostic,
first-failure evidence, canonical/native outputs and counters remain unchanged.
The integrity receipt records hashes and0444 checks. This is not scientific,
source, whole-page, figure or whole-lesson approval. Return text paths/hashes
and cumulative2/4 only; stop for parent intake, with no image payload to parent.
