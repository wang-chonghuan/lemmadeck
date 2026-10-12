---
name: ld-s10y-choice
description: Load when asked to create or review single-choice or multiple-choice questions from original Soviet 10 Years written exercises. Uses the exercise prose, actual figures and lesson definitions as seeds; offline authoring only, not publishing or answer-input conversion.
---

# Written Mathematics to Choice Questions

Create new questions that still require the mathematical thinking of the written
task. The seed is a problem to understand, not a collection of answer slots.

## Boundary

- Work offline. Do not read `.env`, connect to a database, install dependencies,
  call a model service, publish, or change the application.
- Do not consult previous choice questions, interaction specifications, keyboard
  exercises, answer-box configurations, judging subparts, earlier skill versions,
  their tests or ticket outputs. No history lookup or compatibility commands.
- Input authority is the original written prose in the allowed modern lesson
  files, the actual referenced images, and the lesson's concept definitions.
  Do not inspect answers during authoring. This workflow needs no old answers.
- Source relationships, solutions, keys, misconception derivations and reviews
  are internal. Only a question's `view` is learner-facing; the offline draft is
  never a client payload.

## Author

Read [authoring.md](references/authoring.md) and
[contract.md](references/contract.md). Commands below run from the repository root.

1. Inspect the whitelist projection, then explicitly choose seed numbers and
   relevant definition paragraph indices. Do not include solved examples as
   definitions.
2. Prepare a seed file in the active ticket's `tmp/` or repository `.tmp/`.
   Open its actual image assets. Stop on unreadable figures, missing data or
   unresolved conventions; do not guess.
3. Solve each seed independently **before** constructing options. Identify the
   mathematical tasks, then choose meaningful response units and native `single`
   or `multiple` mode. Create the draft by reasoning, not by script. When candidate
   diagrams are needed, use the offline `ld-s10y-image` path in `authoring.md`;
   register them separately in `new_figures`, never in the source seed.
4. Run the structural checker. Then read [review.md](references/review.md) and
   carry out the semantic gate. Prefer a separate reviewer when available and
   authorized; otherwise record an honest `self_review`.
5. Run the checker with the review. Repair real defects once at the smallest
   affected unit and obtain a new review of the changed snapshot. If an essential
   defect remains, report it as blocked. Do not hand off as approved.

```bash
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect \
  --repo . --book <book> --lesson <lesson>
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare \
  --repo . --book <book> --lesson <lesson> \
  --exercise <number> --concept-block <zero-based-index> \
  --out .intentfold/tickets/<ticket>/tmp/seed.json
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . --seed <seed.json> --draft <draft.json>
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . --seed <seed.json> --draft <draft.json> --review <review.json>
```

Repeat `--exercise` / `--concept-block` as needed. Use explicit `--no-concepts`
only when no lesson definition is relevant. `--concept-figure <id>` includes a
figure necessary to interpret a selected definition. Existing outputs are not
overwritten.

## Review Only

Read [review.md](references/review.md) and [contract.md](references/contract.md).
Start with the seed and its images, not the author's solution or correct set.
Review task fidelity, redundancy and leakage before independently checking the
mathematics. Return the review and concrete findings without silently editing the
draft. A failed gate is useful evidence, not an approval.

## Handoff

Return seed, draft, review and the exact validation command/results. State any
capacity loss or deferred source task. Stop at offline handoff: no publisher,
website integration, DB payload or claim of automatic semantic proof.
