# N4 Learner-View-First Review Freeze

Date: 2026-11-23.
Ticket: STEMROBIN-184.
Reviewer: independent N4 source solver.
Scope: Phase B learner views only; not an official full-draft review.
Visible-snapshot outcome: REVISE for q10 and q18; no missing-input blocker.

## Inputs and Snapshot Binding

Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

Views:
`.tmp/stemrobin-184-six/n4-nov23-source2324/question-views.json`.

Views byte SHA-256:
`cc40269328e3409a1ffd31e0f0e50be9a9815fd1df09050fa11ce0ff5712cb5c`.

Views canonical JSON SHA-256:
`690957667dba8459c7f51fd28d563eb08f0a881414cc484d0bd4d002c4fc8df0`.

Frozen source reference:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n4/reviewer/source-first.md`.

Frozen source-reference byte SHA-256:
`88285638b7bd029d302eb0dcc1ac5d532a2d5525bc03aef29bde128d821898e7`.

The canonical views digest uses sorted keys, ASCII escaping, and compact JSON
separators. The received JSON contains exactly 18 `{id, view}` entries,
`q01` through `q18`. Each view contains only mode, stem, figure IDs, and four
options `a,b,c,d`; every option contains only ID, text, and figure IDs.
There are 72 options. q04 and q11 use `multiple`; the other 16 use `single`.
All figure-ID lists are empty.

The mathematical inputs read in this phase were only these learner views
and the already-frozen independent source record. No full draft, author
reasoning, keys, rationales, coverage, `author/` files, previous choice
package, answers, interactions, or thread history was opened in this phase.
The earlier authorized answer comparison is not a choice-key comparison.
No source solution was rewritten, no figure was opened, and no browser,
application, database, environment, service, or dependency was used.

## Stage 1: Fidelity, Redundancy, and Leakage

This section was written before deriving the visible questions' complete
true sets. Assessments concern mathematical tasks and visible information,
not conformity with undisclosed author intentions or keys.

| Question | Task fidelity | Redundancy | Answer leakage |
| --- | --- | --- | --- |
| q01 | PASS with recorded loss: tests completeness and validity for the two- and three-element permutation lists. It shows rather than elicits the one-element ordering. | PASS: a triple of lists is one meaningful response unit; missing reverse orders and a repeated word are different defects. | PASS: no marked correct list or count is supplied by the stem. The invariant singleton is a disclosed trivial subtask, discussed below. |
| q02 | PASS with recorded loss: a complete 24-entry list must contain each element once per word, have no duplicate word, and exhaust the first-element groups. | PASS: repeated entries and repeated letters are distinct mathematical checks; all four lists have the same number of entries, so length alone cannot select one. | PASS: the stem does not print a correct list or its arrangement order. Shared valid entries are candidate data to verify, not a tagged key. |
| q03 | PASS: three distinct strips occupy ordered top/middle/bottom positions, preserving the flag permutation task without reversal identification. | PASS: a three-color physical ordering is not the same response as selecting a literal letter list in q01. | PASS: no flag count is given. Reusing q01's three-element principle still requires recognizing the color-position correspondence. |
| q04 | PASS with recorded loss: distinguishes justified factorial expansion/cancellation from discarding unequal factorial factors; both source identities are present. | PASS: the two identities require different cancellation lengths, and `multiple` permits accepting a proof of each. | PASS: the formulas in the stem are what the source asks to prove, not answers to which derivations are valid. |
| q05 | PASS: retains the exact factorial sum $8!+9!$. | PASS: addition is not duplicated by the neighboring subtraction or quotient questions. | PASS: neither $8!$ nor the sum is evaluated in this stem. |
| q06 | PASS: retains ordered subtraction $10!-11!$, including the possibility of a negative result. | PASS: sign and factorial scaling are a distinct task from q05. | PASS: no evaluated minuend, subtrahend, or difference is supplied in the stem. |
| q07 | PASS: retains the quotient $102!/100!$ and its cancellation endpoint. | PASS: a long-factorial ratio tests a different surviving product from q08. | PASS: the stem gives no evaluated quotient or surviving-factor list. |
| q08 | PASS: retains the full numerator difference divided by 120. | PASS: subtraction before division is distinct from q07's factorial ratio. | PASS: the stem does not evaluate either factorial or the numerator difference. |
| q09 | PASS: keeps all three different ratios and states each original integer domain separately rather than replacing them with one common domain. | PASS: the triple tests numerator/denominator direction and one versus two surviving factors; a bundle is mathematically meaningful. | PASS: no simplified results are printed in the stem. Domain endpoints alone are not an identity over the entire domain. |
| q10 | REVISE: it mentions both natural-number conventions but explicitly allows the zero branch to be ignored when $0\notin N$. That leaves a scope ambiguity for a single-response claim about the complete simplification. | PASS apart from scope: symbolic cancellation and the zero boundary are distinct checks from the three ratios in q09. | PASS: the stem does not supply the simplified factorial expression or zero value. The problem is which branch is required, not a leaked numeric answer. |
| q11 | PASS: tests both reciprocal-factorial differences as identities on their complete indicated integer ranges, including the zero-result endpoints. | PASS: the two shifted differences are related but not identical formulas; each option requires a truth judgment. | PASS: $0!=1$ is a legitimate convention, not the numerator resulting from the subtraction. |
| q12 | PASS: preserves the four explicit factors, $(p-4)!$, and the $p\ge4$ domain; asks for an identity, not one endpoint value. | PASS: reconstructing a factorial numerator is distinct from the reciprocal differences in q11. | PASS: the stem does not identify which two factors survive. |
| q13 | PASS: preserves a product of exactly $k$ descending factors divided by $m!$, and explicitly settles $k=0$ as an empty product. | PASS: variable-length cancellation and two zero boundaries are different from q12's fixed four-factor numerator. | PASS: supplying the empty-product convention does not supply the general quotient. q04 provides a related factorial identity, but applying it still requires rearrangement and division. |
| q14 | PASS: requests both complete cardinality ranges, with nonnegative $t$ and one empty-set permutation; neither extremum replaces a range. | PASS: the two threshold directions are different conditions, not duplicate questions about the same bound. | PASS: neither $6!$ nor either transition threshold is evaluated in the stem. |
| q15 | PASS: every distinct student occupies one ordered list position; there is no circular-order quotient or repeated name. | PASS: contextual identification of a list permutation is distinct from the symbolic simplifications. | PASS: factorial values appear as candidate formulas, but deciding between repeated independent choices and permutation formulas remains necessary. |
| q16 | PASS: distinct attendants are assigned bijectively to position-distinct carriages, one per carriage. | PASS: same permutation principle as q15 but a different bijection context and no arbitrary pairing equivalence. | PASS: none of the displayed formulas is marked as correct; identifying a bijection rather than independent or paired assignments is mathematical work. |
| q17 | PASS: four-digit numbers use all four available digits without repetition; ordinary four-digit place-value rules retain the leading-zero restriction. | PASS: exclusion of leading zero is absent from the student and carriage tasks. | PASS: the stem does not state how many permutations begin with zero or supply the valid-number count. |
| q18 | REVISE: the four-count bundle preserves prefix order and both complement directions, but its first count is invariant in every option. The original starts-with-3 count is supplied, not subjected to mathematical judgment. | REVISE for the invariant first coordinate: it is a nontrivial source subtask with no discriminating alternative. The other three coordinates test different conditions. | REVISE: all four options explicitly give 24 for the first requested count. It can be copied without deriving the one-fixed-digit count and reused in the complement counts. |

### Recognition and Production Losses

q01 and q02 preserve complete-enumeration recognition, including uniqueness,
element-use conditions, and missing permutations. They do not show that a
learner can generate and organize every permutation independently. That
production loss is not an automatic failure of a choice conversion.
Furthermore, all q01 options show the same correct singleton `(1)`: the
one-element base case is presented rather than discriminated. Its forced
ordering has no further ordering distinction to lose; the nontrivial
two- and three-element tasks still require checking.

q04 preserves judgment of expansion, positive denominators, exact surviving
factor count, and invalid cancellation. Choosing valid supplied derivations
does not establish independent writing of either proof. This proof-production
loss is recorded, not treated as an automatic failure.

q18 has a different issue from ordinary recognition or reasonable elimination:
the first requested nontrivial count is explicitly the same in all four
alternatives. No reading of the alternatives requires judging that coordinate.
The given 24 can also supply the four-free-position count used in the later
one-position complement. This should be repaired by making that source
relationship subject to a meaningful alternative or a separate question,
not by claiming that selecting the unchanged tuple demonstrates it.

### Package Relationships Visible Without Internal Coverage

The visible tasks correspond to the frozen sources as follows; these are
reviewer-inferred relationships, not a read of the undisclosed coverage:

- 32(a-c): q01; 32(d): q02.
- 33: q03; 34(a-b): q04.
- 35(a-d): q05, q06, q07, q08 respectively.
- 36(a-c): q09; 36(d): q10.
- 37(a-b): q11; 37(c): q12; 37(d): q13.
- 38(a-b): q14.
- 39, 40, 41: q15, q16, q17 respectively.
- 42(a-d): q18, with the first-coordinate assessment loss described above.

q01/q03 reuse the three-distinct-element permutation idea, but translating
letter arrangements to ordered color strips is still a mathematical relation.
q04/q13 reuse factorial cancellation, but neither simply names the other's
correct option. The values of $9!$ and $8!$ in q15's candidate formulas can
help q05/q06 after factorial recurrence and arithmetic; this is shared
mathematics, not a direct answer to either expression. No question ID,
source-number mapping, correct-option annotation, or author explanation is
visible. Outside q18's invariant first coordinate, no direct answer copying
or circular response dependency was identified.

## Stage 2: Independent Visible-Question Mathematics

This section was completed after the Stage 1 observations were recorded,
and before any internal comparison. True/false means that the whole option
answers its visible stem; a tuple with some correct components is still
false if another component fails. Universal identities must hold throughout
their indicated domains, not merely at one boundary.

### q01

Independent solution: the complete ordered lists have sizes 1, 2, and 6.
The two-element set needs both `(7,8)` and `(8,7)`. For three elements,
fixing each first letter leaves both orders of the remaining two letters.
The complete triple list is `abc,acb,bac,bca,cab,cba`.
Complete true set: `{c}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | The singleton and six triples are complete, but `(8,7)` is missing from the two-element list. |
| b | F | The first two lists are complete, but the triple list omits `acb,bac,cba`; it contains only the three cyclic orders. |
| c | T | Lists the singleton, both pair orders, and all six distinct triple orders exactly once. |
| d | F | The triple list repeats `cab` and omits `cba`; it has six entries but only five distinct orders. |

### q02

Independent solution: four disjoint first-letter groups each contain
$3\cdot2\cdot1=6$ permutations. Within a group, each of the three second
letters must be followed by both orders of the remaining pair. A correct
list therefore has 24 distinct valid words, not just 24 entries.
Complete true set: `{b}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | `qpmq` repeats q and lacks n; `qpnq` repeats q and lacks m. They replace the valid missing words `qpmn,qpnm`. Twenty-four distinct entries do not make this a valid list. |
| b | T | All four first-letter groups match the frozen six-per-group lists; all 24 words are valid and distinct. |
| c | F | The p group repeats `pqmn` and omits `pqnm`. There are only 23 distinct words. |
| d | F | `qnmp,qnpm` occur both in the second printed group and in the q group. `nqmp,nqpm` are absent, leaving only 22 distinct words. |

### q03

Independent solution: choose the top color in 3 ways, the middle from the
remaining 2, and the bottom in 1. Thus $3\cdot2\cdot1=6$ flags.
Complete true set: `{d}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | Three first-color choices do not exhaust the two remaining orders for each choice; the count is 6, not 3. |
| b | F | Nine is not $3\cdot2\cdot1$; allowing unrestricted color choices would disregard the one-strip-per-color condition. |
| c | F | $3^3=27$ counts unrestricted three-position color strings, including repetitions, not arrangements of the three distinct strips. |
| d | T | Gives the exact distinct-strip position count 6. |

### q04

Independent solution: $(m+3)!=(m+3)(m+2)(m+1)m!$ and cancellation of the
positive $m!$ proves the first identity. Separating exactly $m$ descending
factors from $n!$ leaves $(n-m)!$; cancellation proves the second identity,
including the empty product for $m=0$. Both are required valid proof
selections, whereas expansions followed by discarding unequal factorials
are not valid derivations.
Complete true set: `{a,c}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | T | Correctly expands to $m!$, divides by a positive common factor, and keeps all three factors. Reordering multiplication gives the first requested right-hand side. |
| b | F | The expansion itself can keep $m+1$ descending factors, but $(n-m-1)!/(n-m)!=1/(n-m)$, not 1. At $n=5,m=2$, the actual quotient is $120/6=20$, whereas the claimed surviving product is $5\cdot4\cdot3=60$. |
| c | T | Keeps exactly the factors down to $n-m+1$, cancels the identical $(n-m)!$, and explicitly handles $m=0$ as $n!/n!=1$. |
| d | F | $(m+1)!/m!=m+1$, not 1. At $m=1$, the actual quotient is $4!/1!=24$, whereas the claimed product $4\cdot3$ is 12. |

### q05

Independent solution: $8!+9!=8!(1+9)=10\cdot40320=403200$.
Complete true set: `{a}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | T | Equals $10\cdot8!=403200$. |
| b | F | $362880=9!$ alone, omitting the positive term $8!=40320$. |
| c | F | $2943360=73\cdot8!$, not the required $10\cdot8!$. It also equals $8!+8\cdot9!$, a different expression. |
| d | F | $355687428096000=17!$; the factorial of $8+9$ is not the sum of the two factorials. |

### q06

Independent solution: $10!-11!=10!(1-11)=-10\cdot3628800=-36288000$.
Complete true set: `{c}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | $-39916800=-11!$ omits the positive $10!$ term. |
| b | F | $36288000$ has the opposite sign; $11!>10!$ makes the original difference negative. |
| c | T | Gives $-10\cdot10!=-36288000$. |
| d | F | $-3628800=-10!$, not $-10\cdot10!$; it loses the factor 10. |

### q07

Independent solution:
$102!/100!=102\cdot101\cdot100!/100!=10302$.
Complete true set: `{b}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | 102 omits the other uncanceled factor 101. |
| b | T | $102\cdot101=10302$. |
| c | F | $102-100=2$ is the difference of factorial arguments, not their factorial quotient. |
| d | F | $10404=102^2$ uses 102 twice instead of the descending factors 102 and 101. |

### q08

Independent solution:
$(6!-5!)/120=(720-120)/120=5$.
Complete true set: `{d}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | $6!/120=6$ neglects the subtraction of $5!/120=1$. |
| b | F | $1/120$ is $(6-5)/120$, not the difference of the factorial values divided by 120. |
| c | F | $(720+120)/120=7$ uses addition rather than the specified subtraction. |
| d | T | $(720-120)/120=5$. |

### q09

Independent solution on the respective original domains:

$$
\frac{n!}{(n-1)!}=n,\qquad
\frac{(n-2)!}{n!}=\frac1{n(n-1)},\qquad
\frac{(n-1)!}{(n-3)!}=(n-1)(n-2).
$$

The displayed domains are respectively integer $n\ge1,n\ge2,n\ge3$.
Complete true set: `{c}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | The first and third expressions are correct, but the second is inverted. At $n=2$, the ratio is $0!/2!=1/2$, not $2(1)=2$. |
| b | F | The first two expressions are correct, but the third adds an extra factor n. At $n=3$, the ratio is $2!/0!=2$, not $3\cdot2\cdot1=6$. |
| c | T | Gives the three cancellation results in the correct order on each indicated domain. |
| d | F | The constants are only respective lower-endpoint values, not identities. The first ratio is 2 at $n=2$, not 1; the second is $1/6$ at $n=3$, not $1/2$; the third is 6 at $n=4$, not 2. |

### q10

Independent solution: for $k\ge1$,

$$
\frac{2k(2k-1)}{(2k)!}
=\frac1{(2k-2)!}.
$$

At $k=0$, the original expression is $0\cdot(-1)/0!=0$, without using a
negative factorial. At $k=2$, the original value is $12/24=1/2$.

The visible instruction says to adopt **only** the $k\ge1$ branch when
$0\notin N$. Under that instruction and the frozen source's primary
positive-natural convention, both a and b supply the same correct adopted
branch. If $0\in N$, or if the question instead required a correct account
of both convention branches regardless of which one is adopted, only a
would be correct.

Complete true sets frozen by scope:

- Literal positive-natural branch instruction: `{a,b}`.
- Zero-inclusive N, or a universal requirement to explain both branches:
  `{a}`.

Mathematics/mode verdict: REVISE. The current `single` view does not fix which
of these scopes governs truth. An undisclosed author key selecting a cannot
remove the visible permission to ignore b's unused zero branch.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | T in both scopes | Its positive branch is the exact canceled expression, and its zero branch gives the original value 0. |
| b | T under the positive-only instruction; F when both branches are required | Its adopted $k\ge1$ expression is identical to a's. Its $k=0$ claim 1 contradicts the original value 0, but that is precisely the branch the positive-only instruction permits ignoring. |
| c | F in both scopes | Its zero branch is correct, but at $k=2$ its positive branch is $1/3!=1/6$, not $1/2$. |
| d | F in both scopes | Its zero branch is correct, but at $k=2$ its positive branch is $2!=2$, not $1/2$. |

This is not an inability to perform cancellation or determine the zero
value. It is a response-scope defect. A precise repair is to require the
whole explanation to handle both conventions correctly and remove the
instruction allowing a displayed branch to be ignored, or explicitly use a
zero-inclusive domain. No candidate text was edited by this reviewer.

### q11

Independent solution:

$$
\frac1{n!}-\frac1{(n+1)!}
=\frac{n+1-1}{(n+1)!}
=\frac n{(n+1)!}\quad(n\ge0),
$$

$$
\frac1{(k-1)!}-\frac1{k!}
=\frac{k-1}{k!}\quad(k\ge1).
$$

Both have valid zero-result lower endpoints. Complete true set: `{b,c}`.
Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | At $n=0$, the left side is $1/0!-1/1!=0$, while the proposed right side is $1/1!=1$. Agreement at $n=1$ would not establish the universal identity. |
| b | T | The common denominator yields numerator $n+1-1=n$ throughout $n\ge0$, including 0. |
| c | T | Writing the first reciprocal as $k/k!$ yields $(k-1)/k!$ throughout $k\ge1$, including 0 at $k=1$. |
| d | F | At $k=1$, the left side is 0 but the proposed right side $(k+1)/k!$ is 2. |

### q12

Independent solution: the numerator is $p!$, so division by $(p-2)!$
leaves $p(p-1)$ for every integer $p\ge4$. At $p=4$ the value is 12;
at $p=5$ it is 20.
Complete true set: `{c}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | Keeps an extra factor $p-2$. At $p=4$, it is $4\cdot3\cdot2=24$, not 12. |
| b | F | Keeps an extra factor $p-3$. It coincides at $p=4$, but at $p=5$ gives $5\cdot4\cdot2=40$, not 20. |
| c | T | Cancels $(p-2)(p-3)(p-4)!$ exactly, leaving $p(p-1)$ throughout the original domain. |
| d | F | Replacing the factorial quotient by a fixed division by 2 is only accidentally correct at $p=4$. At $p=5$, it gives $5\cdot4\cdot3\cdot2/2=60$, not 20. |

### q13

Independent solution: a product of $k$ descending factors equals
$m!/(m-k)!$, so dividing by $m!$ gives $1/(m-k)!$. This includes $k=0$,
when the result is $1/m!$, and $m=k$, when it is $1/0!=1$; at $m=k=0$
the same value 1 applies.
Complete true set: `{a}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | T | Gives the exact quotient $1/(m-k)!$ and retains all empty-product and zero-factorial cases specified in the view. |
| b | F | Inverts the result. At $m=3,k=1$, the original quotient is $3/6=1/2$, whereas $(m-k)!=2$. |
| c | F | Keeps one extra factorial factor in the denominator. At $m=3,k=1$, it gives $1/3!=1/6$, not $1/2$. |
| d | F | At $m=3,k=1$, it gives $1!/3!=1/6$, not $1/2$. It does match the cases $k=0$ and $m=k$, but those cases do not prove identity over the full domain. |

### q14

Independent solution: the count is $t!$, including $0!=1$.
$5!=120$, $6!=720$, and $7!=5040$ locate the thresholds. The two complete
ranges are $t\in\{0,1,2,3,4,5,6\}$ and $t\ge6$.
Complete true set: `{b}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | Excludes $t=6$ from both ranges even though $6!=720$ satisfies both $720\le1000$ and $720\ge500$. |
| b | T | Gives every nonnegative cardinality up to 6 for the first condition, and every cardinality from 6 upward for the second. |
| c | F | Includes $t=7$ in the first range even though $5040>1000$, and includes $t=5$ in the second even though $120<500$. |
| d | F | The value 6 satisfies both conditions but is not either complete range. For example, $t=0$ also satisfies the first, and $t=7$ also satisfies the second. |

### q15

Independent solution: an ordered list of nine distinct names has
$9\cdot8\cdots1=9!=362880$ arrangements.
Complete true set: `{d}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | The arithmetic $9^9=387420489$ is correct, but independent repeated choices include lists with duplicated or omitted students. |
| b | F | $9\cdot8=72$ counts only ordered choices for the first two positions, not complete lists of all nine names. |
| c | F | $8!=40320$ is too small by a factor 9 and would fix one student's position without authorization. |
| d | T | $9!=362880$ is the complete nine-position permutation count. |

### q16

Independent solution: choose among 14 attendants for the first distinct
carriage, then 13 for the next, down to 1. The bijection count is
$14!=87178291200$; no permutation of carriage positions is identified with
another.
Complete true set: `{b}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | $13!=6227020800$ omits the factor 14 for the first carriage's choice. |
| b | T | $14!=87178291200$ counts all bijections between the distinct attendants and distinct carriages. |
| c | F | $14^{14}=11112006825558016$ is arithmetically correct but permits repeated assignment choices, leaving attendants or carriages improperly reused. |
| d | F | $14!/(2!)^7=681080400$ is arithmetically correct but divides by seven unauthorized pair-swap symmetries. Exchanging two attendants between position-distinct carriages changes the assignment. |

### q17

Independent solution: the leading digit has choices 1, 2, or 3, followed
by $3!$ orders of the remaining digits. Hence $3\cdot3!=18$.
Equivalently, subtract all six zero-leading strings from $4!=24$.
Complete true set: `{a}`. Mathematics: PASS.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | T | Gives $3\cdot3!=18$, with zero still allowed in the last three places. |
| b | F | 24 includes all digit permutations, including the six strings that begin with zero and are not four-digit numbers. |
| c | F | $24-1=23$ would discard only one string; six, not one, have leading zero. |
| d | F | 6 counts only one fixed leading-digit group, not all three allowed groups of six. |

### q18

Independent solution: there are $5!=120$ numbers. Fixing first digit 3
leaves $4!=24$. Avoiding first digit 5 gives $120-24=96$. Fixing the ordered
prefix 54 leaves $3!=6$. Avoiding the ordered prefix 543 excludes only
`54312,54321`, giving $120-2=118$.
Complete true set: `{c}`. Mathematics: PASS; fidelity/leakage remain REVISE.

| Option | Truth | Evidence |
| --- | --- | --- |
| a | F | The first three counts are correct, but 114 subtracts 6 instead of the two prohibited-prefix numbers. For example, `54123` does not start with 543 and must remain counted. |
| b | F | The first and third counts are correct. The second 24 counts numbers starting with 5 rather than their complement 96; the fourth 2 counts numbers starting with 543 rather than their complement 118. |
| c | T | Gives the exact ordered tuple $(24,96,6,118)$. |
| d | F | The first two counts are correct, but the fixed ordered prefix 54 leaves 6 orders, not 12, and the final complement is 118, not $120-12=108$. |

## Frozen Complete True Sets

These are independent visible-question results, not copied author keys.

| Question | Visible mode | Complete true set | Mathematics |
| --- | --- | --- | --- |
| q01 | single | `{c}` | PASS |
| q02 | single | `{b}` | PASS |
| q03 | single | `{d}` | PASS |
| q04 | multiple | `{a,c}` | PASS |
| q05 | single | `{a}` | PASS |
| q06 | single | `{c}` | PASS |
| q07 | single | `{b}` | PASS |
| q08 | single | `{d}` | PASS |
| q09 | single | `{c}` | PASS |
| q10 | single | `{a,b}` under the positive-only branch instruction; `{a}` if zero or both branches must be checked | REVISE: unresolved visible scope for `single` |
| q11 | multiple | `{b,c}` | PASS |
| q12 | single | `{c}` | PASS |
| q13 | single | `{a}` | PASS |
| q14 | single | `{b}` | PASS |
| q15 | single | `{d}` | PASS |
| q16 | single | `{b}` | PASS |
| q17 | single | `{a}` | PASS |
| q18 | single | `{c}` | PASS, separately REVISE for fidelity/leakage |

All 72 options have an explicit truth judgment and concrete evidence above.
For q10(b), the scope-dependent judgment is itself the finding; no guessed
unconditional singleton has been frozen.

## Findings for Later Internal Comparison

1. q10: REVISE. The stated positive-natural branch instruction permits
   accepting both a and b, despite `single`. Their adopted positive branches
   are identical for every permitted positive integer. Require both-case
   validity explicitly, or fix a zero-inclusive domain, so that the incorrect
   zero value is actually within the question's truth scope.
2. q18: REVISE for task fidelity and answer leakage, not for numeric truth.
   All four alternatives supply the first requested answer 24. This removes
   mathematical judgment of the original starts-with-3 count and supplies
   a count usable in the later complements. Make that relationship
   discriminate meaningfully, or expose it as a separate mathematical task.
3. q01/q02 and q04: nonblocking capacity losses must be retained in the later
   internal record. These are complete-list recognition and proof recognition,
   not evidence of independent enumeration or independent proof writing.
   q01 also presents its trivial singleton answer without discriminating it.

No other definite fidelity, redundancy, leakage, or option-mathematics defect
was found in these visible questions. No external missing information is
needed to explain the two revision findings. Undisclosed author reasoning
cannot silently repair learner-visible wording or an invariant response
coordinate.

## Verification and Boundary

Local standard-library checks compared every candidate permutation list
with the frozen lists, without regenerating or editing the source solution.
They confirmed the omissions and duplicates in q01/q02 and the invariant
first coordinate in q18. Arithmetic cross-checks confirmed the displayed
large values in q05/q06/q15/q16 and the numerical counterexamples in
q04/q10/q12/q13. Positive-integer and zero-inclusive samples for q10 agreed
with the separate algebraically justified scopes recorded above; finite
samples were not substituted for universal proofs.

Only this new `reviewer/view-first.md` was written. The source freezes,
answers, interactions, views, and all other work/staging were left intact.
No official review JSON, draft digest, author-key comparison, misconception
approval, or full internal coverage approval is issued here.

Status: READY FOR LATER INTERNAL COMPARISON, WITH q10 AND q18 REVISE FINDINGS.
The full draft snapshot remains undisclosed. Keep this view-bound freeze
and its findings when the later comparison is authorized; do not replace
them with a key-conforming guess or repeat successful unchanged reviews.
