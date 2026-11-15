# fig-56 Independent Review

Verdict: **PASS**. No essential source-fidelity, orbit/occlusion, cultural, readability, or clipping defect found in the actual final attempt-2 output.

STEMROBIN-180, offline continuation, 2026-11-15. Reviewer is independent of Feynman/the author. Author PASS served only as a final-path locator. No answer key was opened and no figure/spec/author metadata was changed. No source, template, edition, tool, app, dependency, DB, Git, promotion, new IntentFold invocation, or skillhost update action occurred.

## Independent Source Inventory

The complete original `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-56.png` (412 x 290) was opened once. This inventory derives from the complete source pixels, not from author approval or aggregate counts.

- One roughly circular globe is centered in the picture, with coastlines, land masses, and small islands. There is no globe coordinate grid. Maps to `earth-art` and `earth-label`.
- One projected orbital loop extends outside the globe on both sides. Its back central part is hidden by Earth; its front part crosses the lower face of the globe. It is a single orbit with occlusion, not a latitude line or multiple rings. Maps to `orbit-left`, `orbit-right`, and `orbit-front`.
- One small artificial satellite lies on the front lower-right orbital arc, near the globe's right-side silhouette. Maps to `satellite-art` and `satellite-label`.
- No source motion arrow, text, mathematical label, scale, given value, tick, unit, grid, table, or extra subfigure exists. There are no source-labelled points or finite grids requiring point/grid assertions.

Modern additions: colored Earth artwork, a clearer generic single spacecraft with two solar panels, English `Earth` and `Satellite`, and a regularized projected ellipse. Detailed geography, panel design, and ellipse dimensions are illustrative, not measured source coordinates. The source inventory preserves all instructional relationships without treating these additions as source facts.

## Text And Relationship Evidence

The current complete six prose paragraphs and four exercise question texts were read, excluding answer fields/keys. They exactly match the spec's authoritative text. The lesson describes one artificial satellite moving around Earth instead of along a straight line; no orbital altitude, direction, force arrow, or measured scale is specified.

Independent checks of the actual visible SVG paths confirm that all three pieces share one ellipse centered at `(320,240)` with projected radii `(260,90)`. Across 771 samples the largest radial departure is 0.00564751px at the 640px canvas, below the stated 0.01px check tolerance. This is SVG polyline interpolation, not altered instructional data. The spacecraft artwork center `(480.071984,310.920968)` is on that same ellipse with equation residual zero and is on its front lower-right side. Rear visible pieces do not enter the interior of Earth; no invented motion arrow exists.

Full artwork and combined pixels confirm one Earth and one spacecraft, not merely aggregate object counts. The front curve joins the spacecraft through its natural occlusion gap; there is no line through the spacecraft body. The orbit extends well beyond both globe edges, so its relation remains readable rather than appearing to be only a line on Earth's surface. The source-required front/rear arrangement survives at 306px.

The one allowed author repair was already used. Only attempt-2 is approved; this reviewer did not repair anything.

## Actual Offline Surface

Fresh independent Playwright checks used the existing app installation, Chromium 149.0.7827.55, headless, scale 1, offline with HTTP/HTTPS aborted. No page error or network request occurred.

- Neutral, current app-token accent, and print-media composites were inspected at actual media/viewport widths 306 and 640 CSS px: 306 x 229.5 and 640 x 480.
- Both English labels are 17.2125px at 306 and 36px at 640 in all themes. At 306, `Satellite` ends at x269.680/y222.669, safely inside the 306 x 229.5 canvas. At 640, it ends at x564.039/y465.328. No label clipping, collision, or overflow was observed.
- Complete 640px artwork-only and SVG-only layers were inspected independently. The artwork layer contains no generated orbit or text; the exact orbit and both labels are in the SVG overlay.
- Centered contain fitting preserves the globe's intrinsic 859:860 ratio: expected drawn size is 339.604651 x 340 inside its 340 x 340 box. The spacecraft preserves 1325:372. Neither is stretched.
- All right/bottom edges were visible. Orbit reaches x580, not the x640 edge; artwork ends at x541/y409, not the canvas borders. Both satellite panels, Earth outline, front arc, and lower label remain complete.
- Semantic vector roles recolor correctly; the neutral/print orbit remains distinct from the globe. No black/blank raster, non-English image labels, Soviet emblem, flag, national marking, fictional wording, watermark, or source scan texture was found.

Evidence in this directory: `independent-surfaces.png`, `independent-layers.png`, `independent-offline-evidence.json`, and `independent-relationships-verified.json`. Six relationship/contain checks and eight browser variants pass. Earlier scratch diagnostics remain preserved: one counted invisible JSXGraph paths; the next used an excessively tight normalized ellipse threshold. The verified check measures actual screen-space radial error. Neither diagnostic required or caused a figure change.

## SHA-256 Binding

| Record | Real File | SHA-256 |
| --- | --- | --- |
| Source | `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-56.png` | `bc19700dc3aee37edb56717ffee4edc0d2e3228c614a104071b48cee4ec586f3` |
| Spec | `spec.json` | `a3dc45860d7114a3d94e25d2c230911ed332af9826f9a898086eb926e53b9d9c` |
| Render | `attempt-2.render.json` | `594015ab36f3d088f2ce2ee86873698e9c6042136f4e317d06c29319ab635371` |
| Final Artwork | `fig-56.artwork.png` | `b2cc783badd7f2cc954c0a5c53a1686eb1f2ece9debe89c0819f8f4c1217b4f7` |
| Final Overlay | `fig-56.svg` | `3549e4e81d2a079361712a2d4e6a6ab53045161df92a70bc0e70cadecbd70efa` |
| Independent Browser Evidence | `independent-offline-evidence.json` | `89f89ef8bdf3139a9f6eadb54f011209e4702773491d101a314ca8093efa2e9e` |
| Verified Relationships | `independent-relationships-verified.json` | `bc65a506961654f52fe43b510850989dd65fc5a151b397e66b5c3ba5d4e082f1` |

The independent browser evidence binds current lesson/exercise templates, assets, generation metadata and original outputs, author final records, app theme-token source, and independent screenshot hashes. All input/output hashes match the final author records and were rechecked after rendering. `review.json` uses the real `--render attempt-2.render.json --status pass`, with report and independent-evidence hashes in its notes.

This is scratch figure review only, not promotion or assembled-lesson/headed-product acceptance. Durable output rebinding and offline lesson validation remain pending in the main session. Across all four units this review displayed 12 images, under the requested limit.
