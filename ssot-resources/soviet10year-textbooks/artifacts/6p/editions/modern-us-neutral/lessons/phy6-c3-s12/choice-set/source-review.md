# s12 Source-Only Independent Review

Date: 2026-11-15.
Reviewer: independent Codex reviewer, separate from the choice author.
Stage: all eight selected source tasks independently solved.
This is not approval of a choice draft, its views, options, key or coverage.

## Input And Access Boundary

Read only the supplied seed and its actual SVG as task evidence:

- Seed: .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s12/seed.json
- Seed byte SHA-256: 617255cda5f2d89cdda746ec111fa4b54c7e51817870d16b68e2592db705bb2e
- Canonical seed digest: 75cdc721664b118aaa6b1b9df560a5eb963e53be410fce8186f93a5f70478ce2
- Figure ID: tbl-p0070-01
- Seed asset path: ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/tbl-p0070-01.svg
- Actual asset SHA-256: 632152ceb36718af26e4e19170b4583fe7ac683a29e52dc082f7a680ff4a67b2

The actual SVG bytes match the seed's asset hash. This is also the exact hash
of the solid table I previously visually inspected in full, including its
original PNG, complete 960 px and normal-width images, left/right scroll
images and print preview. The user's explicit permission to reuse that prior
actual visual inspection is applied only after this new seed-asset binding.

Additionally read and parsed this actual seed SVG in headed Chromium, offline.
It contains 89 text labels for the headings and all 28 three-column data rows.
Relevant material/density labels were checked against the SVG's actual text.
The prior complete visual inspection covered the rightmost density column,
the final Chlorofiber row and the bottom rule; it was not a cropped preview.
No figure, source value or definition was taken from an author's solution.

Selected source IDs are exactly 1, 2, 3, 4, g2-1, g2-2, g2-3, g2-4.
Selected concept blocks are 6, 8, 12, 13, 14, 15: density as mass per unit
volume; its kg/m^3 unit; and rho = m/V with rho, m and V defined.
No solved example was needed or imported.

The seed's four trace entries are declared provenance bound by its canonical
digest. Their underlying book/lesson/exercise/figure-manifest files were not
opened or independently refreshed in this restricted phase.
No draft, author reasoning, answer key, prior choice output or interaction
configuration was read. No option or correct set was constructed.

## Figure Values Used

These are source-given reference values, not computed exercise answers.
Both columns and the correct material row were checked.

| Material | kg/m^3 | g/cm^3 |
| --- | --- | --- |
| Osmium | 22500 | 22.5 |
| Steel, iron | 7800 | 7.8 |
| Marble | 2700 | 2.7 |
| Ice | 900 | 0.9 |
| Brass | 8500 | 8.5 |
| Porcelain | 2300 | 2.3 |

Iron uses the combined "Steel, iron" row, not the separate Cast iron row.
The table is a concept figure available to the selected tasks even though
each exercise's individual figure_ids list is empty.

## Independent Source Solutions

### Source 1: Define Density

Task: state what the density of a substance means.

Density is the mass per unit volume of that substance. For a homogeneous
sample of positive volume, rho = m/V. Its numerical value is the mass
contained in one unit of the chosen volume when consistent units are used.
It is not the total mass of an unspecified object, its weight, or V/m.

If m is in kg and V in m^3, rho is in kg/m^3. If m is in g and V in cm^3,
rho is in g/cm^3. For the same uniform substance under the same conditions,
scaling a sample's mass and volume by the same positive factor leaves m/V
unchanged. No numerical density or sample dimensions are supplied here,
so no such value is invented.

Relevant concepts: blocks 6, 8, 12-15.

### Source 2: Iron's Density And The Meaning Of Its Number And Unit

Task: give iron's density and explain both the number and the unit.

The actual table gives rho_iron = 7800 kg/m^3 = 7.8 g/cm^3.
Thus a 1 m^3 iron sample has mass
m = rho*V = (7800 kg/m^3)*(1 m^3) = 7800 kg.
Equivalently a 1 cm^3 iron sample has mass 7.8 g.

The number 7800 is the numerical density expressed in kg/m^3: 7800 kg
of mass per cubic metre of iron. The unit kg/m^3 is a mass unit divided
by a volume unit, not a mass-only or force unit. The alternative number
7.8 means the same physical density in g/cm^3, not a different substance.
An arbitrary iron object's total mass still depends on its volume.

Unit check:
7800 kg/m^3 = (7800*1000 g)/(100^3 cm^3)
             = 7800000/1000000 g/cm^3 = 7.8 g/cm^3.

Relevant concepts: blocks 6 and 8; the table's Steel, iron row.

### Source 3: How To Calculate Density

Task: describe the calculation and its formula.

Measure the sample's mass m and volume V, then divide mass by volume:
rho = m/V, with V > 0.
The numerator and denominator must use consistent mass and volume units;
kg divided by m^3 gives kg/m^3, and g divided by cm^3 gives g/cm^3.
No numeric mass or volume is supplied in this source, so this is a complete
symbolic solution rather than a fabricated numerical measurement.

The same relation gives m = rho*V and V = m/rho for positive density.
These rearrangements justify the equal-volume and equal-mass comparisons
in g2-2 and g2-3; they do not reverse the definition of density.

Relevant concepts: blocks 12, 13, 14, 15.

### Source 4: Convert kg/m^3 To g/cm^3

Task: express a density given in kg/m^3 using g/cm^3.

1 kg = 1000 g and 1 m = 100 cm, hence
1 m^3 = (100 cm)^3 = 1000000 cm^3.
Therefore
1 kg/m^3 = 1000 g / 1000000 cm^3 = 0.001 g/cm^3.

For a numerical value R supplied in kg/m^3, the numerical value in
g/cm^3 is R/1000. The reverse conversion multiplies by 1000:
1 g/cm^3 = 1000 kg/m^3.
Changing units changes the numerical representation, not the density.
The volume conversion is cubic, not a linear metre-to-centimetre factor.

Source-bound check: iron's 7800 kg/m^3 / 1000 = 7.8 g/cm^3, matching
both printed table columns. The source supplies no other specific value
for this task; R remains symbolic.

Relevant concept: block 8; consistent mass/volume units in blocks 12-15.

### Source g2-1: Interpret Osmium's 22500 kg/m^3

Task: explain the meaning of the stated density, not just name its unit.

For osmium, rho = 22500 kg/m^3. The mass of 1 m^3 is
m = rho*V = (22500 kg/m^3)*(1 m^3) = 22500 kg.
That is what the stated number and unit together mean.

Equivalent unit check:
22500 kg/m^3 = 22.5 g/cm^3.
Consequently 1 cm^3 of osmium has mass 22.5 g.
These unit-volume statements do not claim that every osmium object has
mass 22500 kg; its mass is 22500*v kg when its volume is v m^3.
The seed supplies no particular specimen volume beyond the interpretation
of density per unit volume.

Relevant concepts: blocks 6 and 8; the Osmium table row corroborates the
stated value and its equivalent unit.

### Source g2-2: Equal-Volume Marble, Ice And Brass Cubes

Task: identify both the greatest and smallest mass, preserving equal volume.

Let the common positive volume be v m^3, where v is its numerical value.
Using m = rho*V:

- Marble: m_marble = (2700 kg/m^3)*(v m^3) = 2700*v kg.
- Ice: m_ice = (900 kg/m^3)*(v m^3) = 900*v kg.
- Brass: m_brass = (8500 kg/m^3)*(v m^3) = 8500*v kg.

Since 8500 > 2700 > 900 and v > 0,
m_brass > m_marble > m_ice.
Brass has the greatest mass; ice has the smallest.
At equal volume, mass is directly proportional to density.

The complete proportional comparison is
m_brass : m_marble : m_ice = 8500 : 2700 : 900 = 85 : 27 : 9.
In particular marble has three times ice's mass at the same volume.
The source gives no cube volume or side length, so the absolute masses
remain expressions in v; no 1 m^3 cube or other size is assumed.

Relevant concepts: blocks 6 and 12-15; all three material rows are needed.

### Source g2-3: Equal-Mass Porcelain And Iron Objects

Task: compare the volumes when both masses are 2 kg, and explain why.

The table gives rho_porcelain = 2300 kg/m^3 and
rho_iron = 7800 kg/m^3. Rearranging rho = m/V gives V = m/rho.

Porcelain:
V_porcelain = 2 kg / (2300 kg/m^3)
             = 1/1150 m^3
             = 20000/23 cm^3
             approximately 0.000869565217 m^3 = 869.565217 cm^3.

Iron:
V_iron = 2 kg / (7800 kg/m^3)
        = 1/3900 m^3
        = 10000/39 cm^3
        approximately 0.000256410256 m^3 = 256.410256 cm^3.

Independent gram-unit check, with 2 kg = 2000 g:
V_porcelain = 2000 g / (2.3 g/cm^3) = 20000/23 cm^3.
V_iron = 2000 g / (7.8 g/cm^3) = 10000/39 cm^3.

Thus the porcelain object's volume is larger. At equal mass, volume is
inversely proportional to density: the less dense substance needs a
larger volume to have the same 2 kg mass.
The exact comparison is
V_porcelain/V_iron = rho_iron/rho_porcelain
                   = 7800/2300 = 78/23, approximately 3.391304.

The exact fractions retain the result before any decimal rounding.
No shape, dimensions or different mass was added to the source conditions.

Relevant concepts: blocks 12-15; the Porcelain and Steel, iron rows.

### Source g2-4: Balsa Density In Both Requested Units

Task: calculate density from mass 12 g and volume 100 cm^3, and give both
g/cm^3 and kg/m^3. The material identity is supplied by the seed.

rho = m/V = 12 g / 100 cm^3 = 0.12 g/cm^3.

Convert that result:
0.12 g/cm^3 * 1000 = 120 kg/m^3.

Independent SI calculation:
m = 12 g = 0.012 kg.
V = 100 cm^3 = 100/1000000 m^3 = 0.0001 m^3.
rho = 0.012 kg / 0.0001 m^3 = 120 kg/m^3.

Both routes agree:
rho_balsa = 0.12 g/cm^3 = 120 kg/m^3.
The first number means 0.12 g per cm^3, and the second means 120 kg
per m^3 of the same uniform material. Neither is the mass of the given
100 cm^3 sample, which remains 12 g.
No table density was substituted for these explicit source measurements.

Relevant concepts: blocks 8 and 12-15.

## Explicit Omission And Next-Stage Boundary

The separate soap experimental task q1 was not selected into this seed.
It is outside this review. Its specimen dimensions, measured mass, volume
and density were neither read nor guessed. Selected source ID 1 above
is the density-definition task and must not be confused with that soap q1.

There are no unresolved data or unit conventions preventing the eight
source solutions above. Equal-volume and equal-mass conditions were kept
distinct throughout; both requested extrema in g2-2, the explanation in
g2-3, and both requested units in g2-4 are answered.

Choice task fidelity, redundancy, answer leakage, option truth sets,
distractor derivations and package coverage remain unreviewed.
No s10y-choice-review-v1 or choice PASS is issued at this stage.
Await a separate, explicit view-only authorization before accessing any
learner-facing draft view; author internals remain unread until their later
comparison stage is authorized.

Only this source-review.md was written. Seed and SVG are unchanged.
No app, dependency, DB, model service, publication, durable-resource or Git
operation was performed.
