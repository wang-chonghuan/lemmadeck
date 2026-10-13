# STEMROBIN-174 Handoff

This work came through open development; this file records the delivered result and verification.

## Delivered

- Recreated sixth-grade algebra lessons 16, 17 and 18 from original written
  problems and selected definitions: 6, 9 and 12 questions respectively,
  including 2, 0 and 5 native multiple-choice questions.
- Retained whitelist seeds, reasoned drafts, independent reviews, exact source
  coverage and rejected-review evidence under each lesson's `choice-set/`.
  No previous choices, keyboard inputs or original answer keys informed authoring.
- Added two independently reviewed candidate graph sheets using the existing
  JSXGraph figure skill. Original lesson, exercise, figure and answer artifacts
  remain unchanged. The obsolete tracked choice artifacts inherited from the
  pre-purge base were removed without consulting their contents.
- Reused the current question list, 50-question pagination and answer-event
  table. Single clicks submit; multiple selections submit explicitly and require
  the exact unordered set. Selected IDs, learner, lesson, question revision,
  correctness, locale and timestamp are saved; reload restores the result.
- Extended the existing lesson publisher with `--choices-only`; it validates
  the independent review and retained image evidence and updates only the
  three target `exercises.choiceSet` fields. No schema or dependency changes.
- Narrow choice-skill repair: validate retained handoff images only inside the
  selected lesson's `choice-set/figures/`. Authoring stays offline and scratch-only.
  Cross-lesson paths and changed asset hashes remain rejected.

## Acceptance

All four acceptance criteria passed.

1. AC1: 27 complete mathematical tasks, 111 checked options. Collection
   classifications are native multiple choice, not per-diagram yes/no questions.
   Source mappings are internal and absent from student payloads.
2. AC2: independent source solutions preceded visible-option solving and author
   key comparison. All three final reviews pass the snapshot checker. Both
   candidate sheets pass independent actual-image and equation checks; rendered
   assets match their retained hashes. Rejected records were preserved.
3. AC3: headed Chromium checked all three decks at 1440x960 and 390x844.
   All questions/figures render, figure labels are at least 16px, scroll ends
   are reachable, and no page or option-text overflow was found. Correct sets,
   incomplete/extra selections, immediate single submission, failure/retry and
   refresh restoration passed. Five test-user answer rows were inspected and
   cleaned by the check; user 1 was never written.
4. AC4: before/after hashes confirm all original lesson-directory artifacts and
   database content/written exercises are unchanged. Resource audit, textbook
   validation, 4 content-DB tests, 130 app tests and production build passed.
   Choice tools: 39 tests passed, including the retained-path repair.
   Publisher preservation test passed.

Reproducible local evidence:

- `tmp/ac-check.mjs` and `tmp/ac-result.json`, plus per-question/per-figure screenshots.
- `tmp/preservation.mjs` and before/after hash records.
- Durable `choice-set/{seed,draft,review}.json` in each target lesson.

The first browser run's failure/retry interception matched the wrong endpoint.
The corrected localhost POST interception passed; prior test rows were cleaned.
The optional generic skill frontmatter validator could not run because its Python
environment lacks PyYAML. The changed contract/scripts passed their own 39 tests.

## Integration and Limits

New content uses `choiceSet`, not the purged legacy `choices` field. The currently
deployed older application will not expose this new payload before the new
application code is explicitly merged/deployed. No compatibility layer was added.

Graph recognition does not prove independent drawing. Candidate windows do not
show all extreme coordinate queries; complete algebraic queries retain those
values. The rectangle model question checks the positive physical domain without
an actual candidate plot. These capacity losses are explicit in the internal
coverage and review; original written tasks remain available.

No additional review pipeline, schema, design token, dependency or runtime
configuration change was introduced.

## Environment and Finish

- Preview: `http://localhost:52174`
- Lessons: `/card/alg6-c2-s3-n16?tab=choices`,
  `/card/alg6-c2-s3-n17?tab=choices`, `/card/alg6-c2-s3-n18?tab=choices`.
- No environment keys added, changed or removed.
- Branch: `codex/STEMROBIN-174-rebuild-choices`.
- Finish: review. Service remains running for human review.
  Not merged, closed or deployed.
