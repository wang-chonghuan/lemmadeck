# STEMROBIN-182: Independent RAW Source Review, 7a 267-274

Reviewer: reviewer7a. Date: 2026-11-19. Checkout:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`.

## Verdict

**Affected-page HOLD: physical 274.** One genuine transcription loss, one
confirmed source printing error already retained literally, and one counter
overcount are distinct findings. Physical 267-273 passed this bounded comparison
of source text, exercise starts, ownership, captions, and continuations.
Their existing successful finalization evidence is reused, not rerun.

This is not an assembled-course, modern-figure, mathematical-answer, application,
or publication approval. No source page, metadata, helper, counter, or other
agent's files were edited. The author report was read as a set of hypotheses,
not as independent evidence for its pixel readings.

## Findings

1. **Transcription loss, not an original error: `p0274#5`, first physical line.**
   Source row 9, y-band `[957,998]`, visibly reads
   `$ax^2+bx+c=0$` after `$D>0$`. The small raised `2` above the first `x`
   is present around x=910-935. Current `page.md` and
   `page.json.blocks[4].lines[0]` instead contain `$ax+bx+c=0$`.
   Restore that source exponent in a later, separately authorized affected edit;
   this is faithful restoration, not a scientific rewrite or source erratum.
   The corresponding MD/JSON note's "appears ... without a superscript 2"
   hypothesis is rejected. Both this occurrence and the later `D=0` occurrence
   in `p0274#8` visibly contain `x^2`.

2. **Counter overcount, not missing MD text: `p0274#7`, second physical line.**
   Source row 17 contains both `$x_1+x_2=-\frac{b}{a}$` and
   `$x_1\cdot x_2=\frac{c}{a}$` side by side on ONE formula row.
   The saved numerical diagnostic splits its ink into `[1780,1811]` and
   `[1813,1861]`. These are numerator/top fragments and the remaining
   same-row equation/fraction ink, not two baselines. Their joint source band is
   `[1780,1861]`; counting the second band as an additional row introduces +1.
   The actual count is 20, including the footer, versus the audit's detected 21
   and MD's 20. Missing source text rows: **zero**. No extra `wrap`, blank,
   duplicate equation, or `labelrow` is warranted here. The earlier product
   calculation in `p0274#6` genuinely occupies TWO rows, `[1439,1530]` and
   `[1577,1660]`; its one existing wrap marker is correct.
   The existing failed audit is preserved and is not relabeled a pass.

3. **Confirmed original printing error, not transcription loss: `p0274#5`,
   third physical line.** Source row 11, `[1100,1187]`, right-hand root
   definition at approximately x=775-1135, clearly prints
   `$x_2=\frac{-b+\sqrt{b}}{2a}$`. The character below that radical is a
   lowercase `b`, not `D`. The left definition has `sqrt(D)`; the following
   source sum/product computation in `p0274#6` also prints `sqrt(D)`.
   Current MD/JSON preserve the anomalous `sqrt(b)` correctly. Do not change
   this faithful source expression to `sqrt(D)`. Source-erratum registration
   and any modern correction are a later separate operation; `errata: []`
   remains unchanged in this review.

Block references are one-based indices in each durable page's `blocks` array.
The exact diagnostic band bounds above are taken from the saved numerical
receipt only AFTER the complete grid independently established physical rows.
Other approximate figure coordinates below are visual locators, not new
measured crops or generated geometry.

## Independent Physical Rows

Fractions count as one formula row, true wrapped formulas count their physical
rows, figure-internal labels/grid lines do not count as text rows, and each
printed footer counts once. Same-row captions do not add another baseline.

| Physical / Printed | Independent Pixels | MD | Existing Detected | Existing Stage |
| --- | --- | --- | --- | --- |
| 267 / 261 | 25 | 25 | 25 | Parent RECOVERY2 exit 0 |
| 268 / 262 | 22 | 22 | 22 | Author RECOVERY1 exit 0 reused |
| 269 / 263 | 24 | 24 | 24 | Author RECOVERY1 exit 0 reused |
| 270 / 264 | 16 | 16 | 16 | Author RECOVERY1 exit 0 reused |
| 271 / 265 | 27 | 27 | 27 | Author RECOVERY1 exit 0 reused |
| 272 / 266 | 24 | 24 | 24 | Author RECOVERY1 exit 0 reused |
| 273 / 267 | 20 | 20 | 20 | Parent RECOVERY2 exit 0 |
| 274 / 268 | 20 | 20 | 21 | Author RECOVERY1 exit 1 preserved |
| Total | 178 | 178 | 179 | No new finalize invocation |

Independent row decomposition by source block:

- 267: `#1` 1, `#2` 8, `#3` 1, `#4` 2, `#6` 8, `#7` 3,
  `#8` 0 additional (caption shares #7's last row), `#9` 1, `#10` 1.
  The footnote separator is not a text line.
- 268: `#1..#10` = 1,3,3,2,2,2,3,3,2,1.
  `#8` includes two actual equation-system rows.
- 269: `#1..#7` = 2,4,4,4,5,4,1.
  `#5` genuinely splits the ratio `13:12` across two source rows.
- 270: `#1..#4` = 2,9,4,1. The paired columns in 878 share rows.
- 271: `#1..#5` = 6,9,6,5,1.
- 272: `#1..#7` = 2,6,10,1,3,1,1.
- 273: `#1` 2, `#2` 3, `#3` 6, `#5` 1, `#6` 0 additional,
  `#7` 2, `#8` 2, `#10` 1, `#11` 1, `#12` 1, `#13` 1.
  The two wraps in 889 are genuine source line breaks, not extra subquestions.
- 274: `#1..#9` = 2,1,3,2,3,4,2,2,1.

The complete 274 row sequence is: introductory equation; stated roots; their
sum/product sentence; three explanatory lines; two question lines; two
general-equation/root-introduction lines; paired root definitions; introduction
to the computation; one sum row; two product rows; "于是"; one paired
sum/product row; two `D=0` lines; printed footer. This enumerates 20 rows without
depending on the detector's count.

## Exercise Starts And Source Content

Exactly 19 distinct new printed exercise starts, 873-891 inclusive. Continuation
blocks are not additional starts. All are before the n46 heading and belong to
n45; `复习题` before 886 starts its printed review group, not a new lesson.

| Exercise | Start Reference | Physical Row | Source Content Checked |
| --- | --- | --- | --- |
| 873 | p0269#2 | 3 | Two number/product problems, 187/6 and 120/2 |
| 874 | p0269#3 | 7 | Rectangle dimensions/area/perimeter, both parts |
| 875 | p0269#4 | 11 | Consecutive natural-number problems, 109 and 112 |
| 876 | p0269#5 | 15 | Both right-triangle ratios and stated lengths |
| 877 | p0269#6 | 20 | Six equations, а-б share a row; д-е on 270 |
| 878 | p0270#2 | 3 | Ten rational equations, а-к, paired first two rows |
| 879 | p0270#3 | 12 | Fraction sum/product and difference/product tasks |
| 880 | p0271#1 | 1 | Both numerator/denominator changes, including 1/3 |
| 881 | p0271#2 | 7 | Both cycling problems, distances/speeds/time intact |
| 882 | p0271#3 | 16 | Train and two-cyclist problems, 720/33/48 intact |
| 883 | p0271#4 | 22 | Both boat problems; б closes on 272 |
| 884 | p0272#2 | 3 | Both downstream/upstream tasks and requested speeds |
| 885 | p0272#3 | 9 | Both harvester/typist work-rate tasks and times |
| 886 | p0272#5 | 20 | Two radical identities, each one formula row |
| 887 | p0272#6 | 23 | Heading here; two substitution expressions on 273 |
| 888 | p0273#2 | 3 | Both substitutions expressing x using t |
| 889 | p0273#3 | 6 | f(x)=3, f(x)>3, f(x)<3, domain [-1.5,6], fig 60 |
| 890 | p0273#5 | 12 | Natural numbers <=20 mapped to remainder modulo 6 |
| 891 | p0273#8 | 15 | A(x)/B(x^2), both cases, positions 1,-x,1/x,sqrt(x) |

Current durable MD/JSON retain these source stems, formulas, subparts, and
their relevant groups. No further substantive stem/formula loss was identified
in this bounded comparison. This statement is source transcription review,
not a solution, feasibility, or answer-key verdict.

## Full-Grid Figure Inventory

No figure crop, original `page.png`, modern figure, or earlier-page image was
visually opened. The eight complete grids suffice for this source inventory.
Crop output existence and exact boxes are bound from existing JSON/audits, not
claimed to have undergone a separate crop-pixel or modern-figure review.

**Figure 59, `p0267#5`: n45 worked-example PROSE.**

- One height-versus-time graph, not an exercise diagram. Thick downward-opening
  curve rises from near the origin to the vicinity of t=4/h=80 and returns to
  ground near t=8. No named A/B points or answer labels are printed.
- Rectangular grid, visually 21 columns by 24 rows. Bold vertical height axis
  and horizontal time axis have arrowheads. Axis text is `h`, `(米)`, and
  `t(秒)`. Visible numerical height labels are 10 through 90; time labels are
  0 through 8. Minor grid subdivisions are retained as source geometry.
- Dashed horizontal guide at height 60 and vertical guides at times 2 and 6
  are present. Do not replace these with only a plain parabola.
- Existing rough box `[682,1068,660,743]` snapped to
  `[685,1070,652,740]`; the existing audit reports 41 components.
  Figure ends before its caption. Caption `p0267#8`, "图 59", near y=1850,
  shares the last physical row of `p0267#7` ("问题的条件.").
  Its `samerow` flag and prose ownership are correct.

**Figure 60, `p0273#4`: owner exercise 889, NOT 890.**

- One bounded U-shaped function graph on a rectangular grid, visually
  18 columns by 12 rows. Vertical axis label `f`, horizontal label `X`;
  both axes have arrowheads. Horizontal numbers -1,0,1,2,3,4,5,6 and
  vertical numbers 1,2,3,4 are printed.
- The descending left branch begins above 3 at x=-1.5; a rounded minimum is
  near x=2/y=1; the right branch rises to about y=4 at x=6. These are visual
  positions, not an inferred exact analytic function or solved inequalities.
  Dashed vertical endpoint guides connect the two bounded ends toward the
  horizontal axis. The prose explicitly supplies domain `[-1.5,6]`.
- Existing rough box `[800,766,545,374]` snapped to
  `[801,767,543,372]`; audit reports 41 components.
  Caption `p0273#6`, "图 60", near y=1160-1190, is outside the figure box and
  shares the first row of exercise 890 (`p0273#5`). Layout coincidence does
  not transfer ownership from 889. `owner-ex 889`, `samerow`, and 890's
  transparent internal `open`/`cont` pair are correct.

**Figure 61, `p0273#9`: owner exercise 891.**

- TWO separate horizontal coordinate lines, stacked, each with a rightward
  arrow. Cyrillic subfigure labels а and б are at the left.
- In а, the origin tick labeled `0` is left of the filled point `A(x)`,
  which is left of the filled point `B(x^2)`.
  Approximate full-grid x positions are 552,683,859.
- In б, the origin tick `0` is left of `B(x^2)`, which is left of `A(x)`;
  approximate x positions are 554,718,889. Both named point labels sit above
  their corresponding points. There are no printed unit ticks or a point
  labeled 1; do not invent them as original facts.
- Existing rough box `[360,1545,860,193]` snapped to
  `[363,1547,848,193]`; audit reports 52 components. It covers both lines,
  their origins, labels, points, and arrowheads. Caption `p0273#10`, "图 61",
  is a separate source row near y=1750 and is outside the box.
  `owner-ex 891` and the non-`samerow` caption are correct.

No tables, unnumbered diagrams, additional figures, or figure continuations
are present in this eight-page scope.

## Continuations And Lesson Boundaries

- Incoming 266 is TEXT ONLY: durable `p0266#7` ends `以后，`.
  `p0267#1` supplies `物体处于 60 米的高度？` and closes it.
  No 266 image was opened or retrospectively reviewed.
- `p0267#4 open` crosses figure 59 to `p0267#6 cont`, joining "图" to
  "象以后". `p0267#7` then starts a new conclusion paragraph.
- 268 starts another complete worked example, not an incoming partial
  paragraph. Its conclusion on 269 is a new paragraph in the same example;
  a page boundary alone does not require `cont`.
- `p0269#6` opens 877 after г; `p0270#1` supplies д and е and closes it.
- `p0271#4` opens 883 after `多用了`; `p0272#1` begins `1 小时.`
  and closes its second part.
- `p0272#6` is only 887's heading and remains open;
  `p0273#1` supplies its two parts and closes it.
- `p0273#5 open` crosses caption 60 to `p0273#7 cont`, completing 890.
- n45 TOC start is printed 260 / physical 266. n46 TOC start is printed
  267 / physical 273. Source footer identities 261-268 throughout this batch
  confirm the +6 offset. `p0273#11` visibly starts "46. 韦达定理".
- `p0273#12 open` is precisely `方程`; `p0274#1 cont` supplies the displayed
  `5x^2-4x-12=0` and its stated roots, then closes.
- `p0274#8 open` ends `可以根据下列公式求出：`. The following page is not
  reviewed. n46 is incomplete in this scope; no n47 content is inferred.

## Execution History And Binding

The immutable author freeze preserves EXACTLY 16 author finalize receipts:
eight FIRST exits 1 (checkout gate / Git's denied read-write `/dev/null`),
then eight RECOVERY1 receipts: five exits 0 (268-272), two crop-permission
exits 1 (267,273), and one count-failure exit 1 (274). None is overwritten.
The author's frozen conclusion predates and does not include parent RECOVERY2.

Parent stage receipts under `resume182-13/stages/` record ONLY
`source267-crop-output-RECOVERY2` and `source273-crop-output-RECOVERY2`,
both exit 0 on 2026-11-19 at 06:08 UTC, outside the custom author sandbox.
Thus the recorded combined producer history is 18 invocations, not a reset
to "eight passes." This reviewer ran zero finalize invocations.

Current 267/273 Markdown files are NOT byte-identical to the earlier
unnormalized author snapshots: existing finalize added source/render/profile
frontmatter, snapped figure boxes, and figure image links. After removing only
frontmatter, these automatic links, and box numbers, the ordinary text and
block declarations are byte-identical. Original authored snapshot files remain
byte-identical to their own freeze hashes. Current MD/JSON/audit hashes, these
comparisons, and all 18 receipts are captured in `bindings.json`.
The five reused 268-272 MD/JSON/audit files exactly match their RECOVERY1
snapshots; 274 does likewise, including its failed audit.

`image-ledger.json` records exactly ONE batch / EIGHT complete original-detail
grid opens, each once; zero crops, reopens, previous-page images, or later
batches. Hashing PNG bytes for binding does not decode/load an image payload.

Only `resume182-13/source267-274-review/` receives reviewer writes. Its report,
bindings, input/output hashes, ledger, and freeze record are sealed `0444`.
No env, network, DB, app, dependencies, prepare, render, finalize, assembly,
source edits, commit, or publication action is performed. Stop after freezing.
