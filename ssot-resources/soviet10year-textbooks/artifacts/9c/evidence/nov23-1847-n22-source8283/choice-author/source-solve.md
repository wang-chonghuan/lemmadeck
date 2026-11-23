# Independent source solution: N22 / written exercise 163

Author scope: STEMROBIN-184, authorized 9c/10c finishreview; this author handles only canonical `9c/ana9-c3-s2-n22`. Date: 2026-11-23. This record was written before constructing any question options or keys. It is source-solving evidence, not a semantic review.

## Authority and snapshot

Only the whitelist projection from `prepare.py inspect` and the resulting tool-prepared seed were used. The projection contains one written exercise with four tasks and zero figures. No answer files, interaction specifications, existing choices, earlier ticket results, independent reviewer solutions/freezes, or N23 body were consulted.

Explicitly selected concept paragraphs:

- Block 1: a convergent sequence has exactly one limit.
- Block 5: a sequence with a limit is convergent; a sequence without a limit is divergent.

Blocks 2-4 are a theorem proof, not definitions. Blocks 6-11 introduce or solve examples, not definitions. None were selected or used as a source solution.

The limit considered here is a finite real number. The equations with denominators require positive integer indices; all arguments concern sufficiently large positive integer indices and do not depend on whether some other notation for natural numbers includes zero. The epsilon-tail criterion is used explicitly in the independent mathematical argument; it is not represented as an additional quoted lesson paragraph.

Prepared seed canonical SHA-256: `f713b6f8f3c412228bf221de9e11c1bdda443c159540489a2443a7bbd95ae8d6`.

The seed reports these hashes of the four authorized source files:

| Source | SHA-256 |
| --- | --- |
| `9c/book.json` | `3a9b8dfd3bc80e778593bd3ccc673e809e00b7801ec6e80d4b759818bf6a4b8d` |
| Modern N22 `lesson.json` | `caf1bfd3235c63e8e0dbe45717efe5cfe87e358adf456020c24e8f1c05cc7e23` |
| Modern N22 `exercises.json` | `d89ebc2be23ba2067fd250e2bb206ce2d6ca4259a6052bd905b35d1d64d3cd3d` |
| Modern N22 `figures.json` | `ad67f24cf7e325c83667031faa08988cc6ce9ff4b9896780d29d57a001a250a2` |

All paths in this table are under `ssot-resources/soviet10year-textbooks/artifacts/`; modern N22 paths are under `9c/editions/modern-us-neutral/lessons/ana9-c3-s2-n22/`.

## Full source task

Prove convergence of:

a) \(x_n=(6n-3)/(3n)\).

b) \(x_n=2+(-1)^n/n\).

Prove divergence of:

c) \(y_n=(-1)^n+1\).

d) \(y_n=2n-1\).

These are proof tasks, not merely requests for limits or classification labels.

## Independent proofs

### a) Rational expression

For every positive integer \(n\),
\[
x_n=\frac{6n-3}{3n}=2-\frac1n,\qquad |x_n-2|=\frac1n.
\]
Given any \(\varepsilon>0\), choose a positive integer \(N>1/\varepsilon\). For every integer \(n>N\), \(1/n<\varepsilon\), so \(|x_n-2|<\varepsilon\). This proves convergence to 2 with the required arbitrary tolerance and entire-tail quantifiers.

Conceptual distinction: exact cancellation leaves an error term tending to zero; a proof must control that error on an entire tail for every positive tolerance.

### b) Alternating perturbation

For every positive integer \(n\), \(|(-1)^n|=1\), hence
\[
|x_n-2|=\left|\frac{(-1)^n}{n}\right|=\frac1n.
\]
Given any \(\varepsilon>0\), choose a positive integer \(N>1/\varepsilon\). Every \(n>N\), of either parity, satisfies \(|x_n-2|<\varepsilon\). Therefore this sequence also converges to 2. Alternation of the sign does not prevent convergence because its magnitude shrinks.

Conceptual distinction: control of absolute error covers both parity classes simultaneously; repeated sign changes alone do not imply divergence.

### c) Persistent two-value oscillation

For every positive integer \(k\),
\[
y_{2k}=2,\qquad y_{2k-1}=0.
\]
Let \(a\) be any real candidate limit. The triangle inequality gives
\[
2=|2-0|\le |2-a|+|0-a|.
\]
Thus at least one of \(|2-a|\) and \(|0-a|\) is at least 1. Fix \(\varepsilon=1\). The value at distance at least 1 from \(a\) occurs at arbitrarily large indices of its parity. For every proposed tail cutoff \(N\), choose such an index \(n>N\); then \(|y_n-a|\ge1\). Consequently \(a\) is not a limit. Since \(a\) was arbitrary, the sequence has no finite real limit and is divergent.

Equivalently, if convergence to \(a\) supplied a tail in which all distances were less than 1, choose consecutive indices in that tail. Their values are 0 and 2, giving \(2<1+1=2\), a contradiction.

The two constant parity subsequences do not give the full sequence two limits: a full-sequence limit must govern every sufficiently large index, and block 1 allows only one such limit.

Conceptual distinction: boundedness and infinitely many exact hits on a candidate are insufficient; nonvanishing separation persists on every tail.

### d) Escape from each finite candidate

Let \(a\) be any real candidate limit and fix \(\varepsilon=1\). For every proposed positive integer cutoff \(N\), choose a positive integer
\[
n>\max\left\{N,\frac{a+2}{2}\right\}.
\]
Then
\[
y_n-a=2n-1-a>1,\qquad |y_n-a|>1.
\]
There is therefore no tail whose terms all lie within distance 1 of \(a\). Every finite real \(a\) fails the limit criterion, so the sequence is divergent.

It also tends to \(+\infty\) in the separate unbounded-growth sense: for any real bound \(M\), all integers \(n>(M+1)/2\) satisfy \(y_n>M\). This is not convergence to a finite real number under the selected lesson definition.

Conceptual distinction: a proof of divergence must exclude every candidate, not just 0 or 1; increasing growth without a finite bound is different from monotone convergence.

## Readiness and limits

All four source tasks have independent proofs; no source task is unresolved or figure-dependent. A choice adaptation can test judgment of proof validity, tail quantifiers, parity separation and exclusion of arbitrary finite limits. It cannot demonstrate the learner's independent production of a complete proof, an original epsilon cutoff, or a self-chosen contradiction. Those losses must be recorded in the later draft rather than presented as fulfilled written-proof performance.

This record contains no candidate options or candidate answer sets. It is to remain unchanged during question authoring and any later affected repair.
