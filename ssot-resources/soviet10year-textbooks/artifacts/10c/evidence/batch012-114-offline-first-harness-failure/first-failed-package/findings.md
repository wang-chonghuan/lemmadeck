# First Independent Offline Review: ana10-c8-s2-n114

Status: FAIL_OFFLINE_CHECK_EXECUTION. Browser acceptance: UNKNOWN. Visual acceptance: UNKNOWN.

The first and only browser/check command exited 1 before module evaluation:
`SyntaxError: Identifier 'require' has already been declared`, at browser-check.mjs:199.
This is a defect in the agent-authored check harness, not evidence of a lesson rendering defect.
No Chromium process or browser context launched, no file navigation occurred, no geometry
was collected, and no screenshot was captured or inspected. There was no open browser to close.
The failed script is preserved unchanged. No repair, second run, or same-purpose PASS was attempted.

## Frozen Inputs

The freeze command ran once, exited 0, and verified all six original exact byte lengths
and SHA256 values supplied in the delegated request. It saved byte-identical snapshots before
any parsing or browser consumption. Original scratch files were not edited.

Full original/snapshot receipts, guidance hashes, program hashes, Node/Chromium executable hashes,
and loaded Playwright runtime file hashes: input-freeze.json.
Freeze result SHA256: c4a3105e5d9b26e1d2969aacf8a70373e6148b85e1afd3f4571690859ea9e8d4.

## Actual Execution

The actual child executable/argv/cwd/timestamps/exit/signal/spawn-error and immutable
RAW stdout/stderr paths, lengths, and hashes are in commands/freeze.receipt.json and
commands/browser-check.receipt.json. The raw stderr preserves the complete real error stack.
The command lines were recorded by spawnSync's caller, not reconstructed after failure.

Freeze: 2026-11-17T07:59:51.908Z through 2026-11-17T07:59:52.200Z; exit 0.
Browser/check: 2026-11-17T07:59:52.202Z through 2026-11-17T07:59:52.276Z; exit 1.
Actual cwd for both: /Users/yong/.codex/worktrees/a07e/lemmadeck/app.
RAW check stderr: commands/browser-check.stderr.raw, 1009 bytes,
SHA256 3061def4951c71e290266b34f98f3a7202a52d0d7b98e6a7cb6bb090e192bd01.
RAW check stdout: commands/browser-check.stdout.raw, 0 bytes,
SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.
Executed check script: 14853 bytes,
SHA256 2c951446f6d639106f7c6cadad4dc5d5778803e516144d61edcdc5b346230d38.

## Coverage And Judgments

- Desktop text, 1440x960: NOT OBSERVED. Document height unknown; actual y coverage empty.
- Desktop exercises, 1440x960: NOT OBSERVED. Document height unknown; actual y coverage empty.
- Mobile text, 390x844: NOT OBSERVED. Document height unknown; actual y coverage empty.
- Mobile exercises, 390x844: NOT OBSERVED. Document height unknown; actual y coverage empty.

Independent visible judgments for readability, nonblank rendering, layout, formula clipping,
overlaps, fonts, punctuation, order, both concept-boundary separator lines, empty exercise surface,
and absence of invented questions/inputs/choices/figures are all UNKNOWN_NOT_OBSERVED.
No DOM, hash, or numerical pixel result is being substituted for visual inspection.
The screenshot count is zero; model image loads are exactly 0/8 for this batch and 0/24 lifetime.
No originals, sources, author screenshots, image crops, or reopens were loaded.

The pre-load plan was three nonoverlapping native text clips per viewport, derived from actual
document height, plus one exercise image per viewport. Full-page text captures were to remain
unopened. Native clip height was capped at 4096 and width at 1440, with no resize; insufficient
coverage would have produced UNKNOWN instead of exceeding eight images. The plan never executed.
See image-ledger.json for each planned slot and actual zero-load accounting.

## Preserved Boundaries

The supplied prior PASS for 28 prose paragraphs, exact anchors, and independently justified erratum
is inherited context only and was not rerun or independently re-reviewed here. The proseFlow
assertion-input derivation did not execute because parsing failed. Requested zero exercise entries
and zero figures were not browser-verified here. No historical UNKNOWN is promoted to PASS.
The supplied distinction remains unchanged: faithful source/114 has exp_a with BOTH subscripts,
whereas the modern layer uses its registered exp correction. No mathematical proof or source review
was performed or claimed.

All writes are inside this new review directory. No canonical or other-agent files, answer files,
Git, backend, refresh/setup, app/server, DB, dependency, schema, Charter, publisher, p2c,
prose_flow CLI, layout/count/tests, author review, or full-book acceptance operations occurred.
Evidence sealing inventories retained files only and does not rerun any acceptance check.
The parent must retain this failure evidence; it does not authorize promotion.
