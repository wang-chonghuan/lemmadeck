# 10c Source Review: Physical Pages 11-14

Date: 2026-11-15. Ticket: STEMROBIN-184.
Role: independent source reviewer, not the author of these pages.
Scope: source fidelity/counts/objects/crops only; no answers or choices.

Each source-only inventory below was frozen before opening that page's MD,
JSON, layout inventory or audit. Final comparisons are appended after those
inventories; the frozen source observations are retained.

## Final Result

**REVISE**, two definite transcription differences and three retained count
failures. No source/tool/audit file was edited by this reviewer.

| Page | Independent actual rows | Current machine / MD | Source fidelity |
| --- | --- | --- | --- |
|11|20|21 / 20, FAIL|REVISE: omitted multiplication dot|
|12|23|23 / 23|PASS, including figure2; fragment warnings retained|
|13|21|22 / 21, FAIL|REVISE: period changed to comma|
|14|21|22 / 21, FAIL|PASS for text/boundary; page gate still FAIL|

1. **p11, JSON `/blocks/7/lines/0`** (author's one-based p0011#8):
   source prints `y-0=1·(x-0)`, but MD and JSON have
   `$y-0=1(x-0)$`. Restore only the printed multiplication dot, represented
   as `\cdot`. Algebraic equivalence does not restore a missing source glyph.
2. **p13, JSON `/blocks/4/lines/0`** (author's one-based p0013#5):
   the source sentence ends `关于函数cos连续性的假设.`; MD and JSON end
   `关于函数 $\cos$ 连续性的假设，`. Restore only the final comma to
   the profile's ASCII period. It is a completed sentence before `现在证明`.

Both differences were independently observed in the full source scans and
confirmed in two direct source cells displayed from memory, not saved as
additional evidence files. No answer was solved for this source review.

## Physical 11 / Printed 5: Frozen Source Observation

Opened the full clean original once, before any p11 transcription/audit:
`.tmp/ld-s10y-lesson/10c/pages/0011/page.png`, 1695x2580.
SHA-256:
`d2506c3d35f8250897bbfdbbe6ea9547777161459acef9b7ea4c9aa028dd211b`.

Independent printed-row inventory:

| Source rows | Object / content | Rows |
| --- | --- | --- |
|1|Continuation: `的正弦函数和余弦函数的导函数公式：`|1|
|2-3|tg derivative quotient, then numerator `cos^2 x+sin^2 x` and final `1/cos^2 x`|2|
|4-5|ctg derivative quotient, then numerator `-sin^2 x-cos^2 x` and final `-1/sin^2 x`|2|
|6-7|Example: tangent at abscissae x1=0, x2=pi/2, x3=pi; continuation `的切线.`|2|
|8-9|Tangent-form introduction, reference52, point `(x0,y0)` and `y0=f(x0)`|2|
|10|`y-y0=f'(x0)(x-x0)`|1|
|11-13|Three prose rows: f(x)=sin x; derivative values at0, pi/2, pi; `f'(0)=cos0=1`, then `其次，我们求出`|3|
|14|`f'(pi/2)=cos(pi/2)=0` and `f'(pi)=cos pi=-1`, same print row|1|
|15|`因此：`|1|
|16-18|Case1 tangent equation and y=x; quadrants I/III bisector; reference图2|3|
|19|Case2: x2=pi/2, ending `切线方程是`|1|
|20|Decorated folio `· 5 ·`|1|

Total: **19 non-foot printed rows + 1 foot = 20**. Both tall derivative
calculations occupy two source rows, not one row per numerator/denominator.
The pi/2 fractions in prose and the derivative-values row are not extra rows.

No figure appears on this page. 图2 is a reference within the tangent
discussion; do not attach an invented figure here. The final case2 paragraph
is open across the page boundary; it has not yet printed the tangent equation.
The opening line continues an earlier object. No new unit heading or exercise
number appears on p11.

Formula details frozen from pixels:

- tg x = sin x / cos x; quotient numerator
  `(sin x)' cos x - (cos x)' sin x`, denominator `cos^2 x`.
- ctg x = cos x / sin x; numerator
  `(cos x)' sin x - (sin x)' cos x`, denominator `sin^2 x`.
- The following simplified ctg numerator has both negative terms.
- Case1 prints `y-0=1·(x-0)` and `y=x`; point `(0,0)` and 图2 are explicit.

Visible nonprinted marks: thin upper scan-edge line, lower scan-edge rule/
irregular right-end corner, and isolated outer-left dark spots. These are not
figure objects or printed prose. Exact count relevance and legal candidate
boxes are not inferred before reading the retained bands.

## Physical 12 / Printed 6: Frozen Source Observation

Opened the full clean original once before p12 MD/JSON/audit/layout.
Source is 1695x2580; SHA-256:
`1e620fa15b61252d74be17106c054d94eace73c098f0e4582b556bd380a2fc5d`.

| Source rows | Object / content | Rows |
| --- | --- | --- |
|1|Case2 continuation `y-1=0·(x-pi/2)`|1|
|2-3|`就是y=1. 它是水平直线` and `(图2).`|2|
|4-6|Case3, x3=pi; equation `y-0=(-1)(x-pi)`, final `y=pi-x`|3|
|5, shared|Caption 图2 beside the middle row of case3|0 additional|
|7|习题|1|
|8|求下列函数的导函数：|1|
|9-18|Exercises15-24, one physical row each|10|
|19|Exercises25 and26, same printed row|1|
|20-21|Exercises27 and28, one printed row each|2|
|22|求下列函数图象的切线方程：|1|
|23|Decorated folio `· 6 ·`|1|

Total: **22 non-foot rows + 1 foot = 23**. Caption2 adds no new row.
The full fraction in22 and the pi/4 in20 are single-row formulas.

Source exercise formulas frozen without solving:

-15 `f(x)=1.3 cos x`;16 `h(x)=3 cos(2.3x-10pi)`.
-17 `g(x)=2pi-0.5 cos(pi-x)`;18 `u(x)=2x^2-30 cos(5x+6)`.
-19 `v(x)=-2 cos(x-pi)+2 sin2x`.
-20 `v(x)=5 tg(2x+3)+2 tg(pi/4)`;21 `s(x)=3 tg(2x+1)`.
-22 `s(x)=2 sin(6x+3)/cos(6x+3)+tg(6x+3)`: numerator has
  coefficient2, and the repeated argument has constant3.
-23 `f(u)=cos2u sin u+sin2u cos u`.
-24 `g(t)=cos2pi cos3t+sin3t sin2pi`: the constants are2pi,
  not2t.
-25 `v(t)=4 ctg(2t+3)` and26 `v(x)=7 ctg(2x-2pi)` share a row.
-27 `f(x)=cos2.5x sin0.5x+sin2.5x cos0.5x`.
-28 `f(x)=sin x cos5x-sin5x cos x`.

One actual source figure: **图2**, belonging to the prose tangent example,
not an exercise. It contains x/y axes and origin0, a negative-lobe and
positive-lobe sine-curve segment, an increasing straight tangent through the
origin, and a horizontal tangent near the positive crest. No numerical pi
tick labels or third descending tangent are visibly supplied; do not add
them to the source inventory. The source caption is outside the figure ink.

The opening continues p11's unfinished case2. Case3 closes on this page.
The final tangent-exercise heading carries forward to the next page's
numbered exercises; no exercise29 appears here. Unit76 does not close here.
Top and bottom scan rules and isolated outer-right marks are nonprinted.
Their count relevance/legal boxes remain to be determined from actual bands.

## Physical 13 / Printed 7: Frozen Source Observation

Opened the full clean original once before p13 MD/JSON/audit/layout.
Source is 1695x2580; SHA-256:
`8e9d01f20793ac4102ca75c2d2cd97f68baa685a32cc8c16dfe253a95015d12f`.

| Source rows | Object / content | Rows |
| --- | --- | --- |
|1-3|Exercises29,30,31, one source row each|3|
|4|`77*. 三角函数的连续性`|1|
|5-7|Three-row introduction: assumption about cos in75; continuity of sin,tg,ctg at all defined points; preparatory theorem|3|
|8|`预备定理 对于满足条件`|1|
|9|`0<|x|<pi/2`|1|
|10|`所有x的值，不等式`|1|
|11|`|sin x|<|x|<|tg x|` and `(1)`, same row|1|
|12|`成立.`|1|
|13-16|Four prose rows starting positive-x proof and naming triangle/sector areas, ending `这些面积很容易算出：`|4|
|14, shared|Caption 图3 next to the second proof-prose row|0 additional|
|17|`S_OAD=1/2·|OA|·|OD|·sin x=1/2 sin x`|1|
|18-20|Three printed footnote rows, below a separator rule|3|
|21|Decorated folio `· 7 ·`|1|

Total: **20 non-foot printed rows + 1 folio = 21**. The instructional
footnote contributes three rows. The separator is not a printed text row.
Both displayed inequalities and the full area formula are single source rows.

29 prints `f(x)=sin x`, abscissae `-pi` and `pi/2`.
30 prints `s(x)=cos x`, abscissae `-pi/2` and `2pi`.
31 prints `g(x)=tg x`, abscissae `0` and `pi/4`.
All three exercises close here. Unit76 closes before the new77 heading;
the tangent-exercise common heading on p12 governs these exercises.

77 has the supplemental-material star and discusses cos, sin, tg and ctg
only at points where each is defined. The theorem has strict inequalities
and the absolute values in both its condition and conclusion.
The positive-x proof names `S_OAD` (triangle OAD), `S_OAB` (triangle OAB),
and `S_OACD` (sector OACD), explicitly referencing图3.
The argument is not complete after the first area formula; preserve its
continuation across the next page.

One source figure: **图3**, a body-proof figure, not an exercise figure.
Inventory: O at lower left, A lower right, B above A, D along OB between
O and B, C marking the curved arc between A and D, x marking the angle at O.
Straight edges OA, AB, OB, the chord DA, and the arc A-C-D are visible.
There is no complete drawn circle, added unit-length label, or extra point.
The caption lies outside the figure and shares the proof-prose row.

The three-row footnote explains starred supplemental material, says it is
not required for every pupil, describes filled right-/left-pointing triangle
marks at the beginning/end of supplemental text, and cites pages13-15.
Both directional triangle glyphs are part of the printed footnote, not scan
noise. The thin horizontal footnote separator and top/bottom scan edges are
non-text. Isolated outer-left spots are also nonprinted.

## Physical 14 / Printed 8: Frozen Source Observation

Opened the full clean original once before p14 MD/JSON/audit/layout.
Source is 1695x2580; SHA-256:
`e80f1a0426addcc31f3679d8eb5ea8b52815453b7ba20384565ce369849b1bee`.

| Source rows | Object / content | Rows |
| --- | --- | --- |
|1|`S_OAB=1/2·|OA|·|AB|=1/2 tg x`|1|
|2|`S_OACD=1/2 r^2·x=1/2 x`|1|
|3|由图3看出，|1|
|4|`S_OAD<S_OACD<S_OAB`|1|
|5|或|1|
|6|`1/2 sin x<1/2 x<1/2 tg x`|1|
|7|就是|1|
|8|`sin x<x<tg x` and `(2)`, same row|1|
|9-10|Two-row positive-x conclusion, with `0<x<pi/2` and reference(1)|2|
|11-12|Two-row negative-x introduction: `-pi/2<x<0`, then `0<-x<pi/2` and application of(2)|2|
|13|`sin(-x)<-x<tg(-x)` and `(3)`, same row|1|
|14-15|Absolute-value substitutions and deriving(1) from(3)|2|
|16-17|Two-row completion of(1) for every nonzero x in `]-pi/2,pi/2[`|2|
|18-19|Theorem1: cosine continuous on the whole real axis; any `x0 in R`|2|
|20|`lim_(x->x0) cos x=cos x0`|1|
|21|Decorated folio `· 8 ·`|1|

Total: **20 non-foot printed rows + 1 foot = 21**. Fractions, limits and
the tall French interval delimiters do not create additional printed rows.
No exercise or new source figure appears here; the reference to图3 uses
the prior proof figure, not an independently owned p14 diagram.

The first two formulas continue p13's unfinished area-calculation list.
The area order, strict sine/tangent inequalities, negative-x range,
absolute-value substitutions and the explicit exclusion `x != 0` are printed.
The substitutions are `-x=|x|`, `sin(-x)=|sin x|`, `tg(-x)=|tg x|`.
The preliminary theorem proof reaches its conclusion here; the following
Theorem1 introduces a new statement, not a new numbered unit. Its printed
statement alone does not close77; no next-page proof is supplied by this review.

Nonprinted ink visible in the full scan: top/bottom scan-edge lines and
isolated right-margin dark spots. There is no handwritten mathematical
object to add to the source content. Count relevance will use actual bands,
not an assumed expected row count.

## Frozen-Source Comparison And Ownership

The MD and structured JSON agree with each other for the inspected lines,
flags, figures, footnotes and row breaks. That agreement is not substituted
for comparison against the independent source inventories above.

- p11: quotient derivative scopes, both two-row calculation breaks,
  example abscissae, derivative values, tangent-form introduction and
  quadrant description agree with the source, except the missing dot noted
  above. The first `p cont` agrees with the supplied approved p10 tail text;
  p10's scan and complete source documents were not reopened. Last `p open`
  ends before the case2 equation, exactly where the source page ends.
- p12: all14 expressions15-28, coefficient/decimal/argument/factor scopes
  and shared row25/26 match. The common derivative heading and final tangent
  heading remain exercise headings rather than new prose. The case2
  continuation closes; case3 uses the actual x3=pi line break and an
  open/cont split around figure2 for the y-0 equation. Caption2 is `samerow`
  with the second case3 line. No source expression is replaced by its answer.
- p13: exercises29-31 and their six specified abscissae match. They remain
  before77 and belong to76. The starred77 heading, strict/absolute-value
  theorem, five geometric point names, three area names, first area formula,
  and all three instructional footnote rows match, except the sentence-ending
  comma noted above. Both directional black triangles are preserved. Caption3
  is correctly `samerow`; the area-calculation paragraph remains open.
- p14: both remaining area formulas, squared radius, multiplications,
  positive-/negative-x ranges, strict inequalities, labels(1)/(2)/(3),
  absolute-value substitutions, nonzero-x restriction, French interval
  and theorem1 limit agree. The first `p cont` closes the p13 area list.
  The preliminary theorem proof closes here. The theorem1 statement itself
  ends with a period; there is no incomplete sentence requiring a fabricated
  `open` flag. **Unit77 nevertheless remains incomplete past p14.**

Unit76's source right boundary is the completion of31 before77 on p13.
This establishes ownership, not approval to assemble or publish the unit.

p12 audit preserves three `unicodeTextInMathMode` fragment warnings at p#5,
for `，`, `就`, `是`, with no errors. Its preceding block ends in `$y`;
the continuation begins `-0=(-1)(x-\pi)$`. Their source-backed concatenation
closes that math expression before the prose. No assembly or assembled KaTeX
validation was run, and these warnings were not cleared.

## Actual Figure Crops

Opened each current source crop separately after its page's source-first
inventory and comparison.

| Figure | Source-page box `[x,y,w,h]` | Actual crop size | Verdict |
| --- | --- | --- | --- |
|2|`[763,274,609,305]`|633x329 RGB|PASS|
|3|`[1015,1089,448,487]`|472x511 RGB|PASS|

Both crops preserve every visible source label/stroke in the frozen
inventories. Figure2 retains x/y/origin0, both curve lobes and both actual
tangents. Figure3 retains O/A/B/C/D/x, triangle edges, chord AD, arc A-C-D
and the angle mark. Neither loses an endpoint or contains its caption,
adjacent prose, margin blemishes or a newly invented geometric label.

A read-only pixel comparison found each actual RGB crop byte-for-byte
pixel-equal to the corresponding original-page rectangle with the existing
12-pixel crop padding. No resnap, crop regeneration or figure edit was run.
These are body figures:2 is the tangent example's figure,3 is77's proof
figure. Neither has exercise ownership. References across11/12 and13/14
do not create duplicate figures.

## Real Counter Failures And Local Evidence

After all source inventories were frozen, read the final author handoff and
retained audits once. The independent counts happened to agree with the
author's totals; they were not inferred from them.

To resolve the count failures, made one read-only `line_bands` observation
for each failed page11/13/14 using the current function and source pixels.
For13 only, reused the already inspected, exact figure3 rectangle in a
temporary counting copy, matching the existing finalizer's figure removal.
No prose, formula, caption, footnote, folio or noise exclusion was applied.
No figure was snapped again; no file or expected count was changed.

### p11 And p14

Their first20 and21 returned bands, respectively, correspond to the
independent printed rows including the folio. The sole extra band on each
is bottom scan-edge ink:

| Page | Extra inclusive y-band | Counting ink box `[x,y,w,h]` | Peak row ink |
| --- | --- | --- | --- |
|11|2453-2502|`[17,2453,1654,50]`|741|
|14|2470-2491|`[16,2470,1645,22]`|614|

p11 typical height38 gives a thin-band limit15.2, below the50-pixel
noise band's height. p14 typical height44 gives17.6, below22.
The direct source strips show broken horizontal scan-edge strokes, not
printed words, equations, diagram elements or page numbers. On11 a right-end
corner component `[1645,2453,26,38]` contributes to the high envelope.
On14 the joined sloping edge component `[187,2470,735,19]` contributes to
the envelope. No generalized threshold change is proposed.

### p13: Three Distinct Effects, Not One

The current observed count22 is the result of:

| Source / machine effect | Geometry | Delta |
| --- | --- | --- |
|Footnote separator counted as a row|y2024-2038, x224-707, 484x15; peak346|+1|
|Three real footnote rows counted as two|joined y2077-2230, height154|−1|
|Bottom scan edge counted as a row|y2472-2499, x35-1672, 1638x28; peak660|+1|

The separator is visually a rule above the star footnote, not a fourth
footnote row. With content width1695, its484-pixel envelope is below the
current wide-band cutoff508.5; the existing filter keeps it.

The three footnote rows are directly visible in the saved local source
crop. The observed expansion has typical height46, typical gap39.5 and
pitch85.5. For the154-pixel joined band it returns count2:

```text
strong_rows = [(2082,2185)]
glyph_rows, relative to2077 = [(1,52), (54,110), (114,153)]
returned subdivisions = [(2077,2153), (2154,2230)]
```

The actual footnote is three rows even though its row projection is joined
and the body-pitch estimate expands it to two. The third row `等等.` is
not disposable noise. No footnote text or triangle glyph may be masked.

The bottom strip additionally shows a genuine outer-edge stroke/corner,
not body content. A retained corner component starts at2459, above the
machine's2472 band start; the candidate below includes that actual source
corner rather than merely the returned band's range.

### Outer-5%-Only Candidates

For all pages here H=2580, so the lower5% begins at y2451.
The following **candidate scan-artifact rectangles**, in `[x,y,w,h]`, are
entirely inside that outer strip and contain only observed scan-edge ink:

| Page | Candidate | Scope / limitation |
| --- | --- | --- |
|11|`[0,2451,1695,60]`|Bottom border/corner only; folio ends2307|
|13|`[0,2451,1695,60]`|Bottom border/corner only; folio ends2310|
|14|`[0,2460,1695,40]`|Bottom border only; folio ends2294|

These are source-measured proposals only. No `count_exclusions` were added
and no candidate was applied to obtain a count. The slightly padded strips
cover the observed ink envelope without entering any body/footnote/folio row.
No right-margin spot exclusion is proposed: the source scans show spots,
but no additional counted spot-only row was established.

**Do not release p13 merely after excluding its bottom edge.** Separator+1
and footnote−1 would still cancel, potentially yielding the expected total
while remaining structurally wrong. Its interior separator is outside the
requested outer5%-only candidate scope; this report proposes no interior
box and no new counter code. The true three-row footnote must remain intact.

## Evidence And Hashes

Only this report and four direct, unprocessed counter-detail crops were
written by the reviewer. Original scans, transcriptions, JSON, audits,
figure crops and tools retain their initial bytes. Each complete page was
opened once, in order11,12,13,14. Additional glyph checks were memory-only:
`[1100,1875,1495,1945]` on11 and `[1210,805,1510,875]` on13.
No old full scan, answer/choice, service, browser, network, DB, publisher,
finalizer, assembler, adapter, commit or other-chat message was used.

Counter-crop rectangles are half-open `[left,top,right,bottom]`:

| Evidence in ticket tmp | Source rectangle | SHA-256 |
| --- | --- | --- |
|`transcription-review-10c-p11-bottom.png`|`[0,2447,1695,2510]`|`b2f6512feb3165c6eeeb440a045f5573327354feba4df5f57408781347690ea6`|
|`transcription-review-10c-p13-bottom.png`|`[0,2447,1695,2510]`|`d8b0eb7faa93807131bf2306e72d6049feb1d87726ef03a61cec771b5afaab19`|
|`transcription-review-10c-p14-bottom.png`|`[0,2447,1695,2510]`|`bcb96cc1223e57755960c787145ad1fe69e3dd00623fc7f41542694d55f59655`|
|`transcription-review-10c-p13-footnote-count.png`|`[210,2015,1500,2240]`|`fc6131746ad928dc9f776545c755dcf403faf3f4a23468e96bbd681bbeb8c227`|

Raw SHA-256 of compared persistent source files:

| Page | `page.md` | `page.json` | `audit.json` |
| --- | --- | --- | --- |
|11|`40eb4d4cc9406011a42d91146318b2c3145864c50c860c39b82bf0dc5fb556cc`|`8be944334f1020fe98ccd767aed0a2a5211b2991ead44e4ee26703d8a334fed5`|`b8857022b946bd5dcd30d04e759026eba2f95aed078c57cf939fc414fbfc46fb`|
|12|`563bb02861035c89585671fec5f218d7c6bd1addfc272dd437a6d6a6b3494c78`|`46ac63d3419c188d793d9f016073df312f872bb95a238c215561c6c0a5c2c053`|`49c5fd52018492ec98344615b30944bb9fd9eef0d3ae2d41f1506c16d5c5b247`|
|13|`534bdc6161cb590e6e53facfa8ebde7d0c91e3359fce44455c83eb6b5b886bef`|`338eb4e7e7f233356db55d71af7d0d59c4f9ad7603bac0cfa43cdee61dfa73e4`|`2ab43dd90e597e6523ac5c53ba9267a107333886a31e822824edbedf9e0220f6`|
|14|`abeafcf2967a17e1b090230a4bc5010a00ca7889dfef70a90bce7f131f2f88af`|`058d209a084d05e230b70bace7c5f6f0c71efa22aba5b6ae825f86208ad1310f`|`18ceec61f477b44bb30e7a99c002a160f3a488982259fa7c64631ed445cbfdbb`|

Other observed inputs:

| Input | SHA-256 |
| --- | --- |
|p11 `layout.json`|`12bb0b004a0539283edd01823b24bf16a9196982cbb74ac63f374cb92b116be3`|
|p12 `layout.json`|`f4a80f7561038ec4fd6d86f793d45f1436c7c51b91683291c928bbd116c57007`|
|p13 `layout.json`|`d70a888a3561f18333a079a6466e9482529ade00d46aa3837346e4ba83643a52`|
|p14 `layout.json`|`5231ae97903d41f257fcedf3068c622e593d1145dd20efd36c13ed3cf6596aea`|
|Actual figure2 crop|`1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6`|
|Actual figure3 crop|`8afe9f878ada47111cae799797fe1643af109941f7fa3cb0f157919752932f37`|
|Final author handoff|`8c16c777fc7f1b586f2eb91a1295564b00338beb4282c3f36db5d993d2aef6cb`|
|Lesson skill|`13381a5bdd0b6342dae7af217cfbdced2f3a0c71629d3ee90b4c945a9e721c49`|
|Source profile|`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`|
|Current layout tool|`50cfefdb414c7af3d91dcb333a5cd907f014fd001646173124c494b12d08c721`|

Source image hashes are bound individually in the frozen inventories.
Final hash observations matched the initially read source files and scans.
The three failed audits and p12 fragment warnings are preserved. Stop after
this report; no repair or release is performed.

## Changed-Only Appendix: Glyph Restorations And Count Exclusions

Date: 2026-11-15. This appendix compares only the affected current artifacts
with `tmp/source-10c-p11-p14-initial/0011..0014/`. The original first-review
record above remains unchanged. Its pre-append raw SHA-256 is
`423f92a74aac1644dff72589ecfde3420e8c3a3a387ef0f3295a670269169942`.

Reused the already frozen source glyphs, inventories, crop observations and
noise geometry. No source scan or crop was reopened, no math was solved,
and no count/finalize/assembly/tool check was rerun. Only this report is
written. Current parent-produced audits are evidence read, not checks this
reviewer claims to have executed.

### Exact Affected Changes

Recursive structured comparisons and MD body/frontmatter comparisons found:

| Page | JSON leaf changes | MD body changes |
| --- | --- | --- |
|11|`/blocks/7/lines/0`, added `/meta/count_exclusions`, `/meta/notes/3`|Exactly `1(x-0)` -> `1\cdot(x-0)` in the tangent formula|
|12|None; MD, JSON and audit byte-identical|None|
|13|`/blocks/4/lines/0`, added `/meta/count_exclusions`, `/meta/notes/5`|Exactly the period restoration after `假设`, replacing `，` with `.`|
|14|Added `/meta/count_exclusions`, `/meta/notes/4`|None|

Both restored characters match the actual source glyphs already observed
in the original independent review. Notes on11/13/14 only replace the prior
no-exclusions/count-failure description with the new counting-only
registration and, on13, an explicit no-cancellation warning.
MD frontmatter and JSON metadata contain the same respective changes.

Every other structured source leaf is unchanged, including all other
characters/formulas, all line boundaries, `cont`/`open`/`samerow`, object
order, figure inventories/boxes, profile/source/render hashes, errata and
the source `printed_lines` totals20/23/21/21. In particular, all three p13
footnote lines, both triangle glyphs, and the ending `等等.` remain intact.
No block row was added, removed or compressed.

### Exclusion Legality And Meaning

Current MD/JSON/audit agree on these registrations:

| Page | Kind | `[x,y,w,h]` | Assessment from retained source evidence |
| --- | --- | --- | --- |
|11|`scan-artifact`|`[0,2451,1695,60]`|Matches the prior outer-bottom candidate; border/corner only|
|13|`separator-rule`|`[224,2024,484,15]`|Matches the already observed thin footnote rule; not a footnote row|
|13|`scan-artifact`|`[0,2451,1695,60]`|Matches the prior outer-bottom candidate; border/corner only|
|14|`scan-artifact`|`[0,2460,1695,40]`|Matches the prior outer-bottom candidate; border only|

All are positive integer rectangles within1695x2580 and have nonempty,
specific reasons. The bottom registrations are entirely within the lower5%:
`0.95H=2451`, and their lower edges2511/2500 remain inside the image.
They exclude neither a folio nor body/footnote/figure ink.

The separator's height15 is below the existing limit `0.015H=38.7`, and
width484 exceeds `0.2W=339`. It ends at y2039, before the actual footnote
starting2077. This is a supported `separator-rule`, not an interior
`scan-artifact` exception. It matches the line directly observed in the
first-review footnote crop. No new interior noise region or artificial
expected count is introduced.

### Audit Diffs And Current Verdict

Only `count_exclusions`, `lines_printed`, and the corresponding `errors`
changed in audits11/13/14. All other audit leaves are unchanged; figure
snap provenance/boxes and warning lists are preserved.

| Page | Initial machine / MD | Current machine / MD | Changed-only result |
| --- | --- | --- | --- |
|11|21 / 20, FAIL|20 / 20, errors empty|Source fidelity PASS; parent audit now passes|
|12|23 / 23|23 / 23, byte-identical|Existing source PASS retained; three fragment warnings retained|
|13|22 / 21, FAIL|**20 / 21, FAIL**|Source text fidelity PASS after period restoration; page gate NOT PASS|
|14|22 / 21, FAIL|21 / 21, errors empty|Source fidelity PASS retained; parent audit now passes|

p13's current error is exactly
`行数对不上：印刷 20 行，块体 21 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`.
Removing the two independently confirmed non-text objects has exposed,
not fixed, the compact three-row footnote undercount. The original actual
21-row inventory remains authoritative. **No p13 green claim or batch
completion is made.** No counter patch is reviewed or endorsed here.

p12's original three p#5 `unicodeTextInMathMode` warnings for `，`, `就`,
`是` remain byte-identical in its audit. Their source-backed cross-block
math continuation and the need for later assembled formula checking remain
as recorded in the first review. Unit77 remains incomplete past14.

### Current Hash Binding And Preservation

All12 initial MD/JSON/audit hashes match the first-review table above;
initial packages have not been replaced. Current raw SHA-256:

| Page | `page.md` | `page.json` | `audit.json` |
| --- | --- | --- | --- |
|11|`a17994e00f2bdaf99d586b667d6a09c158e3c1e26dac7f81de9566e66b50908b`|`af8014f9f84e9e2b45b57c1d7ec23722bcad3537639b203c8768617d4fd72caa`|`d0b8dfbd3deba89c90eafc1d370a80e37d476cd08293f1865a394d319a734a10`|
|12|`563bb02861035c89585671fec5f218d7c6bd1addfc272dd437a6d6a6b3494c78`|`46ac63d3419c188d793d9f016073df312f872bb95a238c215561c6c0a5c2c053`|`49c5fd52018492ec98344615b30944bb9fd9eef0d3ae2d41f1506c16d5c5b247`|
|13|`fac4c695ca054a13573a04966b5c5c5ba4daf524485f1debbf67e0a96cb1fa6c`|`7a82cdf6ed09cdd6ac8c42a0f0b56605ff1218e76fc052076b6b415166645858`|`6018fe189646ae20059d0f919115fb530a842b5e4cf3cbb1a3942ff7f6147443`|
|14|`fe3b0fb367a0b99a4fee97930c1c96d3249a1f6c57324ca1cca3c123d1d3db5c`|`820fca8db83f5b0e4d6892fe36f9cdfeeea94e2dde18355389d525199be12c86`|`9f2f4b2b7b78161665815d9f288376b99fabd5280fef78422584db66117ddf8e`|

Raw hash equality also confirms all four source `page.png` and retained
`layout.json` files are unchanged from the first-review hash bindings.
Both actual figure crop hashes remain:

- Figure2: `1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6`.
- Figure3: `8afe9f878ada47111cae799797fe1643af109941f7fa3cb0f157919752932f37`.

All four local noise/footnote evidence PNGs also match their original hashes
in the preceding table. Pixel-equality observations and source figure PASS
verdicts are therefore reused, not re-performed. Stop after this changed-only
appendix; preserve p13's remaining count failure and p12's fragment warnings.

## Final Audit-Only Appendix: p13 Count Closure

Date: 2026-11-15. Pre-append report raw SHA-256:
`3593cb7887b2f28de14088a2af6f696af1c0dbf85a11e9c101de5bb36f0f0e85`.
Earlier first-review rejection and intermediate p13 failure remain historical
evidence; this appendix records the final affected snapshot without replacing
them.

Compared current p13 directly with
`tmp/source-10c-p13-exclusions-before-counter/{page.md,page.json,audit.json}`.
The intermediate MD/JSON/audit hashes match the preceding appendix.
Both current `page.md` and `page.json` are byte-identical to that intermediate
snapshot. A recursive audit comparison found **exactly two changes**:

| Audit path | Intermediate | Final |
| --- | --- | --- |
|`/lines_printed`|20|21|
|`/errors`|The recorded20/21 row-count mismatch|`[]`|

Every other audit field is deeply equal, including `lines_md=21`, both
registered exclusions/reasons, figure3 geometry/components/original coarse
box, normalizations, unknown characters, KaTeX warnings and errata.
The intermediate failed audit remains preserved with SHA-256
`6018fe189646ae20059d0f919115fb530a842b5e4cf3cbb1a3942ff7f6147443`.

No source image/crop was reopened, count/finalize run performed, source or
tool edited, or tool/test review repeated. The counter repair and its focused
tests are parent-owned evidence, not checks this reviewer independently
executed or approved in this appendix.

### Final Source Verdict

**PASS for source fidelity and current page-count reconciliation on all four
pages**, using the original independent source observations, the already
confirmed changed-only restorations/metadata, and these final audit bytes:

| Physical page | Independent actual / final machine / MD | Final result |
| --- | --- | --- |
|11|20 / 20 / 20|PASS|
|12|23 / 23 / 23|PASS, existing fragment warnings retained|
|13|21 / 21 / 21|PASS; prior20/21 failure preserved, now reconciled|
|14|21 / 21 / 21|PASS|

The only source-character changes remain the printed multiplication dot
restoration on11 and period restoration on13 confirmed in the preceding
appendix. All registered counting exclusions and related notes are unchanged
since that confirmation. No footnote row was compressed, no triangle glyph
or body pixel was excluded, and no source count expectation was changed.

**p12 still retains all three original p#5 fragment warnings for `，`, `就`,
`是`, with byte-identical audit.** This source PASS does not claim assembled
KaTeX validation or erase those warnings.
**Unit77 remains incomplete past physical14.** No assembly, adaptation,
unit-completion claim or publication approval is supplied.

### Final Hash Binding

Current raw SHA-256:

| Page | `page.md` | `page.json` | `audit.json` |
| --- | --- | --- | --- |
|11|`a17994e00f2bdaf99d586b667d6a09c158e3c1e26dac7f81de9566e66b50908b`|`af8014f9f84e9e2b45b57c1d7ec23722bcad3537639b203c8768617d4fd72caa`|`d0b8dfbd3deba89c90eafc1d370a80e37d476cd08293f1865a394d319a734a10`|
|12|`563bb02861035c89585671fec5f218d7c6bd1addfc272dd437a6d6a6b3494c78`|`46ac63d3419c188d793d9f016073df312f872bb95a238c215561c6c0a5c2c053`|`49c5fd52018492ec98344615b30944bb9fd9eef0d3ae2d41f1506c16d5c5b247`|
|13|`fac4c695ca054a13573a04966b5c5c5ba4daf524485f1debbf67e0a96cb1fa6c`|`7a82cdf6ed09cdd6ac8c42a0f0b56605ff1218e76fc052076b6b415166645858`|`b3bf5eb308432e2de816ebbf452a4dac3e9012dd42325d9d2238555aeb639059`|
|14|`fe3b0fb367a0b99a4fee97930c1c96d3249a1f6c57324ca1cca3c123d1d3db5c`|`820fca8db83f5b0e4d6892fe36f9cdfeeea94e2dde18355389d525199be12c86`|`9f2f4b2b7b78161665815d9f288376b99fabd5280fef78422584db66117ddf8e`|

All four source `page.png` and retained `layout.json` hashes still equal
their first-review bindings. Actual figure2 and3 crop hashes also remain
`1bf66c3d6aa81cc25d8ea816ce1b538a1e988057d13e3ccaed0415dc3927b8e6`
and
`8afe9f878ada47111cae799797fe1643af109941f7fa3cb0f157919752932f37`,
respectively. Their source/visual PASS is reused, not repeated.
Only this report tail was written. Stop here.
