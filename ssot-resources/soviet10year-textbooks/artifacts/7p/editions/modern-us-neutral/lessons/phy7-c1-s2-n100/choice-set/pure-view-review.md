# FIRST Independent CHOICE Review: Pure-View Freeze

Date: 2026-11-17. Ticket: STEMROBIN-180. Batch: 52.
Book/lesson: 7p / phy7-c1-s2-n100.
Stage-2 input:
.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/pure-view.json

Observed pure-view canonical SHA-256:
8fde72b4bf192f81d26df7303b84793dabb72dd7613e791763ab25e63d905c6e

The source-first file had already been written. Its byte SHA-256 was:
ec7d1b9d7488b10fcbfc918a2e97976878e3e3a7d377e12a202b633b3650426c

Seed canonical SHA-256:
0f89f9e6644c5169f345c30536bbda57a9179b0529a9b94fad4a66d4cfbb64d2

No draft, intent, key or author solution has been opened at this freeze.
Only the four visible questions and their 18 options were reviewed.
All question/option figure_ids are empty. Images opened: 0.
Within each question below, fidelity/redundancy/leakage judgments precede
the independent truth checks.

## n100-q1: Source 1

Task fidelity: pass. The stem retains pure crystal, constant pressure,
solid/liquid coexistence, ongoing absorption and the no-chemical-change/
negligible-work approximation. Its alternatives require distinguishing
phase-change energy from thermal-motion temperature and explaining the
plateau. It does not generalize the plateau to all stages.
Selecting a supplied explanation does not prove independent prose production;
this limitation is not an essential physical-task omission.

Redundancy: pass locally. A tests internal-energy/temperature identity, C
tests average kinetic energy, and D tests an invented cancellation between
liquid heating and solid cooling; these are distinct incorrect mechanisms.
The repeated energy claim across q1 and q2 is recorded under q2 redundancy.

Answer leakage: revise at package level. q1-B explicitly says absorbed heat
changes arrangement/interactions and increases internal energy during the
unchanged-temperature process. q2-A repeats the melting/internal-energy
claim under the same conditions. Solving either provides that part of the
other's answer, so the pair is not independent evidence for the shared
physical judgment. Neither stem prints a correct label; the finding is a
cross-question answer cue, not a leaked internal key or source number.

Independent solution: Absorbed heat changes the phase/interactions; internal
energy increases under the stated approximation while temperature stays at
the melting point. Complete true set: [B].

| Option | Truth | Independent evidence |
| --- | --- | --- |
| A | incorrect | Arrangement can change at fixed temperature and Delta U approximately equals positive absorbed heat; temperature is not all of internal energy. |
| B | correct | Melting changes particle arrangement/interactions, absorbs energy and increases internal energy without raising the coexistence temperature. |
| C | incorrect | Putting all absorbed heat into increased average random kinetic energy conflicts with unchanged thermal-motion temperature; coexistence does not cancel that contradiction. |
| D | incorrect | The fixed-pressure coexistence plateau is not liquid heating compensated by solid cooling; the equilibrium phases share the melting temperature. |

## n100-q2: Source 2

Task fidelity: pass. The question asks about total fuel release, not only
heat absorbed by the crystal. It retains the melting-point/coexistence/
constant-pressure and negligible-work qualifications. The total-transfer,
environment-only and disappearance alternatives force distinct judgments
about the fuel budget. The absorbed portion is accounted for as well.
No fuel efficiency or numeric heat fraction is demanded without data.

Redundancy: revise for the shared response unit. q2-A re-tests the same
melting-causes-internal-energy-increase conclusion as q1-B, with the same
approximation. The fuel-versus-container/environment decisions in q2-B/C/D/E
are distinct and worth retaining. This finding does not say the entire
question is redundant or that source 2 is absent.

Answer leakage: revise. Once q1's correct explanation has been selected,
q2-A can be selected by matching that explanation without a fresh judgment
about the fuel's total energy. Conversely q2-A supplies the central
internal-energy claim used to distinguish q1-B from q1-A. The phrase
"part of the energy transferred to the crystal" is an application to the
heater, but does not remove the duplicated answer clause.

Independent solution: In the ordinary heater described, only part of the
fuel release reaches the crystal; container/surroundings receive some.
The crystal's absorbed portion supports melting and increases its internal
energy in the stated approximation. Constant temperature neither proves
zero heat transfer nor destroys energy. Complete true set: [A, C].

| Option | Truth | Independent evidence |
| --- | --- | --- |
| A | correct | Energy reaching the melting crystal is used for the phase change; with negligible work and no chemical change its internal energy increases. "A part" need not assert that another absorbed part has a specified competing use. |
| B | incorrect | An ordinary fuel heater is not stipulated perfectly isolated or 100% efficient; total fuel release cannot be equated to the crystal's absorbed heat. |
| C | correct | Container and surroundings receive energy in the described real heating process; not all fuel energy melts the crystal. No quantitative loss fraction is inferable. |
| D | incorrect | The crystal can absorb heat with no temperature rise during melting; a constant temperature does not route all fuel energy away from it. |
| E | incorrect | Energy not producing a temperature rise can change internal energy or reach the surroundings; it is not annihilated. |

## n100-q3: Source 3

Task fidelity: pass. This is natural definition recognition, with pressure
in the stem and unit mass, initially-at-melting-point, complete melting and
same-temperature liquid in the alternatives. Choosing the correct definition
requires distinguishing partial fusion, preheating and arbitrary-mass total
heat. Independent composition/recall of the definition is not demonstrated;
that response-production loss alone is not a reason to block.

Redundancy: pass. The options separately change completeness, starting state
and mass normalization. They are not equivalent definitions.

Answer leakage: pass, with a package relationship recorded. q1/q2's stems
mention the melting point and phase coexistence but do not supply the
unit-mass, complete, same-temperature definition. q4's use of "specific heat
of fusion" is the same named quantity, not a revealed correct option.
q3's definition helps motivate energy/mass in q4, but does not print the
three acceptable units or make them a text-copying task.

Independent solution: lambda=Q_melting/m at fixed pressure for complete
conversion of pure solid already at its melting point to liquid at the
same temperature. Complete true set: [C].

| Option | Truth | Independent evidence |
| --- | --- | --- |
| A | incorrect | Partial melting of 1 kg absorbs only the heat corresponding to the mass actually melted, not the specified complete unit-mass conversion. |
| B | incorrect | Heating to the melting point is sensible heating before fusion, not heat of same-temperature fusion. |
| C | correct | Fixed pressure from the stem plus 1 kg, initially at the melting point, complete conversion and same-temperature liquid match the per-mass definition. |
| D | incorrect | Arbitrary-mass total heat is Q=m*lambda; without dividing by mass it is not the material's specific heat of fusion. |

## n100-q4: Source 4

Task fidelity: pass. All three units listed in the seed appear, together with
total-energy and specific-heat-capacity distractors. The native multiple mode
requires the entire energy-per-mass set. There is no table, numeric value,
figure-229 slot or table-261 reading task in this source.
Recognition of supplied units does not demonstrate unaided listing of them.

Redundancy: pass. J/kg, kcal/kg and cal/g share the appropriate dimensions,
but are the three explicitly requested unit names. Listing them as separately
selectable answers is not redundant alternatives that destroy the task.
J alone and J/(kg*degree C) test different quantities.

Answer leakage: pass with limited dependence acknowledged. q3's definition
supports the energy/mass relationship, as the source concepts themselves do.
It supplies no unit list, no correct labels and no conversion values.
The learner still must classify all five units; this is meaningful dimensional
judgment, not isolated copying of another answer. The items cannot establish
independent unaided recall, which is separately recorded as a limitation.

Independent solution: Specific heat of fusion has dimensions energy/mass.
Complete true set: [A, C, D].

| Option | Truth | Independent evidence |
| --- | --- | --- |
| A | correct | J/kg is energy per mass, the SI unit for specific heat of fusion. |
| B | incorrect | J alone measures energy Q, not the per-mass quantity lambda. |
| C | correct | kcal/kg is energy per mass and one of the source's three listed units. |
| D | correct | cal/g is energy per mass and another listed unit; changing the energy/mass scale does not introduce a temperature factor. |
| E | incorrect | J/(kg*degree C) includes inverse temperature and is a specific-heat-capacity unit, not a heat-of-fusion unit. |

## Four-Source Coverage and Frozen Verdict

Source 1: pass coverage; q1 preserves the phase-change explanation and the
internal-energy/temperature distinction. Prose production is lost.

Source 2: pass coverage; q2 retains both total fuel allocation and use of
the absorbed portion. Independent written accounting is lost. Its shared
internal-energy response unit leaks across the q1/q2 pair.

Source 3: pass coverage; q3 preserves every defining condition and contrasts
unit-mass latent heat with sensible heat and arbitrary-mass total heat.
Independent definition writing is lost but natural definition recognition
still requires the source's conceptual distinctions.

Source 4: pass coverage; q4 includes all three named units and requires
energy/mass rather than energy or energy/(mass*temperature). Unaided unit
listing is lost; there is no missing table-reading requirement.

All 18 options have been checked; there is no unresolved physical input.
Mathematics is independently pass for all four questions. Overall semantic
outcome: revise, for the concrete q1-B/q2-A repeated answer and mutual cue.
No blocked finding. Candidate questions will not be changed by this reviewer.

This pure-view review is frozen before disclosure of the author's intent,
key, coverage or source-solutions.md. Subsequent comparison cannot overwrite
the independent sets or downgrade this finding merely because keys agree.
