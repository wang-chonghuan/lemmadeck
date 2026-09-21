# Handoff

## What changed

- Preserved legacy exercise display semantics across runtime projection, rendering, publishing,
  and product checks: an absent source-number field falls back to the stable exercise number, while
  an explicit null remains blank.
- Added `lesson-group` exercise identity with stable `number`, faithful `source_number`, display
  `group`, and stable `group_id`. Repeated printed numbers are qualified only after their first
  cross-group occurrence, and ambiguous figure ownership is rejected.
- Unified lesson ordering across assembly, publication, navigation, and the catalog. Sections with
  numbered topics remain structural; sections with only unnumbered topics publish the main lesson
  first and then its supplemental cards.
- Made answer capture resolve shared PDFs through the source manifest and validate/match
  lesson-group answers by stable exercise identity plus source evidence.
- Updated the lesson/answer skill contracts and added focused Python, JavaScript, and Vitest
  regressions.

## AC results

1. **Legacy display numbers: passed.**
   - The app suite passed 87 tests, including missing-versus-null source-number projection and
     publisher fallback coverage.
   - Headed Chromium checks passed at 1440x960 and 390x844 on
     `math5-c1-s1-n1?tab=ex&exercise=14`,
     `alg6-c1-s1-n1?tab=ex&exercise=10`, and
     `phy6-c1-s6?tab=ex&exercise=q1`.
   - Both legacy math cards showed non-empty printed numbers. Physics exercise `q1` showed no
     invented number. Each deep link marked the requested article as the target, and its keyboard
     button focused the controlled MathLive input while the virtual keyboard was open.
   - Reproducible browser script and eight screenshots:
     `.intentfold/tickets/STEMROBIN-145/tmp/ac-check.mjs` and
     `.intentfold/tickets/STEMROBIN-145/tmp/acceptance/`.

2. **Repeated physics numbering: passed.**
   - The lesson-tool suite passed 58 tests. The page-20 regression produced question identities
     `1`, `2`, `3`, exercise identities `g2-1`, `g2-2`, and unnumbered identity `q1`, preserving
     printed numbers and groups.
   - Negative cases rejected duplicate and missing numbers inside a group and rejected ambiguous
     `owner-ex 1`; the group-qualified `owner-ex g2-1` resolved correctly.
   - A real 6p assembly in ticket scratch produced six stable lesson IDs, 13 exercises,
     `exercise_numbering: lesson-group`, and zero audit errors.

3. **Main lessons and supplemental reading: passed.**
   - Assembly, publication-order, runtime catalog, and navigation regressions place all eight
     affected 6p parent lessons before their supplemental cards while keeping numbered math
     sections structural.
   - At both browser viewports, the 6p catalog showed
     `2.4 气体、液体及固体中的扩散现象` and `布朗运动` as separate rows in one disclosure.
     Both currently unpublished rows remained disabled.

4. **Shared source and answer identity: passed.**
   - The 13-test answer suite confirmed `6p` and `7p` both resolve the manifest-declared
     `6-7p` PDF and use `lesson-group` numbering.
   - Repeated-number and unnumbered sample answers matched the intended stable exercises and
     rejected mismatched group evidence.
   - Re-finalizing the committed `5m` and `6a` captures passed and left no durable diff.
   - Mechanical defense passed:
     `python3 ssot-resources/audit.py`;
     `python3 ssot-resources/soviet10year-textbooks/validate.py`
     (16 PDFs, 17 catalog volumes, 510 lessons, 407 figure records);
     `cd app && npm run test && npm run build`.

## Deviations

No scope deviation. During final review, answer ordering was tightened to use natural numeric order
for string labels/group IDs, and legacy book-scoped audit output was kept byte-stable so re-finalizing
existing captures does not create metadata-only changes.

## Environment

- Local app: `http://localhost:52145`
- Environment keys added, changed, or removed: none
- No database writes, schema changes, dependency changes, publication, deployment, merge, or ticket
  closure were performed.

## Residual

- The ten-book production run is not part of this fix. The exact book list, image budget, concurrency
  limit, and rollout/publishing decision still require a separate decision and delivery plan.
- The repaired 6p catalog rows remain unpublished until later content generation and publication.
