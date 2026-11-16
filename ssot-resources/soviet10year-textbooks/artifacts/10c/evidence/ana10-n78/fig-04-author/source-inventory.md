# 10c Figure 04 Original Inventory

Date: 2026-11-16. Ticket: STEMROBIN-184. Role: source-first inventory by the sole deterministic figure author; not an independent PASS.

Original opened once, at its complete native 450 x 492 resolution, before any FigureSpec:

- Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-04.png`
- SHA-256: `4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`
- Official context: `.tmp/s10y-image/10c-fig04/context.json`
- Context SHA-256: `defa2199b66611c4b1463ecbb60935a42a262ccdd776f701ac70f8313724ad58`

## Frozen Pixel Facts

One subfigure, with no axes, numerical dimensions, scale, units, shaded region or exercise-specific annotations.

1. O is the left vertex and center of the circular construction. Its printed O label is left of the vertex. No separate round dot is printed.
2. B is the upper-right endpoint; its B label is above/right of that endpoint. No separate endpoint dot is printed.
3. A is the lower-right endpoint; its A label is below/right of that endpoint. No separate endpoint dot is printed.
4. OB and OA are two solid oblique radii, opening rightwards. They reach B and A respectively. The source has no radius name, unit, numerical length, arrowhead or equal-length tick.
5. AB is a solid, almost vertical chord connecting the two right endpoints. It is distinct from the curved arc farther to the right.
6. The large solid circular arc joins B and A and bows rightwards. It shares the same endpoints as the chord and the two radii. There is no full circle or extra continuation beyond A/B.
7. A horizontal dashed ray-like segment begins at O, crosses the chord at its unlabeled midpoint, and continues to the large arc. It terminates on that arc. The intersection and outer endpoint have no dot or name.
8. A small solid angle-marking arc near O connects the upper and lower radii. It crosses the dashed bisector, making two adjoining half-angle markers; it is not the large chord-subtending circular arc.
9. One stacked x-over-2 label lies above the dashed bisector, just to the right of the small angle arc. A second stacked x-over-2 label lies below it, likewise to the right of the small arc. Both labels are present.
10. No midpoint name, right-angle box, 90-degree label, additional center/endpoint marker, total-angle label, r/l/xr dimension label or solved annotation is present.

Relative construction is frozen; no numeric radius, angle, source-pixel-to-unit scale or scan-based geometric measurement is asserted. Equal radii and a bisector are the approved mathematical interpretation, not claimed printed numerical data.

## Routing And Planned Mapping

Mode: `deterministic`. Purpose: `instructional`. This is entirely a circular geometry and mathematical-label diagram, so existing JSXGraph objects suffice; no semantic artwork, Azure, new library or freehand path is needed.

Stable source roles to be mapped in the subsequent spec:

| Source requirement | Planned visible object IDs | Planned relation assertion IDs |
| --- | --- | --- |
| O/A/B names, without dots | `center-O`, `endpoint-A`, `endpoint-B` | `radii-equal`, `radius-A-circle`, `radius-B-circle`, `radius-OA-connects`, `radius-OB-connects`, `chord-AB-connects` |
| Two solid radii | `radius-OA`, `radius-OB` | `radii-equal`, `radius-OA-connects`, `radius-OB-connects` |
| Solid chord and distinct circular arc | `chord-AB`, `outer-arc-AB` | `chord-AB-connects`, `radius-A-circle`, `radius-B-circle`, `solid-chord-count`, `outer-arc-count` |
| Dashed O-to-arc bisector through unnamed chord midpoint | `bisector` | `bisector-connects`, `bisector-chord-crossing`, `bisector-arc-end`, `bisector-halves-equal`, `bisector-is-perpendicular`, `dashed-bisector-count` |
| Continuous small angle marker, split at bisector | `half-angle-upper`, `half-angle-lower` | `half-angle-marker-count` |
| Both x/2 labels in corresponding half angles | `half-angle-upper-label`, `half-angle-lower-label` | `half-angle-label-count` |

Invisible construction anchors may be required to express the midpoint and arc endpoint mathematically. They must remain unnamed, without dots, and must not be misrepresented as additional source-visible points.

## Display Plan And Limits

Intended product media layout: inline, maximum 346 CSS px, with declared intended inline widths 240 and 346 CSS px. Native SVG canvas preview will also be inspected at 640 px; this is not a claim that a headed product has been measured at 640 px.

Labels will have sufficient native size to remain at least 16 px at 240 px. Native, 240-neutral and 346-print previews are author evidence only; the parent owns the unique independent spec, semantic and display review. No source image will be reopened for this author pass.
