# Figure24 Source Inventory

2026-11-16, STEMROBIN-184 existing bounded parent delegation. Author inventory, not independent review PASS. Written before any FigureSpec or other figure inventory. Original actualPNG opened singly at native455x436.

Source `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-24.png`, SHA256 `17e61820bd2fe504a18fb94531ad21087468ccf529563e9791b83257e03ad57c`.
Official context `.tmp/s10y-image/9-10g/fig-24/context.json`, SHA256 `2708d2307afe7a8750ff0143120b2d0e1fdf9dfde6506aa586009893ba976e16`. Full approved exercise57 retained verbatim in spec provenance; no answer artifacts consulted.

## Pixel Facts

One oblique cube projection. Front face A(bottom-left), B(bottom-right), B1(top-right), A1(top-left); rear offset right/up D(bottom-left rear), C(bottom-right rear), C1(top-right rear), D1(top-left rear). All eight source labels present. Twelve edges only:

- Solid AB, BC, CC1, C1D1, D1A1, A1B1, B1C1, AA1, BB1.
- Dashed AD, DC, DD1. Their common hidden vertex D is behind the front face, not a new point.
- No diagonal, length, angle, arrowhead, face hatching, grid, answer point or exercise57-specific segment.

Source projection does not assert true equal screen lengths or right angles. Use an affine oblique cube projection, not screen-measured 3D geometry.

## Routing And Planned Mapping

Deterministic instructional JSXGraph only; no natural objects or generated artwork. Point IDs A,B,C,D,A1,B1,C1,D1; exactly12 edge IDs AB,BC,CD,DA,A1B1,B1C1,C1D1,D1A1,AA1,BB1,CC1,DD1. Each edge receives a connects assertion, all three parallel edge families receive parallel assertions, eight point labels preserved. Hidden DA/CD/DD1 retain dash. Source vertex group requires pointRelationships and maps all eight vertices through the edge assertions. No exercise57 diagonals/answer annotations added.

Modern additions: clean ink, ample canvas margin, readable label placement and uniform typography; these are layout regularization, not source facts. Planned actual media widths640/240neutral and346print, all labels at least16px. Parent is sole reviewer; scratch only.
