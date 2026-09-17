# Sources Reviewed

- Plane ticket `STEMROBIN-140`
- `.intentfold/charter/{product,engineering,ui,operations}.md`
- `ld-s10y-image` current FigureSpec, routing, rendering and quality-gate implementation
- `ld-s10y-lesson` edition validation, publishing and product-check implementation
- All 54 generated modern-edition lesson manifests and their actual prose/exercise figure references
- Live `sr_lessons` course IDs
- STEMROBIN-139 implementation and rework evidence

# Shared Understanding

- The migration target is derived from actual lesson prose figures, exercise display figures and
  `figure_refs`, not from a schema-version file search.
- The confirmed baseline is 171 referenced figures: 158 legacy figures in 34 lessons and 13 current
  figures already accepted under STEMROBIN-139.
- Five existing semantic-image figures do not need automatic regeneration. Their source images,
  generated assets and generation metadata may be reused when visual review confirms they remain
  faithful; their current FigureSpec/output/review contract must still be rebuilt.
- `math5-c1-s1-n3` exercise 39 legitimately reuses `fig-05`; its lesson manifest must reference the
  same durable book-level asset instead of duplicating the asset or deleting the exercise reference.
- The durable regression protection is executable inventory/validation code plus tests. Raw run
  reports and contact sheets remain disposable evidence under `.tmp/`; final counts and exceptions
  are recorded in `handoff.md`.

# Decisions

1. Reuse existing hybrid/generated semantic assets and generation metadata when they pass source
   comparison. Regenerate only a failed semantic asset.
2. Add `fig-05` to the fifth-grade lesson 3 manifest as a shared reference to the existing global
   figure.
3. Commit the reference-derived auditor and regression tests, but do not commit a static corpus
   inventory snapshot.
4. No image-model call is planned. If a failed semantic asset requires regeneration, keep cumulative
   model cost within the Charter boundary and stop for approval before any possible spend above $5.

# Rejected Options

- Force-regenerating all semantic artwork: adds cost and visual variance without improving assets
  that already have valid source-bound generation records.
- Copying `fig-05` into a lesson-specific asset: creates two sources for one printed-book figure.
- Committing a generated migration report as SSOT: it would drift from the lesson manifests; the
  executable auditor is the maintained truth.

# Implementation Constraints

- Old specs are geometry references only. Every current spec still needs an independently checked
  source inventory and current assertions.
- No answer key may be used to construct a figure.
- Only the 21 already-published affected lessons may be republished.
- Product resources remain under `ssot-resources/`; previews and generated evidence remain under
  `.tmp/`.
- No dependency, schema, token-registry, cloud-runtime or deployment change is authorized.

# Remaining Open Questions

None.
