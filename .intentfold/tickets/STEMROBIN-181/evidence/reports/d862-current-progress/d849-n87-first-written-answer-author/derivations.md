# d849 FIRST Written-Answer Author

Ticket: STEMROBIN-181, successor181-3. Lesson: phy10-c2-s3-n87. Author only.
These are independent FIRST candidates, not independently reviewed answers.
The exact d837 bilingual lesson/exercise inputs remain pending independent text review.
No old n87 answer keys, choices, or d839 independent solutions were read.

## Native Contract

`lesson_answers.py` defines `ld-s10y-answer/lesson-answers@1` and its prepare item
fields. Both files retain `status: draft`, six ordered `exercise` strings, the
exact corresponding modern `prompt`, empty `figureEvidence`, `source: derived`,
`grading: ungraded`, `parts: []`, and empty `historical_entities`.
There is no guessed `readonly`, widget, grading-input, locale, or group field in
the native answer schema. The locale is identified by its directory. Readonly
display-only intent is recorded here and in the report, not invented in-schema.
No interactions are produced.

The prepared `book.json` declares `exercise_numbering: lesson`. The native key
therefore uses the unchanged exercise `number`; it is not replaced with a
composite ID. The original source identities below remain exactly aligned in
raw and both modern exercise inputs:

| Native exercise | Source number | Group | Group ID | Source reference |
| --- | --- | --- | --- | --- |
| 1 | 1 | 问题 | g1 | p0232#7 |
| 2 | 2 | 问题 | g1 | p0232#8 |
| 3 | 3 | 问题 | g1 | p0232#9 |
| 4 | 4 | 问题 | g1 | p0233#1 |
| 5 | 5 | 问题 | g1 | p0233#2 |
| 6 | 6 | 问题 | g1 | p0233#3 |

All six are conceptual written tasks with no attached exercise figures. They
need meaningful explanations, not numeric or exact-answer matching. Every
`displayAnswer` supplies an answer and reasoning; no `bookRaw` is asserted.

## Independent Derivations

### 1. Coherent Light

Input: p0232#7; modern lesson explanation attached to p0230#4.
Split one incident field rather than assuming unrelated ordinary emitters share
phase. For a stable observable pattern, the parts must have the same frequency
and a stable relative phase over the observation interval, spatial overlap, and
compatible polarization components. Stable does not mean zero phase difference.
Beam splitting or a double slit are examples, not a claim that every arbitrary
split/path length preserves coherence. Both locales qualify path stability.

### 2. Interference

Input: p0232#8; modern p0230#3 and p0232#5.
For two compatible field components, the combined time-averaged intensity has
the interference term proportional to `cos(relative phase)`. Constructive
addition and destructive addition describe local reinforcement and weakening.
With opposing phase, the remainder depends on amplitude difference; complete
cancellation requires equal amplitudes. Stable fringes can occur but are not a
mandatory spatial form for every interference configuration. Energy is
redistributed, not destroyed.

### 3. Colour

Input: p0232#9; modern p0231#6 and p0232#2.
For visible monochromatic light, distinguish frequency from wavelength in a
particular medium. In vacuum, `lambda = c/f`; in a medium, `lambda = v/f`.
The same frequency can have different wavelengths in different media. Red and
violet are ordered by frequency with vacuum wavelengths given only
qualitatively. Mixed-light colour depends on spectral proportions, so this
answer does not assign a single frequency to every perceived colour.

### 4. Coloured Ice Cracks

Input: p0233#1; thin-layer reasoning from modern p0230#6 and p0231#6-11.
Model the relevant cracks as thin air gaps between ice surfaces, not as an
assertion that all cracks under all conditions produce this effect.
The two reflections originate in the same incoming white light; each spectral
component interferes with its corresponding component, not with a different
frequency. Thickness variation changes which components remain strong.

Independent phase reasoning for the simple propagating two-ray model:
at normal incidence, propagation contributes `4*pi*n_gap*d/lambda_0`. Ice to
air reflection has no pi reversal; air to ice reflection has a pi reversal.
Thus the relative reflected phase includes an additional pi. With this single
relative reversal, reflected minima at normal incidence occur when
`2*n_gap*d = m*lambda_0`, and reflected maxima when
`2*n_gap*d = (m + 1/2)*lambda_0`, for nonnegative integer `m`.
These are conditional model relations, not universal thin-film rules.
At oblique propagating incidence the optical-path term is
`2*n_gap*d*cos(theta_gap)`; reflection phases also need the appropriate
conditions. Total internal reflection is excluded from the simple pi/no-pi
description. The student answers give the normal-incidence optical path and
explicitly retain index, angle, and reflection-phase qualifications instead of
publishing an unqualified `2d = m*lambda` bright-fringe rule.

No instructions to create cracks or strike ice are added to either answer.

### 5. Seeing Underwater

Input: p0233#2; modern p0231#6 and question 3's frequency distinction.
For the same frequency, with the problem's relative index `n`,
`v_water = v_air/n` and `lambda_water = lambda_air/n`.
Frequency does not change at the stationary boundary. A shorter wavelength
inside water does not imply a change to ultraviolet frequency or invisibility.
Enough visible light reaching the eye permits sight. Absorption and scattering
can independently change brightness and spectral proportions; the answer does
not promise identical underwater appearance or unlimited visibility.

### 6. Source-Specific Applications

Input: p0233#3; p0230#4, p0230#6, p0230#9 through p0232#5.
Retain the source's interferometer measurements of wavelength and gas index,
surface-quality inspection with a reference plane and wedge-shaped air gap,
and antireflection for lenses/prisms in cameras, projectors, and periscopes.
Do not substitute an unrelated modern application list.

In the source coating model at normal incidence,
`n_air < n_film < n_glass`. Both reflected waves acquire pi at their reflection,
so their relative reflection phase is zero. Opposing return phase then requires
the thinnest coating to satisfy equation (7.8),
`2h = lambda_0/(2*n_film)`, or `h = lambda_0/(4*n_film)`.
This uses the vacuum wavelength with the film index, equivalently a quarter
of the film wavelength. Exact cancellation also requires matched amplitudes;
near matching only reduces reflection. Preserve the selected green vacuum
wavelength `5.5*10^-5 cm`, not a different wavelength or unit-dependent value.
One selected-wavelength coating cannot cancel all white-light components
equally. Without absorption or other losses, reduced reflected power increases
transmitted power. Do not claim interference consumes energy.

The literal source integer-wave footnote is retained in the input raw and
modern text. It is not used as a general design formula in these answers.
No source historical attribution is needed in a six-question answer, so no
new cultural name or historical declaration is introduced.

## Primary Research

One university-authored teaching page was read using `cloak-fetch`:
`https://farside.ph.utexas.edu/teaching/315/Waves/node94.html`
Title: Thin-Film Interference. Observed HTTP status: 200.
The rendered text explicitly describes a thin air layer between denser
surfaces, different reflection phase changes, and wavelength-selective white
light interference. This supports the air-gap model used for question 4;
the ice substitution and detailed phase derivation above are the author's own
reasoning. It does not supply an observation of this particular ice specimen.
Rendered equations were missing from the text, so no equation was treated as
copied or verified from that output. No images or screenshots were generated.

Two search calls returned no visible results; they did not provide evidence.
The university URL was checked directly through CloakBrowser.

## FIRST Boundary

Only a bounded JSON/identity/input-hash check is authorized here. It is not
physics approval, gate-2 passage, native finalization, or learner acceptance.
FIRST lookup failures and the FIRST structural result remain recorded.
No native prepare/finalize, rendering, interactions, promotion, shared meter,
index/canonical edit, database, publisher, deployment, git operation, full
tests/build, chat operation, branch, or worktree creation was performed.
Independent bilingual text and answer review are pending.
