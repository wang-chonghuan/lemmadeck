# N59 independent answer-transfer review

Status: HOLD on 980 e) and 1004 b) pending source-literal supplement;
REVISE whole-task automatic-grading claim for 976.
Other answer content/part-role transfers: qualified PASS.
Date: 2026-11-23. Ticket: STEMROBIN-187.
Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Lesson: `math4-c2-s2-n59`.

This is a review, not acceptance of the candidate's declared counts.
Every display answer and each part's label, judge type, expected value and order
were compared with the prior frozen independent solutions and original requested
roles, then with the current modern text and authoritative raw bindings.
The source/author comparison's two incompatible literal branches are retained,
not settled by trusting candidate answers.

New image loads in this phase: **0**. Cumulative usage when this report was saved:
**7/24**. No grader code or tests were read/run, no runtime grading session was
executed, no client payload was created, and no answer artifact was modified.

## Bound inputs

All evidence filenames below are in this lesson's durable evidence directory.

| Input | SHA-256 |
| --- | --- |
| Frozen `independent-solutions.md` | `5efa5e835a99978aa7856dab61cbab9277b71babb0cc365f329ce516017044a8` |
| Frozen `independent-source.md` | `2b8e742b9ad8f2d92ea56cb1cb48663969c504b8ddd086f277874c818459dc8b` |
| `author-solutions.md` | `ce8e45a9d353be0945e54cf06dd6e61ef795b12c60d128548b87c769dc340e0d` |
| `answer-draft.json` | `db39cc4f49b1f495292f203cc782d87ea62e4d1a444656453c6b58a90cb06101` |
| Raw `../exercises.json` | `70bb8badaf0a2859701ea6f6436df183a6ecf9bc8d6be6647307595c2fb1d062` |
| Current modern `exercises.template.json` | `849b9942623db708662591480584bc098804cbef12ecac6add5948fb08ff8120` |
| Current modern `lesson.template.json` | `819c59725da5bcc588e27584729867cb6fafb0b41c38ed819c80a388211d8e5b` |

Raw exercises live at the checkout's
`ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n59/exercises.json`;
the current templates live at
`.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n59/`
under the same explicit checkout. Full page/current-source hashes and exact
bindings are recorded in `source-author-modern-text-comparison.md`.

## Actual candidate enumeration

The candidate has schema `ld-s10y-answer/lesson-answers@1`, book4m,
lesson math4-c2-s2-n59, edition modern-us-neutral, status draft.
There are exactly **33 unique answers, 976-1008, ordered correctly**:

- **29 auto** entries.
- **4 ungraded** entries: 982,992,993,997, each with an empty `parts` array.
- **105 actual graded parts**: **97 numeric +8 expression**.
- Each graded part has one declared expected expression/value.
- Against frozen expected values/forms, **103 parts match**:95 numeric and
  all8 expression. **2 numeric parts disagree** and require source resolution.

The count105 is not the65 printed-label count: variable substitutions in986/989,
conversion lists in994, two bounds per number in996, four terms in991, and
the simplification/value pairs in1007 legitimately expand answer parts.
Conversely, 978's album price and 1005's unknown-piece length are intermediate
results, not extra required graded targets. Ungraded reasoning/drawing tasks
retain their complete display solutions.

## Exhaustive part and requested-role comparison

Numeric lists are in actual candidate part order. Fractions denote exact
numeric values; expression forms are not numeric approximations.
PASS below concerns declared answer content and role/order, not execution of
the production numeric/expression judge.

| Exercise | Candidate parts / required roles in order | Content decision and grading qualification |
| --- | --- | --- |
| 976 | a-f differences:2.1;11.4;4;8.3;83.562;0.61. Display additionally contains all six exact addition checks. | Values and display PASS. **REVISE-GRADE-976**: six numeric parts alone do not assess the explicitly requested addition verification. |
| 977 | Remaining length25.25 m | PASS; one requested numeric target |
| 978 | Combined price2.17 dollars; display intermediate album1.48 dollars | PASS; grader asks combined price, not album price or0.79 |
| 979 | Closing speed20.3 km/h; display walker5.3 | PASS; opposing directions require sum |
| 980 | a-i:14.7;138.72;2.64;25.067;**96.381**;829.9903;0.0044;0.001;422.353 | Eight PASS; e) **HOLD** versus frozen963.081. Candidate matches current raw96.3 branch but does not prove the source mark. |
| 981 | Downstream26.5;upstream16.7 km/h | PASS; requested role/order agrees |
| 982 | No graded parts. Display downstream9,upstream4; positions4,6.5,9 at intervals8,13,18, scale2 intervals/unit | PASS as ungraded combined speed/ray construction; no ray geometry is falsely automatically graded |
| 983 | a0;b120;c60 m/min | PASS; display qualifies first as bank-relative stationary |
| 984 | Total177 km; display81 lake+96 upstream river | PASS; preserves river-to-lake flow relationship |
| 985 | Downstream25.9;own21.2 km/h | PASS. Display derives own first, but explicit part labels restore source's requested downstream/own order; not an unlabeled swapped pair. |
| 986 | a at30.4→53.6;2.454→81.546;83.998→0.002; b at30.4→36.946;2.454→9;83.998→90.544 | PASS all6; expression-major order and each variable condition are explicitly labelled |
| 987 | a23.625;b65;c465.8;d**22.099** | PASS all4; exact final value, no rounding to22.1 |
| 988 | a:x+59.4;b:y+9.8;c:p+101.1;d:a-9.6;e:m+21.9;f:p+x+**20.01** | PASS all6 expression targets; not a fabricated numeric value for variables |
| 989 | a y8.6→19.58;21.3→32.28;40.08→51.06; b x32.021→102.021;65.65→135.65;37.133→107.133 | PASS all6; conditions/roles/order intact |
| 990 | a x4;b y1.28 | PASS; display substitution checks are correct |
| 991 | First4.612;second6.766;third8.92;fourth11.074 | PASS all4; first given term is included,8.920 equivalent to8.92 |
| 992 | No graded parts. One3cm-by2cm rectangle example with four90-degree angles, plus other valid quadrilaterals allowed | PASS as ungraded open construction/measurement. Difference from reviewer's4-by2 example is not a wrong answer. |
| 993 | No graded parts. Common-O rays0,32,120,244 degrees yield32,88,124 | PASS as ungraded construction; not merely three numeric recall targets |
| 994 | a:8.9;9.8;0.4;1.5 m; b:3.246;0.38;1.244 tonnes | PASS all7; each original length/mass item is explicitly identified |
| 995 | Numeric-labelled1-6:1/5;1/2;1/2;1/10;6;1 | PASS all6 exact fractions/integers. Candidate expected LaTeX fractions have the correct mathematics; runtime fraction parsing was not tested. |
| 996 | 5.1 lower5,upper6;6.32 lower6,upper7;9.999 lower9,upper10;25.257 lower25,upper26 | PASS all8; role labels preserve each bound pair rather than eight context-free numbers |
| 997 | No graded parts. a second sum; b first sum; each justified termwise, no total computed | PASS as ungraded comparison/reasoning, respecting 不要计算 |
| 998 | Volume2923.2 cubic centimetres | PASS; display converts580/120/42mm to58/12/4.2cm, not an erroneous linear conversion of cubic volume |
| 999 | 1 surface time3h;2 underwater distance340km | PASS;20km surface distance is intermediate only, not substituted for the requested340 |
| 1000 | Hourly operations75 | PASS;150m³/hour is intermediate;300 operations over4h not misgraded as hourly |
| 1001 | a-i:47.79;0.32;3.41;5.941;3.18;19.584;3.01;13.88;2.93 | PASS all9 |
| 1002 | Downstream46.3;upstream34.7 km/h | PASS requested role/order |
| 1003 | Own19.9;upstream16.1 km/h | PASS requested role/order |
| 1004 | a93565;b**102125** | a PASS; b **HOLD** versus frozen201000. Candidate's displayed calculation is correct only if initial146·325 is the source literal. |
| 1005 | Length difference**1.57 m** only; display unknown x4.46m separately | PASS original requested answer; figure approval not implied; derived values are not question-image givens |
| 1006 | a54.66;b187.11;c102.3;d45.77 | PASS all4;102.30 equivalent to102.3 |
| 1007 | a simplified22.45-a(expression),value20.81(numeric); b simplifiedm+20.2(expression),value22.9(numeric) | PASS all4, both requested roles retained in subpart-major order |
| 1008 | a x8.6;b y7.3 | PASS; both displayed substitution checks agree |

All display equations/conditions not separately numeric-graded were also checked:
976 addition checks,978/979 intermediate values,982 ray instructions,984 flow
explanation,985 role derivation,989 reduced forms,990 substitutions,992/993
construction examples,996 inequalities,997 termwise comparisons,998 unit
conversion,999 intermediate time/distance,1000 volume rate,1004 conditional
arithmetic,1005 two-stage subtraction and1008 substitutions.
No additional answer-content or order mismatch was found.

## Exact disputed targets and conditional arithmetic

### 980 e)

Answer JSON pointer `/answers/4/parts/4/expected/0` is `"96.381"`;
the same value occurs in `/answers/4/displayAnswer`.
Modern target is `/exercises/4`, modern e), mapped from original Cyrillic д),
source `p0217#5`, `pages/0217/page.md:56`.

- If source says96.3, candidate96.381 is correct.
- If source says963, frozen963.081 is correct and candidate must be revised.

This is a decimal-point literal HOLD, not permissible punctuation normalization.
Smallest original follow-up: fifth subpart of980, physical0217/printed208.
Do not "fix" either answer solely by copying the other reviewer.

### 1004 b)

Answer JSON pointer `/answers/28/parts/1/expected/0` is `"102125"`;
display computes146·325=47450, then subtracts20339 and adds75014.
Modern target is `/exercises/28`, b), original б), source `p0220#7`,
`pages/0220/page.md:77`.

- Product branch:146·325−20339+75014=102125.
- Grouped-integer branch:146325−20339+75014=201000.

The entire dispute is the initial gap versus multiplication dot; neither branch
has an arithmetic error. Smallest original follow-up: that mark on physical0220/
printed211. The source/author report binds both alternatives and page hashes.

## REVISE-GRADE-976: distinguish answer display from assessed task

Original and modern976 both ask to subtract **and verify using addition**.
The candidate's display answer does faithfully transfer all six addition
equalities; there is no missing explanation.
However, `/answers/0/grading` is `auto`, with only six `judge:"numeric"` parts
for the differences. A learner can supply the six differences and satisfy those
declared parts without demonstrating any addition verification.

Therefore automatic correctness of those six targets is **partial task
assessment**, not verified completion of the original compound task.
The smallest follow-up is to qualify that assessment explicitly in the owning
grading contract, or use the existing ungraded whole-task approach if complete
verification is required. Do not claim that the six displayed equations are
learner-graded merely because they appear in `displayAnswer`; do not invent a
new grader or add duplicate numeric "checks" which still assess only numbers.
This report changes neither the grading field nor any code.

The other ungraded selections982/992/993/997 are justified by their drawing/
measurement/reasoning requirements. Their empty parts are not missing answer
transfers. A future decision to grade their numeric subcomponents would still
need to retain the ungraded construction/reasoning remainder.

## Exactness, representation and runtime boundary

- 987 d) input0.345 and answer**22.099** agree between frozen source, author,
  current page/raw/modern and candidate. No22.1 approximation is accepted here.
- 988 f) inputs2.542 and17.468, simplified constant**20.01**, agree across all
  layers. No20 regularization is accepted here.
- Modern currency units in978 and the prose are dollars consistently; no
  exchange rate or changed numeric amount is inferred.
- Cyrillic source subparts map sequentially to modern Latin a,b,c,d,e,f,g,h,i.
  Numeric subparts995/999 remain numeric. A mathematical Latin variable a
  in986 is distinct from the modern subpart a); the candidate labels identify
  both roles explicitly.
- Trailing zeros and reduced fractions are valid exact representations, not
  changed expected mathematics.
- Eight expression targets contain the correct simplified affine forms.
  This review does not prove that the unseen production expression judge
  accepts all commuted equivalent forms, enforces simplification rather than
  mere equivalence, parses LaTeX fractions, handles numeric tolerance correctly,
  or assesses units entered by a learner.
- Numeric labels/display establish the intended units, but numeric target
  declarations alone do not demonstrate automatic unit validation.
- Runtime judging, answer publication, client projection and learner UI were
  neither inspected nor executed. No claim of end-to-end grading PASS is made.

## Review conclusion

Do not promote the candidate on its29/4/97/8 enumeration alone.
The substantive result is103 matching graded parts,2 unresolved source-dependent
parts,4 complete ungraded task displays, and one explicit partial-grading
qualification requiring a corrected whole-task acceptance claim.
After literal source resolution, revise only a losing part and its source/
display dependants if necessary; reuse unaffected comparisons.
Original blind reports, candidate files and all staging are untouched.
This report and the companion text comparison were saved before the separately
authorized two-image modern-figure review.
