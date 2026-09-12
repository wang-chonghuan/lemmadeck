# Grill

## Sources Reviewed

- Plane ticket `STEMROBIN-129` and its attached reproduction screenshot.
- `.intentfold/` Charter.
- `ld-s10y-image` and `ld-s10y-lesson` skill contracts.
- `alg6-c1-s1-n2` exercise 21, its FigureSpec, rendered SVG, publisher, and app figure rendering.
- The current database copy of the lesson.

## Shared Understanding

The human explicitly requested a fix for an incomplete chessboard. The existing FigureSpec and standalone render already define the intended visual result: the same green-and-white 8 by 8 board with labels `a` through `h` and `1` through `8`. This is a rendering integrity repair, not a visual redesign.

## Decisions

- Keep the existing board geometry, colors, labels, and exercise behavior.
- Repair the shared deterministic renderer so every exported inline SVG has figure-scoped ids.
- Regenerate and republish only the affected figure and lesson.
- Preserve existing answer keys and interaction specifications.

## Rejected Options

- Hand-editing the generated SVG: rejected because the figure skill requires FigureSpec-driven output.
- Adding lesson-specific CSS or clipping overrides: rejected because the defect comes from duplicate SVG ids and would recur in future figures.
- Regenerating every existing figure: rejected as unnecessary scope for this fix.

## Open Questions

None. The requested visual outcome and the existing FigureSpec settle the only UI decision.
