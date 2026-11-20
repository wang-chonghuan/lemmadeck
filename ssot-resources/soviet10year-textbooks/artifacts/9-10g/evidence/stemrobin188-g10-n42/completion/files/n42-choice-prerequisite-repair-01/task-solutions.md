# N42 prerequisite recovery: independent solutions

Role: fresh offline author, not reviewer. Scope: original seed sources 4, 5,
7 only. This file is saved before reading the original draft's internal
mathematics, original task-solutions, or constructing new options. No answer
author, report, or answer key was consulted.

## Inputs and supporting bindings

The unchanged source seed is
`.intentfold/tickets/STEMROBIN-188/tmp/n42-choice-author/seed.json`.
Its selected concepts 0 and 5 give a unique coordinate representation in a
mutually perpendicular unit-vector basis; concept 11 gives scalar multiplication
coordinatewise; concept 12 gives the coordinate dot product.

The user's `core9-10g` supporting-text designation resolves in this checkout
to the retained book directory `ssot-resources/soviet10year-textbooks/artifacts/9-10g/`.
No different book was substituted.

1. Raw `lessons/geo910-c1-s2-n20/lesson.json`, SHA-256
   `e408ad1d8d74e87a8b70493bcc31a31d36d11ec843f2179376f1bbcc1d4e8cd3`.
   Read only top-level `prose[0]` and `prose[22]`.
   - Block 0, printed page 64, source reference `p0071#12`: two nonzero
     vectors are collinear when their directions agree or are opposite;
     the definition also includes a pair with a zero vector.
   - Block 22, printed page 66, source reference `p0073#8`: Theorem 10
     states that nonzero a and b are collinear if and only if b = t a
     for some scalar t.
2. Current modern `editions/modern-us-neutral/lessons/geo910-c2-s1-n43/lesson.json`,
   SHA-256 `a931778a149bbcfbee6d8e551531f9bdc7b42b70600002193bcaf08e4b6f9b80`.
   Read only top-level `prose[8]`, printed page 148, source reference
   `p0155#12`: cos(phi) = (a dot b) / (|a| |b|).
   The paragraph has the heading "Solution", but the authorized content is
   exclusively this general relation, not a worked numeric result. No other
   paragraph, exercise, answer, choice, or figure was read from N43.

Bindings are supplementary internal evidence, not additional seed keys.
N20 exercise/answer/choice/figure files and its unrelated fig116/HOLD were
not read or changed. No new criterion on zero vectors is needed: all pairs
below are nonzero, including the parameterized vectors for every real x,y.

## Derived criteria

By Theorem 10 and uniqueness of the coordinate representation, nonzero vectors
are collinear exactly when one common scalar multiplies all three coordinates.
A negative scalar is permitted; opposite directions are explicitly included.
Ratios may be used only at nonzero coordinates, with a consistent numerator
and denominator order. The statements below also verify coordinatewise
equalities rather than relying on one ratio alone.

For nonzero vectors, |a| |b| is strictly positive. Thus the authorized cosine
relation gives cos(phi) = 0 exactly when a dot b = 0. A right angle has cosine
zero, so perpendicularity is equivalent to a zero dot product. This step
uses the ordinary geometric meaning of perpendicular and the elementary
right-angle value of cosine, not an inferred zero-vector or book convention.
The seed's orthonormal basis licenses the coordinate dot-product formula.

## Source 4

Task: use the collinearity criterion to decide each of the two original pairs
and explain the decisions. Keep all original fractions.

First pair:

a = (3/7, 1/2, -3/4), b = (2/7, 1/3, -1/2).

b1/a1 = (2/7)/(3/7) = 2/3.
b2/a2 = (1/3)/(1/2) = 2/3.
b3/a3 = (-1/2)/(-3/4) = 2/3.

Equivalently, (2/3)a = (2/7, 1/3, -1/2) = b.
Both vectors are nonzero; Theorem 10 proves that they are collinear.

Second pair:

c = (-3/2, 6, 4/3), d = (9/8, -9/2, -1).

d1/c1 = (9/8)/(-3/2) = -3/4.
d2/c2 = (-9/2)/6 = -3/4.
d3/c3 = (-1)/(4/3) = -3/4.

Equivalently, (-3/4)c = (9/8, -9/2, -1) = d.
Both are nonzero, so they too are collinear. The negative scalar is not an
obstruction; their directions are opposite.

Conceptual distinction: one consistent scalar across all coordinates,
including negative proportionality, versus inconsistent ratios or dropping
the scalar's sign.

## Source 5

Task: find all real x and y for which a = (x, -2, 5) and
b = (1, y, -3) are collinear.

Neither vector can vanish, because a3 = 5 and b1 = 1.
Write b = t a. The third coordinate fixes t uniquely:
-3 = 5t, hence t = -3/5.

The first coordinate requires 1 = t x, so
x = 1/(-3/5) = -5/3.
The second coordinate requires y = t(-2), so y = 6/5.

Sufficiency: (-3/5)(-5/3, -2, 5) = (1, 6/5, -3).
Necessity: t is fixed by the unchanged third coordinates, and the first and
second equalities force these x,y. Thus the full solution set is the single
ordered pair (-5/3, 6/5), not merely a sufficient example.

Conceptual distinction: recover a common multiplier from a fixed coordinate,
then impose the same oriented relation on both unknown coordinates.

## Source 7

Task: decide perpendicularity of each complete original vector pair,
not just calculate two dot products.

a = (-2, 1, 3), b = (6, -5, 7):
a dot b = (-2)(6) + (1)(-5) + (3)(7)
          = -12 - 5 + 21 = 4.
Both are nonzero. The positive denominator in the cosine relation means
cos(phi) is nonzero, so these vectors are not perpendicular.

c = (6, 0, 12), d = (-8, 13, 4):
c dot d = (6)(-8) + (0)(13) + (12)(4)
          = -48 + 0 + 48 = 0.
Both are nonzero; the cosine relation gives a right angle, so these vectors
are perpendicular. A zero coordinate in c is not a zero vector.

Conceptual distinction: exact signed cancellation across all coordinates is
equivalent to perpendicularity; a nonzero dot product is not. A zero individual
coordinate neither settles the dot product nor excludes a right angle.

## Production limits

Choice recognition will not demonstrate independent written proof, the
unprompted discovery of the criterion, or production of the parameter solution.
These losses belong only in internal intent/coverage/report, never as hints
in the visible question. No original numerical data or geometric decision
is omitted. No new or reopened images are required.
