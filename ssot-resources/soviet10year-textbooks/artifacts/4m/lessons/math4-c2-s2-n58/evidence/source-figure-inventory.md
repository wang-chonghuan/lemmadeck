# N58 independent original figure inventory

## Provenance and limits

Ticket STEMROBIN-187; book 4m; lesson math4-c2-s2-n58; 2026-11-23.

This inventory was frozen from the four specified original pages and two existing original crops, each displayed once, before any author-draft disclosure. Actual visual-image count: 6, one batch. No reopens, new crops, extra image outputs, modern figures/specs/candidates, answer keys, author observations, or other chats.

Absolute source root:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`

Page hashes and full scope are in independent-source.md. Crop hashes are repeated here because they bind the two independently inventoried objects. Numerical-only Pillow/NumPy analysis used the already inspected fig-222.png once, with no image output; its method and result are frozen in independent-solutions.md.

## Complete target figure set

1. Original numbered diagram **图 222**, physical 0214 / printed 205, owner exercise 967, in 复习题.
2. Original **unnumbered 4 by 4 table**, physical 0216 / printed 207, owner exercise 974 in 家庭作业题; its instructions are on physical 0215 / printed 206.

The prose's two decimal-addition vertical arrangements are mathematical text/layout, not additional numbered or cropped source figures. N57 content above N58 and all N59 content below N58 are not new inventory targets.

## 图 222

### Input

- Absolute path: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0214/figures/fig-222.png`.
- SHA-256: `a2bbe279a2f55e8b0e1066c0bb9db425ae77130e4fcd4994b42e10492920c0cd`.
- Raster dimensions: 396 by 487 pixels.
- The page prints caption `图 222`; the crop contains the diagram without that page caption.
- One subfigure, not four independent panels.

### Pixel inventory

| Stable evidence ID | Visible source item |
| --- | --- |
| `f222-A` | Common left vertex, labelled A, near crop (33,231) px. A's label sits above-left of the junction. |
| `f222-upper` | Upper-right ray endpoint, with an O-shaped loop and a short diagonal tail: visibly Q-shaped. The prose calls this point O. Approximate endpoint (300,33) px; label above-right. |
| `f222-M` | Upper-middle ray endpoint labelled M, approximately (355,165) px; label at its right. |
| `f222-K` | Lower-middle ray endpoint labelled K, approximately (352,301) px; label at its right. |
| `f222-P` | Lower-right, steeply descending ray endpoint labelled P, approximately (165,470) px; label at its right. |
| `f222-ray-upper` | Solid ray from A to the upper endpoint (text AO). |
| `f222-ray-M` | Solid ray AM. |
| `f222-ray-K` | Solid ray AK. |
| `f222-ray-P` | Solid ray AP. |
| `f222-arc-KAP` | One simple curved arc between AK and AP, close to A, marking the lower angle KAP. No number is printed beside it. |

The coordinate approximations above are inventory locators, not exact mathematical coordinates or new printed givens.

### Structure and ray order

- Five point labels total: A, the Q-shaped upper glyph designated O by the prose, M, K, P.
- Exactly four rays share A. They must remain in one common frame with one common vertex.
- Clockwise from the upper ray in the screen frame: **AO (upper), AM, AK, AP**.
- AM lies inside OAK. AK lies inside OAP. AP is the steep downward ray; AK is the shallower downward ray. Dropping either AM or AK changes the task.
- All four strokes are solid. No dashed ray, arrowhead, coordinate axis, grid, numerical length, degree number, or right-angle square is printed.
- There is **one** visible arc, in KAP. No pair of matching equal-angle arcs, double arc, or bisector-equality tick is printed in OAM/MAK or OAK/KAP.
- Diagram rays have finite visible drawn extents but are named rays by the prose; their unequal apparent lengths do not give lengths.

### Text-only givens

The source wording, not equal-angle marks, supplies:

1. AK is the bisector of OAP.
2. AM is the bisector of OAK.
3. Measure KAP; calculate OAM.

No numerical angle is printed. Exact consequences are $\angle OAK=\angle KAP$ and $\angle OAM=\frac{1}{2}\angle KAP$.

### Upper-label qualification

The scan's upper glyph is Q-shaped; the prose uses O three times. The text-governed derivation therefore names the upper ray AO, while faithful source evidence retains the glyph discrepancy. This is not missing geometry and not a reason to block measuring KAP. Do not fabricate a sixth point, move the vertex to O, change the source angle names to Q, or claim the raster has an unequivocally clean O. Whether to regularize that glyph in a modern drawing belongs to a later disclosed draft comparison, not this blind source pass.

### Numerical measurement summary

Actual-raster centerline fit: KAP baseline 48.95245 degrees; sampling-window sensitivity 48.95245..49.20837 degrees. Ordinary drawing result: KAP approximately 49 degrees, with approximately 1 degree reading allowance; by the text's bisectors, OAM approximately 24.5 degrees, with approximately 0.5 degree propagated allowance.

These are approximate drawing measurements, not exact printed givens or calibrated physical-paper precision. Detailed fits, sample counts, coordinates, rounding, and limitations are in independent-solutions.md. No unreadable geometric value prevents the requested ordinary measurement.

### Later comparison requirements, not a FigureSpec approval

Any later candidate must preserve all five points, common vertex A, all four rays and their order, the original single lower-angle arc, and the two text-given bisector relationships. Any numerical measurement must be labelled approximate. This inventory does not approve a modern FigureSpec or renderer.

## Table belonging to 974

### Input and ownership

- Absolute path: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0216/figures/tbl-p0216-01.png`.
- SHA-256: `32c1efa4e2f87c8293ccd88bfdb3537b7385c16fea8cca6d516e7cbd63b4c92a`.
- Original figure is unnumbered and has no printed caption.
- It continues the instructions of exercise 974 on the previous page. It is not N59 content merely because it is on N59's starting printed page.

### Pixel inventory and exact dimensions

- One rectangular table, **4 rows by 4 columns**, including the seed border row and column.
- Outer boundary: top, bottom, left and right edges.
- Interior lattice: three vertical and three horizontal dividers. Small stroke gaps/irregularities are scan/drawing imperfections, not extra columns or missing logical cells.
- Six printed numeric seeds, ten visibly blank cells: nine interior answer cells and one blank top-left corner.
- No printed `+`, row/column names, table title, result, or numerical corner seed.
- Evidence coordinate names r1..r4 and c1..c4 are not printed labels.

| Stable evidence cell | Printed content | Role established before solving |
| --- | --- | --- |
| `t974-r1c1` | blank | Structural corner; no predecessor above or left |
| `t974-r1c2` | 0.35 | Seed |
| `t974-r1c3` | 0.72 | Seed |
| `t974-r1c4` | 1.14 | Seed |
| `t974-r2c1` | 5.43 | Seed |
| `t974-r2c2` | blank | Interior answer cell |
| `t974-r2c3` | blank | Interior answer cell |
| `t974-r2c4` | blank | Interior answer cell |
| `t974-r3c1` | 0.68 | Seed |
| `t974-r3c2` | blank | Interior answer cell |
| `t974-r3c3` | blank | Interior answer cell |
| `t974-r3c4` | blank | Interior answer cell |
| `t974-r4c1` | 1.71 | Seed |
| `t974-r4c2` | blank | Interior answer cell |
| `t974-r4c3` | blank | Interior answer cell |
| `t974-r4c4` | blank | Interior answer cell |

### Source wording and dependency topology

Exact instruction:

“按下列规则把表格填上：每个空格里填入它的上面和左面的两个数的和。”

For each of the nine interior cells, “上面和左面” means the **immediately adjacent** predecessor cells. Later computations depend on newly filled cells. This is a recursive table, not a conventional header-plus-header addition table.

| Answer cell | Above predecessor | Left predecessor |
| --- | --- | --- |
| r2c2 | r1c2 | r2c1 |
| r2c3 | r1c3 | r2c2 |
| r2c4 | r1c4 | r2c3 |
| r3c2 | r2c2 | r3c1 |
| r3c3 | r2c3 | r3c2 |
| r3c4 | r2c4 | r3c3 |
| r4c2 | r3c2 | r4c1 |
| r4c3 | r3c3 | r4c2 |
| r4c4 | r3c4 | r4c3 |

The nine independently solved results are kept in independent-solutions.md only. They must not be inserted into a source/question figure. The upper-left blank is not 0, not an answer slot with a determined value, and not a seed inferred from solved cells. Literal “every blank” cannot supply it with nonexistent predecessors; this is a source-wording qualification, not an unreadable seed.

### Later comparison requirements, not a modern figure approval

Preserve the original 4 by 4 lattice, all six original seed values in their exact positions, all nine interior blanks, the blank corner, and exercise ownership 974. Do not replace the instructional lattice with a panel, insert solved values into a question image, or change the recursion to repeated header addition. Do not add a numerical corner value without explicitly new, authorized authored givens.

## Inventory outcome

Complete original source inventory: figure 222 and the unnumbered recursive table of 974. No other original figure target is introduced by the two boundary pages.

No new geometry/value unreadability HOLD. The glyph/unit/corner qualifications remain recorded; all pre-existing N57 HOLDs and failures remain untouched. Later authored comparison may require REVISE for an actual mismatch, but no unseen candidate is judged here. This is source/mathematical evidence, not modern-figure/choice/answer/display/whole-lesson approval.
