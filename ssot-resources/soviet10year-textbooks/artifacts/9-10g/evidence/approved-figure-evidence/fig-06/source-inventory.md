# fig-06 Source Inventory

Original durable PNG opened individually at full native resolution before authoring:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-06.png`.
SHA-256: `6f7be851915a2e924b4127a2f7b3fb2f38f17061c05ebd271ef85e5205964406`.

Observed source pixels:

- One oblique four-sided sheet/card representing a plane. Its rear edge runs slightly down to the right in screen coordinates; the front edge also slopes down to the right. There is no interior grid, diagonal, axis, measurement, or shaded answer region.
- Exactly three filled point dots on the sheet. A is left/front; B is farther right and slightly nearer the front edge; C is above and right of B toward the rear of the sheet. They are not collinear in the drawn projection.
- Exactly four visible labels: A, B, C, and the plane name alpha. Alpha is near the lower-right corner of the sheet, not a fourth point.
- Three narrow, approximately vertical supporting sticks extend below the sheet. The first is under A's horizontal position, the middle under B's, and the right under C's. Their upper portions are occluded by the sheet: visible sticks begin at the sheet's front edge, not at the visible point dots. No extra exposed segment joining a dot to that front edge is printed.
- The stick outlines have paired edges/dark ink and rounded/thick lower endings. The left lower end is higher in the projected image than the other two. The lower oval support outline crosses behind the sticks.
- One wide, unfilled elliptical outline below the sheet depicts the support/base. It has no labels, center dot, radius, tick, given dimension, or additional connection.
- No caption is included in the durable crop.

Modern-text authority: current full n2 lesson template, especially axiom4 and the sentence about a model made from three sticks' endpoints and a cardboard sheet, followed by the notation for three noncollinear points' plane. No exercise/answer is used to add conditions.

Planned deterministic mapping:

- `card` maps the sheet; A/B/C point objects and a plane-name text object map all four source labels.
- Three thin rod polygons map the three visible supporting sticks; their hidden upper portions remain undrawn.
- `base` maps the unmeasured oval support as a deterministic elliptical path. It is apparatus artwork, not a mathematical circle with an asserted radius.
- Incidence `inside` assertions put A/B/C and the plane label within the card; explicit nonzero displacement assertions cover all three point positions without inventing given lengths.
- Rod endpoint connectivity is expressed through each rod's visible boundary geometry, not extra dot-to-edge segments.

Regularization and limitations:

- Clean straight sheet edges, clean rod outlines, smooth oval, font/label placement, and exact schematic projected alignments are modern unmeasured regularizations. They are not given distances, angles, equal spacings, or lengths.
- The source is a perspective apparatus illustration. Projected positions on the sheet need not equal the exposed top ends of the occluded supports. Preserve this occlusion instead of pretending the source prints direct exposed joins.
- Do not name any lower endpoint or add a triangle, center, fourth support, dimension, explanatory label, or answer annotation.
