# Final Recovery Addendum

Read with `report.md` and the unchanged `source-first-solutions.md`.
The initial `verify-and-seal.mjs` command exited 1: 479/480 checks passed.
Its one failing check was 374 at x=2.36, where the double-precision
left/right results were 262.7756130553423 and 262.7756130550975,
an absolute difference of 2.448246050335001e-10 against a fixed 1e-10
threshold. This sample is near the excluded pole at 3pi/4, so cancellation
in the small left denominator amplifies floating-point error.

The first failure, original ledger, and original seal are preserved unchanged.
Only that failing sample was rerun, using the standard-library Decimal
implementation in `recovery-374.py`, with 100 decimal digits and direct
independent Taylor evaluations for sin(alpha), cos(alpha), sin(2alpha)
and cos(2alpha). Its actual result and exit status are in
`recovery-374-result.json` and `recovery-ledger.json`.
No original threshold was weakened, no sample was removed, and the written
identity/domain proof did not change. `final-seal.json` is the final intake
seal; `seal.json` remains the initial failed-check snapshot.

Final bounded outcome: source-first mathematical freeze complete for all 56
readable exercises out of the 57 scoped 335-391. 338 remains HOLD/noanswer;
371-373 retain qualified inherited command ownership. There is one recorded
local numerical check failure, resolved by the affected-only high-precision
check, not a mathematical source correction or new source approval.

Images 0; paid/model/external-service calls 0. Parent permanent image budget
remains inherited 24/24 exhausted. All authored keys, author manifests/reports,
prior solution packages, expected grading keys, choices, and prior reviews
remain unseen. Phase B is not authorized or performed. Stop for intake and
an explicit new release; no whole-lesson/course PASS.
