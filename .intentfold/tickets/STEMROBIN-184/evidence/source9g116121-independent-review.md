# STEMROBIN-184: Independent Source-First Review, Physical Pages 116-121

Date: 2026-11-18.
Sole checkout: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Sole owned output: `.intentfold/tickets/STEMROBIN-184/evidence/source9g116121-independent-review.md`.

This is one substantive independent review of the faithful page layer only.
Session/ticket/setup/grill were not replayed. No earlier review, author report,
answer material, choice material, modern edition, or earlier source image was
read. No source/tool edit, Git operation, database access, publication, deployment,
preparation, PDF rendering, worker creation, worktree creation, or chat messaging
was performed.

Instructions read: lesson `SKILL.md`, its `references/production-resume.md`, and
the image skill's image-batch rules. The direct assignment overrides the lesson
skill's normal production defaults.

## Source Acquisition And Prior Inventory

The following inventory was recorded before opening any candidate `page.md`.
At that source-first stage, six original PNGs were opened exactly once each,
individually at original detail, with no ROI. After candidate comparison, two
necessary native-resolution, read-only ROIs resolved a small glyph and a
punctuation mark. No whole-page redisplay, grid duplicate, or contact sheet was
used. Final image usage: **6 originals + 2 ROIs = 8 images in one batch and
8 images in this context**. The batch limit is 8 and the context limit is 24.

Durable sources, relative to the sole checkout:

- Physical 116-119: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch012-source116119-first-prepare/pages/<NNNN>/page.png`.
- Physical 120-121: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch012-source120121-first-prepare/pages/<NNNN>/page.png`.

Row totals below count actual printed horizontal baselines after excluding the
figure interior, not individual connected components or accent bands. Captions
are text; a caption sharing a prose baseline adds no second row. Footers count.

| Physical / Printed | Independent Baselines | Source Object Row Contributions |
| --- | ---: | --- |
| 116 / 109 | 25 | Prior theorem ending 3; exercise heading 1; 310 2; 311 3; 312 4; 313 stem 3; 313 solution 8; caption 127 shares the solution's fifth row; footer 1 |
| 117 / 110 | 25 | 313 solution continuation 5; 314 5; 315 2; 316 3; 317 3; 318 3; 319 1; 320 2; footer 1 |
| 118 / 111 | 19 | 321 2; 322 2; 323 5; section 35 heading 1; construction problem 2; solution before figure 2; caption 128 1; construction after figure 3; footer 1 |
| 119 / 112 | 25 | Construction continuation 2; common-perpendicular definition and minimum-distance claim 5; proof 3; note 2; exercise heading 1; 324 3; 325 4; caption 129 shares 325's fourth row; 326 3; 327 beginning 1; footer 1 |
| 120 / 113 | 19 | 327 continuation 2; 328 2; 329 3; 330 stem 3; solution before figure 2; caption 130 1; vector sum 1; squaring introduction 1; squared vector equation 1; orthogonality 1; two-case introduction 1; footer 1 |
| 121 / 114 | 24 | 330 solution continuation 6; section 36 heading 1; theorem 21 3; proof setup 4; caption 131 shares setup's fourth row; sufficiency 2+1; necessity 2; exercise heading 1; 331 3; footer 1 |

Total: **137 actual baselines**.

### Physical 116

- A three-row ending of the prior distance-to-plane theorem: a point `A` belonging
  to `alpha` projects to itself, its distance is zero, and `|AA| = 0`, followed by
  the printed black proof-ending square. This is preceding theory, not a new
  exercise.
- `习题`; 310 has a degree-style marker and asks to compare the distances from
  `M` to a line `a` lying in plane `alpha` and to the plane, including equality.
- 311 has numbered cases: cube face diagonal `m`, cube diagonal `d`, distance from
  a vertex to the opposite face.
- 312 has both complete proof prompts: midpoint distance is half the sum for a
  segment not intersecting the plane, and the absolute value of half the
  difference for a segment intersecting it.
- 313: equilateral triangle side `6cm`; all three distances from `M` to vertices
  are `4cm`; ask for distance to its plane. The full printed solution begins here
  and continues to 117. It assumes `|MA| = |MB| = |MC|`, projects `M` to `K`, uses
  pairwise congruence of right triangles `MKA`, `MKB`, `MKC`, concludes
  `|KA| = |KB| = |KC|`, and identifies `K` as the circumcenter. The page ends with
  `要求计算`, before the next page's `|MK|`.
- Figure 127 belongs to solved 313: `M` above triangle `ABC`, projection `K`,
  connections from `M` and `K` to the vertices. Caption 127 shares a prose row.

### Physical 117

- Solved 313 continues and closes: `|MK|`; `a = R sqrt(3)`;
  `|KA| = |AB| / sqrt(3) = 2 sqrt(3) cm`;
  right triangle `AKM`, `|MA| = 4cm`;
  `|MK| = sqrt(|MA|^2 - |KA|^2) = 2cm`.
- 314 contains both cases: right-triangle legs `a,b` with point-plane distance
  `h`, and a triangle `ABC` with all vertex distances `l`, `|BC| = a`,
  angle `BAC = alpha`.
- 315 asks for equidistant-point loci for a right triangle, an isosceles
  trapezoid, and a nonsquare rhombus.
- 316 has the parallel-line distance proof and the intersecting-line case.
- 317: `[AB]` of length `a`, parallel to plane `alpha` at distance `b`;
  `[AC]`, `[BD]` perpendicular to `[AB]`; `{C,D}` is a subset of `alpha`;
  source visibly prints `|AC| = |BD| = C` with an uppercase `C`, then asks for
  `[CD]`. Preserve this literal rather than silently choosing a lowercase `c`
  or replacing segment notation with a length.
- 318: parallel-plane distance proof and degree-marked second case for
  intersecting planes.
- Degree-marked 319 and 320 ask for loci at distance `l`, then less/greater than
  `l`. No new theory or figure.

### Physical 118

- 321: locus equidistant from two distinct parallel planes.
- 322: all symmetry axes mapping distinct parallel planes `alpha` to `beta`,
  and their union.
- 323 has three complete cases for segments `AB,CD` with endpoints on two
  parallel planes: length ratio `10:17` and projections `12cm,3dm`; lengths
  `a,b` with projection ratio `m:n`; lengths `a,b` with projection sum `c`.
  Ask for distance between planes.
- Section 35 is `异面直线的公垂线`.
- The unnumbered construction is full lesson theory, not a short problem:
  given skew lines `a,b`, construct a line meeting and perpendicular to both.
  Its solution constructs parallel planes `alpha,beta` through the lines
  (section 11, problem), projects `b` to `b_1` parallel to `b` (section 11,
  theorem 7), sets `M = a intersect b_1`, takes its preimage `N` on `b`, and
  identifies `(MN)` as the requested line. The final printed row ends with
  `实际上，因`, continuing to 119.
- Figure 128 belongs to this construction and ensuing theory: parallel planes
  `alpha,beta`; lines `a,b,b_1`; points `M,N,C,D,D_1`; vertical connectors,
  right-angle indications at `M,N`, and the oblique comparison segment `CD`
  with dashed portions. Caption is a separate baseline.

### Physical 119

- Construction continues: `(MN)` perpendicular to `alpha`, hence to `beta`
  (section 33, theorem 19), therefore perpendicular to `a,b`.
- Full theory defines the segment with endpoints on the skew lines and
  perpendicular to both as their common perpendicular, then claims its length
  is their distance. The literal comparison is strict:
  `|MN| < |CD|` for another segment `[CD]` with endpoints on the lines.
- Full three-row proof uses projection `D_1` of `D` on `alpha`, theorem 20,
  `|DD_1| < |CD|`, and `|DD_1| = |MN| (为什么?)`.
- Full note: the distance between the skew lines equals that between parallel
  planes containing them; retains reference to figure 128.
- `习题`; 324 asks for common perpendiculars in cuboid
  `ABCDA_1B_1C_1D_1` for `A_1D_1` and `BB_1`, `DC` and `B_1C_1`,
  `CC_1` and `AB`.
- Figure 129 belongs to 324, not nearby 325: cuboid vertices `A,B,C,D` and
  `A_1,B_1,C_1,D_1`, with the printed solid/hidden dashed edges. Caption shares
  325's final prose baseline.
- 325: one skew line is in plane `alpha`, another perpendicular to it; asks
  relation of common perpendicular to the plane.
- 326: cube, common perpendicular of `AA_1,BD`; edge `a`; find line distance.
- 327 starts a full numbered exercise: cube `ABCDA_1B_1C_1D_1`,
  construct the common perpendicular of `A_1D` and ...; continues to 120.

### Physical 120

- 327 closes with `BC_1`, then degree-marked case 2: cube face area `2cm^2`,
  find distance between those lines.
- 328: regular tetrahedron edge `a`, distance between `(AB)` and `(CD)`.
- 329: plane `gamma` through midpoint of common perpendicular `[MN]`,
  perpendicular to `(MN)`; prove it bisects any segment with endpoints on
  the two skew lines.
- Star-marked 330: skew lines `a,b`, angle `varphi`, common perpendicular
  `[MN]` of length `d`; `A,B` on respective lines; `|MA| = m`, `|NB| = n`;
  find `|AB|`. Its full solved example remains attached to 330, through 121.
- Figure 130 belongs to solved 330, containing two printed cases `(а),(б)`,
  points `A,M,N,B`, skew lines `a,b`, vectors from `A` to `M`, `M` to `N`,
  and `N` to `B`, with right-angle indications at `M,N`. Do not turn either
  subfigure into a separate exercise.
- Before the figure: construct vectors `vec(m),vec(n),vec(d)`, polygon rule.
  After it: `vec(AB) = vec(m) + vec(d) + vec(n)`.
- Source equation (1) includes `vec(d)^2`:
  `vec(AB)^2 = vec(m)^2 + vec(d)^2 + vec(n)^2
  + 2 vec(m) dot vec(d) + 2 vec(m) dot vec(n)
  + 2 vec(d) dot vec(n)`.
- Full orthogonality statement: `vec(d)` perpendicular to `vec(m),vec(n)`,
  hence `vec(m) dot vec(d) = vec(d) dot vec(n) = 0`.
  Ends with `可能有两种情况:`; the cases continue to 121.

### Physical 121

- The first printed baseline contains both numbered angle cases, both pairs
  of vector arrows, and both angle hats:
  `1) angle(vec(m),vec(n)) = varphi (图130,а);
  2) angle(vec(m),vec(n)) = 180 degrees - varphi (图`.
  Its continuation `130,б).` is baseline 2. The accents above baseline 1
  are not an extra independent printed row.
- Baselines 3-4 give `vec(m) dot vec(n) = mn cos(varphi)` in case 1 and
  `-mn cos(varphi)` in case 2.
- Baseline 5 says substitute these values into (1) and take the square root.
  Baseline 6 literally prints
  `|AB| = sqrt(m^2 + n^2 +/- 2mn cos(varphi)).`
  **There is no `d^2` inside this source radical.** Do not alter this literal.
- Section 36, `三垂线定理`, starts a new, not-completed lesson boundary.
- Theorem 21 is a full three-row statement of the necessary and sufficient
  condition: a line in the plane perpendicular to the oblique line iff it
  is perpendicular to that oblique line's projection.
- Full four-row proof setup: `(AC)` perpendicular to plane `alpha`, `(AB)`
  oblique, `(CB)` projection in the plane; reference figure 131.
- Figure 131 belongs to theorem 21 under section 36, not solved 330:
  plane `alpha`, transverse plane `ABC`, points `A,C,B`, normal `AC`,
  oblique `AB`, projection `CB`, in-plane line `m` with a right-angle mark,
  and printed dashed hidden portions. Caption shares setup's fourth row.
- Full sufficiency: `m` in `alpha` perpendicular to `(CB)`, also perpendicular
  to `(AC)`, so `m` perpendicular to `(ABC)` (section 28, theorem 14), hence
  to `(AB)`.
- Full necessity: `m` subset of `alpha`, perpendicular to `(AB)`; `(AC)`
  perpendicular to `m`, hence `m` perpendicular to `(ABC)`, hence `(CB)`,
  followed by the printed proof-ending square.
- `习题`; complete three-row 331 has both correctness questions. This opening
  exercise does not establish completion of section 36.

## Candidate Comparison

**Overall gate: HOLD.** Three localized transcription findings require the exact
affected edits below. The separate current machine-count gate on 121 also fails.
No affected edit was applied; only this review file was created/updated.

All six current candidate Markdown bodies were compared against the six
originals, including prose, every displayed/inline formula, variables, case
markers, punctuation, proof-ending squares, headings, captions, figures, and
continuation boundaries. The table above is the independent source count, not
an adopted author/detector total. A separate read-only count of the current
Markdown, expanding genuine `↵` formula wraps and accounting for `samerow`,
produced 25,25,19,25,19,24, also totaling 137.

The optional 115 boundary was read as text only, after the source-first inventory.
It establishes the preceding section-34 heading and a completed preceding proof
paragraph; it is not an independent source-image review of 115. No 115 image or
earlier image/report was opened.

### Finding 1: Distance Parameter `l` Transcribed As `b`

Severity: substantive transcription failure. Page 117, exercises 319-320.
The source parameter is lowercase italic `l` in all three affected occurrences;
candidate `b` changes the literal exercise data. This is not a mathematical
printing error in the book.

Native ROI: original 117, half-open native pixel rectangle
`(110,1740)-(1280,1955)`, no resizing and no file output. This explicitly confirms
the initial source-first inventory's `l`; it is not a correction inferred from
the candidate or another reviewer.

Exact affected edits in
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0117/page.md`:

- Line 71: `319°. 求同已知平面$\alpha$的距离为$b$的所有点的集合.`
  becomes `319°. 求同已知平面$\alpha$的距离为$l$的所有点的集合.`
- Line 74: `320°. 求与已知平面的距离1) 小于$b$；2) 大于$b$的所`
  becomes `320°. 求与已知平面的距离1) 小于$l$；2) 大于$l$的所`

Do not change the genuine `b` in exercises 314/317, or the source's uppercase
`C` in exercise 317. No row-count change is needed for these edits.

### Finding 2: Equation (1) Lost Its Printed Full Stop

Severity: punctuation fidelity failure. Page 120, solved 330, line 77.
The source has a full stop immediately following the squared vector equation,
before the right-hand equation number `(1)`. The current candidate has no
full stop there.

Exact affected edit in `pages/0120/page.md`, line 77:

```text
$\overrightarrow{AB}^2=\vec{m}^2+\vec{d}^2+\vec{n}^2+2\vec{m}\cdot\vec{d}+2\vec{m}\cdot\vec{n}+2\vec{d}\cdot\vec{n}$ (1)
```

becomes:

```text
$\overrightarrow{AB}^2=\vec{m}^2+\vec{d}^2+\vec{n}^2+2\vec{m}\cdot\vec{d}+2\vec{m}\cdot\vec{n}+2\vec{d}\cdot\vec{n}$. (1)
```

Leave the vector squares, summand order, dot products, equation number, and
single printed baseline unchanged. This finding was visible on the once-opened
full original; no additional ROI was consumed for it.

### Finding 3: Necessity Proof Comma Changed To Full Stop

Severity: punctuation fidelity failure. Page 121, theorem-21 necessity proof,
line 91. The source prints a comma after `m perpendicular (ABC)`, not a full
stop. Native ROI `(95,1415)-(1275,1620)` confirms the comma, the subsequent
`因此`, and the proof-ending black square.

Exact affected edit in `pages/0121/page.md`, line 91:

```text
$m\perp(ABC)$. 因此，$m\perp(CB)$. $\blacksquare$
```

becomes:

```text
$m\perp(ABC)$，因此，$m\perp(CB)$. $\blacksquare$
```

This preserves the source comma using the candidate's Chinese-comma convention.
Do not rewrite, abbreviate, reclassify, or remove any portion of the full proof.
No row-count change is needed.

### Full Object And Ownership Check

| Object | Source-To-Candidate Result |
| --- | --- |
| 116 prior theorem ending | Complete zero-distance case and black square retained; appropriate separate prose paragraph after the preceding completed 115 paragraph |
| 310-312 | Complete literal statements, subcases, degree marker, formulas and scope retained |
| Solved 313 | Full statement and all solution rows retained; `ex 313 open` through figure 127, `ex 313 cont open`, then `117 ex 313 cont` closes at `2cm`; no short-problem conversion |
| 314-318 | Complete statements/subcases retained, including `BAC` angle hat, `h,l,a,b`, literal uppercase `C`, set/subset notation, `[CD]`, and `2°)` in 318 |
| 319-320 | Complete objects and markers retained, but three parameter glyphs fail fidelity as Finding 1 |
| 321-323 | Complete; 323's `10:17`, `12cm`, `3dm`, `m:n`, `a,b,c`, and genuine cross-row `|CD|=b` wrap retained |
| Section-35 construction | Full unnumbered problem, construction and justification retained as prose; `118 p open` ends `因`, `119 p cont` starts `为` and closes the same sentence |
| Common-perpendicular theory | Complete definition, strict comparisons, projection proof, theorem references, `为什么？`, and parallel-plane note retained; no invented black square |
| 324-326 | Complete, with all cuboid/cube labels, line pairs, subcases and quantities retained |
| 327 | `119 ex 327 open` ends `A_1D与`; `120 ex 327 cont` begins `BC_1` and closes after the `2°)` face-area `2cm^2` subquestion |
| 328-329 | Complete tetrahedron and midpoint-plane proof prompts retained |
| Solved 330 | Full statement, vectors, both figure cases, equations, orthogonality, angle cases, dot products and source radical retained; `120 ex 330 cont open` closes as `121 ex 330 cont`; Finding 2 affects punctuation only |
| Section-36 theorem 21 | Complete three-row statement, proof setup, sufficiency, necessity, and black square retained; Finding 3 affects punctuation only |
| 331 | Both complete correctness questions retained as section-36 boundary content |

Figure ownership and source visual objects were checked from the original pages,
not from modern figures or answer material:

| Figure | Required Owner | Candidate Ownership / Caption Result |
| --- | --- | --- |
| 127 | Solved 313, section 34 | In the interrupted open 313 object, followed by its continuation; caption shares the `射影K和已知三角形的顶` baseline; correct |
| 128 | Section-35 construction and ensuing theory | Prose figure between the initial construction and continuation; no exercise owner attached; separate caption baseline; correct |
| 129 | Exercise 324, section 35 | Explicit `owner-ex 324` despite geometric proximity to 325; caption shares 325's final row without changing semantic owner; correct |
| 130 | Solved 330, section 35 | Explicit `owner-ex 330`, both source subfigures in one diagram; separate caption baseline; correct |
| 131 | Section-36 theorem-21 proof | Prose figure after the proof setup, not 330 or 331; caption shares setup's last row; correct |

No missing source object or additional formula/glyph/punctuation discrepancy was
identified beyond the three findings above. This is a source-content/ownership
review, not approval of downstream cropped/vector/modern assets.

## Independent Page-121 Counting Gate

The current `pages/0121/audit.json` reports:

```json
{
  "lines_printed": 25,
  "lines_md": 24,
  "errors": [
    "行数对不上：印刷 25 行，块体 24 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）"
  ]
}
```

The six-source baseline inventory and the separate authored-row count both give
**24** for 121. Its complete independent enumeration is:

| Baseline | Actual Source Content |
| ---: | --- |
| 1 | Both numbered angle cases, both angle hats and four vector-arrow accents; ends `(图` |
| 2 | `130，б).` continuation of case 2 |
| 3 | First dot-product value, then introduction of the second case |
| 4 | Second dot-product value, `-mn cos(varphi)` |
| 5 | Substitute into equation (1) and take the square root |
| 6 | Literal radical omitting `d^2` |
| 7 | Section 36 heading |
| 8 | Theorem 21 statement, first row |
| 9 | Theorem 21 statement, second row |
| 10 | Theorem 21 statement, third row |
| 11 | Proof setup, first row |
| 12 | `(AC)` normal and `(AB)` oblique |
| 13 | `(CB)` projection in `alpha` |
| 14 | Setup conclusion/reference to figure 131; caption 131 on the same baseline |
| 15 | Sufficiency, first row |
| 16 | Sufficiency, second row |
| 17 | Sufficiency conclusion using section 28/theorem 14 |
| 18 | Necessity, first row |
| 19 | Necessity conclusion and black square |
| 20 | Exercise heading |
| 21 | Exercise 331, first row |
| 22 | Exercise 331, second row |
| 23 | Exercise 331, third row |
| 24 | Footer 114 |

The hats/arrows above baseline 1 belong to that baseline's formulas; they are
not an omitted textual row. There is no source-backed 25th baseline to author.
The audit contains no band coordinates, so the exact detector band/mask
responsible was not inspected or established here. The parent owns that
technical counting repair separately.

**Count gate remains HOLD** until the parent's corrected machine evidence
agrees with the actual 24. Do not add a line, fake a `↵`, drop an accent,
split/rewrite the angle cases, exclude actual formula ink, edit source pixels,
or impose an expected-count override. No detector/source change was made here.

Current machine audits for 116-120 report respectively 25,25,19,25,19 with equal
authored totals and empty `errors`. All six current audits have empty
`unknown_chars`, `katex_warnings`, and `count_exclusions`. Those mechanical
checks do not override the literal transcription defects.

## Independent Mathematical Check: `p0121-math-1`

**Erratum scientific gate: PASS, confirmed mathematical printing omission.**
**Literal-source retention gate: PASS.**

The once-opened original 121 unmistakably prints, including its final full stop:

```latex
|AB|=\sqrt{m^2+n^2\pm2mn\cos\varphi}.
```

It has no `d^2`. Candidate line 62 preserves that literal. The registered
`original` is exactly `$|AB|=\sqrt{m^2+n^2\pm2mn\cos\varphi}$`, matching the
formula within the first current `ex 330 cont` block (`p0121#1`). It is not
registered against theorem 21 or an unrelated formula. The source PNG hash
matches the candidate `render.sha256`.

The claim is independently checked as follows; this derivation/counterexample
is review evidence only and is not substituted into the faithful source layer.
It does not adopt the candidate metadata's 90-degree numerical example.

On original 120, the polygon sum is

```latex
\overrightarrow{AB}=\vec m+\vec d+\vec n.
```

Squaring its norm and using the source's orthogonality relations gives

```latex
|AB|^2=m^2+d^2+n^2+2\vec m\cdot\vec n
      =m^2+d^2+n^2\pm2mn\cos\varphi.
```

Only the mixed terms involving `vec d` vanish. The term `vec d dot vec d=d^2`
does not vanish: `d` is the nonzero common-perpendicular length of skew lines.
The printed final radical therefore cannot follow from equation (1).

An independent exact-coordinate counterexample covers both printed cases:

```text
a(t) = (t, 0, 0)
b(s) = (s/2, sqrt(3)*s/2, 4)
M = (0, 0, 0), N = (0, 0, 4)
phi = 60 degrees, d = 4
B = (3/2, 3*sqrt(3)/2, 4), n = 3
```

These lines are nonparallel and disjoint (different fixed `z`), hence skew.
`MN` is perpendicular to both. With `A=(-2,0,0)`, `m=2`, the directed vectors
`AM,NB` make 60 degrees, and

```text
|AB|^2 = (7/2)^2 + (3*sqrt(3)/2)^2 + 4^2 = 35.
Printed plus-case radicand = 2^2 + 3^2 + 2*2*3*(1/2) = 19.
```

With `A=(2,0,0)`, `m=2`, those vectors make 120 degrees, and

```text
|AB|^2 = (-1/2)^2 + (3*sqrt(3)/2)^2 + 4^2 = 23.
Printed minus-case radicand = 2^2 + 3^2 - 2*2*3*(1/2) = 7.
```

Both discrepancies are exactly `d^2=16`. Thus the registered omission is
scientifically established, not a mathematical-idiom preference. Keep the
printed radical unchanged forever in the faithful layer and keep the erratum
registration. No modern/answer/choice correction was reviewed or authorized.

## Closure And Gate Findings

- **Section 34 source-object closure: PASS.** Text-only 115 establishes the
  section; 116 retains the zero-distance theorem ending. Exactly exercises
  310-323 (14 objects) belong to it. Solved 313 spans 116-117 and closes.
  Section 34 ends immediately before the actual section-35 heading on 118.
  Literal-fidelity approval remains HOLD for 319-320 until Finding 1 is fixed.
- **Section 35 source-object closure: PASS.** Full construction, definition,
  proof and note are retained as whole theory. Exactly exercises 324-330
  (7 objects) belong to it. 327 closes on 120; full solved 330 closes on 121
  before the actual section-36 heading. Literal-fidelity approval remains HOLD
  for Finding 2; the separate 121 count gate remains HOLD.
- **Section 36 boundary retention: PASS, completion NOT granted.** Heading,
  complete theorem 21 and its full two-direction proof, figure 131, exercise
  heading and complete 331 are preserved. No later boundary was acquired;
  this review does not declare section 36 complete. Finding 3 must be fixed.
- **Figure ownership: PASS** for 127/313, 128/construction 35, 129/324,
  130/330, 131/theorem 21 under section 36.
- **Erratum `p0121-math-1`: PASS**, with source literal retained.
- **Overall faithful-source gate: HOLD**, for Findings 1-3 plus the unresolved
  parent's 121 machine count. No broader rewriting is indicated.

Only affected edits are reported above. No second substantive review, no
authoring/fixing of the source, and no production stage was performed.

## Evidence Bindings

Candidate paths share prefix
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`.
Source paths share the durable evidence prefixes given above.

| Physical | Original PNG SHA-256 | Reviewed `page.md` SHA-256 |
| --- | --- | --- |
| 116 | `9299d5a4ebcb6435e9d9a2aeb0f9152bb0660316114304ec177a46116e076b84` | `eaf090f0fc3f22a275330470c80b2855a4da16b300bde1967ef867fbef4ffdec` |
| 117 | `f52366264a5915b86c55c4f82213f0f99ae34f3b0b601b53b46b4fd7853d0bab` | `89cfdcd2709cdc671354a3543d4113ba5b188cb57846527d9321674f7f44d9ef` |
| 118 | `ac26f939fda93e354772bc4a7a190459153875f566902ed2b20ade8a9d47a6b4` | `20e393b222e9a384b78034896b32a70fb2aa23a3def4883d79a3b0a67fffecc5` |
| 119 | `1c1aafc1894a12403cfb67c0c03fd297688ce95cc7b816b731d55bb0253a7a07` | `119baa6328a7b4093b2797c6c5f5a5fe2dc306e5f3d23ae2a9394fa489772893` |
| 120 | `dca58e514d30dd7c6f465676e242ba1b6cc28b1cedca173e0c7bad5c48ac565e` | `e88dd3425ad578cd0fe2660512451333bbf627464515b94443f16a1690bf9f27` |
| 121 | `52524665970229be72997141949f488c32a354fb2f33877caf60c7c8e210ab5e` | `9d52cc4ba630c16f434fd4bbf1869a9a183c92a1326c891fdcff1b5ceb9d72fc` |

Additional read-only bindings:

- `pages/0115/page.md` (text boundary only):
  `828a6fb5b0e12ff9c7b7e12ed440a0ac2b7da76953ead217d1b10a15d34e8df9`.
- `pages/0121/page.json`:
  `30713ce7b2ef0c5ce8166521c8a37f0170ba4519ebf66713931fd7cae34926ce`.
- `pages/0121/audit.json`:
  `f7939d2d2fe3f8ba160d588d2b4183d736af14c69ce43291c329f2aeea308029`.

All six reviewed `page.md` hashes were rechecked at close and remained unchanged.
The current 121 JSON also retains the same erratum in `meta.errata` and the
six-row first block as `ex 330 cont`. This was a read-only binding check, not
another substantive review.

The two ROIs were emitted directly from the existing PNGs in memory, through
the existing lesson virtual environment's Pillow, with explicit absolute cwd
and input paths. No crop file, source alteration, or installation was made.
Two prior Sharp-loading attempts failed before any image was emitted or source
PNG loaded; they consumed zero displayed images and did not create evidence
files. This technical recovery is not an extra content review.

Final image ledger: original 116,117,118,119,120,121 once each; native ROI of
117 for `l` glyphs; native ROI of 121 for necessity punctuation. **8/8 batch,
8/24 context.** The parent receives only this text report's path/hash and
findings, not image payload/history.

## Affected-Only Text Disposition, 2026-11-18

**Disposition: PASS.** This is verification of the parent's exact affected edits
against this report's existing source records, not a second substantive review.
The prior HOLD for Findings 1-3 and the page-121 count gate is resolved for the
current bindings below. The original review and its historical failure bindings
remain intact above.

No image was opened, reopened, cropped, or emitted. No additional source
acquisition, mathematical re-review, detector inspection, finalizer run, or
production stage was performed. Only this owned report was appended.

### Exact Affected Lines

- `pages/0117/page.md:71`: exercise 319 now has `距离为$l$`, exactly as Finding 1
  required.
- `pages/0117/page.md:74`: both exercise-320 comparisons now use `$l$`, exactly
  as Finding 1 required. All three corrected glyphs are verified.
- `pages/0120/page.md:77`: the unchanged squared vector equation now ends
  `$. (1)`, restoring exactly the printed full stop required by Finding 2.
- `pages/0121/page.md:91`: the necessity conclusion is now
  `$m\perp(ABC)$，因此，$m\perp(CB)$. $\blacksquare$`,
  exactly as Finding 3 required.

The retained pre-edit Markdown for 117/120/121 under
`evidence/batch012-source117120121-before-review-edits/<NNNN>/page.md`
hashes exactly to the corresponding original reviewed Markdown bindings above.
Only the affected and explicitly protected lines were compared for this
disposition; no fresh whole-page semantic review was conducted.

### Protected Literals And Count Gate

- `0117:45`: the genuine `$b$` in exercise 314 is unchanged.
- `0117:62`: the genuine distance `$b$` in exercise 317 is unchanged.
- `0117:63`: the literal `$|AC|=|BD|=C$` retains uppercase `C` unchanged.
- `0121:62`: `$|AB|=\sqrt{m^2+n^2\pm2mn\cos\varphi}$.` is unchanged.
  The faithful source radical still omits `d^2`; no correction was substituted.
  The existing independent erratum disposition is not reopened.
- Current `pages/0121/audit.json` independently checked:
  `lines_printed=24`, `lines_md=24`, `errors=[]`, `count_exclusions=[]`,
  `normalizations=[]`, `unknown_chars=[]`, `katex_warnings=[]`, `errata=1`.
  This matches the existing independent 24-baseline source inventory; the
  prior extra counted band is no longer a current gate failure.

The parent reports affected-only finalization of 117/120/121 returned
25/25,19/19,24/24, all exit 0, without post-edit body changes, source edits, or
count exclusions. Those commands were not rerun here. The current 121 audit
confirms its reported count result. The retained historical 25/24 failure under
`evidence/batch012-source121-first-count-failure` was not modified or reopened.
The detector repair itself is outside this affected-text verification.

Section-34 and section-35 object closure, all five figure owners, and literal
erratum retention remain as previously reviewed. Section 36 remains fully
retained boundary content, **not a completed lesson**. This PASS approves only
the affected faithful-source disposition; it grants no modern/answer/choice,
publication, or deployment approval.

### Current Bindings

Paths below are relative to
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/`.

| Current Artifact | SHA-256 |
| --- | --- |
| `pages/0117/page.md` | `4aa597e673242c257da9d3c6e880bc914d768b7c3e05dbe8b5c989109e3ea148` |
| `pages/0120/page.md` | `e0ffdbbdbd07646d37f62465ea028c792b388ad46b01a971bb6d455af1df5781` |
| `pages/0121/page.md` | `256eac87d1e0e659c308f7a6ff6f5767158b19f1ab38b4a9f123de1b1509f4fc` |
| `pages/0121/audit.json` | `bbed047eba8e974c9710140d34d8e6d3eadd69296f907532a99263a14ef85dfd` |

Additional image usage: **0**. Cumulative image usage remains **8/8 batch,
8/24 context**. No Git, database, publish, deploy, worktree, agent-creation, or
chat-messaging operation was performed.
