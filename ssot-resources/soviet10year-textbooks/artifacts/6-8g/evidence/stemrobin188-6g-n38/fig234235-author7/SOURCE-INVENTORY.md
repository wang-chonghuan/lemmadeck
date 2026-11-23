# Sealed Source Inventory

Scope: STEMROBIN-188, offline, AUTHOR_ONLY, figures 234 and 235 only.
This inventory was written after exactly one complete original-image load per
figure, before writing any FigureSpec or construction program. No crops,
reopens, standards, answer keys, choices, other authors, or reviewer artifacts
were inspected. Each original is one subfigure, with no printed caption or
numerical given inside the supplied crop.

## Bound Inputs

- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-234.png`
  SHA-256 `591754f84242a6e0ba18eef352a6acfd6bc9f2f29cc2b8d0c6526338e40788b3`.
- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-235.png`
  SHA-256 `a25712949bf83f2da5a035f26370ca99455bb8918914cc9dc62e89c4e6f97154`.
- Complete modern lesson template SHA-256
  `9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b`.
- Complete modern exercise template SHA-256
  `ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60`.
- Both templates are at
  `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/`.
  Only their modern prose/exercise text is authority for modern labels.
  Text PASS was supplied by the caller, not independently certified here.

## Figure 234

Pixel locations below are approximate observations, not exact measured givens.

- `s234-triangle`: three corners: lower-left (~47,214), upper-right (~377,45),
  lower-middle-right (~303,213). Three solid sides join all three corners.
  Lower-left to lower-middle-right is horizontal. The upper corner is right of
  the lower-middle corner, not centered over the base.
- `s234-extension`: the same horizontal baseline continues from the
  lower-middle-right corner toward the right edge (~415,213). It is an actual
  continuation away from the lower-left corner. The sloping right side is the
  shared ray of the adjacent interior and exterior angles at the middle-right
  corner. There is no second triangle or separate detached ray.
- `s234-labels`: four visible letter-like glyphs: an A-like shape below/left of
  the lower-left corner, B-like above the upper corner, C-like below the
  lower-middle-right corner, and D-like below the continuation near its end.
  ORIGINAL GLYPH ALPHABET/CODE = UNKNOWN. Shape resemblance does not identify
  Latin/Cyrillic encoding. Modern A/B/C/D roles come only from the modern
  triangle ABC and angle BCD prose; they do not decode the old glyphs.
- `s234-arcs-left`: two nested arc strokes at the lower-left interior angle,
  from the horizontal base to the rising long side. No readable number.
- `s234-arcs-upper`: three nested arc strokes at the upper corner, between its
  two sides. No readable number.
- `s234-arc-exterior`: one arc at the lower-middle-right corner, between the
  rightward continuation and the up/right sloping side. The adjacent interior
  sector is present but has no separately discernible arc stroke.
- `s234-fine-ink`: uneven thickening/short protrusions are visible along the
  long rising side, especially near (~145,165) and (~207,132), and smaller
  irregularities along the baseline. Their fine-mark/bar roles are UNKNOWN:
  neither an equality tick, arrowhead, given length, nor scan artifact is
  established. Keep the original bound and this uncertainty; no equality or
  numeric assertion may be inferred. Two conspicuous rising-side patches may
  be retained as neutral short on-stroke bars, with meaning still UNKNOWN.

Executable mapping planned before construction:

- Corners -> `s234-left`, `s234-upper`, `s234-junction`; modern labels A/B/C.
- Continuation anchor -> `s234-end`; modern label D.
- Three sides and continuation -> `s234-edge-left-upper`,
  `s234-edge-upper-junction`, `s234-edge-left-junction`,
  `s234-continuation`.
- Native `connects` assertions for all four segments, `collinear` for
  left/junction/end, plus native `displacement` to encode the actual rightward
  continuation. A supplemental executable cross-product/dot-product check
  enforces nondegenerate triangle, opposite baseline rays, adjacent disjoint
  interior/exterior sectors, and upper corner right of junction.
- Left arcs -> `s234-left-arc-1/2`; upper arcs ->
  `s234-upper-arc-1/2/3`; exterior -> `s234-exterior-arc-1`.
  Native count = six arcs. Supplemental checks enforce 2/3/1 grouping, common
  centers, endpoint rays, equal radii within each arc, nested distinct radii,
  and no invented interior-junction arc or angle-sum annotation.
- Neutral visible on-stroke patches -> `s234-unknown-bar-1/2`, each mapped to
  a native `connects` assertion with literal endpoints; role remains UNKNOWN.
  Subpixel scan roughness is not assigned invented exact coordinates.

## Figure 235

- `s235-boundary`: one irregular convex seven-sided boundary, in clockwise
  pixel order: upper-left (~106,20), upper-right (~315,15), right (~343,142),
  lower-right (~261,258), bottom (~119,308), lower-left (~24,225),
  left (~20,108), back to upper-left. There is no eighth corner.
  The top edge is nearly horizontal; the rightmost side leans; the bottom
  corner is lower/left of the lower-right corner. Do not regularize into a
  regular polygon or change it to a hexagon.
- `s235-hub`: one common intersection (~173,142), strictly inside the boundary.
  No distinct isolated printed dot is established separately from intersecting
  strokes.
- `s235-spokes`: exactly seven solid segments, hub to each of those seven
  vertices. Specifically hub-to-upper-left steep up/left,
  hub-to-upper-right up/right, hub-to-right horizontal/right,
  hub-to-lower-right down/right, hub-to-bottom steep down/left,
  hub-to-lower-left down/left, hub-to-left shallow up/left.
  Each boundary edge and its two adjoining spokes delimit one triangular
  sector. No vertex-to-vertex internal diagonal bypasses the hub.
- `s235-label`: a single O-like glyph is below and slightly right of the hub,
  within the lower sectors. No vertex labels or sector numbers are visible.
  ORIGINAL GLYPH ALPHABET/CODE = UNKNOWN. Modern label O is established by
  the modern proof's arbitrary interior point, not by decoding the old glyph.
- `s235-fine-ink`: short dark protrusions/roughness are visible on the outline,
  notably at the upper-right tip (~320,19), upper part of the right edge
  (~324,48), right vertex (~347,136), and lower portion of the down/left edge
  from the right vertex (~330,170). Fine-mark/bar roles = UNKNOWN.
  No equal-side or parallel marks are established. Preserve the conspicuous
  outline patches as neutral on-stroke segments without assigning equality;
  keep the canonical original for unresolved fine-pixel morphology.
- No arc mark, numeric angle, triangle-sum answer, or full-turn answer is
  printed within this figure.

Executable mapping planned before construction:

- Ordered corners -> `s235-v1` through `s235-v7` in the clockwise order above;
  `s235-boundary` references these seven points. Small modern junction markers
  are explicitly additions, not claimed source dots.
- Hub -> `s235-hub`, modern O label below/right; a small modern hub marker is
  explicitly an addition.
- Spokes -> `s235-spoke-1` through `s235-spoke-7`, one native `connects`
  assertion from hub to each distinct vertex. The source inventory group
  requires `pointRelationships`, mapping all eight defining points.
- Native `inside` checks hub and hub-label with positive clearance; native
  object count checks eight point objects and one polygon.
- Supplemental executable assertions enforce exactly seven unique ordered
  polygon vertices, strict consistent convex turns, strict interior signed
  half-plane tests, exactly one spoke per vertex, no extra internal segment,
  and full seven-sector coverage without asserting or printing angle answers.
- Four conspicuous outline patches -> `s235-unknown-bar-1` through `-4`,
  each covered by native `connects` with literal endpoints. Meaning UNKNOWN.
- Only O may appear in rendered text; no invented vertex/sector labels.

## Modern Additions And Unresolved Facts

Clean deterministic coordinates, neutral stroke weights, small junction markers,
readable English-role letters, and spacing for the instructional inline display
are modern presentation additions. They do not turn approximate source geometry
into given measurements. No equal-angle claim is made by interpreting the arc
multiplicities. Unknown old encoding and fine-mark/bar roles remain unresolved
in every candidate's provenance. A candidate may pass native geometry/display
checks while still awaiting independent source-fidelity and cultural approval.
This author cannot erase UNKNOWN by giving itself PASS.

One bounded image batch: 2 originals loaded; plan 2 native complete PNG loads
and 2 complete PNG loads at the smallest normal width (294 px); reserve 2
additional complete affected-only loads if a real defect requires them.
Total maximum planned loads 8; no crops or reopens of originals.
