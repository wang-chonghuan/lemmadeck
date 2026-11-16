# 10c physical31-34: independent original-first StageA freeze

Reviewer: Dalton. Ticket STEMROBIN-184. Date: 2026-11-16.
StageA ONLY, completed before any new-page author disclosure. This is an
independent pixel/text expectation, not a review of a transcription and not
semantic acceptance from a mechanical line count.

## Scope and Evidence

Each actual prepared original was opened separately once at original detail:
`.tmp/ld-s10y-lesson/10c/pages/0031/page.png`,
`0032/page.png`, `0033/page.png`, `0034/page.png`.
No grid, layout, page template, author page.md/page.json/audit, author report,
modern text, answers, choices, detector/counter output or future crop was read.
No prepare/finalize/counter/render/browser operation was executed.

Read cap1 of the current lesson skill for the original-line/figure/open-cont
contract. The only prior-batch context reused is the narrow textual tail of
the already frozen27-30 review: physical30 named figures16/17 for example2,
began the next graph-construction subsection, and did not close unit81.
No passed original or crop was reopened; no earlier source verdict was redone.

Printed page numbers are read directly from these images:25/26/27/28.
They agree with physical31/32/33/34 at the stated offset+6; no index/TOC was
changed or used to invent a boundary.

All four images are1695x2580, RGB. File SHA hashes the PNG's actual bytes.
Pixel SHA hashes the decoded RGB bytes from `PIL.Image.tobytes()`, row-major,
without conversion/crop/overlay; mode and dimensions above identify this
representation. The decoded-pixel check is a read-only hash, not row detection.

| Physical / printed | PNG bytes | File SHA-256 | Decoded RGB pixel SHA-256 |
| --- | ---: | --- | --- |
| 31 /25 | 58359 | `b2856ca9834afd57d5601063a70542c97622853e8523509825660a09763ab925` | `2fb17beccb6ff153cb13d01d3923352229711101667568ec54b2b90f5c3da2ec` |
| 32 /26 | 72920 | `e39cf79620b4dc3893705be0518cf6a8829dd109b2d59a99224687f31804bcce` | `50f1a935a2cf6e362a4a1b32369a9f40794a9f763f48748fb35f6d7bba668719` |
| 33 /27 | 66679 | `1c33b9c2eb95900dd1077b31011517f5dbf06922371aaf2955fc1ac3c4c75c35` | `1df63797ccf00a1c50c162b1fb5baf8ae3a2b5a7f1952ef319e2c9190e22a070` |
| 34 /28 | 82052 | `a222c82da6a63df836b245a25c8075fe03f5c20ec538aaa9d61f33d80e61d1de` | `86abe74d768b2d36f47cb70555d0a265db30e4c532e14e68c4c9ff6f5d4cf1a6` |

Formula descriptions below use LaTeX to identify what is printed, not an
official transcription token stream. No mathematical correction, solution or
modern normalization is performed. Figure coordinates are approximate visual
anchors/domain estimates in the full original, never approved crop boxes or
measured mathematical givens.

## Physical31 / Printed25

### Complete Object Inventory

1. Whole figure16 at the top, with two curves in a single coordinate frame.
2. Separate printed caption `图 16`.
3. Whole figure17 below, with its own complete shared coordinate frame.
4. Separate printed caption `图 17`.
5. A right-pointing filled triangular opening marker before the graph-transform
   explanation. It belongs to the printed explanation, not a scan-noise spot.
6. First explanation paragraph including a separately displayed `y=cos x`.
7. Second explanation paragraph about signed horizontal translation.
8. Printed footer `25` with flanking dark dots.

No h3 title, exercise heading, numbered written task, table or teaching
footnote is printed on this page.

### Independent Printed-Row Observation

Figure lettering/curve labels belong to their figure pixels and are not
separate body rows. Outside the two figure domains, I observe six explanatory
body/formula rows, two caption rows, and one footer row:9 physical print rows
total under that decomposition. This number is a manual observation, not
a requested detector expected value.

| Manual row | Actual printed content / row identity |
| --- | --- |
| R01 | 图 16 caption |
| R02 | 图 17 caption |
| R03 | Opening triangle; 按照上面规定的图象变换规则第三条，由 |
| R04 | Separately displayed `$y=\cos x$` |
| R05 | 的图象，通过向 `$Oy$` 轴以 `$1:\frac{1}{\omega}$` 的比例压缩，就可得出函数 |
| R06 | `$\cos\omega x$` 的图象. |
| R07 | 由这个图象，通过向右（当 `$\varphi<0$` 时）或向左（当 `$\varphi>0$` 时） |
| R08 | 平移 `$\frac{|\varphi|}{\omega}$` 的距离得出函数 `$\cos(\omega x+\varphi)$` 的图象. |
| R09 | Footer25 |

R05 and R08 each contain a tall fraction on a single physical printed row.
The numerator/denominator are not two new body rows. R04 really is a separate
display row; it is not merged into R03 by sentence-based reflow.

The actual mathematical identities are cos x, cos(omega x),
cos(omega x+varphi), the axis name Oy, compression ratio1:1/omega,
signed cases varphi<0 versus varphi>0, and absolute translation distance
|varphi|/omega. Preserve the inequality directions and the absolute-value
bars; do not derive a new transformation order or replace the printed ratios.

### Figure16: All Visible Source Structure

- One x/y coordinate frame with a right-pointing horizontal arrow and upward
  vertical arrow; negative vertical-axis continuation remains below x.
- Solid broad cosine-like trace, explicitly labelled
  `$y=\cos\frac{x}{2}$`; dashed faster trace, explicitly labelled
  `$y=\cos x$`. The two are not separate frames.
- Both traces pass through the common visible crest on the y axis. Solid
  trace crosses the x axis at the visibly labelled -pi and pi positions and
  continues to outer trough portions; dashed trace has its own intervening
  crossings/troughs/outer crests.
- Printed x-axis labels `-π`, `π`, `2π`, plus the oval origin glyph.
  No printed numerical1 at the common crest is visible; do not add one.
- The x/y letter labels, arrows, left/right finite curve ends and all dashed
  portions remain required. No grid, hatching, tangent, point disks or source
  dimensions are present.
- Rough full figure-domain observation: x235-1455, y293-615. Caption is
  separate around x815-925,y655-689. These are not crop-acceptance boxes.

### Figure17: All Visible Source Structure

- Separate full x/y frame; right x arrow, upward y arrow, vertical continuation
  to below the lower troughs, origin oval glyph.
- Thick high-frequency solid trace labelled `$y=\cos20x$`; a broad dashed
  arch labelled `$y=\cos x$`. Preserve the literal20 coefficient and both
  label-to-style identities.
- Five visible high solid crests, four low solid troughs between them; the
  solid trace's left/right drawn ends lie near the x-axis span. No extra
  periods or inferred endpoints may be filled beyond the printed trace.
- Dashed broad curve passes through/near the central crest and extends
  visibly left and right; it must not be dropped as an auxiliary caption.
- Printed positive x labels `$\frac{\pi}{10}$` and `$\frac{\pi}{5}$`;
  printed lower y label `-1`. No extra x ticks/crest1 label should be invented.
- There is no arrowhead on a curve, no grid or numerical phase annotation.
- Rough full domain: x475-1238,y728-1578. Separate caption around
  x818-930,y1605-1644.

### Boundary and Unknowns

Figures16/17 close the two delayed apparatus references in the already
frozen physical30 example2. They do not create a new empty exercise-cont block.
The bottom sentence itself ends after the graph of cos(omega x+varphi),
but the triangle-opened construction argument is not complete here:
physical32 begins with “最后” and supplies the remaining compression.

The oval origin glyph in both figures is visually present but Latin O versus
digit0 is not independently fixed as a font/code-point identity by these
pixels. Treat this as label typography uncertainty, not an extra coordinate
value guessed from cosine mathematics.

A thin upper edge trace, a lower edge trace and scattered margin spots are
visible. They are not prose or extra figures. No count exclusion is authored
or approved from this observation.

## Physical32 / Printed26

### Complete Object Inventory

1. Two-row continuation of the graph-transformation explanation, ending with
   a filled left-pointing triangular closing marker on its second row.
2. A general summary sentence and its three transformations, printed over
   two further rows.
3. Example3 heading embedded in its first prose row:
   `$y=3\cos(2x+4)$`, followed by three separately printed transformation rows.
4. Whole figure18, separate caption `图 18`.
5. Whole figure19, separate caption `图 19`.
6. Footer26 with flanking dark dots.

The source example is not a numbered written exercise. Figure20 is explicitly
named in its third step but is not printed on physical32.

### Independent Printed-Row Observation

Ten body/example rows, two figure-caption rows, one footer row:13 manually
observed physical rows, apart from figure-internal lettering.

| Manual row | Actual printed content / row identity |
| --- | --- |
| R01 | 最后，按照第二条规则，由这个函数的图象，通过向 `$Ox$` 轴 |
| R02 | 以 `$k=\frac{1}{A}$` 的比例压缩，就得到所给出的函数(1)的图象. Closing triangle |
| R03 | 函数(1)的图象由余弦函数的图象通过下列变换得到： |
| R04 | `1)` 向 `$Oy$` 轴以 `$1:\frac{1}{\omega}$` 的比例压缩；`2)` 平移 `$\vec r(-\frac{\varphi}{\omega},0)$`；`3)` 向 |
| R05 | `$Ox$` 轴以 `$1:A$` 的比例压缩. |
| R06 | 例3；函数 `$y=3\cos(2x+4)$` 的图象由余弦函数的图象 |
| R07 | 通过下列变换得到： |
| R08 | `1)` 向 `$Oy$` 轴以 `$1:\frac{1}{2}$` 的比例压缩(图18)； |
| R09 | `2)` 平移 `$\vec r(-2,0)$` (图19)； |
| R10 | `3)` 向 `$Ox$` 轴以 `$1:3$` 的比例压缩(图20). |
| R11 | 图18 caption |
| R12 | 图19 caption |
| R13 | Footer26 |

Keep the source's distinct literal forms k=1/A in R02 and1:A in R05,
not a rewritten common ratio. R04's omega fraction and vector coordinates
share one row; R08's1/2 is also on one row. R04/R05 is a broken prose/list
line, not permission to drop step3 or to create a spurious formula-only row.
Vectors have an actual arrow over r and ordered coordinates; the two minus
signs in -varphi/omega and -2 are printed.

### Figure18: Complete Source Apparatus

- One full x/y coordinate frame with right and upward arrows and downward
  y-axis continuation.
- Thick faster solid wave labelled `$y=\cos2x$`; a slower dashed wave in the
  same frame. A separate literal label y=cos x is not visibly printed here;
  do not turn interpretation of that dashed reference into a recovered label.
- Three clear interior solid crests, four troughs and the printed left/right
  outer ascending/crest portions remain. Dashed curve retains its outer
  portions, central crest and two flanking broad troughs.
- Printed positive x positions π and2π, plus the oval origin glyph.
  No printed -π/-2π, y1/-1 or equal-distance marks are visible.
- y letter is printed. The horizontal arrow is present, but no clear separate
  x letter at its right end is observed in this figure; do not invent one.
- Rough full domain: x215-1320,y1303-1578; caption separate around
  x738-850,y1628-1666.

### Figure19: Complete Source Apparatus

- Separate x/y axes, complete right/up arrows and negative vertical extent.
  x/y letters and oval origin glyph are present.
- Solid shifted wave explicitly labelled `$y=\cos(2x+4)$`, versus a dashed
  same-frequency reference wave at another horizontal phase. Preserve both
  complete traces and their solid/dashed identities; the dashed trace is not
  an extra answer function to label by inference.
- Four full visible solid crests, intervening troughs, and finite outer end
  portions remain; all dashed reference portions remain.
- A dashed vertical guide drops from a solid crest to the x axis at the
  printed `-2` position. Keep the guide and literal minus sign together.
  No π ticks, amplitude1 or extra guide label are printed.
- Rough full domain: x143-1383,y1798-2118; caption separate around
  x738-850,y2180-2217.

### Boundary and Unknowns

R01/R02 genuinely continue physical31's argument; the closing triangle is
printed and closes that explanation. The following summary and example3
are new text objects, not continuation of a written task.

Example3's prose and all three transformations finish on this page, but its
figure20 apparatus reference stays open until physical33. Figures18/19 are
present here; no claim that all apparatus already closed is allowed.
No written exercise is open at this bottom boundary.

Origin O/0 typography remains unresolved, not solved from the graph.
The dark top edge, long thin bottom edge and substantial black right-margin
trace near the lower figure/caption area are actual scan artifacts to retain
in the original. No figure/caption is merged with that trace; no exclusion
metadata or row-counter inference is approved here.

## Physical33 / Printed27

### Complete Object Inventory

1. Whole figure20 at the top, completing the prior example3 apparatus.
2. Separate `图 20` caption.
3. Printed exercise-column heading `习题`.
4. A two-row common prompt for tasks60-67 about obtaining function graphs
   from the graph of y=cos x.
5. Eight distinct written tasks60-67 in two columns and four shared print
   rows. Neither column may be discarded or recast as one task.
6. Full four-row starred written task68, all four ordered transformations and
   both requests retained.
7. Footer27 with flanking dark dots.

No h3 unit heading or teaching footnote is printed. Task68 has a raised
asterisk and a baseline dot; the star is source task notation, not a footnote
or permission to omit the task.

### Independent Printed-Row Observation

One caption row, one exercise-heading row, two common-prompt rows, four
two-column task rows, four long task68 rows, one footer row:13 physical
rows manually observed. The eight short task objects do not imply eight
physical rows. Fractions in one column do not turn a shared row into two.

| Manual row | Actual printed content / row identity |
| --- | --- |
| R01 | 图20 caption |
| R02 | 习题 heading |
| R03 | 通过怎样的变换可以由函数 `$y=\cos x$` 的图象得出下列函 |
| R04 | 数的图象？ |
| R05 | Left60 `$f(x)=\sin2x.$`; right61 `$f(x)=\cos(\frac{1}{3}x).$` |
| R06 | Left62 `$g(x)=4\sin x.$`; right63 `$g(x)=\frac{2}{3}\cos x.$` |
| R07 | Left64 v-like name `$(x)=\sin(x+\frac{\pi}{2}).$`; right65 same v-like name `$(x)=\cos(x-3).$` |
| R08 | Left66 `$F(x)=2\cos(3x-2).$`; right67 `$F(x)=\frac{1}{2}\sin(2x+5).$` |
| R09 | Starred68; 把函数 `$y=\cos x$` 的图象进行下列变换：`1)` 向 `$Oy$` 轴以 |
| R10 | `$1:\frac{1}{4}$` 的比例压缩；`2)` 平移 `$\vec r(\frac{1}{2},0)$`；`3)` 向 `$Ox$` 轴以 `$1:5$` |
| R11 | 的比例压缩；`4)` 平移 `$\vec r(0,-3).$` 得到什么函数的图象？ |
| R12 | 写出这个函数. |
| R13 | Footer27 |

The source variable pairs visibly differ in case/shape: f for60/61,
g-like lowercase for62/63, v-like lowercase for64/65, capital F for66/67.
Do not normalize all eight to f(x). The v-like glyph's exact Latin-v versus
Greek-nu code-point identity is not independently recovered from these pixels;
the common paired identity and lowercase shape are frozen, not guessed.

Task61 prints a parenthesized product `(1/3 x)`, not a source line broken
between numerator and denominator. Preserve sin versus cos, all coefficients,
the x+pi/2 and x-3 signs, 3x-2 and2x+5, and task68's ordered four operations.
The period associated with starred68 is a baseline period, while its
asterisk is raised; future transcription must retain both source glyph roles
rather than making the star a new exercise/subpart.

The common prompt belongs with all60-67. Task68 asks both what function's
graph results and to write the function; neither request may be silently
replaced by a choice/key or answered during StageA.

### Figure20: Complete Source Apparatus

- Whole coordinate frame, right x arrow, upward y arrow, complete negative
  vertical extent, x/y labels, oval origin glyph.
- Thick large-amplitude wave explicitly labelled `$y=3\cos(2x+4)$`;
  lower-amplitude dashed reference trace with the same drawn zero crossings
  and alternating phase pattern. No extra literal reference-function label
  is printed.
- Four full positive solid crests and four full negative troughs with finite
  left/right zero-level ends. All dashed positive/negative lobes remain.
- A dashed vertical guide at an earlier positive crest down to the x axis,
  plus a dashed horizontal guide from the y-axis height marked3 to another
  positive crest. Both guides and their junctions must remain.
- The vertical guide is **not** visibly labelled -2 in this figure, unlike
  figure19; do not add that label from prior mathematical context.
- Printed y height3; no -3 label, π ticks, grid, new point disks, amplitude
  dimension arrows or numerical period is visible.
- Rough full domain: x273-1440,y301-925. Separate caption around
  x815-925,y971-1008. It is one figure, not separate solid/reference panels.

### Boundary and Unknowns

Figure20 closes the delayed apparatus reference from physical32 example3.
It is before the exercise heading, not a diagram owned by60 or68.
The nine written tasks60-68 are complete on this page; task68 ends in
“写出这个函数.”, with no open written-task tail into physical34.
Physical34 begins a visibly new numbered unit82.

Origin O/0 and the v-like function-name code point remain honest typography
limits. No transformation result is inferred to resolve either. The upper
edge trace, lower dense scan line and isolated side spots are not exercises
or caption ink and are not approved count exclusions.

## Physical34 / Printed28

### Complete Object Inventory

1. New unit heading with baseline period: `82. 同周期的谐振动的合成`.
2. Three-row introductory prose on a sum of two harmonically varying quantities.
3. A full separately printed equation(1).
4. Two-row statement about equal frequencies, then separately printed equation(2).
5. Four-row discussion retaining the references to260 and the constants.
6. Paired definitions f1(t)/f2(t) on one actual display row.
7. “满足谐振动方程”, then paired double-prime equations on one display row.
8. The printed k=omega squared line.
9. “对于它们的和”, separate displayed f=f1+f2, and “求出：”.
10. A single derivation genuinely printed across two formula rows.
11. Two-row conclusion, explicitly referencing task70.
12. Footer28 with flanking dark dots.

No figure, figure caption, exercise heading, numbered new written task, table
or teaching footnote is printed on this page. References260/70 are references,
not newly selected source tasks or instructions to read their answers.

### Independent Printed-Row Observation

One heading plus22 body/formula rows and one footer:24 manually observed
physical rows. The two peers f1/f2 share a display row each. The final
derivation really occupies two distinct printed rows, unlike a tall fraction.

| Manual row | Actual printed content / row identity |
| --- | --- |
| R01 | `82. 同周期的谐振动的合成` |
| R02 | 在物理学中，常常遇到这样的量，它可以表示成作谐振动 |
| R03 | 的量的和. 在两项相加的情况下，这种量按照下面的规律随 |
| R04 | 时间变化： |
| R05 | `$f(t)=A_1\cos(\omega_1t+\varphi_1)+A_2\cos(\omega_2t+\varphi_2).$` with right tag(1) |
| R06 | 存在一个重要事实：如果频率 `$\omega_1$` 和 `$\omega_2$` 相同，那么和 `$f$` |
| R07 | 是谐振动： |
| R08 | `$f(t)=A\cos(\omega t+\varphi).$` with right tag(2) |
| R09 | 其中，`$\omega=\omega_1=\omega_2$`，如果知道常数 `$A_1,A_2,\varphi_1,\varphi_2$`，就可算出 |
| R10 | 常数 `$A$` 和 `$\varphi$`. 但是对应的公式是复杂的（参看第260题）. 现 |
| R11 | 在我们来说明，上面的一般性结论无[需/须字形暂未固定]烦琐的计算就可以证 |
| R12 | 明. 事实上，函数 |
| R13 | `$f_1(t)=A_1\cos(\omega t+\varphi_1),\quad f_2(t)=A_2\cos(\omega t+\varphi_2)$` |
| R14 | 满足谐振动方程 |
| R15 | `$f_1''(t)=-kf_1(t),\quad f_2''(t)=-kf_2(t),$` |
| R16 | 其中 `$k=\omega^2.$` |
| R17 | 对于它们的和 |
| R18 | `$f=f_1+f_2$` |
| R19 | 求出： |
| R20 | `$f''(t)=f_1''(t)+f_2''(t)=-kf_1(t)-kf_2(t)$` |
| R21 | `$=-k[f_1(t)+f_2(t)]=-kf(t),$` |
| R22 | 就是说，它也满足 `$k=\omega^2$` 的谐振动方程，因而可以写成(2)的 |
| R23 | 形式. 在第70题里，给出了另一种证明方法. |
| R24 | Footer28 |

Actual single-formula break identity, with one required printed break:

```text
f''(t)=f_1''(t)+f_2''(t)=-kf_1(t)-kf_2(t) ↵
=-k[f_1(t)+f_2(t)]=-kf(t),
```

The break is before the continuing equals sign; there are not separate
derivation objects whose algebraic continuation may be dropped. All minus
signs, square brackets, f1/f2 subscripts, double primes and final comma are
printed. The sums in R13/R15 are peer formulae on single rows, not two rows
merely because there are two identities.

R05 has the distinct omega1/omega2 subscripts; the later f1/f2 definitions
in R13 use common unsubscripted omega. R09's equality identifies all three.
Preserve A1/A2 versus A, varphi1/varphi2 versus varphi, k=omega^2 twice,
equation tags(1)/(2), and the original references260 and70. Do not infer a
positivity condition, alter a frequency definition, derive amplitudes/phases,
or use later exercises to “repair” any source formula.

### Boundary and Unknowns

The unit82 heading is a real new-unit boundary following completed81 tasks
on physical33. This page's derivation and concluding sentence end normally
after “证明方法.”; there is no truncated written task or formula at the
bottom. Unit82 as a whole is still open: physical35 and later source contents
have not been observed and are not declared closed.

R11's exact 需/须 glyph is left as a bounded text unknown. The surrounding
sentence, print-row location and full math are preserved; it is not a licence
to paraphrase or silently choose a neat wording. Phase-symbol code-point/font
variants are descriptive LaTeX here, not an independent recovery of a source
digital font. No mathematical decision depends on that typography.

The full-width top dark edge, lower thin edge and side spots are source-scan
observations, not extra prose rows or accepted exclusions. No geometry or
caption domain exists on this page to hide a text band.

## Frozen Batch Summary and Stop Boundary

| Physical / printed | Body/title/exhead/common-prompt/formula rows | Caption rows | Footer rows | Manual total | Actual figures | Written tasks |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| 31 /25 | 6 | 2 | 1 | 9 | 16,17 | none |
| 32 /26 | 10 | 2 | 1 | 13 | 18,19 | none; example3 is worked lesson prose |
| 33 /27 | 11 | 1 | 1 | 13 | 20 | 60-68, nine complete tasks |
| 34 /28 | 23 | 0 | 1 | 24 | none | none |

These are independent observations of physical print rows after keeping
figure-internal labels inside their figures. No page body counter, detector
band, author expected total or future audit was consulted. A later mechanical
FAIL by itself will not mean missing prose; only actual comparison can decide.
No exclusions, bbox/crop acceptance, counter change or source repair is given.

Closed observed links: physical30's figure16/17 references ->31;
physical31's transformation explanation ->32; physical32's figure20 ->33;
physical33's task68 ends before the new unit82 on34.
Open limits: unit82 beyond34 is not observed; no future exercise/group
boundary or formula is guessed.

This report freezes the complete authorized StageA expectation. It gives
no author page.md/JSON/audit/source-fidelity PASS, no finalize result and
no approval of a future author crop. Banach author files and the queued n79
repair are outside the inspected inputs.

Only this new ticket-scratch report was written with apply_patch. No source,
tool, template, app, dependency, index or formal artifact write; no
prepare/finalize/counter/browser/DB/Git/network or other-chat operation.
All prior n11/n12 outputs remain frozen and outside this new role.

STOP before author disclosure. StageB requires the parent's immutable handoff.
