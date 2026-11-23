# N4 Independent Answer Candidate Comparison

Date: 2026-11-23.
Ticket: STEMROBIN-184.
Reviewer: independent N4 source solver.
Outcome: PASS.
Candidate label supplied by the caller: draft11.

## Snapshot and Scope

Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Candidate:
`ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c2-s1-n4/answer-keys.json`.

Candidate byte SHA-256:
`7f64ddef584656a8b520fe0321302c5a205b41ea947d1889286ef921fe98791b`.

Candidate canonical JSON SHA-256:
`745fea54cda166418fd66c0f3f1c02e8b3720aaacca94d035ead7bd67b8702d3`.

Frozen reference:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n4/reviewer/source-first.md`.

Frozen reference byte SHA-256:
`88285638b7bd029d302eb0dcc1ac5d532a2d5525bc03aef29bde128d821898e7`.

The canonical candidate digest uses sorted keys, ASCII escaping, and compact
JSON separators as in the choice contract. The candidate JSON declares
`status: draft`; it contains no draft11 revision field, so the hash, not the
caller label alone, identifies the reviewed content.

This is the single authorized answer-candidate comparison, using the already
completed and frozen Phase A solutions. Source tasks were not solved again.
Only the frozen reference and this current candidate were read as mathematical
material. No previous lesson answers, choice views, choice draft, author
solutions, `author/` material, thread history, images, browser, application,
database, or environment files were inspected. Neither the candidate nor the
frozen source-first record was edited.

## Inventory

There are exactly 11 answer entries, exercises 32 through 42, each with a
display answer. The 20 grading parts are distributed as follows:

| Exercise | Grading | Parts |
| --- | --- | --- |
| 32 | ungraded | 0 |
| 33 | numeric | 1 |
| 34 | ungraded | 0 |
| 35 | numeric | 4 |
| 36 | expression | 4 |
| 37 | expression | 4 |
| 38 | ungraded | 0 |
| 39 | numeric | 1 |
| 40 | numeric | 1 |
| 41 | numeric | 1 |
| 42 | numeric | 4 |

Thus the six numeric exercises contain 12 numeric parts; 36 and 37 contain
8 expression parts. The three ungraded exercises have empty `parts` lists,
not partial automatic keys. Every `figureEvidence` list is empty, consistent
with the no-figure source tasks.

## All 11 Display Comparisons

| Exercise | Result | Concrete comparison with frozen solution |
| --- | --- | --- |
| 32 | PASS | The singleton, two two-element orders, six three-element orders, and all 24 four-element orders match the frozen enumeration exactly. The first-element grouping retains six distinct orders per group. |
| 33 | PASS | Six top-to-bottom color orders match the frozen list. The display counts $3!=6$ without identifying reversed flags. |
| 34 | PASS | Both factorial expansions retain the denominator factorial as a multiplicative factor before division. Part (b) ends at $n-m+1$ and explicitly counts $m$ surviving factors. |
| 35 | PASS | The four displayed values are $403200$, $-36288000$, $10302$, and $5$, with the same factoring/cancellation as the frozen record. The subtraction in (b) retains its negative sign. |
| 36 | PASS | The four displayed expressions are $n$, $1/[n(n-1)]$, $(n-1)(n-2)$, and $1/(2k-2)!$. The stated integer domains agree with the frozen primary conventions. |
| 37 | PASS | Common denominators in (a,b), cancellation in (c), and the descending-product identity in (d) yield the four frozen expressions. Valid endpoint conventions are discussed below. |
| 38 | PASS | Part (a) gives the entire set $\{0,1,2,3,4,5,6\}$, not just the maximum 6. Part (b) gives all integers at least 6. The display explicitly uses nonnegative cardinality and $P_0=1$. |
| 39 | PASS | The display identifies an ordering of nine distinct students and gives $9!=362880$. |
| 40 | PASS | The display identifies a bijection between 14 distinct attendants and 14 distinct carriages and gives $14!=87178291200$. |
| 41 | PASS | Both the leading-digit count $3\cdot3!=18$ and the complement $4!-3!=18$ match the frozen result. Only leading zero is forbidden. |
| 42 | PASS | Fixed prefixes and their complements give $24$, $96$, $6$, and $118$, respectively. In (d) only the two numbers with the complete prefix 543 are excluded. |

### Complete List and Duplication Check: 32

The candidate's compact strings denote ordered sequences in the permutation
context, rather than numerical multiplication or subset selection. For (a)
the sequence is `1`; for (b) it lists `78` and `87` exactly once each.

The six strings in (c) are exactly
`abc, acb, bac, bca, cab, cba`, agreeing with the frozen ordered triples.

The candidate's groups in (d) are:

- `m`: `mnpq, mnqp, mpnq, mpqn, mqnp, mqpn`.
- `n`: `nmpq, nmqp, npmq, npqm, nqmp, nqpm`.
- `p`: `pmnq, pmqn, pnmq, pnqm, pqmn, pqnm`.
- `q`: `qmnp, qmpn, qnmp, qnpm, qpmn, qpnm`.

Each group matches the corresponding six frozen tuples, after removing tuple
punctuation. The extracted six three-letter strings are all distinct and
equal the frozen set. The extracted 24 four-letter strings are all distinct
and equal the frozen set. Thus the comparison establishes actual complete
lists, not merely agreement of the asserted counts.

### Proof and Domain Check: 34

In (a), the displayed identity
$(m+3)!=(m+3)(m+2)(m+1)m!$ is the frozen expansion. Division by $m!$ and
reordering the three remaining factors prove the requested formula.
The factorial domain is integer $m\ge0$, with $m!>0$.

In (b), the display keeps the factor $(n-m)!$ until cancellation and states
that it is nonzero. Under $0\le m<n$, the surviving descending product has
$m$ factors and ends at $n-m+1$, exactly as in the frozen proof. Its
explicit factor count makes the short-case interpretation consistent with
the frozen convention: $m=1$ leaves only $n$; if $m=0$ is admitted, zero
surviving factors mean the empty product 1. The candidate does not explicitly
spell out those short cases, but it does not assert a different factor count
or an exclusion of them. No unsupported cancellation of factorial symbols
is used.

### Integer Domains and Endpoint Check: 36 and 37

For 36(a-c), the displayed domains $n\ge1$, $n\ge2$, and $n\ge3$ preserve
the original factorial arguments. They do not extend the source merely
because a simplified polynomial has a wider numerical domain.
For 36(d), the explicit $k\ge1$ follows the frozen positive-natural
interpretation of $k\in N$; it admits $k=1$ through $0!=1$. It does not
silently apply $1/(2k-2)!$ at $k=0$, where that expression is undefined.

For 37(a), $n\ge0$ retains the valid endpoint whose frozen result is 0.
For 37(b), $k\ge1$ retains the endpoint $k=1$, also with result 0.
For 37(c), $p\ge4$ preserves the original $(p-4)!$, including $0!$.
For 37(d), the candidate declares the positive-length product range
$1\le k\le m$, matching the primary frozen derivation and including $m=k$,
whose result is $1/0!=1$.

The frozen record additionally describes an optional extension of 37(d)
to $k=0$ using an empty product. The candidate does not state that extension.
This is an explicit positive-$k$ scope, not a contradiction of the primary
convention or a wrong expected expression: the same key $1/(m-k)!$ also
gives the frozen $1/m!$ if a zero-length product is subsequently admitted.
The candidate's $1\le k\le m$ statement should not be taken as a claim that
the empty-product extension is mathematically impossible.

### Complete Cardinality Ranges: 38

The primary answer includes zero because the frozen definition is $P_0=1$.
The candidate explicitly distinguishes the optional nonempty-set restriction
from the actual nonnegative-cardinality answer.

The quoted threshold values $5!=120$, $6!=720$, and $7!=5040$ agree with
the frozen record. Hence the display retains the full lower range
$0\le n\le6$ for the inclusive upper threshold 1000, and the unbounded range
$n\ge6$ for the inclusive lower threshold 500. Its monotonicity statement
does not require strict increase between $0!$ and $1!$.

## All 20 Grading-Part Comparisons

The following are the candidate's complete expected sets, each containing
one value. Every one agrees with the corresponding frozen result and with
its display answer; no grading part is omitted from this comparison.

| Part | Judge | Expected | Frozen comparison evidence |
| --- | --- | --- | --- |
| 33: count | numeric | `6` | Source 33 lists the six directed color orders. |
| 35(a) | numeric | `403200` | Frozen result from $8!(1+9)$. |
| 35(b) | numeric | `-36288000` | Frozen negative result from $10!(1-11)$. |
| 35(c) | numeric | `10302` | Frozen product $102\cdot101$. |
| 35(d) | numeric | `5` | Frozen quotient $(6-1)5!/5!$. |
| 36(a) | expression | $n$ | Frozen cancellation of $(n-1)!$, with $n\ge1$. |
| 36(b) | expression | $\frac{1}{n(n-1)}$ | Frozen denominator keeps both $n$ and $n-1$, with $n\ge2$. |
| 36(c) | expression | $(n-1)(n-2)$ | Frozen cancellation keeps exactly two factors, with $n\ge3$. |
| 36(d) | expression | $\frac{1}{(2k-2)!}$ | Frozen cancellation of $2k(2k-1)$, with $k\ge1$. |
| 37(a) | expression | $\frac{n}{(n+1)!}$ | Frozen common denominator and numerator $n+1-1$, including $n=0$. |
| 37(b) | expression | $\frac{k-1}{k!}$ | Frozen common denominator and numerator $k-1$, including $k=1$. |
| 37(c) | expression | $p(p-1)$ | Frozen numerator is $p!$ and denominator is $(p-2)!$, with $p\ge4$. |
| 37(d) | expression | $\frac{1}{(m-k)!}$ | Frozen descending-product quotient, including $m=k$. |
| 39: count | numeric | `362880` | Frozen $9!$ list count. |
| 40: count | numeric | `87178291200` | Frozen $14!$ assignment count. |
| 41: count | numeric | `18` | Frozen leading-zero exclusion gives $24-6$. |
| 42(a) | numeric | `24` | Frozen one-position prefix leaves $4!$. |
| 42(b) | numeric | `96` | Frozen complement is $5!-4!$. |
| 42(c) | numeric | `6` | Frozen two-position prefix leaves $3!$. |
| 42(d) | numeric | `118` | Frozen three-position prohibited prefix excludes $2!$. |

## Judging Suitability and Limits

The six finite-count exercises use numeric judging appropriately.
The results in 36 and 37 are variable-dependent expressions, not single
numbers; expression judging is appropriate in type, and every expected
expression is mathematically correct on its declared integer domain.

There is one concrete factorial-domain caveat for equivalence judging,
not an observed candidate or runtime defect. For 37(b), the candidate and
frozen reference give $(k-1)/k!$ on $k\ge1$, with value 0 at $k=1$.
The alternative $1/[k(k-2)!]$ agrees for integers $k\ge2$ but is undefined
at the legitimate endpoint $k=1$, because it contains $(-1)!$.
A comparison that checks only interior integers could therefore accept
an answer that loses part of the source domain. The candidate itself uses
the endpoint-safe expression; it does not contain this defective alternative.

Per the caller, the current checker handles LaTeX syntax. No judge
implementation or runtime was read or executed in this restricted comparison,
so this review makes no claim about whether that particular alternative would
actually be accepted, or whether all equivalent factorial forms are accepted.
The concrete domain example does not establish a runtime failure and is not
a new keyboard, application, or deployment gate.

## Conclusion and Continuation

PASS for this hash-bound answer candidate: all 11 displays and all 20 grading
parts agree with the frozen source mathematics under its primary conventions.
No definite candidate defect requiring revision was found. The positive-$k$
scope in 37(d), the standard short-product interpretation in 34(b), and the
factorial-domain judging caveat are recorded explicitly rather than hidden.

The only written artifact of this comparison is this `reviewer/answer-review.md`.
The frozen reference and candidate remain unchanged; no grading implementation,
choice material, or previous answer candidate was reviewed.

Ready for the later learner-view-only choice phase. Receiving this answer
candidate did not expose any choice options or choice keys. No choice
fidelity, leakage, redundancy, option truth-set, or author-comparison verdict
has been issued.
