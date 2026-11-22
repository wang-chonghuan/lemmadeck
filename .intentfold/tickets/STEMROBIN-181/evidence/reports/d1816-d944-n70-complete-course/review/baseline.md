# D923 independent baseline, frozen before candidates

Scope: STEMROBIN-181, 9p, phy9-c2-s2-n70 only. This is the first independent
source/text/figure expectation baseline, not a modern candidate verdict,
production worker, replacement source-extraction gate, or publication approval.
No modern target text, FigureSpec, artwork, render, review, or candidate pixels
have been read. Originals have been opened exactly once each, without crops.

## Evidence boundary

The entire raw lesson.json and exercises.json were read. Source page.json for
physical pages 175-177 was read as retained text, not compared anew with scans.
D019 source approval and matching current page hashes are reused. The raw
lesson has 20 prose entries (14 text, 3 figure, 3 caption), all three figures in
prose, and zero exercises. Page177#1 closes the lesson before unit71's heading;
unit69 material on page175 and unit71 material on page177 are outside this
review. No source-page image was opened.

source-inventory.json records only original-pixel observations and explicit
uncertainties. input-bindings.json binds current text, original figure paths,
source page/figure blocks, extraction crop metadata and old approval references.
image-ledger.originals.json records actual image opens, not file reads or
browser text fetches. freeze.json hashes this baseline, inventory and evidence.

A filename-only search initially found similarly named 10p historical summary
records. Those wrong-book summary metadata were read during approval lookup and
excluded; they are not source authority, not target candidate content, and not
basis for this baseline. Correct authority is explicitly 9p D019.

## Retained source statements

These are exact content claims in the approved transcription, not independent
endorsements of every explanatory wording and not pixel re-transcription.

| Source refs | Coverage required in the complete modern lesson |
| --- | --- |
| p0175#5 | Spherical/nearly spherical natural and engineering objects (stars, planets, rain droplets), flat objects, and local approximation of a small surface region by a plane. The examples do not establish that all such objects are uniformly charged conductors. |
| p0175#6 | Uniform distribution on the metal spherical surface of radius R_0; exterior radial field lines; figure125 reference. |
| p0175#7 + p0176#1 | Exterior comparison to a point charge at the sphere center; same total charge understood; center distance r >= R_0; figure126 and prior formula (8-13) reference. |
| p0175#8-11 | Figures125/126 and their captions; keep the solid charged-sphere versus dashed point-charge comparison distinction. |
| p0176#2 | SI magnitude E = abs(q)/(4*pi*epsilon_0*epsilon*r^2), equation (8-16). |
| p0176#3 | Inside the metal sphere, r < R_0, E = 0. |
| p0176#4 | Uniform surface charge, density defined as charge per area; original opening uses square centimeters and sigma. |
| p0176#5 | sigma = q/S, equation (8-17). |
| p0176#6-7 | Infinite uniformly charged plane: parallel field lines normal to the plane; magnitude independent of distance and determined by sigma; figure127. |
| p0176#8-10 | Contrast sphere/point inverse-square dependence with the plane's density dependence; figure127 caption and SI introduction. |
| p0176#11 | SI magnitude E = abs(sigma)/(2*epsilon_0*epsilon), equation (8-18). |
| p0176#12-13 | Separately identified electrostatic-unit-system result E = 2*pi*abs(sigma)/epsilon, equation (8-19); do not mislabel it SI or combine unit conventions. |
| p0176#14 + p0177#1 | No literal infinite plane exists; sufficiently large finite plane approximates it locally; original explanation invokes inverse-square decay of contributions from distant edge portions. Preserve the topic, with scientifically valid limits in modern explanation. |

The retained pages have no registered errata. This reviewer changes neither
the faithful source nor any edition. Scientific qualification below is not
permission to silently replace a protected formula or invent source errata.

## Independent mathematical model

This section is independently reasoned expectation, not an inventory of source
pixels. Symbols: q is total charge, R_0 is sphere radius, r is center distance,
S is surface area, sigma = q/S is signed surface density, and the source's
epsilon is dimensionless relative permittivity. The source formulas presume
an appropriate homogeneous dielectric; epsilon = 1 is vacuum. Do not imply
the same simple factor works across arbitrary dielectric interfaces.

For the isolated electrostatic conductor with spherical symmetry, a spherical
Gaussian surface encloses all q outside. Its flux is 4*pi*r^2*E_radial, giving
E_radial = q/(4*pi*epsilon_0*epsilon*r^2). Magnitude uses abs(q). Exterior
directions are outward for positive charge, inward for negative charge; all
points at the same r have equal magnitude, not all exterior points. At twice
the exterior radius, the magnitude is one quarter. This ratio is derived,
not a new source numerical given.

The conductor interior has zero electric field in electrostatic equilibrium.
Do not replace this with the linearly growing interior field of a uniformly
volume-charged insulating solid sphere. A centered point charge is an exterior
equivalent only: its field remains nonzero inside the comparison circle and
is singular at its location. The central +q label in figure125 must not imply
an actual interior charge. A radius indicator is not an electric-field line.

At the charged surface, interpret the exterior formula at R_0 as the outer
one-sided limiting value. The inner value is zero; no false continuity claim
or single unqualified field value within an ideal surface charge layer.

For the ideal uniform thin charged sheet with identical homogeneous medium
on both sides, a straddling pillbox has flux 2*E*A and enclosed charge
sigma*A. Thus each side's magnitude is abs(sigma)/(2*epsilon_0*epsilon),
independent of distance off the sheet. Directions on opposite sides are
opposite: outward for positive sigma, inward for negative sigma. The field
vector is uniform in each open half-space, not the same vector throughout
both half-spaces. Avoid assigning an ordinary field at the ideal sheet itself.

The factor of two must not be lost by confusing sheet density with density
on one face of a finite-thickness conductor. Immediately outside one conductor
face the magnitude is abs(sigma_face)/(epsilon_0*epsilon). A symmetric isolated
thin conducting plate with total charge per footprint area sigma_total has
sigma_face = sigma_total/2. That is a different explicitly defined density
convention, not an excuse to change equation (8-18).

The source's electrostatic-unit-system expression remains distinct from SI.
An added SI unit explanation should define sigma in C/m^2, not charge alone.
If C/cm^2 is used, numeric conversion is required; no unit-bearing numerical
examples are present in the source and none are authored here.

Finite-sheet approximation requires the observation point to be near an
interior region, well away from edges in comparison with the relevant normal
distance and lateral size. Merely having a large total area is insufficient
near an edge. Inverse-square decay of each small element alone is not a
complete argument about the sum over infinitely many elements.

Similarly, matching the drawn shape of two finite sets of field lines alone
does not prove equal field amplitude. The exterior equivalence also uses
the same total charge, spherical symmetry and the electrostatic field law.
Uniform charge on an isolated spherical conductor is not a universal property
of a sphere subjected to arbitrary external fields.

External cross-check was text-only through cloak-fetch: OpenStax University
Physics Volume 2, 6.3 Applying Gauss's Law (planar symmetry and sheet result),
and 6.4 Conductors in Electrostatic Equilibrium (conducting-sphere example,
conductor-face result). No website image was loaded into reviewer context.
Those references support model distinctions; the derivations and source
inventory above were not taken from author candidates.

```text
https://openstax.org/books/university-physics-volume-2/pages/6-3-applying-gausss-law
https://openstax.org/books/university-physics-volume-2/pages/6-4-conductors-in-electrostatic-equilibrium
```

## Figure expectation

All three routes are deterministic and instructional. Abstract charge, circle,
plane, hatching, directions, labels and relationships are sufficient; no
natural-object depiction demands GPT artwork. No hybrid/paid generation is
needed for fidelity to these originals.

- Figure125: one solid sphere outline, twelve distributed positive marks,
  twelve exterior outward radial shafts, a distinct internal R_0 radius
  indicator, and a total-charge annotation. No electric-field shafts inside
  the conductor. Mathematical regularization must not become an exact source
  claim about angles, scales or charge-mark spacing.
- Figure126: one central positive point-charge depiction; twelve outward rays
  extending from that point across the dashed comparison contour; R_0 radius
  label. Keep the dashed/solid distinction and the common-center relationship.
  Do not relabel the reference contour a source-specified Gaussian surface.
  A newly separated, legible radius indicator is a regularization of the
  observed radius relationship, not proof of an exact source arrow count.
- Figure127: one hatched perspective plane patch; sigma identity; multiple
  parallel field-line families on both sides with outward arrows. The source
  has seven identifiable long arrow rows on each side plus shorter staggered
  ones; the total count and pair matching remain uncertain. Do not collapse
  the source to one-sided field, a pair of plates, or a conductor interior.
  A clean regularized arrangement can express the same qualitative model
  only if its chosen count/spacing is explicitly an author addition, not
  "source exact". If exact total replication is claimed, it is unsupported
  by this bounded observation.

Normality, radiality, parallelism, source counts where identified, sign,
same-center/radius relationships and every meaning-bearing arrow need
deterministic geometry and executable evidence. Coordinate/angle choices are
implementation geometry, not original numerical givens. Equal-looking arrow
lengths in a field-line drawing do not constitute calibrated E-vector lengths.
The perspective patch's hatch strokes are not a measured lattice or ticks.

## Separate additions

The following may clarify a modern lesson, but must be declared as additions
or scientific qualifications, never original-pixel labels: isolated-sphere
assumption; positive/negative-direction explanation; one-sided surface limits;
same-vector-per-half-space wording; homogeneous-medium assumption; SI density
units; finite-sheet edge caveat; explanation that +q labels total sphere
charge; English descriptors; E=0 annotation; newly introduced O, r, axes,
normal vectors or measurement guides. Added formulas/derivations are not
automatically authorized edition edits. No exercise, answer, measured scale,
quantitative plane size or tick value is supplied by this baseline.

## First candidate review boundary

Later SCI review must compare the entire new text against all source topics and
the independent model above. Later ZHEN review must compare complete supplied
Chinese/English text for matched conditions, symbols, formula/unit labels,
negations, signs and the sphere/sheet distinctions; no current language verdict
is possible before seeing those texts. Formula numbers and figure references
must remain mapped, with original exercise count zero.

Later FIG review must inspect the new actual outputs and their current
source/spec/render/review/display bindings, then substantively compare them
with this frozen inventory. Render status or hash equality alone cannot prove
source fidelity. Visible figure text must be English or mathematical symbols,
at least 16px at supplied actual display widths; no collision, clipping,
missing rays/marks, culture leakage, or misleading arrows. No candidate width
or desktop/mobile appearance has yet been inspected or passed.

Sources are not to be reopened, and the independent math baseline is not to
be repeated. Continue in this same context from 3 actual images. Every future
candidate, crop or reopen increments the cumulative image ledger; at most
8 actual images in any batch and at most 24 cumulative. A whole initial FIG
display inspection can fit in two later batches, e.g. six candidate images
at two widths, then three at a third width, totaling twelve including sources.
This is capacity planning only, not authorization to render or choose paths.

Status: BASELINE FROZEN, AWAITING FIRST CANDIDATE PATHS. No source-approval,
scientific or routing HOLD blocks deterministic drafting. The fig126 indicator
detail and fig127 total-count/pairing ambiguities are real, preserved,
nonblocking qualitative-source uncertainties; an unsupported "source exact"
candidate claim would fail the affected claim. No modern content is approved.
