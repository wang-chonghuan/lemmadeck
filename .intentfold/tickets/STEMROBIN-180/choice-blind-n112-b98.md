# n112 CHOICE SOURCE/BLIND independent review, b98

## Scope and verdict

- Same genuinely independent reviewer as the prior n112 TEXT/ANSWER SOURCE stage, separate from the author. No new reviewer, chat, descendant or peer message.
- Every command workdir: `/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck`.
- **SOURCE reuse/current binding PASS; task fidelity PASS with explicit production loss; redundancy PASS; visible leakage PASS; independent mathematics PASS.**
- Complete independent general-definition true set: **`{a}`**. One visible question, four options, native `single`, zero figures.
- This is SOURCE/BLIND only. No author draft, internal key, answer candidate or canonical answer key was read; no author-key comparison or full-choice/canonical/whole-lesson approval is issued.

## Binding and source reuse

The supplied seed is 1815 bytes, byte SHA-256 `91b2968b059c89946441723e848df41da2afaa1f617ccbf26ceacc5e09891d55`; its official ASCII-canonical digest is `f02c3345a3f936f08ae3b9a11366f6bd6c63e43fd3f96b2be47d6259100a9eb2`. The supplied view-only is 797 bytes, SHA-256 `d444f8e5ea4db83b962705bb897461347a740185df75fc61490b69c2cbce82bf`. All supplied snapshot digests match. Neither input was changed.

Four complete current trace-file byte hashes are retained in this review's `verification-result.json` and manifest. Official seed trace conventions are checked separately: `book.json` uses the canonical selected-lesson index projection, whereas lesson/exercises/figures trace hashes use entire file bytes. All four **native trace checks pass**. The full current `book.json` is 8590 bytes, SHA-256 `1df0ec36f27b662a5de1d88aa59d7e01983df61ad393e628c60fe177cfe499c3`; its official scoped digest is `883df4150c1cfaa7e0fbe6d653af38180638ef52a044d93a35c9543a0e2a564f`, exactly the seed trace. The manifest does not mislabel the scoped digest as a full-file byte hash.

The initial quick check exited 1 because this reviewer compared different hash contracts: Unicode rather than official ASCII-canonical JSON, and whole-book bytes rather than the native lesson-scoped book trace. The provisional SOURCE HOLD was withdrawn after reading the stable contract and running the actual official `digest`/`book_lesson_hash` helpers. The mismatch and its correction remain in `preflight-observations.json`; there is no seed repair, silent rebind or confirmed source drift.

The seed question remains exactly `什么是热机效率？`. It matches the already passed independent question observation. Its concept blocks 1 and 2 exactly match the prior hash-bound parser observations: the definition is useful work divided by total energy from complete fuel combustion; the second paragraph supplies the percent convention and source-era-only typical figures. Prior independent `independent-solutions.json`, 12478 bytes, SHA-256 `0239d03c3cd18c8e20e10f6600f7a18e6d602d147aec478eed938a237e1520c9`, is reused for q1 only. Its four definition facets had already passed. No SOURCE, TEXT or historical investigation was rerun.

## Fidelity, redundancy, leakage first

`fidelity-first.json` was written before the independent option-mathematics result. The visible stem labels `Q` as the energy released by complete fuel combustion and `W` as useful work in the same process, and asks for the percent-efficiency expression. It still requires choosing the numerator, denominator, ratio direction and percent representation. No concrete `Q/W` value or original typical efficiency is supplied as the answer. These are the definition's essential distinctions, so recognition/elimination does not by itself fail fidelity.

**Explicit loss:** the learner is no longer required to independently compose a complete natural-language definition or introduce the meaning of input/output quantities; these variable meanings are already supplied. Selecting the correct formula cannot prove independent writing/definition-expression ability. The lost production ability is real and must not be claimed as validated by a correct click.

There is only one visible question. The four expressions are distinct general relations, not identical alternatives, and no other question supplies a clue. The stem does not state the efficiency equality. The view-only payload contains no `key`, `intent`, rationale or source-number mapping. Giving the quantities' meanings is necessary mathematical context, not a disclosed answer. This is a review of the allowed visible payload, not browser DISPLAY or actual-client security evidence.

q2 is not in the seed's selected source set. Its complete original three-topic historical report is preserved under the caller's already-bound retention premise; this phase does not recheck it. This q1 formula question does not validate historical research, reports, writing, or the three report topics. They have not been converted into invented choice questions.

## Every option and complete true set

Let `r=W/Q`, with positive fuel input `Q>0`. Useful work and input energy have the same dimension. For ordinary positive useful output one can inspect `0<W<Q`; the `W=0` boundary does not change the general definition. The question asks for a **definition relation**, not an expression that happens to equal efficiency at one unstated special operating value.

| Option | General relation, apart from percent notation | Independent verdict and derivation |
| --- | --- | --- |
| a | `r` | **True as definition.** Useful output divided by total fuel input, multiplied by `100%`, exactly reproduces the prior independent SOURCE and concepts 1/2. |
| b | `1/r` | **False as definition.** Input/output reverses the ratio. For positive useful output below total input it exceeds 100%, whereas efficiency is below 100%. Equality with `r` requires `Q²=W²`; in the nonnegative domain only `W=Q` remains, a special ideal boundary, not a general identity. At `W=0` this expression is undefined. |
| c | `1-r` | **False as definition.** It is the fraction of input not becoming useful work, not the useful fraction. Equality with `r` requires `Q-W=W`, hence `Q=2W` or `r=1/2`. No such condition is supplied, and even then this is an accidental numerical equality rather than the definition. Therefore c is not a second true option. |
| d | `r/(1-r)` | **False as definition.** It compares useful work to remaining energy, using the wrong denominator. Where both denominators are nonzero, equality with `W/Q` gives `WQ=W(Q-W)`, hence `W²=0`. Only zero useful output remains as a degenerate equality; for every positive useful output it differs. At `W=Q` it is undefined. |

An exact rational counterexample, merely for demonstrating nonidentity and not supplying invented question data, uses `Q=100`, `W=25` in the same energy unit. Definition efficiency is **25%**. The four option values are **25%, 400%, 75%, and `(100/3)%`** respectively. This gives a concrete counterexample to each of b/c/d. Separate exact checks preserve the special coincidences `a=c` at `r=1/2`, `a=d` at `W=0`, and `a=b` at the ideal `W=Q` boundary without confusing any of them with a general definition.

Thus the independently derived complete general-definition true set is **`["a"]`**, one element, consistent with native single. This set has not been compared with an author key.

## Actual command evidence and outputs

Executed in the absolute workdir above:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-choice-blind/record-command.cjs source-blind-check python3 .intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-choice-blind/verify-source-blind.py
```

**Exit 0; stderr 0 bytes.** The actual result verifies the supplied seed/view byte hashes, official seed canonical digest, all four native traces plus current full-file byte bindings, q1 question equality, exact concept 1/2 equality to previous bound observations, view-only structure, four options, unique true set and exact rational counterexamples/coincidences. It does not run the draft/key-dependent validator, determine an author's misconception intent, or treat sampling as a substitute for the general derivations above.

All payloads below are under `/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n112-choice-blind/`:

- `fidelity-first.json`: separate first-phase substantive findings and capacity losses.
- `blind-review.json`: source reuse, per-option derivations, complete independent true set and explicit interim scope. No guessed draft digest or fake full-review schema.
- `verification-result.json` and `commands/source-blind-check.{json,stdout.txt,stderr.txt}`: actual check, full trace hashes and arithmetic results.
- `input-snapshots/`: byte-identical seed/view and the extracted reused independent q1, all scoped to this stage.
- `manifest.json`: all actual stage input/output paths, bytes and hashes, sealed `0444`; external self digest in `manifest.sha256`.

No original page, image, browser, historical query, model service, quota/credential change, DB write, merge, push, deploy or next-stage prefetch occurred. This reviewer stops after returning SOURCE/BLIND results and waits for the same reviewer's next authorized phase.
