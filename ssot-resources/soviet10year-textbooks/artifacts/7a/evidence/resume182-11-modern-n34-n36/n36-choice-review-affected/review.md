# STEMROBIN-182 / n36 / Affected Semantic Review

**Outcome: PASS for the repaired snapshot.**

Independent reviewer, not the question or graph author. Sole cwd:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

## Scope and Counts

| Work | Count |
| --- | --- |
| Newly reviewed questions / options | 2 / 8 |
| Newly reviewed source coverage | 774 only |
| Unchanged questions / options inherited verbatim | 19 / 88 |
| Unchanged source coverages inherited verbatim | 15 |
| Frozen independent source solutions reused | 16; none re-solved |
| Independent figure PASS records inherited | 2 |
| Complete canonical review | 21 questions, 96 options, 16 sources |
| New image opens | **0** |

Only `q774-line-graphical`, `q774-reciprocal-graphical` and source-774
coverage were semantically re-reviewed. Both repaired views attach the
already inspected actual graphs and explicitly request reading the intersection
x-coordinate. The line graph supports reading 4; the half-unit reciprocal
graph supports estimating 3.3. Both complete result claims preserve the
original curves, global common domains and uniqueness.

The old missing-graph-reading defect is repaired. Autonomous choice of scales,
point plotting and curve production remains explicitly unproved in both
intents and coverage. This production loss is accepted for graphical
recognition/reading, not claimed as full independent drawing.

## Ordered Gate and Delta

Source 774 and its definitions were reused and frozen in
`01-source-inheritance.json` before repaired view disclosure.
`learner-view.json` contains only the two `{id,view}` projections.
`view-analysis.json` and `03-view-freeze.json` freeze task fidelity,
redundancy, leakage, every option and complete true sets `{a}`, `{d}` before
the internal comparison recorded by `04-internal-disclosure.json`.

All eight internal derivations and misconception procedures agree with the
independent checks. All **21 keys and rationales and every option are unchanged**.
The only question field changes are `view.stem`, `view.figure_ids`,
`intent.task`, `intent.limitations`, `intent.figure_observations`.
Only source-774 `omitted_tasks` and `reason` changed. Two authored figures
were registered. Structured delta checks, not the parent's claim alone,
establish this scope in `delta.json`.

`inheritance.json` binds each of the 19 unchanged question objects and prior
review rows, each of the 15 unchanged coverage/source-review rows, and the
previous independent actual-image gate. Both retained SVG bytes match that
gate exactly. Existing figure observations and `new_figure_reviews` were
reused without opening images; approval remains at the declared 640 px media
width. The original FIRST BLOCKED review is preserved unchanged.

## Snapshot Hashes

Canonical JSON SHA-256:

- Seed: `ae14f4abcdf8aba2bf8fddae34b79d8b3d54da86ae269112b7c53052988fe257`
- Repaired draft: `5c796a294bfacea67dae2184846afd92a2a7236b7731a65f72b20d22e8621add`
- Review: `0cad9a2c9616192746688698d9f0f426f328c7046faadb7eee089b9d7fcf8628`

Output byte SHA-256:

- `review.json`: `c0ed24d7ec624547aedef437086526bd407d85f3c8ae9a49994ded8ab286434d`
- `inheritance.json`: `3dee0755ed945c8d97ca6a1168f566d50ea42fdd4b011c416e1d17bf85ab5d26`
- `delta.json`: `9c048e639c2323925e030459e3f041b032ce29d3e07a597212b54a23b5df430a`

## Actual Validation

The unique wrapper creates `validation-invocation.json` before invoking the
validator, preventing a second invocation. Actual command:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-choice-repaired/seed.json --draft .intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-choice-repaired/draft.json --review .intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-choice-review-affected/review.json
```

Run once at 2026-11-19 00:26:56 UTC. **Exit 0.** Standard error empty.
Actual standard output:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

`06-validation.json` and the raw/combined `validate*.log` files preserve
the actual command, timing, exit and streams. No rerun was performed.
The tool confirms structure/snapshot consistency, not mathematical or
graph-reading proof; the independent semantic and inherited actual-image
evidence remain separate.

No draft, source, app, DB, Git, publisher or other report was changed.
