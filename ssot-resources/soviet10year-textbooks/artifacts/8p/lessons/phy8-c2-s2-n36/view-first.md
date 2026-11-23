# View-first independent review (frozen)

Reviewer: Codex independent agent, GPT-5-based coding assistant, current chat.
Date: 2026-11-23.

The source-first.md freeze was written before seed or draft access.
The subsequent read-only batch returned canonical page JSON/audits, choice-seed.json,
and a JSON-structural draft projection containing only questions.id,
questions.source_numbers, questions.view, and coverage. Seed and view were
obtained in that same parallel batch, not separate serialized calls.
No draft intent/key, author's solution, answer-keys.json, or other reviewer
output has been disclosed. Only this file's conclusions are frozen here.

## Fidelity, redundancy, leakage before key access

1. gravity-definition / source 1:
   Definition, direction and force recipient are retained. C also applies F=mg
   at a fixed location; B distinguishes Earth's force on a body from its force
   on a desk, and D tests gravity during fall. Selecting statements cannot
   demonstrate independently writing a definition; coverage explicitly records
   that loss. No duplicate statement and no stem-provided correct assertion.
   Fidelity pass, redundancy pass, leakage pass.

2. latitude-difference / source 2:
   Both measured values are reproduced as data, not as the requested difference.
   Subtraction remains necessary; distractors are sum, misplaced decimal and
   mean. Supplying the data makes the item self-contained rather than leaking
   its result. Writing the calculation is lost and recorded.
   Fidelity pass, redundancy pass, leakage pass.

3. height-three-radii / source 3:
   Explicit spherical/nonrotating approximation is consistent with the source.
   Surface height 3R still requires center distance 4R and inverse-square
   scaling. Symbolic g0/16 replaces decimal substitution, a concrete recorded
   capacity loss, but preserves both decisive mathematical relationships.
   This review does not claim the choices test decimal arithmetic.
   Fidelity pass, redundancy pass, leakage pass.

4. half-gravity-height / source 4:
   Same body, surface height and half of surface force are retained. Full
   alternative heights require distinguishing r from h and inverse-square
   inversion; writing the equation and solving the square root are recorded
   production losses. Q3 does not state Q4's result and vice versa.
   Fidelity pass, redundancy pass, leakage pass.

5. mars-acceleration / source 5:
   M=6e23 kg and radius 3300 km are unchanged. The preceding G is supplied
   openly as data, not an answer. Unit conversion and inverse-square arithmetic
   remain necessary; self-written scientific notation and constant recall are
   lost and recorded. Acceleration is still the requested quantity.
   Fidelity pass, redundancy pass, leakage pass.

Package coverage is one question per source 1-5, with no silent omission,
split-cell response or cross-question answer dependency. Recognition does not
prove independent written production; the five coverage losses are real but do
not remove the decisive source mathematical tasks.

## Fresh visible-option solutions and complete true sets

gravity-definition: true set {A,C}.
- A correct: Earth attracts the body; direction is toward Earth's center in the
  explicitly nonrotating near-surface source model.
- B incorrect: pressure on a desk is exerted by the body on a different recipient,
  not Earth's gravitational force on the body.
- C correct: at the same position g is fixed, so F(2m)=2mg=2F(m).
- D incorrect: free fall is accelerated by gravity; removing support does not
  remove Earth's attraction.

latitude-difference: true set {A}.
- A correct: 9.83-9.78=0.05 m/s^2.
- B incorrect: 9.83+9.78=19.61 is the sum, not the difference.
- C incorrect: 0.5 is ten times the calculated 0.05.
- D incorrect: (9.83+9.78)/2=9.805 is the mean.

height-three-radii: true set {B}.
- A incorrect: 1/9 would use the height 3R as the center distance.
- B correct: g/g0=R^2/(R+3R)^2=1/16.
- C incorrect: 1/4 drops the square of the valid center-distance ratio 4.
- D incorrect: 1/3 both substitutes height for radius and drops the square.

half-gravity-height: true set {C}.
- A incorrect: sqrt(2)R is the required center distance; if used as h,
  F/F0=1/(1+sqrt(2))^2=3-2sqrt(2), not 1/2.
- B incorrect: h=R makes r=2R and F/F0=1/4.
- C correct: R^2/(R+h)^2=1/2 implies h=(sqrt(2)-1)R.
- D incorrect: h=R/2 makes r=1.5R and F/F0=4/9, not 1/2.

mars-acceleration: true set {D}.
- A incorrect: treating 3300 km as 3300 m yields 3.6749e6, rounded to 3.7e6.
- B incorrect: using GM/R rather than GM/R^2 yields 1.2127e7 numerically;
  that expression has the wrong dimension and is not acceleration.
- C incorrect: reversing the formula gives R^2/(GM)=0.2721..., with reciprocal
  acceleration dimension, not the stated acceleration.
- D correct: 3300 km=3.3e6 m; GM/R^2=3.674931129... m/s^2, about 3.7.

All 20 visible options were checked independently. Images remain exactly four
source-page loads in one batch, with zero additional image loads. Full author
reasoning and answer comparisons have not yet occurred at this freeze.
