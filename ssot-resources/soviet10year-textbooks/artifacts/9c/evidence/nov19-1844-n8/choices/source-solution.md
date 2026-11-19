# Independent Choice-Author Source Solution

Seed digest: 2148d16b8d88638b0d97d017a08993edadf16a1f204b319bdfe0de60b47fdfdc.
This file is frozen before constructing alternatives. Only the prepared written
E70 seed is used; no answer key, prior choice question or solved lesson paragraph
is used as a concept seed. No figures or unestablished zero convention are needed.

For a), all terms have their finite-subset meanings when n,m are integers,
n >= 2 and 0 <= m <= n-2. Adjoin two distinct elements u,v to an n-element
set and count its (m+2)-subsets. The disjoint exhaustive classes contain:

- Both u,v: choose the remaining m old elements, C_n^m possibilities.
- Exactly one: choose u or v in two ways, then m+1 old elements,
  2 C_n^(m+1) possibilities.
- Neither: choose m+2 old elements, C_n^(m+2) possibilities.

Adding the three counts equals the total C_(n+2)^(m+2), proving a).

For b), the exact finite domain is n >= 3 and 0 <= m <= n-3. Adjoin three
distinct elements u,v,w and count (m+3)-subsets. If the number of selected
new elements is 3,2,1,0, respectively, then the counts are:

- 3: one choice of new elements and m old ones, C_n^m.
- 2: three new pairs and m+1 old ones, 3 C_n^(m+1).
- 1: three new singletons and m+2 old ones, 3 C_n^(m+2).
- 0: one empty new selection and m+3 old ones, C_n^(m+3).

These classes are disjoint and exhaustive. Summing their counts equals
C_(n+3)^(m+3), proving b), including the finite endpoint cases.

The decisive distinctions are selected-new versus selected-old cardinality,
the number of ways to choose specified new elements, and the total universe
size. Two response units are justified by a three-class partition versus a
four-class ordered complete counting result, not just the printed letters.
Choice recognition does not establish that a learner can independently invent
the partition or write a universal proof. The original proof task remains.
