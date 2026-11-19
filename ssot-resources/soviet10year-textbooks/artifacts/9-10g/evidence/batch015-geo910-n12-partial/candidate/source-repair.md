# n12 Affected Source Reasoning

Ticket STEMROBIN-184, worker184-3, continued offline development.
The original rejected seed, draft and reviews remain unchanged. This note uses
their permitted written-task projection and the already observed, unchanged
definition figures; no images, answers or other lessons' choice sets were read.

## 99(1): Complete Plane Image

Let P project along d onto alpha, and let U be the two-dimensional direction
space of the source affine plane pi. The kernel is the one-dimensional span(d).
If d is in U, the restriction has rank one and the image is an entire line.
Otherwise the restriction has rank two and its image is the entire alpha.
Rank zero is impossible because U cannot be contained in a one-dimensional
kernel. Both ranks occur: in coordinates P(x,y,z)=(x,y,0), pi:y=0 gives a
line, and pi:z=1 gives alpha. The image is never just a point or a half-plane.
Recognition can preserve this complete classification without demonstrating
independent construction or proof.

The half-plane boundary and angle-set/zero/reflex conventions for 99(2)/(3)
remain unresolved. Completing 99(1) does not resolve those tasks or approve n12.

## 101: Broad Parallelism And Different Image Lines

The book permits coincident lines to be parallel. For two distinct parallel
source lines of direction u in plane pi, only u parallel d destroys the
line-image statement: each line becomes a distinct point. When u is not
parallel d but d belongs to the direction plane of pi, the two line images
coincide and are still parallel in the book's sense. If d is outside that
direction plane, the images are distinct parallel lines.

The unchanged q04 explicitly asks the stronger question of when there are
not two DIFFERENT parallel image lines. Its A/B set correctly covers collapse
and coincidence. Its source accounting must distinguish that derived task from
the original broad statement; it does not elicit a separate judgment that
coincident noncollapsed images still satisfy the original statement.

## 104(2): Feasibility And Conditional Construction

Let u and v be the independent directions of the skew lines a and b.
Construct the plane beta through a with direction span(u,v), parallel to b.
A legal projection direction d yields two nonzero parallel image directions
if and only if d belongs to span(u,v), is parallel to neither u nor v, and
is not parallel to alpha. Necessity follows by taking the nonzero linear
combination of u,v whose projected vector is zero. Sufficiency follows because
the quotient of span(u,v) by span(d) is one-dimensional and neither source
direction vanishes.

If beta and alpha have the same direction plane, no such d exists.
Otherwise choose a line l in beta whose direction is parallel to neither a
nor b and is not parallel to alpha. Only at most three one-dimensional
directions in a two-dimensional direction plane are excluded, so choices exist.
The images are different: if they coincided, their inverse-image plane would
contain both original lines, contradicting skewness.

The learner-facing response should recognize the complete two-branch
construction/investigation, not assume feasibility for every given alpha.
It cannot establish independent drawing or production of the proof.
Selecting a direction outside beta fails the necessary dependence condition;
selecting a's direction collapses a; reversing the feasibility branch violates
the projection definition.
