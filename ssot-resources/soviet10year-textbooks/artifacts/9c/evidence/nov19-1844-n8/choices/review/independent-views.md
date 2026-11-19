# Independent View Freeze

Reviewer: Codex reviewer chat `01a1f432-736d-73a0-a04e-3aedd4ccf5bb`.
Projection canonical SHA-256: `eadd1a87dc37c321a66003e9aed9e98f1aa4479be526d49cdbc91af368976b79`.
The author intent, source solution, rationales and key have not been read.

Fidelity, redundancy and leakage were judged from the view-only projection before solving all eight alternatives. Both primitive definitions and full integer domains agree with the independent source solution. Neither question displays a source mapping or a solved counting rule. The distinct two-element and three-element partitions support transfer without duplicating the same task.

## Two New Elements

For 2,1,0 selected new elements, the counts are C_n^m, 2C_n^(m+1), C_n^(m+2). Thus the full true set is **a,b,c**, requiring native multiple mode.

- a: taking both leaves m old elements. True on the whole domain.
- b: two possible single new elements, each leaving m+1 old elements. True.
- c: neither taken leaves m+2 old elements. True, including C_n^n=1 at the upper boundary.
- d: the actual population is n+2. Its total exceeds the proposed C_(n+1)^(m+2) by C_(n+1)^(m+1)>0. At n=2,m=0 actual 6 versus proposed 3 disproves the claim.

## Three New Elements

The stated class order is **3,2,1,0**, not ascending. The full tuple is (C_n^m,3C_n^(m+1),3C_n^(m+2),C_n^(m+3)). The full true set is **a**, requiring native single mode.

- a: each multiplicity and old-selection index matches that labeled class. True for every permitted pair.
- b: at n=3,m=0 it gives (1,6,6,1), but the counts are (1,9,9,1). Both middle factors must be 3, not 2.
- c: the one-new class needs m+2 old elements. At n=4,m=0 its third entry is 12 instead of 18.
- d: it reverses the class assignments. At n=4,m=0 it gives (4,18,12,1), not (1,12,18,4).

Both c and d accidentally agree on n=2m+3, including the smallest pair n=3,m=0. For c, adjacent coefficients are equal exactly when (n-m-1)/(m+2)=1. For d that equality also entails the outer pair's complementary symmetry. The view's universal quantifier still makes both alternatives false. In d the total is always correct, but its individual class labels are wrong.

## Coverage Pending Disclosure

The views preserve the full mathematical partitions underlying both identities and the universal finite domains. They assess recognition, not independent written proof construction. They do not directly require the learner to write the summation or the right-hand total coefficient. Those production losses must be explicit in the later author records; the original proof should remain ungraded. No source proof-production approval is implied by the independent true sets.
