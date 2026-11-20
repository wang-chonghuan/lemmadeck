# N12 affected-only independent review: view-only stage

This stage follows source-first.md and precedes opening author intent/key.
Only entries 10 and 11 of the supplied view-only array have been displayed.
The original nine views have not been reopened for semantic review.

## n12-q10

The question expressly supplies the closed-halfplane and sector conventions,
including convex and nonconvex angles. It asks for exhaustive classifications
of all three source objects rather than isolated cells. Single is appropriate.
The definition alone does not give the rank or image classifications.

- A is true: plane -> plane or line; closed halfplane -> halfplane, line or
  ray; nonstraight sector -> nonstraight sector (convex or nonconvex), line or
  ray. These are exactly the possibilities derived in source-first.md.
- B is false because a two-dimensional plane cannot collapse to a point
  under a projection whose kernel is one-dimensional.
- C is false because a halfplane whose boundary has nonzero rank-one image
  fills the image line, and a sector with opposite-sign side images also
  fills a line. A nonconvex sector necessarily has that full-line image in
  rank one. Both missing line entries are genuine omissions.
- D is false because the source plane can contain the projection direction;
  then its image is a line, and the halfplane and sector can have the
  rank-one images just described.

Independent correct set: {A}. No figures, source numbers, answer key, solved
example or internal mapping appear in this learner-facing subtree. The
alternatives have shared formatting and comparable complete-list structure.
Recognition and elimination remain possible, but neither silently removes
the three source object classes. The inability to generate a classification
or exhibit cases independently is a response-production limitation to check
against the author's later declaration, not grounds to invent a failure.

## n12-q11

The target of two different parallel image lines is appropriate: skew source
lines cannot have coincident nondegenerate image lines. The stem supplies the
direction plane beta, so the response tests feasibility and direction
selection rather than independently discovering beta.

- A is true. If beta is parallel to alpha, no direction within beta is a
  defined projection direction, and directions outside beta leave the two
  image directions independent. Otherwise excluding directions of a and b
  prevents line-to-point collapse; excluding beta intersection alpha ensures
  the projection is defined. A direction remains after three exclusions.
  Rank one on beta makes the images parallel, and skewness makes them distinct.
- B is false. When beta is parallel to alpha every direction in beta is
  invalid. Even in the intersecting case an arbitrary direction can be the
  intersection direction or the direction of a/b.
- C is false. Where the a direction is valid it collapses a to a point;
  if a is parallel to alpha it does not even define the required projection.
- D is false. A direction parallel to beta intersection alpha lies in alpha,
  so its projecting lines do not intersect alpha uniquely.

Independent correct set: {A}. No figures or internal key/mapping are visible.
The longer conditional option is substantive, not a typographic correctness
signal: it contains the three mathematical restrictions that must be judged.
The supplied beta and recognition response lose discovery/production of the
construction; that limitation must be declared. The no-solution case and
nondegenerate/different-image conditions must not be silently omitted.

## Package boundary

q10 concerns projection rank on a source plane and its regions; q11 concerns
the two-direction plane of skew lines and existence of a valid kernel direction.
Neither new question discloses the other's true option or depends on its answer.
The original nine PASS records will be carried forward only after exact
content comparison; they are not replaced by a new semantic or visual review.
The current coverage must retain the old 104 converse question and add the
conditional construction, and 101 must distinguish coincidence from collapse.
