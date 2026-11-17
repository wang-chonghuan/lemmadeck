# n16 Independent Provenance-Only Addition

Date: 2026-11-16. Mechanical verification UTC: `2026-11-16T16:35:00.892Z`.
This addition preserves the already frozen source-first and view-only proofs.
Neither source solve nor view solve was repeated. No Stage3 authorization exists.

## Preserved Freezes

Source-first:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-independent-source-first.md`

SHA-256:
`d766f85daa6aaba6cafd50afba6b2dbcbe8f79ded32f57a35949a634c2f8e0ca`

View-only:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-independent-view-only.md`

SHA-256:
`ef5d6c3f9504ca1771c0bbc56e8084e0177c002c1414be7eef642058786478ac`

Both bytes remain unchanged. Their original snapshot identifiers are retained,
not edited to pretend they were reviewed against the later provenance snapshot.
The independent truths, full sets, coverage assessment and Stage2 leakage
finding are not superseded by a trace-only rebinding.

## Independent Seed Comparison

Archived prior seed:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-book-trace-before/geo910-n16-choice-seed.json`

Prior seed byte SHA-256:
`39bbb19a6abf4f2615465b89d534e822e930e7cb9892eeb3367e478ecfcaca13`

Prior seed canonical SHA-256:
`59d912e291e3e89f3d965d408a680d9dbb0627c6f34575c070e4ed2f05f7b43d`

Current seed:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-seed.json`

Current seed byte SHA-256:
`00fb390e60049027b6da804b068d8ba7827acf27ca7a4461b90c68ea92ae3188`

Current seed canonical SHA-256:
`56ffbd384814e6b69e01c393d9a7dbe974885be694edc04f5d9c1a3856a44916`

A recursive structured comparison of the two allowed seed objects found exactly
one changed path: `/trace/0/sha256`.

Prior book trace hash:
`34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7`

Current book trace hash:
`d58eaec04808ebca8fe6ae4db279751432ccbd7629aaaca51caca93fe847b155`

Every other field is equal, including written exercises, selected definitions,
source selectors, figure IDs, asset paths/hashes and the other three trace
entries. Actual selected fig-62/63 SVG bytes were rehashed and still match both
seeds. This was byte hashing only, not new rasterization or image opening.
No book.json or other trace-target source file was read.

Learner views remain byte-identical to the Stage2 input:
`70ccae34f17fab314c138454eab0329c91411777d66771c6f3880c025f733829`.
The image ledger remains unchanged: 2 successful model image opens, 0 failed;
2 successful headless raster loads, 0 failed; combined conservative count 4.

## Parent Report And Scope

The user explicitly supplied the provenance report:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-book-trace-rebinding.json`

Report byte SHA-256:
`4572cb4a3d9ad5d589e5ca4d31345fcd0763297a3c809d76ddaf8f7c6d22c1f1`

Its prior/current seed digests agree with the independent seed comparison.
The report states that only the dependent draft `/seed_sha256` changed, with
all semantic fields and asset hashes equal and no semantic review or validator
run. That draft statement is parent-reported provenance, not independently
verified author reasoning or key agreement: no current or archived draft was
opened. The report contains digest metadata, not an internal answer key.

The source-first proof remains bound to its byte-preserved prior seed, and this
addition establishes a provenance-only bridge to the current seed. The view-only
freeze still binds the identical learner payload.

Stage3 remains waiting for parent authorization. No review JSON or validator
was produced/run. No database, environment, app, dependency change, model
service, Git, publication or modification of another worker's file occurred.
