# STEMROBIN-180 b94: n92 CHOICE Source-First Review

## Boundary

Fresh independent reviewer; SOURCE ONLY. Input was exclusively the immutable seed
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n92-choice-author/stage2/seed.json`,
book `7p`, lesson `phy7-c1-s1-n92`.

- Seed bytes: `4675`.
- Seed byte SHA-256: `a021ae9eb5afcddb2f1f7a8319de62975838dcb769f0896ffe6e50e75af46760`.
- Seed canonical SHA-256: `4b88e57b706af091b80fa9a9b107e68de820e5870e8695f750b32d38c7bc339c`.
- Selected definition blocks: `0, 1, 5, 6, 8`.
- Exercises independently solved: `5`; recorded source tasks: `11`.
- Capacity-criteria sets: `5`; source figures and images opened: `0`.
- Learner questions and options reviewed: `0`.

No author-adjacent files, answers, internal solutions, reasoning, draft, views,
output reports/manifests, choice history, or external answers were inspected.
No database, environment, publishing, dependencies, application, other chats, or
history access occurred. Backing lesson files and seed trace targets were not
opened or independently freshness-checked. The seed itself contains the permitted
water value and lead explanation; using these selected definitions is distinct
from inspecting undisclosed author work.

This is pre-disclosure source evidence, not a `s10y-choice-review-v1` gate and not
an approval. Actual coverage, fidelity, redundancy, leakage, and all-option
mathematics await the learner-only blind stage.

## Independent Source Solutions

### Exercise 1: Definition

Specific heat `c` is the heat needed to raise the temperature of one unit mass of
a specified substance by `1 degree C`. With kilograms and joules, raising `1 kg`
by `1 degree C` requires `c J`; with grams and calories, raising `1 g` by
`1 degree C` requires `c cal`. Both normalizations are essential. In the lesson's
sensible-heating model, `Q = m*c*DeltaT`, hence `c = Q/(m*DeltaT)` for nonzero
`DeltaT`. This is not an arbitrary object's total heat, heat capacity, internal
energy, or absolute final temperature.

Source tasks: define normalized heat; retain substance, mass, temperature-change,
and compatible unit relationships. At fixed substance and `DeltaT`, total `Q`
scales with mass while `c` remains the normalized property.

Capacity criteria: the response must require judging a complete definition rather
than identifying the letter `c` or an isolated unit. Recognition instead of free
verbal formulation is an honest production loss, not an automatic failure.
Later inspect whether another visible item simply supplies this definition.

### Exercise 2: Water in Two Units

The permitted definition gives `4200 J` or `1 kcal` to warm `1 kg` of water by
`1 degree C`. Thus the requested first value is
`4200 J/(kg*degree C)`. Converting both energy and mass,
`1 kcal/(kg*degree C) = 1000 cal/(1000 g*degree C) = 1 cal/(g*degree C)`,
so the requested second value is `1 cal/(g*degree C)`. The ordered pair is
`4200`, then `1`, with those units. As an independent unit check,
`4.2 J/(g*degree C)` is equivalent to the first value, not the requested
calorie-unit value. Keep the seed's rounded convention.

Source tasks: supply both correctly paired values; maintain consistent energy
and mass normalization. The two factors of `1000` cancel when converting
`kcal/kg` to `cal/g`.

Capacity criteria: do not omit either unit, swap pairings, or silently replace
`cal/g` with `kcal/kg`. Complete-pair recognition may preserve the task despite
loss of free recall. Later test whether the learner merely copies values from
the stem or another question, and check physically equivalent alternatives.

### Exercise 3: Meaning of Lead's Coefficient

`140 J/(kg*degree C)` means `1 kg` of lead absorbs `140 J` when its temperature
increases by `1 degree C`. Equivalently, `1 kg` cooling by `1 degree C` releases
`140 J`. Both meanings are present in the selected definition. For the same
material regime, `Q = 140*m*DeltaT J` with mass in kilograms. Independent checks:
`1 g` warming by `1 degree C` requires `0.14 J`; `2 kg` requires `280 J`.
These checks are not additional source exercises.

Source tasks: interpret the normalized heating process; account for equivalent
cooling and release. `140 J` is neither the heat for every lead object nor a
statement that the final temperature must be `1 degree C`.

Capacity criteria: assess the physical meaning, not the already printed numeral.
Preserve material, mass, change, energy magnitude, and direction. Heating alone
can answer the literal task, but a correctly qualified cooling interpretation
cannot be rejected as false. If both appear as distinct single-choice answers,
there may be non-uniqueness; multiple-choice truth sets must include every true
interpretation. Record any lost cooling coverage and free explanation.

### Exercise 4: Internal-Energy Change

The selected definition says `c`, in `J/(kg*degree C)`, measures the internal-energy
increase in joules when `1 kg` warms by `1 degree C`. With equal masses and equal
positive temperature changes, larger `c` means a larger increase. In the same
approximately constant-`c`, no-phase-change sensible-heating model, with no
relevant work transfer, `DeltaU = m*c*DeltaT`; cooling gives negative `DeltaU`.
The normalized physical statement is the primary source answer; the formula is
a derived check. `c` does not determine absolute `U` or every object's total
`DeltaU`. Do not universalize the relation to every process or phase change.

Source tasks: connect normalized `c` to an internal-energy increase; distinguish
that change from absolute or unnormalized energy. `c` and `DeltaU` have different
units. Fixed positive `m` and `DeltaT` give `DeltaU` increasing with `c`; fixed
`m` and input energy instead give a smaller `DeltaT` for a larger `c`.

Capacity criteria: retain the explicit internal-energy task rather than duplicate
exercise 1 or 3. Qualify comparisons by their fixed quantities and sign.
Recognition can preserve the relationship while losing free explanation; bare
formula or symbol matching may lose the normalized physical interpretation.

### Exercise 5: Nearby Water and Seasonal Air Temperature

Water has a comparatively large specific heat. A large water body's mass and
high `c` allow substantial heat absorption or release with a relatively small
temperature change. In summer, water absorbs heat as it warms, making nearby
places less hot than comparable inland places. In winter, it releases heat as
it cools, making nearby places less cold. Both branches moderate seasonal
extremes; this is not permanent cooling. The supporting relation is
`|DeltaT| = |Q|/(m*c)` under comparable conditions. This is the seed's idealized
nearby-versus-far comparison, not an unconditional statement about every
shoreline on every day.

Source tasks: connect large `c` and thermal storage causally to moderation;
preserve summer absorption and its less-hot result; preserve winter release and
its less-cold result. High `c` means a smaller temperature response for the same
heat per mass, not faster warming and cooling.

Capacity criteria: require causation and both seasonal branches across the
package. Naming high specific heat alone is insufficient. A one-season response
omits part of the selected explanation and needs substantive accounting.
Recognition of a full causal explanation may be faithful despite loss of free
construction. Check reversed heat direction, permanent-cooling claims, and
cross-question cues later.

## Package Relationships and Binding

Exercises 1, 2, and 3 share units but respectively require definition, water's
two-unit values, and a physical interpretation of lead's coefficient.
Exercise 4 adds internal-energy change; exercise 5 adds two-direction seasonal
application. Merging or splitting cannot silently erase these distinctions.
Reasonable elimination and complete-response recognition are not automatically
defects. Concrete losses of recall, explanation, or coverage must be recorded,
and loss of an essential task prevents approval.

The structured source report and seal manifest live in the assigned
`n92-CHOICE-FIRST-SOURCE/` scratch directory. They bind this evidence to seed,
rule, output, and completed command-receipt hashes. This durable report contains
the substantive evidence itself and requires no scratch artifact to understand
its solutions or criteria.

STOP: await explicit parent binding to the frozen source evidence before any
learner-only BLIND disclosure. No author draft is approved by this source stage.
