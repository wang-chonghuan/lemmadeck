# N4 independent source-first solving

Input: only `../seed.json`, including its selected concept blocks 6, 10, 11
and 12. No answer material, choices, interaction configuration, previous tests
or source solution was consulted. This record is frozen before constructing
any candidate options.

## Conventions and scope

The selected definitions give P_n = n! and explicitly P_0 = 1. Accordingly
factorials are evaluated at nonnegative integers, with 0! = 1. Every expression
below keeps the printed formula; cancellation never replaces the source by a
different numerator or denominator. A descending product with k factors has
value 1 when k = 0. This convention also explains the m = k boundary.

The supplied prose does not define whether N contains 0. For the expression
in 36(d), do not assert either convention: for positive k the cancellation
formula holds; if 0 belongs to N, the original expression at k = 0 is also
defined and equals 0. The positive-k simplified factorial is not defined at
k = 0. An authored conditional treatment can preserve both possibilities.

There are no seed figures.

## 32: Construct every permutation, not only its count

Task: write all orders using each element of each set exactly once, with
completeness and no duplicates.

- {1}: (1).
- {7,8}: (7,8), (8,7).
- {a,b,c}: abc, acb, bac, bca, cab, cba.
- {m,n,p,q}: the following four disjoint first-element groups:
  - First m: mnpq, mnqp, mpnq, mpqn, mqnp, mqpn.
  - First n: nmpq, nmqp, npmq, npqm, nqmp, nqpm.
  - First p: pmnq, pmqn, pnmq, pnqm, pqmn, pqnm.
  - First q: qmnp, qmpn, qnmp, qnpm, qpmn, qpnm.

Proof of completeness: for each possible first element, choose each remaining
element in turn for the second place, then list both orders of the two remaining
elements. Different first-element groups are disjoint. Within a group, different
second elements are disjoint and the last two positions are exhausted. Thus the
lists have exactly 1, 2, 6 and 24 distinct permitted orders.

Conceptual distinction: a permutation is an ordered use of all elements once;
counting alone does not demonstrate exhaustive construction. Choice recognition
will necessarily lose independently writing the complete list, so it must judge
meaningful complete permutation collections and retain every source set.

## 33: Three-color horizontal flag

Task: count flags made with one strip of each of red, blue and white. The
positions are top, middle, bottom; reversing them generally changes the flag.

The orders are red-blue-white, red-white-blue, blue-red-white, blue-white-red,
white-red-blue, white-blue-red. There are 3 choices at the top, 2 in the middle,
1 at the bottom: 3! = 6. This is a full permutation, not a selection of colors.

## 34: Prove both printed factorial formulas

Task: supply a factor-expansion and cancellation proof, not merely numerical
verification. All factorial arguments are nonnegative integers and n > m.

(a) (m+3)! = (m+3)(m+2)(m+1)m!. Since m! is positive, division by m! cancels
that complete common factor. The quotient is (m+1)(m+2)(m+3), including m = 0.

(b) Expanding n! down to (n-m)! gives
n! = [n(n-1)...(n-m+2)(n-m+1)](n-m)!.
The bracket has exactly m factors and stops before n-m. The positive factor
(n-m)! cancels, leaving the printed descending product. For m = 0 the bracket
is an empty product equal to 1, and n!/n! = 1. For m = 1 it is the one factor n.
These boundary cases explain the product notation without altering the formula.

Conceptual distinction: factorial quotients cancel multiplicative blocks;
factorial signs are not subtraction operations. Recognition of a valid argument
cannot demonstrate independently composing either proof.

## 35: Four exact numerical evaluations

(a) 8! + 9! = 8!(1+9) = 40320 * 10 = 403200.

(b) 10! - 11! = 10!(1-11) = -10 * 3628800 = -36288000.

(c) 102!/100! = 102 * 101 = 10302. Both uncancelled factors are required.

(d) (6! - 5!)/120 = (6*120-120)/120 = (720-120)/120 = 5.

The four tasks are independent numerical calculations. Factoring a common
factorial preserves addition/subtraction outside that common factor.

## 36: Four algebraic simplifications with their domains

(a) n!/(n-1)! = n, for integer n >= 1, since n! = n(n-1)!.

(b) (n-2)!/n! = 1/[n(n-1)], for integer n >= 2, since the larger factorial
is in the denominator.

(c) (n-1)!/(n-3)! = (n-1)(n-2), for integer n >= 3. There are two
uncancelled factors, not three.

(d) Keep 2k(2k-1)/(2k)! with k in N. For integer k >= 1,
(2k)! = (2k)(2k-1)(2k-2)!, hence the quotient is 1/(2k-2)!.
At k = 1 this is 1/0! = 1. If 0 is in N, substituting k = 0 into the
printed expression gives 0*(-1)/0! = 0. Cancellation by 2k is invalid there;
1/(2k-2)! would contain (-2)! and is not a value for that case. If 0 is not
in N, that extra case is simply outside the source domain.

Conceptual distinction: direction of quotient, exact cancellation endpoints,
and restrictions on cancelled factors.

## 37: Four calculations, retaining every printed factor

(a) For integer n >= 0,
1/n! - 1/(n+1)! = [(n+1)-1]/(n+1)! = n/(n+1)!.
At n = 0 both original terms equal 1 and the difference is 0.

(b) For integer k >= 1,
1/(k-1)! - 1/k! = (k-1)/k!. At k = 1 this gives 0.

(c) For integer p >= 4, the numerator
p(p-1)(p-2)(p-3)(p-4)! is exactly p!. Its quotient by (p-2)!
is p(p-1). At p = 4 the retained (p-4)! is 0! = 1, and the value is 12.
No printed factorial has been changed.

(d) For nonnegative integers m >= k, the numerator contains exactly k
successive factors, from m down to m-k+1. Factoring
m! = [m(m-1)...(m-(k-1))](m-k)! gives the value 1/(m-k)!.
At m = k it is 1/0! = 1; at k = 0 the empty numerator is 1 and the
result is 1/m!. The original endpoint m-(k-1) is retained.

## 38: Solve the two factorial inequalities completely

Let t be the number of elements, a nonnegative integer. The empty set has one
permutation by the supplied definition. The successive values are
0! = 1, 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120,
6! = 720, 7! = 5040. From t >= 1 onward each next value is multiplied
by t+1 and thus strictly increases.

(a) t! <= 1000 exactly when t is one of 0,1,2,3,4,5,6.
The maximum is 6, but a complete response must not silently replace the
inequality by only a maximum.

(b) t! >= 500 exactly when t >= 6. The minimum is 6, but the full
solution is unbounded above. The boundary 720 satisfies both inequalities.

## 39: Order a nine-student roster

Task: order nine distinct named students, each used once. There are
9*8*7*6*5*4*3*2*1 = 9! = 362880 orders. A roster is an ordered list,
not a choice of its already fixed members.

## 40: Assign fourteen attendants bijectively

Task: assign fourteen distinct attendants to fourteen distinct train cars,
one per car. After filling a car there is one fewer attendant available.
The count is 14*13*...*2*1 = 14! = 87178291200.
This counts bijections; no attendant repeats and no car is empty.

## 41: Four-digit numbers from 0,1,2,3 without repetition

Task: count four-digit numbers, not all four-symbol strings. Every number
uses all four digits, but the first digit cannot be 0.

First-place method: 3 choices (1,2,3), then 3,2,1 choices, yielding
3*3*2*1 = 18.

Complement method: 4! - 3! = 24 - 6 = 18, excluding exactly the
strings with initial 0. The six excluded strings have all remaining digits
permuted, not merely one excluded string.

## 42: Four prefix counts among five-digit permutations

All digits 1,2,3,4,5 are nonzero and distinct. Every allowed five-digit number
is a permutation, so the common universe has 5! = 120 members.

(a) Fix first digit 3, then permute the four remaining digits: 4! = 24.

(b) Exclude exactly the 4! numbers beginning with 5:
5! - 4! = 120 - 24 = 96. Equivalently, four allowable first digits
each give 4! completions.

(c) Fix the two-digit prefix 54, then permute 1,2,3:
3! = 6.

(d) Exclude exactly the numbers beginning with the ordered prefix 543.
The remaining digits 1,2 have 2! = 2 orders, so the count is
5! - 2! = 120 - 2 = 118.

The complement in (d) forbids that exact ordered three-digit prefix, not
every occurrence of its digits or only one fully specified number.

## Source-solving completion

All 11 written seeds 32-42 are solved above, including all 28 printed
subtasks (4+1+2+4+4+4+2+1+1+1+4). Full enumeration, both proof arguments,
all arithmetic/algebraic domains, the zero convention condition, and every
prefix/complement task have been handled before options exist.
