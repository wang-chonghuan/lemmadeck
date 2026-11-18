# d632: Independent source solutions, before draft disclosure

Ticket: STEMROBIN-181. Batch: FIRST, text-only, independent semantic choice/ZHEN review.
Identity: d632 reviewer; not the d620 author. All eight solutions below were
derived from the seed prose and selected definitions before reading any draft
view, intent, rationale or key. No previous answer, choice or ticket output was
consulted. No image was opened.

Seed file SHA-256: 7ccb3ba6984ab9f3c49b566a68bb152f1bffe09abd529887521ab8845f0a49cf
Seed canonical JSON SHA-256: 1c37b936026299890b3e9a840e3c5aa2cefd0cabddc2c745fd574cd75ea6c392
Checker repo: .intentfold/tickets/STEMROBIN-181/tmp/d618-n77-first-choice-source/source-repo
Seed: the preceding repo's .intentfold/tickets/STEMROBIN-181/tmp/seed.json
Selected definition blocks: 0, 2, 3, 5, 8. Source figures: zero.
Neither a solved derivation nor source179 was read.

## 1. State the law of refraction

At a boundary between ordinary homogeneous isotropic transparent media, the
incident ray, refracted ray and local normal are coplanar; the incident and
refracted propagation have tangential components in the same direction.
Angles i and r are measured from the normal, not the surface.
Snell's law is n1 sin(i) = n2 sin(r), hence sin(i)/sin(r) = n2/n1
for nonzero refraction angles. n2/n1 = v1/v2 for the same light.
If n2 > n1, nonnormal transmission bends toward the normal; if n2 < n1,
it bends away when a transmitted ray exists. Normal incidence has i = r = 0:
Snell's product form remains meaningful, but its sine quotient is 0/0.
The ray stays on the normal. Coplanarity then supplies no unique incidence
plane because the incident ray and normal coincide.

Task requirement: recognize or state both geometry and the sine relation,
with correct angle references and no invalid universal sine quotient.

## 2. Absolute and relative refractive index

Absolute index of medium j is nj = c/vj, relative to vacuum for the same
light. The relative index for light entering medium 2 from medium 1 is
n21 = n2/n1 = v1/v2. Reversing the media gives n12 = 1/n21.
It is dimensionless and depends on the ordered pair, not merely medium 2.
For nonnormal transmitted rays it also equals sin(i)/sin(r).
That quotient does not define a number at normal incidence, whereas
n2/n1 remains well-defined. Absolute index equals the relevant relative
index only when the reference medium is vacuum.

Task requirement: distinguish vacuum reference from ordered medium-pair
reference, including numerator/order; do not interchange index and speed.

## 3. Total internal reflection and critical angle

Total internal reflection requires incidence from larger index n1 to
smaller index n2. The critical incidence angle ic is measured from the
normal and has refracted angle 90 degrees, so sin(ic) = n2/n1 and
ic = arcsin(n2/n1). Total internal reflection occurs for i > ic;
at i = ic the limiting refracted ray is along the boundary.
For exit into vacuum, n2 = 1 gives ic = arcsin(1/n1).
There is no ordinary critical angle for total internal reflection when
n1 <= n2. It is not the complement measured from the interface.

Task requirement: preserve the high-to-low-index condition, normal reference
and limiting angle; distinguish the critical threshold from angles above it.

## 4. Thin lens

A thin lens has axial thickness negligible on the geometrical scales used
in the lens approximation, in particular compared with its bounding
surfaces' curvature radii and relevant object/image distances.
Refraction at its two surfaces can then be represented at essentially one
plane. Thin does not mean an arbitrarily small diameter, a special focal
sign, or that the lens is necessarily converging.

Task requirement: identify thickness and its relative smallness, rather
than calling every small lens thin or restricting thinness to one shape.

## 5. Principal focus

For a paraxial beam incident parallel to the principal axis, a converging
lens makes the emergent rays meet at a point on that axis: a real principal
image focus. A diverging lens makes them diverge as if emitted from the
point where their backward extensions meet: a virtual principal image
focus. With the same medium on both sides, the analogous opposite
illumination defines the second principal focus at equal focal-distance
magnitude. A principal focus is not the optical center, and it is not the
intersection of arbitrary nonparallel incident rays.

Task requirement: specify axis-parallel input and distinguish actual
intersection from intersection of backward extensions. It must not claim
that all lenses always produce real images or real foci.

## 6. Lens formula

Under the seed's thin-lens, paraxial, equal-medium assumptions:
1/d + 1/f = 1/F, where d is object distance, f is image distance and F
is focal length. These are signed: real object d > 0, virtual object d < 0;
real image f > 0, virtual image f < 0; converging F > 0, diverging F < 0.
The equivalent magnitude form places one sign on each reciprocal,
according to the real/virtual status. Do not both give the variable a
negative value and add another negative sign to its reciprocal.

A virtual object is the location toward which incident converging rays
would proceed if the lens were absent, not an actual emitter at that point.
For a real object and converging lens, f = Fd/(d-F):
d > F gives a real image; 0 < d < F gives a virtual image; d = F gives
parallel output/no finite image. A diverging lens and real object give
f < 0. The latter claim must not be generalized to a virtual object:
F = -10, d = -5 gives 1/f = -1/10 + 1/5 = 1/10, so f = +10.
For a converging lens with a virtual object, F = +10, d = -5 gives
1/f = 1/10 + 1/5 = 3/10, so a real image can result.

Task requirement: retain formula, variable identities, applicability and
signs, including negative unknowns and physically meaningful virtual objects.

## 7. Convenient construction rays

In the same thin-lens/paraxial model, use two noncoincident rays from the
same object point, with a third ray as a check:

1. A ray through the optical center is effectively undeviated.
2. A ray parallel to the principal axis emerges through the real image
   focus for a converging lens, or with backward extension through the
   virtual image focus for a diverging lens.
3. A ray whose incident supporting line goes through the principal object
   focus emerges parallel to the principal axis. For a converging lens
   with an object beyond that focus, the actual incident segment can pass
   through it. If the real object is inside the focal distance, the focus
   lies behind the object and only the supporting-line/backward extension
   passes through it. For a diverging lens the incoming ray is aimed at
   the object focus on the far side; its unrefracted forward extension
   would meet it, but the actual pre-lens segment does not.

To verify the third rule without imposing a segment condition, place the
lens at x = 0, the real object at (-d,h), and the signed object focus at
(-F,0). The incident supporting line has slope -h/(d-F) and lens height
-hF/(d-F). Subtracting height/F from slope at a thin lens gives zero
emergent slope. For d = F and h != 0 this chosen line is parallel to
the lens plane and does not reach the lens; choose the other two rays.
Real images use actual emergent intersections; virtual images use
backward extensions. Never turn a backward extension into a light beam.

Task requirement: recognize reliable ray transformations and how to locate
real versus virtual images. Written source asks which rays are convenient,
not independently to draw a supplied figure; recognition loses spontaneous
listing and construction practice but need not destroy this task.

## 8. Magnification

The seed defines linear magnification as the ratio of corresponding
image-size magnitude to object-size magnitude. Therefore
Gamma = H/h = |f|/|d| >= 0, dimensionless for consistent units.
It is not the area ratio, brightness, reciprocal object/image ratio or a
signed orientation variable. Gamma > 1 means larger; Gamma < 1 smaller;
Gamma = 1 equal corresponding linear size. Upright/inverted status must
be obtained separately from image construction, not the sign of Gamma.
For example d = 30, f = 60 gives Gamma = 2; d = 10, f = -20 also gives
Gamma = 2 rather than -2.

Task requirement: preserve linear image-to-object ratio and the seed's
explicit unsigned convention, rather than importing signed magnification.

## Scope and initial snapshot verification

The actual seed tasks are refraction/index/TIR/thin lens/focus/formula/
construction rays/magnification. There is no law-of-reflection or plane-
mirror movement task. Those conditions will not be imported from warnings
or previous tickets; any occurrence in a fresh draft must be judged for
actual relevance. No source image is needed or present.

Initial trace hashes all equal the seed:
book.json 22799a872e14ad387e788adf1993737b5d7e8381fa8ac5d36d90e6043a7e8543
lesson.json da955a09c46c1d2b816ec69b1823fe07f9ee1707575a7c2f53087bfe4121eda0
exercises.json d64e4bbfb0c86c553935169ece1aa83077402768a65456c86a984d48557c9101
figures.json fe7b6934cd956488ca0cee118972e98ccb72ecac01375ef26c3dcc44ec314a9e

Author freeze file SHA verified without reading its JSON:
87afb78da6d63a1b85a2f659c6599d2d5da62f850e7220cda6cc81210fe7a36d
Author draft file SHAs obtained from bytes only, without parsing:
ZH 72492d8473c1b3d50088ea23ea9807d386e095c48c4b0d710787754e8295e642
EN e8ede5be3f0d998f885471022b8b1e44bfd5d08b3057e03960e66ebf54081ffb
All three author files were mode 0444. File SHAs are not canonical digests.
