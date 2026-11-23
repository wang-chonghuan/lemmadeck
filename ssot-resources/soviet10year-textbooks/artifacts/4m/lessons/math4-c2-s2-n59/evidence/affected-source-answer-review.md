# N59 affected-only source and answer review

Frozen on 2026-11-23. Ticket: STEMROBIN-187.
Lesson: `math4-c2-s2-n59`; edition: `modern-us-neutral`.
Working directory for every shell call:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

**Disposition: PASS for both affected source/answer transfers; PASS for the
976 partial-grading qualification and 1005 wording; PASS for the narrow
current figure-223 arrow-direction comparison. The complete answer candidate
may enter the official lesson-answer prepare/finalize workflow, with the
103 unaffected part verdicts explicitly reused as authorized.**

This is an affected-only content review, not a new exhaustive solution,
whole-lesson approval, runtime grading approval or successful finalization.
No checker, MathLive, database or environment operation was run.

## Frozen independent basis and reused verdicts

The byte-frozen `literal-source-supplement.md` certified:

- Exercise 980, original fifth Cyrillic д): `96.3 + 0.081`.
- Exercise 1004, original Cyrillic б):
  `146325 - (72 * 306 - 1693) + 75014`; the opening is one grouped integer.
- Exercise 1005 begins `把一长7.35米的管子`, with no extra 根.
- Figure 223 has four outward-pointing dimension arrowheads and a readable
  x/X-like crossed unknown label, without reliable original letter-case proof.

The separately frozen `affected-source-solutions.md`, written before reading
the candidate, independently established exact results **96.381** and
**201000**, including full calculation chains. Those chains are reused here,
not rederived from candidate answers.

Descartes's `answer-transfer-review.md` is retained unchanged. Its
`Actual candidate enumeration`, `Exhaustive part and requested-role comparison`
and `Review conclusion` record **103 matching unaffected graded parts**:
95 numeric and all 8 expression parts. Its four ungraded-task display
qualifications and runtime/exactness limitations are also reused, not rerun.
The prior whole-file input hashes in that report describe its historical
snapshot; they are not asserted equal to the repaired current files below.
Reuse of its unaffected verdicts is the caller-authorized scope of this review,
not a fresh exhaustive comparison or solution of those 103 parts.

Its historical HOLD on 980 e) and 1004 b) is resolved by the independent literal
supplement plus the current affected comparisons below. This new sidecar records
the resolution; neither that report nor any earlier HOLD report was edited.
The original figure-label case limitation remains historical and qualified.

## Current source and edition binding

Both current page JSON files' `/meta/render/sha256` match the source PNG hashes
certified in the literal report. The inspected Markdown and corresponding
JSON exercise blocks agree for the affected text.

The raw lesson owns lesson identity, exercise count and figure inventory; the
expressions themselves are in raw `exercises.json`, not duplicated in raw
`lesson.json`. Both finalized modern files declare `status: "ready"`.
Modern lesson `/source/sha256` equals the current raw lesson hash; modern
exercises `/source/sha256` equals the current raw exercises hash. The inspected
affected source snapshots and each modern exercise's `source_text` agree with
the current raw text. All four affected/qualified exercises retain their
original `pages` bindings.

### Exercise 980, original д) to modern e): PASS

- Current `pages/0217/page.md:56` and page JSON
  `/blocks/4/lines/2` contain original `д) $96.3+0.081$`.
- Raw `/exercises/4` identifies exercise `"980"` and source `p0217#5`;
  its text and lines preserve that decimal point.
- Finalized modern `/exercises/4/lines/5` is `e) $96.3+0.081$`.
  `source_number` remains `"980"`; the sequential fifth-subpart mapping is
  Cyrillic д) to Latin e), not original Cyrillic е).
- Candidate `/answers/4` identifies `"980"`; `/parts/4` is label `"e)"`,
  judge `"numeric"`, expected `["96.381"]`. `/displayAnswer` also gives
  `e) $96.381$`.
- This equals the previously frozen independent result. Source, mapped role,
  expected value and display agree. The old integer-963 alternative is not
  the certified source and is not a reason to change this answer.

### Exercise 1004, original б) to modern b): PASS

- Current `pages/0220/page.md:77` and page JSON `/blocks/6/lines/2` contain
  `б) $146\,325-(72\cdot306-1693)+75\,014$`.
- Raw `/exercises/28` identifies `"1004"` and source `p0220#7`; text and lines
  preserve that grouped integer. `\,` is number-grouping space, not multiplication.
- Finalized modern `/exercises/28/lines/2` is
  `b) $146\,325-(72\cdot306-1693)+75\,014$`.
  Its raw snapshot and `source_text` agree. The only multiplication is
  `72\cdot306`; no product `146\cdot325` survives in this branch.
- Candidate `/answers/28/parts/1` is label `"b)"`, judge `"numeric"`,
  expected `["201000"]`.
- The b) display calculates `72\cdot306-1693=20\,339`, then
  `146\,325-20\,339+75\,014=201\,000`. These terms and result match the frozen
  independent calculation chain.
- The prior product-branch answer 102125 is replaced in this affected part
  and its display. This is the certified grouped-integer branch, not an
  answer copied merely to agree with another candidate.

## Exercise 976: honest partial automatic assessment

**PASS-QUALIFIED; the previous REVISE-GRADE-976 concern is addressed by notes,
not by claiming that the current grader assesses addition verification.**

The current original and modern prompts still require subtraction **and**
addition verification. Candidate `/answers/0/grading` remains `"auto"`.
Its six parts, in a)-f) order, are all `"numeric"` and contain only the six
differences: `2.1`, `11.4`, `4`, `8.3`, `83.562`, `0.61`. Their prior content
verdict is reused; none was recalculated in this phase.

The existing complete display is retained: it lists those six differences
and the six addition checks
`7.3+2.1=9.4`, `5.47+11.4=16.87`, `3.79+4=7.79`,
`2.8+8.3=11.1`, `4.69+83.562=88.252`, `5.99+0.61=6.6`.
Presence in a display does not make these learner-graded targets.

Current `/answers/0/notes` explicitly says:

> 本题要求做减法并用加法验算。现有 numeric parts 只判定六个差；加法验算须书写，不由当前 numeric 判题器检验。displayAnswer 完整保留六条验算等式，不能据六个差全对宣称整题全部要求已完成。

This is an honest scope qualification in the owning answer entry: automatic
assessment covers only the six differences; written addition verification
remains unassessed by those parts. It satisfies the prior report's explicit
qualification remedy. No duplicate numeric checks, new grader, or false
whole-task automatic-completion claim was introduced. Whether production
interfaces expose or enforce this limitation was not inspected.

## Exercise 1005 wording and figure 223

### Original wording: PASS

Current `pages/0220/page.md:80`, page JSON `/blocks/7/lines/0`,
raw `/exercises/29` text/lines, finalized modern `/exercises/29` text/lines
and `source_text` all begin `把一长7.35米的管子`, without 根.
The modern embedded raw snapshot agrees. Both raw and modern exercise entries
reference `fig-223`; both lesson inventories retain that figure. No numeric
answer or other part of exercise 1005 was independently solved here.

### Current arrow directions: PASS, textual comparison only

The current figure spec's source image hash equals the certified fig-223 PNG
hash. Its authoritative exercise text has the corrected `把一长...` wording.
The four arrow objects run from each dimension midpoint toward its terminal:

| Spec object | From | To | Direction |
| --- | --- | --- | --- |
| `left-dimension-start-arrow` | `(371.5,405)` | `(48,405)` | Leftwards |
| `left-dimension-finish-arrow` | `(371.5,405)` | `(695,405)` | Rightwards |
| `right-dimension-start-arrow` | `(890,270)` | `(780,270)` | Leftwards |
| `right-dimension-finish-arrow` | `(890,270)` | `(1000,270)` | Rightwards |

The current SVG was parsed as XML, not opened or rendered as an image.
It contains four actual `g[data-arrowhead-for]` groups, each with triangle
path `M 0,0 L 10,5 L 0,10 z`, corresponding to these four arrows. Their
transforms contain:

- Long left terminal: `translate(63 75) rotate(180)`.
- Long right terminal: `translate(680 75) rotate(0)`.
- Short left terminal: `translate(795 210) rotate(180)`.
- Short right terminal: `translate(985 210) rotate(0)`.

Thus the implemented arrowheads, not merely unused marker definitions or
object counts, agree with the certified outward directions. The current
render/review metadata declares `pass` and binds the actual current spec,
render and SVG hashes listed below. The review notes cite the literal
supplement's exact hash for source-arrow confirmation.

Current lowercase `x` is expressly disclosed in those review notes as
normalization while the historical source-case HOLD remains. This review
does not claim that the original is provably lowercase, add a punctuation
facsimile gate, or re-review the whole modern figure or its display.

## Candidate disposition and official workflow boundary

The current candidate remains `ld-s10y-answer/lesson-answers@1`, book `4m`,
lesson `math4-c2-s2-n59`, edition `modern-us-neutral`, status `"draft"`.
Read-only enumeration gives 33 answers, 29 auto and 4 ungraded entries,
105 declared parts: 97 numeric and 8 expression.

The combined content/role disposition is **105 graded parts PASS:
103 caller-authorized reused verdicts plus 2 freshly compared affected parts**.
The four ungraded display qualifications are inherited from Descartes's
report. Exercise 976 is explicitly only partially automatically assessed.
No unresolved affected arithmetic-source/answer mismatch remains.

**Yes: this complete candidate can proceed into official lesson-answer
prepare/finalize**, preserving its notes, reviewed part roles and frozen
evidence. It is not yet certified as the official finalized answer-key
artifact. The official workflow must perform its own prescribed mechanical
validation and retain its resulting evidence; this sidecar neither substitutes
for that execution nor predicts its success. No prepare/finalize, checker,
MathLive, DB/environment, commit or push operation occurred in this phase.

All older reports remain unchanged. This sidecar does not authorize publication,
whole-lesson approval, other-part re-solving or additional image loads.

## Exact input hashes

All paths are below
`ssot-resources/soviet10year-textbooks/artifacts/4m/` in the explicit working
directory above. The following input hashes were stable across this comparison.

| Input relative to that 4m root | SHA-256 |
| --- | --- |
| `lessons/math4-c2-s2-n59/evidence/literal-source-supplement.md` | `9ad0d15afcb3681704d288e712f39b5db592e4aaee842796883b30ae8088ad27` |
| `lessons/math4-c2-s2-n59/evidence/affected-source-solutions.md` | `375ddf82f65852a223d20f2437fd5fa5766367321c960e7bfec807dbfb02e159` |
| `pages/0217/page.md` | `730ffd26acb111a5fe1ed75fb3a797e7642140e0a2c6c22558e728e5378a8341` |
| `pages/0217/page.json` | `e1dce54d89bd9fd172a68c81fcc07a27bf1b16b039e0945c9c3f59f9c7ee6600` |
| `pages/0220/page.md` | `08f7302f8da994685e508ef3a028d5d8cc14c068a1066f9c3805321075c8154c` |
| `pages/0220/page.json` | `5facc73c4c4d6989604c720d52795bfc6651a96d52d714db7020d3c73b72724f` |
| `lessons/math4-c2-s2-n59/lesson.json` | `b94479198c7b279318604f04d93fd15f56368e6e1b609a4739ea619a2936cfd3` |
| `lessons/math4-c2-s2-n59/exercises.json` | `de4324600035b29baa42e9fbf48ec4fb5ade66ae534e7fa13c858495b7679998` |
| `editions/modern-us-neutral/lessons/math4-c2-s2-n59/lesson.json` | `cbccb0899ec6bc09cf45fa11390ab1333b81f1c0fe2c112f06a187620dd69918` |
| `editions/modern-us-neutral/lessons/math4-c2-s2-n59/exercises.json` | `8a7c6ee4d4ab88fcbed8e5791555c4fc4d356e10b8681bccf2aa083dc445c80c` |
| `lessons/math4-c2-s2-n59/evidence/answer-draft.json` | `2e0e020c65472a4123d66cc0898ec655e9cec2a3cb9fa4094712b82691766ee0` |
| `lessons/math4-c2-s2-n59/evidence/answer-transfer-review.md` | `f96f868d7a21955bf7405dc0ed6c6b1d33a6847bbd9e1756c40bf7f253bba70e` |
| `editions/modern-us-neutral/figures/fig-223.spec.json` | `58e8f9f6e028203d5b730d98ba83223471da6815d8673ed0813d7412f293ad31` |
| `editions/modern-us-neutral/figures/fig-223.svg` | `e6cadbce72140f56b9ea5075409f845b3bfa4b004ac25373ed4a0b41f8a60ffd` |
| `editions/modern-us-neutral/figures/fig-223.review.json` | `a002a6e6759f6b76b75fe4d6c01115ea2a3cb043498a62f28ee3bb335a2c43c4` |
| `editions/modern-us-neutral/figures/fig-223.render.json` | `c52e2eae35a1aa0791fae64dc2bfc617430954370e0ea3c1232e316860e7f9d8` |

Inherited certified image identities, not new image observations:

- Physical page 0217 PNG:
  `c4647a8a0885c890bd45021faf592bea5d14e503b1a0c03680e4bb482b0fe209`.
- Physical page 0220 PNG:
  `a9a3067a14d3863395571044eb10d0268dd74857313bbe4dfa6fb96cf8574416`.
- Source fig-223 PNG:
  `a2c88a7878cac487edb497256bed709dca5e4dc4c8eaee6605667519a12b1cd6`.

New image loads **0**; this bounded context's cumulative actual usage remains
**4/24**, not reset. Descartes's separately recorded 7/24 belongs to that
reviewer's historical context, not this one. Only this new review file was
written; prior reports, content, progress, tools, others' edits and staging
were preserved. No other-chat messages were sent.
