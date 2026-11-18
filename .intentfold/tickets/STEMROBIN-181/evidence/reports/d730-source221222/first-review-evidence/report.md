# STEMROBIN-181 SOURCE 221/222 First Independent Review

Result: **REWORK REQUIRED**. Five source-fidelity findings below. This is not
full-card approval, modern-science approval, publishing approval, or a replay of
the successful native gates.

Sole execution cwd:
`/Users/yong/.codex/worktrees/00b1/lemmadeck`

Only writes:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d711-source221222-first-review/`

## Findings

1. **F1 / P2 / SOURCE 221: missing literal character.**
   Author `root/10p/pages/0221/page.md:65`, also `page.json` block 4, line 1
   (1-based): `在第一种媒质中光速等于` omits the source's `的`.
   Source printed row 9 reads `在第一种媒质中的光速等于`.
   Evidence: `source-0221-row8-10-caption.png`.
   Restore the character without adding a printed row.

2. **F2 / P2 / SOURCE 222: missing source term emphasis.**
   Author `root/10p/pages/0222/page.md:38` and `:39` has plain
   `相对折` / `射率`; the source prints the complete term 相对折射率 in bold
   across printed rows 1-2. Author `:50` also leaves 绝对折射率 plain,
   although the source emphasizes that term on printed row 9.
   The same omissions are in `page.json` blocks 1 and 3.
   Evidence: `source-0222-refraction-emphasis.png`.
   Restore only the printed term emphasis, preserving the physical line breaks.

3. **F3 / P2 / SOURCE 222: invented extent of emphasis.**
   Author `root/10p/pages/0222/page.md:62`, also `page.json` block 6, line 1,
   bolds the entire row `折射率与光束的入射角无关，但是它与光的颜色有关，这`.
   Source printed row 15 emphasizes only the leading term 折射率.
   Evidence: `source-0222-n83-first-paragraph-detail.png`.
   Keep the source term emphasis; remove unsupported emphasis from the rest.

4. **F4 / P2 / SOURCE 222: sentence stop changed into comma.**
   Author `root/10p/pages/0222/page.md:70`, also `page.json` block 7, line 5,
   reads `虹彩的边缘，通`. The source printed row 21 reads
   `虹彩的边缘. 通`. This is a sentence boundary, not a comma-width convention.
   Evidence: `source-0222-n83-quote-punctuation.png`.
   Preserve the source stop and the following word 通 on that printed row.

5. **F5 / P2 / RAW195 and SVG195: clipped caption ink included.**
   The exact figure box is `[832,105,524,511]`; the RAW uses a 12px margin,
   giving source origin `[820,93]` and size `548x535`.
   Source rows 623-627 are already the tops of caption 图 195.
   RAW zero-based rows 530-534 contain this ink, chiefly x190-316.
   The SVG faithfully traces the same clipped fragments along its bottom edge.
   Both full RAW and SVG preview were actually viewed, and the source caption
   was separately checked in `source-0221-row8-10-caption.png`.
   This is inherited crop contamination, not a missing mathematical object.
   Preserve the snapped geometry and figure content; remove only the padding's
   neighbouring caption ink through the sanctioned per-figure crop contract.
   Do not hand-edit traced SVG geometry or treat vector PASS as crop approval.

All five findings concern the d710 candidate. No candidate was edited here.

## Per-Page Conclusions

| Physical / Printed | SOURCE | RAW | SVG |
| --- | --- | --- | --- |
| 221 / 211 | REWORK: F1; rows, formulas and continuation markers checked | fig-195 REWORK: F5; geometry retained | fig-195 REWORK: F5 inherited; RAW trace faithful |
| 222 / 212 | REWORK: F2-F4; rows, formula order, quote and h3 boundary checked | N/A: no source figure | N/A: no source figure |

Independent printed-row counts were written before reading the author text/audit:

| Physical Page | Actual Unique Rows | Audit Printed | Audit MD | Detail |
| --- | --- | --- | --- | --- |
| 221 | 24 | 24 | 24 | 23 content rows plus footer; caption shares row 8 |
| 222 | 23 | 23 | 23 | 22 content/header rows plus footer; no figure |

For 221 the typed blocks contain 25 textual lines; the single caption `samerow`
deduction gives 24 unique printed rows. All displayed fractions occupy one
printed row each. The two absolute-index definitions on 222 occupy one shared
formula row, not two. No artificial wraps, automatic extra fraction rows,
duplicate text, or fabricated source lines are justified.

## Checks That Passed Within This Scope

- Physical pages 221/222 show printed pages 211/212 respectively.
- The literal initial fragment `射.` and `p cont open` on 221 are retained.
  The within-page `p cont` after the figure/caption closes that interrupted
  paragraph. The supplied task identifies its incoming link to SOURCE 220;
  no SOURCE 220 pixels or additional prose were inspected or invented.
- SOURCE 222 begins a new paragraph, not an unfinished paragraph fragment.
  It continues the incoming refraction unit without needing a fabricated
  `cont` marker on its first paragraph.
- Formula order and content match the actual pages:
  `Delta t = |CB| / v_1`;
  `|AD| = v_2 Delta t`;
  `(7.1) |CB| = v_1 Delta t = |AB| sin alpha`;
  `(7.2) |AD| = v_2 Delta t = |AB| sin beta`;
  `(7.3) sin alpha / sin beta = v_1 / v_2 = n`;
  `(7.4) n = v_1 / v_2`;
  `n_1 = c/v_1` and `n_2 = c/v_2` on one row;
  `(7.5) n = v_1 / v_2 = n_2 / n_1`.
  The source's `用(7.2)除(7.1)` ordering is preserved, not "corrected".
- Newton quotation wording, opening before 研究了, closing after 意料到的,
  and the attribution 牛顿墓志铭 agree. The literal wording 像的虹的色彩
  is retained. F4 is outside the quotation and remains a real defect.
- The actual next `h3` is **83. 光的色散** on 222, printed row 14,
  author Markdown line 59 / JSON block 5. That closes the incoming unit 82
  under the supplied ticket context. Unit 83 is still incomplete in this
  two-page scope. Its last visible paragraph ends with 染色.; paragraph
  `open` is correctly false. Card incompleteness does not invent paragraph
  continuation text. No SOURCE 223 was opened.
- Figure 195: all A, B, C, D, A1, A2, B1, B2, M, N and printed alpha/beta
  labels survive the RAW crop and SVG. M-A-B-N remain collinear on the interface.
  A1-A-A2 and B1-C-B-B2 preserve incoming and outgoing ray ordering and all four
  arrowheads. The vertical normal at A, upper AC wavefront, lower DB wavefront,
  D on A-A2, and tangency of DB to the A-centered wavelet at D are retained.
  The large wavelet arc and both smaller wavelet arcs are present.
  Unlabelled arcs are not invented angle labels.
  No answer, numerical solution, or modern scientific correction is introduced.
- Existing finalize receipts are both exit 0. Existing 221 vectorize receipt
  is exit 0 with 0.021% mismatch; 222 vectorize is exit 0 with zero figures.
  They were read and hash-bound only, never replayed. Those mechanical results
  do not invalidate F1-F5.

## Actual Image Accounting

One batch, eight actual image opens total: four base images plus four crops.
Context total is eight, below 24. Zero reopens, zero grid images, zero composite
payloads, zero other-page images. Creating a preview is not an extra view; the
one actual open of that preview is counted.

| Physical Page | SOURCE Opens | RAW Opens | SVG Preview Opens | Total |
| --- | --- | --- | --- | --- |
| 221 | 2: original plus rows 8-10/caption crop | 1 | 1 | 4 |
| 222 | 4: original plus emphasis, quote, first-paragraph crops | 0 | 0 | 4 |

Actual order: SOURCE221, SOURCE222, RAW195, SVG195 preview, SOURCE221 crop,
SOURCE222 emphasis crop, SOURCE222 quote crop, SOURCE222 first-paragraph crop.
No additional images are permitted within this batch.

## Evidence Paths And Hashes

Absolute source/candidate paths and full SHA-256 values are in
`bindings.json`; the final detail crop and RAW bottom-row coordinates are in
`preview-detail.json`. Files are referenced, not copied into a new evidence package.

SOURCE221 SHA-256:
`a42759a8e3efc1045929d36f8d67e1b63f02a42c24cd27460b05bc3327eb1293`

SOURCE222 SHA-256:
`61eb7faad35868f7120710f625b5fed32ef30ee6127f73933227d76072416820`

RAW195 SHA-256:
`5ffe29234ba7d9bbbae5f6dcb57f74ad4f2689e9633ffdfcd043d0959ab709c7`

SVG195 SHA-256:
`f959a769a7767bb82bab00b6af8415fef74d54b06174fb296625af335e0aacaa`

SVG preview:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d711-source221222-first-review/fig-195.svg-preview.png`

SVG preview SHA-256:
`7fb5389c75c5ed36d762133cc85327f50e64ef34cc9e908d26cba6d898f51ffd`

The SVG was rasterized with the already-installed
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js/index.js`
at `1096x1070`, white background, original aspect ratio. Existing Pillow
produced only the owned local crops. No runtime was installed.

No canonical pipeline, meter, Git, ticket-backend call, DB, paid call,
new agent/worktree/branch, full test suite, build, freshness update, or other-chat
message was run. Successful producer stages and image history were not replayed.
