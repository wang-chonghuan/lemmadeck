# n94 FIRST ANSWER FINAL Semantic Review

## Verdict

Semantic **REVISE**, narrowly for R1: original question `4` is an explanatory
task in the bound SOURCE criteria, but its sole `auto/exact` input assesses only
the formula. Its display, formula and both expected alternatives are correct.
The issue is response coverage, not erroneous physics or a failed MathLive run.

All 8 displayed standards and all 53 frozen SOURCE facets pass. Task-level
semantic verdicts are 7 PASS, 1 REVISE. Of 77 detailed semantic facets, 75 PASS
and 2 REVISE; both REVISE facets describe the same R1 issue. All 4 parts'
mathematical expected values pass, including 2 exact alternatives and 3 numeric
expected strings. There are 3 requested final numeric quantities, not 4.

Four mechanical HOLDs remain separately recorded. This is not a completed
course, finalization, promotion, publication, or unrestricted ANSWER FINAL pass.

## Authorization And Bindings

Parent explicitly bound the prior SOURCE manifest before disclosing this FIRST
candidate. Bound SOURCE SHA-256:
`52fa7d0ac578fdf26bbdaad5cee677e7e0b29e79627b810b445f9bec9f3c7fd2`.
Its 75 entries are 13 content/contract inputs, 8 policy inputs, 6 outputs and
48 receipt/stdout/stderr entries. This review reuses that evidence rather than
re-solving SOURCE or opening any of its three images.

SOURCE solutions SHA-256:
`81ff1d75a40c94946169259ac06e12f4e4654fea9984833aafe1d16ca1a7a37f`.
Original fuel inventory SHA-256:
`d1c0f5b0482aeb169b2f7fa0f3505ec84bb2b9318736d88c4c2ad4d965331c63`.
Density inventory SHA-256:
`3af1362c0bbb42806857607a58b17e454ab78f484106afb418f3f59e7a2e6e0c`.

The only answer candidate read is
`tmp/resume-180-4/n94-answer-author/FIRST-candidate/answer-keys.json`,
SHA-256 `86f2c34120364ad76908c08eab9e84a247a7511912877de4aa478fc638804ece`,
mode 0444. It was not changed.

## Eight Standards

| Exercise | Display/Source | Grading/Coverage | Explanation |
| --- | --- | --- | --- |
| 1 | PASS | PASS | Fuel-specific heat released by complete combustion of 1 kg; honest ungraded definition. |
| 2 | PASS | PASS | J/kg, kcal/kg, cal/g all present; correct legacy-unit equivalence; honest ungraded listing. |
| 3 | PASS | PASS | 1 kg, complete combustion, both given rounded heat values preserved; no Q/q unit confusion. |
| 4 | PASS | REVISE | Correct Q=qm, symbol meanings and units in display; equation-only auto input misses required explanatory facets. |
| g2-1 | PASS | PASS | Petroleum 10500 is kcal/kg or cal/g; meanings for 1 kg/1 g and complete combustion both covered. |
| g2-2 | PASS | PASS | Equal masses and complete combustion explicit; near-Moscow brown coal restriction retained; Q=qm justifies comparison. |
| g2-3 | PASS | PASS | Two correctly ordered J-labelled numeric parts for charcoal and alcohol, with the 200 g conversion and complete combustion. |
| g2-4 | PASS | PASS | Concrete kerosene density source, volume-to-mass conversion and Q=q rho V; one J-labelled numeric heat part. |

The near-Moscow condition is a measured-fuel identity, not removable decorative
geography. The display does not universalize it or infer a result for unequal
masses. The SOURCE contextual equal-mass interpretation is preserved.

The density display uses 800 kg/m^3 = 0.80 kg/L; protected notes also preserve
the source's 0.80 g/cm^3. It is the already authorized series-table value, not
a universal kerosene constant and not a newly inserted n94 question datum.
Notes cite the original density PNG and spec paths with matching SOURCE hashes
and the known kerosene-material/kerosene-kg/kerosene-g objects.

Supplemental kcal statements are specifically calculations from the textbook's
separate calorie column, not exact reconversions of the rounded SI column.
They do not become extra parts or bare kcal numbers accepted under J labels.
This is candidate-statement verification against the retained inventory, not
new source derivation.

## Four Parts

| Part | Judge | Mathematical Expected | Unit/Label | Full Task Coverage |
| --- | --- | --- | --- | --- |
| 4 / 0 | exact | PASS: Q=qm, Q=mq | PASS: complete-combustion formula | REVISE: R1 |
| g2-3 / 0 | numeric | PASS: frozen charcoal heat in J | PASS: 15 kg charcoal, J | PASS |
| g2-3 / 1 | numeric | PASS: frozen alcohol heat in J | PASS: 200 g alcohol, J | PASS |
| g2-4 / 0 | numeric | PASS: frozen kerosene heat in J | PASS: 2 L kerosene, complete combustion, J | PASS |

Finite plain numeric strings are appropriate numeric standards, not proof that
the product parser accepted them. Both exact alternatives preserve the same
scalar multiplication/equality structure; neither is evidence that MathLive
edited and reserialized them correctly.

R1's narrow remedy is `grading=ungraded`, `parts=[]` for question `4`, retaining
the correct display. A formula-only response could instead require explicit
human approval of a narrower grading contract and affected review. This reviewer
neither changes the candidate nor silently overrides the frozen SOURCE criterion.

## Mechanical HOLDs

- M1: generated metadata/prompt/figureEvidence do not yet exist. Later actual
  identities, prompts, assets, hashes and any source-bound regional declaration
  need their own evidence. Do not invent or remove a source condition to pass
  a cultural metadata checker.
- M2: actual exact MathLive keyboard editing, shared normalization and finalize
  were not run. This HOLD is independent of R1; successful execution cannot
  make equation-only grading cover the original explanatory response.
- M3: actual product numeric acceptance/rejection and finalize were not run.
  Offline finite-number checks are not the product input chain.
- M4: affected TEXT/FIG layout adjudication remains pending. Parent states the
  TEXT tool gap is whitespace-only and isolated-clone repairs are ongoing;
  the old FIG 340px request was invalid. No scientific/table/answer change
  follows from either fact. This report does not perpetuate an invalid-width
  failure or claim the bounded measured-width check has already passed.

No publish, DB, app, environment, dependency, paid model, other chat, new SOURCE
solution, extra image, or canonical edit was performed.

## Semantic Projection Contract

`semantic-projection.json` is the protected projection of this exact FIRST
candidate. `facet-report.json` records both its semantic digest and file hash.
The digest domain is a versioned projection object, recursively key-sorted,
arrays preserved in order, then JSON-stringified without indentation or newline,
encoded UTF-8 and SHA-256 hashed. The pretty JSON artifact has its own different
file hash. There is no text/LaTeX/whitespace normalization in protected strings.

Protected root fields: schema, book, lesson, edition, answer order.
Protected per-answer fields: exercise, frozen-resolved groupId/sourceNumber,
grading, source, displayAnswer, notes, parts, bookRaw, historical_entities.
Protected per-part fields: label, judge, ordered expected strings, unit and
tolerance. Absent optional fields get explicit null defaults; absent
historical_entities gets an empty-array default. Adding empty declarations
cannot silently change meaning; a nonempty declaration changes the projection
and requires affected provenance review.

Only root status and per-answer prompt/figureEvidence are excluded from the
semantic digest as generated metadata. source_number/group_id may be added only
when equal to the frozen identity; the projection resolves them to that identity.
Unknown fields are rejected, not silently ignored. Nonempty historical
declarations, answer source, units, tolerance, notes, expected, grading and
parts are NOT a metadata-only loophole.

Later metadata-only binding requires all of: recognized field schema; unchanged
projection digest; actual prompt/identity association with the bound SOURCE
or separately parent-approved whitespace-only TEXT binding; actual figure
asset/spec/source hashes and allowed dependencies; then separate tooling gates.
Projection equality alone does not validate excluded metadata, clear R1, lift
the four HOLDs or constitute finalization. A wrong prompt can have the same
protected digest and must fail its separate prompt binding.

Changing question `4` to implement R1 changes grading/parts and therefore changes
the digest. It requires affected answer review, not metadata-only re-binding.
No future generated candidate or metadata is read or accepted in this review.

## Evidence And Freeze

Manual decisions are in `facet-decisions.json`; all 53 source facets, 8 grading
facets and 16 part facets are expanded in `facet-report.json`. Deterministic
checks verify frozen hashes, identity/order, all expected strings, facet counts,
projection invariance for metadata-shaped in-memory copies and sensitivity to
protected-field changes. These are not simulated production gate passes.

All commands use the mandated recorder and explicit active workdir with unique
`n94-af-` labels. Manual edits use apply_patch and touch only this report and
`n94-ANSWER-FINAL/`; existing edits and the SOURCE/candidate remain intact.
Report, projection, detailed facet report, scripts and manifest are frozen 0444.
Manifest/input-output receipt hashes bind actual inputs, outputs and prior
command receipts; closing seal/verify receipts avoid a circular self-hash.
Semantic result remains REVISE/R1; mechanical result remains HOLD.
Stop after this handoff, without a course-complete claim.
