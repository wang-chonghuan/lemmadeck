# STEMROBIN-184 / n16 Independent Source-First Freeze

Stage: 1 only. Reviewer: independent reviewer in this separate session.
Date: 2026-11-16. This proof was completed before opening learner views.

## Input Boundary

Mathematical inputs read: `geo910-n16-choice-seed.json`, its selected concept
blocks 1, 4, 10, 12, written exercises 164-167, and the actual selected
`fig-62.svg` / `fig-63.svg` rasterized full-frame in existing headless Chromium.
Workflow instructions read: choice SKILL, review and contract references, image
SKILL and repository workflow/engineering/operations instructions.
The advertised root Playwright CLI SKILL path was absent; that failed text read
was not an image load. No dependency was installed or changed.

No author draft, author reasoning, source-solve, handoff, answers, old choices,
other reviews, learner views, live ticket/backend, source trace files, database,
environment file, app runtime, model service, Git or publication was accessed.
The user reports a concurrent book-trace advance with unchanged semantics and
figures. The supplied T remains the authority: no reseeding, freshness validator
or reading of book.json was performed.

Seed path, relative to repository:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-seed.json`

Seed canonical SHA-256:
`59d912e291e3e89f3d965d408a680d9dbb0627c6f34575c070e4ed2f05f7b43d`

The raster log records the seed byte hash and exact rasterization time:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-independent-raster-log.md`

## Figure Evidence And Load Ledger

One batch was used. The complete SVG image element was rasterized at its intrinsic
dimensions; no crop, browser UI, remote page or headed window was used.

| Attempt | Operation | Result |
| --- | --- | --- |
| 1 | Headless raster image load, fig-62 actual SVG bytes | Successful, entire 640 x 660 frame |
| 2 | Headless raster image load, fig-63 actual SVG bytes | Successful, entire 640 x 640 frame |
| 3 | Model image open, fig-62 full-frame PNG | Successful, no crop or reopen |
| 4 | Model image open, fig-63 full-frame PNG | Successful, no crop or reopen |

Model-context image payloads: 2. Successful model opens: 2; failed model opens: 0.
Headless image-load successes: 2; failures: 0.
Conservative combined count: 4 attempts in this batch and context, below 8/batch
and 24/context. There were no other image opens, crops or screenshots.

### fig-62

Actual asset:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-62.svg`

Actual SVG SHA-256, matching T:
`8a354c8ddb5eaa82fa378ce195a2da624145278f4c0e3b7a1e357c9b72a43d2c`

Full-frame PNG:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-independent-fig-62-full.png`

PNG SHA-256:
`9fae79b10d7e20e363c0b7d30525bb2d6d1df0f7c4f910a9ca8a73102c0ed4b1`

Visual observation: upper panel a has two distinct parallel ray supports,
origins O1 and O2 on the dividing line, and h1/h2 pointing right into the same
half-plane alpha1; alpha2 is to the other side. Both arrowheads and their
right-hand A1/A2 labels are visible. Lower panel b has O1 and O2 on its dividing
line, h1 directed up-right into alpha1 and h2 down-left into alpha2, on distinct
parallel supports. The left A2, right A1, lower alpha2 and bottom b) are present
inside the full frame. Thus a illustrates same direction and b opposite
direction under concept block 1. Plane polygons are display boundaries, not ray
endpoints.

### fig-63

Actual asset:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-63.svg`

Actual SVG SHA-256, matching T:
`a9df63a0b977d008267baf7697e070ff9e7288bba0941d5c61a7021b9d24f7ea`

Full-frame PNG:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-independent-fig-63-full.png`

PNG SHA-256:
`ad8dc14eb897a92a303ab870dc6855fcac445e3f139952cf840697784ba7f812`

Visual observation: all four rows a-d, both ends of each horizontal support,
every origin dot, arrowhead and bottom label are visible. In a, O1 is left of O2
and both rays point right: their intersection is a ray beginning at O2. In b,
the left-origin h1 points left and right-origin h2 points right: their
intersection is empty. In c, the ray labelled h1 on the right-going portion
starts at the left origin and the ray labelled h2 on the left-going portion
starts at the right origin: they overlap on the closed segment between the two
distinct origins. In d, both origins coincide (O1 = O2, visibly labelled below
the bottom row), and opposite arrows give a singleton intersection. These are
exactly the same-line definition's ray / empty / segment / singleton cases.

## Definition Reduction

Write a nondegenerate ray as `R(P,d) = {P + t d : t >= 0}`, with `d != 0`.
For the selected definitions, two rays are same-direction exactly when
`d2 = lambda d1` with `lambda > 0`, and opposite-direction exactly when
`d2 = -lambda d1` with `lambda > 0`. This is a derived coordinate test, not an
extra source assumption:

- For distinct parallel supports, choose an axis along their common direction
  in their plane. The line through the origins is the divider in block 1.
  Positive multiples go into the same half-plane; negative multiples go into
  different half-planes.
- For the same support, write positions on a one-dimensional coordinate axis.
  Equal signs produce a nonempty ray intersection; opposite signs produce a
  bounded closed segment, singleton or empty set, never a ray, as block 4 says.
- For nonparallel supports neither definition applies: sharing an endpoint,
  belonging to a face, or looking similar in perspective does not establish
  either directional relation.

Origins belong to their rays. Hence a coincident-origin intersection is a point,
not empty. Direction is not determined by the shape or size of the intersection
alone unless same-line support has been established.

## Exercise 164: All Six Pairs

A tetrahedron ABCD is nondegenerate. Put A = 0, B = u, C = v, D = w, where
u, v, w are linearly independent. The four literal ray directions are
AB: u; AC: v; AD: w; CD: w - v.

| Pair | Relation | Independent reason |
| --- | --- | --- |
| AB, AC | Neither | u and v are independent |
| AB, AD | Neither | u and w are independent |
| AB, CD | Neither | u cannot be proportional to w - v; that would make u,v,w dependent |
| AC, AD | Neither | v and w are independent |
| AC, CD | Neither | v proportional to w - v would make w proportional to v |
| AD, CD | Neither | w proportional to w - v would make v proportional to w |

Answer 164(1): no same-direction pair. Answer 164(2): no opposite-direction
pair. AB/AC/AD sharing A does not help. AC/CD and AD/CD have intersecting support
lines in triangle ACD but no common line. AB/CD have skew supports: were they
coplanar, the four vertices would be coplanar. This also cannot create a
directional pair. All six possibilities have been excluded.

## Exercise 165: Literal C1D And All 28 Unordered Pairs

Use affine coordinates A = 0, B = u, D = v, A1 = w with independent edge vectors
u,v,w. Then C = u+v, B1 = u+w, D1 = v+w, C1 = u+v+w.
No orthogonality, equal edge length, cube or drawing perspective is assumed.

| Index | Literal ray | Direction |
| --- | --- | --- |
| 1 | AB | u |
| 2 | AD | v |
| 3 | AA1 | w |
| 4 | BC | v |
| 5 | C1D | -u-w |
| 6 | BB1 | w |
| 7 | C1C | -w |
| 8 | A1D1 | v |

C1D ends at D, not D1. Its direction is `v-(u+v+w)=-u-w`, a face-diagonal
direction, not `-u`. Because u and w are independent, -u-w is proportional to
neither u nor w; it also cannot be proportional to v. In particular C1D is
neither same-direction nor opposite-direction to any of the other seven listed
rays.

S = same-direction, O = opposite-direction, N = neither.

| No. | Unordered pair | Relation | Direction check |
| --- | --- | --- | --- |
| 1 | AB, AD | N | u versus v |
| 2 | AB, AA1 | N | u versus w |
| 3 | AB, BC | N | u versus v |
| 4 | AB, C1D | N | u versus -u-w |
| 5 | AB, BB1 | N | u versus w |
| 6 | AB, C1C | N | u versus -w |
| 7 | AB, A1D1 | N | u versus v |
| 8 | AD, AA1 | N | v versus w |
| 9 | AD, BC | S | v versus v |
| 10 | AD, C1D | N | v versus -u-w |
| 11 | AD, BB1 | N | v versus w |
| 12 | AD, C1C | N | v versus -w |
| 13 | AD, A1D1 | S | v versus v |
| 14 | AA1, BC | N | w versus v |
| 15 | AA1, C1D | N | w versus -u-w |
| 16 | AA1, BB1 | S | w versus w |
| 17 | AA1, C1C | O | w versus -w |
| 18 | AA1, A1D1 | N | w versus v |
| 19 | BC, C1D | N | v versus -u-w |
| 20 | BC, BB1 | N | v versus w |
| 21 | BC, C1C | N | v versus -w |
| 22 | BC, A1D1 | S | v versus v |
| 23 | C1D, BB1 | N | -u-w versus w |
| 24 | C1D, C1C | N | -u-w versus -w |
| 25 | C1D, A1D1 | N | -u-w versus v |
| 26 | BB1, C1C | O | w versus -w |
| 27 | BB1, A1D1 | N | w versus v |
| 28 | C1C, A1D1 | N | -w versus v |

Complete same-direction unordered pair set:
`{(AD,BC), (AD,A1D1), (BC,A1D1), (AA1,BB1)}`.

Complete opposite-direction unordered pair set:
`{(AA1,C1C), (BB1,C1C)}`.

Counts: 4 S + 2 O + 22 N = 28 = 8*7/2.
The direction classes are `{AB}`, `{AD,BC,A1D1}`, `{AA1,BB1}`, `{C1C}`,
`{C1D}`; only the w and -w classes are opposite. The origin of C1C is C1, so it
points downward along a lateral edge. That does not make the diagonal C1D
another downward w-direction ray.

## Exercise 166: Nontransitivity And The Required Proof

Let h1 = R((0,0,0),(1,0,0)), h2 = R((1,0,0),(-1,0,0)),
and h3 = R((2,0,0),(1,0,0)). These are three distinct rays on the same line.

- h1 intersect h2 is the closed segment from x=0 to x=1, not a ray; so h1
  is opposite-direction to h2.
- h2 intersect h3 is empty, not a ray; so h2 is opposite-direction to h3.
- h1 intersect h3 is the ray x>=2; so h1 and h3 are same-direction, not
  opposite-direction.

This gives the literal antecedents of transitivity with a false conclusion.
Therefore opposite-direction is not transitive. A common point is not required
for the relation and is not a valid explanation of its transitivity.

For 166(2), if h1 is opposite-direction to h3 and h2 is opposite-direction to h3,
write d1 = -a d3 and d2 = -b d3 with a,b > 0. Then
`d1 = (a/b) d2`, a positive multiple. By the two selected definitions, h1 and
h2 are same-direction whether their supports coincide or are distinct parallel
lines. Origins do not enter this sign computation. This is a proof for all
allowed positions, not just the counterexample above.

## Exercise 167: Exhaustive Relative Positions

Given AB same-direction to MN and CD opposite-direction to MN, let MN have
direction d. Then `d_AB = a d`, `d_CD = -b d`, with a,b > 0. Thus AB and CD
are necessarily opposite-direction. Their support lines are either identical or
distinct parallel lines; nonparallel intersecting lines and skew lines are
excluded. Parallel directions in space lie in the plane spanned by d and the
origin displacement, unless the supports coincide.

Choose the positive coordinate on a common support to be the AB direction.
Write AB as `[a,+infinity)` and CD as `(-infinity,c]`. These four support/position
cases are complete:

| Case | Supports and origin order | Ray intersection | Concrete realization with MN in +x direction |
| --- | --- | --- | --- |
| P | Distinct parallel supports | Empty | A=(0,0,0), B=(1,0,0), C=(0,1,0), D=(-1,1,0) |
| L1 | Same support, a < c; directions face one another | Nondegenerate closed segment [a,c] | A=0, B=1, C=2, D=1 on the x-axis |
| L2 | Same support, a = c; common origin, opposite directions | Singleton {a} | A=C=0, B=1, D=-1 on the x-axis |
| L3 | Same support, a > c; directions point away | Empty | A=2, B=3, C=0, D=-1 on the x-axis |

Coordinates here describe possible endpoints of nondegenerate rays, not a
restriction that all named points be globally distinct; the source imposes no
such restriction. If desired, endpoints not used as origins may be chosen
farther along each ray without changing its set.

Each realization satisfies AB same-direction to a positive-x MN and CD
opposite-direction to it. If MN is fixed, block 10 provides the corresponding
unique ray at every chosen origin, so changing the support positions remains
legitimate.

On a common support no ray intersection is possible for opposite signs. Empty,
point and segment exhaust the three comparisons of a and c. With distinct
parallel supports there is no intersection. Equal rays, same-direction pairs,
nonparallel crossing support lines and skew support lines are impossible.
The word "opposite" specifies orientation, not whether the rays meet.

## Stage Boundary

Source solutions for all four exercises, the complete 28-pair table, a valid
nontransitivity witness, the universal double-opposite proof and all opposite
support cases are now frozen before learner input. Stage2 may inspect only
`geo910-n16-choice-learner-views.json` and compare its visible questions with
this frozen proof. No Stage3 key comparison, review JSON or validator is
authorized yet.
