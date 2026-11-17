# STEMROBIN-180: b58 Choice Review

Phase: independent post-blind author comparison, 2026-11-17.
Lesson: 8p / phy8-c1-s3-n19 / modern-us-neutral.
Semantic outcome: PASS for the exact offline choice snapshot below.
Concrete defects requiring revision: NONE.

## Immutable Evidence Binding

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| Artifact | File-byte SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-180/answer-source-angular-speed-b58.md` | 8454b4f8548459c1748c0ef5a5f5a7b12594145460650fc751cd26cc1ed70824 |
| `.intentfold/tickets/STEMROBIN-180/tmp/choice-blind-angular-speed-b58.md` | 3ef6d8b9c4cee13f2be4345b18dc13532b219509838285b6a289993cdfe2e556 |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/seed.json` | 25634f22c4777f12fa7e4c190370f4eb2a30e40c5e650648bf3a598a81661184 |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/views-only.json` | 4031abb9ddb1f661d04587dd112be5564447087f55d3b8d222287a388dc9801e |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/draft.json` | 24f7c28353f2e64f7f7cf32d8b15d2fdf15833ba90f363e11012371efd10d398 |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/source-solutions-before-options.md` | 22b609369c62bd1a4b59f72cd0799aa5b9d74f4569bea867a32074cf075e65b1 |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/author-binding.json` | 5a1b9f69cc83fd98bf091cc78138208e3fe2fc99335111089c7b6367f42a1020 |
| `.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/review.json` | 63293e469c4bcc46d53cf4fb05d4e74e2f184ba93b36126b48530e0254ed87fc |

The formal `s10y-choice-review-v1` record binds canonical JSON digests:

```text
seed_sha256  = c2a117d021bf9ab97310d46850859bcc44ff4169269a025b3874dc629e5a1fc9
draft_sha256 = 3d08fbb10b415f42a7b86bea3938d9bee61b99d15860efe9a7fa65d234890496
views digest = 4178fa7b634f3b4d0bb7b3702f3aa9fc7e659ca471c01afab4c7684737245786
```

These canonical digests were independently computed with the contract's
sorted-key, ensure-ASCII, compact JSON serialization. They match the author's
binding record. The draft's seed digest matches the actual seed digest.
Structured equality confirms that projecting the full draft to
`{questions: [{id, source_numbers, view}], coverage}` yields the exact
previously blind-reviewed views object. Raw seed/view hashes also remain
identical to FIRST. No changed-view review was substituted.

Both independent baseline hashes match their original seals. Neither baseline
was rewritten. Full author material was opened only after the immutable
blind result had been returned and explicitly acknowledged by the parent.

## Exact Key and Thirteen-Option Comparison

The author did not determine or change the reviewer's truth sets.

| Question | Blind FIRST true set | Author exact set | Result |
| --- | --- | --- | --- |
| angular-speed-definition-and-relation | `{a,b}` | `{a,b}` | Exact agreement |
| earth-orbital-speeds | `{c}` | `{c}` | Exact agreement |
| clock-tower-tip-and-angular-comparison | `{a}` | `{a}` | Exact agreement |

All 13 author truth labels agree with FIRST. The formal record checks every
option, including all 9 false alternatives' actual wrong procedures:

| Option | Truth | Disclosed derivation compared with FIRST |
| --- | --- | --- |
| Definition a | Correct | Angle/time and rad/s reproduce the full definition/unit answer |
| Definition b | Correct | Radian arc length gives v=omega*r; positive fixed omega gives positive radius dependence |
| Definition c | Incorrect | Substitute path length for swept angle, computing linear speed and misnaming it angular speed |
| Definition d | Incorrect | Divide by radius again when isolating v from omega=v/r; generates omega/r and wrong inverse dependence |
| Definition e | Incorrect | Omit the radius factor when comparing equal angular speeds; actual speed ratio is r1/r2 |
| Earth a | Incorrect | Use 4*pi per orbit; gives 3.9847699817222135e-7 rad/s and 59.771549725833204 km/s, rounding to the printed doubled pair |
| Earth b | Incorrect | Keep correct omega, mistake 150000000 km for 150000000 m, then convert 29.885774862916602 m/s to 0.0299 km/s |
| Earth c | Correct | The declared 365-day convention reproduces sealed 1.99e-7 rad/s and 29.9 km/s |
| Earth d | Incorrect | Use frequency 1/T as omega; 3.1709791983764586e-8 and 4.756468797564688 km/s omit 2*pi and round to the printed pair |
| Clock a | Correct | 3600 s and 7*pi m give both exact sealed speeds; equal watch period gives equal omega |
| Clock b | Incorrect | Mistake both minute hands for hour hands, T=43200 s; numeric speeds become one twelfth while equality stays true |
| Clock c | Incorrect | Omit the minute-to-second conversion, T=60 s; numeric speeds become 60 times too large while equality stays true |
| Clock d | Incorrect | Correct tower arithmetic, then incorrectly transfer hand size/tip travel to greater angular speed despite equal periods |

The clock c author's conversion-error mechanism and FIRST's possible
second-hand confusion generate the same false 60-second period. This is
a disclosed plausible alternative mechanism, not a truth-set discrepancy.
Tiny last-bit binary floating-point differences in the Earth a/b displayed
derivations do not affect their three-significant-figure options.

The numeric wrong procedures were directly evaluated in memory; the original
source solver was NOT rerun. Symbolic misconceptions were checked against
the already sealed relations and conditions, not merely trusted from labels.

## Four Source Solutions and Capacity

All four author pre-options solutions agree with the independent baseline:

1. Definition and rad/s unit are both present; angle/time is distinguished
   from path length/time.
2. Radian arc-length reasoning gives v=omega*r and omega=v/r with positive
   radius and consistent units.
3. The radius remains 150000000 km = 1.5e11 m. The author actually retains
   the promised general-T expression and openly selects 365 days for the
   numerical choice stem. Its SI and km/s results match the sealed 365-day
   solution. A separately stated 365.25-day answer convention remains valid
   for the original task; it does not override this explicitly fixed stem.
4. The generic tower's radius remains 3.5 m. The author uses 3600 s, supplies
   the full tip speed and equal watch angular-speed comparison, and invents
   no watch radius or numeric watch-tip task.

No original requested quantity or conceptual distinction is dropped.
The full draft honestly records free-production/derivation/numerical-working
losses, the specified orbital convention/general-T response loss, and the
comparison-proof loss. FIRST-L1 through FIRST-L4 stand unchanged: transparent
unit/period scaffolding, recognition rather than free production, useful
shared relations without copied answers, and offline-only evidence.

The draft's hidden intent and keys are not part of its learner-facing view.
No runtime payload claim is made. No figures are declared or referenced:
formal `figure_checks` and `new_figure_reviews` are both empty.

## Scope and Handoff

`review.json` contains separate coverage, task-fidelity, redundancy, leakage,
and all-option mathematics evidence; its `outcome: pass` is a substantive
semantic judgment, not approval based on structure.

The author's binding records pre-options freeze receipts and a prior
structural check. Their listed receipt files were not opened, their
chronology was not independently replayed, and that recorded structural
check was not used as semantic acceptance evidence.

No candidate, source, original solve, blind FIRST, author binding, or charter
was edited. No image was loaded. No validate/finalize/prepare/gate, source
solve replay, Git, shared DB, publication, app, service, or dependency action
was performed. This review authorizes none of those operations.

This durable note and the formal review are sealed read-only after writing.
Their external SHA-256 identities establish this exact post-blind snapshot.
The parent written-answer draft is examined only after these choice-review
records are created; its review belongs in a separate durable report.
