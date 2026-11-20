# Pre-key fidelity and all-option truth evidence

This record is authored with only questions[].view disclosed. Author IDs,
source_numbers, intent, correct sets, rationales, limitations and coverage have
not been accessed. Question numbers below are visible-array ordinals, not author
IDs. FIRST-source.md/json and their seal already existed.

## Fidelity, redundancy and leakage

1. Five named source points and all signs/fractions retained. Midpoint, coordinate
   plane reflection and signed axis translation require reconstructing endpoints;
   these are not merely copies of coordinate cells. The response verifies plans,
   not actual point drawing. That productive construction capacity is deferred.
2. Both original P,Q pairs and their direction retained in one ordered tuple-pair
   response; both integer and fractional subtraction matter. Selection does not
   certify independently written working. One correct half can aid elimination,
   but the unit remains a reasonable complete-result recognition task.
3. Oyz projection and OB norm retained; added projected position exposes which
   component is removed, not a supplied solution. Squared norm is distinguished
   from length. The requested quantity remains OB, not projection distance AB.
4. Entire real Oy, no positive-ray restriction or silently inserted endpoint.
   Equality of full three-coordinate distances determines the unique point.
5. Both requested whole medians retained with A1,B1 defined by the opposite
   midpoints. Options distinguish omission of averaging and sides from medians.
6. Origin-to-centroid distance retained, distinct from midpoint distances and the
   norm of the coordinate sum. It does not repeat question 5's requested lengths.
7. All three internal angles retained in A,B,C order. Arccos range [0,pi]
   preserves obtuse C. Position-vector angles and squared norms are wrong tasks.
8. Source does not declare vertex order; visible question explicitly requires
   all unordered diagonal-length pairs. Three source-compatible cases retained.
   No assumption of consecutive ABC is silently adopted.
9. Source proof retained as recognition of valid sufficient arguments, including
   nondegeneracy. A universal telescoping identity is distinguished from a
   parallelogram criterion. Free proof composition is deferred.
10. Original diagonal-angle task expressed as all different intersection-ray
    angle sizes. This explicitly includes both the smaller angle and supplement;
    it does not misname an obtuse directed angle as the unique line angle.

Package redundancy PASS: questions 5-7 share data but target medians, centroid,
and angles; 9-10 target proof and diagonal-angle computation. No complete result
is repeated as another question's demanded answer.

Package leakage PASS: no displayed source selectors or keys. Repeated coordinates
are task data, not solutions. Question 10 grants internal diagonal intersection,
which alone does not establish a parallelogram or solve question 9; it contains
no midpoint equality or opposite-side vector equality. Question 9 contains no dot
product or diagonal norm used to identify question 10's exact angles. Equal answer
expressions embedded across false/true alternatives do not announce correctness.
No option-length or wording clue uniquely identifies a true set.

## Every option, independently

1a TRUE: midpoint ((4+0)/2,(6+0)/2,(0+2)/2)=(2,3,1)=A.
1b TRUE: Oxz reflection negates y only: (1,1,2)->(1,-1,2)=B.
1c TRUE: Oyz reflection negates x only: (3,1/2,-1)->(-3,1/2,-1)=D.
1d TRUE: Oxy reflection negates z only: (0,2,3)->(0,2,-3)=E.
1e TRUE: midpoint of O and (0,0,-3)=(0,0,-3/2)=G.
1f FALSE: positive Ox translation gives (5,0,1), not (2,3,1).
1g FALSE: Oyz reflection gives (-1,1,2), not (1,-1,2).
1h FALSE: midpoint (-3,1/2,1), wrong z sign for D.
True set: a,b,c,d,e.

2a FALSE: P-Q, the negative of both required PQ triples.
2b FALSE: P+Q=(1,-1,-3),(-1/10,-4/3,3/2), not displacement.
2c TRUE: Q-P=(-3,5,-3),(-11/10,4/3,-1/6).
2d FALSE: componentwise absolute differences discard three negative components.
True set: c.

3a FALSE: (2,0,1),sqrt(5) describes Oxz projection, not Oyz.
3b TRUE: B=(0,-3,1), squared norm 10, positive norm sqrt(10).
3c FALSE: (2,-3,0),sqrt(13) describes Oxy projection.
3d FALSE: location right but 10 is the squared norm, not the norm.
True set: b.

4a FALSE: t=-1 gives squared distances 5 and 13.
4b FALSE: t=0 gives squared distances 6 and 10.
4c FALSE: t=2 gives squared distances 14 and 10.
4d TRUE: t=1 gives squared distances 9 and 9; linear equation unique.
True set: d.

5a FALSE: using B+C and A+C as unaveraged midpoints gives vectors
(4,3,7),(4,-3,-1), squared lengths 74,26; not medians.
5b TRUE: AA1=(1/2,5/2,3), BB1=(1/2,-2,-3), squared lengths 62/4,53/4.
5c FALSE: sqrt(6)/2,3/2 are half BC and half AC, not vertex-to-midpoint lengths.
5d FALSE: sqrt(6),3 are BC and AC side lengths, not medians.
True set: b.

6a TRUE: T=(10/3,-1/3,3), |OT|^2=182/9.
6b FALSE: sqrt(182) is |A+B+C|, omitting the division by 3.
6c FALSE: sqrt(73)/2 is |(A+B)/2| for the AB midpoint (3,-1/2,3).
6d FALSE: sqrt(182)/2 uses the sum divided by 2, not the centroid average.
True set: a.

7a FALSE: last positive cosine makes C acute; actual CA dot CB=-5.
7b FALSE: denominators 225,150,54 are products of squared side norms;
cosine uses 15,5sqrt(6),3sqrt(6), not their squares.
7c FALSE: these are angles of position rays OA,OB,OC at O:
OA dot OB=12, OB dot OC=27, OA dot OC=15 with norms sqrt(14),sqrt(35),5.
They are not the internal angles based at A,B,C.
7d TRUE: cosines 14/15,11/(5sqrt(6)),-5/(3sqrt(6)); FIRST angles total 180 degrees.
True set: d.

8a FALSE: only A,C-opposite case; misses B,C-opposite and A,B-opposite cases.
8b FALSE: uses pairs of existing sides/segments; true diagonal pairs are
{sqrt(33),sqrt(105)}, {sqrt(10),sqrt(174)}, {sqrt(59),3sqrt(3)}.
8c TRUE: precisely those three unordered pairs, no added case.
8d FALSE: lengths 3,sqrt(54),sqrt(3) arise from D=A+B+C=(-4,2,2)
rather than subtracting the common adjacent vertex; squared alternative lengths
must be 105,174,27, respectively. None of its listed pairs is a valid completion.
True set: c.

9a TRUE: both midpoints (0,2,1/2); AC=(-4,-4,9),BD=(-2,2,7)
not proportional. Bisecting noncollinear diagonals suffice.
9b FALSE as an argument: AB+BC=AC always, even if D=(0,0,0);
then A+C != B+D and the four points are not a parallelogram. True premise,
invalid sufficiency; do not label the vector identity itself false.
9c TRUE: AB=DC=(-1,-3,1), and AB cross BC=(-23,5,-8) !=0;
equality implies D=A+C-B, so the nondegenerate parallelogram follows.
9d FALSE: CD=(1,3,-1)=-AB, not AB. It reverses the required opposite-side direction.
True set: a,c.

10a FALSE: arccos(63/6441) uses product of squared norms rather than norms.
10b TRUE: smaller angle arccos(63/sqrt(6441))=38.28028412223281 degrees.
10c FALSE: supplement of the same squared-norm error, not the true obtuse angle.
10d TRUE: pi-arccos(63/sqrt(6441))=141.7197158777672 degrees.
True set: b,d. Since intersection is internal and diagonals noncollinear, these
are all distinct sizes from the four endpoint rays.

## Pre-key result

10 fidelity PASS, 10 redundancy PASS, 10 leakage PASS, 44 independently supported
truth determinations. Native counts 7 single / 3 multiple. No author comparison
has yet occurred. Approval of the complete draft remains pending author-internal
and coverage inspection; no report/validator/finalize/MathLive gate run.
