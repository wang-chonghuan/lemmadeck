# B88 Figure 118 SOURCE Graduation Resolution

STEMROBIN-180 / invocation180-3. **SOURCE LIMIT REACHED: four complete interval counts remain UNKNOWN; Figure 118 remains BLOCKED.**

Workspace and every shell cwd: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
This was targeted uncertainty resolution only, not a full SOURCE review, original
figure/text rewrite, modern authoring, or approval.

## Source Binding

All paths below are relative to the workspace above.

- Original: `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-118.png`.
- Verified SHA-256: `e66b61c47146ff13d5ab8ffe3e0bae5816a0d6a0b0e8de8b533fa9cfa6597aad`.
- Original size: **323 x 673 pixels**. Physical page **173**, printed page **161**.
- Earlier targeted text: `.intentfold/tickets/STEMROBIN-180/tmp/b88-n43-figure-author/fig118-fine-graduations.continuation.md`, SHA-256 `47839f3ef1c69c94742f83be72899706cdbc2a7691a27ec914e5a44289db5857`.
- Earlier detailed mark ledger: sibling `fig118-fine-graduations.continuation.receipt.json`, SHA-256 `d5478272842630887134ce636caf5273ca5878d17ad948f21a99da172ccc6bae`.

The earlier ledger was read as text, not reopened as an image batch. Its exact
counts in 1-to-2, 2-to-3 and 6-to-7 are inherited evidence, not new crop recounts.
The new crops inspect only the four unresolved intervals and adjacent endpoints.

## Native Resolution Limit

The existing source PDF is
`ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf`,
verified SHA-256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.

`pdfimages -f 173 -l 173 -list` reports exactly one embedded page image:
object **345 0**, **1472 x 2240**, **one-bit CCITT stencil**, no interpolation,
approximately **261 x 261 ppi**. Retained physical-page metadata describes a
**300-dpi, 1695 x 2580** render. The PDF has no higher-resolution Figure 118
image; increasing render size would not supply additional scanned detail.
The PDF page was neither extracted/rendered nor loaded for a whole-page review.
No retained higher-resolution page image was located in the checked scratch paths.

## Fresh Image Evidence

Fresh context loads: **4/4** = original once + three new targeted crops once each.
No original reopen, earlier crop reopen, full-page load or modern preview.

Crop directory:
`.intentfold/tickets/STEMROBIN-180/tmp/b88-fig118-source-resolution/`.
Rectangles use original PNG top-left coordinates, half-open
`[x0,y0,x1,y1]`. Crops replicate exact RGB pixels **8x nearest-neighbor for
viewing only**. Magnification is not higher true resolution or new information.

| File | Original rectangle | Native size / viewing size | SHA-256 |
| --- | --- | --- | --- |
| `unresolved-4to5-5to6.png` | [20,196,82,303] | 62 x 107 / 496 x 856 | `c925de0af14e5cdf9144edc17a3a09718b1e20c978beed7b3a7af19a28fa9468` |
| `unresolved-3to4.png` | [20,294,100,363] | 80 x 69 / 640 x 552 | `1cc2983b0b0e064a250b6db56f39ff18cd5b3ae059f9b82bcf38659bd02d6a89` |
| `unresolved-0to1.png` | [20,476,82,554] | 62 x 78 / 496 x 624 | `ec326edf2b13c2373bc6fa4980a2e0345a3b3f6019bfded6290e59fab072f598` |

`source-evidence.receipt.json` in that directory binds the paths, hashes,
PDF metadata, image-load accounting, interval counts and stop reason.

## Exact Positions And Counts

Positions below are **inclusive original-pixel y bands of visible tip cores**,
not full stroke footprints, calibrated values or inferred equally spaced steps.
The ruler's inward strokes are in the original x=48..80 sample region; clipped
row-profile minima must not be treated as complete long-stroke endpoints.
Exact fine-stroke bands in resolved intervals retain the earlier stable IDs
and multiplicities. Numerical row spans only localize pixels; they do not
recover multiplicity in joined ink.

Numbered tick cores, each one mark:
**0:538..543; 1:479..484; 2:419..425; 3:354..360;
4:297..301; 5:245..251; 6:198..202; 7:142..145**.
The y=537 fringe is not another mark.

| Printed interval | Interior long stroke: count / y core | Exact fine count | Fine tip cores or unresolved source region |
| --- | --- | --- | --- |
| 0-to-1 | 1 / 510..516 | **UNKNOWN** | Joined lobes at 488..499 and 517..535; short protrusion at 502..509 does not establish complete multiplicity. |
| 1-to-2 | 1 / 449..453 | **6, inherited** | 428..432, 435..439, 442..446; 457..460, 464..468, 470..474. |
| 2-to-3 | 1 / 387..392 | **6, inherited** | 362..365, 370..373, 378..381; 394..398, 401..404, 408..411. |
| 3-to-4 | 1 / 329..334 | **UNKNOWN** | Three separate upper short protrusions at 305..307, 311..313, 320..322. Lower 338..353 is obscured/ambiguous at the pointer and edge. |
| 4-to-5 | 1 / 271..274 | **UNKNOWN** | Upper 255..264 remains joined. Lower 276..296 has rough protrusions near 278..280, 282..285, 288..289, without a complete distinct-stroke count. |
| 5-to-6 | 1 / 227..231 | **UNKNOWN** | Three separate upper short protrusions at 205..208, 211..213, 217..220. Lower 233..242 remains joined/rough and does not establish distinct-stroke multiplicity. |
| 6-to-7 | 1 / 172..174 | **6, inherited** | 150..153, 156..159, 165..168; 179..183, 188..191, 195..197. |

The upper protrusions in 3-to-4 and 5-to-6 confirm visible partial structure,
not complete interval counts. Joined regions can contain unresolved strokes;
visible lobes are not mechanically promoted into individual graduation IDs.
No new complete interval resolution or exact fine-ledger extension is claimed.

For precise pixel localization of inherited resolved fine cores, the earlier
numeric row spans give the following leftmost dark x within x=48..80
(RGB sum <384), paired with the y bands above in the same order:
**1-to-2:60,62,60,62,60,60; 2-to-3:59,62,62,58,60,60;
6-to-7:63,63,65,62,64,65**. These are pixel minima, not inferred
stroke centerlines, widths, or calibrated positions.

Below printed 0: **one identifiable unvalued short stroke at y=546..551**
(sampled leftmost dark x=59). Above 7, the inherited small nubs at
y=109..114 and 118..120 still have **UNKNOWN** identity as intended marks
rather than edge roughness; that region was not reopened in a targeted crop.

The plain horizontal pointer core at **y=339..343** is **not a ruler tick**.
It lies between printed 3 and the unvalued interior long stroke in 3-to-4.
It cannot reveal any concealed fine marks or establish an exact numeric reading.

## Definite Evidence And Stop

Definite retained inventory: **8 numbered marks; 7 interior long strokes;
6 fine strokes in each of 1-to-2, 2-to-3 and 6-to-7; 1 short stroke below 0**.
The earlier exact fine ledger therefore still contains **19 entries**
(18 in the three resolved intervals plus 1 below 0), not the total fine count.

Still **UNKNOWN**:
complete fine counts in **0-to-1, 3-to-4, 4-to-5, 5-to-6**;
exact total fine/graduation counts; above-7 nub identities; all unprinted
mark values, units/calibrated subdivisions and the pointer's exact reading.
No equal ruler divisions, half-unit values or generic ticks were inferred.

**Figure 118 remains BLOCKED at SOURCE inventory.** No better native-resolution
information was found, and all four image slots were used. Stop here.
No spec, original figure/text rewrite, modern authoring, review/pass, promotion,
paid/web/new-source replacement, app/code/dependency/DB/Git action, or changes
to another worker's artifacts. Writes were limited to this new report and the
owned source-resolution scratch directory.
