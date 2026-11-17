# STEMROBIN-184 Stage2 Independent Visible-Mathematics Ledger

## Binding And Conventions

Date: 2026-11-17. Lesson: ana10-c6-s4-n94. Stage2 visible-only.
This ledger follows the Phase A fidelity/redundancy/leakage record in
`stage2-report.md`; it is not an author-key comparison or final semantic approval.

Author-visible input:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/author/views.json`

Raw SHA-256: `700be2efce7d87ed456a30d4f44b6919140795ecc871112d3fe363dc6fa4f332`.
Canonical SHA-256: `849b80462b3bea25e7858351f840efdc430c5434e43cfcb8db020d0404cc2192`.
Question-object hashes below use canonical JSON with sorted keys, ensure_ascii=True,
and separators=(",", ":"), encoded as UTF-8. They bind the full `{id, view}`
objects, including every exact Chinese/LaTeX option string and empty figure list.
The option expressions below are mathematical transcriptions, not rewritten input.

Frozen Stage1 file hashes remain unchanged:
`source-first.md = d2169648242988142876448d792b68070959985e00bf0c7237eeb807751eb01b`;
`ledger.md = 04ca2c1d639543a4ab08b1e383ef73f41a1a4ee4bed7ffde12e5705a2acadc0e`.
Original seed raw/canonical hashes remain
`52df395359f23509b7c706ca07a0151db9a7fe3cb3360584e109b945d8c8966c` /
`598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0`.

Additive parent binding evidence, not an independent current-seed read:
only `seed.trace[book.json]` changed to include complete n97; all selected seed
mathematics, concepts, figures and the other three traces are unchanged.
Parent current-seed prefix: `c684fe38...`, not a fully disclosed digest.
No n97 or expanded book content was read or solved.

Additive limit correction: 8 images per batch, 24 per context, no resets.
Exactly two authorized original-detail screenshots were opened once each;
current usage 2/8 batch and 2/24 context. Details and hashes are in the Stage2 report.

For all questions x is real, angles are radians, and each family independently
uses all k in Z. No finite interval is introduced. arctan is principal in
(-pi/2,pi/2); arcsin is principal in [-pi/2,pi/2].
`True` means that the option equals the COMPLETE real solution set, not merely
that each point it lists happens to solve the equation. A proper subset is false.
The complete true option sets are independent findings; author keys remain unseen.

## q01

Canonical question SHA-256:
`664d0a3896461cd363ab9f196e4b0b83895f36bbe3795b3c87ca9d5a1ee86cba`.
Visible equation: `1 + cos(x) + cos(2x) = 0`. Domain: R.

Independent reduction: c = cos(x) in [-1,1] gives
`c(2c + 1) = 0`. Thus c = 0 or -1/2.
Complete solution: `pi/2 + k*pi`, or `+/-2*pi/3 + 2*k*pi`.
Each factor root satisfies the original equation; these cosine inverse images
are exhaustive.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi/2 + k*pi | False | Omits the valid x = 2*pi/3, where 1 - 1/2 - 1/2 = 0. |
| b | pi/2 + k*pi, or +/-pi/3 + 2*k*pi | False | Includes x = pi/3, whose original left side is 1 + 1/2 - 1/2 = 1, not 0. Also misses the -1/2 cosine branch. |
| c | pi/2 + k*pi, or +/-2*pi/3 + 2*k*pi | True | Exactly both cosine-root inverse images; cos(x) = 0 or -1/2. |
| d | +/-2*pi/3 + 2*k*pi | False | Omits x = pi/2, which satisfies 1 + 0 - 1 = 0. |

Complete true option set: `{c}`.

## q02

Canonical question SHA-256:
`bc8fcd7de0a62d93949a18026734edbf0e0787172f0568757b93da44cf6067a5`.
Visible equation: `3 - cos(x)^2 - 3*sin(x) = 0`. Domain: R.

Independent reduction: s = sin(x) in [-1,1] gives
`s^2 - 3s + 2 = (s - 1)(s - 2) = 0`.
Reject s = 2; retain s = 1.
Complete solution: `pi/2 + 2*k*pi`. Substitution gives 3 - 0 - 3 = 0.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi/2 + 2*k*pi | True | Exactly sin(x) = 1, all and only admissible roots. |
| b | pi/2 + k*pi | False | k = 1 gives x = 3*pi/2 with left side 3 - 0 + 3 = 6. |
| c | -pi/2 + 2*k*pi | False | x = -pi/2 has sin(x) = -1 and left side 6, not 0. |

Complete true option set: `{a}`.
Package V1 remains separate: q03 has the same three complete-set propositions,
reordered, so mathematical correctness does not resolve their duplication.

## q03

Canonical question SHA-256:
`d08f9c5abb6add5b2be39dfd6e12ac276c3943fa847ffd80aeec7070fbdeafaa`.
Visible equation: `4*sin(x) = 4 - cos(x)^2`. Domain: R.

Independent reduction, performed for this equation as well:
`4s = 3 + s^2`, hence `(s - 1)(s - 3) = 0`.
The sine range rejects s = 3; retain s = 1.
Complete solution: `pi/2 + 2*k*pi`. Substitution gives 4 = 4.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | -pi/2 + 2*k*pi | False | At x = -pi/2 the original equation is -4 = 4, false. |
| b | pi/2 + k*pi | False | At k = 1, x = 3*pi/2 again gives -4 = 4. |
| c | pi/2 + 2*k*pi | True | Exactly sin(x) = 1 with all 2*pi-periodic solutions. |

Complete true option set: `{c}`.
The inadmissible root here is 3, not q02's 2; the displayed response does not
assess this difference. See V1 in the report.

## q04

Canonical question SHA-256:
`b0c0b5e4141af4b05b853c06a7a1fc14f62e269c6cc7537b08e053267f6a06c6`.
Visible equation: `tan(x) + cot(x) = 5/2`.
Original domain: `R \ {k*pi/2 : k in Z}`.

Independent reduction: nonzero finite t = tan(x) gives
`t + 1/t = 5/2` iff `(2t - 1)(t - 2) = 0`.
Roots 1/2 and 2 are both admissible.
Complete solution: `arctan(1/2) + k*pi`, or `arctan(2) + k*pi`.
Both families stay in the original domain and give sum 5/2.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | arctan(1/2) + k*pi | False | Omits x = arctan(2), where tan + cot = 2 + 1/2. |
| b | arctan(1/2) + k*pi, or arctan(2) + k*pi | True | Contains exactly both nonzero tangent roots and their full pi-periodic inverse images. |
| c | +/-arctan(1/2) + k*pi | False | x = -arctan(1/2) gives tan + cot = -1/2 - 2 = -5/2. The positive root 2 is also missing. |
| d | arctan(1/2) + 2*k*pi, or arctan(2) + 2*k*pi | False | Omits arctan(1/2) + pi, a valid angle not in either displayed 2*pi family. |

Complete true option set: `{b}`.

## q05

Canonical question SHA-256:
`1be28a048bcb9fb034da90290b8ed6b541014bb2007c225075db0bd10f9ca05a`.
Visible equation: `cos(x/2) = 1 + cos(x)`. Domain: R.

Independent reduction: u = cos(x/2) in [-1,1] gives `u = 2u^2`,
or `u(2u - 1) = 0`.
Retain u = 0 and 1/2, without division by u.
Complete solution: `pi + 2*k*pi`, or `+/-2*pi/3 + 4*k*pi`.
The two original sides equal 0 or 1/2 respectively.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi + 2*k*pi, or +/-2*pi/3 + 2*k*pi | False | Includes x = 8*pi/3, where cos(x/2) = -1/2 but 1 + cos(x) = 1/2. |
| b | +/-2*pi/3 + 4*k*pi | False | Omits x = pi, which gives 0 = 0 in the original equation. |
| c | pi + 2*k*pi, or 2*pi/3 + 4*k*pi | False | Omits the valid x = -2*pi/3 from the negative half-angle branch. |
| d | pi + 2*k*pi, or +/-2*pi/3 + 4*k*pi | True | Exactly all angles with u = 0 or u = 1/2; the half-angle branches keep their required 4*pi increment. |

Complete true option set: `{d}`.

## q06

Canonical question SHA-256:
`2cae325cff5d510ad4e68e68cee697d01709050cf2cea81eab1f08ea7c4502df`.
Visible equation: `tan(x) - tan(pi/2 - x) = 1`.
Original domain: `R \ {k*pi/2 : k in Z}`, from both original tangent denominators.

Independent reduction: on this domain the second tangent is cot(x).
For nonzero finite t = tan(x), `t - 1/t = 1` iff `t^2 - t - 1 = 0`.
Let p = (1 + sqrt(5))/2 and n = (1 - sqrt(5))/2.
Complete solution: `arctan(p) + k*pi`, or `arctan(n) + k*pi`.
Both roots are nonzero and finite; dividing their polynomial by t verifies the
original equation. Equivalently the union is `arctan(p) + k*pi/2`.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | arctan(p) + k*pi, or arctan((sqrt(5)-1)/2) + k*pi | False | The second value r = (sqrt(5)-1)/2 = 1/p gives r - 1/r = r - p = -1, not 1. |
| b | arctan(p) + 2*k*pi, or arctan(n) + 2*k*pi | False | Omits arctan(p) + pi, which still has tangent p and satisfies the original equation. |
| c | arctan(p) + k*pi, or arctan(n) + k*pi | True | Exactly the two roots of t^2 - t - 1 and their complete pi-periodic families in the original domain. |
| d | arctan((-1+sqrt(5))/2) + k*pi, or arctan((-1-sqrt(5))/2) + k*pi | False | Both tangent values solve t^2 + t - 1 = 0 instead; dividing by t gives t - 1/t = -1 for each, not 1. |

Complete true option set: `{c}`.

## q07

Canonical question SHA-256:
`d7324e2532024176fa06b34b9dc06e402f75c3cf037fe6b4aedc167f2ad5e550`.
Visible equation: `5*cos(x) + 12*sin(x) = 13`. Domain: R.

Independent reduction: b = arctan(12/5) has cos(b) = 5/13, sin(b) = 12/13.
The expression is `13*cos(x - b)`, hence cos(x - b) = 1.
Complete solution: `b + 2*k*pi`. No squaring or sign loss is used.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | arctan(12/5) + 2*k*pi | True | Both coefficients align with (cos,sin) = (5/13,12/13), giving (25+144)/13 = 13. |
| b | arctan(5/12) + 2*k*pi | False | Its principal angle has (cos,sin) = (12/13,5/13), giving 120/13, not 13. |
| c | -arctan(12/5) + 2*k*pi | False | Its principal angle gives (25-144)/13 = -119/13, not 13. |
| d | arctan(12/5) + k*pi | False | k = 1 is the opposite vector and gives -13 instead of the required +13. |

Complete true option set: `{a}`.

## q08

Canonical question SHA-256:
`e06f232f52dbbfae18571703fd0dc7698254bc3ff71c9694c2a39576fdcd836b`.
Visible equation: `sin(x) - sin(2x) = 0`. Domain: R.

Independent reduction: `sin(x)*(1 - 2*cos(x)) = 0`.
Retain sin(x) = 0 and cos(x) = 1/2, without dividing by sine.
Complete solution: `k*pi`, or `+/-pi/3 + 2*k*pi`.
Each factor zero gives sin(2x) = sin(x).

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | k*pi, or +/-pi/3 + 2*k*pi | True | Exactly both factor-zero families, including all zero-sine angles. |
| b | +/-pi/3 + 2*k*pi | False | Omits x = 0, whose original expression is zero. |
| c | k*pi, or +/-2*pi/3 + 2*k*pi | False | At x = 2*pi/3 the expression is sqrt(3)/2 - (-sqrt(3)/2) = sqrt(3), not zero. |
| d | 2*k*pi, or +/-pi/3 + 2*k*pi | False | Omits x = pi, a valid odd zero-sine angle. |

Complete true option set: `{a}`.

## q09

Canonical question SHA-256:
`0793325955c6aba0296d40f3e9c22e466d8b96c2fe2d50fc63db2e248b59eac0`.
Visible equation: `1 - cos(x) = 2*sin(x/2)`. Domain: R.

Independent reduction: u = sin(x/2) gives `2u^2 = 2u`,
or `u(u - 1) = 0`. Thus u = 0 or 1.
Complete solution: `2*k*pi`, or `pi + 4*k*pi`.
These give 0 = 0 and 2 = 2 respectively. A negative half-angle sine is not
introduced by squaring.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | k*pi | False | Includes x = 3*pi, where the original equation is 2 = -2. |
| b | 2*k*pi, or pi + 4*k*pi | True | Exactly u = 0 or 1, including all full half-angle periods. |
| c | pi + 4*k*pi | False | Omits x = 0, which satisfies 0 = 0. |
| d | 2*k*pi, or -pi + 4*k*pi | False | Includes x = -pi, which gives 2 = -2, and omits the valid positive x = pi. |

Complete true option set: `{b}`.

## q10

Canonical question SHA-256:
`b933735492ccb8a214e7b2a221294587c5f17fdb324c61991fb249ec2bb2cb80`.
Visible equation: `1 + cos(x) = 2*cos(x/2)`. Domain: R.

Independent reduction: u = cos(x/2) gives `2u^2 = 2u`,
or `u(u - 1) = 0`. Thus u = 0 or 1.
Complete solution: `pi + 2*k*pi`, or `4*k*pi`.
The original sides are both 0 or both 2.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | k*pi | False | Includes x = 2*pi, which gives 2 = -2. |
| b | 4*k*pi | False | Omits x = pi, which satisfies 0 = 0. |
| c | pi + 2*k*pi, or 4*k*pi | True | Exactly all u = 0 or 1 angles; no u = -1 is added. |
| d | pi + 2*k*pi, or 2*pi + 4*k*pi | False | Its even branch has u = -1; x = 2*pi gives 2 = -2. It also omits x = 0. |

Complete true option set: `{c}`.

## q11

Canonical question SHA-256:
`c81371166639af81b0138167524617297fb3c967288aa3553e336078aef3c4a9`.
Visible equation: `cos(2x) = (7/3)*sin(x)`. Domain: R.

Independent reduction: s = sin(x) in [-1,1] gives
`6s^2 + 7s - 3 = (3s - 1)(2s + 3) = 0`.
Reject s = -3/2; retain s = 1/3. Let a = arcsin(1/3) in (0,pi/2).
Complete solution: `a + 2*k*pi`, or `pi - a + 2*k*pi`.
Both original sides equal 7/9 on both branches.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | a + 2*k*pi | False | Omits x = pi - a, the distinct supplementary solution. |
| b | +/-a + 2*k*pi | False | At x = -a, cos(2x) = 7/9 but (7/3)*sin(x) = -7/9. Also misses pi - a. |
| c | a + k*pi | False | At x = a + pi, the two original sides are 7/9 and -7/9. Also misses pi - a. |
| d | a + 2*k*pi, or pi - a + 2*k*pi | True | Exactly both sine inverse images of 1/3 and their full periods. |

Complete true option set: `{d}`.

## q12

Canonical question SHA-256:
`46dd780c9dcb82f82f18febcd28c535abfb9520d28621ac31b9bfe620c033b19`.
Visible equation: `sqrt(3)*sin(x) - cos(x) = 0`. Domain: R.

Independent reduction: the expression is `2*sin(x - pi/6)`.
Complete solution: `pi/6 + k*pi`.
No cosine-zero angle solves the original equation; a tangent reduction to
1/sqrt(3) would therefore be justified as well.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi/3 + k*pi | False | At x = pi/3 the expression is sqrt(3)*sqrt(3)/2 - 1/2 = 1. |
| b | pi/6 + k*pi | True | Exactly all zeros of sin(x - pi/6), with both pi-separated signs retained. |
| c | -pi/6 + k*pi | False | At x = -pi/6 the expression is -sqrt(3)/2 - sqrt(3)/2 = -sqrt(3). |
| d | pi/6 + 2*k*pi | False | Omits x = 7*pi/6, whose sine and cosine both reverse sign and still give zero. |

Complete true option set: `{b}`.

## q13

Canonical question SHA-256:
`531209539b065592ab9c8d279c2908ee29c5c0671bee242cde680cfbe2f895b8`.
Visible equation: `cos(x) + sin(x) = 0`. Domain: R.

Independent reduction: the expression is `sqrt(2)*sin(x + pi/4)`.
Complete solution: `-pi/4 + k*pi`, equivalently `3*pi/4 + k*pi`.
Cosine-zero angles cannot solve the original equation, so tan(x) = -1 is
an exhaustive alternative reduction when division is justified.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | -pi/4 + k*pi | True | Exactly sin(x) = -cos(x) with all pi-periodic roots. |
| b | pi/4 + k*pi | False | At x = pi/4 the original expression is sqrt(2), not zero. |
| c | -pi/4 + 2*k*pi | False | Omits x = 3*pi/4, where the original expression is zero. |

Complete true option set: `{a}`.

## q14

Canonical question SHA-256:
`e17445b5ac3a0e764f378342923ccd1a04b8c11c7d5ced879bf0692bb023bb91`.
Visible equation: `cos(x)^2 - 3*sin(x)*cos(x) = -1`. Domain: R.

Independent reduction: using 1 = sin(x)^2 + cos(x)^2 gives
`(sin(x) - cos(x))*(sin(x) - 2*cos(x)) = 0`.
Cos(x) = 0 would give 0 = -1 and is not a solution.
Hence nonzero cosine permits tan(x) = 1 or 2, equivalently
`t^2 - 3t + 2 = 0`.
Complete solution: `pi/4 + k*pi`, or `arctan(2) + k*pi`.
The original left side `(1 - 3t)/(1 + t^2)` equals -1 for both roots.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi/4 + k*pi | False | Omits x = arctan(2), the second valid tangent root. |
| b | arctan(2/3) + k*pi | False | t = 2/3 gives original left side (1-2)/(1+4/9) = -9/13, not -1. |
| c | pi/4 + k*pi, or arctan(2) + k*pi | True | Exactly both tangent roots and their full pi-periodic families, with no cosine-zero solution lost. |
| d | pi/4 + 2*k*pi, or arctan(2) + 2*k*pi | False | Omits x = 5*pi/4, a valid tan(x) = 1 solution that reverses both sine and cosine. |

Complete true option set: `{c}`.

## q15

Canonical question SHA-256:
`b961d7601633add7d4d3f3a25e86c2df95d9cca5d91ba430390e87a4e67400ea`.
Visible equation: `3*cos(x)^2 = 4*sin(x)*cos(x) - sin(x)^2`.
Domain: R.

Independent reduction: moving terms gives
`(sin(x) - cos(x))*(sin(x) - 3*cos(x)) = 0`.
Cos(x) = 0 would give 0 = -1 and cannot solve the equation.
Justified division therefore gives `3 = 4t - t^2`,
or `(t - 1)(t - 3) = 0`.
Complete solution: `pi/4 + k*pi`, or `arctan(3) + k*pi`.
At t = 1 the original sides are 3/2; at t = 3 they are 3/10.

| Option | Displayed set | Truth | Concrete check |
| --- | --- | --- | --- |
| a | pi/4 + k*pi, or arctan(3) + k*pi | True | Exactly both positive tangent roots with all pi-periodic solutions. |
| b | pi/4 + k*pi | False | Omits x = arctan(3), the second valid root. |
| c | pi/4 + 2*k*pi, or arctan(3) + 2*k*pi | False | Omits x = 5*pi/4, which is a valid tangent-1 solution. |
| d | -pi/4 + k*pi, or -arctan(3) + k*pi | False | The tangent values are -1 and -3. The divided original equation would read 3 = -5 or 3 = -21, respectively, both false. |

Complete true option set: `{a}`.

## Enumeration Closure

- q01-q15 each independently solved, with the full real original domain.
- 57/57 visible options concretely checked: 15 true, 42 false as complete-set propositions.
- Complete true sets in visible order: `{c}, {a}, {c}, {b}, {d}, {c}, {a}, {a}, {b}, {c}, {d}, {b}, {a}, {c}, {a}`.
- No intra-question equivalent complete alternatives or multiple-true `single` question found.
- All solution families use unrestricted integer k; no principal-angle-only or finite-interval answer is substituted.
- Every retained tangent family lies in the original domain; every rejected sine root fails the real sine range.
- q02/q03 duplication and transfer remain separate from their independently correct mathematics.
- Author-key agreement, author derivations/misconceptions, declared limitations/coverage, and final semantic gate remain undisclosed and pending.
- Stage1 bytes remain immutable. WAIT for explicit Stage3 internal disclosure.
