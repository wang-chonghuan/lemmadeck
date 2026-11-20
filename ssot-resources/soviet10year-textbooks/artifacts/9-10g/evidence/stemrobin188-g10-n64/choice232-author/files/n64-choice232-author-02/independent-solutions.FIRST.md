# N64 / 232(1) source-first author solution

Role: SAME188-6 offline native-choice author, not an independent reviewer.
This record is written and sealed before the new options are constructed.
All writes are limited to this new author root. The previous author's files and modes remain untouched.

## Authorized reuse and source status

The human authorizes copying the exact previous seed and reusing this author's independently derived source solution.
The source remains the original seven-exercise seed, with paragraphs 0/2/6 and no figures.
Seed raw SHA-256: `e9d4003196accc240f86973b87b04cf93c8820057b4aa9b9948dd298eaff1dbb`.
Seed canonical SHA-256: `d4e6f9112c995fd2d07cdc7508f537bf8383a49139bb7968e089f6744fa86f6d`.
Copied seed must stay identical: 4420 bytes, mode 0644.

The earlier independent solution already established the two possible half-angle distances.
No answers, interactions, other author or reviewer materials are consulted to design this addition.
The original five question objects must be reused verbatim; only a new question and source 232 coverage are added.

## Original 232(1), unchanged and still ambiguous

The source says a radius-R sphere has two tangent planes making a dihedral angle phi and asks for the centre-to-edge distance.
It does not specify which dihedral region contains the sphere centre.
Paragraphs 0/2/6 do not specify that convention.

Let l be the common edge. In a plane through the centre C perpendicular to l, let H be its intersection with l.
The two tangent planes become intersecting tangent lines through H.
The two distances from C to these lines both equal R.
If the angle of the sector containing C is theta, then its internal bisector contains C and the perpendicular-foot right triangle gives

`R = |HC| sin(theta/2)`.

Thus `dist(C,l) = |HC| = R/sin(theta/2)`.
If theta=phi this is `R/sin(phi/2)`.
If theta=pi-phi this is `R/cos(phi/2)`.

For example, at phi=pi/3 take planes y=0 and y=sqrt(3)x, edge the z-axis.
Centres C1=(sqrt(3)R,R,0) and C2=(-R/sqrt(3),R,0) are each at distance R from both planes.
Distances to the edge are 2R and 2R/sqrt(3).
The selected 60-degree region contains C1; an adjacent 120-degree region contains C2.
The source does not select either region.

The uniquely phrased original distance therefore remains underdetermined for a general phi.
At phi=pi/2 the two possibilities coincide, but this special case does not provide a missing general source convention.
This original-source ambiguity is retained, not solved by an interpretation chosen by the author.

## Explicit native-task adaptation, solved before options

The new learner-facing task will visibly distinguish:

- R>0 and two distinct intersecting planes with a finite common edge l.
- A selected sector D in the perpendicular cross-section, with angle phi and 0<phi<pi.
- An adjacent sector D' sharing one boundary ray with D and having angle pi-phi.
- Case I: the centre C lies in the interior of D.
- Case II: the centre C lies in the interior of D'.
- The complete pair of right-triangle relations, resulting distances, and whether omitting the region would determine one distance.

These are author-supplied visible conditions for the adapted task.
They are not attributed to the original source or to the parent as source facts.
No original lesson, exercise, seed, answer, or convention is rewritten.

### Case I

Because C is inside D and has the same positive distance R from both boundary lines, it lies on the internal bisector of D.
The angle from HC to either boundary ray is phi/2.
The perpendicular-foot triangle has hypotenuse |HC|=d_I and opposite side R:

`R = d_I sin(phi/2)`, hence `d_I = R/sin(phi/2)`.

Since 0<phi/2<pi/2, the sine is positive and smaller than 1.
The perpendicular foot lies on the corresponding boundary ray: its projection length is d_I cos(phi/2)>0.
This is a valid tangent-sphere configuration for every allowed phi.

### Case II

Inside D' the internal bisector angle is (pi-phi)/2.
The same right triangle gives

`R = d_II sin((pi-phi)/2) = d_II cos(phi/2)`,

so `d_II = R/cos(phi/2)`.
The cosine is positive and smaller than 1 throughout the allowed interval.
Again the perpendicular-foot projection is positive, and the sphere is tangent to both planes.

### Full conditional comparison

The two distances coincide precisely when

`sin(phi/2) = cos(phi/2)`,

which in 0<phi<pi is precisely phi=pi/2.
Then `d_I=d_II=sqrt(2)R`.
For 0<phi<pi/2, d_I>d_II.
For pi/2<phi<pi, d_I<d_II.

The two opposite sectors repeat the same angle types and distances, not additional values.
Thus specifying the planes' selected angle but omitting the centre's sector leaves two possible distances unless phi=pi/2.
Each possibility is realized by placing the centre on the corresponding internal bisector at the derived distance.

The limits phi=0 or pi are excluded visibly because the two distinct intersecting planes and their finite edge would degenerate.
As phi tends to 0, d_I diverges while d_II tends to R; as phi tends to pi, the roles reverse.
No endpoint value or coincident-plane edge is invented.

## Reused 232(2), unchanged

The independently solved second source task still has centre coordinates |a|=|b|=|c|=R.
The source's explicitly positive-coordinate condition gives centre (R,R,R).
Its sphere equation is `(x-R)^2+(y-R)^2+(z-R)^2=R^2`.
This remains inside the original retained centre-loci question; no new option is derived from or supplied to it.

## Response unit and production losses

Use one native single-choice response whose alternatives each state the complete two-region triangle/distance comparison and the conclusion when the region is not specified.
Do not split the two distances into individual answer slots.
This unit requires the half-angle bisector inference and comparison of supplementary centre regions.
It does not pretend to recover a unique general answer to the unchanged source wording.

Recognizing the correct full conditional chain does not establish independent construction of the perpendicular section, independent derivation of the bisector relation, or proof writing.
The adapted task is a conditional comparison, not the source's uniquely phrased one-distance production task.
The original missing convention remains an explicitly recorded source blocker.
There are no original figure references requiring an image, and text completely specifies the new regions; no new image is requested.

No options, correct set, semantic review, or semantic approval are contained in this source-first record.
