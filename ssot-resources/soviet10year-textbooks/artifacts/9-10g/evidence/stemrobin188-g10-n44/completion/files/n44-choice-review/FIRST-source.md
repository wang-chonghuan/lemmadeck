# FIRST: source-only independent solutions

Reviewer: SAME188-6 independent reviewer for STEMROBIN-188. These solutions were
completed before opening any choice draft field or any standard-answer candidate.
Authority: current modern-us-neutral n44 written exercises 16-22 and definition
blocks 0, 1, 2, 7, plus actual seed SVGs 6 and 7 rendered to owned offline PNGs.
No old answers, previous choices, author FIRST, private keys, ticket mathematics,
review reports, or author reports were read.

Disclosure: one initial lesson projection incorrectly returned the whole prose
array, exposing the current lesson's worked examples after block 7. This was a
projection-boundary error, not an author/key exposure. They are not accepted as
independent proof; the explicit coordinate computations below are the evidence.
Subsequent projection selected only blocks 0, 1, 2, 7. No inherited images opened.

## Definitions and image observations

Coordinates are ordered coefficients of the orthogonal basis i,j,k, not projected
pixel distances. Fig 6 shows O as the common tail, i down-left, j right, k up, and
the complete OM arrow ending at M top-right. Fig 7 shows A on positive x along i,
B on positive y along j, C on positive z along k, O at the intersection, M off the
axes, and three dashed negative extensions. The complete right edge (B,y,M) and
bottom edge (x and negative z) are visible. These are conceptual perspective
figures, not measured plots of the exercise points.

Actual viewed assets: owned previews/fig-g10-06.png and previews/fig-g10-07.png.
preview-bindings.json binds each rendered PNG to the actual current SVG bytes.
Two image loads, one batch, no crops/reopens; batch <=8 and context <=24.
Original PNGs and FigureSpecs were not opened; inherited source/figure production
passes are not rerun or repaired by this review.

## 16: construct all five points

For each named point construct the endpoint of xi+yj+zk, retaining coordinate
order, sign, and fractional displacement. Starting at O, travel the signed x
displacement, then a parallel signed y displacement, then a parallel signed z
displacement:

- A: 2i+3j+k; intermediate points (2,0,0),(2,3,0),(2,3,1).
- B: i-j+2k; (1,0,0),(1,-1,0),(1,-1,2).
- D: -3i+(1/2)j-k; (-3,0,0),(-3,1/2,0),(-3,1/2,-1).
- E: 2j-3k; (0,0,0),(0,2,0),(0,2,-3), in Oyz, not on an axis.
- G: -(3/2)k; (0,0,-3/2), on negative Oz, also in Oxz and Oyz.

A,B,D are in no coordinate plane since all three components are nonzero. Drawing
the points is an original productive task; mere restatement of input coordinates
does not independently demonstrate construction.

## 17: directed endpoint subtraction

PQ=OQ-OP. Part 1: (-1-2,2-(-3),-3-0)=(-3,5,-3).
Part 2: (-3/5-1/2,0-(-4/3),2/3-5/6)=(-11/10,4/3,-1/6).
All three components in each triple are ordered and signed; reversing endpoints
negates the entire triple.

## 18: projection then length

Oyz is x=0. The orthogonal projection of A(2,-3,1) is B(0,-3,1).
OB=(0,-3,1); its length is sqrt(0+9+1)=sqrt(10), positive.
The projection distance AB=2 and the original OA=sqrt(14) are different quantities.

## 19: axis constraint and unique solution

Write X=(0,t,0), t real. XA^2=4+(t+1)^2+1=t^2+2t+6.
XB^2=(t-1)^2+9=t^2-2t+10. Equating gives 4t=4, t=1.
Thus X=(0,1,0). Each squared distance is 9, so each distance is 3.
Cancellation yields a nonzero linear coefficient, hence no additional real cases.

## 20: all original subtasks

A1=(B+C)/2=(7/2,1/2,4).
AA1=(1/2,5/2,3), |AA1|^2=1/4+25/4+9=62/4,
so |AA1|=sqrt(62)/2.

B1=(A+C)/2=(7/2,-1,2).
BB1=(1/2,-2,-3), |BB1|^2=1/4+4+9=53/4,
so |BB1|=sqrt(53)/2.

Median intersection T=(A+B+C)/3=(10/3,-1/3,3).
OT^2=(100+1+81)/9=182/9, |OT|=sqrt(182)/3.

AB=(0,3,4), AC=(1,2,2), BC=(1,-1,-2);
|AB|=5, |AC|=3, |BC|=sqrt(6).
At A, AB dot AC=14, cos A=14/15.
At B, BA dot BC=11, cos B=11/(5sqrt(6)).
At C, CA dot CB=-5, cos C=-5/(3sqrt(6)).
Internal angles, each in (0,180 degrees):
A=21.039469781317237 degrees,
B=26.084541552047035 degrees,
C=132.87598866663575 degrees.
Sum=180 degrees. The obtuse C angle must not be replaced with its acute supplement.
AA1 and BB1 are whole medians, not the two-thirds segments ending at T.

## 21: no unannounced vertex-order convention

The source names three vertices but does not say they are consecutive or that the
polygon is ABCD. Three noncollinear vertices admit three completions, one for
each possible pair of opposite known vertices. AB=(-3,7,1), BC=(-1,-3,0),
AC=(-4,4,1); their squared lengths are 59,10,33. AB cross AC=(3,-1,16)
is nonzero; all three parallelograms are nondegenerate.

1. A,C opposite: D=A+C-B=(0,-6,0). Diagonals AC and BD have
   lengths sqrt(33) and sqrt(105), since BD=(2,-10,-1).
2. A,B opposite: D=A+B-C=(2,0,0). Diagonals AB and CD have
   lengths sqrt(59) and sqrt(27)=3sqrt(3), since CD=(5,-1,-1).
3. B,C opposite: D=B+C-A=(-6,8,2). Diagonals BC and AD have
   lengths sqrt(10) and sqrt(174), since AD=(-7,11,2).

There are exactly three unordered pairs. One may report the first pair under an
explicit consecutive-ABCD assumption, but cannot silently suppress the other
source-compatible cases.

## 22: proof, nondegeneracy, both angle conventions

AB=(-1,-3,1)=DC and BC=(-3,-1,8)=AD. Equivalently, both diagonal
midpoints are (0,2,1/2). AB cross AD=(-23,5,-8) is nonzero.
Thus the stated points, in A-B-C-D order, form a nondegenerate parallelogram.

AC=(-4,-4,9), BD=(-2,2,7). Squared lengths 113 and 57; dot product 63.
For these two directed vectors cos theta=63/sqrt(113*57)=63/sqrt(6441).
The conventional smaller angle between the diagonal lines is
theta=arccos(63/sqrt(6441))=38.28028412223281 degrees.
The intersecting lines also make the supplementary angle
180-theta=141.7197158777672 degrees. State which angle is being named, or give
both. Opposite orientation of a diagonal changes the directed-vector angle but
not the smaller line angle. The source's proof subtask remains mandatory.

## Review boundaries

These same solutions are to be reused, not recomputed from the later answer
author's candidate. This document does not claim exact-editor compatibility,
finalize, grading runtime, source surface acceptance, or MathLive execution.
