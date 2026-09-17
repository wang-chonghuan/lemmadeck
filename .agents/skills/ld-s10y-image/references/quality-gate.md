# Figure quality gate

Start with purpose: can a student use this figure with the edition question and
still be misled about the mathematical relationship?

## Deterministic checks

- source PNG hash is current
- all object ids and references resolve
- the independent source inventory resolves to visible objects; compare its
  completeness against source pixels, not against the already-generated object list
- every source inventory assertion ID resolves
- every required mathematical relationship has an assertion
- every centrally symmetric object has complete opposite-point pairs whose
  midpoint is the declared center
- every set-relation member point and member label has an `inside` assertion;
  omission is a validation failure, and the rendered footprint has clear
  space from the set boundary
- every semantic arrow or edge has a `connects` assertion
- preserve shared frames: source elements that use one axis, grid, number line,
  or coordinate system remain in one deterministic frame even when they are
  labelled as separate subparts
- preserve every instructional grid row, column, offset, and road/cell gap;
  a blank frame is not a valid substitute for a source lattice
- assertions pass within declared tolerance
- visible labels use English
- output hash matches render metadata
- render metadata names only the durable final output, never a preview or ticket-temp path
- every hybrid image reports centered contain fitting with preserved aspect ratio
- no label collision, clipping, missing point, or missing object
- text is at least 16 px at every declared product width
- SVG colors are semantic CSS variables and remain legible in neutral, accent,
  and print themes
- finite geometry fits the canvas, including empty table cells and border lines;
  a label-only pass is insufficient

## Visual checks

- compare the full edition text, original PNG, and rendered output together
- verify counts, signs, units, relative positions, equal intervals, and labels
- verify half-unit scales, every subfigure, every chord endpoint, every table
  column and every directed self-loop. When repairing given data, also repair
  dependent answer keys through `ld-s10y-answer`.
- verify no answer is revealed
- verify no cultural text or symbols leaked from the source
- inspect at full resolution and at normal app width
- reject black or visually broken raster rendering
- for hybrid output, inspect the artwork and SVG overlay as separate layers as
  well as together; reject alignment that only works in a flattened preview

## Review evidence

The review lives in a separate `ld-s10y-image/review@1` file. It must record
`status: pass` and hashes for the source image, current FigureSpec, render or
generation evidence, and every durable output. A spec, render, generation, or
output change invalidates the review.

## Repair loop

Allow one targeted repair:

- wrong mathematics: repair FigureSpec coordinates or assertions
- overlap: repair label constraints or canvas composition
- wrong artwork: regenerate only the artwork

If the second result still defeats the instructional purpose, mark
the review evidence as `fail` and stop. Never hand-edit renderer output.
