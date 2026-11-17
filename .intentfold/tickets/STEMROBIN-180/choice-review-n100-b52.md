# FIRST Independent CHOICE Review: batch52 n100

Date: 2026-11-17. Ticket: STEMROBIN-180.
Scope: 7p / phy7-c1-s2-n100 only; four source tasks, four questions, 18 options.
Reviewer: Codex independent agent, separate from the candidate author.
Outcome: **revise**. Mathematics: pass for every question. No blocked check.
No candidate question was edited.

## Concrete Finding

q1-B and q2-A repeat the answer that heat used for melting increases internal
energy under the same negligible-work approximation. After solving either,
the learner can select the shared answer clause in the other by matching it.
The blind review therefore records revise for q1/q2 answer_leakage and for
q2 redundancy. This is partial cross-question cueing/repeated scoring, not
exposure of an internal key or failure of q2's entire fuel-accounting task.
It was identified before the author key was read and retained after the keys
agreed. The author's intent that internal energy is only a final-use clause
does not remove the repeated scored proposition.

The distinct physical tasks remain covered: fuel total is not crystal
absorption, container/environment receive energy, melting increases internal
energy without raising coexistence temperature, the latent-heat definition
is unit-mass complete same-temperature conversion, and all three units are
energy/mass. Natural definition recognition and ordinary dimensional reasoning
are legitimate; loss of independent writing/unaided listing is recorded but
is not a blanket BLOCK.

The q3->q4 conceptual relationship was checked, not ignored: q3 helps establish
energy/mass but does not print the three units or a correct-unit list.
It is not an additional direct-answer leakage defect.

## All Options and Sources

| Source / question | Independent true set | Complete option truth sequence | Author agreement |
| --- | --- | --- | --- |
| 1 / n100-q1 | B | A false; B true; C false; D false | exact |
| 2 / n100-q2 | A, C | A true; B false; C true; D false; E false | exact |
| 3 / n100-q3 | C | A false; B false; C true; D false | exact |
| 4 / n100-q4 | A, C, D | A true; B false; C true; D true; E false | exact |

Each of the 18 items has a separate independent derivation in review.json
and pure-view-review.md. Every source coverage check is pass, with the
declared prose/recall capacity losses inspected. q1 preserves fixed pressure,
pure crystal, solid/liquid coexistence and negligible-work/no-chemical-change
qualifications; q2 covers both total fuel and absorbed portion, without an
invented efficiency. q3 preserves pressure, 1 kg, initially at the melting
point, complete melting and same-temperature liquid. q4 includes J/kg,
kcal/kg and cal/g while rejecting J and J/(kg*degree C).

Source/new figures: 0/0. Images opened/reopened: 0/0.
No figure-229 slot, table-261 reading, material-value or conversion task is
required by these four seed sources. No absent figure or table was guessed.

## Stage Paths and Hashes

All per-lesson inputs and reviewer files are under:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/`

1. Stage 1 read only seed.json as content input, independently solved all four
   sources and wrote source-first.md before exposure to any candidate view or
   author materials.
2. Stage 2 read pure-view.json, reviewed task fidelity/redundancy/leakage before
   option truth per question, and wrote pure-view-review.md before disclosure.
3. Comparison then read this directory's draft.json intent/key/coverage and
   author source-solutions.md. The source/view freezes were not rewritten.

| Snapshot | Digest type | Observed SHA-256 |
| --- | --- | --- |
| seed.json | canonical JSON | 0f89f9e6644c5169f345c30536bbda57a9179b0529a9b94fad4a66d4cfbb64d2 |
| pure-view.json | canonical JSON | 8fde72b4bf192f81d26df7303b84793dabb72dd7613e791763ab25e63d905c6e |
| draft.json | canonical JSON | 8661af467f0b8f23e0dcf8951414087b8119c9463bcab7b7224126278eb59158 |
| review.json | canonical JSON | 84847f349f70e240f2c192c83542bf56d6221d7ae5049fc933e0d2b38fdaa4b1 |
| source-first.md | file bytes | ec7d1b9d7488b10fcbfc918a2e97976878e3e3a7d377e12a202b633b3650426c |
| pure-view-review.md | file bytes | 9b2a215c1443154d0fb6461d6708f32c1b4799d2d94c3512364b75df20940556 |
| author source-solutions.md | file bytes, after disclosure | 3218260490d21e925c42f1a14d4131c0139228ca51abefb4e69923d33204e7a2 |

Seed/draft digests match the user-specified canonical snapshots.
Post-run digest observation confirms unchanged seed, pure view, draft and
both frozen Markdown files. Digest computations are not extra validate runs.

## Actual Validation

The original first structural pass was reused without running it again:
`tmp/commands/b52-phy7-c1-s2-n100-first-structural-validate.call.json`
under this ticket. Its actual exit was 0, with
"mechanical checks passed; semantic review still required".

Exactly one reviewed validate was run from
`/Users/yong/.codex/worktrees/0f12/lemmadeck`:

```bash
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs batch52-n100-choice-reviewed-validate python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/review.json
```

Actual exit: **3**. Started: 2026-11-17T04:07:47.044Z.
Finished: 2026-11-17T04:07:47.077Z. Signal: null.
Stdout: 0 bytes. Stderr: 58 bytes:

```text
mechanical checks passed; semantic review outcome: revise
```

Record directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`

Retained exact filenames:
- batch52-n100-choice-reviewed-validate.call.json
- batch52-n100-choice-reviewed-validate.stdout
- batch52-n100-choice-reviewed-validate.stderr

Stderr byte SHA-256:
ff8f4fb4f881df39ed71f4794f8749f44bc8ba11fd062d75fce831136a7652d9.
Exit 3 confirms a structurally accepted but semantically non-passing review,
not a structural error. The result was not retried or overwritten.

## Write and Execution Boundary

The five manually written files are review.json, source-first.md,
pure-view-review.md, comparison.md and this report. All manual edits used
apply_patch. Only the explicitly requested existing record-step wrapper
created its three command-evidence files outside that manual write set.
Existing candidate/author files, first structural record, other workers'
changes and prior errors/evidence were not overwritten or reverted.

No prepare, other validator, browser, images, model service, database, Git,
backend, app, dependency operation or new pipeline was run.
No source.answer, FINAL, old answers, old choices or interactions were read.
An author repair remains outside this review; a changed candidate needs a
new snapshot-bound semantic review with the four source tasks retained.
