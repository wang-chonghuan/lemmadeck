# N4 Independent Source Solutions: Phase A

Date: 2026-11-23.
Ticket: STEMROBIN-184.
Role: sole independent SOURCE SOLVER / eventual mathematics and choice REVIEWER for N4.
Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Input and Independence

The only mathematical input read was the official seed
`.tmp/stemrobin-184-six/n4-nov23-source2324/seed.json`, containing book `9c`,
lesson `ana9-c2-s1-n4`, written exercises 32 through 42, and definition blocks
6, 10, 11, 12. There are no source figures or concept figures; all exercise
`figure_ids` lists are empty. No image or browser inspection was needed.

Seed byte SHA-256:
`a28990023a2188c156a3c3d119b6c9ca769a495a489e563ec9c23456e96cfbb4`.

Seed canonical JSON SHA-256:
`86765d0a31800ee80c4be273f383dd6b7106c319bdb833066fd4384e8de48efc`.

The canonical digest uses the contract's
`json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))`,
encoded as UTF-8. These hashes bind this record to the received seed; they are
not a claim that the seed was refreshed from other files. The seed's trace
entries were not followed to source files containing other material.

The skill, `references/review.md`, `references/contract.md`, and repository
entry/engineering instructions were read for procedural boundaries. No
`author/` material, draft, previous choices, answers, interactions, saved answer
keys, answer templates, author reasoning, correct sets, or thread history was
opened. All source tasks below were independently solved before exposure to
any candidate question. No candidate review verdict is issued in Phase A.

## Definitions and Conventions

Definition 6 gives $P_n=nP_{n-1}$ for positive integer $n$. Definitions 10 and
11 give $P_n=1\cdot2\cdots n=n!$ for positive $n$. Definition 12 explicitly
sets $P_0=1$: the empty set has exactly one ordering, the empty ordering.

Accordingly, $0!=1$ and a product with zero factors is $1$. Factorials here
have nonnegative integer arguments only; no negative factorial or Gamma
extension is used. Since a factorial is a positive integer, cancellation of
a factorial denominator is valid on its stated domain.

A full permutation uses each distinct element exactly once. Choosing an
element for the first position leaves a permutation of the remaining
elements, giving $n$ disjoint groups of $P_{n-1}$ arrangements and hence the
recurrence. Positions are ordered and distinguishable; this is not selection
of a subset, circular seating, or identification under reversal.

Cardinality is always a nonnegative integer. In particular, exercise 38
includes cardinality zero, consistently with the selected definition $P_0=1$.
That must not be confused with the convention for the symbol $N$ in exercise
36(d). For $k\in N$ there, use the positive-natural convention
$N=\{1,2,\ldots\}$, consistent with the displayed product starting at $1$.
If a later question explicitly uses zero-inclusive $N$, its $k=0$ case must
be treated separately as recorded below. Other factorial expressions have
their precise domains stated individually, including valid zero cases.

## Source 32: Enumerate Every Full Permutation

### 32(a): $A=\{1\}$

The sole permutation is $(1)$. There is one element to place and one
available position, so the count is $1!=1$.

### 32(b): $A=\{7,8\}$

The complete list is

$$
(7,8),\quad (8,7).
$$

The first position has two choices, and the remaining position is then
forced. Both arrangements are present exactly once: $2!=2$.

### 32(c): $A=\{a,b,c\}$

The complete list, grouped by first element, is

$$
\begin{aligned}
&(a,b,c),\ (a,c,b);\\
&(b,a,c),\ (b,c,a);\\
&(c,a,b),\ (c,b,a).
\end{aligned}
$$

For each of the three first-element choices the last two elements have two
orders, so there are $3\cdot2\cdot1=3!=6$ permutations.

### 32(d): $A=\{m,n,p,q\}$

The complete list of 24 permutations is

$$
\begin{aligned}
&(m,n,p,q),\ (m,n,q,p),\ (m,p,n,q),\\
&(m,p,q,n),\ (m,q,n,p),\ (m,q,p,n);\\[2pt]
&(n,m,p,q),\ (n,m,q,p),\ (n,p,m,q),\\
&(n,p,q,m),\ (n,q,m,p),\ (n,q,p,m);\\[2pt]
&(p,m,n,q),\ (p,m,q,n),\ (p,n,m,q),\\
&(p,n,q,m),\ (p,q,m,n),\ (p,q,n,m);\\[2pt]
&(q,m,n,p),\ (q,m,p,n),\ (q,n,m,p),\\
&(q,n,p,m),\ (q,p,m,n),\ (q,p,n,m).
\end{aligned}
$$

For completeness, fix the first element. Each of the three possible second
elements occurs in exactly two tuples, with the remaining two elements in
both possible orders. Thus each first-element group has
$3\cdot2=6$ distinct permutations. The four groups are disjoint and exhaust
all first-element choices, giving $4\cdot6=4!=24$. No tuple repeats an element,
and no two tuples are equal. Merely giving the count 24 would not fulfill the
source's instruction to form all permutations.

## Source 33: Horizontal Tricolor Flags

Interpret the flag as three horizontal bands, one of each supplied color,
with ordered positions from top to bottom. A flag has a specified top and
bottom; reversing the band order gives a different flag, not the same object.

Writing $R$, $B$, $W$ for red, blue, white, the complete orders are

$$
(R,B,W),\ (R,W,B),\ (B,R,W),\ (B,W,R),\ (W,R,B),\ (W,B,R).
$$

There are three choices for the top band, two for the middle, and one for the
bottom. Hence there are $3\cdot2\cdot1=6$ different tricolor flags. Repetition
of a color or identification under rotation/reversal is not part of this
three-distinct-color permutation task.

## Source 34: Prove the Factorial Identities

Let $m,n$ be integers with $0\le m<n$. The given $n>m$ condition is relevant
to part (b); part (a) itself only needs $m\ge0$.

### 34(a)

Expanding the numerator down to $m!$ gives

$$
(m+3)!=(m+3)(m+2)(m+1)m!.
$$

Since $m!>0$,

$$
\frac{(m+3)!}{m!}
=\frac{(m+3)(m+2)(m+1)m!}{m!}
=(m+3)(m+2)(m+1)
=(m+1)(m+2)(m+3).
$$

Thus the asserted formula follows by multiplication and cancellation, not
by canceling factorial symbols or subtracting their arguments. At $m=0$,
the two sides are $3!/0!=6$ and $1\cdot2\cdot3=6$.

### 34(b)

For $1\le m<n$, separating the first $m$ descending factors yields

$$
n!=n(n-1)\cdots(n-m+1)(n-m)!.
$$

The final uncanceled factor is $n-m+1$, not $n-m$. Dividing by the positive
factorial $(n-m)!$ therefore gives

$$
\frac{n!}{(n-m)!}
=\frac{n(n-1)\cdots(n-m+1)(n-m)!}{(n-m)!}
=n(n-1)\cdots(n-m+2)(n-m+1).
$$

There are exactly $n-(n-m+1)+1=m$ surviving factors. A precise expression
that also covers the short cases is

$$
\frac{n!}{(n-m)!}=\prod_{j=0}^{m-1}(n-j).
$$

When $m=1$, this product has just the factor $n$; the ellipsis is not an
instruction to duplicate endpoints. When $m=0$, the original quotient is
$n!/n!=1$, and the product is empty, also $1$. Although the source assumes
$n>m$, the same cancellation identity extends to $n=m\ge0$, where the
denominator is $0!=1$.

## Source 35: Evaluate the Expressions

### 35(a)

Since $9!=9\cdot8!$,

$$
8!+9!=(1+9)8!=10\cdot40320=403200.
$$

Equivalently, $40320+362880=403200$.

### 35(b)

Since $11!=11\cdot10!$,

$$
10!-11!=(1-11)10!=-10\cdot3628800=-36288000.
$$

The result is negative because the second factorial is larger:
$3628800-39916800=-36288000$.

### 35(c)

$$
\frac{102!}{100!}
=\frac{102\cdot101\cdot100!}{100!}
=102\cdot101=10302.
$$

### 35(d)

Use $120=5!$ and $6!=6\cdot5!$:

$$
\frac{6!-5!}{120}
=\frac{(6-1)5!}{5!}
=5.
$$

Directly, $(720-120)/120=600/120=5$.

## Source 36: Simplify with the Original Domains

### 36(a)

For integer $n\ge1$,

$$
\frac{n!}{(n-1)!}
=\frac{n(n-1)!}{(n-1)!}=n.
$$

The original expression is undefined at $n=0$, even though the simplified
polynomial could be evaluated there.

### 36(b)

For integer $n\ge2$,

$$
\frac{(n-2)!}{n!}
=\frac{(n-2)!}{n(n-1)(n-2)!}
=\frac{1}{n(n-1)}.
$$

At the valid lower endpoint $n=2$, this is $0!/2!=1/2$.

### 36(c)

For integer $n\ge3$,

$$
\frac{(n-1)!}{(n-3)!}
=\frac{(n-1)(n-2)(n-3)!}{(n-3)!}
=(n-1)(n-2).
$$

At $n=3$, the quotient is $2!/0!=2$.

### 36(d)

For positive integer $k$, expansion of the denominator gives

$$
(2k)!=2k(2k-1)(2k-2)!,
$$

and $2k(2k-1)\ne0$. Consequently,

$$
\frac{2k(2k-1)}{(2k)!}
=\frac{2k(2k-1)}{2k(2k-1)(2k-2)!}
=\frac{1}{(2k-2)!}.
$$

For $k=1$, both sides equal $1$ because $0!=1$.

If zero is explicitly admitted to the domain in a later view, the original
expression at $k=0$ is $0\cdot(-1)/0!=0$. The displayed simplified factorial
expression is then undefined because it would contain $(-2)!$. Thus the
formula requires $k\ge1$; under a zero-inclusive convention the complete
answer is piecewise: $0$ at $k=0$, and $1/(2k-2)!$ for $k\ge1$.

## Source 37: Compute the Expressions

### 37(a)

For integer $n\ge0$, use $(n+1)!=(n+1)n!$ to obtain a common denominator:

$$
\frac{1}{n!}-\frac{1}{(n+1)!}
=\frac{n+1}{(n+1)!}-\frac{1}{(n+1)!}
=\frac{n}{(n+1)!}.
$$

At $n=0$, both the original difference $1/0!-1/1!$ and the result equal $0$.

### 37(b)

For integer $k\ge1$, use $k!=k(k-1)!$:

$$
\frac{1}{(k-1)!}-\frac{1}{k!}
=\frac{k}{k!}-\frac{1}{k!}
=\frac{k-1}{k!}.
$$

At $k=1$, this is $1/0!-1/1!=0$. The case $k=0$ is not in the original
domain, since $(k-1)!$ would be $(-1)!$.

### 37(c)

For integer $p\ge4$, the numerator is exactly $p!$:

$$
p(p-1)(p-2)(p-3)(p-4)!=p!.
$$

Therefore

$$
\frac{p(p-1)(p-2)(p-3)(p-4)!}{(p-2)!}
=\frac{p!}{(p-2)!}
=p(p-1).
$$

Equivalently, expanding $(p-2)!=(p-2)(p-3)(p-4)!$ exhibits the canceled
factors directly. At $p=4$, the result is $4\cdot3=12$, and the original
expression is $24/2=12$.

### 37(d)

The numerator is a product of exactly $k$ consecutive descending factors,
ending at $m-(k-1)=m-k+1$. For integers $m\ge k\ge1$,

$$
m!=\bigl[m(m-1)\cdots(m-k+1)\bigr](m-k)!.
$$

It follows that

$$
\frac{m(m-1)\cdots(m-(k-1))}{m!}
=\frac{m!/(m-k)!}{m!}
=\frac{1}{(m-k)!}.
$$

When $m=k$, the numerator is $m!$, so the quotient is $1=1/0!$.
If $k=0$ is admitted, interpret the numerator as the empty product:
the quotient is $1/m!$, again the same formula. In particular, $m=k=0$
gives $1/0!=1$. These zero cases require the product interpretation, not a
literal reading of the printed ellipsis as an extra factor.

## Source 38: Solve Both Cardinality Inequalities

Let $r=|A|\in\{0,1,2,\ldots\}$. The complete permutation count is $P_r=r!$.
The relevant factorial values are

$$
0!=1,\quad1!=1,\quad2!=2,\quad3!=6,\quad4!=24,\quad
5!=120,\quad6!=720,\quad7!=5040.
$$

The sequence is nondecreasing starting at $r=0$, and strictly increasing
from $r=1$ onward: $(r+1)!=(r+1)r!>r!$ for $r\ge1$.

### 38(a): Not Greater Than 1000

Since $6!=720\le1000$ whereas $7!=5040>1000$, the complete set of allowable
cardinalities is

$$
r\in\{0,1,2,3,4,5,6\},\qquad\text{equivalently }0\le r\le6.
$$

All these cardinalities satisfy the inequality, and monotonicity excludes
every larger one. The maximum is 6, but the source inequality is not merely
a request for that single maximum. The empty set qualifies because $P_0=1$.
Excluding zero silently would conflict with selected definition 12.

### 38(b): Not Less Than 500

Since $5!=120<500$ and $6!=720\ge500$, the complete set of allowable
cardinalities is

$$
r\in\{6,7,8,\ldots\},\qquad\text{equivalently }r\ge6.
$$

All smaller cardinalities, including zero, fail; all larger ones qualify.
The minimum is 6, with no upper bound. Neither inequality has a factorial
value exactly at its threshold, but its inclusive direction must still be
preserved.

## Source 39: Lists of Nine Students

The nine students are distinct individuals, and the list has nine ordered
positions. Choose the first student in 9 ways, the second among the remaining
8, and continue until the last is forced:

$$
9\cdot8\cdot7\cdot6\cdot5\cdot4\cdot3\cdot2\cdot1
=9!=362880.
$$

Every ordering is produced once, so there are 362880 possible lists. This
counts orderings of all students, not a choice of one student or a subset.

## Source 40: Assign Fourteen Attendants to Fourteen Carriages

The 14 attendants are distinct, and the 14 carriages are distinguished by
their positions in the train. Exactly one attendant per carriage makes an
assignment a bijection from attendants to carriages.

Assign an attendant to the first carriage in 14 ways, then to the second in
13 ways, and so on. Hence the count is

$$
14\cdot13\cdots2\cdot1=14!=87178291200.
$$

As an arithmetic expansion, $14!=14\cdot13\cdot12\cdot11\cdot10!$
$=14\cdot13\cdot12\cdot11\cdot3628800=87178291200$.
There is no additional division: switching two attendants between distinct
carriages produces a different assignment. Independent choices such as
$14^{14}$ would violate the one-attendant-per-carriage requirement.

## Source 41: Four-Digit Numbers from 0, 1, 2, 3

Four digits chosen without repetition from these four available digits use
all four exactly once. A four-digit number cannot start with zero.

The thousands digit has three choices, $1$, $2$, or $3$. After that choice,
the other three digits, including zero, can occupy the remaining positions
in $3!=6$ orders. Thus there are

$$
3\cdot3!=3\cdot6=18
$$

valid four-digit numbers.

An independent complement count starts with all $4!=24$ digit permutations.
Exactly $3!=6$ begin with zero; they are not four-digit numbers. Subtracting
them gives $24-6=18$. Zero is permitted in any of the final three positions.

The valid numbers, grouped by first digit, are

$$
\begin{aligned}
&1023,\ 1032,\ 1203,\ 1230,\ 1302,\ 1320;\\
&2013,\ 2031,\ 2103,\ 2130,\ 2301,\ 2310;\\
&3012,\ 3021,\ 3102,\ 3120,\ 3201,\ 3210.
\end{aligned}
$$

## Source 42: Five-Digit Numbers from 1, 2, 3, 4, 5

Every number uses the five distinct digits exactly once. There is no
leading-zero restriction because zero is absent, so the full sample space
has $5!=120$ numbers. A specified prefix fixes its ordered positions, not
just a subset of digits.

### 42(a): Starts with 3

Fix the first digit as 3. The remaining four distinct digits occupy the four
remaining positions in $4!$ ways:

$$
1\cdot4!=24.
$$

### 42(b): Does Not Start with 5

There are four allowed first digits, $1,2,3,4$, and $4!$ completions for
each, so the answer is

$$
4\cdot4!=4\cdot24=96.
$$

Equivalently, exactly $4!=24$ of the 120 numbers start with 5, giving
$5!-4!=120-24=96$. The digit 5 is still used elsewhere.

### 42(c): Starts with 54

Fix the first two positions as 5, then 4. The remaining digits $1,2,3$ have
$3!=6$ orders, so the answer is 6. The complete qualifying numbers are

$$
54123,\ 54132,\ 54213,\ 54231,\ 54312,\ 54321.
$$

### 42(d): Does Not Start with 543

There are $2!=2$ numbers with the prohibited three-digit prefix: $54312$
and $54321$. Taking the complement in the full set of 120 numbers gives

$$
5!-2!=120-2=118.
$$

A disjoint count verifies the complement: 96 numbers do not start with 5;
another $3\cdot3!=18$ start with 5 but have second digit $1,2,$ or $3$;
another $2\cdot2!=4$ start with 54 but have third digit 1 or 2.
Thus $96+18+4=118$.

"Does not start with 543" negates the entire conjunction of the first three
digits being 5, 4, 3. It does not require all three individual positions to
avoid those digits. For example, $54123$ and $53412$ qualify even though
their first digit is 5.

## Verification and Phase Boundary

All 11 selected sources, comprising 24 lettered subparts and four unlettered
tasks (28 tasks total), are solved above:
32(a-d), 34(a-b), 35(a-d), 36(a-d), 37(a-d), 38(a-b), 42(a-d), plus the
unlettered sources 33, 39, 40, 41. No source task is deferred.

After deriving the solutions, a local standard-library calculation
cross-checked the numerical values in 35, the factorial thresholds in 38,
and the counts in 39 and 40. An independent `itertools.permutations`
enumeration also agreed with the 24 tuples in 32(d). These checks used no
external service, repository answer file, or author material.

This is a source-solving record only. Task fidelity, redundancy, answer
leakage, candidate option truth sets, source-to-question coverage, and
comparison with author internals remain unassessed because no candidate
view or internal draft has been supplied. Phase B must first provide only
learner-facing question views; their fidelity and independent option
solutions must be settled before author keys or reasoning are disclosed.

Status: READY FOR PHASE B.
