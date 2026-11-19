# STEMROBIN-180 n94-b94 Answer Author

Fresh answer author only; offline; C; finish=review; 2026-11-19.
State: FIRST-candidate authored, not approved or finalized.
Lesson `phy7-c1-s1-n94`, book `7p`, edition `modern-us-neutral`.
No source/task/science/data change; caller's pure-layout TEXT finalization remains pending.

## Scope And Counts

Read all 14 lesson prose objects and all 8 complete task texts:
`1`, `2`, `3`, `4`, `g2-1`, `g2-2`, `g2-3`, `g2-4`.
All answers are independently `derived`; no previous/book answers,
choice outputs, reviewer outputs, other chats or history were read.
Three candidate auto answers (`4`, `g2-3`, `g2-4`), five ungraded reasoning
answers; four total graded parts (one exact formula, three numeric heat parts).

Image loads: original fuel table 1, modern fuel native 1, density source 1;
total 3, fig-226 0, crops/reopens 0. No app or browser operation.
Original fuel inventory and eight-task solutions were frozen read-only before
modern comparison; density was independently sourced in a separate supplement
also frozen before the modern comparison.

## Durable Answer Snapshot

| Task | Candidate standard answer and derivation | Grading |
| --- | --- | --- |
| 1 | 燃烧值是 1 kg 某种燃料完全燃烧释放的热量，用 q 表示。 | ungraded |
| 2 | J/kg、kcal/kg 或 cal/g；kcal/kg 与 cal/g 数值相同。 | ungraded |
| 3 | 1 kg 该燃料完全燃烧，按教材数据释放 $1.4\times10^7$ J 或 3400 kcal。保留两列各自取整的教材数据。 | ungraded |
| 4 | 完全燃烧时 $Q=qm$；Q 为热量，q 为燃烧值，m 为质量，单位一致。候选 exact 输入 `Q=qm`、`Q=mq`。 | auto candidate |
| g2-1 | 石油的 10500 单位是 kcal/kg 或 cal/g，表示 1 kg 完全燃烧释放 10500 kcal，或 1 g 释放 10500 cal；不是 10500 J/kg。 | ungraded |
| g2-2 | 质量相等、都完全燃烧时，莫斯科附近出产的褐煤比干木柴放热多：$1.3\times10^7$ vs $1.0\times10^7$ J/kg，或 3000 vs 2500 kcal/kg；根据 $Q=qm$。不推广到所有褐煤，不省略等质量前提。 | ungraded |
| g2-3 | 木炭：$3.4\times10^7\times15=5.1\times10^8$ J，或 $8000\times15=120000$ kcal。酒精：200 g = 0.200 kg，$2.7\times10^7\times0.200=5.4\times10^6$ J，或 $6500\times0.200=1300$ kcal。两问独立 J-labelled numeric 键 `510000000`、`5400000`。 | auto candidate |
| g2-4 | 显式采用同系列教材煤油密度 800 kg/m^3 = 0.80 kg/L；2 L = 0.002 m^3，$m=\rho V=1.6$ kg。$Q=q\rho V=4.6\times10^7\times1.6=7.36\times10^7$ J，或 $11000\times1.6=17600$ kcal。一个 J-labelled numeric 键 `73600000`。 | auto candidate |

The density premise is the retained textbook's convention, not a universal
material constant, temperature guess or silent addition to the n94 task.
No numerical key mixes bare kcal values with a J-labelled input.

## Evidence Bindings

Caller text-manifest SHA256:
`1d82a274062474be35ef650aaf660b22519980ad7bfe224e9d618e223f2b155a`
(caller-supplied; no manifest file provided for recomputation).
Caller later mentioned modern author manifest prefix `4dc674cf`, 233 items;
no such author manifest was read and no full hash is inferred. The four
authorized modern files are bound directly by their full hashes below.

Original fuel table:
`.tmp/ld-s10y-lesson/resume-180-4-n94-cohort/artifacts/7p/figures/tbl-p0247-01.png`
SHA256 `072e3c3eece1c65b3d11d8b264527f41d9164ab8f13a1d0cf57b7924b7298e98`.
Independent pixel inventory: 12 data rows, 3 columns plus header. Row sequence:
dry firewood, peat, brown coal (Moscow region), coal, alcohol, anthracite,
charcoal, natural gas, petroleum, gasoline, kerosene, hydrogen.
Coal ranges stay $2.7\times10^7$ to $3.0\times10^7$ J/kg and 6500 to
7500 kcal/kg; hydrogen keeps printed $12\times10^7$ J/kg.

Density source:
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/tbl-p0071-01.png`
SHA256 `294725f87486c227a15914bc551ab3c8f4d7bacf2bf110ff7b4cfd36af74ccd4`.
Observed seventh row 煤油: 800 kg/m^3, 0.80 g/cm^3.
Approved reference spec:
`ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/tbl-p0071-01.spec.json`
SHA256 `07d65b2f330914ee71ca2fad3ef7fa35ec9883588cefb6e7827b2e3e8df788ac`.
Its source inventory maps to Kerosene/800/0.80 with the correct units.
Existing reference review SHA256
`59f49d04bb32aff2b6a8935094fc605ec55a6c4c6af9283fd138489d93db10ff`;
only status and source/spec bindings read, inherited status `pass`.

Modern fuel base:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-figure-author/tbl-p0247-01/candidate-01/`
Spec SHA256 `902b46e23af864db424dd0be66defc4e632f4137eb1450441f2b287a3d210532`.
Render SHA256 `138bbacff2ac90374ef3ad90c53695c02731cd235dd87684c7da12dad3d375ba`.
SVG SHA256 `539a9c2c708fc126edeadf3221e1036c1097488491d5f5ef578ded74f3b7bbae`.
Native SHA256 `b5f3f48d47b2ef245d939ad4343bf9f9dbcedfdfaf56d869f0d06795cd52d831`.
All 12 rows, 3 columns, unit headers, range endpoints, precision and
Moscow-region condition were compared to the prior independent inventory.
All eight complete task texts in the modern spec match the frozen task texts.
No answer-affecting discrepancy observed; this is not FIG approval.

## Outputs And Pending Gates

Owned working base:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-answer-author/`

- `stage1/independent-source.md` and `stage1/manifest.json`: frozen before modern access.
- `stage1/density-supplement.md`: sourced completion of g2-4, frozen before modern access.
- `evidence/modern-fuel-comparison.md`: independent table/task comparison.
- `FIRST-candidate/answer-keys.json` and `FIRST-candidate/manifest.json`: 0444 author candidate freeze.

The candidate manifest binds current input/output hashes and counts; it is
not an approval. Deterministic structural/arithmetic checks do not replace
gate-2 or genuine MathLive exact editing.
No prepare/finalize, canonical content write, DB/env/dependency/app access,
publication, commit, ticket backend operation or self-review PASS.
Next stages require parent TEXT/FIG approval and independent answer review;
real exact-input checks and any prepare/finalize remain expressly unexecuted.
