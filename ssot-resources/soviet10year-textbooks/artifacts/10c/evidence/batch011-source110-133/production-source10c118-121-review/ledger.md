# STEMROBIN-184 - SOURCE-FIRST Image and Action Ledger

Status: COMPLETE StageA; frozen, WAIT for sole authorized StageB exact author-byte input. Scope: book10c physical 118-121 ONLY.
Date: 2026-11-17.

## Permanent Budget

- Maximum images for this invocation/batch: 8.
- Maximum images in current context: 24; no reset or purported image-history clearing.
- Authorized original opens: 4, each individual, once, detail=original.
- Reserved image slots: 4 for new essential native crops only.
- Parent context is reported at 24/24 and must receive text/paths/hashes ONLY, never these images.
- This independent context began with no image-bearing source history.

## Pre-Open Checks

Before I01, `sips -g pixelWidth -g pixelHeight` checked all four originals: each 1695 x 2580.
Before I01, `shasum -a 256` checked all four originals:

| Physical | Source SHA-256 |
| --- | --- |
| 118 | 53689746241f8962f56486fcad4c1ce011feb6d0ba9e6c89816371a06c93ec8e |
| 119 | 56f4329ee03192c18f8c4c18261564ceb9cf45d37f80257c66fcaae82e17b49d |
| 120 | d92b39cdc629a4309891985d57372b4311bb53faf675a2c486704c90a73ca3a7 |
| 121 | 82505d0db4d3bb0d2609d69938d3957b2e49563e19fd4810a240a69e49782496 |

## Image Events

| Event | Kind | Exact Source Path Relative to Workspace | Detail | Invocation Images After Event | Finding |
| --- | --- | --- | --- | --- | --- |
| I01 | Original, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0118/page.png | original | 1/8; current context 1/24 | Printed 112; formula tail, two complete solved examples, notation and geometric-meaning prose; no diagram/table/unsolved task. |
| I02 | Original, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0119/page.png | original | 2/8; current context 2/24 | Printed 113; figures 54 and 55; example-2 area interpretation, open solved example 3. Evaluation-bar lower limit requires direct glyph confirmation. |
| I03 | New essential native crop, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/0119-native-formula.png | original | 3/8; current context 3/24 | Confirms printed evaluation-bar lower limit -1 while the integral lower limit is -2. Preserved, not algebraically corrected. |
| I04 | Original, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0120/page.png | original | 4/8; current context 4/24 | Printed 114; example 3 closes, eligible unsolved 425-439, unit 102 begins, variable-name justification opens at final colon. |
| I05 | Original, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0121/page.png | original | 5/8; current context 5/24 | Printed115; completes variable-name justification, contains whole derivative claim/proof, zero/value-q antiderivative statements. Unit102 global closure unknown. |
| I06 | New essential native crop, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/0121-native-variable-proof.png | original | 6/8; current context 6/24 | Confirms actual minus in F(b)-F(a), no algebraic insertion. |
| I07 | New essential native crop, first and only open | .intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/0121-native-derivative-proof.png | original | 7/8; current context 7/24 | Confirms actual minus in [F(x)-F(a)]' and subsequent derivative difference, not a dot. |

Original opens used: 4/4. Crop opens used: 3/4. Total: 7/8. Original opens remaining: 0. Essential native-crop reserve remaining: 1 (unused). No reopens, resets, or image-history-clearing claims.

## Native Crop Provenance

- I03 source: hash-checked physical 119 original above.
- Source-coordinate rectangle [280,1835,1100,410], created with `sips --cropToHeightWidth 410 1100 --cropOffset 1835 280 ... --out ...`.
- No resizing, annotation, filtering, or adjacent-page pixels.
- Dimensions checked before crop open: 1100 x 410.
- SHA-256 checked before crop open: ab189990deecc6d0891ba45c016c2bdb1141a61839bc76614c7a864a4a375a79.
- Crop reason: distinguish the printed lower evaluation bound without deriving it from the algebra.

| Crop Event | Physical Source | Original-coordinate Rectangle | Checked Crop Dimensions | SHA-256 Checked Before Open |
| --- | --- | --- | --- | --- |
| I06 | 121 original, hash above | [210,345,1080,150] | 1080 x 150 | 643b1ad842e3a1f90e84fa9e7cc7c930a548803919d5e4cd7aff4baf6adeddb8 |
| I07 | 121 original, hash above | [250,1355,1240,150] | 1240 x 150 | 996c6b3e267505fe7b3ead05b3d016e632cc04acee782e27d6f08238387357f6 |

- I06 created with `sips --cropToHeightWidth 150 1080 --cropOffset 345 210 ... --out ...`.
- I07 created with `sips --cropToHeightWidth 150 1240 --cropOffset 1355 250 ... --out ...`.
- Each crop was unscaled, unfiltered, and unannotated; dimensions and hash checked before its individual detail=original open.
- I06 reason: direct observation of the operator between F(b) and F(a).
- I07 reason: distinguish the operator in the derivative proof from a dot without using algebra as an OCR repair.

## Read / Write Scope

- Read instructions only: user-supplied AGENTS instructions, `.intentfold/readme.md`, `.intentfold/charter/engineering.md`, `.intentfold/charter/product.md`, `.claude/skills/ld-s10y-lesson/SKILL.md` including cap1, `.agents/skills/ld-s10y-image/SKILL.md` including Image batches, and the general `intentfold/SKILL.md` router.
- No IntentFold capability or SkillHost update was invoked; the user authorized this bounded source-review stage only.
- Checked exact own output paths for existence; neither existed before creation.
- Manual scratch writes through `apply_patch` only: this ledger and sibling `source-first.md`.
- Three essential native image crops were generated with `sips` in this same owned review directory; source images were not modified.
- No author Markdown, grid, template body, old review, answer, choice, TOC, or adjacent source pixels read.
- No source edits, prepare/finalize/assemble/vectorize/counter/adapt, answer/choice work, tests, Git, DB, publication, app, dependencies, schemas, Charter edits, skill edits, workflow changes, or other-chat tools.
- Physical 117 predecessor owner and closure remain explicitly UNKNOWN.

## Freeze

- StageA is complete. The source-first record covers physical118-121 / printed112-115 only.
- Full task inventory: 425-439, 15 source-complete eligible unsolved tasks; exact global pre102 unit owner UNKNOWN.
- Whole worked examples1-3 are supplied in the range; none promoted into tasks.
- Complete unit102 variable-name justification and derivative claim/proof are recorded. Unit102 right/global closure remains UNKNOWN.
- Predecessor117 owner and closure remain UNKNOWN; no parent predecessor text has been supplied.
- Seven images consumed permanently; one essential crop slot unused. No further original open is permitted.
- No StageB exact author bytes read or discovered.
- Final file SHA-256 values are returned externally after the last `apply_patch`; no self-referential hash is embedded.
- WAIT after parent consumes this StageA: accept only the sole exact author-byte input explicitly supplied for StageB. Do not search or message another chat for it.
