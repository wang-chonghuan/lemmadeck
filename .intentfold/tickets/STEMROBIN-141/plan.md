# Plan

## Observed

- `alg6-c2-s1-n10` currently contains only the first paragraph carried in by physical page 56; it has no edition, answers, interactions, or published row.
- `alg6-c2-s1-n11` has no extracted lesson or edition artifacts and no published row.
- The source boundary is physical pages 56-65: lesson 10 occupies printed pages 50-52, lesson 11 occupies printed pages 53-59, and lesson 12 starts on physical page 66 / printed page 60.
- Lesson 10 contains exercises 201-213 and figures 41-42. Lesson 11 contains exercises 214-230, figures 43-57, and exercise tables.
- The captured answer appendix covers only some exercises in this range. Missing answers must be derived from the edition question and its verified figure.
- The live content database is reachable through `LEMMADECK_DATABASE_URL` and currently has no rows for either target lesson.
- The current image pipeline is `figure-spec@2` with source inventory, product-width text checks, semantic colour roles, and hash-bound review evidence. No parallel legacy figure path is needed.
- No application or pipeline defect has yet been established. Code or skill changes are conditional on an observed failure during this run.

## Route

1. Bootstrap the existing locked lesson, image, and app dependencies without changing dependency declarations.
2. Prepare, transcribe, and finalize physical pages 57-66, retaining page 56 as the already-finalized left boundary and page 66 only to close lesson 11 at the next heading.
3. Assemble the book with the authoritative TOC and confirm the two target lessons own exactly their complete prose, exercises, and source-image references.
4. Produce the `modern-us-neutral` editions for only the two target lessons. Reflow prose into short semantic paragraphs and preserve all mathematical conditions and source provenance.
5. Inventory every referenced source figure independently, route it through the current image skill, render deterministic mathematics and any necessary layered semantic artwork, then record current review evidence.
6. Render the two lesson previews and inspect the complete text and exercise surfaces before promotion.
7. Produce and finalize answer keys, deriving missing answers from the verified questions and figures, then produce interaction specifications for every exercise.
8. Publish the two lessons, answers, and interactions through their existing publishers to the live content database.
9. Start the application on the ticket port and run one ticket-scoped browser check covering both lessons at desktop and mobile widths, including catalog access, figures, keyboard input, grading, and combined PDF download.
10. If an actual pipeline or rendering defect blocks a criterion, repair its owning code or skill, remove the superseded rule, and verify the same failure sample before continuing.
11. Run the repository's required mechanical defence, commit all durable resources and ticket artifacts, push the branch, and prepare the review handoff with the service left running.

## Expected Durable Changes

- Page transcriptions and audits for the newly processed source pages.
- Complete original lesson and exercise objects for both target lessons.
- Modern lesson, exercise, figure, answer, interaction, and audit artifacts for both target lessons.
- Current FigureSpec, render, and review files for all figures used by the two lessons.
- Pipeline or skill changes only where this run demonstrates a defect.
- IntentFold delivery artifacts for `STEMROBIN-141`.

## Excluded

- Publishing lesson 12 or any other boundary-page content.
- Changing the database schema, application dependencies, design tokens, deployment configuration, or production infrastructure.
- Reworking unrelated existing lessons or figures.
