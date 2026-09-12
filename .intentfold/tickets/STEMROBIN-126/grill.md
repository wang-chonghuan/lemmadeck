# STEMROBIN-126 Grill

## Sources reviewed

- Plane ticket `STEMROBIN-126`
- `.intentfold/charter/{product,engineering,ui,operations}.md`
- `.claude/skills/ld-s10y-lesson`
- `.claude/skills/ld-s10y-answer`
- `.agents/skills/ld-s10y-image`
- Current S10Y publisher and application lesson reader
- Obsolete generation guides, samples, active references, and the removal commit `ee8ad69`

## Shared understanding

The ticket removes obsolete math authoring routes and descriptions. The sole current math lesson
entry is `ld-s10y-lesson`, with modern figures delegated to `ld-s10y-image`, answers and interaction
specifications delegated to `ld-s10y-answer`, publication into `sr_lessons`, and product access
through `/card/:id`.

## Decisions

1. Delete the obsolete math generation guide and tracked `.codex/sr-math-lesson` samples.
2. Narrow the shared course-generation guide to physics so it no longer defines a parallel math
   authoring route; keep the physics guide operational.
3. Update active charter and agent-skill wording, and regenerate Evodocs from current source.
4. Preserve database tables and application code that still read historical card-tree, overlay, or
   ledger data. They are compatibility surfaces, not the current generation workflow.

## Rejected options

- Removing runtime card-tree, overlay, or ledger support in this ticket: rejected because it would
  require production-data analysis and migration beyond a generation-flow cleanup.
- Keeping the old math prompt guide as historical reference in an active resource directory:
  rejected because it remains discoverable as a competing current workflow.

## Open questions

None.

## Implementation constraints

- Do not change production data or schema.
- Do not remove current S10Y skills or `resources/s10y-lessons` products.
- Preserve frozen history directories and completed ticket artifacts.
- Evodocs changes go through the n-evodocs helper.

## Acceptance

Use the checks defined in `.intentfold/tickets/STEMROBIN-126/ac.md`.
