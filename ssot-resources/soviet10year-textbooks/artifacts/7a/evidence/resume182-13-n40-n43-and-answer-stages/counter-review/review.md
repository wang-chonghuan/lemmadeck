# Independent Affected-Only Counter Review

Verdict: **PASS** for the bound parent-owned delta and the two affected source-page reconciliations. No actionable defect attributable to this delta was found. This is not whole-source, lesson, assembly, modern-edition, publication, or production approval.

## Scope And Method

- Date: 2026-11-19. Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch `codex/STEMROBIN-182-textbooks`, HEAD `e16207d939526da0ebb2cfc528f084f0c3791afb`.
- Only `counter-review/` was written. Existing work, source artifacts, code, tests, receipts, and other reviewers' directories were not edited or reverted.
- Read the project entry/routing, engineering/operations norms, and `.claude/skills/ld-s10y-lesson/references/production-resume.md`. The direct offline authorization governs; no backend, network, DB, app, model, browser, finalization, commit, or worker action was taken.
- Images opened/decoded/displayed: **0**. Source PNG/grid bytes were hashed only. Reused the existing FIRST source review's pixel observations; no new visual verdict is invented.
- Review activity was code inspection and read-only Git/filesystem/hash/JSON comparisons. No behavioral test or suite was run.
- `binding.json` records exact inputs, independently checked ownership, receipt integrity, and preservation results. Its relative paths resolve against the explicitly recorded checkout/evidence roots.

## Ownership

The reviewed implementation is `counter-owned/layout.py`, compared with the actual `HEAD` blob for `.claude/skills/ld-s10y-lesson/tools/layout.py`, not the entire dirty working-file diff.

The existing `counter-owned/binding.json` matches current HEAD, candidate, working-file, and patch hashes. Regenerating the no-index HEAD-to-candidate diff in memory with the recorded path headers reproduces `counter-owned/own.patch` byte for byte. Thus this patch is exactly the parent-owned delta against HEAD.

The candidate equals the working file after removing only the excluded `_fraction_baselines` helper and its existing guard. The helper bytes equal the saved pre-parent snapshot and its recorded SHA-256; the guard is present exactly once and unchanged in both working and before files. Neither was reviewed for correctness or attributed to the parent. The untracked `test_wrapped_fraction_baselines.py` helper test was not read or reviewed. The ten pre-existing modules in the candidate suite are byte-identical to HEAD.

## Geometry And Preservation

- Candidate lines 117-133 remove top horizontal overbar evidence only from a private counting copy before classifying an inline fraction. The predicate uses band-relative position, line height, and absence of sufficient numerator ink above the horizontal component; it contains no source-page identity, expected row count, or absolute source coordinate.
- Candidate lines 445-464 remove a sparse connected top-margin component only when it starts in the top tenth, exceeds glyph-relative height/width thresholds, has less than 20% bounding-box ink density, and lacks a nearby normal glyph-sized supporting component. Removal is component-selective, not deletion of every pixel or row in its bounding rectangle. Ordinary title glyphs do not meet this outline predicate.
- Candidate lines 465-480 move the existing isolated-thin-streak cleanup after outline removal and recompute projection fragments. The streak thresholds remain unchanged; surviving nearby supporting rows still protect legitimate fraction rules.
- `line_bands` already starts with a copy (candidate lines 328-329); the new `_single_fraction_row` processing also starts with a copy. Neither changes caller-owned input masks or extraction pixels.
- Existing recorded candidate results cover independent full/wrapped rows beside fractions, short outside rows, captions, footnotes, narrow digits, stacked arithmetic, braced systems, and input-mask preservation. The corrected new synthetic negative includes full text beside two fractions and retains two independent rows; the top-title negative retains its row. These are adequate affected-scope defenses, not a claim that every sparse mathematical shape or scan layout is solved.

## Execution History

Reused `stages/counter-owned-tests-FIRST.receipt.json` and its hash-verified stdout/stderr, plus `counter-owned/test-result-FIRST.json`. The actual command executed `verify-counter-owned.py`, exited 0, and reports **65 tests run, zero failures/errors, four skipped source subtests** (missing renders for 268, 269, 270, 275). The 251 and 258 pixel-count/preservation checks are explicitly `ok`, not skipped. The runner binds imports to the helper-free candidate and excludes the user's helper test.

The first new-test execution is retained, not overwritten: `counter-affected/tests-first.py` and `stages/counter-focused-FIRST.*` record exit 1 with two failures. The first supposed sparse outline was a 39-pixel-wide dense swept contour; the corrected fixture uses a thin 3-pixel stroke with a larger horizontal step. The other failure was the exploratory same-column two-fraction negative.

**Residual limitation, not fixed:** the same-column two-fraction helper probe expects `false` but returns `true` for HEAD, the saved before implementation, and the helper-free candidate. The actual verification script records all three observations. The revised negative adds full text beside the fractions; it tests unrelated-row survival and does not establish a fix for that exploratory limitation. This remains explicitly out of the source-acceptance claim.

`stages/counter-limitation-baseline-FIRST.*` is not baseline evidence: the wrapper ignores stdin, both streams are empty, and exit 0 merely reflects an empty `python -` invocation. Only the later actual verification script supplies the baseline comparison.

## Affected Pages

The existing `source251-258-review/review.md` supplies the authoritative FIRST observations: source text/formulas/owners pass, with only these counter mismatches:

| Page | Reused Pixel Diagnosis | Before Audit | Current Audit / MD |
| --- | --- | --- | --- |
| 0251 | One inequality at 772-862 was split into 772-817 and 818-862 | 20 | 19 / 19 |
| 0258 | Non-text top-margin outline contributed 111-164 above actual text at 232-321 | 22 | 21 / 21 |

The first `source251/258-counter-affected1` finalizations exited 1 because the books root was one level too deep. Inspection of `p2c.py` confirms the PDF lookup failed before durable MD/JSON/audit writes on these figure-free pages. Those failed receipts remain failures.

Corrected `source251/258-counter-affected2` receipts use `ssot-resources/soviet10year-textbooks/sources`, exit 0, and report actual printed counts 19/21 with zero normalizations. Their streams match the receipts' SHA-256 values.

Both current `page.md` and `page.json` files are byte-identical to their `counter-affected` snapshots and match the earlier source review binding. Both `page.png` hashes match `before-inputs.json` and current render provenance; all eight earlier reviewed grids retain their bound hashes. Source content, formula/owner/continuation structure, and source pixels are unchanged.

For each affected audit, only `lines_printed` and `errors` differ from the saved snapshot: the count is reconciled and the old mismatch is removed. Both now have empty errors, normalizations, unknown characters, and KaTeX warnings.

The two preparation `layout.json` files remain byte-identical to their before snapshots and still contain the old 20/22 bands. This is historical preparation metadata, not a fresh counter result: `p2c.py:236-252` writes those files only during prepare; `p2c.py:328` recomputes the masked count during finalize and `p2c.py:394-399` writes the authoritative audit without replacing preparation layout. No reprepare or duplicate finalization is necessary to make that old metadata current.

## Remaining Scope

Within FIRST 251-258, **no further finalization is needed**. Pages 252-257 retain their source-review-bound MD/JSON/audit/layout files and existing exit-0 finalization receipts; their printed/MD counts remain 11, 26, 26, 24, 21, 20 with no audit errors. The two affected pages now also reconcile. This does not assert completeness or current acceptance of unseen pages or whole lessons.

Stop after this report. No code/test/content fix is requested. Keep this reviewer available for an explicitly requested affected-only follow-up; this report authorizes no continuation or broader production work.
