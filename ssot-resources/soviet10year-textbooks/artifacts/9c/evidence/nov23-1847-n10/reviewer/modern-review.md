# N10 substantive modern text/math review

STEMROBIN-184 / `ana9-c2-s3-n10`, 2026-11-23.

Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Result and Scope

**No concrete substantive text, mathematical, task-preservation, qualification, or cultural-substitution defect found in the bound authored snapshot.**

This first modern review covers the top-level authored `prose` and `exercises` in `lesson.template.json` and `exercises.template.json`, including the caller's latest p0044#4 wording adjustment. Embedded `source.data` is not treated as authored modern content. Current corrected raw lesson/exercise objects were consulted for actual source identity, not as answer keys.

Reused independent evidence:

- [source-first.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-first.md): original objects, tasks and boundaries.
- [source-math.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-math.md): independent source solving, sample spaces and domain assumptions.
- [source-comparison.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-comparison.md): candidate comparison and localized p43 refinements of the freeze.
- [affected-source-comparison.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/affected-source-comparison.md): D1 Exercise 78 `本. 求` correction confirmed.

Figure design/rendering/visual fidelity and desktop/mobile display are outside this review; the caller has a separate bounded figure workflow. This is not an answer/choice-key review, N11 review, native finalize result, or publication approval.

## Authored Prose

Pointers below are zero-based JSON pointers into the top-level lesson template.

| Location / source identity | Substantive observation |
| --- | --- |
| `/prose/0`, p0042#4 | The historical introduction preserves the source's Greek context, chronology mentions and named list, while explicitly attributing the list to `原书的历史介绍`. It does not assert that every listed name belongs to the 17th or 18th century. The Jacobi metadata also expressly avoids that independent chronological assertion. No new person or historical date is supplied. This assesses source attribution, not a new external historical investigation. |
| `/prose/1`, p0042#5 | The fair six-outcome die is explicitly a model/assumption, not a claim that geometry alone proves fairness. Both `1/6` per outcome and the even-event calculation `3/6=1/2` are retained and agree with the reused probability model. |
| `/prose/2`, p0042#6 | The favorable/total ratio is correctly restricted to a finite, nonempty, exhaustive, mutually exclusive, equiprobable elementary outcome space. Colors, prices and dice sums are not silently promoted to equiprobable categories. These are justified mathematical qualifications, not a change to the task. |
| `/prose/3`, p0042#7 | The transition to examples remains present. |
| `/prose/4`–`/prose/5`, p0043#1–#2 | Example 1 retains ten balls, 3 white / 2 black / 5 red, one draw and both subparts. Individual-ball equal chances are explicit. The worked `5/10=1/2` and `8/10=4/5` calculations agree with independent source solving. Latin `a)`/`b)` is a modern enumeration replacement, not loss of a source subpart. |
| `/prose/6`–`/prose/12`, p0043#3–#9 | Example 2 keeps all five lengths and the select-three task. Uniform selection of distinct triples without replacement is explicit; positive lengths and a nondegenerate triangle domain justify the strict `c-b<a` condition under `a<=b<=c`. Equality is correctly excluded. `C_5^3=10`, `C_4^2`, the shortest-length cases and `3/10` remain unchanged. The reasoning about distinct odd lengths remains within this given inventory. The corrected-source `就不能` wording and absence of an extra variable in the minimum-5 sentence are retained. |
| `/prose/13`–`/prose/15`, p0044#1–#3 | Example 3 retains the request for every sum 2 through 12, the 36 equally probable ordered outcomes, `6 x 6 = 36`, all five pairs for sum 8 and `5/36`. First and second dice are distinguishable. Joint equiprobability is expressly assumed, so no unsupported inference from fair marginals is needed. The corrected final pair remains first die 2, second die 6. |
| `/prose/16`, p0044#4 | Current wording states that the table lists only some sums and that unlisted sums can be computed using the same ordered-outcome method. Different reversed values are correctly distinct outcomes. It neither claims the source table contains all requested sums nor invents table rows. The full 2-through-12 request remains at `/prose/13`; no task has been dropped. |
| `/prose/17`, p0044#5 | The textual figure placeholder retains `tbl-p0044-01`, the source table identity. No substantive task is reassigned to an exercise. Figure pixels, modern labels and rendering are not inspected here. |

### Latest Table-Introduction Wording

The reviewed `/prose/16/text` is exactly:

```text
下表列出部分点数和的结果。
每对数依次表示第一颗和第二颗骰子的点数；
交换不同的点数会得到另一个基本结果。

表中未列出的点数和，可用同样的有序结果计数方法求出。
```

This is the current pre-review adjustment, not the superseded wording naming additional numeric ranges in this source block. It introduces no ASCII digits absent from p0044#4. The reused source inventory remains a four-column table with printed sums 2 through 7 only; sum 8 is separately worked in prose, and sums 9 through 12 remain requested computations. The qualification is truthful without presenting independently derived results as literal original rows.

## Authored Exercises and Cultural Substitutions

Pointers below are into the top-level exercise template. Expected mathematical invariants reuse the existing independent source solving; no author answers were consulted or reviewed.

| Exercise / pointer / source | Modern task and qualification assessment | Reused mathematical invariant |
| --- | --- | --- |
| 74, `/exercises/0`, p0045#2 | `P,L,A,N,E,T` are six distinct letters, and `PLANET` uses each exactly once. Equal chances for every permutation are explicit. Replacing `МОСКВА` with this ordinary English word changes cultural context, not repeated-letter structure, card count or the specified-arrangement event. `changes` records context/wording. | One successful permutation out of `6!`; `1/720`. |
| 75, `/exercises/1`, p0045#3 | All labels 1 through 5 and the two-draw increasing-order task remain. No replacement and uniform selection among the remaining balls are explicit. `严格增加` means any strict increase, not necessarily consecutive numbers. | Ten increasing ordered outcomes out of twenty; `1/2`. |
| 76, `/exercises/2`, p0045#4 | All five labels and sequential removal of every ball remain. No replacement and conditional uniform remaining-ball selection make the complete permutations equiprobable. | Only `(1,2,3,4,5)` succeeds among `5!` orders; `1/120`. |
| 77, `/exercises/3`, p0045#5 | The task still takes four different balls at once from labels 1 through 5 and requires every selected label to be odd. Uniform subsets are explicit. The impossible event has not been repaired into a different question by reducing the sample size or allowing replacement. | Only three odd labels exist; the event remains empty, probability `0`. |
| 78, `/exercises/4`, p0045#6 | All ten individually distinct books, price multiplicities `5,2,3`, price values `4,3,1`, and target total `5` remain. Dollars replace rubles consistently throughout the hypothetical problem; this is not presented as a real exchange-rate conversion. Two different books and equal chances per pair are explicit. Current `source_text` preserves corrected raw `两本. 求`. Modern sentence restructuring is permissible wording, not reopening raw D1. | Five choices at price 4 times three at price 1, out of `C_10^2` pairs; `1/3`. |
| 79, `/exercises/5`, p0045#7 | All eight positive labels `2,4,6,7,8,11,12,13` remain. Two different cards and uniform pair selection are explicit. Assigning the two selected values to numerator and denominator does not create an answer-changing orientation ambiguity: coprimality is symmetric, and neither possible denominator is zero. | Eighteen coprime pairs out of 28; `9/14`. |

No exercise is lost, duplicated, merged with another task, or silently given altered numerical data. Each retains its number/source number and p0045 block identity. The modern prose still includes both Example 1 subparts, the triangle question, and all eleven Example 3 sum requests; retaining the source's partial table does not remove the unworked sum tasks.

## Source and Formula Checks

Read-only structured checks completed with exit code 0:

- All 18 top-level lesson objects map to the corresponding current raw source refs; their `source_text` matches current raw text and their kinds match.
- Every top-level prose formula signature, extracting the ordered `$...$` expressions and ignoring whitespace only, matches the corresponding current raw formula signature. No inequality direction, strictness, variable, combination expression, die product or probability formula changed.
- All six exercise `source_text` values and source block references match current corrected raw exercises. Authored `lines` agrees with authored `text` for each task.
- The current authored lesson/exercise source SHA fields match the actual current raw files. Authored bytes were rechecked after the caller's latest wording message and remained the same throughout the substantive review.

These checks supplement the substantive assessments above; source bindings or matching token signatures alone are not treated as proof of mathematical correctness.

## Exact Bound Snapshot

Common root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/`

| File below common root | SHA-256 |
| --- | --- |
| `adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/lesson.template.json` | `61b7a8d07288e45f2700cab75d2d6d9079e5c5c9f09d5c505b1f043e5b96a4cd` |
| `adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/exercises.template.json` | `aaa9ece85802646032ca3c36d1a6f1b8ca78023f6efbb79b9c6c809df1b57c96` |
| `raw/9c/lessons/ana9-c2-s3-n10/lesson.json` | `faa5f61fb9c83336f6ac9b49e13190a7d76f2ca7e955ba072c876315a290cbe3` |
| `raw/9c/lessons/ana9-c2-s3-n10/exercises.json` | `579f5d180a931a5d779f0d26bd3003889236f9f2871f79eba4044b3df3b7ac92` |

## Stop

Additional image opens: **0**; cumulative visual opens remain **5**. Independent source math and corrected-source review were reused, not reconstructed from an answer key. No candidate or prior evidence was edited; only this report is newly written.

No image/figure review, answer or choice-key inspection, N11 review, DB/Git/`.env` operation, dependency installation, network use or peer creation occurred. Stop after this first substantive modern text/math review.
