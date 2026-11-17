# Stage B Comparison: ana10-c7-s1-n97

## Verdict and Boundary

**PASS** for the explicitly authorized independent Stage B review of candidate
SHA-256 `61d755410afbbed81b2b70ef6a8837cd2db1065633d22e0a54de42a6c2315b93`.
All 10 candidate entries and all 16 printed tasks pass identity, modern
alignment, provenance-field consistency, display adequacy, mathematics,
interval, constant completeness, parts, and intentional grading review.
No actionable revision or unresolved blocker was found within this scope.

- Ticket: STEMROBIN-184, continuation of the same invocation.
- Role: INDEPENDENT STANDARD ANSWER REVIEWER.
- Date: 2026-11-17, Europe/Dublin.
- Authorization: the human explicitly opened this sole Stage B after consuming
  all frozen Stage A solutions, 10 exercises, 16 units, and the source snapshot.
- Frozen Stage A remains unchanged; its historical WITHHELD/WAIT statements
  record that earlier stage and are not retroactively edited.
- This PASS is a review verdict only, not validator, finalize, preparation,
  publication, database, rendering, input-chain, or full production approval.
- Next action: WAIT. No further stage or operation is authorized here.

## Byte-Pinned Inputs

All paths in this table are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/`. Hashes are SHA-256 of saved raw
file bytes, not normalized or reserialized JSON.

| ID | Path | Bytes | Raw-byte SHA-256 |
| --- | --- | --- | --- |
| M | `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s1-n97/exercises.json` | 13799 | `7dfc074e445cd26151d1737ff104ed44b2ecc9ecb474bb87a80b1039b0c17762` |
| T | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/answer-keys.template.json` | 3308 | `222565c49278261949bb5e27a685a3b8ccf800f683153832b08300fbbb12cf27` |
| C | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/answer-keys.json` | 6238 | `61d755410afbbed81b2b70ef6a8837cd2db1065633d22e0a54de42a6c2315b93` |
| R | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/author-report.md` | 7975 | `91e38c4d67da98ac85502a8c85853c69d5b63f2eda5d11c82b07b8edee245cc8` |
| A | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/source-first-solutions.md` | 18737 | `cac5206b7aff9323d4bf706d2e397e303b9513618d9b26601b4f4b432bfeccef` |
| L | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/source-first-ledger.md` | 18056 | `96eaef4195a07028368041e76c23f7e9c109af2f9e79ac5dc38ccaa9c9705444` |

T and C match the exact hashes supplied in the Stage B authorization. A and L
match the fully consumed frozen Stage A hashes. The original exercise file was
not reopened: comparison uses the source snapshot already frozen inside A and
the embedded source object already present in authorized M.

## Alignment and Metadata Findings

M has edition schema `ld-s10y-lesson/edition-exercises@1`,
edition `modern-us-neutral`, lesson `ana10-c7-s1-n97`, status `ready`,
and 10 exercises. Its declared source SHA-256 is
`153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`,
which also hashes A's exact frozen JSON payload. M's embedded `source.data`
equals that payload as parsed JSON; this is structural equality, not a claim
that the indented embedded object's raw bytes equal the original file bytes.

For every entry 392-401, the following were directly compared:

- Original/frozen, modern, template, and candidate exercise order and identity
  agree: `392,393,394,395,396,397,398,399,400,401`, each exactly once.
- M retains the frozen `number`, `source_number`, `group`, `group_id`, `pages`,
  `figure_refs`, and `figures` values, and its `source_text` equals the frozen
  exercise text exactly.
- Ordered dollar-delimited mathematics in M's modern `text` equals the frozen
  exercise's ordered mathematics. All numerical data, root indices, exponents,
  function signs, constants, and interval endpoints are unchanged.
- Every T `prompt` equals the corresponding M modern `text` exactly.
- All M `changes` are `["layout"]`; all `numeric_changes` and
  `historical_entities` are empty. Actual inspection confirms the label/layout
  changes: Cyrillic `а)`/`б)` become modern `a)`/`b)` and lines are split.
  The star on 397 is retained in the modern source and template.
- `g1` still asks for proofs for 392-397 on the specified intervals; `g2`
  still asks for primitives on `R` for 398-401. Group heads are semantic input
  even though they are not copied into each template prompt.

T and C have identical top-level answer-key metadata:
`schema=ld-s10y-answer/lesson-answers@1`, `book=10c`,
`lesson=ana10-c7-s1-n97`, `edition=modern-us-neutral`, `status=draft`.
C has exactly 10 answer objects. Each contains exactly
`exercise`, `grading`, `source`, `displayAnswer`, and `parts`.
Each has `source="derived"`, `grading="ungraded"`, and `parts=[]`.
There is no `bookRaw`, `expected`, or automatic judge declaration.

T's `prompt`, `figureEvidence`, and empty `historical_entities` fields are
preparation scaffolding. Their omission from C does not remove any required
answer, evidence of a nonempty figure, or historical declaration: every M/T
figure list and historical-entity list is empty, and C introduces no names.
This is a manual contract comparison, not schema-validator execution.

## Concrete Entry Verdicts

Candidate line references below are one-based lines in byte-pinned C.
Every entry also passes the shared identity/provenance/parts/grading findings
above. The independent mathematical baseline is A, solved before disclosure;
R was read in full as author evidence, not substituted for that baseline.

### 392: PASS

Evidence: C exercise identifier at line 9, display at line 12.
Modern `a)`/`b)` map in order to frozen `а)`/`б)` in `g1`, `p0105#7`.

- `a)`: On `(0,\infty)`, the candidate uses the real positive cube root,
  `F=3x^{1/3}`, and computes
  `F'=3(1/3)x^{-2/3}=1/\sqrt[3]{x^2}=f`.
  Positive denominator and differentiability are explicitly established.
- `b)`: On `R`, the printed `F=\sin x+3` is retained, and
  `F'=\cos x+0=f`. The supplied constant `3` is not replaced by `C`.
- The display supplies a domain-aware proof for each label and concludes only
  on each respective interval. Both calculations match A; no omission.
- `derived`, `ungraded`, empty machine parts: PASS for the two proof tasks.

### 393: PASS

Evidence: C identifier at line 16, display at line 19; `g1`, `p0106#1`.

- `a)`: On `(0,\infty)`, `\sqrt[3]{x^2}=x^{2/3}` and the reciprocal cube
  root is positive. The candidate retains `F=(3/2)x^{2/3}-5` and computes
  `F'=(3/2)(2/3)x^{-1/3}+0=1/\sqrt[3]{x}=f`.
  The `+0` correctly represents differentiating the supplied `-5`.
- `b)`: On `R`, `F=4-\cos x` gives `F'=0+\sin x=f`.
  The minus sign and fixed `4` are correctly accounted for.
- Both modern labels receive sufficient proof and exact interval coverage;
  the calculations agree with A, with no arbitrary constant appended.
- `derived`, `ungraded`, empty machine parts: PASS for both proofs.

### 394: PASS

Evidence: C identifier at line 23, display at line 26; `g1`, `p0106#2`.

- `a)`: On `(0,\infty)`, the real root reduction gives `F=(3/4)x^{4/3}`,
  and `F'=(3/4)(4/3)x^{1/3}=\sqrt[3]{x}=f`.
- `b)`: On `(-\pi/2,\pi/2)`, `\cos x>0` justifies tangent and the
  reciprocal square. The candidate identifies `tg=tan=sin/cos`,
  preserves `-\sqrt2`, and computes
  `F'=(\cos^2x+\sin^2x)/\cos^2x+0=1/\cos^2x=f`.
  Its quotient-rule expression and constant derivative agree with A.
- The given open endpoints remain excluded. Principal `\sqrt2` is treated
  as a fixed constant, not a variable. Each proof is intelligible and complete.
- `derived`, `ungraded`, empty machine parts: PASS for both proofs.

### 395: PASS

Evidence: C identifier at line 30, display at line 33; `g1`, `p0106#3`.

- `a)`: On `(0,\infty)`, principal roots give `\sqrt{x^3}=x^{3/2}`.
  `F'=(2/3)(3/2)x^{1/2}=\sqrt x=f`, exactly as in A.
  The candidate does not apply this reduction to negative arguments.
- `b)`: On `(0,\pi)`, positive sine makes both reciprocal and cotangent
  defined. The candidate's quotient rule gives
  `(cot x)'=(-\sin^2x-\cos^2x)/\sin^2x=-1/\sin^2x`.
  The actual `F=3-cot x` then gives `F'=0-(-1/\sin^2x)=f`.
- Both labels, the supplied constant `3`, the double minus sign, and the
  zero-sine endpoint exclusions are correctly represented.
- `derived`, `ungraded`, empty machine parts: PASS for both proofs.

### 396: PASS

Evidence: C identifier at line 37, display at line 40; `g1`, `p0106#4`.

- `a)`: On `(-\infty,0)`, retain `14-1/x`; differentiability follows from
  `x\ne0`, and `F'=0-(-x^{-2})=1/x^2=f`.
- `b)`: On `(0,\infty)`, separately retain `9-1/x` and compute the same
  derivative, again with `x\ne0`.
- The two distinct constants are not interchanged. Both interval identities
  match A, and the display explicitly excludes zero instead of extending the
  proof across the singularity.
- `derived`, `ungraded`, empty machine parts: PASS for both proofs.

### 397: PASS

Evidence: C identifier at line 44, display at line 47; `g1`, `p0106#5`.

- `a)`: On `(0,\infty)`, the positive branch `|x|=x` gives `F'=1=f`.
- `b)`: On `(-\infty,0)`, the negative branch `|x|=-x` gives `F'=-1=f`.
- Both branches match A. The candidate states the nondifferentiability at zero
  and correctly notes that neither printed interval contains zero.
- The retained source star is a task marker, not another unanswered task;
  omitting a star from the answer display does not lose a mathematical unit.
- `derived`, `ungraded`, empty machine parts: PASS for both proofs.

### 398: PASS

Evidence: C identifier at line 51, display at line 54; `g2`, `p0106#7`.

The candidate gives `F=x^4/4+C`, `C\in R`, on all `R`, and explicitly verifies
`F'=4x^3/4+0=x^3=f`. Polynomial differentiability covers zero and negative
arguments. For any other primitive `G`, the difference from `x^4/4` has zero
derivative on the connected real line, so the mean value theorem makes that
difference constant. This proves all primitives, not just one selected member.
The display contains the family, constant domain, verification, and
completeness argument, all matching A.
`derived`, intentionally `ungraded`, `parts=[]`: PASS.

### 399: PASS

Evidence: C identifier at line 58, display at line 61; `g2`, `p0106#8`.

The candidate gives `F=x^5/5+C`, `C\in R`, on all `R`;
`F'=5x^4/5+0=x^4=f`. It establishes differentiability everywhere and the
zero-derivative difference/mean-value-theorem completeness argument.
The power, coefficient, full real domain, and arbitrary constant match A.
No restriction such as `x>0` is introduced.
`derived`, intentionally `ungraded`, `parts=[]`: PASS.

### 400: PASS

Evidence: C identifier at line 65, display at line 68; `g2`, `p0106#9`.

The candidate gives `F=x^2/2+C`, `C\in R`, on all `R`;
`F'=2x/2+0=x=f`. The full real differentiability and constant-difference
completeness justification match A. The answer is the complete family, not
only the zero-constant example.
`derived`, intentionally `ungraded`, `parts=[]`: PASS.

### 401: PASS

Evidence: C identifier at line 72, display at line 75; `g2`, `p0106#10`.

The candidate explicitly interprets the printed mixed number:
`2\frac12=2+1/2=5/2`. It gives `F=(5/2)x+C`, `C\in R`, on all `R`,
and verifies `F'=5/2+0=f`. The linear coefficient is not the incorrect
product `2(1/2)=1`. The displayed mean-value-theorem argument proves the
complete family, agreeing with A's independent solution.
`derived`, intentionally `ungraded`, `parts=[]`: PASS.

## Parts, Grading, and Provenance Conclusions

392-397 are proofs about specific fixed functions. All 12 modern labels are
separately answered in display prose, including differentiability and domain
reasoning. Empty machine-judged `parts` do not erase those display subparts.
Matching a derivative string would not establish a submitted proof.

398-401 are arbitrary-real-constant primitive families, and all four displays
give both derivative verification and completeness. The human explicitly
authorized the intentional ungraded policy here. No auto conversion, finite
expected list, or purported validated family-equivalence contract is required
or asserted. `parts=[]` is coherent with each ungraded entry, not a missing
machine answer. The literal multi-part requirement is applied to complete
answer coverage, not to forcing judges onto proof or family tasks.

All 10 `source="derived"` fields agree with the type of calculation and with
R's reported prompt-based authoring. No book answer, `bookRaw`, cultural entity,
or image-derived claim is fabricated. R's full derivations agree with C and A.
R's statements about what the author did not access are author declarations,
not independently observable access-history proof; the independent review
rests on the pre-disclosure frozen A and the inspected authorized artifacts.

The candidate retains `status="draft"` and does not claim accepted/published
status. No field or display assertion falsely represents machine validation.

## Stop Record

Entry verdicts: 392 PASS; 393 PASS; 394 PASS; 395 PASS; 396 PASS;
397 PASS; 398 PASS; 399 PASS; 400 PASS; 401 PASS.
Task verdicts: 16/16 PASS. Required revisions: none. Blockers: none in scope.

Only `stage-b-comparison.md` and `stage-b-ledger.md` are written in the owned
review directory. No original-source reopen, images/browser, answers from
other lessons, choices, validators/tests, finalize/prepare/publish, DB/env,
Git, app/dependencies/schema/Charter changes, workflow refresh/new workflow,
SkillHost, grill, or other-chat actions occur. The final byte fingerprints
are detached evidence, with this comparison's hash pinned in the companion
Stage B ledger. PASS. WAIT.
