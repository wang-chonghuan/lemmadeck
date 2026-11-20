# N43 author reasoning, recorded before alternatives

Private author-only artifact. No answer files, prior choices, interaction data,
or other authors' mathematical outputs were accessed. This is not a semantic
review or approval. Only the prepared written seed, selected definition block 6,
and fig-g10-05 plus its allowed FigureSpec/approved exact-SVG preview inform it.

## Conventions

These are spatial vectors in the orthonormal unit basis i,j,k. Coordinates may
be negative or zero. A nonzero vector has a direction; its angle to a basis
vector belongs to [0,pi]. Projected diagram lengths and circular glyph sweeps
are not spatial measurements. No first-octant or acute-angle premise is inferred.
State the basis and nonzero premise explicitly in the relevant learner stems.

## Independent complete solutions

- 8: a=(1,-1,1), b=(2,1,-3), c=(0,1,-1), d=(0,-2,0).
  The squared norms are respectively 3,14,2,4, so the norms are
  sqrt(3),sqrt(14),sqrt(2),2. All four original computations are retained.
- 9: write the common coordinate t. The squared norm equation is
  3t^2=9, so t=+sqrt(3) or -sqrt(3). There are exactly two spatial
  triples, not eight independent sign combinations and not only the positive
  triple. The equal-coordinate condition forces a common sign.
- 10: first a+b=(4,2,-3), squared norm 16+4+9=29, norm sqrt(29).
  Second b=-a, so a+b=(0,0,0), norm 0. The zero vector has a norm
  even though it has no direction. Both cases are retained.
- 11: first 2a+3b=(2,2,-2)+(6,0,0)=(8,2,-2), squared norm
  64+4+4=72, norm 6sqrt(2). Second 2a+3b=(6,2,0)+(0,3,-3)
  =(6,5,-3), squared norm 36+25+9=70, norm sqrt(70).
- 12: a dot b=(-1)6+2(3)+(-2)(-6)=-6+6+12=12.
  Norms are sqrt(1+4+4)=3 and sqrt(36+9+36)=9.
  Therefore cos(theta)=12/27=4/9 and theta=arccos(4/9) in [0,pi].
  An angle, rather than merely its cosine, is the requested response.
- 13: a-b=(-1,3,1), a+b=(3,1,1). Dot product is -3+3+1=1,
  each squared norm is 11, so cosine=1/11. Equivalently,
  (a-b) dot (a+b)=|a|^2-|b|^2=6-5=1. Orthogonality of a,b
  alone does not make their sum and difference perpendicular.
- 14.1: let L=sqrt(p^2+q^2+r^2)>0. The unit vector of the same
  direction is uniquely u=a/L since the scale factor is positive and
  |u|=1. As i,j,k are orthonormal unit vectors, a dot i=p,
  a dot j=q, a dot k=r. By the dot-product angle definition,
  cos(alpha)=p/L, cos(beta)=q/L, cos(gamma)=r/L.
  Therefore u=(cos(alpha),cos(beta),cos(gamma)), with signed coordinates.
- 14.2: squaring and summing these three equalities gives
  cos(alpha)^2+cos(beta)^2+cos(gamma)^2=(p^2+q^2+r^2)/L^2=1.
  This proof depends on the nonzero premise and Euclidean norm, not on an
  unsquared cosine sum or a diagram reading.
- 14.3: alpha=beta=60 degrees gives cos(gamma)^2=1-1/4-1/4=1/2.
  Both cos(gamma)=+1/sqrt(2) and -1/sqrt(2) are possible;
  gamma is 45 or 135 degrees. Witness unit coordinates
  (1/2,1/2,+1/sqrt(2)) and (1/2,1/2,-1/sqrt(2)) confirm both cases.
  Their squared lengths equal 1 and both initial angles are 60 degrees.
  The schematic picture is not a premise r>0.
- 15: direction-cosine triples in i,j,k order are respectively
  (1/sqrt(3),1/sqrt(3),1/sqrt(3)),
  (0,-3/sqrt(10),-1/sqrt(10)), (-1,0,0), (0,3/5,4/5).
  Norms are sqrt(3),sqrt(10),5,5. Preserve all twelve cosine values,
  especially zero components and negative-axis direction, without
  dividing by a component or forcing acute angles.

## Mathematical response units, decided before options

- 8: one native single complete four-norm result, in a,b,c,d order.
  The common coordinate-norm rule is the coherent unit, not four blank clicks.
- 9: one native multiple selecting every possible vector triple. The two
  possible signs are independent true candidates; no combination-code option.
- 10: one native single ordered result for both sums, including cancellation.
  This preserves the vector-addition-then-norm distinction.
- 11: one native single ordered result for both weighted sums. The same
  componentwise-linear-combination-then-norm reasoning spans both cases.
- 12: one native single complete angle in [0,pi].
- 13: one native single cosine of the explicitly constructed difference and sum.
- 14: one native single complete candidate proof chain covering all three
  subtasks: positive normalization, signed dot-product direction cosines,
  the squared identity, and both gamma possibilities. Choosing a formula alone
  would lose the core proof; each alternative must expose its derivation.
- 15: one native single complete four-row, three-column direction-cosine table.
  This retains normalization, coordinate order, zeros and negative directions.

## Capacity accounting

All selected original subtasks have mathematical result/argument coverage.
Choice cannot demonstrate producing a written computation, independently
constructing a proof, or a learner's intermediate error history. In particular
14 retains substantive proof-chain validity judgment but defers the ability to
produce the proof unaided. This is a real bounded capacity loss, not a claim
that recognizing a proof proves construction skill. No original diagram is
missing, no diagram construction is required, and no new figures are needed.
No semantic verdict is issued here.
