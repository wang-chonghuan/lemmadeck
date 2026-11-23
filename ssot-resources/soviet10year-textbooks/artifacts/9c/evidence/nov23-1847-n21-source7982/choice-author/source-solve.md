# N21 Independent Source Solution

Author stage, STEMROBIN-184, 2026-11-23. Frozen before drafting any questions or
options. This is an author's independent source solution, not an independent
review, publication approval, or replacement for the written exercises.

## Authority and Selection

ROOT: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Only the installed `prepare.py` projection of book `9c`, modern lesson
`ana9-c3-s2-n21`, exercises 159-162 and concept blocks 11, 12, 13, 14, 18, 22
supplied mathematics. The book identity is `9c`; the initial CLI selector
`canonical9c` did not resolve a book.json and supplied no source content.

Seed: `.tmp/stemrobin-184-six/n21-nov23-source7982/choices/seed.json`.
Canonical seed SHA-256:
`5f71beb7cb4c44adcc64b6f071e5a79e5424aca953f9650a2c9d865688e386d8`.

Selected concept meanings:

- 11: for every epsilon > 0, there exists a natural N such that every index
  n > N satisfies |x_n-a| < epsilon.
- 12: this is written lim_(n->infinity) x_n = a.
- 13: a sequence with a limit is convergent.
- 14: the cutoff may depend on the sequence and on the chosen epsilon; it is
  chosen before the universal tail index, not separately for each tested n.
  This permits dependence, not compulsory variation for constant sequences.
- 18: the absolute-value condition is equivalent to both strict inequalities
  -epsilon < x_n-a < epsilon and a-epsilon < x_n < a+epsilon.
- 22: for each positive radius, only finitely many terms may lie outside its
  open neighborhood. The exceptional indices may depend on the radius.

Blocks 0-9 and 15-17 are worked/example material and were not selected.
Block 10 only introduces the definition. Block 21 references figure 12 and was
not selected. Block 18 is an algebraic equivalence requiring no picture.
No source exercise references a figure. Seed figures and concept figures are
empty. No answers, old choices, input specifications, judging fields, peer
solutions, reviewer evidence, or parent answer candidate were consulted.

Sequence indices are positive integers since the displayed expressions contain
n in a denominator. All proofs below choose positive natural cutoffs; none
requires a decision whether a general natural-number convention includes zero.
Existence of a natural integer greater than a given real threshold is the
elementary integer choice already used in the lesson.

## 159: Four Definition-Based Proofs

The task is to prove four printed limit assertions, not rediscover their displayed
values. Fix an arbitrary epsilon > 0 throughout each proof.

159a: x_n=(n+1)/n=1+1/n. Thus |x_n-1|=1/n.
Choose a positive natural N > 1/epsilon. For every n > N,
1/n < epsilon. Therefore lim x_n=1 by block 11.

159b: x_n=(5n-2)/n=5-2/n. Thus |x_n-5|=2/n.
Choose a positive natural N > 2/epsilon. For every n > N,
2/n < epsilon. Therefore lim x_n=5.

159c: x_n=(3n-2)/(2n)=3/2-1/n. Thus |x_n-3/2|=1/n.
Choose a positive natural N > 1/epsilon. For every n > N,
1/n < epsilon. The printed decimal 1.5 is exactly 3/2.
Therefore lim x_n=3/2.

159d: x_n=1/(n^2+1)>0. Thus |x_n-0|=1/(n^2+1).
Choose a positive natural N > 1/sqrt(epsilon). If n > N,
n^2 > 1/epsilon, hence 1/(n^2+1) < 1/n^2 < epsilon.
Therefore lim x_n=0. The sufficient bound is intentionally not claimed to be
the least possible cutoff: the exact inequality is n^2+1 > 1/epsilon.

A shared cutoff also works: choose positive natural
N > max{2/epsilon, 1/sqrt(epsilon)}. For all n > N, the four deviations in
the printed order are 1/n, 2/n, 1/n, 1/(n^2+1), all strictly below epsilon.
Thus coordinated reasoning can retain the four proofs as a complete unit.

## 160: Find Both Limits and Prove Both

a_n=(5n-1)/(2n)=5/2-1/(2n), so the candidate limit is 5/2.
b_n=(3n^2+1)/n^2=3+1/n^2, so the candidate limit is 3.

For arbitrary epsilon > 0, choose positive natural
N > max{1/(2epsilon), 1/sqrt(epsilon)}. Every n > N satisfies
|a_n-5/2|=1/(2n)<epsilon and |b_n-3|=1/n^2<epsilon.
This proves the ordered pair (lim a_n, lim b_n)=(5/2,3).
The response unit must retain both quantities in their original order together
with sufficient tail estimates; recognizing just one value would omit half
the source task and recognizing the pair alone would omit its proof component.

## 161: Arbitrary Constant

Let c be any fixed real constant and x_n=c at every positive index.
For any epsilon > 0, |x_n-c|=|c-c|=0<epsilon at every index.
For example N=1 is a positive natural cutoff and every n>N satisfies the
condition. Thus lim x_n=c. This proof does not require c>0, a nonzero c, or a
cutoff that changes with epsilon or c. Dependence allowed by block 14 is not
a requirement to manufacture dependence where none is needed.

## 162: Prove That 1 Is Not the Limit

a_n=(n+1)/(2n)=1/2+1/(2n). For n>=1,
|a_n-1|=|(1-n)/(2n)|=(n-1)/(2n)=1/2-1/(2n).

Negate the definition precisely: there must be one fixed epsilon_0>0 such
that for every natural N there exists an index n>N with
|a_n-1|>=epsilon_0. The equality case is also a failure of the strict
success condition.

Take epsilon_0=1/4. Every integer n>=2 satisfies
(n-1)/(2n)>=1/4, with equality at n=2.
Given any natural N, choose n=N+2. It is an integer, n>N, n>=2, and its
deviation is at least 1/4. Thus no cutoff works for this fixed radius and
1 is not a limit.

The order of choices matters: epsilon_0 is fixed first, then each proposed N
is defeated by an index beyond it. One offending small index, or a radius
chosen anew as N changes, does not establish this negation. Epsilon_0=1/2
cannot work here because every finite-index deviation is strictly below 1/2.
Strictly positive violations also exist: for example n=max{N+1,3} gives a
deviation strictly above 1/4, without needing equality at n=2.

For interpretation only, the sequence actually converges to 1/2:
|a_n-1/2|=1/(2n), and N>1/(2epsilon) proves this by the definition.
Rejecting one proposed limit must not be equated with divergence.

## Definition Consequences and Production Boundary

The definition requires every sufficiently late term, not just one late term
or infinitely many near terms. A common cutoff valid for all positive radii
would force exact equality x_n=a at every index beyond that cutoff; ordinary
convergence need not be eventually constant.

Finite exceptions mean a finite set for each chosen radius. If F is the finite
set of indices with |x_n-a|>=epsilon, choosing N at least its greatest index
gives the entire strict tail. Conversely, an admissible N confines failures to
the finite initial segment through N. It does not require an exception, nor
does it require a uniform finite exceptional set across all radii.

For a fixed radius, equality |x_n-a|=epsilon lies outside the required open
neighborhood. However, a non-strict bound for EVERY positive radius still
implies convergence by using half of any requested radius. Do not call that
globally quantified variant a nonequivalent definition.

All seven written tasks have independent proofs above. Native choice questions
can assess coherent proof certificates, quantifier judgments, and ordered
results. They cannot demonstrate independently finding the limits, inventing
cutoffs or counterexamples, or writing complete proofs. Those production
capacities remain with the unchanged written originals and must be reported
as losses, never claimed replaced.
