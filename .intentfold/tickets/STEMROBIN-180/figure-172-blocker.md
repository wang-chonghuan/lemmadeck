# Figure 172 Independent Review: FAIL

Main completed the same independent full review begun before compaction.
This is not a second full gate. Author handoff SHA256:
`83c6ea298de6e78abffcf1ed5aee8c96d7f68b463fd5f0f2f2a2aa6fc0e4ebef`.
Current spec SHA256:
`09453454114e2d0cc39d394ec5d6f8eaed51abe8e477d37e85a27efb630dd290`.
Current SVG SHA256:
`1dbb76fd603d63385510b951356185dec8afd6b05137891a19e6ce8b417c5033`.

## Review Coverage

Original PNG, both existing 8x source stem crops, full approved s19 context,
and all six current 306/640 neutral/accent/print samples were actually inspected.
The remaining structured check passed 104 unique frozen file bindings.
All 380 objects, 369 assertions and the complete visible SVG were inspected:
four polygons, 568 lines, eight raw paths and four text labels.
Both repaired glass interiors have all 99 sampled points in the expected
positions and do not cover the scale strokes.

All 322 actual source dark stroke runs (a:137, b:185) match the source windows,
individual deterministic segments, corresponding connects assertions, and
visible SVG endpoints. The independent source row mapping uses waterline
a=168 and b=165. These runs are not 322 graduations or inferred density values.
Only a/b and the two source-bound 1000 labels are interpreted text.
Labels are 17.2125px at the declared 306px width. No answer-bearing additions
or cultural text were found. Different bulb depths, exposed/immersed stems
and clearance above the container bottoms are preserved.

## Blocking Defect

Both water polygons terminate at screen y=886 in a rectangle, while each
closed vessel bottom is a quadratic curve from y=877 through control y=898
back to y=877. At x=84, the left curved boundary is approximately y=878.25;
the water therefore continues about 7.75 canvas pixels below the vessel
centerline, visibly outside its stroke. The right panel has the same defect.
The SVG contains no vessel-shaped clipping path for either water polygon.

Existing native accent and print samples both show the squared water-fill
corners outside the curved closed bottom. Targeted 6x crops from those exact
samples settle the issue without rendering again. This violates the
source-bound closed-container/liquid containment relationship; it is not
printing jitter or an invented numerical scale interpretation.

## Disposition

FAIL. Author already used the sole 1/1 repair to replace the two opaque
glass-interior raw paths with polygons after the initial scale occlusion
failure. That original failure and all author freezes remain unchanged.
No second repair, re-render, promotion or database write is authorized.
Required figure 172 blocks complete modern `phy6-c4-s19`; the complete
TEXT approval and private/source-first solutions remain reusable.

Remaining inspection metrics and exact native-sample crops are retained in
the ticket's uncommitted `tmp/172-remaining-inspection.json` and
`tmp/172-bottom-{accent,print}-6x.png`.
