# N4 First Original Internal Comparison

Date: 2026-11-23.
Ticket: STEMROBIN-184.
Reviewer: independent N4 source solver and choice reviewer, separate from author.
Outcome: REVISE. No additional missing-input blocker.

## Snapshot and Order

Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Original draft reviewed:
`.tmp/stemrobin-184-six/n4-nov23-source2324/draft.json`.

Draft byte SHA-256:
`2aded2f77876e6fbed180535005d5b47260fc7846815e9fc9d9446bd0cb75858`.

Draft canonical JSON SHA-256:
`5c53cb660f1610824e3c3c598a16fd73dc972d72708aecfc7904f99ef22e7713`.

Seed canonical JSON SHA-256:
`86765d0a31800ee80c4be273f383dd6b7106c319bdb833066fd4384e8de48efc`.

The original draft's `{id,view}` projection exactly equals the previously
reviewed `question-views.json` snapshot, whose byte SHA-256 is
`cc40269328e3409a1ffd31e0f0e50be9a9815fd1df09050fa11ce0ff5712cb5c`.

Retained source-first freeze byte SHA-256:
`88285638b7bd029d302eb0dcc1ac5d532a2d5525bc03aef29bde128d821898e7`.

Retained view-first freeze byte SHA-256:
`e0325448bd31548664f9849881905113cee119d345bd6c115d93f1658104442b`.

Official review:
`reviewer/first-choice-review.json`, schema `s10y-choice-review-v1`.
Its byte SHA-256 is
`ce086579eba6e4d26a6d325272adbb7d54a4c2a2a8963bac8187017a9ecca500`.

All source solutions and learner-view judgments were completed and frozen
before this first disclosure of the original internals. This phase compares
those existing judgments with keys, source solutions, rationale procedures,
concept mappings and coverage. It does not solve or review unchanged views
again. No referenced `author/source-first.md` or other author file was opened.
The caller's retained `first-choice-draft.json` was not rewritten.

## Findings

1. **q10 scope: retained REVISE.** The internal source solution correctly
   gives the positive expression and direct zero value, but the key `{a}`
   assumes that both branches must be judged. The visible instruction permits
   adopting only the positive branch when zero is not in N. Under that
   permitted reading a and b are identical correct answers for every positive
   k, so the frozen complete set is `{a,b}`, incompatible with `single`.
   If zero or both branches are required, the complete set is `{a}`. The
   official failed mathematics record carries `{a,b}` and preserves the
   alternative scope in its evidence, rather than agreeing with the key
   merely to satisfy a passing check.
2. **q18 fidelity/leakage: retained REVISE.** All alternatives supply the
   nontrivial first count 24. The internal solution correctly calculates all
   four counts and its key `{c}` agrees with the frozen numeric set, but this
   does not assess starts-with-3 counting. The original `limitations=[]` and
   source 42 `omitted_tasks=[]` additionally fail to acknowledge that loss,
   despite a claim that all four tasks are retained. Source 42 coverage is
   therefore revise; q18 mathematics remains pass, separately from its
   fidelity, redundancy and leakage revisions.
3. **q13(d) rationale: additional REVISE.** Its wrong procedure replaces the
   k-factor descending product with k!, correctly producing the candidate.
   However its explanation says the actual numerator is not k! except when
   m=k. The frozen zero-length case is another equality: at m=3,k=0 the
   numerator is the empty product 1=0!, and both the actual expression and
   option d equal 1/6, although m is not k. Thus the rationale's exception
   statement is false on the explicitly included domain. The frozen option
   remains incorrect as a universal identity, with key `{a}` unchanged;
   m=3,k=1 still distinguishes d=1/6 from actual 1/2. This is an internal
   explanation defect, not a newly failed learner-view solution.

The smallest repair is learner-scope clarification for q10, meaningful
assessment of q18's first count with corresponding internal coverage/loss
correction, and a boundary qualification in q13(d)'s rationale. For the last,
the equality exceptions are k=0 or m=k; for m>k>=1 each descending factor
exceeds its corresponding factor in k!, so the products are strictly unequal.
No reviewer edit to the draft was made.

## All Keys and Rationale Procedures

The following comparison reuses the Phase B option truths, not a second
option review. The official JSON contains all 72 individual evidence records.
There are 20 author-labeled correct rationales and 52 distractor rationales.
All procedures generate their displayed results; the q10(b) scope problem
and q13(d) false equality-exception claim remain explicit exceptions to
unqualified semantic approval.

| Question | Frozen set vs author key | Comparison of all a/b/c/d procedures |
| --- | --- | --- |
| q01 | `{c}` = `{c}` | a keeps only the given pair order; b uses three cyclic shifts; c exhausts first-letter groups; d recopies cab instead of cba. These match the frozen list defects/truth. |
| q02 | `{b}` = `{b}` | a reuses q in the last position, producing qpmq/qpnq; b exhausts every first/second branch; c repeats pqmn; d swaps fixed nq to qn and duplicates qnmp/qnpm. |
| q03 | `{d}` = `{d}` | a identifies reversed flags and divides 6 by 2; b uses erroneous choice counts 3*3; c permits repetition and uses 3^3; d uses 3*2*1. |
| q04 | `{a,c}` = `{a,c}` | a cancels m! legitimately; b directly cancels unequal adjacent factorials and misses a residual factor; c cancels the identical (n-m)!; d cancels unequal (m+1)! and m! and drops m+1. |
| q05 | `{a}` = `{a}` | a gives 8!(1+9)=403200; b drops coefficient 1 and gives 362880; c repeats factor 8 and gives 40320*(1+72)=2943360; d uses (8+9)!=17!, yielding its large displayed integer. |
| q06 | `{c}` = `{c}` | a drops coefficient 1 and gives -39916800; b reverses subtraction and gives 36288000; c gives -10*10!=-36288000; d uses the false recurrence 11!=2*10!, giving -3628800. |
| q07 | `{b}` = `{b}` | a skips factor 101; b keeps 102*101=10302; c applies the false difference-factorial rule, giving 2!=2; d repeats 102, giving 10404. |
| q08 | `{d}` = `{d}` | a illegally removes the subtracted factorial term, giving 6; b uses (6-5)!/120=1/120; c changes subtraction to addition, giving 7; d factors the whole numerator, giving 5. |
| q09 | `{c}` = `{c}` | a inverts the second ratio; b changes the third numerator to n!; c cancels the proper blocks on each domain; d uses argument-difference factorials, giving the three fixed endpoint-like constants. |
| q10 | `{a,b}` in positive-only scope vs `{a}` | a handles both values; b's wrong empty-product procedure explains its false zero value, but that branch is allowed to be ignored; c drops a remaining numerator factor; d inverts the remaining denominator. Scope revision is not withdrawn. |
| q11 | `{b,c}` = `{b,c}` | a uses argument difference 1 as the numerator; b/c use the correct common-denominator differences; d replaces k-1 with k+1. Frozen zero-result counterexamples remain decisive. |
| q12 | `{c}` = `{c}` | a omits p-2 in the denominator expansion; b skips p-3; c cancels the complete block; d applies the false argument-difference factorial rule, replacing a variable ratio by 1/2. |
| q13 | `{a}` = `{a}` | a keeps the remaining factorial in the denominator; b inverts it; c stops cancellation one factor early; d replaces actual factors by a product based only on their count. The extra false exception assertion in d is the new revision finding. |
| q14 | `{b}` = `{b}` | a falsely excludes shared cardinality 6; b uses exact thresholds including zero; c expands both bounds by one invalid value; d reports extrema instead of full ranges. |
| q15 | `{d}` = `{d}` | a permits repeated names via 9^9; b counts only the first two positions; c fixes one student without authority; d counts all decreasing choices via 9!. |
| q16 | `{b}` = `{b}` | a fixes an assignment and uses 13!; b counts 14! bijections; c permits repeated attendants via 14^14; d imposes seven arbitrary pair-swap equivalences and divides by 2^7. |
| q17 | `{a}` = `{a}` | a uses three nonzero first-digit choices and 3! completions; b retains all 4! strings; c removes only one forbidden string; d reports the six forbidden zero-leading strings. |
| q18 | `{c}` = `{c}`, fidelity/leakage revise | a shortens prohibited 543 to 54, giving 114; b reports prohibited sets instead of complements; c gives the frozen tuple; d allows unauthorized internal prefix permutations, giving 12 and 108. |

No passing mathematics record disagrees with its author key. q10 is an
intentional failed-key disagreement; q13's additional mathematics revision
is rationale-only. q18's valid numerical tuple does not imply task fidelity.

## Concept, Source and Coverage Comparison

Selected definitions are 6 (permutation recurrence), 10 (product count),
11 (factorial notation/count), and 12 (one empty-set permutation).
Every concept-block reference belongs to this selection and has mathematical
relevance: permutation contexts use recurrence/product/count, factorial
arithmetic uses 10/11, and zero/empty-product boundaries use 12.

| Source | Questions | Concept blocks | Coverage comparison |
| --- | --- | --- | --- |
| 32 | q01,q02 | 6,10,11 | Complete nontrivial list recognition is retained; independent enumeration/writing loss explicitly recorded. Trivial singleton presentation remains the nonblocking frozen limitation. PASS. |
| 33 | q03 | 6,10,11 | Ordered distinct-color flag count retained. PASS. |
| 34 | q04 | 10,11,12 | Both proof-recognition tasks and both independent proof-writing losses explicitly retained. PASS. |
| 35 | q05-q08 | 10,11 | All four separate arithmetic expressions retained. PASS. |
| 36 | q09,q10 | 10,11,12 | All four expressions represented, but claimed full conditional assessment is undermined by q10's permitted two-answer scope. REVISE. |
| 37 | q11-q13 | 10,11,12 | All four formulas and boundary cases retained; written-working loss recorded. PASS coverage, with separate q13 rationale REVISE. |
| 38 | q14 | 6,10,11,12 | Both complete inclusive ranges, zero cardinality and unbounded upper range retained. PASS. |
| 39 | q15 | 6,10,11 | Complete nine-student ordered list count retained. PASS. |
| 40 | q16 | 6,10,11 | Complete position-distinct carriage bijection count retained. PASS. |
| 41 | q17 | 6,10,11 | Full four-digit count with leading-zero exclusion retained. PASS. |
| 42 | q18 | 6,10,11 | Four values calculated internally, but first nontrivial count supplied in every option and loss not recorded. REVISE. |

There is exactly one coverage record for each of the 11 seeds, with question
IDs exactly matching the questions' source citations. No extra or
uncited source is introduced. All 28 source tasks are represented, but
representation is not equivalent to meaningful assessment of 42(a).
The original 32/34 construction/production losses are substantive and honest,
not automatically failed simply because the responses are choices.

The shared permutation principle across list/flag/assignment contexts and
shared factorial identities across calculations were already assessed in
Phase B. The internal source mappings reveal no additional circular answer
dependency or duplicate task needing a new visible review.
There are no source or authored figures, and both official figure-review
lists are correctly empty.

## One Official Validator Run

Executed once from the sole workdir:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .tmp/stemrobin-184-six/n4-nov23-source2324/seed.json \
  --draft .tmp/stemrobin-184-six/n4-nov23-source2324/draft.json \
  --review ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n4/reviewer/first-choice-review.json
```

Actual exit status: **3**, as expected for a valid non-passing semantic review.

Actual output:

```text
mechanical checks passed; semantic review outcome: revise
```

This confirms mechanical structure, freshness, snapshot binding and review
consistency; it is not mathematical proof or semantic approval. The failed
first review is retained, not changed to pass or rerun to manufacture a pass.

## Repair Boundary

Only `reviewer/first-choice-review.json` and this report were written.
The original draft, retained original, views, source/view freezes, answers,
interactions and staging were not changed. No database/environment access,
app/skill/dependency edits, images/browser, services, chats, worktrees,
timers, commits, pushes or peer messages were used.

Ready for the smallest affected repair: q10's visible scope, q18's first-count
assessment and related coverage, and q13(d)'s internal zero-case exception.
Retain unchanged passing evidence. A q13 rationale-only correction does not
require solving or reviewing its unchanged learner view again.
