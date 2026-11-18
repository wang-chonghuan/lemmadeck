# Blind visible-question gate

Saved after blind-solutions.md and after reading ONLY `{id, view}` projections
from n35.draft.json. No internal intent, key, rationales, coverage, standard
answers, author solution or author report has been disclosed at this phase.
No additional images opened (image count remains 2).

## Fidelity, redundancy, leakage: preliminary judgments before key comparison

- q324: pass. Requires both incidence and two perpendicularities for all three
  original line pairs. It is recognition rather than free naming. Giving the
  definition does not give the actual cuboid segments. The alternate answers
  to the second and third pairs require geometric rejection.
- q325: pass. Preserves the distinction between contained and strictly parallel;
  skewness and the alpha-normal line remain explicit. Not answerable by a
  segment length from another question.
- q326: pass with production loss to verify later. Source construction becomes
  recognition and O is supplied, so independent location/drawing of the foot
  is no longer tested. Still requires identifying AO, rather than BO or AA1,
  and computing the distance, rather than copying a stated length.
- q327: pass with production loss to verify later. Both correct midpoint
  construction and distance from face area are required in one response.
  Midpoints are not supplied in the stem; endpoint connectors must be rejected.
- q328: pass. Requires opposite-edge rather than vertex-to-face or
  vertex-to-opposite-side distance. The numerical agreement with q326 does not
  prove that these differently situated lines have that distance.
- q329: pass with production loss to verify later. The universal quantifier
  and reason for every connector's bisection remain. It is valid-argument
  recognition rather than independent proof composition. Signed-distance
  cancellation captures the opposite-side and equal-distance requirements.

Each question tests a different line arrangement or inference. None displays a
source number, author key, correct-answer marker, or another question's answer.
The shared cuboid merely supplies consistent labels. Options are not duplicated
or equivalent within any question; complete-option judgment remains necessary.

## Independent option solutions and exact true sets

q324 true set: A,C,D.

- A true: A1B1 joins A1 on A1D1 and B1 on BB1, along the third edge direction.
- B false: BB1 has the right vertical direction but B does not lie on DC.
- C true: CC1 joins C on DC and C1 on B1C1, perpendicular to both horizontal
  edge directions.
- D true: BC joins B on AB and C on CC1, perpendicular to x and z directions.
- E false: AB1 never meets CC1 and has a nonzero x and z component, so it is
  perpendicular to neither AB nor CC1.

q325 true set: B.

- A false: the common perpendicular meets the alpha-contained line and has
  alpha-parallel direction, hence is contained, not disjoint.
- B true: from the perpendicular line's foot P in alpha drop perpendicular
  PQ to the contained line; PQ is the common perpendicular.
- C false: an alpha-normal segment is parallel to the second given line,
  not perpendicular to it.
- D false: perpendicularity to the alpha-normal line gives alpha-parallel
  direction and rules out an oblique crossing.

q326 true set: C.

- A false: BO is on BD and cannot be perpendicular to it; its endpoints do
  not meet AA1. Its numerical length does not repair the segment claim.
- B false: AO is the correct segment but |AO|=a/sqrt(2), not a sqrt(2).
- C true: O=(a/2,a/2,0), AO perpendicular to BD and AA1, |AO|=a/sqrt(2).
- D false: AA1 is itself a given line and is not perpendicular to itself;
  it does not meet BD.

q327 true set: A.

- A true: midpoint connector direction (a,0,0) is perpendicular to both
  (0,a,-a) and (0,a,a). Its length is a=sqrt(2) cm.
- B false: same correct connector but its length is sqrt(2) cm, not 1 cm.
- C false: A1B has direction (a,0,-a), giving dot products a^2 and -a^2
  with the given line directions. Its actual length 2 cm is not their distance.
- D false: DC1 has direction (a,0,a), giving dot products -a^2 and a^2
  with the given line directions. Its actual length 2 cm is not their distance.

q328 true set: D.

- A false: a/2 is half an edge, not the separation of opposite edges.
- B false: sqrt(3)a/2 is a face median, whose endpoint C is not the
  midpoint of CD giving the common perpendicular.
- C false: sqrt(6)a/3 is the vertex-to-opposite-face altitude, not the
  opposite-edge distance.
- D true: midpoint connector MN is perpendicular to AB and CD;
  MN^2=(sqrt(3)a/2)^2-(a/2)^2=a^2/2.

q329 true set: C.

- A false: moving P away from M with Q=N creates a tangential component
  along the first line; PQ is then not parallel to MN. Its midpoint is
  nevertheless in gamma.
- B false: the endpoint planes lie on opposite sides, not the same side;
  two equal same-sign distances average to that same nonzero distance.
- C true: line directions are perpendicular to MN, so each line has
  constant signed distance, -|MN|/2 and +|MN|/2. Their midpoint has zero.
- D false: motion along either line changes only tangential coordinates,
  never the distance to gamma.

## Awaiting internal comparison

Construction/proof production losses must be explicitly recorded in the draft.
All six key sets above are independent, not copied or normalized to author keys.
Only after this saved checkpoint may the full draft be read.
