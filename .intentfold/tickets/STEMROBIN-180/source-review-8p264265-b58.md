# b58 Independent Source Review: physical 264/265

**FIRST REVISE.** Exactly two source-transcription findings: required end-row
ASCII spaces are missing in 264 exercise 9 row 2 and 265 n69 prose row 1.
Both are outside target n68 but inside the explicitly requested two-page
candidate review. They are not dismissed, repaired, or converted into PASS by
the existing mechanical receipts.

The bounded n68 wording/formulas/emphasis/closure comparison is SOURCE PASS.
Figure 187's source inventory and existing PNG comparison are SOURCE PASS.
Neither statement is physics endorsement, lesson assembly approval, a modern
figure review, or permission to advance this candidate.

## Exact Findings

1. **[P2] Missing U+0020 after 264 exercise 9 row 2's sentence period.**
   [Current MD, line 63](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-energy-definition/artifacts/8p/pages/0264/page.md:63)
   is exactly `一个压缩 $5$ 厘米，而第二个拉伸 $5$ 厘米.` with no
   trailing ASCII space. The same bytes occur in `page.json` at
   `/blocks/2/lines/1`, and in the preserved first-authored input. Source pixels
   show a filled sentence period after `厘米`, followed on the next row by a
   new sentence beginning `这两个`. Direct row concatenation yields
   `厘米.这两个`, not `厘米. 这两个`. Address: user-style one-based
   `264#3`, row 2; author-style zero-based ordinal 2. This is incoming
   pre-target exercise material, not n68 prose, but the row-joining rule is
   page-transcription-wide. A future authorized correction would retain one
   U+0020 after the period in the source row; this review does not make it.

2. **[P2] Missing U+0020 after 265 n69 paragraph row 1's sentence period.**
   [Current MD, line 75](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-energy-definition/artifacts/8p/pages/0265/page.md:75)
   is exactly `让我们讨论彼此相互作用的物体的能量是怎样变化的.` with
   no trailing ASCII space. `page.json` at `/blocks/8/lines/0` and the
   preserved first input agree. Source pixels show a filled sentence period
   after `变化的`, then a new printed row beginning `注意`. Direct
   concatenation yields `变化的.注意`, not `变化的. 注意`. Address:
   one-based `265#9`, row 1; author-style zero-based ordinal 8. This is
   outgoing n69, not n68. Its position does not exempt it from the same rule.
   A future authorized correction would retain one U+0020 after the period;
   no correction was performed here.

Binding evidence records both MD/JSON rows, next rows, JSON pointers, line
numbers, direct joins, absence of U+0020, terminal U+002E, last UTF-8 bytes,
and their presence in the first input. These are independently confirmed
findings, not merely repetitions of the author's disclosure.

The actual lesson rule is:

> 印刷行末若本该有一个空格（半角句点后、中英之间），把空格写在行尾

Its following explanation explicitly says joining is direct head-to-tail
concatenation and omitting the end-row space joins the sentences together.
The current `soviet-cn` profile independently requires ASCII `.` for sentence
periods and fullwidth CJK punctuation. Accordingly, these are not requests
to invent a visible printed blank, insert a space at every Chinese line wrap,
replace periods with `。`, or change the source wording. They preserve the
specified joining convention at two actual sentence boundaries. Empty audit
`errors`/`normalizations` do not override this authoring rule.

No additional source discrepancy was found in this bounded first comparison.
The failed author terminal inventory is retained separately as existing
evidence status, not a third wording/figure finding.

## Scope And Independence

Workspace:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Date: November 17, 2026. Same existing STEMROBIN-180 invocation.

Read the repository router, `.intentfold/readme.md`, engineering charter,
IntentFold routing skill, lesson rules including cap1/cap3, image rules, and
the actual `soviet-cn` profile. This scoped request did not invoke an
IntentFold capability or a generation capability.

Opened only original `work/8p/pages/0264/page.png` and
`work/8p/pages/0265/page.png` first. Wrote a new independent full-page wording,
row, heading, footer and preliminary figure inventory before opening
candidates or the author report. Derived and inspected a new source figure
context crop, then completed its axis/tick/guide/endpoint inventory before
candidate inspection. Only after that inventory was fixed were current
MD/JSON/audits and
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-author-8p264265-b58.md`
read.

Three later source-only detail crops confirm the same first comparison's
specific emphasis and sentence-boundary observations. All inspection order,
source-crop coordinates and wording are retained in the new inventory.
No old review or HOLD was used. No other original page, including 263/266,
was opened. No answer was consulted, computed, or inferred.

The PDF/TOC identities reported in candidate metadata and first receipts are
reported provenance, not a new PDF/TOC inspection. The two original rendered
page PNG identities, their physical/printed numbers and current candidate
bytes are directly bound below.

## Full Bounded Comparison

All block addresses in this table are **one-based**, matching the supplied
`264#8` and `265#7` heading addresses. The author uses zero-based ordinals;
subtract one when consulting those receipts. There is no ownership reassignment.

| Source Range | Independent Original Facts | Candidate Result |
| --- | --- | --- |
| 264#1, exercise 8 | Five rows; children's pistol spring; force/deformation graph 187; given 2 cm; work and triangle AOB comparison | Wording, numeric data, Latin AOB and graph reference retained; no answer added |
| 264#2, figure 187 | One panel with F/newtons and l/centimetres, two arrows, 0, ticks, A/B and dashed guides | Existing PNG agrees with independent pixel inventory; before n68 |
| 264#3, exercise 9 | Four rows; equal spring coefficients; 5 cm compression and 5 cm extension; asks differences | Wording and numbers retained; finding 1 at row 2 boundary |
| 264#4/#6, exercise 10 | Four rows total; scale pointer 3, units newtons, adjacent-mark separation 5 mm | `open` two-row portion, caption, then `cont` two-row portion accurately retain one exercise |
| 264#5, caption | Printed 图187 beside exercise 10's second row | Separate `cap`, genuine `samerow`; excluded from graph crop |
| 264#7, exercise 11 | Three rows; 400 N, 10000 N/m; three printed questions | Original wording and all given numbers/units retained; no physics correction or results |
| 264#8, heading | Bold actual `68. 势能——相互作用能　能的一般定义` | Exact unit title/number; no fabricated chapter/section/exercise-group heading |
| 264#9 | Two rows; earlier discussion of energy, kinetic or potential; single-body wording and qualification | Full wording and long punctuation rule retained |
| 264#10 | Two rows; printed stacked fraction mv squared over 2; speed v and selected reference frame | `$\frac{mv^2}{2}$` and `$v$` match; exponent, numerator, denominator and reference-frame clause retained |
| 264#11 | One row, `物体本身不可能具有势能.` | Retained unchanged |
| 264#12 | Three rows; other-body force, equality of interacting bodies, only interacting bodies having potential energy | Full wording retained; under-dot span recorded as Markdown emphasis, final interaction-energy sentence bold |
| 264#13 | Printed dot-decorated footer 252 | `· 252 ·`, not physical 264 |
| 265#1 | Five rows; Earth/body example, m with vector g and its negative; system, reference frame, zero plane and source's `作的` | `$m\vec{g}$`, `$-m\vec{g}$`; arrows on g only, minus retained; all wording retained |
| 265#2 | Three rows; elastic deformation/spring, interacting points, whole body | Full wording retained |
| 265#3 | Two rows; coordinates, potential-energy coordinate dependence, contrast with kinetic energy | Full wording retained |
| 265#4 | Two rows; `由此可见` ordinary, following work-to-zero-plane definition italic | Italic span preserved across the row boundary; initial inventory's unannotated italics explicitly supplemented by source detail check |
| 265#5 | One row; kinetic zero defined as zero-speed state | Full wording retained |
| 265#6 | Two rows; `总之` ordinary, entire energy definition bold through `功.` | Exact source statement and bold span retained, not modernized or physically endorsed |
| 265#7 | Bold actual `69. 机械能守恒定律` | Explicit n68 right boundary |
| 265#8 | Two complete n69 rows; chapter opening, conservation-law question | Wording and actual question retained |
| 265#9 | Two complete n69 rows; discussion, isolated system and `参阅第八章` | Wording retained; finding 2 at row 1 boundary |
| 265#10 | Four n69 rows; kinetic/potential examples; visibly ends `因为它们` in an unfinished parenthesis | `p open` retained; no invented closure or 266 continuation |
| 265#11 | Printed dot-decorated footer 253 | `· 253 ·`, not physical 265 |

Source row inventory: 264 has 27 textual block rows minus one truly shared
caption row = 26 printed rows. 265 has 25 printed/text rows. Figures have
zero text rows. There are two actual unit headings, no chapter/section
heading, no exercise-group heading, four incoming exercise identities,
one caption, one figure and no table.

Target n68 starts at 264#8. Four complete paragraphs at 264#9-#12
(2,2,1,3 rows) and six complete paragraphs at 265#1-#6
(5,3,2,2,1,2 rows) give **ten prose blocks, 23 prose rows**, plus one
heading. Page 264's last paragraph is locally closed; page 265's `例如`
begins a new paragraph within n68, not a `p cont` fragment.

The last target definition is the source's full statement:

```text
总之，物体或物体系的能量等于当物体或物体系恢复到
零水平面时所可能做的功.
```

No target exercise or figure is present. Figure 187 and exercises 8-11
precede the target and are not attributed to n68. N69 begins at 265#7 and
is not admitted into n68; its open final paragraph remains outside target.
No upstream lesson/group ownership was invented from page position.

Full independent wording is in `original-inventory.md`. Its diplomatic
plain-text descriptions use readable unwrapped math and ASCII punctuation;
candidate comparison applies the actual profile's math/fullwidth-CJK
conventions, rather than mistaking those normalizations for missing wording.

## Figure 187 Pixel Comparison

The independent original inventory, recorded before the candidate crop:

- One unframed graph, no table, no subfigures, no square grid or negative region.
- Vertical F axis, Chinese unit 牛顿, upward arrow; horizontal italic l axis,
  Chinese unit 厘米, rightward arrow.
- Exactly four deliberate non-origin y ticks, all labelled 2,4,6,8;
  exactly two deliberate non-origin x ticks, labelled 1,2.
  No extra unlabeled unit/half-unit ticks are visible.
- Origin is the digit **0**, not the letter O in the adjacent exercise's AOB.
- A is the uppercase italic label at the heavy trace/guide crossing; B is the
  uppercase italic label at the vertical-guide foot at the printed x tick 2.
  Neither is a separately drawn isolated dot. The guide height is above the
  numbered y tick 8 but has **no printed numeric label**.
- A straight heavy rising trace starts at the axis origin, passes A, and
  continues above/right of A to a finite rounded upper end. It is not an
  arrow, does not stop at A, has no terminal label and is not extended further.
- Horizontal dashed guide joins the y axis to A: five visible ink runs,
  with its last ink merging into the heavy trace.
- Vertical dashed guide joins A toward B: seven clear isolated runs below
  the upper merged ink, then an eighth lower run meeting the x-axis/tick.
  The upper joining ink is partly merged with the trace. Neither guide
  has an arrow; no solid/dashed distinction is changed.
- No printed area shading, force formula, work result or solution annotation.
  Source upper-end and A positions are pixel locations only, not inferred
  graph coordinates or answers.
- 图187 is a separate caption below axis labels. Margin blotches on the
  full page are scan artifacts, not additional graph points.

New independent context crop:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-0264-fig187-context.png`;
source rectangle x=900,y=260,w=550,h=780. It deliberately includes the
caption to establish separation; no image was redrawn or regularized.

Existing candidate:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-energy-definition/work/8p/pages/0264/figures/fig-187.png`,
481x700 pixels. Audit records snapped ink box `[929,277,457,676]`
from coarse `[915,270,485,690]`, 43 components. Candidate has white margins
around the recorded ink, retains the above graphic inventory, and excludes
the caption and neighboring prose/stains. It adds no source labels, numeric
guide height, or inferred answer.

SVG is bound to its current bytes and the existing first vector receipt.
No new SVG rasterization, vectorization or visual screenshot was performed;
the inherited 0.043% mismatch is mechanical evidence, not an independent
physics/modern-figure approval.

## Current Inputs And Existing FIRST Receipts

Evidence:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/inputs-receipts-binding.json`
SHA-256 `d7dda116c0123eb051288efb5cee48c3dd64baeb97823eb5de4559dfc7e2b42d`.
It binds absolute paths, sizes and SHA-256 for all 16 existing page outputs,
the author report, current rules/profile, all nine named existing receipt
triples, all seven inspected images and the independent inventory.
All 16 outputs match the earlier successful `output-hashes-first.stdout`;
all existing receipt stdout/stderr bytes/hashes match their call records.
This is new passive review evidence, not a rerun or replacement of an
author command.

| Exact Current Input | SHA-256 |
| --- | --- |
| 264 original page.png | `608afba7498e5956d8ea9d7ecb08e9fe96a9665c195f976d608c51ab631d2acc` |
| 265 original page.png | `5661c38d1ec445551aa9e469881e73977ad98528ab01263e0a1a1a0e5d1cf44c` |
| 264 page.md | `be5f374af56a0f1c40d6143fb8718ad812d3cb4dac15892a1ac72c2fbfb0c504` |
| 264 page.json | `92669ae711d2eb564a27b2dec2b652b30848b3fd503397602837c1379605cdd7` |
| 264 audit.json | `9118982107329a0380ce5f77a680bd2e6fcb40ae6739abcc4fb3ded5691d9a65` |
| 265 page.md | `fea419fdfd00b9abe8a65ee989eaa21b4b2dea5c8111b050cfdf9c527011d9ab` |
| 265 page.json | `4e3712b67b619eb80794076ff97de46cda215b7d85601a2a1629da7a161ad5ff` |
| 265 audit.json | `48165713f4104afa12644829e173fa38c30321be5891cd9e63f52fff22d3894e` |
| fig-187.png | `0cc7a03ee4a9b87150f4f2095e0c2369d495c228463725b59e4c2adcc582f7d8` |
| fig-187.svg | `5b73a59e626faacc94aa37856ef79c417e77ef851d40956b5e142e9d418cff38` |
| source-author-8p264265-b58.md, 14579 bytes | `5ae4462eff67735732cfeed64dfbf5ca4ec2b4b94164ab8e6a8f919356f97bb3` |

The raw-input receipt splits into the two original authored MD byte streams:
264 = 3151 bytes, SHA-256
`2739819d249ed516f80da84d10b12230d3b6a71fd931ff83386f8e3b61b81d87`;
265 = 3248 bytes, SHA-256
`9bb44cb92a9e69e3bd636673fd327b4e08b49bc8df55e7e2af112f3b8502e946`.
Both match the first-input hash receipt and author's declared input hashes.
The two defects were already present there, not introduced by this review.

Existing receipt directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.

| Existing Exact Receipt Stem | Recorded Result, Not Rerun |
| --- | --- |
| b58-author264265-finalize264-first | exit 0; 13 blocks; FIRST 26/26 rows; one figure; normalization 0 |
| b58-author264265-finalize265-first | exit 0; 11 blocks; FIRST 25/25 rows; no figure; normalization 0 |
| b58-author264265-vectorize264-first | exit 0; one figure; FIRST mismatch 0.043%; current SVG 37288 bytes |
| b58-author264265-output-hashes-first | exit 0; successful existing 16-output inventory |
| b58-author264265-final-inventory-first | exit 1; stdout 0 bytes; stderr 3700 bytes; remains failed and unrepaired |

The failed terminal inventory is not represented as successful. Its existing
stdout hash is `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
stderr hash is
`6e1352aeb50d06688322ca72463c8a34035b3de16e1868677a88687dd9794ad9`.
Current author-report binding was supplied by this new review; no claim is
made that the failed author's terminal command produced a report hash.

## New Ownership And Stop

Only new files owned by this review:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p264265-b58.md`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-inventory.md`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-0264-fig187-context.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-0265-target-emphasis.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-0264-ex9-sentence-boundary.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/original-0265-n69-sentence-boundary.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/inputs-receipts-binding.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review264265/report-binding.json`

The final `report-binding.json` records the saved report and new evidence
hashes without modifying the report afterward. Exactly **7/8 images** were
loaded, including full originals, source crops and the existing candidate
crop; their actual load order is retained in binding evidence. No other
image or original page was opened.

No existing artifact, author report, receipt, dirty file or HOLD was modified.
No writes below root `.tmp/`; no backend/network/Git/freshness/setup,
tool-source change, repair, generation/check gate, assembly/adaptation,
promotion/publication, answers, checkpoint or usage operation.

**STOP: FIRST REVISE, two exact row-end-space findings retained.**
