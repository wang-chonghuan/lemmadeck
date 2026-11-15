# geo910 n1 Choice Author: Source-First STOP

Role: choice author, not independent reviewer. No options or keyed draft have
been written. This report freezes the independent source analysis and the
specific missing course prerequisites before alternatives.

## Authorized Inputs

Read the current choice SKILL, authoring and contract. Ran whitelist inspect
for book `9-10g`, lesson `geo910-c1-s1-n1`, then prepared exactly exercises
1/2 and concepts 4/6, with no concept figure. Read the complete resulting seed.
The seed contains no exercise or selected-concept image; pending lesson body
figures are irrelevant to this selection and were not opened.

No answer keys/templates, parent answer/source-first/review artifacts, prior
choices, interactions, history, tests, browser, environment, database or model
were read or used. n76 draft and evidence remain untouched.

Seed:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n1-choice-seed.json`

Canonical digest:
`d57bc1ba457bc0bb32efcc805612fc017292d72ead87ca9da4873848603dedc4`

Explicit prepare:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare \
  --repo . --book 9-10g --lesson geo910-c1-s1-n1 \
  --exercise 1 --exercise 2 --concept-block 4 --concept-block 6 \
  --out .intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n1-choice-seed.json
```

Result: two written seeds prepared; no questions generated.

## What the Allowed Concepts Establish

Concept 4 gives the organization of an axiomatic course: leave primitive
concepts undefined, establish axioms about them, define further concepts,
and prove theorems from axioms/definitions. It does not enumerate the actual
prior plane-geometry axioms or identify the introduction of the ten listed
statements.

Concept 6 explicitly says **solid geometry** has four basic concepts:
point, straight line, plane, distance. It separately says set is an undefined
basic concept across mathematics, and defines a figure as a set of points.
It does not explicitly enumerate the earlier **plane geometry course** basic
concepts asked for in exercise 1.

Mathematical truth or availability of a proof does not establish the requested
course-relative status. A proposition adopted as an axiom can also be provable
from another stronger set of assumptions. A statement equivalent to a named
definition need not be the way this particular course introduced that name.
The task must remain axiom/theorem/definition classification, not be replaced
by true/false, proof availability, or classification in a newly chosen system.

## Independent Exercise 1 Analysis

Demand: recall the undefined basic concepts of the prior plane geometry
course, not copy the solid-geometry list.

The distance-based planar list **point, straight line, distance** is a plausible
course reconstruction, with set as the separate general mathematical primitive.
However, removing plane from the explicit solid list is an inference, not
a quoted statement about the earlier course. Point/line alone is another
possible planar foundation if distance is defined later, while plane may be
an ambient object rather than a primitive. Whether the expected recall
includes the separately named general concept set also needs the earlier
course's own enumeration.

Frozen conclusion: no complete, uniquely source-grounded planar primitive
list is keyed from concepts 4/6 alone. Do not answer exercise 1 with the four
solid primitives or silently present the plausible three-item reconstruction
as the established source answer.

## Independent Exercise 2: All Ten Items

Demand: retain each exact statement and classify its role **in the prior
plane geometry course**. The analyses below explain their mathematical
content and the concrete missing introduction. They are not a guessed
classification key.

### 1. Unique Perpendicular Through a Given Point

The statement includes existence and uniqueness of a perpendicular through
a point to a given line. In an ordinary Euclidean coordinate realization,
choose the line's direction vector d and the given point P; the line through
P in a nonzero perpendicular direction exists, and any perpendicular direction
is proportional to that direction. This establishes the claim in that
realization, including a point on the given line.

That proof does not determine whether this course adopted the claim as an
axiom, derived it as a theorem, or used it within its definition of
perpendicularity. Needed: the prior course's perpendicular definition and
the page where existence/uniqueness is introduced. No final category assigned.

### 2. Distance from A to B Equals Distance from B to A

With distance defined as the Euclidean norm of a difference, symmetry follows
from `||B-A||=||A-B||`. With distance primitive, symmetry can be one of its
axioms. Concept 6 makes distance primitive for solid geometry, but does not
list the prior planar distance axioms or state which properties were adopted.
Needed: the planar primitive/distance axiom block. No final category assigned.

### 3. Broken-Line Length Strictly Exceeds Endpoint Distance

For vertices P0,...,Pn, repeated triangle inequality gives
`sum |Pi-P(i-1)| >= |Pn-P0|`. Strictness requires the broken-line convention
to exclude straight monotone chains; if such a chain is allowed, equality
occurs. For example (0,0),(1,0),(2,0) gives both lengths 2. If genuine bends
are required, the usual equality condition prevents equality and yields the
strict statement.

This is not an authorization to mark the printed statement false: the task
asks its course status, and the source convention for broken line may supply
the strictness premise. Needed: its original broken-line definition and
length comparison introduction. No blanket strictness or category invented.

### 4. Intersection Consists of All Points Common to Both Figures

The standard set-theoretic construction is
`F intersect G = {P: P belongs to F and P belongs to G}`; concept 6's
figure-as-point-set statement makes this interpretation coherent. Its wording
is definitional in mathematical form and a natural **definition candidate**.
The selected concepts do not actually introduce the intersection operation.
Needed for a frozen course key: the prior course's intersection definition.
This candidate is not enough to key a complete ten-item classification.

### 5. Displacement Is a Distance-Preserving Map of the Plane to Itself

The stated preservation condition is
`d(T(A),T(B))=d(A,B)` for every A,B in the plane. It is the usual defining
condition for a plane displacement/isometry and a natural **definition
candidate**. The selected concepts do not define displacement or map, and
do not document whether this sentence was the adopted definition or a
characterization proved from another definition.

Needed: the course's original displacement introduction. Do not infer its
course category from the word "is" alone.

### 6. A Parallel Through Any Point to a Given Line Exists

In coordinates one can construct through P a line having the given line's
direction. If P lies on the given line this construction returns the same
line; whether it qualifies depends on whether parallel includes coincident
lines. If parallel means distinct nonintersecting coplanar lines, the literal
"any point" requires a missing off-line restriction. The selected material
does not settle this convention.

Moreover, existence alone may be a proved result in a course whose parallel
axiom states uniqueness, or may be part of an adopted existence/uniqueness
axiom. These are not interchangeable statuses.

Needed: the actual planar parallel definition and parallel axiom/theorem
wording, retaining the arbitrary-point/coincident-line boundary. Do not
silently add "outside the line" or relabel this as the familiar parallel
postulate. No final category assigned.

### 7. Translation Is a Displacement

With a fixed vector a and a coordinate translation `T(P)=P+a`,
`T(B)-T(A)=B-A`, so distances are preserved. Thus it is derivable under
those definitions. If translation is instead introduced as a special type of
displacement, its membership can be definitional.

Needed: both the prior translation definition and displacement definition,
plus the status of this sentence when introduced. A coordinate proof does
not select the course's category. No final category assigned.

### 8. A Unique Circumference Through Three Noncollinear Points

The perpendicular bisectors of two sides intersect in a unique center for a
noncollinear triangle: their directions are independent, and their intersection
is equidistant from the three vertices. The common positive radius defines
the circumference. Any possible center must lie on both bisectors, giving
uniqueness.

The independent mathematical construction preserves all source conditions,
including noncollinearity and circumference rather than disk. It does not
identify whether this course takes the construction result as a theorem or
an axiom. Needed: the prior course's circumference definition and introduction
of this existence/uniqueness statement. No final category assigned.

### 9. Congruent Polygons Have Equal Areas

If area is introduced by axioms including invariance under congruence, this
sentence is an area axiom. If polygon area is defined by triangulation with
a proven isometry-invariance result, it may be a theorem. Both approaches
give the same numerical areas. A proof that a motion preserves a triangulation
does not establish how this course introduced area.

Needed: the original area definition/axiom list, and the meaning of congruence.
No final category assigned. This is a concrete obstruction even if other
familiar classification candidates are recognizable.

### 10. A 180-Degree Rotation Is Central Symmetry

Under the pointwise midpoint definition of central symmetry, its image obeys
`P'=2O-P`. A half-turn maps `P-O` to `-(P-O)`, hence also gives `P'=2O-P`;
O remains fixed. The equality of transformations then is a derivable result.
If central symmetry is introduced directly as a half-turn, this same sentence
is the definition instead.

Needed: the original rotation and central-symmetry definitions/introduction.
Selected concepts 4/6 do not choose between these equally coherent courses.
No final category assigned.

## STOP, Coverage and Capacity

All ten statements and basic-concept recall were independently examined before
options. Essential missing evidence is the prior planar course's primitive
enumeration and the actual status/definitions/axioms just identified, not
missing current figures or inability to perform Euclidean calculations.

Per-source pending coverage:

- Exercise 1: entire course-relative primitive recall is unkeyed pending its
  original enumeration, including treatment of the general concept set.
- Exercise 2: entire ten-item course-relative classification is unkeyed.
  Items 2/9 directly exhibit axiom-versus-theorem dependence; item 10 exhibits
  definition-versus-theorem dependence. Items 3/6 also need their original
  strictness/parallel boundary conventions. Items 4/5 have clear definitional
  candidates, but no partial quiz may masquerade as covering all ten.

Once that source route is authorized and resolved, natural complete
classification records or coherent native multiple judgments of assigned
categories can preserve the task. True/false is not a substitute. Choice
recognition still cannot establish autonomous recall/classification with
justification; that production loss must be recorded. No alternative response
unit is currently authored that hides the essential missing premise.

No `geo910-c1-s1-n1-choice-draft.json` was created; a schema requires a nonempty
keyed question list, and fabricating one would violate the stated STOP boundary.
No structural validator was run because there is no draft to validate; the
one authorized structural run remains unused. Seed and this report are
preserved. No semantic approval, promotion or durable/tool changes.

Author STOP awaiting an explicitly allowed prerequisite source route or
course-convention clarification. This is not a request to read answers,
parent source solutions, other reviews, or prior choices.
