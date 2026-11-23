# N59 zero-image source / author / raw / modern-text comparison

Status: HOLD for two source-literal disagreements; text transfer otherwise
qualified PASS. No figure or publication approval.
Date: 2026-11-23. Ticket: STEMROBIN-187.
Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Lesson: `math4-c2-s2-n59`.

This comparison was performed only after the three blind source reports were
saved and their original hashes returned. Their bytes have not been changed.
This phase read the specifically authorized author evidence, six finalized
page Markdown/JSON pairs, raw lesson/exercises JSON, current modern lesson/
exercises templates and answer draft. It loaded **zero new images**.
At the end of this phase, cumulative reviewer image usage remained **7/24**.
The separately authorized subsequent candidate-figure review is not evidence
for anything claimed in this text-only report.

## Preserved blind evidence

| File in this evidence directory | Original SHA-256, rechecked unchanged |
| --- | --- |
| `independent-source.md` | `2b8e742b9ad8f2d92ea56cb1cb48663969c504b8ddd086f277874c818459dc8b` |
| `independent-solutions.md` | `5efa5e835a99978aa7856dab61cbab9277b71babb0cc365f329ce516017044a8` |
| `source-figure-inventory.md` | `7209e4a1e14da73418a738ed8c6a236380982007bb5418f1e1f9403bcf7a8a92` |

New findings here do not revise those frozen observations retrospectively.
The author's report of no uncertainty is not independent resolution of this
reviewer's pixel HOLDs.

## Current compared-byte identity

The following suffixes are relative to
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/`.

| Current input suffix | SHA-256 |
| --- | --- |
| `lessons/math4-c2-s2-n59/evidence/author-source-observations.md` | `3ce61d9d237884187a99cfbe03ce70782adc479cf3ad9784f00dabddb7be4ed1` |
| `lessons/math4-c2-s2-n59/evidence/author-solutions.md` | `ce8e45a9d353be0945e54cf06dd6e61ef795b12c60d128548b87c769dc340e0d` |
| `lessons/math4-c2-s2-n59/lesson.json` | `b94479198c7b279318604f04d93fd15f56368e6e1b609a4739ea619a2936cfd3` |
| `lessons/math4-c2-s2-n59/exercises.json` | `70bb8badaf0a2859701ea6f6436df183a6ecf9bc8d6be6647307595c2fb1d062` |
| `pages/0216/page.md` | `bd5788f1bbfbaa66c054319646d59bc1d7ef5dd2f1d27cf07f10dab2dd88fb3d` |
| `pages/0216/page.json` | `d13e5232048c6652dcb9af6a0c5cf01f8c5cd25b22268643640646105fd7fb7d` |
| `pages/0217/page.md` | `730ffd26acb111a5fe1ed75fb3a797e7642140e0a2c6c22558e728e5378a8341` |
| `pages/0217/page.json` | `e1dce54d89bd9fd172a68c81fcc07a27bf1b16b039e0945c9c3f59f9c7ee6600` |
| `pages/0218/page.md` | `d62599fbf493e256cdd3a61e510d5719b4120f100ea78a5790b6b2f4cbd9e407` |
| `pages/0218/page.json` | `0b78c9e75060a9f1a4416af8c149899b465d22a9f3a8b194bb5a9333cbba7f48` |
| `pages/0219/page.md` | `f149ccfaa2ce91332056017bd43953cf53300111b28d6aeec4cb13ff79be4032` |
| `pages/0219/page.json` | `eec289af1760c21f6a07d4374a51728fe6f87b2d3ab0c53828ac471a18ec7302` |
| `pages/0220/page.md` | `9e1f5ce901252eed24cec9db023be8a95bef4d5800a7b1aa3424cad014877b18` |
| `pages/0220/page.json` | `1d42f59b0e9144001cec57dc777ba0c6d49aca0c874584c514f7378612102dd8` |
| `pages/0221/page.md` | `f6cb9f2400de9f00317203aabd3b1773a005ca2ad5537eadca3647ac5e073644` |
| `pages/0221/page.json` | `1a526a2a6e02cebb85aa0bef8b500becce75e1404a61baf6eb2c93987def6557` |
| `lessons/math4-c2-s2-n59/evidence/answer-draft.json` | `db39cc4f49b1f495292f203cc782d87ea62e4d1a444656453c6b58a90cb06101` |

Modern template directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n59/`.

| Current template | SHA-256 |
| --- | --- |
| `lesson.template.json` | `819c59725da5bcc588e27584729867cb6fafb0b41c38ed819c80a388211d8e5b` |
| `exercises.template.json` | `849b9942623db708662591480584bc098804cbef12ecac6add5948fb08ff8120` |

The author's historical pre-finalization page hashes differ from current hashes
for 0217-0221. The report explicitly describes pre-finalized author outputs.
These historical identifiers were not substituted for current bytes or treated
as current finalization approvals.

## Actual binding checks

- All six page JSON `meta` objects equal their corresponding Markdown
  frontmatter JSON values. Their render hashes equal the original full-page
  hashes retained in the blind load ledger. This binds identities without
  loading pixels or re-establishing pixel readability.
- All 33 raw exercises have exact matching source-number `ex` blocks at their
  listed references; concatenated printed lines, with explicit formula-wrap
  marker `↵` removed, reproduce raw exercise text. Raw `lines` equal the
  corresponding page block lines, including both halves of 999.
- All six raw prose blocks bind to `p0216#4` through `p0216#9`. CJK printed
  wraps concatenate without inserting a space inside 工资 or 方便. The three
  separate mathematical rows at `p0216#8` are instead joined with separator
  spaces in raw lesson text. All six bind correctly under these distinct
  joining rules; a generic space-join would produce false prose mismatches.
- Modern `source.path` identifies the correct raw lesson/exercises files,
  `source.sha256` equals their actual current hashes above, and each embedded
  `source.data` is structurally identical to the corresponding current raw JSON.
- Each of the 33 modern exercises has exactly the raw `source_text`, number,
  source_number, group, group_id, pages, figure_refs and figures.
  Its `lines.join("\n")` equals its modern `text`.
- Modern mathematical operands, operators, conditions and question roles are
  unchanged from current raw. The only exercise text changes are whitespace/
  line layout, explicitly declared Cyrillic-to-Latin subpart labels, and
  the declared 卢布-to-美元 substitution in 978. All `numeric_changes` arrays
  are empty. This checks transfer, not the disputed raw source literals.
- Boundaries remain correct: 976-990 unheaded/g0, 991-1000 复习题/g1,
  1001-1008 家庭作业题/g2. Neither 974/975 nor N60 enters the lesson.
- 999 correctly uses `p0219#8` open plus `p0220#1` cont; the join is 公里,
  not two exercises or an incomplete second question.
- Only 1005 references/displays fig-223 in the exercise objects. The lesson
  prose contains no exercise-only figure block. This is a binding/content
  check, not modern image approval.

## All 33 source / author / text comparisons

The table compares every original task, not just candidate counts.
PASS means source mathematics and task agree between blind review and author,
and current raw/modern text preserve them, subject to representation qualifications.

| Exercise | Exact refs | Independent versus author solution/task | Raw / modern text decision |
| --- | --- | --- | --- |
| 976 | `p0217#1` | Six differences 2.1, 11.4, 4, 8.3, 83.562, 0.61; both include all six addition verifications | PASS; retains subtraction AND verification |
| 977 | `p0217#2` | Remaining 25.25 m | PASS |
| 978 | `p0217#3` | Album 1.48, combined 2.17; 0.79 is difference, not album price | PASS; modern dollars are declared nominal context units |
| 979 | `p0217#4` | Walker 5.3, opposing-direction closing speed 20.3 km/h | PASS |
| 980 | `p0217#5` | Eight subparts agree; fifth differs: frozen 963.081 from 963, author 96.381 from 96.3 | **HOLD-LITERAL-980E**; raw and modern consistently carry the author's unproved branch |
| 981 | `p0217#6` | Downstream 26.5, upstream 16.7 km/h | PASS; roles/order retained |
| 982 | `p0217#7` | Downstream 9, upstream 4; ray points 4,6.5,9 at intervals 8,13,18 | PASS; speed pair AND ray task/scale retained |
| 983 | `p0217#8` | 0,120,60 m/min; first is zero relative to bank, not water | PASS |
| 984 | `p0218#1` | Lake 81 plus upstream river 96 =177 km | PASS; river flowing into lake retained |
| 985 | `p0218#2` | Own 21.2, downstream 25.9; source asks downstream then own | PASS; wording retains requested roles |
| 986 | `p0218#3` | Both expressions at all three inputs: 53.6/81.546/0.002 and 36.946/9/90.544 | PASS; no substitution dropped |
| 987 | `p0218#4` | 23.625,65,465.8,**22.099** | PASS; final addend stays **0.345** |
| 988 | `p0218#5` | x+59.4,y+9.8,p+101.1,a-9.6,m+21.9,p+x+**20.01** | PASS; 2.542 and **17.468** both retained |
| 989 | `p0218#6` | All six evaluations agree: 19.58,32.28,51.06;102.021,135.65,107.133 | PASS |
| 990 | `p0218#7` | x=4,y=1.28; parentheses/minus checked by substitution | PASS |
| 991 | `p0218#9` | Four terms including given first:4.612,6.766,8.920,11.074 | PASS |
| 992 | `p0219#1` | Reviewer's 4-by-2 rectangle and author's 3-by-2 rectangle are different valid examples; each has four 90-degree angles | PASS; open drawing/measurement task, not a fixed rectangle |
| 993 | `p0219#2` | Both give common-O ray directions 0,32,120,244 degrees, producing 32,88,124 | PASS; no source diagram invented |
| 994 | `p0219#3` | All seven conversions agree:8.9,9.8,0.4,1.5 m;3.246,0.38,1.244 tonnes | PASS |
| 995 | `p0219#4` | 1/5,1/2,1/2,1/10,6,1 | PASS; original numeric subpart labels retained |
| 996 | `p0219#5` | Adjacent bounds (5,6),(6,7),(9,10),(25,26) | PASS; not rounded single values |
| 997 | `p0219#6` | Second sum larger in a, first in b, by corresponding summands without summing | PASS |
| 998 | `p0219#7` | 2923.2 cubic centimetres, from 580/120/42 millimetres | PASS; all three dimensions and requested cubic unit retained |
| 999 | `p0219#8`,`p0220#1` | Requested surface time 3 h and underwater distance 340 km, not intermediate 20 km | PASS |
| 1000 | `p0220#2` | 75 operations/hour, not 150 cubic metres/hour or 300 total operations | PASS |
| 1001 | `p0220#4` | All nine values agree:47.79,0.32,3.41,5.941,3.18,19.584,3.01,13.88,2.93 | PASS |
| 1002 | `p0220#5` | Downstream 46.3, upstream 34.7 km/h | PASS |
| 1003 | `p0220#6` | Own 19.9, upstream 16.1 km/h | PASS |
| 1004 | `p0220#7` | a agrees at 93565; b frozen 201000 from integer 146325, author 102125 from product 146·325 | **HOLD-LITERAL-1004B**; not punctuation normalization |
| 1005 | `p0220#8` | Both solve length 4.46 m then requested difference **1.57 m** | Mathematics PASS; opening literal HOLD remains; figure not reviewed in this phase |
| 1006 | `p0221#1` | 54.66,187.11,102.30,45.77 | PASS |
| 1007 | `p0221#2` | Forms 22.45-a,m+20.2 AND values20.81,22.9 | PASS; both requests retained |
| 1008 | `p0221#3` | x=8.6,y=7.3 with substitution checks | PASS |

No other source/author mathematical disagreement was found. The different
rectangle examples and 8.920/8.92, 0.380/0.38, 102.30/102.3 representations
are mathematically equivalent, not required revisions.

## Two newly exposed substantive literal HOLDs

### HOLD-LITERAL-980E

Concrete targets: `pages/0217/page.md:56`;
`pages/0217/page.json /blocks/4/lines/2`;
raw `/exercises/4/text`, `/exercises/4/lines/2`;
modern `/exercises/4/text` and `/exercises/4/source_text`;
author-solutions section 980 д); answer `/answers/4/parts/4`.

Exact alternatives:

- Frozen blind reading: $963+0.081=963.081$.
- Author/finalized raw/modern reading: $96.3+0.081=96.381$.

Both arithmetic branches are internally correct. Presence or absence of the
decimal point between 6 and 3 changes the operand by a factor of ten; it is not
Chinese versus ASCII sentence punctuation and cannot be resolved by a consistent
author/raw/modern chain.

Smallest source follow-up: the single literal in exercise 980's middle formula
row on original physical 0217 / printed 208, `p0217#5`, fifth subpart д).
Original page SHA-256:
`c4647a8a0885c890bd45021faf592bea5d14e503b1a0c03680e4bb482b0fe209`.
No image was opened for this finding.

### HOLD-LITERAL-1004B

Concrete targets: `pages/0220/page.md:77`;
`pages/0220/page.json /blocks/6/lines/2`;
raw `/exercises/28/text`;
modern `/exercises/28/text` and `/exercises/28/source_text`;
author-solutions section 1004 б); answer `/answers/28/parts/1`.

Exact alternatives:

- Frozen blind reading:
  $146\,325-(72\cdot306-1693)+75\,014=201\,000$.
- Author/finalized raw/modern reading:
  $146\cdot325-(72\cdot306-1693)+75\,014=102\,125$.

The disputed mark lies only between the initial 146 and 325. The later
$72\cdot306$, minus 1693 and grouped 75014 agree. The division and grouped
integers in a) also agree and yield 93565.
A gap and a multiplication dot are not equivalent layout representations.
Neither branch is established by its pleasing final integer or by source
finalization's mechanical pass.

Smallest source follow-up: first operand of 1004 б) on original physical
0220 / printed 211, `p0220#7`, final formula row.
Original page SHA-256:
`a9a3067a14d3863395571044eb10d0268dd74857313bbe4dfa6fb96cf8574416`.
No image was opened for this finding.

These are unresolved source-reading conflicts, not confirmed original printing
errors. Empty page `errata` arrays do not settle them.
REVISE any unconditional claim of independent source/answer PASS or "no ambiguity"
for these two parts. After a separately authorized literal supplement, change
only the losing editable source/output branch and its dependent answer as needed;
do not rewrite the three blind reports. No such production change was made here.

## Disposition of all four frozen HOLDs

| Frozen HOLD | Concrete target / exact alternatives | What this comparison establishes | Residual status / smallest follow-up |
| --- | --- | --- | --- |
| HOLD-PUNCT | `p0216#4`: question/sentence endings `.`/`。` and `?`/`？`; `p0216#9`: `1)`/`1）` etc.; exercise formula-list `;`/`；`, `:`/`：`; curly quote/codepoint widths | The current raw consistently uses readable Chinese punctuation while preserving sentence and list boundaries. Modern line layout/Latin subpart labels are disclosed. These are representation differences, not unknown operands or changed requirements. Decimal points and multiplication marks in the two new HOLDs are excluded from this allowance. | Nonblocking representation qualification; frozen exact-glyph precision is not retroactively certified. No source image follow-up required merely to select Chinese/ASCII punctuation. If facsimile glyph identity is explicitly needed, use only the named p0216 prose/rule marks, not all six pages. |
| HOLD-1005-WORD | `p0220#8` first line; raw/modern `/exercises/29/text`: `把一长7.35米的管子` versus `把一根长7.35米的管子` (classifier absent/present) | Author and raw also carry `把一长`; agreement is not proof of absence of a small classifier. Mathematical total, cut-into-two instruction, known 2.89 and difference question agree. | Genuine unresolved literal precision, but no mathematical ambiguity. Smallest supplement: only the opening before 7.35 in 1005, physical0220/printed211; can share the affected page with the 1004 literal if authorized. A declared modern wording polish may use `一根长...` without asserting the source prints 根. Current template does not make that polish. |
| HOLD-F223-CASE | Original figure long dimension glyph: lowercase `x` versus uppercase `X`; figure ref `p0220#9`, context `p0220#8` | Author calls it x; that is not independent source resolution. Current 1005 prose has no variable glyph, and the derived answer uses x consistently for unknown piece length. | Historical pixel HOLD persists. Lowercase x is a valid disclosed modern variable normalization if its unknown-piece role is unchanged. No need to reopen source to adopt that normalization; only exact source-glyph proof would require the existing fig223 crop's long label. |
| HOLD-F223-ARROWS | Four original dimension arrowheads in `p0220#9`: left-end arrow pointing left / right-end arrow pointing right versus the reverse pair pointing into the span | Neither author text nor page JSON specifies a sufficiently detailed independently confirmed orientation. Two dimensions, four heads and endpoint ownership remain agreed source facts. They are dimension arrows, not motion instructions. | Historical direction HOLD persists. Standardized dimension arrows may be disclosed modernization, not an original-pixel claim. If exact original arrow orientation is indispensable, the smallest affected original source is the existing fig223 crop at those endpoints; no reopen is authorized or performed here. |

The generic punctuation HOLD is not a reason to reopen all source pages.
The two literal disagreements, unlike punctuation representation, really do alter
math and require affected source evidence. For an economical parent-routed
literal supplement, 0217 supplies 980's mark and 0220 supplies 1004's mark plus
the optional 1005 classifier. Neither supplement is performed in this report.

## Modern prose and three-row subtraction

`p0216#4` and `p0216#7` change 卢布 to 美元 with `changes:["layout","units"]`.
Numbers 71.35,114.8,43.45 remain unchanged. This is a nominal cultural-unit
adaptation, not a currency-rate conversion. Exercise 978 similarly declares
`units` and retains 0.69 and 0.79; its answer display uses dollars consistently.

The full equality at `p0216#6` is unchanged:
$114.8-71.35=114.80-71.35=114\frac{80}{100}
-71\frac{35}{100}=43\frac{45}{100}=43.45$.
No mixed-number fraction or decimal zero was lost.

Original `p0216#8` contains three separate source rows:

```text
$\phantom{-}114.80$
$\underline{-\ \phantom{1}71.35}$
$\phantom{-1}43.45$
```

Raw lesson text preserves the row contents as three separate math fragments
but concatenates them with spaces. The current modern `prose[4].text` instead
declares one three-row, right-aligned array, with two explicit row breaks:

```tex
\begin{array}{r}
\phantom{-}114.80\\
\underline{-\ \phantom{1}71.35}\\
\phantom{-1}43.45
\end{array}
```

Decision: PASS at text/layout-contract level. It keeps minuend, subtrahend,
minus sign, subtraction rule and result in the correct three-row order instead
of displaying a horizontal list. The decimal positions have matching two-place
suffixes. `changes:["layout"]` and the exact `source_text` disclose this
representation change. The modern section boundary identifies this array
followed by the start of the four-step rule; all four steps remain in `prose[5]`.
No render, KaTeX execution, browser screenshot or final screen alignment was
claimed or performed in this zero-image phase.

## 1005 algebra, not figure approval

The known short piece is 2.89 m; the original uncut whole is 7.35 m.
Both independently solved and author answers give:
$x=7.35-2.89=4.46$ m; requested excess $4.46-2.89=1.57$ m.
The current modern text keeps the comparison question and does not expose
either derived answer. The answer draft's single graded target is the difference,
not x, while its explanation correctly distinguishes both.
This verifies text/algebra and source reference ownership only.
The unapproved modern figure is not approved by agreement on the algebra.

## Phase completion

Only this new report and `answer-transfer-review.md` were written in this phase.
No frozen evidence or production file was edited; no staging, DB/env, service,
install, paid generation, other-chat message, thread/tree/branch/timer, commit/
push, merge/deploy/close action was performed.
Image count at this report's phase boundary: **new0, cumulative7/24**.
The two literal source branches require follow-up; unrelated passed task/text
comparisons do not need repeating.
