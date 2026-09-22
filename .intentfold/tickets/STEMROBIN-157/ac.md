# Acceptance Checks

## AC1 MathLive Exact Answers

Run the reusable answer-contract checker against the committed positive/negative example file. It must obtain values from a real MathLive element, accept all six required positive forms plus the existing expression/numeric controls, and reject every paired wrong input.

## AC2 Faithful Source And Bound Correction

Build a minimal scanned-page artifact in the ticket temporary directory, run page finalize, assemble, adapt-prepare, and adapt-finalize. The source page and raw lesson must retain the printed formula and structured concern; the modern lesson must contain only the registered correction.

## AC3 Mechanical Rejection

Using isolated copies of the same generated template, show that an unregistered formula edit, unchanged propagation of a registered error, wrong page, stale page hash, and original-expression mismatch each fail `adapt-finalize`. Show that a semantic section boundary resolves across a double-newline prose block and that incorrect adjacent content fails.

## AC4 Product And Repository

Run the required resource audits, application tests, and build. Start the app on port `52157`; use headed Chromium at `1440x960` and `390x844` to verify a real lesson/answer flow remains usable, with no answer key exposed in the client response or page payload.
