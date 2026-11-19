# STEMROBIN-184 / worker184-3: Phase2 View-Only Freeze

Date: 2026-11-19.
Workdir for every command: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Owned output directory: `.tmp/s10y-choice/batch015-geo910-n12-independent/`.

**Phase2 complete; stop before internal disclosure.** This is a local,
independent view-only review, not a package pass or author-key comparison.

## Snapshot and Order

Input: `.tmp/s10y-choice/batch015-geo910-n12-repair/view-only.json`.

- File-byte SHA-256:
  `a1cfdef76cea0e6a45275d2fbe85090554235ece59d683d0643454ed85651d2f`.
- Exact canonical view-object digest:
  `36bdfb73dcf65c945241b1bbcf9f350cd7c2348fbf542c47fca1b1ac47f23b4b`.

This digest covers the entire object, including the eleven ordered `id/view`
entries and empty `new_figures`; it is not a draft digest. Canonicalization
uses the contract's sorted-key, ASCII-escaped, compact JSON definition.
Every entry contains only id/view, and all view/option figure lists are empty.

The completed Phase1 source freeze remains unchanged at file-byte SHA-256
`8dcd8366f6fb103c8687971de62da2d0a0e041c04023460c92dfe4bddac87d0a`.
Its input receipt remains unchanged at
`6147bce4b8b131278c892a7c688573a83e29598da2c5e7f84f0adc1b599892d4`.

Source-fidelity, redundancy, leakage, and directly affected relationships were
written first in `phase2-pre-math-gates.md`, SHA-256
`89043b34d6c4ccaa3f5a9f635ef67a69d6e58513f65bc535b1ac86c6a87402b4`.
Only after that artifact was written and hash-bound were the new q10/q11
options independently evaluated. The per-option machine-readable freeze is
`phase2-view-freeze.json`.

## Local Gates

| Question | Source fidelity | Redundancy | Leakage | Independent math |
| --- | --- | --- | --- | --- |
| n12-q10 | pass for 99(1) only | pass, shared rank principle recorded | pass | pass; {B,C} |
| n12-q11 | pass for conditional 104(2) | pass, partial q07 cross-support recorded | pass | pass; {C} |

q10 uses recognition rather than requiring a generated written classification.
q11 supplies beta and tests a complete conditional scheme rather than requiring
the learner to originate beta, draw l, or write the construction proof.
These are visible production losses, not destroyed principal mathematical
tasks. Whether the author's limitations documents them remains unreviewed.

q02/q03/q04/q06 provide nearby projection ideas, not complete keyed answers to
the new items. q01/q05/q08/q09 introduce no directly duplicated new response
unit. q07's possible skew-parallel images/converse clauses can gain a witness
from solving q11, so their independent diagnostic value is partly reduced.
Those unkeyed clauses do not disclose q11's complete direction scheme.
The pre-math record explains these relationships; no old correct set or
per-option math was recomputed.

## q10: Every Option and Complete True Set

Write the source plane as p+V, dim(V)=2. For transverse direction d, the
projection's linear part L has one-dimensional kernel span(d). Consequently
L(V) has dimension one or two, and the entire image is the affine set P(p)+L(V).

| Option | Truth | Independent evidence |
| --- | --- | --- |
| A: one point | incorrect | This would require rank zero on a two-dimensional V, hence V inside the one-dimensional kernel. Impossible. |
| B: whole line | correct | If d belongs to V, the restriction has rank one. With alpha:z=0, d=(0,0,1), source plane y=0 maps onto the entire x-axis. |
| C: entire alpha | correct | If d is not in V, the restriction has rank two and is onto alpha. For the same alpha/d, source z=1 maps onto all alpha. Pi=alpha is also allowed. |
| D: a half-plane in alpha | incorrect | A whole plane's image is an affine subspace, either a complete line or the complete target plane. A proper half-plane is neither, regardless of whether its boundary belongs to it. |

**Frozen complete true set: {B,C}.** Native multiple mode fits exactly those
two possibilities. D's falsity does not guess the unresolved convention in
source99(2); no standard boundary-inclusion choice turns a proper half-plane
into a whole affine plane.

## q11: Every Option and Complete True Set

Let `a=A+R v`, `b=B+R w`, and `r=B-A`. Skewness gives independent v,w and
r outside S=span(v,w). The specified plane beta through a with b's direction
is beta=A+S. It need not and cannot contain both source lines.

For alpha={x:n dot x=c}, admissible direction d requires n dot d != 0.
Two noncollapsed parallel image directions require and suffice for
d in S but outside span(v) and span(w). Necessity follows because dependence
of L(v),L(w) puts a nonzero combination of v,w in ker(L)=span(d).
Sufficiency follows from rank one on S.

The line images are then distinct: coincidence would imply
L(r) in span(L(v)), hence r in span(v,d)=S, contrary to skewness.
Thus the view's explicit "different" does not discard a legitimate
noncollapsed skew-line construction.

**A: incorrect.** If beta is parallel to or coincident with alpha, every
direction in beta is tangent to alpha. Choosing one cannot define the
required parallel projection. Its "otherwise no solution" branch is also
false: for alpha:z=0, a={(t,0,0)}, b={(0,1,s)}, beta:y=0, choosing
d=(1,0,1) produces distinct image lines y=0 and y=1.
Both branches of the proposed universal scheme are reversed.

**B: incorrect.** The no-solution branch is right, but the other branch projects
along a and collapses a when the direction is transverse. Example:
alpha:z=0, a={(0,0,t)}, b={(s,1,0)}, beta:y=0, d=(0,0,1).
a maps to (0,0,0), while b maps to a whole line y=1, not two image lines.
It is also not always possible to choose such an l: in the example used for
A, a is tangent to alpha while beta is not direction-parallel to alpha.
Any direction parallel to a would fail B's transversality condition.

**C: correct.** beta parallel/coincident with alpha is equivalent to S=W,
where W is alpha's direction plane; then the necessary direction d in S
cannot be transverse. Otherwise choose a direction in S avoiding the source
directions and the tangent direction S intersect W. These finitely many
forbidden directions do not exhaust S. Such a choice defines the projection,
keeps both images lines, and gives distinct parallel images by the proof above.
For an explicit choice, use d=v+t w with t nonzero and
n dot v+t(n dot w) nonzero. This covers every solvable given configuration,
not just a single favorable example.

**D: incorrect.** The no-solution branch is right, but an outside-S direction
has ker(L) intersect S={0}, so L restricted to S has rank two.
L(v),L(w) are independent: the images intersect rather than being parallel.
In A's solvable example, take d=(0,1,1), outside beta's direction plane and
transverse to alpha. The images are the x-axis and y-axis in alpha.

**Frozen complete true set: {C}.** Native single mode is appropriate.
All four whole schemes have been evaluated; no author's truth labels,
rationales, or misconception derivations were consulted.

## q04/q07 and the Source101 Distinction

q04's unchanged view asks failure to obtain **two different parallel images**,
not failure of the book's inclusive parallelism. For its noncollapsed
coincident-image scenario, distinctness fails while book-parallelism survives.
Its point-collapse scenario instead destroys line images and is the
source101 exception. The stronger visible predicate is explicit and
mathematically meaningful, but is **not unqualified source101 equivalence**.

This source-target difference is a definite visible fact. It is not a new
q04 math failure, and no old keys have been recalculated. An internal claim
that q04 wholly preserves source101 without distinguishing coincidence would
need revision; whether that claim exists cannot be decided before the
authorized intent/coverage disclosure.

q07 explicitly uses different parallel images in its inverse clause.
That narrows the antecedent, not the definition of the book's forward
parallelism. It does not ask the missing source101 distinction. For skew
source lines, the distinct-image wording in q07/q11 is compatible with
Phase1's impossibility of coincident noncollapsed images. The old q07 math
and figure passes remain reusable; only these affected visible relationships
were considered.

## Verification and Stop

Offline Node assertions checked the new q11 direction witnesses: A's reversed
existence scheme, B's collapse/unavailable direction, C's distinct parallel
images, and D's independent image directions. Result: pass. These finite
examples supplement the written proofs, not a whole-package semantic test.
Input and output bindings were rechecked after writing.

No q01-q09 passed mathematics or figure stage was rerun. No image bytes,
opens, decodes, ROIs, screenshots, or renders occurred. No services/network,
paid calls, DB, Git, canonical edits, descendants, or chat tools were used.
Only new files within the owned independent directory were written; Phase1
and the pre-math freeze remain unchanged.

Source99(2)/(3) remain genuinely unresolved. No package pass, full-source
coverage certification, author-key agreement, or contract-complete
`s10y-choice-review-v1` is inferred. No draft.json, repair.mjs,
source-repair.md, or prior internal Stage3/rejected keys were read.

**Stop here and await direct human disclosure of internals.**
