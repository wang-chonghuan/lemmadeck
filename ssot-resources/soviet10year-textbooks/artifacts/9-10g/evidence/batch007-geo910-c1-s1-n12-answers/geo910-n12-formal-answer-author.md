# n12 formal answer JSON author handoff

2026-11-16, STEMROBIN-184 seventh batch. Worker B is the **formal JSON author**, under existing parent-agent delegation. Peirce authored the reused source-prose derivations. Worker B does not claim authorship of Peirce's original-first source observations or an independent PASS of those derivations.

## Immutable candidate

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12/answer-keys.candidate.json`

Raw SHA-256:
`e0485393c2f013a6231672a0f2517b3b297aeddf06750b78fc32e7c7e5b4f0f1`

- Ten answers, source numbers **97..106** in official order.
- `status="draft"`; every `source="derived"` retained from template; no `bookRaw`.
- **auto=1, ungraded=9, two expression parts**, both in 106.
- **99 remains definition-conditional / unresolved for an unconditional answer.** A structurally valid candidate does not settle its course angle/half-plane definitions or authorize a whole-lesson semantic PASS.
- Candidate edits stop at this hash. Parent independent semantic/formal Gate2 and official finalization remain future work.

## Authorized inputs and provenance

Read:

- Current answer cap2 and Gate2 contract, including the existing exercise-level grading/parts rules.
- Official n12 answer template, already prepared by the parent; no prepare repeated.
- Complete current durable modern n12 lesson and exercises.
- Peirce's `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n11-n12-source-answer-prose.md`: its authorship/scope, shared projection conventions, and n12 sections 97..106.
- Relevant existing answer structural and LaTeX-expected check implementation.

No Aristotle/other independent review, other answer draft, choice, or parent frozen solution was read. The n11 exercise solutions were not used or read for this binding. No new original-image or modern-figure review was performed.

The current modern lesson defines pointwise parallel projection along a line intersecting the projection plane. Its subsequent properties expressly exclude source lines/segments parallel to that direction. The answers retain the tasks' requested collapse exceptions rather than applying those properties outside their hypotheses.

Coordinate examples, auxiliary planes and vector notation in the display answers come from Peirce's supplied derivations and are answer constructions, not added source givens or figure annotations.

## Exact template changes

- For all ten answer objects: filled only `grading` and `displayAnswer`.
- For 106 only: populated `parts` with the two requested lengths.
- Root schema/book/lesson/edition/status and every exercise identity, complete prompt, `figureEvidence`, source and historical-entity field are deep-equal to the official template.
- All nine ungraded `parts` remain exactly the template's empty arrays.
- Every prompt equals the corresponding current modern exercise `text` exactly.
- No prompt repair, source condition, quantity, figure association, template identity, or input hash was altered.

## Full task and branch mapping

| Exercise | Included candidate content | Grading reason |
| --- | --- | --- |
| 97 | General 1/2/3-point possibilities and examples; equivalence classes of source points on projection lines; fixed collinear/noncollinear configurations and source-plane/line parallelism limitations. Does not promise every fixed triple can realize all three counts. | Ungraded contextual classification. |
| 98 | Projection line maps to its unique intersection point with alpha; all its points have the same image, not a line, segment or empty set. | Ungraded geometric description/reason. |
| 99(1) | Plane image is the whole alpha or a line, with source-plane/direction conditions and exclusion of a single point. | Ungraded. |
| 99(2) | Half-plane/line/ray branches; boundary-direction collapse; explicit closed-boundary versus open-boundary behavior, including deleted ray endpoint. | Ungraded and definition-conditional. |
| 99(3) | Two-edge nonzero/nonflat-angle classification under explicitly stated independent-edge assumptions; collapse, same-direction and opposite-direction branches and examples; zero-angle single-point possibility if that definition permits it; filled-convex-angle interpretation distinguished from edge union; larger-angle conventions not invented. | Ungraded; unique source angle definition still unresolved. |
| 100(1)/(2) | Point fixed iff in alpha; entire line fixed iff contained in alpha; both necessity and sufficiency, excluding collapsed point as a fixed whole line. | Ungraded conditions and proof. |
| 101 | Collapse when common source direction is projection direction; distinct projection lines produce distinct points; coincident noncollapsed images are not a counterexample under this book's broad parallel relation. | Ungraded definition-dependent geometric explanation. |
| 102 | General parallel projection, not assumed orthogonal; contained/parallel/oblique/perpendicular source-line possibilities; explicit equal-length examples; finite-segment versus supporting-line intersection distinction; fixed-direction squared-length criterion and its orthogonal special case. | Ungraded classification with examples and conditions. |
| 103(1) | Intersecting source lines give intersecting image lines or one line; common image point and collapse/coincidence proof; impossible isolated-point/parallel-line/single-point cases excluded. | Ungraded classification/proof. |
| 103(2) | Exactly intersecting lines, distinct parallel lines, or an off-line point plus a line; no coincident-image or on-image-line collapsed point for skew sources; all three source-skew examples and inverse-image exclusion proofs. | Ungraded classification/proof. |
| 104(1) | Concrete skew/nonparallel-source counterexample with two distinct parallel image lines. | Ungraded argument, not just a yes/no key. |
| 104(2) | Actual construction using a, a translated b direction, delta, g and a direction avoiding at most three excluded directions; sufficient projection/noncollapse proof; necessary condition; genuine no-solution case when both source directions are parallel alpha; infinitely many directions in solvable case. | Ungraded construction and full feasibility discussion. |
| 105 | Source is exactly three noncoplanar rays' union; image has rank two; two nonopposite rays, line-plus-off-direction ray, or three pairwise noncollinear rays; all four supplied existence examples; no filled plane/half-plane, isolated point or one-dimensional-only image. | Ungraded point-set classification/proof. |
| 106 | Both length formulas and derivation by preserved affine parameter/length ratio; endpoint cases; valid homogeneous ratio data, nonnegative normalized ratios, nonzero sum; invalid 0:0/collapse/zero-length cases; internal division denominator p+q, not external-division p-q. | Auto, because the two requested outputs have invariant expression answers for valid task data. |

No requested subpart, proof, construction, feasible branch or degeneracy caveat from the n12 source-prose derivation was removed. Numbering remains the actual current numeric subparts, including the special 104 first-subpart marker in its unchanged prompt; no Latin relabeling was imposed on this lesson.

## 99: unresolved source definition is not silently supplied

The current provided lesson does not define whether a half-plane contains its boundary, whether an angle is only two rays or a filled point set, or whether zero/larger angles are allowed by the phrase “不等于平角”.

The candidate explicitly separates:

- Closed versus open half-plane images.
- Independent-edge, nonzero/nonflat two-ray union.
- Zero angle, if permitted, with a possible single-point image.
- Filled convex-angle point set rather than merely two edges.
- Other angle conventions requiring their actual course definition.

It presents these as conditional branches. It does not select a source-free numerical angle range, make the angle-area definition authoritative, or label the definition gap independently resolved. Ungraded status is not a substitute for resolving this semantic limit before an unconditional release.

Exercise 105 expressly asks for ray unions, so its point-set classification does not depend on choosing the missing angle-domain convention for 99.

## Automatic parts

Only 106 has machine parts:

```json
[
  {
    "label": "|AM|",
    "judge": "expression",
    "expected": ["\\frac{m\\cdot p}{p+q}"]
  },
  {
    "label": "|MB|",
    "judge": "expression",
    "expected": ["\\frac{m\\cdot q}{p+q}"]
  }
]
```

The labels distinguish the two outputs; no unit was invented because the prompt specifies only m as the segment length, without a named measurement unit. The conditions for valid ratio data remain visible in the standard answer.

No alternate key with denominator p-q, reversed numerator, undefined ratio or a different geometric condition was added. Proof/classification answers are not reduced to scalar machine keys. The current format cannot mix graded scalar parts and ungraded proofs inside one exercise, so 104 and the other extended tasks remain wholly ungraded.

## Figure bindings

All ten actual template `figureEvidence` arrays are empty; all ten current exercises have `figure_refs=[]` and `figures=[]`. These arrays were preserved exactly.

The modern n12 body figures 39..41 are listed in its current lesson, but were not supplied as answer evidence. This author does not claim actual new inspection or approval of their pixels/specs. Peirce's prior original-PNG observations remain his recorded evidence; no figure was opened, created, reinterpreted or changed in this task.

## Actual author checks

Ran one read-only inline author binding/structure check using the existing `lesson_answers.validate_lesson`, the current neutral profile, and explicit protected-template/current-prompt comparisons:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B - <<'PY'
# Load the official template, scratch candidate and current modern exercises.
# Call existing validate_lesson; compare root metadata and all protected
# answer fields; compare prompts/evidence; emit changes and raw hashes.
PY
```

Actual result: **exit 0**, `AUTHOR_BINDING_RESULT=PASS`, `errors=[]`.

Observed 10 answer identities in order 97..106, auto=1, ungraded=9, parts=2, all ten evidence lengths zero. The changed-field report contains grading/displayAnswer for every item and parts for 106 only.

Ran existing read-only expected-LaTeX checker once:

```sh
node .claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs .tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12/answer-keys.candidate.json
```

Actual result: **exit 0**, `status="pass"`, `checked=2`, `failures=[]`.

This checks that the two expression expected strings parse under the current installed ComputeEngine. It does not independently prove Peirce's mathematics, settle 99, or test runtime acceptance/rejection for user input. There are no exact parts; no MathLive/browser check was run.

These are author structural/format checks, **not independent Gate2 PASS**, lesson finalize, figure approval or publication.

## Raw SHA-256 bindings

Paths are relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

| File | Raw SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12/answer-keys.candidate.json` | `e0485393c2f013a6231672a0f2517b3b297aeddf06750b78fc32e7c7e5b4f0f1` |
| Same directory `answer-keys.template.json` | `55eeec1a447af278e422417998dc931998227fb0b24328a4b384822b635272d8` |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n11-n12-source-answer-prose.md` | `1f802a1ef610090215d39d0dfb448c96a04c5d23714f15b5af16ac6c310a32e1` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n12/lesson.json` | `d550f8974e78a7eaf3f76a417bcf0b157184493ca792cb02fdec212c809a82ec` |
| Same lesson directory `exercises.json` | `d1870d3f9b231eadae04debdebc0b5aed813d53b6bc6b53da19274d7e6356eb2` |
| `.claude/skills/ld-s10y-answer/tools/lesson_answers.py` | `30b7ba6be1397b2e005b8f9b3a682ca5ff9b680d6c77af9c1d06cedbef70d9e2` |
| `.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs` | `2b9e236faf57a5ff2860c5ea2961ad57dfb99b5fc3218eb5e12bcb5404f9a281` |
| Existing n79 `answer-keys.candidate.json` | `1d67abd10e1776b3288d089a9e20a23dc38b6c8264e227ad1b54cbf48343604d` |

Template, Peirce source-prose and current modern inputs retained their initial hashes. The previous n79 candidate also remains at its frozen hash and was not edited.

## Stop

Only this author handoff and the hand-authored scratch candidate were written with `apply_patch`. No template/source/modern/figure/tool change, durable copy, prepare repeat, finalize, DB, Git, browser/network/service, independent-review access, choice access or other-chat message occurred. Candidate remains immutable at the recorded hash, with 99's definition-dependent limit explicit, awaiting parent review.
