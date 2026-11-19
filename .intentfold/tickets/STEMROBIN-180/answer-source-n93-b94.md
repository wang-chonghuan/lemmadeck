# n93 Independent ANSWER SOURCE C / b94

Status: PASS for independently derived SOURCE solutions. No author key comparison, runtime grading or whole-lesson approval.

Frozen TEXT input manifest SHA-256: 218081762dfb39ec3d25a7706bde72dabd229b72ee435dd9f51831aaafa9220b
Original table SHA-256: e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189
Existing native evidence SHA-256: 9a98cb8d83eeb6dd72bf986a1c7b633c74aa9c0772b92920feeff1ae14e51924
Independent pixel inventory SHA-256: ba98dec1925e581b9b5d104f19028b5534d9424fcf0bd9660ff39fa63b06d502

Coverage: 8/8 tasks, 2 groups, 3/3 circled numeric parts, 37 facets, 16 table rows / 32 numeric cells.
Exactly two image loads, one per allowed image. No crops, reopens or extra images.

## Independent Solutions
### 1 (g1/1)
Source: p0245#5. Provenance: derived; bookRaw: null.
Know the material specific heat c, mass m, initial temperature t1 and final temperature t2 (or the known positive rise Delta t). Then Q_abs = c m (t2 - t1).
- specific-heat: The material/state-specific c is required, not the heat capacity of an unrelated material.
- mass: Mass m of the heated body is required.
- temperature-data: Both t1 and t2, or their positive difference, suffice; t2 itself is not the temperature rise.
- units: With c in J/(kg degree Celsius), m in kg and difference in degrees Celsius, Q is in J.
- physical-domain: Temperature-change model uses the stated specific heat without a phase change; c is treated as constant over the source calculation.
Grading: ungraded. An open list of known conditions admits different equivalent wording; a numeric/exact string does not judge explanatory completeness.

### 2 (g1/2)
Source: p0245#6. Provenance: derived; bookRaw: null.
One permissible example: heat the source 5 kg iron part through 600 degrees Celsius. Using c = 460 J/(kg degree Celsius), Q_abs = 460 * 5 * 600 = 1380000 J = 1380 kJ. A permissible cooling illustration is source 0.2 kg water from 100 to 40 degrees Celsius: Q_release = 4200 * 0.2 * (100 - 40) = 50400 J. A learner may instead supply any correctly specified, coherently calculated example.
- own-example: The question asks the learner to give an example. The displayed book-based examples are illustrative, not the only acceptable answers.
- givens: An adequate example supplies material/c, mass and initial/final temperatures or a rise/drop.
- heating-direction: For warming, use final minus initial and identify a positive absorbed magnitude.
- cooling-direction: For cooling, use initial minus final for the positive released magnitude; negative signed heat is a different convention.
- calculation-and-units: Show substitution, mass conversion if needed and an energy unit; c m Delta t must be computed correctly.
- or-not-and: A correct heating OR cooling example fulfils the source request; do not force both examples or one particular numerical total.
Grading: ungraded. The learner chooses the example and the source explicitly allows either direction. Auto-checking only 1380000 or 50400 would incorrectly reject valid examples.

### 3 (g1/3)
Source: p0245#7. Provenance: derived; bookRaw: null.
With t1 initial and t2 final: Q_abs = cm(t2 - t1) for warming and Q_release = cm(t1 - t2) for cooling. Equivalently the nonnegative transferred magnitude is cm|t2 - t1|. If Q is signed heat into the body, Q = cm(t2 - t1), so Q is negative during cooling.
- symbol-definitions: c is specific heat, m mass, t1 initial and t2 final; Q denotes transferred heat under the declared convention.
- heating-formula: Q_abs = cm(t2 - t1) with t2 greater than t1 reproduces the lesson formula.
- cooling-and-sign: Q_release = cm(t1 - t2) is a positive release magnitude. cm(t2 - t1) during cooling is valid only as negative heat into the body.
- dimensional-check: J/(kg degree Celsius) times kg times degrees Celsius equals J; compatible calorie units are also valid.
Grading: ungraded. A formula-only, explicitly scoped heating expression could be graded with expression equivalence after authoring and runtime validation. This independent solution also accepts declared release/signed/absolute-difference conventions; no single-string auto gate is certified.

### 4 (g1/4)
Source: p0245#8. Provenance: derived; bookRaw: null.
In the ideal isolated mixing system, hot water releases the same heat as cold water absorbs. The lesson values give 50400 J on each side. Equivalently the hot portion loses the internal energy gained by the cold portion. In a real measurement, heat exchange with the container and surrounding air must be included; equality between only the two water portions is an approximation, improved by reducing losses.
- transfer-direction: Energy moves from hot to cold during the mixing experiment.
- ideal-balance: Q_hot_release = Q_cold_absorb for the isolated two-portion idealization; both given calculations yield 50400 J.
- internal-energy: Decreased internal energy of cooling bodies equals increased internal energy of warming bodies for the complete energy-accounting system.
- real-apparatus: The container/air can take some heat; do not claim exact equality between just the water portions in every real experiment.
Grading: ungraded. The task asks for a conclusion and explanation; a number alone does not satisfy its facets.

### g2-1 (g2/1)
Source: p0245#10. Provenance: derived; bookRaw: null.
The source value means that raising the temperature of 1 kg of aluminum by 1 degree Celsius requires 920 J, or approximately 0.22 kcal at the table precision. Cooling that same mass by 1 degree Celsius releases the same corresponding amount under the same specific-heat approximation.
- unit-mass: The definition refers to 1 kg, not 1 g or an unspecified mass.
- unit-change: The definition is a change of 1 degree Celsius, not a final temperature of 1 degree Celsius.
- heat-and-internal-energy: Warming absorbs energy and increases internal energy; reversing the temperature change releases energy.
- dual-source-units: Preserve 920 J and 0.22 kcal from the source as rounded alternative column values; do not impose an externally converted exact identity.
Grading: ungraded. This is the physical meaning of a specific-heat quantity, not a request to return the supplied number alone.

### g2-2 (g2/2)
Source: p0245#11. Provenance: derived; bookRaw: null.
Vegetable oil rises in temperature fastest among the listed liquids under equal masses and the same net heat input (or equal net heating power and duration). The actual table liquid values are vegetable oil 2000, kerosene 2100, alcohol 2500 and water 4200 J/(kg degree Celsius); Delta t = Q/(mc), so the smallest c gives the largest rise. The descending warming-rate order is vegetable oil, kerosene, alcohol, water.
- actual-liquid-set: Use the table liquid rows only: Vegetable oil, Kerosene, Alcohol and Water. Exclude solid Ice, despite its nearby 2100 value.
- equal-mass: Masses must be equal for c alone to decide. The printed same-heating condition carries the intended classroom comparison; if masses differ the decisive quantity is mc and no unique answer follows from c alone.
- equal-net-input: Compare the same absorbed Q, or P_net over the same time, without different losses or phase changes.
- source-minimum: Vegetable oil is the unique minimum liquid c: 2000 J/(kg degree Celsius), with source alternate 0.48 kcal/(kg degree Celsius).
- formula-reason: Delta t = Q/(mc), or dT/dt = P_net/(mc). The result is a relative rise/rate, not a claim about final temperatures with unequal starting temperatures.
Grading: ungraded. A categorical conclusion plus assumptions/reasoning is best displayed as an ungraded response here; no actual text/MathLive serialization or synonym grading is tested.

### g2-3 (g2/3)
Source: p0245#12 + p0246#1. Provenance: derived; bookRaw: null.
Water has the largest specific heat among the source table liquids: 4200 J/(kg degree Celsius), or 1.00 kcal/(kg degree Celsius). For equal mass and the same allowed temperature rise it absorbs more heat, Q = cm Delta t. For a fixed heat load its own temperature rises less, Delta t = Q/(mc), so it can remove substantial heat from an engine while warming comparatively little.
- source-comparison: Water 4200 exceeds vegetable oil 2000, kerosene 2100 and alcohol 2500 in the actual table.
- heat-capacity: For fixed mass and allowed rise, larger c permits more absorbed heat.
- temperature-buffering: For fixed absorbed heat and mass, larger c gives a smaller temperature increase.
- scope-and-state: This is the source specific-heat comparison in the liquid/no-phase-change model, not a universal engineering claim that water is optimal in every coolant application.
Grading: ungraded. The question asks why. A returned c value without the heat-capacity argument is not a complete explanation.

### g2-4 (g2/4)
Source: p0246#2. Provenance: derived; bookRaw: null.
Circled 1: Q = 540 * 1.5 * 200 = 162000 J = 162 kJ. Circled 2: 50 g = 0.05 kg and Delta t = 90 - 20 = 70 degrees Celsius; Q = 920 * 0.05 * 70 = 3220 J = 3.22 kJ. Circled 3: 2 metric tonnes = 2000 kg and Delta t = 60 - 10 = 50 degrees Celsius; Q = 750 * 2000 * 50 = 75000000 J = 75000 kJ = 75 MJ.
- part-1-material-and-rise: Use Cast iron 540, not Iron 460 or Steel 500. The stated 200 degrees Celsius is already a rise.
- part-2-mass-and-difference: 50 g is 0.05 kg; use 90 - 20 = 70, not 90 as the rise.
- part-3-mass-and-difference: 2 tonnes is 2000 kg; use Brick 750 and 60 - 10 = 50. The brick masonry mass, not fuel energy or phase-change heat, is modeled.
- energy-unit-and-precision: Use energy units. Keep direct products from the actual source J-column constants: 162000, 3220 and 75000000 J; no external table constants and no invented book-answer rounding.
- model-and-grading: All are positive absorbed-heat magnitudes, constant stated c and no phase change/loss in the object-heat calculation. Three independent numeric parts need explicit unit labels. Heater supplied energy could be greater if losses are included; losses are not specified here.
Grading: auto-numeric-prospective. Use three numeric parts with fixed J labels and expected 162000, 3220, 75000000; do not embed explanation text in expected. A free-unit response needs unit normalization. The separately rounded kcal column gives 39, 0.77 and 18000 kcal; these must not be treated as exact SI conversions or accepted as those bare numbers in a J-labeled field.

## Evidence And Boundaries
- The source table was read from actual pixels first. Its 16 rows, both original numeric columns, title and structure were written and frozen before reading canonical FigureSpec provenance.
- The existing native screenshot preserves all 32 numeric cells, corresponding English labels and row order. It contains no derived answers.
- The canonical spec inventory and object strings were then checked against the independent pixel inventory; no full-FIG review was replayed.
- Source cooling erratum p0244-math-1 stays raw in the source and corrected only in current modern prose.
- The canonical 7p answers.json is absent. No answer file was read; all eight solution provenance fields are derived.
- Seven open/conceptual responses are not forced into single-answer mechanical grading. The final numeric task has three prospective numeric parts with explicit J units.
- The original alternate kcal column is independently rounded. Its products 39 / 0.77 / 18000 kcal must not be equated exactly to the SI-column products or accepted as those numbers in J fields.
- Parent must bind this frozen SOURCE before disclosing an author key. FIRST-FINAL comparison has not happened.

## Exact Inputs
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/lesson.template.json: dcc84151d0f90496d5a3f3265b41df346cdde57e095592e4fb735a6326bd4434
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/exercises.template.json: f0c4211af8fe62e24379e414a768dc1f51f14d6afc67970f515da41ae98cbd27
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/figures.template.json: 8afa9d1a96564bc317e4d5517059c6aa3e69a48b88a90b68e210e671b12c40e7
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/source/lesson.json: f4d61ab69a3a1e99edd22b21802119d6dd80c058a63e38e6b1d13341abf9a2e3
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/source/lesson.md: dc00e3c8286042dfdab4d609abc5679ff631aa93296bd7a55e59fb23794696e4
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-text-author/current-freeze/source/exercises.json: 2d78a1231350a415897b67ced94a0abe3def178345e11ad6be9599cdabeacd5b
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-source-pixel-inventory.json: ba98dec1925e581b9b5d104f19028b5534d9424fcf0bd9660ff39fa63b06d502
- ssot-resources/soviet10year-textbooks/artifacts/7p/figures/tbl-p0241-01.png: e14a09002ecc89035ccce5528109cebff7007998ba552db4952e52706df81189
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n92-table-author/native-repair-1-1440-full.png: 9a98cb8d83eeb6dd72bf986a1c7b633c74aa9c0772b92920feeff1ae14e51924
- ssot-resources/soviet10year-textbooks/artifacts/7p/editions/modern-us-neutral/figures/tbl-p0241-01.spec.json: 157e3ae8bd8376869c0655fc0bfc28279d513035726040f07d39aac8c17fc36f
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-FIRST-TEXT/report.json: 982e224d2921fcb6149613cc169997cc147b78ab54ad50fc96cfc0df770d65e8
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-FIRST-TEXT/manifest.json: 62c188ff213aa76200058e6f96b1053b35602a00d1e0cd2945b803ac30c3bfde

The SOURCE report, solutions and sibling manifest are immutable 0444. No candidate edits, finalization or promotion.
