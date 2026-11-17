# Stage B Ledger: ana10-c7-s1-n97

## Review Decision

**PASS**. All 10 entries and 16 tasks in the authorized candidate pass this
independent Stage B comparison. No revision is requested and no blocking
condition remains within the authorized review scope. **WAIT**.

- Ticket: STEMROBIN-184, same continuing invocation.
- Role: INDEPENDENT STANDARD ANSWER REVIEWER.
- Date: 2026-11-17, Europe/Dublin.
- Human authorization: Stage B only, after full consumption of frozen Stage A.
- Candidate under review: SHA-256
  `61d755410afbbed81b2b70ef6a8837cd2db1065633d22e0a54de42a6c2315b93`.
- Detailed comparison: `stage-b-comparison.md`, 13806 bytes, SHA-256
  `acdcc796e0fcfb6a8833d0fee663f44a0d1333146519a0a6dc659ff6780b40f5`.
- Owned directory:
  `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/`.
- Stage A records were preserved, not updated with candidate-derived evidence.
- PASS does not mean validator/finalize/publish completed or production status
  promoted. No next operation is authorized by this review.

## Raw-Byte Evidence

Paths below are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/`.
Every hash is saved-file raw-byte SHA-256; byte counts are not character counts.

| Artifact | Path | Bytes | SHA-256 |
| --- | --- | --- | --- |
| Modern exercises | `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c7-s1-n97/exercises.json` | 13799 | `7dfc074e445cd26151d1737ff104ed44b2ecc9ecb474bb87a80b1039b0c17762` |
| Prepared template | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/10c/modern-us-neutral/lessons/ana10-c7-s1-n97/answer-keys.template.json` | 3308 | `222565c49278261949bb5e27a685a3b8ccf800f683153832b08300fbbb12cf27` |
| Candidate | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/answer-keys.json` | 6238 | `61d755410afbbed81b2b70ef6a8837cd2db1065633d22e0a54de42a6c2315b93` |
| Author report | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97/author/author-report.md` | 7975 | `91e38c4d67da98ac85502a8c85853c69d5b63f2eda5d11c82b07b8edee245cc8` |
| Frozen Stage A solutions | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/source-first-solutions.md` | 18737 | `cac5206b7aff9323d4bf706d2e397e303b9513618d9b26601b4f4b432bfeccef` |
| Frozen Stage A ledger | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/source-first-ledger.md` | 18056 | `96eaef4195a07028368041e76c23f7e9c109af2f9e79ac5dc38ccaa9c9705444` |
| Stage B comparison | `.intentfold/tickets/STEMROBIN-184/tmp/production-answers10c97-review/stage-b-comparison.md` | 13806 | `acdcc796e0fcfb6a8833d0fee663f44a0d1333146519a0a6dc659ff6780b40f5` |

The template and candidate hashes match the human-specified bytes. The Stage A
hashes match the consumed frozen records. This ledger's own whole-file hash and
byte count are detached final command evidence, avoiding recursive hashing.

## Structured Alignment Evidence

Read-only structured inspection compared the authorized JSON artifacts and the
snapshot inside frozen Stage A. It did not call a project validator or a test
runner and did not reopen the original exercise file.

- Stage A's embedded exact source payload SHA-256:
  `153f222b103ba5e1b2e09bbb02f950bf70f0dddcc624dbb04ce91c8bd0f3ca5e`.
- Modern `source.sha256` is the same value.
- Modern embedded `source.data` equals the parsed frozen snapshot in full.
  Structural equality is distinguished from raw embedded-object byte equality.
- Modern declared count, modern entries, template entries, and candidate entries
  are each 10.
- Template/candidate headers match exactly:
  `ld-s10y-answer/lesson-answers@1`, book `10c`, lesson `ana10-c7-s1-n97`,
  edition `modern-us-neutral`, status `draft`.
- In every row below, all compared identity/provenance fields are unchanged:
  `number`, `source_number`, `group`, `group_id`, `pages`, `figure_refs`,
  and `figures`. `source_text` equals the corresponding frozen source text.
- Every template prompt exactly matches its current modern text.
- Ordered mathematical spans are exactly equal between frozen and modern text;
  their counts vary with the source's inline delimiter grouping, not task count.

| Exercise | Frozen/modern/template/candidate order identity | Group | Page anchor | Ordered math equality; spans | Template prompt equality | Numeric changes | Declared change |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 392 | `392/392/392/392` | g1 | p0105#7 | YES; 6 | YES | 0 | layout |
| 393 | `393/393/393/393` | g1 | p0106#1 | YES; 2 | YES | 0 | layout |
| 394 | `394/394/394/394` | g1 | p0106#2 | YES; 2 | YES | 0 | layout |
| 395 | `395/395/395/395` | g1 | p0106#3 | YES; 2 | YES | 0 | layout |
| 396 | `396/396/396/396` | g1 | p0106#4 | YES; 2 | YES | 0 | layout |
| 397 | `397/397/397/397` | g1 | p0106#5 | YES; 2 | YES | 0 | layout |
| 398 | `398/398/398/398` | g2 | p0106#7 | YES; 1 | YES | 0 | layout |
| 399 | `399/399/399/399` | g2 | p0106#8 | YES; 1 | YES | 0 | layout |
| 400 | `400/400/400/400` | g2 | p0106#9 | YES; 1 | YES | 0 | layout |
| 401 | `401/401/401/401` | g2 | p0106#10 | YES; 1 | YES | 0 | layout |

The exact group heads remain:

- g1: `习题证明：函数 $F$ 是函数 $f$ 在给定区间上的原函数：`
- g2: `求函数$f$在$R$上的原函数：`

Modern labels `a)`/`b)` replace frozen Cyrillic `а)`/`б)` in the same order.
No mathematical value or interval changed. The 397 star remains in the modern
source and template and is not another task.

## All Sixteen Task Verdicts

Line references are one-based lines of the pinned candidate `answer-keys.json`.
These judgments compare actual candidate display mathematics to the
pre-disclosure independent Stage A results, not merely to the author's report.

| Task | Candidate display line | Domain | Candidate calculation/result | Concrete reason for verdict | Verdict |
| --- | --- | --- | --- | --- | --- |
| 392 a | 12 | `(0,\infty)` | `3(1/3)x^{-2/3}=1/\sqrt[3]{x^2}` | Real positive cube root, nonzero denominator, differentiability, and derivative equality explicitly supplied; matches Stage A. | PASS |
| 392 b | 12 | `R` | `(\sin x+3)'=\cos x+0` | Fixed `+3` retained and differentiated; sine differentiable everywhere; both modern labels separately covered. | PASS |
| 393 a | 19 | `(0,\infty)` | `((3/2)x^{2/3}-5)'=(3/2)(2/3)x^{-1/3}+0` | Root reduction is valid on positive domain; reciprocal is defined; supplied `-5` retained; result is `1/\sqrt[3]{x}`. | PASS |
| 393 b | 19 | `R` | `(4-\cos x)'=0+\sin x` | Fixed `4` and derivative minus sign correct; no restriction added to full real interval. | PASS |
| 394 a | 26 | `(0,\infty)` | `((3/4)x^{4/3})'=(3/4)(4/3)x^{1/3}` | Positive real cube-root interpretation and coefficient give exactly `\sqrt[3]{x}`. | PASS |
| 394 b | 26 | `(-\pi/2,\pi/2)` | `(tan x-\sqrt2)'=(\cos^2x+\sin^2x)/\cos^2x+0` | `tg` meaning and positive cosine stated; quotient computation gives reciprocal cosine square; fixed root constant preserved. | PASS |
| 395 a | 33 | `(0,\infty)` | `((2/3)x^{3/2})'=(2/3)(3/2)x^{1/2}` | Principal square-root reduction used only for `x>0`; derivative is exactly `\sqrt x`. | PASS |
| 395 b | 33 | `(0,\pi)` | `(cot x)'=-1/\sin^2x`, so `(3-cot x)'=0-(-1/\sin^2x)` | Positive sine, quotient rule, fixed `3`, and double minus sign all explicit and correct. | PASS |
| 396 a | 40 | `(-\infty,0)` | `(14-x^{-1})'=0-(-x^{-2})` | Given constant `14` retained; nonzero negative arguments are valid; derivative is `1/x^2`. | PASS |
| 396 b | 40 | `(0,\infty)` | `(9-x^{-1})'=0-(-x^{-2})` | Separate constant `9` and separate positive interval retained; zero explicitly excluded in both tasks. | PASS |
| 397 a | 47 | `(0,\infty)` | `\lvert x\rvert=x`, derivative `1` | Correct positive branch proves differentiability and `F'=f` without crossing zero. | PASS |
| 397 b | 47 | `(-\infty,0)` | `\lvert x\rvert=-x`, derivative `-1` | Correct negative branch and zero nondifferentiability caveat match the frozen result. | PASS |
| 398 | 54 | `R` | `F=x^4/4+C`, `F'=4x^3/4+0=x^3` | Arbitrary real `C`, differentiability everywhere, and mean-value-theorem constant-difference argument give all primitives. | PASS |
| 399 | 61 | `R` | `F=x^5/5+C`, `F'=5x^4/5+0=x^4` | Correct exponent/coefficient, all-real domain, real constant, and complete-family argument match Stage A. | PASS |
| 400 | 68 | `R` | `F=x^2/2+C`, `F'=2x/2+0=x` | Correct polynomial primitive, real constant, and zero-derivative difference prove full family. | PASS |
| 401 | 75 | `R` | `2\frac12=5/2`, `F=(5/2)x+C`, `F'=5/2+0` | Mixed number explicitly distinguished from multiplication; real constant and completeness proof present. | PASS |

For each of 398-401, any other primitive `G` has
`(G-F_0)'=f-f=0` on the connected real line. The candidate invokes the mean
value theorem to conclude the difference is a constant; differentiability
already stated supplies continuity on every closed real segment.
Conversely, every `C\in R` has zero derivative, so every displayed family
member works. Existence and completeness are both established in each display.

## Each Entry, Every Requested Axis

I = identity and modern/template alignment; P = provenance consistency;
D = display adequacy and complete task coverage; M = mathematical correctness;
K = intervals, root meaning, signs, and constants/completeness;
G = parts and intentional grading. Each PASS is supported by the concrete
task rows and the detailed comparison, not a blanket default.

| Entry | I | P | D | M | K | G | Concrete entry conclusion | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 392 | PASS | PASS | PASS | PASS | PASS | PASS | Both proof displays match the ordered modern tasks, positive cube-root domain and fixed `+3`; `derived/ungraded/[]` coherent. | PASS |
| 393 | PASS | PASS | PASS | PASS | PASS | PASS | Both proofs preserve positive-root restriction and fixed `-5`, `+4`; correct derivative signs and modern labels. | PASS |
| 394 | PASS | PASS | PASS | PASS | PASS | PASS | Both proofs preserve cube-root exponent and tangent interval; positive cosine and constant `-\sqrt2` handled. | PASS |
| 395 | PASS | PASS | PASS | PASS | PASS | PASS | Both proofs use correct square-root domain and cotangent quotient derivative; fixed `+3` and sign preserved. | PASS |
| 396 | PASS | PASS | PASS | PASS | PASS | PASS | Both reciprocal proofs retain distinct `14` and `9`, proper half-lines, and zero exclusion. | PASS |
| 397 | PASS | PASS | PASS | PASS | PASS | PASS | Both absolute-value branches correctly displayed, with no derivative claim at the excluded zero. | PASS |
| 398 | PASS | PASS | PASS | PASS | PASS | PASS | Complete `x^4/4+C` family on `R`, real constant, derivative and completeness reasoning; intentional ungraded. | PASS |
| 399 | PASS | PASS | PASS | PASS | PASS | PASS | Complete `x^5/5+C` family on `R`, with full verification and real constant; intentional ungraded. | PASS |
| 400 | PASS | PASS | PASS | PASS | PASS | PASS | Complete `x^2/2+C` family on `R`, verified and complete; intentional ungraded. | PASS |
| 401 | PASS | PASS | PASS | PASS | PASS | PASS | Mixed-number `5/2` and complete `(5/2)x+C` family on `R`; intentional ungraded. | PASS |

All 10 objects are `source="derived"`, `grading="ungraded"`, `parts=[]`.
Every proof display contains both modern labels separately. Every family
display contains its actual formula and arbitrary real constant.
No `expected`, judge, `bookRaw`, or false automatic-validation claim exists.
The prepared prompt and empty figure/historical scaffolding are not required
in the production answer objects; no nonempty evidence was dropped.

The full author report has matching derivations, coverage, candidate/template
fingerprints, and intentional grading explanation. Its historical claims about
the author's input access are self-reported, not independently certified.
The independent verdict is grounded in the frozen Stage A baseline and actual
candidate comparison. Empty historical-entity lists and absence of introduced
names support the modern display/provenance review.

## Grading Interpretation

The human explicitly directed acceptance of intentional ungraded proofs and
arbitrary-constant families. Proof strings do not reliably judge submitted
domain reasoning; a finite primitive list does not establish a complete family.
Therefore no conversion to `auto` or manufacture of machine `parts` is requested.
The cap2/gate2 coverage concern is satisfied by individually labeled complete
display proofs and by complete displayed primitive families. This ledger does
not claim an automatic family-equivalence contract was validated.

## Preserved Boundaries and Stop

Before disclosure comparison, the frozen A/L fingerprints were confirmed.
At completion, a detached read-only byte check reports all input and output
fingerprints and confirms A/L remain at their original hashes.

Only new `stage-b-comparison.md` and `stage-b-ledger.md` were manually written
with `apply_patch` in the owned directory. No existing Stage A record, candidate,
template, modern exercise, author report, or unrelated file was edited.
No original-source reopen, images/browser, other-lesson answers, choices,
validator/test runner, finalize/prepare/publish, DB/env, Git, workflow refresh
or new workflow, SkillHost, grill, app/dependency/schema/Charter change, or
other-chat messaging occurred.

Reviewed: 10/10 entries and 16/16 tasks.
Entry verdicts: 10 PASS, 0 REVISE, 0 BLOCKED.
Required revisions: none. Scope blockers: none.
Overall verdict: **PASS**. Next action: **WAIT**.
