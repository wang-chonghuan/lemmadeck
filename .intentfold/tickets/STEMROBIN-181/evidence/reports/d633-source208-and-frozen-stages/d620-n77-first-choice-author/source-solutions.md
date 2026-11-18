# FIRST n77 Source Solutions and Assumptions

Status: FIRST-INDEPENDENT-SOLUTIONS-BEFORE-OPTIONS. Author reasoning only; not semantic approval.
Ticket: STEMROBIN-181. Batch: D033.
Workspace: /Users/yong/.codex/worktrees/00b1/lemmadeck.
Ownership: only .intentfold/tickets/STEMROBIN-181/tmp/d620-n77-first-choice-author/.

Manifest file SHA-256: 3ec0bce080bc311ff613de27f0ece02ae3641685977515fd2d8113f6abe8f650.
Seed file SHA-256: 7ccb3ba6984ab9f3c49b566a68bb152f1bffe09abd529887521ab8845f0a49cf.
Seed canonical SHA-256: 1c37b936026299890b3e9a840e3c5aa2cefd0cabddc2c745fd574cd75ea6c392.
Seed: .intentfold/tickets/STEMROBIN-181/tmp/d618-n77-first-choice-source/source-repo/.intentfold/tickets/STEMROBIN-181/tmp/seed.json.
Validation repository: .intentfold/tickets/STEMROBIN-181/tmp/d618-n77-first-choice-source/source-repo.

## Authority and Conditions

The prepared whitelist contains eight written conceptual questions and only definition blocks 0, 2, 3, 5, 8. There are no selected figures or solved examples. No answer books, written-answer outputs, previous choices, interactions, keys, ticket answers or other authors' files were consulted. The mirror's exercises.json is permitted input by this manifest, regardless of its original provenance path; that original path was not opened.

Exact earlier wording of refraction, index, critical angle, thinness, focus and construction rays is absent. The following are independently derived conditional physics, not quotations from missing original definitions. Every necessary condition must remain visible in the corresponding stem. No original numerical givens are invented.

For refraction use ordinary transparent homogeneous isotropic media at a fixed frequency, positive phase indices, and a locally planar interface. Angles are measured from the interface normal. Only a propagating transmitted ray is described by a real refracted angle.

For lens items use a thin lens in the paraxial approximation with the same homogeneous medium on both sides. Keep the source notation d = signed object distance, f = signed image distance, F = signed focal length. Real object, real image and real focus are positive; their virtual counterparts are negative. This is not an axis-coordinate convention that assigns every distance on one side the same sign.

For finite reciprocal formulas take d, f, F nonzero and finite; infinity is a limiting case, not an ordinary denominator. Linear magnification is a nonnegative size ratio, not signed transverse magnification.

No missing or conflicting supplied lens convention was found. Unavailable earlier wordings are not resolved by pretending to quote them; narrowed generic models and exclusions are documented below. A genuine convention conflict discovered later blocks the affected item.

## 1. Refraction Law

Task: state both the geometrical plane condition and the quantitative relation.

Independent solution: for a fixed-frequency plane-wave component, phase continuity along the boundary requires equal tangential wave-vector components. Since wave-vector magnitude is proportional to phase index, n1 sin(i) = n2 sin(r). In an isotropic medium propagation is along the wave-vector direction. The incident ray, transmitted ray and normal lie in one plane. The incident and transmitted ray segments are in their respective half-spaces. Angles i and r are nonnegative angles to the normal, not to the surface. At normal incidence both angles are zero. If the equation demands sin(r) > 1, no propagating refracted ray exists; this does not assign a real angle beyond 90 degrees.

Distinction: correct sine weighting and the plane condition, not an exact linear relation between the angles.

Response unit: one complete law statement, because these are joint parts of the same law. Do not split the plane condition and equation into unrelated yes/no clicks.

Losses: recognition cannot prove an independently written verbal statement. Anisotropic media, changing frequency, curved-boundary global geometry and evanescent fields are outside the visible ordinary local-interface model. Exact earlier source wording is unavailable.

## 2. Absolute and Relative Refractive Index

Task: distinguish reference to vacuum from reference to another medium and establish the ordered ratio.

Independent solution: let c be vacuum light speed and v1, v2 the phase speeds at the same frequency. Absolute indices are n1 = c/v1 and n2 = c/v2. Define n21 explicitly as medium 2 relative to medium 1 for travel 1 to 2. Then n21 = n2/n1 = (c/v2)/(c/v1) = v1/v2. For nonnormal incidence, Snell's law also gives n21 = sin(i)/sin(r). Reversing the ordered media reciprocates the relative index. Different incident media change a relative index even if the receiving medium is fixed.

Distinction: reference medium and ratio direction must be settled together.

Response unit: one coherent paired absolute/relative result, not a separate click for each symbol.

Losses: no independently written explanation or proof is assessed. Frequency dependence is not explored; fixed frequency is visible. Index ordering is explicitly authored notation, not a claim about absent original notation.

## 3. Critical Angle

Task: state the critical angle and distinguish the boundary value from strict total internal reflection.

Independent solution: for incidence from medium 1 to medium 2 with n1 > n2 > 0, increase i until the transmitted direction has r = 90 degrees. Snell's law gives sin(ic) = n2/n1, hence ic = arcsin(n2/n1). For 0 <= i < ic a propagating transmitted ray exists. At i = ic, r = 90 degrees is the limiting direction along the interface, not an incidence strictly above threshold. For ic < i < 90 degrees Snell's equation cannot give a real transmitted propagation angle, so total internal reflection occurs in this ordinary lossless ray model. For n1 <= n2 there is no total-internal-reflection threshold at an incidence strictly below 90 degrees in the stated direction.

Distinction: ordered ratio, angle to normal and strict side of threshold.

Response unit: one complete threshold judgment, not detached angle and inequality blanks.

Losses: no original numerical angle or numerical calculation exists. Wave-field behavior at the boundary, frustrated total internal reflection and absorbing media are excluded. The equality case is stated rather than collapsed into i > ic. Original unrestricted prior wording remains unavailable.

## 4. Thin Lens

Task: explain which geometrical dimension is negligible and what approximation this permits.

Independent solution: let t be axial separation of the two refracting surfaces. A lens is treated as thin when that separation can be neglected on the scales relevant to paraxial imaging, in particular surface curvature radii and relevant object/image distances. Refraction at the two surfaces is then represented at one effective lens plane; separation of principal planes is neglected at this approximation's precision. Merely being small in millimeters, having a small thickness-to-diameter ratio, or being thin relative to the optical wavelength is not the geometrical-optics definition. The approximation has no universal numerical cutoff supplied by this seed. Plane surfaces have infinite curvature radius, interpreted as a limiting case; small aperture/paraxial rays are a separate condition, not a replacement for thinness.

Distinction: scale-dependent neglect of axial surface separation, not small absolute size or image reduction.

Response unit: one approximation criterion together with its imaging consequence.

Losses: exact original wording and a quantitative tolerance are unavailable. Thick-lens principal-plane calculation is not assessed. Recognizing the criterion does not demonstrate independently explaining it.

## 5. Principal Focus

Task: define the focus by an axial parallel paraxial bundle, including real and virtual focus.

Independent solution: in the stated thin-lens same-medium paraxial model, rays incident parallel to the principal axis of a converging lens intersect at the principal focus on the outgoing side. For a diverging lens the emerging rays diverge; their backward extensions intersect at the principal focus on the incident side. The latter intersection is virtual, not a point actually traversed by the emerging rays. Repeat from the other side to obtain the other principal focus. In the same medium their distances from the thin-lens plane have equal magnitudes. A principal focus is not the optical center, nor the image of every arbitrary finite-distance object. Parallel incidence is the infinite-object-distance limiting definition: 1/d tends to zero, so the lens relation tends to f = F.

Distinction: actual ray intersection versus backward-extension intersection under the same defining parallel bundle.

Response unit: one whole focus-definition judgment across the two lens types; do not make independent binary questions for the real/virtual words.

Losses: no physical drawing or experimental location of focus is produced. Unequal external media and nonparaxial aberrations are excluded. Earlier verbatim definition is unavailable. Reciprocal limiting argument does not claim a finite source object.

## 6. Thin-Lens Formula

Task: write the formula with the supplied symbols and interpret all real/virtual signs, including an initially unknown distance.

Independent solution: in the supplied same-medium thin paraxial model, 1/d + 1/f = 1/F. The equivalent nonzero finite form is df = F(d + f). A real object has d > 0, virtual object d < 0; real image f > 0, virtual image f < 0; converging real-focus lens F > 0, diverging virtual-focus lens F < 0. A virtual object is the point to which the incident converging bundle would proceed if the lens did not alter it, not a real source emitting at that point. Rewriting with unsigned magnitudes requires a separate appropriate sign on each reciprocal; one fixed plus-plus unsigned equation does not describe all cases. For unknown signed f use its reciprocal with positive algebraic coefficient: 1/f = 1/F - 1/d. The positive coefficient is not the claim f > 0. Likewise 1/d = 1/F - 1/f and 1/F = 1/d + 1/f preserve signed unknowns; no guessed extra sign is added. Negative solved values mean virtual cases according to the supplied convention.

Distinction: a universal signed relation versus magnitude-only substitution and guessing the sign of an unknown.

Response unit: one set of definite assertions about validity of the signed formula and its interpretation. Multiple selection can cover the complete convention without per-blank questions.

Losses: writing and deriving the equation unaided are not assessed. No numerical application is invented. The finite form excludes infinite conjugate distances and zero-power lenses, which need limits. Formula validity for virtual objects follows the supplied convention; no new virtual-object proof is claimed.

## 7. Convenient Construction Rays

Task: identify convenient rays for constructing a converging thin lens's image.

Independent solution: fix light propagation from left to right and a converging thin lens in the same medium, under paraxial approximation. An incident ray parallel to the principal axis leaves through the right/outgoing principal focus. Reversibility of that optical path gives: an incident ray through the left/incident principal focus leaves parallel to the axis. A paraxial ray through the optical center continues along the same straight line in the thin-lens approximation. Two noncoincident suitable rays from one object point suffice to locate its image by intersections, or backward intersections for a virtual image. A third suitable ray is a check, not a requirement that all three must be used. The centered ray is not generally redirected through a focus. Diverging-lens construction uses extensions at the virtual focus rather than this converging-lens rule verbatim.

Distinction: a usable set of ray mappings, not requiring three rays or mistaking a focus crossing for center passage.

Response unit: one judgment of a set of construction rules. No per-ray yes/no quiz and no pair-combination codes.

Losses: the original question asks which rays are convenient, not a supplied diagram to reconstruct. This response does not demonstrate drawing, locating an image, selecting two noncoincident rays in a specific configuration or diverging-lens construction. The visible converging-lens narrowing is deliberate, not full-case coverage. No diagram is genuinely necessary to judge verbal rules; none is authorized or created.

## 8. Linear Size Magnification

Task: define the size ratio and connect it to signed lens distances without encoding orientation.

Independent solution: take corresponding transverse object and image sizes H > 0 and h >= 0 as magnitudes. Gamma = h/H. The optical-center ray and paraxial similar-triangle geometry give the signed transverse ratio -f/d when oriented heights are used; taking magnitudes gives Gamma = |f|/|d| >= 0 for the supplied distance convention. Inversion does not make a size negative. Gamma is a linear-size ratio, not an area ratio (which would square the scale factor for similar transverse shapes), nor the reciprocal object/image ratio. Gamma alone does not say whether the image is upright or inverted; orientation needs a separate signed-height convention or imaging construction. Finite nonzero d and f avoid an image-at-infinity size assertion.

Distinction: nonnegative image/object linear-size ratio versus signed transverse or area magnification.

Response unit: one complete definition and distance relationship, not two ratio blanks.

Losses: no unaided definition, triangle derivation, size computation or orientation construction is demonstrated. The seed provides no numbers to compute. Infinite conjugates and longitudinal/angular magnification are not covered.

## Before-Options Freeze

This file contains no answer-option text, option IDs or option keys. It is to be set to mode 0444 and SHA-256 recorded before draft creation. Subsequent question source_solution fields must express these already-established results; semantic review remains independently pending.
