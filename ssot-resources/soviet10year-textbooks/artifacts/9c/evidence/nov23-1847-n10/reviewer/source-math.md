# N10 independent source mathematics

Scope: `ana9-c2-s3-n10`, STEMROBIN-184, 2026-11-23. This calculation was written only after the three originals' literal objects and physical wrapping were frozen in [source-first.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-first.md). References below use that report's independent locators. No candidate, author template, old answer key, or choice key was used. N11 is excluded.

## Counting framework and reused entry

For a nonempty finite sample space $\Omega$ of mutually exclusive, exhaustive, equally likely elementary outcomes,

$$P(A)=\frac{|A|}{|\Omega|}.$$

Different outcomes must identify individual balls/cards/books or ordered die values where applicable. Colors, prices, and dice sums are events or categories, not automatically equally likely elementary outcomes.

The caller's already-reviewed p42 / printed p35 entry is reused without reopening. Its die-outcome context admits the usual six-outcome model $\{1,2,3,4,5,6\}$ with probability $1/6$ per outcome under equiprobability. This is a mathematical model of the supplied entry context, not a fresh literal transcription or a claim about unseen p42 exercises.

Physical similarity alone does not mathematically prove a fair selection mechanism. When a source says random extraction without giving individual weights, the finite equiprobable selection model is the intended interpretation needed for its numerical calculation. This report makes those assumptions explicit without inserting them into the literal original or adding a publication requirement.

## Example 1: colored balls

Source: p43:L01-L09.

Literal givens: ten balls of the same size and shape, 3 white, 2 black, 5 red; one ball randomly drawn. The original explicitly treats the ten individual-ball outcomes as equally possible and prints $5/10=1/2$ and $8/10=4/5$.

Independent derivation:

- Label the individual balls $W_1,W_2,W_3,B_1,B_2,R_1,\ldots,R_5$. These ten labels, not three color names, form $\Omega$.
- For subpart а), the event is $\{R_1,\ldots,R_5\}$, so $P(\text{red})=5/10=1/2$.
- For subpart б), the event consists of the three white and five red balls, so $P(\text{not black})=8/10=4/5$. Equivalently, $1-P(\text{black})=1-2/10=4/5$.

Assumption/domain: every individual ball is equally likely to be selected. No replacement or independence assumption is needed for a single draw. The three listed colors exhaust the ten balls. Both independent results agree with the printed work.

## Example 2: three selected segments

Source: p43:L10-L24.

Literal givens: the five segment lengths are 1, 3, 5, 7, 9 cm; choose three randomly. The original uses $C_5^3=10$, sorts $a\leq b\leq c$, applies the strict condition $c-b<a$, and prints probability $3/10$.

Assumption/sample space: select three distinct segments without replacement, uniformly over the ten unordered subsets. Segment order is irrelevant to forming a triangle. An ordered-draw model would give $5\cdot4\cdot3=60$ outcomes and six orders for each subset, giving the same probability.

Domain: positive lengths and a nondegenerate Euclidean triangle. For sorted positive $a\leq b\leq c$, the only restrictive triangle inequality is $a+b>c$, equivalent to the source's $c-b<a$. Equality would be degenerate and is not a success.

Independent complete enumeration:

| Selected lengths | Check $a+b>c$ | Triangle? |
| --- | --- | --- |
| 1, 3, 5 | $4<5$ | No |
| 1, 3, 7 | $4<7$ | No |
| 1, 3, 9 | $4<9$ | No |
| 1, 5, 7 | $6<7$ | No |
| 1, 5, 9 | $6<9$ | No |
| 1, 7, 9 | $8<9$ | No |
| 3, 5, 7 | $8>7$ | Yes |
| 3, 5, 9 | $8<9$ | No |
| 3, 7, 9 | $10>9$ | Yes |
| 5, 7, 9 | $12>9$ | Yes |

There are three successes out of ten, hence $P=3/10$.

The shortest-length partition independently gives six selections with minimum 1, three with minimum 3, and one with minimum 5. Two distinct larger odd lengths differ by at least 2, so none with minimum 1 works. With minimum 3, exactly (3,5,7) and (3,7,9) work; with minimum 5, (5,7,9) works. This agrees with the source, including its $C_4^2=6$ count. The assertion about odd differences is used only for the source's distinct lengths, not for arbitrary potentially equal odd numbers.

## Example 3: sum of two dice

Source: p44:L01-L14 and p44:T2-T7; p45:L01 confirms the next page starts exercises rather than a table continuation.

Literal premise: all 36 two-die outcomes are equally probable. Literal request: probabilities for every sum from 2 to 12. The original prose explicitly works sum 8, while its visible table prints sums 2 through 7 only.

Independent sample space:

$$\Omega=\{(i,j):i,j\in\{1,2,3,4,5,6\}\},\qquad|\Omega|=36.$$

The first and second dice remain distinguishable. Each ordered pair has probability $1/36$ by the explicit joint premise. Independent fair dice are a sufficient model, but are not an extra premise needed once joint equiprobability is given. Equal marginal probabilities alone would not justify the 36 equiprobable pairs. The eleven possible sums are not equiprobable.

For $S=i+j$, count pairs with the required sum:

$$
n(s)=
\begin{cases}
s-1,&2\leq s\leq7,\\
13-s,&8\leq s\leq12.
\end{cases}
\qquad P(S=s)=\frac{n(s)}{36}.
$$

| Sum | Independently enumerated ordered pairs | Count | Probability | Literal source coverage |
| --- | --- | --- | --- | --- |
| 2 | (1,1) | 1 | $1/36$ | p44:T2 prints row and value |
| 3 | (1,2), (2,1) | 2 | $2/36=1/18$ | p44:T3 prints row and value |
| 4 | (1,3), (2,2), (3,1) | 3 | $3/36=1/12$ | p44:T4 prints row and value |
| 5 | (1,4), (2,3), (3,2), (4,1) | 4 | $4/36=1/9$ | p44:T5 prints row and value |
| 6 | (1,5), (2,4), (3,3), (4,2), (5,1) | 5 | $5/36$ | p44:T6 prints row and value |
| 7 | (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) | 6 | $6/36=1/6$ | p44:T7 prints row and value |
| 8 | (2,6), (3,5), (4,4), (5,3), (6,2) | 5 | $5/36$ | p44:L09-L13 prints these pairs in reverse listing order and this value |
| 9 | (3,6), (4,5), (5,4), (6,3) | 4 | $4/36=1/9$ | Requested at p44:L02; no printed result in the opened originals |
| 10 | (4,6), (5,5), (6,4) | 3 | $3/36=1/12$ | Requested at p44:L03; no printed result in the opened originals |
| 11 | (5,6), (6,5) | 2 | $2/36=1/18$ | Requested at p44:L03; no printed result in the opened originals |
| 12 | (6,6) | 1 | $1/36$ | Requested at p44:L03; no printed result in the opened originals |

The counts sum to $1+2+3+4+5+6+5+4+3+2+1=36$, and symmetry gives $P(S=s)=P(S=14-s)$. These are independent checks, not extra printed rows. Every result actually printed for sums 2 through 8 agrees with the independent derivation. Results for 9 through 12 are derived answers, never literal source table objects.

## Exercise 74: six letter cards

Source: p45:L02-L04. Literal inventory: six different letter labels on otherwise identical cards; random arrangement in one row; target `МОСКВА`.

Assumption/sample space: all $6!$ permutations of the six distinct cards are equally likely. The target uses each given letter exactly once. Physical similarity supports the intended randomization model but does not itself prove uniform permutations.

Independent derivation: there are $6!=720$ possible orders and exactly one target order, so

$$P=\frac{1}{6!}=\frac{1}{720}.$$

Whether a lookalike letter is encoded as Latin or Cyrillic does not change the six distinct visible labels or this counting argument.

## Exercise 75: two sequential balls in increasing order

Source: p45:L05-L07. Literal inventory: balls numbered 1 through 5; take two one after another; require increasing order.

Assumption/sample space: the first removed ball is not returned, and each remaining ball is equally likely at the next draw. This interprets extraction, not a printed replacement instruction. Then $\Omega=\{(i,j):1\leq i,j\leq5,\ i\ne j\}$ has $5\cdot4=20$ equally likely ordered outcomes.

Independent favorable outcomes:

```text
(1,2), (1,3), (1,4), (1,5),
(2,3), (2,4), (2,5),
(3,4), (3,5),
(4,5).
```

Exactly $C_5^2=10$ of the twenty outcomes satisfy $i<j$, hence $P=10/20=1/2$. Each unordered pair has one increasing and one decreasing order. Increasing means any strict increase, not necessarily consecutive labels.

## Exercise 76: all five balls in increasing order

Source: p45:L08-L10. Literal inventory: the same five number labels; extract all balls one after another; increasing order.

Assumption/sample space: successive uniform choices among the remaining balls, without replacement. Each of the $5!=120$ permutations has probability $1/5\cdot1/4\cdot1/3\cdot1/2\cdot1=1/120$.

Only the order $(1,2,3,4,5)$ satisfies the request, so $P=1/120$.

## Exercise 77: four balls all odd

Source: p45:L11-L13. Literal inventory: five distinct balls numbered 1 through 5, take four at once.

Domain/sample space: a four-element subset of the five balls; there are $C_5^4=5$ such subsets under the uniform-selection model. The only odd labels are 1, 3, 5, so no selection of four distinct balls can be entirely odd.

The favorable set is empty and $P=0$. This zero does not require uniform selection: it holds for any probability distribution supported on four distinct balls from this inventory. Modeling four draws with replacement would change the experiment and is not the source request.

## Exercise 78: two books worth five rubles

Source: p45:L14-L16. Literal inventory: ten different books, five priced 4 rubles, two priced 3, three priced 1; select two distinct books.

Assumption/sample space: a uniform unordered pair from the ten individually distinct books, without replacement; $|\Omega|=C_{10}^2=45$. Repeated prices do not make the books identical outcomes.

A total of 5 rubles can only come from one 4-ruble book and one 1-ruble book. There is no 2-ruble book to pair with a 3-ruble book. Favorable pairs number $5\cdot3=15$, giving

$$P=\frac{15}{45}=\frac{1}{3}.$$

An ordered extraction interpretation instead gives 90 outcomes and 30 successes, with the same result.

## Exercise 79: irreducible fraction

Source: p45:L17-L19. Literal number inventory: $\{2,4,6,7,8,11,12,13\}$; take two distinct cards.

Assumption/sample space: uniform unordered pairs, without replacement; $|\Omega|=C_8^2=28$. All values are positive integers and denominators cannot be zero. A fraction is irreducible exactly when its numerator and denominator have gcd 1.

The original does not choose numerator orientation. Since $\gcd(a,b)=\gcd(b,a)$, either orientation gives the same event; an ordered model gives 56 outcomes and the same probability.

Independent count:

- Five values are even: 2, 4, 6, 8, 12. Every even-even pair is reducible, yielding $C_5^2=10$ failures.
- The three odd values 7, 11, 13 are distinct primes. None divides any of the five even values in this particular inventory, so all $3\cdot5=15$ odd-even pairs are coprime.
- All $C_3^2=3$ odd-odd pairs are coprime.

There are $15+3=18$ successes, hence

$$P=\frac{18}{28}=\frac{9}{14}.$$

This uses the actual odd-prime inventory, not the false general rule that every odd-even pair is coprime.

## Verification and stopping point

A single local, dependency-free `node -e` enumeration, run after source freeze, checked the ten length subsets, all 36 ordered die pairs, all card/ball permutations and subsets, individual book pairs, and the 28 numerical-card pairs. It completed with exit code 0; assertions confirmed triangle successes 3, dice counts `1,2,3,4,5,6,5,4,3,2,1`, and Exercise 74-79 favorable/total counts `1/720, 10/20, 1/120, 0/5, 15/45, 18/28`. The enumeration performed no file reads or writes, network calls, dependency operations, DB access, or Git operations.

All N10 requests visible in scope have independent solutions: two Example 1 subparts, Example 2, eleven Example 3 sums, and Exercises 74 through 79. No mathematical discrepancy was found in the printed N10 computations inspected here. Source-only ambiguities and physical boundaries remain localized in `source-first.md`.

Image opens remain **3**. No N11 math or candidate comparison has been undertaken. Stop here; any later candidate comparison is a separate request.
