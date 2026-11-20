# N43 Independent Source Solutions: First Evidence

Reviewer: authorized single independent agent, same188-6 / STEMROBIN-188.
Date: 2026-11-20. This record was written BEFORE reading any draft view,
private choice solution, key, coverage, report, or standard-answer candidate.
Only seed exercises 8-15 and definition block 6 supplied the written tasks.
The current FigureSpec was read solely to interpret the allowed asset.
No prior answers, choices, interactions, or book answer source were consulted.

## Input Binding

- Seed raw SHA-256: `86242128195f1d2dd75e73826ae326baccb5881a866235132198c355ed637af9`.
- Seed canonical SHA-256: `75204133e80f74e97df5ece24ce126da163c5f6373010722995f3e68527d25d5`.
- Definition block 6: vector length is the square root of the sum of squared coordinates.
- Convention: orthonormal spatial basis i,j,k; direction angles lie in [0,pi].
  A vector with direction angles is necessarily nonzero.
  There is NO general positive-coordinate or acute-angle assumption.

## Actual Figure Observation

Actual open 1: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n43-figures/fig-g10-05.preview.png`.
PNG SHA-256: `b208a7c07dc22b876978aa23f05de2e64e906b284424dc1ee2f51f7fe51fe022`.
The whole square canvas is visible: common unmarked tail; k arrow up, j arrow
right (including the rightmost arrowhead and label), i arrow down-left
(including the bottommost label), a arrow up-right. Greek alpha associates
i with a, beta j with a, gamma k with a. All four arrowheads and labels and
all three angle marks are visible. There are no numeric givens or answers.
The screen projection does not measure three-dimensional angles, does not
establish spatial collinearity of the nearly aligned i/a rays, and does not
impose r>0 or gamma acute on the arbitrary vector in exercise 14.
This is exercise-semantic inspection of an inherited approved modern figure,
NOT new figure approval or a rerender.

Seed SVG path: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-05.svg`.
Actual-byte SHA-256 agrees with seed:
`623558b4a090909da9af9e45dceb08b4dbf9846cbd2b19075ed67547b16c0f05`.

Actual open 2: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-05.png`.
Original PNG SHA-256:
`ead0b7efbccc03c7d8205535a406dd7b6be2da7697567dd34b596337255f2cc7`.
The full original has the same four rays from an unmarked common tail, i
down-left, j right, k up, a up-right, with three Greek direction-angle
associations. Its thinner traces are crowded near k/a. No degree values,
coordinates, sign restriction, or numerical solution are present.
Actual image counter at this checkpoint: 2 opens / batch maximum 8;
context image count 2 / maximum 24. No crops or reopens.

## Independent Solutions in Original Order

### 8

1. a=(1,-1,1), |a|=sqrt(1+1+1)=sqrt(3).
2. b=(2,1,-3), |b|=sqrt(4+1+9)=sqrt(14).
3. c=(0,1,-1), |c|=sqrt(0+1+1)=sqrt(2).
4. d=(0,-2,0), |d|=sqrt(4)=2; length cannot be -2.

### 9

Write the equal coordinates as (t,t,t). The length condition gives
sqrt(3t^2)=3, hence t^2=3 and t=+sqrt(3) or -sqrt(3).
The COMPLETE set is {(sqrt(3),sqrt(3),sqrt(3)),
(-sqrt(3),-sqrt(3),-sqrt(3))}. Mixed-sign triples fail equality of coordinates,
even when their lengths are 3. No premise selects only the positive triple.

### 10

1. a+b=(4,2,-3); |a+b|=sqrt(16+4+9)=sqrt(29).
2. a+b=(0,0,0); |a+b|=0. Adding individual lengths is invalid.

### 11

1. 2a=(2,2,-2), 3b=(6,0,0), so 2a+3b=(8,2,-2);
length sqrt(64+4+4)=sqrt(72)=6sqrt(2).
2. 2a=(6,2,0), 3b=(0,3,-3), so 2a+3b=(6,5,-3);
length sqrt(36+25+9)=sqrt(70).

### 12

a dot b=-6+6+12=12, |a|=sqrt(1+4+4)=3,
|b|=sqrt(36+9+36)=9. Thus cos(theta)=12/(3*9)=4/9.
The requested ANGLE is theta=arccos(4/9), not the number 4/9.
The unique principal angle lies in [0,pi] and is approximately 1.110242335
radians (63.6122 degrees). Exact arccos form is sufficient.

### 13

u=a-b=(-1,3,1), v=a+b=(3,1,1).
u dot v=-3+3+1=1. Both squared lengths are 11.
Therefore cos(angle(u,v))=1/(sqrt(11)*sqrt(11))=1/11.
Equivalently u dot v=|a|^2-|b|^2=6-5=1.

### 14

Let L=|a|=sqrt(p^2+q^2+r^2)>0. As the basis vectors have unit length,
a dot i=p=L cos(alpha), a dot j=q=L cos(beta),
a dot k=r=L cos(gamma). Thus their cosines are p/L,q/L,r/L.

1. u=a/L has coordinates (p/L,q/L,r/L) and length 1.
   The scalar 1/L is positive, so u has the SAME direction as a.
   Substituting the three dot-product equalities gives
   u=(cos(alpha),cos(beta),cos(gamma)). Using a negative scalar would
   reverse the direction.
2. Summing the squared coordinates of u gives
   cos^2(alpha)+cos^2(beta)+cos^2(gamma)
   =(p^2+q^2+r^2)/L^2=1.
   This needs all three components, not a planar two-component identity.
3. alpha=beta=60 degrees gives cos^2(gamma)=1-1/4-1/4=1/2.
   Therefore cos(gamma)=+sqrt(2)/2 OR -sqrt(2)/2.
   On [0,180 degrees], gamma is 45 degrees OR 135 degrees.
   Both occur, e.g. for unit vectors (1/2,1/2,+sqrt(2)/2) and
   (1/2,1/2,-sqrt(2)/2). The arbitrary schematic supplies no extra sign
   condition, so an exclusively acute answer is incomplete.

### 15

For each nonzero vector v, the ordered cosines with (i,j,k) equal v/|v|.

1. (1,1,1)/sqrt(3)=(1/sqrt(3),1/sqrt(3),1/sqrt(3)).
2. (0,-3,-1)/sqrt(10)=(0,-3/sqrt(10),-1/sqrt(10)).
3. (-5,0,0)/5=(-1,0,0).
4. (0,3,4)/5=(0,3/5,4/5).

The negative entries are essential: the second vector has obtuse angles
with j and k, and the third has angle pi with i. Components zero give
right angles, not missing direction angles.

## Phase Order Checkpoint

FIRST-source.md now exists as the immutable initial reasoning record.
Next allowed disclosure: ONLY questions[].view projected from the current
draft with a JSON parser. Source mappings, keys and author reasoning remain
unread until learner-view fidelity and complete per-option truth records
have themselves been persisted.
