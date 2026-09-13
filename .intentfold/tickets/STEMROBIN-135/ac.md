# Acceptance Checks

## One authoritative route

Run the committed corpus validator. It must resolve every manifest PDF, TOC, durable artifact root
and active skill path without a missing or legacy default.

## Repository resource boundary

The top-level `resources/` and `app/public/` directories must be gone. Vite must serve the committed
runtime assets from `ssot-resources/public/`. A repository resource audit must reject product
resources outside `ssot-resources/`, persistent references to `.tmp/`, tracked page renders, grids,
offline HTML, scaffolding templates and page-level duplicate figures.

## Representative regeneration

Using the commands documented in `ssot-resources/soviet10year-textbooks/README.md`, regenerate and
validate one existing `6a` lesson from its committed PDF and page transcription data. Lesson,
exercise, figure, answer-key and interaction validation must pass.

## Publish compatibility and preservation

Run the three publishers for that lesson using `LEMMADECK_DATABASE_URL`, then query `sr_lessons`.
The target id must retain non-empty content and exercises with answer keys and interactions. Compare
the durable corpus inventory before and after migration; no committed final lesson, answer,
interaction or final figure may be lost. Confirm no schema or infrastructure file changed.

## Application compatibility

Run the application test and build commands. The build output must contain the public icons, manifest,
hero media and galaxy data from `ssot-resources/public/`, and the catalog must still load its TOCs.
