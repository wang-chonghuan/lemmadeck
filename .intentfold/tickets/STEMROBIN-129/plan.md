# Plan

## Observed

- The affected lesson is `alg6-c1-s1-n2`, exercise 21, figure `fig-03`.
- `fig-03.spec.json` already describes a complete 8 by 8 board: 32 shaded squares, 18 grid segments, and 16 row/column labels. Its standalone render is complete.
- Every deterministic figure currently renders through a hard-coded JSXGraph board id of `board`. The exported inline SVGs therefore repeat ids such as `board_ClipFull`.
- In this lesson, 320px-high table figures appear before the 800px-high chessboard. When the SVGs are inlined into one document, the chessboard's `clip-path` can resolve to the first table's 320px clip path, hiding the lower rows.
- The publisher already preserves existing answer keys and interaction metadata when a lesson is republished.

## Route

1. Namespace every renderer-owned DOM/SVG id with the FigureSpec id so separately inlined figures cannot share clip paths, filters, geometry ids, or renderer-added layer ids.
2. Add a renderer regression test that renders two different figures and asserts their SVG id sets and clip-path references do not collide.
3. Rerender and promote only `fig-03`, then rerun the modern-edition lesson validation and offline render for `alg6-c1-s1-n2`.
4. Republish only `alg6-c1-s1-n2` through the lesson publisher, preserving its existing answer key and interaction data.
5. Run the ticket service on port 52129 and verify exercise 21 at desktop and mobile viewports.

## Redline Lookup

- No dependency, token registry, schema, generated route file, or original extraction-layer change is required.
- The content write uses the existing publisher and `LEMMADECK_DATABASE_URL`; no raw database write is used.
