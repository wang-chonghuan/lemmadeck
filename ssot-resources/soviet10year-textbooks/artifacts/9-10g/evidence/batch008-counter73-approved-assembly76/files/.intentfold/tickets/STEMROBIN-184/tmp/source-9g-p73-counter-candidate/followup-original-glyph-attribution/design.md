# Original Versus Residual Glyph Attribution

This additive followup starts at exact candidate v3, SHA97b320b0. Production eb6
and report534 stay frozen; all prior v1-v3 files/failures stay unchanged.
Only the downstream original-component attribution correction is authorized.

The actual source fraction control at line_h38 remains True. Mirrored genuine
arrow/body controls remain False. No threshold enlargement, row override,
exclusion, source/review edit, finalize, prepare or image display is permitted.

## Facts And Design

At38 the surviving23px arrow components become full-glyph support after the
fraction columns are removed. One clipped arrow no longer satisfies the arrow
predicate on its residual shape. At39 those same components fall below the
existing lower glyph-height bound. The source row is unchanged at both scales.

Retain original component labels before erasure, then map each residual glyph
back to its original component. Only original arrow decoration, independently
identified as a narrow shaft with a terminal head and no attached full body,
may be omitted from full-glyph attribution. Do not delete residual pixels or
classify/declassify glyphs from the residual arrow predicate alone.

Inspect original source components and shaft/body geometry before implementing
that distinction. Preserve original body-connected glyphs, full hollow/H/body
boxes and adjacent independently supported vector-prose/full-glyph rows.

## Tests And Comparison

Copy the19 approved v3 methods verbatim; adjust harness paths only, leaving
assertions and fixtures unchanged. Add focused attribution controls from the
source array and independently constructed arrow/body/full-glyph geometry.
Retain every first followup failure; do not weaken expectations.

One final read-only68-75 comparison records exact bands for production baseline,
v3 and the followup. It verifies this shared behavior change, not another source
review or finalize. No automatic promotion.
