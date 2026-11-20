# N12 affected-only independent review: source-first stage

Reviewer: Codex independent reviewer, n12-choice-review, 2026-11-19.
This reviewer did not author the repair. No new conversation, worktree, branch,
browser, image inspection, database, network, installation or backend action.
At this stage only the current seed, review/contract and the two explicitly
authorized definition lesson texts have been read. Neither candidate views nor
author solutions/keys nor previous mathematical reviews have been read.

## Source 99

Write the parallel projection as P(X)=X-d*n(X)/n(d), after translating the
target plane to n(X)=0, with n(d) nonzero. On the two-dimensional direction
space U of a source plane, the restriction has rank two when d is not in U,
and rank one when d is in U. It cannot have rank zero.

- A whole plane therefore has image a whole plane or a whole line.
- A closed halfplane has image a closed halfplane in rank two. In rank one,
  write it as O+s*u+t*v with s real and t nonnegative, where u is the boundary
  direction. If P(u) is nonzero, varying s fills the whole image line. If
  P(u)=0, P(v) is nonzero and the image is a closed ray. Its possible images
  are exactly halfplane, line, ray, not a point or a whole plane.
- The authorized geo68-c1-s12 definition includes the sides and the chosen
  region; two noncollinear sides determine both a convex and a nonconvex angle.
  In rank two an invertible linear map takes rays to distinct noncollinear
  rays and preserves membership in the chosen sector. A negative determinant
  reverses orientation, not membership: it does not turn a convex sector into
  its complementary nonconvex sector. Convex and nonconvex nonstraight angles
  both occur as images, of the corresponding source sectors.
- In rank one a convex sector is the nonnegative cone of its two independent
  side vectors. Their projected values cannot both vanish. With one zero or
  both of the same sign its image is a ray; with opposite signs it is a line.
  A nonconvex sector contains directions spanning more than a half-turn, so
  every nonzero linear functional takes both positive and negative values
  there. Scaling those points gives the whole image line, never just a ray.
  Consequently the exhaustive union over admissible source angles is a
  nonstraight convex angle, a nonconvex angle, a ray, or a line. It is not a
  point, plane or halfplane.

The seed does not select the halfplane/angle convention in its concept blocks.
The expressly authorized text at
ssot-resources/soviet10year-textbooks/artifacts/6-8g/lessons/geo68-c1-s12/lesson.md
settles that convention without viewing its figures.

## Source 101

For parallel source lines with direction u not parallel to d, the images have
the common nonzero direction P(u). They may be distinct or coincident. The
authorized geo910-c1-s1-n4 text expressly says that when M belongs to a, the
unique line through M parallel to a is a itself. In that wide convention,
coincidence is not a counterexample to "parallel images are parallel".
The exception is d parallel to u: both source lines collapse to points, so
one cannot conclude that their images are parallel lines. No existing q04
view, key, image or mathematical review is re-examined at this stage.

## Source 104

1. The converse is false. For example take alpha: z=0, d=(0,0,1),
   a={(t,0,t): t real}, b={(s,1,2s): s real}. The directions (1,0,1) and
   (1,0,2) are not parallel, and the lines are skew (their scalar triple
   product with displacement (0,1,0) is nonzero). Their projected lines
   y=0 and y=1 in alpha are distinct and parallel.
2. Let u,v be the independent directions of skew a,b and let beta be a
   plane with direction space span(u,v). Parallel nondegenerate image
   directions require the restriction of P to span(u,v) to have rank one,
   which is equivalent to d belonging to span(u,v). The projection itself
   also requires n(d) nonzero.
   If beta is parallel to alpha, n vanishes on span(u,v), so these two
   requirements are incompatible: there is no permitted l.
   Otherwise choose within beta a direction d avoiding the three directions
   u, v and beta intersection alpha. There are infinitely many remaining
   directions in a plane. Then d is permitted, P(u),P(v) are nonzero and
   dependent, and both images are lines with the same direction.
   They are distinct: coincident images would place a and b in the same
   preimage plane (the image line together with direction d), contradicting
   skewness. Thus l in that chosen direction solves the construction.
   Choosing only an arbitrary direction in beta is insufficient, since it
   can collapse a or b or make the projection undefined.

In this book "construct" in spatial geometry means proving existence, as the
authorized geo910-c1-s1-n4 text states. A conditional construction recognition
question can preserve the existence/no-solution distinctions, while the loss
of independent production of the construction must remain explicit.
