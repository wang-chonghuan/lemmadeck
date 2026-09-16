# Figure quality gate

Start with purpose: can a student use this figure with the edition question and
still be misled about the mathematical relationship?

## Deterministic checks

- source PNG hash is current
- all object ids and references resolve
- the independent source inventory resolves to visible objects; compare its
  completeness against source pixels, not against the already-generated object list
- every required mathematical relationship has an assertion
- every centrally symmetric object has complete opposite-point pairs whose
  midpoint is the declared center
- preserve shared frames: source elements that use one axis, grid, number line,
  or coordinate system remain in one deterministic frame even when they are
  labelled as separate subparts
- assertions pass within declared tolerance
- visible labels use English
- output hash matches render metadata
- render metadata names only the durable final output, never a preview or ticket-temp path
- every hybrid image reports centered contain fitting with preserved aspect ratio
- no label collision, clipping, missing point, or missing object
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

## Repair loop

Allow one targeted repair:

- wrong mathematics: repair FigureSpec coordinates or assertions
- overlap: repair label constraints or canvas composition
- wrong artwork: regenerate only the artwork

If the second result still defeats the instructional purpose, mark
`review.status` as `fail` and stop. Never hand-edit renderer output.
