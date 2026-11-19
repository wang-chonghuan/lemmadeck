# Independent Solutions Before Candidate Inspection

Ticket: STEMROBIN-184 B. Date: 2026-11-19.
Only authoritative modern lesson/exercise texts and their embedded original
snapshots were read before this record. No candidate answers or book-answer
images have been inspected. Tables and source pages 26..33 were not opened.

| Exercise | Independent result and substantive check |
| --- | --- |
| 43 | For integer n >= 1, A_n^(n-1) = n!/1! and A_n^n = n!/0!, both n!. Includes n=1; n=0 makes n-1 invalid. |
| 44 | Four distinct jobs are ordered roles: 9*8*7*6 = 3024 assignments. |
| 45 | Each of 35 students gives a photograph to each of the other 34: 35*34 = 1190 photographs, not 595 reciprocal pairs. |
| 46 | Integer n >= 2; n(n-1)=210 gives (n-15)(n+14)=0. Only n=15; -14 is outside the domain. |
| 47 | Integer n >= 6, imposed by A_(n-2)^4. Cancel the positive common factor (n-2)(n-3)(n-4), giving n(n-1)=18(n-5), hence (n-9)(n-10)=0. Both 9 and 10 satisfy the original equation. |
| 48 | All 10^7 seven-character telephone strings include leading 0. Distinct-digit strings: A_10^7=604800. Ratio 604800/10000000 = 0.06048 = 6.048%. |
| 49 | a) {}, {1}: 2. b) {}, {1}, {2}, {1,2}: 4. c) 16 subsets, partitioned below by cardinality. |
| 50 | a) Eight subsets without a; b) eight with a. Both complete lists below, related by adjoining a. |
| 51 | Each of six elements has two independent inclusion choices: 2^6=64, including empty and full sets. |
| 52 | a) 28; b) 17; c) 35; d) 28; e) 6; f) 101. C_n^0=C_n^n=1. |
| 53 | Unordered six-person selection: C_20^6=38760. |
| 54 | Unordered four-person delegation: C_35^4=52360. |
| 55 | 2310=2*3*5*7*11, five distinct primes; C_5^2=10 products. Unique factorization prevents collisions. |
| 56 | 3570=2*3*5*7*17, five distinct primes; C_5^3=10 products. Unique factorization prevents collisions. |
| 57 | a) 35+35=70=C_8^4; b) 252+210=462=C_11^6. Also Pascal's identity by splitting subsets according to membership of one designated element. Proof, not merely an auto-graded number. |
| 58 | a) Integer n>=1: C_(n+1)^(n-1)=n(n+1)/2, so result n. b) Literal C_n^(2n-3) requires 0<=2n-3<=n, hence integer n in {2,3}; value 1 at n=2 and 3/10 at n=3. No replacement of n by 2n in the binomial subscript. |
| 59 | For n>=4, three collinear points together with a fourth would be coplanar, forbidden. Every triple determines one distinct plane, hence C_n^3: b)10, c)20, d)120. For a), n=3, the condition on every four points is vacuous: noncollinear gives 1 plane; collinear gives infinitely many. Missing noncollinearity is a genuine HOLD, not permission to alter the source. |
| 60 | Each unordered vertex pair is a side or diagonal: C_n^2-n=n(n-3)/2, integer n>=3. a)5; b)54; c)275; d)formula. Includes n=3 giving 0. |
| 61 | One game per unordered player pair: n(n-1)/2=210, so (n-21)(n+20)=0. Integer n>=2 gives only 21. |
| 62 | Choose the four-person group; its eleven-person complement is fixed: C_15^4=1365. Unequal group sizes distinguish groups, so no factor of 2. |

## Complete Lists

E49c:

- Size 0: {}.
- Size 1: {a}, {b}, {c}, {d}.
- Size 2: {a,b}, {a,c}, {a,d}, {b,c}, {b,d}, {c,d}.
- Size 3: {a,b,c}, {a,b,d}, {a,c,d}, {b,c,d}.
- Size 4: {a,b,c,d}.

E50a: {}, {b}, {c}, {d}, {b,c}, {b,d}, {c,d}, {b,c,d}.

E50b: {a}, {a,b}, {a,c}, {a,d}, {a,b,c}, {a,b,d}, {a,c,d}, {a,b,c,d}.

E55 products, in lexicographic prime-pair order:
6, 10, 14, 22, 15, 21, 33, 35, 55, 77.

E56 products, in lexicographic prime-triple order:
30, 42, 102, 70, 170, 238, 105, 255, 357, 595.

## Text Comparison Already Completed

The four embedded source.data snapshots structurally equal their corresponding
original raw JSONs, and all four declared source SHA256 values match actual raw
bytes. Every prose and exercise source_text equals the matching original text.
Every ordered dollar-delimited formula sequence is unchanged.
All numeric_changes arrays are empty. Counts are 16+10 total prose blocks,
of which 15+9 are text and one per lesson is a deferred table placeholder,
and 6+14 exercises numbered 43..62 without gaps.

Cyrillic set labels map bijectively to A,B,C,D or A,B,C, with all ordered pairs
and all subsets preserved. The youth-organization role becomes a study-group
leader, leaving three distinct roles, 35 candidates and 39270 assignments.

E49 and E50 still have all subparts inline in authoritative text. Modern
exercise lines retain Cyrillic labels for E49, E50, E52, E57, E58, E59 and E60
and are inconsistent with their Latin-label text. This is draft layout
rework, not mathematical loss. No finalizer has been run.
