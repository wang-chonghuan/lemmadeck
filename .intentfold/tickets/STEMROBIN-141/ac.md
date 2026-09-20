# Acceptance Check

## Criterion 1: Complete Lesson Boundaries

Start the ticket service and navigate from the catalog to both target lessons. Confirm their titles and order. Compare the rendered lesson and exercise lists with the finalized source objects and require:

- lesson 10 contains the complete printed-page 50-52 material and exercises 201-213;
- lesson 11 contains the complete printed-page 53-59 material and exercises 214-230;
- neither lesson contains lesson 12 material;
- all referenced figures are present exactly where their prose or exercise requires them.

Pass only when the browser and durable artifacts agree on both lesson boundaries and exercise counts.

## Criterion 2: Readable And Faithful Figures

At desktop `1440x960` and mobile `390x844`, inspect every text and exercise figure in both lessons. Require all source-inventoried points, curves, axes, ticks, labels, panels, tables, endpoints, and relationships to be present and mathematically consistent with the source.

Use the current figure validator and render reports to require at least 16px final text at every declared product width, no clipping or collision, semantic colour roles, and readable monochrome output. Save screenshots for both lessons and both viewports.

## Criterion 3: Answers And Interactions

For every exercise, verify a finalized answer key and interaction specification exist. In the browser, exercise every answer input:

- open its mathematical keyboard;
- insert content into the intended input;
- submit representative numeric, expression, and ungraded questions;
- confirm grading or the explicit non-grading result and displayed answer match the verified question and figure.

Pass only when no answer input lacks keyboard access and the database content matches the finalized artifacts.

## Criterion 4: Publication And Download

Run the current lesson, image, answer, interaction, and publication validators for both lesson IDs. Query the live content database and require both edition rows, answer keys, interactions, source hashes, and lesson ordering to match the durable artifacts.

Download each lesson through the browser and inspect the resulting document. Require both lesson text and all exercises, including every referenced image or table, to be present and readable.

If this run changes pipeline or skill code, reproduce the original failing sample and require the corrected path to pass before the full criterion check.
