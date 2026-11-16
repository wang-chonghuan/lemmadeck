# n78 independent source-first author freeze

Role: choice author, not independent semantic reviewer.
This record is written before any candidate option or draft artifact.
Date: 2026-11-16.

## Authority and boundary

- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n78-choice-seed.json`.
- Seed raw SHA-256: `76db526c371e3f33f1770cb77ea1103bdbdf3a5f1f6801be07445db1e93596f3`.
- Seed canonical digest: `3c2b5be3c612c617d5a04d337099ba0d4b399b816d2017bd9d499ed318384fb5`.
- Read all four seed exercises and the allowed modern written exercises. Read only selected concept block 1 from modern lesson prose: the fundamental limit `lim(t->0) sin(t)/t = 1`.
- Three worked examples are excluded. No answers, parent source solutions, reviews, other drafts or previous choice sets were accessed.
- No source or candidate images are required. The seed has no figure references.
- The supplied trigonometric limit is used with radian arguments. All limits are two-sided along the expression's domain. No unresolved source condition prevents these four computations.

Set `g(t)=sin(t)/t` for `t != 0`. The permitted theorem gives `g(t)->1` as `t->0`.

## Source 42

Task: compute `lim(x->0) sin(8x)/(2x)`.

For every `x != 0`,

`sin(8x)/(2x) = 4 sin(8x)/(8x) = 4g(8x)`.

Since `8x->0` from either side when `x->0`, the limit is `4`.
The domain of the written expression is `R \ {0}`; no value at zero is required.
For a direct error bound, given `epsilon>0`, choose `eta>0` so that
`0<|t|<eta` implies `|g(t)-1|<epsilon/4`.
Then `delta=eta/8` gives `|4g(8x)-4|<epsilon`.

Essential distinction: changing the sine argument requires multiplying, not dividing, by the argument-to-denominator ratio `8/2`.

## Source 43

Task: compute `lim(x->0) 5x/sin(4x)`.

Where the original quotient is defined and `x != 0`,

`5x/sin(4x) = (5/4) / g(4x)`.

The original domain excludes `x=k*pi/4`, for integer `k`.
In the punctured neighborhood `0<|x|<pi/8`, `4x` lies in `(-pi/2,pi/2)` and `sin(4x) != 0`.
Alternatively, convergence `g(t)->1` supplies a neighborhood in which
`|g(t)-1|<1/2`, hence `|g(t)|>1/2`, justifying the reciprocal.
Consequently the limit is `5/4`.

For an explicit bound, choose `eta>0` so that
`0<|t|<eta` implies `|g(t)-1|<min(1/2,2epsilon/5)`.
Take `delta=min(pi/8,eta/4)`. Then

`|(5/4)/g(4x)-5/4| = (5/4)|1-g(4x)|/|g(4x)| < (5/2)|1-g(4x)| < epsilon`.

Essential distinction: the fundamental quotient is in the denominator here. Its reciprocal tends to one only after checking local nonvanishing. Direct substitution gives an indeterminate form, not a computed limit.

## Source 44

Task: compute `lim(x->pi) sin(pi-x)/(pi-x)`.

Let `t=pi-x`. Then `t->0`, and the written quotient is exactly `g(t)` for `x != pi`.
Approaching `pi` from the left sends `t` to zero through positive values; approaching from the right sends it through negative values. The supplied two-sided limit gives the same value `1` on both sides.

Equivalently, with `h=x-pi`,

`sin(pi-x)/(pi-x) = sin(-h)/(-h) = sin(h)/h`.

Both minus signs cancel. The domain is `R \ {pi}`. Failure to define the quotient at `pi` does not prevent this limit.
For every `h != 0`, the values at `pi+h` and `pi-h` coincide, so symmetry about `pi` also transfers the known left-hand limit to the right-hand limit.
For an error bound, `|t|=|x-pi|`, so the fundamental-limit radius `eta` can be used directly as `delta`.

Essential distinctions: a reversing substitution must preserve both one-sided approaches; numerator and denominator signs must both be tracked; a limit is not the value at its limiting point.

## Source 45

Task: compute `lim(x->0) cos(pi/2-6x)/(5x)`.

The exact cofunction identity gives `cos(pi/2-6x)=sin(6x)`. Thus, for `x != 0`,

`cos(pi/2-6x)/(5x) = (6/5) sin(6x)/(6x) = (6/5)g(6x)`.

The limit is `6/5`, on the domain `R \ {0}`.
For `epsilon>0`, choose `eta>0` so that
`0<|t|<eta` implies `|g(t)-1|<5epsilon/6`; then `delta=eta/6` proves the claim.

Essential distinctions: the complementary-angle identity changes cosine to sine without a minus sign, and the normalization factor is `6/5`, not its reciprocal.

## Frozen conclusions and prospective capacity boundary

In source order 42, 43, 44, 45 the limits are `(4, 5/4, 1, 6/5)`.
All four original numerical limit tasks are solved above, including local domains and two-sided approaches.
Choice recognition can test complete normalization arguments, reciprocal reasoning, sign/orientation control and the complementary-angle conversion. It cannot establish autonomous written calculation or independently produced neighborhood/error estimates. Such production loss must be stated in the draft coverage rather than claimed away.

This source-only record is frozen before option construction and will not be edited during parent review.
