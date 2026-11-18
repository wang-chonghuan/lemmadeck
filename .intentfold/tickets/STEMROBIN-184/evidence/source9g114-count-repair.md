# Source 114 Counting Repair

Checkout: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Checkpoint: 2026-11-18 16:40:53 UTC. Original failure remains in the retained
author rollout; this document does not fabricate its deleted native receipt.

The historical finalizer detected 17 rows against 18 authored rows, including
the folio. Its reported figures were123 `[244,516,411,425]` and124
`[810,513,399,413]`, with no normalization, unknown characters or exclusions.
Independent review `source9g112115-independent-review.md` separately confirms
18 actual text rows including the folio and two distinct top baselines.

Read-only diagnostic on the retained source PNG reproduced17 bands. Body
scale41 and glyph scale39; initial rows183-221,245-250,258-300. The shaft
joined its proper lower body, then `detached_fraction=True` joined the short
previous row as well. The classifier admitted the opened shaft1127-1192 as
a fraction rule, despite no numerator in those columns; opening left thin
shaft residues above/below its candidate extent.

The classifier now requires local ink on both sides of the candidate rule,
each with vertical extent at least0.2 body height within0.75 body height.
This rejects shaft remnants while retaining a single-glyph fraction.
Actual diagnostic becomes18 bands, top183-221 and245-300. No source image,
line text, figure box, count exclusion or expected-count override was changed.

Focused verification:13 layout tests,2 normalization tests and1 explicit
stream assembly test PASS. The76 tool-layout tests have75PASS/1FAIL:
`test_independent_text_below_valid_limits_is_not_owned`. Direct execution
against the `HEAD` source and working source both returnsTrue for that exact
fixture, so this is a pre-existing failure, not a newly passing check.

Real recovery finalize114 exit0,18/18. Receipt:
`.intentfold/tickets/STEMROBIN-184/tmp/recovery-finalize-109-115/result.json`.
Nonfigure source body unchanged, page SHA-256:
`3043554bcfb687c4271493b06ab12f76faebd1c08eb0885079cbbac80ed3b3cb`.
115's recovered finalizer produces the original author's successful final
page hash `828a6fb5b0e12ff9c7b7e12ed440a0ac2b7da76953ead217d1b10a15d34e8df9`.
No author/review replay or paid image generation was used for recovery.
