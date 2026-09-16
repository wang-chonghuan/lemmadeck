# Agreed Approach

- Keep one independent `ld-s10y-image` skill. `ld-s10y-lesson` continues to extract, assemble, and publish lessons while delegating every modern figure to the image skill.
- Use deterministic vector geometry for mathematical facts and labels. Use generated raster artwork only for semantic objects or scenes, with the vector layer retained separately above it.
- Replace literal figure colors with semantic roles. The default is neutral ink, while accent and print treatments are selected at render or display time without regenerating mathematical geometry.
- Make source inventory and semantic assertions the release contract. Object counts may remain diagnostic but cannot establish completeness or mathematical correctness.
- Check readable size at the actual lesson display dimensions, not only in the source SVG coordinate system.
- Delete superseded rules and implementation branches after migration instead of preserving a legacy or fallback pipeline.

# Decisions From The Discussion

- The variety of textbook figures is handled by routing figure families through one skill, not by forcing every figure through one renderer.
- Direct image generation is not trusted for coordinates, quantities, relationships, labels, grids, or measurements.
- The current JSXGraph-based deterministic path remains the primary implementation because it is already integrated and can provide exact, testable output. This ticket does not add another plotting dependency.
- The known Figure 34 defects are treated as a regression fixture, while lesson 8 and 9 figures and selected existing figure families provide real-output coverage.
- The work is stacked on the delivered `STEMROBIN-138` head so its lesson 8 and 9 artifacts are available. This does not modify, merge, or close ticket 138.

# Ruled Out

- A second image skill with overlapping ownership.
- Asking an image model to redraw exact mathematical diagrams end to end.
- Keeping flattened hybrid PNG as the only durable output.
- Treating `objectCount` or a manually retained `review.status: pass` as sufficient promotion evidence.
- Adding a broad new math-diagram library before the existing renderer has been made semantically verifiable.

# Premises Checked

- `.agents/skills/ld-s10y-image/` already owns a FigureSpec schema, validator, JSXGraph renderer, routing guidance, generation guidance, and quality gates.
- The current corpus contains 171 specs: 165 deterministic, 5 hybrid, and 1 generated. Most specs rely only on object-count assertions, so stronger checks must be opt-in for migrated figures rather than pretending the untouched corpus is already verified.
- Figure 34 places top member points beyond the visible set boundary, uses labels that shrink below the required product size, hard-codes teal/green, and declares only count assertions.
- The current hybrid renderer composites artwork into a PNG, preventing independent recoloring of the mathematical overlay.
- `STEMROBIN-138` is pushed at `ffda837b67da76c0e9671f61988271937acb0864` and contains the required lesson 8 and 9 artifacts.
