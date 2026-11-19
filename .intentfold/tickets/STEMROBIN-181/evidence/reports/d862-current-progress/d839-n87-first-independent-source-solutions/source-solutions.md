# n87 First Independent Scientific Source Solutions

STEMROBIN-181 / STEMROBIN-181-3 / d839. **FROZEN, evidence only.**

This report solves the six original written questions independently. It is not a
modern answer key, choice approval, native-content finalization or grading
specification. No authored n87 answer or choice, book answer key, modern edition
or previous scientific review was read.

## Inputs and Boundary

Sole worktree: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.

Only authorized output directory:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d839-n87-first-independent-source-solutions/`.

The following inputs are relative to that worktree, all under
`.intentfold/tickets/STEMROBIN-181/tmp/d836-source233-consume-n87-prepare/`:

| Input | SHA-256 |
| --- | --- |
| `root/10p/lessons/phy10-c2-s3-n87/lesson.json` | `6fe57df85e6b9986854b00c662cb9249ac71a32e1417a6fbad0bf6a4dd32a83c` |
| `root/10p/lessons/phy10-c2-s3-n87/exercises.json` | `9299fe2333c9d0bb5157ad0a9deeb4d0d456972596c5d9178dea6ee042fbb43a` |
| `n87-preauthor-source-requirements.json` | `e2035f5a3e0a9608d90ef5275d9056dd59da9c221d3b3c9f596a46b09059d071` |

The source boundary is `p0230#2` through `p0233#3`. All six questions have empty
`figure_refs` and `figures`, and none names a diagram. Figures 201 and 202 belong
to the lesson prose; their frozen blocks have no exercise owner. **Images loaded:
0.** No original, proxy, modern or invented diagram was used. Limits: 8 per batch,
24 in context; one six-question batch.

Question identity and source context come only from these inputs. General
OpenStax/Rice University search excerpts were used for conceptual cross-checks
of coherence, film interference and frequency conservation, not for solutions
to these questions. No external page was opened. Filename discovery and search
navigation titles are not content reads; unrelated answer/choice files and
answer-key pages were not opened or used.

## Q1: Obtaining Coherent Light

Original (`p0232#7`): **1. 如何获得相干光波？**

**Reasoning.** A reproducible relative phase is needed. Splitting the field from
one suitably coherent source into two parts, by wavefront or amplitude division,
retains a mutual phase relationship. Equal nominal frequency from separate
ordinary lamps does not establish coherence. [S1]

**Minimum scientific response.** Split light from the same suitably coherent
source into two wave or beam paths so that the waves have the same frequency and
a stable phase difference.

**Conditions and ambiguity.** Path delays must remain within the relevant
coherence time/length and not fluctuate enough to wash out fringes. Overlapping
compatible polarizations permit observable interference. Equal amplitudes are
not required for coherence. Suitable matched paths can support broadband-light
interference; independently phase-locked sources are not excluded by this
elementary method.

**Units.** No number requested; frequency in Hz, phase in radians, optical-path
difference in m if quantified.

## Q2: Light Interference

Original (`p0232#8`): **2. 什么是光的干涉现象？**

**Reasoning.** The fields add before intensity is evaluated. For fully coherent
same-polarization waves,
`I = I1 + I2 + 2 sqrt(I1 I2) cos(delta)`.
Stable relative phase therefore produces reinforcement or weakening, rather than
simply adding two intensities. Equal amplitudes permit ideal zero minima; unequal
amplitudes do not. Reflection phases belong in `delta`. [S1, S2]

**Minimum scientific response.** Light interference is the stable enhancement
of intensity in some places and weakening in others when coherent light waves
overlap, due to their relative phases.

**Conditions and ambiguity.** Partial coherence or polarization mismatch reduces
contrast. Incoherent fields superpose but their phase-sensitive contribution
averages away. Destructive interference does not itself make heat: in a lossless
system energy is redistributed to other regions or output channels. This agrees
with the lesson's energy discussion at `p0232#5`.

**Units.** No number requested. Intensity normally in W/m^2; phase in radians.

## Q3: Wave Property and Color

Original (`p0232#9`): **3. 颜色的差异与光波的什么物理特性有关？**

**Reasoning.** For monochromatic visible light, frequency is the relevant
medium-independent property. Vacuum wavelength is equivalent through
`lambda0 = c/f`. In a specified fixed medium, wavelength can also identify a
monochromatic color. Changing medium changes speed and wavelength, not frequency
at a stationary boundary. [S3]

**Minimum scientific response.** For monochromatic light, different colors
correspond to different frequencies, equivalently different wavelengths in
vacuum or in one specified medium.

**Conditions and ambiguity.** Mixed-light colors need not have a unique
wavelength. Amplitude mainly affects intensity. Do not compare in-water
wavelengths directly with vacuum visible-range labels.

**Units.** Hz (s^-1) for frequency; m or nm for wavelength; refractive index is
dimensionless. No numeric value is needed.

## Q4: Colored Ice Cracks

Original (`p0233#1`): **4. 用石头砸透明的冰块以后，产生的裂痕有彩虹的闪光. 这是为什么？**

**Reasoning.** The chapter's standard interpretation is a thin air gap between
some separated crack faces. This is a conditional inference, not microscopic
geometry explicitly observed in the question. Two reflections from the gap
boundaries recombine. Different wavelengths of broadband light experience
different relative phases; thickness and angle variations change the reflected
colors. This applies general film interference to the source situation. [S2]

**Minimum scientific response.** Thin air gaps between some crack faces act as
thin films. Reflections from their two faces interfere, selectively reinforcing
different wavelengths of white light, so the cracks show iridescent colors.

**Phase check.** For an ordinary locally plane ice-air-ice gap near normal
incidence, the ice-to-air reflection has no pi reversal and the air-to-ice
reflection has a pi reversal. Hence there is **one relative pi shift**, unlike
the lesson's air-film-glass coating with its two equal reflection shifts.
For a nonabsorbing scalar model without total-internal-reflection complications:

```text
delta = 4 pi n_gap h cos(theta_gap)/lambda0 + pi  (modulo 2 pi)
Reflected maxima: 2 n_gap h cos(theta_gap) = (m + 1/2) lambda0
Reflected minima: 2 n_gap h cos(theta_gap) = m lambda0
```

These are independently derived explanatory relations, not a reconstruction of
an unprovided diagram or a requested numerical result.

**Conditions and ambiguity.** Faces must be sufficiently close and locally
suitable for the reflected paths to interfere. Not every crack is colored.
Broadband illumination and air filling are assumptions of this standard
explanation. No thickness, incidence angle, exact color sequence or prism-style
rainbow construction is given. The observation alone does not uniquely exclude
other optical mechanisms; no polarizers or stress-birefringence experiment is
specified.

**Units.** `h` and `lambda0` in the same length unit, normally m or nm;
`n_gap` dimensionless; angles in radians; `m` an integer. No numerical solution.

## Q5: Wavelength in Water and Visibility

Original (`p0233#2`): **5. 波长在水中减小到 $\frac{1}{n}$($n$ 是水对空气的折射率). 这是否意味着潜水员在水下在自然光中不能看见周围的物体？**

**Reasoning.** At a stationary air-water interface, `f_water = f_air`. For the
water-to-air relative index at that frequency, `v_water = v_air/n`, so
`lambda_water = lambda_air/n`. A shorter spatial wavelength is not a higher
frequency or higher photon energy. It does not convert visible-frequency light
into ultraviolet. [S3]

**Minimum scientific response.** No. In water light travels more slowly and its
wavelength decreases, but its frequency remains unchanged. With sufficient
natural light reaching the eyes, a diver can still see surrounding objects.

**Conditions and ambiguity.** Natural illumination, absorption, scattering,
distance/depth and focusing affect actual visibility. Water may alter the
received spectrum; naked eyes may focus poorly underwater. Do not claim
unchanged brightness, identical perceived colors, perfect clarity or visibility
at every depth. A mask can improve focusing but is not specified or required as
an invented experimental setup. Vacuum wavelength labels must not be applied
unchanged to in-water wavelengths.

**Units.** `n` dimensionless; both wavelengths in the same length unit;
frequency in Hz; speed in m/s. No value of `n` is supplied or needed.

## Q6: Actual Uses of Interference

Original (`p0233#3`): **6. 列举干涉的主要应用.**

**Reasoning.** Use the actual applications explicitly named in the lesson:

| Application | Source |
| --- | --- |
| Accurate measurement of light wavelength by interferometers | `p0230#4` |
| Measurement of a gas's refractive index | `p0230#4` |
| Inspection of surface flatness and machining quality | `p0230#6` |
| Optical antireflection coatings | `p0231#2-3`, `p0231#8-10`, `p0232#1-5` |

**Minimum scientific response.** Measuring light wavelengths and gases'
refractive indices with interferometers; checking surface flatness or machining
quality; and reducing reflection from optical surfaces with interference-based
antireflection coatings.

**Conditions and ambiguity.** Surface inspection and optical antireflection are
the two developed examples; the introductory measurement uses also belong in
the list. No new apparatus, lab procedure, demonstration, measured result or
application is invented.

For the source's normal-incidence coating case,
`n_air < n_film < n_glass` gives two equal pi reflection shifts. Odd-quarter-wave
optical thickness produces destructive reflected interference, and matching
amplitudes is also needed for complete cancellation. For an ideal nonabsorbing
single layer, the matching condition is `n_film^2 = n_air n_glass`. One fixed
coating does not generally cancel all wavelengths or angles. Reduced reflection
raises transmission in the lossless model; it is not energy destruction or
automatically perfect transmission through an entire real instrument. [S2;
source `p0231#11`, `p0232#1-5`]

**Units.** This is a list, not a numerical task. Length for wavelengths/surface
deviations, dimensionless refractive index and reflection/transmission ratios.

## Source Science Cautions

These are independent observations, not raw-source corrections or authoring
approval:

1. `p0230#6` equates `1/10` wavelength with `10^-6 cm`. The supplied green
   wavelength at `p0232#2` is `5.5 x 10^-5 cm = 550 nm`; its tenth is
   `55 nm = 5.5 x 10^-6 cm`, whereas `10^-6 cm = 10 nm`. Do not endorse those
   precision statements as numerically equivalent. Q6 needs no precision value.
2. Preserve formula (7.8): `2h = lambda/(2 n_film)`. It uses geometric round-trip
   distance with the in-film wavelength; the optical-path difference is
   `2 n_film h = lambda/2`. For the two-equal-pi-shift coating, the destructive
   family is `h = (2m+1) lambda/(4 n_film)` for nonnegative integer `m`. The frozen
   footnote at `p0232#10` literally says an integer number of wavelengths.
   Interpreted as `h = m lambda_film`, that does not provide this destructive
   condition. Do not silently alter it or invent missing source wording.
3. Reflection suppression needs phase **and** amplitude conditions. Energy
   conservation does not guarantee total transmission through an absorbing or
   otherwise imperfect complete instrument.
4. The frozen requirement mentions `reference46`, but no such identifier occurs
   in the supplied lesson, exercises or frozen block text. It remains unlocated;
   no unauthorized material was opened to invent a resolution. This does not
   block the six qualitative solutions.

## Supplementary Principle References

Primary publisher: OpenStax, Rice University. Search-result conceptual excerpts
only; full pages were not opened and no exercise solutions were consulted.

```text
[S1] University Physics Volume 3, 3.1 Young's Double Slit Interference
https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference
[S2] University Physics Volume 3, 3.4 Interference in Thin Films
https://openstax.org/books/university-physics-volume-3/pages/3-4-interference-in-thin-films
[S3] College Physics 2e, 27.1 The Wave Aspect of Light: Interference
https://openstax.org/books/college-physics-2e/pages/27-1-the-wave-aspect-of-light-interference
```

## Freeze and Usage

`source-solutions.json` is the structured companion; `verify.mjs` checks exact
question coverage and identities, input hashes, diagram declarations, scope
flags and output-path confinement. `verification.json` records that mechanical
check; it is not automated scientific or choice approval. `usage.json` declares
image, tool and prohibited-operation usage and explicitly leaves unavailable
token/cost telemetry unknown. `SHA256SUMS` hashes the frozen report bundle.

No source/native/canonical/meter/index changes, Git, database, publisher, deploy,
paid generation, branch/worktree creation or other-chat contact. Only these
ticket-local evidence files were written. The freeze is a content/hash snapshot,
not an operating-system lock or a ticket finalization. **Stop here.**
