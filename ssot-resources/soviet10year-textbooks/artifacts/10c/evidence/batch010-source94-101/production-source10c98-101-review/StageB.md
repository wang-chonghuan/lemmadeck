# STEMROBIN-184: Stage B / 10c physical 98-101

Status: COMPLETE BOUNDED COMPARISON; WAIT. No author or source edits.

## Findings First

### B1 [P1]: nine shared task instructions are tagged as prose

The instruction words, ordering, and observed task coverage match frozen Stage A,
but their typed ownership does not: all nine shared instructions are `<!-- p -->`,
not exercise-group blocks. They are imperatives governing unsolved tasks, not
expository prose belonging to the history lesson.

The lesson skill already read for Stage A states in its cap2 split rule:
`ex` / `exhead` go to exercises; other block types go to lesson text. On that
documented contract, these `p` instructions would be routed as lesson prose
instead of retained as the groups of their formula-only tasks. The risk covers
35 tasks; only 350 carries its own complete command inside its `ex` block.
No downstream execution or undocumented automatic promotion is assumed.

| Author location | Frozen Stage A row | Instruction preserved in author text | Governed task owners |
| --- | --- | --- | --- |
| 0099/page.md:47-48, p0099#4 | 99 R10 | 求下列函数的导函数： | 335-341 |
| 0099/page.md:71-72, p0099#12 | 99 R18 | 求极限： | 342-345 |
| 0100/page.md:32-33, p0100#1 | 100 R01 | 确定谐振动的振幅、周期和初相： | 346-347 |
| 0100/page.md:42-43, p0100#4 | 100 R05 | 利用导数讨论函数并作出它的图象： | 348-349 |
| 0100/page.md:55-56, p0100#8 | 100 R10 | 把下列各式写成谐振动方程： | 351-356 |
| 0100/page.md:76-77, p0100#15 | 100 R17 | 化简： | 357-360, including 101's inherited group |
| 0101/page.md:42-43, p0101#4 | 101 R04 | 证明恒等式： | 361-362 |
| 0101/page.md:51-52, p0101#7 | 101 R08 | 不查表计算： | 363-369 |
| 0101/page.md:75-76, p0101#15 | 101 R16 | 验证等式： | 370 observed; future extent unproven |

Author action needed outside this review: retain these instructions as
exercise-owned group headers using the documented block contract, without
changing their words, printed rows, task boundaries, or numbers. The author's
handoff/ledger descriptions of "instruction" or "latest group" are text claims;
they do not change the `p` tags in the supplied page artifacts. This reviewer
did not implement any tag change or run assembly to observe the predicted effect.

### B2: a frozen Stage A name misread is resolved in the author's favor

Frozen Stage A, physical 98 R17, says `阿里阿贝哈特`.
Author 0098/page.md:56 says `阿里阿贝恰特`.

That concrete glyph disagreement justified one genuinely new native targeted crop
from the same hash-bound 0098 original. Crop dimensions were validated BEFORE the
image was viewed. The new crop clearly reads `阿里阿贝恰特`; the disputed character
is `恰`, not `哈`. The author matches this pixel evidence.

This is an additive correction to this reviewer's earlier observation, NOT a
correction of a printed historical statement or an author defect. Frozen Stage A
and its original image ledger are unchanged. No modern name, transliteration,
biographical date, historical correction, external source, or answer was used.

Evidence:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c98-101-review/p0098-r17-name-native.png`

Native crop `[x,y,w,h] = [130,1690,950,78]`; viewed once at original detail.
SHA-256:
`68108b7ddfb908f1adefeef0f83efc24e0e084ab64b7ac035d82d26092961127`.

### Other Comparison Results

- No author mathematical glyph, sign, coefficient, argument, denominator,
  exponent, radical, limit approach, degree value, exercise number, or star
  discrepancy was found in the 36 unsolved tasks 335-370.
- All 57 typed author blocks are accounted for in the matrices below.
  Observed printed reading rows agree: 24 + 21 + 19 + 18 = 82, including footers.
  This is manual comparison to frozen Stage A, not parser/gate/test output.
- There are no missing printed worked examples or solution-bearing owners.
  All 36 tasks remain unsolved; the history formulas remain prose-owned.
- Literal punctuation/spacing differs from the frozen transcription as separately
  disclosed below. Mathematical matching is not a claim of byte equality.
- Boundary claims match the observed source range: n95 ends before 98; n96 ends
  on 99 before the supplement; the supplement's outer right boundary is unproven.

## Scope And Hash Binding

The parent explicitly authorized only these six author text files. All were read;
none of the paths mentioned inside them was followed to further material.

Workspace:
`/Users/yong/.codex/worktrees/a07e/lemmadeck`

Author page root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages`

Author sidecar root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c98-101`

| Authorized author text | SHA-256 observed in this comparison |
| --- | --- |
| Author page root / 0098/page.md | `df40c21bc6bead71960761dd4f036553e878e0c287c6567a40b6c8ac0d867846` |
| Author page root / 0099/page.md | `77b87c163547037ffe7809df0eed73f7eb5e01e33b4f4c009147fe539636cbca` |
| Author page root / 0100/page.md | `5715776407c4d5da8328db6400972ec4303173114a29e2de09345e9ed45bccd9` |
| Author page root / 0101/page.md | `8479ab95ddfd711bb874e4f51b5a7afb5504231237ab96fe76a053b489d691cd` |
| Author sidecar root / handoff.md | `e93424f172eca3b5c382c4030106a61d646a4179a15c585c77bc3385409a0400` |
| Author sidecar root / ledger.md | `55d042efd7c33b96aa37c3084a30ccd40a132224a7a9e8db3e2d05f3b49e20db` |

The four current page hashes equal the hashes declared in the authorized author
handoff and ledger. This binds this review to those exact drafts, not later edits.

Frozen independent baseline, unchanged:

| Review baseline path, relative to this review directory | SHA-256 |
| --- | --- |
| source-first.md | `56d97e551c4fb817c748d3d69609a8928aa5eb1666ecbee721858959ad13b363` |
| image-ledger.md | `4d71e76787753a4997cc521fe480e9c55cd799eacd28573b73b0c2468841fc05` |

Each author page's `render.sha256` equals its corresponding frozen Stage A source
hash. Its physical and printed page numbers also agree. Author PDF/profile
metadata was read as disclosed metadata only, not independently validated by
opening the PDF, profile, templates, layout, audits, or any additional source.

## Every-Object Comparison

Block indices below are the author's one-based typed blocks, matching the
authorized ledger. Row identities are frozen Stage A visual reading rows.
Author line locations refer to the hash-bound `page.md` files above.
`MATCH` concerns the stated content/ownership/rows, subject to the explicit
punctuation differences and B1. `B1` means text and row match, but prose typing
does not encode the shared exercise instruction's owner.

### 0098 / Printed 92

| Author block | Author lines | Stage A rows | Compared object | Result |
| --- | --- | --- | --- | --- |
| p0098#1, h3 | 33-34 | R01 | `96*. 历史知识`; number, star, title; starts new unit | MATCH; not n95 continuation |
| p0098#2, p | 36-41 | R02-R06 | Opening history paragraph; spherical triangle, great-circle arcs, eighth-grade reference; all wrapped words | MATCH words and five rows |
| p0098#3, p | 43-51 | R07-R14 | Chord-table paragraph, `公元前三至二世纪`, `普托列姆（公元前二世纪）`, `亚历山大城`, prime after 30; three sexagesimal terms and integer condition | MATCH; display/condition remain in same prose owner |
| p0098#4, p | 53-57 | R15-R19 | Indian/Arabic history; six functions; fifth-century parenthesis; identity and reference to section 90 | Math, words, five rows MATCH except B2; author's name confirmed by new native pixels |
| p0098#5, p open | 59-63 | R20-R23 | Western-European history; `韦达（1540—1603）`, Newton, `柯吉斯（1682—1716）`; ends `那里可以` | MATCH; correct open paragraph |
| p0098#6, foot | 65-66 | R24 | Printed 92 | MATCH |

Detailed mathematics/conditions:

- `30'` retains a prime, not a degree sign.
- The display is exactly `a/60 + b/60^2 + c/60^3`; denominators 60, 60 squared,
  and 60 cubed are unchanged.
- `a`, `b`, `c` remain integers from 0 through 59. No extra parameter restriction
  or additional digit is introduced.
- Function list remains sin, cos, tg, ctg, sec, csc, in that order.
- `sin^2(alpha)+cos^2(alpha)=1` is unchanged. Author line 56's `=↵1`
  represents the exact Stage A R17/R18 break after the equality, not a missing
  digit, second equation, or extra exercise.
- The last paragraph's four rows correctly continue into 0099's first six rows.

### 0099 / Printed 93

| Author block | Author lines | Stage A rows | Compared object | Result |
| --- | --- | --- | --- | --- |
| p0099#1, p cont | 32-38 | R01-R06 | `找到` closes 98's `那里可以`; `瓦里斯（1616—1703）`; negative infinity to positive infinity; all six history rows | MATCH cont and paragraph ownership |
| p0099#2, p | 40-42 | R07-R08 | Euler paragraph; `《无穷小分析引论》一书（1748）` | MATCH; closes n96 before next h3 |
| p0099#3, h3 | 44-45 | R09 | Unnumbered `第六章补充题` | MATCH; not numbered n97, not history-owned exercises |
| p0099#4, p | 47-48 | R10 | Derivative command covering 335-341 | B1 |
| p0099#5, ex 335 | 50-51 | R11 | `y=sin(5x)`; no star | MATCH |
| p0099#6, ex 336 | 53-54 | R12 | `y=cos(6x+pi/2)`; positive phase | MATCH |
| p0099#7, ex 337 | 56-57 | R13 | `y=cos^2(ax+b)`; function squared, parameter letters retained | MATCH |
| p0099#8, ex 338 | 59-60 | R14 | `y=2x sin(x)-(x^2-2.3)cos(x+2)`; decimal, both subtractions, plus in cosine argument | MATCH; no crop needed for this agreed reading |
| p0099#9, ex 339 | 62-63 | R15 | `(x^2+x+1)sin(3x)`; all plus signs and factor | MATCH |
| p0099#10, ex 340 | 65-66 | R16 | `sin(x)cos(x)` product | MATCH |
| p0099#11, ex 341 | 68-69 | R17 | `tg(x)+(1+ctg(x))cos(x)`; grouping | MATCH |
| p0099#12, p | 71-72 | R18 | Limit command covering 342-345 | B1 |
| p0099#13, ex 342 | 74-75 | R19 LEFT | Star; approach pi/2; numerator `sin(pi/2-x)`, denominator `pi/2-x`; no side indicator | MATCH |
| p0099#14, ex 343 samerow | 77-78 | R19 RIGHT | Star; approach 0; `sin(3x)/(5x)` | MATCH separate owner and samerow |
| p0099#15, ex 344 | 80-81 | R20 LEFT | Star; approach 0; `sin(4x)/sin(7x)` | MATCH |
| p0099#16, ex 345 samerow | 83-84 | R20 RIGHT | Star; approach 0; `sin(5x)/tg(3x)` | MATCH separate owner and samerow |
| p0099#17, foot | 86-87 | R21 | Printed 93 | MATCH |

All eleven numbered tasks are complete objects on this page. Starred body labels
are 342-345; block labels retain the numeric identity without incorporating `*`.
The two `samerow` flags correctly denote the right-hand tasks, not formula tiers
or continuations. No denominator, argument, decimal, or limit condition is lost.

### 0100 / Printed 94

| Author block | Author lines | Stage A rows | Compared object | Result |
| --- | --- | --- | --- | --- |
| p0100#1, p | 32-33 | R01 | Amplitude/period/initial-phase command covering 346-347 | B1 |
| p0100#2, ex 346 | 35-36 | R02 | One task with Cyrillic а)/б) on same row; `3sin(2x-pi/4)` and `2cos(pi/5-4x)` | MATCH; no false second task or samerow block needed |
| p0100#3, ex 347 | 38-40 | R03-R04 | Star; two vertical subquestions; `-0.6cos((1/2)x+0.3pi)` then `(sqrt(3)/2)sin(x+1)+(1/2)cos(x+1)` | MATCH one two-row owner; Cyrillic labels correct |
| p0100#4, p | 42-43 | R05 | Derivative discussion and graph command covering 348-349; literal `图象` | B1; no actual figure owner |
| p0100#5, ex 348 | 45-46 | R06 | Star; f(x); amplitude 1.5; mixed coefficient `2 2/3`; phase pi/9 | MATCH |
| p0100#6, ex 349 | 48-49 | R07 | Star; g(x); amplitude 3; mixed coefficient `1 2/3`; phase pi/12 | MATCH |
| p0100#7, ex 350 | 51-53 | R08-R09 | Complete self-command: whether `y=cos(2x-pi/4)` solves `y''=-4y`; second row `的解` | MATCH; not a worked example/solution; no group-command loss here |
| p0100#8, p | 55-56 | R10 | Harmonic-equation rewrite command covering 351-356 | B1 |
| p0100#9, ex 351 | 58-59 | R11 | Outside factor 2; `sin(pi/4)sin(2x)+cos(pi/4)cos(2x)` | MATCH |
| p0100#10, ex 352 | 61-62 | R12 | Star; `3cos(3x+pi/12)+4sin(3x+pi/12)`; identical arguments | MATCH |
| p0100#11, ex 353 | 64-65 | R13 | Star; `(1/2)(cos(x)-sin(x))`; not reciprocal sqrt(2) | MATCH |
| p0100#12, ex 354 | 67-68 | R14 | `3sin(2x)`; no star | MATCH |
| p0100#13, ex 355 | 70-71 | R15 | `4-8cos^2(x)`; square on function | MATCH |
| p0100#14, ex 356 | 73-74 | R16 | Star; `-2sin(x)-4sqrt(3)cos(x)`; two negative terms | MATCH |
| p0100#15, p | 76-77 | R17 | Simplification command covering 357-360 across page boundary | B1 |
| p0100#16, ex 357 | 79-80 | R18 | `cos(pi-alpha) * ctg(pi/2-alpha)`; explicit dot retained as `\cdot` | MATCH complete object, not open |
| p0100#17, foot | 82-83 | R19 | Printed 94 | MATCH |

The mixed numbers are retained as `2\frac{2}{3}` and `1\frac{2}{3}`; neither is
rewritten as an unintended product. The two-line task 350 and two-line task 347
retain their whole owners. No extra line is created for fraction numerator tiers.
Both subquestion sequences use Cyrillic `а`, `б`, not Latin `a`, `b`.

### 0101 / Printed 95

| Author block | Author lines | Stage A rows | Compared object | Result |
| --- | --- | --- | --- | --- |
| p0101#1, ex 358 | 33-34 | R01 | Whole fraction: `ctg(pi/2-alpha) * sin(beta-pi/2)` over `cos(pi-beta) * tg(-alpha)` | MATCH distinct new task, inherits simplification group |
| p0101#2, ex 359 | 36-37 | R02 | `(1-sin^2(3pi/2+x))/(1-sin^2(pi+x))`; plus x twice | MATCH |
| p0101#3, ex 360 | 39-40 | R03 | `cos^2(pi-alpha)/(1-cos(3pi/2-alpha))`; unsquared denominator cosine | MATCH |
| p0101#4, p | 42-43 | R04 | Identity-proof command covering 361-362 | B1 |
| p0101#5, ex 361 | 45-46 | R05 | `tg(x)+tg(pi-x)+ctg(pi/2+x)=tg(2pi-x)` | MATCH three left terms and all signs |
| p0101#6, ex 362 | 48-49 | R06-R07 | `sin(90°+y)cos(180°-y)ctg(270°+y)=sin(90°-y)sin(270°-y)ctg(90°+y)` | MATCH; one whole unsolved identity with `↵` before equality |
| p0101#7, p | 51-52 | R08 | No-table calculation command covering 363-369 | B1 |
| p0101#8, ex 363 | 54-55 | R09 | `10ctg(135°) * sin(210°) * cos(225°)` | MATCH values, functions, dots, degrees |
| p0101#9, ex 364 | 57-58 | R10 | `2sin^2(225°)-ctg(330°) * tg(405°)` | MATCH; compact TeX spelling discussed below |
| p0101#10, ex 365 | 60-61 | R11 | `arcsin(sqrt(3)/2)+arcsin(1/2)` | MATCH positive arguments, radicals/fractions |
| p0101#11, ex 366 | 63-64 | R12 | `arccos(1/2)+arccos(sqrt(2)/2)` | MATCH |
| p0101#12, ex 367 | 66-67 | R13 | `arcsin(-1/2)+arccos(-sqrt(3)/2)`; both parenthesized negative arguments | MATCH |
| p0101#13, ex 368 | 69-70 | R14 | `arctg(-1)+arctg(1)` | MATCH; both arctangents |
| p0101#14, ex 369 | 72-73 | R15 | Star; `arctg(sqrt(3))+arcctg(1)` | MATCH; second function is inverse cotangent |
| p0101#15, p | 75-76 | R16 | Verification command for 370 observed | B1 |
| p0101#16, ex 370 | 78-79 | R17 | `arccos(0)+arcsin(sqrt(2)/2)=(3/4)pi`; complete equality | MATCH whole unsolved verification task, not worked solution |
| p0101#17, foot | 81-82 | R18 | Printed 95 | MATCH |

No author `open`, `cont`, or `samerow` is incorrectly attached to these tasks.
The `↵` in 362 preserves R06/R07 within a single task. It is not a continuation
of the preceding task or a worked proof. No extra interval, domain exclusion,
denominator restriction, or computed answer is added.

## Literal And Representation Differences

These differences were not silently discarded during comparison:

| Location/type | Frozen Stage A | Author representation | Assessment |
| --- | --- | --- | --- |
| 98 R17 name | 阿里阿贝哈特 | 阿里阿贝恰特 | B2: new native crop confirms author; Stage A misread |
| Sentence and task endings | Mostly Chinese `。` | ASCII `.`, with a following space at prose joins | Typographic difference from frozen transcription, not a numeric/word omission. Stage A is not a byte-exact punctuation baseline; no new punctuation pixel audit performed. |
| Instruction-ending colon | ASCII `:` in Stage A row transcription | Chinese `：` | Literal codepoint difference; command words/row and task coverage unchanged |
| 98 R14 variable enumeration | One `$a,b,c$` | `$a$，` / `$b$，` / `$c$` | Same three variables and integer condition; math delimiters/comma codepoints differ |
| 98 R16 function enumeration | One comma-separated math span | Separate spans and Chinese commas | Same six names/order; delimiter/punctuation difference |
| 98 identity break | Two row entries, after `=` | One math string with `=↵1` | Exact two printed rows preserved by documented wrap marker |
| 101 task 362 break | Two row entries, RHS starts `=` | One math string with `↵=` | Exact two printed rows preserved; not an extra owner |
| Starred task punctuation | Stage A shows number plus `*` | Author shows `342*.` etc. in task body | Star/number owners match; body-label punctuation representation differs |
| Formula spacing | `\sin 5x`, `\sin^2 225^\circ` etc. | `\sin5x`, `\sin^2225^\circ` etc. | Same TeX mathematical tokens, not altered values |

In particular, author 0101/page.md:58 contains `2\sin^2225^\circ`. With TeX's
unbraced single-token superscript, the first `2` after `^` is the exponent and
the remaining `225` is the angle. It matches Stage A's `2\sin^2 225^\circ`;
it is not a sine exponent of 2225. This was a textual token comparison only;
no renderer, test, formula evaluator, or answer derivation was run.

The codepoint/spacing differences above do not justify correcting printed
historical statements. All printed dates, names other than the resolved Stage A
misread, and historical assertions were retained and not externally evaluated.

## Whole Owners, Boundaries, And Author Sidecar Claims

- The actual 98 heading closes the incoming n95 boundary without re-reading 97.
  The incoming numbering anomaly mentioned in the author ledger is not inserted
  into this batch or independently adjudicated.
- `96*. 历史知识` contains four prose paragraphs on 98, including its two
  mathematical statements. Its last paragraph is 0098#5 `open` plus 0099#1 `cont`.
  It closes before the separate final Euler paragraph, which ends before
  0099#3 `第六章补充题`. No history passage is moved into exercises.
- The supplement is one unnumbered source owner beginning on 99. Tasks 335-345,
  346-357, and 358-370 are each complete on their pages. No per-task cross-page
  continuation is invented.
- 357 and 358 share an instruction group, not a task identity. The known
  simplification span is 357-360. B1 concerns its header's encoded ownership,
  not a need for `ex 357 open` / `ex 358 cont`.
- The author's outgoing 101 text identifies the supplement and latest
  `验证等式` group, complete task 370, footer 95, and no open task flags.
  This matches Stage A, provided "no open objects" is not interpreted as a
  proven outer-unit right boundary. The author also explicitly warns that 102
  was not read and the supplement must not be declared finished.
- Complete source owner inventory for worked examples/solutions remains empty.
  Tasks 350, 361, 362, 370 are questions despite mentioning a solution, proof,
  or verification. No whole solution-bearing object should be excluded on
  the mistaken basis that these are worked examples.
- Actual figure/caption/table/label/reference inventory remains empty on all
  four pages. Graph commands 348-349 do not create printed figure owners.
- The author's original/crop counts, crop findings, prepared-band counts,
  parser counts, template/layout hashes, and command history were read solely
  as authorized sidecar assertions. No author crop image, grid, layout,
  template, audit, source PDF, answer, choice, parser, or code was opened or run.
  The author's six-image count is separate from this reviewer's five-image count.
- The current four draft hashes agree with the sidecar declarations. Claimed
  historical correctness, parser success, or "no unresolved readings" is not
  used as a substitute for independent Stage A; the new name crop resolves
  the actual observed disagreement directly.

## Review Actions And Permanent Image Count

Stage B actions: read the two frozen review text files; read exactly six
authorized author text files with line references; hash those texts; create
and dimension-validate one new native crop from the assigned 0098 original;
view that crop once; write this separate report and an additive image ledger.

The crop command checked the assigned original SHA-256 and source dimensions
1695 x 2580, checked the crop box within bounds, checked 950 x 78 crop dimensions,
and checked saved pixel bytes equal the native extracted bytes BEFORE viewing.
No resizing, resampling, grid, author crop, whole-original view, or reopen occurred.

Permanent reviewer image payloads: 4 Stage A originals + 1 Stage B crop = 5.
Batch 5/8; context 5/24. Three crop reservations remain unused. The parent
receives only text paths and hashes, no source or crop image payload.

Frozen Stage A files remain unchanged. Only this review directory gained
Stage B artifacts. No source/author edits, finalize, gate, assembly, binder,
render, vectorization, test, Git, DB, publish, app, skill, dependency, schema,
Charter, archival, or workflow action was performed.

WAIT for further explicit parent direction. This bounded comparison is not
approval to change source artifacts or proceed downstream.
