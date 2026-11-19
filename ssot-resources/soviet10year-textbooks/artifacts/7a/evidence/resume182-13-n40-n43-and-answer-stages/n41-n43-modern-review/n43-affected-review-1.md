# n43 Affected-Only Binding Review 1

Ticket: STEMROBIN-182. Date: 2026-11-19. Offline; zero images.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
FIRST report retained unchanged: `first-review.md`, SHA-256 `0f4ffd6055d10f54213b4d4b8e8a506338f06e2e2a8205a9ccb56e8281e5bd10`.

## Verdict

**Affected content/binding: PASS. Current n43 candidate contract: FAIL, one metadata defect A1.**

| Affected item | Result |
| --- | --- |
| M1: exact source original, modern 和 -> 积, generated post-registration source binding | PASS |
| T1: source ASCII terminators at prose[3], prose[25], exercise 857 | PASS: no numeric mismatch |
| Changed section anchor after prose[25] | PASS: same semantic boundary and index |
| Formula sequences, source snapshots, raw bytes, no fake numeric changes | PASS |
| prose[25] change declaration after its text became exactly source-identical | FAIL: A1 |

n41/n42 PASS is inherited unchanged, not re-reviewed. Their four authored template hashes still match FIRST. All unaffected n43 content retains its FIRST verdict; this review adds no full-lesson, source-faithfulness, figure or answer-review credit.

## A1: Stale Layout Declaration

File: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n43-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/alg7-c4-s3-n43/lesson.template.json`.
Target: `lesson.prose[25]`, source `p0257#4`; text at line 407 and source_text at line 414.

After restoring the source ASCII terminator, both fields are exactly:

```text
方程 $x^2-18x+81=0$ 只有唯一的根 9.
```

But `changes` remains `["layout"]`. The existing `edition.validate_text` returns, before AND after in-memory normalization:

```text
lesson.prose[25] 未改写但 changes 非空
```

Prescribe only `lesson.prose[25].changes = []`, because that source block is now completely unchanged. Keep its text, source_text, formula, numeric_changes, refs and repaired boundary anchor intact. This is declaration cleanup, not a new mathematical/cultural correction. No template was edited by this reviewer.

## Passed Affected Checks

- The original prescribed substring is retained exactly once in durable and staged p0256#5, raw `lesson.prose[15]` and its `source_text`. The modern target contains exactly the prescribed corrected substring: one 和 -> 积 replacement, no other target-text change.
- Durable and staged source256 JSON are byte-identical at new SHA-256 `435ea917a07bdc8f7e0a475ed9f339b9300cbe2e9aa54790df4b0b4543927ffb`. All source256 block objects remain identical to FIRST; only `meta.errata` gained `p0256-math-1`.
- Read-only `edition.source_errata` regenerated the record from current authoritative pages and ownership. Its source fields, original and registered reason match the modern record exactly; `edition.validate_errata` returns zero errors and the expected correction for `lesson.prose[15]`. The old pre-registration hash is not reused.
- Binding remains physical page 256, printed page 250, block p0256#5, target lesson.prose[15], PDF SHA-256 `8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052`.
- The parent's saved source-finalize receipt has exit 0 and stdout confirms 13 blocks / 21 written lines / 21 printed lines. This receipt was inspected, not rerun.
- New staged raw lesson/exercise bytes exactly equal FIRST, at hashes `7e3a3dddb43c2533be5bd3166cb5b2bb4cdc2161593c3dc51a40ec971f12874a` and `6d921cd7dc48f730ca63f19f9db5ee2733903b305fba8a6db2771a5d1171816c`. Both templates' embedded source hashes, paths and full data match these bytes.
- Structural comparison against FIRST finds only M1 text/erratum/math-correction, the three stated terminators, the exercise 857 line-array mirror and one section-anchor terminator. No source_text or formula sequence changed. All numeric_changes arrays remain empty.
- Affected `validate_text` checks PASS for prose[3], prose[15] with its registered correction, and exercise 857. Prose[25] has only A1; its number signatures now match. All three old T1 mismatches are gone before and after in-memory normalization.
- Fresh `prose_flow.mjs` on current templates resolves `[12,21,27]` with 39 final paragraphs. The sole changed anchor is section_breaks[2].before: `方程 $x^2-18x+81=0$ 只有唯一的根 9.` -> `例 3 解方程：`, index 27. The other anchors are byte-identical to FIRST.
- The saved `n43-affected-prose-flow.json` has the same paragraph outline but empty boundaries, reflecting the intermediate outline input. It alone does not validate restored anchors; fresh current-template and in-memory-normalized calls above do, without editing files.

## Retained Binding

Reviewed lesson template SHA-256: `e504ce84b9634798d2e7a40b34eddea479e19fd272a973d9b3944635ef12af9e`.
Reviewed exercise template SHA-256: `e759b516a20fab83d6cdeb656925dd9c4477299eb12b4e3224d28960584e81ce`.

`n43-affected-review-1.json` retains exact inputs, split verdicts, A1, the generated erratum and a normalized-content projection fingerprint for later output binding. The projection excludes change declarations deliberately; it can preserve the passed text/binding checks after A1 cleanup but cannot approve invalid metadata or unseen finalized output.

No finalizer, images, source/template edits, app, network, DB or publication calls were made. FIRST is not rewritten. Stop here; retain the affected PASS checks and require only the actual remaining declaration fix to be verified before treating a later normalized output as accepted.
