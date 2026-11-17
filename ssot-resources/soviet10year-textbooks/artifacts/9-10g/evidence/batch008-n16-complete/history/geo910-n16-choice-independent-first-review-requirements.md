# n16 First Rejected Review: Minimal Affected Requirements

Stage3 was explicitly authorized only after the immutable source-first,
view-only and provenance-only freezes were consumed. This is the first rejected
review of the reconciled current seed/draft, not a repair or approval.

## Finding

One definite defect, unchanged from frozen Stage2:
`geo910-n16-choice-166-common-opposite-proof` option d (V5.d) explicitly states
the solved nontransitivity fact. `geo910-n16-choice-166-distinct-witness`
option a (V4.a) alone explicitly concludes that fact. Matching those words lets
a learner select V4.a without checking its three intersections or establishing
a counterexample. V5.d is correctly keyed as an invalid proof; its initial
premise is nevertheless a true, learner-visible solved fact.

The review therefore marks V4/V5 answer_leakage and source 166 coverage
`revise`. All six mathematics checks pass, with 48 author truths and all six
full sets agreeing with the pre-key freeze. No additional actual mathematics,
derivation, misconception-generation, recognition-loss or nominal-coverage
defect was found. The source 166 unit-independence claim is not supported while
the same leakage defect remains; this is not a second repair scope.

## Minimal Parent Repair

1. Change only the affected V5.d learner option at
   `/questions/4/view/options/3/text` to remove the unqualified solved
   nontransitivity premise and any equivalent direct cue that identifies V4.a.
   Do not replace it with a restatement of the solved V4 witness or its key.
2. Keep it an actually invalid argument under V5's proof-validity stem. The
   correct set must remain `{b}`; a true theorem conclusion is not sufficient
   to make a proof valid. If the revised wording changes the mistaken
   procedure, align only its matching internal record:
   `/questions/4/key/rationales/3/derivation` and
   `/questions/4/key/rationales/3/misconception`.
3. Preserve V4's full witness/intersection task and all other source
   distinctions, modes, options, keys, limitations and coverage mappings.
   Do not reseed, alter C1D, change figures, reopen source images or rewrite
   immutable reviewer freezes. Check the repaired V5.d -> V4 package
   relationship against a newly bound learner/draft snapshot before approval.

The parent owns the repair. No replacement option text was authored and no
draft, seed, source-solve, handoff, learner view or another worker's file was
changed by this reviewer.

## Stage3 Comparison And Binding

Current seed canonical SHA-256:
`56ffbd384814e6b69e01c393d9a7dbe974885be694edc04f5d9c1a3856a44916`

Current draft canonical SHA-256:
`0cc38057ebd323f66ca0c06dbd8a19a4af12ed136be801cf7b17e41c863040b8`

Current draft byte SHA-256:
`bf2e17c144ae4595daa1721eadf93a44af337d10f6a911c22ec5a81b1c6d54e2`

Author source-solve byte SHA-256:
`4082b59f99a101df69b3139965c91baa202d799105af0c5c00e544a303d41658`

Author handoff byte SHA-256:
`9cc64ed8deb9421720787a45e34c8c35e5e350c06d88c08c7d615f3de95f504f`

The current draft's ordered view projection equals the frozen learner array.
Author source-solve, the complete 28-pair table, all 48 derivations, every
incorrect-option misconception and the full sets agree with the independent
source/view freezes. In particular V5.d's existential-to-universal error is
correctly identified by the author and remains a false proof despite the true
domain conclusion. Author limitations and coverage explicitly record the same
recognition/free-production losses recorded blindly by the reviewer.

The handoff's old seed/draft digests and exit-2 trace-drift result describe its
preserved historical snapshot. The provenance-only addition independently
establishes the trace-only bridge to the current seed. This historical record
does not invalidate current semantic fields or justify reseeding.

The three immutable reviewer freezes remain byte-identical:

- Source-first SHA-256:
  `d766f85daa6aaba6cafd50afba6b2dbcbe8f79ded32f57a35949a634c2f8e0ca`
- View-only SHA-256:
  `ef5d6c3f9504ca1771c0bbc56e8084e0177c002c1414be7eef642058786478ac`
- Provenance-only addition SHA-256:
  `56a0ab298bd436d5add07b61cb921964a004fe5f48d9b576dcc3e6fec3fc5c15`

The review schema's `figure_checks` is empty because every exercise figure
reference, learner stem figure reference and learner option figure reference is
empty; the official validator derives this exact question-used set.
`new_figures` and `new_figure_reviews` are also empty. This does not discard the
previous actual concept-figure inspection: full-frame fig-62/63 observations,
asset/PNG hashes and conservative load ledger remain in the source-first
freeze. No source/image gate or additional image load occurred in Stage3.

## One Validator Run

The official validator will run exactly once for the current seed/draft with
`geo910-n16-choice-independent-first-review.json`. Its exact command, output,
exit status and artifact hashes are recorded separately in
`geo910-n16-choice-independent-first-review-validation.md`.
Expected disposition: structural checks succeed, semantic outcome `revise`,
exit 3. No second invocation, self-repair, reseed or publisher is authorized.
