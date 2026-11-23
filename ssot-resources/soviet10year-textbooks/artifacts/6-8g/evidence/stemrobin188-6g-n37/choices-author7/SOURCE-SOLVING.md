# N37 Source Solving

Author-only source work, not an independent semantic review or approval.
Scope: the nine native prepared written seeds 479 through 487, their selected
definition paragraphs, and their three actual approved modern SVG assets.
No original or standard answer, old choice, reviewer output, interaction,
keyboard, application, database, model or paid-service input was consulted.
This file is to be made read-only before `draft.json` is created.

Seed canonical SHA-256:
`50d4be02cf0dba4e990514fddadc3c9f7268e54d39e174a86e86ef1ff9d5b02d`.
The native seed was already present and has not been rewritten.

## Definition Basis

Block 0 supplies translation of both rays to another vertex, with direction and
angle preserved. Blocks 3 and 5 define the angle between directions using rays
with a common origin and the convex angle, rather than a directed reflex angle;
block 3 explicitly permits 0 degrees for identical directions. Block 4 supplies
congruence when both corresponding directions are the same. These were the
actual selected full paragraphs, not a lookup of previous question standards.
The derivations below establish the opposite-direction and perpendicular-side
results from this basis; their conclusions were not obtained from an answer key.

## Actual Figure Observations

One image batch: 3 complete visual observations, one per SVG, with no crops,
reopens or additional image-bearing screenshots. Each complete rendering
included its rightmost and bottommost objects. The local read-only server
provided only the three whitelisted original SVG byte streams, not replacements.
The created source tab and the temporary server were closed after observation.

- `fig-229`, SHA-256
  `fbb24f5c3655702d5f5a59bf6aa38faad5db857834ba7591353fe31e61f2b971`:
  the upper vertex is O with subscript 1, with an up-right ray to A with
  subscript 1 and a down-right ray to B with subscript 1. The lower vertex O
  has similarly directed rays to A and B. An arrow goes from O to the upper
  vertex. Both convex sectors have arcs. The entire B label and lower ray,
  not just the top rays, were visible.
- `fig-230`, SHA-256
  `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a`:
  horizontal A-P-B lies above horizontal C-Q-D. A rising transversal has order
  M-Q-P-N. Thus PA and QC go left, PB and QD go right, PN and QN go up-right,
  and PM and QM go down-left. N at the upper end, M at the lower end and D
  at the right of the lower line were all visible.
- `fig-231`, SHA-256
  `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c`:
  horizontal A-B-C lies above horizontal F-D-E; the descending transversal has
  order R-B-D-P. D has a visible intersection dot. The alpha arc is the convex
  sector between BC (right) and BD (down-right), not between BA and BD.
  C, E and the bottom P label were all visible.

The visible modern labels are transcribed as A, B, C, D, E, F, M, N, O, P, Q, R
where each appears. Historical glyph alphabet/provenance is UNKNOWN; a
Latin/Cyrillic-looking glyph does not establish the original alphabet. The
source meaning or provenance of any tiny C-adjacent speck is UNKNOWN. No extra
point, incidence, angle, numerical measurement or side condition is inferred
from that speck. In particular, neither the geometry nor the later alternatives
will depend on interpreting it as a marked point.

## 479: Corresponding Same Directions

Required task: identify every pair of ordinary sectors at the two intersections
whose corresponding side directions are the same. Congruence alone is not the
criterion: reversing both side directions also preserves angle size.

Using the actual figure order, the four direction-preserving correspondences
are:

| At P | At Q | Corresponding directions |
| --- | --- | --- |
| angle APN | angle CQN | left, up-right |
| angle NPB | angle NQD | up-right, right |
| angle BPM | angle DQM | right, down-left |
| angle MPA | angle MQC | down-left, left |

These exhaust the four sectors at each intersection. Ray PQ could replace PM
and ray QP could replace QN, but such alternate spellings are not additional
mathematical answers. Pairs with both directions reversed may have equal
measures, but are not answers to this task; pairs with just one reversed side
are supplementary, not direction-preserving correspondences.

Meaningful response unit: one collection selection under the one shared
definition, not four separate yes/no questions or coded combinations.
Capacity limitation: recognizing the complete correspondence does not show
that a learner can independently enumerate and write all pairs.

## 480: Two Construction Orientations at M

The literal position clauses are:

1. "$M$ 在角 $AOB$ 的一条边上".
2. "$M$ 不在角 $AOB$ 的一条边上".

The second clause does not unambiguously say that M is on neither side.
It can describe failure to lie on a specified side, or be read colloquially as
being off both sides. The supplied definitions do not settle that wording.
Keep it literal, do not declare those clauses disjoint, and do not silently
replace the second clause by "M is outside the angle" or "on neither side".
This wording classification remains UNKNOWN. A construction invariant under
both readings is nevertheless available for every point M.

Translate the whole angle by the translation sending O to M. Its two image
rays start at M and respectively have the directions of OA and OB. This is
the same-direction construction. Replace both image rays by the opposite
rays on their respective supporting lines through M. Both corresponding
directions are then opposite to the given directions. This is the
opposite-direction construction. The first image angle has the original
measure by translation; the second has that measure by a half-turn at M.

When M lies on one original side, the corresponding supporting line through M
is that existing side's line; there need not be a distinct parallel line.
Its correct half-ray is fixed by direction, not by requiring it to pass
through A or B. For example, if M lies beyond A on OA, MA points opposite
to OA. If M=A, the notation "ray MA" cannot define a nonzero ray at all.
When M is elsewhere, take the corresponding parallel direction through M.
The translation construction handles that case too, without deciding which
reading of clause 2 was intended. If M=O, the first translation is the identity
and the same construction still applies.

Meaningful response unit: one complete procedure covering both positional
clauses and both requested orientations. The two positions do not require
different questions because the same mathematical operation solves all of them.
Capacity limitations: no physical construction, ruler/parallel construction
technique or student-drawn choice of half-rays is demonstrated; the wording
ambiguity is not resolved by a correct procedure.

## 481: Collinear Directions, Not Distances

B is strictly between A and C, so A, B, C are collinear in that order.
AB and BC point along the same direction: their directional angle is 0 degrees.
CB points back along the line, opposite to AB: their directional angle is
180 degrees. AB and BC need not have equal lengths; moving their origins to
a common point preserves directions and settles both requested results.

Meaningful response unit: the complete ordered two-result correspondence,
which contrasts equality of directions with reversal. Do not split it into
isolated numeric cells.
Capacity limitation: selection does not demonstrate spontaneous written
enumeration or an independently drawn collinear representation.

## 482: Constructing a Common-Origin Angle from Two Rays

Draw the chosen nonzero rays AB and CD. Their origins are A and C, and no
coincidence of those origins is given. Translate AB by the translation
sending A to M. Independently translate CD by the translation sending C to M.
The two image rays now both start at M and keep the original respective
directions. Their convex angle, with 0 degrees for identical directions,
is by definition the angle between the original two directions. Opposite
directions give the straight 180-degree limiting case; the source tasks 481
and 485 also require that directional value.

A single common translation of the two whole rays would generally retain
different origins, since a translation cannot identify distinct points A and C.
Joining M directly to B and D is not a direction transport in general.
Reversing only one transported direction gives the supplementary, not
generally the requested angle. Selecting the reflex sector would use a
different quantity from the supplied definition.

Meaningful response unit: one complete two-translation construction, not a
choice of one endpoint or one intermediate angle.
Capacity limitations: drawing the original rays and the final angle,
constructing parallels through M, and independently selecting the appropriate
sector on a produced drawing cannot be tested by text recognition.

## 483: Both Corresponding Sides Opposite

Let the first angle have rays u and v at O and the second have rays u' and v'
at V, where u' is opposite to u and v' is opposite to v. Translate the first
angle from O to V. Apply a half-turn about V to both translated rays.
The first resulting ray coincides with u' and the second with v', because a
half-turn reverses each direction and keeps the origin fixed. Translation and
half-turn both preserve the convex angle. The original and target angles are
therefore congruent.

Equivalently, at a common vertex the two angles are opposite sectors bounded
by two intersecting lines. It is essential that both rays, not just one, are
reversed. A quarter-turn or translation alone does not perform that mapping.

Meaningful response unit: a complete proof chain identifying the common
vertex, the required transformation and both matched rays.
Capacity limitation: recognizing a sound chain does not demonstrate generating
or writing the proof without supplied alternatives.

## 484: One Same Direction and One Opposite Direction

Translate the first angle to the second vertex so the same-direction
corresponding rays coincide. The other two rays are opposite, so lie on one
straight line through the common vertex. The two convex sectors are adjacent
and together form a straight angle, not a full revolution or a pair of
vertical angles. If the measures are x and y, x+y=180 degrees.
For the right-angle case each is 90 degrees; equality need not hold otherwise.

Meaningful response unit: a complete adjacent-angle proof chain. This is not
interchangeable with 483, whose transformation reverses both sides and yields
congruence.
Capacity limitation: supplied-proof recognition does not demonstrate original
proof production or construction of an auxiliary common-origin diagram.

## 485: Compass Direction Angles

Use the usual compass meanings of the written direction words, not an angle
measured clockwise along a travel route. South and west are adjacent cardinal
directions, giving 90 degrees. South and north are opposite, giving 180
degrees. Southeast bisects the east-south quadrant, so east and southeast give
45 degrees. The supplied definition selects the smaller convex angle, not
270 or 315 degrees. No numeric scale is read from a picture.

Meaningful response unit: one complete ordered three-direction result,
preserving all three distinctions (quarter-turn, reversal, half-quadrant).
Capacity limitation: selection does not show independently written compass
calculations or construction of a compass rose.

## 486: Equal Sectors and Separated-Origin Directions

The actual figure gives A-B-C above F-D-E, R-B-D-P on the transversal, and
angle CBD=alpha, with AC parallel to FE. The four sectors equal to alpha are:
CBD (the already marked angle), ABR at B, EDP at D, and FDR at D.
The other four sectors at those vertices, CBR, ABD, EDR and FDP, measure
180-alpha. In the drawn nonright configuration the two groups are distinct.
This distinction comes from the pictured alpha sector and incidence; it is
not a measured numerical alpha invented from the slope.

For the directional-angle part, preserve all four requested ordered pairs:

| Ray directions | Result | Reason |
| --- | --- | --- |
| BC and DE | 0 | both go right |
| BC and DF | 180 degrees | right and left are opposite |
| BA and DR | alpha | both reverse the directions of BC and BD |
| BR and DE | 180-alpha | BR reverses BD, whereas DE keeps BC's direction |

The third line uses reversal of both rays, not merely parallel supporting
lines. The fourth line reverses only one ray, hence the supplement. This is
the difference between a geometric sector and an angle between directions
whose original rays have different vertices.

Meaningful response units: one collection selection for the unmarked
alpha-equal sectors, with the marked CBD explicitly acknowledged, and one
complete four-row correspondence for the separate directional-angle task.
The source's two parts are genuinely different operations; the second is not
another enumeration of the first.
Capacity limitations: cannot show independently enumerating the sectors,
writing all four results, or drawing auxiliary translated rays. Acknowledging
the visibly marked CBD avoids turning its label into an incidental copying
question, but does not omit it from the full source solution.

## 487: Corresponding Perpendicular Sides, Same Angle Type

The required types are BOTH ACUTE or BOTH OBTUSE, not "each is acute or obtuse"
independently and not a mixed acute-obtuse pair. No right-angle case is
substituted for the stated source.

Let the first convex angle have measure x and the second y. Rotate both rays
of the first by the same 90-degree rotation, and translate its vertex to the
second vertex. Each target ray is parallel to the corresponding rotated ray,
because both are perpendicular to the original direction. Each target direction
can coincide with that rotated direction or be opposite. If both choices are
the same (both same, or both opposite), y=x by same-direction congruence or
the half-turn proof above. If one is same and the other opposite, y=180-x
by the adjacent-angle proof above. These exhaust the possible choices.

If both angles are acute, 0<x,y<90: the relation y=180-x would instead force
y>90, a contradiction. If both angles are obtuse, 90<x,y<180: it would force
y<90, also a contradiction. Consequently y=x in either stated type.
Perpendicularity between corresponding sides does not say that the two
sides within either angle are perpendicular, nor does it prescribe the same
signed quarter-turn for each corresponding ray.

Meaningful response unit: one proof chain covering the exhaustive same/opposite
direction cases and separately excluding supplementation for both stated types.
Capacity limitations: recognizing that chain cannot demonstrate independently
developing the transformation argument, its exhaustive orientation split, or
the two inequality contradictions. The two type cases remain explicit rather
than silently reducing the theorem to an acute-only example.

## Scope and Unresolved Facts

Every selected seed has a full source solution or an explicitly identified
wording uncertainty with an invariant solution. No numeric answer depends on
an unresolved alphabet convention or C speck. No new figure is mathematically
necessary: existing fig-230 and fig-231 can support the two figure tasks, while
the other constructions and proofs can use complete textual procedures.
Recognition will not establish the production capacities listed above. Those
losses must be carried into both question intent and source coverage.

No semantic gate, independent PASS or publisher action is part of this author
handoff. Later review must begin with source and visible views, not with this
author's keys or derivations.
