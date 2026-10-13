# Acceptance Checks

## AC1: Reasoned Questions for Three Lessons

Use only the rewritten skill's whitelist seeds. Record independent source solutions,
response-unit reasons and task coverage. Check every visible question for substantive
mathematical judgment, suitable native single/multiple mode, redundancy and source-label
leakage. Keep the accepted offline seed, draft and review under product resources.

Pass: lessons 16, 17 and 18 have reviewed new decks, not answer-slot conversions.

## AC2: Independent Mathematics and Images

A separate reviewer solves the seed and opens its images first, solves visible options
without the author's key, then compares all author rationales. Record exact correct sets,
every option's truth, concrete evidence, image hashes and any production losses. Run
the skill's snapshot/structure checker with the completed reviews.

Pass: all three reviews pass, each option is checked, actual figures are fully readable,
and no unresolved essential defect remains.

## AC3: Working Practice

Run one ticket-scoped headed Playwright check at desktop and mobile viewports from
operations.md against the recorded local port. Assert all three decks render without
page overflow or missing figures. Exercise single-click submission and multi-select
explicit submission, exact-set judging, wrong/incomplete selections, saved user/question/
selection/correctness records and restoration after reload. Use only test user 2 and
clean up the check's records. Check public question payloads exclude author keys.

Pass: native single and multiple practice works, saving/restoration succeeds, answer keys
are absent before submission, and screenshots show a normal readable exercise list.

## AC4: Preservation and Checks

Hash original lesson, written exercise and answer artifacts before/after; compare stored
lesson content and written exercises excluding the new choice metadata. Run the project's
mechanical defence at handoff. If skill defects are revealed, apply only the necessary
repair and rerun the affected experiment.

Pass: original materials are unchanged; required checks pass; any skill repairs have
specific failure and successful rerun evidence.
