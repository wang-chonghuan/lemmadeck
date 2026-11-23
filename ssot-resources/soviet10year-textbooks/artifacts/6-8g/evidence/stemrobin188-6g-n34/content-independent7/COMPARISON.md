# N34 Candidate Comparison

Stage: CANDIDATE COMPARISON ONLY. Review date: 2026-11-23.
Overall decision: **REVISE / PENDING APPLICATION OF C1**.
Only C1's exact replacement text below is approved as a proposed mathematical
clarification. It has NOT been applied. Nothing is finalized or published.

Sole checkout: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188.
Owned directory: .intentfold/tickets/STEMROBIN-188/tmp/n34-content-independent7/.

## Preserved Source-First Baseline

The prior source solve is reused, not rerun. Both original seals remain 0444:

| Baseline file | SHA-256 |
| --- | --- |
| SOURCE-FIRST.md | 631f6f8f3c90513632da6db1fa07392aa72e29ab2ad3966c72eeefcbf61dfc2f |
| source-review.json | 8b10a197dcdb7c7753f03bb44f52b05523eb86b8bfe961b2b41804e3e58a4eff |

The source input bindings retained in that baseline are:

| Source input | SHA-256 |
| --- | --- |
| preparation7/artifacts/6-8g/lessons/geo68-c3-s2-n34/lesson.json | 1d541a8d06026a26c0067499c2626ac79af77dda375b933f20085cca1f909161 |
| preparation7/artifacts/6-8g/lessons/geo68-c3-s2-n34/exercises.json | 0a14e546f42e94f586e9d2296cceee9ec35a78bbe5e947c92b787132d8feddee |
| preparation7/artifacts/6-8g/figures/tbl-p0160-01.png | c5a719f4420f6800c092eecfe888fa23f37417dc8ed3aea0739fadd2e68b749f |
| preparation7/artifacts/6-8g/figures/fig-213.png | e42e4ea9ff4bffc89c4597620d977411cb82c7b86bdc973272f6d64505279bb9 |

No images were opened in this stage. Prior actual usage remains **2/8 batch,
2/24 context**; added images, reopens, crops and source pages are all zero.
PNG hashes above are inherited from the sealed baseline, not a new image review.
The exact congruence glyph identity and downward-mark/historical script roles
remain UNKNOWN. Their retention is not approval of their identity or role.

## Disclosed Candidate Bindings

The following paths share this prefix:

`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34/`

| Candidate | SHA-256 |
| --- | --- |
| text-author7/lesson.template.json | d4de26329f1fe2b28ca5c63c477319078d773866f2469a17ace9944910ba4303 |
| text-author7/exercises.template.json | 3f269c0542abfcc7dfbd3f4535a20d0ef714c0fff1df744db83eda9efefb670e |
| answers-author7/candidate-answer-keys.json | 0c68160e262a40d1ca141e6cd0f1d77696795677e1a9e31f1449e2af113305cb |

The answer bytes match the parent's disclosed SHA exactly. Only the four written
answer explanations are evaluated mathematically; this is NOT key, grading,
choice or publication approval despite the answer file's name.

Structured comparison confirmed 12 paragraph text entries, four written
exercises and four answer records. All paragraph/exercise source anchors and
existing dollar-delimited formulas are preserved. Candidate source.data equals
the bound raw source JSON, and source_text fields match those snapshots.
Outside layout, the prose/exercise changes are the word replacement 合同 -> 全等.
This preserves the mathematical congruence concept; it identifies no glyph.
The two figure placeholders and caption are retained; no figure approval follows.

## All 12 Lesson Text Entries

PASS below means no independent mathematical text revision at that entry.
Where C1 is a dependency, it does not make the current lesson a finalized PASS.
For unresolved glyph/mark roles, PASS is expressly limited to mathematical
content or unchanged retention, not historical identity/role approval.

| Entry / JSON index | Decision | Concrete assessment |
| --- | --- | --- |
| p0159#7 / 0 | PASS | Relation examples retained; modern congruence wording preserves the stated concept. |
| p0159#8 / 1 | PASS, retention only | All listed formulas unchanged; exact historical congruence glyph remains UNKNOWN and unapproved. |
| p0159#9 / 2 | PASS | xRy notation and the listed relation roles preserved. |
| p0159#10 / 3 | PASS | Introductory statement retained without mathematical change. |
| p0159#11 / 4 | PASS | Reflexivity still quantifies over every x in M. |
| p0159#12 / 5 | PASS | Symmetry is the implication xRy -> yRx for elements of the same domain; not antisymmetry. |
| p0160#1 / 6 | PASS | Transitivity preserves both premises and the xRz conclusion; no distinct-variable restriction is introduced. |
| p0160#2 / 7 | REVISE: C1 | Table legend is faithful but does not state the equality-inclusive parallel convention needed by the table and later assertions. |
| p0160#4 / 9 | PASS under C1 | Equivalence definition and congruence claim are correct; parallel's three-property assertion requires C1. No second field revision. |
| p0160#5 / 10 | PASS, mathematics only | Same-block relation of a genuine partition is an equivalence. Downward-mark role stays UNKNOWN. |
| p0160#6 / 11 | PASS | Every equivalence relation determines nonempty covering classes that are equal or disjoint; the iff claim is correct. |
| p0160#7 + p0161#1 / 12 | PASS under C1 | The parallel-family partition follows from equality of unoriented directions including coincidence. Neighboring-section reference merely retained, not reviewed. |

The table semantics are reused from the source solve: in column order parallel,
perpendicular, congruence, <, <=, the reflexivity row is +,-,+,-,+; symmetry is
 +,+,+,-,-; transitivity is +,-,+,+,+. Those mathematical verdicts require the
stated full domains and equality-inclusive parallelism. No modern table image
or figure has been inspected or approved.

## The One Approved Clarification Field

ID: **C1**.
Candidate: text-author7/lesson.template.json.
Selector: prose entry with source_refs exactly ["p0160#2"].
JSON Pointer: **/prose/7/text**.
Approval: **MATHEMATICAL APPROVAL OF THIS EXACT PROPOSED TEXT ONLY**.
Application: **NOT APPLIED**.

Replace only that text field with exactly:

```text
关系可以仅具有上述性质中的一种，也可以具有上述性质中的两种，也可以具有上述所有的三种（或者不具有上述性质中任一种）．
核对下面的表，符号“$+$”表示关系具有所指出的性质，符号“$-$”表示关系不具有所指出的性质．
本课正文及下表在同一平面的所有直线上讨论平行关系；这里的“平行”包括重合，即两条直线重合，或者没有公共点．习题 449 中学生给出的定义只包括没有公共点的情形，不包括重合，应与这里的约定区分．
```

The first two lines are the current field verbatim. The third line is the sole
proposed addition. Existing formulas $+$ and $-$ remain exactly unchanged; no
other existing formula is touched and no new formula is introduced. Source_text,
source.data, source_refs, raw source, exercise statements and figure assets must
not be changed by this text proposal.

Mathematical reason: on all lines in one plane, the stated relation is equality
of unoriented direction, including identical lines, so it is reflexive,
symmetric and transitive and produces the claimed parallel classes. The
strict-disjoint relation in 449 excludes its diagonal and fails transitivity
when x=z. Stating this distinction before the table removes the current
ambiguity at the point where learners first need it.

Necessary change classification: **SUBSTANTIVE MATHEMATICAL DEFINITION
CLARIFICATION**, not layout-only, not historical-label replacement, and not a
numerical/formula correction. The present ["layout"] declaration alone would
not describe the added sentence honestly. This review does not invent or
approve a metadata enum or a second replacement field; the parent must use the
existing valid change-declaration mechanism when applying C1.

This does not assert an original glyph identity or the meaning of a historical
mark, nor rewrite the student's strict definition to force equivalence.

## Four Written Exercise Statements

| Exercise | Decision | Assessment |
| --- | --- | --- |
| 446 | PASS | Segment domain preserved; modern congruence wording retains the source task. |
| 447 | PASS | All three relations and the property questions remain; fixed O and original common-point wording are retained. |
| 448 | PASS | Open request for several equivalence examples unchanged. |
| 449 | PASS | Student's coplanar/no-common-point definition unchanged, including its exclusion of coincidence. |

447(3) follows the parent's explicit scope choice: preserve the original wording
and the ungraded/read-only written task, and provide both conditional readings.
The source-first suggestion to choose an explicit rewritten prompt was only a
proposal; it is not imposed as a gate and the sealed source record is not edited.

The qualified answer is sufficient here: it labels "at least one" and "exactly
one", handles coincidence differently, gives each branch's property verdicts
and explains their common nontransitivity. It explicitly denies confirmation
of original intent. Uncertainty alone does not require a source or prompt rewrite.
This sufficiency depends on preserving the conditional explanation, not
collapsing it into one unqualified reflexivity answer or a graded option.

## Four Written Answers: Mathematical Comparison

| Answer | Decision | Checked derivation |
| --- | --- | --- |
| 446 | PASS | Congruence iff equal length on ordinary unoriented segments; equality proves all three properties. Position/orientation not required to match. |
| 447 | PASS | Every subpart is correct, including the non-fixed-segment counterexample and both common-point branches; details below. |
| 448 | PASS | Three valid explicitly scoped examples, with proofs; other correct examples are expressly allowed. |
| 449 | PASS | NO/YES/NO on the full strict-disjoint line relation, with x=z allowed; equality-inclusive lesson convention is explicitly contrasted. |

447(1): equality of the finite ordinary area values is reflexive, symmetric and
transitive, and does not imply congruence. The answer's equality reasoning is
sufficient; a rectangle example from the baseline need not be added.

447(2): S is the fixed-O half-turn, and S(S(x))=x proves symmetry of y=S(x).
The concrete segment with endpoints (1,0),(2,0) about O=(0,0) is non-fixed.
Taking y=S(x), z=x makes both premises true while xRz is false. Thus the
answer correctly gives NO/YES/NO and non-equivalence. It does not conflate the
image relation with the different orbit relation y=x OR y=S(x).
The note about fixed segments having midpoint O is correct; it does not
mistake special fixed instances for universal reflexivity.

447(3): at least one common point gives YES/YES/NO; exactly one gives
NO/YES/NO. The same distinct lines a:v=0, b:u=0, c:v=1 provide unique
intersections (0,0),(0,1) for the premises and no intersection for a,c.
Both branches therefore correctly conclude non-equivalence. The answer and
notes qualify the branches rather than claiming source intent is settled.

448: equal length on unoriented segments, parity equality on integers
(divisibility of m-n by 2), and absolute-value equality on real numbers are
all equivalences. The divisibility proof uses 0, negation and addition; the
other proofs are equality of assigned values. The baseline's different
examples were not an exclusive answer list. The draft remains open and ungraded.

449: a line meets itself, disproving reflexivity; coplanar disjointness is
symmetric. With x:v=0, y:v=1, z=x, x is strictly parallel to y and y to z,
but x,z coincide. Universal transitivity allows this assignment, so it fails.
The answer's inclusive/strict contrast agrees with C1. No answer rewrite is
needed when C1 is applied to the lesson.

Provenance notes claiming absence of book-answer files are not independently
verified in this scope; no such files were read. No bookRaw evidence, historical
answer identity, grading logic, keys or choices are approved. Mathematical PASS
above is limited to the disclosed written explanations.

## Pending Application And Scope Limits

Current lesson component: **REVISE**, solely for C1.
Written exercise statements: **PASS** under the parent's preserved wording.
Four written answer explanations: **PASS**, with 447(3) explicitly conditional.
Exact proposed C1 field: **APPROVED FOR MATHEMATICS ONLY; NOT APPLIED**.
Overall current candidate: **PENDING APPLICATION**, not finalized or approved
as a complete modern lesson. Unknown glyph/mark roles remain unchanged.

No source-page review, extra image opening, figure approval/creation,
key/choice/grading approval, source edit, DB/model/network/Git/app/code operation
or peer message occurred. Only COMPARISON.md and approval.json were added and
sealed 0444. Existing source-first files, images and candidate bytes remain
unchanged. Stop at this comparison handoff.

approval.json records the exact original/replacement C1 strings, input hashes,
per-component decisions, inherited image count and pending-application status.
Final output hashes are reported externally after sealing.
