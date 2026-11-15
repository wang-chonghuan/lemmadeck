# phy6-c4-s2 Author Notes

Author-only offline draft, pending main's source-first, view-only and later
internal comparison stages. No self-review.json or reviewed validation.

## Source Freeze And Scope

`source-solution.md` was completed and frozen by `freeze-source.py` while
draft.json/view.json were absent. SHA256
`f885d562240cb65afdabe130631b8f4a380c41e9f4fd9024a43db5dac6517043`.
`source-freeze.json` binds the seed, solution, actual observed approved figure
and both actual-media screenshots before writing the draft. It is not rewritten.

All four original tasks selected, with concept blocks0,1,2,5,9,10.
Blocks11-13 are worked examples and were not projected as definitions or used
as data. Original100 and modern100/spec viewed only for actual structure,
conventions and readable labels; no approved figure modification/revalidation.
Seed canonical SHA256
`3be6ff75aa0c91884195082082948f601ec9806e56b476344669c3945ef49ebb`.

No main answer-source/authored answer keys, other choices, interactions, previous
outputs/history or reviewer solutions consulted. No model, network service,
DB, publisher, application, Git, dependencies, schema or durable writes.
All new files are in this authorized choice directory.

## Units And Explicit New Conditions

Three meaningful units, not a forced four-item quota: q1 merges the two
equilibrium prompts; q2 handles the distinct piston-motion/work tradeoff;
q3 handles the air/liquid comparison. q1 is single; q2/q3 are native multiple,
with four definite assertions each. Every internal candidate has a complete
truth derivation and a reproducible mistaken procedure if false.

q1 introduces a visible circular-piston diameter ratio2. This is authored
test data, not a source datum, not a measurement from schematic width and
not the lesson's solved numerical example. It tests squaring a length ratio,
the direction of the area ratio and pressure versus force.
All source2 ideal conditions and the downward balancing-force convention
remain visible.

q2 explicitly supplies the volume/stroke approximation: sealed/nonleaking,
approximately incompressible liquid, slow motion, no friction/piston weight
or liquid-column pressure difference, equal external pressures. This avoids
silently claiming equal-height force comparison throughout a finite stroke.
It judges opposite motions, volume transfer and work rather than copying
an isolated statement of gain.

q3 supplies no gas readings, equation-of-state data or new apparatus.
It does not universalize the hydraulic stroke relation to air or claim a
particular numerical output stroke. Compression and pressure force are
different physical issues.

The three questions are independently answerable. q2 does not reuse q1's
diameter ratio or ask for its gain; q3 does not presume any prior selected
option. The ideal hydraulic equal-volume premise is an explicitly given
condition in q2, contrasted with a compressible medium in q3; it is not a
hidden answer code. Cross-package semantic judgment remains the reviewer's job.

## Honest Coverage Losses

All four source prompts remain retained in the seed and finalized course.
Choice recognition does not establish independent naming, algebraic derivation,
diagram production, original prose explanations, measurement, construction or
practical design. `intent.limitations` and `coverage.omitted_tasks` list these
losses; no claim of full written-production equivalence.

## Checks And Handoff

The existing structural validator ran exactly once, without --review,
with its actual output retained as `structure-check.txt`: exit0,
`mechanical checks passed; semantic review still required`. That is mechanical
checking only, not semantic approval. No tests/broad corpus checks or reviewed
validate are requested. `view.json` is a pure projection of local IDs, view
fields and used seed image assets; it excludes mappings, solutions, keys,
rationales, limitations and omissions. Hashes and command/results are frozen
in `author-handoff.json` after the one structural run.

Main may begin blind source review from seed.json and blind view review from
view.json. Author internal draft/notes/solution are reserved for its later
authorized key comparison, not included in the user-facing handoff text.

Actual command (one execution, with pipefail and tee output retention):

```sh
zsh -o pipefail -c 'env -u PWDEBUG PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c4-s2/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c4-s2/draft.json 2>&1 | tee .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c4-s2/structure-check.txt'
```

The pure view canonical SHA256 is
`475b5a3102e32f07d103d2e72288da2392bfe4075198ef8e223a508c80d8ff19`.
Source-solution byte hash, seed canonical hash, complete output byte/canonical
hashes and executed tool hashes are in the frozen handoff ledger.
