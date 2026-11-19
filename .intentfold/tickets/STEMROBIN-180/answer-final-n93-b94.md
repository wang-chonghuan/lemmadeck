# n93 FIRST ANSWER FINAL C / b94

Semantic status: PASS. Operational readiness: HOLD for the two required mechanical gates below. No content REVISE findings.

Author candidate SHA-256: 918101baed731e14ff9f0c69f6868dc4d8faa18881a1f5dd6fec365f0114a80c
Previously frozen independent solutions SHA-256: e3da2d7313fecaa9137b142440bca3906fd53692d727948b4b79d62a5e09a93e

Coverage: 8/8 answers; 37 source facets PASS; 4 graded parts; all 5 expected entries checked (2 exact, 3 numeric). Proposed auto 2 / ungraded 6.
The parent actually bound the prior three frozen stages before disclosure; those stages and the two images were reused without reruns.

## Per-Task Comparison
### 1: PASS
- specific-heat: PASS. The display explicitly requires material-specific c.
- mass: PASS. The display explicitly requires mass m.
- temperature-data: PASS. Initial t1 and final t2, or their positive rise, are both stated.
- units: PASS. The answer explicitly supplies kg, degree Celsius, J/(kg degree Celsius) and resulting J.
- physical-domain: PASS. No phase change and effectively constant c are stated; actual object heat is distinguished from total heater energy.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### 2: PASS
- own-example: PASS. The author supplies a genuinely constructed 2 kg water example; ungraded with no expected values does not restrict the learner to the book example.
- givens: PASS. Water c=4200, 2 kg and temperatures 20/30 are all specified; the newly chosen example temperatures are permitted by this open task.
- heating-direction: PASS. Heating uses final minus initial, with the positive absorbed heat correctly calculated.
- cooling-direction: PASS. Cooling uses initial minus final for positive release and separately describes negative signed heat into water.
- calculation-and-units: PASS. 4200 times 2 times 10 equals 84000 J, exactly 84 kJ. The reverse cooling process has the same magnitude.
- or-not-and: PASS. Displaying both alternatives is pedagogically complete; no grading rule forces the learner to submit both or match the displayed example.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### 3: PASS
- symbol-definitions: PASS. The display defines c, m, t1 initial and t2 final.
- heating-formula: PASS. Both exact candidates represent the source heating formula; swapping c and m is a valid commutative product.
- cooling-and-sign: PASS. The display correctly distinguishes positive release cm(t1-t2) from negative signed heat cm(t2-t1).
- dimensional-check: PASS. Compatible SI units and no-phase-change/constant-c conditions are supplied. Q is an energy quantity, and its J unit follows from the stated product.
- Display/provenance/grading semantics: PASS. The author explicitly scopes the one graded part to the heating formula, while the display explains cooling and signed heat. Exact is an allowed judge and both candidate forms are mathematically sound. The independent ungraded preference was not a requirement to reject a correctly scoped formula-only part. Actual exact edit/normalization validation remains HOLD.

### 4: PASS
- transfer-direction: PASS. Hot water transfers energy to cold water, with the corresponding internal-energy changes stated.
- ideal-balance: PASS. Both source substitutions yield 50400 J; isolated two-water-portion equality is explicitly conditional.
- internal-energy: PASS. The answer describes hot-water internal-energy loss and cold-water gain, and requires all participating bodies in the complete balance.
- real-apparatus: PASS. Container/air exchanges and smaller-loss closer agreement are retained; the answer does not claim disappearing energy.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### g2-1: PASS
- unit-mass: PASS. The source definition is stated for 1 kg, explicitly distinguished from 1 g.
- unit-change: PASS. A change of 1 degree Celsius is stated, not a final temperature or required zero-degree starting point.
- heat-and-internal-energy: PASS. Absorption on warming and equal-magnitude release on cooling are described; this adequately gives the physical meaning of c.
- dual-source-units: PASS. 920 J and approximately 0.22 kcal are kept at source precision, with a warning against an infinitely precise equality.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### g2-2: PASS
- actual-liquid-set: PASS. The actual four liquids are identified; ice and wood are excluded.
- equal-mass: PASS. Equal masses are explicit, and the display warns that differing masses invalidate comparison by c alone.
- equal-net-input: PASS. Equal net absorbed heat over equal time/effective heating power is explicit, with no phase change and effectively constant c.
- source-minimum: PASS. Vegetable oil is selected from the correct source minimum: 2000 J/(kg degree Celsius), 0.48 in the printed kcal column.
- formula-reason: PASS. Q/(cm) and the correct rate order are stated, with a warning about different mass/heating conditions. No claim about unequal-initial-temperature final ordering is added.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### g2-3: PASS
- source-comparison: PASS. Water c=4200 is correctly identified as the largest among the source table liquids; no external material table is used.
- heat-capacity: PASS. For fixed mass and allowed rise, more heat can be absorbed.
- temperature-buffering: PASS. For fixed mass and absorbed heat, the temperature rise is smaller.
- scope-and-state: PASS. The cooling-agent argument is limited to the source specific-heat/no-phase-change comparison, not universal coolant optimality.
- Display/provenance/grading semantics: PASS. Open explanations and the learner-chosen example remain ungraded with a standard display and no fabricated expected array.

### g2-4: PASS
- part-1-material-and-rise: PASS. The display uses Cast iron 540 with 1.5 kg and a stated rise of 200; it does not confuse this with a final temperature.
- part-2-mass-and-difference: PASS. 50 g converts to 0.050 kg and 90-20 gives 70; source Aluminum 920 produces the correct heat.
- part-3-mass-and-difference: PASS. 2 tonnes converts to 2000 kg, 60-10 gives 50, and Brick 750 is used rather than Laboratory glass 840.
- energy-unit-and-precision: PASS. All three J results and kJ equivalents agree with the independent source solution. Alternate rounded kcal-column products are explicitly not exact SI conversions.
- model-and-grading: PASS. The model, positive absorbed direction and three ordered fixed-J numeric parts are sound; no unconverted kcal numbers are included in J expected arrays.
- Display/provenance/grading semantics: PASS. Three finite numeric results in fixed-J input parts are suitable for prospective auto grading; real pipeline/runtime validation is not claimed.

## Every Graded Expected
- 3, part 0, exact, formula: PASS.
- Expected 0: Q=cm\left(t_2-t_1\right); PASS. Q equals c times m times final-minus-initial, exactly the source heating formula.
- Expected 1: Q=mc\left(t_2-t_1\right); PASS. Q equals m times c times the same difference; commutative multiplication preserves the mathematical expression.
- g2-4, part 0, numeric, J: PASS.
- Expected 0: 162000; PASS. Exact equality with the independently frozen source-derived J result. Expected contains a finite numeric string only, with a fixed J label outside the input.
- g2-4, part 1, numeric, J: PASS.
- Expected 0: 3220; PASS. Exact equality with the independently frozen source-derived J result. Expected contains a finite numeric string only, with a fixed J label outside the input.
- g2-4, part 2, numeric, J: PASS.
- Expected 0: 75000000; PASS. Exact equality with the independently frozen source-derived J result. Expected contains a finite numeric string only, with a fixed J label outside the input.

## Required HOLDs
- exact-mathlive-edit-and-judging: HOLD. The author explicitly states the exact entries are draft and have not undergone real MathLive keyboard editing, reserialization and shared normalization/judging. This semantic review is forbidden to prepare/finalize or run a browser; neither candidate self-comparison nor manual simplification supplies that missing evidence. Parent-authorized native exact editor/normalization gate for both expected entries; no content revision is presently required.
- final-identity-prompt-and-figureEvidence-binding: HOLD. This candidate predates prepare. The parent will mechanically merge identity/prompt/figureEvidence from the final same-edition text and externally owned n92 table with separately passed n93 context. Same semantic projection after generated metadata is merged, plus exact current identity/prompt/figure hashes from the authorized preparation/finalization pipeline.

## Metadata-Only Binding
Projection file SHA-256: 945b6240634f4a726c57a838300850fc44c659f55651d1795e294a4a7acb6021
Compact canonical semantic content SHA-256: 0272bac2ef2218d5527073e937ff59d92c3ed9a57991e7e6e8f9e7e4f630c876
Top fields: schema, book, lesson, edition, answers.
Answer fields: exercise, grading, source, bookRaw, displayAnswer, parts, historical_entities, notes.
Part fields: label, unit, judge, expected, tolerance.
- Array order and exact answer strings are retained. Object keys are recursively sorted; pretty JSON plus one newline defines the projection file hash.
- Generated status, identity/group metadata, prompt/source hashes, figureEvidence and audit bindings are excluded. Semantic source/bookRaw, display, judgment, unit, expected, notes and historical declarations remain bound.
- The parent must reproduce the projection hash after adding only generated metadata. Any semantic mismatch requires affected review; this review does not approve a later changed answer.
- The table remains externally owned by n92, with separately passed n93 context; no figure approval/promotion is performed here.

## Exact Inputs
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-answer-author/FIRST-candidate.json: 918101baed731e14ff9f0c69f6868dc4d8faa18881a1f5dd6fec365f0114a80c
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-ANSWER-SOURCE/solutions.json: e3da2d7313fecaa9137b142440bca3906fd53692d727948b4b79d62a5e09a93e
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-ANSWER-SOURCE/report.json: 1b66cca8daff56391ec4fe81da5fd6ed87bd569ef87c5af7b61eb038b0fc7ce8
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-FIRST-TEXT/manifest.json: 62c188ff213aa76200058e6f96b1053b35602a00d1e0cd2945b803ac30c3bfde
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-ANSWER-SOURCE/manifest.json: 2fab397889c6f84e0e2d779b76fe33bc8407b5cc31c0cc0b875416a685794d84
- .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-shared-FIG-context-review/manifest.json: 84054b6ac4315885df989ce0911edd9159662c57e170d669c714964d39e78569

Report, semantic projection, manifest and this note are frozen 0444. Candidate unchanged. No prepare/finalize; no extra images. wholeLessonComplete=false.
