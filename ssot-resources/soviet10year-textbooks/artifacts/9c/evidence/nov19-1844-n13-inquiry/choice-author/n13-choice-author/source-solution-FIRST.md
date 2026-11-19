# FIRST Independent Full Source Solution

Status: FIRST, fixed before consideration or construction of choice options.
This is independently derived from the permitted written exercise and the
selected definitions; no supplied solutions or answer candidates were used.
Notation is fixed in interpretation-FIRST.md.

## General Mechanism

For a positive magnitude m/n, perform integer division m = nq_0 + r_0.
For k >= 1, write 10r_(k-1) = nq_k + r_k with 0 <= r_k < n.
The digits q_k and new remainders are uniquely determined by the preceding
remainder. If a remainder repeats, the entire ensuing digit sequence repeats.
There are only n possible remainders, including zero. A zero remainder would
repeat zero digits forever. The four concrete cycles below instead contain
nonzero remainders throughout.

## a) 7/3

7 = 3*2 + 1, so the integer part is 2 and r_0 = 1.
10*1 = 3*3 + 1: the first decimal digit is 3 and r_1 = 1.
The remainder has immediately returned to its starting value; every later
step is the same division of 10 by 3.

7/3 = 2.333333... exactly.
The decimal repeats from its first fractional digit with N = 1 and p = 1.
Its repeating block is the digit 3, not a period length of 3.

Exact value check: sum_(k>=1) 3/10^k = (3/10)/(1-1/10) = 1/3.
Thus 2 + 0.333333... = 2 + 1/3 = 7/3.

## b) 23/30

23 = 30*0 + 23, so r_0 = 23.
10*23 = 230 = 30*7 + 20, giving q_1 = 7 and r_1 = 20.
10*20 = 200 = 30*6 + 20, giving q_2 = 6 and r_2 = 20.
Once remainder 20 first appears, it immediately repeats; every further
decimal digit is 6. Remainder 23 is a prefix state, not part of that cycle.

23/30 = 0.766666... exactly.
The digit 7 is the nonrepeating prefix; digit 6 repeats thereafter.
The earliest eventual-period witness is N = 2, p = 1.

Exact value check: 0.7 + sum_(k>=2) 6/10^k
= 7/10 + (6/100)/(1-1/10) = 7/10 + 1/15 = 23/30.

## c) -3/7

Divide the positive magnitude 3/7, then negate its entire decimal.
3 = 7*0 + 3, so r_0 = 3.

| Current remainder | 10 times remainder | Digit | New remainder |
| --- | --- | --- | --- |
| 3 | 30 = 7*4 + 2 | 4 | 2 |
| 2 | 20 = 7*2 + 6 | 2 | 6 |
| 6 | 60 = 7*8 + 4 | 8 | 4 |
| 4 | 40 = 7*5 + 5 | 5 | 5 |
| 5 | 50 = 7*7 + 1 | 7 | 1 |
| 1 | 10 = 7*1 + 3 | 1 | 3 |

Remainder sequence, including the starting state:
3 -> 2 -> 6 -> 4 -> 5 -> 1 -> 3.
Returning to 3 repeats the six-digit block 428571 indefinitely.

-3/7 = -(0.428571428571...) = -0.428571428571... exactly.
The magnitude digits have N = 1, p = 6; all six digits in the first block
are distinct, so no shorter positive period works. Applying a leading minus
does not change this repeating digit sequence.

Exact value check: 0.428571428571...
= (428571/10^6)/(1-1/10^6) = 428571/999999 = 3/7,
since 428571 = 3*142857 and 999999 = 7*142857.
Negating gives -3/7.

## d) -29/11

Divide positive magnitude 29/11, then negate its entire decimal.
29 = 11*2 + 7, so the magnitude's integer part is 2 and r_0 = 7.
10*7 = 70 = 11*6 + 4, giving q_1 = 6 and r_1 = 4.
10*4 = 40 = 11*3 + 7, giving q_2 = 3 and r_2 = 7.
Remainder cycle: 7 -> 4 -> 7; its next-digit sequence is 6, 3.

-29/11 = -(2.636363...) = -2.636363... exactly.
The magnitude digits have N = 1 and p = 2. The consecutive distinct digits
6 and 3 rule out period 1. The leading minus negates both the integer and
fractional contributions; it is not an integer-only sign.

Exact value check: 0.636363...
= (63/100)/(1-1/100) = 63/99 = 7/11.
Thus -(2 + 7/11) = -(22/11 + 7/11) = -29/11.

## Source Coverage Summary

All four exact infinite decimal representations and their concrete
repeating-remainder explanations have been solved before option construction.
No approximations substitute for the infinite values. The first-digit prefix
in b), the longer cycle in c), ordinary whole-number signs in c) and d),
and the difference between digit-block value and period length are resolved.
The floor-based decompositions noted in the interpretation are not candidate
answers and are not used to change the chosen decimal-sign convention.
