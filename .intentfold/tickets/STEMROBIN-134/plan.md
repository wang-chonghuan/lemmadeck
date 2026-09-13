# STEMROBIN-134 Plan

## Existing Surface

- `ld-s10y-lesson` owns page extraction, assembly, modern-edition validation,
  offline rendering, and publication for this textbook.
- `ld-s10y-image` owns deterministic modern figures.
- `ld-s10y-answer` owns answer keys, review, interaction specifications, and
  their publication.
- The app catalog and card route already render database-backed lessons; no app
  UI or schema change is required.
- The current generator assumed a single repeated `--lesson` argument and
  treated all text inside LaTeX `\text{...}` as immutable formula structure.

## Route

1. Assemble the Chapter 5 source pages into lesson and exercise artifacts.
2. Produce the modern edition, deterministic figures, answer keys, and
   interaction specifications through the named skills.
3. Repair the two generator defects exposed by this batch and add focused
   regression coverage.
4. Publish through the existing content publishers and reconcile source,
   edition, answer, interaction, and database counts.
5. Verify every Chapter 5 card in the running product at both required
   viewports, record measured model usage and elapsed time, then hand off for
   merge and routine redeploy.
