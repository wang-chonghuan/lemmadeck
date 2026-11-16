# First Wrapper Failure

The initial wrapper exited 1 before invoking assemble. Actual assertion:
`.tmp/ld-s10y-lesson/9-10g/pages/0009/figures/fig-01.svg`
at `assemble-9g-through55-once.mjs:58:7`.

All four new vectorize commands had already exited 0, with mismatch ratios
0.006%, 0.030%, 0.010%, and 0.015%. Their complete command/stdout/stderr records
remain in operations. No source/index promotion, adapt-prepare or trace rebind
had occurred. The original wrapper is retained alongside this record.

The affected copy rule now preserves the established optional legacy scratch
SVG behavior, while requiring every source PNG. Explicit resume verifies and
reuses the four existing successful vectorizations; it does not invoke them
again. Assemble itself has not yet run.
