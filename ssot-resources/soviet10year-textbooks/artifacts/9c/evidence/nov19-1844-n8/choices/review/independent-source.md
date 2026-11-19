# Independent Source Freeze

Reviewer: Codex reviewer chat `01a1f432-736d-73a0-a04e-3aedd4ccf5bb`, separate from the draft author.
Seed canonical SHA-256: `2148d16b8d88638b0d97d017a08993edadf16a1f204b319bdfe0de60b47fdfdc`.
Seed-only observation: `2026-11-19T14:25:38.544Z`.

Only the three requested skill documents and seed were read. No draft, author reasoning, key, answer history, image, browser, lesson concept, or source resource was consulted.

## Full Written E70

Use the conventional finite count: C_N^K counts K-element subsets of an N-element set for integer N >= 0 and 0 <= K <= N. The seed itself supplies no definition. This assumption remains explicit pending the later learner-view check; do not assume zero-extension or generalized binomial coefficients.

### Part a

Domain: integer n >= 2 and 0 <= m <= n-2.

Choose m+2 elements from n old elements plus two distinguishable new elements. Classify by the number t of chosen new elements. For t=0,1,2 the counts are C_n^(m+2), 2C_n^(m+1), C_n^m, respectively. The classes are disjoint and exhaustive and their sum is C_(n+2)^(m+2). Reversing the order of summation yields the exact written identity.

An independent algebraic check pairs adjacent terms:

```text
(C_n^m+C_n^(m+1))+(C_n^(m+1)+C_n^(m+2))
= C_(n+1)^(m+1)+C_(n+1)^(m+2)
= C_(n+2)^(m+2).
```

At n=2,m=0 both sides equal 6. The m=0 and m=n-2 endpoints retain the classes with C_n^0=1 and C_n^n=1.

### Part b

Domain: integer n >= 3 and 0 <= m <= n-3.

Choose m+3 elements from n old elements plus three distinguishable new elements. For t=0,1,2,3 chosen new elements, the counts are C_n^(m+3), 3C_n^(m+2), 3C_n^(m+1), C_n^m. The three possible single elements and three possible pairs explain both factors 3. The disjoint exhaustive classes sum to C_(n+3)^(m+3), exactly the written identity.

For an algebraic check, split the left side into the part-a sum at m plus the part-a sum at m+1. This gives C_(n+2)^(m+2)+C_(n+2)^(m+3)=C_(n+3)^(m+3). The b-domain guarantees both uses of a are valid.

At n=3,m=0 both sides equal 20. The m=0 and m=n-3 endpoints retain C_n^0=1 and C_n^n=1.

## Coverage Baseline

Both tasks are universal proofs, not sample evaluations. A valid choice adaptation must retain the weighted relationships, index shifts, exhaustive counting or equivalent proof reasoning, and full finite domains. Choice recognition cannot establish independent proof production. The original proof-writing task must remain ungraded and this loss must be acknowledged.
